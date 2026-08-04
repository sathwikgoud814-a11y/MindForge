import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function RewardRedemptionModal() {
  const { rewardRedemptionOverlay, setRewardRedemptionOverlay } = useSystem();

  if (!rewardRedemptionOverlay || !rewardRedemptionOverlay.open || !rewardRedemptionOverlay.reward) return null;

  const r = rewardRedemptionOverlay.reward;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-300">
      <div className="bg-surface w-full max-w-md rounded-3xl p-8 shadow-2xl border border-border-gold text-center flex flex-col items-center gap-6 relative overflow-hidden gold-subtle">
        {/* Ambient Subtle Gold Glow Animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none"></div>

        {/* Reward Icon */}
        <div className="w-20 h-20 rounded-3xl gold-gradient flex items-center justify-center text-white text-4xl font-black shadow-lg animate-pulse">
          <span className="material-symbols-outlined text-4xl">{r.icon}</span>
        </div>

        <div>
          <span className="text-xs font-black tracking-widest text-gold uppercase">Reward Unlocked</span>
          <h2 className="text-2xl font-black text-primary tracking-tight mt-1">{r.name}</h2>
          <p className="text-sm font-extrabold text-gold mt-1">-{r.costDP} DP</p>
        </div>

        <div className="w-full bg-surface-subtle p-4 rounded-2xl border border-border-subtle text-xs text-primary leading-relaxed font-medium">
          "Enjoy your earned break. You accomplished your missions first."
        </div>

        <button
          onClick={() => setRewardRedemptionOverlay({ open: false, reward: null })}
          className="w-full gold-gradient text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md hover:scale-105 transition-transform"
        >
          Claim Earned Comfort
        </button>
      </div>
    </div>
  );
}
