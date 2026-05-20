import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { Plus, Pencil, Trash2, X, Check, RotateCcw, Search } from "lucide-react";
import {
  getKategoriCapaianList,
  createKategoriCapaian,
  updateKategoriCapaian,
  deleteKategoriCapaian,
} from "../../services/perawatan";

export default function KelolaPerkembangan() {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRentangUsia, setActiveRentangUsia] = useState("");

  // Form fields
  const [formRentangUsia, setFormRentangUsia] = useState("");
  const [formPertanyaan, setFormPertanyaan] = useState("");
  const [formAspek, setFormAspek] = useState("");

  // Daftar rentang usia yang tersedia
  const rentangUsiaOptions = [
    "0-3 bulan",
    "3-6 bulan",
    "6-9 bulan",
    "9-12 bulan",
    "12-18 bulan",
    "18-24 bulan",
    "2-3 tahun",
    "3-4 tahun",
    "4-5 tahun",
    "5-6 tahun",
  ];

  // ── Muat data awal ──────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getKategoriCapaianList();
      const list = Array.isArray(data) ? data : [];
      setKategoriList(list);
      
      // Set active rentang usia ke yang pertama jika belum ada
      if (!activeRentangUsia && list.length > 0) {
        const firstRentang = list[0].rentang_usia || "Umum";
        setActiveRentangUsia(firstRentang);
      }
    } catch (error) {
      console.error("Error loading kategori capaian:", error);
      setErrorMsg("Gagal memuat data indikator perawatan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Get unique rentang usia & sort ──────────────────────
  const uniqueRentangUsia = useMemo(() => {
    const unique = [...new Set(kategoriList.map((k) => k.rentang_usia || "Umum"))];
    return unique.sort((a, b) => {
      const ageOrder = [
        "0-3 bulan",
        "3-6 bulan",
        "6-9 bulan",
        "9-12 bulan",
        "12-18 bulan",
        "18-24 bulan",
        "2-3 tahun",
        "3-4 tahun",
        "4-5 tahun",
        "5-6 tahun",
        "Umum",
      ];
      return ageOrder.indexOf(a) - ageOrder.indexOf(b);
    });
  }, [kategoriList]);

  // ── Filter data berdasarkan rentang usia aktif & search ──
  const filteredData = useMemo(() => {
    return kategoriList
      .filter((k) => (k.rentang_usia || "Umum") === activeRentangUsia)
      .filter((k) =>
        k.pertanyaan_ceklist
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
  }, [kategoriList, activeRentangUsia, searchQuery]);

  // ── Modal Management ────────────────────────────────────
  const openAddModal = () => {
    setFormMode("add");
    setSelectedItem(null);
    setFormRentangUsia(activeRentangUsia || "");
    setFormPertanyaan("");
    setFormAspek("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormMode("edit");
    setSelectedItem(item);
    setFormRentangUsia(item.rentang_usia || "");
    setFormPertanyaan(item.pertanyaan_ceklist || "");
    setFormAspek(item.aspek || "");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormRentangUsia("");
    setFormPertanyaan("");
    setFormAspek("");
    setErrorMsg("");
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setIsDeleteModalOpen(false);
  };

  // ── Handle Save ──────────────────────────────────────────
  const handleSave = async () => {
    if (isSubmitting) return;

    // Validation
    if (!formRentangUsia.trim()) {
      setErrorMsg("Rentang usia wajib dipilih");
      return;
    }
    if (!formPertanyaan.trim()) {
      setErrorMsg("Pertanyaan/indikator wajib diisi");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setNotice("");

    try {
      const payload = {
        rentang_usia: formRentangUsia,
        pertanyaan_ceklist: formPertanyaan,
        aspek: formAspek || null,
      };

      if (formMode === "edit" && selectedItem) {
        await updateKategoriCapaian(selectedItem.id, payload);
        setNotice("Indikator perawatan berhasil diperbarui");
      } else {
        await createKategoriCapaian(payload);
        setNotice("Indikator perawatan berhasil ditambahkan");
      }

      closeModal();
      await loadData();
    } catch (error) {
      setErrorMsg(
        "Gagal menyimpan indikator: " +
          (error?.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handle Delete ────────────────────────────────────────
  const handleDelete = async () => {
    if (!selectedItem || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setNotice("");

    try {
      await deleteKategoriCapaian(selectedItem.id);
      setNotice("Indikator perawatan berhasil dihapus");
      closeDeleteModal();
      await loadData();
    } catch (error) {
      setErrorMsg("Gagal menghapus indikator");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center text-slate-400">Memuat data...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Kelola Perawatan Anak
            </h1>
            <p className="text-slate-500 text-sm">
              Atur indikator perawatan berdasarkan rentang usia
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-all font-semibold shadow-sm shadow-blue-100"
          >
            <Plus size={20} /> Tambah Indikator
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari indikator perawatan..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Alerts */}
        {notice && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Rentang Usia Tabs */}
        {uniqueRentangUsia.length > 0 ? (
          <div className="bg-slate-100/50 p-2 rounded-xl flex flex-wrap gap-2 overflow-x-auto">
            {uniqueRentangUsia.map((rentang) => (
              <button
                key={rentang}
                onClick={() => {
                  setActiveRentangUsia(rentang);
                  setSearchQuery("");
                }}
                className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                  activeRentangUsia === rentang
                    ? "bg-white text-blue-600 shadow-sm ring-2 ring-blue-200"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {rentang}
              </button>
            ))}
          </div>
        ) : null}

        {/* Search Bar for active rentang */}
        {filteredData.length > 0 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari dalam rentang usia ini..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Main Content */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <p className="text-slate-400 text-sm">
              {kategoriList.some((k) => (k.rentang_usia || "Umum") === activeRentangUsia)
                ? "Tidak ada indikator yang sesuai dengan pencarian."
                : "Belum ada indikator untuk rentang usia ini. Mulai dengan menambahkan indikator baru."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-bold text-slate-700">
                Indikator Perawatan: <span className="text-blue-600">{activeRentangUsia}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {filteredData.length} indikator ditemukan
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredData.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-xs font-mono text-slate-300 flex-shrink-0 mt-0.5">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <p className="font-semibold text-slate-800 text-sm leading-snug">
                          {item.pertanyaan_ceklist || "Indikator tanpa judul"}
                        </p>
                      </div>

                      {item.aspek && (
                        <span className="inline-block text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                          {item.aspek}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="p-2.5 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">
                  {formMode === "add"
                    ? "Tambah Indikator Perawatan"
                    : "Edit Indikator Perawatan"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Rentang Usia <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formRentangUsia}
                    onChange={(e) => setFormRentangUsia(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  >
                    <option value="">-- Pilih Rentang Usia --</option>
                    {rentangUsiaOptions.map((usia) => (
                      <option key={usia} value={usia}>
                        {usia}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Pertanyaan/Indikator <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formPertanyaan}
                    onChange={(e) => setFormPertanyaan(e.target.value)}
                    placeholder="Contoh: Anak bisa mengenali suara ibu dan menoleh saat dipanggil..."
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    Aspek Perkembangan <span className="text-slate-400">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={formAspek}
                    onChange={(e) => setFormAspek(e.target.value)}
                    placeholder="Contoh: Kognitif, Motorik, Sosial-Emosional..."
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                </div>

                {errorMsg && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {errorMsg}
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="animate-spin" size={16} /> Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check size={18} /> Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 size={28} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  Hapus Indikator?
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Indikator ini akan dihapus permanen. Data perawatan anak yang
                  sudah diisi tidak akan terhapus.
                </p>
                {selectedItem && (
                  <div className="text-xs bg-slate-50 rounded-lg p-3 text-slate-600 border border-slate-100 italic">
                    "{selectedItem.pertanyaan_ceklist}"
                  </div>
                )}
              </div>
              <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="w-full py-2.5 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg shadow-red-100"
                >
                  {isSubmitting ? "Menghapus..." : "Ya, Hapus Permanen"}
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-all"
                >
                  Tidak, Batalkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}