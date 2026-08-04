export const PREDEFINED_SKILLS_LIBRARY = {
  Technology: [
    'JavaScript & TypeScript',
    'React & Ecosystem',
    'Node.js & Express REST APIs',
    'Data Structures & Algorithms',
    'Python & NumPy',
    'PyTorch Deep Learning',
    'System Architecture Design',
    'Git & Version Control',
    'SQL & PostgreSQL Database',
    'Docker & Kubernetes',
    'GraphQL & REST APIs',
  ],
  Design: [
    'UI Design & Layout',
    'UX Research & Persona',
    'Figma & Components',
    'Design Systems & Tokens',
    'Typography & Hierarchy',
    'Wireframing & User Flow',
    'Web Accessibility (WCAG)',
    'Interactive Prototyping',
    'Color Theory & Branding',
    '3D Modeling & Blender',
  ],
  Business: [
    'Business Strategy & Validation',
    'Product Marketing & Growth',
    'Sales & Pitching',
    'Financial Modeling',
    'Agile Product Management',
    'Customer Discovery Interviews',
  ],
  Fitness: [
    'Calisthenics & Strength Training',
    'Endurance & Cardio Running',
    'High Intensity Interval Training (HIIT)',
    'Flexibility & Mobility',
    'Nutrition & Macro Tracking',
  ],
  Academics: [
    'Deep Focus Reading & Retention',
    'Academic Paper Writing',
    'Mathematics & Calculus',
    'Physics & Problem Solving',
  ],
  Communication: [
    'Public Speaking & Presentation',
    'Technical Writing & Documentation',
    'Active Listening & Negotiation',
    'Cross-Functional Collaboration',
  ],
  Lifestyle: [
    'Circadian Rhythm & Sleep Optimization',
    'Mindfulness & Cold Hydrotherapy',
    'Daily Reflection & Journaling',
    'Time Blocking & Task Batching',
  ],
};

const NON_GROWTH_KEYWORDS = [
  'netflix', 'game', 'gaming', 'play station', 'xbox', 'movie', 'show', 'tv', 'couch',
  'nap', 'sleep', 'junk food', 'ice cream', 'scroll', 'instagram', 'tiktok', 'reels', 'youtube shorts', 'beer', 'alcohol'
];

/**
 * Helper to call backend domain-specific AI API endpoint
 */
