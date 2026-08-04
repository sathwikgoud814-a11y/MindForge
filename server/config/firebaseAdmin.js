import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

let app = null;

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && privateKey) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('[Firebase Admin SDK] Initialized successfully for project:', process.env.FIREBASE_PROJECT_ID);
    } else {
      console.warn('[Firebase Admin SDK] Missing environment variables. Skipping Admin SDK initialization.');
    }
  } catch (err) {
    console.error('[Firebase Admin SDK Initialization Error]:', err.message);
  }
} else {
  app = getApps()[0];
}

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;
