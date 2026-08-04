import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useSystem } from '../../context/SystemContext';

export function StatRadarChart() {
  const { character, attributes, setActiveTab } = useSystem();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const safeAttrs = attributes || {};

  const data = [
    { stat: 'DIS', fullMark: 100, value: (safeAttrs.discipline?.level || 1) * 10, fullName: 'Discipline' },
    { stat: 'FOC', fullMark: 100, value: (safeAttrs.focus?.level || 1) * 10, fullName: 'Focus' },
    { stat: 'KNO', fullMark: 100, value: (safeAttrs.knowledge?.level || 1) * 10, fullName: 'Knowledge' },
    { stat: 'STR', fullMark: 100, value: (safeAttrs.strength?.level || 1) * 10, fullName: 'Strength' },
    { stat: 'RES', fullMark: 100, value: (safeAttrs.resilience?.level || 1) * 10, fullName: 'Resilience' },
  ];

  return (
    <div className="apple-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">monitoring</span>
            System Attribute Radar Matrix
          </h3>
          <p className="text-xs text-primary-muted">Real-time core growth breakdown</p>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke={isDark ? '#2A2F3A' : '#e2e2e2'} />
            <PolarAngleAxis dataKey="stat" tick={{ fill: isDark ? '#F5F7FA' : '#111111', fontSize: 12, fontWeight: 700 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="System Attributes" dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical list summary */}
      <div className="grid grid-cols-5 gap-2 pt-4 border-t border-border-subtle text-center">
        {data.map(d => (
          <div key={d.stat} className="p-2 rounded-xl bg-surface-subtle flex flex-col items-center border border-border-subtle">
            <span className="text-[10px] font-bold text-primary-muted">{d.stat}</span>
            <span className="text-sm font-extrabold text-primary">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
