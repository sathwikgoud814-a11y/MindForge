import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function OnboardingModal() {
  const { onboardingModalOpen, setOnboardingModalOpen } = useSystem();
  const [step, setStep] = useState(1);

  if (!onboardingModalOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setOnboardingModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-black/10 flex flex-col gap-6 text-center">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? 'w-8 gold-gradient' : 'w-2 bg-surface-container-highest'
              }`}
            ></div>
          ))}
        </div>

        {step === 1 && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-black gold-glow">
              S
            </div>
            <h2 className="text-2xl font-black text-primary">Welcome to The System</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              You have been selected as a player in the world's most advanced gamified productivity framework. Convert your daily tasks into S-Rank Quests and unlock your full potential.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-2xl bg-secondary-gold/20 text-secondary-gold flex items-center justify-center text-3xl">
              <span className="material-symbols-outlined text-4xl">workspace_premium</span>
            </div>
            <h2 className="text-2xl font-black text-primary">Daily Quests & Penalties</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Complete your daily physical and mental directives before midnight. Failing to accomplish daily quests triggers mandatory Penalty Zone survival dungeons.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-3xl">
              <span className="material-symbols-outlined text-4xl">military_tech</span>
            </div>
            <h2 className="text-2xl font-black text-primary">Stat Point Allocation</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Every level-up grants unallocated stat points (+STR, +AGI, +INT, +VIT, +SEN). Allocate them strategically to customize your Hunter build.
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-200">
            <div className="w-20 h-20 rounded-2xl gold-gradient text-white flex items-center justify-center text-3xl shadow-lg">
              <span className="material-symbols-outlined text-4xl">stars</span>
            </div>
            <h2 className="text-2xl font-black text-primary">Directive Accepted</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your Hunter license has been issued at S-Rank. The System is now operational.
            </p>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full gold-gradient text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md hover:scale-105 transition-transform mt-2"
        >
          {step === 4 ? 'Enter The System' : 'Next Directive →'}
        </button>
      </div>
    </div>
  );
}
