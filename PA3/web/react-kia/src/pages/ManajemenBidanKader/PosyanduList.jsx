// src/pages/ManajemenBidanKader/PosyanduList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { 
  listPosyanduBidan, 
  createPosyanduBidan, 
  updatePosyanduBidan,
  adminTenagaErrorMessage 
} from "../../services/adminTenagaKesehatan";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  Edit,
  Trash2,
  AlertCircle,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";

export default function PosyanduList() {
  const navigate = useNavigate();
  const [posyanduList, setPosyanduList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPosyandu, setSelectedPosyandu] = useState(null);
  const [formData, setFormData] = useState({ 
    id_puskesmas: "", 
    nama: "", 
    alamat: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await listPosyanduBidan({ search: debouncedSearch });
        console.log("Posyandu data:", data);
        setPosyanduList(data || []);
      } catch (err) {
        console.error(err);
        setError(adminTenagaErrorMessage(err, "Gagal memuat data posyandu"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Pagination
  const totalPages = Math.ceil(posyanduList.length / itemsPerPage);
  const paginatedData = posyanduList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({ id_puskesmas: "", nama: "", alamat: "" });
    setFormError("");
  };

  const handleEditClick = (posyandu) => {
    setSelectedPosyandu(posyandu);
    setFormData({
      id_puskesmas: posyandu.id_puskesmas || "",
      nama: posyandu.nama || "",
      alamat: posyandu.alamat || "",
    });
    setShowEditModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_puskesmas || !formData.nama) {
      setFormError("Puskesmas ID dan Nama harus diisi");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      await createPosyanduBidan({
        id_puskesmas: parseInt(formData.id_puskesmas),
        nama: formData.nama,
        alamat: formData.alamat,
      });
      setShowCreateModal(false);
      resetForm();
      const data = await listPosyanduBidan({ search: debouncedSearch });
      setPosyanduList(data || []);
    } catch (err) {
      setFormError(adminTenagaErrorMessage(err, "Gagal membuat posyandu"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama) {
      setFormError("Nama posyandu harus diisi");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      await updatePosyanduBidan(selectedPosyandu.id, {
        nama: formData.nama,
        alamat: formData.alamat,
      });
      setShowEditModal(false);
      resetForm();
      const data = await listPosyanduBidan({ search: debouncedSearch });
      setPosyanduList(data || []);
    } catch (err) {
      setFormError(adminTenagaErrorMessage(err, "Gagal mengupdate posyandu"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk mendapatkan nama puskesmas (jika ada relasi)
  const getNamaPuskesmas = (posyandu) => {
    if (posyandu.puskesmas?.nama) return posyandu.puskesmas.nama;
    if (posyandu.nama_puskesmas) return posyandu.nama_puskesmas;
    return posyandu.id_puskesmas || "-";
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Kelola Posyandu</h1>
            <p className="text-slate-500 mt-1">Manajemen data posyandu di wilayah kerja</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Buat Posyandu
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama posyandu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="text-red-600 mt-1" size={20} />
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : posyanduList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Tidak ada data posyandu</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Nama Posyandu</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Puskesmas</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Alamat</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Dibuat</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((posyandu) => (
                    <tr key={posyandu.id} className="border-b border-gray-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Building2 size={20} className="text-blue-600" />
                          <span className="font-medium text-slate-800">{posyandu.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {getNamaPuskesmas(posyandu)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 truncate max-w-xs">
                        {posyandu.alamat || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(posyandu.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(posyandu)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => setError("Fitur hapus belum tersedia")}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="bg-slate-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Menampilkan {paginatedData.length} dari {posyanduList.length} data
                </div>
                <div className="flex gap-1 items-center">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 disabled:opacity-40 hover:bg-gray-200 rounded transition">
                    <ChevronsLeft size={16} />
                  </button>
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-40 hover:bg-gray-200 rounded transition">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1.5 text-sm text-slate-700 font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-40 hover:bg-gray-200 rounded transition">
                    <ChevronRight size={16} />
                  </button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-40 hover:bg-gray-200 rounded transition">
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Buat Posyandu Baru</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  ID Puskesmas *
                </label>
                <input
                  type="number"
                  value={formData.id_puskesmas}
                  onChange={(e) => setFormData({ ...formData, id_puskesmas: e.target.value })}
                  placeholder="Contoh: 1"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Posyandu *
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Posyandu Sawo"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Alamat
                </label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Alamat posyandu..."
                  rows="3"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPosyandu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Edit Posyandu</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Posyandu *
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Alamat
                </label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}