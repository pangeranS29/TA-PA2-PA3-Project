// src/pages/Ibu/IbuList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuDashboard } from "../../services/ibu";
import { Plus, Search, ChevronLeft, ChevronRight, Download, Printer, BarChart3 } from "lucide-react";

const statusBadge = (status) => {
  if (status === "TRIMESTER 1") return "bg-blue-100 text-blue-800";
  if (status === "TRIMESTER 2") return "bg-yellow-100 text-yellow-800";
  if (status === "TRIMESTER 3") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const riskBadge = (risk) => {
  if (risk === "TINGGI") return "bg-red-100 text-red-800";
  if (risk === "SEDANG") return "bg-orange-100 text-orange-800";
  if (risk === "RENDAH") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

export default function IbuList() {
  const navigate = useNavigate();
  const [ibuList, setIbuList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getIbuDashboard();

        console.log("DASHBOARD DATA:", data);

        // 🔥 FIX UTAMA DI SINI
        setIbuList(data || []);
      } catch (err) {
        console.error(err);
        setIbuList([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = ibuList.filter((ibu) =>
    ibu.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalIbu = ibuList.length;
  const totalHamil = ibuList.length;

  const totalRisikoTinggi = ibuList.filter(
    (i) => i.status_risiko === "TINGGI"
  ).length;

  // Hitung distribusi ibu per dusun
  const dusunDistribution = ibuList.reduce((acc, ibu) => {
    const dusun = ibu.dusun || "Tidak Diketahui";
    acc[dusun] = (acc[dusun] || 0) + 1;
    return acc;
  }, {});

  const dusunData = Object.entries(dusunDistribution).sort((a, b) => b[1] - a[1]);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Daftar Data Ibu</h1>
            <p className="text-gray-500 mt-1">Manajemen data kekahamilam dan kesehatan ibu dalam satu kurasi data terpadu.</p>
          </div>
          <Link
            to="/data-ibu/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
          >
            <Plus size={18} /> Tambah Data Ibu Baru
          </Link>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-2xl shadow-sm p-6 border border-indigo-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">TOTAL IBU</p>
                <p className="text-4xl font-bold text-indigo-900 mt-2">{totalIbu.toLocaleString('id-ID')}</p>
                <p className="text-indigo-500 text-xs mt-1">TERDAFTAR</p>
              </div>
              <div className="bg-indigo-200 rounded-full p-3">
                <span className="text-2xl">👩</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl shadow-sm p-6 border border-green-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">IBU SEDANG HAMIL</p>
                <p className="text-4xl font-bold text-green-900 mt-2">{totalHamil.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-green-200 rounded-full p-3">
                <span className="text-2xl">🤰</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl shadow-sm p-6 border border-red-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">RISIKO TINGGI</p>
                <p className="text-4xl font-bold text-red-900 mt-2">{totalRisikoTinggi.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-red-200 rounded-full p-3">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cari Nama Ibu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Terbaru</option>
            <option>Tertua</option>
            <option>Nama (A-Z)</option>
            <option>Risiko Tertinggi</option>
          </select>

          <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
          </button>

          <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Printer size={18} className="text-gray-600" />
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NAMA IBU</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">STATUS RISIKO</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">USIA</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">STATUS KEHAMILAN</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">KUNJUNGAN TERAKHIR</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">DUSUN</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">STATUS GIZI</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                currentItems.map((ibu, idx) => (
                  <tr 
                    key={ibu.id_ibu} 
                    className="border-t hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/data-ibu/${ibu.id_ibu}?kehamilan_id=${ibu.kehamilan_id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 flex items-center justify-center text-white font-semibold">
                          {ibu.nama_lengkap?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ibu.nama_lengkap}</p>
                          <p className="text-xs text-gray-500">KIA-{String(ibu.id_ibu || idx).padStart(4, "0")}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${riskBadge(ibu.status_risiko)}`}>
                        {ibu.status_risiko || "NORMAL"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-gray-700 font-medium">
                      {ibu.usia || 0} Tahun
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusBadge(ibu.status_kehamilan)}`}>
                        {ibu.status_kehamilan || "TRIMESTER 2"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-gray-700 text-sm">
                      {ibu.kunjungan_terakhir ? new Date(ibu.kunjungan_terakhir).toLocaleDateString("id-ID") : "-"}
                    </td>

                    <td className="px-6 py-4 text-center text-gray-700 font-medium">
                      {ibu.dusun || "-"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full inline-block ${
                        ibu.status_gizi === "BAIK" ? "bg-green-100 text-green-800" :
                        ibu.status_gizi === "KURANG" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {ibu.status_gizi ? ibu.status_gizi : "BAIK"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
            </span>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg font-medium ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 5 && <span className="px-2">...</span>}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* DISTRIBUTION CHART */}
        {dusunData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6">Jumlah Ibu per Dusun</h2>
            <p className="text-sm text-gray-500 mb-6">Distribusi jumlah ibu terdaftar berdasarkan wilayah dusun di puskesmas.</p>
            
            <div className="space-y-4">
              {dusunData.slice(0, 4).map(([dusun, count]) => {
                const maxCount = Math.max(...dusunData.map(d => d[1]));
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={dusun}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 uppercase">{dusun}</span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}