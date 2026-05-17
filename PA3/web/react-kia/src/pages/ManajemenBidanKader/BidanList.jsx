// src/pages/ManajemenBidanKader/BidanList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import SearchableSelect from "../../components/SearchableSelect";
import {
  listBidanBidan,
  createBidanBidan,
  updateBidanBidan,
  listPendudukForDropdown,
  adminTenagaErrorMessage,
} from "../../services/adminTenagaKesehatan";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Edit,
  Trash2,
  AlertCircle,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

export default function BidanList() {
  const navigate = useNavigate();
  const [bidanList, setBidanList] = useState([]);
  const [pendudukList, setPendudukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPenduduk, setLoadingPenduduk] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBidan, setSelectedBidan] = useState(null);
  const [formData, setFormData] = useState({
    penduduk_id: null,
    penduduk_selected: null,
    no_str: "",
    no_sipb: "",
    status: "aktif",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // Fetch Bidan Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await listBidanBidan({ search: debouncedSearch });
        console.log("Bidan data:", data);
        setBidanList(data || []);
      } catch (err) {
        console.error(err);
        setError(adminTenagaErrorMessage(err, "Gagal memuat data bidan"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch]);

  // Fetch Penduduk untuk dropdown
  useEffect(() => {
    const fetchPenduduk = async () => {
      try {
        setLoadingPenduduk(true);
        const data = await listPendudukForDropdown();
        setPendudukList(data || []);
      } catch (err) {
        console.error("Gagal fetch penduduk:", err);
      } finally {
        setLoadingPenduduk(false);
      }
    };
    fetchPenduduk();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Pagination
  const totalPages = Math.ceil(bidanList.length / itemsPerPage);
  const paginatedData = bidanList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendudukOptions = pendudukList.map((p) => ({
    value: p.id,
    label: `${p.nama_lengkap} (${p.nik})`,
    data: p,
  }));

  const resetForm = () => {
    setFormData({ penduduk_id: null, penduduk_selected: null, no_str: "", no_sipb: "", status: "aktif" });
    setFormError("");
  };

  const handleOpenModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditClick = (bidan) => {
    setSelectedBidan(bidan);
    setFormData({
      penduduk_id: bidan.penduduk_id,
      penduduk_selected: {
        value: bidan.penduduk_id,
        label: `${bidan.nama_lengkap} (${bidan.nik})`,
      },
      no_str: bidan.no_str || "",
      no_sipb: bidan.no_sipb || "",
      status: bidan.status,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedBidan(null);
    resetForm();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.penduduk_id) {
      setFormError("Pilih penduduk terlebih dahulu");
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError("");
      await createBidanBidan({
        penduduk_id: formData.penduduk_id,
        no_str: formData.no_str,
        no_sipb: formData.no_sipb,
        status: formData.status,
      });
      handleCloseModal();
      const data = await listBidanBidan({ search: debouncedSearch });
      setBidanList(data || []);
    } catch (err) {
      setFormError(adminTenagaErrorMessage(err, "Gagal membuat bidan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setFormError("");
      await updateBidanBidan(selectedBidan.id, {
        no_str: formData.no_str,
        no_sipb: formData.no_sipb,
        status: formData.status,
      });
      handleCloseEditModal();
      const data = await listBidanBidan({ search: debouncedSearch });
      setBidanList(data || []);
    } catch (err) {
      setFormError(adminTenagaErrorMessage(err, "Gagal mengupdate bidan"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Kelola Bidan</h1>
            <p className="text-slate-500 mt-1">Manajemen data bidan di wilayah kerja</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Tambah Bidan
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama bidan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : bidanList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Tidak ada data bidan</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">NIK</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">No. STR</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">No. SIPB</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Kecamatan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Desa</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((bidan) => (
                    <tr key={bidan.id} className="border-b border-gray-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <User size={20} className="text-blue-600" />
                          <span className="font-medium text-slate-800">{bidan.nama_lengkap}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{bidan.nik}</td>
                      <td className="px-6 py-4 text-slate-600">{bidan.no_str || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{bidan.no_sipb || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{bidan.kecamatan || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{bidan.desa || "-"}</td>
                      <td className="px-6 py-4">
                        {bidan.status === "aktif" ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="text-green-700 text-sm font-medium">Aktif</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <XCircle size={16} className="text-red-500" />
                            <span className="text-red-600 text-sm font-medium">Nonaktif</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(bidan)}
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
                  Menampilkan {paginatedData.length} dari {bidanList.length} data
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Tambah Bidan Baru</h2>
              <button onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pilih Penduduk <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={pendudukOptions}
                  value={formData.penduduk_selected}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      penduduk_id: option ? option.value : null,
                      penduduk_selected: option,
                    })
                  }
                  isLoading={loadingPenduduk}
                  placeholder="Ketik nama atau NIK penduduk..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">No. STR</label>
                <input
                  type="text"
                  value={formData.no_str}
                  onChange={(e) => setFormData({ ...formData, no_str: e.target.value })}
                  placeholder="Nomor Surat Tanda Registrasi"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">No. SIPB</label>
                <input
                  type="text"
                  value={formData.no_sipb}
                  onChange={(e) => setFormData({ ...formData, no_sipb: e.target.value })}
                  placeholder="Nomor Surat Ijin Praktik Bidan"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition">
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
      {showEditModal && selectedBidan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Edit Bidan</h2>
              <button onClick={handleCloseEditModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Penduduk
                </label>
                <input
                  type="text"
                  value={formData.penduduk_selected?.label || ""}
                  disabled
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">No. STR</label>
                <input
                  type="text"
                  value={formData.no_str}
                  onChange={(e) => setFormData({ ...formData, no_str: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">No. SIPB</label>
                <input
                  type="text"
                  value={formData.no_sipb}
                  onChange={(e) => setFormData({ ...formData, no_sipb: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle size={16} className="text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseEditModal} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-slate-700 hover:bg-gray-50 transition">
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