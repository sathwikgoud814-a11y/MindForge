import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function MissionsView() {
  const { missions, completeMission, setShowCreateMissionModal } = useSystem();
  const [filter, setFilter] = useState('ALL');

  const filteredMissions = (missions || []).filter(m => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return m.completed;
    if (filter === 'PENDING') return !m.completed;
    return m.difficulty === filter;
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="apple-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              Directive Execution
            </span>
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight mt-0.5">Active Missions</h1>
          <p className="text-xs text-primary-muted">Execute career-aligned directives to earn XP, Discipline Points (DP), and strengthen attributes.</p>
        </div>

        <button
          onClick={() => setShowCreateMissionModal(true)}
          className="px-5 py-3 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Create New Mission
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Missions' },
          { id: 'PENDING', label: 'Pending Directives' },
          { id: 'S-Rank', label: 'S-Rank' },
          { id: 'A-Rank', label: 'A-Rank' },
          { id: 'B-Rank', label: 'B-Rank' },
          { id: 'COMPLETED', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              filter === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-subtle text-primary-muted hover:text-primary border border-border-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMissions.map(m => (
          <div
            key={m.id}
            className={`apple-card p-6 flex flex-col justify-between gap-4 transition-all apple-card-hover ${
              m.completed ? 'border-emerald-500/30 bg-emerald-50/10 opacity-75' : ''
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded gold-gradient text-white uppercase tracking-wider">
                    {m.difficulty || 'B-Rank'}
                  </span>
                  {m.isMainMission && (
                    <span className="text-[10px] font-extrabold text-gold bg-gold-light/60 px-2 py-0.5 rounded border border-gold/30">
                      MAIN DIRECTIVE
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-primary-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-gold">timer</span>
                  {m.estimatedDuration || '30 Mins'}
                </span>
              </div>

              <div>
                <h3 className={`font-extrabold text-base ${m.completed ? 'line-through text-primary-muted' : 'text-primary'}`}>
                  {m.name}
                </h3>
                <p className="text-xs text-primary-muted font-medium mt-1">
                  Skills: {m.relatedSkills?.join(' • ') || 'Core Growth'}
                </p>
                <p className="text-[11px] text-gold font-bold mt-0.5">
                  Attributes: {m.attributesImproved?.join(' • ') || 'Focus +10, Knowledge +8'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs font-black text-primary">
                <span>+{m.xpReward || 80} XP</span>
                <span className="text-gold">+{m.dpReward || 40} DP</span>
              </div>

              {m.completed ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Completed ✓
                </span>
              ) : (
                <button
                  onClick={() => completeMission(m.id)}
                  className="px-4 py-2 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  Execute
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
