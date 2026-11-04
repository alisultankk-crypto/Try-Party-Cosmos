import { CosmicGem } from '../types/game';

export const COSMIC_GEMS: CosmicGem[] = [
  {
    id: 'freljord_emerald',
    name: {
      ru: 'Изумруд Фрельйорда',
      en: 'Freljord Ice Emerald',
    },
    titleLore: {
      ru: 'Кристаллизованный лед древних ледников, сияющий холодным изумрудным светом.',
      en: 'Crystallized ancient glacier ice glowing with a brisk emerald luminescence.',
    },
    rarity: 'common',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    shape: 'emerald',
    baseDropRate: 0.35,
    coinValue: 20,
  },
  {
    id: 'bandle_topaz',
    name: {
      ru: 'Топаз Бандл Сити',
      en: 'Bandle City Star Topaz',
    },
    titleLore: {
      ru: 'Озорной искрящийся самоцвет йордлов, теплый на ощупь и пахнущий корицей.',
      en: 'A whimsical yordle gemstone warm to the touch, scented like cosmic spice.',
    },
    rarity: 'common',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    shape: 'hexagon',
    baseDropRate: 0.3,
    coinValue: 25,
  },
  {
    id: 'star_ruby',
    name: {
      ru: 'Звездный Рубин Таргона',
      en: 'Targon Star Ruby',
    },
    titleLore: {
      ru: 'Осколок метеорита с вершины горы Таргон, наполненный яростью созвездий.',
      en: 'A celestial meteorite shard from Mount Targon imbued with constellation fury.',
    },
    rarity: 'rare',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    shape: 'diamond',
    baseDropRate: 0.18,
    coinValue: 50,
  },
  {
    id: 'astral_sapphire',
    name: {
      ru: 'Астральный Сапфир Ионии',
      en: 'Ionian Astral Sapphire',
    },
    titleLore: {
      ru: 'Медитативный сапфир, отражающий духовное измерение Первобытных Земель.',
      en: 'A meditative deep sapphire reflecting the ethereal spirit realm of Ionia.',
    },
    rarity: 'rare',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    shape: 'teardrop',
    baseDropRate: 0.15,
    coinValue: 60,
  },
  {
    id: 'void_amethyst',
    name: {
      ru: 'Аметист Бездны',
      en: 'Cosmic Void Amethyst',
    },
    titleLore: {
      ru: 'Таинственный фиолетовый кристалл, пульсирующий энергией червоточин.',
      en: 'A mysterious purple crystal pulsing with the enigmatic gravity of wormholes.',
    },
    rarity: 'epic',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    shape: 'crystal',
    baseDropRate: 0.1,
    coinValue: 120,
  },
  {
    id: 'solar_amber',
    name: {
      ru: 'Солнечный Янтарь Шуримы',
      en: 'Shuriman Sun Amber',
    },
    titleLore: {
      ru: 'Застывшая капля расплавленного золота легендарного Солнечного Диска.',
      en: 'A petrified droplet of liquid solar gold from the Sun Disc of the Ascended.',
    },
    rarity: 'epic',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.7)',
    shape: 'heart',
    baseDropRate: 0.08,
    coinValue: 140,
  },
  {
    id: 'dragon_diamond',
    name: {
      ru: 'Алмаз Небесного Дракона',
      en: 'Aurelion Dragon Diamond',
    },
    titleLore: {
      ru: 'Выкован лично Создателем Звезд во время рождения первых сверхновых.',
      en: 'Forged by the Star Forger himself during the birth of the earliest supernovas.',
    },
    rarity: 'legendary',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.85)',
    shape: 'star',
    baseDropRate: 0.04,
    coinValue: 280,
  },
  {
    id: 'starlight_opal',
    name: {
      ru: 'Опал Звездной Заступницы',
      en: 'Star Guardian Cosmic Opal',
    },
    titleLore: {
      ru: 'Переливается радужным светом надежды, защищая своего владельца от тьмы.',
      en: 'Prismatic opal refracting eternal rainbows of pure hope against the dark void.',
    },
    rarity: 'legendary',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.85)',
    shape: 'orb',
    baseDropRate: 0.02,
    coinValue: 350,
  },
  {
    id: 'hextech_arcane_crystal',
    name: {
      ru: 'Хекстек-Кристалл (Arcane)',
      en: 'Hextech Crystal (Arcane)',
    },
    titleLore: {
      ru: 'Самый редкий мифический кристалл из фильма Arcane! Сияет нестабильной чистой неоновой магией в латунном руническом гироскопе. Выпадает раз за 3 пройденных уровня!',
      en: 'The rarest Mythic gem from the Arcane series! A sphere of pure pulsating raw arcane magic encased in runic brass stabilizer gimbal rings. Drops every 3 levels!',
    },
    rarity: 'mythic',
    color: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.95)',
    shape: 'hextech',
    baseDropRate: 0.0, // Guaranteed drop every 3 levels!
    coinValue: 600,
  },
];

export const HEXTECH_CRYSTAL = COSMIC_GEMS.find((g) => g.id === 'hextech_arcane_crystal')!;

export function getRandomGemDrop(): CosmicGem {
  const rand = Math.random();
  // Standard drops pool (Hextech crystal drops via 3-level streak milestone)
  if (rand < 0.06) {
    const legendary = COSMIC_GEMS.filter((g) => g.rarity === 'legendary');
    return legendary[Math.floor(Math.random() * legendary.length)];
  } else if (rand < 0.24) {
    const epics = COSMIC_GEMS.filter((g) => g.rarity === 'epic');
    return epics[Math.floor(Math.random() * epics.length)];
  } else if (rand < 0.57) {
    const rares = COSMIC_GEMS.filter((g) => g.rarity === 'rare');
    return rares[Math.floor(Math.random() * rares.length)];
  } else {
    const commons = COSMIC_GEMS.filter((g) => g.rarity === 'common');
    return commons[Math.floor(Math.random() * commons.length)];
  }
}
