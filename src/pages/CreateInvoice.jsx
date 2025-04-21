// ✅ CreateInvoice.jsx (CORRECTED - Icon Definitions Fixed)
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CreateInvoiceForm from "../components/CreateInvoice/CreateInvoiceForm.jsx";
import InvoicePreview from "../components/CreateInvoice/InvoicePreview.jsx";
import Button from "../components/Button/Button.jsx"; // Asumiendo que tienes este componente

// --- Iconos (DEFINICIONES COMPLETAS Y CORRECTAS) ---
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
// ----------------------------------------------------

const CreateInvoice = () => {
  const navigate = useNavigate();
  const formContainerRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [errors, setErrors] = useState({}); // Estado para errores de validación

  const [formData, setFormData] = useState({
    // Valores iniciales
    invoiceNumber: "",
    invoiceDate: null,
    dueDate: null,
    billFrom: { companyName: "", address: "", city: "", phone: "", email: "" },
    billTo: { companyName: "", address: "", city: "", phone: "", email: "" },
    items: [{ description: "", quantity: "", unitPrice: "", total: 0 }],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    totalDue: 0,
    paymentTerms: "",
    paymentMethods: "",
    bankInfo: { companyName: "", bankName: "", accountNumber: "", routingNumber: "" },
    notes: "",
  });

  // useEffect para sincronizar altura
  useEffect(() => {
    const calculateHeight = () => {
      if (previewContainerRef.current) {
        setContainerHeight(previewContainerRef.current.offsetHeight);
      } else {
        setContainerHeight('auto');
      }
    };
    const timerId = setTimeout(calculateHeight, 50);
    window.addEventListener('resize', calculateHeight);
    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', calculateHeight);
    };
  }, [selectedTemplate]);

  // Handler para botón Cancelar
  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel and return home?");
    if (confirmCancel) {
      navigate("/Dashboard");
    }
  };

  // Datos para Breadcrumbs
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Invoices", path: "/MyInvoices" },
    { label: "Create Invoice", path: "/create-invoice" },
  ];

   // Función de Validación
   const validateForm = () => {
    const newErrors = {};
    const requiredFieldErrorMsg = "This field is required";

    // Validar campos requeridos
    if (!selectedTemplate) newErrors.template = "Please select an invoice template";
    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = requiredFieldErrorMsg;
    if (!formData.invoiceDate) newErrors.invoiceDate = requiredFieldErrorMsg;
    if (!formData.dueDate) newErrors.dueDate = requiredFieldErrorMsg;
    if (!formData.paymentTerms.trim()) newErrors.paymentTerms = requiredFieldErrorMsg;
    if (!formData.paymentMethods) newErrors.paymentMethods = "Please select a payment method";

    if (!formData.billFrom.companyName.trim()) newErrors['billFrom.companyName'] = requiredFieldErrorMsg;
    if (!formData.billFrom.email.trim()) newErrors['billFrom.email'] = requiredFieldErrorMsg;

    if (!formData.billTo.companyName.trim()) newErrors['billTo.companyName'] = requiredFieldErrorMsg;
    if (!formData.billTo.email.trim()) newErrors['billTo.email'] = requiredFieldErrorMsg;

    if (!formData.items || formData.items.length === 0) {
      newErrors.itemsGeneral = "Please add at least one item.";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.description.trim()) newErrors[`items[${index}].description`] = requiredFieldErrorMsg;
        const quantity = parseFloat(item.quantity);
        if (isNaN(quantity) || quantity <= 0) newErrors[`items[${index}].quantity`] = "Must be > 0";
        const unitPrice = parseFloat(item.unitPrice);
        if (isNaN(unitPrice) || unitPrice <= 0) newErrors[`items[${index}].unitPrice`] = "Must be > 0";
      });
    }
    return newErrors;
  };

   // Handler para botón Guardar
   const handleSaveInvoice = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid! Saving invoice...", formData);
      alert("Invoice Saved! (Simulated)");
      // Lógica de guardado real
    } else {
      console.log("Form validation failed:", validationErrors);
      alert("Please fix the errors in the form before saving.");
    }
  };

  // Handler para el cambio de selección de Template
  const handleTemplateSelection = (value) => {
      console.log("CreateInvoice: Template selected:", value);
      setSelectedTemplate(value);
      // Limpiar error de template
      setErrors(prev => {
          const { template, ...rest } = prev;
          return rest;
      });
  }

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
            <h1 className="text-5xl font-bold text-[#1b1b1b]">Create Invoice</h1>
            <p className="text-gray-500 py-2 text-lg">Fill out the form to generate a new invoice.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" size="large" startAdornment={<CancelIcon />} onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" size="large" startAdornment={<SaveIcon />} onClick={handleSaveInvoice}>Save Invoice</Button>
          </div>
        </div>

        {/* Contenido Principal (Formulario y Preview) */}
        <div className="px-6 pb-6 flex flex-row gap-6 items-start flex-grow overflow-hidden">
          {/* Columna Formulario */}
          <div
            ref={formContainerRef}
            className="flex-1 border border-gray-200 rounded-2xl p-6 overflow-y-auto"
            style={{ height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight }}
          >
            {/* Pasar props a CreateInvoiceForm */}
            <CreateInvoiceForm
              formData={formData}
              setFormData={setFormData}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={handleTemplateSelection} // Función del padre
              errors={errors}
            />
          </div>

          {/* Columna Preview */}
          <div
            ref={previewContainerRef}
            className="w-[550px] flex-shrink-0 px-6 pb-6 pt-6 bg-[#F3F4F4] rounded-2xl"
          >
             {/* Renderizado Condicional */}
             {selectedTemplate === "standard_invoice" ? (
               <>
                 <h2 className="text-xl font-semibold text-[#1b1b1b] mb-4">Invoice Preview</h2>
                 <div className="overflow-auto">
                    <InvoicePreview formData={formData} />
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