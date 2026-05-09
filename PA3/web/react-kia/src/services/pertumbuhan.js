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
  // bb_lahir dan tb_lahir wajib — gunakan nilai dari data anak atau fallback rata-rata normal
  const bbLahir = payload.berat_lahir_kg || payload.bb_lahir;
  const tbLahir = payload.tinggi_lahir_cm || payload.tb_lahir;

  // Validasi: semua field wajib harus ada
  if (!payload.berat_badan || !payload.tinggi_badan || !payload.hasil_lila) {
    throw new Error("Data BB, TB, dan LILA wajib diisi untuk prediksi stunting");
  }

  const mlPayload = {
    bb_lahir:      bbLahir  ? parseFloat(bbLahir)  : 3.0,   // fallback rata-rata normal
    tb_lahir:      tbLahir  ? parseFloat(tbLahir)  : 49.0,  // fallback rata-rata normal
    bb:            parseFloat(payload.berat_badan),
    tb:            parseFloat(payload.tinggi_badan),
    lila:          parseFloat(payload.hasil_lila),
    umur:          parseInt(payload.usia_ukur_bulan) || 0,
    jenis_kelamin: payload.jenis_kelamin || "Laki-laki",
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

// Ambil prediksi terbaru — coba backend dulu, fallback ke null
export const getLatestPrediksi = async (anakId) => {
  try {
    const res = await api.get(`/api/v1/anak/${anakId}/prediksi-stunting/latest`);
    return res.data;
  } catch {
    return null; // route belum aktif, kembalikan null
  }
};
