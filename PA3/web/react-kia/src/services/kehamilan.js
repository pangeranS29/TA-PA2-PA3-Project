// src/services/kehamilan.js
import api from "./api";

const BASE = "/tenaga-kesehatan/kehamilan";
const BASE_ACTIVE = "/tenaga-kesehatan/ibu-hamil/active";

// Ambil semua data kehamilan
export const getKehamilanList = async () => {
  const res = await api.get(BASE);
  return res.data.data;
};

// Ambil data kehamilan yang aktif (Digunakan di form pendaftaran anak)
export const getkehamilanactive = async (params = {}) => {
  try {
    const res = await api.get(BASE_ACTIVE, { params });
    // Berdasarkan JSON: res.data adalah { status_code, message, data: [...] }
    return res.data.data;
  } catch (error) {
    console.error("Gagal mengambil data kehamilan aktif:", error);
    throw error;
  }
};

export const getKehamilanByIbuId = async (ibuId) => {
  const res = await api.get(`${BASE}?ibu_id=${ibuId}`);
  return res.data.data;
};

export const getKehamilanById = async (id) => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data.data;
};

export const createKehamilan = async (data) => {
  const res = await api.post(BASE, data);
  return res.data.data;
};

export const updateKehamilan = async (id, data) => {
  const res = await api.put(`${BASE}/${id}`, data);
  return res.data.data;
};

export const deleteKehamilan = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};