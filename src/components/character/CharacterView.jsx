import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { AISkillSuggestionCard } from './AISkillSuggestionCard';
import { SkillTreeVisualization } from './SkillTreeVisualization';
import { SkillCategoryAccordion } from './SkillCategoryAccordion';

export function CharacterView() {
  const { character, attributes, themeMode, setThemeMode } = useSystem();

  const safeChar = character || {};
  const safeAttrs = attributes || {};

  const attrDefs = [
    { key: 'discipline', label: 'Discipline', icon: 'fitness_center', desc: 'Resisting comfort and completing directives' },
    { key: 'focus', label: 'Focus', icon: 'timer', desc: 'Deep work duration and distraction resistance' },
    { key: 'knowledge', label: 'Knowledge', icon: 'menu_book', desc: 'Lore retention and problem-solving depth' },
    { key: 'strength', label: 'Strength', icon: 'bolt', desc: 'Physical power and heavy task stamina' },
    { key: 'communication', label: 'Communication', icon: 'record_voice_over', desc: 'Verbal clarity and team interaction' },
    { key: 'leadership', label: 'Leadership', icon: 'groups', desc: 'Ownership and high-stakes decision making' },
    { key: 'creativity', label: 'Creativity', icon: 'palette', desc: 'Innovative design and novel solutions' },
    { key: 'confidence', label: 'Confidence', icon: 'stars', desc: 'Self-efficacy and risk resolution' },
    { key: 'consistency', label: 'Consistency', icon: 'event_repeat', desc: 'Daily streak preservation and habit memory' },
    { key: 'resilience', label: 'Resilience', icon: 'shield', desc: 'Recovery from setbacks and penalty zones' },
  ];

  const careerLevel = safeChar.careerLevel ?? 1;
  const careerProgressPct = safeChar.careerProgressPct ?? 0;
  const hoursInvested = safeChar.hoursInvested ?? 0;
  const completedMissionsCount = safeChar.completedMissionsCount ?? 0;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      {/* 1. Top Section - Character Profile & Career Identity Metrics */}
      <section className="apple-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="w-24 h-24 rounded-3xl gold-gradient p-1 flex-shrink-0 shadow-md">
            <div className="w-full h-full bg-surface rounded-2xl flex items-center justify-center font-black text-3xl text-primary">
              {safeChar.level ?? 1}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold px-3 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
                {safeChar.rank || 'Recruit Rank'}
              </span>
              <span className="text-xs text-primary-muted font-medium">Level {safeChar.level ?? 1}</span>
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tight">{safeChar.name || 'Sung Jin-Woo'}</h1>
            <p className="text-sm font-extrabold text-gold mt-0.5">{safeChar.primaryCareer || 'UI Designer'}</p>
          </div>
        </div>

        {/* System Overview Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle text-center">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Career Tier</span>
            <h4 className="text-base font-black text-primary">Lvl {careerLevel}</h4>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle text-center">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Hours Invested</span>
            <h4 className="text-base font-black text-primary">{hoursInvested}h</h4>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle text-center">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Missions Done</span>
            <h4 className="text-base font-black text-gold">{completedMissionsCount}</h4>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle text-center">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Streak</span>
            <h4 className="text-base font-black text-emerald-600">🔥 {safeChar.streakDays || 1}d</h4>
          </div>
        </div>
      </section>

      {/* 2. System Theme & Appearance Control Section */}
      <section className="apple-card p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded gold-gradient text-white uppercase tracking-wider">
                System Interface
              </span>
              <span className="text-xs font-bold text-gold">Appearance Settings</span>
            </div>
            <h3 className="text-xl font-black text-primary tracking-tight">System Theme Mode</h3>
            <p className="text-xs text-primary-muted mt-0.5">Select your preferred appearance protocol. Light for daytime clarity; Dark for focused strategy.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light Mode', icon: 'light_mode', desc: 'Daytime growth, clarity, and planning.' },
            { id: 'dark', label: 'Dark Mode', icon: 'dark_mode', desc: 'Late-night focus, deep work, and strategy.' },
            { id: 'system', label: 'System Default', icon: 'desktop_windows', desc: 'Automatically match operating system.' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setThemeMode(t.id)}
              className={`p-5 rounded-2xl border flex flex-col gap-3 text-left transition-all ${
                themeMode === t.id
                  ? 'border-gold bg-gold-light/40 shadow-sm scale-[1.02]'
                  : 'border-border-subtle bg-surface-subtle hover:border-gold/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`material-symbols-outlined text-2xl ${themeMode === t.id ? 'text-gold' : 'text-primary-muted'}`}>
                  {t.icon}
                </span>
                {themeMode === t.id && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded gold-gradient text-white uppercase">Active</span>
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-primary">{t.label}</h4>
                <p className="text-xs text-primary-muted font-medium mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. AI Skill Suggestion Intelligence */}
      <AISkillSuggestionCard />

      {/* 4. Character Attributes Matrix */}
      <section className="apple-card p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-wider">System Attributes</span>
            <h3 className="text-xl font-black text-primary tracking-tight mt-0.5">Character Attribute Growth Matrix</h3>
          </div>
          <span className="text-xs font-extrabold text-primary-muted">10 Attributes Monitored</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {attrDefs.map(a => {
            const rawAttr = safeAttrs[a.key] || {};
            const lvl = rawAttr.level ?? 1;
            const xp = rawAttr.xp ?? 0;
            const xpToNext = rawAttr.xpToNext ?? 100;
            const progressPct = Math.min(100, Math.round((xp / (xpToNext || 100)) * 100));

            return (
              <div key={a.key} className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col justify-between gap-3 shadow-sm hover:border-gold/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold text-lg">{a.icon}</span>
                    <h4 className="font-extrabold text-xs text-primary">{a.label}</h4>
                  </div>
                  <span className="text-xs font-black text-gold">Lvl {lvl}</span>
                </div>

                <div className="flex flex-col gap-1 text-[10px]">
                  <div className="flex justify-between font-bold text-primary-muted">
                    <span>XP</span>
                    <span>{xp} / {xpToNext}</span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div className="gold-gradient h-full rounded-full transition-all duration-500 progress-glow" style={{ width: `${progressPct}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Hierarchical Career Skill Tree */}
      <SkillTreeVisualization />

      {/* 6. Collapsible Skill Categories Accordion */}
      <SkillCategoryAccordion />
    </div>
  );
}
