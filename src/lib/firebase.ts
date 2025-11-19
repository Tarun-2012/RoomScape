"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- Firebase Config ---
// All variables MUST be NEXT_PUBLIC_ because Firebase runs on the client.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId is optional — only used for analytics
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

// --- Prevent re-initialization in dev mode ---
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- Firebase Services ---
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Google Auth Provider ---
const provider = new GoogleAuthProvider();

// --- Helper: Login with Google ---
export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// --- Helper: Logout ---
export const logout = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export default app;
