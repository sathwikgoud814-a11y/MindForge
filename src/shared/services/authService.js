import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { syncUserDocument } from './firestoreService';

const formatAuthError = (err) => {
  if (err?.code === 'auth/configuration-not-found' || err?.message?.includes('configuration-not-found')) {
    return 'Firebase Authentication is not enabled in your Firebase Console yet. Please visit Firebase Console > Build > Authentication and click "Get Started".';
  }
  if (err?.code === 'auth/api-key-not-valid' || err?.message?.includes('api-key-not-valid')) {
    return 'Invalid Firebase API Key in .env. Please update VITE_FIREBASE_API_KEY with your Web App API key from Firebase Console > Project Settings.';
  }
  if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
    return 'Invalid email or password. Creating a new account automatically...';
  }
  if (err?.code === 'auth/popup-closed-by-user') {
    return 'Sign in popup was closed before completion. Please try again.';
  }
  return err.message || 'Authentication failed.';
};

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    await syncUserDocument(res.user);
    return res.user;
  } catch (err) {
    console.error('[FirebaseAuth Google Error]:', err.message);
    throw new Error(formatAuthError(err));
  }
};

export const signInWithGithub = async () => {
  try {
    const res = await signInWithPopup(auth, githubProvider);
    await syncUserDocument(res.user);
    return res.user;
  } catch (err) {
    console.error('[FirebaseAuth GitHub Error]:', err.message);
    throw new Error(formatAuthError(err));
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await syncUserDocument(res.user);
    return res.user;
  } catch (err) {
    console.error('[FirebaseAuth Email SignIn Error]:', err.message);
    throw new Error(formatAuthError(err));
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await syncUserDocument(res.user);
    // Trigger Firebase Email Verification
    try {
      await sendEmailVerification(res.user);
    } catch (verr) {
      console.warn('[FirebaseAuth Verification Link Warning]:', verr.message);
    }
    return res.user;
  } catch (err) {
    console.error('[FirebaseAuth Email SignUp Error]:', err.message);
    throw new Error(formatAuthError(err));
  }
};

export const sendVerificationEmail = async (user) => {
  if (!user) return;
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.error('[FirebaseAuth Send Verification Error]:', err.message);
    throw new Error(formatAuthError(err));
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('[FirebaseAuth SignOut Error]:', err.message);
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
