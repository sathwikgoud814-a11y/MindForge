import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function QuestManagement() {
  const { quests, toggleQuestStep, setCreateQuestModalOpen } = useSystem();
  const [filterType, setFilterType] = useState('ALL');

  const filteredQuests = quests.filter(q => {
    if (filterType === 'ALL') return true;
    if (filterType === 'COMPLETED') return q.completed;
    return q.type === filterType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-black/5 premium-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              System Directives
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Quest Management</h1>
          <p className="text-xs text-on-surface-variant">Execute quests to earn XP, Gold Coins, and Stat point rewards.</p>
        </div>

        <button
          onClick={() => setCreateQuestModalOpen(true)}
          className="bg-primary hover:bg-black text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-secondary-gold/30 shadow-md"
        >
          <span className="material-symbols-outlined text-secondary-gold text-lg">add_circle</span>
          Create New Quest
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-black/5">
        {[
          { id: 'ALL', label: 'All Quests' },
          { id: 'DAILY', label: 'Daily Quests' },
          { id: 'URGENT', label: 'Urgent Dungeons' },
          { id: 'SIDE', label: 'Side Missions' },
          { id: 'PENALTY', label: 'Penalty Quests' },
          { id: 'COMPLETED', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuests.map(q => (
          <div
            key={q.id}
            className={`bg-surface p-6 rounded-2xl border transition-all flex flex-col justify-between gap-4 premium-shadow ${
              q.completed
                ? 'border-emerald-500/30 bg-emerald-50/20'
                : q.type === 'PENALTY'
                ? 'border-red-500/40 bg-gradient-to-br from-slate-900 to-black text-white'
                : 'border-black/5 hover:border-secondary-gold/40'
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                    q.type === 'DAILY' ? 'bg-secondary-gold/20 text-secondary-gold' :
                    q.type === 'URGENT' ? 'bg-rose-500 text-white' :
                    q.type === 'PENALTY' ? 'bg-red-600 text-white animate-pulse' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {q.tier}
                  </span>
                  <span className="text-[11px] font-semibold uppercase text-on-surface-variant">
                    {q.type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-600">+{q.xpReward} XP</span>
                  {q.goldReward > 0 && (
                    <span className="text-xs font-black text-amber-600">+{q.goldReward} G</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className={`font-bold text-base ${q.type === 'PENALTY' ? 'text-red-400' : 'text-primary'}`}>
                  {q.title}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${q.type === 'PENALTY' ? 'text-slate-300' : 'text-on-surface-variant'}`}>
                  {q.description}
                </p>
              </div>

              {/* Reward Callout */}
              <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                q.type === 'PENALTY' ? 'bg-white/10 text-slate-200' : 'bg-surface-container-low text-primary'
              }`}>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary-gold text-base">military_tech</span>
                  Stat Bonus:
                </span>
                <span className="font-bold text-secondary-gold">{q.statReward}</span>
              </div>

              {/* Checklist */}
              <div className="flex flex-col gap-2 pt-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${q.type === 'PENALTY' ? 'text-slate-400' : 'text-on-surface-variant'}`}>
                  Required Steps ({q.completedSteps}/{q.totalSteps})
                </span>
                {q.steps.map(step => (
                  <label
                    key={step.id}
                    className={`flex items-center gap-3 p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      step.done
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : q.type === 'PENALTY'
                        ? 'bg-white/5 hover:bg-white/10 text-white'
                        : 'bg-surface-container-low/80 hover:bg-surface-container text-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={step.done}
                      onChange={() => toggleQuestStep(q.id, step.id)}
                      className="w-4 h-4 rounded accent-secondary-gold focus:ring-secondary-gold"
                    />
                    <span className={step.done ? 'line-through opacity-70' : ''}>
                      {step.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bottom Progress Footer */}
            <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
              <span className={q.type === 'PENALTY' ? 'text-slate-400' : 'text-on-surface-variant'}>
                Deadline: <strong>{q.deadline}</strong>
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="gold-gradient h-full rounded-full transition-all duration-500"
                    style={{ width: `${q.progress}%` }}
                  ></div>
                </div>
                <span className="font-extrabold text-primary">{q.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
