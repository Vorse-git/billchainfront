// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// =============================================================================
// FIREBASE CONFIGURATION
// =============================================================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional.
const firebaseConfig = {
  apiKey: "AIzaSyBUnTzmled7PhlduaPedt_JAForBIDR_Bw",
  authDomain: "prueba-token-c6840.firebaseapp.com",
  projectId: "prueba-token-c6840",
  storageBucket: "prueba-token-c6840.appspot.com",
  messagingSenderId: "396255297727",
  appId: "1:396255297727:web:eb7b353e22d594a7fc060a",
  measurementId: "G-RMF2DLG32E"
};

// Initialize the Firebase app instance.
// This should be done only once in the entire application.
const app = initializeApp(firebaseConfig);

// =============================================================================
// AUTHENTICATION SERVICES
// =============================================================================

// Export the Firebase Auth instance to handle user authentication globally.
export const auth = getAuth(app);

// WARNING: Attach the auth instance to the window for debugging.
// Remove or disable in production if not needed.
window.auth = auth;

// Export the Google Auth Provider for OAuth login with Google accounts.
export const googleProvider = new GoogleAuthProvider();
