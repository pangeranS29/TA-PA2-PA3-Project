// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { getIbuDashboard } from "../services/ibu";
import { getJadwalLayananList } from "../services/jadwalLayanan";

// Ikon (pakai yang sudah ada, tanpa lucide-react)
const icons = {
  home: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>,
  users: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  growth: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" /></svg>,
  heart: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
  calendar: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  report: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" /></svg>,
  preg: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
  baby: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  imm: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg>,
  sched: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  search: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  sync: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
  warn: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  chevronRight: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" /></svg>,
  ambulance: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13h4v4H5zm6 0h4v4h-4z"/><path d="M18 16h-3v-4h3a2 2 0 012 2v2a2 2 0 01-2 2z"/><path d="M6 16H4a2 2 0 01-2-2v-2a2 2 0 012-2h14"/><path d="M9 12V8a2 2 0 012-2h6a2 2 0 012 2v4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
};

// Helper untuk jadwal (hanya untuk hitung jadwal hari ini)
function getDateKey(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isToday(tanggal) {
  return getDateKey(tanggal) === getTodayKey();
}
function isDone(row) {
  if (!row || !row.tanggal) return false;
  const todayKey = getTodayKey();
  const dateKey = getDateKey(row.tanggal);
  if (!dateKey) return false;
  if (dateKey < todayKey) return true;
  if (dateKey > todayKey) return false;
  // Jika hari ini, cek waktu selesai sederhana (abaikan)
  return false;
}

// Normalisasi risiko
const normalizeRisk = (risk) => {
  const upperRisk = (risk || "").toUpperCase();
  if (upperRisk === "PERLU RUJUKAN" || upperRisk === "TINGGI") return "Tinggi";
  if (upperRisk === "PERLU TINDAKAN" || upperRisk === "SEDANG" || upperRisk === "SEDAMNG") return "Sedang";
  return "Normal";
};
const getFilterFromRisk = (risk) => {
  if (risk === "Tinggi") return "PERLU RUJUKAN";
  if (risk === "Sedang") return "PERLU TINDAKAN";
  return "NORMAL";
};

// Komponen StatCard
function StatCard({ label, value, icon, iconBg, iconColor, sub1, sub2 }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0", cursor: "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</div>
        <div style={{ width: 32, height: 32, background: iconBg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{value}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: sub1.color, background: sub1.bg, padding: "3px 7px", borderRadius: 4 }}>{sub1.text}</span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: sub2.color, background: sub2.bg, padding: "3px 7px", borderRadius: 4 }}>{sub2.text}</span>
      </div>
    </div>
  );
}

