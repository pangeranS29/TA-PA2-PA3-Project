import api from "./api";
import { getIbuById } from "./ibu";
import { getKehamilanByIbuId } from "./kehamilan";
import { getEvaluasiByKehamilanId } from "./evaluasiKesehatan";
import { getPemeriksaanKehamilanByKehamilanId, getGrafikehamilanByKehamilanId } from "./pemeriksaanKehamilan";
import { getKependudukanById } from "./kependudukan";
import { getLingkunganHistory } from "./kesehatanLingkungan";

/**
 * Fetch semua data laporan untuk satu ibu hamil
 * termasuk: data ibu, data ayah, data kesehatan, dan data ANC rutin
 */
export const getLaporanLengkapByIbuId = async (ibuId, kehamilanId) => {
  try {
    // Fetch data ibu
    const ibuData = await getIbuById(ibuId);

    // Fetch data kehamilan
    let kehamilanData = null;
    if (kehamilanId) {
      kehamilanData = await api.get(`/tenaga-kesehatan/kehamilan/${kehamilanId}`).then(res => res.data.data);
    }

    // Fetch data ayah/suami dari kependudukan
    let ayahData = null;
    if (ibuData?.id_penduduk_ibu) {
      try {
        // Coba fetch data keluarga dari kependudukan
        const pendudukResponse = await api.get(`/tenaga-kesehatan/kependudukan/${ibuData.id_penduduk_ibu}`);
        ayahData = pendudukResponse.data.data;
      } catch (err) {
        console.warn("Data ayah tidak ditemukan");
      }
    }

    // Fetch data kesehatan ibu (evaluasi kesehatan)
    let evaluasiKesehatan = null;
    if (kehamilanId) {
      try {
        evaluasiKesehatan = await getEvaluasiByKehamilanId(kehamilanId);
      } catch (err) {
        console.warn("Data evaluasi kesehatan tidak ditemukan");
      }
    }

    // Fetch data pemeriksaan kehamilan (ANC rutin)
    let pemeriksaanKehamilan = [];
    let grafikData = null;
    if (kehamilanId) {
      try {
        pemeriksaanKehamilan = await getPemeriksaanKehamilanByKehamilanId(kehamilanId);
        grafikData = await getGrafikehamilanByKehamilanId(kehamilanId);
      } catch (err) {
        console.warn("Data pemeriksaan kehamilan tidak ditemukan");
      }
    }

    // Fetch data lingkungan
    let lingkunganData = null;
    if (ibuId) {
      try {
        lingkunganData = await getLingkunganHistory(ibuId);
      } catch (err) {
        console.warn("Data lingkungan tidak ditemukan");
      }
    }

    return {
      ibuData,
      kehamilanData,
      ayahData,
      evaluasiKesehatan,
      pemeriksaanKehamilan,
      grafikData,
      lingkunganData,
    };
  } catch (error) {
    console.error("Error fetching laporan lengkap:", error);
    throw error;
  }
};

/**
 * Fetch data laporan untuk semua ibu hamil (untuk print semua)
 */
export const getLaporanSemuaIbu = async () => {
  try {
    const response = await api.get("/tenaga-kesehatan/ibu");
    const ibuList = response.data.data || [];

    // Fetch detail untuk setiap ibu
    const laporanList = await Promise.all(
      ibuList.map(async (ibu) => {
        try {
          const kehamilan = await getKehamilanByIbuId(ibu.id_ibu);
          const kehamilanAktif = kehamilan?.find(
            (k) => k.status_kehamilan?.startsWith("TRIMESTER") || k.status_kehamilan === "NIFAS"
          );

          if (kehamilanAktif) {
            const laporan = await getLaporanLengkapByIbuId(ibu.id_ibu, kehamilanAktif.kehamilan_id);
            return laporan;
          }
          return null;
        } catch (err) {
          console.warn(`Error fetching laporan untuk ibu ${ibu.id_ibu}:`, err);
          return null;
        }
      })
    );

    return laporanList.filter((l) => l !== null);
  } catch (error) {
    console.error("Error fetching laporan semua ibu:", error);
    throw error;
  }
};
