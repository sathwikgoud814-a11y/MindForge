import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { ProgressBar } from '../../shared/components/ProgressBar';

export function CommandCenter() {
  const { character, missions, rewards, completeMission, setActiveTab } = useSystem();

  const safeMissions = missions || [];
  const safeRewards = rewards || [];

  const mainMission = safeMissions.find(m => m.isMainMission) || safeMissions[0];
  const sideMissions = safeMissions.filter(m => !m.isMainMission);
  const completedMissionsCount = safeMissions.filter(m => m.completed).length;
  const todayProgressPct = safeMissions.length > 0 ? Math.round((completedMissionsCount / safeMissions.length) * 100) : 0;

  const nextReward = safeRewards.find(r => !r.redeemed) || safeRewards[0];
  const dpProgressPct = nextReward ? Math.min(100, Math.round((character.dp / nextReward.costDP) * 100)) : 100;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="w-24 h-24 rounded-3xl gold-gradient p-1 flex-shrink-0 shadow-md">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center font-black text-3xl text-primary">
              {character.level}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold px-3 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
                {character.rank}
              </span>
              <span className="text-xs font-semibold text-primary-muted">{character.archetype}</span>
            </div>
            <h2 className="text-3xl font-black text-primary tracking-tight">Good Morning, {character.name}.</h2>
            <p className="text-sm text-primary-muted mt-0.5">"What should I do next to become stronger?"</p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('shop')}
          className="bg-gold-light/60 p-5 rounded-3xl border border-gold/30 flex items-center gap-6 w-full md:w-auto justify-between cursor-pointer hover:bg-gold-light transition-colors shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Reward Shop Balance</span>
            <span className="text-2xl font-black text-primary flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-gold text-2xl">stars</span>
              {character.dp.toLocaleString()} DP
            </span>
          </div>
          <Button onClick={() => setActiveTab('shop')} icon="shopping_bag">
            Visit Shop
          </Button>
        </div>
      </Card>

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary-muted uppercase tracking-wider">Today's Goal Progress</span>
                <h3 className="text-xl font-bold text-primary">{completedMissionsCount} of {safeMissions.length} Missions Completed</h3>
              </div>
              <span className="text-3xl font-black text-primary">{todayProgressPct}%</span>
            </div>
            <ProgressBar progressPct={todayProgressPct} height="h-4" />
          </Card>

          {/* Today's Main Mission */}
          {mainMission && (
            <Card className="p-6 md:p-8 flex flex-col gap-5 border-l-4 border-l-gold shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-md bg-gold text-white uppercase">
                    {mainMission.difficulty}
                  </span>
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">Today's Main Mission Focus</span>
                </div>
                <span className="text-xs font-semibold text-primary-muted">⏱ {mainMission.estimatedDuration}</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-primary">{mainMission.name}</h3>
                <div className="flex items-center gap-6 mt-3 text-xs font-semibold text-primary-muted">
                  <span className="text-primary font-bold text-sm">+{mainMission.xpReward} XP</span>
                  <span className="text-gold font-bold text-sm">+{mainMission.dpReward} DP</span>
                  <span>Attribute Growth: {mainMission.attributesImproved.join(', ')}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  disabled={mainMission.completed}
                  onClick={() => completeMission(mainMission.id)}
                  variant={mainMission.completed ? 'emerald' : 'gold'}
                  size="lg"
                  className="w-full"
                  icon="check_circle"
                >
                  {mainMission.completed ? 'Mission Accomplished ✓' : 'Complete Main Mission (+XP & DP)'}
                </Button>
              </div>
            </Card>
          )}

          {/* Side Missions List */}
          <Card className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-gold">task</span>
                Side Missions ({sideMissions.length})
              </h3>
              <button
                onClick={() => setActiveTab('missions')}
                className="text-xs font-bold text-gold hover:underline"
              >
                View All Missions →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {sideMissions.map(m => (
                <div key={m.id} className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-primary border border-border-subtle">
                        {m.difficulty}
                      </span>
                      <span className="text-sm font-extrabold text-primary">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-primary-muted">
                      <span>+{m.xpReward} XP</span>
                      <span className="text-gold font-bold">+{m.dpReward} DP</span>
                      <span>⏱ {m.estimatedDuration}</span>
                    </div>
                  </div>

                  <Button
                    disabled={m.completed}
                    onClick={() => completeMission(m.id)}
                    variant={m.completed ? 'emerald' : 'primary'}
                    size="sm"
                  >
                    {m.completed ? 'Done ✓' : 'Execute'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-gold-light/60 p-6 rounded-3xl border border-gold/30 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider">System AI Assistant</h4>
                <span className="text-[10px] font-bold text-gold">Optimal Strategy</span>
              </div>
            </div>
            <p className="text-xs text-primary leading-relaxed font-medium">
              "Completing today's Main Mission <strong>({mainMission?.name})</strong> will award +{mainMission?.dpReward} DP and +{mainMission?.xpReward} XP."
            </p>
          </section>

          {nextReward && (
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-primary-muted uppercase tracking-wider">Earned Comfort Reward</span>
                  <h3 className="text-base font-extrabold text-primary mt-0.5">{nextReward.name}</h3>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-gold-light text-gold border border-gold/30">
                  {character.dp} / {nextReward.costDP} DP
                </span>
              </div>

              <ProgressBar progressPct={dpProgressPct} />

              <div className="flex flex-col gap-3 pt-1">
                <Button onClick={() => setActiveTab('shop')} icon="shopping_bag" className="w-full">
                  Open Reward Shop
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
