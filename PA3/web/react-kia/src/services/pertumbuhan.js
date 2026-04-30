import api from "./api";

const BASE = "/tenaga-kesehatan/pertumbuhan";

export const getRiwayatPertumbuhan = async (anakId) => {
  const res = await api.get(`${BASE}/anak/${anakId}`);
  return res.data;
};

export const getPertumbuhanChart = async (anakId) => {
  const res = await api.get(`${BASE}/chart/${anakId}`);
  return res.data;
};

export const addCatatanPertumbuhan = async (data) => {
  const res = await api.post(BASE, data);
  return res.data;
};

export const updateCatatanPertumbuhan = async (id, data) => {
  const res = await api.put(`${BASE}/${id}`, data);
  return res.data;
};

export const deleteCatatanPertumbuhan = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};
