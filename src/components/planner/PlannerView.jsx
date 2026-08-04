import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { HolidayCalendarProvider } from '../../shared/services/holidayCalendarProvider';
import { CalendarEventEngine } from '../../shared/services/calendarEventEngine';
import { CreateEventModal } from './CreateEventModal';

const STAGGERED_TIMES = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '07:00 PM', '09:00 PM'];

export function PlannerView() {
  const {
    missions,
    completeMission,
    privateCalendarSettings,
    customEvents,
    activeCalendarView,
    changeCalendarView,
    deleteCustomEvent,
    character,
  } = useSystem();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiOptimizedPlan, setAiOptimizedPlan] = useState(null);

  // Focus Chamber Timer Modal State
  const [showFocusChamber, setShowFocusChamber] = useState(false);
  const [durationMins, setDurationMins] = useState(25);
  const [timeLeftSecs, setTimeLeftSecs] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Active holiday events
  const enabledCalendarIds = privateCalendarSettings?.enabledCalendars || ['national_in'];
  const holidayEvents = HolidayCalendarProvider.getHolidayEvents(enabledCalendarIds);

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

  const safeMissions = Array.isArray(missions) ? missions : [];
  const safeCustomEvents = Array.isArray(customEvents) ? customEvents : [];

  const todayStr = new Date().toISOString().slice(0, 10);

  // Map missions to distinct, realistic time slots across the day
  const missionItems = safeMissions.map((m, idx) => ({
    id: `m_${m.id}`,
    title: m.name,
    type: 'mission',
    difficulty: m.difficulty || 'B-Rank',
    xpReward: m.xpReward || 80,
    dpReward: m.dpReward || 40,
    date: m.scheduledDate || todayStr,
    time: m.scheduledTime || STAGGERED_TIMES[idx % STAGGERED_TIMES.length],
    duration: m.estimatedDuration || '45 Mins',
    completed: m.completed,
    originalMission: m,
  }));

  const userCustomItems = safeCustomEvents.map(e => ({
    ...e,
    type: e.type || 'custom',
  }));

  const holidayItems = holidayEvents.map(h => ({
    id: h.id,
    title: h.title,
    type: 'holiday',
    date: h.date,
    category: h.category,
    isHoliday: true,
    readOnly: true,
  }));

  const allCalendarItems = [...missionItems, ...userCustomItems, ...holidayItems].filter(item => {
    if (!searchQuery.trim()) return true;
    return (
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const todayItems = allCalendarItems.filter(i => i.date === todayStr || i.type === 'mission');

  const handleAiOptimize = () => {
    const optimized = CalendarEventEngine.generateAiOptimizedSchedule(safeMissions, 'High');
    setAiOptimizedPlan(optimized);
  };

  const handleExportICS = () => {
    CalendarEventEngine.exportToICS(allCalendarItems, `${character?.name || 'Vekta'} RPG Schedule`);
  };

  // Calculate current week days (Mon-Sun)
  const getCurrentWeekDays = () => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1;
    const days = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.setDate(first + i));
      days.push({
        dateStr: next.toISOString().slice(0, 10),
        dayName: next.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: next.getDate(),
        isToday: next.toISOString().slice(0, 10) === todayStr,
      });
    }
    return days;
  };

  const weekDays = getCurrentWeekDays();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Create Event Modal */}
      <CreateEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />

      {/* PLANNER DASHBOARD HEADER SUMMARY */}
      <section className="apple-card p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
                RPG Calendar Engine
              </span>
              <span className="text-xs font-bold text-gold">⚡ {character?.rank || 'Recruit'} Rank</span>
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Calendar & Tactical Schedule</h1>
            <p className="text-xs text-primary-muted mt-0.5">
              Real-time schedule integrated with Character XP, Discipline Points, and Private Holiday Overlays.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              + Create Event
            </button>

            <button
              onClick={() => setShowFocusChamber(!showFocusChamber)}
              className="px-4 py-2.5 rounded-2xl bg-surface-subtle hover:bg-surface-elevated text-primary font-extrabold text-xs border border-border-subtle hover:border-gold/40 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-gold text-base">timer</span>
              Focus Chamber
            </button>

            <button
              onClick={handleExportICS}
              className="px-3.5 py-2.5 rounded-2xl bg-surface-subtle hover:bg-surface-elevated text-primary-muted hover:text-primary font-bold text-xs border border-border-subtle transition-colors flex items-center gap-1"
              title="Export Calendar to .ICS File"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Export .ICS
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Today's Directives</span>
            <span className="font-black text-primary text-sm">{safeMissions.length} Missions</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">User Events</span>
            <span className="font-black text-gold text-sm">{safeCustomEvents.length} Events</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Focus Hours Planned</span>
            <span className="font-black text-blue-400 text-sm">4.5 Hours</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Completion Rate</span>
            <span className="font-black text-emerald-400 text-sm">
              {safeMissions.length > 0 ? Math.round((safeMissions.filter(m => m.completed).length / safeMissions.length) * 100) : 0}%
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Holiday Overlays</span>
            <span className="font-black text-amber-400 text-sm">{holidayEvents.length} Holidays</span>
          </div>
          <div className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Schedule Conflicts</span>
            <span className="font-black text-emerald-400 text-sm">0 Conflicts</span>
          </div>
        </div>
      </section>

      {/* FOCUS CHAMBER MODAL TOGGLE */}
      {showFocusChamber && (
        <div className="apple-card p-6 flex flex-col items-center gap-5 text-center shadow-md border-2 border-gold animate-in fade-in duration-200">
          <div className="flex items-center justify-between w-full pb-2 border-b border-border-subtle">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">Deep Work Focus Chamber</span>
            <button onClick={() => setShowFocusChamber(false)} className="text-primary-muted hover:text-primary">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div className="w-48 h-48 rounded-full border-4 border-gold/40 flex items-center justify-center bg-surface-subtle shadow-inner">
            <span className="text-4xl font-black text-primary font-mono">{formatTime(timeLeftSecs)}</span>
          </div>

          <div className="flex items-center gap-3">
            {[15, 25, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => { setIsRunning(false); setDurationMins(mins); setTimeLeftSecs(mins * 60); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold ${
                  durationMins === mins ? 'bg-primary text-white shadow-sm' : 'bg-surface-subtle text-primary-muted'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={resetTimer} className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-primary-muted hover:text-primary">
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </button>
            <button onClick={toggleTimer} className="gold-gradient text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md">
              {isRunning ? 'Pause Chamber' : 'Start Focus Chamber'}
            </button>
          </div>
        </div>
      )}

      {/* SMART INSIGHTS BANNER */}
      <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-gold text-2xl">auto_awesome</span>
          <div>
            <h4 className="font-extrabold text-gold uppercase text-[10px]">System Smart Insight</h4>
            <p className="font-semibold text-primary">"Today's directives are distributed evenly across morning and afternoon focus windows."</p>
          </div>
        </div>
        <button onClick={handleAiOptimize} className="px-3.5 py-2 rounded-xl gold-gradient text-white font-extrabold text-[11px] whitespace-nowrap shadow-sm">
          🧠 AI Schedule Optimizer →
        </button>
      </div>

      {/* AI OPTIMIZATION OVERLAY PANEL */}
      {aiOptimizedPlan && (
        <div className="apple-card p-6 flex flex-col gap-4 border-2 border-gold shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="text-xs font-black text-gold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">psychology</span>
              System AI Schedule Proposal
            </span>
            <button onClick={() => setAiOptimizedPlan(null)} className="text-primary-muted hover:text-primary">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {aiOptimizedPlan.map(opt => (
              <div key={opt.id} className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-1">
                <span className="text-[10px] font-black text-gold uppercase">{opt.scheduledTime}</span>
                <h5 className="font-extrabold text-primary">{opt.name}</h5>
                <span className="text-[10px] text-primary-muted">{opt.aiNote}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={() => setAiOptimizedPlan(null)} className="px-4 py-2 rounded-xl bg-surface-subtle text-primary-muted font-bold text-xs">
              Reject
            </button>
            <button onClick={() => { setAiOptimizedPlan(null); alert('Optimized Schedule Accepted!'); }} className="px-5 py-2 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md">
              Accept Schedule ✓
            </button>
          </div>
        </div>
      )}

      {/* VIEW SWITCHER & SEARCH TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 4 View Modes */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-subtle border border-border-subtle w-full sm:w-auto">
          {[
            { id: 'day', label: 'Day View', icon: 'view_day' },
            { id: 'week', label: 'Week View', icon: 'view_week' },
            { id: 'month', label: 'Month View', icon: 'calendar_view_month' },
            { id: 'agenda', label: 'Agenda', icon: 'format_list_bulleted' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => changeCalendarView(tab.id)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeCalendarView === tab.id
                  ? 'bg-primary text-white shadow-sm scale-105'
                  : 'text-primary-muted hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary-muted text-lg">search</span>
          <input
            type="text"
            placeholder="Search events, missions, holidays..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-surface-subtle border border-border-subtle text-xs text-primary font-bold focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* WEEK VIEW CALENDAR GRID */}
      {activeCalendarView === 'week' && (
        <div className="apple-card p-6 flex flex-col gap-4 shadow-md">
          <h3 className="text-sm font-black text-primary uppercase tracking-tight flex items-center gap-2 pb-2 border-b border-border-subtle">
            <span className="material-symbols-outlined text-gold">date_range</span>
            CURRENT WEEK TIMELINE GRID (MON – SUN)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map(day => {
              const dayEvents = allCalendarItems.filter(i => i.date === day.dateStr || (i.type === 'mission' && day.isToday));

              return (
                <div
                  key={day.dateStr}
                  className={`p-3.5 rounded-2xl border flex flex-col gap-2 min-h-[160px] ${
                    day.isToday
                      ? 'border-gold bg-gold-light/20 shadow-sm'
                      : 'border-border-subtle bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-border-subtle">
                    <span className="text-[11px] font-black uppercase text-primary-muted">{day.dayName}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${day.isToday ? 'gold-gradient text-white' : 'text-primary'}`}>
                      {day.dayNum}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {dayEvents.map(item => (
                      <div
                        key={item.id}
                        className={`p-2 rounded-xl border text-[11px] flex flex-col gap-0.5 ${
                          item.type === 'mission'
                            ? 'bg-surface border-gold/40 text-primary font-extrabold'
                            : item.isHoliday
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                            : 'bg-surface border-border-subtle text-primary font-bold'
                        }`}
                      >
                        <span className="text-[9px] font-mono text-gold">{item.time}</span>
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                    {dayEvents.length === 0 && (
                      <span className="text-[10px] text-primary-muted italic pt-4 text-center">No Events</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCHEDULE LISTING (DAY, MONTH & AGENDA VIEWS) */}
      {activeCalendarView !== 'week' && (
        <div className="apple-card p-6 md:p-8 flex flex-col gap-6 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <h3 className="text-base font-black text-primary uppercase tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">calendar_today</span>
              {activeCalendarView.toUpperCase()} SCHEDULE TIMELINE ({allCalendarItems.length} ITEMS)
            </h3>
            <span className="text-xs font-bold text-primary-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {allCalendarItems.length === 0 ? (
              <div className="text-center py-12 text-xs text-primary-muted font-bold">
                No custom events found. Click "+ Create Event" above to schedule a block.
              </div>
            ) : (
              allCalendarItems.map(item => {
                const isMission = item.type === 'mission';
                const isHoliday = item.isHoliday;

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isMission
                        ? 'border-gold/40 bg-gold-light/20 shadow-sm'
                        : isHoliday
                        ? 'border-amber-500/30 bg-amber-500/10'
                        : 'border-border-subtle bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Time Box */}
                      <div className="p-3 rounded-xl bg-surface border border-border-subtle text-center min-w-[80px]">
                        <span className="text-[11px] font-black text-gold uppercase block">{item.time || 'All Day'}</span>
                        <span className="text-[9px] font-bold text-primary-muted">{item.duration || '60m'}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isMission && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded gold-gradient text-white uppercase">
                              {item.difficulty || 'B-Rank'} DIRECTIVE
                            </span>
                          )}
                          {isHoliday && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              READ-ONLY HOLIDAY
                            </span>
                          )}
                          {!isMission && !isHoliday && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                              {item.type}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-base font-extrabold ${item.completed ? 'line-through text-primary-muted' : 'text-primary'}`}>
                          {item.title}
                        </h4>

                        {/* RPG Reward Info on Mission Blocks */}
                        {isMission && (
                          <div className="flex items-center gap-3 text-xs font-black mt-0.5">
                            <span className="text-primary">+{item.xpReward} XP</span>
                            <span className="text-gold">+{item.dpReward} DP</span>
                            <span className="text-primary-muted text-[10px] font-normal">• Improves Programming & Focus</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isMission && (
                        <button
                          disabled={item.completed}
                          onClick={() => completeMission(item.originalMission?.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-transform ${
                            item.completed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'gold-gradient text-white shadow-md hover:scale-105'
                          }`}
                        >
                          {item.completed ? 'Completed ✓' : 'Complete Directive (+XP & +DP)'}
                        </button>
                      )}

                      {!isMission && !isHoliday && (
                        <button
                          onClick={() => deleteCustomEvent(item.id)}
                          className="p-2 rounded-xl text-primary-muted hover:text-red-400 border border-border-subtle"
                          title="Delete Event"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
