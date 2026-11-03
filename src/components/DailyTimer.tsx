import React, { useEffect, useState } from 'react';
import { Timer, Calendar, Clock } from 'lucide-react';
import { getMsUntilTomorrow } from '../game/levelGenerator';

interface DailyTimerProps {
  elapsedSeconds: number;
  isRunning: boolean;
  dayLabel: string;
  bestTimeSeconds?: number | null;
}

export function formatTimePrecise(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const centis = Math.floor((totalSeconds % 1) * 100);

  const mStr = String(mins).padStart(2, '0');
  const sStr = String(secs).padStart(2, '0');
  const cStr = String(centis).padStart(2, '0');
  return `${mStr}:${sStr}.${cStr}`;
}

export function formatTimeSimple(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const mStr = String(mins).padStart(2, '0');
  const sStr = String(secs).padStart(2, '0');
  return `${mStr}:${sStr}`;
}

export const DailyTimer: React.FC<DailyTimerProps> = ({
  elapsedSeconds,
  isRunning,
  dayLabel,
  bestTimeSeconds,
}) => {
  const [resetCountdown, setResetCountdown] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const ms = getMsUntilTomorrow();
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      setResetCountdown(`${hours}ч ${minutes}м ${seconds}с`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {/* Top Row: Cosmic Date & Reset Timer */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-200 bg-slate-900/90 border border-cyan-500/40 px-3 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.25)]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-cyan-400" />
          <span>{dayLabel}</span>
        </div>
        <span className="text-cyan-500">•</span>
        <div className="flex items-center gap-1 text-slate-300">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>Сброс через: <strong className="font-mono text-cyan-300">{resetCountdown}</strong></span>
        </div>
      </div>

      {/* Main Quantum Stopwatch Pill */}
      <div className="flex items-center gap-3 px-3.5 py-1 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div className="flex items-center gap-1.5">
          <Timer className={`w-4 h-4 ${isRunning ? 'text-cyan-400 animate-spin-slow' : 'text-slate-500'}`} />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">ТАЙМЕР:</span>
          <span className="font-mono text-base md:text-lg font-black tabular-nums text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
            {formatTimePrecise(elapsedSeconds)}
          </span>
        </div>

        {bestTimeSeconds !== undefined && bestTimeSeconds !== null && (
          <div className="border-l border-white/15 pl-2.5 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <span className="text-slate-400">РЕКОРД:</span>
            <span className="font-mono font-black">{formatTimePrecise(bestTimeSeconds)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
