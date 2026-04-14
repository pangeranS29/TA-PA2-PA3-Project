import api from "./api";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (identifier, password) => {
  const response = await api.post("/auth/login", { identifier, password });
  if (response.data.data?.access_token) {
    localStorage.setItem("access_token", response.data.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};