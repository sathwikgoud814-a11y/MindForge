// Progression Engine: Pure mathematical formulas for XP, Levels, and Ranks

export const ProgressionEngine = {
  getRankForLevel(lvl) {
    if (lvl < 2) return 'Recruit Rank';
    if (lvl < 5) return 'E-Rank';
    if (lvl < 10) return 'D-Rank';
    if (lvl < 18) return 'C-Rank';
    if (lvl < 28) return 'B-Rank';
    if (lvl < 40) return 'A-Rank';
    return 'S-Rank';
  },

  calculateLevelAdvance(currentXP, xpGained, currentLevel, xpToNextLevel) {
    let newXP = currentXP + xpGained;
    let newLevel = currentLevel;
    let newXpToNext = xpToNextLevel;
    let leveledUp = false;

    while (newXP >= newXpToNext) {
      newXP -= newXpToNext;
      newLevel += 1;
      newXpToNext = Math.round(newXpToNext * 1.3);
      leveledUp = true;
    }

    const newRank = this.getRankForLevel(newLevel);

    return {
      newXP,
      newLevel,
      newXpToNext,
      newRank,
      leveledUp,
    };
  },

  calculateSkillAdvance(currentSkillXP, xpGained, currentSkillLevel, xpToNext) {
    let newXP = currentSkillXP + Math.round(xpGained * 0.5);
    let newLvl = currentSkillLevel;
    let newNext = xpToNext;

    while (newXP >= newNext) {
      newXP -= newNext;
      newLvl += 1;
      newNext = Math.round(newNext * 1.25);
    }

    return { newXP, newLvl, newNext };
  }
};
