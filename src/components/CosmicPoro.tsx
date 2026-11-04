import React, { useState } from 'react';
import { PoroPraisePhrase } from '../audio/poroVoice';
import { puzzleSounds } from '../audio/puzzleSounds';
import { MascotId } from '../types/game';

interface CosmicMascotProps {
  mascot?: MascotId;
  isWorried?: boolean;
  isCheering?: boolean;
  praise?: PoroPraisePhrase | null;
  onPoroClick?: () => void;
  onOpenMascotShop?: () => void;
}

export const CosmicPoro: React.FC<CosmicMascotProps> = ({
  mascot = 'poro',
  isWorried = false,
  isCheering = false,
  praise = null,
  onPoroClick,
  onOpenMascotShop,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = () => {
    if (mascot === 'cat') {
      puzzleSounds.playCatMeow();
    } else if (mascot === 'piglet') {
      puzzleSounds.playPigletOink();
    } else {
      puzzleSounds.playPoroSqueak();
    }
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
    if (onPoroClick) onPoroClick();
  };

  const mascotTitles = {
    poro: { name: 'Поро', emoji: '✨', bubbleColor: 'from-amber-200 via-yellow-300 to-amber-200' },
    cat: { name: 'Кошечка Юми', emoji: '🐱', bubbleColor: 'from-pink-200 via-rose-300 to-pink-200' },
    piglet: { name: 'Поросёнок Пятачок', emoji: '🐷', bubbleColor: 'from-purple-200 via-fuchsia-300 to-purple-200' },
  };

  const currentMeta = mascotTitles[mascot] || mascotTitles.poro;

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* 🗣️ 15-Language Speech Bubble ("УМНИЦА МАШКА!" / "Мяу!" / "Хрю!") */}
      {praise && (
        <div
          className={`absolute -top-20 md:-top-24 z-40 max-w-[270px] md:max-w-[320px] px-3.5 py-2.5 rounded-2xl bg-gradient-to-r ${currentMeta.bubbleColor} text-slate-950 border-2 border-yellow-500 shadow-[0_0_25px_rgba(250,204,21,0.7)] animate-in fade-in zoom-in-95 duration-200 pointer-events-none`}
        >
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-950 mb-0.5 border-b border-amber-900/15 pb-0.5">
            <span className="flex items-center gap-1">
              <span>{praise.flag}</span>
              <span>{praise.langName}</span>
              <span className="ml-1 text-slate-800">({currentMeta.name})</span>
            </span>
            <span className="text-[9px] bg-amber-400/80 px-1.5 rounded-full font-mono">🔊 Говорит вслух</span>
          </div>
          <div className="text-sm font-black text-slate-950 leading-tight">
            {praise.text}
          </div>
          {praise.phonetic && praise.bcp47 !== 'ru-RU' && (
            <div className="text-[10px] font-bold text-amber-900/90 italic mt-0.5">
              [{praise.phonetic}]
            </div>
          )}
          {/* Comic speech bubble arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-yellow-300" />
        </div>
      )}

      {/* Mascot Body */}
      <div
        onClick={handleClick}
        className={`relative cursor-pointer transition-transform duration-300 ${
          isWiggling ? 'scale-110 -rotate-12' : isCheering ? 'animate-bounce' : 'hover:scale-105'
        }`}
        title={`Нажми на ${currentMeta.name} — похвалит Машку вслух!`}
      >
        <svg viewBox="0 0 100 90" className="w-16 h-14 md:w-20 md:h-18 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
          {/* Zero-G Celestial Thruster Plume */}
          <ellipse cx="50" cy="80" rx="14" ry="4" fill="rgba(56, 189, 248, 0.4)" filter="blur(2px)" />
          <ellipse cx="50" cy="78" rx="8" ry="3" fill="#38bdf8" />

          {/* Jetpack Thrusters */}
          <rect x="32" y="58" width="6" height="12" rx="3" fill="#334155" />
          <rect x="62" y="58" width="6" height="12" rx="3" fill="#334155" />

          {/* Render Animal Character */}
          {mascot === 'poro' && renderPoroBody(isWorried)}
          {mascot === 'cat' && renderCatBody(isWorried)}
          {mascot === 'piglet' && renderPigletBody(isWorried)}
        </svg>

        {/* Mascot switcher badge */}
        {onOpenMascotShop && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenMascotShop();
            }}
            className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 border border-cyan-400 text-[9px] font-black text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition shadow"
            title="Сменить зверька в магазине"
          >
            {currentMeta.emoji} СМЕНИТЬ
          </button>
        )}

        {/* Small badge */}
        {!praise && isCheering && (
          <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-bounce">
            УМНИЦА! ✨
          </div>
        )}
      </div>
    </div>
  );
};

// 1. Поро
function renderPoroBody(isWorried: boolean) {
  return (
    <g>
      {/* Fluffy Round Poro Body */}
      <circle cx="50" cy="46" r="28" fill="#f8fafc" />
      <circle cx="50" cy="46" r="26" fill="#ffffff" />
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

      {/* Astronaut Visor Dome */}
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
      <path d="M48 51C48 56 52 56 52 51Z" fill="#f43f5e" stroke="#be185d" strokeWidth="0.8" />
    </g>
  );
}

