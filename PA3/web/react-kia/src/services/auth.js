// src/services/auth.js

import api from "./api";

// Set VITE_DISABLE_AUTH=true in your .env to bypass auth in development.
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true';

const ADMIN_ROLE = "admin";
const BIDAN_ROLE = "bidan";

const normalizeRole = (role) => (role || "").toString().trim().toLowerCase();

export const isAdminUser = (user) => normalizeRole(user?.role) === ADMIN_ROLE;

export const getUserRedirectRoute = (user) => {
  if (isAdminUser(user)) {
    return "/dashboard/admin";
  }

  if (normalizeRole(user?.role) === BIDAN_ROLE) {
    return "/dashboard";
  }

  return "/dashboard";
};

/**
 * Fungsi Login
 * Menyimpan token dan data user ke localStorage
 */
export const login = async (identifier, password) => {
  const response = await api.post("/auth/login", { identifier, password });
  
  // Ambil data dari response.data.data (sesuaikan dengan struktur API Laravel/Go kamu)
  const result = response.data.data;

  if (result?.access_token) {
    localStorage.setItem("access_token", result.access_token);
    // Simpan objek user secara lengkap (termasuk ID, Nama, Lokasi, dll)
    localStorage.setItem("user", JSON.stringify(result)); 
  }
  
  return response.data;
};

/**
 * Fungsi Logout
 * Menghapus sesi dan mengarahkan kembali ke halaman login
 */
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/dashboard/admin";
};

/**
 * Ambil Data User yang sedang login
 */
export const getCurrentUser = () => {
  if (DISABLE_AUTH) {
    return {
      user_id: 1,
      name: "Dev Admin",
      email: "devadmin@example.com",
      phone_number: "+628000000000",
      role: "Admin",
      target_app: "website",
      redirect_route: "/dashboard/admin",
    };
  }

  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Cek apakah user sudah terautentikasi (punya token)
 */
export const isAuthenticated = () => {
  if (DISABLE_AUTH) return true;
  const token = localStorage.getItem("access_token");
  return !!token; // Mengembalikan true jika token ada, false jika tidak ada
};

/**
 * Ambil route tujuan default setelah login sesuai role user
 */
export const getPostLoginRoute = () => {
  const user = getCurrentUser();
  return getUserRedirectRoute(user);
};