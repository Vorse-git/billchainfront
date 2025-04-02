import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import Card from "../components/Card.jsx";
import mockData from "../data/mockData.js";
import PieChartComponent from "../components/graphics/PieChart.jsx";
import TotalInvoicesIssuedCard from "../components/graphics/TotalInvoicesIssuedCard.jsx";
import TotalInvoicesPaymentCard from "../components/graphics/TotalInvoicesPaymentCard.jsx";
import BarChartComponent from "../components/graphics/BarChartComponent.jsx";
import TableComponent from "../components/graphics/TableComponent.jsx";

const Dashboard = () => {
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-white">
        <Navbar />

        <div className="px-6 pb-6">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>

        <div className="px-6 py-1 pb-6">
          <h1 className="text-5xl font-bold text-[#1b1b1b]">Hi, Nicolás!</h1>
          <p className="text-gray-500 py-2 text-lg">What are we doing today?</p>
        </div>

        <div className="px-6 pb-6 gap-y-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Create Invoice" description="Create invoices from scratch or use a template." link="#" image="/Create-invoice.svg" />
          <Card title="Generate Report" description="Download your company's billing report." link="#" image="/Report.svg" />
          <Card title="My Invoices" description="Quickly and easily consult your company's invoices." link="#" image="/My-invoices.svg" />
        </div>

        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <PieChartComponent data={mockData.invoicesStatus} />
          <div className="flex flex-col h-full gap-6">
            <TotalInvoicesIssuedCard number={mockData.cards.totalInvoicesIssued} />
            <TotalInvoicesPaymentCard number={mockData.cards.totalInvoicesPayment} />
          </div>
          <div className="flex flex-col h-full">
            <TableComponent data={mockData.pendingPayments} />
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-1 md:auto gap-6 items-stretch">
          <div className="md:col-span-2 flex flex-col">
            <BarChartComponent data={mockData.monthlyRevenue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
