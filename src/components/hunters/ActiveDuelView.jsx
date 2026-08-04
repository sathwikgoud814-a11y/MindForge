import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';

export function getDuelCategoryPredefinedMissions(category = 'All Missions') {
  switch (category) {
    case 'Deep Work':
      return [
        { id: 'dm_dw_1', name: 'Execute 90-Minute Uninterrupted Deep Work Block', xpReward: 150, dpReward: 75, difficulty: 'S-Rank', completed: false },
        { id: 'dm_dw_2', name: '45-Minute Batch Task Execution & Zero Distractions', xpReward: 100, dpReward: 50, difficulty: 'A-Rank', completed: false },
        { id: 'dm_dw_3', name: '30-Minute Daily Focus Reflection & Task Planning', xpReward: 75, dpReward: 35, difficulty: 'B-Rank', completed: false },
      ];
    case 'Programming':
      return [
        { id: 'dm_prog_1', name: 'Architect & Implement Core Feature Component MVP', xpReward: 160, dpReward: 80, difficulty: 'S-Rank', completed: false },
        { id: 'dm_prog_2', name: 'Execute Code Optimization & Refactoring Session', xpReward: 110, dpReward: 55, difficulty: 'A-Rank', completed: false },
        { id: 'dm_prog_3', name: 'Debug & Pass All System Integration Tests', xpReward: 90, dpReward: 45, difficulty: 'B-Rank', completed: false },
      ];
    case 'Study':
      return [
        { id: 'dm_st_1', name: 'Complete 60-Minute Intensive Academic / Exam Study', xpReward: 140, dpReward: 70, difficulty: 'S-Rank', completed: false },
        { id: 'dm_st_2', name: 'Synthesize & Review Key Concept Flashcards', xpReward: 95, dpReward: 45, difficulty: 'A-Rank', completed: false },
        { id: 'dm_st_3', name: 'Annotate & Summarize Technical Documentation', xpReward: 80, dpReward: 40, difficulty: 'B-Rank', completed: false },
      ];
    case 'Fitness':
      return [
        { id: 'dm_fit_1', name: 'Complete 60-Minute Heavy Strength & Conditioning', xpReward: 150, dpReward: 75, difficulty: 'S-Rank', completed: false },
        { id: 'dm_fit_2', name: '30-Minute High-Intensity Interval Cardio Workout', xpReward: 100, dpReward: 50, difficulty: 'A-Rank', completed: false },
        { id: 'dm_fit_3', name: '10,000 Step Daily Movement & Active Mobility', xpReward: 80, dpReward: 40, difficulty: 'B-Rank', completed: false },
      ];
    case 'Reading':
      return [
        { id: 'dm_rd_1', name: 'Read 30 Pages of High-Impact Non-Fiction Book', xpReward: 120, dpReward: 60, difficulty: 'A-Rank', completed: false },
        { id: 'dm_rd_2', name: 'Write Chapter Summary & Actionable Key Takeaways', xpReward: 90, dpReward: 45, difficulty: 'B-Rank', completed: false },
      ];
    default: // All Missions
      return [
        { id: 'dm_all_1', name: 'Execute S-Rank Primary Focus Directive', xpReward: 150, dpReward: 75, difficulty: 'S-Rank', completed: false },
        { id: 'dm_all_2', name: 'Execute 45-Minute Deep Focus Work Session', xpReward: 100, dpReward: 50, difficulty: 'A-Rank', completed: false },
        { id: 'dm_all_3', name: 'Complete Daily Skill & Health Conditioning Directive', xpReward: 80, dpReward: 40, difficulty: 'B-Rank', completed: false },
      ];
  }
}

