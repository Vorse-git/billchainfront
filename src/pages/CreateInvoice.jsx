// ✅ CreateInvoice.jsx
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CreateInvoiceForm from "../components/CreateInvoice/CreateInvoiceForm.jsx";
import InvoicePreview from "../components/CreateInvoice/InvoicePreview.jsx";
import Button from "../components/Button/Button.jsx";

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

const CreateInvoice = () => {
  const navigate = useNavigate();
  const formRef = useRef();

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    billFrom: { companyName: "", address: "", city: "", phone: "", email: "" },
    billTo: { companyName: "", address: "", city: "", phone: "", email: "" },
    items: [],
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

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel and return home?");
    if (confirmCancel) {
      navigate("/Dashboard");
    }
  };

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "My Invoices", path: "/MyInvoices" },
    { label: "Create Invoice", path: "/create-invoice" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="px-6 pb-6">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>

        <div className="px-6 py-1 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-[#1b1b1b]">Create Invoice</h1>
            <p className="text-gray-500 py-2 text-lg">Fill out the form to generate a new invoice.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" size="large" startAdornment={<CancelIcon />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="large" startAdornment={<SaveIcon />} onClick={() => alert("Saved!")}>
              Save Invoice
            </Button>
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-6 items-start">
          <div className="bg-white shadow-md rounded-2xl p-8">
            <CreateInvoiceForm formData={formData} setFormData={setFormData} />
          </div>
          <InvoicePreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;