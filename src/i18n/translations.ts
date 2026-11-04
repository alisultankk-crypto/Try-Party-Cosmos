import { Language } from '../types/game';

export interface Translations {
  gameTitle: string;
  gameTagline: string;
  dailyRewardBtn: string;
  inventoryBtn: string;
  rulesBtn: string;
  soundOn: string;
  soundOff: string;
  musicOn: string;
  musicOff: string;
  fullscreen: string;
  exitFullscreen: string;
  campaignMode: string;
  dailyMode: string;
  level: string;
  levelEasy: string;
  levelHard: string;
  levelMaster: string;
  remainingTiles: string;
  points: string;
  hotkeysHint: string;

  // Boosters
  boosterUndo: string;
  boosterUndoDesc: string;
  boosterShuffle: string;
  boosterShuffleDesc: string;
  boosterExtract: string;
  boosterExtractDesc: string;

  // Daily Challenge
  dailyTitle: string;
  dailySubtitle: string;
  bestTime: string;
  speedrunLeaderboard: string;
  rank: string;
  player: string;
  time: string;
  close: string;

  // Inventory
  inventoryTitle: string;
  inventorySubtitle: string;
  totalCollected: string;
  rarityCommon: string;
  rarityRare: string;
  rarityEpic: string;
  rarityLegendary: string;
  dropRateNotice: string;
  unlockedGems: string;
  clickToInspect: string;

  // Daily Login
  dailyLoginTitle: string;
  dailyLoginSubtitle: string;
  day: string;
  claimReward: string;
  claimedToday: string;
  streakDay: string;
  comeBackTomorrow: string;

  // Win Modal
  winTitle: string;
  winDailyTitle: string;
  campaignComplete: string;
  newGemFound: string;
  claimGem: string;
  nextLevel: string;
  playAgain: string;
  shareRecord: string;
  copied: string;

  // Fail Modal (Mashka support)
  failTitle: string;
  failSubtitle: string;
  mashkaComforts: string[];
  reviveBtn: string;
  restartBtn: string;

}