export function ActiveDuelView() {
  const { viewingDuel, setViewingDuel, character, endDuel, setActiveDuels, missions, completeMission } = useSystem();
  const [taskNote, setTaskNote] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  // Custom Duel Mission Creation Modal State
  const [showCreateDuelMissionModal, setShowCreateDuelMissionModal] = useState(false);
  const [customMissionTitle, setCustomMissionTitle] = useState('');
  const [customMissionDifficulty, setCustomMissionDifficulty] = useState('S-Rank');

  const [now, setNow] = useState(new Date());

  // Real-world live countdown timer ticking every 1000ms
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!viewingDuel) return null;

  const d = viewingDuel;

  // Active check: Duel Arena controls & missions are ONLY active when accepted by both players (status === 'active')
  const isAccepted = d.status === 'active';
  if (!isAccepted) return null;

  const categoryMissions = d.duelMissions && d.duelMissions.length > 0
    ? d.duelMissions
    : getDuelCategoryPredefinedMissions(d.category);

  const userPts = d.userScore || 0;
  const oppPts = d.opponentScore || 0;
  const userPct = Math.min(100, Math.round((userPts / (userPts + oppPts || 1)) * 100));
  const oppPct = 100 - userPct;

  const createdMs = d.createdAt ? new Date(d.createdAt).getTime() : Date.now();

  const getRemainingTimeFormatted = () => {
    let durationMs = 24 * 3600 * 1000; // default 24h
    if (d.duration === '3 Days' || d.duration === '3d') durationMs = 3 * 24 * 3600 * 1000;
    if (d.duration === '7 Days' || d.duration === '7d') durationMs = 7 * 24 * 3600 * 1000;

    const endMs = createdMs + durationMs;
    const diffMs = endMs - now.getTime();

    if (diffMs <= 0) return '00h 00m 00s (Duel Concluded)';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (days > 0) {
      return `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
    }
    return `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
  };

  const handleExecuteDuelMission = (missionId, missionName) => {
    const updatedUserScore = userPts + 100;
    const updatedMissionsCount = (d.userMissions || 0) + 1;
    const newLeader = updatedUserScore >= oppPts ? character.name : d.opponent.name;

    const updatedMissionsList = categoryMissions.map(m =>
      m.id === missionId ? { ...m, completed: true } : m
    );

    const newFeedItem = {
      id: 'lf_' + Date.now(),
      hunterName: character.name,
      text: `Executed ${d.category} duel mission "${missionName}" (+100 PTS)`,
      time: 'Just now',
    };

    const updatedDuel = {
      ...d,
      userScore: updatedUserScore,
      userMissions: updatedMissionsCount,
      currentLeader: newLeader,
      duelMissions: updatedMissionsList,
      liveFeed: [newFeedItem, ...(d.liveFeed || [])],
    };

    setViewingDuel(updatedDuel);
    setActiveDuels(prev => (prev || []).map(item => item.id === d.id ? updatedDuel : item));

    // Persist score update to Firestore backend
    fetch('/api/ai/update-duel-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duelId: d.id,
        userScore: updatedUserScore,
        userMissions: updatedMissionsCount,
        currentLeader: newLeader,
        duelMissions: updatedMissionsList,
        liveFeed: [newFeedItem, ...(d.liveFeed || [])],
      })
    }).catch(err => console.warn('[Update Duel Score Error]:', err));

    // Also complete matching main system mission if available
    const mainM = (missions || []).find(m => m.name.toLowerCase().includes(missionName.toLowerCase()));
    if (mainM && !mainM.completed) {
      completeMission(mainM.id);
    }
  };

  const handleAddCustomDuelMission = (e) => {
    e.preventDefault();
    if (!customMissionTitle.trim()) return;

    const newCustom = {
      id: 'dm_cust_' + Date.now(),
      name: customMissionTitle,
      difficulty: customMissionDifficulty,
      xpReward: customMissionDifficulty === 'S-Rank' ? 150 : 100,
      dpReward: customMissionDifficulty === 'S-Rank' ? 75 : 50,
      completed: false,
    };

    const updatedMissionsList = [...categoryMissions, newCustom];
    const updatedDuel = {
      ...d,
      duelMissions: updatedMissionsList,
    };

    setViewingDuel(updatedDuel);
    setActiveDuels(prev => (prev || []).map(item => item.id === d.id ? updatedDuel : item));
    setCustomMissionTitle('');
    setShowCreateDuelMissionModal(false);
  };

  const handleLogTask = (pts, text) => {
    const updatedUserScore = userPts + pts;
    const updatedMissions = d.userMissions + 1;
    const newLeader = updatedUserScore >= oppPts ? character.name : d.opponent.name;

    const newFeedItem = {
      id: 'lf_' + Date.now(),
      hunterName: character.name,
      text: `${text || 'Completed directive'} (+${pts} PTS)`,
      time: 'Just now',
    };

    const updatedDuel = {
      ...d,
      userScore: updatedUserScore,
      userMissions: updatedMissions,
      currentLeader: newLeader,
      liveFeed: [newFeedItem, ...(d.liveFeed || [])],
    };

    setViewingDuel(updatedDuel);
    setActiveDuels(prev => (prev || []).map(item => item.id === d.id ? updatedDuel : item));
    setTaskNote('');
    setShowLogModal(false);
  };

  const handleLogFocusHour = () => {
    const updatedUserScore = userPts + 50;
    const updatedFocusHours = (d.userFocusHours || 0) + 1;
    const newLeader = updatedUserScore >= oppPts ? character.name : d.opponent.name;

    const newFeedItem = {
      id: 'lf_' + Date.now(),
      hunterName: character.name,
      text: `Logged 1-Hour Focus Work Session (+50 PTS)`,
      time: 'Just now',
    };

    const updatedDuel = {
      ...d,
      userScore: updatedUserScore,
      userFocusHours: updatedFocusHours,
      currentLeader: newLeader,
      liveFeed: [newFeedItem, ...(d.liveFeed || [])],
    };

    setViewingDuel(updatedDuel);
    setActiveDuels(prev => (prev || []).map(item => item.id === d.id ? updatedDuel : item));
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="apple-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              {d.category} Arena
            </span>
            <span className="text-xs font-bold text-gold font-mono">⏱ Live Countdown: {getRemainingTimeFormatted()}</span>
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Active Duel Arena</h1>
        </div>

        <button
          onClick={() => setViewingDuel(null)}
          className="px-4 py-2.5 rounded-xl bg-surface-subtle text-primary font-bold text-xs border border-border-subtle hover:bg-surface"
        >
          ← Back to Hunters Network
        </button>
      </div>

      {/* Side-by-Side Score Card */}
      <div className="apple-card p-8 flex flex-col gap-6 shadow-md border-t-4 border-t-gold">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gold-gradient p-0.5 shadow-sm">
              <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center font-black text-xl text-primary">
                S
              </div>
            </div>
            <div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded gold-gradient text-white uppercase">YOU</span>
              <h3 className="font-extrabold text-lg text-primary mt-0.5">{character.name}</h3>
              <span className="text-2xl font-black text-primary">{userPts} PTS</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-gold uppercase tracking-widest">VS</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
              Leader: {d.currentLeader}
            </span>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-primary text-white uppercase">{d.opponent?.rank || 'Recruit'}</span>
              <h3 className="font-extrabold text-lg text-primary mt-0.5">{d.opponent?.name || 'Opponent'}</h3>
              <span className="text-2xl font-black text-primary">{oppPts} PTS</span>
            </div>
            <img src={d.opponent?.avatar} alt={d.opponent?.name} className="w-14 h-14 rounded-2xl object-cover border border-border-subtle shadow-sm" />
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-extrabold">
            <span className="text-gold">{userPct}% Share</span>
            <span className="text-primary-muted">{oppPct}% Share</span>
          </div>
          <div className="w-full bg-surface-subtle h-4 rounded-full overflow-hidden border border-border-subtle p-0.5 flex">
            <div className="gold-gradient h-full rounded-l-full transition-all duration-700" style={{ width: `${userPct}%` }}></div>
            <div className="bg-primary h-full rounded-r-full transition-all duration-700" style={{ width: `${oppPct}%` }}></div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center pt-2">
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Completed Missions</span>
            <h4 className="text-base font-black text-primary">{d.userMissions} vs {d.opponentMissions || 0}</h4>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Focus Hours</span>
            <h4 className="text-base font-black text-primary">{d.userFocusHours}h vs {d.opponentFocusHours || 0}h</h4>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Category</span>
            <h4 className="text-base font-black text-gold">{d.category || 'General'}</h4>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted uppercase font-mono">Live Countdown</span>
            <h4 className="text-sm font-black text-gold font-mono tracking-tight">{getRemainingTimeFormatted()}</h4>
          </div>
        </div>
      </div>

      {/* Category-Specific Duel Missions Section (Active after Mutual Acceptance) */}
      <section className="apple-card p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded gold-gradient text-white uppercase tracking-wider">
                {d.category} Category Directives
              </span>
              <span className="text-xs font-bold text-emerald-600">Active (Accepted by Both Players)</span>
            </div>
            <h3 className="text-xl font-black text-primary">Pre-Defined & Custom Duel Missions</h3>
            <p className="text-xs text-primary-muted mt-0.5">Complete these category missions to score +100 PTS in the duel arena.</p>
          </div>

          <button
            onClick={() => setShowCreateDuelMissionModal(true)}
            className="px-4 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            + Add Duel Mission
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {categoryMissions.map(m => (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                m.completed ? 'bg-surface-subtle/50 border-border-subtle opacity-75' : 'bg-surface-subtle border-border-subtle hover:border-gold/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${m.completed ? 'bg-emerald-500' : 'bg-gold'}`}></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-primary text-white uppercase">{m.difficulty}</span>
                    <h4 className={`font-extrabold text-sm ${m.completed ? 'line-through text-primary-muted' : 'text-primary'}`}>
                      {m.name}
                    </h4>
                  </div>
                  <span className="text-[10px] text-primary-muted font-bold mt-0.5 block">
                    Reward: +100 Duel PTS • +{m.xpReward || 100} System XP • +{m.dpReward || 50} DP
                  </span>
                </div>
              </div>

              {m.completed ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Executed ✓
                </span>
              ) : (
                <button
                  onClick={() => handleExecuteDuelMission(m.id, m.name)}
                  className="px-5 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">task_alt</span>
                  Execute Mission (+100 PTS)
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Live Updates Feed */}
      <div className="apple-card p-6 flex flex-col gap-4">
        <h3 className="text-base font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-gold">graphic_eq</span>
          Live Duel Updates Feed
        </h3>

        <div className="flex flex-col gap-3">
          {(d.liveFeed || []).map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gold text-lg">bolt</span>
                <div>
                  <span className="font-extrabold text-primary">{item.hunterName}</span>
                  <p className="text-[11px] text-primary-muted">{item.text}</p>
                </div>
              </div>
              <span className="text-[10px] text-primary-muted font-bold">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Task Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-black text-lg text-primary">Log Custom Duel Task</h3>
              <button onClick={() => setShowLogModal(false)} className="p-1 rounded-lg text-primary-muted">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogTask(100, taskNote);
              }}
              className="flex flex-col gap-4 text-xs"
            >
              <div>
                <label className="block font-bold text-primary mb-1">Task Title / Directive Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Completed 60-Minute Architecture Review"
                  value={taskNote}
                  onChange={e => setTaskNote(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-2"
              >
                + Submit & Add +100 Duel Points
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Duel Mission Modal */}
      {showCreateDuelMissionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-black text-lg text-primary">Add Custom Duel Mission</h3>
              <button onClick={() => setShowCreateDuelMissionModal(false)} className="p-1 rounded-lg text-primary-muted">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomDuelMission} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Mission Title</label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. Build ${d.category} Feature MVP`}
                  value={customMissionTitle}
                  onChange={e => setCustomMissionTitle(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Difficulty Rank</label>
                <select
                  value={customMissionDifficulty}
                  onChange={e => setCustomMissionDifficulty(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold"
                >
                  <option value="S-Rank">S-Rank (+150 XP, +75 DP)</option>
                  <option value="A-Rank">A-Rank (+100 XP, +50 DP)</option>
                  <option value="B-Rank">B-Rank (+80 XP, +40 DP)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-2"
              >
                + Add Mission to Active Duel Arena
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
