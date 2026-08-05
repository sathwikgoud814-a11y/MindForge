import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSystem } from '../../context/SystemContext';

export function GrowthReportView() {
  const { character, careerTrees, customSkills, attributes, dailyXpHistory } = useSystem();

  const safeChar = character || {};
  const safeAttrs = attributes || {};

  const activeTree = (careerTrees?.[safeChar.primaryCareer] || careerTrees?.['UI/UX Designer'] || careerTrees?.['UI Designer'])?.tree || { core: [], related: [], advanced: [] };
  const allCareerSkills = [...(activeTree.core || []), ...(activeTree.related || []), ...(activeTree.advanced || [])];
  const allSkills = [...allCareerSkills, ...(customSkills || [])];

  const xp = safeChar.xp || 0;
  const level = safeChar.level || 0;
  const missionsCount = safeChar.completedMissionsCount || 0;
  const streak = safeChar.streakDays || 1;
  const career = safeChar.primaryCareer || 'UI/UX Designer';
  const destiny = safeChar.destinyIdentity || 'Build SaaS Startup';
  const archetype = safeChar.archetype || 'Creative Builder';
  const rank = safeChar.rank || 'Recruit Rank';
  const strongest = safeChar.strongestTraits && safeChar.strongestTraits.length > 0 ? safeChar.strongestTraits : ['Creativity', 'Curiosity'];
  const weakest = safeChar.weakestTraits && safeChar.weakestTraits.length > 0 ? safeChar.weakestTraits : ['Consistency', 'Focus'];

  // Tailored System Primary Evaluation String
  const getPrimaryEvaluation = () => {
    if (missionsCount >= 15 || level >= 5) {
      return `"System throughput peak. ${safeChar.name || 'Hunter'} is advancing rapidly as a ${career}."`;
    }
    if (missionsCount >= 5 || level >= 2) {
      return `"Momentum building. Trajectory firmly aligned toward '${destiny}'."`;
    }
    return `"Awakening phase in progress. Execute primary directives to trigger initial power spike."`;
  };

  // Dynamic Trajectory Grade Calculation
  const getTrajectoryGrade = () => {
    if (missionsCount >= 20 && streak >= 7) return { grade: 'S-RANK', label: 'Overcoming Baseline', color: 'text-amber-500 bg-amber-50 border-amber-200' };
    if (missionsCount >= 10 || level >= 3) return { grade: 'A-RANK', label: 'High Velocity', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (missionsCount >= 3 || level >= 1) return { grade: 'B-RANK', label: 'Steady Growth', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    return { grade: 'RECRUIT', label: 'Baseline Initialization', color: 'text-gold bg-gold-light/60 border-gold/40' };
  };

  // Highest Leverage Action tailored to character career and weaknesses
  const getHighestLeverageAction = () => {
    const mainWeakness = weakest[0] || 'Focus';
    return `Deploy 2 consecutive 45-minute ${career} directives focused on ${mainWeakness} to unlock your next skill level.`;
  };

  const trajectoryGrade = getTrajectoryGrade();

  const xpTrendData = dailyXpHistory && dailyXpHistory.length > 0 ? dailyXpHistory : [
    { day: 'Mon', xp: Math.round(xp * 0.15) },
    { day: 'Tue', xp: Math.round(xp * 0.3) },
    { day: 'Wed', xp: Math.round(xp * 0.45) },
    { day: 'Thu', xp: Math.round(xp * 0.6) },
    { day: 'Fri', xp: Math.round(xp * 0.75) },
    { day: 'Sat', xp: Math.round(xp * 0.9) },
    { day: 'Sun', xp },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="apple-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full gold-gradient text-white uppercase tracking-wider">
            Character Telemetry
          </span>
          <h1 className="text-3xl font-black text-primary tracking-tight mt-2">Growth Report</h1>
          <p className="text-xs text-primary-muted font-medium mt-1">Clear metrics evaluating your personal transformation.</p>
        </div>

        <div className="bg-gold-light/60 px-5 py-3 rounded-2xl border border-gold/30 text-center shadow-sm">
          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Primary System Evaluation</span>
          <h3 className="text-base font-black text-primary">{getPrimaryEvaluation()}</h3>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
          <span className="text-[10px] font-bold text-primary-muted uppercase">Total XP</span>
          <h3 className="text-2xl font-black text-primary">{safeChar.xp || 0} XP</h3>
        </div>
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
          <span className="text-[10px] font-bold text-gold uppercase">Discipline Points</span>
          <h3 className="text-2xl font-black text-gold">{safeChar.dp || 0} DP</h3>
        </div>
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
          <span className="text-[10px] font-bold text-primary-muted uppercase">Hours Invested</span>
          <h3 className="text-2xl font-black text-primary">{safeChar.hoursInvested || 0}h</h3>
        </div>
        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
          <span className="text-[10px] font-bold text-primary-muted uppercase">Completed Directives</span>
          <h3 className="text-2xl font-black text-emerald-600">{safeChar.completedMissionsCount || 0}</h3>
        </div>
      </div>

      {/* Tailored AI System Telemetry Diagnostics Card */}
      <div className="apple-card p-6 border-2 border-gold/40 bg-gold-light/20 flex flex-col gap-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">analytics</span>
              <h3 className="text-base font-black text-primary uppercase tracking-wider">
                Tailored AI System Telemetry & Diagnostics
              </h3>
            </div>
            <p className="text-xs text-primary-muted mt-0.5">Real-time dynamic analysis based on your active career, destiny goals, and attribute stats.</p>
          </div>

          <div className={`px-4 py-2 rounded-2xl border font-black text-xs flex items-center gap-2 ${trajectoryGrade.color}`}>
            <span className="material-symbols-outlined text-base">verified</span>
            <span>{trajectoryGrade.grade} • {trajectoryGrade.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle flex flex-col gap-1.5">
            <span className="font-extrabold text-primary-muted uppercase text-[10px]">Archetype & Rank</span>
            <h4 className="font-black text-sm text-primary">{archetype}</h4>
            <span className="text-[11px] font-bold text-gold">{rank} (Level {level})</span>
            <span className="text-[10px] text-primary-muted mt-1 font-medium">Specialization: {career}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle flex flex-col gap-1.5">
            <span className="font-extrabold text-primary-muted uppercase text-[10px]">Active Trajectory Strengths</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {strongest.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                  ✓ {t}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-primary-muted mt-1 font-medium">Destiny Target: {destiny}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle flex flex-col gap-1.5">
            <span className="font-extrabold text-gold uppercase text-[10px]">Highest Leverage Action</span>
            <p className="text-xs font-bold text-primary leading-relaxed">{getHighestLeverageAction()}</p>
            <span className="text-[10px] text-primary-muted font-medium mt-1">Growth Area Focus: {weakest.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* XP Velocity Chart */}
      <div className="apple-card p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">show_chart</span>
            XP Velocity & Progression Trend
          </h3>
          <span className="text-xs font-bold text-primary-muted">7-Day Trajectory</span>
        </div>

        <div className="w-full h-64 min-h-[256px] pt-4">
          <ResponsiveContainer width="100%" height={240} minHeight={240}>
            <AreaChart data={xpTrendData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111827', color: '#F8FAFC' }} />
              <Area type="monotone" dataKey="xp" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#goldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill & Attribute Growth Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Levels */}
        <div className="apple-card p-6 flex flex-col gap-4 shadow-sm">
          <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">psychology</span>
            Skill Level Up Progress ({allSkills.length})
          </h3>

          <div className="flex flex-col gap-3.5 max-h-80 overflow-y-auto pr-1">
            {allSkills.map((sk, idx) => (
              <div key={sk.id || idx} className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between font-extrabold">
                  <span className="text-primary">{sk.name}</span>
                  <span className="text-gold font-bold">Lvl {sk.level || 1} ({sk.xp || 0}/{sk.xpToNext || 100} XP)</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className="gold-gradient h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round(((sk.xp || 0) / (sk.xpToNext || 100)) * 100))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automatic Attributes Growth */}
        <div className="apple-card p-6 flex flex-col gap-4 shadow-sm">
          <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">stars</span>
            Automatic Attribute Mastery
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(safeAttrs).map(([attrKey, valObj]) => (
              <div key={attrKey} className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
                <span className="text-xs font-extrabold text-primary capitalize">{attrKey}</span>
                <span className="text-xs font-black text-gold">Lvl {valObj?.level ?? 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
