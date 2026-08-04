import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function RewardShopModal() {
  const { character, rewards, purchaseHistory, redeemReward, setShowCreateRewardModal, setEditingReward } = useSystem();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'All Rewards' },
    { id: 'Comfort', label: 'Comfort' },
    { id: 'Entertainment', label: 'Entertainment' },
    { id: 'Food', label: 'Food' },
    { id: 'Wellness', label: 'Wellness' },
    { id: 'Cosmetics', label: 'Cosmetics' },
    { id: 'Unlockables', label: 'Unlockables' },
    { id: 'Mystery Boxes', label: 'Mystery Boxes' },
  ];

  const filteredRewards = rewards.filter(r => {
    if (selectedCategory === 'All') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner: Header & DP Balance Card */}
      <section className="apple-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              System Exchange
            </span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Reward Shop</h1>
          <p className="text-sm font-medium text-primary-muted mt-1">
            Spend Discipline Points earned through discipline. Modify default or custom rewards to fit your lifestyle.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-gold-light/60 px-6 py-3.5 rounded-3xl border border-gold/30 shadow-sm">
          <span className="material-symbols-outlined text-gold text-3xl">stars</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Discipline Points Balance</span>
            <span className="text-2xl font-black text-primary">{character.dp.toLocaleString()} DP</span>
          </div>
        </div>
      </section>

      {/* Category Filter Chips */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-primary text-white shadow-md scale-[1.02]'
                : 'bg-surface text-primary-muted hover:text-primary border border-border-subtle hover:border-gold/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Reward Inventory Grid (8 Columns - 3-column subgrid) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map(r => {
              const canAfford = character.dp >= r.costDP;
              const dpNeeded = r.costDP - character.dp;

              return (
                <div
                  key={r.id}
                  className={`apple-card p-5 flex flex-col justify-between gap-4 transition-all apple-card-hover relative ${
                    r.redeemed ? 'border-emerald-500/30 bg-emerald-50/10 opacity-70' : ''
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-surface-subtle text-gold flex items-center justify-center border border-border-subtle shadow-sm">
                        <span className="material-symbols-outlined text-2xl">{r.icon || 'card_giftcard'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-surface-subtle text-primary-muted uppercase tracking-wider">
                          {r.category}
                        </span>
                        <button
                          onClick={() => setEditingReward(r)}
                          className="p-1 rounded-lg text-primary-muted hover:text-gold hover:bg-surface-subtle transition-colors"
                          title="Edit Reward & DP Cost"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-primary tracking-tight">{r.name}</h3>
                      <p className="text-xs text-primary-muted leading-relaxed font-medium mt-1">{r.description || 'Self-defined comfort reward.'}</p>
                    </div>
                  </div>

                  {/* Footer: DP Cost + Redeem CTA */}
                  <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
                    <div className="flex items-center justify-between font-black text-xs text-primary">
                      <span>Cost:</span>
                      <span className="text-gold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        {r.costDP} DP
                      </span>
                    </div>

                    <button
                      disabled={r.redeemed || !canAfford}
                      onClick={() => redeemReward(r.id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                        r.redeemed
                          ? 'bg-emerald-500 text-white cursor-default shadow-sm'
                          : canAfford
                          ? 'gold-gradient text-white hover:scale-105 active:scale-95 shadow-md'
                          : 'bg-surface-subtle text-primary-muted cursor-not-allowed border border-border-subtle'
                      }`}
                    >
                      {r.redeemed
                        ? 'Redeemed ✓'
                        : canAfford
                        ? 'Redeem Comfort'
                        : `Need ${dpNeeded} more DP`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Panel (4 Columns - Recent Purchases & Custom Reward) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Custom Reward CTA */}
          <section className="apple-card p-6 flex flex-col gap-4 bg-gradient-to-br from-surface to-surface-subtle">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-light text-gold flex items-center justify-center text-xl border border-gold/30 flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">add_circle</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-primary">Custom Comfort Reward</h4>
                <p className="text-xs text-primary-muted">Define your own rewards and set Discipline Point costs.</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateRewardModal(true)}
              className="w-full py-3 rounded-2xl bg-primary text-white font-extrabold text-xs hover:bg-black transition-colors"
            >
              + Add Custom Reward
            </button>
          </section>

          {/* Recent Purchases Log */}
          <section className="apple-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-gold">history</span>
                Recent Purchases Log
              </h3>
              <span className="text-xs font-semibold text-primary-muted">Earned Comfort</span>
            </div>

            <div className="flex flex-col gap-3">
              {purchaseHistory.length === 0 ? (
                <p className="text-xs text-primary-muted py-4 text-center">No rewards redeemed yet. Complete missions to earn DP.</p>
              ) : (
                purchaseHistory.map(ph => (
                  <div key={ph.id} className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gold text-lg">check_circle</span>
                      <div>
                        <h4 className="font-extrabold text-primary">{ph.name}</h4>
                        <span className="text-[10px] text-primary-muted font-medium">{ph.timestamp}</span>
                      </div>
                    </div>

                    <span className="font-black text-gold">-{ph.costDP} DP</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Product Philosophy Reminder Card */}
          <section className="bg-gold-light/60 p-6 rounded-3xl border border-gold/30 text-xs text-primary leading-relaxed font-medium">
            <h4 className="font-extrabold text-xs text-gold uppercase tracking-wider mb-1">Product Philosophy</h4>
            "Most people consume comfort before creating value. This System reverses that. Comfort is earned through discipline."
          </section>
        </div>
      </div>
    </div>
  );
}
