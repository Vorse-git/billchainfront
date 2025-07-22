/**
 * @file useInvoiceForm.js
 * @description This custom hook encapsulates all the business logic for creating and validating an invoice.
 *              It manages form state, validation, and API submission, allowing the UI component
 *              (e.g., CreateInvoice.jsx) to remain clean and focused on presentation.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createInvoice } from '../services/invoiceService'; // Service to handle API communication.

/**
 * A custom hook to manage the state and logic of the invoice creation form.
 * @param {object} initialState - The initial state object for the form data.
 * @returns {object} An object containing form state and handler functions to be used by a component.
 */
export const useInvoiceForm = (initialState) => {
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // --- VALIDATION LOGIC ---
    /**
     * A pure function that validates the form data.
     * Being a pure function makes it predictable and easy to test in isolation.
     * @param {object} data - The current form data to validate.
     * @param {string} template - The selected invoice template type.
     * @returns {object} An object containing validation errors. An empty object means the form is valid.
     */
    const validateForm = (data, template) => {
        const newErrors = {};
        const requiredFieldErrorMsg = "This field is required";

        // Validate template selection
        if (!template) newErrors.template = "Please select an invoice type";

        // Template-specific validations
        if (template === 'standard_invoice') {
            if (!data.dueDate) newErrors.dueDate = "Please select a due date";
        } else if (template === 'proforma_invoice') {
            if (!data.validUntil) newErrors.validUntil = "Please select a valid until date";
        }

        // Common field validations
        if (!data.paymentTerms.trim()) newErrors.paymentTerms = requiredFieldErrorMsg;
        if (!data.paymentMethods) newErrors.paymentMethods = "Please select a payment method";

        // Nested object validations (using dot notation for keys to simplify mapping in the UI)
        if (!data.billFrom.companyName.trim()) newErrors['billFrom.companyName'] = requiredFieldErrorMsg;
        if (!data.billTo.companyName.trim()) newErrors['billTo.companyName'] = requiredFieldErrorMsg;
        // ... more validations for address, city, etc., would go here.

        // Array of items validation
        if (!data.items || data.items.length === 0 || data.items.every(item => !item.description)) {
            newErrors.itemsGeneral = "Please add at least one valid item.";
        } else {
            data.items.forEach((item, index) => {
                // Only validate rows that have been touched
                if (item.description || item.quantity || item.unitPrice) {
                    if (!item.description.trim()) newErrors[`items[${index}].description`] = requiredFieldErrorMsg;
                    if (isNaN(parseFloat(item.quantity)) || parseFloat(item.quantity) <= 0) newErrors[`items[${index}].quantity`] = "Must be > 0";
                    if (isNaN(parseFloat(item.unitPrice)) || parseFloat(item.unitPrice) <= 0) newErrors[`items[${index}].unitPrice`] = "Must be > 0";
                }
            });
        }
        return newErrors;
    };

    // --- SUBMISSION HANDLER ---
    /**
     * Orchestrates the entire invoice saving process: validation, API call, and user feedback.
     * @param {string} selectedTemplate - The template type selected in the UI.
     */
    const handleSaveInvoice = async (selectedTemplate) => {
        // 1. Validate the current form data.
        const validationErrors = validateForm(formData, selectedTemplate);
        setErrors(validationErrors);
        console.log("Validation Errors Found:", validationErrors);

        // 2. If there are any errors, prevent submission and notify the user.
        if (Object.keys(validationErrors).length > 0) {
            toast.error("Please fix the errors before saving.");
            return;
        }

        // 3. Proceed with submission.
        setIsSaving(true);
        try {
            // Call the service to send the data to the API.
            const savedInvoice = await createInvoice(formData, selectedTemplate);

            // Provide success feedback and navigate the user to the new invoice's page.
            toast.success(`Invoice ${savedInvoice.id} created successfully!`);
            navigate(`/myinvoices`);

        } catch (error) {
            // Provide error feedback if the API call fails.
            toast.error(error.message);
        } finally {
            // 4. Reset the saving state, regardless of success or failure.
            setIsSaving(false);
        }
    };

    // --- PUBLIC API ---
    // The hook exposes its state and handlers to the consuming component.
    // This provides a clean interface, abstracting away the implementation details.
    return {
        formData,
        setFormData,
        errors,
        setErrors, // Exposing setErrors can be useful for clearing errors manually.
        isSaving,
        handleSaveInvoice,
    };
};