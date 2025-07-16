// src/services/authService.js

import { getAuth } from "firebase/auth";
/**
 * Safely retrieves the current user's Firebase ID token.
 * This function is decoupled from any React context or component.
 * Its sole responsibility is to interact with the Firebase SDK and return a valid ID token.
 *
 * @returns {Promise<string|null>} The user's ID token as a string, or null if no user is signed in.
 */
export const getCurrentUserToken = async () => {
    // Get the global auth instance configured in firebase/config.js.
    const auth = getAuth();
    const user = auth.currentUser;

    // If a user is signed in, return their ID token.
    // Passing 'true' to getIdToken forces a refresh if the token is about to expire.
    if (user) {

        return await user.getIdToken(true);
    }

    // If no user is signed in, return null.
    return null;
};