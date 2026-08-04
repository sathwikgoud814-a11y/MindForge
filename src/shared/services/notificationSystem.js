// Notification System: Event-driven notifications manager

export const NotificationSystem = {
  createNotification({ type, title, message, icon = 'notifications' }) {
    return {
      id: 'notif_' + Date.now(),
      type, // 'MISSION_COMPLETE' | 'LEVEL_UP' | 'REWARD_PURCHASED' | 'DUEL_INVITE' | 'SKILL_LEVEL_UP'
      title,
      message,
      icon,
      timestamp: new Date().toISOString(),
      read: false,
    };
  }
};
