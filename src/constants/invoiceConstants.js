/**
 * @file invoiceConstants.js
 * @description This file serves as the single source of truth for all constants related to invoices.
 *              It includes UI options for dropdowns, internal keys, and mapping functions
 *              to translate frontend values to backend-expected formats. This approach prevents
 *              "magic strings" and makes the application easier to maintain.
 */

// ============================================================================
// FRONTEND UI CONSTANTS
// These constants are used within the React application for state and UI rendering.
// ============================================================================

/**
 * Defines the internal keys used within the frontend application to represent
 * different invoice types.
 */
export const INVOICE_TYPES = {
    STANDARD: 'standard_invoice',
    PROFORMA: 'proforma_invoice',
};

/**
 * An array of objects specifically formatted for use in UI dropdowns or <select> components.
 * It maps the internal keys from `INVOICE_TYPES` to human-readable labels.
 */
export const INVOICE_TYPE_OPTIONS = [
    { value: "", label: "Select Invoice Type..." },
    { value: INVOICE_TYPES.STANDARD, label: "Standard Invoice" },
    { value: INVOICE_TYPES.PROFORMA, label: "Proforma Invoice" }
];

/**
 * An array of objects formatted for the payment method selection dropdown in the UI.
 */
export const PAYMENT_METHOD_OPTIONS = [
    { value: "", label: "Select a payment method..." },
    { value: "bank_transfer", label: "Bank Transfer (ACH/Wire)" },
    { value: "credit_card", label: "Credit Card" },
    { value: "paypal", label: "PayPal" },
    { value: "check", label: "Check" },
    { value: "stripe", label: "Stripe" },
    { value: "zelle", label: "Zelle" },
    { value: "venmo", label: "Venmo" },
    { value: "cash", label: "Cash" },
    { value: "other", label: "Other (Specify in Notes)" },
];

/**
 * Defines constant keys for form field names. This helps prevent typos when
 * accessing nested form data (e.g., `formData[FORM_KEYS.BILL_FROM]`).
 */
export const FORM_KEYS = {
    BILL_FROM: 'billFrom',
    BILL_TO: 'billTo',

};

// ============================================================================
// BACKEND API CONSTANTS
// These constants represent the exact values the backend API expects.
// ============================================================================

/**
 * Defines the exact string values that the backend API expects for the `template_type` field.
 * This is kept as an internal constant and is not exported, as it's only used by the
 * `mapFormTypeToApiType` function below. This encapsulates the backend-specific knowledge.
 */
const API_TEMPLATE_TYPES = {
    STANDARD: 'STANDARD',
    PROFORMA: 'PROFORMA',
};

// ============================================================================
// DATA MAPPING / TRANSFORMATION LOGIC
// ============================================================================

/**
 * Translates the frontend-specific invoice type key (e.g., 'standard_invoice')
 * to the corresponding string value that the backend API requires (e.g., 'STANDARD').
 * This function acts as an "Adapter" between the frontend and backend data models.
 * @param {string} formType - The value from the frontend, which should be one of the keys from `INVOICE_TYPES`.
 * @returns {string|null} The corresponding backend API value from `API_TEMPLATE_TYPES`, or `null` if no match is found.
 */
export const mapFormTypeToApiType = (formType) => {
    // The mapping object provides a clean, key-value lookup.
    const mapping = {
        // [frontend_key]: backend_value
        [INVOICE_TYPES.STANDARD]: API_TEMPLATE_TYPES.STANDARD,
        [INVOICE_TYPES.PROFORMA]: API_TEMPLATE_TYPES.PROFORMA,
    };
    // Return the mapped value, or null if the formType is not a valid key.
    return mapping[formType] || null;
};