// 2. Кошечка (Космо-Котик)
function renderCatBody(isWorried: boolean) {
  return (
    <g>
      {/* Cat Ears */}
      <polygon points="26,30 20,12 36,22" fill="#fed7aa" stroke="#fb923c" strokeWidth="1.2" />
      <polygon points="27,27 22,16 33,23" fill="#f43f5e" />
      <polygon points="74,30 80,12 64,22" fill="#fed7aa" stroke="#fb923c" strokeWidth="1.2" />
      <polygon points="73,27 78,16 67,23" fill="#f43f5e" />

      {/* Round Kitten Head & Body */}
      <circle cx="50" cy="46" r="27" fill="#ffedd5" stroke="#fdba74" strokeWidth="1" />
      <circle cx="50" cy="46" r="25" fill="#fff7ed" />
      <ellipse cx="50" cy="63" rx="17" ry="8" fill="#fed7aa" />

      {/* Little Paws */}
      <ellipse cx="36" cy="68" rx="6" ry="4" fill="#fed7aa" />
      <ellipse cx="64" cy="68" rx="6" ry="4" fill="#fed7aa" />

      {/* Space Cat Visor Dome */}
      <ellipse cx="50" cy="44" rx="27" ry="25" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" strokeWidth="1.5" />
      <ellipse cx="38" cy="30" rx="9" ry="3.5" fill="rgba(255, 255, 255, 0.5)" transform="rotate(-25 38 30)" />

      {/* Glowing Hextech Bell Collar */}
      <rect x="36" y="62" width="28" height="4" rx="2" fill="#ec4899" />
      <circle cx="50" cy="65" r="4.5" fill="#00f0ff" stroke="#facc15" strokeWidth="1" />
      <circle cx="50" cy="65" r="2" fill="#ffffff" />

      {/* Big Cat Eyes (Sparkling emerald/cyan) */}
      <ellipse cx="39" cy="41" rx="5" ry="6" fill="#0284c7" />
      <circle cx="39" cy="41" r="4" fill="#06b6d4" />
      <circle cx="37" cy="39" r="2" fill="#ffffff" />
      <circle cx="41" cy="43" r="1" fill="#ffffff" />

      <ellipse cx="61" cy="41" rx="5" ry="6" fill="#0284c7" />
      <circle cx="61" cy="41" r="4" fill="#06b6d4" />
      <circle cx="59" cy="39" r="2" fill="#ffffff" />
      <circle cx="63" cy="43" r="1" fill="#ffffff" />

      {/* Tiny Pink Cat Nose */}
      <polygon points="50,47 48,45 52,45" fill="#f43f5e" />

      {/* Cat Mouth W-shape */}
      <path d="M46 49 C48 51 50 49 50 49 C50 49 52 51 54 49" stroke="#9a3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Whiskers */}
      <line x1="33" y1="46" x2="22" y2="44" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="33" y1="49" x2="22" y2="50" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="67" y1="46" x2="78" y2="44" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="67" y1="49" x2="78" y2="50" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

// 3. Поросёнок (Космо-Хрюша)
function renderPigletBody(isWorried: boolean) {
  return (
    <g>
      {/* Floppy Piggy Ears */}
      <ellipse cx="27" cy="24" rx="7" ry="11" transform="rotate(-30 27 24)" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
      <ellipse cx="27" cy="24" rx="4" ry="7" transform="rotate(-30 27 24)" fill="#fbcfe8" />

      <ellipse cx="73" cy="24" rx="7" ry="11" transform="rotate(30 73 24)" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
      <ellipse cx="73" cy="24" rx="4" ry="7" transform="rotate(30 73 24)" fill="#fbcfe8" />

      {/* Curly Pig Tail Behind */}
      <path d="M74 54 C82 52 84 60 78 62 C74 63 76 56 80 57" fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />

      {/* Plump Pink Body */}
      <circle cx="50" cy="46" r="28" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.2" />
      <circle cx="50" cy="46" r="25.5" fill="#fdf2f8" />

      {/* Rosy Cheeks */}
      <ellipse cx="32" cy="48" rx="4.5" ry="3" fill="#f472b6" opacity="0.6" />
      <ellipse cx="68" cy="48" rx="4.5" ry="3" fill="#f472b6" opacity="0.6" />

      {/* Little Paws / Hoofs */}
      <ellipse cx="36" cy="68" rx="6" ry="4" fill="#f472b6" />
      <ellipse cx="64" cy="68" rx="6" ry="4" fill="#f472b6" />

      {/* Space Astronaut Visor Dome */}
      <ellipse cx="50" cy="44" rx="27" ry="25" fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" strokeWidth="1.5" />
      <ellipse cx="38" cy="30" rx="9" ry="3.5" fill="rgba(255, 255, 255, 0.5)" transform="rotate(-25 38 30)" />

      {/* Cute Piggy Eyes */}
      <ellipse cx="40" cy="40" rx="4.5" ry="5.5" fill="#0f172a" />
      <circle cx="39" cy="38" r="2" fill="#ffffff" />
      <circle cx="42" cy="42" r="1" fill="#ffffff" />

      <ellipse cx="60" cy="40" rx="4.5" ry="5.5" fill="#0f172a" />
      <circle cx="59" cy="38" r="2" fill="#ffffff" />
      <circle cx="62" cy="42" r="1" fill="#ffffff" />

      {/* Big Piggy Snout */}
      <ellipse cx="50" cy="50" rx="9" ry="6.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
      <ellipse cx="50" cy="49" rx="7.5" ry="5" fill="#f9a8d4" />
      {/* Nostrils */}
      <ellipse cx="46.5" cy="50" rx="1.8" ry="2.5" fill="#831843" />
      <ellipse cx="53.5" cy="50" rx="1.8" ry="2.5" fill="#831843" />

      {/* Happy Smile */}
      <path d="M46 59 C48 62 52 62 54 59" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </g>
  );
}
