import api from "./api";

const normalizeMessage = (message) => {
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  return message || "";
};

const extractApiError = (error, fallbackMessage = "Terjadi kesalahan") => {
  const message = error?.response?.data?.message;
  const normalized = normalizeMessage(message);
  return normalized || fallbackMessage;
};

export const listInformasiUmum = async () => {
  const response = await api.get("/informasi-umum");
  return response.data;
};

export const detailInformasiUmum = async (id) => {
  const response = await api.get(`/informasi-umum/${id}`);
  return response.data;
};

export const createInformasiUmum = async (payload) => {
  const response = await api.post("/informasi-umum", payload);
  return response.data;
};

export const updateInformasiUmum = async (id, payload) => {
  const response = await api.put(`/informasi-umum/${id}`, payload);
  return response.data;
};

export const deleteInformasiUmum = async (id) => {
  const response = await api.delete(`/informasi-umum/${id}`);
  return response.data;
};

export const informasiUmumErrorMessage = extractApiError;