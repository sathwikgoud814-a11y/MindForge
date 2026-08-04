import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function MissionCompletionModal() {
  const { completedPayoffModal, setCompletedPayoffModal, character } = useSystem();

  if (!completedPayoffModal.open || !completedPayoffModal.mission) return null;

  const m = completedPayoffModal.mission;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-300">
      <div className="bg-surface w-full max-w-md rounded-3xl p-8 shadow-2xl border border-border-gold text-center flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Top Celebration Icon */}
        <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-white text-4xl font-black shadow-lg">
          <span className="material-symbols-outlined text-4xl">workspace_premium</span>
        </div>

        <div>
          <span className="text-xs font-black tracking-widest text-gold uppercase">Directive Accomplished</span>
          <h2 className="text-2xl font-black text-primary tracking-tight mt-1">{m.name}</h2>
          <p className="text-xs text-primary-muted mt-0.5">Your Character is becoming stronger every day.</p>
        </div>

        {/* Rewards & Identity Progress Breakdown Grid */}
        <div className="w-full bg-surface-subtle p-5 rounded-2xl border border-border-subtle flex flex-col gap-3 text-xs">
          <div className="flex justify-between items-center font-extrabold pb-2 border-b border-border-subtle">
            <span className="text-primary-muted">Character XP Earned</span>
            <span className="text-primary text-sm">+{m.xpReward} XP</span>
          </div>

          <div className="flex justify-between items-center font-extrabold pb-2 border-b border-border-subtle">
            <span className="text-primary-muted">Discipline Points (DP)</span>
            <span className="text-gold text-sm">+{m.dpReward} DP</span>
          </div>

          <div className="flex justify-between items-center font-semibold">
            <span className="text-primary-muted">Skills Improved</span>
            <span className="text-primary font-bold">{m.relatedSkills.join(', ')} (+XP)</span>
          </div>

          <div className="flex justify-between items-center font-semibold">
            <span className="text-primary-muted">Attributes Increased</span>
            <span className="text-gold font-bold">{m.attributesImproved.join(', ')}</span>
          </div>

          <div className="flex justify-between items-center font-extrabold pt-2 border-t border-border-subtle text-[11px]">
            <span className="text-primary-muted">Future {character.primaryCareer} Progress</span>
            <span className="text-emerald-600 text-xs font-black">+0.02%</span>
          </div>
        </div>

        <button
          onClick={() => setCompletedPayoffModal({ open: false, mission: null })}
          className="w-full gold-gradient text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md hover:scale-105 transition-transform"
        >
          Claim Identity Progress
        </button>
      </div>
    </div>
  );
}
