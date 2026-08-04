import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { getDynamicSkillTree } from '../../shared/services/careerEngine';

export function SkillCategoryAccordion() {
  const { careerTrees, customSkills, character, setShowCreateSkillModal } = useSystem();
  const [openCategory, setOpenCategory] = useState('Design');

  const safeCareerName = character?.primaryCareer || 'UI/UX Designer';
  const activeCareer = careerTrees[safeCareerName]
    || careerTrees['UI/UX Designer']
    || getDynamicSkillTree(safeCareerName, character?.destinyIdentity || '');

  const tree = activeCareer?.tree || { core: [], supporting: [], advanced: [] };
  const coreSkills = tree.core || [];
  const supportingSkills = tree.supporting || tree.related || [];
  const advancedSkills = tree.advanced || [];

  const allCareerSkills = [...coreSkills, ...supportingSkills, ...advancedSkills];

  const categories = [
    'Design',
    'Technology',
    'Business',
    'Fitness',
    'Communication',
    'Arts',
    'Academics',
    'Finance',
    'Lifestyle',
    'Sports',
    'Medicine',
    'Custom',
  ];

  // Group all skills by category
  const getSkillsForCategory = (cat) => {
    const fromTree = allCareerSkills.filter(s => s.category === cat || (cat === 'Medicine' && safeCareerName.includes('Doctor')));
    const fromCustom = (customSkills || []).filter(s => s.category === cat);
    return [...fromTree, ...fromCustom];
  };

  return (
    <div className="apple-card p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div>
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">category</span>
            Collapsible Skill Categories
          </h3>
          <p className="text-xs text-primary-muted">Browse all career & custom skills organized by domain.</p>
        </div>

        <button
          onClick={() => setShowCreateSkillModal(true)}
          className="px-4 py-2 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          + Custom Skill
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map(cat => {
          const items = getSkillsForCategory(cat);
          const isOpen = openCategory === cat;

          return (
            <div key={cat} className="rounded-2xl border border-border-subtle overflow-hidden transition-all">
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat)}
                className="w-full p-4 bg-surface-subtle hover:bg-white flex items-center justify-between font-extrabold text-xs text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold text-base">folder</span>
                  <span>{cat}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-primary-muted border border-border-subtle">
                    {items.length} Skills
                  </span>
                </div>

                <span className="material-symbols-outlined text-primary-muted">
                  {isOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 bg-white border-t border-border-subtle grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
                  {items.length === 0 ? (
                    <div className="col-span-full py-4 text-center text-xs text-primary-muted font-medium">
                      No skills unlocked under {cat} yet.
                    </div>
                  ) : (
                    items.map((sk, idx) => (
                      <div key={sk.id || idx} className="p-3 rounded-xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-primary">{sk.name}</h4>
                          <span className="text-[10px] text-primary-muted">Level {sk.level || 1}</span>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded gold-gradient text-white uppercase">
                          {sk.tier || 'Core'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
