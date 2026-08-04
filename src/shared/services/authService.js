import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  deleteUser
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { syncUserDocument } from './firestoreService';

const formatAuthError = (err) => {
  if (!err) return 'An unexpected authentication error occurred.';

  const code = err.code || '';
  const message = err.message || '';

  if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
    return 'OAuth Provider (Google/GitHub) is disabled in Firebase. Please enable it in Firebase Console > Build > Authentication > Sign-in method.';
  }
  if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
    return 'Domain is not authorized for Firebase Auth. Please add localhost in Firebase Console > Authentication > Settings > Authorized domains.';
  }
  if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
    return 'Sign-in popup was blocked by your browser. Please allow popups for localhost and try again.';
  }
  if (code === 'auth/api-key-not-valid' || message.includes('api-key-not-valid')) {
    return 'Invalid Firebase Web API Key in .env. Please check Firebase Console > Project Settings > General > Your Apps > Web App API key.';
  }
  if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
    return 'This email address is already registered in the System. Please switch to the "Sign In" tab above or continue with Google/GitHub.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || message.includes('invalid-credential') || message.includes('wrong-password')) {
    return 'Invalid email or password. Please verify your password or select "Create New Account" if you are a new player.';
  }
  if (code === 'auth/user-not-found' || message.includes('user-not-found')) {
    return 'No registered Hunter account found with this email address. Please switch to the "Create New Account" tab.';
  }
  if (code === 'auth/weak-password' || message.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
    return 'Authentication popup was closed before completion. Please try again.';
  }
  if (code === 'auth/configuration-not-found' || message.includes('configuration-not-found')) {
    return 'Firebase Authentication is not enabled in Firebase Console. Please visit Console > Build > Authentication.';
  }

  return `${code ? `[${code}]: ` : ''}${message || 'Authentication failed. Please verify your credentials.'}`;
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

export const deleteAccountAuth = async (user) => {
  const targetUser = user || auth.currentUser;
  if (targetUser) {
    try {
      await deleteUser(targetUser);
      console.log('[FirebaseAuth] Successfully deleted user credentials from Auth database.');
    } catch (err) {
      console.warn('[FirebaseAuth Delete Notice]:', err.message);
    }
  }
};
