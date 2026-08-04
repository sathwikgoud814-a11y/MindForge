import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function HabitTracker() {
  const { habits, checkInHabit, createHabit } = useSystem();
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Focus');
  const [newXpValue, setNewXpValue] = useState(100);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createHabit({
      title: newTitle,
      category: newCategory,
      xpValue: Number(newXpValue),
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-black/5 premium-shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              Consistency Matrix
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Habit Tracker</h1>
          <p className="text-xs text-on-surface-variant">Build unshakeable daily habits to compound stat growth.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-black text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-secondary-gold/30 shadow-md"
        >
          <span className="material-symbols-outlined text-secondary-gold text-lg">add_circle</span>
          Add New Habit
        </button>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-surface p-6 rounded-2xl border border-black/10 shadow-lg flex flex-col gap-4 text-xs animate-in fade-in duration-200">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-gold">add_task</span>
            Configure New Daily Habit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1 text-primary">Habit Name</label>
              <input
                type="text"
                required
                placeholder="e.g. 10km Morning Run"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-black/10 bg-surface-container-low"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-primary">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-black/10 bg-surface-container-low"
              >
                <option value="Focus">Focus</option>
                <option value="Knowledge">Knowledge</option>
                <option value="Vitality">Vitality</option>
                <option value="Agility">Agility</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-primary">XP Reward per Check-in</label>
              <input
                type="number"
                value={newXpValue}
                onChange={e => setNewXpValue(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-black/10 bg-surface-container-low"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient text-white font-bold"
            >
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Habit List & Matrix */}
      <div className="flex flex-col gap-4">
        {habits.map(h => (
          <div key={h.id} className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                <span className="material-symbols-outlined text-2xl">local_fire_department</span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant">
                    {h.category}
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    🔥 {h.streak} Day Streak (Best: {h.bestStreak})
                  </span>
                </div>
                <h3 className="font-bold text-base text-primary">{h.title}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Target: {h.targetDaysPerWeek} Days / Week • Reward: +{h.xpValue} XP</p>
              </div>
            </div>

            {/* Matrix & Check-in CTA */}
            <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto">
              {/* History Dots */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {h.history.slice(-10).map((done, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      done ? 'gold-gradient text-white shadow-sm' : 'bg-surface-container text-on-surface-variant/40'
                    }`}
                    title={`Day ${idx + 1}: ${done ? 'Completed' : 'Missed'}`}
                  >
                    {done ? '✓' : '•'}
                  </div>
                ))}
              </div>

              {/* Check-in Button */}
              <button
                onClick={() => checkInHabit(h.id)}
                className="gold-gradient hover:scale-105 active:scale-95 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 flex-shrink-0 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                Check In (+{h.xpValue} XP)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
