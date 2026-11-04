import React, { useState } from 'react';
import { puzzleSounds } from '../audio/puzzleSounds';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface CosmicPoroProps {
  isWorried?: boolean;
  isCheering?: boolean;
  jokeText?: string | null;
  lang?: Language;
  onPoroClick?: () => void;
}

export const CosmicPoro: React.FC<CosmicPoroProps> = ({
  isWorried = false,
  isCheering = false,
  jokeText = null,
  lang = 'ru',
  onPoroClick,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleClick = () => {
    puzzleSounds.playPoroSqueak();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
    if (onPoroClick) onPoroClick();
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Dynamic Joke Bubble (Every 3 successful matches!) */}
      {jokeText && (
        <div className="absolute -top-16 md:-top-20 z-40 max-w-[240px] md:max-w-[280px] px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-200 to-yellow-300 text-slate-950 border-2 border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[10px] font-black uppercase text-amber-900 flex items-center gap-1 mb-0.5">
            <span>🐾 {t.poroTitle}</span>
          </div>
          <p className="text-xs font-extrabold leading-tight text-slate-950">
            {jokeText}
          </p>
          {/* Speech bubble arrow pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-yellow-300" />
        </div>
      )}

      {/* Poro Mascot Body */}
      <div
        onClick={handleClick}
        className={`relative cursor-pointer transition-transform duration-300 ${
          isWiggling ? 'scale-110 -rotate-12' : isCheering ? 'animate-bounce' : 'hover:scale-105'
        }`}
        title={lang === 'ru' ? 'Нажми на космического Поро!' : 'Click Cosmic Poro!'}
      >
        <svg viewBox="0 0 100 90" className="w-16 h-14 md:w-20 md:h-18 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          {/* Zero-G Celestial Thruster Plume */}
          <ellipse cx="50" cy="80" rx="14" ry="4" fill="rgba(56, 189, 248, 0.4)" filter="blur(2px)" />
          <ellipse cx="50" cy="78" rx="8" ry="3" fill="#38bdf8" />

          {/* Jetpack Thrusters */}
          <rect x="32" y="58" width="6" height="12" rx="3" fill="#334155" />
          <rect x="62" y="58" width="6" height="12" rx="3" fill="#334155" />

          {/* Fluffy Round Poro Body */}
          <circle cx="50" cy="46" r="28" fill="#f8fafc" />
          <circle cx="50" cy="46" r="26" fill="#ffffff" />
          {/* Soft Underbelly Shadow */}
          <ellipse cx="50" cy="62" rx="18" ry="8" fill="#e2e8f0" />

          {/* Little Paws */}
          <ellipse cx="36" cy="68" rx="6" ry="4" fill="#334155" />
          <ellipse cx="64" cy="68" rx="6" ry="4" fill="#334155" />

          {/* Celestial Horns */}
          <path
            d="M34 26C28 20 20 22 18 28C16 34 22 36 28 32"
            fill="none"
            stroke="#a855f7"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M66 26C72 20 80 22 82 28C84 34 78 36 72 32"
            fill="none"
            stroke="#a855f7"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Glass Bubble Astronaut Visor Dome */}
          <ellipse cx="50" cy="44" rx="27" ry="25" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="38" cy="30" rx="9" ry="3.5" fill="rgba(255, 255, 255, 0.5)" transform="rotate(-25 38 30)" />

          {/* Big Cute Poro Eyes */}
          {isWorried ? (
            <>
              <ellipse cx="40" cy="42" rx="4" ry="4.5" fill="#0f172a" />
              <ellipse cx="60" cy="42" rx="4" ry="4.5" fill="#0f172a" />
              <circle cx="41" cy="44" r="1.5" fill="#ffffff" />
              <circle cx="61" cy="44" r="1.5" fill="#ffffff" />
              <circle cx="28" cy="36" r="2.5" fill="#38bdf8" />
            </>
          ) : (
            <>
              <ellipse cx="40" cy="42" rx="5" ry="6" fill="#0f172a" />
              <ellipse cx="60" cy="42" rx="5" ry="6" fill="#0f172a" />
              <circle cx="38" cy="40" r="2.2" fill="#ffffff" />
              <circle cx="42" cy="44" r="1.2" fill="#ffffff" />
              <circle cx="58" cy="40" r="2.2" fill="#ffffff" />
              <circle cx="62" cy="44" r="1.2" fill="#ffffff" />
            </>
          )}

          {/* Fluffy Heart-Shaped Poro Nose */}
          <path d="M47 48C47 46 50 46 50 48C50 46 53 46 53 48C53 50 50 52 50 52C50 52 47 50 47 48Z" fill="#334155" />

          {/* Iconic Pink Tongue */}
          <path
            d="M48 51C48 56 52 56 52 51Z"
            fill="#f43f5e"
            stroke="#be185d"
            strokeWidth="0.8"
          />
        </svg>

        {/* Status badges */}
        {isCheering && !jokeText && (
          <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-bounce">
            {lang === 'ru' ? 'ПЕНТАКИЛЛ! ✨' : 'PENTAKILL! ✨'}
          </div>
        )}
        {isWorried && !jokeText && (
          <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse">
            {lang === 'ru' ? 'ОПАСНОСТЬ! ⚠️' : 'DANGER! ⚠️'}
          </div>
        )}
      </div>
    </div>
  );
};
