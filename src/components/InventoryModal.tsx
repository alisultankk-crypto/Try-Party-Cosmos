import React, { useState } from 'react';
import { X, Sparkles, Gem, Award, Info } from 'lucide-react';
import { CosmicGem, GemInventory, Language } from '../types/game';
import { COSMIC_GEMS } from '../data/cosmicGems';
import { CosmicGemSvg } from './CosmicGemSvg';
import { TRANSLATIONS } from '../i18n/translations';
import { puzzleSounds } from '../audio/puzzleSounds';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: GemInventory;
  lang: Language;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  lang,
}) => {
  const [selectedGemId, setSelectedGemId] = useState<string>(COSMIC_GEMS[0].id);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const selectedGem = COSMIC_GEMS.find((g) => g.id === selectedGemId) || COSMIC_GEMS[0];
  const selectedCount = inventory[selectedGem.id] || 0;

  // Calculate stats
  const totalCount = Object.values(inventory).reduce((acc, count) => acc + count, 0);
  const discoveredTypes = COSMIC_GEMS.filter((g) => (inventory[g.id] || 0) > 0).length;

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          label: t.rarityLegendary,
          bg: 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black border-amber-300',
        };
      case 'epic':
        return {
          label: t.rarityEpic,
          bg: 'bg-purple-900/80 text-purple-200 border-purple-500',
        };
      case 'rare':
        return {
          label: t.rarityRare,
          bg: 'bg-blue-900/80 text-blue-200 border-blue-500',
        };
      default:
        return {
          label: t.rarityCommon,
          bg: 'bg-emerald-900/80 text-emerald-200 border-emerald-500',
        };
    }
  };

  const handleSelectGem = (gem: CosmicGem) => {
    setSelectedGemId(gem.id);
    puzzleSounds.playTileTap();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-cyan-500/20 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-pink-300">
                {t.inventoryTitle}
              </h2>
              <p className="text-xs text-slate-400">{t.inventorySubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats summary bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>
              {t.unlockedGems}: <strong className="text-yellow-300">{discoveredTypes}</strong> / {COSMIC_GEMS.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              {t.totalCollected}: <strong className="text-cyan-300">{totalCount}</strong> 💎
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.dropRateNotice}</span>
          </div>
        </div>

        {/* Main Content: Split Grid & Inspector */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Gems Grid (7 cols on desktop) */}
          <div className="md:col-span-7 grid grid-cols-4 gap-3">
            {COSMIC_GEMS.map((gem) => {
              const count = inventory[gem.id] || 0;
              const isSelected = gem.id === selectedGemId;
              const isUnlocked = count > 0;

              return (
                <button
                  key={gem.id}
                  onClick={() => handleSelectGem(gem)}
                  className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105'
                      : isUnlocked
                      ? 'bg-slate-900/60 border-white/10 hover:border-cyan-500/50 hover:bg-slate-850'
                      : 'bg-slate-950/40 border-dashed border-slate-800 opacity-60'
                  }`}
                >
                  {/* Badge count */}
                  {count > 0 && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black shadow-sm">
                      x{count}
                    </span>
                  )}

                  <CosmicGemSvg gem={gem} size={48} isUnlocked={isUnlocked} />

                  <span className="mt-2 text-[10px] font-bold text-center leading-tight line-clamp-1 text-slate-300 group-hover:text-white">
                    {isUnlocked ? gem.name[lang] : '???'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Gem Inspector (5 cols on desktop) */}
          <div className="md:col-span-5 flex flex-col items-center justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-cyan-500/30 text-center relative overflow-hidden">
            <div className="relative flex flex-col items-center w-full">
              {/* Gem Preview */}
              <div className="w-24 h-24 mb-3 flex items-center justify-center rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner">
                <CosmicGemSvg gem={selectedGem} size={72} isUnlocked={selectedCount > 0} />
              </div>

              {/* Rarity */}
              {selectedCount > 0 && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border mb-2 ${
                    getRarityBadge(selectedGem.rarity).bg
                  }`}
                >
                  {getRarityBadge(selectedGem.rarity).label}
                </span>
              )}

              {/* Name */}
              <h3 className="text-base font-black text-white mb-1">
                {selectedCount > 0 ? selectedGem.name[lang] : '??? (Не открыт)'}
              </h3>

              {/* Count */}
              <div className="text-xs font-semibold text-cyan-300 mb-3">
                {selectedCount > 0 ? `В наличии: ${selectedCount} шт.` : 'Пройдите любой уровень, чтобы найти этот камень!'}
              </div>

              {/* Lore */}
              <p className="text-xs text-slate-300/90 leading-relaxed italic px-2">
                {selectedCount > 0
                  ? `«${selectedGem.titleLore[lang]}»`
                  : 'Этот легендарный кристалл дрейфует в глубоком космосе. Соберите тройки на уровне для выпадения!'}
              </p>
            </div>

            <div className="w-full mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400">
              {t.clickToInspect}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-white/5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm active:scale-95 transition shadow-lg"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