async function callDomainAiEndpoint(endpoint, payload, fallbackFn) {
  try {
    const res = await fetch(`/api/ai/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    if (json && json.success && json.data) {
      return json.data;
    }

    throw new Error(json?.message || 'The System is temporarily unavailable.');
  } catch (err) {
    console.warn(`[AI Domain Endpoint /api/ai/${endpoint} Fallback]:`, err.message);
    return fallbackFn();
  }
}

// 1. Validate Custom Mission & Non-Growth Shield
export async function analyzeCustomMission(missionTitle, category, character = {}) {
  const lower = (missionTitle || '').toLowerCase().trim();

  // Instant local check for non-growth shield
  if (NON_GROWTH_KEYWORDS.some(kw => lower.includes(kw))) {
    return {
      isGrowth: false,
      redirectReward: true,
      reason: `Non-Growth Activity Detected: "${missionTitle}" is a comfort activity and does not contribute to character leveling or attribute growth.`,
      recommendation: `Add "${missionTitle}" to your Reward Shop inventory as a redeemable comfort reward.`,
    };
  }

  const fallback = () => {
    let difficulty = 'B-Rank';
    let estimatedDuration = '45 Mins';
    let xpReward = 90;
    let dpReward = 45;

    if (lower.includes('build') || lower.includes('architecture') || lower.includes('s-rank')) {
      difficulty = 'S-Rank';
      estimatedDuration = '60 Mins';
      xpReward = 130;
      dpReward = 65;
    } else if (lower.includes('solve') || lower.includes('design') || lower.includes('a-rank')) {
      difficulty = 'A-Rank';
      estimatedDuration = '45 Mins';
      xpReward = 105;
      dpReward = 50;
    }

    let relatedSkills = [PREDEFINED_SKILLS_LIBRARY[category]?.[0] || 'UI Design & Layout'];
    let attributesImproved = ['Knowledge +10 XP', 'Focus +8 XP'];

    return {
      isGrowth: true,
      difficulty,
      estimatedDuration,
      xpReward,
      dpReward,
      relatedSkills,
      attributesImproved,
      rationale: `System Telemetry Scan Complete: Directive linked to ${relatedSkills.join(' & ')}.`,
    };
  };

  return await callDomainAiEndpoint('validate-mission', { missionTitle, category, context: { character } }, fallback);
}

// 2. Generate Recommended Directives
export async function generateRecommendedDirectives(character = {}) {
  const fallback = () => {
    const career = character.primaryCareer || 'Software Engineer';
    const c = career.toLowerCase();

    if (c.includes('software') || c.includes('frontend') || c.includes('fullstack') || c.includes('backend') || c.includes('developer')) {
      return [
        {
          id: 'rec_se1',
          name: 'Architect & Deploy Modular Full-Stack REST API',
          difficulty: 'S-Rank',
          estimatedDuration: '60 Mins',
          xpReward: 130,
          dpReward: 65,
          isMainMission: true,
          relatedSkills: ['JavaScript & TypeScript', 'Node.js & Express REST APIs'],
          attributesImproved: ['Knowledge +14 XP', 'Focus +10 XP'],
        },
        {
          id: 'rec_se2',
          name: 'Execute 45-Minute Algorithmic DS&A Refactoring',
          difficulty: 'A-Rank',
          estimatedDuration: '45 Mins',
          xpReward: 105,
          dpReward: 50,
          isMainMission: false,
          relatedSkills: ['Data Structures & Algorithms'],
          attributesImproved: ['Knowledge +10 XP', 'Focus +8 XP'],
        },
        {
          id: 'rec_se3',
          name: '30-Minute Architecture & Code Quality Review',
          difficulty: 'B-Rank',
          estimatedDuration: '30 Mins',
          xpReward: 85,
          dpReward: 40,
          isMainMission: false,
          relatedSkills: ['System Architecture Design'],
          attributesImproved: ['Discipline +10 XP', 'Focus +8 XP'],
        },
      ];
    }

    if (c.includes('ai') || c.includes('data') || c.includes('machine learning')) {
      return [
        {
          id: 'rec_ai1',
          name: 'Train & Fine-Tune Neural Network Feature Model',
          difficulty: 'S-Rank',
          estimatedDuration: '60 Mins',
          xpReward: 140,
          dpReward: 70,
          isMainMission: true,
          relatedSkills: ['PyTorch Deep Learning', 'Python & NumPy'],
          attributesImproved: ['Knowledge +16 XP', 'Focus +12 XP'],
        },
        {
          id: 'rec_ai2',
          name: 'Perform Data Cleaning & Feature Vector Optimization',
          difficulty: 'A-Rank',
          estimatedDuration: '45 Mins',
          xpReward: 110,
          dpReward: 55,
          isMainMission: false,
          relatedSkills: ['SQL & PostgreSQL Database', 'Python & NumPy'],
          attributesImproved: ['Knowledge +12 XP', 'Discipline +8 XP'],
        },
        {
          id: 'rec_ai3',
          name: '30-Minute Model Evaluation & Hyperparameter Tuning',
          difficulty: 'B-Rank',
          estimatedDuration: '30 Mins',
          xpReward: 90,
          dpReward: 45,
          isMainMission: false,
          relatedSkills: ['Data Structures & Algorithms'],
          attributesImproved: ['Focus +10 XP', 'Knowledge +8 XP'],
        },
      ];
    }

    if (c.includes('design') || c.includes('ux') || c.includes('ui')) {
      return [
        {
          id: 'rec_ui1',
          name: 'Design Figma UI Components & Design System Tokens',
          difficulty: 'S-Rank',
          estimatedDuration: '60 Mins',
          xpReward: 130,
          dpReward: 65,
          isMainMission: true,
          relatedSkills: ['UI Design & Layout', 'Figma & Components'],
          attributesImproved: ['Creativity +14 XP', 'Focus +10 XP'],
        },
        {
          id: 'rec_ui2',
          name: 'Conduct UX Research Persona & Flow Analysis',
          difficulty: 'A-Rank',
          estimatedDuration: '45 Mins',
          xpReward: 105,
          dpReward: 50,
          isMainMission: false,
          relatedSkills: ['UX Research & Persona', 'Wireframing & User Flow'],
          attributesImproved: ['Knowledge +10 XP', 'Communication +8 XP'],
        },
        {
          id: 'rec_ui3',
          name: '30-Minute Web Accessibility (WCAG 2.1) Audit',
          difficulty: 'B-Rank',
          estimatedDuration: '30 Mins',
          xpReward: 85,
          dpReward: 40,
          isMainMission: false,
          relatedSkills: ['Web Accessibility (WCAG)', 'Typography & Hierarchy'],
          attributesImproved: ['Creativity +10 XP', 'Focus +8 XP'],
        },
      ];
    }

    if (c.includes('product') || c.includes('business') || c.includes('entrepreneur')) {
      return [
        {
          id: 'rec_pm1',
          name: 'Synthesize Product Roadmap & Feature Validation Specs',
          difficulty: 'S-Rank',
          estimatedDuration: '60 Mins',
          xpReward: 135,
          dpReward: 65,
          isMainMission: true,
          relatedSkills: ['Business Strategy & Validation', 'Agile Product Management'],
          attributesImproved: ['Knowledge +14 XP', 'Communication +10 XP'],
        },
        {
          id: 'rec_pm2',
          name: 'Conduct Customer Discovery Interviews & Feedback Synthesis',
          difficulty: 'A-Rank',
          estimatedDuration: '45 Mins',
          xpReward: 110,
          dpReward: 55,
          isMainMission: false,
          relatedSkills: ['Customer Discovery Interviews', 'Product Marketing & Growth'],
          attributesImproved: ['Communication +12 XP', 'Knowledge +8 XP'],
        },
        {
          id: 'rec_pm3',
          name: '30-Minute Growth Funnel Conversion Review',
          difficulty: 'B-Rank',
          estimatedDuration: '30 Mins',
          xpReward: 85,
          dpReward: 40,
          isMainMission: false,
          relatedSkills: ['Financial Modeling'],
          attributesImproved: ['Focus +10 XP', 'Knowledge +8 XP'],
        },
      ];
    }

    return [
      {
        id: 'rec_gen1',
        name: `Execute 60-Minute ${career} Core Mastery Directive`,
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 130,
        dpReward: 65,
        isMainMission: true,
        relatedSkills: [career],
        attributesImproved: ['Knowledge +14 XP', 'Focus +10 XP'],
      },
      {
        id: 'rec_gen2',
        name: `45-Minute ${career} Technical Execution`,
        difficulty: 'A-Rank',
        estimatedDuration: '45 Mins',
        xpReward: 105,
        dpReward: 50,
        isMainMission: false,
        relatedSkills: [career],
        attributesImproved: ['Knowledge +10 XP', 'Discipline +8 XP'],
      },
      {
        id: 'rec_gen3',
        name: '30-Minute Deep Focus Reflection & Skill Conditioning',
        difficulty: 'B-Rank',
        estimatedDuration: '30 Mins',
        xpReward: 85,
        dpReward: 40,
        isMainMission: false,
        relatedSkills: ['Time Blocking & Task Batching'],
        attributesImproved: ['Focus +10 XP', 'Discipline +8 XP'],
      },
    ];
  };

  const res = await callDomainAiEndpoint('generate-missions', { context: { character } }, fallback);
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.missions)) return res.missions;
  return fallback();
}

// 3. Recommend Skills
export async function recommendSkills(character, skills) {
  const fallback = () => ({
    suggestedSkills: [
      { name: 'System Architecture Design', category: 'Technology', reason: 'High leverage for engineering scaling', priority: 'High' }
    ],
    careerExpansion: 'Consider expanding into Product Leadership & Architecture.',
  });
  return await callDomainAiEndpoint('recommend-skills', { context: { character, skills } }, fallback);
}

// 4. Analyze Character
export async function analyzeCharacter(character, missions) {
  const fallback = () => ({
    archetype: character.archetype || 'Creative Builder',
    strengths: character.strongestTraits || ['Creativity', 'Curiosity'],
    weaknesses: character.weakestTraits || ['Consistency', 'Focus'],
    improvementAreas: character.weakestTraits || ['Consistency', 'Focus'],
    highestRoiNextStep: 'Execute 1 S-Rank Deep Work directive daily to build focus stamina.',
  });
  return await callDomainAiEndpoint('analyze-character', { context: { character, missions } }, fallback);
}

// 5. Weekly Review
export async function generateWeeklyReview(character, missions) {
  const fallback = () => ({
    summary: {
      missionsCompleted: character.completedMissionsCount || 0,
      focusHours: character.hoursInvested || 0,
      workoutHours: 3.5,
      studyHours: 8.0,
      xpEarned: character.xp || 0,
      dpEarned: character.dp || 0,
    },
    skillGrowth: ['UI Design & Layout Lvl +1', 'Figma & Components Lvl +1'],
    attributeGrowth: ['Focus +25 XP', 'Creativity +18 XP'],
    recommendationsForNextWeek: ['Increase daily focus duration by 15 mins', 'Maintain streak continuity'],
  });
  return await callDomainAiEndpoint('weekly-review', { context: { character, missions } }, fallback);
}

// 6. Monthly Review
export async function generateMonthlyReview(character) {
  const fallback = () => ({
    strongestImprovements: ['Systematic directive execution', 'DP discipline preservation'],
    neglectedSkills: ['Public Speaking & Presentation'],
    strategicChanges: ['Integrate 2 endurance sessions weekly'],
    monthlyGrade: 'A',
  });
  return await callDomainAiEndpoint('monthly-review', { context: { character } }, fallback);
}

// 7. Recommend Reward
export async function recommendReward(character) {
  const fallback = () => ({
    recommendedRewards: [
      { name: 'Specialty Espresso Coffee', costDP: 90, category: 'Food', reason: 'Controlled reward payout' }
    ],
    burnoutRisk: 'Low',
  });
  return await callDomainAiEndpoint('recommend-reward', { context: { character } }, fallback);
}

// 8. Analyze Duel
export async function analyzeDuel(duelData) {
  const fallback = () => ({
    winner: duelData?.opponent?.name || 'Challenger',
    decidingFactors: ['Higher daily directive completion rate', 'Focus time consistency'],
    missedOpportunities: ['Did not complete S-Rank bonus directive'],
    improvementAdvice: 'Increase daily focus hours during high-weight duel windows.',
  });
  return await callDomainAiEndpoint('analyze-duel', { context: duelData }, fallback);
}

// 9. Generate Boss Challenge
export async function generateBoss(character) {
  const fallback = () => ({
    bossTitle: 'Overlord of Procrastination: 120-Minute Deep Work Protocol',
    bossDescription: 'Execute a uninterrupted 120-minute deep work session without distractions.',
    difficulty: 'S-Rank Boss',
    timeLimitHours: 24,
    xpReward: 300,
    dpReward: 150,
    requiredSkills: ['UI Design & Layout', 'Focus'],
  });
  return await callDomainAiEndpoint('generate-boss', { context: { character } }, fallback);
}

export { generateRecommendedDirectives as generateRecommendedMissions };
