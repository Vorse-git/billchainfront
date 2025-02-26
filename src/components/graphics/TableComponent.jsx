const TableComponent = ({ data }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      Created: 'border-violet-500 text-violet-700',
      Pending: 'border-yellow-500 text-yellow-700',
      Paid: 'border-emerald-500 text-emerald-700',
      Canceled: 'border-red-500 text-red-700',
    };

    return (
      <span className={`inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 ${statusConfig[status]}`}>
        <p className="text-sm whitespace-nowrap">{status}</p>
      </span>
    );
  };

  return (
    <div className="border rounded-2xl overflow-hidden bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg text-gray-700 font-semibold">Pending Payments</h3>
        <select className="border rounded-lg px-3 py-1 text-sm text-gray-700">
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="April">May</option>
          <option value="April">June</option>
          <option value="April">July</option>
          <option value="April">August</option>
          <option value="April">September</option>
          <option value="April">October</option>
          <option value="April">November</option>
          <option value="April">December</option>

        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-gray-700">{item.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.amount}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.date}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {getStatusBadge(index < 2 ? 'Paid' : index < 4 ? 'Pending' : 'Canceled')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <a
                    className="inline-block size-6 rounded-full border border-violet-600 p-1 text-violet-600 hover:bg-violet-600 hover:text-white focus:ring-3 focus:outline-hidden shadow-sm hover:shadow-md"
                    href="#"
                  >
                    <span className="sr-only">Pay</span>
                    <svg
                      className="size-4 rtl:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 28 28"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
