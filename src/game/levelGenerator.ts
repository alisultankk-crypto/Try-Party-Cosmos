/**
 * Progressive 10-Level Board Generator for Try Party: COSMOS.
 * - Starts with only 3 types of champions on Level 1 (clear, fun, accessible).
 * - Gradually introduces new champion cards with each level up to Level 10.
 * - Guarantees 100% triplet integrity (all tiles exist in groups of 3).
 * - Generates distinct tactical pyramid stacks and layered structures.
 */

import { TileType, TileItemData } from '../types/game';

export const TILE_WIDTH = 48;
export const TILE_HEIGHT = 56;

// Ordered champion unlock list across 10 levels
export const PROGRESSIVE_CHAMPION_ORDER: TileType[] = [
  'yasuo',      // Level 1
  'ahri',       // Level 1
  'jinx',       // Level 1
  'teemo',      // Level 2 (+1)
  'lux',        // Level 3 (+1)
  'blitzcrank', // Level 4 (+1)
  'vi',         // Level 5 (+1)
  'ashe',       // Level 6 (+1)
  'darius',     // Level 7 (+1)
  'zed',        // Level 8 (+1)
  'garen',      // Level 9 (+1)
  'asol',       // Level 10 (+1)
];

interface TileBlueprint {
  x: number;
  y: number;
  layer: number;
}

export function createPRNG(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getFormattedDayLabel(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];
  return `${day} ${months[monthIdx] || ''} ${year}`;
}

export function getMsUntilTomorrow(): number {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}

function shuffleArray<T>(arr: T[], rng = Math.random): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Creates TileItemData array from coordinate blueprints and a shuffled pool of types.
 */
function createTilesFromBlueprints(
  blueprints: TileBlueprint[],
  pool: TileType[]
): TileItemData[] {
  const total = Math.min(blueprints.length, pool.length);
  const tiles: TileItemData[] = [];

  for (let i = 0; i < total; i++) {
    tiles.push({
      id: `tile_${i}_${Math.random().toString(36).substr(2, 6)}`,
      type: pool[i],
      x: blueprints[i].x,
      y: blueprints[i].y,
      layer: blueprints[i].layer,
      isCovered: false,
      inSlot: false,
      inShelf: false,
      isEliminated: false,
    });
  }

  updateCoveredState(tiles);
  return tiles;
}

/**
 * Checks overlap: tile A is covered if another unpicked tile B has layer > A.layer
 * and their bounding boxes overlap by more than 8 pixels.
 */
export function updateCoveredState(tiles: TileItemData[]): void {
  const active = tiles.filter((t) => !t.inSlot && !t.inShelf && !t.isEliminated);

  for (const t of active) {
    let covered = false;
    for (const other of active) {
      if (other.id === t.id) continue;
      if (other.layer > t.layer) {
        const dx = Math.abs(other.x - t.x);
        const dy = Math.abs(other.y - t.y);
        // Overlap threshold
        if (dx < TILE_WIDTH - 8 && dy < TILE_HEIGHT - 8) {
          covered = true;
          break;
        }
      }
    }
    t.isCovered = covered;
  }
}

/**
 * Universal Progressive Level Generator (Levels 1 to 10)
 */
