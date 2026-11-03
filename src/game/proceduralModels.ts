/**
 * Procedural 3D Models for Crazy Cattle 3D.
 * Adheres to Three.js Craft Directives:
 * - Composite 3-12 part procedural models (THREE.Group)
 * - Grounded bottom-center pivots (groundHeightAt)
 * - Varied roughness / metalness ratios
 * - Zero external asset 404 dependencies
 */

import * as THREE from 'three';

// Shared procedural textures & materials cache
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates a procedural number badge texture for sheep flanks.
 */
function createNumberBadgeTexture(num: number, bgColor: string, textColor: string = '#ffffff'): THREE.CanvasTexture {
  const key = `badge_${num}_${bgColor}_${textColor}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 256, 256);

  // Soft circle badge
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.arc(128, 128, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(128, 128, 88, 0, Math.PI * 2);
  ctx.fill();

  // Number text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 110px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num < 10 ? `0${num}` : `${num}`, 128, 134);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates a soft radial contact shadow texture.
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const key = 'contact_shadow';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  gradient.addColorStop(0, 'rgba(10, 20, 15, 0.7)');
  gradient.addColorStop(0.5, 'rgba(10, 20, 15, 0.3)');
  gradient.addColorStop(1, 'rgba(10, 20, 15, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

export interface SheepModelParts {
  root: THREE.Group;
  bodyMesh: THREE.Group;
  headGroup: THREE.Group;
  leftEar: THREE.Mesh;
  rightEar: THREE.Mesh;
  legFL: THREE.Mesh; // Front-Left
  legFR: THREE.Mesh; // Front-Right
  legBL: THREE.Mesh; // Back-Left
  legBR: THREE.Mesh; // Back-Right
  tail: THREE.Mesh;
  horns?: THREE.Group;
  contactShadow: THREE.Mesh;
  badges: THREE.Mesh[];
  materials: THREE.Material[];
}

export interface SheepOptions {
  color: string;
  woolColor?: string;
  number: number;
  isPlayer?: boolean;
  hasHorns?: boolean;
}

/**
 * Constructs an authentic, iconic Crazy Cattle 3D sheep procedural model.
 * Fully rigged with independent leg pivots, ears, head, and flank numbers.
 */
export function createSheepMesh(opts: SheepOptions): SheepModelParts {
  const root = new THREE.Group();
  const materials: THREE.Material[] = [];

  const woolHex = opts.woolColor || (opts.isPlayer ? '#ffffff' : '#f4efe6');
  const skinHex = opts.color || '#2c2b30';

  // Wool material (matte fluffy finish)
  const woolMat = new THREE.MeshStandardMaterial({
    color: woolHex,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });
  materials.push(woolMat);

  // Dark/accent skin material (smooth matte)
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinHex,
    roughness: 0.7,
    metalness: 0.1,
    flatShading: true,
  });
  materials.push(skinMat);

  // Muzzle material
  const muzzleMat = new THREE.MeshStandardMaterial({
    color: '#e29587',
    roughness: 0.6,
    metalness: 0.05,
  });
  materials.push(muzzleMat);

  // Eye materials
  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.3,
    metalness: 0.0,
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: '#111111' });
  materials.push(eyeWhiteMat, pupilMat);

  // Horns material (bronze / horn texture)
  const hornMat = new THREE.MeshStandardMaterial({
    color: opts.isPlayer ? '#d97706' : '#78350f',
    roughness: 0.45,
    metalness: 0.3,
    flatShading: true,
  });
  materials.push(hornMat);

  // === 1. BODY WOOL (Composite cloud of 7 low-poly faceted spheres) ===
  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, 0.95, 0);

  // Central torso ellipsoid
  const torsoGeo = new THREE.SphereGeometry(0.85, 9, 8);
  torsoGeo.scale(1.0, 0.92, 1.25);
  const mainTorso = new THREE.Mesh(torsoGeo, woolMat);
  mainTorso.castShadow = true;
  mainTorso.receiveShadow = true;
  bodyGroup.add(mainTorso);

  // Fluffy puff accents around perimeter
  const puffGeo = new THREE.SphereGeometry(0.42, 7, 6);
  const puffOffsets = [
    [0.48, 0.25, 0.4],
    [-0.48, 0.25, 0.4],
    [0.55, 0.1, -0.3],
    [-0.55, 0.1, -0.3],
    [0, 0.65, 0],
    [0, 0.5, 0.6],
    [0, 0.5, -0.6],
  ];
  puffOffsets.forEach(([px, py, pz]) => {
    const puff = new THREE.Mesh(puffGeo, woolMat);
    puff.position.set(px, py, pz);
    puff.castShadow = true;
    bodyGroup.add(puff);
  });

  // Flank Number Badges
  const badgeTex = createNumberBadgeTexture(opts.number, woolHex, opts.color);
  const badgeMat = new THREE.MeshStandardMaterial({
    map: badgeTex,
    roughness: 0.8,
    metalness: 0.05,
  });
  materials.push(badgeMat);

  const badgeGeo = new THREE.PlaneGeometry(0.6, 0.6);
  const badgeLeft = new THREE.Mesh(badgeGeo, badgeMat);
  badgeLeft.position.set(0.86, 0.05, 0);
  badgeLeft.rotation.y = Math.PI / 2;
  bodyGroup.add(badgeLeft);

  const badgeRight = new THREE.Mesh(badgeGeo, badgeMat);
  badgeRight.position.set(-0.86, 0.05, 0);
  badgeRight.rotation.y = -Math.PI / 2;
  bodyGroup.add(badgeRight);

  // Tail (fluffy little sphere at the back)
  const tailGeo = new THREE.SphereGeometry(0.22, 6, 6);
  const tail = new THREE.Mesh(tailGeo, woolMat);
  tail.position.set(0, 0.25, -1.15);
  bodyGroup.add(tail);

  root.add(bodyGroup);

  // === 2. HEAD GROUP (Attached forward at z = +0.9) ===
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 1.05);

  // Cranium (blocky-soft shape)
  const headGeo = new THREE.BoxGeometry(0.55, 0.6, 0.65);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Wool cap on top of head
  const headWoolGeo = new THREE.SphereGeometry(0.34, 7, 6);
  headWoolGeo.scale(1.1, 0.7, 1.0);
  const headWool = new THREE.Mesh(headWoolGeo, woolMat);
  headWool.position.set(0, 0.35, -0.05);
  headWool.castShadow = true;
  headGroup.add(headWool);

  // Snout & Nostrils
  const snoutGeo = new THREE.BoxGeometry(0.42, 0.32, 0.35);
  const snoutMesh = new THREE.Mesh(snoutGeo, skinMat);
  snoutMesh.position.set(0, -0.12, 0.42);
  snoutMesh.castShadow = true;
  headGroup.add(snoutMesh);

  const noseGeo = new THREE.BoxGeometry(0.24, 0.12, 0.08);
  const noseMesh = new THREE.Mesh(noseGeo, muzzleMat);
  noseMesh.position.set(0, -0.06, 0.6);
  headGroup.add(noseMesh);

  // Eyes (Cartoon look: big white spheres + front-facing black pupils)
  const eyeWhiteGeo = new THREE.SphereGeometry(0.12, 7, 6);
  const pupilGeo = new THREE.SphereGeometry(0.06, 6, 6);

  // Left Eye
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  leftEyeWhite.position.set(0.24, 0.12, 0.28);
  const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
  leftPupil.position.set(0.25, 0.12, 0.38);
  headGroup.add(leftEyeWhite, leftPupil);

  // Right Eye
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  rightEyeWhite.position.set(-0.24, 0.12, 0.28);
  const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
  rightPupil.position.set(-0.25, 0.12, 0.38);
  headGroup.add(rightEyeWhite, rightPupil);

  // Ears (Floppy / Perky ears with independent pivots)
  const earGeo = new THREE.BoxGeometry(0.4, 0.14, 0.18);
  earGeo.translate(0.2, 0, 0); // Pivot at base

  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(0.26, 0.2, -0.05);
  leftEar.rotation.set(0, 0.2, -0.25);
  headGroup.add(leftEar);

  const rightEarGeo = earGeo.clone();
  rightEarGeo.translate(-0.4, 0, 0);
  const rightEar = new THREE.Mesh(rightEarGeo, skinMat);
  rightEar.position.set(-0.26, 0.2, -0.05);
  rightEar.rotation.set(0, -0.2, 0.25);
  headGroup.add(rightEar);

  // Curved Ram Horns (for player or prominent ram cattle)
  let hornsGroup: THREE.Group | undefined;
  if (opts.hasHorns || opts.isPlayer) {
    hornsGroup = new THREE.Group();

    // Curved spiral horn via Torus or Tube
    const hornGeo = new THREE.TorusGeometry(0.28, 0.08, 6, 12, Math.PI * 1.3);

    const leftHorn = new THREE.Mesh(hornGeo, hornMat);
    leftHorn.position.set(0.3, 0.28, -0.08);
    leftHorn.rotation.set(0.3, -Math.PI / 4, -0.5);
    hornsGroup.add(leftHorn);

    const rightHorn = new THREE.Mesh(hornGeo, hornMat);
    rightHorn.position.set(-0.3, 0.28, -0.08);
    rightHorn.rotation.set(0.3, Math.PI / 4, 0.5);
    rightHorn.scale.set(-1, 1, 1);
    hornsGroup.add(rightHorn);

    headGroup.add(hornsGroup);
  }

  root.add(headGroup);

  // === 3. FOUR STUBBY LEGS (Pivoted at hip/shoulder for running cycle) ===
  const legHeight = 0.58;
  const legRadius = 0.13;
  const legGeo = new THREE.CylinderGeometry(legRadius * 0.95, legRadius * 0.8, legHeight, 6);
  legGeo.translate(0, -legHeight / 2, 0); // Pivot at top hip!

  const hoofGeo = new THREE.CylinderGeometry(legRadius * 0.85, legRadius * 0.9, 0.12, 6);
  hoofGeo.translate(0, -legHeight + 0.06, 0);
  const hoofMat = new THREE.MeshStandardMaterial({
    color: '#151515',
    roughness: 0.9,
    metalness: 0.1,
  });
  materials.push(hoofMat);

  function createLeg(x: number, z: number): THREE.Mesh {
    const legMesh = new THREE.Mesh(legGeo, skinMat);
    legMesh.position.set(x, 0.65, z);
    legMesh.castShadow = true;

    const hoof = new THREE.Mesh(hoofGeo, hoofMat);
    legMesh.add(hoof);
    return legMesh;
  }

  const legFL = createLeg(0.38, 0.55);
  const legFR = createLeg(-0.38, 0.55);
  const legBL = createLeg(0.38, -0.55);
  const legBR = createLeg(-0.38, -0.55);
  root.add(legFL, legFR, legBL, legBR);

  // === 4. CONTACT SHADOW DISC (Grounding flush with floor) ===
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  materials.push(shadowMat);

  const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02; // Just above floor to avoid z-fighting
  root.add(contactShadow);

  return {
    root,
    bodyMesh: bodyGroup,
    headGroup,
    leftEar,
    rightEar,
    legFL,
    legFR,
    legBL,
    legBR,
    tail,
    horns: hornsGroup,
    contactShadow,
    badges: [badgeLeft, badgeRight],
    materials,
  };
}

export type MapTheme = 'ireland' | 'alpine' | 'sunset';

export interface ArenaEnvironment {
  group: THREE.Group;
  radius: number;
  shrinkRingMesh: THREE.Mesh;
  updateRingRadius: (r: number) => void;
  dispose: () => void;
}

/**
 * Builds the floating minimalist pasture arena with fences, trees, and danger zone.
 */
export function createArenaEnvironment(theme: MapTheme = 'ireland'): ArenaEnvironment {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  const initialRadius = 38; // Initial arena radius

  // Palette by theme
  const themeColors = {
    ireland: {
      grass: '#4ade80',
      grassEdge: '#22c55e',
      cliff: '#475569',
      wood: '#78350f',
      fog: '#dcfce7',
      sky: '#bbf7d0',
      ring: '#ef4444',
    },
    alpine: {
      grass: '#93c5fd',
      grassEdge: '#60a5fa',
      cliff: '#334155',
      wood: '#64748b',
      fog: '#e0f2fe',
      sky: '#bae6fd',
      ring: '#f97316',
    },
    sunset: {
      grass: '#facc15',
      grassEdge: '#eab308',
      cliff: '#57331e',
      wood: '#451a03',
      fog: '#fed7aa',
      sky: '#fdba74',
      ring: '#dc2626',
    },
  }[theme];

  // 1. MAIN ISLAND PLATEAU (Extruded multifaceted disc with beveled cliff sides)
  const segments = 42;
  const islandShape = new THREE.Shape();
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Organic wobble for natural floating island silhouette
    const r = initialRadius + Math.sin(angle * 6) * 1.8 + Math.cos(angle * 12) * 0.9;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) islandShape.moveTo(x, y);
    else islandShape.lineTo(x, y);
  }
  islandShape.closePath();

  // Top Grass Cap
  const grassMat = new THREE.MeshStandardMaterial({
    color: themeColors.grass,
    roughness: 0.9,
    metalness: 0.05,
    flatShading: true,
  });
  materials.push(grassMat);

  const extrudeSettings = {
    steps: 1,
    depth: 4.5,
    bevelEnabled: true,
    bevelThickness: 1.0,
    bevelSize: 0.8,
    bevelSegments: 2,
  };
  const islandGeo = new THREE.ExtrudeGeometry(islandShape, extrudeSettings);
  geometries.push(islandGeo);

  const islandMesh = new THREE.Mesh(islandGeo, grassMat);
  islandMesh.rotation.x = Math.PI / 2;
  islandMesh.position.y = 0;
  islandMesh.receiveShadow = true;
  group.add(islandMesh);

  // Island Cliff & Underbelly
  const cliffMat = new THREE.MeshStandardMaterial({
    color: themeColors.cliff,
    roughness: 0.95,
    metalness: 0.1,
    flatShading: true,
  });
  materials.push(cliffMat);

  // Tapered underside cone
  const undersideGeo = new THREE.ConeGeometry(initialRadius * 0.95, 14, 32);
  undersideGeo.translate(0, -7 - 4.5, 0);
  geometries.push(undersideGeo);
  const undersideMesh = new THREE.Mesh(undersideGeo, cliffMat);
  group.add(undersideMesh);

  // 2. WOODEN FARM FENCE (Sections with intentional gaps for ramming sheep off!)
  const fenceMat = new THREE.MeshStandardMaterial({
    color: themeColors.wood,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true,
  });
  materials.push(fenceMat);

  const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.6, 5);
  postGeo.translate(0, 0.8, 0);
  geometries.push(postGeo);

  const railGeo = new THREE.BoxGeometry(2.4, 0.18, 0.12);
  railGeo.translate(1.2, 0, 0);
  geometries.push(railGeo);

  const totalFenceSections = 32;
  for (let i = 0; i < totalFenceSections; i++) {
    // Leave 4 large cliff drop-off openings for battle ringouts!
    const isGap = (i >= 5 && i <= 7) || (i >= 13 && i <= 15) || (i >= 21 && i <= 23) || (i >= 29 && i <= 31);
    if (isGap) continue;

    const angle = (i / totalFenceSections) * Math.PI * 2;
    const r = initialRadius - 1.2;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    const post = new THREE.Mesh(postGeo, fenceMat);
    post.position.set(x, 0, z);
    post.castShadow = true;
    group.add(post);

    const nextAngle = ((i + 1) / totalFenceSections) * Math.PI * 2;
    const nx = Math.cos(nextAngle) * r;
    const nz = Math.sin(nextAngle) * r;

    // Top rail
    const railTop = new THREE.Mesh(railGeo, fenceMat);
    railTop.position.set(x, 1.15, z);
    railTop.lookAt(nx, 1.15, nz);
    railTop.castShadow = true;
    group.add(railTop);

    // Bottom rail
    const railBottom = new THREE.Mesh(railGeo, fenceMat);
    railBottom.position.set(x, 0.65, z);
    railBottom.lookAt(nx, 0.65, nz);
    group.add(railBottom);
  }

  // 3. LOW-POLY TREES & ROCKS (Grounded scatter outside active combat center)
  const trunkMat = new THREE.MeshStandardMaterial({
    color: '#5b3a29',
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });
  const leavesMat = new THREE.MeshStandardMaterial({
    color: '#15803d',
    roughness: 0.75,
    metalness: 0.05,
    flatShading: true,
  });
  const rockMat = new THREE.MeshStandardMaterial({
    color: '#64748b',
    roughness: 0.9,
    metalness: 0.15,
    flatShading: true,
  });
  materials.push(trunkMat, leavesMat, rockMat);

  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.45, 2.2, 5);
  trunkGeo.translate(0, 1.1, 0);
  const foliageGeo1 = new THREE.ConeGeometry(1.8, 2.6, 6);
  foliageGeo1.translate(0, 2.8, 0);
  const foliageGeo2 = new THREE.ConeGeometry(1.4, 2.2, 6);
  foliageGeo2.translate(0, 4.2, 0);
  geometries.push(trunkGeo, foliageGeo1, foliageGeo2);

  // Spawn decorative trees along the safe inner fence zones
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2 + 0.15;
    const r = initialRadius - 4.5 - (i % 3) * 2;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.castShadow = true;
    const f1 = new THREE.Mesh(foliageGeo1, leavesMat);
    f1.castShadow = true;
    const f2 = new THREE.Mesh(foliageGeo2, leavesMat);
    f2.castShadow = true;

    treeGroup.add(trunk, f1, f2);
    const s = 0.8 + (i % 4) * 0.15;
    treeGroup.scale.set(s, s, s);
    group.add(treeGroup);
  }

  // Spawn low-poly boulders / rocks
  const rockGeo = new THREE.DodecahedronGeometry(0.8, 1);
  geometries.push(rockGeo);
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2 + 0.3;
    const r = 16 + (i % 5) * 4;
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(Math.cos(angle) * r, 0.4, Math.sin(angle) * r);
    rock.rotation.set(i * 0.7, i * 0.4, i * 0.9);
    const rs = 0.5 + (i % 3) * 0.4;
    rock.scale.set(rs, rs * 0.7, rs);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }

  // 4. SHRINKING DANGER BOUNDARY RING (Glowing holographic barrier)
  const ringGeo = new THREE.CylinderGeometry(initialRadius, initialRadius, 1.8, 48, 1, true);
  geometries.push(ringGeo);
  const ringMat = new THREE.MeshBasicMaterial({
    color: themeColors.ring,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  materials.push(ringMat);

  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.y = 0.9;
  group.add(ringMesh);

  // Ground hazard ring decal line
  const groundRingGeo = new THREE.RingGeometry(initialRadius - 0.35, initialRadius, 48);
  geometries.push(groundRingGeo);
  const groundRingMat = new THREE.MeshBasicMaterial({
    color: themeColors.ring,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });
  materials.push(groundRingMat);
  const groundRingMesh = new THREE.Mesh(groundRingGeo, groundRingMat);
  groundRingMesh.rotation.x = -Math.PI / 2;
  groundRingMesh.position.y = 0.04;
  group.add(groundRingMesh);

  const updateRingRadius = (r: number) => {
    const scale = r / initialRadius;
    ringMesh.scale.set(scale, 1, scale);
    groundRingMesh.scale.set(scale, scale, 1);
  };

  const dispose = () => {
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
  };

  return {
    group,
    radius: initialRadius,
    shrinkRingMesh: ringMesh,
    updateRingRadius,
    dispose,
  };
}

export type PowerupType = 'boost' | 'shield' | 'giant' | 'spring';

export interface PowerupEntity {
  id: string;
  type: PowerupType;
  group: THREE.Group;
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  halo: THREE.Mesh;
  glow: THREE.PointLight;
  collected: boolean;
  spawnTime: number;
}

/**
 * Creates a floating pickup power-up entity.
 */
export function createPowerupMesh(id: string, type: PowerupType, position: THREE.Vector3): PowerupEntity {
  const group = new THREE.Group();
  group.position.copy(position);

  const colors = {
    boost: { main: '#fbbf24', aura: '#f59e0b' },   // Golden Ram Clover
    shield: { main: '#38bdf8', aura: '#0284c7' },  // Iron Wool Shield
    giant: { main: '#f43f5e', aura: '#e11d48' },   // Super Mushroom
    spring: { main: '#a855f7', aura: '#9333ea' },  // Spring Hooves
  }[type];

  // Core icon geometry
  let iconGeo: THREE.BufferGeometry;
  if (type === 'boost') {
    iconGeo = new THREE.OctahedronGeometry(0.55, 0); // Golden Diamond/Clover
  } else if (type === 'shield') {
    iconGeo = new THREE.TorusGeometry(0.45, 0.16, 6, 12);
  } else if (type === 'giant') {
    iconGeo = new THREE.DodecahedronGeometry(0.55, 0);
  } else {
    iconGeo = new THREE.ConeGeometry(0.45, 0.9, 6);
  }

  const iconMat = new THREE.MeshStandardMaterial({
    color: colors.main,
    emissive: colors.aura,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8,
  });

  const mesh = new THREE.Mesh(iconGeo, iconMat);
  mesh.position.y = 1.0;
  mesh.castShadow = true;
  group.add(mesh);

  // Floating ring aura
  const haloGeo = new THREE.RingGeometry(0.65, 0.85, 16);
  const haloMat = new THREE.MeshBasicMaterial({
    color: colors.aura,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.2;
  group.add(halo);

  // Soft glow light
  const glow = new THREE.PointLight(colors.main, 1.2, 5);
  glow.position.y = 1.0;
  group.add(glow);

  return {
    id,
    type,
    group,
    position: group.position,
    mesh,
    halo,
    glow,
    collected: false,
    spawnTime: performance.now(),
  };
}
