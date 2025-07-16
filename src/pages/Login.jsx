// ✅ Login.jsx (Using CustomInputSimple, Original Button)

// =========================================================================
//  IMPORTS
// =========================================================================
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Custom hook for authentication logic

// UI & Asset Imports
import logo from "../../img/logo-billchain.svg";
import mockup from "../../img/mockup.png";
import isotipo from "../../img/isotipo-blanco.svg";

// Component Imports
import CustomInputSimple from "../components/ui/FormElements/CustomInput";

// =========================================================================
//  HELPER COMPONENTS
// =========================================================================

/**
 * A simple inline SVG component for the Google icon.
 * Used to keep UI elements self-contained within the component when they are small and specific.
 */
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.94C34.553 6.173 29.626 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691c-1.319 3.204-2.061 6.822-2.061 10.609c0 3.787.742 7.405 2.061 10.609L10.702 30.7C9.395 28.061 8.831 25.106 8.831 22c0-3.106.564-6.061 1.871-8.7L6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-4.402-5.328C30.563 35.241 27.456 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-4.522 5.028C11.199 40.591 17.155 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l4.402 5.328C41.438 36.315 44 31.023 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

/**
 * Renders the login page for the application.
 * It handles user input, authentication requests (email/password and Google),
 * error display, and redirection based on authentication status.
 */
const Login = () => {
    // =========================================================================
    //  STATE & HOOKS
    // =========================================================================
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // Stores and displays login-related error messages.
    const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission status to disable UI elements.

    // Destructure all necessary values from the authentication hook.
    // This centralizes auth logic and keeps the component clean.
    const {
        isAuthenticated, // Boolean: Is the user currently logged in?
        loading,         // Boolean: Is the auth state currently being determined?
        signInWithEmail, // Function: (email, password) => Promise<void>
        loginWithGoogle  // Function: () => Promise<void>
    } = useAuth();

    // Debug log to monitor auth state changes during development.
    console.log(`Login Page - Loading: ${loading}, IsAuthenticated: ${isAuthenticated}`);

    // =========================================================================
    //  EFFECTS
    // =========================================================================
    useEffect(() => {
        // This effect runs when the authentication status changes.
        // If the user is no longer authenticated (e.g., after a logout),
        // we clear the form fields and any existing errors for a clean UI.
        if (!isAuthenticated) {
            setEmail("");
            setPassword("");
            setError(null);
        }
    }, [isAuthenticated]); // Dependency array ensures this runs only when `isAuthenticated` changes.

    // =========================================================================
    //  EVENT HANDLERS
    // =========================================================================

    /**
     * Handles the submission of the email/password login form.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default browser form submission.

        // Basic validation.
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Call the sign-in function from the useAuth hook.
            await signInWithEmail(email, password);
            // On success, the `isAuthenticated` state will change, triggering redirection.
        } catch (err) {
            // If the auth hook throws an error (e.g., invalid credentials), display it.
            setError("Invalid email or password.");
            console.error("Login failed:", err);
        } finally {
            // Ensure the submitting state is reset, whether the login succeeds or fails.
            setIsSubmitting(false);
        }
    };

    /**
     * Handles the Google Sign-In button click.
     */
    const handleGoogleLogin = async () => {
        setError(null); // Clear previous errors.
        try {
            await loginWithGoogle();
        } catch (err) {
            setError("Failed to sign in with Google.");
            console.error("Google login failed:", err);
        }
    };

    // =========================================================================
    //  CONDITIONAL RENDERING (LOADING & REDIRECTION)
    // =========================================================================

    // While the useAuth hook is determining the user's auth status, show a loading state.
    // This prevents a "flash" of the login form if the user is already authenticated.
    if (loading) {
        return <div>Loading...</div>;
    }

    // If the user is authenticated, redirect them to the main application dashboard.
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />; // `replace` prevents users from going back to the login page.
    }

    // =========================================================================
    //  JSX RENDER
    // =========================================================================
    return (
        <div className="flex min-h-screen">
            {/* Left Column: Login Form */}
            <div className="w-1/2 flex items-center justify-center bg-white p-12">
                <div className="w-full max-w-md">
                    {/* Header: Logo and Titles */}
                    <div className="mb-8 flex justify-center sm:justify-start">
                        <img src={logo} alt="Billchain Logo" className="w-48" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-center sm:text-left">Sign in</h2>
                    <p className="text-center sm:text-left text-gray-500 mb-8">
                        Welcome back! Please enter your details.
                    </p>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <CustomInputSimple
                            label="Email"
                            id="UserEmail"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(value) => {
                                setEmail(value);
                                if (error) setError(null); // Clear error on new input
                            }}
                            // Pass a non-empty string to trigger error styles without showing a specific message here.
                            error={error ? " " : null}
                        />
                        <CustomInputSimple
                            label="Password"
                            id="UserPassword"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(value) => {
                                setPassword(value);
                                if (error) setError(null); // Clear error on new input
                            }}
                            error={error ? " " : null}
                        />

                        {/* General error message area */}
                        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                        {/* Form Options: Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="h-4 w-4 text-[#4416A8] border-gray-300 rounded focus:ring-[#6945B9]"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <div>
                                <a href="#" className="text-sm font-medium text-[#4416A8] hover:text-[#301077]">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Primary Submit Button */}
                        <button
                            type="submit"
                            className="w-full inline-block rounded-lg h-[56px] bg-[#4416A8] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6945B9] active:bg-[#301077] focus:ring-2 focus:ring-[#4416A8] focus:ring-offset-2 focus:outline-none"
                            disabled={isSubmitting} // Disable button during submission
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>


                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center sm:text-left text-xs text-gray-500">
                        <p>© By VORSE {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Decorative Background & Marketing */}
            <div className="w-1/2 flex-col items-center justify-center p-6 bg-gradient-to-t from-[#2A0874] to-[#4416A8] hidden lg:flex">
                <div className="mb-4">
                    <img src={isotipo} alt="Isotipo" className="w-[72px] h-[72px]" />
                </div>
                <h2 className="text-white text-3xl font-bold mb-8 text-center max-w-sm">
                    Create invoices, reports and monitor
                </h2>
                <img src={mockup} alt="Mockup" className="w-full max-w-[600px] mb-8" />
                <p className="text-white text-center text-lg mb-8 max-w-md">
                    In Billchain you will be able to easily generate your company's invoices and monitor them, all with the highest security.
                </p>
            </div>
        </div>
    );
};

export default Login;