import React from 'react';
import { TileType, MagicEffectType } from '../types/game';

type CoatPattern = 'point' | 'tabby' | 'calico' | 'solid' | 'tuxedo' | 'spotted';

interface CatMeta {
  name: string;
  funnyName: string;
  magic: MagicEffectType;
  accentColor: string;
  glowColor: string;
  fur: string;
  marking: string;
  eyeColor: string;
  pattern: CoatPattern;
}

export const CAT_METAS: Record<TileType, CatMeta> = {
  yasuo: { name: 'Сиамская', funnyName: 'Сиамская кошка', magic: 'wind', accentColor: '#67e8f9', glowColor: 'rgba(103, 232, 249, 0.65)', fur: '#f2dfbd', marking: '#59433a', eyeColor: '#38bdf8', pattern: 'point' },
  ahri: { name: 'Мейн-кун', funnyName: 'Рыжий мейн-кун', magic: 'fire', accentColor: '#fb923c', glowColor: 'rgba(251, 146, 60, 0.65)', fur: '#db7837', marking: '#8f3d24', eyeColor: '#e8d76a', pattern: 'tabby' },
  jinx: { name: 'Калико', funnyName: 'Трёхцветная калико', magic: 'starlight', accentColor: '#f472b6', glowColor: 'rgba(244, 114, 182, 0.65)', fur: '#f8ead8', marking: '#302a35', eyeColor: '#49a6d8', pattern: 'calico' },
  teemo: { name: 'Британская', funnyName: 'Британская голубая', magic: 'arcane', accentColor: '#94a3b8', glowColor: 'rgba(148, 163, 184, 0.65)', fur: '#8894a5', marking: '#5f6b7b', eyeColor: '#e8c85b', pattern: 'solid' },
  garen: { name: 'Русская голубая', funnyName: 'Русская голубая', magic: 'wind', accentColor: '#60a5fa', glowColor: 'rgba(96, 165, 250, 0.65)', fur: '#7c91a5', marking: '#506578', eyeColor: '#70c99a', pattern: 'solid' },
  zed: { name: 'Бомбейская', funnyName: 'Чёрная бомбейская', magic: 'void', accentColor: '#a78bfa', glowColor: 'rgba(167, 139, 250, 0.65)', fur: '#252532', marking: '#11111b', eyeColor: '#f3c35f', pattern: 'solid' },
  blitzcrank: { name: 'Золотая табби', funnyName: 'Золотая табби', magic: 'starlight', accentColor: '#facc15', glowColor: 'rgba(250, 204, 21, 0.65)', fur: '#e9b64d', marking: '#a96229', eyeColor: '#73ad64', pattern: 'tabby' },
  vi: { name: 'Персидская', funnyName: 'Лиловая персидская', magic: 'arcane', accentColor: '#e879f9', glowColor: 'rgba(232, 121, 249, 0.65)', fur: '#b983bb', marking: '#80577f', eyeColor: '#e8c865', pattern: 'solid' },
  ashe: { name: 'Норвежская лесная', funnyName: 'Белая лесная', magic: 'frost', accentColor: '#bae6fd', glowColor: 'rgba(186, 230, 253, 0.7)', fur: '#f4f4ed', marking: '#b8c5ce', eyeColor: '#64a9db', pattern: 'tuxedo' },
  darius: { name: 'Бенгальская', funnyName: 'Пятнистая бенгальская', magic: 'fire', accentColor: '#fb7185', glowColor: 'rgba(251, 113, 133, 0.65)', fur: '#d99a58', marking: '#593728', eyeColor: '#d5b94c', pattern: 'spotted' },
  asol: { name: 'Небелунг', funnyName: 'Звёздный небелунг', magic: 'void', accentColor: '#818cf8', glowColor: 'rgba(129, 140, 248, 0.75)', fur: '#52527c', marking: '#343455', eyeColor: '#87e0d1', pattern: 'solid' },
  lux: { name: 'Рэгдолл', funnyName: 'Кремовый рэгдолл', magic: 'starlight', accentColor: '#fde68a', glowColor: 'rgba(253, 230, 138, 0.7)', fur: '#f1dfc5', marking: '#96745d', eyeColor: '#67aee4', pattern: 'point' },
  heimer: { name: 'Сфинкс', funnyName: 'Персиковый сфинкс', magic: 'fire', accentColor: '#f97316', glowColor: 'rgba(249, 115, 22, 0.65)', fur: '#d99a82', marking: '#b87568', eyeColor: '#77a765', pattern: 'tabby' },
  katarina: { name: 'Черепаховая', funnyName: 'Черепаховая кошка', magic: 'frost', accentColor: '#34d399', glowColor: 'rgba(52, 211, 153, 0.65)', fur: '#413843', marking: '#d2784c', eyeColor: '#e4c85b', pattern: 'calico' },
};