// Komponen Bar Chart
function VerticalRiskChart({ data, onBarClick, activeRisk }) {
  const categories = [
    { label: "Risiko Tinggi", key: "Tinggi", color: "#ef4444", filter: "PERLU RUJUKAN" },
    { label: "Risiko Sedang", key: "Sedang", color: "#f59e0b", filter: "PERLU TINDAKAN" },
    { label: "Risiko Rendah / Normal", key: "Normal", color: "#10b981", filter: "NORMAL" }
  ];
  const maxValue = Math.max(data.Tinggi, data.Sedang, data.Normal, 1);
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-end", marginTop: 12, height: 280 }}>
      {categories.map(cat => {
        const value = data[cat.key] || 0;
        const percent = (value / maxValue) * 100;
        const isActive = activeRisk === cat.filter;
        return (
          <div
            key={cat.key}
            onClick={() => onBarClick(cat.filter, cat.label)}
            style={{
              flex: 1,
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s",
              transform: isActive ? "translateY(-4px)" : "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ height: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div
                style={{
                  height: `${percent}%`,
                  minHeight: 8,
                  backgroundColor: cat.color,
                  borderRadius: "6px 6px 0 0",
                  transition: "opacity 0.2s",
                  opacity: isActive ? 1 : 0.85,
                }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: "#1e293b" }}>{cat.label}</div>
            <div style={{ fontSize: 14, fontWeight: "bold", color: cat.color }}>{value}</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>
              {data.total > 0 ? ((value / data.total) * 100).toFixed(0) : 0}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [allIbuData, setAllIbuData] = useState([]);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("PERLU RUJUKAN");
  const [selectedRiskLabel, setSelectedRiskLabel] = useState("Risiko Tinggi");
  const [stats, setStats] = useState({
    total_kehamilan: 0,
    kehamilan_aktif: 0,
    resiko_tinggi: 0,
    resiko_sedang: 0,
    resiko_normal: 0,
    per_dusun: [],
  });
  const [todayScheduleCount, setTodayScheduleCount] = useState(0);

  // Onboarding
  useEffect(() => {
    const hasSeen = localStorage.getItem("dashboard_onboarding_seen");
    if (!hasSeen) {
      setShowOnboarding(true);
      localStorage.setItem("dashboard_onboarding_seen", "true");
    }
  }, []);

  // Ambil data ibu
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getIbuDashboard();
        let rawData = response;
        if (response && response.data && Array.isArray(response.data)) rawData = response.data;
        else if (Array.isArray(response)) rawData = response;
        else throw new Error("Format response tidak sesuai");
        setAllIbuData(rawData);

        const kehamilanList = rawData.filter(item => item.kehamilan_id && item.kehamilan_id !== 0);
        const total_kehamilan = kehamilanList.length;
        const aktifList = kehamilanList.filter(item => item.status_kehamilan?.includes("TRIMESTER"));
        const kehamilan_aktif = aktifList.length;
        const risikoTinggiList = kehamilanList.filter(item => normalizeRisk(item.status_risiko) === "Tinggi");
        const risikoSedangList = kehamilanList.filter(item => normalizeRisk(item.status_risiko) === "Sedang");
        const risikoNormalList = kehamilanList.filter(item => normalizeRisk(item.status_risiko) === "Normal");

        const dusunMap = new Map();
        kehamilanList.forEach(item => {
          const dusun = item.dusun || "Tidak diketahui";
          dusunMap.set(dusun, (dusunMap.get(dusun) || 0) + 1);
        });
        const per_dusun = Array.from(dusunMap.entries()).map(([dusun, jumlah]) => ({ dusun, jumlah }));

        setStats({
          total_kehamilan,
          kehamilan_aktif,
          resiko_tinggi: risikoTinggiList.length,
          resiko_sedang: risikoSedangList.length,
          resiko_normal: risikoNormalList.length,
          per_dusun,
        });
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Ambil jumlah jadwal hari ini (opsional, tidak memblokir)
  useEffect(() => {
    const fetchScheduleCount = async () => {
      try {
        const data = await getJadwalLayananList();
        let rows = [];
        if (Array.isArray(data)) rows = data;
        else if (Array.isArray(data?.data)) rows = data.data;
        else if (Array.isArray(data?.items)) rows = data.items;
        const todayCount = rows.filter(r => isToday(r.tanggal) && !isDone(r)).length;
        setTodayScheduleCount(todayCount);
      } catch (err) {
        console.error("Gagal ambil jadwal:", err);
        // Tetap 0, tidak perlu error
      }
    };
    fetchScheduleCount();
  }, []);

  const getFilteredIbuList = () => {
    if (!allIbuData.length) return [];
    return allIbuData
      .filter(item => {
        if (!item.kehamilan_id || item.kehamilan_id === 0) return false;
        const normalized = normalizeRisk(item.status_risiko);
        const filterValue = getFilterFromRisk(normalized);
        return filterValue === selectedRiskFilter;
      })
      .map(item => ({
        nama: item.nama_lengkap,
        detail: `Dusun ${item.dusun}, usia kehamilan ${item.usia_kehamilan} minggu`,
        kehamilan_id: item.kehamilan_id,
        ibu_id: item.id_ibu,
        isRujukan: (item.status_risiko || "").toUpperCase() === "PERLU RUJUKAN"
      }));
  };

  const filteredIbuList = getFilteredIbuList();

  const handleRiskBarClick = (filterValue, label) => {
    setSelectedRiskFilter(filterValue);
    setSelectedRiskLabel(label);
  };

  const handleRiskClick = (ibuId, kehamilanId) => {
    navigate(`/data-ibu/${ibuId}/pemeriksaan-rutin?kehamilan_id=${kehamilanId}`);
  };

  const handleRujukClick = (e, ibuId, kehamilanId) => {
    e.stopPropagation();
    navigate(`/data-ibu/${ibuId}/rujukan?kehamilan_id=${kehamilanId}`);
  };

  const handleViewAllFiltered = () => {
    navigate(`/data-ibu?risiko=${encodeURIComponent(selectedRiskFilter)}`);
  };

  const handleGoToJadwal = () => {
    navigate("/jadwal-layanan");
  };

  if (loading) return <MainLayout><div style={{ textAlign: "center", padding: 40 }}>Memuat data dashboard...</div></MainLayout>;
  if (error) return <MainLayout><div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>{error}</div></MainLayout>;

  const totalRisiko = stats.resiko_tinggi + stats.resiko_sedang + stats.resiko_normal;

  const statCards = [
    {
      label: "Total Kehamilan",
      value: stats.total_kehamilan,
      icon: icons.preg,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
      sub1: { text: `${stats.kehamilan_aktif} Aktif`, color: "#10b981", bg: "#f0fdf4" },
      sub2: { text: `${stats.total_kehamilan - stats.kehamilan_aktif} Tidak Aktif`, color: "#64748b", bg: "#f8fafc" },
    },
    {
      label: "Kehamilan Aktif",
      value: stats.kehamilan_aktif,
      icon: icons.heart,
      iconBg: "#f0fdf4",
      iconColor: "#10b981",
      sub1: { text: `${stats.resiko_tinggi} Risiko Tinggi`, color: "#ef4444", bg: "#fef2f2" },
      sub2: { text: `${((stats.resiko_tinggi / (stats.kehamilan_aktif || 1)) * 100).toFixed(0)}% dari aktif`, color: "#f59e0b", bg: "#fffbeb" },
    },
    {
      label: "Ibu Risiko Tinggi",
      value: stats.resiko_tinggi,
      icon: icons.warn,
      iconBg: "#fef2f2",
      iconColor: "#ef4444",
      sub1: { text: "Perlu penanganan", color: "#ef4444", bg: "#fef2f2" },
      sub2: { text: "Segera tindak lanjut", color: "#f59e0b", bg: "#fffbeb" },
    },
    {
      label: "Rata-rata per Dusun",
      value: stats.per_dusun.length ? Math.round(stats.total_kehamilan / stats.per_dusun.length) : 0,
      icon: icons.users,
      iconBg: "#f8fafc",
      iconColor: "#64748b",
      sub1: { text: `${stats.per_dusun.length} Dusun aktif`, color: "#3b82f6", bg: "#eff6ff" },
      sub2: { text: "Sebaran merata", color: "#64748b", bg: "#f8fafc" },
    },
  ];

  return (
    <MainLayout>
      <div
        style={{
          background: "#f0f4f8",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {showOnboarding && (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "white",
              border: "1px solid #cbd5e1",
              borderRadius: 12,
              padding: "16px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              zIndex: 50,
              maxWidth: 280,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong>✨ Panduan Singkat</strong>
              <button onClick={() => setShowOnboarding(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>×</button>
            </div>
            <p style={{ fontSize: 13, marginBottom: 8 }}>• Klik batang grafik risiko untuk melihat daftar ibu dengan risiko tersebut di kolom kanan.</p>
            <p style={{ fontSize: 13 }}>• Klik nama ibu untuk detail pemeriksaan, atau tombol Rujuk untuk kasus perlu rujukan.</p>
          </div>
        )}

        <div style={{ padding: "16px 20px" }}>
          {/* Shortcut Card Jadwal Hari Ini */}
          <div
            style={{
              marginBottom: 16,
              background: "linear-gradient(135deg, #185FA5 0%, #2c7cbf 100%)",
              borderRadius: 12,
              color: "white",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 8 }}>
                {icons.calendar}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.9 }}>Jadwal Layanan Hari Ini</div>
                <div style={{ fontSize: 28, fontWeight: "bold" }}>{todayScheduleCount} sesi</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Klik tombol untuk kelola jadwal</div>
              </div>
            </div>
            <button
              onClick={handleGoToJadwal}
              style={{
                background: "white",
                color: "#185FA5",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f4f8"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
            >
              Lihat Jadwal →
            </button>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 16 }}>
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Layout dua kolom */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 12, marginBottom: 12 }}>
            {/* Kiri: Grafik Risiko */}
            <div style={{ background: "#fff", borderRadius: 10, padding: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700 }}>Status Risiko Kehamilan</h2>
              <p style={{ fontSize: 11.5, color: "#64748b", marginBottom: 8 }}>Klik batang untuk menampilkan daftar ibu.</p>
              {totalRisiko > 0 ? (
                <VerticalRiskChart
                  data={{ Tinggi: stats.resiko_tinggi, Sedang: stats.resiko_sedang, Normal: stats.resiko_normal, total: totalRisiko }}
                  onBarClick={handleRiskBarClick}
                  activeRisk={selectedRiskFilter}
                />
              ) : (
                <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>Tidak ada data risiko</div>
              )}
            </div>

            {/* Kanan: Daftar Ibu */}
            <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700 }}>Ibu dengan {selectedRiskLabel}</h2>
                    <span style={{ fontSize: 11, background: "#fef2f2", color: "#ef4444", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{filteredIbuList.length} Ibu</span>
                  </div>
                  <button
                    onClick={handleViewAllFiltered}
                    style={{
                      background: "#3b82f6",
                      border: "none",
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Lihat Detail {icons.chevronRight}
                  </button>
                </div>
                <p style={{ fontSize: 11, marginBottom: 12, fontStyle: "italic", background: "#f8fafc", padding: "6px 10px", borderRadius: 8 }}>
                  💡 Klik nama ibu untuk pemeriksaan. Tombol <strong>Rujuk</strong> untuk kasus perlu rujukan.
                </p>
              </div>
              <div style={{ flex: 1, overflowY: "auto", maxHeight: 250 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filteredIbuList.length > 0 ? (
                    filteredIbuList.map((r, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleRiskClick(r.ibu_id, r.kehamilan_id)}
                        style={{
                          background: "#fff",
                          border: "1px solid #fecaca",
                          borderRadius: 12,
                          padding: "12px 14px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#fef2f2";
                          e.currentTarget.style.borderColor = "#fca5a5";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#fff";
                          e.currentTarget.style.borderColor = "#fecaca";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                          <div style={{ background: "#fee2e2", borderRadius: 8, padding: 8, color: "#ef4444" }}>{icons.warn}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>{r.nama}</div>
                            <div style={{ fontSize: 11, color: "#475569" }}>{r.detail}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {r.isRujukan && (
                            <button
                              onClick={(e) => handleRujukClick(e, r.ibu_id, r.kehamilan_id)}
                              style={{
                                background: "#dc2626",
                                border: "none",
                                borderRadius: 16,
                                padding: "4px 10px",
                                fontSize: 10,
                                fontWeight: "bold",
                                color: "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              {icons.ambulance} Rujuk
                            </button>
                          )}
                          {icons.chevronRight}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: 30, background: "#f8fafc", borderRadius: 12, color: "#94a3b8" }}>
                      Tidak ada ibu dengan {selectedRiskLabel.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Dusun */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflowX: "auto" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700 }}>Kehamilan per Dusun</h2>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "9px 14px", textAlign: "left", fontSize: 11.5 }}>Dusun</th>
                  <th style={{ padding: "9px 14px", textAlign: "left", fontSize: 11.5 }}>Jumlah</th>
                  <th style={{ padding: "9px 14px", textAlign: "left", fontSize: 11.5 }}>Persentase</th>
                </tr>
              </thead>
              <tbody>
                {stats.per_dusun.map((dusun, idx) => {
                  const percent = stats.total_kehamilan ? (dusun.jumlah / stats.total_kehamilan) * 100 : 0;
                  return (
                    <tr key={dusun.dusun} style={{ borderBottom: idx < stats.per_dusun.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <td style={{ padding: "10px 14px", fontSize: 12.5 }}>{dusun.dusun}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 600 }}>{dusun.jumlah}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12.5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 4, height: 6 }}>
                            <div style={{ width: `${percent}%`, background: "#3b82f6", height: 6, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11 }}>{percent.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {stats.per_dusun.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Belum ada data dusun</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
