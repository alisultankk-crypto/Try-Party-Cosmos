import React from 'react';
import { Eye, RotateCcw, Shuffle, X, Zap } from 'lucide-react';
import { Language } from '../types/game';

export type BoosterPurchase = 'undo' | 'shuffle' | 'extract' | 'hint';

export const SHOP_PRICES: Record<BoosterPurchase, number> = {
  undo: 80,
  shuffle: 100,
  extract: 120,
  hint: 150,
};

export const EXTRA_SLOT_PRICE = 5000;

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  gold: number;
  extraSlotOwned: boolean;
  lang: Language;
  onBuyBooster: (booster: BoosterPurchase) => void;
  onBuyExtraSlot: () => void;
}

const BOOSTER_ITEMS = [
  { id: 'undo', labelRu: 'Отмена ×2', labelEn: 'Undo ×2', icon: RotateCcw, quantity: 2 },
  { id: 'shuffle', labelRu: 'Перемешать ×1', labelEn: 'Shuffle ×1', icon: Shuffle, quantity: 1 },
  { id: 'extract', labelRu: 'Вынуть ×1', labelEn: 'Extract ×1', icon: Zap, quantity: 1 },
  { id: 'hint', labelRu: 'Подсказка ×2', labelEn: 'Hints ×2', icon: Eye, quantity: 2 },
] as const;

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  gold,
  extraSlotOwned,
  lang,
  onBuyBooster,
  onBuyExtraSlot,
}) => {
  if (!isOpen) return null;
  const isRu = lang === 'ru';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md">
      <section className="w-full max-w-md rounded-3xl border-2 border-amber-400/50 bg-slate-950 p-4 text-white shadow-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-amber-200">{isRu ? 'Магазин' : 'Shop'}</h2>
            <p className="text-sm font-bold text-yellow-300">🪙 {gold.toLocaleString()}</p>
          </div>
          <button onClick={onClose} aria-label={isRu ? 'Закрыть' : 'Close'} className="rounded-xl p-2 text-slate-300 hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-2">
          {BOOSTER_ITEMS.map(({ id, labelRu, labelEn, icon: Icon, quantity }) => {
            const price = SHOP_PRICES[id];
            return (
              <button
                key={id}
                onClick={() => onBuyBooster(id)}
                disabled={gold < price}
                className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-slate-900 px-3 py-3 text-left transition hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-cyan-300" />
                  <span className="font-bold">{isRu ? labelRu : labelEn}</span>
                </span>
                <span className="font-black text-yellow-300">🪙 {price}</span>
              </button>
            );
          })}
          <button
            onClick={onBuyExtraSlot}
            disabled={extraSlotOwned || gold < EXTRA_SLOT_PRICE}
            className="flex items-center justify-between rounded-2xl border-2 border-amber-400/70 bg-gradient-to-r from-amber-950 to-slate-900 px-3 py-4 text-left transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>
              <span className="block font-black text-amber-200">{isRu ? '+1 слот лотка' : '+1 tray slot'}</span>
              <span className="text-xs text-slate-300">
                {extraSlotOwned
                  ? isRu ? 'Уже куплено' : 'Already purchased'
                  : isRu ? 'Постоянное улучшение' : 'Permanent upgrade'}
              </span>
            </span>
            <span className="font-black text-yellow-300">{extraSlotOwned ? '✓' : `🪙 ${EXTRA_SLOT_PRICE.toLocaleString()}`}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
