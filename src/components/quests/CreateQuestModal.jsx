import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function CreateQuestModal() {
  const { createQuestModalOpen, setCreateQuestModalOpen, createQuest } = useSystem();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('DAILY');
  const [tier, setTier] = useState('A-Rank');
  const [xpReward, setXpReward] = useState(300);
  const [goldReward, setGoldReward] = useState(150);
  const [statReward, setStatReward] = useState('+1 Strength');
  const [stepsInput, setStepsInput] = useState('');

  if (!createQuestModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const steps = stepsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    createQuest({
      title,
      description,
      type,
      tier,
      xpReward,
      goldReward,
      statReward,
      steps: steps.length > 0 ? steps : [title],
    });

    setTitle('');
    setDescription('');
    setStepsInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-black/10 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-gold text-2xl">workspace_premium</span>
            <h3 className="font-extrabold text-lg text-primary">System Quest Creator</h3>
          </div>
          <button
            onClick={() => setCreateQuestModalOpen(false)}
            className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block font-bold text-primary mb-1">Quest Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Daily Quest: Master State Management"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary focus:outline-none focus:ring-2 focus:ring-secondary-gold"
            />
          </div>

          <div>
            <label className="block font-bold text-primary mb-1">Description Directive</label>
            <textarea
              placeholder="Brief explanation of objective details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary focus:outline-none focus:ring-2 focus:ring-secondary-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primary mb-1">Quest Category</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary"
              >
                <option value="DAILY">DAILY</option>
                <option value="URGENT">URGENT</option>
                <option value="SIDE">SIDE</option>
                <option value="PENALTY">PENALTY</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Difficulty Tier</label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary"
              >
                <option value="E-Rank">E-Rank</option>
                <option value="C-Rank">C-Rank</option>
                <option value="B-Rank">B-Rank</option>
                <option value="A-Rank">A-Rank</option>
                <option value="S-Rank">S-Rank</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-primary mb-1">XP Reward</label>
              <input
                type="number"
                value={xpReward}
                onChange={e => setXpReward(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-primary mb-1">Gold Reward</label>
              <input
                type="number"
                value={goldReward}
                onChange={e => setGoldReward(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary"
              />
            </div>
            <div>
              <label className="block font-bold text-primary mb-1">Stat Bonus</label>
              <input
                type="text"
                value={statReward}
                onChange={e => setStatReward(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-primary mb-1">Sub-Steps (One per line)</label>
            <textarea
              placeholder="Step 1: Write code&#10;Step 2: Test features&#10;Step 3: Deploy"
              value={stepsInput}
              onChange={e => setStepsInput(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-black/10 bg-surface-container-low text-primary focus:outline-none focus:ring-2 focus:ring-secondary-gold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreateQuestModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-bold hover:bg-surface-container-high"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gold-gradient text-white font-bold shadow-md hover:scale-105 transition-transform"
            >
              Publish Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
