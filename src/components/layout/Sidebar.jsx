import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function Sidebar() {
  const { activeTab, setActiveTab, character, setShowCreateMissionModal } = useSystem();

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
      {/* Website Brand Logo */}
      <div className="flex items-center gap-3 px-2 cursor-pointer" onClick={() => setActiveTab('commandCenter')}>
        <div className="w-10 h-10 rounded-2xl gold-gradient p-0.5 shadow-sm flex items-center justify-center flex-shrink-0">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center font-black text-lg text-primary">
            S
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md gold-gradient text-white uppercase tracking-wider">
              {character.rank}
            </span>
            <span className="text-xs font-semibold text-primary-muted">Lvl {character.level}</span>
          </div>
          <h1 className="text-base font-extrabold text-primary tracking-tight">System Elite</h1>
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
                <span className={`material-symbols-outlined text-lg transition-colors ${
                  isActive ? 'text-gold' : 'text-primary-muted group-hover:text-primary'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.highlight && (
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  isActive ? 'bg-gold text-white' : 'bg-gold-light text-gold border border-gold/30'
                }`}>
                  {item.highlight}
                </span>
              )}

              {item.badge && !item.highlight && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-gold/20 text-gold' : 'bg-surface-subtle text-primary-muted'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Action & Character DP Status Box */}
      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={() => setShowCreateMissionModal(true)}
          className="w-full bg-primary hover:bg-black text-white font-extrabold py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <span className="material-symbols-outlined text-gold text-base">add_circle</span>
          + Create Mission
        </button>

        <div
          onClick={() => setActiveTab('shop')}
          className="p-4 rounded-2xl bg-gold-light/60 border border-gold/30 flex items-center justify-between cursor-pointer hover:bg-gold-light transition-colors shadow-sm"
          title="Open Reward Shop"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Discipline Balance</span>
            <span className="text-sm font-black text-primary flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-gold text-base">stars</span>
              {character.dp.toLocaleString()} DP
            </span>
          </div>
          <span className="material-symbols-outlined text-gold text-xl">chevron_right</span>
        </div>
      </div>
    </aside>
  );
}
