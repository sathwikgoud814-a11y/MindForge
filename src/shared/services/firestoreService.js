import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// 1. Sync authenticated user to `users/` collection
export const syncUserDocument = async (user) => {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    const userData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Vekta',
      photoURL: user.photoURL || '',
      lastLogin: new Date().toISOString(),
    };

    if (!snap.exists()) {
      userData.createdAt = new Date().toISOString();
    }

    await setDoc(userRef, userData, { merge: true });
  } catch (err) {
    console.warn('[Client Firestore Sync Warning]:', err.message);
    // Fallback to Express Firebase Admin API (bypasses rules)
    try {
      const apiHost = window.location.hostname === 'localhost' ? '' : (import.meta.env.VITE_BACKEND_URL || '');
      if (apiHost || window.location.hostname === 'localhost') {
        await fetch(`${apiHost}/api/ai/sync-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            onboardingData: {
              name: user.displayName || user.email?.split('@')[0] || 'Vekta',
              email: user.email,
              avatar: user.photoURL,
            }
          })
        }).catch(() => null);
      }
    } catch (adminErr) {
      // Quiet catch
    }
  }
};

// 2. Character Document (`characters/`)
export const saveCharacterProfile = async (userId, characterData) => {
  try {
    const charRef = doc(db, 'characters', userId);
    const userRef = doc(db, 'users', userId);
    const handleTag = characterData.userIdTag || `@${(characterData.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const data = {
      userId,
      characterName: characterData.name || 'Vekta',
      userIdTag: handleTag,
      rank: characterData.rank || 'Recruit',
      level: characterData.level ?? 0,
      xp: characterData.xp ?? 0,
      disciplinePoints: characterData.dp ?? 0,
      archetype: characterData.archetype || 'Creative Builder',
      career: characterData.primaryCareer || 'UI Designer',
      destiny: characterData.destinyIdentity || 'Build SaaS Startup',
      currentSeason: 1,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(charRef, data, { merge: true });
    await setDoc(userRef, {
      uid: userId,
      name: characterData.name,
      displayName: characterData.name,
      userIdTag: handleTag,
      handle: handleTag,
      career: characterData.primaryCareer,
      rank: characterData.rank,
      level: characterData.level,
      xp: characterData.xp,
    }, { merge: true });
  } catch (err) {
    console.warn('[Client Save Character Warning]:', err.message);
    // Fallback to Express Firebase Admin API
    try {
      await fetch('/api/ai/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, character: characterData })
      });
    } catch (adminErr) {
      console.warn('[Admin Save Character Fallback Warning]:', adminErr.message);
    }
  }
};

// 3. Transactions Ledger (`transactions/`) - Every DP Change
export const logTransaction = async (userId, type, amount, reason) => {
  try {
    const transRef = collection(db, 'transactions');
    await addDoc(transRef, {
      userId,
      type, // "earn" | "spend"
      amount,
      reason,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Log Transaction Warning]:', err.message);
  }
};

// 4. Timeline Story Log (`timeline/`) - Player Milestones
export const logTimelineEvent = async (userId, type, title, xp = 0, dp = 0) => {
  try {
    const timelineRef = collection(db, 'timeline');
    await addDoc(timelineRef, {
      userId,
      type, // "MISSION_COMPLETED" | "LEVEL_UP" | "SKILL_LEVEL_UP" | "ACHIEVEMENT" | "DUEL_WON" | "REWARD_REDEEMED"
      title,
      xp,
      dp,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Log Timeline Event Warning]:', err.message);
  }
};

// 5. Missions (`missions/`)
export const saveMissionToFirestore = async (userId, mission) => {
  try {
    const missionRef = doc(db, 'missions', mission.id || `m_${Date.now()}`);
    await setDoc(missionRef, {
      userId,
      ...mission,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('[Save Mission Warning]:', err.message);
  }
};

// 6. Skills (`skills/`)
export const saveSkillToFirestore = async (userId, skill) => {
  try {
    const skillRef = doc(db, 'skills', skill.id || `sk_${Date.now()}`);
    await setDoc(skillRef, {
      userId,
      ...skill,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('[Save Skill Warning]:', err.message);
  }
};

// 7. Rewards Shop (`rewardShop/`)
export const saveRewardToFirestore = async (userId, reward) => {
  try {
    const rewardRef = doc(db, 'rewardShop', reward.id || `r_${Date.now()}`);
    await setDoc(rewardRef, {
      userId,
      ...reward,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('[Save Reward Warning]:', err.message);
  }
};

// 8. Redeem Reward (`rewardHistory/`)
export const redeemRewardInFirestore = async (userId, rewardId, costDP) => {
  try {
    const historyRef = collection(db, 'rewardHistory');
    await addDoc(historyRef, {
      userId,
      rewardId,
      cost: costDP,
      redeemedAt: new Date().toISOString(),
    });
    await logTransaction(userId, 'spend', costDP, `Redeemed Reward (${rewardId})`);
    await logTimelineEvent(userId, 'REWARD_REDEEMED', `Redeemed Reward (-${costDP} DP)`, 0, -costDP);
  } catch (err) {
    console.warn('[Redeem Reward Warning]:', err.message);
  }
};
