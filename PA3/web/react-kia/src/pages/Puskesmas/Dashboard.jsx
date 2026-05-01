import React from "react";
import { Baby, CalendarDays, HeartPulse, Syringe } from "lucide-react";
import MainLayout from "../../components/Layout/Puskesmas/MainLayout";

const icons = {
  preg: <HeartPulse size={18} />,
  baby: <Baby size={18} />,
  imm: <Syringe size={18} />,
  sched: <CalendarDays size={18} />,
};
const statCards = [
  {
    label: "Ibu Hamil Aktif",
    value: "45",
    icon: icons.preg,
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
    sub1: { text: "5 Risiko Tinggi", color: "#ef4444", bg: "#fef2f2" },
    sub2: { text: "12 Trimester 3", color: "#f59e0b", bg: "#fffbeb" },
  },
  {
    label: "Balita Terdaftar",
    value: "182",
    icon: icons.baby,
    iconBg: "#f0fdf4",
    iconColor: "#10b981",
    sub1: { text: "8 Perlu Perhatian", color: "#f59e0b", bg: "#fffbeb" },
    sub2: { text: "17% Normal", color: "#10b981", bg: "#f0fdf4" },
  },
  {
    label: "Capaian Imunisasi Dasar",
    value: "78%",
    icon: icons.imm,
    iconBg: "#f0fdf4",
    iconColor: "#10b981",
    sub1: { text: "+5% Bulan ini", color: "#10b981", bg: "#f0fdf4" },
    sub2: { text: "24 Bayi lengkap", color: "#64748b", bg: "#f8fafc" },
  },
  {
    label: "Jadwal Pelayanan",
    value: "12",
    icon: icons.sched,
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
    sub1: { text: "4 Posyandu minggu ini", color: "#3b82f6", bg: "#eff6ff" },
    sub2: { text: "8 Kunjungan rumah", color: "#64748b", bg: "#f8fafc" },
  },
];

function StatCard({ label, value, icon, iconBg, iconColor, sub1, sub2 }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
        <div
          style={{
            width: 32,
            height: 32,
            background: iconBg,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            flexShrink: 0,
          }}
        >
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

export default function DashboardPuskesmas() {
  return (
    <MainLayout>
      <div style={{ background: "#f0f4f8", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 16 }}>
            {statCards.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}