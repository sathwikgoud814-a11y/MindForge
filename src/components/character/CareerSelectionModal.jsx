import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function CareerSelectionModal() {
  const { showCareerModal, setShowCareerModal, selectPrimaryCareer, character } = useSystem();

  const careerOptions = [
    { title: 'UI Designer', icon: 'palette', desc: 'UI/UX Design, Figma, Typography, Systems' },
    { title: 'Software Engineer', icon: 'code', desc: 'Programming, DSA, React, Node.js, Systems' },
    { title: 'Machine Learning Engineer', icon: 'psychology', desc: 'Python, ML, Deep Learning, MLOps, LLMs' },
    { title: 'Entrepreneur', icon: 'domain', desc: 'Business Strategy, Sales, Product, Marketing' },
  ];

  if (!showCareerModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-2xl">alt_route</span>
            <h3 className="font-extrabold text-base text-primary">Select Primary Career Path</h3>
          </div>
          <button
            onClick={() => setShowCareerModal(false)}
            className="p-1 rounded-lg hover:bg-surface-subtle text-primary-muted"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs text-primary-muted">
          Your active primary career shapes your primary Skill Tree structure. Choose the career path matching your real-world goals.
        </p>

        <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
          {careerOptions.map(c => {
            const isSelected = character.primaryCareer === c.title;
            return (
              <div
                key={c.title}
                onClick={() => selectPrimaryCareer(c.title)}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gold bg-gold-light/40 shadow-sm'
                    : 'border-border-subtle hover:bg-surface-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                    isSelected ? 'gold-gradient text-white' : 'bg-surface-subtle text-primary'
                  }`}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-primary">{c.title}</h4>
                    <p className="text-xs text-primary-muted">{c.desc}</p>
                  </div>
                </div>

                <span className={`text-xs font-bold ${isSelected ? 'text-gold' : 'text-primary-muted'}`}>
                  {isSelected ? 'ACTIVE ✓' : 'Select'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowCareerModal(false)}
            className="px-5 py-2.5 rounded-xl bg-surface-subtle text-primary font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
