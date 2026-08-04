import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function SystemCalendar() {
  const { quests } = useSystem();
  const [selectedDay, setSelectedDay] = useState(15);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-black/5 premium-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              Chronos Matrix
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">System Calendar</h1>
          <p className="text-xs text-on-surface-variant">Schedule and track daily quest deadlines and dungeon raids.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary bg-surface-container-low px-4 py-2 rounded-xl border border-black/5">
            August 2026
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col gap-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map(day => {
            const isToday = day === 15;
            const isSelected = day === selectedDay;
            const hasQuest = day % 3 === 0 || day === 15;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`min-h-[80px] p-2 rounded-2xl border flex flex-col justify-between items-start transition-all ${
                  isSelected
                    ? 'border-secondary-gold bg-secondary-gold/10 shadow-md ring-2 ring-secondary-gold'
                    : isToday
                    ? 'border-primary bg-primary text-white'
                    : 'border-black/5 bg-surface-container-low/50 hover:bg-surface-container-low'
                }`}
              >
                <span className={`text-xs font-extrabold ${isToday && !isSelected ? 'text-white' : 'text-primary'}`}>
                  {day}
                </span>

                {hasQuest && (
                  <div className="w-full flex items-center justify-between text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary-gold/20 text-secondary-gold">
                    <span>Quest</span>
                    <span>•</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Directives */}
        <div className="pt-6 border-t border-black/5 flex flex-col gap-3">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-gold">event_available</span>
            Directives for August {selectedDay}, 2026
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quests.map(q => (
              <div key={q.id} className="p-3.5 rounded-xl bg-surface-container-low border border-black/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-secondary-gold uppercase">{q.tier}</span>
                  <h4 className="font-bold text-xs text-primary">{q.title}</h4>
                </div>
                <span className="text-xs font-black text-emerald-600">+{q.xpReward} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
