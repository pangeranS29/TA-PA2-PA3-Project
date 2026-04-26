import api from "./api";

export const getRekapWilayah = async () => {
  const res = await api.get("/tenaga-kesehatan/rekap-wilayah");
  return res.data.data;
};

export const getDaftarRisikoTinggi = async () => {
  const res = await api.get("/tenaga-kesehatan/risiko-tinggi");
  return res.data.data;
};

export const getPrioritasKunjungan = async () => {
  const res = await api.get("/tenaga-kesehatan/prioritas-kunjungan");
  return res.data.data;
};

export const getPemantauanIndikator = async ({ kategoriUsia, q } = {}) => {
  const res = await api.get("/tenaga-kesehatan/pemantauan-indikator", {
    params: {
      kategori_usia: kategoriUsia || undefined,
      q: q || undefined,
    },
  });
  return res.data.data;
};

export const createPemantauanIndikator = async (payload) => {
  const res = await api.post("/tenaga-kesehatan/pemantauan-indikator", payload);
  return res.data.data;
};

export const updatePemantauanIndikator = async (id, payload) => {
  const res = await api.put(`/tenaga-kesehatan/pemantauan-indikator/${id}`, payload);
  return res.data.data;
};

export const deletePemantauanIndikator = async (id) => {
  await api.delete(`/tenaga-kesehatan/pemantauan-indikator/${id}`);
};