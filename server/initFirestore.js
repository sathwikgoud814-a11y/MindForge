import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = getFirestore();

async function initAllFirestoreCollections() {
  console.log('[Firestore Init] Seeding initial collections into project:', process.env.FIREBASE_PROJECT_ID);

  try {
    // 1. users/
    await db.collection('users').doc('demo_user_1').set({
      uid: 'demo_user_1',
      email: 'vekta@system.elite',
      displayName: 'Vekta',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    // 2. characters/
    await db.collection('characters').doc('demo_user_1').set({
      userId: 'demo_user_1',
      characterName: 'Vekta',
      rank: 'Recruit Rank',
      level: 1,
      xp: 150,
      disciplinePoints: 320,
      archetype: 'Creative Builder',
      career: 'UI/UX Designer',
      destiny: 'Build SaaS Startup',
      currentSeason: 1,
      createdAt: new Date().toISOString(),
    });

    // 3. skills/
    await db.collection('skills').doc('skill_demo_1').set({
      userId: 'demo_user_1',
      name: 'UI Design & Layout',
      category: 'Design',
      level: 2,
      xp: 140,
      priority: 'High',
      career: 'UI/UX Designer',
    });

    // 4. missions/
    await db.collection('missions').doc('mission_demo_1').set({
      userId: 'demo_user_1',
      title: 'Design Figma UI Components & Design System Tokens',
      status: 'completed',
      difficulty: 'S-Rank',
      estimatedMinutes: 60,
      xpReward: 120,
      dpReward: 60,
      linkedSkills: ['UI Design & Layout', 'Figma'],
      linkedAttributes: ['Creativity', 'Focus'],
      completedAt: new Date().toISOString(),
    });

    // 5. rewardShop/
    await db.collection('rewardShop').doc('reward_demo_1').set({
      userId: 'demo_user_1',
      title: 'Specialty Espresso Coffee',
      cost: 90,
      category: 'Food',
      enabled: true,
    });

    // 6. rewardHistory/
    await db.collection('rewardHistory').doc('history_demo_1').set({
      userId: 'demo_user_1',
      rewardId: 'reward_demo_1',
      cost: 90,
      redeemedAt: new Date().toISOString(),
    });

    // 7. transactions/
    await db.collection('transactions').doc('trans_demo_1').set({
      userId: 'demo_user_1',
      type: 'earn',
      amount: 60,
      reason: 'Completed S-Rank Directive',
      timestamp: new Date().toISOString(),
    });

    // 8. timeline/
    await db.collection('timeline').doc('timeline_demo_1').set({
      userId: 'demo_user_1',
      type: 'MISSION_COMPLETED',
      title: 'Completed S-Rank Figma Directive',
      xp: 120,
      dp: 60,
      timestamp: new Date().toISOString(),
    });

    // 9. achievements/
    await db.collection('achievements').doc('achieve_demo_1').set({
      userId: 'demo_user_1',
      title: 'First Blood - System Awakened',
      earned: true,
      earnedAt: new Date().toISOString(),
    });

    // 10. hunters/
    await db.collection('hunters').doc('hunter_demo_1').set({
      userA: 'demo_user_1',
      userB: 'demo_user_2',
      status: 'accepted',
      createdAt: new Date().toISOString(),
    });

    // 11. duels/
    await db.collection('duels').doc('duel_demo_1').set({
      hunter1: 'demo_user_1',
      hunter2: 'demo_user_2',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      category: 'UI/UX Design',
    });

    // 12. notifications/
    await db.collection('notifications').doc('notif_demo_1').set({
      userId: 'demo_user_1',
      title: 'Welcome to MindForge Firestore System',
      read: false,
      createdAt: new Date().toISOString(),
    });

    // 13. aiReports/
    await db.collection('aiReports').doc('report_demo_1').set({
      userId: 'demo_user_1',
      type: 'weekly',
      summary: 'System Telemetry Scan: High discipline velocity in UI Design directives.',
      generatedAt: new Date().toISOString(),
    });

    // 14. careerTrees/
    await db.collection('careerTrees').doc('tree_demo_1').set({
      career: 'UI/UX Designer',
      skills: ['UI Design', 'Figma', 'Typography', 'Accessibility', 'UX Research'],
      updatedAt: new Date().toISOString(),
    });

    // 15. bosses/
    await db.collection('bosses').doc('boss_demo_1').set({
      title: 'Build SaaS MVP',
      difficulty: 'Legendary S-Rank',
      requiredXP: 4000,
      progress: 25,
      createdAt: new Date().toISOString(),
    });

    // 16. seasons/
    await db.collection('seasons').doc('season_demo_1').set({
      season: 1,
      rank: 'Gold',
      bestStreak: 14,
      highestSkill: 'UI Design & Layout',
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Successfully created all 16 Firestore collections in mindforgeos Cloud Firestore console!');
  } catch (err) {
    console.error('❌ Error creating collections:', err.message);
  }
}

initAllFirestoreCollections();
