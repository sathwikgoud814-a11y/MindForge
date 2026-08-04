// Timeline Engine: Player Story & Milestone Logger

export const TimelineEngine = {
  createEntry({ type, title, description, icon = 'stars', xpGained = 0, dpGained = 0 }) {
    return {
      id: 'timeline_' + Date.now(),
      type, // 'MISSION' | 'LEVEL_UP' | 'REWARD' | 'DUEL_WON' | 'CAREER_MILESTONE'
      title,
      description,
      icon,
      xpGained,
      dpGained,
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  }
};
