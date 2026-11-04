import { MascotId } from '../types/game';
import { puzzleSounds } from './puzzleSounds';

export interface PoroPraisePhrase {
  id: number;
  flag: string;
  langName: string;
  text: string;
  speechText: string;
  bcp47: string;
  phonetic?: string;
  isExclusive?: boolean;
}

export const PORO_15_PRAISES: PoroPraisePhrase[] = [
  {
    id: 1,
    flag: '🇷🇺',
    langName: 'Русский',
    text: 'Умница, Машка! 💖',
    speechText: 'Умница, Машка!',
    bcp47: 'ru-RU',
    phonetic: 'Умница, Машка!',
  },
  {
    id: 2,
    flag: '🇬🇧',
    langName: 'English',
    text: 'Clever Mashka! 🌟',
    speechText: 'Clever Mashka!',
    bcp47: 'en-US',
    phonetic: 'Клевер Машка!',
  },
  {
    id: 3,
    flag: '🇫🇷',
    langName: 'Français',
    text: 'Bravo Machka ! 🥐',
    speechText: 'Bravo Machka !',
    bcp47: 'fr-FR',
    phonetic: 'Браво Машка!',
  },
  {
    id: 4,
    flag: '🇩🇪',
    langName: 'Deutsch',
    text: 'Super gemacht, Maschka! 🥨',
    speechText: 'Super gemacht, Maschka!',
    bcp47: 'de-DE',
    phonetic: 'Зупер гемахт, Машка!',
  },
  {
    id: 5,
    flag: '🇪🇸',
    langName: 'Español',
    text: '¡Bien hecho, Mashka! 💃',
    speechText: '¡Bien hecho, Mashka!',
    bcp47: 'es-ES',
    phonetic: 'Бьен эчо, Машка!',
  },
  {
    id: 6,
    flag: '🇮🇹',
    langName: 'Italiano',
    text: 'Bravissima Mashka! 🍕',
    speechText: 'Bravissima Mashka!',
    bcp47: 'it-IT',
    phonetic: 'Брависсима Машка!',
  },
  {
    id: 7,
    flag: '🇯🇵',
    langName: '日本語',
    text: 'よくやったね、マシュカ！ 🌸',
    speechText: 'よくやったね、マシュカ！',
    bcp47: 'ja-JP',
    phonetic: 'Йоку ятта нэ, Машка!',
  },
  {
    id: 8,
    flag: '🇰🇷',
    langName: '한국어',
    text: '대단해, 마쉬카! 🚀',
    speechText: '대단해, 마쉬카!',
    bcp47: 'ko-KR',
    phonetic: 'Тэданхэ, Машка!',
  },
  {
    id: 9,
    flag: '🇨🇳',
    langName: '中文',
    text: '太棒了，玛莎！ 🐼',
    speechText: '太棒了，玛莎！',
    bcp47: 'zh-CN',
    phonetic: 'Тай бан лэ, Маша!',
  },
  {
    id: 10,
    flag: '🇧🇷',
    langName: 'Português',
    text: 'Muito bem, Mashka! 🦜',
    speechText: 'Muito bem, Mashka!',
    bcp47: 'pt-BR',
    phonetic: 'Муйто бем, Машка!',
  },
  {
    id: 11,
    flag: '🇹🇷',
    langName: 'Türkçe',
    text: 'Aferin sana, Maşka! 🧿',
    speechText: 'Aferin sana, Maşka!',
    bcp47: 'tr-TR',
    phonetic: 'Аферин сана, Машка!',
  },
  {
    id: 12,
    flag: '🇵🇱',
    langName: 'Polski',
    text: 'Wspaniale, Maszka! 🦅',
    speechText: 'Wspaniale, Maszka!',
    bcp47: 'pl-PL',
    phonetic: 'Вспаняле, Машка!',
  },
  {
    id: 13,
    flag: '🇬🇷',
    langName: 'Ελληνικά',
    text: 'Μπράβο Μάσκα! 🏛️',
    speechText: 'Μπράβο Μάσκα!',
    bcp47: 'el-GR',
    phonetic: 'Браво Маска!',
  },
  {
    id: 14,
    flag: '🇸🇦',
    langName: 'العربية',
    text: 'أحسنتِ يا ماشكا! 🌙',
    speechText: 'أحسنتِ يا ماشكا!',
    bcp47: 'ar-SA',
    phonetic: 'Ахсанти я Машка!',
  },
  {
    id: 15,
    flag: '🇮🇳',
    langName: 'हिन्दी',
    text: 'शाबाश माशका! 🪷',
    speechText: 'शाबाश माशका!',
    bcp47: 'hi-IN',
    phonetic: 'Шабаш Машка!',
  },
];

