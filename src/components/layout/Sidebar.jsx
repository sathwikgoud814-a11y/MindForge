import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function Sidebar() {
  const { activeTab, setActiveTab, character, setShowCreateMissionModal } = useSystem();

  const xpPct = Math.min(100, Math.round(((character.xp || 680) / (character.xpToNextLevel || 1000)) * 100));

  const navItems = [
    { id: 'commandCenter', label: 'Command Center', icon: 'dashboard' },
    { id: 'missions', label: 'Missions', icon: 'workspace_premium', badge: 'Active' },
    { id: 'planner', label: 'Planner', icon: 'event' },
    { id: 'growth', label: 'Growth Report', icon: 'insights' },
    { id: 'character', label: 'Character', icon: 'person' },
    { id: 'shop', label: 'Reward Shop', icon: 'shopping_bag', highlight: `${character.dp} DP` },
    { id: 'hunters', label: 'Hunters', icon: 'shield', badge: 'Arena' },
  ];

  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 w-64 py-6 px-4 gap-6 border-r border-border-subtle bg-surface z-40 shadow-sm">
      {/* Website Brand Logo & Character Identity Header */}
      <div
        className="flex flex-col gap-3 px-2 py-3 rounded-2xl bg-surface-subtle border border-border-subtle cursor-pointer hover:border-gold/30 transition-colors"
        onClick={() => setActiveTab('character')}
        title="View Character Profile"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gold-gradient p-0.5 shadow-sm flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center font-black text-lg text-primary">
              {character.level || 2}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-black px-2 py-0.5 rounded gold-gradient text-white uppercase tracking-wider">
                {character.rank || 'Recruit'}
              </span>
            </div>
            <h1 className="text-sm font-extrabold text-primary tracking-tight truncate">System Elite</h1>
            <p className="text-[11px] font-bold text-gold truncate">{character.archetype || 'Creative Builder'}</p>
          </div>
        </div>

        {/* Live XP Progress Bar inside Sidebar */}
        <div className="flex flex-col gap-1 text-[10px] pt-1 border-t border-border-subtle">
          <div className="flex justify-between font-bold text-primary-muted">
            <span>XP Mastery</span>
            <span className="text-primary font-black">{character.xp || 680} / {character.xpToNextLevel || 1000}</span>
          </div>
          <div className="w-full bg-surface-card h-1.5 rounded-full overflow-hidden border border-border-subtle">
            <div className="gold-gradient h-full rounded-full transition-all duration-500 progress-glow" style={{ width: `${xpPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Vertical Navigation Menu */}
      <nav className="flex flex-col gap-1.5 flex-grow overflow-y-auto pr-1">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 group ${
                isActive
                  ? 'bg-primary text-white shadow-md scale-[1.02]'
                  : 'text-primary-muted hover:bg-surface-subtle hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-lg transition-transform group-hover:scale-110 ${
                  isActive ? 'text-gold' : 'text-primary-muted'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-gold text-white' : 'bg-surface-subtle text-primary-muted border border-border-subtle'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.highlight && (
                <span className="text-[10px] font-black text-gold">
                  {item.highlight}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action Deploy Directive Button */}
      <button
        onClick={() => setShowCreateMissionModal(true)}
        className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">add_circle</span>
        + Deploy Directive
      </button>
    </aside>
  );
}
