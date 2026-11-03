import React, { useState } from 'react';
import { puzzleSounds } from '../audio/puzzleSounds';

interface MascotSheepProps {
  isWorried?: boolean;
  isCheering?: boolean;
}

export const MascotSheep: React.FC<MascotSheepProps> = ({
  isWorried = false,
  isCheering = false,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = () => {
    puzzleSounds.playSheepBleat();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer transition-transform duration-300 select-none ${
        isWiggling ? 'scale-110 -rotate-6' : isCheering ? 'animate-bounce' : 'hover:scale-105'
      }`}
      title="Нажми на овечку, чтобы она блеяла!"
    >
      <svg viewBox="0 0 100 80" className="w-20 h-16 md:w-24 md:h-20 drop-shadow-md">
        {/* Soft shadow */}
        <ellipse cx="50" cy="74" rx="36" ry="6" fill="rgba(0, 0, 0, 0.15)" />

        {/* 4 Little Stubby Legs */}
        <rect x="28" y="52" width="7" height="18" rx="3.5" fill="#1e293b" />
        <rect x="39" y="54" width="7" height="16" rx="3.5" fill="#334155" />
        <rect x="56" y="54" width="7" height="16" rx="3.5" fill="#334155" />
        <rect x="67" y="52" width="7" height="18" rx="3.5" fill="#1e293b" />

        {/* Fluffy Wool Body (Overlapping circles) */}
        <circle cx="34" cy="42" r="14" fill="#ffffff" />
        <circle cx="50" cy="38" r="16" fill="#f8fafc" />
        <circle cx="66" cy="42" r="14" fill="#ffffff" />
        <circle cx="42" cy="50" r="12" fill="#f1f5f9" />
        <circle cx="58" cy="50" r="12" fill="#f1f5f9" />
        <circle cx="50" cy="44" r="14" fill="#ffffff" />

        {/* Little Tail */}
        <circle cx="78" cy="44" r="5" fill="#f8fafc" />

        {/* Head */}
        <g transform="translate(10, 16)">
          {/* Floppy Left Ear */}
          <ellipse
            cx="4"
            cy="16"
            rx="7"
            ry="4"
            fill="#1e293b"
            transform={isWorried ? 'rotate(-25 4 16)' : 'rotate(-10 4 16)'}
          />
          {/* Floppy Right Ear */}
          <ellipse
            cx="24"
            cy="14"
            rx="7"
            ry="4"
            fill="#1e293b"
            transform={isWorried ? 'rotate(25 24 14)' : 'rotate(10 24 14)'}
          />
          {/* Head Base */}
          <ellipse cx="14" cy="22" rx="11" ry="10" fill="#0f172a" />
          {/* Wool Cap */}
          <ellipse cx="14" cy="13" rx="8" ry="5" fill="#ffffff" />

          {/* Eyes */}
          {isWorried ? (
            // Worried squinting eyes
            <>
              <path d="M8 20L12 21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 21L20 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              {/* Sweat drop */}
              <circle cx="2" cy="10" r="2.5" fill="#38bdf8" />
            </>
          ) : isCheering ? (
            // Happy happy curved eyes
            <>
              <path d="M8 21C9 19 11 19 12 21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M16 21C17 19 19 19 20 21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Cartoon wide-eyed gaze
            <>
              <circle cx="10" cy="21" r="2.8" fill="#ffffff" />
              <circle cx="18" cy="21" r="2.8" fill="#ffffff" />
              <circle cx="10.5" cy="21" r="1.4" fill="#000000" />
              <circle cx="18.5" cy="21" r="1.4" fill="#000000" />
            </>
          )}

          {/* Snout & Pink Nose */}
          <ellipse cx="14" cy="27" rx="5" ry="3" fill="#334155" />
          <path d="M13 26H15L14 27.5Z" fill="#fb7185" />
        </g>
      </svg>

      {/* Comic speech bubble on hover / cheering */}
      {isCheering && (
        <div className="absolute -top-4 -right-2 px-2 py-0.5 rounded-full bg-yellow-300 text-slate-950 font-black text-[10px] shadow-md animate-bounce">
          МЕ-Е-Е! ❤️
        </div>
      )}
      {isWorried && (
        <div className="absolute -top-4 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] shadow-md animate-pulse">
          ОЙ-ОЙ! 💦
        </div>
      )}
    </div>
  );
};
