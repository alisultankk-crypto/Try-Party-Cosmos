export interface LevelTheme {
  level: number;
  nameRu: string;
  nameEn: string;
  typesCount: number; // How many champion types appear
  tripletsCount: number; // Total triplets
  bgGradient: string; // CSS gradient for animated background
  nebulaColors: string[]; // Particle colors for galactic nebula
  cardBorder: string;
  cardBg: string;
  cardGlow: string;
  accentColor: string;
}

export const LEVEL_THEMES: Record<number, LevelTheme> = {
  1: {
    level: 1,
    nameRu: 'Неоновый Пульс (Разминка)',
    nameEn: 'Neon Pulse (Warmup)',
    typesCount: 3, // Only 3 types! Easy & satisfying
    tripletsCount: 6, // 18 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #082f49 0%, #020617 80%)',
    nebulaColors: ['#38bdf8', '#0ea5e9', '#0284c7', '#3b82f6'],
    cardBorder: '#38bdf8',
    cardBg: 'from-[#082f49] via-[#0c1e33] to-[#020617]',
    cardGlow: 'rgba(56, 189, 248, 0.5)',
    accentColor: '#38bdf8',
  },
  2: {
    level: 2,
    nameRu: 'Изумрудная Аврора',
    nameEn: 'Emerald Aurora',
    typesCount: 4, // 4 types
    tripletsCount: 8, // 24 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #064e3b 0%, #020617 80%)',
    nebulaColors: ['#10b981', '#34d399', '#059669', '#a7f3d0'],
    cardBorder: '#10b981',
    cardBg: 'from-[#064e3b] via-[#022c22] to-[#020617]',
    cardGlow: 'rgba(16, 185, 129, 0.5)',
    accentColor: '#10b981',
  },
  3: {
    level: 3,
    nameRu: 'Закатный Кибер-Шторм',
    nameEn: 'Sunset Cyber Storm',
    typesCount: 5,
    tripletsCount: 11, // 33 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #581c87 0%, #020617 80%)',
    nebulaColors: ['#c084fc', '#e879f9', '#a855f7', '#f43f5e'],
    cardBorder: '#c084fc',
    cardBg: 'from-[#581c87] via-[#3b0764] to-[#020617]',
    cardGlow: 'rgba(192, 132, 252, 0.5)',
    accentColor: '#c084fc',
  },
  4: {
    level: 4,
    nameRu: 'Солнечная Вспышка Шуримы',
    nameEn: 'Shurima Solar Flare',
    typesCount: 6,
    tripletsCount: 14, // 42 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #713f12 0%, #020617 80%)',
    nebulaColors: ['#facc15', '#fbbf24', '#f59e0b', '#d97706'],
    cardBorder: '#facc15',
    cardBg: 'from-[#713f12] via-[#451a03] to-[#020617]',
    cardGlow: 'rgba(250, 204, 21, 0.5)',
    accentColor: '#facc15',
  },
  5: {
    level: 5,
    nameRu: 'Химтековый Разлом Зауна',
    nameEn: 'Zaunite Chemtech Rift',
    typesCount: 7,
    tripletsCount: 17, // 51 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #14532d 0%, #020617 80%)',
    nebulaColors: ['#84cc16', '#a3e635', '#4d7c0f', '#22c55e'],
    cardBorder: '#84cc16',
    cardBg: 'from-[#14532d] via-[#052e16] to-[#020617]',
    cardGlow: 'rgba(132, 204, 22, 0.5)',
    accentColor: '#84cc16',
  },
  6: {
    level: 6,
    nameRu: 'Глубинный Аметист Бездны',
    nameEn: 'Deep Void Amethyst',
    typesCount: 8,
    tripletsCount: 20, // 60 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #3b0764 0%, #020617 80%)',
    nebulaColors: ['#9333ea', '#7e22ce', '#6b21a8', '#3b0764'],
    cardBorder: '#a855f7',
    cardBg: 'from-[#3b0764] via-[#2e1065] to-[#020617]',
    cardGlow: 'rgba(168, 85, 247, 0.5)',
    accentColor: '#a855f7',
  },
  7: {
    level: 7,
    nameRu: 'Ноксианская Сверхновая',
    nameEn: 'Noxian Supernova',
    typesCount: 9,
    tripletsCount: 23, // 69 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #7f1d1d 0%, #020617 80%)',
    nebulaColors: ['#ef4444', '#f87171', '#dc2626', '#b91c1c'],
    cardBorder: '#ef4444',
    cardBg: 'from-[#7f1d1d] via-[#450a0a] to-[#020617]',
    cardGlow: 'rgba(239, 68, 68, 0.5)',
    accentColor: '#ef4444',
  },
  8: {
    level: 8,
    nameRu: 'Звёздная Сакура',
    nameEn: 'Starlight Sakura Nebula',
    typesCount: 10,
    tripletsCount: 26, // 78 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #831843 0%, #020617 80%)',
    nebulaColors: ['#f472b6', '#ec4899', '#db2777', '#fbcfe8'],
    cardBorder: '#f472b6',
    cardBg: 'from-[#831843] via-[#500724] to-[#020617]',
    cardGlow: 'rgba(244, 114, 182, 0.5)',
    accentColor: '#f472b6',
  },
  9: {
    level: 9,
    nameRu: 'Абсолютный Ноль Фрельйорда',
    nameEn: 'Absolute Zero Frost',
    typesCount: 11,
    tripletsCount: 30, // 90 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #164e63 0%, #020617 80%)',
    nebulaColors: ['#22d3ee', '#67e8f9', '#0891b2', '#cffafe'],
    cardBorder: '#22d3ee',
    cardBg: 'from-[#164e63] via-[#083344] to-[#020617]',
    cardGlow: 'rgba(34, 211, 238, 0.6)',
    accentColor: '#22d3ee',
  },
  10: {
    level: 10,
    nameRu: 'Сингулярность Аурелиона Сола 👑',
    nameEn: 'Aurelion Sol Singularity 👑',
    typesCount: 12,
    tripletsCount: 35, // 105 tiles
    bgGradient: 'radial-gradient(ellipse at 50% 40%, #312e81 0%, #020617 80%)',
    nebulaColors: ['#fbbf24', '#f43f5e', '#a855f7', '#38bdf8', '#34d399'],
    cardBorder: '#fbbf24',
    cardBg: 'from-[#312e81] via-[#1e1b4b] to-[#020617]',
    cardGlow: 'rgba(251, 191, 36, 0.8)',
    accentColor: '#fbbf24',
  },
};
