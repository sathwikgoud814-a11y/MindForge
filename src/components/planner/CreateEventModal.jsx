import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { EVENT_TYPES } from '../../shared/services/calendarEventEngine';

export function CreateEventModal({ isOpen, onClose }) {
  const { addCustomEvent } = useSystem();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('mission');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('09:00 AM');
  const [duration, setDuration] = useState('60 Mins');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('High');
  const [reminder, setReminder] = useState('15 mins before');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCustomEvent({
      id: `evt_${Date.now()}`,
      title,
      type: eventType,
      date,
      time,
      duration,
      location,
      priority,
      reminder,
      notes,
      color: EVENT_TYPES.find(t => t.id === eventType)?.color || '#D4AF37',
    });

    onClose();
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="apple-card p-6 md:p-8 max-w-lg w-full flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-200 relative border-2 border-gold">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-2xl">event</span>
            <h3 className="text-xl font-black text-primary tracking-tight">Create Schedule Event</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-primary-muted hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Event Title */}
          <div className="flex flex-col gap-1.5">
            <label className="font-extrabold text-primary">Event Title / Protocol Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Deep Work Architecture Session"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-primary font-bold focus:outline-none focus:border-gold"
            />
          </div>

          {/* Event Type Grid */}
          <div className="flex flex-col gap-1.5">
            <label className="font-extrabold text-primary">Event Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EVENT_TYPES.map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setEventType(t.id)}
                  className={`p-2.5 rounded-xl font-extrabold border transition-all flex items-center gap-2 text-left ${
                    eventType === t.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-subtle text-primary-muted border-border-subtle hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-base" style={{ color: eventType === t.id ? '#FFF' : t.color }}>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-primary">Scheduled Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-primary font-bold focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-primary">Start Time</label>
              <input
                type="text"
                placeholder="09:00 AM"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-primary font-bold focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Priority & Reminder */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-primary">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-primary font-bold focus:outline-none focus:border-gold"
              >
                <option value="High">⚡ High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-primary">Reminder Notice</label>
              <select
                value={reminder}
                onChange={e => setReminder(e.target.value)}
                className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-primary font-bold focus:outline-none focus:border-gold"
              >
                <option value="5 mins before">5 Mins Before</option>
                <option value="15 mins before">15 Mins Before</option>
                <option value="30 mins before">30 Mins Before</option>
                <option value="1 hour before">1 Hour Before</option>
                <option value="1 day before">1 Day Before</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-2 uppercase tracking-wider"
          >
            Add to Schedule →
          </button>
        </form>
      </div>
    </div>
  );
}
