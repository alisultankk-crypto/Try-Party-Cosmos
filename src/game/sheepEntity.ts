/**
 * Sheep Entity and AI Controller for Crazy Cattle 3D.
 */

import * as THREE from 'three';
import { SheepModelParts, PowerupType } from './proceduralModels';

export interface SheepConfig {
  id: string;
  name: string;
  number: number;
  color: string;
  woolColor?: string;
  isPlayer: boolean;
  hasHorns?: boolean;
}

export type BotState = 'wander' | 'chase' | 'charge' | 'retreat_edge' | 'seek_powerup';

export class SheepEntity {
  public id: string;
  public name: string;
  public number: number;
  public isPlayer: boolean;
  public model: SheepModelParts;

  // Spatial & Physics
  public position: THREE.Vector3 = new THREE.Vector3();
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public rotationY: number = 0;
  public targetRotationY: number = 0;

  public baseSpeed: number = 10.5;
  public currentMaxSpeed: number = 10.5;
  public chargeSpeed: number = 26.0;
  public mass: number = 1.0;
  public radius: number = 0.95;

  public isGrounded: boolean = true;
  public isCharging: boolean = false;
  public chargeTimer: number = 0;
  public chargeMaxDuration: number = 0.38;
  public chargeCooldownTimer: number = 0;
  public chargeCooldown: number = 1.8;

  public jumpCooldownTimer: number = 0;
  public stunTimer: number = 0;

  // Match state
  public alive: boolean = true;
  public isDying: boolean = false;
  public fallTimer: number = 0;
  public kills: number = 0;
  public lastHitBy: string | null = null;
  public lastHitTime: number = 0;

  // Powerup state
  public activePowerup: { type: PowerupType; duration: number } | null = null;

  // Animation helpers
  public runAnimTime: number = 0;
  public squashTime: number = 0;
  public bleatTimer: number = 0;

  // AI State
  public botState: BotState = 'wander';
  public botDecisionTimer: number = 0;
  public botTargetId: string | null = null;
  public botWanderTarget: THREE.Vector3 = new THREE.Vector3();

