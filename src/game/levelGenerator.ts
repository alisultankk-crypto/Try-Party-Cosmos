/**
 * Level Generator for Triple Tile Cattle (Sheep a Sheep / 羊了个羊).
 * Generates layered tile pyramids, blind side stacks, and ensures all tiles exist in triplets.
 * Includes deterministic Daily Challenge generator with 24-hour reset cycle.
 */

import { TileType, TileItemData } from '../types/game';

export const TILE_WIDTH = 48;
export const TILE_HEIGHT = 56;

const ALL_TYPES: TileType[] = [
  'yasuo',
  'ahri',
  'jinx',
  'teemo',
  'garen',
  'zed',
  'blitzcrank',
  'vi',
  'ashe',
  'darius',
  'asol',
  'lux',
  'heimer',
  'katarina',
];

interface TileBlueprint {
  x: number;
  y: number;
  layer: number;
}

/**
 * Seeded PRNG (Mulberry32) for deterministic daily boards
 */
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

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 123456789;
}

/**
 * Generates Level 1 (Tutorial):
 * 7 triplets (21 tiles) in 3 simple layers.
 */
export function generateLevel1(): TileItemData[] {
  const typesUsed: TileType[] = ['yasuo', 'ahri', 'jinx', 'teemo'];
  const totalTriplets = 7; // 21 tiles

  const pool: TileType[] = [];
  for (let i = 0; i < totalTriplets; i++) {
    const t = typesUsed[i % typesUsed.length];
    pool.push(t, t, t);
  }
  shuffleArray(pool);

  const blueprints: TileBlueprint[] = [
    // Layer 0 (Base 3x3)
    { x: -50, y: -40, layer: 0 },
    { x: 0,   y: -40, layer: 0 },
    { x: 50,  y: -40, layer: 0 },
    { x: -50, y: 15,  layer: 0 },
    { x: 0,   y: 15,  layer: 0 },
    { x: 50,  y: 15,  layer: 0 },
    { x: -50, y: 70,  layer: 0 },
    { x: 0,   y: 70,  layer: 0 },
    { x: 50,  y: 70,  layer: 0 },

    // Layer 1 (Offset 2x2 + sides)
    { x: -25, y: -12, layer: 1 },
    { x: 25,  y: -12, layer: 1 },
    { x: -25, y: 42,  layer: 1 },
    { x: 25,  y: 42,  layer: 1 },
    { x: -80, y: 15,  layer: 1 },
    { x: 80,  y: 15,  layer: 1 },

    // Layer 2 (Center peak)
    { x: 0,   y: 15,  layer: 2 },
    { x: -35, y: 70,  layer: 2 },
    { x: 35,  y: 70,  layer: 2 },
    { x: -35, y: -40, layer: 2 },
    { x: 35,  y: -40, layer: 2 },
    { x: 0,   y: -12, layer: 3 },
  ];

  return createTilesFromBlueprints(blueprints, pool);
}

/**
 * Generates Level 2 (The Legendary Challenge):
 * 45 triplets (135 tiles)
 */
export function generateLevel2(): TileItemData[] {
  const typesUsed: TileType[] = ALL_TYPES.slice(0, 13);
  const totalTriplets = 45; // 135 tiles total
  const pool: TileType[] = [];

  for (let i = 0; i < totalTriplets; i++) {
    const t = typesUsed[i % typesUsed.length];
    pool.push(t, t, t);
  }
  shuffleArray(pool);

  const blueprints: TileBlueprint[] = [];

  // Central Deep Pyramid (Layers 0 to 7)
  for (let l = 0; l <= 7; l++) {
    const span = Math.max(1, 4 - Math.floor(l / 2));
    const offset = (l % 2 === 1) ? 14 : 0;
    for (let r = 0; r < span; r++) {
      for (let c = 0; c < span; c++) {
        const x = (c - (span - 1) / 2) * (TILE_WIDTH - 6) + offset;
        const y = (r - (span - 1) / 2) * (TILE_HEIGHT - 8) - 15 + offset;
        blueprints.push({ x, y, layer: l });
      }
    }
  }

  // Left Draw-Stack (Long overlapping deck)
  const leftStackCount = 20;
  for (let i = 0; i < leftStackCount; i++) {
    blueprints.push({
      x: -125 - (i % 2) * 6,
      y: -90 + i * 11,
      layer: i + 10,
    });
  }

  // Right Draw-Stack (Long overlapping deck)
  const rightStackCount = 20;
  for (let i = 0; i < rightStackCount; i++) {
    blueprints.push({
      x: 125 + (i % 2) * 6,
      y: -90 + i * 11,
      layer: i + 10,
    });
  }

  // Bottom Support Columns
  const bottomOffsets = [-60, -20, 20, 60];
  bottomOffsets.forEach((bx) => {
    for (let l = 0; l < 4; l++) {
      blueprints.push({
        x: bx + (l % 2) * 5,
        y: 110 + (l % 2) * 4,
        layer: l,
      });
    }
  });

  while (blueprints.length > pool.length) blueprints.pop();
  while (blueprints.length < pool.length) {
    const randomExisting = blueprints[Math.floor(Math.random() * blueprints.length)];
    blueprints.push({
      x: randomExisting.x + (Math.random() - 0.5) * 12,
      y: randomExisting.y + (Math.random() - 0.5) * 12,
      layer: randomExisting.layer + 1,
    });
  }

  return createTilesFromBlueprints(blueprints, pool);
}

