import { useState, useEffect } from "react";
import CustomInputSimple from "../FormElements/CustomInput";
import CustomDatePickerSimple from "../FormElements/CustomDatePicker";
import CustomSelectSimple from "../FormElements/CustomSelect";
import { TrashIcon, PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Divider = () => <hr className="my-4 border-gray-300" />;

const AccordionSection = ({ 
  title, 
  children, 
  isOpen, 
  onToggle,
  disabled 
}) => {
  return (
    <div>
      <div
        className={`flex justify-between items-center cursor-pointer mb-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && onToggle()}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        {!disabled && (
          <ChevronDownIcon
            className={`h-5 w-5 transform transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
      </div>
      {isOpen && !disabled && (
        <div className="space-y-3 transition-all">{children}</div>
      )}
      <Divider />
    </div>
  );
};

const CreateInvoiceForm = ({ formData, setFormData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    totalDue: 0
  });
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);

    // Validación robusta para el tax rate
    const taxRate = parseFloat(formData.tax);
    const validTaxRate = !isNaN(taxRate) && isFinite(taxRate) ? taxRate : 0;
    const tax = subtotal * (validTaxRate / 100);

    const shipping = parseFloat(formData.shipping) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const totalDue = subtotal + tax + shipping - discount;

    setTotals({
      subtotal,
      tax,
      shipping,
      discount,
      totalDue
    });

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax: validTaxRate,
      totalDue
    }));
  }, [formData.items, formData.tax, formData.shipping, formData.discount, setFormData]);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: "", unitPrice: "", total: 0 }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    if (field === "quantity" || field === "unitPrice") {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].total = quantity * unitPrice;
    }
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleInputChange = (field, value) => {
    if (field === "tax") {
      const cleanedValue = value.replace(/[^0-9.]/g, '');
      const parts = cleanedValue.split('.');
      const finalValue = parts.length > 1 
        ? parts[0] + '.' + parts[1].slice(0, 2)
        : parts[0];
      
      setFormData({
        ...formData,
        [field]: finalValue
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value
      }
    });
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    setOpenAccordion(null);
  };

  const toggleAccordion = (accordion) => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(isNaN(amount) ? 0 : amount);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isFormDisabled = selectedTemplate !== "standard_invoice";

  return (
    <div className="w-full flex flex-col gap-6">
      <CustomSelectSimple
        label="Template"
        options={[{ value: "standard_invoice", label: "Standard Invoice" }]}
        value={selectedTemplate}
        onChange={handleTemplateChange}
      />

      {selectedTemplate === "standard_invoice" && (
        <>
          <AccordionSection 
            title="Invoice Information"
            isOpen={openAccordion === "invoiceInfo"}
            onToggle={() => toggleAccordion("invoiceInfo")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CustomInputSimple 
                label="Invoice Number" 
                value={formData.invoiceNumber}
                onChange={(value) => handleInputChange("invoiceNumber", value)}
              />
              <CustomDatePickerSimple 
                label="Invoice Date" 
                selected={formData.invoiceDate}
                onChange={(date) => handleInputChange("invoiceDate", date)}
                value={formatDate(formData.invoiceDate)}
              />
              <CustomDatePickerSimple 
                label="Due Date" 
                selected={formData.dueDate}
                onChange={(date) => handleInputChange("dueDate", date)}
                value={formatDate(formData.dueDate)}
              />
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Bill From"
            isOpen={openAccordion === "billFrom"}
            onToggle={() => toggleAccordion("billFrom")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInputSimple 
                label="Your Company Name" 
                value={formData.billFrom.companyName}
                onChange={(value) => handleNestedInputChange("billFrom", "companyName", value)}
              />
              <CustomInputSimple 
                label="Your Address" 
                value={formData.billFrom.address}
                onChange={(value) => handleNestedInputChange("billFrom", "address", value)}
              />
              <CustomInputSimple 
                label="City, State, ZIP" 
                value={formData.billFrom.city}
                onChange={(value) => handleNestedInputChange("billFrom", "city", value)}
              />
              <CustomInputSimple 
                label="Phone Number" 
                value={formData.billFrom.phone}
                onChange={(value) => handleNestedInputChange("billFrom", "phone", value)}
              />
              <CustomInputSimple 
                label="Email Address" 
                value={formData.billFrom.email}
                onChange={(value) => handleNestedInputChange("billFrom", "email", value)}
              />
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Bill To"
            isOpen={openAccordion === "billTo"}
            onToggle={() => toggleAccordion("billTo")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInputSimple 
                label="Client's Company Name" 
                value={formData.billTo.companyName}
                onChange={(value) => handleNestedInputChange("billTo", "companyName", value)}
              />
              <CustomInputSimple 
                label="Client's Address" 
                value={formData.billTo.address}
                onChange={(value) => handleNestedInputChange("billTo", "address", value)}
              />
              <CustomInputSimple 
                label="City, State, ZIP" 
                value={formData.billTo.city}
                onChange={(value) => handleNestedInputChange("billTo", "city", value)}
              />
              <CustomInputSimple 
                label="Client's Phone Number" 
                value={formData.billTo.phone}
                onChange={(value) => handleNestedInputChange("billTo", "phone", value)}
              />
              <CustomInputSimple 
                label="Client's Email Address" 
                value={formData.billTo.email}
                onChange={(value) => handleNestedInputChange("billTo", "email", value)}
              />
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Items"
            isOpen={openAccordion === "items"}
            onToggle={() => toggleAccordion("items")}
          >
            <div className="space-y-3">
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
                        <td className="px-4 py-3 text-sm">
                          <CustomInputSimple
                            value={item.description}
                            onChange={(value) =>
                              handleItemChange(index, "description", value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <CustomInputSimple
                            type="number"
                            value={item.quantity}
                            onChange={(value) =>
                              handleItemChange(index, "quantity", value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <CustomInputSimple
                            type="number"
                            value={item.unitPrice}
                            onChange={(value) =>
                              handleItemChange(index, "unitPrice", value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <CustomInputSimple
                            value={formatCurrency(item.total)}
                            readOnly
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <TrashIcon
                            onClick={() => handleRemoveItem(index)}
                            className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleAddItem}
                className="mt-4 flex items-center justify-center p-2 rounded-full bg-[#4416A8] text-white hover:bg-[#3a1299] transition-colors"
                aria-label="Add item"
              >
                <PlusIcon className="h-5 w-5" />
              </button>

              <div className="mt-6 space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <CustomInputSimple
                      label="Tax Rate (%)"
                      type="text"
                      inputMode="decimal"
                      value={formData.tax}
                      onChange={(value) => handleInputChange("tax", value)}
                      pattern="[0-9]*\.?[0-9]*"
                    />
                  </div>
                  <div className="col-span-1">
                    <CustomInputSimple
                      label="Shipping"
                      type="number"
                      value={formData.shipping}
                      onChange={(value) => handleInputChange("shipping", value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <CustomInputSimple
                      label="Discount"
                      type="number"
                      value={formData.discount}
                      onChange={(value) => handleInputChange("discount", value)}
                    />
                  </div>
                </div>

                <div className="mt-4 border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({!isNaN(parseFloat(formData.tax)) ? parseFloat(formData.tax) : 0}%):</span>
                    <span className="font-medium">{formatCurrency(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">{formatCurrency(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-500">-{formatCurrency(totals.discount)}</span>
                  </div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-semibold">Total Due:</span>
                    <span className="text-lg font-bold text-gray-700">
                      {formatCurrency(totals.totalDue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Payment Terms"
            isOpen={openAccordion === "paymentTerms"}
            onToggle={() => toggleAccordion("paymentTerms")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInputSimple 
                label="Payment Terms" 
                value={formData.paymentTerms}
                onChange={(value) => handleInputChange("paymentTerms", value)}
              />
              <CustomInputSimple 
                label="Payment Methods" 
                value={formData.paymentMethods}
                onChange={(value) => handleInputChange("paymentMethods", value)}
              />
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Please make payments to"
            isOpen={openAccordion === "bankInfo"}
            onToggle={() => toggleAccordion("bankInfo")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInputSimple 
                label="Your Company Name" 
                value={formData.bankInfo.companyName}
                onChange={(value) => handleNestedInputChange("bankInfo", "companyName", value)}
              />
              <CustomInputSimple 
                label="Bank Name" 
                value={formData.bankInfo.bankName}
                onChange={(value) => handleNestedInputChange("bankInfo", "bankName", value)}
              />
              <CustomInputSimple 
                label="Account Number" 
                value={formData.bankInfo.accountNumber}
                onChange={(value) => handleNestedInputChange("bankInfo", "accountNumber", value)}
              />
              <CustomInputSimple 
                label="Routing Number" 
                value={formData.bankInfo.routingNumber}
                onChange={(value) => handleNestedInputChange("bankInfo", "routingNumber", value)}
              />
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Notes"
            isOpen={openAccordion === "notes"}
            onToggle={() => toggleAccordion("notes")}
          >
            <CustomInputSimple 
              label="Additional Information or Thank You Message" 
              value={formData.notes}
              onChange={(value) => handleInputChange("notes", value)}
            />
          </AccordionSection>
        </>
      )}
    </div>
  );
};

export default CreateInvoiceForm;