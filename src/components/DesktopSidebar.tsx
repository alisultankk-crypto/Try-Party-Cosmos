import React from 'react';
import { Keyboard, Maximize2, Minimize2, Music, Sparkles, Award, Gem, Gift } from 'lucide-react';
import { CAT_METAS } from './CosmicCats';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';

interface DesktopSidebarProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  bgmActive: boolean;
  onToggleBGM: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onOpenInventory: () => void;
  onOpenDailyReward: () => void;
  combo: number;
  lang?: Language;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isFullscreen,
  onToggleFullscreen,
  bgmActive,
  onToggleBGM,
  onOpenHelp,
  onOpenInventory,
  onOpenDailyReward,
  combo,
  lang = 'ru',
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <>
      {/* Left Desktop Panel (Hidden on small screens, visible on 2xl+) */}
      <aside className="hidden 2xl:flex flex-col gap-3 w-64 fixed left-4 top-4 bottom-4 z-20 pointer-events-auto">
        {/* Terminal Header */}
        <div className="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {lang === 'ru' ? 'Онлайн в браузере' : 'Browser Online'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              COSMOS
            </span>
          </div>

          <h1 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 leading-tight">
            {t.gameTitle}
          </h1>
          <p className="text-[11px] text-slate-400">
            {t.gameTagline}
          </p>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={onOpenInventory}
              className="flex-1 py-1.5 px-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-black flex items-center justify-center gap-1 transition active:scale-95"
            >
              <Gem className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Камни' : 'Gems'}</span>
            </button>
            <button
              onClick={onOpenDailyReward}
              className="flex-1 py-1.5 px-2 rounded-xl bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500/40 text-yellow-300 text-xs font-black flex items-center justify-center gap-1 transition active:scale-95"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Награда' : 'Reward'}</span>
            </button>
          </div>
        </div>

        {/* Hotkeys Cheatsheet */}
        <div className="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-lg flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              {lang === 'ru' ? 'Горячие клавиши' : 'Hotkeys'}
            </span>
            <button
              onClick={onOpenHelp}
              className="text-[10px] text-cyan-400 hover:text-cyan-200 underline cursor-pointer"
            >
              {lang === 'ru' ? 'Справка' : 'Help'}
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-300">{t.boosterExtract}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-500/40">1</kbd>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-300">{t.boosterUndo}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-500/40">2</kbd>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-300">{t.boosterShuffle}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-bold border border-purple-500/40">3</kbd>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-300">8-bit BGM</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono font-bold border border-slate-700">B</kbd>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-300">{lang === 'ru' ? 'Звук' : 'Sound'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono font-bold border border-slate-700">M</kbd>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-300">{lang === 'ru' ? 'Инвентарь' : 'Inventory'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono font-bold border border-slate-700">I</kbd>
            </div>
          </div>
        </div>

        {/* Quick Settings Bar */}
        <div className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? t.exitFullscreen : t.fullscreen}</span>
          </button>

          <button
            onClick={onToggleBGM}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              bgmActive
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{bgmActive ? '8-bit: ON' : '8-bit: OFF'}</span>
          </button>
        </div>
      </aside>

      {/* Right Desktop Panel (Hidden on small screens, visible on 2xl+) */}
      <aside className="hidden 2xl:flex flex-col gap-3 w-64 fixed right-4 top-4 bottom-4 z-20 pointer-events-auto overflow-y-auto">
        {/* Cat breeds and elemental effects */}
        <div className="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-cyan-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'ru' ? 'Породы и стихии' : 'Breeds & Elements'}
            </span>
            {combo > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-[10px] animate-pulse">
                {combo}x КОМБО
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-[11px] max-h-72 overflow-y-auto pr-1">
            {Object.entries(CAT_METAS).map(([key, meta]) => (
              <div
                key={key}
                className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <span className="font-bold text-slate-200 text-xs">{meta.funnyName}</span>
                <span className="text-[10px] font-mono text-cyan-400/80">
                  {meta.magic === 'wind' && '🌪️'}
                  {meta.magic === 'starlight' && '✨'}
                  {meta.magic === 'fire' && '🔥'}
                  {meta.magic === 'void' && '🍄'}
                  {meta.magic === 'arcane' && '⚡'}
                  {meta.magic === 'frost' && '❄️'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Advice Box */}
        <div className="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-amber-500/30 shadow-lg flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'ru' ? 'Секрет победы' : 'Pro Tip'}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {lang === 'ru'
              ? 'На сложных уровнях не берите карты наобум — используйте бустер "Вынуть 3" когда в лотке остаётся всего 2 места!'
              : 'On hard levels, plan ahead and extract 3 tiles when your tray has only 2 slots left!'}
          </p>
        </div>
      </aside>
    </>
  );
};
