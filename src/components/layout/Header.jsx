import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';

export function Header() {
  const { character, activeTab, setActiveTab, resetAllSystemData, themeMode, setThemeMode, hunterRating } = useSystem();
  const [now, setNow] = useState(new Date());

  // Live real-time clock updating every 1000ms
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabTitles = {
    commandCenter: 'Command Center',
    missions: 'Missions',
    planner: 'Planner & Focus Chamber',
    growth: 'Growth Report',
    character: 'Character Profile',
    shop: 'Reward Shop',
    hunters: 'Hunters Network',
  };

  // Format Date: "Tuesday, Aug 4, 2026"
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format Time: "11:47:47 AM"
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const hour = now.getHours();
  const isNightProtocol = hour >= 22 || hour < 6;

  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-4 border-b border-border-subtle">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
            {character.rank || 'Recruit (Unawakened)'}
          </span>
          <span className="text-xs text-primary-muted font-bold">Lvl {character.level}</span>
          <span className="text-xs font-black text-gold px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle">
            ⚡ {hunterRating || 0} HR Rating
          </span>
          <span className="text-xs font-extrabold text-gold px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle">
            🔥 {character.streakDays || 1} Day Streak
          </span>
        </div>
        <h2 className="text-2xl font-black text-primary tracking-tight">
          {tabTitles[activeTab] || 'Command Center'}
        </h2>
      </div>

      {/* Real-Time Live Clock & Status Bar */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
        <div className="p-2.5 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center gap-3 shadow-2xs">
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black text-primary font-mono tracking-tight">{formattedTime}</span>
            </div>
            <span className="text-[10px] text-primary-muted font-extrabold">{formattedDate}</span>
          </div>

          <div className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 uppercase ${
            isNightProtocol ? 'bg-indigo-950 text-indigo-200 border border-indigo-800' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span className="material-symbols-outlined text-xs">
              {isNightProtocol ? 'bedtime' : 'wb_sunny'}
            </span>
            <span>{isNightProtocol ? 'Night Protocol' : 'Peak Focus'}</span>
          </div>
        </div>

        {/* DP Balance Button */}
        <div
          onClick={() => setActiveTab('shop')}
          className="flex items-center gap-2 bg-gold-light/60 px-4 py-2.5 rounded-2xl border border-gold/30 cursor-pointer hover:bg-gold-light transition-colors shadow-sm"
          title="Open Reward Shop"
        >
          <span className="material-symbols-outlined text-gold text-lg">stars</span>
          <span className="text-xs font-black text-primary">{character.dp.toLocaleString()} DP</span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={() => {
            const nextMode = themeMode === 'system' ? 'dark' : themeMode === 'dark' ? 'light' : 'system';
            setThemeMode(nextMode);
          }}
          className="p-2.5 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-gold/40 text-primary-muted hover:text-gold transition-colors flex items-center justify-center"
          title={`Theme: ${themeMode === 'system' ? 'System Default' : themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'} (Click to cycle)`}
        >
          <span className="material-symbols-outlined text-lg">
            {themeMode === 'system' ? 'desktop_windows' : themeMode === 'dark' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* Reset System / Awakening Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all System data and restart your Character Awakening?')) {
              resetAllSystemData();
            }
          }}
          className="p-2.5 rounded-2xl bg-surface-subtle border border-border-subtle hover:bg-red-50 text-primary-muted hover:text-red-600 transition-colors"
          title="Reset System & Restart Character Awakening"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
        </button>

        {/* Character Avatar */}
        <div
          onClick={() => setActiveTab('character')}
          className="w-10 h-10 rounded-2xl gold-gradient p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-sm"
          title="Open Profile"
        >
          <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center font-black text-primary text-base">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