  constructor(config: SheepConfig, model: SheepModelParts, startPos: THREE.Vector3) {
    this.id = config.id;
    this.name = config.name;
    this.number = config.number;
    this.isPlayer = config.isPlayer;
    this.model = model;

    this.position.copy(startPos);
    this.model.root.position.copy(startPos);
    this.bleatTimer = 3.0 + Math.random() * 8.0;
    this.botDecisionTimer = Math.random() * 0.5;
    this.botWanderTarget.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20);
  }

  public activatePowerup(type: PowerupType, duration: number = 8.0) {
    this.activePowerup = { type, duration };
    if (type === 'giant') {
      this.mass = 1.8;
      this.radius = 1.35;
      this.model.root.scale.set(1.4, 1.4, 1.4);
    } else if (type === 'shield') {
      this.mass = 1.5;
    } else if (type === 'boost') {
      this.chargeCooldown = 0.8;
      this.chargeSpeed = 32.0;
    }
  }

  public clearPowerup() {
    this.activePowerup = null;
    this.mass = 1.0;
    this.radius = 0.95;
    this.chargeCooldown = 1.8;
    this.chargeSpeed = 26.0;
    this.model.root.scale.set(1.0, 1.0, 1.0);
  }

  public triggerCharge(): boolean {
    if (this.chargeCooldownTimer > 0 || this.isCharging || !this.alive || this.isDying) {
      return false;
    }
    this.isCharging = true;
    this.chargeTimer = this.chargeMaxDuration;
    this.chargeCooldownTimer = this.chargeCooldown;

    // Surge velocity in current facing direction
    const forwardX = Math.sin(this.rotationY);
    const forwardZ = Math.cos(this.rotationY);
    this.velocity.x = forwardX * this.chargeSpeed;
    this.velocity.z = forwardZ * this.chargeSpeed;
    return true;
  }

  public triggerJump(): boolean {
    if (!this.isGrounded || this.jumpCooldownTimer > 0 || !this.alive || this.isDying) {
      return false;
    }
    this.isGrounded = false;
    this.velocity.y = 8.5;
    this.jumpCooldownTimer = 0.6;
    return true;
  }

  public update(dt: number, arenaRadius: number) {
    if (!this.alive) return;

    // Cooldown clocks
    if (this.chargeCooldownTimer > 0) this.chargeCooldownTimer -= dt;
    if (this.jumpCooldownTimer > 0) this.jumpCooldownTimer -= dt;
    if (this.stunTimer > 0) this.stunTimer -= dt;

    // Powerup countdown
    if (this.activePowerup) {
      this.activePowerup.duration -= dt;
      if (this.activePowerup.duration <= 0) {
        this.clearPowerup();
      }
    }

    // Handle dying / falloff animation
    if (this.isDying) {
      this.fallTimer += dt;
      this.velocity.y -= 24.0 * dt; // Rapid gravity fall
      this.position.x += this.velocity.x * dt;
      this.position.y += this.velocity.y * dt;
      this.position.z += this.velocity.z * dt;

      // Comical panic spin
      this.model.root.rotation.x += 10.0 * dt;
      this.model.root.rotation.z += 8.0 * dt;
      this.model.root.position.copy(this.position);

      if (this.position.y < -16.0) {
        this.alive = false;
        this.model.root.visible = false;
      }
      return;
    }

    // Active Charge handling
    if (this.isCharging) {
      this.chargeTimer -= dt;
      if (this.chargeTimer <= 0) {
        this.isCharging = false;
      }
    }

    // Apply Ground Friction & Gravity
    if (this.isGrounded) {
      const friction = this.isCharging ? 0.98 : 0.88;
      this.velocity.x *= Math.pow(friction, dt * 60);
      this.velocity.z *= Math.pow(friction, dt * 60);
    } else {
      this.velocity.y -= 22.0 * dt; // Gravity
      this.velocity.x *= Math.pow(0.96, dt * 60);
      this.velocity.z *= Math.pow(0.96, dt * 60);
    }

    // Position integration
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    this.position.z += this.velocity.z * dt;

    // Ground collision
    const distFromCenter = Math.hypot(this.position.x, this.position.z);
    if (distFromCenter <= arenaRadius) {
      // On arena island
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocity.y = 0;
        this.isGrounded = true;
      }
    } else {
      // Stepped off cliff edge!
      if (this.position.y <= 0 && !this.isDying) {
        this.isDying = true;
        this.isGrounded = false;
      }
    }

    // Smooth rotation towards target angle
    let diff = this.targetRotationY - this.rotationY;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.rotationY += diff * Math.min(1.0, dt * 14.0);

    // Sync 3D transforms
    this.model.root.position.copy(this.position);
    this.model.root.rotation.set(0, this.rotationY, 0);

    // Walking / Galloping Procedural Animation
    const horizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (horizontalSpeed > 0.5 && this.isGrounded) {
      this.runAnimTime += dt * (horizontalSpeed * 2.2);
      const legSwing = Math.sin(this.runAnimTime) * 0.45;

      this.model.legFL.rotation.x = legSwing;
      this.model.legBR.rotation.x = legSwing;
      this.model.legFR.rotation.x = -legSwing;
      this.model.legBL.rotation.x = -legSwing;

      // Slight body waddle & ear wiggle
      this.model.bodyMesh.rotation.z = Math.sin(this.runAnimTime) * 0.08;
      this.model.headGroup.position.y = 1.05 + Math.abs(Math.sin(this.runAnimTime * 2)) * 0.08;
      this.model.leftEar.rotation.z = -0.25 + Math.sin(this.runAnimTime * 1.5) * 0.15;
      this.model.rightEar.rotation.z = 0.25 - Math.sin(this.runAnimTime * 1.5) * 0.15;
    } else {
      // Reset legs
      this.model.legFL.rotation.x = 0;
      this.model.legFR.rotation.x = 0;
      this.model.legBL.rotation.x = 0;
      this.model.legBR.rotation.x = 0;
      this.model.bodyMesh.rotation.z = 0;
      this.model.headGroup.position.y = 1.05;
    }

    // Squash & Stretch on impacts
    if (this.squashTime > 0) {
      this.squashTime -= dt;
      const factor = this.squashTime / 0.3;
      this.model.bodyMesh.scale.set(1 + factor * 0.35, 1 - factor * 0.3, 1 + factor * 0.35);
    } else {
      this.model.bodyMesh.scale.set(1, 1, 1);
    }
  }

  public dispose() {
    this.model.materials.forEach(m => m.dispose());
  }
}
