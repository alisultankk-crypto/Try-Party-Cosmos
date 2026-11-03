import React from 'react';
import { Trophy, Skull, RotateCcw, Home, Flame, Clock } from 'lucide-react';
import { GameState } from '../game/CrazyCattleGame';

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
  onReturnMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  state,
  onRestart,
  onReturnMenu,
}) => {
  const isVictory = state.status === 'victory';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md select-none">
      <div className="w-full max-w-md p-6 md:p-8 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl text-center transform animate-in fade-in zoom-in-95 duration-200">
        {/* Victory / Defeat Icon */}
        <div className="flex justify-center mb-4">
          {isVictory ? (
            <div className="p-4 rounded-3xl bg-yellow-500/20 border-2 border-yellow-400 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
              <Trophy className="w-14 h-14" />
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-rose-500/20 border-2 border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <Skull className="w-14 h-14" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black text-white mb-1">
          {isVictory ? 'ЧЕМПИОН АРЕНЫ!' : 'ВЫБИТ ИЗ АРЕНЫ!'}
        </h2>
        <p className="text-sm font-semibold text-slate-400 mb-6">
          {isVictory
            ? 'Ты выдержал все столкновения и остался единственным бараном на арене!'
            : `Ты упал в пропасть. Твое итоговое место: #${state.playerRank}`}
        </p>

        {/* Match Statistics */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/5">
            <div className="text-xs font-semibold text-slate-400 mb-1">МЕСТО</div>
            <div
              className={`text-2xl font-black tabular-nums ${
                isVictory ? 'text-yellow-400' : 'text-slate-200'
              }`}
            >
              #{state.playerRank}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/5">
            <div className="text-xs font-semibold text-slate-400 mb-1">ВЫБИТО</div>
            <div className="flex items-center justify-center gap-1 text-2xl font-black tabular-nums text-emerald-400">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{state.playerKills}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/5">
            <div className="text-xs font-semibold text-slate-400 mb-1">ВРЕМЯ</div>
            <div className="flex items-center justify-center gap-1 text-xl font-black tabular-nums text-cyan-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{formatTime(state.matchTime)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-xl shadow-emerald-900/40 transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span>ИГРАТЬ СНОВА</span>
            <span className="text-xs px-2 py-0.5 rounded bg-black/20 text-emerald-100 font-mono ml-1 hidden sm:inline">
              ПРОБЕЛ
            </span>
          </button>

          <button
            onClick={onReturnMenu}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-750 active:scale-95 text-slate-300 hover:text-white font-bold text-sm rounded-xl border border-white/10 transition"
          >
            <Home className="w-4 h-4" />
            <span>В ГЛАВНОЕ МЕНЮ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
