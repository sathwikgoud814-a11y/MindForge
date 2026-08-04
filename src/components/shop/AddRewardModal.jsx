import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function AddRewardModal() {
  const { showCreateRewardModal, setShowCreateRewardModal, createReward } = useSystem();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [costDP, setCostDP] = useState(50);
  const [icon, setIcon] = useState('card_giftcard');

  if (!showCreateRewardModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createReward({
      name,
      category,
      costDP,
      icon,
    });

    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-2xl">card_giftcard</span>
            <h3 className="font-extrabold text-base text-primary">Define Custom Comfort Reward</h3>
          </div>
          <button
            onClick={() => setShowCreateRewardModal(false)}
            className="p-1 rounded-lg hover:bg-surface-subtle text-primary-muted"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block font-bold text-primary mb-1">Reward Name</label>
            <input
              type="text"
              required
              placeholder="e.g. 1 Hour Gaming Session / Specialty Coffee"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primary mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Comfort Food">Comfort Food</option>
                <option value="Leisure">Leisure</option>
                <option value="Gaming">Gaming</option>
                <option value="Experience">Experience</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Discipline Cost (DP)</label>
              <input
                type="number"
                value={costDP}
                onChange={e => setCostDP(e.target.value)}
                className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateRewardModal(false)}
              className="px-4 py-2.5 rounded-xl bg-surface-subtle text-primary-muted font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl gold-gradient text-white font-bold shadow-md hover:scale-105 transition-transform"
            >
              Save Reward
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
