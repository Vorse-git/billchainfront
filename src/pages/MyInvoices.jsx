import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import MyInvoicesTable from "../components/MyInvoices/MyInvoicesTable.jsx";
import dataMyInvoices from "../data/dataMyInvoices.js";
import Button from "../components/Button/Button.jsx";

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const CreateInvoiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const MyInvoices = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Invoices", path: "/myinvoices" },
  ];

  const filteredData = dataMyInvoices.pendingPayments
    ? dataMyInvoices.pendingPayments.filter((invoice) =>
        (invoice.companyName?.toLowerCase().includes(search.toLowerCase()) || false) &&
        (status ? invoice.status === status : true)
      )
    : [];

  const handleCreateInvoice = () => {
    navigate("/createinvoice");
  };

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
            <h1 className="text-5xl font-bold text-[#1b1b1b]">My Invoices</h1>
            <p className="text-gray-500 py-2 text-lg">
              View and manage your invoices easily.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" size="large" startAdornment={<DownloadIcon />}>
              Download
            </Button>
            <Button
              variant="primary"
              size="large"
              startAdornment={<CreateInvoiceIcon />}
              onClick={handleCreateInvoice}
            >
              Create Invoice
            </Button>
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-1 gap-6 items-start">
          <MyInvoicesTable data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default MyInvoices;

