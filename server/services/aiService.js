import { OllamaProvider } from '../providers/ollamaProvider.js';

// Provider instance - easily replaceable with OpenAIProvider, GeminiProvider, or ClaudeProvider
const provider = new OllamaProvider();

const GLOBAL_SYSTEM_PROMPT = `
You are "The System", an intelligent RPG progression guide for human self-improvement.
You are NOT a chatbot. You are an objective, analytical, strategic RPG progression engine.
Rules:
1. Never roleplay or pretend to be human.
2. Never invent fictitious statistics or unevidenced claims. Use ONLY the supplied structured context.
3. Be concise, professional, strategic, and actionable.
4. Return responses in strict JSON format matching requested schemas.
`.trim();

const NON_GROWTH_KEYWORDS = [
  'netflix', 'game', 'gaming', 'playstation', 'xbox', 'movie', 'show', 'tv', 'couch',
  'nap', 'sleep', 'junk food', 'ice cream', 'scroll', 'instagram', 'tiktok', 'reels', 'youtube shorts', 'beer', 'alcohol'
];

export class AIService {
  // Helper to run AI call with structured fallback when Ollama is offline
  static async runWithFallback(systemPrompt, userPrompt, jsonFormat, fallbackFn) {
    try {
      return await provider.generate(systemPrompt, userPrompt, jsonFormat);
    } catch (err) {
      console.warn('[AI Service Heuristic Engine Fallback]:', err.message);
      return fallbackFn();
    }
  }

