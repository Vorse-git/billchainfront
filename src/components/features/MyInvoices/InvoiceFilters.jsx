// src/components/features/MyInvoices/InvoiceFilters.jsx

import React from 'react';

const InvoiceFilters = ({ search, setSearch, status, setStatus, date, setDate, paymentMethod, setPaymentMethod }) => {
    return (

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

    );
};

export default InvoiceFilters;