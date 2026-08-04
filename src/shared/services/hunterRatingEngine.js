export const HUNTER_RANKS = [
  {
    id: 'Recruit',
    label: 'Recruit (Unawakened)',
    minRating: 0,
    icon: 'shield',
    color: 'border-slate-500 text-slate-400 bg-slate-500/10',
    badgeGradient: 'from-slate-600 to-slate-800',
    frame: 'border-slate-600',
    perks: ['Basic Directives Access', 'System Telemetry Logging'],
    unlockedDifficulties: ['B-Rank'],
    cosmetics: ['Recruit Standard Frame'],
  },
  {
    id: 'E-Rank',
    label: 'E-Rank Hunter',
    minRating: 500,
    icon: 'military_tech',
    color: 'border-blue-500 text-blue-400 bg-blue-500/15',
    badgeGradient: 'from-blue-600 to-blue-800',
    frame: 'border-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    perks: ['Side Directives Queue', 'Attribute Radar Matrix'],
    unlockedDifficulties: ['B-Rank', 'A-Rank'],
    cosmetics: ['E-Rank Blue Aura Frame'],
  },
  {
    id: 'D-Rank',
    label: 'D-Rank Hunter',
    minRating: 1200,
    icon: 'military_tech',
    color: 'border-cyan-500 text-cyan-400 bg-cyan-500/15',
    badgeGradient: 'from-cyan-600 to-cyan-800',
    frame: 'border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    perks: ['Planner Focus Chamber Analytics', 'Custom Mission Creation'],
    unlockedDifficulties: ['B-Rank', 'A-Rank'],
    cosmetics: ['D-Rank Cyan Shimmer Frame'],
  },
  {
    id: 'C-Rank',
    label: 'C-Rank Hunter',
    minRating: 2200,
    icon: 'stars',
    color: 'border-emerald-500 text-emerald-400 bg-emerald-500/15',
    badgeGradient: 'from-emerald-600 to-emerald-800',
    frame: 'border-emerald-500/80 shadow-[0_0_20px_rgba(34,197,94,0.35)]',
    perks: ['Live Hunter Duel Arena', 'DP Reward Multipliers (+10%)'],
    unlockedDifficulties: ['B-Rank', 'A-Rank', 'S-Rank'],
    cosmetics: ['C-Rank Emerald Crest Frame'],
  },
  {
    id: 'B-Rank',
    label: 'B-Rank Hunter',
    minRating: 3800,
    icon: 'workspace_premium',
    color: 'border-purple-500 text-purple-400 bg-purple-500/15',
    badgeGradient: 'from-purple-600 to-purple-800',
    frame: 'border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    perks: ['Custom AI Directive Telemetry', 'Mystery Box Tier 2 Drops'],
    unlockedDifficulties: ['A-Rank', 'S-Rank'],
    cosmetics: ['B-Rank Void Purple Frame'],
  },
  {
    id: 'A-Rank',
    label: 'A-Rank Hunter',
    minRating: 6000,
    icon: 'local_fire_department',
    color: 'border-amber-500 text-amber-400 bg-amber-500/15',
    badgeGradient: 'from-amber-600 to-amber-800',
    frame: 'border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.45)]',
    perks: ['Guild Operations & Leaderboards', 'XP Gain Multipliers (+15%)'],
    unlockedDifficulties: ['S-Rank Directives'],
    cosmetics: ['A-Rank Amber Flame Frame'],
  },
  {
    id: 'S-Rank',
    label: 'S-Rank Hunter',
    minRating: 9500,
    icon: 'hotel_class',
    color: 'border-gold text-gold bg-gold-light/40',
    badgeGradient: 'from-amber-400 to-yellow-600',
    frame: 'border-gold shadow-[0_0_30px_rgba(212,175,55,0.5)]',
    perks: ['System Sovereign Telemetry', 'Exclusive Shop Items'],
    unlockedDifficulties: ['S-Rank', 'Boss Class Directives'],
    cosmetics: ['S-Rank Monarch Gold Frame'],
  },
  {
    id: 'National',
    label: 'National Hunter',
    minRating: 14000,
    icon: 'auto_awesome',
    color: 'border-red-500 text-red-400 bg-red-500/15',
    badgeGradient: 'from-red-600 to-red-900',
    frame: 'border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.6)]',
    perks: ['Global Leaderboard Apex Rank', 'National Raid Protocol'],
    unlockedDifficulties: ['National Class Raids'],
    cosmetics: ['National Class Crimson Crest'],
  },
  {
    id: 'Monarch',
    label: 'Shadow Monarch',
    minRating: 20000,
    icon: 'crown',
    color: 'border-purple-600 text-purple-300 bg-purple-950/60',
    badgeGradient: 'from-purple-900 via-purple-600 to-indigo-900',
    frame: 'border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.7)] animate-pulse',
    perks: ['Absolute System Sovereign', 'Monarch Omnipresence Protocol'],
    unlockedDifficulties: ['Monarch Directives'],
    cosmetics: ['Shadow Monarch Sovereign Crown'],
  },
];

export const HunterRatingEngine = {
  calculateRating({ character, attributes = {}, customSkills = [], missions = [], activeDuels = [] }) {
    const level = character?.level ?? 1;
    const xp = character?.xp ?? 0;

    const safeMissions = Array.isArray(missions) ? missions : [];
    const completedCount = safeMissions.filter(m => m.completed).length;
    const completionPct = safeMissions.length > 0 ? (completedCount / safeMissions.length) * 100 : 0;

    const safeSkills = Array.isArray(customSkills) ? customSkills : [];
    const skillLevelSum = safeSkills.reduce((acc, s) => acc + (s.level || 1), 0);

    const safeAttrs = typeof attributes === 'object' && attributes !== null ? attributes : {};
    const attrLevelSum = Object.values(safeAttrs).reduce((acc, a) => acc + (a?.level || 1), 0);

    const bossesDefeated = safeMissions.filter(m => m.completed && (m.difficulty === 'S-Rank' || m.isMainMission)).length;

    const safeDuels = Array.isArray(activeDuels) ? activeDuels : [];
    const duelWins = safeDuels.filter(d => d.status === 'completed' && d.userScore > d.opponentScore).length;

    const streakDays = character?.streakDays || 1;

    const rating = Math.round(
      (level * 50) +
      (xp * 0.4) +
      (completionPct * 5) +
      (skillLevelSum * 30) +
      (attrLevelSum * 25) +
      (bossesDefeated * 100) +
      (duelWins * 120) +
      (streakDays * 15)
    );

    return Math.max(0, rating);
  },

  getRankForRating(rating) {
    let current = HUNTER_RANKS[0];
    for (const rank of HUNTER_RANKS) {
      if (rating >= rank.minRating) {
        current = rank;
      } else {
        break;
      }
    }
    return current;
  },

  getNextRank(currentRankId) {
    const idx = HUNTER_RANKS.findIndex(r => r.id === currentRankId);
    if (idx >= 0 && idx < HUNTER_RANKS.length - 1) {
      return HUNTER_RANKS[idx + 1];
    }
    return null;
  }
};
