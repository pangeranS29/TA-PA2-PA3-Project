import api from "./api";

const ADMIN_ROLE = "admin";
const BIDAN_ROLE = "bidan";
const DOKTER_ROLE = "dokter";

const normalizeRole = (role) => (role || "").toString().trim().toLowerCase();

export const isAdminUser = (user) => normalizeRole(user?.role) === ADMIN_ROLE;
export const isDokterUser = (user) => normalizeRole(user?.role) === DOKTER_ROLE;
export const isBidanUser = (user) => normalizeRole(user?.role) === BIDAN_ROLE;

export const getUserRedirectRoute = (user) => {
  
  const role = normalizeRole(user?.role);
  if (role === ADMIN_ROLE) return "/dashboard/admin";
  if (role === DOKTER_ROLE) return "/dashboard/dokter";
  if (role === BIDAN_ROLE) return "/dashboard/bidan";
  return "/dashboard";
};

export const login = async (identifier, password) => {
  const response = await api.post("/auth/login", { identifier, password });
  const result = response.data.data;
  if (result?.access_token) {
    localStorage.setItem("access_token", result.access_token);
    localStorage.setItem("user", JSON.stringify(result));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

export const getPostLoginRoute = () => {
  const user = getCurrentUser();
  return getUserRedirectRoute(user);
};