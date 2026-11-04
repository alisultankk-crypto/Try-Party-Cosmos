export type TileType =
  | 'yasuo'
  | 'ahri'
  | 'jinx'
  | 'teemo'
  | 'garen'
  | 'zed'
  | 'blitzcrank'
  | 'vi'
  | 'ashe'
  | 'darius'
  | 'asol'
  | 'lux'
  | 'heimer'
  | 'katarina';

export type MagicEffectType =
  | 'arcane'
  | 'fire'
  | 'void'
  | 'frost'
  | 'wind'
  | 'starlight';

export type Language = 'ru' | 'en';

export interface TileItemData {
  id: string;
  type: TileType;
  layer: number;
  x: number; // Board coordinate
  y: number;
  isCovered: boolean;
  inSlot: boolean;
  inShelf: boolean;
  isEliminated: boolean;
}

export interface BoostersState {
  undo: number;
  shuffle: number;
  extract: number;
}

export interface RegionScore {
  name: string;
  clearedCount: number;
  rank: number;
  badge: string;
}

export type GameMode = 'campaign' | 'daily';

export interface DailyLeaderboardEntry {
  rank: number;
  playerName: string;
  avatar: string;
  timeSeconds: number;
  region: string;
  isUser?: boolean;
}

export interface DailyChallengeInfo {
  dateString: string;
  dayLabel: string;
  seed: number;
  timeRemainingMs: number;
}

// ==========================================
// 💎 ДРАГОЦЕННЫЕ КАМНИ И ИНВЕНТАРЬ
// ==========================================

export type GemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CosmicGem {
  id: string;
  name: { ru: string; en: string };
  titleLore: { ru: string; en: string };
  rarity: GemRarity;
  color: string;
  glowColor: string;
  shape: 'diamond' | 'hexagon' | 'star' | 'emerald' | 'crystal' | 'heart' | 'teardrop' | 'orb';
  baseDropRate: number; // 0 to 1
}

export type GemInventory = Record<string, number>;

export interface DailyLoginState {
  lastClaimDate: string; // YYYY-MM-DD
  streak: number; // 1 to 7
  hasClaimedToday: boolean;
}