export function generateLevel(levelNum: number): TileItemData[] {
  const lvl = Math.max(1, Math.min(10, Math.floor(levelNum)));

  // 1. Number of champion types used in this level
  // Level 1 has 3 types, Level 2 has 4, ..., Level 10 has 12 types
  const typesCount = Math.min(PROGRESSIVE_CHAMPION_ORDER.length, 2 + lvl);
  const typesUsed = PROGRESSIVE_CHAMPION_ORDER.slice(0, typesCount);

  // 2. Total triplets:
  // Level 1: 6 triplets = 18 tiles
  // Level 2: 8 triplets = 24 tiles
  // Level 3: 11 triplets = 33 tiles
  // Level 4: 14 triplets = 42 tiles
  // Level 5: 17 triplets = 51 tiles
  // Level 6: 20 triplets = 60 tiles
  // Level 7: 23 triplets = 69 tiles
  // Level 8: 26 triplets = 78 tiles
  // Level 9: 30 triplets = 90 tiles
  // Level 10: 35 triplets = 105 tiles
  const tripletsMap: Record<number, number> = {
    1: 6,
    2: 8,
    3: 11,
    4: 14,
    5: 17,
    6: 20,
    7: 23,
    8: 26,
    9: 30,
    10: 35,
  };
  const totalTriplets = tripletsMap[lvl] || 6;
  const totalTiles = totalTriplets * 3;

  // 3. Populate pool ensuring all tiles are in triplets
  const pool: TileType[] = [];
  for (let i = 0; i < totalTriplets; i++) {
    const type = typesUsed[i % typesUsed.length];
    pool.push(type, type, type);
  }
  shuffleArray(pool);

  // 4. Generate layered layouts based on level complexity
  const blueprints: TileBlueprint[] = [];

  if (lvl === 1) {
    // 18 tiles: 3 simple distinct layers
    // Base 3x3 (9 tiles)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        blueprints.push({
          x: (c - 1) * (TILE_WIDTH + 4),
          y: (r - 1) * (TILE_HEIGHT + 4) - 10,
          layer: 0,
        });
      }
    }
    // Layer 1: 2x2 offset (4 tiles)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        blueprints.push({
          x: (c - 0.5) * (TILE_WIDTH + 2),
          y: (r - 0.5) * (TILE_HEIGHT + 2) - 10,
          layer: 1,
        });
      }
    }
    // Layer 2: 2 Side tiles + Center peak (5 tiles)
    blueprints.push({ x: -110, y: -10, layer: 1 });
    blueprints.push({ x: 110, y: -10, layer: 1 });
    blueprints.push({ x: 0, y: -10, layer: 2 });
    blueprints.push({ x: -28, y: -10, layer: 2 });
    blueprints.push({ x: 28, y: -10, layer: 2 });
  } else if (lvl === 2) {
    // 24 tiles: Pyramid + Side columns
    // Base (12 tiles)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        blueprints.push({
          x: (c - 1.5) * (TILE_WIDTH + 2),
          y: (r - 1) * (TILE_HEIGHT + 4) - 15,
          layer: 0,
        });
      }
    }
    // Layer 1: 3x2 (6 tiles)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        blueprints.push({
          x: (c - 1) * (TILE_WIDTH + 2),
          y: (r - 0.5) * (TILE_HEIGHT + 2) - 15,
          layer: 1,
        });
      }
    }
    // Layer 2 & 3: 6 tiles (Side columns & Center)
    blueprints.push({ x: -115, y: -45, layer: 2 });
    blueprints.push({ x: -115, y: 15, layer: 3 });
    blueprints.push({ x: 115, y: -45, layer: 2 });
    blueprints.push({ x: 115, y: 15, layer: 3 });
    blueprints.push({ x: -22, y: -15, layer: 2 });
    blueprints.push({ x: 22, y: -15, layer: 2 });
  } else {
    // Levels 3 to 10: Multi-layer concentric pyramids with progressive draw decks
    const maxLayers = Math.min(8, 3 + Math.floor(lvl / 2));
    let tilesPlaced = 0;

    // Center layered pyramid
    for (let l = 0; l < maxLayers && tilesPlaced < totalTiles - 12; l++) {
      const span = Math.max(2, Math.min(4, 5 - Math.floor(l / 2)));
      const offset = (l % 2 === 1) ? 12 : 0;
      for (let r = 0; r < span && tilesPlaced < totalTiles - 12; r++) {
        for (let c = 0; c < span && tilesPlaced < totalTiles - 12; c++) {
          blueprints.push({
            x: (c - (span - 1) / 2) * (TILE_WIDTH - 2) + offset,
            y: (r - (span - 1) / 2) * (TILE_HEIGHT - 4) - 20 + offset,
            layer: l,
          });
          tilesPlaced++;
        }
      }
    }

    // Left and Right Tactical Decks
    const remaining = totalTiles - tilesPlaced;
    const halfRemaining = Math.floor(remaining / 2);

    for (let i = 0; i < halfRemaining; i++) {
      blueprints.push({
        x: -118 - (i % 2) * 8,
        y: -75 + (i * 12) % 150,
        layer: 2 + i,
      });
      tilesPlaced++;
    }

    while (tilesPlaced < totalTiles) {
      const i = totalTiles - tilesPlaced;
      blueprints.push({
        x: 118 + (i % 2) * 8,
        y: -75 + (i * 12) % 150,
        layer: 2 + i,
      });
      tilesPlaced++;
    }
  }

  // Ensure blueprint count matches totalTiles exactly
  const finalBlueprints = blueprints.slice(0, totalTiles);
  return createTilesFromBlueprints(finalBlueprints, pool);
}

// Aliases for campaign generator
export function generateLevel1(): TileItemData[] {
  return generateLevel(1);
}
export function generateLevel2(): TileItemData[] {
  return generateLevel(2);
}
export function generateLevel3(): TileItemData[] {
  return generateLevel(3);
}

/**
 * Deterministic Daily Challenge generator based on date string seed.
 */
export function generateDailyChallenge(dateStr: string): {
  tiles: TileItemData[];
  dayLabel: string;
} {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash) || 987654321;
  const prng = createPRNG(seed);

  // Daily challenge uses 8 types and 24 triplets (72 tiles)
  const typesUsed = PROGRESSIVE_CHAMPION_ORDER.slice(0, 8);
  const totalTriplets = 24; // 72 tiles
  const totalTiles = 72;

  const pool: TileType[] = [];
  for (let i = 0; i < totalTriplets; i++) {
    const t = typesUsed[i % typesUsed.length];
    pool.push(t, t, t);
  }
  shuffleArray(pool, prng);

  const blueprints: TileBlueprint[] = [];
  let count = 0;

  for (let l = 0; l <= 6 && count < totalTiles - 16; l++) {
    const span = Math.max(2, 4 - Math.floor(l / 2));
    const offset = (l % 2 === 1) ? 10 : 0;
    for (let r = 0; r < span && count < totalTiles - 16; r++) {
      for (let c = 0; c < span && count < totalTiles - 16; c++) {
        blueprints.push({
          x: (c - (span - 1) / 2) * (TILE_WIDTH - 4) + offset,
          y: (r - (span - 1) / 2) * (TILE_HEIGHT - 6) - 15 + offset,
          layer: l,
        });
        count++;
      }
    }
  }

  // Side overlapping decks
  while (count < totalTiles) {
    const isLeft = count % 2 === 0;
    const idx = Math.floor((count - 56) / 2);
    blueprints.push({
      x: isLeft ? -118 - (idx % 2) * 6 : 118 + (idx % 2) * 6,
      y: -70 + idx * 14,
      layer: 5 + idx,
    });
    count++;
  }

  const tiles = createTilesFromBlueprints(blueprints.slice(0, totalTiles), pool);
  return {
    tiles,
    dayLabel: getFormattedDayLabel(dateStr),
  };
}
