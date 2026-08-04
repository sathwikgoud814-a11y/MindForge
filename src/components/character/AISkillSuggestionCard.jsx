import React from 'react';
import { useSystem } from '../../context/SystemContext';

export function AISkillSuggestionCard() {
  const { aiSuggestion, setAiSuggestion, acceptAiSkill } = useSystem();

  if (!aiSuggestion || !aiSuggestion.active) return null;

  return (
    <div className="bg-gold-light/60 p-6 rounded-3xl border border-gold/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gold text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-2xl">auto_awesome</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              AI Intelligence
            </span>
            <span className="text-xs font-semibold text-gold">Activity Observation</span>
          </div>
          <h4 className="font-extrabold text-sm text-primary mt-1">
            "You've completed {aiSuggestion.activityCount} related activity directives recently."
          </h4>
          <p className="text-xs text-primary-muted mt-0.5">
            Suggested Skill Addition: <strong className="text-primary">{aiSuggestion.suggestedSkill}</strong> ({aiSuggestion.category})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={() => setAiSuggestion(prev => ({ ...prev, active: false }))}
          className="px-4 py-2.5 rounded-xl bg-surface-subtle text-primary-muted font-extrabold text-xs hover:text-primary border border-border-subtle"
        >
          Dismiss
        </button>
        <button
          onClick={acceptAiSkill}
          className="px-5 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Create Skill
        </button>
      </div>
    </div>
  );
}
