import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, isAdminUser, isAuthenticated } from "../services/auth";

const AdminRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (!isAdminUser(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
