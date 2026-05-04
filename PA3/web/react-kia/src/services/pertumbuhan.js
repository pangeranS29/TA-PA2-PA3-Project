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

// ── Prediksi Stunting (langsung ke ML service) ────────────────────────────
const ML_URL = import.meta.env.VITE_ML_URL || "http://localhost:8000";

export const prediksiStunting = async (payload) => {
  // Kirim langsung ke FastAPI ML service
  const mlPayload = {
    bb:             payload.berat_badan,
    tb:             payload.tinggi_badan,
    lila:           payload.hasil_lila,
    lingkar_kepala: payload.lingkar_kepala || 0,
    umur:           payload.usia_ukur_bulan,
    jenis_kelamin:  payload.jenis_kelamin,
  };
  const res = await fetch(`${ML_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mlPayload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `ML service error: ${res.status}`);
  }
  return res.json();
};

// Riwayat prediksi (dari backend Go jika route sudah aktif)
export const getRiwayatPrediksi = async (anakId) => {
  const res = await api.get(`/api/v1/anak/${anakId}/prediksi-stunting`);
  return res.data;
};

export const getLatestPrediksi = async (anakId) => {
  const res = await api.get(`/api/v1/anak/${anakId}/prediksi-stunting/latest`);
  return res.data;
};
