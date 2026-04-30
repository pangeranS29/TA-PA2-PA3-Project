import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/auth";

const BidanRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  // Check apakah user adalah Bidan atau Kader
  if (!user || (user.role !== "Bidan" && user.role !== "Kader")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default BidanRoute;
