// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhvu9zVtcbaWnq_84rmTdDSpb389oHEN0",
  authDomain: "riskguardai-0123.firebaseapp.com",
  projectId: "riskguardai-0123",
  storageBucket: "riskguardai-0123.firebasestorage.app",
  messagingSenderId: "454935417856",
  appId: "1:454935417856:web:3caed9e15aa182b94ff4e5",
  measurementId: "G-NCFMBLFVMD",
  databaseURL: "https://riskguardai-0123-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Realtime Database
export const realtimeDb = getDatabase(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (optional)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// For development/demo purposes, you can use the Firestore emulator
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // Emulator already connected
  }
}

export default app;
