// src/services/auth.js
import api from "./api";

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
  window.location.href = "/login";
};

/**
 * Ambil Data User yang sedang login
 */
export const getCurrentUser = () => {
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
  const token = localStorage.getItem("access_token");
  return !!token; // Mengembalikan true jika token ada, false jika tidak ada
};