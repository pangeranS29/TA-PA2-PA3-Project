import api from "./api";

export const previewLaporanIbu = async (bulan, tahun) => {
  let url = "/tenaga-kesehatan/laporan/ibu/preview";
  if (bulan && tahun) {
    url += `?bulan=${bulan}&tahun=${tahun}`;
  }
  const response = await api.get(url);
  return response.data; // asumsikan { data: [...] }
};

export const exportLaporanIbu = async (bulan, tahun) => {
  let url = "/tenaga-kesehatan/laporan/ibu/export/excel";
  if (bulan && tahun) {
    url += `?bulan=${bulan}&tahun=${tahun}`;
  }
  const response = await api.get(url, {
    responseType: "blob",
  });
  return response.data;
};

// Laporan anak (belum diubah)
export const previewLaporanAnak = async () => {
  const response = await api.get("/tenaga-kesehatan/laporan/anak/preview");
  return response.data;
};

export const exportLaporanAnak = async () => {
  const res = await api.get("/tenaga-kesehatan/laporan/anak", {
    responseType: "blob",
  });
  return res.data;
};