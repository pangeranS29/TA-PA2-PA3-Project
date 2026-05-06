// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirectingToLogin = false;

// Interceptor untuk menambahkan token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const rawMessage = error?.response?.data?.message;
    const message = Array.isArray(rawMessage) ? rawMessage.join(" ") : String(rawMessage || "");

    const isAuthError =
      status === 401 ||
      /token tidak valid|expired|authorization/i.test(message);

    if (isAuthError) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      if (!isRedirectingToLogin && window.location.pathname !== "/login") {
        isRedirectingToLogin = true;
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;