/**
 * Generates Level 3 (Grandmaster):
 * 51 triplets (153 tiles)
 */
export function generateLevel3(): TileItemData[] {
  const typesUsed: TileType[] = ALL_TYPES;
  const totalTriplets = 51; // 153 tiles
  const pool: TileType[] = [];

  for (let i = 0; i < totalTriplets; i++) {
    const t = typesUsed[i % typesUsed.length];
    pool.push(t, t, t);
  }
  shuffleArray(pool);

  const blueprints: TileBlueprint[] = [];

  // Dual Tower Formations
  [-65, 65].forEach((towerX) => {
    for (let l = 0; l <= 6; l++) {
      const size = Math.max(1, 3 - Math.floor(l / 2.5));
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          blueprints.push({
            x: towerX + (c - (size - 1) / 2) * 40,
            y: (r - (size - 1) / 2) * 44 - 10,
            layer: l,
          });
        }
      }
    }
  });

  // Four corner decks
  const corners = [
    { x: -120, y: -70 },
    { x: 120, y: -70 },
    { x: -120, y: 70 },
    { x: 120, y: 70 },
  ];
  corners.forEach((corn) => {
    for (let i = 0; i < 12; i++) {
      blueprints.push({
        x: corn.x + (i % 2) * 4,
        y: corn.y + i * 8,
        layer: i + 10,
      });
    }
  });

  // Central connector bridge
  for (let l = 0; l < 5; l++) {
    blueprints.push(
      { x: 0, y: -40, layer: l + 1 },
      { x: 0, y: 0,   layer: l + 1 },
      { x: 0, y: 40,  layer: l + 1 }
    );
  }

  while (blueprints.length > pool.length) blueprints.pop();
  while (blueprints.length < pool.length) {
    const ref = blueprints[Math.floor(Math.random() * blueprints.length)];
    blueprints.push({ x: ref.x + 8, y: ref.y + 8, layer: ref.layer + 1 });
  }

  return createTilesFromBlueprints(blueprints, pool);
}

/**
 * Generates the DAILY CHALLENGE:
 * A deterministic fixed board layout that automatically updates every 24 hours.
 * Uses the day's date string as a seed so every player in the world plays on the exact same layout!
 */
