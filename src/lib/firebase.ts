"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ----------------------------------------------
//  ✅ 1. ALL ENV VARIABLES must be NEXT_PUBLIC_
// ----------------------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ------------------------------------------------
//  ✅ 2. Prevent Firebase re-initialization
// ------------------------------------------------
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ------------------------------------------------
//  ✅ 3. Firebase Services (Client-Side Only)
// ------------------------------------------------
export const auth = getAuth(app);
export const db = getFirestore(app);

// ------------------------------------------------
//  ✅ 4. Google Auth Provider (required for Vercel)
// ------------------------------------------------
const provider = new GoogleAuthProvider();

// ------------------------------------------------
//  ✅ 5. Login — auto-fallback Popup → Redirect
//     (Fixes Vercel popup-blocked errors)
// ------------------------------------------------
export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error("⚠️ signInWithPopup failed, switching to redirect:", error);

    // On Vercel popup sometimes fails → use redirect instead
    try {
      await signInWithRedirect(auth, provider);
    } catch (redirectError) {
      console.error("❌ Google Redirect Login failed:", redirectError);
      throw redirectError;
    }
  }
};

// ------------------------------------------------
//  ✅ 6. Logout
// ------------------------------------------------
export const logout = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export default app;
