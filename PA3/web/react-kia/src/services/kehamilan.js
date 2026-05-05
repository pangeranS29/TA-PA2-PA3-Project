import api from "./api";

const BASE = "/tenaga-kesehatan/kehamilan";

// Ambil semua data kehamilan (untuk keperluan tertentu)
export const getKehamilanList = async () => {
  const res = await api.get(BASE);
  return res.data.data;
};

// Ambil kehamilan berdasarkan ID ibu
export const getKehamilanByIbuId = async (ibuId) => {
  const response = await api.get(BASE, {
    params: { ibu_id: ibuId }
  });
  return response.data.data; // mengembalikan array
};

// Ambil kehamilan berdasarkan ID
export const getKehamilanById = async (id) => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data.data;
};

// Buat kehamilan baru
export const createKehamilan = async (data) => {
  const response = await api.post(BASE, data);
  return response; // return full response agar bisa diambil data.data
};

// Update kehamilan
export const updateKehamilan = async (id, data) => {
  const response = await api.put(`${BASE}/${id}`, data);
  return response;
};

// Hapus kehamilan
export const deleteKehamilan = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};