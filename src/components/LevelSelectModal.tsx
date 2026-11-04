import React from 'react';
import { X, Lock, CheckCircle, Play, Star, Sparkles } from 'lucide-react';
import { LEVEL_THEMES } from '../types/levelTheme';
import { Language } from '../types/game';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  unlockedLevel: number;
  lang?: Language;
  onSelectLevel: (lvl: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  unlockedLevel,
  lang = 'ru',
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white p-5 sm:p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            🚀
          </div>
          <div>
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
              {lang === 'ru' ? 'Выбор из 10 Космических Уровней' : 'Select from 10 Cosmic Levels'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ru'
                ? `Открыто уровней: ${unlockedLevel} из 10 • Прогресс сохраняется всегда!`
                : `Unlocked: ${unlockedLevel} of 10 • Progress is saved forever!`}
            </p>
          </div>
        </div>

        {/* 10 Levels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 mb-4">
          {Array.from({ length: 10 }).map((_, i) => {
            const lvl = i + 1;
            const isUnlocked = lvl <= unlockedLevel;
            const isCurrent = lvl === currentLevel;
            const theme = LEVEL_THEMES[lvl];

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`relative flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-[1.02] ring-2 ring-cyan-400/60'
                    : isUnlocked
                    ? 'bg-slate-900/80 border-white/10 hover:border-cyan-500/50 hover:bg-slate-850 active:scale-95'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-45 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-sm shrink-0 shadow"
                    style={{
                      backgroundColor: isUnlocked ? theme.accentColor + '33' : '#1e293b',
                      color: isUnlocked ? theme.accentColor : '#64748b',
                      border: `1px solid ${isUnlocked ? theme.accentColor : '#334155'}`,
                    }}
                  >
                    {lvl}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-black text-white truncate">
                      {lang === 'ru' ? theme.nameRu : theme.nameEn}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {theme.typesCount} {lang === 'ru' ? 'предметов' : 'items'} • {theme.tripletsCount * 3} {lang === 'ru' ? 'карт' : 'tiles'}
                    </div>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </span>
                ) : isUnlocked ? (
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center shrink-0 border border-slate-800">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ru' ? 'Каждый уровень меняет фон, цвет карточек и сложность!' : 'Every level changes background, card colors & difficulty!'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs active:scale-95 transition"
          >
            {lang === 'ru' ? 'Закрыть' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