export function generateDailyChallenge(dateStr?: string): {
  tiles: TileItemData[];
  dateString: string;
  dayLabel: string;
} {
  const targetDate = dateStr || getTodayDateString();
  const seed = stringToSeed(targetDate);
  const prng = createPRNG(seed);

  // 12 item types, 40 triplets = 120 tiles (balanced & competitive)
  const typesUsed = ALL_TYPES.slice(0, 12);
  const totalTriplets = 40;
  const pool: TileType[] = [];

  for (let i = 0; i < totalTriplets; i++) {
    const t = typesUsed[i % typesUsed.length];
    pool.push(t, t, t);
  }

  // Deterministic Fisher-Yates shuffle with PRNG
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Select 1 of 4 daily archetypes based on seed
  const archetype = Math.floor(prng() * 4);
  const blueprints: TileBlueprint[] = [];

  if (archetype === 0) {
    // Archetype 0: "Royal Clover" (Center 6-layer pyramid + 4 petal wings)
    for (let l = 0; l < 6; l++) {
      const size = Math.max(1, 4 - Math.floor(l / 1.8));
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          blueprints.push({
            x: (c - (size - 1) / 2) * 38 + (l % 2 === 1 ? 12 : 0),
            y: (r - (size - 1) / 2) * 44 - 15 + (l % 2 === 1 ? 12 : 0),
            layer: l,
          });
        }
      }
    }
    // 4 Petals
    const offsets = [
      { dx: -115, dy: 0 },
      { dx: 115,  dy: 0 },
      { dx: 0,    dy: -90 },
      { dx: 0,    dy: 95 },
    ];
    offsets.forEach((off) => {
      for (let i = 0; i < 14; i++) {
        blueprints.push({
          x: off.dx + (i % 2) * 6,
          y: off.dy + (i % 3) * 12 - 15,
          layer: i + 8,
        });
      }
    });
  } else if (archetype === 1) {
    // Archetype 1: "Twin Mountains & Bridge"
    [-75, 75].forEach((mX) => {
      for (let l = 0; l < 6; l++) {
        const size = Math.max(1, 3 - Math.floor(l / 2.2));
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            blueprints.push({
              x: mX + (c - (size - 1) / 2) * 38,
              y: (r - (size - 1) / 2) * 42 - 10,
              layer: l,
            });
          }
        }
      }
    });
    // Bridge & wings
    for (let i = 0; i < 22; i++) {
      blueprints.push({
        x: -120 + (i % 2) * 6,
        y: -80 + i * 9,
        layer: i + 8,
      });
      blueprints.push({
        x: 120 + (i % 2) * 6,
        y: -80 + i * 9,
        layer: i + 8,
      });
    }
  } else if (archetype === 2) {
    // Archetype 2: "Sunburst Fortress"
    for (let l = 0; l < 7; l++) {
      blueprints.push(
        { x: 0, y: -15, layer: l * 2 },
        { x: -36, y: -15, layer: l * 2 + 1 },
        { x: 36, y: -15, layer: l * 2 + 1 },
        { x: 0, y: -55, layer: l * 2 + 1 },
        { x: 0, y: 25, layer: l * 2 + 1 }
      );
    }
    // Cross stacks
    for (let i = 0; i < 18; i++) {
      blueprints.push({ x: -110 - (i % 2) * 6, y: -60 + i * 11, layer: i + 5 });
      blueprints.push({ x: 110 + (i % 2) * 6, y: -60 + i * 11, layer: i + 5 });
      blueprints.push({ x: -40 + (i % 3) * 40, y: 105 + (i % 2) * 6, layer: i + 5 });
    }
  } else {
    // Archetype 3: "Farm Labyrinth"
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        for (let l = 0; l < 3; l++) {
          blueprints.push({
            x: (c - 1.5) * 42 + (l % 2) * 8,
            y: (r - 1.5) * 46 - 10 + (l % 2) * 8,
            layer: l,
          });
        }
      }
    }
    for (let i = 0; i < 20; i++) {
      blueprints.push({ x: -125 + (i % 2) * 4, y: -80 + i * 10, layer: i + 8 });
      blueprints.push({ x: 125 - (i % 2) * 4, y: -80 + i * 10, layer: i + 8 });
    }
  }

  // Adjust blueprint count to pool size exactly
  while (blueprints.length > pool.length) blueprints.pop();
  while (blueprints.length < pool.length) {
    const idx = Math.floor(prng() * blueprints.length);
    const ref = blueprints[idx];
    blueprints.push({
      x: ref.x + Math.round((prng() - 0.5) * 16),
      y: ref.y + Math.round((prng() - 0.5) * 16),
      layer: ref.layer + 1,
    });
  }

  const tiles = createTilesFromBlueprints(blueprints, pool, prng);
  return {
    tiles,
    dateString: targetDate,
    dayLabel: getFormattedDayLabel(targetDate),
  };
}

function createTilesFromBlueprints(
  blueprints: TileBlueprint[],
  pool: TileType[],
  prng?: () => number
): TileItemData[] {
  const randFn = prng || Math.random;
  const tiles: TileItemData[] = blueprints.map((bp, idx) => ({
    id: `tile_${idx}_${Date.now()}_${Math.floor(randFn() * 100000)}`,
    type: pool[idx],
    layer: bp.layer,
    x: Math.round(bp.x),
    y: Math.round(bp.y),
    isCovered: false,
    inSlot: false,
    inShelf: false,
    isEliminated: false,
  }));

  updateCoveredState(tiles);
  return tiles;
}

/**
 * Updates `isCovered` for every tile on the board.
 */
export function updateCoveredState(tiles: TileItemData[]) {
  const activeTiles = tiles.filter((t) => !t.inSlot && !t.inShelf && !t.isEliminated);

  for (const t of activeTiles) {
    t.isCovered = false;
  }

  const w = TILE_WIDTH - 6;
  const h = TILE_HEIGHT - 6;

  for (let i = 0; i < activeTiles.length; i++) {
    const lower = activeTiles[i];
    for (let j = 0; j < activeTiles.length; j++) {
      const upper = activeTiles[j];
      if (upper.layer > lower.layer) {
        if (Math.abs(upper.x - lower.x) < w && Math.abs(upper.y - lower.y) < h) {
          lower.isCovered = true;
          break;
        }
      }
    }
  }
}

function shuffleArray<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
