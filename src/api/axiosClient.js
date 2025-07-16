/**
 * @file axiosClient.js
 * @description This file configures and exports a centralized Axios instance.
 *              It's designed to automatically handle API base URLs and, most importantly,
 *              inject Firebase authentication tokens into outgoing requests and manage
 *              global authentication errors (like 401 Unauthorized).
 * @author Your Name/Team
 */
import axios from 'axios';
import { auth } from '../firebase/config'; // Import the Firebase auth instance.

// ============================================================================
// CONFIGURATION
// ============================================================================

// Define the base URL for the API. Using an environment variable is a best practice
// as it allows for different URLs in development, staging, and production environments.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

/**
 * @description A pre-configured Axios instance.
 *              Centralizing this ensures all API calls share the same base settings,
 *              making the application easier to maintain and update.
 */
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * @description This interceptor runs *before* each request is sent from the application.
 *              Its primary purpose is to dynamically inject the user's Firebase
 *              authentication token into the request headers.
 */
axiosClient.interceptors.request.use(
    async (config) => {
        // Get the currently signed-in user from the Firebase SDK.
        const user = auth.currentUser;

        // Only add token if user is logged in.
        if (user) {
            try {
                // Get the user's ID token (JWT).
                const token = await user.getIdToken();

                // Attach token using Bearer format.
                config.headers.Authorization = `Bearer ${token}`;
                console.log("Firebase ID token attached to request headers.");
            } catch (error) {
                console.error("Error getting Firebase ID token:", error);
            }
        }

        // Return modified config.
        return config;
    },
    (error) => {
        // Handle errors during request setup.
        console.error("Error in request interceptor:", error);
        return Promise.reject(error);
    }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * @description This interceptor runs *after* a response is received from the server.
 *              It allows for global handling of responses and errors, which is ideal
 *              for managing authentication state.
 */
axiosClient.interceptors.response.use(
    (response) => {
        // Pass successful responses through.
        return response;
    },
    (error) => {
        // Destructure status with fallback.
        const { status } = error.response || {};

        // Handle 401 Unauthorized.
        if (status === 401) {

            console.error("401 Unauthorized: The token may be invalid or expired. User should be logged out.");
            // Trigger global logout or redirect if needed.
        }
        // Re-throw for local handling.
        return Promise.reject(error);
    }
);

export default axiosClient;