import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { HUNTER_RANKS } from '../../shared/services/hunterRatingEngine';

export function RankPromotionModal() {
  const { rankPromotionOverlay, setRankPromotionOverlay } = useSystem();

  if (!rankPromotionOverlay?.open || !rankPromotionOverlay.newRank) return null;

  const { oldRank, newRank, hunterRating, reason } = rankPromotionOverlay;

  const oldRankObj = HUNTER_RANKS.find(r => r.id === oldRank?.id || r.label === oldRank?.label) || HUNTER_RANKS[0];
  const newRankObj = HUNTER_RANKS.find(r => r.id === newRank?.id || r.label === newRank?.label) || HUNTER_RANKS[1];

  const handleClose = () => {
    setRankPromotionOverlay({ open: false, oldRank: null, newRank: null });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="apple-card p-6 md:p-10 max-w-2xl w-full flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 duration-300 text-center relative overflow-hidden border-2 border-gold">
        {/* Shimmer Background Beam */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-transparent to-purple-500/10 pointer-events-none"></div>

        {/* Badge Header */}
        <span className="text-xs font-black px-4 py-1 rounded-full gold-gradient text-white uppercase tracking-widest animate-pulse shadow-md">
          System Rank Evaluation Complete
        </span>

        {/* Title */}
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
            HUNTER RANK EVALUATION
          </h2>
          <p className="text-xs text-gold font-bold mt-1 uppercase tracking-wider">
            SYSTEM EVALUATION RATINGS THRESHOLD REACHED
          </p>
        </div>

        {/* Rank Comparison: Old Rank -> New Rank */}
        <div className="flex items-center justify-center gap-6 my-2 w-full">
          {/* Old Rank */}
          <div className="flex flex-col items-center gap-2 opacity-60 scale-90">
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center ${oldRankObj.color}`}>
              <span className="material-symbols-outlined text-3xl">{oldRankObj.icon}</span>
            </div>
            <span className="text-xs font-extrabold text-primary-muted">{oldRankObj.label}</span>
          </div>

          {/* Transition Arrow */}
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-3xl text-gold animate-ping">east</span>
          </div>

          {/* New Rank */}
          <div className="flex flex-col items-center gap-2 scale-110">
            <div className={`w-20 h-20 rounded-3xl border-4 flex items-center justify-center ${newRankObj.color} shadow-lg animate-bounce`}>
              <span className="material-symbols-outlined text-4xl">{newRankObj.icon}</span>
            </div>
            <span className="text-sm font-black text-gold">{newRankObj.label}</span>
          </div>
        </div>

        {/* Hunter Rating Score Card */}
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle w-full flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Evaluated Rating Score</span>
            <h4 className="text-xl font-black text-gold font-mono">{hunterRating} PTS</h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Status</span>
            <span className="text-xs font-black text-emerald-400 block">PROMOTED ✓</span>
          </div>
        </div>

        {/* Reason for Promotion */}
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle text-left w-full text-xs flex flex-col gap-1">
          <span className="font-extrabold text-gold uppercase text-[10px]">Reason for Promotion:</span>
          <p className="text-primary font-medium leading-relaxed">
            {reason || `Hunter Rating reached ${hunterRating} PTS through exceptional directive execution, attribute growth, and consistency.`}
          </p>
        </div>

        {/* Unlocked Features & Cosmetics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-card border border-border-subtle flex flex-col gap-1.5">
            <span className="font-extrabold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-gold text-base">lock_open</span>
              Unlocked Features
            </span>
            <ul className="text-[11px] text-primary-muted flex flex-col gap-1">
              {(newRankObj.perks || []).map(p => (
                <li key={p} className="flex items-center gap-1 font-semibold text-primary">
                  <span>•</span> {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-card border border-border-subtle flex flex-col gap-1.5">
            <span className="font-extrabold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-gold text-base">palette</span>
              Unlocked Cosmetics
            </span>
            <ul className="text-[11px] text-primary-muted flex flex-col gap-1">
              {(newRankObj.cosmetics || []).map(c => (
                <li key={c} className="flex items-center gap-1 font-semibold text-gold">
                  <span>✨</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleClose}
          className="w-full py-4 rounded-2xl gold-gradient text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform mt-2 uppercase tracking-wider"
        >
          Accept Promotion & Claim Title →
        </button>
      </div>
    </div>
  );
}
