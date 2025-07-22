// src/services/dashboardService.js
import mockData from './mockData.js'; // El servicio es el único que conoce el mock

// En el futuro, esta función hará una llamada real a la API con axios
export const getDashboardData = async () => {
    console.log("Fetching dashboard data from mock service...");
    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockData;
};