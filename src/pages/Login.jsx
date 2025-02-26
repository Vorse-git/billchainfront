import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import logo from "../../img/logo-billchain.svg"; // Nueva ruta del logo
import mockup from "../../img/mockup.png"; // Ruta de la imagen mockup.png
import isotipo from "../../img/isotipo-blanco.svg"; // Ruta del isotipo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side: Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-[800px]">
          {/* Billchain Logo */}
          <div className="mb-6">
            <img src={logo} alt="Billchain Logo" className="w-48" />
          </div>

          <h2 className="text-2xl font-bold mb-4 text-left">Sign in with your account</h2>
          
          {/* Welcome Text */}
          <p className="text-left text-[#8A929A] mb-6">Welcome to the Billchain electronic invoicing portal.</p>
          
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="UserEmail" className="block text-xs font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="UserEmail"
                placeholder="email@example.com"
                className="mt-1 w-full rounded-md border-gray-200 shadow-xs sm:text-sm mb-4 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="UserPassword" className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="UserPassword"
                placeholder="********"
                className="mt-1 w-full rounded-md border-gray-200 shadow-xs sm:text-sm mb-4 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me and Forgot Password on the same line */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full inline-block rounded-sm bg-[#4416A8] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#6945B9] active:bg-[#301077] focus:ring-3 focus:outline-hidden">
              Login
            </button>
          </form>

          {/* Copyright Text */}
          <div className="mt-4 text-left text-xs text-gray-500">
            <p>By VORSE 2025 &copy;</p>
          </div>
        </div>
      </div>

      {/* Right side: Background with Text and Mockup */}
      <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-[#2A0874] to-[#4416A8]">
        {/* Isotipo Image */}
        <div className="mb-4">
          <img src={isotipo} alt="Isotipo" className="w-[72px] h-[72px]" />
        </div>

        {/* Title */}
        <h2 className="text-white text-3xl font-bold mb-8 text-center">
          Create invoices, reports and monitor
        </h2>

        {/* Mockup Image */}
        <img src={mockup} alt="Mockup" className="w-[600px] mb-8" />

        {/* Paragraph */}
        <p className="text-white text-center text-lg mb-8 w-[400px]">
          In Billchain you will be able to easily generate your company's invoices and monitor them, all with the highest security.
        </p>
      </div>
    </div>
  );
};

export default Login;
