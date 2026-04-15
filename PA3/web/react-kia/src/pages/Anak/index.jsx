import React, { useState, useEffect } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { Link } from "react-router-dom";
import { getAnak, deleteAnak } from "../../services/Anak";
import {
  Plus, Search, Pencil, Trash2, ChevronRight,
  Baby
} from "lucide-react";

export default function AnakListNakes() {
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getAnak();

        console.log("DATA ANAK API:", res);

        setChildren(res.data || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // DELETE DATA
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;

    try {
      await deleteAnak(id);

      setChildren((prev) =>
        prev.filter((item) => item.id !== id)
      );

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // =========================
  // FORMAT TANGGAL
  // =========================
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <MainLayout>

      {/* BREADCRUMB */}
      <nav className="flex items-center text-sm text-gray-500 mb-6 gap-2">
        <Link to="/dashboard" className="hover:text-indigo-600">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-indigo-800 uppercase">
          Rekam Medis Anak
        </span>
      </nav>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
          <Baby className="text-indigo-600" size={28} />
          <div>
            <p className="text-xs text-gray-400">Total Anak</p>
            <p className="text-2xl font-bold">{children.length}</p>
          </div>
        </div>
      </div>

      {/* CONTAINER */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {/* SEARCH + BUTTON */}
        <div className="p-6 flex justify-between gap-4">
          <input
            type="text"
            placeholder="Cari nama anak / ibu..."
            className="border px-3 py-2 rounded w-full max-w-md"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            to="/data-anak/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <Plus size={16} /> Tambah
          </Link>
        </div>

        {/* TABLE */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th>No</th>
              <th>Nama</th>
              <th>Jenis Kelamin</th>
              <th>Ibu</th>
              <th>Umur</th>
              <th>Tanggal Lahir</th>
              <th>Berat</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-5">
                  Loading...
                </td>
              </tr>
            ) : children.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-5">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              children
                .filter((c) =>
                  c.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.kehamilan?.ibu?.nama_ibu
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((child, index) => (
                  <tr key={child.id} className="border-b">

                    <td className="px-3 py-2">{index + 1}</td>

                    <td className="px-3 py-2 font-semibold">
                      {child.nama}
                    </td>

                    <td className="px-3 py-2">
                      {child.jenis_kelamin || "-"}
                    </td>

                    <td className="px-3 py-2">
                      {child.kehamilan?.ibu?.nama_ibu || "-"}
                    </td>

                    <td className="px-3 py-2">
                      {child.usia_teks || "-"}
                    </td>

                    <td className="px-3 py-2">
                      {formatDate(child.tanggal_lahir)}
                    </td>

                    <td className="px-3 py-2">
                      {child.berat_lahir_kg
                        ? `${child.berat_lahir_kg} kg`
                        : "-"}
                    </td>

                    <td className="px-3 py-2 flex gap-2">
                      <Link to={`/data-anak/edit/${child.id}`}>
                        <Pencil size={16} />
                      </Link>

                      <button onClick={() => handleDelete(child.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>

                  </tr>
                ))
            )}
          </tbody>
        </table>

      </div>
    </MainLayout>
  );
}