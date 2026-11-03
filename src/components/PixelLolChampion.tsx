import React from 'react';
import { TileType, MagicEffectType } from '../types/game';

interface ChampionMeta {
  name: string;
  title: string;
  magic: MagicEffectType;
  accentColor: string;
  glowColor: string;
}

export const CHAMPION_METAS: Record<TileType, ChampionMeta> = {
  yasuo: { name: 'Ясуо', title: 'Непрощённый', magic: 'wind', accentColor: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.6)' },
  ahri: { name: 'Ари', title: 'Девятихвостая лиса', magic: 'arcane', accentColor: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.6)' },
  jinx: { name: 'Джинкс', title: 'Безбашенная хулиганка', magic: 'fire', accentColor: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.6)' },
  teemo: { name: 'Тимо', title: 'Шустрый скаут', magic: 'wind', accentColor: '#84cc16', glowColor: 'rgba(132, 204, 22, 0.6)' },
  garen: { name: 'Гарен', title: 'Мощь Демасии', magic: 'starlight', accentColor: '#fbbf24', glowColor: 'rgba(251, 191, 36, 0.6)' },
  zed: { name: 'Зед', title: 'Мастер теней', magic: 'void', accentColor: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.6)' },
  blitzcrank: { name: 'Блицкранк', title: 'Великий паровой голем', magic: 'arcane', accentColor: '#eab308', glowColor: 'rgba(234, 179, 8, 0.6)' },
  vi: { name: 'Вай', title: 'Пилтоверский миротворец', magic: 'fire', accentColor: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.6)' },
  ashe: { name: 'Эш', title: 'Ледяная лучница', magic: 'frost', accentColor: '#67e8f9', glowColor: 'rgba(103, 232, 249, 0.6)' },
  darius: { name: 'Дариус', title: 'Рука Ноксуса', magic: 'fire', accentColor: '#b91c1c', glowColor: 'rgba(185, 28, 28, 0.6)' },
  asol: { name: 'Аурелион Сол', title: 'Создатель звёзд', magic: 'void', accentColor: '#818cf8', glowColor: 'rgba(129, 140, 248, 0.7)' },
  lux: { name: 'Люкс', title: 'Леди сияния', magic: 'starlight', accentColor: '#fef08a', glowColor: 'rgba(254, 240, 138, 0.7)' },
  heimer: { name: 'Хеймердингер', title: 'Уважаемый изобретатель', magic: 'arcane', accentColor: '#f97316', glowColor: 'rgba(249, 115, 22, 0.6)' },
  katarina: { name: 'Катарина', title: 'Зловещий клинок', magic: 'fire', accentColor: '#dc2626', glowColor: 'rgba(220, 38, 38, 0.6)' },
};

