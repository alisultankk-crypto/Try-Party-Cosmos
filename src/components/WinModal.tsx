import React, { useState, useMemo } from 'react';
import { Trophy, ArrowRight, RotateCcw, Timer, Share2, Check } from 'lucide-react';
import { GameMode, Language, CosmicGem } from '../types/game';
import { formatTimePrecise } from './DailyTimer';
import { TRANSLATIONS } from '../i18n/translations';
import { CosmicGemSvg } from './CosmicGemSvg';
import { LEVEL_THEMES } from '../types/levelTheme';

interface WinModalProps {
  isOpen: boolean;
  level: number;
  mode: GameMode;
  score?: number;
  completionTimeSeconds?: number;
  isNewBest?: boolean;
  dailyRank?: number;
  droppedGem?: CosmicGem | null;
  lang?: Language;
  onNextLevel: () => void;
  onReplay: () => void;
  onViewLeaderboard: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  level,
  mode,
  score,
  completionTimeSeconds,
  isNewBest = false,
  dailyRank,
  droppedGem = null,
  lang = 'ru',
  onNextLevel,
  onReplay,
  onViewLeaderboard,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang];
  const nextTheme = LEVEL_THEMES[Math.min(level + 1, 10)] || LEVEL_THEMES[1];

  const praiseText = useMemo(() => {
    const list = t.mashkaPraises;
    return list[Math.floor(Math.random() * list.length)];
  }, [isOpen, lang, t.mashkaPraises]);

  if (!isOpen) return null;

  const isDaily = mode === 'daily';

  const handleShare = () => {
    const text = isDaily && completionTimeSeconds
      ? `🏆 Машка прошла Ежедневный Челлендж Try Party: COSMOS за ${formatTimePrecise(completionTimeSeconds)} (Место: #${dailyRank || 1})! Сможешь быстрее? 🌌⚡`
      : `🌟 Машка покорила Уровень ${level} в Try Party: COSMOS! 0.1% лучших игроков галактики!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-amber-50 to-amber-100 border-4 border-yellow-500 shadow-[0_0_50px_rgba(250,204,21,0.5)] p-6 text-slate-900 text-center">
        {/* Trophy */}
        <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce">
          🏆
        </div>

        <h3 className="text-2xl font-black text-amber-950 mb-0.5">
          {isDaily
            ? t.winDailyTitle
            : level === 10
            ? (lang === 'ru' ? 'СУПЕРФИНАЛ ПРОЙДЕН!' : 'GRAND FINALE CLEARED!')
            : (lang === 'ru' ? `УРОВЕНЬ ${level} ПОКОРЁН!` : `LEVEL ${level} CLEARED!`)}
        </h3>

        {/* 💖 Warm Personalized Praise for player Mashka */}
        <div className="my-2 px-3 py-2 rounded-2xl bg-amber-200/90 border border-yellow-400 shadow-sm">
          <p className="text-xs font-black text-amber-950 leading-tight">
            {praiseText}
          </p>
        </div>

        {/* Dropped Cosmic Gemstone Reward */}
        {droppedGem && (
          <div className={`p-3 rounded-2xl text-white my-2 shadow-xl flex items-center gap-3 border-2 ${
            droppedGem.id === 'hextech_arcane_crystal'
              ? 'bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.7)] animate-pulse'
              : 'bg-slate-950 border-cyan-400'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 shrink-0">
              <CosmicGemSvg gem={droppedGem} size={36} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-[10px] uppercase font-black text-cyan-300 flex items-center gap-1.5">
                <span>{droppedGem.id === 'hextech_arcane_crystal' ? '⚡ НАГРАДА ЗА 3 УРОВНЯ! (ARCANE)' : t.newGemFound}</span>
              </div>
              <div className="text-xs font-black text-white truncate">
                {droppedGem.name[lang]}
              </div>
              <div className="text-[10px] text-amber-300">
                {droppedGem.id === 'hextech_arcane_crystal'
                  ? (lang === 'ru' ? 'Купите за него зверька или 10 комплиментов! 🐾' : 'Use it to buy a pet or 10 praises!')
                  : `+${droppedGem.coinValue} 🪙 при обмене в инвентаре!`}
              </div>
            </div>
          </div>
        )}

        {/* Score Earned */}
        {score !== undefined && score > 0 && (
          <div className="p-2 rounded-xl bg-amber-400/30 border border-yellow-500 mb-3 flex items-center justify-between px-3">
            <span className="text-xs font-black text-amber-900 uppercase">{t.points}:</span>
            <span className="font-mono text-base font-black text-amber-950">+{score.toLocaleString()} ⭐</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {!isDaily ? (
            <button
              onClick={onNextLevel}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-900/40 transition"
            >
              <span>
                {level < 10
                  ? (lang === 'ru' ? `ПЕРЕЙТИ НА УРОВЕНЬ ${level + 1} 🔥` : `NEXT LEVEL ${level + 1} 🔥`)
                  : (lang === 'ru' ? 'ПОВТОРИТЬ С 1 УРОВНЯ' : 'RESTART FROM LEVEL 1')}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={onViewLeaderboard}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-sm rounded-xl shadow-md transition active:scale-95"
            >
              <Trophy className="w-4 h-4 fill-current" />
              <span>{t.speedrunLeaderboard}</span>
            </button>
          )}

          <button
            onClick={onReplay}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'ПЕРЕИГРАТЬ ЭТОТ УРОВЕНЬ' : 'REPLAY THIS LEVEL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
