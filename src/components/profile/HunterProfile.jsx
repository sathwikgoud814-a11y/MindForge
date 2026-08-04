import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function HunterProfile() {
  const { hunter, allocateStat } = useSystem();

  const statDefs = [
    { key: 'strength', name: 'Strength (STR)', desc: 'Physical power and heavy task resolution efficiency', icon: 'fitness_center' },
    { key: 'agility', name: 'Agility (AGI)', desc: 'Speed, reaction times, and habit execution velocity', icon: 'bolt' },
    { key: 'intelligence', name: 'Intelligence (INT)', desc: 'Problem solving, deep coding capacity, mental energy', icon: 'psychology' },
    { key: 'vitality', name: 'Vitality (VIT)', desc: 'Stamina, fatigue resistance, and focus duration', icon: 'favorite' },
    { key: 'sense', name: 'Sense (SEN)', desc: 'Perception, distraction detection, mindfulness', icon: 'visibility' },
  ];

  const titles = [
    { name: 'Shadow Monarch', active: true, desc: 'Master of all System productivity directives' },
    { name: 'S-Rank Hunter', active: true, desc: 'Achieved S-Rank status in core stats' },
    { name: 'Monarch of Focus', active: true, desc: 'Log 50+ hours in Focus Mode' },
    { name: 'National Level Hunter', active: false, desc: 'Reach Level 50 and 100+ all stats' },
  ];

  const skills = [
    { name: "Ruler's Authority", level: 'MAX', desc: 'Telekinetic focus - block all distracting tabs instantly', icon: 'pan_tool' },
    { name: 'Shadow Extraction', level: 'Lvl 3', desc: 'Extract automated AI summaries from finished quests', icon: 'groups' },
    { name: 'Sprint', level: 'Lvl 5', desc: 'Boost XP returns by +50% during 30-minute focus sprints', icon: 'directions_run' },
    { name: 'System Regeneration', level: 'Lvl 2', desc: 'Recover daily streak if 1 day missed per month', icon: 'health_and_safety' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Profile Card */}
      <section className="bg-surface rounded-3xl p-6 md:p-8 border border-black/5 premium-shadow flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-6 z-10">
          <div className="w-28 h-28 rounded-full border-4 border-secondary-gold gold-glow overflow-hidden flex-shrink-0 relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-primary/80 backdrop-blur-sm text-center text-[10px] font-bold text-white py-0.5">
              S-RANK
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full gold-gradient text-white">
                {hunter.rank}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Level {hunter.level}</span>
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tight">{hunter.name}</h1>
            <p className="text-sm font-semibold text-secondary-gold mt-0.5">{hunter.title}</p>
          </div>
        </div>

        {/* Stat Points Status Box */}
        <div className="bg-gradient-to-br from-primary to-slate-900 text-white p-6 rounded-2xl border border-secondary-gold/30 flex flex-col items-center gap-2 min-w-[240px] text-center shadow-lg">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary-gold">Unallocated Points</span>
          <span className="text-4xl font-black text-white gold-gradient-text">{hunter.unallocatedPoints}</span>
          <p className="text-[11px] text-slate-300">Assign points below to enhance attributes</p>
        </div>
      </section>

      {/* Main Grid: Stat Allocation + Skills */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stat Points Allocation Card */}
        <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div>
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-gold">stars</span>
                Attribute Point Allocation
              </h3>
              <p className="text-xs text-on-surface-variant">Distribute points awarded upon level-up</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary-gold/10 text-secondary-gold">
              {hunter.unallocatedPoints} Points Left
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {statDefs.map(s => {
              const currentVal = hunter.stats[s.key];
              return (
                <div key={s.key} className="p-4 rounded-xl bg-surface-container-low/60 border border-black/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary-gold text-xl">{s.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">{s.name}</h4>
                      <p className="text-[11px] text-on-surface-variant">{s.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-primary min-w-[32px] text-right">{currentVal}</span>
                    <button
                      disabled={hunter.unallocatedPoints <= 0}
                      onClick={() => allocateStat(s.key)}
                      className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                        hunter.unallocatedPoints > 0
                          ? 'gold-gradient text-white shadow-md hover:scale-110 active:scale-95'
                          : 'bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed'
                      }`}
                    >
                      +1
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills & Title Showcase */}
        <div className="flex flex-col gap-6">
          {/* Active Skill Tree */}
          <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-4">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-gold">bolt</span>
              Unlocked Hunter Skills
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map(sk => (
                <div key={sk.name} className="p-3.5 rounded-xl bg-surface-container-low/60 border border-black/5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-gold text-lg">{sk.icon}</span>
                      <h4 className="font-bold text-xs text-primary">{sk.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary text-white">{sk.level}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-tight">{sk.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Titles Showcase */}
          <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-4">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-gold">military_tech</span>
              System Titles & Badges
            </h3>

            <div className="flex flex-col gap-2">
              {titles.map(t => (
                <div key={t.name} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  t.active ? 'bg-secondary-gold/10 border-secondary-gold/40' : 'bg-surface-container-low opacity-60 border-black/5'
                }`}>
                  <div>
                    <span className="font-bold text-primary">{t.name}</span>
                    <p className="text-[11px] text-on-surface-variant">{t.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    t.active ? 'gold-gradient text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {t.active ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
