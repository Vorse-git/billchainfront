import { useState } from "react";
import dataMyInvoices from "../../data/dataMyInvoices.js";
import { Checkbox, Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { EyeIcon, PencilIcon, ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline";

const MyInvoicesTable = () => {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedRows, setCheckedRows] = useState({});
  const itemsPerPage = 5;

  const invoices = dataMyInvoices;

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: "bg-[#FEFAED] border-[#F5CE4E] text-[#272727]",
      Paid: "bg-[#F0F9E6] border-[#6AC100] text-[#272727]",
      Overdue: "bg-[#FCEDF0] border-[#DF4765] text-[#272727]",
    };
  
    const circleColor = {
      Pending: "bg-[#F5CE4E]",
      Paid: "bg-[#6AC100]",
      Overdue: "bg-[#DF4765]",
    };
  
    return (
      <span
        className={`inline-flex items-center space-x-2 rounded-full border px-3 py-1 ${statusConfig[status]}`}
      >
        <span className={`w-2 h-2 rounded-full ${circleColor[status]}`}></span>
        <p className="text-sm font-medium">{status}</p>
      </span>
    );
  };
  
  const filteredData = invoices.filter((invoice) => {
    const companyName = invoice.companyName?.toLowerCase() || "";
    const invoiceStatus = invoice.status || "";
    const invoicePaymentMethod = invoice.paymentMethod || "";
    const invoiceDate = invoice.dateCreated || "";

    return (
      companyName.includes(search.toLowerCase()) &&
      (status ? invoiceStatus === status : true) &&
      (paymentMethod ? invoicePaymentMethod === paymentMethod : true) &&
      (date ? invoiceDate === date : true)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAllChecked = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);

    const newCheckedRows = {};
    paginatedData.forEach((invoice) => {
      newCheckedRows[invoice.id] = newAllChecked;
    });
    setCheckedRows(newCheckedRows);
  };

  const handleRowChecked = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const DefaultPagination = () => {
    const getItemProps = (index) => ({
      variant: currentPage === index ? "filled" : "text",
      color: "gray",
      onClick: () => handlePageChange(index),
    });

    const next = () => {
      if (currentPage === totalPages) return;
      setCurrentPage(currentPage + 1);
    };

    const prev = () => {
      if (currentPage === 1) return;
      setCurrentPage(currentPage - 1);
    };

    // Calcular el rango de páginas a mostrar
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    return (
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="text"
          className="flex items-center bg-white gap-2"
          onClick={prev}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> PREVIOUS
        </Button>
        <div className="flex items-center gap-2">
          {/* Mostrar botones de páginas */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(startPage - 1, endPage) // Mostrar solo un rango de páginas
            .map((page) => (
              <IconButton
                key={page}
                {...getItemProps(page)}
                className={`${
                  currentPage === page
                    ? "bg-[#4416A8] text-white hover:bg-[#371288]"
                    : "bg-white text-[#8A929A] border border-[#B0B6BB] hover:bg-[#F3F4F4]"
                } flex items-center justify-center w-10 h-10 rounded-md`}
              >
                {page}
              </IconButton>
            ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Mostrar botones de páginas */}
          {Array.from({ length: totalPages }, (_, i) => i + 2)
            .slice(startPage - 1, endPage) // Mostrar solo un rango de páginas
            .map((page) => (
              <IconButton
                key={page}
                {...getItemProps(page)}
                className={`${
                  currentPage === page
                    ? "bg-[#4416A8] text-white hover:bg-[#371288]"
                    : "bg-white text-[#8A929A] border border-[#B0B6BB] hover:bg-[#F3F4F4]"
                } flex items-center justify-center w-10 h-10 rounded-md`}
              >
                {page}
              </IconButton>
            ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Mostrar botones de páginas */}
          {Array.from({ length: totalPages }, (_, i) => i + 3)
            .slice(startPage - 1, endPage) // Mostrar solo un rango de páginas
            .map((page) => (
              <IconButton
                key={page}
                {...getItemProps(page)}
                className={`${
                  currentPage === page
                    ? "bg-[#4416A8] text-white hover:bg-[#371288]"
                    : "bg-white text-[#8A929A] border border-[#B0B6BB] hover:bg-[#F3F4F4]"
                } flex items-center justify-center w-10 h-10 rounded-md`}
              >
                {page}
              </IconButton>
            ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Mostrar botones de páginas */}
          {Array.from({ length: totalPages }, (_, i) => i + 4)
            .slice(startPage - 1, endPage) // Mostrar solo un rango de páginas
            .map((page) => (
              <IconButton
                key={page}
                {...getItemProps(page)}
                className={`${
                  currentPage === page
                    ? "bg-[#4416A8] text-white hover:bg-[#371288]"
                    : "bg-white text-[#8A929A] border border-[#B0B6BB] hover:bg-[#F3F4F4]"
                } flex items-center justify-center w-10 h-10 rounded-md`}
              >
                {page}
              </IconButton>
            ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Mostrar botones de páginas */}
          {Array.from({ length: totalPages }, (_, i) => i + 5)
            .slice(startPage - 1, endPage) // Mostrar solo un rango de páginas
            .map((page) => (
              <IconButton
                key={page}
                {...getItemProps(page)}
                className={`${
                  currentPage === page
                    ? "bg-[#4416A8] text-white hover:bg-[#371288]"
                    : "bg-white text-[#8A929A] border border-[#B0B6BB] hover:bg-[#F3F4F4]"
                } flex items-center justify-center w-10 h-10 rounded-md`}
              >
                {page}
              </IconButton>
            ))}
        </div>
        <Button
          variant="text"
          className="flex items-center bg-white gap-2"
          onClick={next}
          disabled={currentPage === totalPages}
        >
          NEXT
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="border rounded-2xl overflow-hidden bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Invoices list</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search company"
            className="border p-2 rounded-lg w-[200px] h-[40px] text-gray-400 hover:border-gray-600 hover:text-gray-600 transition-colors duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded-lg w-[200px] h-[40px] text-gray-400 hover:border-gray-600 hover:text-gray-600 transition-colors duration-200"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className="border p-2 rounded-lg w-[200px] h-[40px] text-gray-400 hover:border-gray-600 hover:text-gray-600 transition-colors duration-200"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <select
            className="border p-2 rounded-lg w-[200px] h-[40px] text-gray-400 hover:border-gray-600 hover:text-gray-600 transition-colors duration-200"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">All Methods</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Wire Transfer">Wire Transfer</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                <div className="flex w-max gap-4">
                  <Checkbox
                    color="blue"
                    checked={allChecked}
                    onChange={handleAllChecked}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice Value</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment Method</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment Deadline</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((invoice) => (
              <tr key={invoice.id} className="text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-3 text-sm">
                  <div className="flex w-max gap-4">
                    <Checkbox
                      color="blue"
                      checked={checkedRows[invoice.id] || false}
                      onChange={() => handleRowChecked(invoice.id)}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{invoice.id}</td>
                <td className="px-4 py-3 text-sm">{invoice.dateCreated || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{invoice.companyName || "N/A"}</td>
                <td className="px-4 py-3 text-sm">${Number(invoice.invoiceValue).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{invoice.paymentMethod || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{invoice.paymentDeadline || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{getStatusBadge(invoice.status)}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-0">
                    <button className="p-1 bg-white hover:bg-gray-200 rounded-md flex items-center justify-center">
                      <EyeIcon className="w-5 h-7 text-[#301077]" />
                    </button>
                    <button className="p-1 bg-white hover:bg-gray-200 rounded-md flex items-center justify-center">
                      <PencilIcon className="w-5 h-7 text-[#301077]" />
                    </button>
                    <button className="p-1 bg-white hover:bg-gray-200 rounded-md flex items-center justify-center">
                      <ArrowDownTrayIcon className="w-5 h-7 text-[#301077]" />
                    </button>
                    <button className="p-1 bg-white hover:bg-gray-200 rounded-md flex items-center justify-center">
                      <TrashIcon className="w-5 h-7 text-[#301077]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <DefaultPagination />
      </div>
    </div>
  );
};

export default MyInvoicesTable;