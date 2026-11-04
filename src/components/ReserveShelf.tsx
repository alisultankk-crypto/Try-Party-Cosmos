import React from 'react';
import { TileItemData, Language } from '../types/game';
import { FunnyCosmicChamps, CHAMPION_METAS } from './FunnyCosmicChamps';
import { LEVEL_THEMES } from '../types/levelTheme';

interface ReserveShelfProps {
  tiles: TileItemData[];
  onTileClick: (tile: TileItemData) => void;
  lang?: Language;
  level?: number;
}

export const ReserveShelf: React.FC<ReserveShelfProps> = ({
  tiles,
  onTileClick,
  lang = 'ru',
  level = 1,
}) => {
  if (tiles.length === 0) return null;
  const theme = LEVEL_THEMES[level] || LEVEL_THEMES[1];

  return (
    <div className="flex flex-col items-center mb-2 select-none">
      <div className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-3 py-0.5 rounded-full mb-1 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
        {lang === 'ru'
          ? '⚡ КВАНТОВЫЙ РЕЗЕРВ (нажми, чтобы вернуть в слот)'
          : '⚡ QUANTUM RESERVE (click to return to slot)'}
      </div>
      <div
        className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border-2 shadow-2xl"
        style={{ borderColor: theme.cardBorder }}
      >
        {tiles.map((tile) => {
          const meta = CHAMPION_METAS[tile.type] || {
            neonColor: '#00f0ff',
            neonGlow: 'rgba(0, 240, 255, 0.8)',
          };

          return (
            <div
              key={tile.id}
              onClick={() => onTileClick(tile)}
              className="relative w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#e2e8f0] border-2 shadow-lg cursor-pointer hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all"
              style={{
                borderColor: meta.neonColor,
                boxShadow: `0 0 14px ${meta.neonGlow}, 0 3px 0 #94a3b8`,
              }}
            >
              {/* Category Neon Indicator Dot at Top Right */}
              <div
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{
                  backgroundColor: meta.neonColor,
                  boxShadow: `0 0 6px ${meta.neonGlow}`,
                }}
              />
              <FunnyCosmicChamps type={tile.type} isCovered={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
