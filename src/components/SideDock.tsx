import React from 'react';
import { Gem, Gift, Download, Music, Volume2, VolumeX, HelpCircle, Coins } from 'lucide-react';
import { Language, MascotId } from '../types/game';

interface SideDockProps {
  totalGems: number;
  coins: number;
  activeMascot: MascotId;
  hasDailyUnclaimed: boolean;
  bgmActive: boolean;
  isMuted: boolean;
  lang: Language;
  onOpenInventory: () => void;
  onOpenDailyReward: () => void;
  onOpenMobilePackages: () => void;
  onToggleBGM: () => void;
  onToggleMute: () => void;
  onToggleLang: () => void;
  onOpenHelp: () => void;
}

export const SideDock: React.FC<SideDockProps> = ({
  totalGems,
  coins,
  activeMascot,
  hasDailyUnclaimed,
  bgmActive,
  isMuted,
  lang,
  onOpenInventory,
  onOpenDailyReward,
  onOpenMobilePackages,
  onToggleBGM,
  onToggleMute,
  onToggleLang,
  onOpenHelp,
}) => {
  const mascotEmoji = activeMascot === 'cat' ? '🐱' : activeMascot === 'piglet' ? '🐷' : '✨';

  return (
    <aside className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 p-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)] select-none animate-in fade-in slide-in-from-left duration-300">
      {/* 1. 🪙 Золотые Монеты & Зверята */}
      <button
        onClick={onOpenInventory}
        className="group relative p-2 rounded-xl bg-gradient-to-b from-yellow-950/80 to-slate-950 hover:bg-slate-800 border border-yellow-400/60 text-yellow-300 shadow-md hover:scale-105 active:scale-95 transition flex flex-col items-center"
        title={lang === 'ru' ? 'Золотые монеты и Зверята [I]' : 'Gold Coins & Pets [I]'}
      >
        <Coins className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform" />
        <span className="text-[9px] font-black text-yellow-300 font-mono mt-0.5">
          {coins > 999 ? `${Math.floor(coins / 100) / 10}k` : coins}
        </span>
      </button>

      {/* 2. 💎 Инвентарь Камней */}
      <button
        onClick={onOpenInventory}
        className="group relative p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-cyan-400/50 text-cyan-300 shadow-md hover:scale-105 active:scale-95 transition"
        title={lang === 'ru' ? 'Коллекция камней [I]' : 'Gem Collection [I]'}
      >
        <Gem className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
        {totalGems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-cyan-500 text-slate-950 shadow border border-white/20">
            {totalGems}
          </span>
        )}
      </button>

      {/* 3. 🎁 Ежедневная Награда */}
      <button
        onClick={onOpenDailyReward}
        className="group relative p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-yellow-400/50 text-yellow-300 shadow-md hover:scale-105 active:scale-95 transition"
        title={lang === 'ru' ? 'Ежедневная награда за вход' : 'Daily Login Reward'}
      >
        <Gift className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
        {hasDailyUnclaimed && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border border-white animate-ping" />
        )}
      </button>

      {/* 4. 📱 Скачать APK / AAB / Solana Seeker */}
      <button
        onClick={onOpenMobilePackages}
        className="group relative p-2.5 rounded-xl bg-gradient-to-b from-emerald-950/80 to-slate-950 border border-emerald-400/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition"
        title={lang === 'ru' ? 'Скачать для Android, iPhone, Play Market, Solana' : 'Download APK, AAB & Solana Seeker dApp'}
      >
        <Download className="w-5 h-5 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
      </button>

      <div className="w-6 h-[1px] bg-white/10 my-0.5" />

      {/* 5. 🎵 Dubstep Music Toggle */}
      <button
        onClick={onToggleBGM}
        className={`group relative p-2.5 rounded-xl border transition hover:scale-105 active:scale-95 ${
          bgmActive
            ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.7)] animate-pulse'
            : 'bg-slate-950/80 border-slate-700 text-slate-400 hover:text-white'
        }`}
        title={lang === 'ru' ? 'Dubstep Музыка (Вкл/Выкл) [B]' : 'Dubstep Music (On/Off) [B]'}
      >
        <Music className="w-5 h-5" />
      </button>

      {/* 6. 🔊 Sound SFX Toggle */}
      <button
        onClick={onToggleMute}
        className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition hover:scale-105 active:scale-95"
        title={isMuted ? 'Включить звук [M]' : 'Выключить звук [M]'}
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
      </button>

      {/* 7. 🌐 Language Switcher */}
      <button
        onClick={onToggleLang}
        className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-xs font-black text-cyan-300 transition hover:scale-105 active:scale-95"
        title="Сменить язык (RU / EN)"
      >
        {lang === 'ru' ? 'RU' : 'EN'}
      </button>

      {/* 8. ❓ Help / Hotkeys */}
      <button
        onClick={onOpenHelp}
        className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition hover:scale-105 active:scale-95"
        title={lang === 'ru' ? 'Справка и горячие клавиши [H]' : 'Help & Shortcuts [H]'}
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </aside>
  );
};
