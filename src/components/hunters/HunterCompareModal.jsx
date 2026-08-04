import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function HunterCompareModal() {
  const { character, attributes, compareHunter, setCompareHunter, setChallengeHunter } = useSystem();

  if (!compareHunter) return null;

  const h = compareHunter;

  const compareRows = [
    { label: 'Character Level', userVal: character.level, hVal: h.level, unit: '' },
    { label: 'Character XP', userVal: character.xp, hVal: h.xp, unit: ' XP' },
    { label: 'Discipline Points', userVal: character.dp, hVal: h.dp, unit: ' DP' },
    { label: 'Active Streak', userVal: character.streakDays, hVal: h.streakDays, unit: ' Days' },
    { label: 'Study Hours', userVal: character.studyHours, hVal: h.studyHours, unit: 'h' },
    { label: 'Workout Hours', userVal: character.workoutHours, hVal: h.workoutHours, unit: 'h' },
    { label: 'Focus Hours', userVal: character.focusHours, hVal: h.focusHours, unit: 'h' },
    { label: 'Mission Completion', userVal: character.completionPct, hVal: h.completionPct, unit: '%' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-2xl">compare_arrows</span>
            <h3 className="font-extrabold text-lg text-primary">Side-by-Side Compare Mode</h3>
          </div>
          <button
            onClick={() => setCompareHunter(null)}
            className="p-1 rounded-lg hover:bg-surface-subtle text-primary-muted"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Side-by-side Character Cards */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-gold-light/40 border border-gold/30 flex flex-col items-center gap-1">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase">YOU</span>
            <h4 className="font-black text-base text-primary mt-1">{character.name}</h4>
            <span className="text-xs font-semibold text-primary-muted">{character.primaryCareer}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col items-center gap-1">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary text-white uppercase">{h.rank}</span>
            <h4 className="font-black text-base text-primary mt-1">{h.name}</h4>
            <span className="text-xs font-semibold text-primary-muted">{h.career}</span>
          </div>
        </div>

        {/* Comparison Metrics Table */}
        <div className="flex flex-col gap-2">
          {compareRows.map(row => {
            const userLeads = row.userVal >= row.hVal;
            return (
              <div key={row.label} className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle grid grid-cols-3 items-center text-xs">
                <span className={`font-black text-left ${userLeads ? 'text-emerald-600 font-extrabold' : 'text-primary'}`}>
                  {row.userVal}{row.unit} {userLeads && '👑'}
                </span>
                <span className="text-center font-bold text-primary-muted">{row.label}</span>
                <span className={`font-black text-right ${!userLeads ? 'text-emerald-600 font-extrabold' : 'text-primary'}`}>
                  {!userLeads && '👑'} {row.hVal}{row.unit}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-subtle">
          <button
            onClick={() => setCompareHunter(null)}
            className="px-4 py-2.5 rounded-xl bg-surface-subtle text-primary-muted font-bold text-xs"
          >
            Close
          </button>
          <button
            onClick={() => { setCompareHunter(null); setChallengeHunter(h); }}
            className="px-5 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
          >
            Challenge to Duel
          </button>
        </div>
      </div>
    </div>
  );
}
