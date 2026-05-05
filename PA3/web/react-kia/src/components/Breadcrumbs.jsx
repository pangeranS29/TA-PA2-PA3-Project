import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

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

const toLabel = (seg) => {
  if (/^\d+$/.test(seg)) return null;
  return labelMap[seg.toLowerCase()] || seg.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = toLabel(seg);
    if (label) crumbs.push({ label, path });
  }
  if (crumbs.length === 0) return null;
  return (
    <nav className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 mb-4 flex-wrap">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
        <Home size={12} /><span>Beranda</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight size={11} className="text-gray-300" />
          {i === crumbs.length - 1
            ? <span className="text-gray-600 uppercase tracking-widest">{crumb.label}</span>
            : <Link to={crumb.path} className="hover:text-indigo-600 transition-colors uppercase tracking-widest">{crumb.label}</Link>
          }
        </React.Fragment>
      ))}
    </nav>
  );
}
