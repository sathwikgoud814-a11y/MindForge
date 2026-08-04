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

  const collections = [
    'users', 'characters', 'careerTrees', 'duels', 'connections',
    'friendRequests', 'notifications', 'missions', 'skills',
    'rewardShop', 'rewardHistory', 'transactions', 'timeline'
  ];

  // 1. Delete ALL demo documents across all collections
  for (const colName of collections) {
    try {
      const snap = await db.collection(colName).get();
      console.log(`Checking collection '${colName}' (${snap.docs.length} docs)...`);

      for (const doc of snap.docs) {
        const docId = doc.id;
        const lowerId = docId.toLowerCase();
        const data = doc.data();
        const strData = JSON.stringify(data).toLowerCase();

        if (lowerId.includes('demo') || strData.includes('demo') || strData.includes('vekta@system.elite')) {
          await db.collection(colName).doc(docId).delete();
          deletedCount++;
          console.log(`  [DELETED DEMO DOC] -> ${colName}/${docId}`);
        }
      }
    } catch (err) {
      console.error(`  [Error reading collection ${colName}]:`, err.message);
    }
  }

  // 2. Direct Deduplication by Email in users/
  try {
    const usersSnap = await db.collection('users').get();
    const emailMap = new Map();

    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const email = (data.email || '').toLowerCase().trim();
      if (!email) continue;

      if (emailMap.has(email)) {
        // Redundant duplicate user -> DELETE from users, characters, careerTrees!
        const dupId = doc.id;
        await db.collection('users').doc(dupId).delete().catch(() => {});
        await db.collection('characters').doc(dupId).delete().catch(() => {});
        await db.collection('careerTrees').doc(`tree_${dupId}`).delete().catch(() => {});
        deletedCount++;
        console.log(`  [DELETED DUPLICATE USER DOC] -> users/${dupId} (Email: ${email})`);

        // Also delete from Auth if applicable
        auth.deleteUser(dupId).catch(() => {});
      } else {
        emailMap.set(email, doc.id);
      }
    }
  } catch (err) {
    console.error('[Error during user deduplication]:', err.message);
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
