import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBaHdNyyA6BcMaezAqohkROOB1xZpA5efI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mindforgeos.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mindforgeos',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mindforgeos.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '951890156232',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:951890156232:web:de7cf6166b22350effa3fd',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Use initializeAuth with persistence fallback chain to handle browser extensions
// blocking IndexedDB (ERR_BLOCKED_BY_CLIENT / Database is closing/hidden)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence],
  });
} catch (e) {
  // Already initialized (HMR re-run) — grab the existing instance
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
