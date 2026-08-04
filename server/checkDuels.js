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

async function checkDuels() {
  const snap = await db.collection('duels').get();
  console.log('--- DUELS IN FIRESTORE ---');
  snap.docs.forEach(doc => {
    console.log(doc.id, '->', doc.data());
  });

  const usersSnap = await db.collection('users').get();
  console.log('--- USERS IN FIRESTORE ---');
  usersSnap.docs.forEach(doc => {
    console.log(doc.id, '->', doc.data().displayName, '|', doc.data().email);
  });

  process.exit(0);
}

checkDuels();
