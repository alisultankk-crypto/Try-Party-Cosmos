import React from 'react';
import { TileItemData } from '../types/game';
import { FunnyCosmicChamps, CHAMPION_METAS } from './FunnyCosmicChamps';

interface TileItemProps {
  tile: TileItemData;
  onClick?: (tile: TileItemData) => void;
  style?: React.CSSProperties;
  className?: string;
  isHinted?: boolean;
  level?: number;
}

export const TileItem: React.FC<TileItemProps> = ({
  tile,
  onClick,
  style,
  className = '',
  isHinted = false,
}) => {
  const isClickable = !tile.isCovered && !tile.inSlot && !tile.inShelf;
  const meta = CHAMPION_METAS[tile.type] || {
    accentColor: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.5)',
    neonColor: '#00f0ff',
    neonGlow: 'rgba(0, 240, 255, 0.8)',
    category: 'Предмет',
  };

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
          ? 'cursor-pointer hover:-translate-y-1.5 active:translate-y-0 active:scale-95 z-20'
          : 'cursor-not-allowed pointer-events-none'
      } ${className}`}
    >
      {/* Whitish-Gray Ceramic Card with Category Neon Glow Outline */}
      <div
        className={`relative w-full h-full rounded-xl flex items-center justify-center border-2 transition-all duration-200 ${
          isClickable
            ? isHinted
              ? 'bg-gradient-to-b from-amber-50 via-white to-yellow-100 ring-4 ring-yellow-400 animate-pulse'
              : 'bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#e2e8f0] hover:brightness-105'
            : 'bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] border-slate-600/50'
        }`}
        style={{
          borderColor: isClickable
            ? isHinted
              ? '#facc15'
              : meta.neonColor
            : 'rgba(100, 116, 139, 0.4)',
          boxShadow: isClickable
            ? isHinted
              ? '0 0 24px rgba(250, 204, 21, 1), 0 4px 0 #ca8a04'
              : `0 0 16px ${meta.neonGlow}, 0 4px 0 #94a3b8, 0 6px 14px rgba(0,0,0,0.35)`
            : '0 2px 0 #475569',
        }}
      >
        {/* Subtle Ceramic Bevel Specular Highlights */}
        <div className="absolute top-1 left-1.5 right-1.5 h-1 rounded-full bg-white/80 pointer-events-none" />

        {/* Category Neon Indicator Dot at Top Right */}
        {isClickable && (
          <div
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full pointer-events-none transition-all"
            style={{
              backgroundColor: meta.neonColor,
              boxShadow: `0 0 6px ${meta.neonGlow}`,
            }}
          />
        )}

        {/* DOORS Item Artwork */}
        <div
          className={`transform transition-transform ${
            isClickable ? 'scale-100' : 'scale-95'
          }`}
        >
          <FunnyCosmicChamps type={tile.type} isCovered={tile.isCovered} />
        </div>

        {/* Dimming Layer when covered by higher tiles */}
        {tile.isCovered && (
          <div className="absolute inset-0 rounded-xl bg-slate-950/65 backdrop-blur-[0.5px] flex items-center justify-center">
            {/* Soft locked overlay */}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40" />
          </div>
        )}
      </div>
    </div>
  );
};
