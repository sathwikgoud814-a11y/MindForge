import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function RewardsShop() {
  const { hunter, shopItems, buyShopItem } = useSystem();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-black/5 premium-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              System Exchange
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">XP & Gold Rewards Shop</h1>
          <p className="text-xs text-on-surface-variant">Trade earned XP and Gold Coins for real-life rewards and system perks.</p>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2.5 rounded-2xl border border-black/5">
          <div className="flex items-center gap-2 text-sm font-black text-amber-600">
            <span className="material-symbols-outlined text-lg">monetization_on</span>
            <span>{hunter.goldCoins} G</span>
          </div>
          <div className="w-px h-5 bg-black/10"></div>
          <div className="flex items-center gap-2 text-sm font-black text-primary">
            <span className="material-symbols-outlined text-lg text-secondary-gold">auto_awesome</span>
            <span>{hunter.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shopItems.map(item => (
          <div
            key={item.id}
            className={`bg-surface p-6 rounded-2xl border transition-all flex flex-col justify-between gap-4 premium-shadow ${
              item.purchased ? 'border-emerald-500/30 bg-emerald-50/20' : 'border-black/5 hover:border-secondary-gold/40'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary-gold/10 text-secondary-gold flex items-center justify-center flex-shrink-0 border border-secondary-gold/30">
                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant uppercase">
                  {item.category}
                </span>
                <h3 className="font-bold text-base text-primary mt-1">{item.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-primary">{item.costXP} XP</span>
                <span className="text-xs font-black text-amber-600">+{item.costGold} G</span>
              </div>

              <button
                disabled={item.purchased}
                onClick={() => buyShopItem(item.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-transform ${
                  item.purchased
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'gold-gradient text-white hover:scale-105 active:scale-95 shadow-md'
                }`}
              >
                {item.purchased ? 'EQUIPPED / CLAIMED ✓' : 'Acquire Item'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
