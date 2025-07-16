// ✅ src/data/handlers.js (CORREGIDO - Sin importar mockInvoices)
import { http, HttpResponse } from 'msw';

// --- Empezar con array vacío ---
let invoices = []; // La inicialización ahora es siempre un array vacío
console.log(`[MSW] Initialized with ${invoices.length} invoices.`);
// -------------------------------

export const handlers = [
    // GET /api/invoices
    http.get('*/api/v1/invoices', ({request}) => {
        console.log('[MSW] Intercepted GET /api/v1/invoices');
        return HttpResponse.json(invoices); // Devolver el array (posiblemente vacío al principio)
    }),

    // POST /api/invoices
    http.post('*/api/v1/invoices', async ({ request }) => {
        console.log('[MSW] POST /api/invoices');
        try {
            const newInvoiceData = await request.json();
            const newInvoiceWithId = { /* ... añadir ID y status ... */ };
            invoices.push(newInvoiceWithId); // Añadir al array en memoria
            console.log('[MSW] Invoice added. Count:', invoices.length);
            return HttpResponse.json(newInvoiceWithId, { status: 201 });
        } catch (error) { /* ... manejo error ... */ }
    }),

];