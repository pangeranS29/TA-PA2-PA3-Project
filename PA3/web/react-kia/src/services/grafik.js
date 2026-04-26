import api from "./api";

const BASE = "/tenaga-kesehatan/grafik-evaluasi-kehamilan";

export const getGrafikByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE}?kehamilan_id=${kehamilanId}`);
  return res.data.data;
};

export const createGrafik = async (data) => {
  const res = await api.post(BASE, data);
  return res.data.data;
};

export const updateGrafik = async (id, data) => {
  const res = await api.put(`${BASE}/${id}`, data);
  return res.data.data;
};