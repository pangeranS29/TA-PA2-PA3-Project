import api from "./api";

const BASE_URL = "/tenaga-kesehatan/perkembangan-anak";

export const getRentangPerkembangan = async () => {
  const response = await api.get(`${BASE_URL}/rentang-usia`);
  return response.data;
};

export const getKategoriPerkembangan = async (rentangId) => {
  const response = await api.get(`${BASE_URL}/kategori/${rentangId}`);
  return response.data;
};

export const savePerkembanganAnak = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

export const getPerkembanganHistory = async (anakId, rentangId) => {
  const response = await api.get(
    `${BASE_URL}/history?anak_id=${anakId}&rentang_usia_id=${rentangId}`
  );
  return response.data;
};

// CRUD for Indicators (Kategori)
export const createKategoriPerkembangan = async (data) => {
  const response = await api.post(`${BASE_URL}/kategori`, data);
  return response.data;
};

export const updateKategoriPerkembangan = async (id, data) => {
  const response = await api.put(`${BASE_URL}/kategori/${id}`, data);
  return response.data;
};

export const deleteKategoriPerkembangan = async (id) => {
  const response = await api.delete(`${BASE_URL}/kategori/${id}`);
  return response.data;
};
