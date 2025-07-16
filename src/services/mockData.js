const mockData = {
    invoicesStatus: [
        { label: "Paid", value: 320 },
        { label: "Overdue", value: 120 },
        { label: "Draft", value: 90 },
        { label: "Sent", value: 150 },
        { label: "Viewed", value: 180 }
    ],
    monthlyRevenue: [
        { month: "January", revenue: 850000 },
        { month: "February", revenue: 720000 },
        { month: "March", revenue: 910000 },
        { month: "April", revenue: 870000 },
        { month: "May", revenue: 960000 },
        { month: "June", revenue: 750000 },
        { month: "July", revenue: 75000 },
        { month: "August", revenue: 200000 },  
        { month: "September", revenue: 10000 },
        { month: "October", revenue: 450000 },
        { month: "November", revenue: 750000 },
        { month: "December", revenue: 600000 } 
    ],
    cards: {
        totalInvoicesIssued: 1024,
        totalInvoicesPayment: 890
    },
    pendingPayments: [
        { id: "INV-00001", amount: "1,200 USD", date: "2024-01-15", status: "No pay" },
        { id: "INV-00002", amount: "850 USD", date: "2024-02-20", status: "No pay" },
        { id: "INV-00003", amount: "920 USD", date: "2024-03-18", status: "No pay" },
        { id: "INV-00004", amount: "1,500 USD", date: "2024-04-10", status: "No pay" },
        { id: "INV-00005", amount: "2,100 USD", date: "2024-05-12", status: "No pay" }
    ]
};

export default mockData;
