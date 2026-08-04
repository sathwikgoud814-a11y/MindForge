import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function CreateDuelModal() {
  const { challengeHunter, setChallengeHunter, startDuel } = useSystem();
  const [duration, setDuration] = useState('3 Days');
  const [category, setCategory] = useState('Deep Work');

  if (!challengeHunter) return null;

  const h = challengeHunter;

  const handleStart = (e) => {
    e.preventDefault();
    startDuel(h, duration, category);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-2xl">swords</span>
            <h3 className="font-extrabold text-lg text-primary">Issue Duel Challenge</h3>
          </div>
          <button
            onClick={() => setChallengeHunter(null)}
            className="p-1.5 rounded-xl hover:bg-surface-subtle text-primary-muted"
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Opponent Banner */}
        <div className="p-4 rounded-2xl bg-gold-light/40 border border-gold/30 flex items-center gap-4">
          <img src={h.avatar} alt={h.name} className="w-12 h-12 rounded-2xl object-cover border border-border-subtle" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded gold-gradient text-white uppercase">{h.rank}</span>
              <h4 className="font-extrabold text-sm text-primary">{h.name}</h4>
            </div>
            <p className="text-xs text-primary-muted">{h.career} • Level {h.level}</p>
          </div>
        </div>

        <form onSubmit={handleStart} className="flex flex-col gap-4 text-xs">
          {/* Duration Selector */}
          <div>
            <label className="block font-bold text-primary mb-1">Choose Duel Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {['1 Day', '3 Days', '7 Days'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-2.5 rounded-xl font-extrabold transition-all ${
                    duration === d ? 'bg-primary text-white shadow-sm' : 'bg-surface-subtle text-primary-muted hover:text-primary border border-border-subtle'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block font-bold text-primary mb-1">Choose Duel Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary font-extrabold"
            >
              <option value="All Missions">All Missions</option>
              <option value="Study">Study & Academics</option>
              <option value="Fitness">Fitness & Vitality</option>
              <option value="Reading">Reading & Lore</option>
              <option value="Deep Work">Deep Work Chamber</option>
              <option value="Programming">Programming & Code</option>
            </select>
          </div>

          {/* Reward Display */}
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Champion Rewards</span>
            <div className="flex items-center gap-3 text-xs font-black text-primary">
              <span>+300 XP</span>
              <span className="text-gold">+150 DP</span>
              <span className="text-emerald-600">🏆 Duel Champion Badge</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setChallengeHunter(null)}
              className="px-5 py-3 rounded-2xl bg-red-50 text-red-700 font-extrabold text-xs border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">block</span>
              Cancel & Abort Challenge
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">swords</span>
              Send Real Duel Challenge ⚔️
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
