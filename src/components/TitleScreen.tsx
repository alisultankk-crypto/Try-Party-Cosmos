import React from 'react';
import { Play, Volume2, VolumeX, Shield, Zap, Sparkles } from 'lucide-react';
import { MapTheme } from '../game/proceduralModels';
import { sounds } from '../audio/soundEngine';

interface TitleScreenProps {
  onStart: (theme: MapTheme, count: number) => void;
  selectedTheme: MapTheme;
  onThemeChange: (theme: MapTheme) => void;
  totalOpponents: number;
  onOpponentsChange: (count: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  selectedTheme,
  onThemeChange,
  totalOpponents,
  onOpponentsChange,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 pointer-events-none select-none">
      {/* Top Bar with Audio & Badge */}
      <div className="flex justify-between items-center w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>MINIMALIST 3D BATTLE ROYALE</span>
        </div>

        <button
          onClick={onToggleMute}
          className="pointer-events-auto p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md border border-white/10 text-white transition active:scale-95"
          title={isMuted ? 'Включить звук' : 'Выключить звук'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </div>

      {/* Center Title Lockup & Start CTA */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        {/* Bespoke Title Logo */}
        <div className="relative mb-3">
          <div className="text-6xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
            CRAZY <span className="text-yellow-400">CATTLE</span>
          </div>
          <div className="inline-block px-4 py-0.5 mt-1 text-sm md:text-base font-extrabold tracking-widest uppercase bg-rose-600 text-white rounded-md shadow-lg transform -rotate-2">
            3D EDITION
          </div>
        </div>

        <p className="max-w-md text-sm md:text-base font-medium text-slate-800 drop-shadow-sm mb-6 px-4">
          Сталкивай овец и баранов с арены, используй мощный разгон и стань последним выжившим!
        </p>

        {/* Map Theme & Bot Count Selectors */}
        <div className="pointer-events-auto flex flex-wrap justify-center gap-2 mb-6 max-w-lg">
          {(
            [
              { id: 'ireland', label: '🌿 Ирландия' },
              { id: 'alpine', label: '🏔️ Альпы' },
              { id: 'sunset', label: '🌅 Закат' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => onThemeChange(m.id)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition shadow-sm ${
                selectedTheme === m.id
                  ? 'bg-yellow-400 text-slate-950 scale-105 shadow-yellow-500/30'
                  : 'bg-slate-900/60 text-white hover:bg-slate-900/80 border border-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Competitor Count */}
        <div className="pointer-events-auto flex items-center gap-2 mb-8 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <span className="text-xs font-semibold text-slate-300">Соперников:</span>
          {[7, 11, 15].map((count) => (
            <button
              key={count}
              onClick={() => onOpponentsChange(count)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                totalOpponents === count
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {count + 1} овец
            </button>
          ))}
        </div>

        {/* Primary Start CTA Button */}
        <button
          onClick={() => onStart(selectedTheme, totalOpponents)}
          className="pointer-events-auto group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-lg md:text-xl rounded-2xl shadow-xl shadow-emerald-900/30 transition transform hover:-translate-y-1 active:translate-y-0 active:scale-95"
        >
          <Play className="w-6 h-6 fill-current transition group-hover:scale-110" />
          <span>НАЧАТЬ БИТВУ</span>
          <span className="text-xs px-2 py-0.5 rounded bg-black/20 text-emerald-100 font-mono ml-1 hidden sm:inline">
            ПРОБЕЛ
          </span>
        </button>
      </div>

      {/* Flat Control Hints Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-medium text-slate-800 drop-shadow-sm text-center">
        <span className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10">
          <strong className="text-black">WASD / Стрелки</strong> — Движение
        </span>
        <span className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10">
          <strong className="text-black">ПРОБЕЛ / ЛКМ</strong> — Таран (Разгон)
        </span>
        <span className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10">
          <strong className="text-black">E</strong> — Прыжок
        </span>
      </div>
    </div>
  );
};