// 🎁 10 Эксклюзивных Супер-Комплиментов для Машки от Зверят (покупаются за Хекстек-кристалл или монеты)
export const EXCLUSIVE_MASHKA_10_COMPLIMENTS: PoroPraisePhrase[] = [
  {
    id: 101,
    flag: '🌟',
    langName: 'Хекстек-Свет',
    text: 'Машка, ты сияешь ярче всех звёзд галактики! ✨',
    speechText: 'Машка, ты сияешь ярче всех звёзд галактики!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 102,
    flag: '🚀',
    langName: 'Космо-Скорость',
    text: 'Невероятная игра, Машка, твоя реакция просто космос! 💫',
    speechText: 'Невероятная игра, Машка, твоя реакция просто космос!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 103,
    flag: '👑',
    langName: 'Королева Вселенной',
    text: 'Машенька — абсолютная чемпионка этой галактики! 🏆',
    speechText: 'Машенька — абсолютная чемпионка этой галактики!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 104,
    flag: '🐾',
    langName: 'Любовь Зверят',
    text: 'Все котики и поро Вселенной мурчат от восторга твоей победе! 🐱💖',
    speechText: 'Все котики и поро Вселенной мурчат от восторга твоей победе!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 105,
    flag: '🧠',
    langName: 'Гениальный Разум',
    text: 'Машка, твоя сообразительность решает даже невозможные уровни! ⚡',
    speechText: 'Машка, твоя сообразительность решает даже невозможные уровни!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 106,
    flag: '💎',
    langName: 'Магия Arcane',
    text: 'Хекстек-магия меркнет перед твоим обаянием, Машка! 🌌',
    speechText: 'Хекстек магия меркнет перед твоим обаянием, Машка!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 107,
    flag: '🛸',
    langName: 'Звездный Флот',
    text: 'Машка, ты суперзвезда, тобой гордится вся космическая база! 🌠',
    speechText: 'Машка, ты суперзвезда, тобой гордится вся космическая база!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 108,
    flag: '🥇',
    langName: 'Золотой Кубок',
    text: 'Золотой кубок космоса безоговорочно принадлежит Машке! 🥇',
    speechText: 'Золотой кубок космоса безоговорочно принадлежит Машке!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 109,
    flag: '❄️',
    langName: 'Тепло Сердца',
    text: 'Машенька, твоя доброта растопит даже ледяные кристаллы Фрельйорда! 💖',
    speechText: 'Машенька, твоя доброта растопит даже ледяные кристаллы Фрельйорда!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
  {
    id: 110,
    flag: '🎆',
    langName: 'Хекстек-Триумф',
    text: 'Ура Машке! Тройной хекстек-салют в твою честь! 🎆🎉',
    speechText: 'Ура Машке! Тройной хекстек салют в твою честь!',
    bcp47: 'ru-RU',
    isExclusive: true,
  },
];

let lastPraiseIndex = -1;
let lastExclusiveIndex = -1;

/**
 * Speaks a praise in one of the 15 languages (or exclusive compliments pack)
 * adapted to the active mascot (Poro, Cat, Piglet).
 */
export function speakMascotPraise(
  mascot: MascotId = 'poro',
  forceIndex?: number,
  useExclusive: boolean = false
): PoroPraisePhrase {
  let item: PoroPraisePhrase;

  if (useExclusive) {
    let eIdx = forceIndex;
    if (eIdx === undefined || eIdx < 0 || eIdx >= EXCLUSIVE_MASHKA_10_COMPLIMENTS.length) {
      do {
        eIdx = Math.floor(Math.random() * EXCLUSIVE_MASHKA_10_COMPLIMENTS.length);
      } while (eIdx === lastExclusiveIndex && EXCLUSIVE_MASHKA_10_COMPLIMENTS.length > 1);
    }
    lastExclusiveIndex = eIdx;
    item = EXCLUSIVE_MASHKA_10_COMPLIMENTS[eIdx];
  } else {
    let idx = forceIndex;
    if (idx === undefined || idx < 0 || idx >= PORO_15_PRAISES.length) {
      do {
        idx = Math.floor(Math.random() * PORO_15_PRAISES.length);
      } while (idx === lastPraiseIndex && PORO_15_PRAISES.length > 1);
    }
    lastPraiseIndex = idx;
    item = PORO_15_PRAISES[idx];
  }

  // Play animal SFX
  if (mascot === 'cat') {
    puzzleSounds.playCatMeow();
  } else if (mascot === 'piglet') {
    puzzleSounds.playPigletOink();
  } else {
    puzzleSounds.playPoroSqueak();
  }

  // Adjust vocal pitch for animal character
  let animalSpeech = item.speechText;
  let animalPitch = 1.35;
  let prefix = '';

  if (mascot === 'cat') {
    animalPitch = 1.6; // High, sweet and kitten-like
    prefix = 'Мяу! ';
    animalSpeech = `${prefix}${item.speechText}`;
  } else if (mascot === 'piglet') {
    animalPitch = 1.25; // Cheerful, bouncy piglet
    prefix = 'Хрю! ';
    animalSpeech = `${prefix}${item.speechText}`;
  }

  // Browser speech synthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(animalSpeech);
      utterance.lang = item.bcp47;
      utterance.pitch = animalPitch;
      utterance.rate = 1.05;
      utterance.volume = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.startsWith(item.bcp47.slice(0, 2)) || v.lang === item.bcp47
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors gracefully
    }
  }

  return {
    ...item,
    text: prefix ? `${prefix}${item.text}` : item.text,
  };
}

// Backwards compatibility alias
export function speakPoroPraise(forceIndex?: number): PoroPraisePhrase {
  return speakMascotPraise('poro', forceIndex, false);
}
