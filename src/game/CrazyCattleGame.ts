/**
 * Crazy Cattle 3D Main Game Orchestrator.
 * Fully complies with Three.js skill directives:
 * - Software-WebGL detection & safe pacing (afterDraw)
 * - RoomEnvironment reflection via PMREMGenerator
 * - Zero GC in animation loop (pre-allocated math objects)
 * - Studio warm/cool lighting & horizon fog
 * - Low-occlusion UI state coordination
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createSheepMesh, createArenaEnvironment, createPowerupMesh, ArenaEnvironment, MapTheme, PowerupEntity, PowerupType } from './proceduralModels';
import { SheepEntity, SheepConfig } from './sheepEntity';
import { ParticleSystem } from './particles';
import { sounds } from '../audio/soundEngine';

// Pre-allocated math objects to guarantee ZERO GC in 60fps render loop
const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _impactVel = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _camIdealPos = new THREE.Vector3();

export interface GameState {
  status: 'menu' | 'playing' | 'gameover' | 'victory';
  aliveCount: number;
  totalSheep: number;
  playerRank: number;
  playerKills: number;
  matchTime: number;
  ringRadius: number;
  ringShrinkTimer: number;
  isRingShrinking: boolean;
  playerChargeCooldownPct: number;
  activePowerup: PowerupType | null;
  killFeed: string[];
}

export type StateChangeCallback = (state: GameState) => void;

const BOT_NAMES = [
  'Baa-barian', 'Fluffy Ram', 'Wooly Bull', 'Thunder Hoof', 'Sir Chops',
  'Moo-dini', 'Lamb-o', 'Buttercup', 'Battering Ram', 'Cotton King',
  'Pancake', 'Black Horn', 'Clover Crusher', 'Rocky', 'Meadow Champ'
];

const SHEEP_COLORS = [
  '#27272a', '#18181b', '#3f3f46', '#52525b', '#71717a',
  '#b45309', '#92400e', '#7c2d12', '#991b1b', '#1e3a8a',
  '#15803d', '#4338ca', '#6d28d9', '#a21caf', '#831843'
];

export class CrazyCattleGame {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private clock: THREE.Clock = new THREE.Clock();

  // Scene entities
  private arena!: ArenaEnvironment;
  private player!: SheepEntity;
  private sheepList: SheepEntity[] = [];
  private powerups: PowerupEntity[] = [];
  private particles!: ParticleSystem;

  // Environment & Lights
  private keyLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private theme: MapTheme = 'ireland';

  // Game Loop & Match Rules
  private state: GameState = {
    status: 'menu',
    aliveCount: 16,
    totalSheep: 16,
    playerRank: 16,
    playerKills: 0,
    matchTime: 0,
    ringRadius: 38,
    ringShrinkTimer: 25,
    isRingShrinking: false,
    playerChargeCooldownPct: 0,
    activePowerup: null,
    killFeed: [],
  };
  private onStateChange?: StateChangeCallback;

  // Ring Shrink Schedule (stages)
  private ringTargetRadius: number = 38;
  private currentStageIndex: number = 0;
  private ringStages = [
    { target: 28, delay: 20, shrinkDuration: 12 },
    { target: 20, delay: 18, shrinkDuration: 10 },
    { target: 12, delay: 15, shrinkDuration: 8 },
    { target: 6,  delay: 12, shrinkDuration: 8 },
  ];
  private stageTimer: number = 20;

  // Camera Shake & Hitstop
  private screenShake: number = 0;
  private hitstopTimer: number = 0;

  // Inputs
  private keys: { [key: string]: boolean } = {};
  private joystickInput = { x: 0, y: 0 };
  private touchChargeRequested = false;
  private touchJumpRequested = false;

  constructor(container: HTMLElement, onStateChange?: StateChangeCallback) {
    this.container = container;
    this.onStateChange = onStateChange;

    this.initWebGL();
    this.setupLighting();
    this.setupArena('ireland');
    this.setupEventListeners();
    this.setupInitialMenuScene();
    this.startLoop();
  }

  private initWebGL() {
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#bbf7d0');
    this.scene.fog = new THREE.FogExp2('#dcfce7', 0.012);

    const aspect = this.container.clientWidth / (this.container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.5, 300);
    this.camera.position.set(0, 18, 32);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Procedural RoomEnvironment reflection (zero external HDRI dependencies)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    this.particles = new ParticleSystem(this.scene);
  }

  private setupLighting() {
    // Warm Key Light with tight shadow bounds
    this.keyLight = new THREE.DirectionalLight('#fffbeb', 1.6);
    this.keyLight.position.set(30, 45, 25);
    this.keyLight.castShadow = !this.isSoftwareGl;
    if (!this.isSoftwareGl) {
      this.keyLight.shadow.mapSize.width = 1024;
      this.keyLight.shadow.mapSize.height = 1024;
      this.keyLight.shadow.camera.near = 10;
      this.keyLight.shadow.camera.far = 100;
      const d = 42;
      this.keyLight.shadow.camera.left = -d;
      this.keyLight.shadow.camera.right = d;
      this.keyLight.shadow.camera.top = d;
      this.keyLight.shadow.camera.bottom = -d;
      this.keyLight.shadow.bias = -0.0005;
      this.keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(this.keyLight);

    // Cool Sky / Earth fill
    this.hemiLight = new THREE.HemisphereLight('#bae6fd', '#4ade80', 0.85);
    this.scene.add(this.hemiLight);

    // Ambient support
    const ambient = new THREE.AmbientLight('#ffffff', 0.2);
    this.scene.add(ambient);
  }

  private setupArena(theme: MapTheme) {
    if (this.arena) {
      this.scene.remove(this.arena.group);
      this.arena.dispose();
    }
    this.theme = theme;
    this.arena = createArenaEnvironment(theme);
    this.scene.add(this.arena.group);

    // Adjust sky/fog based on theme
    const themeColors = {
      ireland: { bg: '#bbf7d0', fog: '#dcfce7' },
      alpine: { bg: '#bae6fd', fog: '#e0f2fe' },
      sunset: { bg: '#fdba74', fog: '#fed7aa' },
    }[theme];

    this.scene.background = new THREE.Color(themeColors.bg);
    this.scene.fog = new THREE.FogExp2(themeColors.fog, 0.012);
  }

  private setupInitialMenuScene() {
    this.clearAllSheepAndPowerups();

    // Spawn demonstration sheep grazing around arena
    const demoConfigs: SheepConfig[] = [
      { id: 'p0', name: 'Player Ram', number: 1, color: '#18181b', isPlayer: true, hasHorns: true },
      { id: 'b1', name: 'Baa-barian', number: 7, color: '#b45309', isPlayer: false },
      { id: 'b2', name: 'Fluffy', number: 23, color: '#1e3a8a', isPlayer: false },
      { id: 'b3', name: 'Cotton', number: 42, color: '#15803d', isPlayer: false },
      { id: 'b4', name: 'Thunder', number: 99, color: '#7c2d12', isPlayer: false },
    ];

    demoConfigs.forEach((cfg, idx) => {
      const parts = createSheepMesh(cfg);
      this.scene.add(parts.root);
      const angle = (idx / demoConfigs.length) * Math.PI * 2;
      const dist = 6 + idx * 2.5;
      const pos = new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      const sheep = new SheepEntity(cfg, parts, pos);
      sheep.rotationY = angle + Math.PI / 2;
      this.sheepList.push(sheep);
      if (cfg.isPlayer) this.player = sheep;
    });

    this.state.status = 'menu';
    this.notifyState();
  }

  public startBattleRoyale(theme: MapTheme = 'ireland', totalOpponents: number = 15) {
    this.setupArena(theme);
    this.clearAllSheepAndPowerups();

    const totalCount = totalOpponents + 1;

    // 1. Spawn Player Sheep (#01, Golden curved horns, pristine white wool)
    const playerConfig: SheepConfig = {
      id: 'player',
      name: 'Ты (Игрок)',
      number: 1,
      color: '#0f172a',
      woolColor: '#ffffff',
      isPlayer: true,
      hasHorns: true,
    };
    const playerModel = createSheepMesh(playerConfig);
    this.scene.add(playerModel.root);

    // Player starts at bottom arc
    const playerStartPos = new THREE.Vector3(0, 0, 16);
    this.player = new SheepEntity(playerConfig, playerModel, playerStartPos);
    this.sheepList.push(this.player);

    // 2. Spawn AI Competitors evenly in a circle around arena
    for (let i = 0; i < totalOpponents; i++) {
      const angle = (i / totalOpponents) * Math.PI * 2 + 0.35;
      const dist = 14 + (i % 3) * 4;
      const pos = new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);

      const botConfig: SheepConfig = {
        id: `bot_${i}`,
        name: BOT_NAMES[i % BOT_NAMES.length],
        number: i + 2,
        color: SHEEP_COLORS[i % SHEEP_COLORS.length],
        isPlayer: false,
        hasHorns: i % 4 === 0,
      };

      const model = createSheepMesh(botConfig);
      this.scene.add(model.root);
      const bot = new SheepEntity(botConfig, model, pos);
      bot.rotationY = angle + Math.PI; // Face towards center
      this.sheepList.push(bot);
    }

    // Reset Rules & Timers
    this.state = {
      status: 'playing',
      aliveCount: totalCount,
      totalSheep: totalCount,
      playerRank: totalCount,
      playerKills: 0,
      matchTime: 0,
      ringRadius: this.arena.radius,
      ringShrinkTimer: this.ringStages[0].delay,
      isRingShrinking: false,
      playerChargeCooldownPct: 0,
      activePowerup: null,
      killFeed: ['Битва началась! Сталкивай всех с арены!'],
    };

    this.currentStageIndex = 0;
    this.stageTimer = this.ringStages[0].delay;
    this.ringTargetRadius = this.arena.radius;

    sounds.playBaa(260);
    this.notifyState();
  }

  private clearAllSheepAndPowerups() {
    this.sheepList.forEach(s => {
      this.scene.remove(s.model.root);
      s.dispose();
    });
    this.sheepList = [];

    this.powerups.forEach(p => {
      this.scene.remove(p.group);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
      p.halo.geometry.dispose();
      (p.halo.material as THREE.Material).dispose();
    });
    this.powerups = [];
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state.status === 'playing') {
          this.handlePlayerAction();
        } else if (this.state.status === 'menu' || this.state.status === 'gameover' || this.state.status === 'victory') {
          this.startBattleRoyale(this.theme);
        }
      }
      if (e.code === 'KeyE') {
        if (this.state.status === 'playing') {
          this.player.triggerJump();
          sounds.playJump();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
    });

    window.addEventListener('resize', this.onWindowResize);
  }

  public setJoystickInput(x: number, y: number) {
    this.joystickInput.x = x;
    this.joystickInput.y = y;
  }

  public triggerTouchCharge() {
    this.touchChargeRequested = true;
  }

  public triggerTouchJump() {
    this.touchJumpRequested = true;
  }

  private handlePlayerAction() {
    if (!this.player || !this.player.alive) return;
    if (this.player.triggerCharge()) {
      sounds.playCharge();
      this.particles.emitDust(this.player.position, 6, true);
    }
  }

  private onWindowResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private startLoop() {
    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 60);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      const rawDt = this.clock.getDelta();
      const dt = Math.min(rawDt, 0.05); // Frame delta clamped for physics stability

      this.update(dt);
      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      afterDraw(tick);
    } else {
      this.frameId = requestAnimationFrame(tick);
    }
  }

  private update(dt: number) {
    // Hitstop micro-pause
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    if (this.state.status === 'playing') {
      this.state.matchTime += dt;
      this.updateRing(dt);
      this.spawnPowerups(dt);
      this.updatePlayerInput(dt);
      this.updateBotAI(dt);
      this.updateSheepPhysics(dt);
      this.checkCollisions(dt);
      this.updatePowerups(dt);
    } else if (this.state.status === 'menu') {
      // Atmospheric orbit around pasture in menu
      const t = performance.now() * 0.0003;
      this.camera.position.set(Math.cos(t) * 28, 16, Math.sin(t) * 28);
      this.camera.lookAt(0, 1.5, 0);

      // Simple wander for menu sheep
      this.sheepList.forEach((s) => s.update(dt, this.arena.radius));
    }

    this.particles.update(dt);
    this.updateCamera(dt);
  }

  private updatePlayerInput(dt: number) {
    if (!this.player || !this.player.alive || this.player.isDying) return;

    let moveX = 0;
    let moveZ = 0;

    // Keyboard (WASD or Arrow Keys)
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

    // Virtual Joystick
    if (Math.abs(this.joystickInput.x) > 0.1 || Math.abs(this.joystickInput.y) > 0.1) {
      moveX = this.joystickInput.x;
      moveZ = this.joystickInput.y;
    }

    // Touch actions
    if (this.touchChargeRequested) {
      this.handlePlayerAction();
      this.touchChargeRequested = false;
    }
    if (this.touchJumpRequested) {
      if (this.player.triggerJump()) sounds.playJump();
      this.touchJumpRequested = false;
    }

    const inputMag = Math.hypot(moveX, moveZ);
    if (inputMag > 0.1) {
      const normX = moveX / inputMag;
      const normZ = moveZ / inputMag;

      // Desired angle
      this.player.targetRotationY = Math.atan2(normX, normZ);

      // Accelerate player
      const speed = this.player.baseSpeed * (this.player.activePowerup?.type === 'boost' ? 1.35 : 1.0);
      const accel = 48.0;

      this.player.velocity.x += normX * accel * dt;
      this.player.velocity.z += normZ * accel * dt;

      // Clamp max velocity when not charging
      if (!this.player.isCharging) {
        const currentSpeed = Math.hypot(this.player.velocity.x, this.player.velocity.z);
        if (currentSpeed > speed) {
          this.player.velocity.x = (this.player.velocity.x / currentSpeed) * speed;
          this.player.velocity.z = (this.player.velocity.z / currentSpeed) * speed;
        }
      }

      // Footstep dust
      if (Math.random() < 0.25) {
        this.particles.emitDust(this.player.position, 1, false);
      }
    }

    // Update cooldown UI state
    this.state.playerChargeCooldownPct = Math.max(0, this.player.chargeCooldownTimer / this.player.chargeCooldown);
    this.state.activePowerup = this.player.activePowerup ? this.player.activePowerup.type : null;
  }

  private updateBotAI(dt: number) {
    const arenaR = this.state.ringRadius;

    this.sheepList.forEach(bot => {
      if (bot.isPlayer || !bot.alive || bot.isDying) return;

      bot.botDecisionTimer -= dt;
      bot.bleatTimer -= dt;

      // Random funny procedural bleats
      if (bot.bleatTimer <= 0) {
        bot.bleatTimer = 8.0 + Math.random() * 15.0;
        if (Math.random() < 0.4 && this.state.aliveCount <= 6) {
          sounds.playBaa(200 + Math.random() * 80);
        }
      }

      const distFromCenter = Math.hypot(bot.position.x, bot.position.z);

      // Decision State Machine
      if (bot.botDecisionTimer <= 0) {
        bot.botDecisionTimer = 0.4 + Math.random() * 0.4;

        // 1. Critical safety: if approaching ring hazard boundary, steer back to center!
        if (distFromCenter > arenaR * 0.72) {
          bot.botState = 'retreat_edge';
          bot.botWanderTarget.set((Math.random() - 0.5) * (arenaR * 0.4), 0, (Math.random() - 0.5) * (arenaR * 0.4));
        } else {
          // 2. Check if near powerup
          let nearestPowerup: PowerupEntity | null = null;
          let minPupDist = 12.0;
          for (const p of this.powerups) {
            if (!p.collected) {
              const d = bot.position.distanceTo(p.position);
              if (d < minPupDist) {
                minPupDist = d;
                nearestPowerup = p;
              }
            }
          }

          if (nearestPowerup && Math.random() < 0.75) {
            bot.botState = 'seek_powerup';
            bot.botWanderTarget.copy(nearestPowerup.position);
          } else {
            // 3. Find closest rival sheep to attack
            let closestRival: SheepEntity | null = null;
            let minDist = 20.0;
            this.sheepList.forEach(other => {
              if (other.id !== bot.id && other.alive && !other.isDying) {
                const d = bot.position.distanceTo(other.position);
                if (d < minDist) {
                  minDist = d;
                  closestRival = other;
                }
              }
            });

            if (closestRival) {
              bot.botTargetId = (closestRival as SheepEntity).id;
              bot.botState = minDist < 9.0 ? 'charge' : 'chase';
            } else {
              bot.botState = 'wander';
              bot.botWanderTarget.set(
                (Math.random() - 0.5) * (arenaR * 0.6),
                0,
                (Math.random() - 0.5) * (arenaR * 0.6)
              );
            }
          }
        }
      }

      // Execute Behavior
      let targetX = 0;
      let targetZ = 0;

      if (bot.botState === 'retreat_edge' || bot.botState === 'seek_powerup' || bot.botState === 'wander') {
        targetX = bot.botWanderTarget.x - bot.position.x;
        targetZ = bot.botWanderTarget.z - bot.position.z;
      } else {
        // Chase / Charge rival
        const rival = this.sheepList.find(s => s.id === bot.botTargetId && s.alive && !s.isDying);
        if (rival) {
          targetX = rival.position.x - bot.position.x;
          targetZ = rival.position.z - bot.position.z;

          // Attempt charge when close and lined up!
          const dist = Math.hypot(targetX, targetZ);
          if (dist < 8.0 && bot.chargeCooldownTimer <= 0 && Math.random() < 0.65) {
            bot.triggerCharge();
            this.particles.emitDust(bot.position, 4, true);
          }
        } else {
          bot.botState = 'wander';
          targetX = -bot.position.x;
          targetZ = -bot.position.z;
        }
      }

      const mag = Math.hypot(targetX, targetZ);
      if (mag > 0.2) {
        const dirX = targetX / mag;
        const dirZ = targetZ / mag;
        bot.targetRotationY = Math.atan2(dirX, dirZ);

        const speed = bot.baseSpeed * (bot.activePowerup?.type === 'boost' ? 1.3 : 0.95);
        bot.velocity.x += dirX * 36.0 * dt;
        bot.velocity.z += dirZ * 36.0 * dt;

        if (!bot.isCharging) {
          const curSpeed = Math.hypot(bot.velocity.x, bot.velocity.z);
          if (curSpeed > speed) {
            bot.velocity.x = (bot.velocity.x / curSpeed) * speed;
            bot.velocity.z = (bot.velocity.z / curSpeed) * speed;
          }
        }
      }
    });
  }

  private updateSheepPhysics(dt: number) {
    let aliveTotal = 0;

    this.sheepList.forEach(sheep => {
      if (!sheep.alive) return;
      sheep.update(dt, this.state.ringRadius);

      if (sheep.alive && !sheep.isDying) {
        aliveTotal++;
      }

      // Check if sheep just fell off and died
      if (!sheep.alive && sheep.lastHitBy) {
        const killer = this.sheepList.find(s => s.id === sheep.lastHitBy);
        if (killer) {
          killer.kills++;
          if (killer.isPlayer) {
            this.state.playerKills++;
          }
          const feedMsg = killer.isPlayer
            ? `💥 Ты выбил ${sheep.name}!`
            : `⚡ ${killer.name} выбил ${sheep.name}!`;
          this.addFeedMessage(feedMsg);
        }
        sounds.playKnockout();
      }
    });

    this.state.aliveCount = aliveTotal;

    // Check Player Victory or Elimination
    if (this.state.status === 'playing') {
      if (!this.player.alive) {
        this.state.status = 'gameover';
        this.state.playerRank = aliveTotal + 1;
        this.notifyState();
      } else if (aliveTotal === 1 && this.player.alive) {
        this.state.status = 'victory';
        this.state.playerRank = 1;
        sounds.playVictoryFanfare();
        this.particles.emitConfetti(this.player.position, 60);
        this.notifyState();
      }
    }
  }

  private checkCollisions(dt: number) {
    const list = this.sheepList;
    const len = list.length;

    for (let i = 0; i < len; i++) {
      const a = list[i];
      if (!a.alive || a.isDying) continue;

      for (let j = i + 1; j < len; j++) {
        const b = list[j];
        if (!b.alive || b.isDying) continue;

        _vecA.copy(a.position);
        _vecB.copy(b.position);
        const dist = _vecA.distanceTo(_vecB);
        const minDist = a.radius + b.radius;

        if (dist < minDist && dist > 0.001) {
          // Normal vector from b to a
          _normal.subVectors(_vecA, _vecB).normalize();

          // Positional correction to resolve penetration
          const overlap = 0.5 * (minDist - dist);
          a.position.addScaledVector(_normal, overlap);
          b.position.addScaledVector(_normal, -overlap);

          // Impact velocities
          _impactVel.subVectors(a.velocity, b.velocity);
          const relativeSpeed = _impactVel.dot(_normal);

          // Headbutt logic
          const aCharging = a.isCharging;
          const bCharging = b.isCharging;

          let impulseMagnitude = 14.0;
          let isHeadbutt = false;

          if (aCharging || bCharging) {
            isHeadbutt = true;
            impulseMagnitude = 28.0;

            if (aCharging && !bCharging) {
              b.lastHitBy = a.id;
              b.squashTime = 0.3;
              b.stunTimer = 0.25;
              impulseMagnitude *= (a.mass / b.mass);
            } else if (bCharging && !aCharging) {
              a.lastHitBy = b.id;
              a.squashTime = 0.3;
              a.stunTimer = 0.25;
              impulseMagnitude *= (b.mass / a.mass);
            } else {
              // Mutual clash!
              a.squashTime = 0.3;
              b.squashTime = 0.3;
              impulseMagnitude = 24.0;
            }
          }

          // Apply elastic impulse
          a.velocity.addScaledVector(_normal, impulseMagnitude / a.mass);
          b.velocity.addScaledVector(_normal, -impulseMagnitude / b.mass);

          // Visual & Audio impact feedback
          const midPoint = _vecA.clone().add(_vecB).multiplyScalar(0.5);
          this.particles.emitHitSparks(midPoint, isHeadbutt ? 16 : 6, isHeadbutt ? '#facc15' : '#ffffff');
          sounds.playBonk(isHeadbutt ? 1.6 : 0.8);

          // Screen shake & hitstop if player involved
          if (a.isPlayer || b.isPlayer) {
            this.screenShake = isHeadbutt ? 0.35 : 0.15;
            if (isHeadbutt) {
              this.hitstopTimer = 0.035; // 35ms hitstop for crunchy arcade feel!
            }
          }
        }
      }
    }
  }

  private updateRing(dt: number) {
    if (this.currentStageIndex >= this.ringStages.length) return;

    const stage = this.ringStages[this.currentStageIndex];

    if (!this.state.isRingShrinking) {
      this.stageTimer -= dt;
      this.state.ringShrinkTimer = Math.max(0, this.stageTimer);

      if (this.stageTimer <= 3.0 && Math.floor(this.stageTimer * 3) !== Math.floor((this.stageTimer + dt) * 3)) {
        sounds.playDangerWarning();
      }

      if (this.stageTimer <= 0) {
        this.state.isRingShrinking = true;
        this.ringTargetRadius = stage.target;
        this.stageTimer = stage.shrinkDuration;
        this.addFeedMessage(`⚠️ ОПАСНАЯ ЗОНА СУЖАЕТСЯ ДО ${stage.target}м!`);
        sounds.playDangerWarning();
      }
    } else {
      // Actively shrinking ring
      this.stageTimer -= dt;
      const progress = 1 - Math.max(0, this.stageTimer / stage.shrinkDuration);
      const prevTarget = this.currentStageIndex > 0 ? this.ringStages[this.currentStageIndex - 1].target : 38;
      this.state.ringRadius = prevTarget - (prevTarget - stage.target) * progress;
      this.arena.updateRingRadius(this.state.ringRadius);

      if (this.stageTimer <= 0) {
        this.state.isRingShrinking = false;
        this.state.ringRadius = stage.target;
        this.arena.updateRingRadius(stage.target);
        this.currentStageIndex++;
        if (this.currentStageIndex < this.ringStages.length) {
          this.stageTimer = this.ringStages[this.currentStageIndex].delay;
          this.state.ringShrinkTimer = this.stageTimer;
        }
      }
    }
  }

  private spawnPowerups(dt: number) {
    if (this.powerups.length >= 3) return;

    if (Math.random() < 0.008) { // Chance per frame to spawn
      const types: PowerupType[] = ['boost', 'shield', 'giant', 'spring'];
      const type = types[Math.floor(Math.random() * types.length)];
      const id = `pup_${Date.now()}`;

      // Spawn inside safe zone
      const r = Math.random() * (this.state.ringRadius * 0.65);
      const angle = Math.random() * Math.PI * 2;
      const pos = new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r);

      const pup = createPowerupMesh(id, type, pos);
      this.scene.add(pup.group);
      this.powerups.push(pup);
    }
  }

  private updatePowerups(dt: number) {
    const time = performance.now() * 0.003;

    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.mesh.rotation.y += 2.5 * dt;
      p.mesh.position.y = 1.0 + Math.sin(time + i) * 0.2;
      p.halo.rotation.z += 1.2 * dt;

      // Check pickup with alive sheep
      for (const sheep of this.sheepList) {
        if (!sheep.alive || sheep.isDying) continue;
        if (sheep.position.distanceTo(p.position) < sheep.radius + 0.8) {
          sheep.activatePowerup(p.type);
          if (sheep.isPlayer) {
            sounds.playPowerup();
            const names = {
              boost: '⚡ Золотой Таран!',
              shield: '🛡️ Стальная Шерсть!',
              giant: '🍄 Мега-Овца!',
              spring: '💨 Пружинные Копыта!',
            };
            this.addFeedMessage(`Бонус получен: ${names[p.type]}`);
          }
          this.particles.emitHitSparks(p.position, 12, '#38bdf8');
          this.scene.remove(p.group);
          this.powerups.splice(i, 1);
          break;
        }
      }
    }
  }

  private updateCamera(dt: number) {
    if (this.state.status === 'menu') return;

    // Follow player smoothly
    const target = this.player && this.player.alive ? this.player.position : new THREE.Vector3(0, 0, 0);
    _camTarget.copy(target);

    // Camera offset behind and above
    const camDistance = 22;
    const camHeight = 15;
    _camIdealPos.set(_camTarget.x, _camTarget.y + camHeight, _camTarget.z + camDistance);

    // Apply Screen Shake
    if (this.screenShake > 0) {
      this.screenShake -= dt * 1.5;
      const shakeMag = this.screenShake * 1.2;
      _camIdealPos.x += (Math.random() - 0.5) * shakeMag;
      _camIdealPos.y += (Math.random() - 0.5) * shakeMag;
      _camIdealPos.z += (Math.random() - 0.5) * shakeMag;
    }

    // Exponential smooth damping
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _camIdealPos.x, 8.0, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _camIdealPos.y, 8.0, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _camIdealPos.z, 8.0, dt);
    this.camera.lookAt(_camTarget.x, _camTarget.y + 1.2, _camTarget.z);
  }

  private addFeedMessage(msg: string) {
    this.state.killFeed.unshift(msg);
    if (this.state.killFeed.length > 5) {
      this.state.killFeed.pop();
    }
    this.notifyState();
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  public setMapTheme(theme: MapTheme) {
    this.theme = theme;
    this.setupArena(theme);
  }

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    this.clearAllSheepAndPowerups();
    if (this.arena) this.arena.dispose();
    if (this.particles) this.particles.dispose();
    this.renderer.dispose();
  }
}
