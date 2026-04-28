// src/routes/Private-routes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../services/auth";

const PrivateRoute = ({ allowedRoles }) => {
  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // GUNAKAN NORMALISASI YANG SAMA
  // Pastikan role di-trim dan di-lowercase sebelum dibandingkan
  const userRole = (user?.role || "").toString().trim().toLowerCase();

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(`Access Denied. User Role: ${userRole}, Allowed: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;