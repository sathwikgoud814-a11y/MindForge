import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
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
const auth = getAuth();

async function directDatabasePurge() {
  console.log('=====================================================');
  console.log('[DIRECT FIRESTORE PURGE] Connecting to project:', process.env.FIREBASE_PROJECT_ID);
  console.log('=====================================================');

  let deletedCount = 0;

  // 1. Get set of all currently valid User UIDs and Emails
  const usersSnap = await db.collection('users').get();
  const validUserIds = new Set();
  const validUserEmails = new Set();

  usersSnap.docs.forEach(doc => {
    validUserIds.add(doc.id);
    const data = doc.data();
    if (data.email) validUserEmails.add(data.email.toLowerCase().trim());
  });

  console.log(`Found ${validUserIds.size} valid registered users in Firestore.`);

  const collections = [
    'users', 'characters', 'careerTrees', 'duels', 'connections',
    'friendRequests', 'notifications', 'missions', 'skills',
    'rewardShop', 'rewardHistory', 'transactions', 'timeline'
  ];

  // 2. Delete demo docs & orphaned records for non-existent users
  for (const colName of collections) {
    try {
      const snap = await db.collection(colName).get();
      console.log(`Checking collection '${colName}' (${snap.docs.length} docs)...`);

      for (const doc of snap.docs) {
        const docId = doc.id;
        const lowerId = docId.toLowerCase();
        const data = doc.data();
        const strData = JSON.stringify(data).toLowerCase();

        let shouldDelete = false;
        let reason = '';

        if (lowerId.includes('demo') || strData.includes('demo') || strData.includes('vekta@system.elite')) {
          shouldDelete = true;
          reason = 'Demo record';
        } else if (colName === 'duels') {
          // Check if duel belongs to deleted user
          const chEmail = (data.challengerEmail || '').toLowerCase().trim();
          const oppEmail = (data.opponentEmail || '').toLowerCase().trim();
          const chId = data.challengerId || '';
          const oppId = data.opponentId || '';

          if ((chEmail && !validUserEmails.has(chEmail)) || (oppEmail && !validUserEmails.has(oppEmail)) || (chId && !validUserIds.has(chId)) || (oppId && !validUserIds.has(oppId))) {
            shouldDelete = true;
            reason = `Orphaned duel for deleted user (Challenger: ${chEmail || chId}, Opponent: ${oppEmail || oppId})`;
          }
        } else if (colName !== 'users' && colName !== 'characters' && colName !== 'careerTrees') {
          const uId = data.userId || data.hunterId || data.fromUserId || data.toUserId || '';
          if (uId && !validUserIds.has(uId)) {
            shouldDelete = true;
            reason = `Orphaned document for deleted userId ${uId}`;
          }
        }

        if (shouldDelete) {
          await db.collection(colName).doc(docId).delete();
          deletedCount++;
          console.log(`  [DELETED DOC] -> ${colName}/${docId} (${reason})`);
        }
      }
    } catch (err) {
      console.error(`  [Error reading collection ${colName}]:`, err.message);
    }
  }

  // 3. User Deduplication
  const emailMap = new Map();
  for (const doc of usersSnap.docs) {
    const data = doc.data();
    const email = (data.email || '').toLowerCase().trim();
    if (!email) continue;

    if (emailMap.has(email)) {
      const dupId = doc.id;
      await db.collection('users').doc(dupId).delete().catch(() => {});
      await db.collection('characters').doc(dupId).delete().catch(() => {});
      await db.collection('careerTrees').doc(`tree_${dupId}`).delete().catch(() => {});
      deletedCount++;
      console.log(`  [DELETED DUPLICATE USER DOC] -> users/${dupId} (Email: ${email})`);
      auth.deleteUser(dupId).catch(() => {});
    } else {
      emailMap.set(email, doc.id);
    }
  }

  console.log('=====================================================');
  console.log(`[SUCCESS] DIRECT PURGE COMPLETED! Purged ${deletedCount} documents from Firestore.`);
  console.log('=====================================================');
  process.exit(0);
}

directDatabasePurge().catch(err => {
  console.error('[PURGE ERROR]:', err);
  process.exit(1);
});
