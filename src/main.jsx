// ✅ src/main.jsx (Corrected MSW Import Path)

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// --- Función MSW ---
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    console.log("MSW disabled (not in development mode).");
    return;
  }
  try {
    console.log("Attempting to start MSW for development...");
    // --- CORREGIDO: Ruta apunta a la carpeta 'data' ---
    const { worker } = await import('./data/browser'); // <-- AJUSTADO
    // -----------------------------------------------
    await worker.start({ onUnhandledRequest: 'bypass' });
    console.log("MSW enabled and started successfully!");
  } catch (error) {
    console.error("Error starting MSW:", error);
  }
}
// -------------------

// --- Renderizado ---
enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }}/>
    </StrictMode>
  );
});
// -----------------