  // 1. Generate Missions
  static async generateMissions(context = {}) {
    const prompt = `
Task: Generate 3 daily missions for the player based on context.
Context: ${JSON.stringify(context)}

Respond ONLY in JSON matching this schema:
{
  "missions": [
    {
      "name": "string (actionable directive)",
      "difficulty": "S-Rank" | "A-Rank" | "B-Rank" | "C-Rank",
      "estimatedDuration": "30 Mins" | "45 Mins" | "60 Mins",
      "xpReward": number,
      "dpReward": number,
      "isMainMission": boolean,
      "relatedSkills": ["string"],
      "attributesImproved": ["string"]
    }
  ]
}
`;

    const fallback = () => {
      const career = context.career || 'Software Engineer';
      return {
        missions: [
          {
            name: `Execute 60-Minute ${career} Directives & Architecture`,
            difficulty: 'S-Rank',
            estimatedDuration: '60 Mins',
            xpReward: 120,
            dpReward: 60,
            isMainMission: true,
            relatedSkills: ['Core Directives', 'System Mastery'],
            attributesImproved: ['Knowledge +12', 'Focus +10'],
          },
          {
            name: 'Execute 45-Minute Deep Focus Deep Work Block',
            difficulty: 'A-Rank',
            estimatedDuration: '45 Mins',
            xpReward: 100,
            dpReward: 50,
            isMainMission: false,
            relatedSkills: ['Focus & Attention', 'Time Management'],
            attributesImproved: ['Focus +10', 'Discipline +8'],
          },
          {
            name: '30-Minute Physical Conditioning & Health Recovery',
            difficulty: 'B-Rank',
            estimatedDuration: '30 Mins',
            xpReward: 70,
            dpReward: 35,
            isMainMission: false,
            relatedSkills: ['Health & Stamina', 'Discipline'],
            attributesImproved: ['Strength +8', 'Resilience +6'],
          },
        ],
      };
    };

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, prompt, true, fallback);
  }

  // 2. Validate Custom Mission & Non-Growth Shield
  static async validateMission(missionTitle, category, context = {}) {
    const lower = (missionTitle || '').toLowerCase().trim();

    // Instant local non-growth shield
    if (NON_GROWTH_KEYWORDS.some(kw => lower.includes(kw))) {
      return {
        isGrowth: false,
        redirectReward: true,
        reason: `Non-Growth Activity Detected: "${missionTitle}" is a comfort activity and does not contribute to character leveling or attribute growth.`,
        recommendation: `Add "${missionTitle}" to your Reward Shop inventory as a redeemable comfort reward.`,
      };
    }

    const prompt = `
Task: Analyze custom mission proposal "${missionTitle}" under category "${category}".
Context: ${JSON.stringify(context)}

Requirements:
- Determine if this is a growth activity or a non-growth comfort activity (e.g., watching Netflix, gaming, junk food).
- If non-growth: set isGrowth=false and recommend adding to Reward Shop.
- If growth: estimate duration, assign rank (S/A/B/C), calculate XP/DP, link Skills and Attributes.

Respond ONLY in JSON:
{
  "isGrowth": boolean,
  "redirectReward": boolean,
  "reason": "string",
  "recommendation": "string",
  "difficulty": "S-Rank" | "A-Rank" | "B-Rank" | "C-Rank",
  "estimatedDuration": "string",
  "xpReward": number,
  "dpReward": number,
  "linkedSkills": ["string"],
  "linkedAttributes": ["string"]
}
`;

    const fallback = () => {
      let difficulty = 'B-Rank';
      let estimatedDuration = '45 Mins';
      let xpReward = 90;
      let dpReward = 45;

      if (lower.includes('build') || lower.includes('architect') || lower.includes('exam') || lower.includes('paper')) {
        difficulty = 'S-Rank';
        estimatedDuration = '60 Mins';
        xpReward = 130;
        dpReward = 65;
      } else if (lower.includes('read') || lower.includes('study') || lower.includes('workout') || lower.includes('run')) {
        difficulty = 'A-Rank';
        estimatedDuration = '45 Mins';
        xpReward = 100;
        dpReward = 50;
      }

      return {
        isGrowth: true,
        redirectReward: false,
        reason: `Valid Directive: "${missionTitle}" aligns with character growth and discipline advancement.`,
        recommendation: 'Approved by The System. Add to your daily directive queue.',
        difficulty,
        estimatedDuration,
        xpReward,
        dpReward,
        linkedSkills: [category || 'General Growth', 'Core Mastery'],
        linkedAttributes: ['Knowledge +10', 'Focus +8'],
      };
    };

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, prompt, true, fallback);
  }

  // 3. Recommend Skills
  static async recommendSkills(context = {}) {
    const prompt = `
Task: Recommend skill tree additions based on player career and destiny.
Context: ${JSON.stringify(context)}

Respond ONLY in JSON:
{
  "skills": [
    {
      "name": "string",
      "category": "string",
      "priority": "High" | "Medium" | "Low",
      "reason": "string"
    }
  ]
}
`;

    const fallback = () => {
      const career = context.career || 'Software Engineer';
      return {
        skills: [
          { name: `${career} Architecture`, category: 'Core', priority: 'High', reason: 'Essential for high-level specialization.' },
          { name: 'System Optimization & Scalability', category: 'Advanced', priority: 'High', reason: 'Increases career growth velocity.' },
          { name: 'Deep Focus & Task Batching', category: 'Productivity', priority: 'Medium', reason: 'Prevents burnout and maximizes output.' },
        ],
      };
    };

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, prompt, true, fallback);
  }

  // 4. Character Analysis Telemetry
  static async analyzeCharacter(context = {}) {
    const prompt = `
Task: Analyze character progress telemetry and return strategic feedback.
Context: ${JSON.stringify(context)}

Respond ONLY in JSON:
{
  "archetype": "string",
  "growthVelocity": "Low" | "Optimal" | "Peak Performance",
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "strategicAdvice": ["string"]
}
`;

    const fallback = () => {
      return {
        archetype: context.archetype || 'Creative Builder',
        growthVelocity: 'Optimal',
        summary: 'System Telemetry Scan: High discipline velocity in primary career directives.',
        strengths: context.strongestTraits || ['Creativity', 'Curiosity'],
        weaknesses: context.weakestTraits || ['Consistency', 'Focus', 'Time Management'],
        strategicAdvice: [
          'Maintain a minimum 45-minute daily focus block.',
          'Redeem comfort rewards only after completing S-Rank directives.',
          'Consistently complete daily directives to maintain streak multipliers.',
        ],
      };
    };

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, prompt, true, fallback);
  }

  // 5. Weekly Review
  static async weeklyReview(context = {}) {
    const fallback = () => ({
      period: 'Weekly Review',
      completedMissions: context.completedMissionsCount || 5,
      totalXpEarned: 580,
      totalDpEarned: 290,
      summary: 'Solid execution this week. Consistent completion of core directives.',
      topPerformingAttribute: 'Knowledge',
      recommendedFocusNextWeek: 'Time Management & Focus',
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Weekly Review. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 6. Monthly Review
  static async monthlyReview(context = {}) {
    const fallback = () => ({
      period: 'Monthly Report',
      levelsGained: 2,
      totalXpEarned: 2400,
      totalDpEarned: 1200,
      summary: 'Exceptional monthly progression. Multi-attribute stats increased noticeably.',
      milestonesAchieved: ['Reached Level 2', 'Completed 20+ Directives'],
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Monthly Review. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 7. Recommend Reward
  static async recommendReward(context = {}) {
    const fallback = () => ({
      recommendedReward: 'Specialty Espresso Coffee',
      costDP: 90,
      category: 'Food',
      reason: 'Proportional comfort reward for completing S-Rank directive.',
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Recommend Reward. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 8. Optimize Schedule
  static async optimizeSchedule(context = {}) {
    const fallback = () => ({
      schedule: [
        { time: '08:00 AM', activity: 'Morning Discipline & System Check' },
        { time: '09:00 AM - 10:30 AM', activity: 'S-Rank Deep Work Directive' },
        { time: '02:00 PM - 03:00 PM', activity: 'A-Rank Skill Practice' },
        { time: '05:00 PM', activity: 'Physical Conditioning & Recovery' },
      ],
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Optimize Schedule. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 9. Analyze Duel
  static async analyzeDuel(context = {}) {
    const fallback = () => ({
      winner: 'You',
      winProbability: '68%',
      summary: 'Higher mission completion velocity gave you the competitive edge in this duel.',
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Analyze Duel. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 10. Generate Boss Challenge
  static async generateBoss(context = {}) {
    const fallback = () => ({
      title: `Build ${context.career || 'Specialty'} Mastery MVP`,
      difficulty: 'Legendary S-Rank',
      requiredXP: 3000,
      rewardDP: 1500,
      description: 'Complete 10 high-impact directives within 7 days to defeat this boss.',
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Generate Boss. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 11. Expand Skills
  static async expandSkills(context = {}) {
    const fallback = () => ({
      expandedSkills: [
        { name: 'Advanced System Engineering', tier: 'Advanced' },
        { name: 'High-Performance Architecture', tier: 'Advanced' },
      ],
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Expand Skills. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 12. Timeline Summary
  static async timelineSummary(context = {}) {
    const fallback = () => ({
      summary: 'Player journey trajectory: steady level advancement with high discipline retention.',
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Timeline Summary. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 13. Onboarding Analysis
  static async onboardingAnalysis(context = {}) {
    const fallback = () => ({
      archetype: context.archetype || 'Creative Builder',
      strengths: context.strongestTraits || ['Creativity', 'Curiosity'],
      improvementAreas: context.weakestTraits || ['Consistency', 'Focus', 'Time Management'],
      summary: 'Character initialized with optimal growth trajectory calibrated for primary career.',
    });

    return await this.runWithFallback(GLOBAL_SYSTEM_PROMPT, `Task: Onboarding Analysis. Context: ${JSON.stringify(context)}`, true, fallback);
  }

  // 14. Get System Models (Dynamic Auto-Discovery)
  static async getSystemModels() {
    try {
      const installed = await provider.fetchInstalledModels();
      const active = await provider.getActiveModel();
      return {
        provider: 'Ollama (Local LLM)',
        activeModel: active,
        installedModels: installed,
        isLocal: true,
      };
    } catch (err) {
      return {
        provider: 'Heuristic Rule-Based Engine (Fallback)',
        activeModel: 'Rule-Engine v1.0',
        installedModels: [],
        isLocal: false,
      };
    }
  }
}
