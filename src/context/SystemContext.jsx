import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../shared/config/firebase';
import confetti from 'canvas-confetti';
import { ProgressionEngine } from '../shared/services/progressionEngine';
import { HunterRatingEngine, HUNTER_RANKS } from '../shared/services/hunterRatingEngine';
import { onAuthChange, deleteAccountAuth } from '../shared/services/authService';
import { getDynamicSkillTree } from '../shared/services/careerEngine';
import {
  saveCharacterProfile,
  saveMissionToFirestore,
  saveSkillToFirestore,
  saveRewardToFirestore,
  redeemRewardInFirestore,
  logTransaction,
  logTimelineEvent
} from '../shared/services/firestoreService';

const SystemContext = createContext();

const INITIAL_CHARACTER = {
  id: 'char_user',
  name: 'Vekta',
  archetype: 'Creative Builder',
  primaryCareer: 'UI/UX Designer',
  secondaryCareers: [],
  rank: 'Recruit Rank',
  level: 0,
  xp: 0,
  xpToNextLevel: 100,
  dp: 0,
  streakDays: 1,
  careerLevel: 1,
  careerProgressPct: 0,
  hoursInvested: 0,
  completedMissionsCount: 0,
  studyHours: 0,
  workoutHours: 0,
  focusHours: 0,
  completionPct: 0,
  destinyIdentity: 'Build SaaS Startup',
  destinyGoals: ['Launch SaaS Product'],
  strongestTraits: ['Creativity', 'Curiosity'],
  weakestTraits: ['Consistency', 'Focus'],
};

const INITIAL_ATTRIBUTES = {
  discipline: { level: 1, xp: 0, xpToNext: 100 },
  focus: { level: 1, xp: 0, xpToNext: 100 },
  knowledge: { level: 1, xp: 0, xpToNext: 100 },
  strength: { level: 1, xp: 0, xpToNext: 100 },
  communication: { level: 1, xp: 0, xpToNext: 100 },
  leadership: { level: 1, xp: 0, xpToNext: 100 },
  creativity: { level: 1, xp: 0, xpToNext: 100 },
  confidence: { level: 1, xp: 0, xpToNext: 100 },
  consistency: { level: 1, xp: 0, xpToNext: 100 },
  resilience: { level: 1, xp: 0, xpToNext: 100 },
};

const getSavedState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (typeof fallback === 'object' && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed ?? fallback;
  } catch (e) {
    return fallback;
  }
};

