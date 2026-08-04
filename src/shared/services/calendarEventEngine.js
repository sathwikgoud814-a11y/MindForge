export const EVENT_TYPES = [
  { id: 'mission', label: 'RPG Mission Block', icon: 'workspace_premium', color: '#D4AF37' },
  { id: 'meeting', label: 'Meeting', icon: 'groups', color: '#3B82F6' },
  { id: 'study', label: 'Study Session', icon: 'menu_book', color: '#A855F7' },
  { id: 'workout', label: 'Workout', icon: 'fitness_center', color: '#22C55E' },
  { id: 'reminder', label: 'Reminder', icon: 'notifications', color: '#F97316' },
  { id: 'birthday', label: 'Birthday / Custom Annual', icon: 'cake', color: '#EC4899' },
  { id: 'custom', label: 'Custom Event', icon: 'event', color: '#06B6D4' },
];

export const CalendarEventEngine = {
  exportToICS(events = [], calendarName = 'MindForge RPG Calendar') {
    let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MindForge//RPG Calendar Engine//EN\r\nX-WR-CALNAME:${calendarName}\r\n`;

    events.forEach(evt => {
      const dtStart = evt.date ? evt.date.replace(/-/g, '') + 'T090000Z' : '20260804T090000Z';
      const dtEnd = evt.date ? evt.date.replace(/-/g, '') + 'T100000Z' : '20260804T100000Z';
      icsContent += `BEGIN:VEVENT\r\nUID:${evt.id}@mindforge.app\r\nSUMMARY:${evt.title || evt.name}\r\nDESCRIPTION:${evt.description || 'RPG Schedule Event'}\r\nDTSTART:${dtStart}\r\nDTEND:${dtEnd}\r\nEND:VEVENT\r\n`;
    });

    icsContent += 'END:VCALENDAR\r\n';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MindForge_Calendar_${new Date().toISOString().slice(0, 10)}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  detectConflicts(events = []) {
    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (events[i].date === events[j].date && events[i].time === events[j].time && events[i].time) {
          conflicts.push({ eventA: events[i], eventB: events[j] });
        }
      }
    }
    return conflicts;
  },

  generateAiOptimizedSchedule(missions = [], energyLevel = 'High') {
    const uncompleted = missions.filter(m => !m.completed);
    const optimized = uncompleted.map((m, idx) => {
      const startHour = 9 + idx * 2;
      return {
        ...m,
        scheduledTime: `${startHour > 12 ? startHour - 12 : startHour}:00 ${startHour >= 12 ? 'PM' : 'AM'}`,
        aiNote: `Optimized for ${energyLevel} Energy Focus window.`,
      };
    });
    return optimized;
  }
};
