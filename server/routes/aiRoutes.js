import express from 'express';
import { AIService } from '../services/aiService.js';
import { adminDb } from '../config/firebaseAdmin.js';

const router = express.Router();

const handleAiTask = (taskFn) => async (req, res) => {
  try {
    const result = await taskFn(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(`[AI Route Error]:`, error.message);
    res.status(503).json({
      success: false,
      error: 'The System is temporarily unavailable.',
      message: error.message,
    });
  }
};

// GET Real Network Hunters from Firebase Admin SDK (Deduplicated)
router.get('/network-hunters', async (req, res) => {
  try {
    if (!adminDb) {
      return res.json({ success: true, data: [] });
    }

    const usersSnap = await adminDb.collection('users').get();
    const charsSnap = await adminDb.collection('characters').get();

    const charsMap = {};
    charsSnap.forEach(doc => {
      charsMap[doc.id] = doc.data();
    });

    const uniqueHuntersMap = new Map();

    usersSnap.forEach(doc => {
      const uData = doc.data();
      const cData = charsMap[doc.id] || {};
      const rawEmail = (uData.email || '').toLowerCase().trim();
      const rawName = (uData.displayName || cData.characterName || uData.email?.split('@')[0] || '').toLowerCase().trim();

      // STRICT FILTER: Exclude dummy '@system.elite' fallback accounts completely
      if (rawEmail.includes('@system.elite')) {
        return;
      }

      // Deduplicate by name or email
      const dedupKey = rawName || rawEmail || uData.uid || doc.id;

      const hunterObj = {
        id: uData.uid || doc.id,
        name: uData.displayName || cData.characterName || uData.email?.split('@')[0] || 'Registered Hunter',
        email: uData.email || '',
        rank: cData.rank || 'Recruit Rank',
        level: cData.level ?? 1,
        xp: cData.xp ?? 100,
        dp: cData.disciplinePoints ?? 200,
        career: cData.career || uData.career || 'Software Engineer',
        streakDays: cData.streakDays || 1,
        onlineStatus: 'Online',
        avatar: uData.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${uData.uid || doc.id}`,
        topSkills: ['Directives', 'Discipline'],
        achievements: ['Real Registered User'],
        studyHours: cData.studyHours || 0,
        workoutHours: cData.workoutHours || 0,
        focusHours: cData.focusHours || 0,
        completionPct: cData.completionPct || 0,
        attributes: { discipline: 10, focus: 10, knowledge: 10, strength: 10 },
      };

      // Prefer real registered profile over duplicate entries
      const existing = uniqueHuntersMap.get(dedupKey);
      if (!existing) {
        uniqueHuntersMap.set(dedupKey, hunterObj);
      } else if (!existing.email && uData.email) {
        uniqueHuntersMap.set(dedupKey, hunterObj);
      }
    });

    const huntersList = Array.from(uniqueHuntersMap.values());
    res.json({ success: true, data: huntersList });
  } catch (err) {
    console.error('[Network Hunters Admin Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Send Duel Challenge to target player
router.post('/send-duel', async (req, res) => {
  try {
    if (!adminDb) {
      return res.status(500).json({ success: false, error: 'Firebase Admin not initialized' });
    }

    const { challenger, character, opponent, duration, category } = req.body;
    const duelId = `duel_${Date.now()}`;

    const duelData = {
      id: duelId,
      challengerId: challenger?.uid || 'user_local',
      challengerName: character?.name || challenger?.displayName || 'Hunter',
      challengerEmail: challenger?.email || '',
      opponentId: opponent?.id || '',
      opponentName: opponent?.name || 'Hunter Partner',
      opponentEmail: opponent?.email || '',
      category: category || 'General Discipline',
      duration: duration || '24 Hours',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore `duels/` collection
    await adminDb.collection('duels').doc(duelId).set(duelData);

    // Save notification to Firestore `notifications/` collection for opponent
    const notifId = `notif_${Date.now()}`;
    await adminDb.collection('notifications').doc(notifId).set({
      id: notifId,
      recipientId: opponent?.id,
      recipientEmail: opponent?.email?.toLowerCase()?.trim(),
      senderName: character?.name || 'Hunter',
      title: '⚔️ Incoming Duel Challenge!',
      message: `${character?.name || 'A Hunter'} challenged you to a ${duration || '24h'} ${category || 'Discipline'} Duel!`,
      duelId: duelId,
      category: category,
      duration: duration,
      read: false,
      createdAt: new Date().toISOString(),
    });

    console.log(`[Firestore Admin Duel] Challenge sent from ${character?.name} to ${opponent?.name}`);
    res.json({ success: true, message: 'Duel challenge sent successfully!', duel: duelData });
  } catch (err) {
    console.error('[Send Duel Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Pending & Active Duels for a User
router.get('/my-duels', async (req, res) => {
  try {
    if (!adminDb) {
      return res.json({ success: true, data: [] });
    }

    const userEmail = (req.query.email || '').toLowerCase().trim();
    const userId = (req.query.userId || '').trim();
    const userName = (req.query.name || '').toLowerCase().trim();

    const duelsSnap = await adminDb.collection('duels').get();
    const myDuels = [];

    duelsSnap.forEach(doc => {
      const d = doc.data();
      const oppEmail = (d.opponentEmail || '').toLowerCase().trim();
      const chalEmail = (d.challengerEmail || '').toLowerCase().trim();
      const oppName = (d.opponentName || '').toLowerCase().trim();
      const chalName = (d.challengerName || '').toLowerCase().trim();

      const isMatch = (
        (userEmail && (oppEmail === userEmail || chalEmail === userEmail)) ||
        (userId && (d.opponentId === userId || d.challengerId === userId)) ||
        (userName && (oppName.includes(userName) || chalName.includes(userName))) ||
        (!userEmail && !userId && !userName)
      );

      if (isMatch) {
        myDuels.push(d);
      }
    });

    res.json({ success: true, data: myDuels });
  } catch (err) {
    console.error('[Get My Duels Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Respond to Duel (Accept / Decline)
router.post('/respond-duel', async (req, res) => {
  try {
    if (!adminDb) {
      return res.status(500).json({ success: false, error: 'Firebase Admin not initialized' });
    }

    const { duelId, action } = req.body; // action: "accept" | "decline"
    const newStatus = action === 'accept' ? 'active' : 'declined';

    await adminDb.collection('duels').doc(duelId).update({
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, status: newStatus });
  } catch (err) {
    console.error('[Respond Duel Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Update Duel Score & Live Progress
router.post('/update-duel-score', async (req, res) => {
  try {
    if (!adminDb) {
      return res.status(500).json({ success: false, error: 'Firebase Admin not initialized' });
    }

    const { duelId, userScore, opponentScore, userMissions, opponentMissions, userFocusHours, opponentFocusHours, currentLeader, duelMissions, liveFeed } = req.body;

    const updateObj = { updatedAt: new Date().toISOString() };
    if (typeof userScore === 'number') updateObj.userScore = userScore;
    if (typeof opponentScore === 'number') updateObj.opponentScore = opponentScore;
    if (typeof userMissions === 'number') updateObj.userMissions = userMissions;
    if (typeof opponentMissions === 'number') updateObj.opponentMissions = opponentMissions;
    if (typeof userFocusHours === 'number') updateObj.userFocusHours = userFocusHours;
    if (typeof opponentFocusHours === 'number') updateObj.opponentFocusHours = opponentFocusHours;
    if (currentLeader) updateObj.currentLeader = currentLeader;
    if (duelMissions) updateObj.duelMissions = duelMissions;
    if (liveFeed) updateObj.liveFeed = liveFeed;

    await adminDb.collection('duels').doc(duelId).update(updateObj);

    res.json({ success: true, message: 'Duel scores updated successfully' });
  } catch (err) {
    console.error('[Update Duel Score Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Sync Profile to Firestore via Firebase Admin SDK
router.post('/sync-profile', async (req, res) => {
  try {
    if (!adminDb) {
      return res.status(500).json({ success: false, error: 'Firebase Admin not initialized' });
    }

    const { userId, character, onboardingData } = req.body;
    const uid = userId || 'user_' + Date.now();

    // 1. users/ document
    await adminDb.collection('users').doc(uid).set({
      uid: uid,
      displayName: character?.name || onboardingData?.name || 'Vekta',
      email: onboardingData?.email || `${uid}@system.elite`,
      photoURL: onboardingData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      career: character?.primaryCareer || onboardingData?.career || 'UI/UX Designer',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    // 2. characters/ document
    await adminDb.collection('characters').doc(uid).set({
      userId: uid,
      characterName: character?.name || onboardingData?.name || 'Vekta',
      rank: character?.rank || 'Recruit Rank',
      level: character?.level ?? 0,
      xp: character?.xp ?? 0,
      disciplinePoints: character?.dp ?? 0,
      archetype: character?.archetype || onboardingData?.archetype || 'Creative Builder',
      career: character?.primaryCareer || onboardingData?.career || 'UI/UX Designer',
      destiny: character?.destinyIdentity || onboardingData?.destinyIdentity || 'Build SaaS Startup',
      currentSeason: 1,
      createdAt: new Date().toISOString(),
    }, { merge: true });

    // 3. careerTrees/ document
    const career = character?.primaryCareer || onboardingData?.career || 'UI/UX Designer';
    await adminDb.collection('careerTrees').doc(`tree_${uid}`).set({
      userId: uid,
      career: career,
      destinyIdentity: character?.destinyIdentity || onboardingData?.destinyIdentity || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log(`[Firestore Admin Sync] Successfully saved profile & collections for ${uid}`);
    res.json({ success: true, message: 'Profile synced to Firestore' });
  } catch (err) {
    console.error('[Firestore Admin Sync Error]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/generate-missions', handleAiTask(b => AIService.generateMissions(b.context)));

router.post('/validate-mission', handleAiTask(b => AIService.validateMission(b.missionTitle, b.category, b.context)));

router.post('/recommend-skills', handleAiTask(b => AIService.recommendSkills(b.context)));

router.post('/analyze-character', handleAiTask(b => AIService.analyzeCharacter(b.context)));

router.post('/weekly-review', handleAiTask(b => AIService.weeklyReview(b.context)));

router.post('/monthly-review', handleAiTask(b => AIService.monthlyReview(b.context)));

router.post('/recommend-reward', handleAiTask(b => AIService.recommendReward(b.context)));

router.post('/optimize-schedule', handleAiTask(b => AIService.optimizeSchedule(b.context)));

router.post('/analyze-duel', handleAiTask(b => AIService.analyzeDuel(b.context)));

router.post('/generate-boss', handleAiTask(b => AIService.generateBoss(b.context)));

router.post('/expand-skills', handleAiTask(b => AIService.expandSkills(b.context)));

router.post('/timeline-summary', handleAiTask(b => AIService.timelineSummary(b.context)));

router.post('/onboarding-analysis', handleAiTask(b => AIService.onboardingAnalysis(b.context)));

router.get('/models', async (req, res) => {
  try {
    const modelsData = await AIService.getSystemModels();
    res.json({ success: true, data: modelsData });
  } catch (err) {
    res.json({ success: false, data: { activeModel: 'Rule-Engine Fallback', installedModels: [] } });
  }
});

export default router;