export function SystemProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(() => getSavedState('solo_onboarded', false));
  const [activeTab, setActiveTab] = useState('commandCenter');
  const [character, setCharacter] = useState(() => getSavedState('solo_character', INITIAL_CHARACTER));
  const [attributes, setAttributes] = useState(() => getSavedState('solo_attributes', INITIAL_ATTRIBUTES));
  
  // Dynamic initial tree via Career Engine
  const [careerTrees, setCareerTrees] = useState(() => {
    const defaultTree = getDynamicSkillTree('UI/UX Designer', 'Build SaaS Startup');
    return getSavedState('solo_career_trees', { 'UI/UX Designer': defaultTree });
  });
  
  const [customSkills, setCustomSkills] = useState(() => getSavedState('solo_custom_skills', []));
  const [aiSuggestion, setAiSuggestion] = useState({ active: false });

  const [missions, setMissions] = useState(() => {
    const treeObj = getDynamicSkillTree('UI/UX Designer', 'Build SaaS Startup');
    return getSavedState('solo_missions', treeObj.recommendedMissions.map((m, idx) => ({ ...m, id: `m_init_${idx}`, completed: false, progress: 0 })));
  });

  const [rewards, setRewards] = useState(() => getSavedState('solo_rewards', [
    { id: 'r1', name: 'Specialty Espresso Coffee', category: 'Food', costDP: 90, icon: 'coffee', description: 'Enjoy a premium espresso drink.', redeemed: false },
    { id: 'r2', name: '45 Minutes Guilt-Free Gaming', category: 'Entertainment', costDP: 180, icon: 'sports_esports', description: '45 minutes of PC or console gaming.', redeemed: false },
    { id: 'mb1', name: 'Recruit Mystery Box', category: 'Mystery Boxes', costDP: 150, icon: 'card_giftcard', description: 'Contains random Common or Rare cosmetic drop.', redeemed: false },
  ]));
  
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [dailyXpHistory, setDailyXpHistory] = useState([
    { day: 'Mon', xp: 0 },
    { day: 'Tue', xp: 0 },
    { day: 'Wed', xp: 0 },
    { day: 'Thu', xp: 0 },
    { day: 'Fri', xp: 0 },
    { day: 'Sat', xp: 0 },
    { day: 'Sun', xp: 0 },
  ]);

  const [hunters, setHunters] = useState(() => getSavedState('solo_hunters', []));
  const [friendRequests, setFriendRequests] = useState(() => getSavedState('solo_friend_requests', []));
  const [activeDuels, setActiveDuels] = useState(() => getSavedState('solo_active_duels', []));

  const [selectedHunterProfile, setSelectedHunterProfile] = useState(null);
  const [compareHunter, setCompareHunter] = useState(null);
  const [challengeHunter, setChallengeHunter] = useState(null);
  const [viewingDuel, setViewingDuel] = useState(null);

  const [completedPayoffModal, setCompletedPayoffModal] = useState({ open: false, mission: null });
  const [rewardRedemptionOverlay, setRewardRedemptionOverlay] = useState({ open: false, reward: null });
  const [mysteryBoxOverlay, setMysteryBoxOverlay] = useState({ open: false, box: null, drop: null });
  const [duelResultOverlay, setDuelResultOverlay] = useState({ open: false, duel: null });
  const [rankPromotionOverlay, setRankPromotionOverlay] = useState({ open: false, oldRank: null, newRank: null, hunterRating: 0, reason: '' });

  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showCreateMissionModal, setShowCreateMissionModal] = useState(false);
  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [showCreateSkillModal, setShowCreateSkillModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);

  // Custom Calendar Events & Active View Persistence
  const [customEvents, setCustomEvents] = useState(() => {
    return getSavedState('solo_custom_calendar_events', []);
  });

  const [activeCalendarView, setActiveCalendarView] = useState(() => {
    return getSavedState('solo_calendar_view', 'week');
  });

  const addCustomEvent = (newEvent) => {
    const updated = [...customEvents, newEvent];
    setCustomEvents(updated);
    localStorage.setItem('solo_custom_calendar_events', JSON.stringify(updated));
  };

  const deleteCustomEvent = (eventId) => {
    const updated = customEvents.filter(e => e.id !== eventId);
    setCustomEvents(updated);
    localStorage.setItem('solo_custom_calendar_events', JSON.stringify(updated));
  };

  const changeCalendarView = (viewMode) => {
    setActiveCalendarView(viewMode);
    localStorage.setItem('solo_calendar_view', JSON.stringify(viewMode));
  };

  // Real-Time Active Elapsed Time Tracker (in milliseconds)
  const [activeElapsedMs, setActiveElapsedMs] = useState(() => {
    const saved = localStorage.getItem('solo_real_time_invested_ms');
    return saved ? Number(saved) : 3600000; // Default 1 hour (3,600,000 ms) instead of 2.4h!
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveElapsedMs(prev => {
        const next = prev + 1000;
        localStorage.setItem('solo_real_time_invested_ms', String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const realHoursInvested = (activeElapsedMs / 3600000).toFixed(1);

  // Keep character.hoursInvested updated with real elapsed time
  useEffect(() => {
    if (character && character.hoursInvested !== parseFloat(realHoursInvested)) {
      setCharacter(prev => ({ ...prev, hoursInvested: parseFloat(realHoursInvested) }));
    }
  }, [realHoursInvested]);

  const updateCharacterName = (newName) => {
    if (!newName.trim()) return;
    // Preserve the locked handle — never regenerate it from the new name
    const updated = {
      ...character,
      name: newName.trim(),
      userIdTag: character.userIdTag || `@${(character.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    };
    setCharacter(updated);
    localStorage.setItem('solo_character', JSON.stringify(updated));
  };

  const resetCharacterProgress = () => {
    const resetChar = {
      ...character,
      level: 1,
      xp: 0,
      dp: 100,
      hoursInvested: 1.0,
      completedMissionsCount: 0,
      rank: 'Recruit Rank',
      streakDays: 1,
    };
    setCharacter(resetChar);
    setMissions([]);
    localStorage.setItem('solo_character', JSON.stringify(resetChar));
    localStorage.setItem('solo_missions', JSON.stringify([]));
    localStorage.setItem('solo_real_time_invested_ms', String(3600000));
    setActiveElapsedMs(3600000);
  };

  const deleteAccountData = async () => {
    try {
      const email = currentUser?.email || character?.email || '';
      const uid = currentUser?.uid || character?.id || '';

      // 1. Call backend server to purge Firestore documents & Firebase Admin Auth credentials
      await fetch('/api/ai/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, email })
      }).catch(err => console.warn('[Backend Delete Account Notice]:', err));

      // 2. Delete Firebase Client Auth User
      await deleteAccountAuth().catch(err => console.warn('[Client Auth Delete Notice]:', err));
    } catch (err) {
      console.warn('[Delete Account Error]:', err);
    } finally {
      // 3. Clear local storage and reload app to onboarding
      localStorage.clear();
      window.location.reload();
    }
  };

  // Dynamic Hunter Rating Calculation & Promotion Trigger
  const hunterRating = HunterRatingEngine.calculateRating({ character, attributes, customSkills, missions, activeDuels });
  const evaluatedRank = HunterRatingEngine.getRankForRating(hunterRating);

  useEffect(() => {
    if (!character || !evaluatedRank) return;

    const currentRankLabel = character.rank || 'Recruit (Unawakened)';
    if (evaluatedRank.label !== currentRankLabel && evaluatedRank.minRating > 0) {
      const oldRankObj = HUNTER_RANKS.find(r => r.label === currentRankLabel || r.id === currentRankLabel) || HUNTER_RANKS[0];
      const newRankObj = evaluatedRank;

      setRankPromotionOverlay({
        open: true,
        oldRank: oldRankObj,
        newRank: newRankObj,
        hunterRating,
        reason: `Evaluated Hunter Rating crossed ${newRankObj.minRating} PTS threshold through continuous directive execution and skill mastery.`,
      });

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 } });

      const updatedChar = {
        ...character,
        rank: newRankObj.label,
        hunterRating,
      };
      setCharacter(updatedChar);

      const userId = currentUser?.uid || character.id || 'user_local';
      saveCharacterProfile(userId, updatedChar).catch(err => console.warn(err));
    }
  }, [hunterRating, character?.rank]);

  // Theme Management ('light' | 'dark' | 'system')
  const [themeMode, setThemeMode] = useState(() => getSavedState('solo_theme_preference', 'dark'));

  // Private Calendar Preferences (Strictly isolated from public character profile)
  const [privateCalendarSettings, setPrivateCalendarSettings] = useState(() => {
    return getSavedState('solo_private_calendar_settings', {
      religion: 'PreferNotToAnswer',
      customReligionLabel: '',
      country: 'IN',
      enabledCalendars: ['national_in'],
    });
  });

  const updatePrivateCalendarSettings = (newSettings) => {
    const updated = { ...privateCalendarSettings, ...newSettings };
    setPrivateCalendarSettings(updated);
    localStorage.setItem('solo_private_calendar_settings', JSON.stringify(updated));
  };

  useEffect(() => {
    localStorage.setItem('solo_theme_preference', JSON.stringify(themeMode));

    const applyTheme = () => {
      const root = document.documentElement;
      let isDark = false;

      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        document.body.classList.remove('dark');
      }
    };

    applyTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

  // 1. Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setCurrentUser(user);
        setCharacter(prev => ({ ...prev, name: user.displayName || prev.name }));
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 1b. Live Active Duels Sync from Cloud Firestore
  useEffect(() => {
    let isMounted = true;
    async function syncActiveDuels() {
      const email = (currentUser?.email || '').toLowerCase().trim();
      const uid = currentUser?.uid || '';
      const charName = (character?.name || '').toLowerCase().trim();
      if (!email && !uid) return;

      try {
        const snap = await getDocs(collection(db, 'duels'));
        if (isMounted && snap) {
          const activeFromDb = [];
          snap.forEach(docSnap => {
            const d = docSnap.data();
            if (d.status === 'active') {
              const chEmail = (d.challengerEmail || '').toLowerCase().trim();
              const oppEmail = (d.opponentEmail || '').toLowerCase().trim();
              const chName = (d.challengerName || '').toLowerCase().trim();
              const oppName = (d.opponentName || '').toLowerCase().trim();

              if (chEmail === email || oppEmail === email || d.challengerId === uid || d.opponentId === uid || (charName && (chName.includes(charName) || oppName.includes(charName)))) {
                activeFromDb.push({ id: docSnap.id, ...d });
              }
            }
          });

          if (activeFromDb.length > 0) {
            setActiveDuels(prev => {
              const combinedMap = new Map();
              (prev || []).forEach(d => combinedMap.set(d.id, d));
              activeFromDb.forEach(d => {
                const oppName = (d.challengerName || '').toLowerCase() === charName ? d.opponentName : d.challengerName;
                const formattedDuel = {
                  id: d.id,
                  opponent: {
                    name: oppName || 'Hunter Partner',
                    rank: 'Recruit Rank',
                    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${oppName || d.id}`,
                    career: 'Software Engineer',
                    level: 1,
                  },
                  duration: d.duration || '24 Hours',
                  category: d.category || 'General Discipline',
                  status: 'active',
                  createdAt: d.createdAt || new Date().toISOString(),
                  userScore: d.userScore || 0,
                  opponentScore: d.opponentScore || 0,
                  timeRemaining: d.duration || '24 Hours',
                  userMissions: d.userMissions || 0,
                  opponentMissions: d.opponentMissions || 0,
                  userFocusHours: d.userFocusHours || 0,
                  opponentFocusHours: d.opponentFocusHours || 0,
                  currentLeader: d.currentLeader || character?.name || 'Vekta',
                  liveFeed: d.liveFeed || [
                    { id: 'lf_init', hunterName: 'System', text: `Duel Active! ${d.challengerName} vs ${d.opponentName}`, timestamp: d.createdAt || new Date().toISOString() }
                  ]
                };
                combinedMap.set(d.id, formattedDuel);
              });
              return Array.from(combinedMap.values());
            });
          }
        }
      } catch (err) {
        // Quiet catch
      }
    }

    if (currentUser?.email || currentUser?.uid) {
      syncActiveDuels();
    }
  }, [currentUser, character]);

  // 2. Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('solo_onboarded', JSON.stringify(isOnboarded));
  }, [isOnboarded]);
  useEffect(() => {
    localStorage.setItem('solo_character', JSON.stringify(character));
  }, [character]);
  useEffect(() => {
    localStorage.setItem('solo_attributes', JSON.stringify(attributes));
  }, [attributes]);
  useEffect(() => {
    localStorage.setItem('solo_career_trees', JSON.stringify(careerTrees));
  }, [careerTrees]);
  useEffect(() => {
    localStorage.setItem('solo_custom_skills', JSON.stringify(customSkills));
  }, [customSkills]);
  useEffect(() => {
    localStorage.setItem('solo_missions', JSON.stringify(missions));
  }, [missions]);
  useEffect(() => {
    localStorage.setItem('solo_rewards', JSON.stringify(rewards));
  }, [rewards]);
  useEffect(() => {
    localStorage.setItem('solo_hunters', JSON.stringify(hunters));
  }, [hunters]);

  // Completely wipe local storage & restart Awakening
  const resetAllSystemData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const completeOnboarding = (onboardingData) => {
    const { name, userIdTag, career, destinyIdentity, destinyGoals, rewardsList, archetype, strongestTraits, weakestTraits } = onboardingData;

    const finalCareer = career || 'UI/UX Designer';
    const finalDestiny = destinyIdentity || 'Build SaaS Startup';
    const finalArchetype = archetype || 'Creative Builder';
    const userId = currentUser?.uid || 'user_' + Date.now();

    // Compile dynamic skill tree & missions via Career Engine
    const dynamicCompiledTree = getDynamicSkillTree(finalCareer, finalDestiny);
    const freshMissions = dynamicCompiledTree.recommendedMissions.map((m, idx) => ({
      id: `m_onb_${idx}_${Date.now()}`,
      name: m.name,
      difficulty: m.difficulty,
      estimatedDuration: m.estimatedDuration,
      xpReward: m.xpReward,
      dpReward: m.dpReward,
      isMainMission: m.isMainMission,
      relatedSkills: m.relatedSkills,
      attributesImproved: m.attributesImproved,
      completed: false,
      progress: 0,
    }));

    const cleanUserTag = userIdTag?.trim();
    const finalHandle = cleanUserTag
      ? (cleanUserTag.startsWith('@') ? cleanUserTag : `@${cleanUserTag}`)
      : `@${(name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const newChar = {
      id: userId,
      name: name || 'Vekta',
      userIdTag: finalHandle,
      email: onboardingData?.email || currentUser?.email || '',
      primaryCareer: finalCareer,
      secondaryCareers: [],
      archetype: finalArchetype,
      rank: 'Recruit Rank',
      level: 0,
      xp: 0,
      xpToNextLevel: 100,
      dp: 0,
      streakDays: 1,
      careerLevel: 1,
      careerProgressPct: 0,
      hoursInvested: 0,
      completedMissionsCount: 0,
      studyHours: 0,
      workoutHours: 0,
      focusHours: 0,
      completionPct: 0,
      destinyIdentity: finalDestiny,
      destinyGoals: destinyGoals || ['Launch SaaS Product'],
      strongestTraits: strongestTraits || ['Creativity', 'Curiosity'],
      weakestTraits: weakestTraits || ['Consistency', 'Focus'],
    };

    const newRewards = (rewardsList && rewardsList.length > 0)
      ? rewardsList.map((r, idx) => ({
          id: 'r_onb_' + idx,
          name: r.name,
          category: r.category || 'Comfort',
          costDP: r.costDP || 100,
          icon: r.icon || 'card_giftcard',
          description: 'Initial reward preference.',
          redeemed: false,
        }))
      : [
          { id: 'r1', name: 'Specialty Espresso Coffee', category: 'Food', costDP: 90, icon: 'coffee', description: 'Enjoy a premium espresso drink.', redeemed: false },
          { id: 'r2', name: '45 Minutes Guilt-Free Gaming', category: 'Entertainment', costDP: 180, icon: 'sports_esports', description: '45 minutes of gaming.', redeemed: false },
        ];

    const newCareerTrees = { [finalCareer]: dynamicCompiledTree };

    // Explicitly overwrite localStorage immediately
    localStorage.setItem('solo_character', JSON.stringify(newChar));
    localStorage.setItem('solo_attributes', JSON.stringify(INITIAL_ATTRIBUTES));
    localStorage.setItem('solo_career_trees', JSON.stringify(newCareerTrees));
    localStorage.setItem('solo_missions', JSON.stringify(freshMissions));
    localStorage.setItem('solo_rewards', JSON.stringify(newRewards));
    localStorage.setItem('solo_custom_skills', JSON.stringify([]));
    localStorage.setItem('solo_hunters', JSON.stringify([]));
    localStorage.setItem('solo_friend_requests', JSON.stringify([]));
    localStorage.setItem('solo_active_duels', JSON.stringify([]));
    localStorage.setItem('solo_onboarded', JSON.stringify(true));

    // Async save to Cloud Firestore `characters/` collection
    saveCharacterProfile(userId, newChar).catch(err => console.warn('[Firestore Sync Warning]:', err));
    const apiHost = window.location.hostname === 'localhost' ? '' : (import.meta.env.VITE_BACKEND_URL || '');
    if (apiHost || window.location.hostname === 'localhost') {
      fetch(`${apiHost}/api/ai/sync-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, character: newChar, onboardingData })
      }).catch(() => null);
    }


    setCharacter(newChar);
    setAttributes(INITIAL_ATTRIBUTES);
    setCareerTrees(newCareerTrees);
    setMissions(freshMissions);
    setRewards(newRewards);
    setCustomSkills([]);
    setPurchaseHistory([]);
    setDailyXpHistory([
      { day: 'Mon', xp: 0 },
      { day: 'Tue', xp: 0 },
      { day: 'Wed', xp: 0 },
      { day: 'Thu', xp: 0 },
      { day: 'Fri', xp: 0 },
      { day: 'Sat', xp: 0 },
      { day: 'Sun', xp: 0 },
    ]);
    setHunters([]);
    setFriendRequests([]);
    setActiveDuels([]);

    setIsOnboarded(true);

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFFFFF', '#111111']
    });
  };

  const completeMission = (missionId) => {
    const safeMissions = missions || [];
    const m = safeMissions.find(item => item.id === missionId);
    if (!m || m.completed) return;

    setMissions(prev => (prev || []).map(item => item.id === missionId ? { ...item, completed: true, progress: 100 } : item));

    const advance = ProgressionEngine.calculateLevelAdvance(
      character.xp,
      m.xpReward,
      character.level,
      character.xpToNextLevel
    );

    const newDP = character.dp + m.dpReward;
    const userId = currentUser?.uid || character.id || 'user_local';

    setCharacter(prev => {
      const updated = {
        ...prev,
        xp: advance.newXP,
        dp: newDP,
        level: advance.newLevel,
        xpToNextLevel: advance.newXpToNext,
        rank: advance.newRank,
        careerProgressPct: Math.min(100, (prev.careerProgressPct || 0) + 2),
        completedMissionsCount: (prev.completedMissionsCount || 0) + 1,
        hoursInvested: +((prev.hoursInvested || 0) + 1.2).toFixed(1),
      };

      // Sync character to Firestore
      saveCharacterProfile(userId, updated).catch(err => console.warn('[Firestore Sync Warning]:', err));
      return updated;
    });

    // Firestore Transactions Ledger (`transactions/`) & Timeline Story (`timeline/`)
    logTransaction(userId, 'earn', m.dpReward, `Completed directive: ${m.name}`).catch(err => console.warn(err));
    logTimelineEvent(userId, 'MISSION_COMPLETED', `Completed ${m.name}`, m.xpReward, m.dpReward).catch(err => console.warn(err));

    if (advance.leveledUp) {
      logTimelineEvent(userId, 'LEVEL_UP', `Leveled up to Level ${advance.newLevel} (${advance.newRank})`).catch(err => console.warn(err));
    }

    setDailyXpHistory(prev => {
      const copy = [...prev];
      const todayIdx = 6;
      copy[todayIdx] = { ...copy[todayIdx], xp: copy[todayIdx].xp + m.xpReward };
      return copy;
    });

    setCareerTrees(prev => {
      const activeTree = prev[character.primaryCareer];
      if (!activeTree || !activeTree.tree) return prev;

      const updateSection = (skillsList = []) => skillsList.map(sk => {
        if (m.relatedSkills.includes(sk.name)) {
          const skAdv = ProgressionEngine.calculateSkillAdvance(sk.xp, m.xpReward, sk.level, sk.xpToNext);
          return { ...sk, xp: skAdv.newXP, level: skAdv.newLvl, xpToNext: skAdv.newNext };
        }
        return sk;
      });

      return {
        ...prev,
        [character.primaryCareer]: {
          ...activeTree,
          tree: {
            core: updateSection(activeTree.tree.core),
            supporting: updateSection(activeTree.tree.supporting || []),
            advanced: updateSection(activeTree.tree.advanced || []),
          }
        }
      };
    });

    // Calculate attributes dynamically from completed missions
    setAttributes(prev => {
      const updated = { ...prev };

      const addAttrXP = (attrKey, amount) => {
        let current = updated[attrKey] || { level: 1, xp: 0, xpToNext: 100 };
        let newX = (current.xp || 0) + amount;
        let newLvl = current.level || 1;
        let newNext = current.xpToNext || 100;
        while (newX >= newNext) {
          newX -= newNext;
          newLvl += 1;
          newNext = Math.round(newNext * 1.3);
        }
        updated[attrKey] = { level: newLvl, xp: newX, xpToNext: newNext };
      };

      if (m.relatedSkills.includes('Fitness') || m.relatedSkills.some(s => s.toLowerCase().includes('strength'))) {
        addAttrXP('strength', 15);
        addAttrXP('discipline', 10);
        addAttrXP('resilience', 10);
      }
      if (m.relatedSkills.some(s => s.toLowerCase().includes('design') || s.toLowerCase().includes('story') || s.toLowerCase().includes('code'))) {
        addAttrXP('focus', 15);
        addAttrXP('knowledge', 12);
        addAttrXP('creativity', 10);
      }

      addAttrXP('consistency', 8);

      return updated;
    });

    // Automatically award Duel Points for Active Duels matching category or "All Missions"
    setActiveDuels(prev => (prev || []).map(d => {
      if (d.status === 'active' && (d.category === 'All Missions' || d.category === 'General' || !d.category || (m.relatedSkills || []).some(s => s.toLowerCase().includes((d.category || '').toLowerCase())))) {
        const updatedUserScore = (d.userScore || 0) + 100;
        const updatedMissions = (d.userMissions || 0) + 1;
        const newLeader = updatedUserScore >= (d.opponentScore || 0) ? (character?.name || 'Vekta') : d.opponent.name;
        const newFeedItem = {
          id: 'lf_' + Date.now(),
          hunterName: character?.name || 'Vekta',
          text: `Completed mission "${m.name}" (+100 PTS)`,
          time: 'Just now',
        };
        const updatedDuel = {
          ...d,
          userScore: updatedUserScore,
          userMissions: updatedMissions,
          currentLeader: newLeader,
          liveFeed: [newFeedItem, ...(d.liveFeed || [])],
        };
        if (viewingDuel && viewingDuel.id === d.id) {
          setViewingDuel(updatedDuel);
        }
        return updatedDuel;
      }
      return d;
    }));

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#111111', '#FAFAFA']
    });

    setCompletedPayoffModal({ open: true, mission: m });

    if (advance.leveledUp) {
      setTimeout(() => setShowLevelUpModal(true), 1200);
    }
  };

  const selectPrimaryCareer = (careerTitle) => {
    const dynamicTree = getDynamicSkillTree(careerTitle, character.destinyIdentity);
    setCharacter(prev => ({ ...prev, primaryCareer: careerTitle }));
    setCareerTrees(prev => ({ ...prev, [careerTitle]: dynamicTree }));
    setShowCareerModal(false);
  };

  const addCustomSkill = (skillData) => {
    const newSkill = {
      id: 'cs_' + Date.now(),
      name: skillData.name,
      category: skillData.category || 'Custom',
      level: 1,
      xp: 0,
      xpToNext: 100,
    };
    setCustomSkills(prev => [...(prev || []), newSkill]);
    const userId = currentUser?.uid || character.id || 'user_local';
    saveSkillToFirestore(userId, newSkill).catch(err => console.warn(err));
    setShowCreateSkillModal(false);
  };

  const acceptAiSkill = () => {
    if (!aiSuggestion.active) return;
    addCustomSkill({
      name: aiSuggestion.suggestedSkill,
      category: aiSuggestion.category,
    });
    setAiSuggestion(prev => ({ ...prev, active: false }));
  };

  const createMission = (missionData) => {
    const activeCount = (missions || []).filter(m => !m.completed).length;
    if (activeCount >= 5) {
      alert('Maximum of 5 active directives reached! Please complete existing pending missions before deploying new directives.');
      return false;
    }

    const newM = {
      id: 'm_' + Date.now(),
      name: missionData.name,
      difficulty: missionData.difficulty || 'B-Rank',
      estimatedDuration: missionData.estimatedDuration || '30 Mins',
      xpReward: Number(missionData.xpReward) || 80,
      dpReward: Number(missionData.dpReward) || 40,
      isMainMission: missionData.isMainMission || false,
      relatedSkills: missionData.relatedSkills || [character?.primaryCareer || 'Core Mastery'],
      attributesImproved: ['Focus +8 XP', 'Knowledge +5 XP'],
      completed: false,
      progress: 0,
    };
    setMissions(prev => [newM, ...(prev || [])]);
    const userId = currentUser?.uid || character.id || 'user_local';
    saveMissionToFirestore(userId, newM).catch(err => console.warn(err));
    setShowCreateMissionModal(false);
    return true;
  };

  const createReward = (rewardData) => {
    const newR = {
      id: 'r_' + Date.now(),
      name: rewardData.name,
      category: rewardData.category || 'Comfort',
      costDP: Number(rewardData.costDP) || 50,
      icon: rewardData.icon || 'card_giftcard',
      description: rewardData.description || 'Self-defined comfort reward.',
      redeemed: false,
    };
    setRewards(prev => [...(prev || []), newR]);
    const userId = currentUser?.uid || character.id || 'user_local';
    saveRewardToFirestore(userId, newR).catch(err => console.warn(err));
    setShowCreateRewardModal(false);
  };

  const updateReward = (rewardId, updatedFields) => {
    setRewards(prev => (prev || []).map(r => {
      if (r.id === rewardId) {
        const updated = {
          ...r,
          ...updatedFields,
          costDP: Number(updatedFields.costDP) || r.costDP,
        };
        const userId = currentUser?.uid || character.id || 'user_local';
        saveRewardToFirestore(userId, updated).catch(err => console.warn(err));
        return updated;
      }
      return r;
    }));
    setEditingReward(null);
  };

  const deleteReward = (rewardId) => {
    setRewards(prev => (prev || []).filter(r => r.id !== rewardId));
    setEditingReward(null);
  };

  const redeemReward = (rewardId) => {
    const safeRewards = rewards || [];
    const r = safeRewards.find(item => item.id === rewardId);
    if (!r || character.dp < r.costDP) return;

    if (r.category === 'Mystery Boxes') {
      openMysteryBox(r);
      return;
    }

    const userId = currentUser?.uid || character.id || 'user_local';

    setCharacter(prev => {
      const updated = { ...prev, dp: prev.dp - r.costDP };
      saveCharacterProfile(userId, updated).catch(err => console.warn(err));
      return updated;
    });

    setRewards(prev => (prev || []).map(item => item.id === rewardId ? { ...item, redeemed: true } : item));

    setPurchaseHistory(prev => [{
      id: 'ph_' + Date.now(),
      name: r.name,
      costDP: r.costDP,
      timestamp: 'Today',
    }, ...prev]);

    // Firestore redeem log & transaction ledger
    redeemRewardInFirestore(userId, rewardId, r.costDP, r.name).catch(err => console.warn(err));

    setRewardRedemptionOverlay({ open: true, reward: r });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#666666']
    });
  };

  const openMysteryBox = (box) => {
    if (character.dp < box.costDP) return;

    const userId = currentUser?.uid || character.id || 'user_local';

    setCharacter(prev => {
      const updated = { ...prev, dp: prev.dp - box.costDP };
      saveCharacterProfile(userId, updated).catch(err => console.warn(err));
      return updated;
    });

    const possibleDrops = [
      { name: 'Common Obsidian Border', rarity: 'Common', color: 'text-slate-600', icon: 'crop_square' },
      { name: 'Rare Sapphire Aura', rarity: 'Rare', color: 'text-blue-600', icon: 'auto_awesome' },
      { name: 'Epic Amethyst Title', rarity: 'Epic', color: 'text-purple-600', icon: 'military_tech' },
      { name: 'Legendary Golden Monarch Crest', rarity: 'Legendary', color: 'text-gold font-bold', icon: 'stars' },
    ];

    const drop = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];

    setPurchaseHistory(prev => [{
      id: 'ph_' + Date.now(),
      name: `${box.name} (${drop.rarity}: ${drop.name})`,
      costDP: box.costDP,
      timestamp: 'Today',
    }, ...prev]);

    logTransaction(userId, 'spend', box.costDP, `Opened Mystery Box: ${drop.name}`).catch(err => console.warn(err));
    logTimelineEvent(userId, 'REWARD_REDEEMED', `Opened Mystery Box: ${drop.name}`, 0, -box.costDP).catch(err => console.warn(err));

    setMysteryBoxOverlay({ open: true, box, drop });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#9333ea', '#2563eb']
    });
  };

  const addHunter = (hunterData) => {
    const newHunter = {
      id: 'h_' + Date.now(),
      name: hunterData.name,
      rank: hunterData.rank || 'Recruit Rank',
      level: Number(hunterData.level) || 1,
      xp: 0,
      dp: 1250,
      career: hunterData.career || 'Software Engineer',
      streakDays: 1,
      onlineStatus: 'Online',
      avatar: hunterData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${hunterData.name}`,
      topSkills: hunterData.topSkills || ['Programming'],
      achievements: ['Real Hunter Partner'],
      studyHours: 0,
      workoutHours: 0,
      focusHours: 0,
      completionPct: 0,
      attributes: { discipline: 10, focus: 10, knowledge: 10, strength: 10 },
    };
    setHunters(prev => [...(prev || []), newHunter]);
  };

  const startDuel = async (opponent, duration, category) => {
    const newDuel = {
      id: 'd_' + Date.now(),
      opponent,
      duration,
      category,
      status: 'active',
      createdAt: new Date().toISOString(),
      userScore: 0,
      opponentScore: 0,
      timeRemaining: duration,
      userMissions: 0,
      opponentMissions: 0,
      userFocusHours: 0,
      opponentFocusHours: 0,
      currentLeader: character.name,
      liveFeed: [
        { id: 'lf_init', hunterName: 'System', text: `Duel challenge sent! ${character.name} vs ${opponent.name} (${duration})`, time: 'Just now' }
      ]
    };

    setActiveDuels(prev => [newDuel, ...(prev || [])]);
    setViewingDuel(newDuel);
    setChallengeHunter(null);

    const userId = currentUser?.uid || character.id || 'user_local';
    logTimelineEvent(userId, 'DUEL_WON', `Started duel challenge against ${opponent.name}`).catch(err => console.warn(err));

    // Send Duel Challenge directly to Firestore `duels/` collection
    addDoc(collection(db, 'duels'), {
      challengerId: currentUser?.uid || character.id || 'user_local',
      challengerName: character.name,
      challengerHandle: character.userIdTag || `@${(character.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      challengerEmail: currentUser?.email || '',
      opponentId: opponent.id || '',
      opponentName: opponent.name,
      opponentHandle: opponent.handle || opponent.userIdTag || `@${(opponent.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      opponentEmail: opponent.email || '',
      duration,
      category,
      status: 'pending',
      userScore: 0,
      opponentScore: 0,
      createdAt: new Date().toISOString(),
    }).catch(err => console.warn('[Send Duel Warning]:', err));

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#111111']
    });
  };

  const endDuel = (duelId) => {
    const d = (activeDuels || []).find(item => item.id === duelId);
    if (!d) return;

    const userPts = d.userScore || 0;
    const oppPts = d.opponentScore || 0;
    let outcome = 'VICTORY';
    let xpEarned = 300;
    let dpEarned = 150;

    if (userPts === 0 && oppPts === 0) {
      outcome = 'STALEMATE_ZERO';
      xpEarned = 0;
      dpEarned = 0;
    } else if (userPts === oppPts) {
      outcome = 'DRAW';
      xpEarned = 150;
      dpEarned = 75;
    } else if (userPts < oppPts) {
      outcome = 'RUNNER_UP';
      xpEarned = 50;
      dpEarned = 0;
    }

    if (xpEarned > 0 || dpEarned > 0) {
      const advance = ProgressionEngine.calculateLevelAdvance(
        character.xp,
        xpEarned,
        character.level,
        character.xpToNextLevel
      );
      const userId = currentUser?.uid || character.id || 'user_local';

      setCharacter(prev => {
        const updated = {
          ...prev,
          xp: advance.newXP,
          dp: prev.dp + dpEarned,
          level: advance.newLevel,
          xpToNextLevel: advance.newXpToNext,
          rank: advance.newRank,
        };
        saveCharacterProfile(userId, updated).catch(err => console.warn(err));
        return updated;
      });

      logTimelineEvent(userId, 'DUEL_WON', `Concluded ${d.category} Duel (${outcome}) - Earned +${xpEarned} XP, +${dpEarned} DP`).catch(err => console.warn(err));
    }

    setDuelResultOverlay({ open: true, duel: { ...d, outcome, xpEarned, dpEarned } });
  };

  return (
    <SystemContext.Provider value={{
      currentUser,
      isOnboarded,
      setIsOnboarded,
      completeOnboarding,
      resetAllSystemData,
      character: character || INITIAL_CHARACTER,
      attributes: attributes || INITIAL_ATTRIBUTES,
      careerTrees: careerTrees || {},
      customSkills: customSkills || [],
      aiSuggestion: aiSuggestion || { active: false },
      setAiSuggestion,
      missions: missions || [],
      setMissions,
      rewards: rewards || [],
      setRewards,
      purchaseHistory: purchaseHistory || [],
      dailyXpHistory: dailyXpHistory || [],
      hunters: hunters || [],
      setHunters,
      friendRequests: friendRequests || [],
      setFriendRequests,
      activeDuels: activeDuels || [],
      setActiveDuels,
      setCharacter,
      activeTab,
      setActiveTab,
      themeMode,
      setThemeMode,
      hunterRating,
      evaluatedRank,
      rankPromotionOverlay,
      setRankPromotionOverlay,
      privateCalendarSettings,
      updatePrivateCalendarSettings,
      realHoursInvested,
      updateCharacterName,
      resetCharacterProgress,
      deleteAccountData,
      customEvents,
      activeCalendarView,
      addCustomEvent,
      deleteCustomEvent,
      changeCalendarView,
      completeMission,
      createMission,
      createReward,
      updateReward,
      deleteReward,
      editingReward,
      setEditingReward,
      redeemReward,
      openMysteryBox,
      selectPrimaryCareer,
      addCustomSkill,
      acceptAiSkill,
      addHunter,
      startDuel,
      endDuel,
      selectedHunterProfile,
      setSelectedHunterProfile,
      compareHunter,
      setCompareHunter,
      challengeHunter,
      setChallengeHunter,
      viewingDuel,
      setViewingDuel,
      duelResultOverlay,
      setDuelResultOverlay,
      completedPayoffModal,
      setCompletedPayoffModal,
      rewardRedemptionOverlay,
      setRewardRedemptionOverlay,
      mysteryBoxOverlay: mysteryBoxOverlay || { open: false, box: null, drop: null },
      setMysteryBoxOverlay,
      showLevelUpModal,
      setShowLevelUpModal,
      showCreateMissionModal,
      setShowCreateMissionModal,
      showCreateRewardModal,
      setShowCreateRewardModal,
      showCreateSkillModal,
      setShowCreateSkillModal,
      showCareerModal,
      setShowCareerModal,
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    console.warn('[SystemContext Notice]: Context evaluated during HMR initialization.');
    return {};
  }
  return context;
}
