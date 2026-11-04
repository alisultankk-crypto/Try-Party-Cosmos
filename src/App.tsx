/**
 * Try Party: COSMOS — Ultimate Cosmic 3-in-a-Row Party Game.
 * Features:
 * - 2 Languages: Russian & English (immediate toggle)
 * - Authentic 8-bit NES/GameBoy retro chiptune BGM & arcade SFX
 * - Daily Login Reward (7-day calendar track with boosters & rare cosmic gems)
 * - Gemstones Inventory collection (gems drop 1x per level clear)
 * - Fullscreen responsive dynamic scaling layout (stretches to fill viewport cleanly)
 * - Level rewards and persistent campaign progress
 * - Encouraging feedback on defeat
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  RotateCcw,
  Trophy,
  Calendar,
  Gamepad2,
  Maximize2,
  Minimize2,
  HelpCircle,
  MoreHorizontal,
  Gem,
  Gift,
} from 'lucide-react';
import {
  TileItemData,
  BoostersState,
  TileType,
  GameMode,
  DailyLeaderboardEntry,
  MagicEffectType,
  Language,
  GemInventory,
  DailyLoginState,
  CosmicGem,
} from './types/game';
import {
  generateCampaignLevel,
  MAX_CAMPAIGN_LEVEL,
  generateDailyChallenge,
  updateCoveredState,
  getTodayDateString,
  getFormattedDayLabel,
  createPRNG,
} from './game/levelGenerator';
import { TileItem } from './components/TileItem';
import { SlotTray } from './components/SlotTray';
import { BoosterBar } from './components/BoosterBar';
import { ReserveShelf } from './components/ReserveShelf';
import { CosmicBackground } from './components/CosmicBackground';
import { MagicVfxOverlay, MagicBurstTrigger } from './components/MagicVfxOverlay';
import { CAT_METAS } from './components/CosmicCats';
import { ScoreDisplay, ScoreFloater } from './components/ScoreDisplay';
import { DailyTimer } from './components/DailyTimer';
import { LeaderboardModal } from './components/LeaderboardModal';
import { FailModal } from './components/FailModal';
import { WinModal } from './components/WinModal';
import { InventoryModal } from './components/InventoryModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { BrowserHelpModal } from './components/BrowserHelpModal';
import { BrowserWelcomeBanner } from './components/BrowserWelcomeBanner';
import { DesktopSidebar } from './components/DesktopSidebar';
import { puzzleSounds } from './audio/puzzleSounds';
import { TRANSLATIONS } from './i18n/translations';
import { getRandomGemDrop, COSMIC_GEMS } from './data/cosmicGems';

function findLastTypeIndex(items: TileItemData[], targetType: TileType): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].type === targetType) return i;
  }
  return -1;
}

const DEFAULT_SPEEDRUNNERS = [
  { name: '⚡ Faker', avatar: '👑', baseTime: 82.4, region: 'KR (T1)' },
  { name: '🗡️ YasuoMain_07', avatar: '🌪️', baseTime: 98.5, region: 'EUW (Ionia)' },
  { name: '🦊 AhriSpirit', avatar: '🌸', baseTime: 112.8, region: 'RU (Freljord)' },
  { name: '💣 JinxRockets', avatar: '🚀', baseTime: 125.4, region: 'NA (Zaun)' },
  { name: '🍄 TeemoShroom', avatar: '🍄', baseTime: 139.9, region: 'EUNE (Bandle)' },
  { name: '✨ LuxLaser', avatar: '✨', baseTime: 154.3, region: 'CN (Demacia)' },
  { name: '🌌 AsolGalaxy', avatar: '⭐', baseTime: 168.7, region: 'BR (Targon)' },
  { name: '⚔️ GarenSpin', avatar: '🛡️', baseTime: 182.1, region: 'JP (Noxus)' },
];

function generateDailyLeaderboard(dateStr: string, userTime: number | null, isRu: boolean): DailyLeaderboardEntry[] {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const prng = createPRNG(Math.abs(hash) || 987654);

  const list: DailyLeaderboardEntry[] = DEFAULT_SPEEDRUNNERS.map((runner, idx) => {
    const variance = (prng() - 0.5) * 16;
    const timeSeconds = Math.round((runner.baseTime + variance) * 100) / 100;
    return {
      rank: idx + 1,
      playerName: runner.name,
      avatar: runner.avatar,
      timeSeconds,
      region: runner.region,
      isUser: false,
    };
  });

  if (userTime !== null) {
    list.push({
      rank: 99,
      playerName: isRu ? 'Машка (Чемпион) 👑' : 'Mashka (Champion) 👑',
      avatar: '🌟',
      timeSeconds: userTime,
      region: isRu ? 'Галактика Машки' : 'Mashka Galaxy',
      isUser: true,
    });
  }

  list.sort((a, b) => a.timeSeconds - b.timeSeconds);
  return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export default function App() {
  // 1. Language state
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

  const [mode, setMode] = useState<GameMode>('campaign');
  const [level, setLevel] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem('cosmic_campaign_level'));
      if (Number.isInteger(saved) && saved >= 1 && saved <= MAX_CAMPAIGN_LEVEL) return saved;
    } catch {}
    return 1;
  });
  const victoryHandledRef = useRef(false);

  // Daily Challenge state
  const [todayDateStr, setTodayDateStr] = useState<string>(getTodayDateString());
  const [dayLabel, setDayLabel] = useState<string>(getFormattedDayLabel(getTodayDateString()));
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [userBestDailyTime, setUserBestDailyTime] = useState<number | null>(null);
  const [dailyCompletionTime, setDailyCompletionTime] = useState<number | null>(null);
  const [dailyRank, setDailyRank] = useState<number | undefined>(undefined);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [dailyLeaderboard, setDailyLeaderboard] = useState<DailyLeaderboardEntry[]>([]);

  const timerStartRef = useRef<number>(0);
  const timerFrameRef = useRef<number>(0);

  // Magic VFX Trigger State
  const [magicBurst, setMagicBurst] = useState<MagicBurstTrigger | null>(null);

  // Board state
  const [tiles, setTiles] = useState<TileItemData[]>([]);
  const [slot, setSlot] = useState<TileItemData[]>([]);
  const [shelf, setShelf] = useState<TileItemData[]>([]);
  const [matchingIds, setMatchingIds] = useState<string[]>([]);
  const [history, setHistory] = useState<{ tileId: string; fromBoardX: number; fromBoardY: number }[]>([]);
  const matchResolutionRef = useRef<number | null>(null);

  const [boosters, setBoosters] = useState<BoostersState>({
    undo: 3,
    shuffle: 3,
    extract: 3,
  });

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [hasRevive, setHasRevive] = useState<boolean>(true);

  // Audio State
  const [isMuted, setIsMuted] = useState<boolean>(puzzleSounds.getMuted());
  const [bgmActive, setBgmActive] = useState<boolean>(false);

  // Browser Experience States
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true);

  // 💎 Gem Inventory State
  const [gemInventory, setGemInventory] = useState<GemInventory>(() => {
    try {
      const saved = localStorage.getItem('cosmic_gems_inventory');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      freljord_emerald: 1, // starter bonus gem
    };
  });
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);
  const [droppedGem, setDroppedGem] = useState<CosmicGem | null>(null);

  // 🎁 Daily Login Reward State
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
  const [showDailyRewardModal, setShowDailyRewardModal] = useState<boolean>(false);

  // Responsive Board Scaling (Dynamic screen stretching)
  const [boardScale, setBoardScale] = useState<number>(1);

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

  // Responsive scale calculator so game comfortably stretches to fill any viewport
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Calculate dynamic scale factor
      let scale = 1;
      if (w >= 1200 && h >= 800) {
        scale = 1.35;
      } else if (w >= 768 && h >= 700) {
        scale = 1.2;
      } else if (w >= 500 && h >= 650) {
        scale = 1.1;
      } else if (w < 380 || h < 600) {
        scale = 0.88;
      }
      setBoardScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    return () => {
      if (matchResolutionRef.current !== null) {
        window.clearTimeout(matchResolutionRef.current);
      }
    };
  }, []);

  // Check today's daily date string
  useEffect(() => {
    const today = getTodayDateString();
    setTodayDateStr(today);
    setDayLabel(getFormattedDayLabel(today));

    try {
      const savedBest = localStorage.getItem(`daily_best_${today}`);
      if (savedBest) {
        const parsed = parseFloat(savedBest);
        setUserBestDailyTime(parsed);
      }
    } catch {}

    setDailyLeaderboard(generateDailyLeaderboard(today, userBestDailyTime, lang === 'ru'));
  }, [lang]);

  // Daily Timer tick
  useEffect(() => {
    if (timerRunning) {
      const updateTimer = () => {
        const elapsed = (performance.now() - timerStartRef.current) / 1000;
        setTimerSeconds(elapsed);
        timerFrameRef.current = requestAnimationFrame(updateTimer);
      };
      timerFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      cancelAnimationFrame(timerFrameRef.current);
    }
    return () => cancelAnimationFrame(timerFrameRef.current);
  }, [timerRunning]);

  // Initialize board when mode or level changes
  useEffect(() => {
    startCurrentGame();
  }, [mode, level]);

  useEffect(() => {
    try {
      localStorage.setItem('cosmic_campaign_level', String(level));
    } catch {}
  }, [level]);

  const startCurrentGame = () => {
    if (matchResolutionRef.current !== null) {
      window.clearTimeout(matchResolutionRef.current);
      matchResolutionRef.current = null;
    }
    victoryHandledRef.current = false;
    setTimerRunning(false);
    setTimerSeconds(0);
    setDailyCompletionTime(null);
    setIsNewBest(false);
    setMagicBurst(null);
    setDroppedGem(null);

    let initialTiles: TileItemData[];

    if (mode === 'daily') {
      const challenge = generateDailyChallenge(todayDateStr);
      initialTiles = challenge.tiles;
      setDayLabel(challenge.dayLabel);
    } else {
      initialTiles = generateCampaignLevel(level);
    }

    setTiles(initialTiles);
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

    if (level === 1 || mode === 'daily') {
      setScore(0);
    }

    setBoosters({
      undo: mode === 'daily' ? 3 : level === 1 ? 5 : 3,
      shuffle: mode === 'daily' ? 3 : level === 1 ? 5 : 3,
      extract: mode === 'daily' ? 3 : level === 1 ? 5 : 3,
    });
  };

  // Handle clicking a tile on the board
  const handleTileClick = (clickedTile: TileItemData) => {
    if (
      clickedTile.isCovered ||
      clickedTile.inSlot ||
      clickedTile.inShelf ||
      isGameOver ||
      isVictory ||
      matchingIds.length > 0
    ) {
      return;
    }
    if (slot.length >= 7) return;

    if (mode === 'daily' && !timerRunning) {
      timerStartRef.current = performance.now() - timerSeconds * 1000;
      setTimerRunning(true);
    }

    if (showWelcomeBanner) {
      setShowWelcomeBanner(false);
    }

    puzzleSounds.playCatMeow(clickedTile.type);

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

  // Handle clicking a tile from the Reserve Shelf
  const handleShelfTileClick = (shelfTile: TileItemData) => {
    if (slot.length >= 7 || isGameOver || isVictory || matchingIds.length > 0) return;

    puzzleSounds.playCatMeow(shelfTile.type);
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

  // Check if 3 matching cats exist in the slot
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

        const catMeta = CAT_METAS[type];
        const magicType: MagicEffectType = catMeta.magic;
        const currentCombo = comboRef.current;
        const earnedPoints = 300 * currentCombo;

        puzzleSounds.playMagicEffect(magicType, currentCombo);
        comboRef.current++;
        setCombo(comboRef.current);

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

        // Trigger score floater
        const floaterX = window.innerWidth / 2 + (Math.random() - 0.5) * 80;
        const floaterY = window.innerHeight - 150;
        const newFloater: ScoreFloater = {
          id: `${Date.now()}_${Math.random()}`,
          points: earnedPoints,
          combo: currentCombo,
          text:
            currentCombo >= 3
              ? `🔥 MEGA-COMBO x${currentCombo}! +${earnedPoints}`
              : currentCombo === 2
              ? `⚡ COMBO x2! +${earnedPoints}`
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
          color: catMeta.accentColor,
          x: burstX,
          y: burstY,
        });

        matchResolutionRef.current = window.setTimeout(() => {
          matchResolutionRef.current = null;
          setSlot((prev) => prev.filter((t) => !matchIds.includes(t.id)));
          setMatchingIds([]);

          const afterElimination = currentTiles.map((t) =>
            matchIds.includes(t.id) ? { ...t, isEliminated: true, inSlot: false } : t
          );
          setTiles(afterElimination);
          if (afterElimination.every((t) => t.isEliminated)) handleVictory();
        }, 220);
        break;
      }
    }

    if (!matchFound) {
      if (currentSlot.length >= 7) {
        setTimerRunning(false);
        setTimeout(() => {
          setIsGameOver(true);
          puzzleSounds.playDefeat();
        }, 280);
      } else if (currentSlot.length === 6) {
        puzzleSounds.playSlotWarning();
      }
    }
  };

  const handleVictory = () => {
    if (victoryHandledRef.current) return;
    victoryHandledRef.current = true;
    setIsVictory(true);
    setTimerRunning(false);
    puzzleSounds.playVictory();

    // 💎 Gem Drop Reward: Drops 1x per level victory!
    const dropped = getRandomGemDrop();
    setDroppedGem(dropped);
    setGemInventory((prev) => {
      const next = { ...prev, [dropped.id]: (prev[dropped.id] || 0) + 1 };
      try {
        localStorage.setItem('cosmic_gems_inventory', JSON.stringify(next));
      } catch {}
      return next;
    });

    setMagicBurst({
      id: `victory_${Date.now()}`,
      type: 'starlight',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const victoryBonus = mode === 'daily' ? 5000 : level * 2000;
    setScore((prev) => {
      const next = prev + victoryBonus;
      setHighScore((curHigh) => {
        const newHigh = Math.max(curHigh, next);
        try {
          localStorage.setItem('cosmic_high_score', String(newHigh));
        } catch {}
        return newHigh;
      });
      return next;
    });

    if (mode === 'daily') {
      const finalTime = (performance.now() - timerStartRef.current) / 1000;
      const roundedTime = Math.round(finalTime * 100) / 100;
      setDailyCompletionTime(roundedTime);

      let isBest = false;
      if (!userBestDailyTime || roundedTime < userBestDailyTime) {
        isBest = true;
        setUserBestDailyTime(roundedTime);
        setIsNewBest(true);
        try {
          localStorage.setItem(`daily_best_${todayDateStr}`, String(roundedTime));
        } catch {}
      }

      const updatedList = generateDailyLeaderboard(
        todayDateStr,
        isBest ? roundedTime : userBestDailyTime || roundedTime,
        lang === 'ru'
      );
      setDailyLeaderboard(updatedList);
      const userRank = updatedList.find((e) => e.isUser)?.rank || 1;
      setDailyRank(userRank);
    }
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

    if (mode === 'daily') {
      timerStartRef.current = performance.now() - timerSeconds * 1000;
      setTimerRunning(true);
    }

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

  const closeMoreMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.closest('details')?.removeAttribute('open');
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
    // Check if daily reward can be claimed
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
      lastClaimDate: todayDateStr,
    };
    setDailyLogin(updatedDaily);
    try {
      localStorage.setItem('cosmic_daily_login', JSON.stringify(updatedDaily));
    } catch {}

    // Score Floater celebration
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

  // Browser Keyboard Shortcuts
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
      } else if (key === 'r') {
        e.preventDefault();
        startCurrentGame();
      } else if (key === 'h' || key === '?') {
        e.preventDefault();
        setShowHelpModal((prev) => !prev);
      } else if (e.key === ' ' && showWelcomeBanner) {
        e.preventDefault();
        handleStartFromBanner();
      } else if (e.key === 'Escape') {
        setShowHelpModal(false);
        setShowLeaderboard(false);
        setShowInventoryModal(false);
        setShowDailyRewardModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [boosters, history, slot, tiles, showWelcomeBanner, bgmActive]);

  const remainingTilesCount = tiles.filter(
    (t) => !t.isEliminated && !t.inSlot && !t.inShelf
  ).length;

  const totalGemsCount = Object.values(gemInventory).reduce((acc, c) => acc + c, 0);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#030712] text-slate-100 flex flex-col justify-between items-center overflow-x-hidden select-none font-sans">
      {/* 1. Animated Deep Space Canvas Background */}
      <CosmicBackground />

      {/* 2. Magic Canvas VFX Explosions */}
      <MagicVfxOverlay burst={magicBurst} />

      {/* 3. Desktop Sidebars (Visible on extra-wide screens) */}
      <DesktopSidebar
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        bgmActive={bgmActive}
        onToggleBGM={handleToggleBGM}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenInventory={() => setShowInventoryModal(true)}
        onOpenDailyReward={() => setShowDailyRewardModal(true)}
        combo={combo}
        lang={lang}
      />

      {/* 4. Cosmic Sci-Fi Top Header */}
      <header className="relative z-20 w-full max-w-2xl px-3 pt-2.5 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full flex-wrap gap-2">
          {/* Game Brand & Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <button
                onClick={() => setMode('campaign')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  mode === 'campaign'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>{t.campaignMode}</span>
              </button>

              <button
                onClick={() => setMode('daily')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  mode === 'daily'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.dailyMode}</span>
              </button>
            </div>

            {/* Language Switcher Badge (RU / EN) */}
            <button
              onClick={handleToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-black active:scale-95 transition shadow-sm"
              title="Переключить язык / Switch Language"
            >
              <span>{lang === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowInventoryModal(true)}
              className="relative p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition active:scale-95 flex items-center gap-1"
              title={`${t.inventoryBtn} [I]`}
              aria-label={t.inventoryBtn}
            >
              <Gem className="w-4 h-4 text-cyan-300" />
              {totalGemsCount > 0 && (
                <span className="text-[11px] font-black font-mono text-cyan-200 hidden sm:inline">
                  {totalGemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowDailyRewardModal(true)}
              className="relative p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-yellow-400/50 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.3)] transition active:scale-95"
              title={t.dailyRewardBtn}
              aria-label={t.dailyRewardBtn}
            >
              <Gift className="w-4 h-4 text-yellow-400" />
              {!dailyLogin.hasClaimedToday && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white shadow-sm transition active:scale-95"
              title={isMuted ? t.soundOff : t.soundOn}
              aria-label={isMuted ? t.soundOff : t.soundOn}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <details className="relative">
              <summary
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm transition hover:bg-slate-800 active:scale-95 [&::-webkit-details-marker]:hidden"
                aria-label={lang === 'ru' ? 'Дополнительные действия' : 'More actions'}
                title={lang === 'ru' ? 'Дополнительные действия' : 'More actions'}
              >
                <MoreHorizontal className="w-5 h-5" />
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 flex w-56 flex-col gap-1 rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-2 text-sm text-white shadow-xl backdrop-blur-md">
                <button
                  onClick={(event) => {
                    closeMoreMenu(event);
                    handleToggleBGM();
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-800"
                >
                  <Music className={`h-4 w-4 ${bgmActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  {bgmActive ? t.musicOff : t.musicOn}
                </button>
                <button
                  onClick={(event) => {
                    closeMoreMenu(event);
                    setShowHelpModal(true);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-800"
                >
                  <HelpCircle className="h-4 w-4 text-sky-400" />
                  {t.rulesBtn}
                </button>
                <button
                  onClick={(event) => {
                    closeMoreMenu(event);
                    handleToggleFullscreen();
                  }}
                  className="hidden items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-800 sm:flex"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4 text-cyan-400" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-cyan-400" />
                  )}
                  {isFullscreen ? t.exitFullscreen : t.fullscreen}
                </button>
                <button
                  onClick={(event) => {
                    closeMoreMenu(event);
                    setShowLeaderboard(true);
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-800"
                >
                  <Trophy className="h-4 w-4 text-amber-400" />
                  {t.speedrunLeaderboard}
                </button>
                <button
                  onClick={(event) => {
                    closeMoreMenu(event);
                    startCurrentGame();
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4 text-yellow-400" />
                  {lang === 'ru' ? 'Перезапустить уровень' : 'Restart level'}
                </button>
              </div>
            </details>
          </div>
        </div>

        {/* Live Score, High Score & Combo Multiplier HUD */}
        <div className="flex items-center justify-between w-full">
          <ScoreDisplay score={score} highScore={highScore} combo={combo} floaters={floaters} />
        </div>

        {/* Status Sub-Header */}
        {mode === 'daily' ? (
          <div className="flex items-center justify-between w-full">
            <DailyTimer
              elapsedSeconds={timerSeconds}
              isRunning={timerRunning}
              dayLabel={dayLabel}
              bestTimeSeconds={userBestDailyTime}
            />
            <div className="px-3 py-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-white shadow-md text-xs font-bold font-mono">
              {t.remainingTiles}: <span className="text-cyan-300 font-black">{remainingTilesCount}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-white shadow-md">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {t.level} {level} / {MAX_CAMPAIGN_LEVEL}
              </span>
            </div>

            <div className="px-3 py-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-white shadow-md text-xs font-bold font-mono">
              {t.remainingTiles}: <span className="text-cyan-300 font-black">{remainingTilesCount}</span>
            </div>
          </div>
        )}
      </header>

      {/* 5. Center Main Playing Field (Stretches smoothly to fill the screen) */}
      <main className="relative z-10 flex-1 w-full max-w-4xl flex flex-col items-center justify-center my-auto min-h-[380px] px-2">
        {/* The Scalable Responsive Board Container */}
        <div className="relative w-[340px] h-[360px] sm:w-[380px] sm:h-[390px] md:w-[420px] md:h-[430px] flex items-center justify-center transition-all duration-300">
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

      {/* 6. Bottom Control Section: Shelf + Boosters + Stasis Pod Tray */}
      <footer className="relative z-20 w-full max-w-2xl pb-4 px-3 flex flex-col items-center">
        {/* Extracted 3-Tile Reserve Shelf */}
        <ReserveShelf tiles={shelf} onTileClick={handleShelfTileClick} lang={lang} />

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
        <SlotTray slots={slot} matchingIds={matchingIds} maxSlots={7} lang={lang} />
      </footer>

      {/* 💎 Gemstones Inventory Modal */}
      <InventoryModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        inventory={gemInventory}
        lang={lang}
      />

      {/* 🎁 Daily Login Reward Modal */}
      <DailyRewardModal
        isOpen={showDailyRewardModal}
        onClose={() => setShowDailyRewardModal(false)}
        dailyLogin={dailyLogin}
        lang={lang}
        onClaim={handleClaimDailyReward}
      />

      {/* Speedrun Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        dayLabel={dayLabel}
        userBestTime={userBestDailyTime}
        dailyEntries={dailyLeaderboard}
        lang={lang}
      />

      {/* 💔 Fail Modal (Warm personalized support for Mashka) */}
      <FailModal
        isOpen={isGameOver}
        level={level}
        remainingTiles={remainingTilesCount}
        onRevive={handleRevive}
        onRestart={startCurrentGame}
        hasRevive={hasRevive && slot.length > 0}
        lang={lang}
      />

      {/* 🏆 Win Modal (Personalized praise for Mashka + Gem Drop) */}
      <WinModal
        isOpen={isVictory}
        level={level}
        mode={mode}
        score={score}
        completionTimeSeconds={dailyCompletionTime || timerSeconds}
        isNewBest={isNewBest}
        dailyRank={dailyRank}
        droppedGem={droppedGem}
        lang={lang}
        isCampaignComplete={mode === 'campaign' && level === MAX_CAMPAIGN_LEVEL}
        onNextLevel={() => setLevel((prev) => Math.min(MAX_CAMPAIGN_LEVEL, prev + 1))}
        onReplay={startCurrentGame}
        onViewLeaderboard={() => {
          setIsVictory(false);
          setShowLeaderboard(true);
        }}
      />

      {/* Welcome & Sound Activation Modal */}
      <BrowserWelcomeBanner
        isOpen={showWelcomeBanner}
        onStartGame={handleStartFromBanner}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Browser Controls & Rules Guide */}
      <BrowserHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        lang={lang}
      />
    </div>
  );
}
