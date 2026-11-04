import React from 'react';
import { CosmicGem } from '../types/game';

interface CosmicGemSvgProps {
  gem: CosmicGem;
  size?: number;
  className?: string;
  isUnlocked?: boolean;
}

export const CosmicGemSvg: React.FC<CosmicGemSvgProps> = ({
  gem,
  size = 56,
  className = '',
  isUnlocked = true,
}) => {
  if (!isUnlocked) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className={`filter grayscale opacity-30 drop-shadow-none ${className}`}
      >
        <circle cx="32" cy="32" r="26" fill="#1e293b" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
        <text x="32" y="38" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">?</text>
      </svg>
    );
  }

  const { color, glowColor, shape } = gem;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`transition-all duration-300 drop-shadow-[0_0_12px_${glowColor}] ${className}`}
      style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
    >
      <defs>
        {/* Radial highlight */}
        <radialGradient id={`glow-${gem.id}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="35%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0b0f19" stopOpacity="0.95" />
        </radialGradient>

        <linearGradient id={`grad-${gem.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>
      </defs>

      {/* Shapes */}
      {shape === 'diamond' && (
        <g>
          {/* Main diamond polygon */}
          <polygon points="32,6 56,22 32,58 8,22" fill={`url(#glow-${gem.id})`} stroke={color} strokeWidth="1.5" />
          {/* Facets */}
          <polygon points="32,6 20,22 32,58" fill="#ffffff" fillOpacity="0.25" />
          <polygon points="32,6 44,22 32,58" fill="#000000" fillOpacity="0.25" />
          <polygon points="20,22 32,22 32,58" fill="#ffffff" fillOpacity="0.15" />
          <line x1="8" y1="22" x2="56" y2="22" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
          {/* Shimmer sparkle */}
          <circle cx="28" cy="18" r="2.5" fill="#ffffff" />
          <polygon points="28,12 29,18 35,18 30,21 32,26 28,22 24,26 26,21 21,18 27,18" fill="#ffffff" opacity="0.85" />
        </g>
      )}

      {shape === 'emerald' && (
        <g>
          {/* Emerald rectangular step-cut */}
          <polygon points="18,10 46,10 56,20 56,44 46,54 18,54 8,44 8,20" fill={`url(#glow-${gem.id})`} stroke={color} strokeWidth="1.5" />
          {/* Inner table facet */}
          <polygon points="22,18 42,18 48,24 48,40 42,46 22,46 16,40 16,24" fill={`url(#grad-${gem.id})`} stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" />
          {/* Corner lines */}
          <line x1="18" y1="10" x2="22" y2="18" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="46" y1="10" x2="42" y2="18" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="56" y1="20" x2="48" y2="24" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="56" y1="44" x2="48" y2="40" stroke="#000000" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="46" y1="54" x2="42" y2="46" stroke="#000000" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="18" y1="54" x2="22" y2="46" stroke="#000000" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="8" y1="44" x2="16" y2="40" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="8" y1="20" x2="16" y2="24" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
          <circle cx="26" cy="22" r="2" fill="#ffffff" />
        </g>
      )}

      {shape === 'hexagon' && (
        <g>
          {/* Hexagon cut */}
          <polygon points="32,8 54,20 54,44 32,56 10,44 10,20" fill={`url(#glow-${gem.id})`} stroke={color} strokeWidth="1.5" />
          <polygon points="32,16 46,24 46,40 32,48 18,40 18,24" fill={`url(#grad-${gem.id})`} stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="32" y1="8" x2="32" y2="16" stroke="#ffffff" strokeWidth="1" />
          <line x1="54" y1="20" x2="46" y2="24" stroke="#ffffff" strokeWidth="1" />
          <line x1="54" y1="44" x2="46" y2="40" stroke="#000000" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="32" y1="56" x2="32" y2="48" stroke="#000000" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="10" y1="44" x2="18" y2="40" stroke="#ffffff" strokeWidth="1" />
          <line x1="10" y1="20" x2="18" y2="24" stroke="#ffffff" strokeWidth="1" />
          <circle cx="28" cy="22" r="2.5" fill="#ffffff" />
        </g>
      )}

      {shape === 'teardrop' && (
        <g>
          {/* Pear/Teardrop cut */}
          <path
            d="M32,8 C38,18 52,32 52,42 C52,53 43,58 32,58 C21,58 12,53 12,42 C12,32 26,18 32,8 Z"
            fill={`url(#glow-${gem.id})`}
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M32,16 C36,24 44,34 44,42 C44,48 38,52 32,52 C26,52 20,48 20,42 C20,34 28,24 32,16 Z"
            fill={`url(#grad-${gem.id})`}
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />
          <circle cx="28" cy="28" r="3" fill="#ffffff" opacity="0.85" />
          <circle cx="34" cy="22" r="1.5" fill="#ffffff" opacity="0.6" />
        </g>
      )}

      {shape === 'crystal' && (
        <g>
          {/* Tall obelisk crystal shard */}
          <polygon points="32,6 48,18 44,54 32,60 20,54 16,18" fill={`url(#glow-${gem.id})`} stroke={color} strokeWidth="1.5" />
          <polygon points="32,6 32,60 20,54 16,18" fill="#ffffff" fillOpacity="0.25" />
          <polygon points="32,6 48,18 44,54 32,60" fill="#000000" fillOpacity="0.3" />
          <line x1="32" y1="6" x2="32" y2="60" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Energy cracks */}
          <path d="M26,24 L32,30 L28,38 L32,42" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          <circle cx="32" cy="18" r="2.5" fill="#ffffff" />
        </g>
      )}

      {shape === 'heart' && (
        <g>
          {/* Heart shaped gemstone */}
          <path
            d="M32,56 C14,44 8,32 8,22 C8,14 14,8 22,8 C27,8 30,11 32,14 C34,11 37,8 42,8 C50,8 56,14 56,22 C56,32 50,44 32,56 Z"
            fill={`url(#glow-${gem.id})`}
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M32,48 C20,38 14,28 14,21 C14,15 18,12 23,12 C27,12 30,15 32,18 C34,15 37,12 41,12 C46,12 50,15 50,21 C50,28 44,38 32,48 Z"
            fill={`url(#grad-${gem.id})`}
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          <circle cx="24" cy="18" r="3" fill="#ffffff" opacity="0.85" />
          <circle cx="28" cy="24" r="1.5" fill="#ffffff" opacity="0.6" />
        </g>
      )}

      {shape === 'star' && (
        <g>
          {/* 8-pointed star crystal */}
          <polygon
            points="32,4 37,20 54,14 42,27 58,32 42,37 54,50 37,44 32,60 27,44 10,50 22,37 6,32 22,27 10,14 27,20"
            fill={`url(#glow-${gem.id})`}
            stroke={color}
            strokeWidth="1.5"
          />
          <circle cx="32" cy="32" r="9" fill={`url(#grad-${gem.id})`} stroke="#ffffff" strokeWidth="1" />
          <circle cx="32" cy="32" r="4" fill="#ffffff" />
        </g>
      )}

      {shape === 'orb' && (
        <g>
          {/* Cosmic Orb / Pearl */}
          <circle cx="32" cy="32" r="24" fill={`url(#glow-${gem.id})`} stroke={color} strokeWidth="1.5" />
          {/* Saturn-like cosmic orbital ring */}
          <ellipse cx="32" cy="32" rx="28" ry="8" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.75" transform="rotate(-25 32 32)" />
          {/* Shimmer glare */}
          <circle cx="25" cy="24" r="5" fill="#ffffff" opacity="0.85" />
          <circle cx="21" cy="20" r="2" fill="#ffffff" />
        </g>
      )}

      {shape === 'hextech' && (
        <g>
          {/* ⚡ HEXTECH CRYSTAL FROM ARCANE: Runic Golden Stabilizers + Pulsating Raw Blue Arcane Core */}
          {/* Outer glowing arcane aura */}
          <circle cx="32" cy="32" r="29" fill="#00f0ff" opacity="0.18" />
          
          {/* Outer Brass Gyroscopic Stabilizer Ring */}
          <circle cx="32" cy="32" r="26" fill="none" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="32" cy="32" r="26" fill="none" stroke="#facc15" strokeWidth="1.8" />
          
          {/* Runic clamp brackets (Jayce & Viktor's stabilization cage) */}
          <rect x="30" y="3" width="4" height="6" rx="1" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />
          <rect x="30" y="55" width="4" height="6" rx="1" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />
          <rect x="3" y="30" width="6" height="4" rx="1" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />
          <rect x="55" y="30" width="6" height="4" rx="1" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />

          {/* Angled Gimbal Runic Ring */}
          <ellipse
            cx="32"
            cy="32"
            rx="23"
            ry="11"
            transform="rotate(-35 32 32)"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeDasharray="6 2 2 2"
          />

          {/* Pure Blue Hextech Arcane Sphere Core */}
          <circle cx="32" cy="32" r="16" fill={`url(#glow-${gem.id})`} stroke="#00f0ff" strokeWidth="2" />

          {/* Hexagonal Inner Facets */}
          <polygon
            points="32,19 43,25 43,39 32,45 21,39 21,25"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />

          {/* Arcane Lightning Filaments */}
          <path d="M23,28 L30,32 L26,36 L34,34 L38,26" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M28,24 L32,30 L39,36" fill="none" stroke="#7dd3fc" strokeWidth="1.2" strokeLinecap="round" />

          {/* Super-bright White Core Nucleus */}
          <circle cx="32" cy="32" r="5" fill="#ffffff" />
          <circle cx="32" cy="32" r="2.5" fill="#e0f2fe" />

          {/* Arcane Sparkles */}
          <circle cx="16" cy="16" r="1.5" fill="#00f0ff" />
          <circle cx="48" cy="18" r="1.5" fill="#facc15" />
          <circle cx="46" cy="46" r="1.8" fill="#00f0ff" />
          <circle cx="18" cy="48" r="1.2" fill="#38bdf8" />
        </g>
      )}
    </svg>
  );
};
