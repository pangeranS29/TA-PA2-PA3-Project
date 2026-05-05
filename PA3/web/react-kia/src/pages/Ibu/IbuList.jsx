// src/pages/Ibu/IbuList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import Breadcrumbs from "../../components/Breadcrumbs";
import { getIbuList } from "../../services/ibu";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const statusBadge = (status) => {
  if (status === "TRIMESTER 1") return "bg-blue-100 text-blue-800";
  if (status === "TRIMESTER 2") return "bg-yellow-100 text-yellow-800";
  if (status === "TRIMESTER 3") return "bg-green-100 text-green-800";
  if (status === "NON-AKTIF") return "bg-gray-300 text-gray-700";
  return "bg-gray-100 text-gray-800";
};

const riskBadge = (risk) => {
  if (risk === "TINGGI") return "bg-red-100 text-red-800";
  if (risk === "SEDANG") return "bg-orange-100 text-orange-800";
  return "bg-green-100 text-green-800";
};

const hitungUsia = (tanggalLahir) => {
  if (!tanggalLahir) return "-";
  const today = new Date();
  const birth = new Date(tanggalLahir);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export default function IbuList() {
  const navigate = useNavigate();
  const [ibuList, setIbuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterRisiko, setFilterRisiko] = useState("");
  const [filterTrimester, setFilterTrimester] = useState("");
  const [showHistory, setShowHistory] = useState(false); // toggle riwayat NON-AKTIF
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi layar mobile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIbuDashboard();
        setIbuList(data || []);
      } catch (err) {
        console.error(err);
        setIbuList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = ibuList.filter((ibu) =>
    ibu.kependudukan?.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
  );
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page saat filter/search/toggle berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterRisiko, filterTrimester, showHistory]);

  // ========== DATA AKTIF vs SEMUA (RIWAYAT) ==========
  const activeOnlyList = useMemo(() => {
    // Kehamilan aktif: status dimulai dengan "TRIMESTER"
    return ibuList.filter(ibu => ibu.status_kehamilan?.startsWith("TRIMESTER"));
  }, [ibuList]);

  const displayedData = useMemo(() => {
    let data = showHistory ? ibuList : activeOnlyList;

    if (debouncedSearch) {
      data = data.filter(ibu =>
        ibu.nama_lengkap?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (filterRisiko) {
      data = data.filter(ibu => 
        (ibu.status_risiko || "").toUpperCase() === filterRisiko.toUpperCase()
      );
    }
    if (filterTrimester) {
      data = data.filter(ibu => ibu.status_kehamilan === filterTrimester);
    }
    return data;
  }, [ibuList, activeOnlyList, showHistory, debouncedSearch, filterRisiko, filterTrimester]);

  // ========== STATISTIK (hanya kehamilan aktif) ==========
  const totalAktifRows = activeOnlyList.length;
  const uniqueIbuAktif = new Set(activeOnlyList.map(i => i.id_ibu)).size;
  const totalRisikoTinggiAktif = activeOnlyList.filter(i => 
    (i.status_risiko || "").toUpperCase() === "TINGGI"
  ).length;

  // Pagination
  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = displayedData.slice(startIndex, startIndex + itemsPerPage);

  // Filter cepat dari card (hanya untuk risiko tinggi)
  const filterByRisiko = (risiko) => {
    setFilterRisiko(prev => prev === risiko ? "" : risiko);
    setCurrentPage(1);
    // Saat filter risiko, kita tetap di mode aktif (tidak otomatis menampilkan riwayat)
    setShowHistory(false);
  };

  // Breadcrumb
  // const Breadcrumb = () => (
  //   <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
  //     <Link to="/dashboard" className="hover:text-indigo-600">🏠 Beranda</Link>
  //     <span>/</span>
  //     <span className="text-gray-700 font-medium">Data Ibu</span>
  //   </div>
  // );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12">
      <Users size={48} className="mx-auto text-gray-300" />
      <p className="mt-2 text-gray-500">
        {showHistory ? "Tidak ada riwayat kehamilan yang tersedia." : "Tidak ada ibu hamil aktif."}
      </p>
      <button
        onClick={() => {
          setSearch("");
          setFilterRisiko("");
          setFilterTrimester("");
          setShowHistory(false);
        }}
        className="text-indigo-600 mt-2 hover:underline"
      >
        Reset filter
      </button>
    </div>
  );

  // Skeleton loading
  const TableSkeleton = () => (
    <>
      {Array(5).fill(0).map((_, i) => (
        <tr key={i} className="border-t">
          {Array(7).fill(0).map((_, j) => (
            <td key={j} className="p-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  // Komponen kartu untuk mobile
  const IbuCard = ({ ibu }) => {
    const risk = riskLabel(ibu.status_risiko);
    const isActive = ibu.status_kehamilan?.startsWith("TRIMESTER");
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{ibu.nama_lengkap}</h3>
            <p className="text-xs text-gray-400">ID: {ibu.id_ibu}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={ibu.kehamilan_id ? `/data-ibu/${ibu.id_ibu}?kehamilan_id=${ibu.kehamilan_id}` : '#'}
              className={`text-blue-600 hover:bg-blue-50 p-1 rounded ${!ibu.kehamilan_id ? 'opacity-50 pointer-events-none' : ''}`}
              title={ibu.kehamilan_id ? "Detail" : "Tidak ada kehamilan"}
            >
              <Eye size={18} />
            </Link>
            {isActive ? (
              <Link
                to={`/data-ibu/${ibu.id_ibu}/edit?kehamilan_id=${ibu.kehamilan_id}`}
                className="text-yellow-600 hover:bg-yellow-50 p-1 rounded"
                title="Edit"
              >
                <Edit size={18} />
              </Link>
            ) : (
              <span className="text-gray-300 p-1" title="Kehamilan selesai, tidak dapat diedit">
                <Edit size={18} />
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${statusBadge(ibu.status_kehamilan)}`}>
            {ibu.status_kehamilan === "NON-AKTIF" ? "Selesai" : (ibu.status_kehamilan || "-")}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${risk.class}`} title={`Skor risiko: ${ibu.skor_risiko}`}>
            Risiko {risk.label}
          </span>
          <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">
            {ibu.usia_kehamilan} minggu
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          <span>Dusun: {ibu.dusun || "-"}</span>
          {ibu.skor_risiko > 0 && <span className="ml-2">Skor: {ibu.skor_risiko}</span>}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <Breadcrumbs />
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
            <p className="text-gray-500 text-sm">TOTAL IBU TERDAFTAR</p>
            <p className="text-2xl font-bold">{totalIbu.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <UserCheck size={18} />
              <span className="text-sm font-medium">STATUS TAMPILAN</span>
            </div>
            <p className="text-lg font-semibold">
              {showHistory ? "Riwayat selesai" : "Kehamilan aktif"}
            </p>
          </div>
        </div>

        {/* Search & Add Button */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari Nama Ibu..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/data-ibu/create" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-bold">
            <Plus size={20} /> Tambah Data Ibu Baru
          </Link>
        </div>

        {/* MAIN CONTENT */}
        {loading ? (
          isMobile ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl p-4 space-y-3 animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/2"></div><div className="h-4 bg-gray-200 rounded w-1/3"></div><div className="flex gap-2"><div className="h-5 w-16 bg-gray-200 rounded-full"></div><div className="h-5 w-16 bg-gray-200 rounded-full"></div></div></div>)}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr><th className="p-3 text-left">Nama</th><th>Status</th><th>Risiko</th><th>Usia Hamil</th><th>Dusun</th><th>Skor</th><th>Aksi</th></tr>
                </thead>
                <tbody><TableSkeleton /></tbody>
              </table>
            </div>
          )
        ) : paginatedData.length === 0 ? (
          <EmptyState />
        ) : isMobile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedData.map(ibu => <IbuCard key={`${ibu.id_ibu}-${ibu.kehamilan_id}`} ibu={ibu} />)}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Ibu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resiko</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kehamilan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dusun</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((ibu) => (
                  <tr key={ibu.id_ibu} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{ibu.kependudukan?.nama_lengkap || "-"}</div>
                      <div className="text-xs text-gray-500">ID: {ibu.id_ibu}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusBadge(ibu.status_kehamilan)}`}>
                        {ibu.status_kehamilan || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${riskBadge(ibu.risiko_tinggi ? "TINGGI" : "RENDAH")}`}>
                        {ibu.risiko_tinggi ? "TINGGI" : "RENDAH"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {ibu.kependudukan?.tanggal_lahir ? hitungUsia(ibu.kependudukan.tanggal_lahir) + " Tahun" : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">{ibu.status_kehamilan || "-"}</td>
                    <td className="px-6 py-4 text-sm">{ibu.kependudukan?.dusun || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/data-ibu/${ibu.id_ibu}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-2">Detail</Link>
                      <Link to={`/data-ibu/${ibu.id_ibu}/edit`} className="text-amber-600 hover:text-amber-800 text-sm font-medium">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">Menampilkan {paginatedData.length} dari {displayedData.length} data</span>
            <div className="flex gap-2 items-center">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 text-sm">Halaman {currentPage} dari {totalPages || 1}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
      </div>
    </MainLayout>
  );
}