export const TRANSLATIONS: Record<Language, Translations> = {
  ru: {
    gameTitle: 'Try Party: COSMOS',
    gameTagline: 'Космическая головоломка 3-в-ряд с котиками разных пород',
    dailyRewardBtn: 'Ежедневная награда',
    inventoryBtn: 'Инвентарь камней',
    rulesBtn: 'Справка & Клавиши',
    soundOn: 'Звук ВКЛ',
    soundOff: 'Звук ВЫКЛ',
    musicOn: '8-бит Музыка ВКЛ',
    musicOff: '8-бит Музыка ВЫКЛ',
    fullscreen: 'На весь экран',
    exitFullscreen: 'Оконный режим',
    campaignMode: 'Кампания',
    dailyMode: 'Челлендж дня',
    level: 'Уровень',
    levelEasy: 'Разминка',
    levelHard: 'Космический хардкор',
    levelMaster: 'Мастер Бездны',
    remainingTiles: 'Осталось собрать',
    points: 'Очки',
    hotkeysHint: 'Горячие клавиши: [1] Отмена [2] Перемешать [3] Вынуть [M] Звук [B] 8-бит Музыка [F] Полный экран',

    boosterUndo: 'Отмена',
    boosterUndoDesc: 'Вернуть последнюю карту на поле',
    boosterShuffle: 'Перемешать',
    boosterShuffleDesc: 'Перетасовать все свободные карты',
    boosterExtract: 'Вынуть 3',
    boosterExtractDesc: 'Переместить 3 карты в запасную полку',

    dailyTitle: 'Ежедневный Космический Забег',
    dailySubtitle: 'Одинаковая доска для всех призывателей каждые 24 часа!',
    bestTime: 'Твой рекорд дня',
    speedrunLeaderboard: 'Глобальный Топ Спидрана',
    rank: 'Место',
    player: 'Призыватель',
    time: 'Время',
    close: 'Закрыть',

    inventoryTitle: 'Инвентарь Космических Самоцветов',
    inventorySubtitle: 'Драгоценные камни выпадают ровно по 1 штуке за каждую победу на уровне!',
    totalCollected: 'Собрано камней в коллекции',
    rarityCommon: 'Обычный',
    rarityRare: 'Редкий',
    rarityEpic: 'Эпический',
    rarityLegendary: 'Легендарный',
    dropRateNotice: 'Камни хранятся в твоем космическом ранце навсегда!',
    unlockedGems: 'Открыто видов',
    clickToInspect: 'Нажми на кристалл для изучения его космической истории',

    dailyLoginTitle: 'Ежедневная Награда за Вход',
    dailyLoginSubtitle: 'Заходи каждый день, забирай редкие бустеры и драгоценные камни!',
    day: 'День',
    claimReward: 'ЗАБРАТЬ НАГРАДУ!',
    claimedToday: 'Награда уже получена сегодня!',
    streakDay: 'Серия входов',
    comeBackTomorrow: 'Возвращайся завтра за следующим подарком!',

    winTitle: 'ЛЕГЕНДАРНАЯ ПОБЕДА!',
    winDailyTitle: 'ЕЖЕДНЕВНЫЙ ЧЕЛЛЕНДЖ СДАН!',
    campaignComplete: 'Ты прошла все 1000 уровней!',
    newGemFound: 'НОВАЯ НАХОДКА! Получен драгоценный камень:',
    claimGem: 'ПОЛОЖИТЬ В ИНВЕНТАРЬ',
    nextLevel: 'СЛЕДУЮЩИЙ УРОВЕНЬ 🔥',
    playAgain: 'СЫГРАТЬ ЕЩЕ РАЗ',
    shareRecord: 'ПОДЕЛИТЬСЯ РЕЗУЛЬТАТОМ',
    copied: 'СКОПИРОВАНО!',

    failTitle: 'СТАЗИС-ПЕРЕГРУЗКА!',
    failSubtitle: 'Все 7 ячеек заполнены — попробуй собрать тройку или используй бустер.',
    mashkaComforts: [
      'Не расстраивайся, Машка! В космосе бывают черные дыры, в следующий раз точно разнесешь! 💖',
      'Машка, ты была в одном шаге от триумфа! Встряхнись и давай еще разок! ✨',
      'Не вешай нос, Машка! Даже кошки иногда выбирают не ту карточку. Ты сможешь! 🚀',
      'Мы верим в тебя, Машка! Попробуй снова — у тебя получится! ✨',
      'Машка, это была просто коварная гравитация! Жми рестарт и покажи им класс! 🌈',
    ],
    reviveBtn: 'ВОСКРЕСНУТЬ (ВЫНУТЬ 3 СЛОТА)',
    restartBtn: 'ПОПРОБОВАТЬ СНОВА',

  },
  en: {
    gameTitle: 'Try Party: COSMOS',
    gameTagline: 'Cosmic 3-tile puzzle with cats of many breeds',
    dailyRewardBtn: 'Daily Reward',
    inventoryBtn: 'Gem Inventory',
    rulesBtn: 'Help & Hotkeys',
    soundOn: 'Sound ON',
    soundOff: 'Sound OFF',
    musicOn: '8-bit Music ON',
    musicOff: '8-bit Music OFF',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    campaignMode: 'Campaign',
    dailyMode: 'Daily Run',
    level: 'Level',
    levelEasy: 'Warmup',
    levelHard: 'Cosmic Hardcore',
    levelMaster: 'Void Master',
    remainingTiles: 'Remaining',
    points: 'Points',
    hotkeysHint: 'Keyboard shortcuts: [1] Undo [2] Shuffle [3] Extract [M] Mute [B] 8-bit BGM [F] Fullscreen',

    boosterUndo: 'Undo',
    boosterUndoDesc: 'Return last placed tile to the board',
    boosterShuffle: 'Shuffle',
    boosterShuffleDesc: 'Rearrange all free cosmic tiles',
    boosterExtract: 'Extract 3',
    boosterExtractDesc: 'Move 3 tray tiles to reserve shelf',

    dailyTitle: 'Daily Cosmic Speedrun',
    dailySubtitle: 'Identical puzzle layout for all summoners every 24 hours!',
    bestTime: 'Your Daily Best',
    speedrunLeaderboard: 'Global Speedrun Top',
    rank: 'Rank',
    player: 'Summoner',
    time: 'Time',
    close: 'Close',

    inventoryTitle: 'Cosmic Gemstones Inventory',
    inventorySubtitle: 'Exactly 1 rare cosmic gemstone drops for each victorious level clear!',
    totalCollected: 'Total Gems Collected',
    rarityCommon: 'Common',
    rarityRare: 'Rare',
    rarityEpic: 'Epic',
    rarityLegendary: 'Legendary',
    dropRateNotice: 'Collected gemstones are saved forever in your cosmic vault!',
    unlockedGems: 'Discovered Types',
    clickToInspect: 'Click any gem to view its interstellar lore and origin',

    dailyLoginTitle: 'Daily Login Reward',
    dailyLoginSubtitle: 'Log in every day to claim bonus boosters and radiant cosmic gems!',
    day: 'Day',
    claimReward: 'CLAIM REWARD!',
    claimedToday: 'Already claimed today!',
    streakDay: 'Login Streak',
    comeBackTomorrow: 'Come back tomorrow for your next galactic bonus!',

    winTitle: 'LEGENDARY VICTORY!',
    winDailyTitle: 'DAILY CHALLENGE CLEARED!',
    campaignComplete: 'You cleared all 1,000 levels!',
    newGemFound: 'NEW DISCOVERY! Cosmic Gemstone Dropped:',
    claimGem: 'ADD TO INVENTORY',
    nextLevel: 'NEXT LEVEL 🔥',
    playAgain: 'PLAY AGAIN',
    shareRecord: 'SHARE RECORD',
    copied: 'COPIED!',

    failTitle: 'STASIS OVERLOAD!',
    failSubtitle: 'All 7 slots are full—make a match or use a booster.',
    mashkaComforts: [
      'Don’t be sad, Mashka! Even the deepest space has wormholes, you’ll smash it next time! 💖',
      'Keep your spirits high, Mashka! You were one single match away from victory! ✨',
      'Chin up, Mashka! Even cats pick the wrong tile sometimes. You got this! 🚀',
      'We believe in you, Mashka! Give it another try! ✨',
      'It was just sneaky cosmic gravity, Mashka! Hit restart and show them who rules! 🌈',
    ],
    reviveBtn: 'REVIVE (EXTRACT 3 SLOTS)',
    restartBtn: 'TRY AGAIN',

  },
};
