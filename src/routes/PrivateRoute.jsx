import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Importación correcta

const PrivateRoute = ({ children }) => {
  console.log("isAuthenticated:", isAuthenticated()); // 👀 Ver qué devuelve

  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;


