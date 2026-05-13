// src/pages/Ibu/IbuList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuDashboard } from "../../services/ibu";
import { 
  Plus, Search, 
  Users, Eye, Edit, Filter, 
  Activity, AlertTriangle, UserCheck
} from "lucide-react";

// Style guide compliant badge helpers
const trimesterBadge = (status) => {
  if (status === "TRIMESTER 1") return "bg-[#E1F5EE] text-[#085041]";
  if (status === "TRIMESTER 2") return "bg-[#FAEEDA] text-[#633806]";
  if (status === "TRIMESTER 3") return "bg-[#DCFCE7] text-[#3B6D11]";
  if (status === "NON-AKTIF") return "bg-gray-200 text-gray-700";
  return "bg-gray-100 text-gray-800";
};

const riskLabel = (risk) => {
  const upperRisk = (risk || "").toUpperCase();
  if (upperRisk === "TINGGI") return { label: "Tinggi", class: "bg-[#FCEBEB] text-[#791F1F]" };
  if (upperRisk === "SEDANG") return { label: "Sedang", class: "bg-[#FAEEDA] text-[#633806]" };
  if (upperRisk === "RENDAH") return { label: "Rendah", class: "bg-[#E1F5EE] text-[#085041]" };
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
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Data aktif vs riwayat
  const activeOnlyList = useMemo(() => {
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
    // Sort by id_ibu descending (newest first)
    return data.sort((a, b) => (b.id_ibu || 0) - (a.id_ibu || 0));
  }, [ibuList, activeOnlyList, showHistory, debouncedSearch, filterRisiko, filterTrimester]);

  // Statistik
  const totalAktifRows = activeOnlyList.length;
  const uniqueIbuAktif = new Set(activeOnlyList.map(i => i.id_ibu)).size;
  const totalRisikoTinggiAktif = activeOnlyList.filter(i => 
    (i.status_risiko || "").toUpperCase() === "TINGGI"
  ).length;

  // Pagination
  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = displayedData.slice(startIndex, startIndex + itemsPerPage);

  const filterByRisiko = (risiko) => {
    setFilterRisiko(prev => prev === risiko ? "" : risiko);
    setCurrentPage(1);
    setShowHistory(false);
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <Users size={48} className="mx-auto text-gray-300" />
      <p className="mt-2 text-gray-600 text-base">
        {showHistory ? "Tidak ada riwayat kehamilan yang tersedia." : "Tidak ada ibu hamil aktif."}
      </p>
      <button
        onClick={() => {
          setSearch("");
          setFilterRisiko("");
          setFilterTrimester("");
          setShowHistory(false);
        }}
        className="text-[#185FA5] mt-2 hover:underline text-base"
      >
        Reset filter
      </button>
    </div>
  );

  const TableSkeleton = () => (
    <tbody>
      {Array(5).fill(0).map((_, i) => (
        <tr key={i} className="border-t">
          {Array(6).fill(0).map((_, j) => (
            <td key={j} className="p-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <MainLayout>
      <div className="p-4 bg-white min-h-screen">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <button
            onClick={() => {
              setFilterRisiko("");
              setFilterTrimester("");
              setSearch("");
              setShowHistory(false);
            }}
            className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-[#185FA5] text-left hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-[#185FA5] mb-1">
              <Users size={16} />
              <span className="text-sm font-medium">IBU HAMIL AKTIF</span>
            </div>
            <p className="text-xl font-bold text-gray-800">{uniqueIbuAktif}</p>
            <p className="text-xs text-gray-400">{totalAktifRows} kehamilan aktif</p>
          </button>

          <button
            onClick={() => filterByRisiko("TINGGI")}
            className={`bg-white rounded-lg shadow-sm p-3 border-l-4 border-[#A32D2D] text-left hover:shadow-md transition ${
              filterRisiko === "TINGGI" && !showHistory ? "ring-2 ring-[#A32D2D]/30" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-[#A32D2D] mb-1">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">RISIKO TINGGI (AKTIF)</span>
            </div>
            <p className="text-xl font-bold text-gray-800">{totalRisikoTinggiAktif}</p>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-[#3B6D11]">
            <div className="flex items-center gap-2 text-[#3B6D11] mb-1">
              <UserCheck size={16} />
              <span className="text-sm font-medium">STATUS TAMPILAN</span>
            </div>
            <p className="text-base font-semibold text-gray-800">
              {showHistory ? "Riwayat selesai" : "Kehamilan aktif"}
            </p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-5">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg w-full focus:ring-2 focus:ring-[#185FA5] focus:border-[#185FA5] text-sm"
              placeholder="Cari Nama Ibu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: "40px" }}
            />
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end items-center">
            <div className="relative flex-shrink-0">
              <select
                className="pl-3 pr-8 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm"
                value={filterRisiko}
                onChange={(e) => setFilterRisiko(e.target.value)}
              >
                <option value="">Semua Risiko</option>
                <option value="TINGGI">Tinggi</option>
                <option value="SEDANG">Sedang</option>
                <option value="RENDAH">Rendah</option>
              </select>
              <Filter size={12} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-shrink-0">
              <select
                className="pl-3 pr-8 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm"
                value={filterTrimester}
                onChange={(e) => setFilterTrimester(e.target.value)}
              >
                <option value="">Semua Trimester</option>
                <option value="TRIMESTER 1">Trimester 1</option>
                <option value="TRIMESTER 2">Trimester 2</option>
                <option value="TRIMESTER 3">Trimester 3</option>
              </select>
              <Filter size={12} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 rounded-full border border-[#185FA5] text-[#185FA5] bg-transparent flex items-center gap-2 transition text-sm font-medium hover:bg-[#185FA5]/5 whitespace-nowrap"
            >
              <Activity size={14} />
              {showHistory ? "Sembunyikan" : "Riwayat"}
            </button>

            <Link
              to="/data-ibu/create"
              className="bg-[#185FA5] text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#0F4A82] transition text-sm font-semibold whitespace-nowrap"
            >
              <Plus size={16} /> Tambah
            </Link>
          </div>
        </div>

        {/* MAIN TABLE */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Risiko</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Usia Hamil</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Dusun</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <TableSkeleton />
            </table>
          </div>
        ) : paginatedData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-2 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Risiko</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Usia Hamil</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Dusun</th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((ibu) => {
                  const risk = riskLabel(ibu.status_risiko);
                  const isActive = ibu.status_kehamilan?.startsWith("TRIMESTER");
                  const displayStatus = ibu.status_kehamilan === "NON-AKTIF" ? "Selesai" : (ibu.status_kehamilan || "-");
                  return (
                    <tr key={`${ibu.id_ibu}-${ibu.kehamilan_id}`} className="border-t hover:bg-gray-50 transition">
                      <td className="p-2 font-medium text-sm">
                        {ibu.nama_lengkap}
                        <div className="text-xs text-gray-400">ID: {ibu.id_ibu}</div>
                      </td>
                      <td className="p-2 text-center text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full inline-block ${trimesterBadge(ibu.status_kehamilan)}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="p-2 text-center text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full inline-block ${risk.class}`} title={`Skor: ${ibu.skor_risiko}`}>
                          {risk.label}
                        </span>
                      </td>
                      <td className="p-2 text-center text-sm">{ibu.usia_kehamilan} Minggu</td>
                      <td className="p-2 text-center text-sm">{ibu.dusun || "-"}</td>
                      <td className="p-2 text-center">
                        <div className="flex gap-1 justify-center items-center">
                          <button
                            onClick={() => {
                              if (ibu.kehamilan_id) navigate(`/data-ibu/${ibu.id_ibu}?kehamilan_id=${ibu.kehamilan_id}`);
                            }}
                            disabled={!ibu.kehamilan_id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#185FA5] text-[#185FA5] bg-transparent text-xs font-medium hover:bg-[#185FA5]/5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            <Eye size={14} /> Detail
                          </button>
                          {isActive ? (
                            <button
                              onClick={() => navigate(`/data-ibu/${ibu.id_ibu}/edit?kehamilan_id=${ibu.kehamilan_id}`)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#185FA5] text-[#185FA5] bg-transparent text-xs font-medium hover:bg-[#185FA5]/5 whitespace-nowrap"
                            >
                              <Edit size={14} /> Edit
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-400 bg-gray-100 text-xs cursor-not-allowed whitespace-nowrap"
                            >
                              <Edit size={14} /> Selesai
                            </button>
                          )}
                        </div>
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded-lg shadow-sm mt-3">
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-600">Tampilkan</span>
              <select
                className="border border-[#E2E8F0] rounded-lg px-2 py-1 text-base"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-base text-gray-600">data</span>
            </div>

         

            <div className="flex items-center gap-1">
              {/* Generate page numbers */}
              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-[#185FA5] text-white"
                      : "border border-[#E2E8F0] text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}