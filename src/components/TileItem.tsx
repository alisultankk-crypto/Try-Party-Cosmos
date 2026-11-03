import React from 'react';
import { TileItemData } from '../types/game';
import { FunnyCosmicChamps, CHAMPION_METAS } from './FunnyCosmicChamps';

interface TileItemProps {
  tile: TileItemData;
  onClick?: (tile: TileItemData) => void;
  style?: React.CSSProperties;
  className?: string;
  isHinted?: boolean;
}

export const TileItem: React.FC<TileItemProps> = ({
  tile,
  onClick,
  style,
  className = '',
  isHinted = false,
}) => {
  const isClickable = !tile.isCovered && !tile.inSlot && !tile.inShelf;
  const meta = CHAMPION_METAS[tile.type] || { accentColor: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.5)' };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isClickable && onClick) {
      onClick(tile);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={style}
      className={`absolute w-12 h-14 rounded-xl transition-all duration-150 select-none ${
        isClickable
          ? 'cursor-pointer hover:-translate-y-1 active:translate-y-0 active:scale-95 z-20'
          : 'cursor-not-allowed pointer-events-none'
      } ${className}`}
    >
      {/* 3D Cosmic Hextech Tile Chassis */}
      <div
        className={`relative w-full h-full rounded-xl flex items-center justify-center border-2 transition-all duration-200 ${
          isClickable
            ? isHinted
              ? 'bg-gradient-to-b from-purple-900 to-indigo-950 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.9)] ring-2 ring-yellow-400 animate-pulse'
              : 'bg-gradient-to-b from-[#1e1b4b] via-[#111827] to-[#030712] border-[#38bdf8]/50 shadow-[0_4px_0_#0f172a,0_8px_16px_rgba(56,189,248,0.25)] hover:border-[#38bdf8] hover:shadow-[0_4px_0_#0f172a,0_10px_22px_rgba(56,189,248,0.45)]'
            : 'bg-gradient-to-b from-[#0f172a] to-[#020617] border-[#1e293b] shadow-[0_3px_0_#020617]'
        }`}
        style={{
          borderColor: isClickable && !isHinted ? meta.accentColor + '88' : undefined,
          boxShadow: isClickable && !isHinted ? `0 4px 0 #030712, 0 6px 14px ${meta.glowColor}` : undefined,
        }}
      >
        {/* Subtle Tech Grid Corner Accents */}
        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-white/40" />
        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/40" />

        {/* Funny League of Legends Cosmic Champion Illustration */}
        <div
          className={`transform transition-transform ${
            isClickable ? 'scale-100' : 'scale-95'
          }`}
        >
          <FunnyCosmicChamps type={tile.type} isCovered={tile.isCovered} />
        </div>

        {/* Dimming Layer when covered by higher tiles */}
        {tile.isCovered && (
          <div className="absolute inset-0 rounded-xl bg-slate-950/70 backdrop-blur-[0.5px]" />
        )}
      </div>
    </div>
  );
};
