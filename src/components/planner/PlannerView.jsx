import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';

export function PlannerView() {
  const { missions, completeMission } = useSystem();
  const [durationMins, setDurationMins] = useState(25);
  const [timeLeftSecs, setTimeLeftSecs] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeftSecs > 0) {
      timer = setInterval(() => setTimeLeftSecs(prev => prev - 1), 1000);
    } else if (timeLeftSecs === 0 && isRunning) {
      setIsRunning(false);
      alert('Focus Chamber Session Completed! Deep Work recorded.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeftSecs]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeftSecs(durationMins * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="apple-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold uppercase tracking-wider">Time Allocation & Focus</span>
          <h1 className="text-2xl font-black text-primary tracking-tight mt-0.5">Planner & Focus Chamber</h1>
          <p className="text-xs text-primary-muted">Schedule mission execution blocks and enter deep work sessions.</p>
        </div>
      </div>

      {/* Focus Chamber Timer */}
      <div className="apple-card p-8 flex flex-col items-center gap-6 text-center shadow-md">
        <span className="text-xs font-bold px-3 py-1 rounded-full gold-gradient text-white uppercase tracking-wider">
          Deep Work Chamber
        </span>

        <div className="w-56 h-56 rounded-full border-4 border-gold/30 flex items-center justify-center bg-surface-subtle shadow-inner">
          <span className="text-5xl font-black text-primary tracking-tighter font-mono">
            {formatTime(timeLeftSecs)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {[15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => { setIsRunning(false); setDurationMins(mins); setTimeLeftSecs(mins * 60); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                durationMins === mins
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-subtle text-primary-muted hover:text-primary'
              }`}
            >
              {mins} Mins
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-xl bg-surface-subtle text-primary-muted hover:text-primary border border-border-subtle"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
          </button>

          <button
            onClick={toggleTimer}
            className="gold-gradient hover:scale-105 active:scale-95 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-md transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">{isRunning ? 'pause' : 'play_arrow'}</span>
            {isRunning ? 'Pause Chamber' : 'Start Focus Chamber'}
          </button>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="apple-card p-6 flex flex-col gap-4">
        <h3 className="text-base font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-gold">calendar_month</span>
          Today's Directive Schedule
        </h3>

        <div className="flex flex-col gap-3">
          {missions.map((m, idx) => (
            <div key={m.id} className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-gold w-16">0{idx + 9}:00 AM</span>
                <div>
                  <h4 className="font-extrabold text-xs text-primary">{m.name}</h4>
                  <span className="text-[10px] text-primary-muted font-medium">Duration: {m.estimatedDuration}</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                m.completed ? 'bg-emerald-500 text-white' : 'bg-surface text-primary border border-border-subtle'
              }`}>
                {m.completed ? 'Done ✓' : 'Scheduled'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
