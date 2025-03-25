import React from "react";

const InvoicePreview = ({ formData }) => {
  if (!formData) {
    return (
      <div className="text-center text-gray-400 p-8">
        <p>Select a template and start filling the form to preview the invoice.</p>
      </div>
    );
  }

  // Función para formatear fechas
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Cálculo de totales
  const calculateTotals = () => {
    const subtotal = formData.items?.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    const taxAmount = subtotal * (parseFloat(formData.tax || 0) / 100);
    const shipping = parseFloat(formData.shipping || 0);
    const discount = parseFloat(formData.discount || 0);
    const totalDue = subtotal + taxAmount + shipping - discount;

    return { subtotal, taxAmount, shipping, discount, totalDue };
  };

  const { subtotal, taxAmount, shipping, discount, totalDue } = calculateTotals();

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 h-full overflow-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
      <div className="w-32">
          <img 
            src="/Logo-preview.svg" 
            alt="Billchain Logo" 
            className="w-16 h-auto"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
          <div className="mt-2 text-sm text-gray-500">
            <p>Invoice #: {formData.invoiceNumber || "—"}</p>
            <p>Date: {formatDate(formData.invoiceDate)}</p>
            <p>Due Date: {formatDate(formData.dueDate)}</p>
          </div>
        </div>
        
      </div>

      {/* Información de compañías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Bill From:</h2>
          <div className="space-y-1 text-gray-600">
            <p>{formData.billFrom?.companyName || "Your Company Name"}</p>
            <p>{formData.billFrom?.address || "123 Main St"}</p>
            <p>{formData.billFrom?.city || "City, State, ZIP"}</p>
            <p>{formData.billFrom?.phone || "(123) 456-7890"}</p>
            <p>{formData.billFrom?.email || "email@yourcompany.com"}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Bill To:</h2>
          <div className="space-y-1 text-gray-600">
            <p>{formData.billTo?.companyName || "Client Company"}</p>
            <p>{formData.billTo?.address || "456 Client Ave"}</p>
            <p>{formData.billTo?.city || "Client City, State, ZIP"}</p>
            <p>{formData.billTo?.phone || "(987) 654-3210"}</p>
            <p>{formData.billTo?.email || "client@company.com"}</p>
          </div>
        </div>
      </div>

      {/* Tabla de items */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Items:</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="p-3 font-medium">Description</th>
                <th className="p-3 font-medium text-center">Qty</th>
                <th className="p-3 font-medium text-center">Unit Price</th>
                <th className="p-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{item.description || "Item description"}</td>
                  <td className="p-3 text-center text-gray-600">{item.quantity || "0"}</td>
                  <td className="p-3 text-center text-gray-600">
                    ${parseFloat(item.unitPrice || 0).toFixed(2)}
                  </td>
                  <td className="p-3 text-right text-gray-600">
                    ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Notes:</h2>
          <p className="text-gray-600">
            {formData.notes || "Thank you for your business!"}
          </p>
        </div>

        <div>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({formData.tax || 0}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span className="text-red-500">-${discount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 my-2"></div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Due:</span>
              <span>${totalDue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información de pago */}
      <div className="mt-8 pt-6 border-t border-gray-300">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Payment Information:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div>
            <p><span className="font-medium">Terms:</span> {formData.paymentTerms || "Net 30"}</p>
            <p><span className="font-medium">Methods:</span> {formData.paymentMethods || "Bank Transfer, Credit Card"}</p>
          </div>
          <div>
            <p><span className="font-medium">Bank:</span> {formData.bankInfo?.bankName || "Your Bank"}</p>
            <p><span className="font-medium">Account:</span> {formData.bankInfo?.accountNumber || "XXXX-XXXX-XXXX"}</p>
            <p><span className="font-medium">Routing:</span> {formData.bankInfo?.routingNumber || "XXX-XXX-XXX"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;