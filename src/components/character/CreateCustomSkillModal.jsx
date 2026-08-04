import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { PREDEFINED_SKILLS_LIBRARY } from '../../shared/services/aiEngine';

export function CreateCustomSkillModal() {
  const { showCreateSkillModal, setShowCreateSkillModal, addCustomSkill } = useSystem();

  const [category, setCategory] = useState('Technology');
  const [skillSearch, setSkillSearch] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!showCreateSkillModal) return null;

  const availablePredefinedSkills = (PREDEFINED_SKILLS_LIBRARY[category] || []).filter(sk =>
    sk.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const handleSelectSkill = (skillName) => {
    addCustomSkill({ name: skillName, category });
    setShowCreateSkillModal(false);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;
    addCustomSkill({ name: customSkillName, category });
    setCustomSkillName('');
    setShowCustomInput(false);
    setShowCreateSkillModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              Skill Telemetry Engine
            </span>
            <h3 className="font-black text-lg text-primary mt-1">Add Skill to Character Tree</h3>
          </div>
          <button
            onClick={() => setShowCreateSkillModal(false)}
            className="p-1.5 rounded-xl hover:bg-surface-subtle text-primary-muted"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          {/* Step 1: Category Selector */}
          <div>
            <label className="block font-bold text-primary mb-1">1. Select Skill Category</label>
            <select
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                setSkillSearch('');
              }}
              className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none"
            >
              {Object.keys(PREDEFINED_SKILLS_LIBRARY).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Search Predefined Skill Library */}
          {!showCustomInput ? (
            <div>
              <label className="block font-bold text-primary mb-1">2. Search & Select Predefined Skill</label>
              <div className="p-2.5 bg-surface-subtle rounded-xl border border-border-subtle flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary-muted text-sm pl-1">search</span>
                <input
                  type="text"
                  placeholder={`Search ${category} Skills...`}
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                  className="w-full bg-transparent text-primary font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                {availablePredefinedSkills.map(sk => (
                  <div
                    key={sk}
                    onClick={() => handleSelectSkill(sk)}
                    className="p-3 rounded-xl bg-surface-subtle border border-border-subtle flex items-center justify-between cursor-pointer hover:border-gold/50 hover:bg-gold-light/40 transition-colors"
                  >
                    <span className="font-extrabold text-primary">{sk}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md gold-gradient text-white">
                      + Add to Tree
                    </span>
                  </div>
                ))}

                {availablePredefinedSkills.length === 0 && (
                  <div className="p-4 text-center text-primary-muted font-medium">
                    No matching predefined skills found in {category}.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border-subtle text-center">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="text-xs font-extrabold text-gold hover:underline"
                >
                  + Can't find your skill? Create Custom Skill →
                </button>
              </div>
            </div>
          ) : (
            /* Step 3: Create Custom Skill with AI Validation */
            <form onSubmit={handleAddCustom} className="flex flex-col gap-3 pt-1">
              <div className="p-3 rounded-xl bg-gold-light/60 border border-gold/30 flex items-center justify-between text-xs">
                <span className="font-extrabold text-primary">Creating Custom Skill under {category}</span>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="text-primary-muted font-bold hover:text-primary"
                >
                  ← Back to Library
                </button>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Custom Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CUDA / Spline 3D / LangGraph..."
                  value={customSkillName}
                  onChange={e => setCustomSkillName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient text-white font-extrabold shadow-md hover:scale-105 transition-transform"
              >
                AI Validate & Add Custom Skill →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
