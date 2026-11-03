import React from 'react';
import { Gift, Check, Sparkles, X, Flame } from 'lucide-react';
import { Language, DailyLoginState, BoostersState, CosmicGem } from '../types/game';
import { COSMIC_GEMS } from '../data/cosmicGems';
import { CosmicGemSvg } from './CosmicGemSvg';
import { TRANSLATIONS } from '../i18n/translations';
import { puzzleSounds } from '../audio/puzzleSounds';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyLogin: DailyLoginState;
  lang: Language;
  onClaim: (boostersEarned: Partial<BoostersState>, gemEarned: CosmicGem) => void;
}

interface RewardTier {
  day: number;
  boosters: Partial<BoostersState>;
  gemId: string;
  labelRu: string;
  labelEn: string;
}

const REWARDS_SCHEDULE: RewardTier[] = [
  {
    day: 1,
    boosters: { undo: 1 },
    gemId: 'freljord_emerald',
    labelRu: '+1 Отмена',
    labelEn: '+1 Undo',
  },
  {
    day: 2,
    boosters: { shuffle: 1 },
    gemId: 'bandle_topaz',
    labelRu: '+1 Перемешать',
    labelEn: '+1 Shuffle',
  },
  {
    day: 3,
    boosters: { extract: 1 },
    gemId: 'star_ruby',
    labelRu: '+1 Вынуть 3',
    labelEn: '+1 Extract 3',
  },
  {
    day: 4,
    boosters: { undo: 2 },
    gemId: 'astral_sapphire',
    labelRu: '+2 Отмены',
    labelEn: '+2 Undos',
  },
  {
    day: 5,
    boosters: { shuffle: 2 },
    gemId: 'void_amethyst',
    labelRu: '+2 Перемешать',
    labelEn: '+2 Shuffles',
  },
  {
    day: 6,
    boosters: { extract: 2 },
    gemId: 'solar_amber',
    labelRu: '+2 Вынуть 3',
    labelEn: '+2 Extracts',
  },
  {
    day: 7,
    boosters: { undo: 3, shuffle: 3, extract: 3 },
    gemId: 'dragon_diamond',
    labelRu: '🔥 ДЖЕКПОТ! +3 Всех',
    labelEn: '🔥 JACKPOT! +3 All',
  },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  dailyLogin,
  lang,
  onClaim,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const { streak, hasClaimedToday } = dailyLogin;
  // Current active reward tier based on streak (1..7)
  const currentTierIndex = Math.min(Math.max(streak - 1, 0), 6);
  const currentReward = REWARDS_SCHEDULE[currentTierIndex];
  const associatedGem = COSMIC_GEMS.find((g) => g.id === currentReward.gemId) || COSMIC_GEMS[0];

  const handleClaimClick = () => {
    if (hasClaimedToday) return;
    puzzleSounds.playGemDrop();
    onClaim(currentReward.boosters, associatedGem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border-2 border-yellow-500/60 shadow-[0_0_50px_rgba(234,179,8,0.3)] text-white overflow-hidden p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-yellow-300 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce">
          🎁
        </div>

        <h2 className="text-2xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 mb-1">
          {t.dailyLoginTitle}
        </h2>
        <p className="text-xs text-center text-slate-300 mb-5">
          {t.dailyLoginSubtitle}
        </p>

        {/* Streak indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
            {t.streakDay}: {streak} / 7
          </span>
        </div>

        {/* 7-Days Rewards Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {REWARDS_SCHEDULE.map((tier) => {
            const isPast = tier.day < streak || (tier.day === streak && hasClaimedToday);
            const isToday = tier.day === streak && !hasClaimedToday;
            const gem = COSMIC_GEMS.find((g) => g.id === tier.gemId) || COSMIC_GEMS[0];

            return (
              <div
                key={tier.day}
                className={`relative flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all ${
                  isToday
                    ? 'bg-gradient-to-b from-yellow-500/20 to-amber-500/10 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-105 ring-2 ring-yellow-400/50'
                    : isPast
                    ? 'bg-slate-900/40 border-emerald-500/50 opacity-70'
                    : 'bg-slate-950/60 border-white/10 opacity-50'
                }`}
              >
                {/* Day label */}
                <span className="text-[10px] font-black uppercase text-slate-400 mb-1">
                  {t.day} {tier.day}
                </span>

                {/* Gem thumbnail */}
                <div className="my-1">
                  <CosmicGemSvg gem={gem} size={32} />
                </div>

                {/* Reward text */}
                <span className="text-[9px] font-extrabold text-yellow-300 leading-tight">
                  {lang === 'ru' ? tier.labelRu : tier.labelEn}
                </span>

                {/* Checked icon if claimed */}
                {isPast && (
                  <div className="absolute inset-0 rounded-xl bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-2">
          {!hasClaimedToday ? (
            <button
              onClick={handleClaimClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(250,204,21,0.5)] active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>{t.claimReward}</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center">
              <div className="text-xs font-black text-emerald-400 mb-0.5">
                {t.claimedToday}
              </div>
              <div className="text-[11px] text-slate-400">
                {t.comeBackTomorrow}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
