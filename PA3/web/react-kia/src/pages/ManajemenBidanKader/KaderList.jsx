// src/pages/ManajemenBidanKader/KaderList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import SearchableSelect from "../../components/SearchableSelect";
import {
  listKaderBidan,
  createKaderBidan,
  updateKaderBidan,
  listPendudukForDropdown,
  listPosyanduForDropdown,
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
  MapPin,
} from "lucide-react";

// Helper: ambil nama posyandu dari berbagai kemungkinan field
const getNamaPosyandu = (kader) => {
  if (kader.posyandu?.nama) return kader.posyandu.nama;
  if (kader.posyandu?.nama_posyandu) return kader.posyandu.nama_posyandu;
  if (kader.nama_posyandu) return kader.nama_posyandu;
  return null;
};

export default function KaderList() {
  const navigate = useNavigate();
  const [kaderList, setKaderList] = useState([]);
  const [pendudukList, setPendudukList] = useState([]);
  const [posyanduList, setPosyanduList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPenduduk, setLoadingPenduduk] = useState(false);
  const [loadingPosyandu, setLoadingPosyandu] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedKader, setSelectedKader] = useState(null);
  const [formData, setFormData] = useState({
    penduduk_id: null,
    penduduk_selected: null,
    posyandu_id: null,
    posyandu_selected: null,
    status: "aktif",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // Fetch Kader Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await listKaderBidan({ search: debouncedSearch });
        console.log("Kader data:", data);
        setKaderList(data || []);
      } catch (err) {
        console.error(err);
        setError(adminTenagaErrorMessage(err, "Gagal memuat data kader"));
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

  // Fetch Posyandu untuk dropdown
  useEffect(() => {
    const fetchPosyandu = async () => {
      try {
        setLoadingPosyandu(true);
        const data = await listPosyanduForDropdown();
        setPosyanduList(data || []);
      } catch (err) {
        console.error("Gagal fetch posyandu:", err);
      } finally {
        setLoadingPosyandu(false);
      }
    };
    fetchPosyandu();
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
  const totalPages = Math.ceil(kaderList.length / itemsPerPage);
  const paginatedData = kaderList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendudukOptions = pendudukList.map((p) => ({
    value: p.id,
    label: `${p.nama_lengkap} (${p.nik})`,
    data: p,
  }));

  const posyanduOptions = posyanduList.map((pos) => {
    const nama = pos.nama || pos.nama_posyandu || `Posyandu #${pos.id}`;
    const lokasi = pos.desa || pos.kelurahan || "";
    return {
      value: pos.id,
      label: lokasi ? `${nama} – ${lokasi}` : nama,
      data: pos,
    };
  });

  const resetForm = () => {
    setFormData({
      penduduk_id: null,
      penduduk_selected: null,
      posyandu_id: null,
      posyandu_selected: null,
      status: "aktif",
    });
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

  const handleEditClick = (kader) => {
    setSelectedKader(kader);
    // Cari posyandu yang sesuai dari list untuk mendapatkan label yang benar
    const selectedPosyandu = posyanduList.find(p => p.id === kader.posyandu_id);
    setFormData({
      penduduk_id: kader.penduduk_id,
      penduduk_selected: {
        value: kader.penduduk_id,
        label: `${kader.nama_lengkap} (${kader.nik})`,
      },
      posyandu_id: kader.posyandu_id,
      posyandu_selected: kader.posyandu_id && selectedPosyandu ? {
        value: kader.posyandu_id,
        label: selectedPosyandu.nama || selectedPosyandu.nama_posyandu,
      } : null,
      status: kader.status,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedKader(null);
    resetForm();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.penduduk_id) {
      setFormError("Pilih penduduk terlebih dahulu");
      return;
    }
    if (!formData.posyandu_id) {
      setFormError("Pilih posyandu terlebih dahulu");
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError("");
      await createKaderBidan({
        penduduk_id: formData.penduduk_id,
        posyandu_id: formData.posyandu_id,
        status: formData.status,
      });
      handleCloseModal();
      const data = await listKaderBidan({ search: debouncedSearch });
      setKaderList(data || []);
    } catch (err) {
      setFormError(adminTenagaErrorMessage(err, "Gagal membuat kader"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.posyandu_id) {
      setFormError("Pilih posyandu terlebih dahulu");
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError("");
      await updateKaderBidan(selectedKader.id, {
        posyandu_id: formData.posyandu_id,
        status: formData.status,
      });
      handleCloseEditModal();
      const data = await listKaderBidan({ search: debouncedSearch });
      setKaderList(data || []);
    } catch (err) {
      setFormError(adminTenagaErrorMessage(err, "Gagal mengupdate kader"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kader ${nama}?`)) {
      try {
        // Note: API delete belum tersedia, tapi kita akan siapkan
        // await deleteKaderBidan(id);
        setError("Fitur hapus belum tersedia di API");
      } catch (err) {
        setError(adminTenagaErrorMessage(err, "Gagal menghapus kader"));
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Kelola Kader</h1>
            <p className="text-slate-500 mt-1">Manajemen data kader posyandu di wilayah kerja</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Tambah Kader
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama kader..."
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
          ) : kaderList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Tidak ada data kader</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">NIK</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Posyandu</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Kecamatan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Desa</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((kader) => {
                    const namaPosyandu = getNamaPosyandu(kader);
                    return (
                      <tr key={kader.id} className="border-b border-gray-100 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <User size={20} className="text-blue-600" />
                            <span className="font-medium text-slate-800">{kader.nama_lengkap}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{kader.nik}</td>
                        <td className="px-6 py-4">
                          {namaPosyandu ? (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-purple-500 flex-shrink-0" />
                              <span className="text-slate-700 text-sm">{namaPosyandu}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{kader.kecamatan || "-"}</td>
                        <td className="px-6 py-4 text-slate-600">{kader.desa || "-"}</td>
                        <td className="px-6 py-4">
                          {kader.status === "aktif" ? (
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
                              onClick={() => handleEditClick(kader)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(kader.id, kader.nama_lengkap)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="bg-slate-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Menampilkan {paginatedData.length} dari {kaderList.length} data
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

      {/* ===== Create Modal ===== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Tambah Kader Baru</h2>
              <button onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pilih Posyandu <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={posyanduOptions}
                  value={formData.posyandu_selected}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      posyandu_id: option ? option.value : null,
                      posyandu_selected: option,
                    })
                  }
                  isLoading={loadingPosyandu}
                  placeholder="Ketik nama posyandu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 transition">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {showEditModal && selectedKader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-slate-800">Edit Kader</h2>
              <button onClick={handleCloseEditModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pilih Posyandu <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={posyanduOptions}
                  value={formData.posyandu_selected}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      posyandu_id: option ? option.value : null,
                      posyandu_selected: option,
                    })
                  }
                  isLoading={loadingPosyandu}
                  placeholder="Ketik nama posyandu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <button type="button" onClick={handleCloseEditModal} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 transition">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50">
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