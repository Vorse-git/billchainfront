// ✅ CreateInvoice.jsx (Integrated react-hot-toast)
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CreateInvoiceForm from "../components/CreateInvoice/CreateInvoiceForm.jsx";
import InvoicePreview from "../components/CreateInvoice/InvoicePreview.jsx";
import Button from "../components/Button/Button.jsx";
import { format as formatDateFns } from 'date-fns';
// --- NUEVO: Importar toast ---
import toast from 'react-hot-toast';
// ---------------------------

// --- Iconos ---
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const CancelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const InfoIconPlaceholder = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-gray-400 mb-3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
);
// --------------

const CreateInvoice = () => {
  const navigate = useNavigate();
  const formContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Valores iniciales (incluyendo los de proforma)
    invoiceNumber: "", invoiceDate: null, dueDate: null, validUntil: null,
    estimatedDeliveryDate: null, shippingMethod: "",
    billFrom: { companyName: "", address: "", city: "", phone: "", email: "" },
    billTo: { companyName: "", address: "", city: "", phone: "", email: "" },
    items: [{ description: "", quantity: "", unitPrice: "", total: 0 }],
    subtotal: 0, tax: 0, shipping: 0, discount: 0, totalDue: 0,
    paymentTerms: "", paymentMethods: "",
    bankInfo: { companyName: "", bankName: "", accountNumber: "", routingNumber: "" },
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false); // Estado para feedback del botón

  // useEffect para altura
  useEffect(() => {
    const calculateHeight = () => {
      if (previewContainerRef.current) {
        const previewHeight = previewContainerRef.current.offsetHeight;
        setContainerHeight(previewHeight > 0 ? previewHeight + 5 : 'auto');
      } else { setContainerHeight('auto'); }
    };
    const timerId = setTimeout(calculateHeight, 100);
    window.addEventListener('resize', calculateHeight);
    return () => { clearTimeout(timerId); window.removeEventListener('resize', calculateHeight); };
  }, [selectedTemplate, formData]);

  // Handler Cancelar
  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel and return home?");
    if (confirmCancel) { navigate("/dashboard"); }
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Invoices", path: "/myinvoices" },
    { label: "Create Invoice", path: "/createinvoice" },
  ];

   // Función Validación (sin cambios internos, solo verifica los campos necesarios según template)
   const validateForm = () => {
    const newErrors = {};
    const requiredFieldErrorMsg = "This field is required";
    if (!selectedTemplate) newErrors.template = "Please select an invoice type";
    // No validar campos readOnly (invoiceNumber, invoiceDate)
    if (selectedTemplate === 'standard_invoice') {
        if (!formData.dueDate) newErrors.dueDate = "Please select a due date";
    } else if (selectedTemplate === 'proforma_invoice') {
        if (!formData.validUntil) newErrors.validUntil = "Please select a valid until date";
        // Añadir validación de shipping aquí si es requerida
    }
    if (!formData.paymentTerms.trim()) newErrors.paymentTerms = requiredFieldErrorMsg;
    if (!formData.paymentMethods) newErrors.paymentMethods = "Please select a payment method";
    if (!formData.billFrom.companyName.trim()) newErrors['billFrom.companyName'] = requiredFieldErrorMsg;
    if (!formData.billFrom.email.trim()) newErrors['billFrom.email'] = requiredFieldErrorMsg;
    if (!formData.billTo.companyName.trim()) newErrors['billTo.companyName'] = requiredFieldErrorMsg;
    if (!formData.billTo.email.trim()) newErrors['billTo.email'] = requiredFieldErrorMsg;
    if (!formData.items || formData.items.length === 0 || formData.items.every(item => !item.description && !item.quantity && !item.unitPrice)) {
      newErrors.itemsGeneral = "Please add at least one valid item line.";
    } else {
      formData.items.forEach((item, index) => {
        if (item.description || item.quantity || item.unitPrice) {
          if (!item.description.trim()) newErrors[`items[${index}].description`] = requiredFieldErrorMsg;
          const quantity = parseFloat(item.quantity);
          if (isNaN(quantity) || quantity <= 0) newErrors[`items[${index}].quantity`] = "Must be > 0";
          const unitPrice = parseFloat(item.unitPrice);
          if (isNaN(unitPrice) || unitPrice <= 0) newErrors[`items[${index}].unitPrice`] = "Must be > 0";
        }
      });
    }
    return newErrors;
   };

   // --- MODIFICADO: Handler Guardar con Toasts ---
   const handleSaveInvoice = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSaving(true); // Iniciar estado de guardado
      console.log("Form valid, sending to MSW API:", formData);
      try {
        const dataToSend = { ...formData, invoiceType: selectedTemplate };
        const response = await fetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok || response.status !== 201) {
             const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${errorText || response.statusText}`);
        }
        const savedInvoice = await response.json();
        console.log("MSW Save OK:", savedInvoice);
        toast.success("Invoice Saved Successfully!"); // <-- Toast Éxito
        navigate('/myinvoices');
      } catch (error) {
        console.error("Failed to save via MSW:", error);
        toast.error(`Error saving invoice: ${error.message}`); // <-- Toast Error API
      } finally {
        setIsSaving(false); // Finalizar estado de guardado
      }
    } else {
      console.log("Validation failed:", validationErrors);
      toast.error("Please review the highlighted fields and fix the errors."); // <-- Toast Error Validación
    }
  };
  // ----------------------------------------------

  // Handler cambio de Template
  const handleTemplateSelection = (value) => {
      setSelectedTemplate(value);
      setErrors(prev => ({ ...prev, template: null }));
  }

  // Opciones para el selector
   const templateOptions = [
        { value: "", label: "Select Invoice Type..." },
        { value: "standard_invoice", label: "Standard Invoice" },
        { value: "proforma_invoice", label: "Proforma Invoice" }
    ];

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="px-6 pb-6">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>

        {/* Cabecera */}
        <div className="px-6 py-1 pb-6 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-4xl font-bold text-[#1b1b1b]">Create Invoice</h1>
            <p className="text-gray-500 py-2 text-lg">Fill out the form to generate a new invoice.</p>
          </div>
          <div className="flex gap-2">
            {/* Botones con estado disabled opcional */}
            <Button variant="outlined" size="large" startAdornment={<CancelIcon />} onClick={handleCancel} disabled={isSaving}>Cancel</Button>
            <Button variant="primary" size="large" startAdornment={<SaveIcon />} onClick={handleSaveInvoice} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Invoice'}
            </Button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="px-6 pb-6 flex flex-row gap-6 items-start flex-grow overflow-hidden">
          {/* Formulario */}
          <div
            ref={formContainerRef}
            className="flex-1 border border-gray-200 rounded-2xl p-6 overflow-y-auto"
            style={{ height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight }}
          >
            <CreateInvoiceForm
              formData={formData}
              setFormData={setFormData}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={handleTemplateSelection}
              errors={errors}
              templateOptions={templateOptions} // Pasar opciones
            />
          </div>

          {/* Preview */}
          <div
            ref={previewContainerRef}
            className="w-[500px] flex-shrink-0 px-6 pb-6 pt-6 bg-[#F3F4F4] rounded-2xl"
          >
             {/* Renderizado Condicional (ya corregido) */}
             {(selectedTemplate === "standard_invoice" || selectedTemplate === 'proforma_invoice') ? (
               <>
                 <h2 className="text-xl font-semibold text-[#1b1b1b] mb-4">Invoice Preview</h2>
                 <div className="overflow-auto max-h-[calc(100vh-250px)]">
                    <InvoicePreview
                        formData={formData}
                        selectedTemplate={selectedTemplate}
                    />
                 </div>
               </>
             ) : (
               // Placeholder
               <div className="flex flex-col items-center justify-center h-full text-center min-h-[200px]">
                   <InfoIconPlaceholder />
                   <p className="text-gray-500">
                       You have not yet selected <br /> an invoice template.
                   </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;