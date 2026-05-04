// src/pages/Ibu/IbuList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuDashboard } from "../../services/ibu";
import { 
  Plus, Search, ChevronLeft, ChevronRight, 
  Users, Eye, Edit, Filter, ChevronsLeft, ChevronsRight,
  Activity, AlertTriangle, UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Helper badge status
const statusBadge = (status) => {
  if (status === "TRIMESTER 1") return "bg-blue-100 text-blue-800";
  if (status === "TRIMESTER 2") return "bg-yellow-100 text-yellow-800";
  if (status === "TRIMESTER 3") return "bg-green-100 text-green-800";
  if (status === "NON-AKTIF") return "bg-gray-300 text-gray-700";
  return "bg-gray-100 text-gray-800";
};

// Case-insensitive risk label (mendukung "Tinggi" dari API)
const riskLabel = (risk) => {
  const upperRisk = (risk || "").toUpperCase();
  if (upperRisk === "TINGGI") return { label: "Tinggi", class: "bg-red-100 text-red-800" };
  if (upperRisk === "SEDANG") return { label: "Sedang", class: "bg-orange-100 text-orange-800" };
  if (upperRisk === "RENDAH") return { label: "Rendah", class: "bg-green-100 text-green-800" };
  return { label: "Normal", class: "bg-gray-100 text-gray-800" };
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch data
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

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
  const Breadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Link to="/dashboard" className="hover:text-indigo-600">🏠 Beranda</Link>
      <span>/</span>
      <span className="text-gray-700 font-medium">Data Ibu</span>
    </div>
  );

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
      <div className="p-4 md:p-6">
        <Breadcrumb />

        {/* STATS CARDS - hanya untuk kehamilan aktif */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => {
              setFilterRisiko("");
              setFilterTrimester("");
              setSearch("");
              setShowHistory(false);
            }}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500 text-left hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Users size={18} />
              <span className="text-sm font-medium">IBU HAMIL AKTIF</span>
            </div>
            <p className="text-2xl font-bold">{uniqueIbuAktif}</p>
            <p className="text-xs text-gray-400">{totalAktifRows} kehamilan aktif</p>
          </button>

          <button
            onClick={() => filterByRisiko("TINGGI")}
            className={`bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500 text-left hover:shadow-md transition ${
              filterRisiko === "TINGGI" && !showHistory ? "ring-2 ring-red-300" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">RISIKO TINGGI (AKTIF)</span>
            </div>
            <p className="text-2xl font-bold">{totalRisikoTinggiAktif}</p>
          </button>

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

        {/* SEARCH, FILTERS & TOGGLE */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="pl-10 pr-4 py-2 border rounded-xl w-full focus:ring-2 focus:ring-indigo-300"
              placeholder="Cari Nama Ibu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                className="pl-3 pr-8 py-2 border rounded-xl bg-white appearance-none"
                value={filterRisiko}
                onChange={(e) => setFilterRisiko(e.target.value)}
              >
                <option value="">Semua Risiko</option>
                <option value="TINGGI">Tinggi</option>
                <option value="SEDANG">Sedang</option>
                <option value="RENDAH">Rendah</option>
              </select>
              <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                className="pl-3 pr-8 py-2 border rounded-xl bg-white appearance-none"
                value={filterTrimester}
                onChange={(e) => setFilterTrimester(e.target.value)}
              >
                <option value="">Semua Trimester</option>
                <option value="TRIMESTER 1">Trimester 1</option>
                <option value="TRIMESTER 2">Trimester 2</option>
                <option value="TRIMESTER 3">Trimester 3</option>
              </select>
              <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition ${
                showHistory 
                  ? "bg-gray-200 text-gray-800 border-gray-300" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Activity size={18} />
              {showHistory ? "Sembunyikan Riwayat" : "Tampilkan Riwayat Selesai"}
            </button>

            <Link
              to="/data-ibu/create"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Plus size={18} /> Tambah
            </Link>
          </div>
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
                  <th className="p-3 text-left">Nama</th>
                  <th>Status</th>
                  <th>Risiko</th>
                  <th>Usia Hamil</th>
                  <th>Dusun</th>
                  <th>Skor</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((ibu) => {
                  const risk = riskLabel(ibu.status_risiko);
                  const isActive = ibu.status_kehamilan?.startsWith("TRIMESTER");
                  const displayStatus = ibu.status_kehamilan === "NON-AKTIF" ? "Selesai" : (ibu.status_kehamilan || "-");
                  return (
                    <tr key={`${ibu.id_ibu}-${ibu.kehamilan_id}`} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">
                        {ibu.nama_lengkap}
                        <div className="text-xs text-gray-400">ID: {ibu.id_ibu}</div>
                      </td>
                      <td>
                        <span className={`px-2 py-1 text-xs rounded-full ${statusBadge(ibu.status_kehamilan)}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-1 text-xs rounded-full ${risk.class}`} title={`Skor: ${ibu.skor_risiko}`}>
                          {risk.label}
                        </span>
                      </td>
                      <td>{ibu.usia_kehamilan} Minggu</td>
                      <td>{ibu.dusun || "-"}</td>
                      <td>{ibu.skor_risiko || "-"}</td>
                      <td className="flex gap-2">
                        <Link
                          to={ibu.kehamilan_id ? `/data-ibu/${ibu.id_ibu}?kehamilan_id=${ibu.kehamilan_id}` : '#'}
                          className={`text-blue-600 hover:underline flex items-center gap-1 ${!ibu.kehamilan_id ? 'opacity-50 pointer-events-none' : ''}`}
                          title={ibu.kehamilan_id ? "Detail" : "Tidak ada kehamilan"}
                        >
                          <Eye size={16} /> Detail
                        </Link>
                        {isActive ? (
                          <Link
                            to={`/data-ibu/${ibu.id_ibu}/edit?kehamilan_id=${ibu.kehamilan_id}`}
                            className="text-yellow-600 hover:underline flex items-center gap-1"
                            title="Edit"
                          >
                            <Edit size={16} /> Edit
                          </Link>
                        ) : (
                          <span className="text-gray-400 flex items-center gap-1 cursor-not-allowed" title="Kehamilan selesai, tidak dapat diedit">
                            <Edit size={16} /> Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && displayedData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-sm mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan</span>
              <select
                className="border rounded-lg px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-gray-600">data</span>
            </div>

            <div className="text-sm text-gray-600">
              {startIndex + 1} - {Math.min(startIndex + itemsPerPage, displayedData.length)} dari {displayedData.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1 disabled:opacity-50"
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm">
                Halaman {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1 disabled:opacity-50"
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}