export const PixelLolChampion: React.FC<{ type: TileType; isCovered?: boolean }> = ({
  type,
  isCovered = false,
}) => {
  const iconClass = isCovered ? 'opacity-65 filter grayscale-[0.3]' : 'opacity-100';

  return (
    <svg
      viewBox="0 0 32 32"
      className={`w-9 h-9 ${iconClass}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {renderChampionPixels(type)}
    </svg>
  );
};

function renderChampionPixels(type: TileType) {
  switch (type) {
    case 'yasuo':
      // Yasuo: Wind Samurai, spiky black ponytail, blue bandana, facial stubble & scar
      return (
        <g>
          {/* Background hair / Ponytail */}
          <rect x="18" y="2" width="6" height="4" fill="#18181b" />
          <rect x="22" y="5" width="4" height="6" fill="#27272a" />
          <rect x="24" y="10" width="3" height="6" fill="#18181b" />
          {/* Head hair base */}
          <rect x="8" y="5" width="14" height="7" fill="#18181b" />
          <rect x="6" y="8" width="4" height="6" fill="#27272a" />
          {/* Blue Wind Headband */}
          <rect x="8" y="10" width="14" height="3" fill="#0284c7" />
          <rect x="10" y="10" width="10" height="1" fill="#38bdf8" />
          {/* Face */}
          <rect x="10" y="13" width="11" height="10" fill="#fbcfe8" />
          <rect x="9" y="14" width="13" height="8" fill="#fed7aa" />
          {/* Eyes & Eyebrows */}
          <rect x="11" y="14" width="3" height="1" fill="#18181b" />
          <rect x="16" y="14" width="3" height="1" fill="#18181b" />
          <rect x="11" y="16" width="2" height="2" fill="#18181b" />
          <rect x="17" y="16" width="2" height="2" fill="#18181b" />
          {/* Scar & Stubble */}
          <rect x="15" y="15" width="1" height="5" fill="#ea580c" />
          <rect x="12" y="21" width="6" height="2" fill="#78350f" opacity="0.4" />
          {/* Blue Collar Scarf */}
          <rect x="8" y="23" width="15" height="6" fill="#0369a1" />
          <rect x="11" y="24" width="9" height="5" fill="#38bdf8" />
        </g>
      );

    case 'ahri':
      // Ahri: Fox ears with pink tufts, whiskers, glowing pink orb aura
      return (
        <g>
          {/* Dark Fox Ears */}
          <rect x="6" y="3" width="5" height="7" fill="#18181b" />
          <rect x="8" y="5" width="3" height="4" fill="#f43f5e" />
          <rect x="21" y="3" width="5" height="7" fill="#18181b" />
          <rect x="21" y="5" width="3" height="4" fill="#f43f5e" />
          {/* Black lush hair */}
          <rect x="8" y="9" width="16" height="6" fill="#18181b" />
          <rect x="5" y="13" width="4" height="11" fill="#27272a" />
          <rect x="23" y="13" width="4" height="11" fill="#27272a" />
          {/* Face */}
          <rect x="9" y="12" width="14" height="10" fill="#fed7aa" />
          {/* Fox Whiskers */}
          <rect x="7" y="17" width="3" height="1" fill="#e11d48" />
          <rect x="7" y="19" width="3" height="1" fill="#e11d48" />
          <rect x="22" y="17" width="3" height="1" fill="#e11d48" />
          <rect x="22" y="19" width="3" height="1" fill="#e11d48" />
          {/* Glowing Eyes */}
          <rect x="11" y="15" width="3" height="2" fill="#ec4899" />
          <rect x="18" y="15" width="3" height="2" fill="#ec4899" />
          {/* Red Lips */}
          <rect x="15" y="20" width="2" height="1" fill="#e11d48" />
          {/* Spirit Orb glow at bottom */}
          <circle cx="16" cy="27" r="4" fill="#38bdf8" />
          <circle cx="16" cy="27" r="2" fill="#ffffff" />
        </g>
      );

    case 'jinx':
      // Jinx: Neon blue twin braids, crazy pink eyes, maniacal grin
      return (
        <g>
          {/* Neon Blue Braids */}
          <rect x="3" y="10" width="4" height="18" fill="#06b6d4" />
          <rect x="25" y="10" width="4" height="18" fill="#06b6d4" />
          <rect x="4" y="14" width="2" height="3" fill="#0891b2" />
          <rect x="26" y="14" width="2" height="3" fill="#0891b2" />
          {/* Bangs */}
          <rect x="7" y="5" width="18" height="7" fill="#06b6d4" />
          <rect x="9" y="8" width="5" height="5" fill="#22d3ee" />
          {/* Pale Face */}
          <rect x="8" y="11" width="16" height="11" fill="#f8fafc" />
          {/* Crazy Bright Magenta Eyes */}
          <rect x="10" y="14" width="3" height="3" fill="#f43f5e" />
          <rect x="11" y="15" width="1" height="1" fill="#ffffff" />
          <rect x="19" y="14" width="3" height="3" fill="#f43f5e" />
          <rect x="20" y="15" width="1" height="1" fill="#ffffff" />
          {/* Wide Smile */}
          <rect x="12" y="19" width="8" height="2" fill="#881337" />
          <rect x="13" y="19" width="6" height="1" fill="#ffffff" />
          {/* Pink Bullet Neck Collar */}
          <rect x="10" y="24" width="12" height="4" fill="#475569" />
          <rect x="13" y="23" width="6" height="4" fill="#ec4899" />
        </g>
      );

    case 'teemo':
      // Teemo: Fluffy yordle, green scout hat, red feather, brass goggles
      return (
        <g>
          {/* Green Scout Hat */}
          <rect x="7" y="3" width="18" height="7" fill="#15803d" />
          <rect x="5" y="7" width="22" height="3" fill="#166534" />
          {/* Red Feather */}
          <rect x="21" y="1" width="3" height="5" fill="#ef4444" />
          {/* Brass Goggles */}
          <rect x="9" y="8" width="6" height="4" fill="#b45309" />
          <rect x="11" y="9" width="3" height="2" fill="#38bdf8" />
          <rect x="17" y="8" width="6" height="4" fill="#b45309" />
          <rect x="19" y="9" width="3" height="2" fill="#38bdf8" />
          {/* Fluffy Fur Face */}
          <rect x="6" y="11" width="20" height="13" fill="#fed7aa" />
          <rect x="4" y="14" width="3" height="6" fill="#fcd34d" />
          <rect x="25" y="14" width="3" height="6" fill="#fcd34d" />
          {/* Happy Closed Smiling Eyes */}
          <path d="M9 16C10 14 12 14 13 16" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 16C20 14 22 14 23 16" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          {/* Black Nose & Smile */}
          <rect x="15" y="18" width="2" height="2" fill="#1c1917" />
          <rect x="14" y="21" width="4" height="1" fill="#78350f" />
        </g>
      );

    case 'garen':
      // Garen: Demacian Silver/Gold Knight, Blue scarf, stern jaw
      return (
        <g>
          {/* Brown warrior hair */}
          <rect x="9" y="4" width="14" height="6" fill="#78350f" />
          <rect x="8" y="7" width="3" height="5" fill="#451a03" />
          {/* Face */}
          <rect x="9" y="9" width="14" height="11" fill="#fed7aa" />
          {/* Determined Eyebrows & Eyes */}
          <rect x="10" y="11" width="4" height="1.5" fill="#451a03" />
          <rect x="18" y="11" width="4" height="1.5" fill="#451a03" />
          <rect x="11" y="13" width="2" height="2" fill="#0284c7" />
          <rect x="19" y="13" width="2" height="2" fill="#0284c7" />
          {/* Heavy Stern Jaw */}
          <rect x="14" y="18" width="4" height="1" fill="#78350f" />
          {/* Demacian Royal Blue Scarf */}
          <rect x="7" y="20" width="18" height="4" fill="#1d4ed8" />
          {/* Gold & Silver Pauldrons */}
          <rect x="4" y="24" width="24" height="6" fill="#94a3b8" />
          <rect x="6" y="23" width="6" height="4" fill="#facc15" />
          <rect x="20" y="23" width="6" height="4" fill="#facc15" />
        </g>
      );

    case 'zed':
      // Zed: Shadow Ninja, silver mask with glowing horizontal slit eyes
      return (
        <g>
          {/* Spiked Silver Helmet */}
          <rect x="9" y="3" width="14" height="7" fill="#64748b" />
          <rect x="6" y="7" width="4" height="8" fill="#475569" />
          <rect x="22" y="7" width="4" height="8" fill="#475569" />
          {/* Dark Faceplate */}
          <rect x="8" y="9" width="16" height="14" fill="#0f172a" />
          {/* Silver Face Mask Plate */}
          <rect x="10" y="16" width="12" height="7" fill="#94a3b8" />
          {/* Glowing Sinister Red Eyes */}
          <rect x="10" y="13" width="5" height="2" fill="#ef4444" />
          <rect x="17" y="13" width="5" height="2" fill="#ef4444" />
          {/* Shadow Shuriken Crest */}
          <rect x="14" y="5" width="4" height="4" fill="#ef4444" />
          {/* Black Ninja Armor Collar */}
          <rect x="5" y="24" width="22" height="6" fill="#020617" />
          <rect x="8" y="25" width="4" height="4" fill="#ef4444" />
          <rect x="20" y="25" width="4" height="4" fill="#ef4444" />
        </g>
      );

    case 'blitzcrank':
      // Blitzcrank: Golden steam golem, glowing yellow round optic eyes, smokestack
      return (
        <g>
          {/* Exhaust Chimney */}
          <rect x="21" y="2" width="4" height="6" fill="#78350f" />
          {/* Golden Brass Head */}
          <rect x="6" y="6" width="20" height="18" fill="#eab308" />
          <rect x="8" y="7" width="16" height="16" fill="#facc15" />
          {/* Heavy Brow */}
          <rect x="8" y="10" width="16" height="3" fill="#a16207" />
          {/* Glowing Circular Yellow Eyes */}
          <rect x="10" y="14" width="4" height="4" fill="#fef08a" />
          <rect x="11" y="15" width="2" height="2" fill="#ffffff" />
          <rect x="18" y="14" width="4" height="4" fill="#fef08a" />
          <rect x="19" y="15" width="2" height="2" fill="#ffffff" />
          {/* Rivets & Steam Grille Mouth */}
          <rect x="12" y="20" width="8" height="2" fill="#78350f" />
          <rect x="13" y="20" width="2" height="2" fill="#000000" />
          <rect x="17" y="20" width="2" height="2" fill="#000000" />
          {/* Iron Torso */}
          <rect x="7" y="25" width="18" height="5" fill="#b45309" />
        </g>
      );

    case 'vi':
      // Vi: Magenta spiky hair, steampunk goggles on head, "VI" tattoo on cheek
      return (
        <g>
          {/* Goggles on Forehead */}
          <rect x="9" y="5" width="6" height="4" fill="#d97706" />
          <rect x="10" y="6" width="4" height="2" fill="#38bdf8" />
          <rect x="17" y="5" width="6" height="4" fill="#d97706" />
          <rect x="18" y="6" width="4" height="2" fill="#38bdf8" />
          {/* Spiky Magenta Hair */}
          <rect x="6" y="2" width="7" height="6" fill="#ec4899" />
          <rect x="19" y="3" width="7" height="5" fill="#f43f5e" />
          <rect x="5" y="8" width="5" height="12" fill="#db2777" />
          {/* Face */}
          <rect x="9" y="9" width="14" height="12" fill="#fed7aa" />
          {/* Blue Eyes & Smirk */}
          <rect x="11" y="13" width="2" height="2" fill="#0284c7" />
          <rect x="19" y="13" width="2" height="2" fill="#0284c7" />
          {/* "VI" Roman Tattoo on Cheek */}
          <rect x="10" y="17" width="1" height="3" fill="#be185d" />
          <rect x="12" y="17" width="1" height="3" fill="#be185d" />
          {/* Smirk */}
          <rect x="15" y="18" width="4" height="1" fill="#be185d" />
          {/* Hextech Collar */}
          <rect x="8" y="22" width="16" height="6" fill="#831843" />
        </g>
      );

    case 'ashe':
      // Ashe: Freljord Frost Archer, dark blue hooded cowl, white hair, icy blue eyes
      return (
        <g>
          {/* Dark Navy Freljord Hood */}
          <rect x="7" y="3" width="18" height="8" fill="#0f172a" />
          <rect x="5" y="7" width="5" height="16" fill="#1e293b" />
          <rect x="22" y="7" width="5" height="16" fill="#1e293b" />
          {/* Icy White Hair peeking out */}
          <rect x="9" y="8" width="14" height="5" fill="#f8fafc" />
          <rect x="7" y="12" width="4" height="8" fill="#e2e8f0" />
          <rect x="21" y="12" width="4" height="8" fill="#e2e8f0" />
          {/* Face */}
          <rect x="10" y="11" width="12" height="10" fill="#fed7aa" />
          {/* Frost Glowing Blue Eyes */}
          <rect x="12" y="14" width="2" height="2" fill="#38bdf8" />
          <rect x="18" y="14" width="2" height="2" fill="#38bdf8" />
          {/* Pale Lips */}
          <rect x="14" y="19" width="4" height="1" fill="#f43f5e" opacity="0.6" />
          {/* Gold Hood Trim & Cloak */}
          <rect x="8" y="22" width="16" height="6" fill="#0284c7" />
          <rect x="14" y="22" width="4" height="6" fill="#fbbf24" />
        </g>
      );

    case 'darius':
      // Darius: Battle general, dark hair with white temple streak, scar, spiked pauldrons
      return (
        <g>
          {/* Short Dark Hair with Streak */}
          <rect x="8" y="4" width="16" height="6" fill="#18181b" />
          <rect x="9" y="5" width="2" height="5" fill="#e2e8f0" />
          {/* Hardened Face */}
          <rect x="9" y="9" width="14" height="11" fill="#fed7aa" />
          {/* Scar through eye */}
          <rect x="11" y="10" width="1" height="6" fill="#dc2626" />
          {/* Fierce Eyes */}
          <rect x="11" y="12" width="2" height="2" fill="#7f1d1d" />
          <rect x="19" y="12" width="2" height="2" fill="#7f1d1d" />
          {/* Heavy Brow */}
          <rect x="10" y="11" width="4" height="1" fill="#18181b" />
          <rect x="18" y="11" width="4" height="1" fill="#18181b" />
          {/* Noxian Spiked Iron Armor */}
          <rect x="4" y="21" width="24" height="8" fill="#450a0a" />
          <rect x="6" y="20" width="5" height="3" fill="#7f1d1d" />
          <rect x="21" y="20" width="5" height="3" fill="#7f1d1d" />
        </g>
      );

    case 'asol':
      // Aurelion Sol: Star Dragon, cosmic blue/purple face, golden celestial crest & eyes
      return (
        <g>
          {/* Cosmic Galaxy Horns/Crest */}
          <rect x="6" y="2" width="5" height="7" fill="#6366f1" />
          <rect x="8" y="4" width="3" height="4" fill="#fbbf24" />
          <rect x="21" y="2" width="5" height="7" fill="#6366f1" />
          <rect x="21" y="4" width="3" height="4" fill="#fbbf24" />
          {/* Celestial Dragon Head */}
          <rect x="8" y="7" width="16" height="14" fill="#312e81" />
          <rect x="9" y="8" width="14" height="12" fill="#4338ca" />
          {/* Golden Crown Jewel */}
          <rect x="14" y="8" width="4" height="3" fill="#facc15" />
          {/* Blazing Star Eyes */}
          <rect x="10" y="13" width="4" height="2" fill="#fbbf24" />
          <rect x="11" y="13" width="2" height="2" fill="#ffffff" />
          <rect x="18" y="13" width="4" height="2" fill="#fbbf24" />
          <rect x="19" y="13" width="2" height="2" fill="#ffffff" />
          {/* Stardust Whiskers */}
          <rect x="5" y="17" width="4" height="1" fill="#818cf8" />
          <rect x="23" y="17" width="4" height="1" fill="#818cf8" />
          {/* Cosmic Void Neck */}
          <rect x="9" y="22" width="14" height="7" fill="#1e1b4b" />
          <circle cx="16" cy="25" r="2" fill="#c084fc" />
        </g>
      );

    case 'lux':
      // Lux: Radiant Blonde, silver tiara, glowing azure eyes, sparkling aura
      return (
        <g>
          {/* Blonde Hair */}
          <rect x="8" y="3" width="16" height="7" fill="#facc15" />
          <rect x="5" y="8" width="4" height="12" fill="#fde047" />
          <rect x="23" y="8" width="4" height="12" fill="#fde047" />
          {/* Silver Crown Tiara */}
          <rect x="10" y="7" width="12" height="2" fill="#e2e8f0" />
          <rect x="15" y="5" width="2" height="3" fill="#38bdf8" />
          {/* Cheerful Face */}
          <rect x="9" y="10" width="14" height="11" fill="#fed7aa" />
          {/* Sparkling Azure Eyes */}
          <rect x="11" y="13" width="3" height="2" fill="#0284c7" />
          <rect x="12" y="13" width="1" height="1" fill="#ffffff" />
          <rect x="18" y="13" width="3" height="2" fill="#0284c7" />
          <rect x="19" y="13" width="1" height="1" fill="#ffffff" />
          {/* Gentle Smile */}
          <rect x="14" y="18" width="4" height="1" fill="#f43f5e" />
          {/* Demacian Light Armor */}
          <rect x="8" y="22" width="16" height="6" fill="#e2e8f0" />
          <rect x="13" y="22" width="6" height="6" fill="#fbbf24" />
        </g>
      );

    case 'heimer':
      // Heimerdinger: Yordle scientist, massive golden afro, giant goggles, glorious mustache
      return (
        <g>
          {/* Giant Orange Afro Hair */}
          <rect x="4" y="2" width="24" height="9" fill="#f97316" />
          <rect x="2" y="6" width="28" height="6" fill="#ea580c" />
          {/* Giant Scientist Goggles */}
          <rect x="6" y="9" width="9" height="6" fill="#334155" />
          <rect x="8" y="10" width="5" height="4" fill="#38bdf8" />
          <rect x="17" y="9" width="9" height="6" fill="#334155" />
          <rect x="19" y="10" width="5" height="4" fill="#38bdf8" />
          {/* Yordle Face */}
          <rect x="8" y="14" width="16" height="8" fill="#fed7aa" />
          {/* Magnificent Brown Mustache */}
          <rect x="7" y="18" width="18" height="4" fill="#78350f" />
          <rect x="6" y="20" width="6" height="3" fill="#92400e" />
          <rect x="20" y="20" width="6" height="3" fill="#92400e" />
          {/* Scientist Lab Coat Collar */}
          <rect x="9" y="24" width="14" height="5" fill="#f8fafc" />
        </g>
      );

    case 'katarina':
      // Katarina: Fiery crimson red hair, left eye vertical battle scar, black leather
      return (
        <g>
          {/* Fiery Crimson Hair */}
          <rect x="7" y="3" width="18" height="7" fill="#dc2626" />
          <rect x="4" y="8" width="5" height="15" fill="#b91c1c" />
          <rect x="23" y="8" width="5" height="15" fill="#b91c1c" />
          {/* Face */}
          <rect x="9" y="9" width="14" height="12" fill="#fed7aa" />
          {/* Left Eye Scar */}
          <rect x="12" y="9" width="1" height="7" fill="#991b1b" />
          {/* Fierce Green Eyes */}
          <rect x="12" y="13" width="2" height="2" fill="#15803d" />
          <rect x="18" y="13" width="2" height="2" fill="#15803d" />
          {/* Smirk */}
          <rect x="14" y="18" width="4" height="1" fill="#991b1b" />
          {/* Black Assassin Leather Collar */}
          <rect x="8" y="22" width="16" height="6" fill="#18181b" />
          <rect x="12" y="23" width="8" height="3" fill="#71717a" />
        </g>
      );

    default:
      return <circle cx="16" cy="16" r="12" fill="#38bdf8" />;
  }
}
