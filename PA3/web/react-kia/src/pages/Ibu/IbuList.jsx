// src/pages/Ibu/IbuList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuDashboard } from "../../services/ibu";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

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

  return (
    <MainLayout>
      <div className="p-6">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
            <p className="text-gray-500 text-sm">TOTAL IBU</p>
            <p className="text-2xl font-bold">{totalIbu}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">IBU HAMIL</p>
            <p className="text-2xl font-bold">{totalHamil}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
            <p className="text-gray-500 text-sm">RESIKO TINGGI</p>
            <p className="text-2xl font-bold">{totalRisikoTinggi}</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="pl-10 pr-4 py-2 border rounded-xl w-full"
              placeholder="Cari Nama Ibu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link
            to="/data-ibu/create"
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Tambah
          </Link>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                currentItems.map((ibu) => (
                  <tr key={ibu.id_ibu} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {ibu.nama_lengkap}
                      <div className="text-xs text-gray-400">
                        ID: {ibu.id_ibu}
                      </div>
                    </td>

                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusBadge(ibu.status_kehamilan)}`}>
                        {ibu.status_kehamilan}
                      </span>
                    </td>

                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full ${riskBadge(ibu.status_risiko)}`}>
                        {ibu.status_risiko || "NORMAL"}
                      </span>
                    </td>

                    <td>{ibu.usia_kehamilan} Minggu</td>
                    <td>{ibu.dusun}</td>
                    <td>{ibu.skor_risiko}</td>

                    <td className="flex gap-2">
                      {/* <Link
                        to={`/data-ibu/${ibu.id_ibu}`}
                        className="text-blue-600"
                      > */}
                      <Link to={`/data-ibu/${ibu.id_ibu}?kehamilan_id=${ibu.kehamilan_id}`}>
                        Detail
                      </Link>
                      <Link
                        to={`/data-ibu/${ibu.id_ibu}/edit`}
                        className="text-yellow-600"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between p-4 border-t">
            <span>
              {currentItems.length} dari {filtered.length}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft />
              </button>

              <span>{currentPage} / {totalPages || 1}</span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}