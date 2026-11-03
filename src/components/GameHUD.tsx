import React from 'react';
import { Volume2, VolumeX, RotateCcw, Zap, Shield, Flame, Sparkles, AlertTriangle } from 'lucide-react';
import { GameState } from '../game/CrazyCattleGame';

interface GameHUDProps {
  state: GameState;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onReturnMenu: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  isMuted,
  onToggleMute,
  onRestart,
  onReturnMenu,
}) => {
  const isChargeReady = state.playerChargeCooldownPct <= 0.01;
  const chargePercent = Math.round((1 - state.playerChargeCooldownPct) * 100);

  const powerupLabels = {
    boost: { label: '⚡ Золотой Разгон', color: 'text-amber-400 bg-amber-950/70 border-amber-500/50' },
    shield: { label: '🛡️ Стальная Шерсть', color: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/50' },
    giant: { label: '🍄 Мега-Овца', color: 'text-rose-400 bg-rose-950/70 border-rose-500/50' },
    spring: { label: '💨 Пружинные Копыта', color: 'text-purple-400 bg-purple-950/70 border-purple-500/50' },
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none flex flex-col justify-between p-4 md:p-6">
      {/* Top Header Cluster */}
      <div className="flex items-start justify-between w-full max-w-6xl mx-auto">
        {/* Left: Alive count & KOs */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl md:text-2xl font-black tabular-nums text-emerald-400">
                {state.aliveCount}
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                / {state.totalSheep} В ЖИВЫХ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-md w-fit">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-slate-300">ВЫБИТО:</span>
            <span className="text-sm font-black tabular-nums text-yellow-400">{state.playerKills}</span>
          </div>
        </div>

        {/* Center: Ring Danger Gauge */}
        <div className="flex flex-col items-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md shadow-lg transition-all ${
              state.isRingShrinking
                ? 'bg-rose-950/85 border-rose-500 text-rose-200'
                : 'bg-slate-900/80 border-white/10 text-slate-200'
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 ${state.isRingShrinking ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`}
            />
            <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide">
              {state.isRingShrinking ? (
                <span>ОПАСНАЯ ЗОНА СУЖАЕТСЯ!</span>
              ) : (
                <span>
                  СУЖЕНИЕ ЧЕРЕЗ:{' '}
                  <span className="text-yellow-400 font-mono tabular-nums">
                    {Math.ceil(state.ringShrinkTimer)}с
                  </span>
                </span>
              )}
            </div>
            <div className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300">
              {Math.round(state.ringRadius)}м
            </div>
          </div>
        </div>

        {/* Right: Sound & Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/10 text-white shadow-lg transition active:scale-95"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onRestart}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/10 text-white shadow-lg transition active:scale-95"
            title="Перезапустить раунд"
          >
            <RotateCcw className="w-4 h-4 text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Bottom Center: Ability Cooldown & Active Powerup */}
      <div className="flex flex-col items-center justify-end mb-2 w-full max-w-sm mx-auto">
        {/* Active Powerup Badge */}
        {state.activePowerup && powerupLabels[state.activePowerup] && (
          <div
            className={`mb-2.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-lg ${
              powerupLabels[state.activePowerup].color
            }`}
          >
            {powerupLabels[state.activePowerup].label}
          </div>
        )}

        {/* Charge Ability Bar */}
        <div className="flex flex-col items-center w-full bg-slate-900/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 shadow-2xl">
          <div className="flex items-center justify-between w-full mb-1.5 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-slate-200">
              <Zap className={`w-4 h-4 ${isChargeReady ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} />
              <span className="uppercase tracking-wider">ТАРАН (РАЗГОН)</span>
            </div>
            <span
              className={`font-mono text-xs ${
                isChargeReady ? 'text-yellow-400 font-extrabold' : 'text-slate-400'
              }`}
            >
              {isChargeReady ? 'ГОТОВ [ПРОБЕЛ]' : `${chargePercent}%`}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-75 ${
                isChargeReady
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${chargePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Left: Kill Feed */}
      <div className="absolute bottom-20 left-4 md:left-6 flex flex-col gap-1.5 max-w-xs pointer-events-none">
        {state.killFeed.map((msg, idx) => (
          <div
            key={idx}
            className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-sm border border-white/10 text-xs font-bold text-slate-200 shadow-md transition-opacity"
            style={{ opacity: Math.max(0.4, 1 - idx * 0.18) }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};
