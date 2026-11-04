/**
 * Try Party: COSMOS — Ultimate Cosmic 3-in-a-Row Party Game.
 * Features:
 * - 10 Progressive Levels with unique color themes, animated backgrounds, and card styles
 * - Progressive tile unlock: Level 1 starts with only 3 champion types, gradually adding more up to 12
 * - Procedural Space Dubstep BGM with wobble bass, half-time beat, and cyber SFX
 * - Poro speaks "УМНИЦА МАШКА" ALOUD in 15 languages via Web Speech API
 * - Cleaned top area (removed distracting top tabs)
 * - Side Dock on the screen edge with Gem Inventory, Daily Rewards, Dubstep, Downloads, & Settings
 * - Persistent level progress (preserved even after defeat, with level replay and selector)
 * - Mobile Packages (.APK, .AAB, Solana Seeker dApp package, and iOS PWA install)
 * - Smooth level advancement upon victory
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  TileItemData,
  BoostersState,
  TileType,
  GameMode,
  MagicEffectType,
  Language,
  GemInventory,
  DailyLoginState,
  CosmicGem,
  MascotId,
} from './types/game';
import {
  generateLevel,
  generateDailyChallenge,
  updateCoveredState,
  getTodayDateString,
} from './game/levelGenerator';
import { LEVEL_THEMES } from './types/levelTheme';
import { TileItem } from './components/TileItem';
import { SlotTray } from './components/SlotTray';
import { BoosterBar } from './components/BoosterBar';
import { ReserveShelf } from './components/ReserveShelf';
import { CosmicPoro } from './components/CosmicPoro';
import { GalacticNebulaBackground } from './components/GalacticNebulaBackground';
import { MagicVfxOverlay, MagicBurstTrigger } from './components/MagicVfxOverlay';
import { CHAMPION_METAS } from './components/FunnyCosmicChamps';
import { ScoreDisplay, ScoreFloater } from './components/ScoreDisplay';
import { FailModal } from './components/FailModal';
import { WinModal } from './components/WinModal';
import { InventoryModal } from './components/InventoryModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { MobilePackagesModal } from './components/MobilePackagesModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { BrowserHelpModal } from './components/BrowserHelpModal';
import { BrowserWelcomeBanner } from './components/BrowserWelcomeBanner';
import { SideDock } from './components/SideDock';
import { puzzleSounds } from './audio/puzzleSounds';
import { TRANSLATIONS } from './i18n/translations';
import { getRandomGemDrop, HEXTECH_CRYSTAL } from './data/cosmicGems';
import { speakMascotPraise, speakPoroPraise, PoroPraisePhrase } from './audio/poroVoice';
import { usePWAInstall } from './hooks/usePWAInstall';

function findLastTypeIndex(items: TileItemData[], targetType: TileType): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].type === targetType) return i;
  }
  return -1;
}

export default function App() {
  // 1. Language state (ru / en)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('tryparty_lang') as Language;
      if (saved === 'ru' || saved === 'en') return saved;
    } catch {}
    return 'ru';
  });

  const t = TRANSLATIONS[lang];

  const handleToggleLang = () => {
    const next: Language = lang === 'ru' ? 'en' : 'ru';
    setLang(next);
    try {
      localStorage.setItem('tryparty_lang', next);
    } catch {}
  };

  // 2. Progressive 10-Level System & Persistent Progress
  const [level, setLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tryparty_current_level');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 10) return parsed;
      }
    } catch {}
    return 1;
  });

  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tryparty_unlocked_level');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 10) return parsed;
      }
    } catch {}
    return 1;
  });

  const currentTheme = LEVEL_THEMES[level] || LEVEL_THEMES[1];

  // Modals state
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);
  const [showDailyRewardModal, setShowDailyRewardModal] = useState<boolean>(false);
  const [showMobilePackagesModal, setShowMobilePackagesModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true);

  // Audio State (Dubstep Engine)
  const [isMuted, setIsMuted] = useState<boolean>(puzzleSounds.getMuted());
  const [bgmActive, setBgmActive] = useState<boolean>(false);

  // Browser Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Board state
  const [tiles, setTiles] = useState<TileItemData[]>([]);
  const [slot, setSlot] = useState<TileItemData[]>([]);
  const [shelf, setShelf] = useState<TileItemData[]>([]);
  const [matchingIds, setMatchingIds] = useState<string[]>([]);
  const [history, setHistory] = useState<{ tileId: string; fromBoardX: number; fromBoardY: number }[]>([]);

  const [boosters, setBoosters] = useState<BoostersState>({
    undo: 4,
    shuffle: 4,
    extract: 4,
  });

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [hasRevive, setHasRevive] = useState<boolean>(true);

  // Magic VFX Trigger State
  const [magicBurst, setMagicBurst] = useState<MagicBurstTrigger | null>(null);

  // 💎 Gem Inventory
  const [gemInventory, setGemInventory] = useState<GemInventory>(() => {
    try {
      const saved = localStorage.getItem('cosmic_gems_inventory');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      freljord_emerald: 1,
    };
  });
  const [droppedGem, setDroppedGem] = useState<CosmicGem | null>(null);

  // 🪙 Gold Coins State
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tryparty_coins');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 150; // Starting 150 gold coins
  });

  // 🐾 Active Mascot & Owned Animals (Poro, Cat, Piglet)
  const [activeMascot, setActiveMascot] = useState<MascotId>(() => {
    try {
      const saved = localStorage.getItem('tryparty_active_mascot') as MascotId;
      if (saved === 'poro' || saved === 'cat' || saved === 'piglet') return saved;
    } catch {}
    return 'poro';
  });

  const [ownedMascots, setOwnedMascots] = useState<MascotId[]>(() => {
    try {
      const saved = localStorage.getItem('tryparty_owned_mascots');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['poro'];
  });

  // 💖 10 Compliments Pack Counter
  const [complimentsRemaining, setComplimentsRemaining] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tryparty_compliments_rem');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 0;
  });

  // ⚡ 3-Levels Progress for Arcane Hextech Crystal Drop
  const [threeLevelProgress, setThreeLevelProgress] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tryparty_3level_progress');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 0;
  });

  const handleExchangeGem = (gemId: string, count: number, totalCoinsEarned: number) => {
    setGemInventory((prev) => {
      const current = prev[gemId] || 0;
      const nextCount = Math.max(0, current - count);
      const next = { ...prev, [gemId]: nextCount };
      try { localStorage.setItem('cosmic_gems_inventory', JSON.stringify(next)); } catch {}
      return next;
    });
    setCoins((prev) => {
      const updated = prev + totalCoinsEarned;
      try { localStorage.setItem('tryparty_coins', String(updated)); } catch {}
      return updated;
    });
  };

  const handleExchangeDuplicates = (totalCoinsEarned: number, updatedInventory: GemInventory) => {
    setGemInventory(updatedInventory);
    try { localStorage.setItem('cosmic_gems_inventory', JSON.stringify(updatedInventory)); } catch {}
    setCoins((prev) => {
      const updated = prev + totalCoinsEarned;
      try { localStorage.setItem('tryparty_coins', String(updated)); } catch {}
      return updated;
    });
  };

  const handleBuyMascotWithCoins = (mascotId: MascotId, cost: number) => {
    if (coins < cost) return;
    setCoins((prev) => {
      const updated = prev - cost;
      try { localStorage.setItem('tryparty_coins', String(updated)); } catch {}
      return updated;
    });
    setOwnedMascots((prev) => {
      if (prev.includes(mascotId)) return prev;
      const next = [...prev, mascotId];
      try { localStorage.setItem('tryparty_owned_mascots', JSON.stringify(next)); } catch {}
      return next;
    });
    setActiveMascot(mascotId);
    try { localStorage.setItem('tryparty_active_mascot', mascotId); } catch {}
  };

  const handleBuyMascotWithHextech = (mascotId: MascotId) => {
    const currentHextech = gemInventory['hextech_arcane_crystal'] || 0;
    if (currentHextech < 1) return;
    setGemInventory((prev) => {
      const next = { ...prev, hextech_arcane_crystal: Math.max(0, (prev['hextech_arcane_crystal'] || 0) - 1) };
      try { localStorage.setItem('cosmic_gems_inventory', JSON.stringify(next)); } catch {}
      return next;
    });
    setOwnedMascots((prev) => {
      if (prev.includes(mascotId)) return prev;
      const next = [...prev, mascotId];
      try { localStorage.setItem('tryparty_owned_mascots', JSON.stringify(next)); } catch {}
      return next;
    });
    setActiveMascot(mascotId);
    try { localStorage.setItem('tryparty_active_mascot', mascotId); } catch {}
  };

  const handleSelectMascot = (mascotId: MascotId) => {
    setActiveMascot(mascotId);
    try { localStorage.setItem('tryparty_active_mascot', mascotId); } catch {}
  };

  const handleBuyComplimentsWithCoins = (cost: number, count: number) => {
    if (coins < cost) return;
    setCoins((prev) => {
      const updated = prev - cost;
      try { localStorage.setItem('tryparty_coins', String(updated)); } catch {}
      return updated;
    });
    setComplimentsRemaining((prev) => {
      const updated = prev + count;
      try { localStorage.setItem('tryparty_compliments_rem', String(updated)); } catch {}
      return updated;
    });
  };

  const handleBuyComplimentsWithHextech = (count: number) => {
    const currentHextech = gemInventory['hextech_arcane_crystal'] || 0;
    if (currentHextech < 1) return;
    setGemInventory((prev) => {
      const next = { ...prev, hextech_arcane_crystal: Math.max(0, (prev['hextech_arcane_crystal'] || 0) - 1) };
      try { localStorage.setItem('cosmic_gems_inventory', JSON.stringify(next)); } catch {}
      return next;
    });
    setComplimentsRemaining((prev) => {
      const updated = prev + count;
      try { localStorage.setItem('tryparty_compliments_rem', String(updated)); } catch {}
      return updated;
    });
  };

  // 🎁 Daily Login State
  const [dailyLogin, setDailyLogin] = useState<DailyLoginState>(() => {
    const today = getTodayDateString();
    try {
      const saved = localStorage.getItem('cosmic_daily_login');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastClaimDate === today) {
          return parsed;
        } else {
          return {
            lastClaimDate: today,
            streak: parsed.hasClaimedToday ? (parsed.streak % 7) + 1 : 1,
            hasClaimedToday: false,
          };
        }
      }
    } catch {}
    return {
      lastClaimDate: today,
      streak: 1,
      hasClaimedToday: false,
    };
  });

  // 🗣️ Poro Voice Praise State ("УМНИЦА МАШКА" in 15 languages)
  const [poroPraise, setPoroPraise] = useState<PoroPraisePhrase | null>(null);
  const [isPoroCheering, setIsPoroCheering] = useState<boolean>(false);
  const poroPraiseTimerRef = useRef<number | null>(null);
  const matchCounterRef = useRef<number>(0);

  // Oracle Hint state
  const [hintedTileTypes, setHintedTileTypes] = useState<TileType[]>([]);

  // Score HUD & Floaters
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cosmic_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [combo, setCombo] = useState<number>(1);
  const [floaters, setFloaters] = useState<ScoreFloater[]>([]);
  const comboRef = useRef<number>(1);

  // PWA install hook
  const { isInstallable: isPwaInstallable, install: installPwa } = usePWAInstall();

  // Responsive scale calculator for comfortable fullscreen stretch
  const [boardScale, setBoardScale] = useState<number>(1);

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let scale = 1;
      if (w >= 1200 && h >= 750) {
        scale = 1.3;
      } else if (w >= 768 && h >= 680) {
        scale = 1.18;
      } else if (w >= 480 && h >= 640) {
        scale = 1.08;
      } else if (w < 380 || h < 600) {
        scale = 0.88;
      }
      setBoardScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Save current level when changed
  useEffect(() => {
    try {
      localStorage.setItem('tryparty_current_level', String(level));
    } catch {}
    startLevelGame(level);
  }, [level]);

  // Load level layout
  const startLevelGame = (targetLevel: number) => {
    setMagicBurst(null);
    setDroppedGem(null);

    const newTiles = generateLevel(targetLevel);
    setTiles(newTiles);
    setSlot([]);
    setShelf([]);
    setMatchingIds([]);
    setHistory([]);
    setIsGameOver(false);
    setIsVictory(false);
    setHasRevive(true);
    setHintedTileTypes([]);
    comboRef.current = 1;
    setCombo(1);
    setFloaters([]);

    // Generous booster allocation so player always has tactical tools
    setBoosters({
      undo: 4,
      shuffle: 4,
      extract: 4,
    });
  };

  // Handle tile tap on the board
  const handleTileClick = (clickedTile: TileItemData) => {
    if (clickedTile.isCovered || clickedTile.inSlot || clickedTile.inShelf || isGameOver || isVictory) {
      return;
    }
    if (slot.length >= 7) return;

    if (showWelcomeBanner) {
      setShowWelcomeBanner(false);
    }

    puzzleSounds.playTileTap();

    setHistory((prev) => [
      ...prev,
      { tileId: clickedTile.id, fromBoardX: clickedTile.x, fromBoardY: clickedTile.y },
    ]);

    const updatedTiles = tiles.map((t) =>
      t.id === clickedTile.id ? { ...t, inSlot: true } : t
    );
    updateCoveredState(updatedTiles);
    setTiles(updatedTiles);

    const newSlot = [...slot];
    const sameTypeIndex = findLastTypeIndex(newSlot, clickedTile.type);
    const tileForSlot = { ...clickedTile, inSlot: true };

    if (sameTypeIndex !== -1) {
      newSlot.splice(sameTypeIndex + 1, 0, tileForSlot);
    } else {
      newSlot.push(tileForSlot);
    }

    setSlot(newSlot);
    checkSlotMatches(newSlot, updatedTiles);
  };

  // Handle clicking a tile on the Reserve Shelf
  const handleShelfTileClick = (shelfTile: TileItemData) => {
    if (slot.length >= 7 || isGameOver || isVictory) return;

    puzzleSounds.playTileTap();
    const newShelf = shelf.filter((t) => t.id !== shelfTile.id);
    setShelf(newShelf);

    const newSlot = [...slot];
    const sameTypeIndex = findLastTypeIndex(newSlot, shelfTile.type);
    const tileForSlot = { ...shelfTile, inSlot: true, inShelf: false };

    if (sameTypeIndex !== -1) {
      newSlot.splice(sameTypeIndex + 1, 0, tileForSlot);
    } else {
      newSlot.push(tileForSlot);
    }

    setSlot(newSlot);
    checkSlotMatches(newSlot, tiles);
  };

  // Check 3 matching champions in tray
  const checkSlotMatches = (currentSlot: TileItemData[], currentTiles: TileItemData[]) => {
    const counts: { [type: string]: TileItemData[] } = {};
    for (const item of currentSlot) {
      if (!counts[item.type]) counts[item.type] = [];
      counts[item.type].push(item);
    }

    let matchFound = false;
    for (const rawType in counts) {
      const type = rawType as TileType;
      if (counts[type].length >= 3) {
        matchFound = true;
        const matchingTiles = counts[type].slice(0, 3);
        const matchIds = matchingTiles.map((t) => t.id);
        setMatchingIds(matchIds);

        const championMeta = CHAMPION_METAS[type];
        const magicType: MagicEffectType = championMeta ? championMeta.magic : 'arcane';
        const currentCombo = comboRef.current;
        const earnedPoints = 350 * currentCombo;

        puzzleSounds.playMagicEffect(magicType, currentCombo);
        comboRef.current++;
        setCombo(comboRef.current);

        // 🗣️ Mascot speaks "УМНИЦА МАШКА" in 15 languages!
        matchCounterRef.current += 1;
        const useSpecial = complimentsRemaining > 0;
        if (useSpecial) {
          setComplimentsRemaining((prev) => {
            const next = Math.max(0, prev - 1);
            try { localStorage.setItem('tryparty_compliments_rem', String(next)); } catch {}
            return next;
          });
        }
        const praise = speakMascotPraise(activeMascot, undefined, useSpecial);
        setPoroPraise(praise);
        if (poroPraiseTimerRef.current) clearTimeout(poroPraiseTimerRef.current);
        poroPraiseTimerRef.current = window.setTimeout(() => {
          setPoroPraise(null);
        }, 4500);

        setScore((prev) => {
          const next = prev + earnedPoints;
          setHighScore((curHigh) => {
            const newHigh = Math.max(curHigh, next);
            try {
              localStorage.setItem('cosmic_high_score', String(newHigh));
            } catch {}
            return newHigh;
          });
          return next;
        });

        // Score floater
        const floaterX = window.innerWidth / 2 + (Math.random() - 0.5) * 80;
        const floaterY = window.innerHeight - 150;
        const newFloater: ScoreFloater = {
          id: `${Date.now()}_${Math.random()}`,
          points: earnedPoints,
          combo: currentCombo,
          text:
            currentCombo >= 3
              ? `🔥 MEGA-DROP x${currentCombo}! +${earnedPoints}`
              : currentCombo === 2
              ? `⚡ DUBSTEP x2! +${earnedPoints}`
              : `+${earnedPoints} PTS!`,
          x: floaterX,
          y: floaterY,
        };
        setFloaters((prev) => [...prev, newFloater]);
        setTimeout(() => {
          setFloaters((prev) => prev.filter((f) => f.id !== newFloater.id));
        }, 1100);

        const burstX = window.innerWidth / 2;
        const burstY = window.innerHeight - 100;
        setMagicBurst({
          id: `${Date.now()}_${Math.random()}`,
          type: magicType,
          x: burstX,
          y: burstY,
        });

        setIsPoroCheering(true);
        setTimeout(() => setIsPoroCheering(false), 900);

        setTimeout(() => {
          setSlot((prev) => prev.filter((t) => !matchIds.includes(t.id)));
          setMatchingIds([]);

          const afterElimination = currentTiles.map((t) =>
            matchIds.includes(t.id) ? { ...t, isEliminated: true, inSlot: false } : t
          );
          setTiles(afterElimination);

          const remainingOnBoard = afterElimination.filter(
            (t) => !t.isEliminated && !t.inSlot && !t.inShelf
          );
          if (remainingOnBoard.length === 0 && shelf.length === 0) {
            handleVictory();
          }
        }, 220);
        break;
      }
    }

    if (!matchFound) {
      if (currentSlot.length >= 7) {
        setTimeout(() => {
          setIsGameOver(true);
          puzzleSounds.playDefeat();
        }, 280);
      } else if (currentSlot.length === 6) {
        puzzleSounds.playSlotWarning();
      }
    }
  };

  // Victory Handler
  const handleVictory = () => {
    setIsVictory(true);
    puzzleSounds.playVictory();

    // 🪙 Reward 50 gold coins per victory
    const coinsWon = 50;
    setCoins((prev) => {
      const updated = prev + coinsWon;
      try { localStorage.setItem('tryparty_coins', String(updated)); } catch {}
      return updated;
    });

    // ⚡ Check if 3-levels milestone is met for the Hextech Crystal from Arcane!
    const newProgress = threeLevelProgress + 1;
    let dropped: CosmicGem;
    if (newProgress >= 3 || level % 3 === 0) {
      dropped = HEXTECH_CRYSTAL;
      setThreeLevelProgress(0);
      try { localStorage.setItem('tryparty_3level_progress', '0'); } catch {}
      puzzleSounds.playHextechSurge();
    } else {
      dropped = getRandomGemDrop();
      setThreeLevelProgress(newProgress);
      try { localStorage.setItem('tryparty_3level_progress', String(newProgress)); } catch {}
    }

    setDroppedGem(dropped);
    setGemInventory((prev) => {
      const next = { ...prev, [dropped.id]: (prev[dropped.id] || 0) + 1 };
      try {
        localStorage.setItem('cosmic_gems_inventory', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Mascot announces victory aloud
    const victoryPraise = speakMascotPraise(activeMascot, 0, complimentsRemaining > 0);
    setPoroPraise(victoryPraise);

    // Unlock next level in persistent progress
    const nextLvl = Math.min(level + 1, 10);
    setUnlockedLevel((prev) => {
      const updated = Math.max(prev, nextLvl);
      try {
        localStorage.setItem('tryparty_unlocked_level', String(updated));
      } catch {}
      return updated;
    });

    setMagicBurst({
      id: `victory_${Date.now()}`,
      type: 'starlight',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const victoryBonus = level * 2500;
    setScore((prev) => prev + victoryBonus);
  };

  // Transition to Next Level (Fixing previous bug!)
  const handleAdvanceToNextLevel = () => {
    setIsVictory(false);
    const nextLvl = level < 10 ? level + 1 : 1;
    setLevel(nextLvl);
    // startLevelGame is automatically called by useEffect([level])
  };

  // Booster: Extract 3
  const handleExtractBooster = () => {
    if (boosters.extract <= 0 || slot.length === 0) return;

    puzzleSounds.playBooster();
    setBoosters((prev) => ({ ...prev, extract: prev.extract - 1 }));

    const extractCount = Math.min(3, slot.length);
    const toExtract = slot.slice(0, extractCount).map((t) => ({ ...t, inSlot: false, inShelf: true }));
    const remainingSlot = slot.slice(extractCount);

    setSlot(remainingSlot);
    setShelf((prev) => [...prev, ...toExtract]);
  };

  // Booster: Undo
  const handleUndoBooster = () => {
    if (boosters.undo <= 0 || history.length === 0 || slot.length === 0) return;

    puzzleSounds.playBooster();
    setBoosters((prev) => ({ ...prev, undo: prev.undo - 1 }));

    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    setSlot((prev) => prev.filter((t) => t.id !== lastAction.tileId));

    const updatedTiles = tiles.map((t) =>
      t.id === lastAction.tileId
        ? { ...t, inSlot: false, inShelf: false, isEliminated: false }
        : t
    );
    updateCoveredState(updatedTiles);
    setTiles(updatedTiles);
  };

  // Booster: Shuffle
  const handleShuffleBooster = () => {
    if (boosters.shuffle <= 0) return;

    puzzleSounds.playBooster();
    setBoosters((prev) => ({ ...prev, shuffle: prev.shuffle - 1 }));

    const activeTiles = tiles.filter((t) => !t.inSlot && !t.inShelf && !t.isEliminated);
    const activeTypes = activeTiles.map((t) => t.type);

    for (let i = activeTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeTypes[i], activeTypes[j]] = [activeTypes[j], activeTypes[i]];
    }

    let typeIdx = 0;
    const shuffledTiles = tiles.map((t) => {
      if (!t.inSlot && !t.inShelf && !t.isEliminated) {
        return { ...t, type: activeTypes[typeIdx++] };
      }
      return t;
    });

    updateCoveredState(shuffledTiles);
    setTiles(shuffledTiles);
  };

  // Booster: Hint
  const handleHintBooster = () => {
    puzzleSounds.playBooster();

    const unpicked = tiles.filter((t) => !t.inSlot && !t.inShelf && !t.isEliminated);
    const uncovered = unpicked.filter((t) => !t.isCovered);

    let foundType: TileType | null = null;
    for (const t of slot) {
      if (uncovered.some((u) => u.type === t.type)) {
        foundType = t.type;
        break;
      }
    }

    if (!foundType && uncovered.length > 0) {
      foundType = uncovered[0].type;
    }

    if (foundType) {
      setHintedTileTypes([foundType]);
      setTimeout(() => setHintedTileTypes([]), 2500);
    }
  };

  // Revive from Game Over
  const handleRevive = () => {
    if (slot.length === 0) return;
    setHasRevive(false);
    setIsGameOver(false);
    puzzleSounds.playBooster();

    const extractCount = Math.min(3, slot.length);
    const toExtract = slot.slice(0, extractCount).map((t) => ({ ...t, inSlot: false, inShelf: true }));
    const remainingSlot = slot.slice(extractCount);

    setSlot(remainingSlot);
    setShelf((prev) => [...prev, ...toExtract]);
  };

  const handleToggleMute = () => {
    const muted = puzzleSounds.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBGM = () => {
    const active = puzzleSounds.toggleBGM();
    setBgmActive(active);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleStartFromBanner = () => {
    setShowWelcomeBanner(false);
    puzzleSounds.playTileTap();
    if (!bgmActive) {
      const active = puzzleSounds.toggleBGM();
      setBgmActive(active);
    }
    if (!dailyLogin.hasClaimedToday) {
      setTimeout(() => setShowDailyRewardModal(true), 600);
    }
  };

  // Daily Reward Claim handler
  const handleClaimDailyReward = (
    boostersEarned: Partial<BoostersState>,
    gemEarned: CosmicGem
  ) => {
    setBoosters((prev) => ({
      undo: prev.undo + (boostersEarned.undo || 0),
      shuffle: prev.shuffle + (boostersEarned.shuffle || 0),
      extract: prev.extract + (boostersEarned.extract || 0),
    }));

    setGemInventory((prev) => {
      const next = { ...prev, [gemEarned.id]: (prev[gemEarned.id] || 0) + 1 };
      try {
        localStorage.setItem('cosmic_gems_inventory', JSON.stringify(next));
      } catch {}
      return next;
    });

    const updatedDaily: DailyLoginState = {
      ...dailyLogin,
      hasClaimedToday: true,
      lastClaimDate: getTodayDateString(),
    };
    setDailyLogin(updatedDaily);
    try {
      localStorage.setItem('cosmic_daily_login', JSON.stringify(updatedDaily));
    } catch {}

    const claimFloater: ScoreFloater = {
      id: `daily_${Date.now()}`,
      points: 1000,
      combo: 1,
      text: lang === 'ru' ? '🎁 НАГРАДА ПОЛУЧЕНА!' : '🎁 REWARD CLAIMED!',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 80,
    };
    setFloaters((prev) => [...prev, claimFloater]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== claimFloater.id));
    }, 1500);

    setTimeout(() => {
      setShowDailyRewardModal(false);
    }, 1200);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();

      if (e.key === '1') {
        e.preventDefault();
        handleExtractBooster();
      } else if (e.key === '2') {
        e.preventDefault();
        handleUndoBooster();
      } else if (e.key === '3') {
        e.preventDefault();
        handleShuffleBooster();
      } else if (e.key === '4') {
        e.preventDefault();
        handleHintBooster();
      } else if (key === 'm') {
        e.preventDefault();
        handleToggleMute();
      } else if (key === 'b') {
        e.preventDefault();
        handleToggleBGM();
      } else if (key === 'f') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (key === 'i') {
        e.preventDefault();
        setShowInventoryModal((prev) => !prev);
      } else if (key === 'l') {
        e.preventDefault();
        setShowLevelSelect((prev) => !prev);
      } else if (key === 'r') {
        e.preventDefault();
        startLevelGame(level);
      } else if (key === 'h' || key === '?') {
        e.preventDefault();
        setShowHelpModal((prev) => !prev);
      } else if (e.key === ' ' && showWelcomeBanner) {
        e.preventDefault();
        handleStartFromBanner();
      } else if (e.key === 'Escape') {
        setShowHelpModal(false);
        setShowInventoryModal(false);
        setShowDailyRewardModal(false);
        setShowLevelSelect(false);
        setShowMobilePackagesModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [boosters, history, slot, tiles, showWelcomeBanner, bgmActive, level]);

  const remainingTilesCount = tiles.filter(
    (t) => !t.isEliminated && !t.inSlot && !t.inShelf
  ).length;

  const totalGemsCount = Object.values(gemInventory).reduce((acc, c) => acc + c, 0);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#020617] text-slate-100 flex flex-col justify-between items-center overflow-x-hidden select-none font-sans">
      {/* 1. Animated Galactic Nebula Background with Level Color Transition */}
      <GalacticNebulaBackground level={level} />

      {/* 2. Magic Canvas VFX Explosions */}
      <MagicVfxOverlay burst={magicBurst} />

      {/* 3. Floating Side Dock (Inventory, Coins, Daily Reward, Dubstep, Downloads, Settings) */}
      <SideDock
        totalGems={totalGemsCount}
        coins={coins}
        activeMascot={activeMascot}
        hasDailyUnclaimed={!dailyLogin.hasClaimedToday}
        bgmActive={bgmActive}
        isMuted={isMuted}
        lang={lang}
        onOpenInventory={() => setShowInventoryModal(true)}
        onOpenDailyReward={() => setShowDailyRewardModal(true)}
        onOpenMobilePackages={() => setShowMobilePackagesModal(true)}
        onToggleBGM={handleToggleBGM}
        onToggleMute={handleToggleMute}
        onToggleLang={handleToggleLang}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* 4. CLEAN MINIMALIST TOP BAR (No bulky distracting pills!) */}
      <header className="relative z-20 w-full max-w-3xl px-3 pt-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between w-full flex-wrap gap-2">
          {/* Level Progress Indicator & Selector */}
          <button
            onClick={() => setShowLevelSelect(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition active:scale-95 group"
            title={lang === 'ru' ? 'Выбрать уровень [L]' : 'Select Level [L]'}
          >
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: currentTheme.accentColor }}
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
                <span>{lang === 'ru' ? `УРОВЕНЬ ${level} / 10` : `LEVEL ${level} / 10`}</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold truncate max-w-[170px] sm:max-w-xs">
                {lang === 'ru' ? currentTheme.nameRu : currentTheme.nameEn}
              </span>
            </div>
          </button>

          {/* Quick Score HUD */}
          <div className="flex items-center gap-3">
            <ScoreDisplay score={score} highScore={highScore} combo={combo} floaters={floaters} />

            {/* Remaining Tiles Counter */}
            <div
              className="px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border text-white shadow-md text-xs font-bold font-mono"
              style={{ borderColor: currentTheme.cardBorder }}
            >
              {lang === 'ru' ? 'Осталось: ' : 'Left: '}
              <span className="font-black text-yellow-300">{remainingTilesCount}</span>
            </div>

            {/* Restart Level [R] */}
            <button
              onClick={() => startLevelGame(level)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white shadow-sm transition active:scale-95"
              title={lang === 'ru' ? 'Перезапустить уровень [R]' : 'Restart Level [R]'}
            >
              <RotateCcw className="w-4 h-4 text-yellow-400" />
            </button>

            {/* Fullscreen Toggle [F] */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-white shadow-sm transition active:scale-95 hidden sm:flex"
              title="Fullscreen [F]"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 5. Center Main Playing Field (Stretches smoothly to fill the screen) */}
      <main className="relative z-10 flex-1 w-full max-w-4xl flex flex-col items-center justify-center my-auto min-h-[380px] px-2">
        {/* Active Mascot (Poro, Cat, Piglet — Speaks "УМНИЦА МАШКА" in 15 languages!) */}
        <div className="absolute top-0 right-4 sm:right-12 z-30">
          <CosmicPoro
            mascot={activeMascot}
            isWorried={slot.length >= 6}
            isCheering={isPoroCheering}
            praise={poroPraise}
            onOpenMascotShop={() => setShowInventoryModal(true)}
            onPoroClick={() => {
              const useSpecial = complimentsRemaining > 0;
              if (useSpecial) {
                setComplimentsRemaining((prev) => {
                  const next = Math.max(0, prev - 1);
                  try { localStorage.setItem('tryparty_compliments_rem', String(next)); } catch {}
                  return next;
                });
              }
              const praise = speakMascotPraise(activeMascot, undefined, useSpecial);
              setPoroPraise(praise);
              if (poroPraiseTimerRef.current) clearTimeout(poroPraiseTimerRef.current);
              poroPraiseTimerRef.current = window.setTimeout(() => setPoroPraise(null), 4500);
            }}
          />
        </div>

        {/* Scalable Responsive Board Container */}
        <div className="relative w-[340px] h-[360px] sm:w-[390px] sm:h-[400px] md:w-[430px] md:h-[440px] flex items-center justify-center transition-all duration-300">
          <div
            className="relative w-[340px] h-[360px] origin-center transition-transform duration-300"
            style={{
              transform: `scale(${boardScale})`,
            }}
          >
            {tiles.map((tile) => {
              if (tile.isEliminated || tile.inSlot || tile.inShelf) return null;

              const isHinted = hintedTileTypes.includes(tile.type) && !tile.isCovered;

              return (
                <TileItem
                  key={tile.id}
                  tile={tile}
                  onClick={handleTileClick}
                  isHinted={isHinted}
                  level={level}
                  style={{
                    left: `calc(50% + ${tile.x}px - 24px)`,
                    top: `calc(50% + ${tile.y}px - 28px)`,
                    zIndex: tile.layer + 1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </main>

      {/* 6. Bottom Controls: Shelf + Boosters + Stasis Tray */}
      <footer className="relative z-20 w-full max-w-2xl pb-4 px-3 flex flex-col items-center">
        {/* Extracted 3-Tile Reserve Shelf */}
        <ReserveShelf
          tiles={shelf}
          onTileClick={handleShelfTileClick}
          lang={lang}
          level={level}
        />

        {/* 4 Sci-Fi Boosters */}
        <BoosterBar
          boosters={boosters}
          onUndo={handleUndoBooster}
          onShuffle={handleShuffleBooster}
          onExtract={handleExtractBooster}
          onHint={handleHintBooster}
          canUndo={history.length > 0 && slot.length > 0}
          canExtract={slot.length > 0}
          lang={lang}
        />

        {/* The 7-Slot Quantum Hextech Tray */}
        <SlotTray
          slots={slot}
          matchingIds={matchingIds}
          maxSlots={7}
          lang={lang}
          level={level}
        />
      </footer>

      {/* 💎 Gemstones, Coin Exchange & Mascots Shop Modal */}
      <InventoryModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        inventory={gemInventory}
        coins={coins}
        activeMascot={activeMascot}
        ownedMascots={ownedMascots}
        complimentsRemaining={complimentsRemaining}
        lang={lang}
        onExchangeGem={handleExchangeGem}
        onExchangeDuplicates={handleExchangeDuplicates}
        onBuyMascotWithCoins={handleBuyMascotWithCoins}
        onBuyMascotWithHextech={handleBuyMascotWithHextech}
        onSelectMascot={handleSelectMascot}
        onBuyComplimentsWithCoins={handleBuyComplimentsWithCoins}
        onBuyComplimentsWithHextech={handleBuyComplimentsWithHextech}
      />

      {/* 🎁 Daily Login Reward Modal */}
      <DailyRewardModal
        isOpen={showDailyRewardModal}
        onClose={() => setShowDailyRewardModal(false)}
        dailyLogin={dailyLogin}
        lang={lang}
        onClaim={handleClaimDailyReward}
      />

      {/* 🚀 10 Levels Selector Modal */}
      <LevelSelectModal
        isOpen={showLevelSelect}
        onClose={() => setShowLevelSelect(false)}
        currentLevel={level}
        unlockedLevel={unlockedLevel}
        lang={lang}
        onSelectLevel={(lvl) => setLevel(lvl)}
      />

      {/* 📱 Mobile Packages & Stores Modal (.APK, .AAB, Solana Seeker) */}
      <MobilePackagesModal
        isOpen={showMobilePackagesModal}
        onClose={() => setShowMobilePackagesModal(false)}
        lang={lang}
        onPwaInstall={installPwa}
        isPwaInstallable={isPwaInstallable}
      />

      {/* 💔 Fail Modal (Warm support for Mashka + Progress Preserved) */}
      <FailModal
        isOpen={isGameOver}
        level={level}
        remainingTiles={remainingTilesCount}
        onRevive={handleRevive}
        onRestart={() => startLevelGame(level)}
        hasRevive={hasRevive && slot.length > 0}
        lang={lang}
      />

      {/* 🏆 Win Modal (Advance to Next Level + Praise for Mashka + Gem Drop) */}
      <WinModal
        isOpen={isVictory}
        level={level}
        mode="campaign"
        score={score}
        droppedGem={droppedGem}
        lang={lang}
        onNextLevel={handleAdvanceToNextLevel}
        onReplay={() => startLevelGame(level)}
        onViewLeaderboard={() => {
          setIsVictory(false);
          setShowLevelSelect(true);
        }}
      />

      {/* Welcome Banner */}
      <BrowserWelcomeBanner
        isOpen={showWelcomeBanner}
        onStartGame={handleStartFromBanner}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Help Modal */}
      <BrowserHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        lang={lang}
      />
    </div>
  );
}
