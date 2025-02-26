import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyInvoices from "./pages/MyInvoices.jsx";

function DebugRouter() {
  const location = useLocation();
  console.log("🔍 Current route:", location.pathname);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/myinvoices" element={<MyInvoices />} />
      <Route path="/*" element={<h1>❌ Página no encontrada</h1>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <DebugRouter />
    </Router>
  );
}

export default App;

