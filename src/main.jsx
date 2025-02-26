import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"; // Asegúrate de que este archivo existe en src/
import Login from "./pages/Login"; // Corregido, usa mayúscula en Login
import App from "./App";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard /> {/* Reemplaza App con Dashboard */}
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

