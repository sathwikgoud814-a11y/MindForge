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

  const xpTrendData = dailyXpHistory || [
    { day: 'Mon', xp: 0 },
    { day: 'Tue', xp: 0 },
    { day: 'Wed', xp: 0 },
    { day: 'Thu', xp: 0 },
    { day: 'Fri', xp: 0 },
    { day: 'Sat', xp: 0 },
    { day: 'Sun', xp: safeChar.xp || 0 },
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
          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Primary Evaluation</span>
          <h3 className="text-base font-black text-primary">"Yes. You are becoming stronger."</h3>
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

      {/* XP Velocity Chart */}
      <div className="apple-card p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">show_chart</span>
            XP Velocity & Progression Trend
          </h3>
          <span className="text-xs font-bold text-primary-muted">7-Day Trajectory</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={xpTrendData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)' }} />
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
