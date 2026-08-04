import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function PublicCharacterModal() {
  const { selectedHunterProfile, setSelectedHunterProfile, setChallengeHunter } = useSystem();

  if (!selectedHunterProfile) return null;

  const h = selectedHunterProfile;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full gold-gradient text-white uppercase tracking-wider">
            Public Character Profile
          </span>
          <button
            onClick={() => setSelectedHunterProfile(null)}
            className="p-1 rounded-lg hover:bg-surface-subtle text-primary-muted"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-5">
          <img src={h.avatar} alt={h.name} className="w-20 h-20 rounded-3xl object-cover border border-border-subtle shadow-md" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded gold-gradient text-white uppercase">{h.rank}</span>
              <span className="text-xs font-semibold text-primary-muted">Level {h.level}</span>
            </div>
            <h3 className="text-2xl font-black text-primary tracking-tight">{h.name}</h3>
            <p className="text-xs font-bold text-gold">{h.career}</p>
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Total XP</span>
            <h4 className="text-sm font-black text-primary">{h.xp}</h4>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Discipline</span>
            <h4 className="text-sm font-black text-gold">{h.dp} DP</h4>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Streak</span>
            <h4 className="text-sm font-black text-emerald-600">{h.streakDays} Days</h4>
          </div>
        </div>

        {/* Top Skills */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-primary">Top Mastery Skills</span>
          <div className="flex items-center gap-2 flex-wrap">
            {h.topSkills.map(sk => (
              <span key={sk} className="text-xs font-bold px-3 py-1 rounded-xl bg-surface-subtle border border-border-subtle text-primary">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-primary">Trophy Showcase</span>
          <div className="flex items-center gap-2 flex-wrap">
            {h.achievements.map(ac => (
              <span key={ac} className="text-xs font-bold px-3 py-1 rounded-xl bg-gold-light/60 border border-gold/30 text-gold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">stars</span>
                {ac}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-subtle">
          <button
            onClick={() => setSelectedHunterProfile(null)}
            className="px-4 py-2.5 rounded-xl bg-surface-subtle text-primary-muted font-bold text-xs"
          >
            Close
          </button>
          <button
            onClick={() => { setSelectedHunterProfile(null); setChallengeHunter(h); }}
            className="px-5 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
          >
            Issue Duel Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
