import api from "./api";

const BASE = "/puskesmas/vaksin";

export const getVaksinList = async () => {
  const res = await api.get(BASE);
  return res.data.data;
};

export const createVaksin = async (payload) => {
  const res = await api.post(BASE, payload);
  return res.data;
};

export const getVaksinById = async (id) => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data.data;
};

export const updateVaksin = async (id, payload) => {
  const res = await api.put(`${BASE}/${id}`, payload);
  return res.data;
};

export const updateVaksinStatus = async (id, status) => {
  const res = await api.patch(`${BASE}/${id}/status`, { status });
  return res.data;
};
