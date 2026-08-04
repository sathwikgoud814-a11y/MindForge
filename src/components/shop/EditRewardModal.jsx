import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';

export function EditRewardModal() {
  const { editingReward, setEditingReward, updateReward, deleteReward } = useSystem();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Comfort');
  const [costDP, setCostDP] = useState(50);
  const [icon, setIcon] = useState('card_giftcard');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingReward) {
      setName(editingReward.name || '');
      setCategory(editingReward.category || 'Comfort');
      setCostDP(editingReward.costDP || 50);
      setIcon(editingReward.icon || 'card_giftcard');
      setDescription(editingReward.description || '');
    }
  }, [editingReward]);

  if (!editingReward) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateReward(editingReward.id, {
      name,
      category,
      costDP: Number(costDP) || 50,
      icon,
      description,
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete reward "${editingReward.name}" from your shop inventory?`)) {
      deleteReward(editingReward.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-2xl">edit</span>
            <h3 className="font-extrabold text-base text-primary">Edit Reward ({editingReward.name})</h3>
          </div>
          <button
            onClick={() => setEditingReward(null)}
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
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primary mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold"
              >
                <option value="Comfort">Comfort</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Food">Food</option>
                <option value="Wellness">Wellness</option>
                <option value="Cosmetics">Cosmetics</option>
                <option value="Unlockables">Unlockables</option>
                <option value="Mystery Boxes">Mystery Boxes</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-primary mb-1">Cost (DP)</label>
              <input
                type="number"
                min="1"
                value={costDP}
                onChange={e => setCostDP(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-primary mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Comfort description..."
              className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-extrabold text-xs border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              Delete Reward
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingReward(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-subtle text-primary-muted font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient text-white font-extrabold shadow-md hover:scale-105 transition-transform"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
