import React from 'react';
import { Flame, Trophy } from 'lucide-react';

export interface ScoreFloater {
  id: string;
  text: string;
  points: number;
  combo: number;
  x: number;
  y: number;
}

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  combo: number;
  floaters: ScoreFloater[];
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  highScore,
  combo,
  floaters,
}) => {
  return (
    <>
      {/* HUD Score Cluster */}
      <div className="flex items-center gap-2 select-none">
        {/* Score pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase font-mono">
              ОЧКИ (POINTS)
            </span>
            <span className="font-mono text-base md:text-lg font-black tabular-nums text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
              {score.toLocaleString()}
            </span>
          </div>

          {/* High Score Icon */}
          <div className="border-l border-white/15 pl-2 flex flex-col">
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
              <Trophy className="w-2.5 h-2.5 text-amber-400" />
              <span>ТОП</span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-300 tabular-nums">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Combo Fire Multiplier */}
        {combo > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 text-white text-xs font-black shadow-[0_0_15px_rgba(249,115,22,0.7)] animate-bounce border border-yellow-300">
            <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>x{combo} КОМБО!</span>
          </div>
        )}
      </div>

      {/* Floating Animated Score Numbers */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {floaters.map((f) => (
          <div
            key={f.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-out fade-out slide-out-to-top-12 duration-1000 fill-mode-forwards"
            style={{ left: f.x, top: f.y }}
          >
            <div
              className={`font-black font-mono text-xl md:text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${
                f.combo > 2
                  ? 'text-yellow-300 scale-125'
                  : f.combo > 1
                  ? 'text-amber-400 scale-110'
                  : 'text-cyan-300'
              }`}
            >
              +{f.points}
            </div>
            {f.combo > 1 && (
              <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md -mt-1">
                {f.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
