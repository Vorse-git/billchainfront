// ✅ Login.jsx (Using CustomInputSimple, Original Button)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth"; // Asume que esta función existe
import logo from "../../img/logo-billchain.svg";
import mockup from "../../img/mockup.png";
import isotipo from "../../img/isotipo-blanco.svg";

// --- IMPORTAR CustomInputSimple ---
// Ajusta la ruta si tu estructura es diferente
import CustomInputSimple from "../components/FormElements/CustomInput";
// ----------------------------------

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // --- Error ahora contendrá el mensaje o null ---
  const [error, setError] = useState(null);
  // ------------------------------------------
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiar error previo

    // Validación simple opcional
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (login(email, password)) {
      navigate("/dashboard");
    } else {
      // Establecer mensaje de error para los inputs
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado Izquierdo: Formulario */}
      <div className="w-1/2 flex items-center justify-center bg-white p-12"> {/* Padding ajustado */}
        <div className="w-full max-w-md"> {/* Ancho máximo ajustado */}
          {/* Logo */}
          <div className="mb-8 flex justify-center sm:justify-start">
            <img src={logo} alt="Billchain Logo" className="w-48" />
          </div>

          {/* Títulos */}
          <h2 className="text-3xl font-bold mb-2 text-center sm:text-left">Sign in</h2>
          <p className="text-center sm:text-left text-gray-500 mb-8">
            Welcome back! Please enter your details.
          </p>

          {/* Mensaje de error genérico ELIMINADO */}
          {/* {error && <p className="text-red-500 text-center mb-4">{error}</p>} */}

          <form onSubmit={handleSubmit} className="space-y-6"> {/* Espaciado añadido */}

            {/* --- Email Input REEMPLAZADO --- */}
            <CustomInputSimple
              label="Email"
              id="UserEmail" // Mantener ID para el label
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(value) => { // Asume que CustomInputSimple pasa el valor
                setEmail(value);
                if (error) setError(null); // Limpiar error al escribir
              }}
              error={error} // Pasar el estado de error
              autoComplete="email"
            />
            {/* ----------------------------- */}

            {/* --- Password Input REEMPLAZADO --- */}
            <CustomInputSimple
              label="Password"
              id="UserPassword" // Mantener ID para el label
              type="password"
              placeholder="********" // Placeholder original
              value={password}
              onChange={(value) => {
                setPassword(value);
                if (error) setError(null); // Limpiar error al escribir
              }}
              error={error} // Pasar el estado de error
              autoComplete="current-password"
            />
            {/* -------------------------------- */}

            {/* Remember Me y Forgot Password (sin cambios) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-[#4416A8] border-gray-300 rounded focus:ring-[#6945B9]" // Estilos ajustados
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#" className="text-sm font-medium text-[#4416A8] hover:text-[#301077]">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* --- Submit Button (BOTÓN HTML ORIGINAL MANTENIDO) --- */}
            <button type="submit" className="w-full inline-block rounded-lg h-[56px] bg-[#4416A8] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6945B9] active:bg-[#301077] focus:ring-2 focus:ring-[#4416A8] focus:ring-offset-2 focus:outline-none"> {/* Clases ajustadas para parecerse al componente Button */}
              Sign in
            </button>
            {/* ---------------------------------------------------- */}
          </form>

          {/* Copyright Text */}
          <div className="mt-8 text-center sm:text-left text-xs text-gray-500">
            <p>© By VORSE {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Background (sin cambios) */}
      <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-[#2A0874] to-[#4416A8]">
        {/* ... Contenido lado derecho ... */}
         <div className="mb-4"><img src={isotipo} alt="Isotipo" className="w-[72px] h-[72px]" /></div>
        <h2 className="text-white text-3xl font-bold mb-8 text-center max-w-sm">Create invoices, reports and monitor</h2>
        <img src={mockup} alt="Mockup" className="w-full max-w-[600px] mb-8" />
        <p className="text-white text-center text-lg mb-8 max-w-md">In Billchain you will be able to easily generate your company's invoices and monitor them, all with the highest security.</p>
      </div>
    </div>
  );
};

export default Login;