// src/pages/MyInvoices.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "../services/invoiceService"; // Service for API calls

// UI & Feature Components
import Sidebar from "../components/ui/Sidebar.jsx";
import Navbar from "../components/ui/Navbar.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import MyInvoicesTable from "../components/features/MyInvoices/MyInvoicesTable.jsx";
import Button from "../components/ui/Button/Button.jsx";
import InvoiceFilters from "../components/features/MyInvoices/InvoiceFilters.jsx";


/**                                                                                                                       
 * Simple, co-located SVG icon components.
 * Defining them here is convenient for small, single-use icons,
 * avoiding the need for separate file imports.
 */
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const CreateInvoiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
// =========================================================================

/**
 * The MyInvoices page component.
 * This component is responsible for:
 * 1. Fetching the list of invoices from the API.
 * 2. Managing the state for filters (search, status, date, etc.).
 * 3. Applying filters to the invoice data efficiently using `useMemo`.
 * 4. Rendering the page layout, including the main table and action buttons.
 */
const MyInvoices = () => {
  // =========================================================================
  //  STATE & HOOKS
  // =========================================================================
  const navigate = useNavigate(); // Hook for programmatic navigation.


  // State for all filter criteria.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // =========================================================================
  //  DATA FETCHING
  // =========================================================================
  const {
    data: invoices, // React Query provides the data here. We rename it to 'invoices'.
    isLoading,       // Provides a boolean for the loading state.
    isError,         // Provides a boolean for the error state.
    error            // Provides the error object if the fetch fails.
  } = useQuery({
    // `queryKey` is a unique identifier for this data. React Query uses it for caching.
    queryKey: ['invoices'],

    // `queryFn` is the asynchronous function that will fetch the data.
    queryFn: () => getInvoices(),

    // `select` is a powerful option to transform or select a part of the data.
    // We use it to extract the `pendingPayments` array from the API response.
    // This ensures our component always receives the data in the format it expects.
    select: (data) => data.pendingPayments || [],
  });

  // =========================================================================
  //  MEMOIZED FILTERING
  // =========================================================================
  /**
   * Memoize the filtering logic to prevent re-calculation on every render.
   * `filteredData` will only be recomputed if `invoices` or any of the
   * filter state variables (`search`, `status`, etc.) change.
   * This is a crucial performance optimization for pages with interactive filters.
   */
  const filteredData = useMemo(() => {
    // 5. UPDATED: The logic remains the same, but it now works on the `invoices` data
    // provided by React Query. We also handle the case where `invoices` might be undefined
    // during the initial fetch.
    if (!invoices) return [];

    return invoices.filter((invoice) => {
      const companyMatch = invoice.companyName?.toLowerCase().includes(search.toLowerCase());
      const statusMatch = status ? invoice.status === status : true;
      const dateMatch = date ? invoice.dateCreated === date : true;
      const paymentMethodMatch = paymentMethod ? invoice.paymentMethod === paymentMethod : true;
      return companyMatch && statusMatch && dateMatch && paymentMethodMatch;
    });
  }, [invoices, search, status, date, paymentMethod]); // Dependency array now uses `invoices` from useQuery.

  // =========================================================================
  //  EVENT HANDLERS
  // =========================================================================
  const handleCreateInvoice = () => navigate("/createinvoice");

  // =========================================================================
  //  RENDER-RELATED DATA
  // =========================================================================
  // Configuration for the Breadcrumbs component.
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Invoices", path: "/myinvoices" },
  ];

  // =========================================================================
  //  JSX RENDER
  // =========================================================================
  return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-white">
          <Navbar />
          <main className="flex-1">
            <div className="px-6 pb-6">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {/* Page Header */}
            <div className="px-6 py-1 pb-6 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-[#1b1b1b]">My Invoices</h1>
                <p className="text-gray-500 py-2 text-lg">
                  View and manage your invoices easily.
                </p>
              </div>
              {/* Action Buttons */}
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
            {/* Main Content Area */}
            <div className="px-6 pb-6 grid grid-cols-1 gap-6 items-start">
              {/* Conditional rendering based on loading state */}
              {isLoading ? (
                  <div className="text-center p-8">Loading invoices...</div>
              ) : (
                  <MyInvoicesTable
                      data={filteredData}
                      // This is a great pattern (render prop/slot). We pass the entire Filters component
                      // to the Table, allowing the Table to decide *where* to render the filters,
                      // keeping the components decoupled but composed.
                      filters={
                        <InvoiceFilters
                            search={search}
                            setSearch={setSearch}
                            status={status}
                            setStatus={setStatus}
                            date={date}
                            setDate={setDate}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />
                      }
                  />
              )}
            </div>
          </main>
        </div>
      </div>
  );
};

export default MyInvoices;