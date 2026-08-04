import { adminDb, adminAuth } from '../config/firebaseAdmin.js';

export async function purgeDemoAndDuplicates() {
  if (!adminDb) {
    console.log('[DB Cleaner] Admin DB not initialized. Skipping automated purge.');
    return { deletedCount: 0 };
  }

  console.log('[DB Cleaner] Starting full Firestore & Auth purge of demo data and email duplicates...');
  let deletedCount = 0;

  const collections = [
    'users', 'characters', 'careerTrees', 'duels', 'connections',
    'friendRequests', 'notifications', 'missions', 'skills',
    'rewardShop', 'rewardHistory', 'transactions', 'timeline'
  ];

  // 1. Delete ALL demo documents across all Firestore collections
  for (const col of collections) {
    try {
      const snap = await adminDb.collection(col).get();
      for (const doc of snap.docs) {
        const id = doc.id.toLowerCase();
        const data = doc.data();
        const strData = JSON.stringify(data).toLowerCase();

        if (id.startsWith('demo') || id.includes('demo') || strData.includes('demo_user') || strData.includes('vekta@system.elite')) {
          await adminDb.collection(col).doc(doc.id).delete();
          deletedCount++;
          console.log(`[DB Cleaner] Deleted demo doc ${doc.id} from collection ${col}`);
        }
      }
    } catch (e) {
      console.warn(`[DB Cleaner Error col ${col}]:`, e.message);
    }
  }

  // 2. Strict Deduplication by Email in users/ & characters/
  try {
    const usersSnap = await adminDb.collection('users').get();
    const emailToDocIdMap = new Map();

    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const rawEmail = data.email || '';
      const email = rawEmail.toLowerCase().trim();

      if (!email) continue;

      if (emailToDocIdMap.has(email)) {
        // Redundant duplicate document with same email -> DELETE
        const dupId = doc.id;
        await adminDb.collection('users').doc(dupId).delete().catch(() => {});
        await adminDb.collection('characters').doc(dupId).delete().catch(() => {});
        await adminDb.collection('careerTrees').doc(`tree_${dupId}`).delete().catch(() => {});
        deletedCount++;
        console.log(`[DB Cleaner] Deleted duplicate Firestore user doc ${dupId} for email: ${email}`);

        // Try deleting Auth user for duplicate UID if applicable
        if (adminAuth) {
          adminAuth.deleteUser(dupId).catch(() => {});
        }
      } else {
        emailToDocIdMap.set(email, doc.id);
      }
    }
  } catch (e) {
    console.warn('[DB Cleaner Deduplication Error]:', e.message);
  }

  console.log(`[DB Cleaner Complete] Total ${deletedCount} demo/duplicate documents purged from Firestore.`);
  return { deletedCount };
}
