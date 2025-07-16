/**
 * @file CreateInvoiceForm.jsx
 * @description A presentational component responsible for rendering the entire invoice creation form.
 *              It is a "controlled component," meaning it receives its data, state handlers, and errors
 *              as props from a parent component or a custom hook (like `useInvoiceForm`).
 *              It manages its own internal UI state, such as which accordion sections are open.
 */

import React, { useState, useEffect } from "react";
import { TrashIcon, PlusIcon, ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { reserveInvoiceSequence } from '../../../services/invoiceService';

// --- UI Component Imports ---
import CustomInputSimple from "../../ui/FormElements/CustomInput.jsx";
import CustomDatePickerSimple from "../../ui/FormElements/CustomDatePicker.jsx";
import CustomSelectSimple from "../../ui/FormElements/CustomSelect.jsx";

// --- Centralized Constants ---
// Using a single source of truth for constants improves maintainability.
import { PAYMENT_METHOD_OPTIONS, INVOICE_TYPES } from '../../../constants/invoiceConstants';

// ============================================================================
// CO-LOCATED HELPER COMPONENTS
// These components are small, specific to this form, and defined here for convenience.
// ============================================================================

const Divider = () => <hr className="my-4 border-gray-300" />;

/**
 * A reusable accordion component to wrap form sections, making the UI cleaner.
 */
const AccordionSection = ({ title, children, isOpen, onToggle, subtitle = null }) => (
    <div>
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={onToggle}>
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                {subtitle && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{subtitle}</span>}
            </div>
            <div className={`flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 ${!isOpen ? 'hover:bg-gray-200' : 'bg-gray-100'} transition-colors`}>
                <ChevronDownIcon className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`} />
            </div>
        </div>
        {isOpen && <div className="space-y-3 transition-all pb-4 pt-2">{children}</div>}
        <Divider />
    </div>
);

/**
 * A reusable component for rendering a block of address fields.
 * This avoids code duplication for "Bill From" and "Bill To" sections.
 */
const AddressFields = ({ data, parentKey, onChange, labelPrefix = "", errors = {} }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomInputSimple label={`${labelPrefix} Company Name`} value={data.companyName} onChange={(v) => onChange(parentKey, "companyName", v)} error={errors[`${parentKey}.companyName`]} id={`${parentKey}-companyName`} />
        <CustomInputSimple label={`${labelPrefix} Address`} value={data.address} onChange={(v) => onChange(parentKey, "address", v)} error={errors[`${parentKey}.address`]} id={`${parentKey}-address`} />
        <CustomInputSimple label="City, State, ZIP" value={data.city} onChange={(v) => onChange(parentKey, "city", v)} error={errors[`${parentKey}.city`]} id={`${parentKey}-city`} />
        <CustomInputSimple label={`${labelPrefix} Phone Number`} value={data.phone} onChange={(v) => onChange(parentKey, "phone", v)} error={errors[`${parentKey}.phone`]} id={`${parentKey}-phone`} />
        <CustomInputSimple type="email" label={`${labelPrefix} Email Address`} value={data.email} onChange={(v) => onChange(parentKey, "email", v)} error={errors[`${parentKey}.email`]} id={`${parentKey}-email`} />
    </div>
);

/**
 * A reusable component for rendering bank information fields.
 */
const BankInfoFields = ({ data, parentKey, onChange, errors = {} }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomInputSimple label="Your Company Name" value={data.companyName} onChange={(v) => onChange(parentKey, "companyName", v)} error={errors[`${parentKey}.companyName`]} id={`${parentKey}-companyName-bank`} />
        <CustomInputSimple label="Bank Name" value={data.bankName} onChange={(v) => onChange(parentKey, "bankName", v)} error={errors[`${parentKey}.bankName`]} id={`${parentKey}-bankName`} />
        <CustomInputSimple label="Account Number" value={data.accountNumber} onChange={(v) => onChange(parentKey, "accountNumber", v)} error={errors[`${parentKey}.accountNumber`]} id={`${parentKey}-accountNumber`} />
        <CustomInputSimple label="Routing Number" value={data.routingNumber} onChange={(v) => onChange(parentKey, "routingNumber", v)} error={errors[`${parentKey}.routingNumber`]} id={`${parentKey}-routingNumber`} />
    </div>
);


// ============================================================================
// MAIN COMPONENT
// ============================================================================
const CreateInvoiceForm = ({
                               formData,            // The entire form data object (from parent hook).
                               setFormData,         // The function to update the form data (from parent hook).
                               selectedTemplate,    // The currently selected template string.
                               setSelectedTemplate, // Function to update the selected template.
                               errors = {},         // Object containing validation errors (from parent hook).
                               templateOptions      // Array of options for the template selector.
                           }) => {
    // --- LOCAL UI STATE ---
    // This state is managed locally and is not needed by the parent component.
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, shipping: 0, discount: 0, totalDue: 0 });
    const initialAccordionState = {
        invoiceInfo: true, billFrom: true, billTo: true, items: true,
        paymentTerms: true, shippingInfo: true, bankInfo: true, notes: true
    };
    const [openAccordions, setOpenAccordions] = useState(initialAccordionState);
    const [sequenceData, setSequenceData] = useState({
        number: null,      // The sequence number (e.g. 123)
        isLoading: false,  // To display a loading indicator
        error: null,       // To display error messages
    });

    // --- DERIVED STATE ---
    // These boolean flags are derived from props to make conditional rendering in the JSX more readable.
    const isProforma = selectedTemplate === INVOICE_TYPES.PROFORMA;
    const isStandard = selectedTemplate === INVOICE_TYPES.STANDARD;

    // --- SIDE EFFECTS ---

    useEffect(() => {
        // We don't build the ID until we have the backend sequence
        if (!selectedTemplate || !sequenceData.number) {
            return;
        }

        const currentDate = formData.invoiceDate || new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');

        // We assume the city comes from the billFrom or billTo field. We'll use 'billTo' .
        const cityCode = formData.billTo.city ? formData.billTo.city.substring(0, 2).toUpperCase() : 'XX';

        const formattedSequence = String(sequenceData.number).padStart(8, '0');

        const templateCode = isStandard ? 'STD' : 'PRF';

        const finalId = `${templateCode}-${cityCode}-${month}-${year}-${formattedSequence}`;

        // We update the formData with the new invoiceNumber
        setFormData(prevData => ({ ...prevData, invoiceNumber: finalId }));

    }, [selectedTemplate, sequenceData.number, formData.invoiceDate, formData.billTo.city, isStandard, setFormData]);


    // This effect calculates the invoice totals whenever relevant financial data changes.
    useEffect(() => {
        const subtotal = formData.items.reduce((sum, item) => (sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0);
        const taxRate = parseFloat(formData.tax);
        const validTaxRate = !isNaN(taxRate) && isFinite(taxRate) ? taxRate : 0;
        const tax = subtotal * (validTaxRate / 100);
        const shipping = parseFloat(formData.shipping) || 0;
        const discount = parseFloat(formData.discount) || 0;
        const totalDue = subtotal + tax + shipping - discount;
        setTotals({ subtotal, tax, shipping, discount, totalDue });
    }, [formData.items, formData.tax, formData.shipping, formData.discount]);

    // --- EVENT HANDLERS ---

    // Adds a new empty item row to the form.
    const handleAddItem = () => { setFormData(prev => ({ ...prev, items: [...prev.items, { description: "", quantity: "", unitPrice: "", total: 0 }] })); };
    // Removes an item row by its index.
    const handleRemoveItem = (index) => { setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) })); };
    // Handles changes within a specific item row.
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        // Recalculate the line total when quantity or price changes.
        if (field === "quantity" || field === "unitPrice") {
            const quantity = parseFloat(updatedItems[index].quantity) || 0;
            const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
            updatedItems[index].total = quantity * unitPrice;
        }
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };
    // Handles changes for top-level form fields.
    const handleInputChange = (field, value) => {
        let finalValue = value;
        // Special handling for the tax field to ensure it's a valid percentage format.
        if (field === "tax") {
            const cleanedValue = value.replace(/[^0-9.]/g, '');
            const parts = cleanedValue.split('.');
            finalValue = parts.length > 1 ? parts[0] + '.' + parts[1].slice(0, 2) : parts[0];
        }
        setFormData(prev => ({ ...prev, [field]: finalValue }));
    };
    // Handles changes for fields within nested objects (e.g., billFrom.companyName).
    const handleNestedInputChange = (parent, field, value) => { setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } })); };
    // Handles changes to the main template selector.
    const handleTemplateChange = async (value) => {
        setSelectedTemplate(value);

        // If no valid template is selected, we do nothing
        if (!value) {
            setSequenceData({ number: null, isLoading: false, error: null });
            return;
        }

        // If we already have a sequence, we don't ask for another one (avoids unnecessary calls)
        if (sequenceData.number) return;

        // Start the loading process
        setSequenceData({ number: null, isLoading: true, error: null });
        try {
            // Call the service function to reserve the sequence
            const response = await reserveInvoiceSequence();

            // Success: Update the status with the sequence number
            setSequenceData({ number: response.sequence, isLoading: false, error: null });

            setOpenAccordions(initialAccordionState);

            // Pre-populate the invoice date here, as it is the most logical time
            setFormData(prevData => ({
                ...prevData,
                invoiceDate: prevData.invoiceDate || new Date(),
                // If it is proforma, also pre-populate the validity date
                validUntil: (value === 'PROFORMA' && !prevData.validUntil) ? addDays(new Date(), 30) : prevData.validUntil,
            }));

        } catch (err) {
            // Error: Updates the status with the error message
            console.error("Error al reservar la secuencia:", err);
            setSequenceData({ number: null, isLoading: false, error: err.message || "No se pudo generar el ID." });
        }
    };

    // Toggles the open/closed state of an accordion section.
    const toggleAccordion = (accordionKey) => {
        setOpenAccordions(prev => ({ ...prev, [accordionKey]: !prev[accordionKey] }));
    };
    // Formats a number into a USD currency string.
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(isNaN(amount) ? 0 : amount);

    // --- JSX RENDER ---
    return (
        <div className="w-full flex flex-col gap-4">
            {/* Invoice Type Selector */}
            <CustomSelectSimple
                label="Invoice Type"
                options={templateOptions} // Uses options passed from the parent.
                value={selectedTemplate}
                onChange={handleTemplateChange}
                error={errors.template}
                id="invoiceTemplate"
            />

            {/* The main form is only rendered after a template has been selected. */}
            {(isStandard || isProforma) && (
                <>
                    {/* Invoice Information Section */}
                    <AccordionSection
                        title="Invoice Information"
                        subtitle={isProforma ? "Includes 'Valid Until'" : null}
                        isOpen={openAccordions.invoiceInfo}
                        onToggle={() => toggleAccordion("invoiceInfo")}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <CustomInputSimple label={isProforma ? "Proforma Invoice Number" : "Invoice Number"} value={formData.invoiceNumber} readOnly id="invoiceNumber" />
                            <CustomDatePickerSimple label="Issue Date" value={formData.invoiceDate} readOnly id="invoiceDate" dateFormat="MM/dd/yyyy"/>
                            {isStandard && (
                                <CustomDatePickerSimple label="Due Date" value={formData.dueDate} onChange={(d) => handleInputChange("dueDate", d)} error={errors.dueDate} id="dueDate"/>
                            )}
                            {isProforma && (
                                <CustomDatePickerSimple label="Valid Until" value={formData.validUntil} onChange={(d) => handleInputChange("validUntil", d)} error={errors.validUntil} id="validUntil"/>
                            )}
                        </div>
                    </AccordionSection>

                    {/* Bill From Section */}
                    <AccordionSection title="Bill From" isOpen={openAccordions.billFrom} onToggle={() => toggleAccordion("billFrom")}>
                        <AddressFields data={formData.billFrom} parentKey="billFrom" onChange={handleNestedInputChange} labelPrefix="Your" errors={errors}/>
                    </AccordionSection>

                    {/* Bill To Section */}
                    <AccordionSection title="Bill To" isOpen={openAccordions.billTo} onToggle={() => toggleAccordion("billTo")}>
                        <AddressFields data={formData.billTo} parentKey="billTo" onChange={handleNestedInputChange} labelPrefix="Client's" errors={errors}/>
                    </AccordionSection>

                    {/* Items Section */}
                    <AccordionSection title="Items" isOpen={openAccordions.items} onToggle={() => toggleAccordion("items")}>
                        <div className="space-y-3">
                            {errors.itemsGeneral && <p className="text-sm text-red-600 mt-1">{errors.itemsGeneral}</p>}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Unit Price</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {formData.items.map((item, index) => (
                                        <tr key={index} className="text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-3 text-sm"><CustomInputSimple value={item.description} onChange={(v) => handleItemChange(index, "description", v)} error={errors[`items[${index}].description`]} placeholder="Item Description" id={`item-${index}-description`}/></td>
                                            <td className="px-4 py-3 text-sm"><CustomInputSimple type="number" value={item.quantity} onChange={(v) => handleItemChange(index, "quantity", v)} error={errors[`items[${index}].quantity`]} placeholder="0" id={`item-${index}-quantity`}/></td>
                                            <td className="px-4 py-3 text-sm"><CustomInputSimple type="number" inputMode="decimal" step="0.01" value={item.unitPrice} onChange={(v) => handleItemChange(index, "unitPrice", v)} error={errors[`items[${index}].unitPrice`]} placeholder="0.00" id={`item-${index}-unitPrice`}/></td>
                                            <td className="px-4 py-3 text-sm"><CustomInputSimple value={formatCurrency(item.total)} readOnly className="w-full bg-gray-100"/></td>
                                            <td className="px-4 py-3 text-sm">{formData.items.length > 1 && ( <button onClick={() => handleRemoveItem(index)} aria-label={`Remove item ${index + 1}`} className="p-1 bg-white hover:bg-gray-200 rounded-md flex items-center justify-center border border-gray-300"><TrashIcon className="h-5 w-5 text-red-500" /></button> )}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={handleAddItem} className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#4416A8] text-sm font-medium text-[#4416A8] bg-transparent hover:bg-[#ECE8F6] hover:text-[#4416A8] focus:outline-none focus:ring-2 focus:ring-[#4416A8] focus:ring-offset-2 transition-colors duration-200" aria-label="Add item">
                                <PlusIcon className="h-5 w-5" /> Add Item
                            </button>
                            <div className="mt-6 space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <CustomInputSimple label="Tax Rate (%)" type="text" inputMode="decimal" value={formData.tax} onChange={(v) => handleInputChange("tax", v)} error={errors.tax} id="taxRate"/>
                                    <CustomInputSimple label="Shipping" type="number" inputMode="decimal" step="0.01" value={formData.shipping} onChange={(v) => handleInputChange("shipping", v)} error={errors.shipping} id="shippingCost"/>
                                    <CustomInputSimple label="Discount" type="number" inputMode="decimal" step="0.01" value={formData.discount} onChange={(v) => handleInputChange("discount", v)} error={errors.discount} id="discountAmount"/>
                                </div>
                                <div className="mt-4 border-t pt-4 space-y-2">
                                    <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{formatCurrency(totals.subtotal)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Tax ({formData.tax || 0}%):</span><span className="font-medium">{formatCurrency(totals.tax)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Shipping:</span><span className="font-medium">{formatCurrency(totals.shipping)}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Discount:</span><span className="font-medium text-red-500">-{formatCurrency(totals.discount)}</span></div>
                                    <Divider />
                                    <div className="flex justify-between items-center"><span className="text-gray-800 font-semibold">Total Due:</span><span className="text-lg font-bold text-gray-700">{formatCurrency(totals.totalDue)}</span></div>
                                </div>
                            </div>
                        </div>
                    </AccordionSection>

                    {/* Shipping Information Section (Proforma only) */}
                    {isProforma && (
                        <AccordionSection
                            title="Shipping Information"
                            subtitle="Proforma Specific"
                            isOpen={openAccordions.shippingInfo}
                            onToggle={() => toggleAccordion("shippingInfo")}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CustomDatePickerSimple label="Estimated Delivery Date" value={formData.estimatedDeliveryDate} onChange={(d) => handleInputChange("estimatedDeliveryDate", d)} error={errors.estimatedDeliveryDate} id="estimatedDeliveryDate"/>
                                <CustomInputSimple label="Shipping Method" value={formData.shippingMethod} onChange={(v) => handleInputChange("shippingMethod", v)} error={errors.shippingMethod} id="shippingMethod" placeholder="e.g., Express Courier"/>
                            </div>
                        </AccordionSection>
                    )}

                    {/* Payment Terms Section */}
                    <AccordionSection title="Payment Terms & Methods" isOpen={openAccordions.paymentTerms} onToggle={() => toggleAccordion("paymentTerms")}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CustomInputSimple label="Payment Terms" value={formData.paymentTerms} onChange={(v) => handleInputChange("paymentTerms", v)} placeholder={isProforma ? 'e.g., 50% upfront' : 'e.g., Net 30'} error={errors.paymentTerms} id="paymentTerms" />
                            <CustomSelectSimple label="Payment Methods" options={PAYMENT_METHOD_OPTIONS} value={formData.paymentMethods} onChange={(value) => handleInputChange("paymentMethods", value)} error={errors.paymentMethods} id="paymentMethods"/>
                        </div>
                    </AccordionSection>

                    {/* Bank Information Section */}
                    <AccordionSection title="Please make payments to" isOpen={openAccordions.bankInfo} onToggle={() => toggleAccordion("bankInfo")}>
                        <BankInfoFields data={formData.bankInfo} parentKey="bankInfo" onChange={handleNestedInputChange} errors={errors}/>
                    </AccordionSection>

                    {/* Notes / Terms & Conditions Section */}
                    <AccordionSection title={isProforma ? "Terms & Conditions" : "Notes"} isOpen={openAccordions.notes} onToggle={() => toggleAccordion("notes")}>
                        {isProforma && (
                            <div className="p-3 mb-3 text-sm text-blue-700 bg-blue-100 border border-blue-200 rounded-md flex items-center gap-2">
                                <InformationCircleIcon className="h-5 w-5 flex-shrink-0"/>
                                <span>Remember to include proforma-specific terms (non-binding, price validity, etc.).</span>
                            </div>
                        )}
                        <CustomInputSimple
                            label={isProforma ? "Proforma Terms & Conditions" : "Additional Information or Thank You Message"}
                            placeholder={isProforma ? "- This is a proforma invoice...\n- Prices subject to change..." : "Thank you for your business!"}
                            value={formData.notes}
                            onChange={(v) => handleInputChange("notes", v)}
                            id="notes"
                            as="textarea"
                            rows={isProforma ? 5 : 3}
                        />
                    </AccordionSection>
                </>
            )}
        </div>
    );
};

export default CreateInvoiceForm;