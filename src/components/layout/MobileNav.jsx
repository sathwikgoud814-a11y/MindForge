import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function MobileNav() {
  const { activeTab, setActiveTab } = useSystem();

  const mobileItems = [
    { id: 'dashboard', label: 'Home', icon: 'dashboard' },
    { id: 'quests', label: 'Quests', icon: 'workspace_premium' },
    { id: 'profile', label: 'Profile', icon: 'military_tech' },
    { id: 'habits', label: 'Habits', icon: 'check_circle' },
    { id: 'focus', label: 'Focus', icon: 'timer' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-black/5 p-2 z-40 flex items-center justify-around shadow-lg">
      {mobileItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all ${
              isActive ? 'text-secondary-gold font-bold scale-105' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'material-symbols-filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
