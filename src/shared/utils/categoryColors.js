export function getCategoryBadgeStyle(skillOrCategory = '') {
  const name = String(skillOrCategory).toLowerCase();

  if (name.includes('code') || name.includes('program') || name.includes('tech') || name.includes('architect') || name.includes('api') || name.includes('react') || name.includes('software')) {
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  }
  if (name.includes('fit') || name.includes('workout') || name.includes('hiit') || name.includes('stamina') || name.includes('health') || name.includes('run')) {
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  }
  if (name.includes('bus') || name.includes('strat') || name.includes('manage') || name.includes('product') || name.includes('market') || name.includes('sales')) {
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }
  if (name.includes('design') || name.includes('create') || name.includes('figma') || name.includes('art') || name.includes('ui') || name.includes('ux')) {
    return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  }
  if (name.includes('comm') || name.includes('speak') || name.includes('write') || name.includes('lead') || name.includes('team')) {
    return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
  }

  return 'bg-gold-light/40 text-gold border-gold/30';
}