const ELEMENT_MARKS: Record<MagicEffectType, string> = {
  arcane: '✦',
  fire: '✹',
  void: '✧',
  frost: '❄',
  wind: '〰',
  starlight: '✴',
};

export const CosmicCats: React.FC<{ type: TileType; isCovered?: boolean }> = ({
  type,
  isCovered = false,
}) => {
  const cat = CAT_METAS[type];

  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label={cat.funnyName}
      className={`h-10 w-10 select-none transition-transform duration-150 ${
        isCovered ? 'opacity-65 grayscale-[0.3]' : 'opacity-100'
      }`}
    >
      <path d="M7 18 8 5l10 8M33 18 32 5 22 13" fill={cat.fur} stroke={cat.marking} strokeWidth="2" strokeLinejoin="round" />
      <path d="m10 11 1-3 4 4m10 0 4-4 1 3" fill="none" stroke={cat.marking} strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="20" cy="23" rx="14" ry="13" fill={cat.fur} stroke={cat.marking} strokeWidth="1" />

      {cat.pattern === 'point' && (
        <>
          <path d="m8 16 1-9 7 8M32 16l-1-9-7 8" fill={cat.marking} opacity=".9" />
          <ellipse cx="20" cy="23" rx="8" ry="7" fill={cat.marking} opacity=".9" />
        </>
      )}
      {cat.pattern === 'tabby' && (
        <>
          <path d="M15 12 17 17m6-5-2 5M8 20l5 2m19-2-5 2" stroke={cat.marking} strokeWidth="2" strokeLinecap="round" />
          <path d="M10 28q4-3 7 0m6 0q3-3 7 0" fill="none" stroke={cat.marking} strokeWidth="1.6" />
        </>
      )}
      {cat.pattern === 'calico' && (
        <>
          <path d="M8 17q4-7 10-4l-3 7-7 2zm14 7 8-5 3 6-7 5z" fill={cat.marking} />
          <path d="M13 13q3-3 6-1l-2 4z" fill="#e58a4b" />
        </>
      )}
      {cat.pattern === 'spotted' && (
        <>
          <ellipse cx="11" cy="19" rx="2.1" ry="1.5" fill={cat.marking} />
          <ellipse cx="29" cy="19" rx="2.1" ry="1.5" fill={cat.marking} />
          <ellipse cx="12" cy="28" rx="2.4" ry="1.6" fill={cat.marking} />
          <ellipse cx="28" cy="28" rx="2.4" ry="1.6" fill={cat.marking} />
        </>
      )}
      {cat.pattern === 'tuxedo' && (
        <>
          <path d="M15 27 20 34l5-7-2-3h-6z" fill="#ffffff" />
          <path d="M8 21q4-4 7 0m10 0q3-4 7 0" fill="none" stroke={cat.marking} strokeWidth="1.6" />
        </>
      )}

      <ellipse cx="14.5" cy="22" rx="2.2" ry="2.8" fill={cat.eyeColor} />
      <ellipse cx="25.5" cy="22" rx="2.2" ry="2.8" fill={cat.eyeColor} />
      <ellipse cx="14.5" cy="22" rx=".8" ry="2.1" fill="#172033" />
      <ellipse cx="25.5" cy="22" rx=".8" ry="2.1" fill="#172033" />
      <ellipse cx="20" cy="27" rx="5" ry="3.3" fill="#f3e8dc" />
      <path d="m18.5 26.4 1.5-1 1.5 1-1.5 1.5z" fill="#d7838b" />
      <path d="M20 28q-1 2-3 1m3-1q1 2 3 1" fill="none" stroke="#573d48" strokeWidth="1" strokeLinecap="round" />
      <path d="M16 28 8 27m8 3-7 2m15-4 8-1m-8 3 7 2" fill="none" stroke={cat.marking} strokeWidth=".8" strokeLinecap="round" />
      <text x="34" y="9" textAnchor="middle" fontSize="8" fill={cat.accentColor}>{ELEMENT_MARKS[cat.magic]}</text>
    </svg>
  );
};
