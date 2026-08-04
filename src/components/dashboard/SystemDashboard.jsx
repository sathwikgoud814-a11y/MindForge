import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { StatRadarChart } from './StatRadarChart';

export function SystemDashboard() {
  const { hunter, quests, habits, toggleQuestStep, setActiveTab, setCreateQuestModalOpen } = useSystem();

  const activeQuests = quests.filter(q => !q.completed);
  const completedToday = quests.filter(q => q.completed).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner: Hunter Status Card */}
      <section className="bg-surface rounded-3xl p-6 md:p-8 border border-black/5 premium-shadow relative overflow-hidden">
        {/* Ambient Gold Background Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-secondary-gold/10 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            {/* Spinning S-Rank Ring */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-secondary-gold/30 relative flex-shrink-0 bg-surface-container-lowest shadow-md">
              <div className="absolute inset-0 rounded-full border-t-4 border-secondary-gold animate-spin-slow"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-secondary-gold font-headline">S</span>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">RANK</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">
                  LVL {hunter.level}
                </span>
                <span className="text-xs font-semibold text-secondary-gold bg-secondary-gold/10 px-2.5 py-1 rounded-full">
                  {hunter.title}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                {hunter.name}
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Active Streak: <strong className="text-primary">{hunter.streakDays} Days</strong> • Gold: <strong className="text-amber-600">{hunter.goldCoins} G</strong>
              </p>
            </div>
          </div>

          {/* XP Progress Bar & Stat Point Quick Link */}
          <div className="flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-on-surface-variant uppercase tracking-wider">XP Progress to Lvl {hunter.level + 1}</span>
              <span className="text-primary">{hunter.xp} / {hunter.xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden p-0.5 border border-black/5">
              <div
                className="gold-gradient h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${Math.min(100, Math.round((hunter.xp / hunter.xpToNextLevel) * 100))}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-on-surface-variant font-medium">Unallocated Stat Points</span>
              <button
                onClick={() => setActiveTab('profile')}
                className={`font-bold px-3 py-1 rounded-lg transition-all ${
                  hunter.unallocatedPoints > 0
                    ? 'gold-gradient text-white shadow-sm hover:scale-105'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {hunter.unallocatedPoints} PTS Available
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold uppercase tracking-wider">Quests Done</span>
            <span className="material-symbols-outlined text-secondary-gold text-xl">workspace_premium</span>
          </div>
          <span className="text-2xl font-black text-primary">{completedToday} / {quests.length}</span>
          <span className="text-[11px] text-emerald-600 font-medium">Daily Directives</span>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold uppercase tracking-wider">Habit Streaks</span>
            <span className="material-symbols-outlined text-amber-500 text-xl">local_fire_department</span>
          </div>
          <span className="text-2xl font-black text-primary">{habits.length} Active</span>
          <span className="text-[11px] text-amber-600 font-medium">Top Streak: {Math.max(...habits.map(h => h.streak))} Days</span>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold uppercase tracking-wider">Focus Hours</span>
            <span className="material-symbols-outlined text-indigo-500 text-xl">timer</span>
          </div>
          <span className="text-2xl font-black text-primary">24.5 Hrs</span>
          <span className="text-[11px] text-indigo-600 font-medium">1.5x XP Rate Active</span>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-semibold uppercase tracking-wider">System Rank</span>
            <span className="material-symbols-outlined text-secondary-gold text-xl">military_tech</span>
          </div>
          <span className="text-2xl font-black text-primary">S-Tier</span>
          <span className="text-[11px] text-secondary-gold font-medium">Shadow Monarch Status</span>
        </div>
      </section>

      {/* Main Grid: Stat Radar + Active Daily Directives */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stat Radar Chart */}
        <StatRadarChart />

        {/* Active Quests Overview */}
        <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-gold">task</span>
                  Active Quests ({activeQuests.length})
                </h3>
                <p className="text-xs text-on-surface-variant">Directives awaiting completion</p>
              </div>
              <button
                onClick={() => setCreateQuestModalOpen(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-black transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm text-secondary-gold">add</span>
                New Quest
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
              {activeQuests.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant text-sm flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-3xl text-emerald-500">check_circle</span>
                  All daily directives fulfilled! System reward credited.
                </div>
              ) : (
                activeQuests.map(q => (
                  <div key={q.id} className="p-4 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low border border-black/5 flex flex-col gap-3 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          q.type === 'DAILY' ? 'bg-secondary-gold/20 text-secondary-gold' :
                          q.type === 'URGENT' ? 'bg-rose-100 text-rose-700 font-bold' :
                          q.type === 'PENALTY' ? 'bg-black text-red-400 font-bold' :
                          'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                          {q.tier}
                        </span>
                        <h4 className="font-bold text-sm text-primary">{q.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">+{q.xpReward} XP</span>
                    </div>

                    {/* Step checkboxes */}
                    <div className="flex flex-col gap-1.5 text-xs">
                      {q.steps.map(step => (
                        <label key={step.id} className="flex items-center gap-2 cursor-pointer text-on-surface hover:text-primary">
                          <input
                            type="checkbox"
                            checked={step.done}
                            onChange={() => toggleQuestStep(q.id, step.id)}
                            className="w-4 h-4 rounded text-primary focus:ring-secondary-gold accent-secondary-gold"
                          />
                          <span className={step.done ? 'line-through text-on-surface-variant/60' : 'font-medium'}>
                            {step.text}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-black/5">
                      <span>Deadline: {q.deadline}</span>
                      <span className="font-bold text-primary">{q.progress}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 mt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('quests')}
              className="text-xs font-bold text-primary hover:text-secondary-gold flex items-center gap-1"
            >
              View All Quests ({quests.length})
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* System AI Directive Callout */}
      <section className="bg-gradient-to-r from-primary to-slate-900 text-white p-6 rounded-3xl border border-secondary-gold/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-gold/20 flex items-center justify-center flex-shrink-0 text-secondary-gold text-2xl border border-secondary-gold/40">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <h4 className="font-bold text-base text-secondary-gold flex items-center gap-2">
              System AI Voice Directive
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              "Hunter {hunter.name}, your Vitality stat has increased by +4 points this week. I recommend initializing the 4-hour Deep Work focus session to maximize XP returns."
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('coach')}
          className="text-xs font-bold px-4 py-2.5 rounded-xl gold-gradient text-white shadow-md hover:scale-105 transition-transform flex-shrink-0"
        >
          Consult AI Coach
        </button>
      </section>
    </div>
  );
}
