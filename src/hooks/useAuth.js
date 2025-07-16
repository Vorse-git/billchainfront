// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
/**
 * Custom hook to access the authentication context.
 * Provides a safe way to consume AuthContext and throws an error
 * if used outside an AuthProvider.
 */
export const useAuth = () => {
    // Get the AuthContext value.
    const context = useContext(AuthContext);

    // Throw an explicit error if the hook is used outside of <AuthProvider>.
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};