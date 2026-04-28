import api from "./api";

const BASE_DOKTER_T1_COMPLETE = "/tenaga-kesehatan/pemeriksaan-dokter-t1-complete";

export const getDokterT1CompleteByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE_DOKTER_T1_COMPLETE}?kehamilan_id=${kehamilanId}`);
  return res.data;
};

export const createDokterT1Complete = async (data) => {
  const res = await api.post(BASE_DOKTER_T1_COMPLETE, data);
  return res.data;
};

export const updateDokterT1Complete = async (id, data) => {
  const res = await api.put(`${BASE_DOKTER_T1_COMPLETE}/${id}`, data);
  return res.data;
};

export const deleteDokterT1Complete = async (id) => {
  const res = await api.delete(`${BASE_DOKTER_T1_COMPLETE}/${id}`);
  return res.data;
};