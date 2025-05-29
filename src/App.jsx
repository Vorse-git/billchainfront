// ✅ App.jsx (CORREGIDO - SIN Router duplicado)
import { Routes, Route } from "react-router-dom"; // <--- SOLO Routes y Route
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyInvoices from "./pages/MyInvoices";
import CreateInvoice from "./pages/CreateInvoice";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    // --- SIN <Router> aquí ---
    <Routes>
      {/* Ruta pública para Login */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> {/* Ruta explícita */}

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/myinvoices"
        element={
          <PrivateRoute>
            <MyInvoices />
          </PrivateRoute>
        }
      />
      <Route
        // Mantén esta ruta como la tengas en tus Links/navigate (ej. /create-invoice)
        path="/createinvoice"
        element={
          <PrivateRoute>
            <CreateInvoice />
          </PrivateRoute>
        }
      />
      {/* Ruta catch-all */}
      <Route path="*" element={<h1 className="text-center text-red-500 mt-10 text-xl">❌ Page Not Found</h1>} />
    </Routes>
    // --- FIN ---
  );
}

export default App;