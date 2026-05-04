import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Mapping dari path ke label yang lebih user-friendly
  const breadcrumbLabels = {
    dashboard: "Dashboard",
    "data-ibu": "Data Ibu",
    "data-anak": "Data Anak",
    daftar: "Daftar",
    create: "Tambah Baru",
    edit: "Edit",
    detail: "Detail",
    skrining: "Skrining",
    "skrining-preeklampsia": "Skrining Preeklampsia",
    "skrining-dashboard": "Dashboard Skrining",
    "pemeriksaan-fisik": "Pemeriksaan Fisik",
    "grafik-evaluasi": "Grafik Evaluasi Kehamilan",
    "grafik-bb": "Grafik Peningkatan BB",
    "rencana-persalinan": "Rencana Persalinan",
    "pelayanan-nifas": "Pelayanan Nifas",
    "evaluasi-kesehatan": "Evaluasi Kesehatan Ibu",
    "catatan-pelayanan": "Catatan Pelayanan",
    rujukan: "Rujukan",
    "rujukan-display": "Rujukan",
    "daftar-rujukan": "Daftar Rujukan",
    "daftar-skrining": "Daftar Skrining",
    "pelayanan-persalinan": "Pelayanan Persalinan",
    "pemeriksaan-rutin": "Pemeriksaan Rutin",
    "pemeriksaan-dokter-t1-complete": "Pemeriksaan Dokter T1",
    "pemeriksaan-dokter-t3-complete": "Pemeriksaan Dokter T3",
    form: "Form",
    kependudukan: "Kependudukan",
    "daftar-anak": "Daftar Anak",
    monitoring: "Monitoring",
    laporan: "Laporan",
    dashboard: "Dashboard",
    admin: "Admin",
    "akun-keluarga": "Akun Keluarga",
    "manajemen-keluarga": "Manajemen Keluarga",
    "tenaga-kesehatan": "Tenaga Kesehatan",
    "jadwal-layanan": "Jadwal Layanan",
    neonatus: "Kesehatan Neonatus",
    "pelayanan-gizi": "Pelayanan Gizi Anak",
  };

  // Build breadcrumb items
  const breadcrumbItems = [];

  // Tambah Home
  breadcrumbItems.push({
    label: "Home",
    path: "/dashboard",
    icon: true,
  });

  // Build path incrementally
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += "/" + segment;

    // Skip ID segments (segments that look like IDs)
    if (/^[0-9a-f-]{36}$|^\d+$/.test(segment)) {
      // Untuk ID, gunakan label dari segment sebelumnya jika ada
      if (index > 0) {
        const lastValidLabel = breadcrumbItems[breadcrumbItems.length - 1]?.label;
        if (lastValidLabel && lastValidLabel !== segment) {
          // Jangan tambah item baru untuk ID
          return;
        }
      }
    } else {
      // Ambil label dari mapping atau gunakan segment yang diformat
      const label = breadcrumbLabels[segment] || formatLabel(segment);
      breadcrumbItems.push({
        label,
        path: currentPath,
      });
    }
  });

  // Jangan tampilkan breadcrumb jika hanya ada home
  if (breadcrumbItems.length <= 1 || location.pathname === "/dashboard") {
    return null;
  }

  return (
    <div className="flex items-center gap-2 py-3 px-4 md:px-8 bg-gray-50 border-b border-gray-200 text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}

          {item.icon ? (
            <Link
              to={item.path}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              title="Kembali ke Home"
            >
              <Home className="w-4 h-4" />
              {item.label}
            </Link>
          ) : index === breadcrumbItems.length - 1 ? (
            // Last item (current page) - tidak bisa di-klik
            <span className="text-gray-700 font-medium">{item.label}</span>
          ) : (
            // Middle items - bisa di-klik
            <Link
              to={item.path}
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

// Helper function untuk format label dari path segment
function formatLabel(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default Breadcrumb;
