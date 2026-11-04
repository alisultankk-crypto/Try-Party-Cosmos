import React, { useMemo } from 'react';
import { RotateCcw, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface FailModalProps {
  isOpen: boolean;
  remainingTiles: number;
  level: number;
  lang?: Language;
  onRevive: () => void;
  onRestart: () => void;
  hasRevive: boolean;
}

export const FailModal: React.FC<FailModalProps> = ({
  isOpen,
  remainingTiles,
  level,
  lang = 'ru',
  onRevive,
  onRestart,
  hasRevive,
}) => {
  const t = TRANSLATIONS[lang];

  // Pick a heartwarming comforting support message for Mashka
  const comfortMessage = useMemo(() => {
    const list = t.mashkaComforts;
    return list[Math.floor(Math.random() * list.length)];
  }, [isOpen, lang, t.mashkaComforts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.4)] p-6 text-white text-center">
        {/* Poro astronaut alert */}
        <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(244,63,94,0.5)]">
          🛰️💥
        </div>

        <h3 className="text-2xl font-black text-rose-400 mb-1">{t.failTitle}</h3>
        <p className="text-xs font-semibold text-slate-300 mb-2">
          {t.failSubtitle}
        </p>

        {/* 💖 Warm Personalized Comfort for player Mashka */}
        <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 mb-3 text-center shadow-inner">
          <p className="text-xs font-bold text-rose-200 leading-relaxed">
            {comfortMessage}
          </p>
        </div>

        {/* Saved Progress Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 mb-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'ru' ? 'Твой прогресс уровней сохранён!' : 'Your level progress is saved!'}</span>
        </div>

        {/* Progress stat */}
        <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-white/10 mb-4">
          <div className="text-xs text-slate-400 font-bold mb-0.5">
            {t.level} {level}
          </div>
          <div className="text-sm font-extrabold text-cyan-300">
            {t.remainingTiles}: <span className="font-mono text-base text-yellow-300">{remainingTiles}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {hasRevive && (
            <button
              onClick={onRevive}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-slate-950 font-black text-sm rounded-xl shadow-lg transition"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>{t.reviveBtn}</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-sm rounded-xl shadow-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'ru' ? 'ПОВТОРИТЬ УРОВЕНЬ СЕЙЧАС' : 'RETRY LEVEL NOW'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
