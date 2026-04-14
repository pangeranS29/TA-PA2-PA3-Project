import api from "./api";

// Helper untuk mapping respons backend ke format frontend
const mapIbuResponse = (item) => ({
  id: item.id,
  nama: item.nama_ibu || item.nama || "",
  nik: item.nik || "",
  hpht: item.hpht || "",
  usia: item.usia || 0,
  dusun: item.dusun || "",
  statusKehamilan: item.statusKehamilan || "TRIMESTER 1",
  createdAt: item.created_at || item.createdAt,
});

export const getAllIbu = async () => {
  try {
    const response = await api.get("/tenaga-kesehatan/ibu-hamil");
    let rawData = [];
    if (response.data && response.data.data) {
      rawData = response.data.data;
    } else if (Array.isArray(response.data)) {
      rawData = response.data;
    }
    return rawData.map(mapIbuResponse);
  } catch (error) {
    console.error("Get all ibu error:", error);
    throw error;
  }
};

export const createIbu = async (data) => {
  const payload = {
    nama_ibu: data.nama,
    nik: data.nik,
    hpht: data.hpht,
    usia: data.usia,
    dusun: data.dusun,
    statusKehamilan: data.statusKehamilan,
  };
  const response = await api.post("/tenaga-kesehatan/ibu-hamil", payload);
  return mapIbuResponse(response.data.data);
};

export const updateIbu = async (id, data) => {
  const payload = {
    nama_ibu: data.nama,
    nik: data.nik,
    hpht: data.hpht,
    usia: data.usia,
    dusun: data.dusun,
    statusKehamilan: data.statusKehamilan,
  };
  const response = await api.put(`/tenaga-kesehatan/ibu-hamil/${id}`, payload);
  return mapIbuResponse(response.data.data);
};

export const deleteIbu = async (id) => {
  await api.delete(`/tenaga-kesehatan/ibu-hamil/${id}`);
};

// Jadwal (mock, ganti jika ada endpoint)
export const getJadwalPemeriksaan = async () => {
  return [
    { id: 1, namaIbu: "Anisa Nuraini", jenisPemeriksaan: "Pemeriksaan Trimester 3", jam: "09:00", tanggal: "2025-04-15", dusun: "DUSUN II" },
    { id: 2, namaIbu: "Siti Rahayu", jenisPemeriksaan: "Konsultasi Gizi", jam: "13:30", tanggal: "2025-04-15", dusun: "DUSUN I" },
  ];
};