import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function Footer() {
  const { setActiveTab } = useSystem();

  return (
    <footer className="bg-surface border-t border-border-subtle mt-16 py-12 text-xs text-primary-muted">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center font-black text-white text-sm">
            S
          </div>
          <div>
            <h4 className="font-extrabold text-primary text-sm">System Elite — Life RPG</h4>
            <p className="text-[11px]">Real-Life Self-Improvement System • Apple-Quality Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-semibold">
          <button onClick={() => setActiveTab('commandCenter')} className="hover:text-primary transition-colors">Command Center</button>
          <button onClick={() => setActiveTab('missions')} className="hover:text-primary transition-colors">Missions</button>
          <button onClick={() => setActiveTab('planner')} className="hover:text-primary transition-colors">Planner</button>
          <button onClick={() => setActiveTab('growth')} className="hover:text-primary transition-colors">Growth</button>
          <button onClick={() => setActiveTab('character')} className="hover:text-primary transition-colors">Character</button>
          <button onClick={() => setActiveTab('shop')} className="hover:text-primary font-bold text-gold transition-colors">Reward Shop</button>
        </div>

        <div className="text-[11px] text-primary-muted font-medium">
          © 2026 System Elite. All rights reserved. Comfort is earned.
        </div>
      </div>
    </footer>
  );
}
