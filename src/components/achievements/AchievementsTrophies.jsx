import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function AchievementsTrophies() {
  const { achievements } = useSystem();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-black/5 premium-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              Trophy Hall
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Achievements & Badges</h1>
          <p className="text-xs text-on-surface-variant">Celebrate milestone accomplishments across your Hunter career.</p>
        </div>

        <span className="text-xs font-bold text-secondary-gold bg-secondary-gold/10 px-4 py-2 rounded-2xl border border-secondary-gold/30">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} Trophies Unlocked
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map(a => (
          <div
            key={a.id}
            className={`bg-surface p-6 rounded-2xl border transition-all flex items-start gap-4 premium-shadow ${
              a.unlocked ? 'border-secondary-gold/40 bg-gradient-to-br from-surface to-secondary-gold/5' : 'border-black/5 opacity-50'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
              a.unlocked ? 'gold-gradient text-white shadow-md border-secondary-gold/50' : 'bg-surface-container text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-3xl">{a.icon}</span>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black text-white uppercase">
                  {a.rarity}
                </span>
                {a.unlocked && (
                  <span className="text-[10px] text-emerald-600 font-bold">Unlocked {a.unlockedAt}</span>
                )}
              </div>
              <h3 className="font-bold text-base text-primary">{a.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
