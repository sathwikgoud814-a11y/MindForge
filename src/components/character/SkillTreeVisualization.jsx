import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { getDynamicSkillTree } from '../../shared/services/careerEngine';

export function SkillTreeVisualization() {
  const { character, careerTrees = {}, setShowCareerModal } = useSystem();
  const [expandedTiers, setExpandedTiers] = useState({ core: true, supporting: true, advanced: true });

  const safeCareerName = character?.primaryCareer || 'UI/UX Designer';
  const activeCareer = (careerTrees && careerTrees[safeCareerName])
    || (careerTrees && careerTrees['UI/UX Designer'])
    || getDynamicSkillTree(safeCareerName, character?.destinyIdentity || '');

  const tree = activeCareer?.tree || { core: [], supporting: [], advanced: [] };
  const coreSkills = Array.isArray(tree.core) ? tree.core : [];
  const supportingSkills = Array.isArray(tree.supporting) ? tree.supporting : (Array.isArray(tree.related) ? tree.related : []);
  const advancedSkills = Array.isArray(tree.advanced) ? tree.advanced : [];

  const toggleTier = (tier) => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <div className="apple-card p-6 md:p-8 flex flex-col gap-6 shadow-sm">
      {/* Career Header Node */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gold-gradient text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-3xl">{activeCareer?.icon || 'stars'}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary text-white uppercase tracking-wider">
                Primary Career Tree
              </span>
              <span className="text-xs font-extrabold text-gold">Level {character?.careerLevel ?? 1}</span>
            </div>
            <h3 className="text-2xl font-black text-primary tracking-tight">{activeCareer?.career || safeCareerName}</h3>
          </div>
        </div>

        <button
          onClick={() => setShowCareerModal?.(true)}
          className="px-4 py-2.5 rounded-xl bg-surface-subtle text-primary font-extrabold text-xs border border-border-subtle hover:border-gold/40 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-gold text-base">alt_route</span>
          Switch / Add Career
        </button>
      </div>

      {/* Tree Structure: Core -> Supporting -> Advanced */}
      <div className="flex flex-col gap-6 relative pl-4 border-l-2 border-gold/30">
        {/* Core Skills Tier */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => toggleTier('core')}
            className="flex items-center gap-2 text-xs font-black text-gold uppercase tracking-wider hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">
              {expandedTiers.core ? 'expand_more' : 'chevron_right'}
            </span>
            Core Skills ({coreSkills.length})
          </button>

          {expandedTiers.core && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4">
              {coreSkills.map((sk, idx) => (
                <SkillNodeCard key={sk?.id || sk?.name || idx} skill={sk} badgeColor="bg-gold text-white" />
              ))}
            </div>
          )}
        </div>

        {/* Supporting Skills Tier */}
        {supportingSkills.length > 0 && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => toggleTier('supporting')}
              className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-base">
                {expandedTiers.supporting ? 'expand_more' : 'chevron_right'}
              </span>
              Supporting Skills ({supportingSkills.length})
            </button>

            {expandedTiers.supporting && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4">
                {supportingSkills.map((sk, idx) => (
                  <SkillNodeCard key={sk?.id || sk?.name || idx} skill={sk} badgeColor="bg-surface-subtle text-primary border border-border-subtle" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Advanced Skills Tier */}
        {advancedSkills.length > 0 && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => toggleTier('advanced')}
              className="flex items-center gap-2 text-xs font-black text-primary-muted uppercase tracking-wider hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-base">
                {expandedTiers.advanced ? 'expand_more' : 'chevron_right'}
              </span>
              Advanced Skills ({advancedSkills.length})
            </button>

            {expandedTiers.advanced && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4">
                {advancedSkills.map((sk, idx) => (
                  <SkillNodeCard key={sk?.id || sk?.name || idx} skill={sk} badgeColor="bg-surface-subtle text-primary-muted border border-border-subtle" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillNodeCard({ skill, badgeColor }) {
  if (!skill) return null;
  const lvl = skill.level ?? 1;
  const xp = skill.xp ?? 0;
  const xpToNext = skill.xpToNext ?? 100;
  const progressPct = Math.min(100, Math.round((xp / (xpToNext || 100)) * 100));

  return (
    <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col justify-between gap-3 shadow-2xs hover:border-gold/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${badgeColor}`}>
          {skill.tier || 'Skill'}
        </span>
        <span className="text-xs font-black text-gold">Lvl {lvl}</span>
      </div>

      <div>
        <h4 className="font-extrabold text-sm text-primary">{skill.name || 'Skill Node'}</h4>
        <p className="text-[11px] text-primary-muted font-medium mt-0.5">{skill.category || 'Specialization'}</p>
      </div>

      <div className="flex flex-col gap-1 text-[10px]">
        <div className="flex justify-between font-bold text-primary-muted">
          <span>XP Progress</span>
          <span>{xp} / {xpToNext}</span>
        </div>
        <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-border-subtle">
          <div className="gold-gradient h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>
    </div>
  );
}
