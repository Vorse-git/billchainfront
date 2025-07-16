// ✅ src/data/browser.js (Using specific browser import for setupWorker)
// --- MODIFICADO: Importar setupWorker específicamente desde 'msw/browser' ---
import { setupWorker } from 'msw/browser';
// -----------------------------------------------------------------------
import { handlers } from './handlers.js';

// Configura el worker (sin cambios aquí)
export const worker = setupWorker(...handlers);