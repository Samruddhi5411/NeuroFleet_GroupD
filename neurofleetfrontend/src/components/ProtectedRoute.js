import { Navigate } from "react-router-dom";
import { authService } from "../services/api"; // correct import

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Check if logged in
  const isAuthenticated = authService.isAuthenticated
    ? authService.isAuthenticated()
    : !!localStorage.getItem("token"); // fallback

  // Get user role
  const userRole = localStorage.getItem("role");

  // If not logged in → Go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If role not allowed → Go to unauthorized page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Otherwise allow access
  return children;
};

export default ProtectedRoute;
