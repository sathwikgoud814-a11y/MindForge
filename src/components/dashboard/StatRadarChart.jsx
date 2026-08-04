import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useSystem } from '../../context/SystemContext';

export function StatRadarChart() {
  const { hunter, setActiveTab } = useSystem();

  const data = [
    { stat: 'STR', fullMark: 100, value: hunter.stats.strength, fullName: 'Strength' },
    { stat: 'AGI', fullMark: 100, value: hunter.stats.agility, fullName: 'Agility' },
    { stat: 'INT', fullMark: 100, value: hunter.stats.intelligence, fullName: 'Intelligence' },
    { stat: 'VIT', fullMark: 100, value: hunter.stats.vitality, fullName: 'Vitality' },
    { stat: 'SEN', fullMark: 100, value: hunter.stats.sense, fullName: 'Sense' },
  ];

  return (
    <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-gold">monitoring</span>
            Hunter Stat Matrix
          </h3>
          <p className="text-xs text-on-surface-variant">Core attributes breakdown</p>
        </div>
        {hunter.unallocatedPoints > 0 && (
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-bold px-3 py-1.5 rounded-xl gold-gradient text-white shadow-sm hover:scale-105 transition-transform"
          >
            +{hunter.unallocatedPoints} PTS Available
          </button>
        )}
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e2e2" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#111111', fontSize: 12, fontWeight: 700 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Hunter Stats" dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical list summary */}
      <div className="grid grid-cols-5 gap-2 pt-4 border-t border-black/5 text-center">
        {data.map(d => (
          <div key={d.stat} className="p-2 rounded-xl bg-surface-container-low/60 flex flex-col items-center">
            <span className="text-[10px] font-bold text-on-surface-variant">{d.stat}</span>
            <span className="text-sm font-extrabold text-primary">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
