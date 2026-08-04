import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';

export function CommandCenter() {
  const { character, currentUser, missions, rewards, completeMission, redeemReward, setActiveTab } = useSystem();
  const [incomingDuels, setIncomingDuels] = useState([]);

  const mainMission = missions.find(m => m.isMainMission) || missions[0];
  const sideMissions = missions.filter(m => !m.isMainMission);
  const completedMissionsCount = missions.filter(m => m.completed).length;
  const todayProgressPct = Math.round((completedMissionsCount / (missions.length || 1)) * 100);

  // Next reward to unlock
  const nextReward = rewards.find(r => !r.redeemed) || rewards[0];
  const dpProgressPct = nextReward ? Math.min(100, Math.round((character.dp / nextReward.costDP) * 100)) : 100;

  // Poll for incoming live duel challenges
  useEffect(() => {
    let isMounted = true;
    async function fetchMyDuels() {
      const email = currentUser?.email || '';
      const uid = currentUser?.uid || '';
      try {
        const res = await fetch(`/api/ai/my-duels?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(uid)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            const pending = json.data.filter(d => d.status === 'pending');
            setIncomingDuels(pending);
          }
        }
      } catch (err) {
        console.warn('[My Duels Fetch Warning]:', err.message);
      }
    }

    fetchMyDuels();
    const interval = setInterval(fetchMyDuels, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser, character]);

  const handleRespondDuel = async (duelId, action) => {
    try {
      await fetch('/api/ai/respond-duel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duelId, action })
      });
      setIncomingDuels(prev => prev.filter(d => d.id !== duelId));
      if (action === 'accept') {
        setActiveTab('hunters');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner: Character Status Overview */}
      <section className="apple-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
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

        {/* DP Balance Banner -> Opens Reward Shop */}
        <div
          onClick={() => setActiveTab('shop')}
          className="bg-gold-light/60 p-5 rounded-3xl border border-gold/30 flex items-center gap-6 w-full md:w-auto justify-between cursor-pointer hover:bg-gold-light transition-colors shadow-sm"
          title="Open Reward Shop"
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Reward Shop Balance</span>
            <span className="text-2xl font-black text-primary flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-gold text-2xl">stars</span>
              {character.dp.toLocaleString()} DP
            </span>
          </div>
          <button className="px-5 py-2.5 rounded-2xl text-xs font-extrabold gold-gradient text-white shadow-md hover:scale-105 transition-transform flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            Visit Shop
          </button>
        </div>
      </section>

      {/* Incoming Live Duel Challenges Banner on CommandCenter */}
      {incomingDuels.length > 0 && (
        <section className="apple-card p-6 border-2 border-gold/60 bg-gold-light/60 flex flex-col gap-4 shadow-md animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gold animate-ping"></span>
              <h3 className="text-base font-black text-primary uppercase tracking-wider">
                ⚔️ Incoming Live Duel Challenge Received! ({incomingDuels.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('hunters')}
              className="text-xs font-extrabold text-gold hover:underline"
            >
              Open Hunters Arena →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingDuels.map(d => (
              <div key={d.id} className="p-4 rounded-2xl bg-white border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase">
                      {d.duration || '24h'} {d.category || 'Discipline'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-primary mt-1">
                    Challenged by <strong className="text-gold">{d.challengerName || 'A Hunter'}</strong>
                  </h4>
                  <p className="text-xs text-primary-muted font-medium mt-0.5">
                    Category: {d.category || 'General Discipline'} • Duration: {d.duration || '24 Hours'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespondDuel(d.id, 'accept')}
                    className="px-4 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
                  >
                    Accept Challenge ⚔️
                  </button>
                  <button
                    onClick={() => handleRespondDuel(d.id, 'decline')}
                    className="px-3.5 py-2.5 rounded-xl bg-surface-subtle text-primary-muted font-bold text-xs border border-border-subtle hover:text-primary"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Columns - Main Directives & Progress) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Today's Goal Progress Bar */}
          <section className="apple-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-primary-muted uppercase tracking-wider">Today's Goal Progress</span>
                <h3 className="text-xl font-bold text-primary">{completedMissionsCount} of {missions.length} Missions Completed</h3>
              </div>
              <span className="text-3xl font-black text-primary">{todayProgressPct}%</span>
            </div>

            <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden border border-border-subtle">
              <div
                className="gold-gradient h-full rounded-full transition-all duration-500"
                style={{ width: `${todayProgressPct}%` }}
              ></div>
            </div>
          </section>

          {/* S-Rank Daily Main Directive */}
          {mainMission && (
            <section className="apple-card p-6 md:p-8 flex flex-col gap-4 border-2 border-gold/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded gold-gradient text-white uppercase tracking-wider">
                    {mainMission.difficulty || 'S-Rank Directive'}
                  </span>
                  <span className="text-xs font-bold text-gold">MAIN FOCUS DIRECTIVE</span>
                </div>
                <span className="text-xs font-bold text-primary-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-gold">timer</span>
                  {mainMission.estimatedDuration || '60 Mins'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-primary tracking-tight">{mainMission.name}</h3>
                <p className="text-xs text-primary-muted font-medium mt-1">
                  Attributes Improved: {mainMission.attributesImproved?.join(' • ') || 'Knowledge +12, Focus +10'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border-subtle mt-2">
                <div className="flex items-center gap-4 text-xs font-black text-primary">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-gold text-base">bolt</span>
                    +{mainMission.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1 text-gold">
                    <span className="material-symbols-outlined text-base">stars</span>
                    +{mainMission.dpReward} DP
                  </span>
                </div>

                {mainMission.completed ? (
                  <span className="px-5 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center gap-1 border border-emerald-200">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Directive Completed
                  </span>
                ) : (
                  <button
                    onClick={() => completeMission(mainMission.id)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">task_alt</span>
                    Execute Main Directive
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Secondary Directives List */}
          <section className="apple-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-gold">list_alt</span>
                Secondary Directives ({sideMissions.length})
              </h3>
              <button onClick={() => setActiveTab('missions')} className="text-xs font-bold text-gold hover:underline">
                View All Missions →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {sideMissions.map(m => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    m.completed ? 'bg-surface-subtle/50 border-border-subtle opacity-75' : 'bg-surface-subtle border-border-subtle hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${m.completed ? 'bg-emerald-500' : 'bg-gold'}`}></div>
                    <div>
                      <h4 className={`font-extrabold text-sm ${m.completed ? 'line-through text-primary-muted' : 'text-primary'}`}>
                        {m.name}
                      </h4>
                      <span className="text-[10px] text-primary-muted font-bold">
                        {m.difficulty} • +{m.xpReward} XP • +{m.dpReward} DP
                      </span>
                    </div>
                  </div>

                  {m.completed ? (
                    <span className="text-emerald-600 font-extrabold text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check</span>
                      Done
                    </span>
                  ) : (
                    <button
                      onClick={() => completeMission(m.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-white text-primary font-extrabold text-xs border border-border-subtle hover:bg-gold-light/40 hover:border-gold/40 transition-colors shadow-2xs"
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4 Columns - Next Reward Unlock & Quick Stats) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Next Reward Progress Card */}
          {nextReward && (
            <section className="apple-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Next Target Reward</span>
                <span className="text-xs font-black text-primary">{dpProgressPct}%</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gold-light/60 border border-gold/30 text-gold flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">{nextReward.icon || 'card_giftcard'}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-primary">{nextReward.name}</h4>
                  <p className="text-xs text-primary-muted font-bold mt-0.5">{nextReward.costDP} DP Required</p>
                </div>
              </div>

              <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden border border-border-subtle">
                <div className="gold-gradient h-full rounded-full transition-all duration-500" style={{ width: `${dpProgressPct}%` }}></div>
              </div>

              <button
                onClick={() => setActiveTab('shop')}
                className="w-full py-3 rounded-2xl bg-surface-subtle hover:bg-white text-primary font-extrabold text-xs border border-border-subtle transition-colors shadow-2xs mt-1"
              >
                View Reward Shop Inventory
              </button>
            </section>
          )}

          {/* Quick Stats Grid */}
          <section className="apple-card p-6 flex flex-col gap-4">
            <h3 className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">insights</span>
              Character Telemetry
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
                <span className="text-[10px] font-bold text-primary-muted uppercase">Level</span>
                <span className="text-xl font-black text-primary">Lvl {character.level}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
                <span className="text-[10px] font-bold text-primary-muted uppercase">Rank</span>
                <span className="text-xs font-black text-gold truncate mt-1">{character.rank}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
                <span className="text-[10px] font-bold text-primary-muted uppercase">Career</span>
                <span className="text-xs font-black text-primary truncate mt-1">{character.primaryCareer}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
                <span className="text-[10px] font-bold text-primary-muted uppercase">Archetype</span>
                <span className="text-xs font-black text-primary truncate mt-1">{character.archetype}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
