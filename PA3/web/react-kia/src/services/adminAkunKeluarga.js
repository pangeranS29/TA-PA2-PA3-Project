import api from "./api";

export const createAkunKeluargaAdmin = async (payload) => {
  const normalizedPayload = {
    ...payload,
  };

  if (normalizedPayload.role_id != null) {
    normalizedPayload.role_id = Number(normalizedPayload.role_id);
    delete normalizedPayload.role;
    delete normalizedPayload.akun_role;
  } else if (normalizedPayload.role == null && normalizedPayload.akun_role != null) {
    normalizedPayload.role = normalizedPayload.akun_role;
  }

  delete normalizedPayload.akun_role;

  const response = await api.post("/admin/akun-keluarga", normalizedPayload);
  return response.data;
};

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

export const listKartuKeluargaAdmin = async (params = {}) => {
  const response = await api.get("/admin/kartu-keluarga", { params });
  return response.data;
};

export const detailKartuKeluargaAdmin = async (kartuKeluargaId) => {
  const response = await api.get(`/admin/kartu-keluarga/${kartuKeluargaId}`);
  return response.data;
};

export const updateKartuKeluargaAdmin = async (kartuKeluargaId, payload) => {
  const response = await api.put(`/admin/kartu-keluarga/${kartuKeluargaId}`, payload);
  return response.data;
};

export const updateAnggotaKeluargaAdmin = async (kartuKeluargaId, pendudukId, payload) => {
  const response = await api.put(`/admin/kartu-keluarga/${kartuKeluargaId}/anggota/${pendudukId}`, payload);
  return response.data;
};

export const addAnggotaKeluargaAdmin = async (kartuKeluargaId, payload) => {
  const response = await api.post(`/admin/kartu-keluarga/${kartuKeluargaId}/anggota`, payload);
  return response.data;
};

export const deleteAnggotaKeluargaAdmin = async (kartuKeluargaId, pendudukId) => {
  const response = await api.delete(`/admin/kartu-keluarga/${kartuKeluargaId}/anggota/${pendudukId}`);
  return response.data;
};

export const deleteKartuKeluargaAdmin = async (kartuKeluargaId) => {
  const response = await api.delete(`/admin/kartu-keluarga/${kartuKeluargaId}`);
  return response.data;
};

export const adminAkunKeluargaErrorMessage = extractApiError;
