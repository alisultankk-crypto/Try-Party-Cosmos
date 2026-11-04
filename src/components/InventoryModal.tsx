import React, { useState } from 'react';
import { X, Sparkles, Gem, Award, Coins, ShoppingBag, ArrowRightLeft, Volume2, Check } from 'lucide-react';
import { CosmicGem, GemInventory, Language, MascotId } from '../types/game';
import { COSMIC_GEMS, HEXTECH_CRYSTAL } from '../data/cosmicGems';
import { CosmicGemSvg } from './CosmicGemSvg';
import { TRANSLATIONS } from '../i18n/translations';
import { puzzleSounds } from '../audio/puzzleSounds';
import { MASCOTS_LIST, COMPLIMENTS_PACK_COST } from '../data/mascots';
import { speakMascotPraise } from '../audio/poroVoice';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: GemInventory;
  coins: number;
  activeMascot: MascotId;
  ownedMascots: MascotId[];
  complimentsRemaining: number;
  lang: Language;
  onExchangeGem: (gemId: string, count: number, totalCoinsEarned: number) => void;
  onExchangeDuplicates: (totalCoinsEarned: number, updatedInventory: GemInventory) => void;
  onBuyMascotWithCoins: (mascotId: MascotId, cost: number) => void;
  onBuyMascotWithHextech: (mascotId: MascotId) => void;
  onSelectMascot: (mascotId: MascotId) => void;
  onBuyComplimentsWithCoins: (cost: number, count: number) => void;
  onBuyComplimentsWithHextech: (count: number) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  coins,
  activeMascot,
  ownedMascots,
  complimentsRemaining,
  lang,
  onExchangeGem,
  onExchangeDuplicates,
  onBuyMascotWithCoins,
  onBuyMascotWithHextech,
  onSelectMascot,
  onBuyComplimentsWithCoins,
  onBuyComplimentsWithHextech,
}) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'exchange' | 'shop'>('collection');
  const [selectedGemId, setSelectedGemId] = useState<string>(COSMIC_GEMS[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const selectedGem = COSMIC_GEMS.find((g) => g.id === selectedGemId) || COSMIC_GEMS[0];
  const selectedCount = inventory[selectedGem.id] || 0;
  const hextechCount = inventory['hextech_arcane_crystal'] || 0;

  // Calculate stats
  const totalCount = Object.values(inventory).reduce((acc, count) => acc + count, 0);
  const discoveredTypes = COSMIC_GEMS.filter((g) => (inventory[g.id] || 0) > 0).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return {
          label: lang === 'ru' ? 'МИФИЧЕСКИЙ (ARCANE)' : 'MYTHIC (ARCANE)',
          bg: 'bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 text-slate-950 font-black border-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.7)] animate-pulse',
        };
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

  // Exchange 1 selected gem for coins
  const handleExchangeOne = () => {
    if (selectedCount <= 0) return;
    const earned = selectedGem.coinValue;
    onExchangeGem(selectedGem.id, 1, earned);
    puzzleSounds.playCoinClink();
    showToast(lang === 'ru' ? `+${earned} золотых монет за ${selectedGem.name.ru}!` : `+${earned} gold coins for ${selectedGem.name.en}!`);
  };

  // Exchange all duplicates (keep 1 of each discovered type)
  const handleExchangeAllDuplicates = () => {
    let earnedTotal = 0;
    const newInv = { ...inventory };

    COSMIC_GEMS.forEach((gem) => {
      const current = newInv[gem.id] || 0;
      if (current > 1) {
        const excess = current - 1;
        earnedTotal += excess * gem.coinValue;
        newInv[gem.id] = 1;
      }
    });

    if (earnedTotal > 0) {
      onExchangeDuplicates(earnedTotal, newInv);
      puzzleSounds.playCoinClink();
      showToast(lang === 'ru' ? `Обменяны все дубликаты! Получено +${earnedTotal} золотых монет! 🪙` : `Exchanged duplicates! Received +${earnedTotal} coins! 🪙`);
    } else {
      showToast(lang === 'ru' ? 'Нет лишних дубликатов для обмена!' : 'No duplicate gems to exchange!');
    }
  };

  // Test listen to compliment
  const handleTestCompliment = () => {
    speakMascotPraise(activeMascot, undefined, true);
    showToast(lang === 'ru' ? 'Комплимент озвучен!' : 'Compliment voiced!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white overflow-hidden">
        {/* Header */}
        <div className="relative px-5 py-3.5 border-b border-cyan-500/20 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-pink-300">
                {lang === 'ru' ? 'Инвентарь, Обмен и Зверята' : 'Inventory, Exchange & Mascots'}
              </h2>
              <div className="flex items-center gap-3 text-xs mt-0.5">
                <span className="flex items-center gap-1 font-bold text-yellow-300 bg-yellow-950/60 px-2 py-0.5 rounded-lg border border-yellow-500/40">
                  <Coins className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{coins} 🪙</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/40">
                  <span>⚡ Хекстек: {hextechCount}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Navigation Tabs */}
        <div className="grid grid-cols-3 bg-slate-950/80 border-b border-white/10 p-1.5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('collection')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'collection'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Gem className="w-4 h-4" />
            <span>{lang === 'ru' ? 'Коллекция' : 'Collection'}</span>
          </button>

          <button
            onClick={() => setActiveTab('exchange')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'exchange'
                ? 'bg-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{lang === 'ru' ? 'Обмен на Монеты' : 'Coin Exchange'}</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'shop'
                ? 'bg-pink-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'ru' ? 'Зверята и Комплименты' : 'Pets & Praises'}</span>
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mx-4 mt-2 p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-center text-xs font-black shadow-lg animate-in fade-in slide-in-from-top-1">
            {toastMessage}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: GEM COLLECTION & INSPECTOR */}
        {/* ========================================================= */}
        {activeTab === 'collection' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            {/* Stats summary */}
            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <span>{t.unlockedGems}: <strong className="text-yellow-300">{discoveredTypes}</strong> / {COSMIC_GEMS.length}</span>
              <span>{t.totalCollected}: <strong className="text-cyan-300">{totalCount}</strong> 💎</span>
              <span className="text-cyan-400 font-bold">Хекстек (Arcane): {hextechCount} ⚡</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Gems Grid */}
              <div className="md:col-span-7 grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                {COSMIC_GEMS.map((gem) => {
                  const count = inventory[gem.id] || 0;
                  const isSelected = gem.id === selectedGemId;
                  const isUnlocked = count > 0;
                  const isHextech = gem.id === 'hextech_arcane_crystal';

                  return (
                    <button
                      key={gem.id}
                      onClick={() => handleSelectGem(gem)}
                      className={`group relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 border-2 ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105'
                          : isUnlocked
                          ? 'bg-slate-900/60 border-white/10 hover:border-cyan-500/50 hover:bg-slate-850'
                          : 'bg-slate-950/40 border-dashed border-slate-800 opacity-60'
                      }`}
                    >
                      {count > 0 && (
                        <span className={`absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[10px] font-black shadow-sm ${
                          isHextech ? 'bg-cyan-400 text-slate-950 animate-pulse' : 'bg-cyan-500 text-slate-950'
                        }`}>
                          x{count}
                        </span>
                      )}

                      <CosmicGemSvg gem={gem} size={44} isUnlocked={isUnlocked} />

                      <span className="mt-1.5 text-[10px] font-bold text-center leading-tight line-clamp-1 text-slate-300 group-hover:text-white">
                        {isUnlocked ? gem.name[lang] : '???'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Gem Inspector */}
              <div className="md:col-span-5 flex flex-col items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-cyan-500/30 text-center">
                <div className="flex flex-col items-center w-full">
                  <div className="w-20 h-20 mb-2 flex items-center justify-center rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner">
                    <CosmicGemSvg gem={selectedGem} size={64} isUnlocked={selectedCount > 0} />
                  </div>

                  {selectedCount > 0 && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border mb-1.5 ${getRarityBadge(selectedGem.rarity).bg}`}>
                      {getRarityBadge(selectedGem.rarity).label}
                    </span>
                  )}

                  <h3 className="text-sm font-black text-white mb-0.5">
                    {selectedCount > 0 ? selectedGem.name[lang] : '??? (Не открыт)'}
                  </h3>

                  <div className="text-xs font-semibold text-cyan-300 mb-1.5">
                    {selectedCount > 0 ? `В наличии: ${selectedCount} шт. • Ценность: ${selectedGem.coinValue} 🪙` : 'Пройдите уровни, чтобы найти этот камень!'}
                  </div>

                  <p className="text-xs text-slate-300/90 leading-relaxed italic px-1">
                    {selectedCount > 0
                      ? `«${selectedGem.titleLore[lang]}»`
                      : 'Этот редкий кристалл дрейфует в глубоком космосе. Соберите тройки на уровне для выпадения!'}
                  </p>
                </div>

                {selectedCount > 0 && (
                  <button
                    onClick={handleExchangeOne}
                    className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                  >
                    <Coins className="w-4 h-4" />
                    <span>{lang === 'ru' ? `Обменять 1 шт. (+${selectedGem.coinValue} 🪙)` : `Exchange 1 (+${selectedGem.coinValue} 🪙)`}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: EXCHANGE GEMS FOR GOLD COINS */}
        {/* ========================================================= */}
        {activeTab === 'exchange' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            <div className="p-3 rounded-2xl bg-yellow-950/40 border border-yellow-500/40 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-yellow-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>{lang === 'ru' ? 'Банк Золотых Монет' : 'Gold Coin Exchange'}</span>
                </h4>
                <p className="text-xs text-slate-300">
                  {lang === 'ru'
                    ? 'Обменивайте любые найденные камни на золотые монеты для покупки зверят и комплиментов!'
                    : 'Exchange your cosmic gems for gold coins to unlock pets and compliment packs!'}
                </p>
              </div>

              <button
                onClick={handleExchangeAllDuplicates}
                className="px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shrink-0 shadow active:scale-95 transition"
              >
                {lang === 'ru' ? 'Обменять все дубликаты 🪙' : 'Exchange All Duplicates 🪙'}
              </button>
            </div>

            {/* List of owned gems with exchange buttons */}
            <div className="flex flex-col gap-2">
              {COSMIC_GEMS.map((gem) => {
                const count = inventory[gem.id] || 0;
                if (count <= 0) return null;

                return (
                  <div
                    key={gem.id}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <CosmicGemSvg gem={gem} size={36} isUnlocked={true} />
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-2">
                          <span>{gem.name[lang]}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/30 font-mono">
                            x{count} шт.
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'ru' ? 'Цена обмена: ' : 'Exchange rate: '}
                          <strong className="text-yellow-300">{gem.coinValue} 🪙</strong>
                          {gem.id === 'hextech_arcane_crystal' && (
                            <span className="ml-1 text-cyan-400 font-bold">⚡ (Arcane)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onExchangeGem(gem.id, 1, gem.coinValue);
                          puzzleSounds.playCoinClink();
                          showToast(`+${gem.coinValue} 🪙!`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-slate-950 text-xs font-black shadow active:scale-95 transition"
                      >
                        {lang === 'ru' ? `Продать 1 (+${gem.coinValue} 🪙)` : `Sell 1 (+${gem.coinValue} 🪙)`}
                      </button>

                      {count > 1 && (
                        <button
                          onClick={() => {
                            const excess = count - 1;
                            const total = excess * gem.coinValue;
                            onExchangeGem(gem.id, excess, total);
                            puzzleSounds.playCoinClink();
                            showToast(`+${total} 🪙!`);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 active:scale-95 transition"
                          title="Оставить 1 в коллекции, продать остальные"
                        >
                          {lang === 'ru' ? `Продать все дубликаты (x${count - 1})` : `Sell duplicates (x${count - 1})`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {totalCount === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  {lang === 'ru' ? 'У вас пока нет камней для обмена. Проходите уровни, чтобы собирать кристаллы!' : 'No gems collected yet. Complete levels to collect gems!'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ANIMALS / MASCOTS & 10 COMPLIMENTS SHOP */}
        {/* ========================================================= */}
        {activeTab === 'shop' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            {/* Top banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/40">
              <h4 className="text-sm font-black text-pink-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{lang === 'ru' ? 'Зверята-Компаньоны и Комплименты для Машки' : 'Companion Pets & Mashka Praises'}</span>
              </h4>
              <p className="text-xs text-slate-300">
                {lang === 'ru'
                  ? 'Выбирайте других зверят вместо Поро (Кошечка, Поросёнок) или покупайте пакет из 10 эксклюзивных комплиментов за Хекстек-кристалл или золотые монетки!'
                  : 'Unlock alternative pets instead of Poro (Kitten, Piglet) or buy the 10 exclusive compliments pack with Hextech crystals or gold coins!'}
              </p>
            </div>

            {/* Animals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MASCOTS_LIST.map((m) => {
                const isOwned = ownedMascots.includes(m.id);
                const isActive = activeMascot === m.id;
                const canBuyCoins = coins >= m.coinCost;
                const canBuyHextech = hextechCount >= m.hextechCost;

                return (
                  <div
                    key={m.id}
                    className={`relative p-3.5 rounded-2xl border-2 flex flex-col justify-between transition ${
                      isActive
                        ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400/50'
                        : isOwned
                        ? 'bg-slate-900/80 border-emerald-500/50'
                        : 'bg-slate-950/80 border-white/10'
                    }`}
                  >
                    <div>
                      {/* Avatar preview */}
                      <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                        {m.id === 'poro' && '✨'}
                        {m.id === 'cat' && '🐱'}
                        {m.id === 'piglet' && '🐷'}
                      </div>

                      <div className="text-center mb-2">
                        <div className="text-xs font-black text-white">{m.name[lang]}</div>
                        <div className="text-[10px] text-cyan-300 font-bold">{m.species[lang]}</div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-3">
                          {m.description[lang]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1.5">
                      {isActive ? (
                        <div className="py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-center text-xs flex items-center justify-center gap-1 shadow">
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'ru' ? 'ВЫБРАН' : 'ACTIVE'}</span>
                        </div>
                      ) : isOwned ? (
                        <button
                          onClick={() => {
                            onSelectMascot(m.id);
                            puzzleSounds.playTileTap();
                            showToast(lang === 'ru' ? `Выбран питомец: ${m.name.ru}!` : `Selected pet: ${m.name.en}!`);
                          }}
                          className="py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-center text-xs shadow active:scale-95 transition"
                        >
                          {lang === 'ru' ? 'ВЫБРАТЬ ПИТОМЦА' : 'EQUIP PET'}
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <button
                            disabled={!canBuyHextech}
                            onClick={() => {
                              onBuyMascotWithHextech(m.id);
                              puzzleSounds.playHextechSurge();
                              showToast(lang === 'ru' ? `Питомец ${m.name.ru} куплен за 1 Хекстек-Кристалл! ⚡` : `Purchased with Hextech crystal!`);
                            }}
                            className={`py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition shadow ${
                              canBuyHextech
                                ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <span>Купить за 1 ⚡ Хекстек</span>
                          </button>

                          <button
                            disabled={!canBuyCoins}
                            onClick={() => {
                              onBuyMascotWithCoins(m.id, m.coinCost);
                              puzzleSounds.playCoinClink();
                              showToast(lang === 'ru' ? `Питомец ${m.name.ru} куплен за ${m.coinCost} монет! 🪙` : `Purchased with coins!`);
                            }}
                            className={`py-1 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                              canBuyCoins
                                ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 active:scale-95'
                                : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <span>или {m.coinCost} 🪙</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 10 Compliments Pack Section */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-purple-950/70 to-pink-950/70 border-2 border-amber-400/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(251,191,36,0.5)] shrink-0">
                  💖
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-amber-300">
                    {lang === 'ru' ? 'Пакет 10 Эксклюзивных Комплиментов для Машки' : '10 Exclusive Compliments Pack for Mashka'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-snug">
                    {lang === 'ru'
                      ? 'Особенные голосовые супер-комплименты и похвалы от зверят вслух при победах и кликах!'
                      : 'Special voiced super-compliments for Mashka spoken out loud on matches and clicks!'}
                  </p>
                  <div className="text-[11px] font-bold text-cyan-300 mt-1">
                    {lang === 'ru' ? `Осталось эксклюзивных комплиментов: ${complimentsRemaining}` : `Compliments remaining: ${complimentsRemaining}`}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-auto shrink-0">
                <button
                  disabled={hextechCount < COMPLIMENTS_PACK_COST.hextech}
                  onClick={() => {
                    onBuyComplimentsWithHextech(COMPLIMENTS_PACK_COST.count);
                    puzzleSounds.playHextechSurge();
                    showToast(lang === 'ru' ? '+10 комплиментов получено за 1 Хекстек! ⚡💖' : '+10 compliments received for 1 Hextech!');
                  }}
                  className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition ${
                    hextechCount >= COMPLIMENTS_PACK_COST.hextech
                      ? 'bg-gradient-to-r from-cyan-400 to-sky-400 hover:brightness-110 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Купить за 1 ⚡ Хекстек</span>
                </button>

                <button
                  disabled={coins < COMPLIMENTS_PACK_COST.coins}
                  onClick={() => {
                    onBuyComplimentsWithCoins(COMPLIMENTS_PACK_COST.coins, COMPLIMENTS_PACK_COST.count);
                    puzzleSounds.playCoinClink();
                    showToast(lang === 'ru' ? `+10 комплиментов получено за ${COMPLIMENTS_PACK_COST.coins} 🪙!` : `+10 compliments received!`);
                  }}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    coins >= COMPLIMENTS_PACK_COST.coins
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>или {COMPLIMENTS_PACK_COST.coins} 🪙</span>
                </button>

                <button
                  onClick={handleTestCompliment}
                  className="py-1 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-pink-300 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  title="Послушать прямо сейчас"
                >
                  <Volume2 className="w-3 h-3 text-pink-400" />
                  <span>Послушать комплимент 🔊</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900/80 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {lang === 'ru' ? 'Хекстек-кристалл выпадает раз за 3 уровня проходки!' : 'Hextech crystal drops every 3 levels!'}
          </div>

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
