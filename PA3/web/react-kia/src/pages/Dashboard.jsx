// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { getIbuDashboard } from "../services/ibu"; // sesuaikan path

// Ikon (sama seperti sebelumnya)
const icons = {
  home: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>,
  users: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  growth: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" /></svg>,
  heart: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
  calendar: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  report: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" /></svg>,
  preg: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
  baby: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  imm: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg>,
  sched: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  search: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  sync: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
  warn: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
};

function StatCard({ label, value, icon, iconBg, iconColor, sub1, sub2 }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
        <div style={{ width: 32, height: 32, background: iconBg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{value}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: sub1.color, background: sub1.bg, padding: "3px 7px", borderRadius: 4 }}>{sub1.text}</span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: sub2.color, background: sub2.bg, padding: "3px 7px", borderRadius: 4 }}>{sub2.text}</span>
      </div>
    </div>
  );
}

// Grafik batang sederhana untuk status wilayah (berdasarkan risiko)
function StatusChart({ data, total }) {
  const colors = ["#ef4444", "#f59e0b", "#10b981"]; // Tinggi, Sedang, Rendah
  return (
    <div style={{ marginTop: 12 }}>
      {data.map((item, idx) => {
        const percent = total > 0 ? (item.jumlah / total) * 100 : 0;
        return (
          <div key={item.status} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>{item.status}</span>
              <span>{item.jumlah} ({percent.toFixed(1)}%)</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 4, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${percent}%`, background: colors[idx % colors.length], height: "100%", borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Fungsi untuk memproses data dari API
const processDashboardData = (rawData) => {
  // rawData adalah array dari response.data
  const kehamilanList = rawData.filter(item => item.kehamilan_id && item.kehamilan_id !== 0); // abaikan yang tidak valid
  
  const total_kehamilan = kehamilanList.length;
  
  // Kehamilan aktif: status_kehamilan mengandung "TRIMESTER"
  const aktifList = kehamilanList.filter(item => item.status_kehamilan && item.status_kehamilan.includes("TRIMESTER"));
  const kehamilan_aktif = aktifList.length;
  
  // Risiko tinggi: status_risiko === "Tinggi" (case sensitive)
  const risikoTinggiList = kehamilanList.filter(item => item.status_risiko === "Tinggi");
  const resiko_tinggi = risikoTinggiList.length;
  
  // Per dusun: hitung semua kehamilan (atau bisa hanya aktif? pilih semua kehamilan)
  const dusunMap = new Map();
  kehamilanList.forEach(item => {
    const dusun = item.dusun || "Tidak diketahui";
    dusunMap.set(dusun, (dusunMap.get(dusun) || 0) + 1);
  });
  const per_dusun = Array.from(dusunMap.entries()).map(([dusun, jumlah]) => ({ dusun, jumlah }));
  
  // Status wilayah berdasarkan level risiko: Tinggi, Sedang, Lainnya (kosong atau tidak berisiko)
  const tingkatRisiko = { "Tinggi": 0, "Sedang": 0, "Lainnya": 0 };
  kehamilanList.forEach(item => {
    const risiko = item.status_risiko;
    if (risiko === "Tinggi") tingkatRisiko.Tinggi++;
    else if (risiko === "Sedang" || risiko === "Sedamng") tingkatRisiko.Sedang++; // typo "Sedamng"
    else tingkatRisiko.Lainnya++;
  });
  const status_wilayah = [
    { status: "Risiko Tinggi", jumlah: tingkatRisiko.Tinggi },
    { status: "Risiko Sedang", jumlah: tingkatRisiko.Sedang },
    { status: "Risiko Rendah / Normal", jumlah: tingkatRisiko.Lainnya },
  ].filter(s => s.jumlah > 0);
  
  // Daftar ibu risiko tinggi (data per kehamilan)
  const daftar_resiko = risikoTinggiList.map(item => ({
    nama: item.nama_lengkap,
    detail: `Dusun ${item.dusun}, usia kehamilan ${item.usia_kehamilan} minggu, status: ${item.status_kehamilan || "tidak aktif"}`,
  }));
  
  return {
    total_kehamilan,
    kehamilan_aktif,
    resiko_tinggi,
    per_dusun,
    status_wilayah,
    daftar_resiko,
  };
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    total_kehamilan: 0,
    kehamilan_aktif: 0,
    resiko_tinggi: 0,
    per_dusun: [],
    status_wilayah: [],
    daftar_resiko: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getIbuDashboard(); // asumsikan ini mengembalikan { status_code, message, data: [...] }
        // Jika getIbuDashboard langsung mengembalikan data array, sesuaikan.
        // Berdasarkan contoh, response mungkin { status_code, data }.
        // Kita perlu akses response.data jika response berbentuk object.
        let rawData = response;
        if (response && response.data && Array.isArray(response.data)) {
          rawData = response.data;
        } else if (Array.isArray(response)) {
          rawData = response;
        } else {
          throw new Error("Format response tidak sesuai");
        }
        const processed = processDashboardData(rawData);
        setData(processed);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data dashboard. Periksa koneksi atau format data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: "center", padding: 40 }}>Memuat data dashboard...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>{error}</div>
      </MainLayout>
    );
  }

  // Statcards dinamis
  const statCards = [
    {
      label: "Total Kehamilan",
      value: data.total_kehamilan,
      icon: icons.preg,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
      sub1: { text: `${data.kehamilan_aktif} Aktif`, color: "#10b981", bg: "#f0fdf4" },
      sub2: { text: `${data.total_kehamilan - data.kehamilan_aktif} Tidak Aktif`, color: "#64748b", bg: "#f8fafc" },
    },
    {
      label: "Kehamilan Aktif",
      value: data.kehamilan_aktif,
      icon: icons.heart,
      iconBg: "#f0fdf4",
      iconColor: "#10b981",
      sub1: { text: `${data.resiko_tinggi} Risiko Tinggi`, color: "#ef4444", bg: "#fef2f2" },
      sub2: { text: `${((data.resiko_tinggi / (data.kehamilan_aktif || 1)) * 100).toFixed(0)}% dari aktif`, color: "#f59e0b", bg: "#fffbeb" },
    },
    {
      label: "Ibu Risiko Tinggi",
      value: data.resiko_tinggi,
      icon: icons.warn,
      iconBg: "#fef2f2",
      iconColor: "#ef4444",
      sub1: { text: "Perlu penanganan", color: "#ef4444", bg: "#fef2f2" },
      sub2: { text: "Segera tindak lanjut", color: "#f59e0b", bg: "#fffbeb" },
    },
    {
      label: "Rata-rata per Dusun",
      value: data.per_dusun.length ? Math.round(data.total_kehamilan / data.per_dusun.length) : 0,
      icon: icons.users,
      iconBg: "#f8fafc",
      iconColor: "#64748b",
      sub1: { text: `${data.per_dusun.length} Dusun aktif`, color: "#3b82f6", bg: "#eff6ff" },
      sub2: { text: "Sebaran merata", color: "#64748b", bg: "#f8fafc" },
    },
  ];

  const totalStatus = data.status_wilayah.reduce((sum, s) => sum + s.jumlah, 0);

  return (
    <MainLayout>
      <div style={{ background: "#f0f4f8", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px" }}>
          
          {/* 4 Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 16 }}>
            {statCards.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Dua kolom: grafik status wilayah + tabel per dusun (kiri) dan daftar risiko (kanan) */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-3">
            {/* Kolom Kiri */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 12 }}>
              {/* Grafik Status Wilayah */}
              <div style={{ background: "#fff", borderRadius: 10, padding: "16px", border: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Status Risiko Kehamilan</h2>
                <p style={{ fontSize: 11.5, color: "#64748b", marginTop: 2, marginBottom: 12 }}>
                  Distribusi berdasarkan tingkat risiko.
                </p>
                {data.status_wilayah.length > 0 ? (
                  <StatusChart data={data.status_wilayah} total={totalStatus} />
                ) : (
                  <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>Tidak ada data risiko</div>
                )}
              </div>

              {/* Tabel Kehamilan per Dusun */}
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflowX: "auto" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0" }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Kehamilan per Dusun</h2>
                  <p style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                    Jumlah seluruh kehamilan di setiap dusun.
                  </p>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ padding: "9px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>Dusun</th>
                      <th style={{ padding: "9px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>Jumlah Kehamilan</th>
                      <th style={{ padding: "9px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.per_dusun.map((dusun, idx) => {
                      const percent = data.total_kehamilan > 0 ? ((dusun.jumlah / data.total_kehamilan) * 100).toFixed(1) : 0;
                      return (
                        <tr key={dusun.dusun} style={{ borderBottom: idx < data.per_dusun.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                          <td style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 500, color: "#0f172a" }}>{dusun.dusun}</td>
                          <td style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{dusun.jumlah}</td>
                          <td style={{ padding: "10px 14px", fontSize: 12.5, color: "#475569" }}>{percent}%</td>
                        </tr>
                      );
                    })}
                    {data.per_dusun.length === 0 && (
                      <tr><td colSpan="3" style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Belum ada data dusun</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kolom Kanan: Daftar Ibu Risiko Tinggi */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Ibu dengan Risiko Tinggi</h2>
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 2, marginBottom: 12 }}>
                  Kehamilan yang memerlukan perhatian segera.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.daftar_resiko.length > 0 ? (
                    data.daftar_resiko.map((r, idx) => (
                      <div key={idx} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <div style={{ color: "#ef4444", marginTop: 1, flexShrink: 0 }}>{icons.warn}</div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{r.nama}</div>
                            <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>{r.detail}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>Tidak ada ibu dengan risiko tinggi</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}