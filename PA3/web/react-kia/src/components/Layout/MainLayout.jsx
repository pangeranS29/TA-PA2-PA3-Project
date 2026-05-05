// src/components/Layout/MainLayout.jsx
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const labelMap = {
  "dashboard": "Dashboard", "data-ibu": "Data Ibu", "data-anak": "Data Anak",
  "daftar-anak": "Daftar Anak", "pertumbuhan": "Pertumbuhan", "create": "Tambah",
  "edit": "Edit", "detail": "Detail", "kehamilan": "Kehamilan",
  "pemeriksaan-rutin": "Pemeriksaan Rutin", "pemeriksaan-fisik": "Pemeriksaan Fisik",
  "grafik-evaluasi": "Grafik Evaluasi", "grafik-bb": "Grafik BB",
  "rencana-persalinan": "Rencana Persalinan", "pelayanan-nifas": "Pelayanan Nifas",
  "evaluasi-kesehatan": "Evaluasi Kesehatan", "catatan-pelayanan": "Catatan Pelayanan",
  "rujukan": "Rujukan", "pelayanan-persalinan": "Pelayanan Persalinan",
  "skrining-preeklampsia": "Skrining Preeklampsia", "skrining-dashboard": "Skrining",
  "monitoring": "Monitoring", "laporan": "Laporan", "kependudukan": "Kependudukan",
  "edukasi-digital": "Edukasi Digital", "lila": "LILA", "neonatus": "Neonatus",
  "pelayanan-gizi": "Pelayanan Gizi", "pelayanan-vitamin": "Pelayanan Vitamin",
  "pelayanan-imunisasi": "Pelayanan Imunisasi", "pelayanan-gigi": "Pelayanan Gigi",
  "tumbuh-kembang-anak": "Tumbuh Kembang", "pemantauan": "Pemantauan",
  "perkembangan": "Perkembangan", "keluhan": "Keluhan",
  "kesehatan-lingkungan": "Kesehatan Lingkungan", "admin": "Admin",
};

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    if (/^\d+$/.test(seg)) continue;
    const label = labelMap[seg.toLowerCase()] || seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    crumbs.push({ label, path });
  }
  if (crumbs.length === 0) return null;
  return (
    <nav className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 mb-4 flex-wrap">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
        <Home size={12} /><span>Beranda</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <ChevronRight size={11} className="text-gray-300" />
          {i === crumbs.length - 1
            ? <span className="text-gray-600 uppercase tracking-widest">{crumb.label}</span>
            : <Link to={crumb.path} className="hover:text-indigo-600 transition-colors uppercase tracking-widest">{crumb.label}</Link>
          }
        </span>
      ))}
    </nav>
  );
}

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}