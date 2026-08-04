import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA_mindforgeos_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mindforgeos.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mindforgeos',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mindforgeos.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '109236724433',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:109236724433:web:mindforgeos',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
