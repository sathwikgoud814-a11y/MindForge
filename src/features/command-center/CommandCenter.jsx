import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { ProgressBar } from '../../shared/components/ProgressBar';
import { getCategoryBadgeStyle } from '../../shared/utils/categoryColors';

export function CommandCenter() {
  const { character, attributes, missions, rewards, completeMission, setActiveTab } = useSystem();

  const [notificationToast, setNotificationToast] = useState(null);

  const safeMissions = missions || [];
  const safeRewards = rewards || [];
  const safeAttrs = attributes || {};

  const mainMission = safeMissions.find(m => m.isMainMission) || safeMissions[0];
  const sideMissions = safeMissions.filter(m => !m.isMainMission);
  const completedMissionsCount = safeMissions.filter(m => m.completed).length;
  const todayProgressPct = safeMissions.length > 0 ? Math.round((completedMissionsCount / safeMissions.length) * 100) : 0;

  // Active Target Reward (Find first unredeemed reward)
  const targetReward = safeRewards.find(r => !r.redeemed) || { name: 'Specialty Espresso Coffee', costDP: 180, category: 'Food' };
  const currentDP = character?.dp || 160;
  const dpNeeded = Math.max(0, targetReward.costDP - currentDP);
  const rewardProgressPct = Math.min(100, Math.round((currentDP / targetReward.costDP) * 100));
  const missionsRemaining = Math.ceil(dpNeeded / 40);

  // XP & Level Metrics
  const level = character?.level ?? 2;
  const xp = character?.xp ?? 680;
  const xpToNext = character?.xpToNextLevel ?? 1000;
  const xpPct = Math.min(100, Math.round((xp / (xpToNext || 1000)) * 100));
  const recruitProgressPct = Math.min(100, Math.round(((level * 10 + completedMissionsCount * 5) / 100) * 100));

  // Stat Scores
  const strScore = (safeAttrs.strength?.level || 2) * 10 + 1;
  const focScore = (safeAttrs.focus?.level || 3) * 10 + 4;
  const knwScore = (safeAttrs.knowledge?.level || 4) * 10 + 8;
  const crtScore = (safeAttrs.creativity?.level || 5) * 10 + 5;

  const handleExecuteMainMission = () => {
    if (!mainMission) return;
    completeMission(mainMission.id);
    setNotificationToast({
      title: 'SYSTEM GAIN RECORDED',
      msg: `Knowledge & Focus Increased! +${mainMission.xpReward} XP | +${mainMission.dpReward} DP`,
    });
    setTimeout(() => setNotificationToast(null), 4000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      {/* System Toast Notification for Microinteractions */}
      {notificationToast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-surface-card border-2 border-gold text-xs shadow-2xl animate-in slide-in-from-top-4 duration-300 flex items-center gap-3 max-w-sm">
          <span className="material-symbols-outlined text-gold text-2xl animate-bounce">auto_awesome</span>
          <div>
            <h4 className="font-extrabold text-gold uppercase text-[10px] tracking-wider">{notificationToast.title}</h4>
            <p className="font-bold text-primary text-xs mt-0.5">{notificationToast.msg}</p>
          </div>
        </div>
      )}

      {/* SECTION 1: WHO AM I? — Character Hero HUD Panel */}
      <section className="apple-card p-6 md:p-8 flex flex-col lg:flex-row items-stretch justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
          {/* Level Circle HUD */}
          <div className="w-24 h-24 rounded-3xl gold-gradient p-1 flex-shrink-0 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-surface rounded-2xl flex flex-col items-center justify-center text-primary">
              <span className="text-[10px] font-black uppercase text-gold">LVL</span>
              <span className="text-3xl font-black">{level}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black px-3 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
                {character.rank || 'Recruit Rank'}
              </span>
              <span className="text-xs font-extrabold text-gold px-2.5 py-0.5 rounded-full bg-surface-subtle border border-border-subtle">
                {character.archetype || 'Creative Builder'}
              </span>
              <span className="text-xs font-bold text-primary-muted">
                🔥 {character.streakDays || 1} Day Streak
              </span>
            </div>

            <h1 className="text-3xl font-black text-primary tracking-tight">Good Morning, {character.name || 'Vekta'}.</h1>

            {/* XP & Rank Mastery Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 max-w-xl">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-extrabold">
                  <span className="text-primary-muted">XP Mastery</span>
                  <span className="text-gold font-mono">{xp} / {xpToNext} XP</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
                  <div className="gold-gradient h-full rounded-full transition-all duration-500 progress-glow" style={{ width: `${xpPct}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-extrabold">
                  <span className="text-primary-muted">Recruit Mastery</span>
                  <span className="text-primary font-mono">{recruitProgressPct}%</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${recruitProgressPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 10: Character Side Stat Panel */}
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col justify-between gap-3 min-w-[220px]">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="text-[10px] font-black text-gold uppercase tracking-wider">Character Core Stats</span>
            <button onClick={() => setActiveTab('character')} className="text-[10px] font-bold text-primary-muted hover:text-primary">
              View Matrix →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-surface-card border border-border-subtle flex flex-col">
              <span className="text-[9px] font-bold text-primary-muted uppercase">Strength</span>
              <span className="font-black text-primary text-sm">{strScore}</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-card border border-border-subtle flex flex-col">
              <span className="text-[9px] font-bold text-primary-muted uppercase">Focus</span>
              <span className="font-black text-gold text-sm">{focScore}</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-card border border-border-subtle flex flex-col">
              <span className="text-[9px] font-bold text-primary-muted uppercase">Knowledge</span>
              <span className="font-black text-blue-400 text-sm">{knwScore}</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-card border border-border-subtle flex flex-col">
              <span className="text-[9px] font-bold text-primary-muted uppercase">Creativity</span>
              <span className="font-black text-purple-400 text-sm">{crtScore}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2-COLUMN MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: WHAT SHOULD I DO? & WHY SHOULD I DO IT? (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* SECTION 2: WHAT SHOULD I DO? — Today's Main Mission Focus */}
          {mainMission && (
            <div className="apple-card p-6 md:p-8 flex flex-col gap-6 border-l-4 border-l-gold shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-3 py-0.5 rounded gold-gradient text-white">
                    {mainMission.difficulty || 'S-Rank'}
                  </span>
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">Today's Main Mission Directive</span>
                </div>
                <span className="text-xs font-bold text-primary-muted">⏱ {mainMission.estimatedDuration || '60 Mins'}</span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-primary tracking-tight">{mainMission.name}</h2>
              </div>

              {/* Rewards Box */}
              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-primary font-black text-sm">+{mainMission.xpReward || 120} XP</span>
                  <span className="text-gold font-black text-sm">+{mainMission.dpReward || 60} DP</span>
                </div>

                {/* Semantic Category Skills */}
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="font-bold text-primary-muted uppercase">Improves:</span>
                  {['Programming', 'System Architecture', 'Knowledge', 'Focus'].map(sk => (
                    <span key={sk} className={`px-2.5 py-1 rounded-lg border font-extrabold ${getCategoryBadgeStyle(sk)}`}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <button
                disabled={mainMission.completed}
                onClick={handleExecuteMainMission}
                className={`w-full py-4 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  mainMission.completed ? 'bg-gray-500 cursor-not-allowed' : 'gold-gradient hover:scale-[1.01]'
                }`}
              >
                <span className="material-symbols-outlined">check_circle</span>
                {mainMission.completed ? 'Directive Completed ✓' : 'Complete Main Mission (+XP & +DP) →'}
              </button>
            </div>
          )}

          {/* SECTION 3: WHY SHOULD I DO IT? — System Telemetry & Tactical Analysis */}
          <div className="apple-card p-6 md:p-8 flex flex-col gap-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gold text-xl">psychology</span>
                <h3 className="text-lg font-black text-primary tracking-tight uppercase">System Telemetry & Analysis</h3>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-surface-subtle text-gold border border-border-subtle uppercase">
                Operating System Directive
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-primary-muted uppercase">Current Priority</span>
                <h4 className="font-black text-primary">Execute Main Directive</h4>
                <p className="text-[11px] text-gold font-bold mt-1">High Impact Strategy</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-1 md:col-span-2">
                <span className="text-[10px] font-extrabold text-primary-muted uppercase">System Telemetry Reason</span>
                <p className="font-semibold text-primary leading-relaxed">
                  "Knowledge & Focus growth today is <strong>2.4× higher</strong> than any other available directive. Completing this protocol unlocks higher tier career nodes."
                </p>
              </div>
            </div>
          </div>

          {/* Side Missions Queue */}
          <div className="apple-card p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <h3 className="text-base font-black text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-gold">task</span>
                Side Directives Queue ({sideMissions.length})
              </h3>
              <button onClick={() => setActiveTab('missions')} className="text-xs font-bold text-gold hover:underline">
                View All Directives →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {sideMissions.map(m => (
                <div key={m.id} className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-surface-elevated text-primary border border-border-subtle">
                        {m.difficulty}
                      </span>
                      <span className="text-sm font-extrabold text-primary">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-primary-muted font-bold">
                      <span>+{m.xpReward} XP</span>
                      <span className="text-gold">+{m.dpReward} DP</span>
                      <span>⏱ {m.estimatedDuration}</span>
                    </div>
                  </div>

                  <button
                    disabled={m.completed}
                    onClick={() => completeMission(m.id)}
                    className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-colors ${
                      m.completed
                        ? 'bg-gray-500 text-white cursor-not-allowed'
                        : 'bg-surface-elevated text-primary border border-border-subtle hover:border-gold/40'
                    }`}
                  >
                    {m.completed ? 'Done ✓' : 'Execute Directive'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WHAT DO I GET? & HOW MUCH STRONGER AM I? (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* SECTION 4: WHAT DO I GET? — Target Reward Goal Progress */}
          <div className="apple-card p-6 flex flex-col gap-5 shadow-sm border-t-4 border-t-gold">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div>
                <span className="text-[10px] font-black text-gold uppercase tracking-wider">Reward Goal Target</span>
                <h3 className="text-lg font-black text-primary tracking-tight mt-0.5">{targetReward.name}</h3>
              </div>
              <span className="material-symbols-outlined text-gold text-2xl">local_cafe</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-primary-muted">DP Progress</span>
                <span className="text-primary">{currentDP} / {targetReward.costDP} DP</span>
              </div>
              <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden border border-border-subtle">
                <div className="gold-gradient h-full rounded-full transition-all duration-500 progress-glow" style={{ width: `${rewardProgressPct}%` }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between text-xs font-bold">
              <span className="text-primary-muted">Need:</span>
              <span className="text-gold font-black">{dpNeeded > 0 ? `${dpNeeded} DP Remaining` : 'Goal Unlocked!'}</span>
              <span className="text-primary font-bold">({missionsRemaining} Directives)</span>
            </div>

            <button
              onClick={() => setActiveTab('shop')}
              className="w-full py-3 rounded-2xl bg-surface-subtle hover:bg-surface-elevated text-primary font-extrabold text-xs border border-border-subtle hover:border-gold/40 transition-colors shadow-2xs"
            >
              Open Reward Shop Inventory →
            </button>
          </div>

          {/* Today's Goal Completion Rate Card */}
          <div className="apple-card p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-primary-muted uppercase tracking-wider">Today's Directive Completion</span>
                <h4 className="text-lg font-black text-primary mt-0.5">{completedMissionsCount} of {safeMissions.length} Executed</h4>
              </div>
              <span className="text-3xl font-black text-gold font-mono">{todayProgressPct}%</span>
            </div>
            <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-border-subtle">
              <div className="gold-gradient h-full rounded-full transition-all duration-500" style={{ width: `${todayProgressPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
