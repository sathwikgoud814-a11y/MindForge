import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function LongTermGoals() {
  const epicGoals = [
    {
      id: 'g1',
      title: 'Achieve S-Rank Software Architect Status',
      category: 'Career & Mastery',
      progress: 65,
      deadline: 'December 2026',
      xpReward: 10000,
      milestones: [
        { text: 'Master System Design & Distributed Systems', done: true },
        { text: 'Publish 5 open-source production projects', done: true },
        { text: 'Complete National Level Certification Raid', done: false },
      ]
    },
    {
      id: 'g2',
      title: 'Physical Peak: Sub-20min 5K & 100kg Bench Press',
      category: 'Vitality & Physical',
      progress: 40,
      deadline: 'October 2026',
      xpReward: 7500,
      milestones: [
        { text: 'Consistently hit 100 push-ups daily for 60 days', done: true },
        { text: 'Run 10km twice per week', done: false },
        { text: 'Reach 10% body fat ratio', done: false },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-black/5 premium-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              Epic Directives
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Long-Term Goals</h1>
          <p className="text-xs text-on-surface-variant">Multi-stage epic quests spanning months of consistent execution.</p>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-6">
        {epicGoals.map(g => (
          <div key={g.id} className="bg-surface p-6 rounded-3xl border border-black/5 premium-shadow flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-secondary-gold/20 text-secondary-gold uppercase">
                  {g.category}
                </span>
                <h3 className="font-extrabold text-lg text-primary mt-1">{g.title}</h3>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-emerald-600">+{g.xpReward} XP</span>
                <span className="text-xs font-semibold text-on-surface-variant">Target: {g.deadline}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface-variant">Completion Status</span>
                <span className="text-primary">{g.progress}%</span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                <div className="gold-gradient h-full rounded-full transition-all duration-700" style={{ width: `${g.progress}%` }}></div>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
              <span className="text-xs font-bold text-primary">Epic Milestones</span>
              {g.milestones.map((m, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-on-surface">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    m.done ? 'gold-gradient text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {m.done ? '✓' : idx + 1}
                  </span>
                  <span className={m.done ? 'line-through opacity-70' : 'font-medium'}>{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
