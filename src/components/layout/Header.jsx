import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { GlobalOmniSearch } from '../common/GlobalOmniSearch';

export function Header() {
  const { character, activeTab, setActiveTab, hunterRating } = useSystem();
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

  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-4 border-b border-border-subtle">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
            {character.rank || 'Recruit Rank'}
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

      {/* Header Tools & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
        {/* Global Site Search Bar */}
        <GlobalOmniSearch />

        {/* Real-Time Live Clock */}
        <div className="px-3.5 py-2 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center gap-3 shadow-2xs">
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black text-primary font-mono tracking-tight">{formattedTime}</span>
            </div>
            <span className="text-[10px] text-primary-muted font-extrabold">{formattedDate}</span>
          </div>
        </div>

        {/* DP Balance Button */}
        <div
          onClick={() => setActiveTab('shop')}
          className="flex items-center gap-2 bg-gold-light/60 px-4 py-2 rounded-2xl border border-gold/30 cursor-pointer hover:bg-gold-light transition-colors shadow-sm"
          title="Open Reward Shop"
        >
          <span className="material-symbols-outlined text-gold text-lg">stars</span>
          <span className="text-xs font-black text-primary">{character.dp.toLocaleString()} DP</span>
        </div>

        {/* Character Avatar Button */}
        <div
          onClick={() => setActiveTab('character')}
          className="w-10 h-10 rounded-2xl gold-gradient p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-sm"
          title="Open Character Profile & Settings"
        >
          <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center font-black text-primary text-base">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
