import api from "./api";


export const previewLaporanIbu = async () => {
  const response = await api.get(
    "/tenaga-kesehatan/laporan/ibu/preview"
  );

  return response.data;
};
export const exportLaporanIbu = async () => {
  const response = await api.get(
    "/tenaga-kesehatan/laporan/ibu/export/excel",
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const exportLaporanAnak = async () => {
  const res = await api.get("/tenaga-kesehatan/laporan/anak", {
    responseType: "blob",
  });
  return res.data;
};

export const previewLaporanAnak = async () => {
  const response = await api.get("/tenaga-kesehatan/laporan/anak/preview");
  return response.data;
};