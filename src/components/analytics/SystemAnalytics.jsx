import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { useSystem } from '../../context/SystemContext';

export function SystemAnalytics() {
  const { hunter, habits } = useSystem();

  const xpData = [
    { day: 'Mon', xp: 1200 },
    { day: 'Tue', xp: 1850 },
    { day: 'Wed', xp: 1400 },
    { day: 'Thu', xp: 2300 },
    { day: 'Fri', xp: 2900 },
    { day: 'Sat', xp: 3400 },
    { day: 'Sun', xp: 3850 },
  ];

  const focusData = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.0 },
    { day: 'Fri', hours: 4.8 },
    { day: 'Sat', hours: 6.1 },
    { day: 'Sun', hours: 5.5 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-black/5 premium-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              System Neural Metrics
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">System Analytics & Insights</h1>
          <p className="text-xs text-on-surface-variant">Real-time performance metrics, XP velocity, and focus duration charts.</p>
        </div>

        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-2xl border border-black/5">
          <span className="text-xs text-on-surface-variant">Productivity Score</span>
          <span className="text-lg font-black text-emerald-600">98.4%</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Velocity Growth Chart */}
        <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-gold">trending_up</span>
                Weekly XP Accumulation Velocity
              </h3>
              <p className="text-xs text-on-surface-variant">XP trajectory over last 7 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+24% vs Last Week</span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpData}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#444748' }} />
                <YAxis tick={{ fontSize: 12, fill: '#444748' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="xp" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#xpGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focus Chamber Hours */}
        <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500">timer</span>
                Daily Focus Chamber Hours
              </h3>
              <p className="text-xs text-on-surface-variant">Uninterrupted concentration sessions</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Avg 4.6 hrs/day</span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#444748' }} />
                <YAxis tick={{ fontSize: 12, fill: '#444748' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }} />
                <Bar dataKey="hours" fill="#111111" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
