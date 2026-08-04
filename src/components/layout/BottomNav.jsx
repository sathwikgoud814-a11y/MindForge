import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function BottomNav() {
  const { activeTab, setActiveTab } = useSystem();

  const navTabs = [
    { id: 'commandCenter', label: 'Command Center', icon: 'dashboard' },
    { id: 'missions', label: 'Missions', icon: 'workspace_premium' },
    { id: 'planner', label: 'Planner', icon: 'event' },
    { id: 'growth', label: 'Growth', icon: 'insights' },
    { id: 'character', label: 'Character', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-border-subtle p-2 z-40 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-xs transition-all duration-200 ${
                isActive
                  ? 'text-primary font-extrabold scale-105'
                  : 'text-primary-muted hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? 'material-symbols-filled text-gold' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
