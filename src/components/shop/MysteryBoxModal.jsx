import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function MysteryBoxModal() {
  const { mysteryBoxOverlay, setMysteryBoxOverlay } = useSystem();

  if (!mysteryBoxOverlay || !mysteryBoxOverlay.open || !mysteryBoxOverlay.drop) return null;

  const drop = mysteryBoxOverlay.drop;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in zoom-in-95 duration-300">
      <div className="bg-surface w-full max-w-md rounded-3xl p-8 shadow-2xl border border-border-gold text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-surface-subtle border border-gold text-gold flex items-center justify-center text-4xl shadow-md animate-bounce">
          <span className="material-symbols-outlined text-4xl">{drop.icon}</span>
        </div>

        <div>
          <span className={`text-xs font-black tracking-widest uppercase ${drop.color}`}>
            {drop.rarity} DROP UNLOCKED
          </span>
          <h2 className="text-xl font-black text-primary tracking-tight mt-1">{drop.name}</h2>
        </div>

        <div className="w-full p-4 rounded-2xl bg-surface-subtle text-xs text-primary-muted border border-border-subtle">
          This cosmetic item has been added to your Character Profile customization menu.
        </div>

        <button
          onClick={() => setMysteryBoxOverlay({ open: false, box: null, drop: null })}
          className="w-full gold-gradient text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md hover:scale-105 transition-transform"
        >
          Equip Drop
        </button>
      </div>
    </div>
  );
}
