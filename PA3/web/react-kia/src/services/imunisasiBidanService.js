import api from "./api";

// ============================================
// GET DATA IMUNISASI
// ============================================

export async function getImunisasiByAnakId(anakId) {
  try {
    const response = await api.get(`/bidan/imunisasi/anak/${anakId}`);
    return response.data?.data ?? response.data ?? [];
  } catch (error) {
    console.error("Error fetching jadwal imunisasi:", error);
    throw error;
  }
}

// ============================================
// MARK JADWAL SELESAI (Simple)
// ============================================

export async function setJadwalSelesai(jadwalId) {
  try {
    const response = await api.put(`/bidan/imunisasi/${jadwalId}/selesai`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Error set jadwal selesai:", error);
    throw error;
  }
}

// ============================================
// CREATE PELAYANAN IMUNISASI (Full Detail)
// ============================================

export async function createPelayananImunisasi(data) {
  try {
    const response = await api.post('/tenaga-kesehatan/Pelayanan-Imunisasi', data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Error creating pelayanan imunisasi:", error);
    throw error;
  }
}

// ============================================
// GET ATURAN VAKSIN ANAK (untuk color coding)
// ============================================

export async function getAturanVaksinAnak() {
  try {
    const response = await api.get('/bidan/aturan-vaksin-anak');
    return response.data?.data ?? response.data ?? [];
  } catch (error) {
    console.error("Error fetching aturan vaksin:", error);
    // Return empty array jika endpoint belum ada
    return [];
  }
}