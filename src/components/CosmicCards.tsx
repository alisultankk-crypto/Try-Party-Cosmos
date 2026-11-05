import React from 'react';
import { MagicEffectType, OriginalTileType, TileType } from '../types/game';
import { CHAMPION_METAS, FunnyCosmicChamps } from './FunnyCosmicChamps';

interface ExtraCardMeta {
  name: string;
  icon: string;
  accentColor: string;
  glowColor: string;
  magic: MagicEffectType;
}

export const EXTRA_COSMIC_CARDS: Record<Exclude<TileType, OriginalTileType>, ExtraCardMeta> = {
  nebula: { name: 'Туманность', icon: '🌌', accentColor: '#c084fc', glowColor: 'rgba(192, 132, 252, 0.7)', magic: 'void' },
  comet: { name: 'Комета', icon: '☄️', accentColor: '#67e8f9', glowColor: 'rgba(103, 232, 249, 0.7)', magic: 'wind' },
  satellite: { name: 'Спутник', icon: '🛰️', accentColor: '#94a3b8', glowColor: 'rgba(148, 163, 184, 0.7)', magic: 'arcane' },
  ufo: { name: 'НЛО', icon: '🛸', accentColor: '#a3e635', glowColor: 'rgba(163, 230, 53, 0.7)', magic: 'starlight' },
  moon: { name: 'Луна', icon: '🌙', accentColor: '#c4b5fd', glowColor: 'rgba(196, 181, 253, 0.7)', magic: 'frost' },
  sun: { name: 'Солнце', icon: '☀️', accentColor: '#facc15', glowColor: 'rgba(250, 204, 21, 0.7)', magic: 'fire' },
  mars: { name: 'Марс', icon: '🔴', accentColor: '#fb7185', glowColor: 'rgba(251, 113, 133, 0.7)', magic: 'fire' },
  saturn: { name: 'Сатурн', icon: '🪐', accentColor: '#fbbf24', glowColor: 'rgba(251, 191, 36, 0.7)', magic: 'starlight' },
  blackhole: { name: 'Чёрная дыра', icon: '🕳️', accentColor: '#818cf8', glowColor: 'rgba(129, 140, 248, 0.7)', magic: 'void' },
  galaxy: { name: 'Галактика', icon: '🌀', accentColor: '#e879f9', glowColor: 'rgba(232, 121, 249, 0.7)', magic: 'arcane' },
  astronaut: { name: 'Космонавт', icon: '🧑‍🚀', accentColor: '#e2e8f0', glowColor: 'rgba(226, 232, 240, 0.7)', magic: 'frost' },
  rocket: { name: 'Ракета', icon: '🚀', accentColor: '#fb923c', glowColor: 'rgba(251, 146, 60, 0.7)', magic: 'fire' },
  telescope: { name: 'Телескоп', icon: '🔭', accentColor: '#60a5fa', glowColor: 'rgba(96, 165, 250, 0.7)', magic: 'arcane' },
  meteor: { name: 'Метеор', icon: '🌠', accentColor: '#f97316', glowColor: 'rgba(249, 115, 22, 0.7)', magic: 'fire' },
  starship: { name: 'Звёздный корабль', icon: '🛸', accentColor: '#2dd4bf', glowColor: 'rgba(45, 212, 191, 0.7)', magic: 'wind' },
  crystal: { name: 'Кристалл', icon: '💎', accentColor: '#22d3ee', glowColor: 'rgba(34, 211, 238, 0.7)', magic: 'frost' },
  portal: { name: 'Портал', icon: '🪄', accentColor: '#a78bfa', glowColor: 'rgba(167, 139, 250, 0.7)', magic: 'void' },
  rover: { name: 'Марсоход', icon: '🤖', accentColor: '#fb7185', glowColor: 'rgba(251, 113, 133, 0.7)', magic: 'arcane' },
  aurora: { name: 'Полярное сияние', icon: '🌈', accentColor: '#34d399', glowColor: 'rgba(52, 211, 153, 0.7)', magic: 'wind' },
  pulsar: { name: 'Пульсар', icon: '💫', accentColor: '#f0abfc', glowColor: 'rgba(240, 171, 252, 0.7)', magic: 'starlight' },
  quasar: { name: 'Квазар', icon: '✨', accentColor: '#fde68a', glowColor: 'rgba(253, 230, 138, 0.7)', magic: 'starlight' },
  stardust: { name: 'Звёздная пыль', icon: '🌟', accentColor: '#fcd34d', glowColor: 'rgba(252, 211, 77, 0.7)', magic: 'starlight' },
  eclipse: { name: 'Затмение', icon: '🌑', accentColor: '#a5b4fc', glowColor: 'rgba(165, 180, 252, 0.7)', magic: 'void' },
  probe: { name: 'Зонд', icon: '📡', accentColor: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.7)', magic: 'arcane' },
  spacewhale: { name: 'Космический кит', icon: '🐋', accentColor: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.7)', magic: 'wind' },
  cosmicflower: { name: 'Звёздный цветок', icon: '🌸', accentColor: '#f9a8d4', glowColor: 'rgba(249, 168, 212, 0.7)', magic: 'starlight' },
  ringworld: { name: 'Кольцевой мир', icon: '🪐', accentColor: '#fb923c', glowColor: 'rgba(251, 146, 60, 0.7)', magic: 'fire' },
  constellation: { name: 'Созвездие', icon: '✨', accentColor: '#a5b4fc', glowColor: 'rgba(165, 180, 252, 0.7)', magic: 'frost' },
};

export const CAMPAIGN_TILE_TYPES = [
  ...Object.keys(CHAMPION_METAS),
  ...Object.keys(EXTRA_COSMIC_CARDS),
] as TileType[];

export function getCardMeta(type: TileType): ExtraCardMeta | (typeof CHAMPION_METAS)[OriginalTileType] {
  return type in CHAMPION_METAS
    ? CHAMPION_METAS[type as OriginalTileType]
    : EXTRA_COSMIC_CARDS[type as Exclude<TileType, OriginalTileType>];
}

export const CosmicCardImage: React.FC<{ type: TileType; isCovered?: boolean }> = ({
  type,
  isCovered = false,
}) => {
  if (type in CHAMPION_METAS) {
    return <FunnyCosmicChamps type={type as OriginalTileType} isCovered={isCovered} />;
  }

  const card = EXTRA_COSMIC_CARDS[type as Exclude<TileType, OriginalTileType>];
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label={card.name}
      className={`h-10 w-10 select-none ${isCovered ? 'opacity-65 grayscale-[0.3]' : ''}`}
    >
      <circle cx="20" cy="20" r="17" fill={card.accentColor} fillOpacity=".16" />
      <circle cx="20" cy="20" r="15" fill="none" stroke={card.accentColor} strokeOpacity=".7" strokeWidth="1.5" />
      <text x="20" y="27" textAnchor="middle" fontSize="21">{card.icon}</text>
    </svg>
  );
};
