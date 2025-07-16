/**
 * @file AuthContext.jsx
 * @description Defines the authentication context and provider.
 *              Encapsulates Firebase auth logic, providing global user state,
 *              loading status, and auth actions (login, logout, etc.).
 *              Avoids prop drilling by exposing auth state to any component.
 */
import React, { createContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * @description Creates the React Context object for authentication.
 *              Components will use this context via the `useContext` hook to access auth state and functions.
 */
export const AuthContext = createContext(null);

// ============================================================================
// CONTEXT PROVIDER COMPONENT
// ============================================================================

/**
 * @description The AuthProvider component wraps the application and provides the AuthContext value.
 *              It manages the user state, listens for auth changes from Firebase, and exposes
 *              authentication functions to all its children.
 * @param {object} props
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 */
export const AuthProvider = ({ children }) => {
    // --------------------------------------------------------------------
    // STATE
    // --------------------------------------------------------------------
    const [user, setUser] = useState(null); // Holds the Firebase user object if authenticated, otherwise null.
    const [loading, setLoading] = useState(true); // Tracks the initial authentication check. Starts true.

    // --------------------------------------------------------------------
    // SIDE EFFECTS
    // --------------------------------------------------------------------
    // This effect is the core of our authentication system.
    useEffect(() => {
        // `onAuthStateChanged` is a real-time listener provided by Firebase.
        // It fires once on initial load, and again anytime the user signs in or out.
        // This is the single source of truth for the user's authentication state.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Firebase onAuthStateChanged - User:', currentUser ? { uid: currentUser.uid, email: currentUser.email } : 'None');
            setUser(currentUser); // Set the user object or null.
            setLoading(false); // The initial check is complete, so we can now render the app.
        });

        // The cleanup function: It's crucial to unsubscribe from the listener
        // when the component unmounts to prevent memory leaks.
        return () => unsubscribe();
    }, []); // The empty dependency array `[]` ensures this effect runs only once on mount.

    // --------------------------------------------------------------------
    // AUTHENTICATION FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * @description Initiates the Google Sign-In popup flow.
     * @throws {Error} Throws an error if the sign-in process fails (e.g., user closes the popup).
     */
    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // On success, the `onAuthStateChanged` listener will automatically update the user state.
        } catch (error) {
            console.error("Error during Google login:", error);
            throw error; // Re-throw the error so the UI layer can catch it and display a message.
        }
    };

    /**
     * @description Signs in a user with their email and password.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @throws {Error} Throws an error for invalid credentials or other issues.
     */
    const signInWithEmail = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // On success, `onAuthStateChanged` will handle the state update.
        } catch (error) {
            console.error("Error during email sign-in:", error.code);
            throw error;
        }
    };

    /**
     * @description Registers a new user with an email and password.
     * @param {string} email - The new user's email.
     * @param {string} password - The new user's password.
     * @throws {Error} Throws an error if registration fails (e.g., email already in use).
     */
    const signUpWithEmail = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // On success, `onAuthStateChanged` will handle the state update.
        } catch (error) {
            console.error("Error during sign-up:", error.code);
            throw error;
        }
    };

    /**
     * @description Signs the current user out.
     * @throws {Error} Throws an error if the sign-out process fails.
     */
    const logout = async () => {
        try {
            await signOut(auth);
            // On success, `onAuthStateChanged` will set the user state to null.
        } catch (error) {
            console.error("Error during logout:", error);
            throw error;
        }
    };

    // --------------------------------------------------------------------
    // CONTEXT VALUE
    // --------------------------------------------------------------------
    // This object bundles the state and functions that will be provided to consumer components.
    const value = {
        user,
        isAuthenticated: !!user, // A convenient boolean flag derived from the user state.
        loading,
        loginWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
    };

    // --------------------------------------------------------------------
    // RENDER
    // --------------------------------------------------------------------
    return (
        <AuthContext.Provider value={value}>
            {/*
              This is a crucial UX pattern: We don't render the children (the rest of the app)
              until the initial `onAuthStateChanged` check is complete (`loading` is false).
              This prevents a "flicker" where a logged-in user might briefly see a login page
              before being redirected.
            */}
            {!loading && children}
        </AuthContext.Provider>
    );
};