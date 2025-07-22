// ✅ src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

// -----------------------------------------------------------------------------
// RENDER FUNCTION
// -----------------------------------------------------------------------------
// Extracted into its own function for clarity and potential reuse.
const renderApp = () => {
  createRoot(document.getElementById("root")).render(
      <StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }}/>
      </StrictMode>
  );
};


// -----------------------------------------------------------------------------
// APPLICATION STARTUP LOGIC
// -----------------------------------------------------------------------------
// Orchestrates the entire startup process.
async function startApp() {
  // Conditionally enable MSW only if explicitly set via environment variable.
  if (import.meta.env.VITE_APP_MOCKING === 'enabled') {
    console.log("Mocking is enabled via environment variable. Attempting to start MSW...");
    try {
      // Dynamically import the MSW worker only when needed.
      const { worker } = await import('./mocks/browser.js');
      // Start the MSW worker with bypass for unhandled requests.
      await worker.start({ onUnhandledRequest: 'bypass' });
      console.log("MSW enabled and started successfully!");
    } catch (error) {
      console.error("Error starting MSW:", error);
    }
  } else {
    console.log("MSW is disabled. Connecting to the real backend.");
  }

  // Always render the app, regardless of MSW state.
  renderApp();
}

// -----------------------------------------------------------------------------
// BOOTSTRAP THE APPLICATION
// -----------------------------------------------------------------------------
startApp();