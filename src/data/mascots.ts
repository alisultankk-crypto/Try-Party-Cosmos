import { MascotId, MascotInfo } from '../types/game';

export const MASCOTS_LIST: MascotInfo[] = [
  {
    id: 'poro',
    name: {
      ru: 'Космический Поро',
      en: 'Cosmic Poro',
    },
    species: {
      ru: 'Поро-астронавт',
      en: 'Astronaut Poro',
    },
    avatarEmoji: '✨',
    soundType: 'squeak',
    coinCost: 0,
    hextechCost: 0,
    description: {
      ru: 'Пушистый космический первопроходец с рожками и язычком. Обожает космические печеньки и всегда поддерживает Машку!',
      en: 'Fluffy space explorer with horns and cute tongue. Always cheers for Mashka!',
    },
    praisePrefix: {
      ru: '',
      en: '',
    },
  },
  {
    id: 'cat',
    name: {
      ru: 'Кошечка Юми',
      en: 'Cosmic Cat Yuumi',
    },
    species: {
      ru: 'Звёздная Кошечка',
      en: 'Star Kitten',
    },
    avatarEmoji: '🐱',
    soundType: 'meow',
    coinCost: 350,
    hextechCost: 1, // 1 Hextech crystal OR 350 coins
    description: {
      ru: 'Грациозная космическая кошечка с хекстек-бубенчиком. Ласково мяукает, мурлычет и нежно восхищается Машкой!',
      en: 'Graceful cosmic kitten with a glowing hextech bell. Meows tenderly and purrs for Mashka!',
    },
    praisePrefix: {
      ru: 'Мяу! ',
      en: 'Meow! ',
    },
  },
  {
    id: 'piglet',
    name: {
      ru: 'Поросёнок Пятачок',
      en: 'Star Piglet',
    },
    species: {
      ru: 'Космо-Хрюша',
      en: 'Cosmic Piglet',
    },
    avatarEmoji: '🐷',
    soundType: 'oink',
    coinCost: 350,
    hextechCost: 1, // 1 Hextech crystal OR 350 coins
    description: {
      ru: 'Озорной розовый поросёнок в звёздном скафандре с хвостиком-пружинкой. Радостно хрюкает от побед Машки!',
      en: 'Cheery pink space piglet in an astronaut suit with a curly tail. Joyfully oinks at Mashka’s wins!',
    },
    praisePrefix: {
      ru: 'Хрю! ',
      en: 'Oink! ',
    },
  },
];

export const COMPLIMENTS_PACK_COST = {
  coins: 200,
  hextech: 1,
  count: 10,
};
