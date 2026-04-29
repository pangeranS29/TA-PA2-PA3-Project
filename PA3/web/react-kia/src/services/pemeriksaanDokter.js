import api from "./api";

// ========== ENDPOINT LAMA (jika masih ada komponen yang menggunakannya) ==========
const BASE_DOKTER_T1 = "/tenaga-kesehatan/pemeriksaan-dokter-t1";
const BASE_DOKTER_T3 = "/tenaga-kesehatan/pemeriksaan-dokter-t3";
const BASE_LAB_JIWA = "/tenaga-kesehatan/pemeriksaan-lab-jiwa";
const BASE_LANJUTAN_T3 = "/tenaga-kesehatan/pemeriksaan-lanjutan-t3";

// Tri 1 (lama) – mungkin masih dipakai oleh komponen lain
export const getDokterT1ByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE_DOKTER_T1}?kehamilan_id=${kehamilanId}`);
  return res.data.data;
};
export const getDokterT1ById = async (id) => {
  const res = await api.get(`${BASE_DOKTER_T1}/${id}`);
  return res.data.data;
};
export const createDokterT1 = async (data) => {
  const res = await api.post(BASE_DOKTER_T1, data);
  return res.data.data;
};
export const updateDokterT1 = async (id, data) => {
  const res = await api.put(`${BASE_DOKTER_T1}/${id}`, data);
  return res.data.data;
};
export const deleteDokterT1 = async (id) => {
  const res = await api.delete(`${BASE_DOKTER_T1}/${id}`);
  return res.data.data;
};

// Tri 3 (lama)
export const getDokterT3ByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE_DOKTER_T3}?kehamilan_id=${kehamilanId}`);
  return res.data.data;
};
export const getDokterT3ById = async (id) => {
  const res = await api.get(`${BASE_DOKTER_T3}/${id}`);
  return res.data.data;
};
export const createDokterT3 = async (data) => {
  const res = await api.post(BASE_DOKTER_T3, data);
  return res.data.data;
};
export const updateDokterT3 = async (id, data) => {
  const res = await api.put(`${BASE_DOKTER_T3}/${id}`, data);
  return res.data.data;
};
export const deleteDokterT3 = async (id) => {
  const res = await api.delete(`${BASE_DOKTER_T3}/${id}`);
  return res.data.data;
};

// Lab Jiwa (lama)
export const getLabJiwaByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE_LAB_JIWA}?kehamilan_id=${kehamilanId}`);
  return res.data.data;
};
export const createLabJiwa = async (data) => {
  const res = await api.post(BASE_LAB_JIWA, data);
  return res.data.data;
};
export const updateLabJiwa = async (id, data) => {
  const res = await api.put(`${BASE_LAB_JIWA}/${id}`, data);
  return res.data.data;
};

// Lanjutan T3 (lama)
export const getLanjutanT3ByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE_LANJUTAN_T3}?kehamilan_id=${kehamilanId}`);
  return res.data.data;
};
export const createLanjutanT3 = async (data) => {
  const res = await api.post(BASE_LANJUTAN_T3, data);
  return res.data.data;
};
export const updateLanjutanT3 = async (id, data) => {
  const res = await api.put(`${BASE_LANJUTAN_T3}/${id}`, data);
  return res.data.data;
};

// ========== ENDPOINT BARU (COMPLETE) ==========
const BASE_DOKTER_T1_COMPLETE = "/tenaga-kesehatan/pemeriksaan-dokter-t1-complete";
const BASE_DOKTER_T3_COMPLETE = "/tenaga-kesehatan/pemeriksaan-dokter-t3-complete";

// T1 Complete
export const getDokterT1CompleteByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE_DOKTER_T1_COMPLETE}?kehamilan_id=${kehamilanId}`);
  return res.data.data;
};
export const getDokterT1CompleteById = async (id) => {
  const res = await api.get(`${BASE_DOKTER_T1_COMPLETE}/${id}`);
  return res.data.data;
};
export const createDokterT1Complete = async (data) => {
  const res = await api.post(BASE_DOKTER_T1_COMPLETE, data);
  return res.data.data;
};
export const updateDokterT1Complete = async (id, data) => {
  const res = await api.put(`${BASE_DOKTER_T1_COMPLETE}/${id}`, data);
  return res.data.data;
};
export const deleteDokterT1Complete = async (id) => {
  const res = await api.delete(`${BASE_DOKTER_T1_COMPLETE}/${id}`);
  return res.data.data;
};

// T3 Complete
export const getDokterT3CompleteByKehamilanId = async (kehamilanId) => {
  const res = await api.get(`${BASE_DOKTER_T3_COMPLETE}?kehamilan_id=${kehamilanId}`);
  return res.data.data;
};
export const getDokterT3CompleteById = async (id) => {
  const res = await api.get(`${BASE_DOKTER_T3_COMPLETE}/${id}`);
  return res.data.data;
};
export const createDokterT3Complete = async (data) => {
  const res = await api.post(BASE_DOKTER_T3_COMPLETE, data);
  return res.data.data;
};
export const updateDokterT3Complete = async (id, data) => {
  const res = await api.put(`${BASE_DOKTER_T3_COMPLETE}/${id}`, data);
  return res.data.data;
};
export const deleteDokterT3Complete = async (id) => {
  const res = await api.delete(`${BASE_DOKTER_T3_COMPLETE}/${id}`);
  return res.data.data;
};
