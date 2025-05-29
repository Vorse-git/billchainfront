// ✅ InvoicePreview.jsx (Corrected - Added local paymentMethodOptions)
import React from "react";
import { format as formatDateFns } from 'date-fns';

// --- AÑADIR DEFINICIÓN LOCAL de paymentMethodOptions ---
// (Copiada de CreateInvoiceForm.jsx)
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
// ----------------------------------------------------

const InvoicePreview = ({ formData, selectedTemplate }) => {

  // --- Estado Inicial / Sin Datos ---
  if (!formData || (selectedTemplate !== 'standard_invoice' && selectedTemplate !== 'proforma_invoice')) {
    return (
      <div className="text-center text-gray-400 p-8 bg-gray-100 rounded-2xl h-full flex items-center justify-center">
        <p>Select a template and fill the form to see the preview.</p>
      </div>
    );
  }

  // --- Determinar tipo de factura ---
  const isProforma = selectedTemplate === 'proforma_invoice';

  // --- Función de Formato de Fechas ---
  const formatDate = (date) => {
    if (!date) return "—";
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return isNaN(dateObj.getTime()) ? "—" : formatDateFns(dateObj, 'MMM dd, yyyy');
    } catch (error) { return "Invalid Date"; }
  };

  // --- Cálculo de Totales ---
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

  // --- Función para formatear moneda ---
  const formatCurrency = (amount) => {
    const number = parseFloat(amount);
    if (isNaN(number)) return '$0.00';
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 h-full overflow-auto">
      {/* --- Encabezado --- */}
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

      {/* --- Bill From / Bill To --- */}
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

      {/* --- Tabla de Items --- */}
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

      {/* --- Totales y Notas/Términos --- */}
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

      {/* --- Información de Pago y Envío --- */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-700">
          <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">Payment Information</h3>
              <p><strong>Terms:</strong> {formData.paymentTerms || "N/A"}</p>
              {/* --- CORREGIDO: Usar la constante local --- */}
              <p><strong>Methods:</strong> {paymentMethodOptions.find(o => o.value === formData.paymentMethods)?.label || formData.paymentMethods || "N/A"}</p>
              {/* ----------------------------------------- */}
              {(formData.paymentMethods === 'bank_transfer' || formData.bankInfo?.bankName) && ( <div className="mt-1 text-xs text-gray-500"> Bank: {formData.bankInfo?.bankName}, Acc: {formData.bankInfo?.accountNumber} </div> )}
          </div>
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