import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyInvoices from "./pages/MyInvoices";
import CreateInvoice from "./pages/CreateInvoice";  // ✅ Importar la nueva página
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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
          path="/createinvoice" 
          element={
            <PrivateRoute>
              <CreateInvoice />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<h1>❌ Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;


