import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Custom hook for accessing auth state.

/**
 * A wrapper component that protects private routes.
 * It checks the user's authentication status and redirects unauthenticated users to /login.
 */
const PrivateRoute = ({ children }) => {
  // Get authentication and loading state from the context.
  const { isAuthenticated, loading } = useAuth();

  // Helpful log for debugging in development.
  console.log(`PrivateRoute - Loading: ${loading}, IsAuthenticated: ${isAuthenticated}`);

  // Show a loading indicator while verifying auth status.
  if (loading) {
    return <div>Loading session...</div>;
  }

  // Render protected content if authenticated; otherwise, redirect to /login.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

