import React, { useState } from 'react';
import { Trophy, X, Users, Sparkles, Timer, Calendar, Share2, Check } from 'lucide-react';
import { RegionScore, DailyLeaderboardEntry, Language } from '../types/game';
import { formatTimePrecise } from './DailyTimer';
import { TRANSLATIONS } from '../i18n/translations';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayLabel: string;
  userBestTime?: number | null;
  dailyEntries: DailyLeaderboardEntry[];
  lang?: Language;
}

const REGION_DATA: RegionScore[] = [
  { rank: 1, name: 'EU West (Ionia)', clearedCount: 3420, badge: '🥇' },
  { rank: 2, name: 'RU (Freljord)', clearedCount: 2890, badge: '🥈' },
  { rank: 3, name: 'KR (Noxus)', clearedCount: 2150, badge: '🥉' },
  { rank: 4, name: 'NA (Piltover)', clearedCount: 1640, badge: '🎖️' },
  { rank: 5, name: 'EUNE (Demacia)', clearedCount: 1320, badge: '🎖️' },
  { rank: 6, name: 'CN (Targon)', clearedCount: 1110, badge: '🎖️' },
  { rank: 7, name: 'BR (Bilgewater)', clearedCount: 940, badge: '🎖️' },
  { rank: 8, name: 'JP (Zaun)', clearedCount: 780, badge: '🎖️' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  dayLabel,
  userBestTime,
  dailyEntries,
  lang = 'ru',
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'regions'>('daily');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  const handleShare = () => {
    const text = userBestTime
      ? `🏆 Я собрал космические тройки в Try Party: COSMOS за ${formatTimePrecise(userBestTime)}! Сможешь быстрее? 🌌⚡`
      : `🌌 Прохожу Try Party: COSMOS! Попробуй побить рекорд дня!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.3)] p-5 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950/80 border border-cyan-500/30 mb-4 mt-2">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'daily'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'СКОРОСТЬ (ДЕНЬ)' : 'SPEEDRUN (DAY)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('regions')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'regions'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'СЕРВЕРЫ' : 'SERVERS'}</span>
          </button>
        </div>

        {activeTab === 'daily' ? (
          <div>
            {/* Date and info */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-cyan-500/30 mb-3 text-xs">
              <div className="flex items-center gap-1 text-cyan-300 font-bold">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{dayLabel}</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {lang === 'ru' ? 'Фиксированная доска' : 'Fixed daily board'}
              </span>
            </div>

            {/* User personal best banner */}
            <div className="p-2.5 rounded-xl bg-slate-950 text-white border border-yellow-400/50 mb-3 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌌</span>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {lang === 'ru' ? 'Твой рекорд сегодня:' : 'Your record today:'}
                  </div>
                  <div className="text-sm font-black font-mono text-yellow-300">
                    {userBestTime ? formatTimePrecise(userBestTime) : (lang === 'ru' ? 'Не пройдено' : 'Not cleared')}
                  </div>
                </div>
              </div>

              {userBestTime && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition active:scale-95 shadow"
                  title="Share"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : (lang === 'ru' ? 'Поделиться' : 'Share')}</span>
                </button>
              )}
            </div>

            {/* Daily Speed Rankings */}
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
              {dailyEntries.map((entry) => {
                const medal =
                  entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-2 rounded-xl border transition ${
                      entry.isUser
                        ? 'bg-cyan-950/80 border-cyan-400 font-black shadow-md ring-1 ring-cyan-400'
                        : entry.rank <= 3
                        ? 'bg-slate-900/90 border-yellow-500/40 font-bold'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 text-center text-xs font-mono font-black text-yellow-400">{medal}</span>
                      <span className="text-sm">{entry.avatar}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-200 truncate">
                          {entry.playerName} {entry.isUser && (lang === 'ru' ? '(Вы)' : '(You)')}
                        </div>
                        <div className="text-[10px] text-slate-400">{entry.region}</div>
                      </div>
                    </div>

                    <div className="font-mono text-xs font-black text-cyan-300 pl-2">
                      {formatTimePrecise(entry.timeSeconds)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 mb-3 text-xs font-bold text-cyan-300">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ru' ? 'Побед игроков сегодня:' : 'Player winrate today:'}</span>
              </div>
              <span className="font-black text-rose-400 font-mono text-sm">0.14%</span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {REGION_DATA.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                    item.rank === 1
                      ? 'bg-cyan-950/70 border-cyan-400 font-black shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center text-sm">{item.badge}</span>
                    <span className="text-xs text-slate-200">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs text-cyan-400">
                    <Users className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{item.clearedCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition active:scale-95"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
