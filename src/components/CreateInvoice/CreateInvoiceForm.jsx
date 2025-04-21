// ✅ CreateInvoiceForm.jsx (Final Corrected Version)
import React, { useState, useEffect } from "react";
import CustomInputSimple from "../FormElements/CustomInput";
import CustomDatePickerSimple from "../FormElements/CustomDatePicker";
import CustomSelectSimple from "../FormElements/CustomSelect";
import { TrashIcon, PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { format as formatDateFns } from 'date-fns'; // Importar format para fechas

// --- Helper Components (Asegurar definiciones completas) ---
const Divider = () => <hr className="my-4 border-gray-300" />;

const AccordionSection = ({ title, children, isOpen, onToggle }) => (
  <div>
    <div className="flex justify-between items-center cursor-pointer mb-2" onClick={onToggle}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <ChevronDownIcon className={`h-5 w-5 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
    </div>
    {isOpen && <div className="space-y-3 transition-all pb-4">{children}</div>}
    <Divider />
  </div>
);

const AddressFields = ({ data, parentKey, onChange, labelPrefix = "", errors = {} }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomInputSimple label={`${labelPrefix} Company Name`} value={data.companyName} onChange={(v) => onChange(parentKey, "companyName", v)} error={errors[`${parentKey}.companyName`]} id={`${parentKey}-companyName`} />
        <CustomInputSimple label={`${labelPrefix} Address`} value={data.address} onChange={(v) => onChange(parentKey, "address", v)} error={errors[`${parentKey}.address`]} id={`${parentKey}-address`} />
        <CustomInputSimple label="City, State, ZIP" value={data.city} onChange={(v) => onChange(parentKey, "city", v)} error={errors[`${parentKey}.city`]} id={`${parentKey}-city`} />
        <CustomInputSimple label={`${labelPrefix} Phone Number`} value={data.phone} onChange={(v) => onChange(parentKey, "phone", v)} error={errors[`${parentKey}.phone`]} id={`${parentKey}-phone`} />
        <CustomInputSimple type="email" label={`${labelPrefix} Email Address`} value={data.email} onChange={(v) => onChange(parentKey, "email", v)} error={errors[`${parentKey}.email`]} id={`${parentKey}-email`} />
    </div>
);

const BankInfoFields = ({ data, parentKey, onChange, errors = {} }) => (
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       <CustomInputSimple label="Your Company Name" value={data.companyName} onChange={(v) => onChange(parentKey, "companyName", v)} error={errors[`${parentKey}.companyName`]} id={`${parentKey}-companyName-bank`} />
       <CustomInputSimple label="Bank Name" value={data.bankName} onChange={(v) => onChange(parentKey, "bankName", v)} error={errors[`${parentKey}.bankName`]} id={`${parentKey}-bankName`} />
       <CustomInputSimple label="Account Number" value={data.accountNumber} onChange={(v) => onChange(parentKey, "accountNumber", v)} error={errors[`${parentKey}.accountNumber`]} id={`${parentKey}-accountNumber`} />
       <CustomInputSimple label="Routing Number" value={data.routingNumber} onChange={(v) => onChange(parentKey, "routingNumber", v)} error={errors[`${parentKey}.routingNumber`]} id={`${parentKey}-routingNumber`} />
   </div>
);

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
// --------------------------------------------------------

// --- Componente Principal ---
const CreateInvoiceForm = ({
  formData,
  setFormData, // Necesario para pre-rellenar
  selectedTemplate,
  setSelectedTemplate,
  errors = {}
}) => {
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, shipping: 0, discount: 0, totalDue: 0 });
  // Estado inicial de acordeones (todos abiertos)
  const initialAccordionState = {
    invoiceInfo: true, billFrom: true, billTo: true, items: true,
    paymentTerms: true, bankInfo: true, notes: true
  };
  const [openAccordions, setOpenAccordions] = useState(initialAccordionState);

  // --- useEffect para pre-rellenar campos ---
  useEffect(() => {
    if (selectedTemplate === 'standard_invoice') {
        const currentDate = new Date();
        const formattedMonthYear = formatDateFns(currentDate, 'MM-yyyy'); // MM-YYYY
        // TODO: Implementar lógica real para secuencia (00001)
        const invoiceNumberValue = `STD-NYC-${formattedMonthYear}-00001`;

        // Actualizar formData en el padre (CreateInvoice) usando la prop setFormData
        setFormData(prevData => {
            const shouldUpdateDate = !(prevData.invoiceDate instanceof Date && !isNaN(prevData.invoiceDate));
            const shouldUpdateNumber = !prevData.invoiceNumber;
            // Solo actualiza si es necesario para evitar re-renders innecesarios
            if (shouldUpdateDate || shouldUpdateNumber) {
                return {
                    ...prevData,
                    invoiceDate: shouldUpdateDate ? currentDate : prevData.invoiceDate,
                    invoiceNumber: shouldUpdateNumber ? invoiceNumberValue : prevData.invoiceNumber,
                };
            }
            return prevData; // No hay cambios necesarios
        });
    }
    // Considera si quieres limpiar estos campos si se deselecciona la plantilla
    // else {
    //     setFormData(prevData => ({ ...prevData, invoiceDate: null, invoiceNumber: "" }));
    // }
  }, [selectedTemplate, setFormData]); // Depende del template y de la función para actualizar

  // --- useEffect para calcular totales ---
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


  // --- Handlers ---
  const handleAddItem = () => { setFormData(prev => ({ ...prev, items: [...prev.items, { description: "", quantity: "", unitPrice: "", total: 0 }] })); };
  const handleRemoveItem = (index) => { setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) })); };
  const handleItemChange = (index, field, value) => {
      const updatedItems = [...formData.items];
      updatedItems[index][field] = value;
      if (field === "quantity" || field === "unitPrice") { /* recalcular total */ }
      setFormData(prev => ({ ...prev, items: updatedItems }));
  };
   const handleInputChange = (field, value) => {
      // Los componentes hijos readOnly ya no dispararán onChange
      let finalValue = value;
      if (field === "tax") { /* validación tax */ }
      setFormData(prev => ({ ...prev, [field]: finalValue }));
  };
  const handleNestedInputChange = (parent, field, value) => { setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } })); };

  // Handler para cambio de Template
  const handleTemplateChange = (value) => {
    setSelectedTemplate(value); // Llama a la función de CreateInvoice
    if (value === 'standard_invoice') {
      setOpenAccordions(initialAccordionState); // Resetear acordeones
    }
  };

  // --- Función Toggle Acordeón ---
  const toggleAccordion = (accordionKey) => {
    setOpenAccordions(prevOpenAccordions => ({
      ...prevOpenAccordions,
      [accordionKey]: !prevOpenAccordions[accordionKey] // Invierte el valor booleano
    }));
  };

  // --- Funciones de formato ---
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(isNaN(amount) ? 0 : amount);
  const formatDateForDisplay = (date) => {
    if (!date) return "";
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return isNaN(dateObj.getTime()) ? "" : formatDateFns(dateObj, 'MM/dd/yyyy');
    } catch (error) { return ""; }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Selector Template */}
      <CustomSelectSimple
        label="Template"
        options={[{ value: "standard_invoice", label: "Standard Invoice" }]}
        value={selectedTemplate}
        onChange={handleTemplateChange}
        error={errors.template} // Mantiene validación visual para el template
        id="invoiceTemplate"
      />

      {selectedTemplate === "standard_invoice" && (
        <>
          {/* --- Secciones del Acordeón --- */}
          <AccordionSection
            title="Invoice Information"
            isOpen={openAccordions.invoiceInfo}
            onToggle={() => toggleAccordion("invoiceInfo")} // <--- Conectado
          >
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Campos ReadOnly y sin validación visual */}
                <CustomInputSimple label="Invoice Number" value={formData.invoiceNumber} readOnly id="invoiceNumber" />
                <CustomDatePickerSimple label="Invoice Date" value={formData.invoiceDate} readOnly id="invoiceDate" dateFormat="MM/dd/yyyy"/>
                 {/* Campo Editable con validación visual */}
                <CustomDatePickerSimple label="Due Date" value={formData.dueDate} onChange={(d) => handleInputChange("dueDate", d)} error={errors.dueDate} id="dueDate"/>
             </div>
          </AccordionSection>

           <AccordionSection title="Bill From" isOpen={openAccordions.billFrom} onToggle={() => toggleAccordion("billFrom")}>
             <AddressFields data={formData.billFrom} parentKey="billFrom" onChange={handleNestedInputChange} labelPrefix="Your" errors={errors}/>
           </AccordionSection>

           <AccordionSection title="Bill To" isOpen={openAccordions.billTo} onToggle={() => toggleAccordion("billTo")}>
              <AddressFields data={formData.billTo} parentKey="billTo" onChange={handleNestedInputChange} labelPrefix="Client's" errors={errors}/>
           </AccordionSection>

           {/* --- SECCIÓN ITEMS (Contenido Restaurado) --- */}
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
                                <td className="px-4 py-3 text-sm">
                                    {formData.items.length > 1 && ( <button onClick={() => handleRemoveItem(index)} aria-label={`Remove item ${index + 1}`} className="p-1 bg-white hover:bg-gray-200 rounded-md flex items-center justify-center border border-gray-300"><TrashIcon className="h-5 w-5 text-red-500" /></button> )}
                                </td>
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
           {/* --------------------------------- */}

           {/* --- SECCIÓN PAYMENT (Contenido Restaurado) --- */}
           <AccordionSection title="Payment Terms & Methods" isOpen={openAccordions.paymentTerms} onToggle={() => toggleAccordion("paymentTerms")}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <CustomInputSimple label="Payment Terms" value={formData.paymentTerms} onChange={(v) => handleInputChange("paymentTerms", v)} placeholder="E.g., Net 30, Due on Receipt" error={errors.paymentTerms} id="paymentTerms" />
                 <CustomSelectSimple label="Payment Methods" options={paymentMethodOptions} value={formData.paymentMethods} onChange={(value) => handleInputChange("paymentMethods", value)} error={errors.paymentMethods} id="paymentMethods"/>
             </div>
           </AccordionSection>
           {/* --------------------------------- */}

           <AccordionSection title="Please make payments to" isOpen={openAccordions.bankInfo} onToggle={() => toggleAccordion("bankInfo")}>
              <BankInfoFields data={formData.bankInfo} parentKey="bankInfo" onChange={handleNestedInputChange} errors={errors}/>
           </AccordionSection>

           <AccordionSection title="Notes" isOpen={openAccordions.notes} onToggle={() => toggleAccordion("notes")}>
              <CustomInputSimple label="Additional Information or Thank You Message" value={formData.notes} onChange={(v) => handleInputChange("notes", v)} id="notes"/>
           </AccordionSection>
        </>
      )}
    </div>
  );
};

export default CreateInvoiceForm;