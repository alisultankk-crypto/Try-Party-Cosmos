import React from 'react';
import { Play, Sparkles, Gem, Gift, Music } from 'lucide-react';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface BrowserWelcomeBannerProps {
  onStartGame: () => void;
  isOpen: boolean;
  lang?: Language;
  onToggleLang?: () => void;
}

export const BrowserWelcomeBanner: React.FC<BrowserWelcomeBannerProps> = ({
  onStartGame,
  isOpen,
  lang = 'ru',
  onToggleLang,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.4)] p-6 text-center flex flex-col items-center gap-4">
        {/* Language switch button */}
        {onToggleLang && (
          <button
            onClick={onToggleLang}
            className="absolute top-4 right-4 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-cyan-300 border border-cyan-500/30 active:scale-95 transition"
          >
            {lang === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
          </button>
        )}

        {/* Glowing badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            🚀
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-400 text-slate-950">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 tracking-wide">
            {t.gameTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.gameTagline}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="w-full space-y-1.5 text-xs text-slate-300 text-left bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Music className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>{lang === 'ru' ? '8-битная ретро-музыка и чиптюн-звуки' : '8-bit retro chiptune melody & SFX'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{lang === 'ru' ? 'Инвентарь с редкими драгоценными камнями' : 'Inventory with rare collectible gemstones'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span>{lang === 'ru' ? 'Ежедневные награды за вход 7 дней' : '7-Day Daily Login Rewards streak'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold shrink-0">🐾</span>
            <span>{lang === 'ru' ? 'Поро шутит каждые 3 сбора троек' : 'Poro cracks jokes every 3 match clears'}</span>
          </div>
        </div>

        {/* Start Game Action Button */}
        <button
          onClick={onStartGame}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{lang === 'ru' ? 'НАЧАТЬ ВЕЧЕРИНКУ!' : 'START THE PARTY!'}</span>
        </button>

        <p className="text-[10px] text-slate-500">
          {lang === 'ru' ? 'Активирует 8-битный звук и чиптюн мелодию в браузере' : 'Activates 8-bit sound and chiptune melody'}
        </p>
      </div>
    </div>
  );
};
