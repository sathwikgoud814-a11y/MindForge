import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function LevelUpModal() {
  const { showLevelUpModal, setShowLevelUpModal, character, setActiveTab } = useSystem();

  if (!showLevelUpModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-300">
      <div className="bg-surface w-full max-w-md rounded-3xl p-8 shadow-2xl border border-border-gold text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center text-white text-4xl font-black shadow-lg">
          <span className="material-symbols-outlined text-4xl">military_tech</span>
        </div>

        <div>
          <span className="text-xs font-black tracking-widest text-gold uppercase">System Level Up</span>
          <h2 className="text-3xl font-black text-primary tracking-tight mt-1">LEVEL {character.level}!</h2>
          <p className="text-xs text-gold font-bold mt-1">Rank Progressed to {character.rank}</p>
        </div>

        <p className="text-xs text-primary-muted leading-relaxed">
          Your Character stats and skills have leveled up. All attributes increased automatically.
        </p>

        <button
          onClick={() => {
            setShowLevelUpModal(false);
            setActiveTab('character');
          }}
          className="w-full gold-gradient text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md hover:scale-105 transition-transform"
        >
          View Character Status
        </button>
      </div>
    </div>
  );
}
