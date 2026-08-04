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

async function wipeOldDuelsAndDeletedUser() {
  console.log('--- PURGING DELETED USER & OLD DUELS ---');

  // 1. Delete legacy user HzwSI0ufJedWDHo8W8khR97P6lj1
  const legacyId = 'HzwSI0ufJedWDHo8W8khR97P6lj1';
  await db.collection('users').doc(legacyId).delete().catch(() => {});
  await db.collection('characters').doc(legacyId).delete().catch(() => {});
  await db.collection('careerTrees').doc(`tree_${legacyId}`).delete().catch(() => {});
  auth.deleteUser(legacyId).catch(() => {});
  console.log('Deleted legacy user:', legacyId);

  // 2. Wipe ALL old test duels from duels/
  const duelsSnap = await db.collection('duels').get();
  for (const doc of duelsSnap.docs) {
    await db.collection('duels').doc(doc.id).delete();
    console.log('Deleted old duel:', doc.id);
  }

  console.log('--- PURGE COMPLETED SUCCESSFULLY ---');
  process.exit(0);
}

wipeOldDuelsAndDeletedUser();
