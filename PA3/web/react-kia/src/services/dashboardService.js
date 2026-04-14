import api from "./api";

export const getDashboardData = async () => {
  try {
    // Endpoint ini harus sudah ada di backend (GET /dashboard)
    const response = await api.get("/dashboard");
    return response.data.data;
  } catch (error) {
    console.error("Dashboard API error:", error);
    // Fallback ke mock data jika endpoint belum tersedia
    return {
      stats: { totalIbuHamil: 124, targetIbuHamil: 95, totalAnak: 542, jumlahWilayah: 4, imunisasi: 90.2 },
      wilayah: [
        { dusun: "Dusun Mawar", ibuHamil: 42, anak: 156, risikoTinggi: 12, cakupanImunisasi: 88.5, status: "Risiko Tinggi" },
        { dusun: "Dusun Kenanga", ibuHamil: 35, anak: 124, risikoTinggi: 3, cakupanImunisasi: 96.2, status: "Aman (Low)" },
        { dusun: "Dusun Anggrek", ibuHamil: 28, anak: 98, risikoTinggi: 5, cakupanImunisasi: 91.0, status: "Waspada (Med)" },
        { dusun: "Dusun Kamboja", ibuHamil: 19, anak: 164, risikoTinggi: 8, cakupanImunisasi: 85.4, status: "Risiko Tinggi" },
      ],
      trend: { labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], values: [20, 15, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0] },
      prioritas: [
        { dusun: "Dusun Mawar", kasus: 12, priority: "High" },
        { dusun: "Dusun Kamboja", kasus: 8, priority: "High" },
        { dusun: "Dusun Anggrek", kasus: 5, priority: "Med" },
        { dusun: "Dusun Kenanga", kasus: 3, priority: "Low" },
      ],
    };
  }
};