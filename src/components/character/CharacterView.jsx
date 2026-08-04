import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { AISkillSuggestionCard } from './AISkillSuggestionCard';
import { SkillTreeVisualization } from './SkillTreeVisualization';
import { SkillCategoryAccordion } from './SkillCategoryAccordion';

export function CharacterView() {
  const {
    character,
    currentUser,
    attributes,
    themeMode,
    setThemeMode,
    privateCalendarSettings,
    updateCharacterName,
    resetCharacterProgress,
    deleteAccountData,
    realHoursInvested,
  } = useSystem();

  const safeChar = character || {};
  const safeAttrs = attributes || {};

  const [editName, setEditName] = useState(safeChar.name || '');
  const [nameSaved, setNameSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);

  const userTag = safeChar.userIdTag || `@${(safeChar.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const userEmail = currentUser?.email || safeChar.email || `${(safeChar.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}@system.elite`;

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateCharacterName(editName);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText(userTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

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
  const hoursInvested = realHoursInvested || safeChar.hoursInvested || '1.0';
  const completedMissionsCount = safeChar.completedMissionsCount ?? 0;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="apple-card p-6 md:p-8 max-w-md w-full flex flex-col gap-5 border-2 border-gold shadow-2xl">
            <div className="flex items-center gap-3 text-gold">
              <span className="material-symbols-outlined text-3xl">restart_alt</span>
              <h3 className="text-xl font-black text-primary">Reset Character Progress</h3>
            </div>
            <p className="text-xs text-primary-muted font-medium leading-relaxed">
              Are you sure you want to reset your character level, XP, and completed directives back to Level 1? Your account credentials and identity settings will be preserved.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowResetModal(false)} className="px-4 py-2 rounded-xl bg-surface-subtle font-bold text-xs text-primary">
                Cancel
              </button>
              <button
                onClick={() => { resetCharacterProgress(); setShowResetModal(false); }}
                className="px-5 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md"
              >
                Confirm Reset →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="apple-card p-6 md:p-8 max-w-md w-full flex flex-col gap-5 border-2 border-red-500 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
              <h3 className="text-xl font-black text-primary">Delete All Account Data</h3>
            </div>
            <p className="text-xs text-primary-muted font-medium leading-relaxed">
              This action is permanent and irreversible. All local profiles, directives, duels, and settings will be permanently wiped.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-xl bg-surface-subtle font-bold text-xs text-primary">
                Cancel
              </button>
              <button
                onClick={() => { deleteAccountData(); }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md"
              >
                Delete Everything & Restart →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Top Section - Character Profile & Real Elapsed Metrics */}
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
              <span className="text-xs text-gold font-mono font-bold">{userTag}</span>
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tight">{safeChar.name || 'Vekta'}</h1>
            <p className="text-sm font-extrabold text-gold mt-0.5">{safeChar.primaryCareer || 'UI Designer'}</p>
          </div>
        </div>

        {/* Real-Time Overview Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle text-center">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Career Tier</span>
            <h4 className="text-base font-black text-primary">Lvl {careerLevel}</h4>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle text-center">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Real Hours Invested</span>
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

      {/* 2. HUNTER ACCOUNT & IDENTITY SETTINGS PANEL */}
      <section className="apple-card p-6 md:p-8 flex flex-col gap-6 shadow-md border-2 border-gold/40">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded gold-gradient text-white uppercase tracking-wider">
                Hunter Profile Settings
              </span>
              <span className="text-xs font-bold text-gold">Identity & Controls</span>
            </div>
            <h3 className="text-xl font-black text-primary tracking-tight">Account & Identity Settings</h3>
            <p className="text-xs text-primary-muted mt-0.5">Manage your Hunter name, unique user ID tag, linked email, and system reset controls.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Edit Hunter Name Form */}
          <form onSubmit={handleSaveName} className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-primary uppercase text-[10px]">Hunter Display Name (Editable)</label>
              {nameSaved && <span className="text-emerald-400 font-extrabold text-[11px]">Saved ✓</span>}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-surface border border-border-subtle font-bold text-primary focus:outline-none focus:border-gold"
              />
              <button type="submit" className="px-4 py-3 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-sm hover:scale-105 transition-transform">
                Save Name
              </button>
            </div>
          </form>

          {/* Unique User ID / Tag Box */}
          <div className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-3 justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-primary uppercase text-[10px]">Unique User ID Tag</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  Verified • Unique
                </span>
              </div>
              <p className="text-[11px] text-primary-muted">Your permanent unique handle on the Hunter Network.</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border-subtle font-mono text-gold font-bold text-sm">
              <span>{userTag}</span>
              <button
                type="button"
                onClick={handleCopyTag}
                className="px-3 py-1 rounded-lg bg-surface-subtle border border-border-subtle text-xs font-sans text-primary-muted hover:text-primary"
              >
                {copiedTag ? 'Copied ✓' : 'Copy Tag'}
              </button>
            </div>
          </div>

          {/* Email Address */}
          <div className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-2">
            <span className="font-extrabold text-primary uppercase text-[10px]">Linked Email Address</span>
            <span className="font-black text-primary text-sm font-mono">{userEmail}</span>
            <span className="text-[10px] text-primary-muted">Authenticated via Firebase System Auth</span>
          </div>

          {/* System Control Actions */}
          <div className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-3 justify-between">
            <span className="font-extrabold text-primary uppercase text-[10px]">Account Operations</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle font-extrabold text-primary text-xs hover:border-gold/40"
              >
                Reset Progress
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 font-extrabold text-red-400 text-xs hover:bg-red-500/20"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. System Theme & Appearance Control Section */}
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

      {/* 4. AI Skill Suggestion Intelligence */}
      <AISkillSuggestionCard />

      {/* 5. Character Attributes Matrix */}
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

      {/* 6. Hierarchical Career Skill Tree */}
      <SkillTreeVisualization />

      {/* 7. Collapsible Skill Categories Accordion */}
      <SkillCategoryAccordion />

      {/* 8. Private Calendar Settings Manager */}
      <section className="apple-card p-6 md:p-8 flex flex-col gap-6 shadow-sm border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Private & Confidential Settings</span>
            <h3 className="text-xl font-black text-primary tracking-tight mt-0.5">Planner & Calendar Preferences</h3>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Settings → Calendar
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-400 text-xl flex-shrink-0 mt-0.5">lock</span>
          <p className="text-xs text-blue-300 font-medium leading-relaxed">
            Your religion and holiday preferences are stored privately in your personal settings document. They are used exclusively to personalize your Planner and are never displayed on your public profile, leaderboards, duels, or shared data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-3">
            <span className="font-extrabold text-primary uppercase text-[10px]">Religion / Holiday Preference</span>
            <span className="font-black text-primary text-sm">
              {privateCalendarSettings?.religion === 'Other'
                ? `Other (${privateCalendarSettings?.customReligionLabel || 'Custom'})`
                : privateCalendarSettings?.religion || 'Prefer Not To Answer'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-3">
            <span className="font-extrabold text-primary uppercase text-[10px]">Selected Region</span>
            <span className="font-black text-gold text-sm">
              {privateCalendarSettings?.country || 'India (IN)'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-extrabold text-primary uppercase">Active Holiday Calendars</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(privateCalendarSettings?.enabledCalendars || ['national_in']).map(calId => (
              <div key={calId} className="p-3 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between font-extrabold text-primary">
                <span>{calId.toUpperCase().replace('_', ' ')} Calendar</span>
                <span className="text-emerald-400 text-[10px]">Active ✓</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
