/**
 * @file InvoicePreview.jsx
 * @description A purely presentational component that renders a visual preview of an invoice.
 *              It receives all necessary data via props (`formData`, `selectedTemplate`) and has no
 *              internal state management for the form itself. This decouples the display logic
 *              from the state management and data fetching logic.
 */

import React from "react";
import { format as formatDateFns } from 'date-fns';

// ============================================================================
// LOCAL CONSTANTS
// ============================================================================

// NOTE: This constant is defined locally for this component's needs.
// In a larger application, this would ideally be imported from a central constants file
// (e.g., `src/constants/invoiceConstants.js`) to avoid duplication and ensure consistency.
const paymentMethodOptions = [
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const InvoicePreview = ({ formData, selectedTemplate }) => {

    // --- 1. Guard Clause / Initial State ---
    // Handles the case where no data is available or no valid template is selected.
    // This prevents rendering errors and provides a helpful placeholder to the user.
    if (!formData || (selectedTemplate !== 'standard_invoice' && selectedTemplate !== 'proforma_invoice')) {
        return (
            <div className="text-center text-gray-400 p-8 bg-gray-100 rounded-2xl h-full flex items-center justify-center">
                <p>Select a template and fill the form to see the preview.</p>
            </div>
        );
    }

    // --- 2. Derived State & Helper Functions ---
    // These are defined within the component to transform the raw `formData` into a display-friendly format.

    // A derived boolean for cleaner and more readable conditional rendering in the JSX.
    const isProforma = selectedTemplate === 'proforma_invoice';

    /**
     * Robust date formatting utility. Handles null, undefined, or invalid date strings gracefully.
     * @param {Date|string|null} date - The date to format.
     * @returns {string} The formatted date string (e.g., "Jan 01, 2023") or a placeholder.
     */
    const formatDate = (date) => {
        if (!date) return "—";
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            return isNaN(dateObj.getTime()) ? "—" : formatDateFns(dateObj, 'MMM dd, yyyy');
        } catch (error) { return "Invalid Date"; }
    };

    /**
     * Calculates all financial totals based on the current form data.
     * @returns {object} An object containing subtotal, taxAmount, shipping, discount, and totalDue.
     */
    const calculateTotals = () => {
        const items = formData.items || [];
        const subtotal = items.reduce((sum, item) => (sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0);
        const taxRate = parseFloat(formData.tax || 0) / 100;
        const taxAmount = subtotal * taxRate;
        const shipping = parseFloat(formData.shipping || 0);
        const discount = parseFloat(formData.discount || 0);
        const totalDue = subtotal + taxAmount + shipping - discount;
        return { subtotal, taxAmount, shipping, discount, totalDue };
    };
    const { subtotal, taxAmount, shipping, discount, totalDue } = calculateTotals();

    /**
     * Utility to format a number as a USD currency string.
     * @param {number|string} amount - The numeric value to format.
     * @returns {string} The formatted currency string (e.g., "$1,234.56").
     */
    const formatCurrency = (amount) => {
        const number = parseFloat(amount);
        if (isNaN(number)) return '$0.00';
        return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    // --- 3. JSX RENDER ---
    return (
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 h-full overflow-auto">
            {/* --- Header Section --- */}
            {/* Displays the company logo and primary invoice details like number and dates. */}
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200">
                <div className="w-12"> <img src="/Logo-preview.svg" alt="Company Logo" className="w-full h-auto" /> </div>
                <div className="text-right">
                    <h1 className="text-SM font-bold text-gray-800 mb-1">{isProforma ? 'PROFORMA INVOICE' : 'STANDARD INVOICE'}</h1>
                    <div className="text-xs text-gray-500 space-y-0.5">
                        <p><strong>{isProforma ? 'Proforma No.:' : 'Invoice No.:'}</strong> {formData.invoiceNumber || 'N/A'}</p>
                        <p><strong>Issue Date:</strong> {formatDate(formData.invoiceDate)}</p>
                        {isProforma ? ( <p><strong>Valid Until:</strong> {formatDate(formData.validUntil)}</p> ) : ( <p><strong>Due Date:</strong> {formatDate(formData.dueDate)}</p> )}
                    </div>
                </div>
            </div>

            {/* --- Bill From / Bill To Section --- */}
            {/* This section uses optional chaining (?.) and fallback values (||) to prevent crashes if data is incomplete. */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Bill From */}
                <div>
                    <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">BILL FROM</h2>
                    <div className="space-y-1 text-sm text-gray-700">
                        <p className="font-medium text-gray-800">{formData.billFrom?.companyName || "Your Company LLC"}</p>
                        <p>{formData.billFrom?.address || "123 Sample St"}</p>
                        <p>{formData.billFrom?.city || "Anytown, ST 12345"}</p>
                        <p>P: {formData.billFrom?.phone || "(555) 555-5555"}</p>
                        <p>E: {formData.billFrom?.email || "contact@yourcompany.com"}</p>
                    </div>
                </div>
                {/* Bill To */}
                <div>
                    <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">BILL TO</h2>
                    <div className="space-y-1 text-sm text-gray-700">
                        <p className="font-medium text-gray-800">{formData.billTo?.companyName || "Client Corp"}</p>
                        <p>{formData.billTo?.address || "456 Client Rd"}</p>
                        <p>{formData.billTo?.city || "Otherville, OT 67890"}</p>
                        <p>P: {formData.billTo?.phone || "(555) 123-4567"}</p>
                        <p>E: {formData.billTo?.email || "contact@clientcorp.com"}</p>
                    </div>
                </div>
            </div>

            {/* --- Items Table Section --- */}
            <div className="mb-8">
                <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">ITEMS</h2>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                        <tr className="text-left text-gray-600">
                            <th className="p-3 font-medium">Description</th>
                            <th className="p-3 font-medium text-center w-20">Qty</th>
                            <th className="p-3 font-medium text-right w-32">Unit Price</th>
                            <th className="p-3 font-medium text-right w-32">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Conditionally renders the item rows or a placeholder message if no valid items exist. */}
                        {formData.items && formData.items.length > 0 && formData.items[0]?.description ? (
                            formData.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                    <td className="p-3 text-gray-800">{item.description || "---"}</td>
                                    <td className="p-3 text-center text-gray-700">{item.quantity || "0"}</td>
                                    <td className="p-3 text-right text-gray-700">{formatCurrency(item.unitPrice)}</td>
                                    <td className="p-3 text-right text-gray-700 font-medium">{formatCurrency(item.total)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-3 text-center text-gray-400 italic">No items added yet.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Totals and Notes/Terms Section --- */}
            {/* Uses a grid layout to position notes and totals side-by-side on larger screens. */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                    <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">{isProforma ? "Terms & Conditions" : "Notes"}</h2>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.notes || (isProforma ? "- This is a proforma invoice...\n- Prices valid until..." : "Thank you!")}</p>
                </div>
                <div className="md:col-span-2">
                    <div className="space-y-2 text-sm text-gray-700 border p-4 rounded-lg bg-gray-50">
                        <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Tax ({formData.tax || 0}%):</span><span className="font-medium">{formatCurrency(taxAmount)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Shipping:</span><span className="font-medium">{formatCurrency(shipping)}</span></div>
                        {discount > 0 && (<div className="flex justify-between"><span className="text-gray-600">Discount:</span><span className="font-medium text-green-600">-{formatCurrency(discount)}</span></div>)}
                        <div className="border-t border-gray-300 my-2 pt-2"></div>
                        <div className="flex justify-between font-bold text-base text-gray-800"><span>Total Due:</span><span>{formatCurrency(totalDue)}</span></div>
                    </div>
                </div>
            </div>

            {/* --- Payment & Shipping Information Footer --- */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-700">
                <div className="mb-4">
                    <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">Payment Information</h3>
                    <p><strong>Terms:</strong> {formData.paymentTerms || "N/A"}</p>
                    {/* Finds the human-readable label for the selected payment method value. */}
                    <p><strong>Methods:</strong> {paymentMethodOptions.find(o => o.value === formData.paymentMethods)?.label || formData.paymentMethods || "N/A"}</p>
                    {/* Conditionally show bank details if relevant. */}
                    {(formData.paymentMethods === 'bank_transfer' || formData.bankInfo?.bankName) && ( <div className="mt-1 text-xs text-gray-500"> Bank: {formData.bankInfo?.bankName}, Acc: {formData.bankInfo?.accountNumber} </div> )}
                </div>
                {/* Conditionally show shipping info only for proforma invoices. */}
                {isProforma && (formData.estimatedDeliveryDate || formData.shippingMethod) && (
                    <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">Shipping Information</h3>
                        {formData.estimatedDeliveryDate && <p><strong>Est. Delivery:</strong> {formatDate(formData.estimatedDeliveryDate)}</p>}
                        {formData.shippingMethod && <p><strong>Method:</strong> {formData.shippingMethod}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoicePreview;