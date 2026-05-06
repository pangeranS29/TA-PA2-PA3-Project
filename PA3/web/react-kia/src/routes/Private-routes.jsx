import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const PrivateRoute = () => {
  const auth = isAuthenticated();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;