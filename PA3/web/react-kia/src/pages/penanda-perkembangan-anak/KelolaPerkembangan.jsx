import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { Search, Plus, Pencil, Trash2, X, Check, RotateCcw } from "lucide-react";
import { getKategoriUmurList } from "../../services/kategoriUmur";
import {
  getPemantauanIndikatorList,
  createPemantauanIndikator,
  updatePemantauanIndikator,
  deletePemantauanIndikator,
} from "../../services/pemantauanIndikator";

export default function KelolaPerkembangan() {
  const [kategoriUmurList, setKategoriUmurList] = useState([]);
  const [activeKategoriUsia, setActiveKategoriUsia] = useState("");
  const [query, setQuery] = useState("");
  const [dataIndikator, setDataIndikator] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formKategoriUsia, setFormKategoriUsia] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const normalizeKategoriUmur = (items) => {
    return (Array.isArray(items) ? items : []).map((item) => ({
      ...item,
      label: item?.kategori_umur || item?.KategoriUmur || item?.nama_rentang || item?.nama || "Kategori Umur",
    }));
  };

  useEffect(() => {
    const init = async () => {
      try {
        const list = normalizeKategoriUmur(await getKategoriUmurList());
        setKategoriUmurList(list);

        if (list.length > 0) {
          setActiveKategoriUsia(list[0].label);
          setFormKategoriUsia(list[0].label);
        }
      } catch (error) {
        setErrorMsg("Gagal memuat kategori umur");
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!activeKategoriUsia) return;

    const timeoutId = setTimeout(() => {
      fetchData(activeKategoriUsia, query);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [activeKategoriUsia, query]);

  const fetchData = async (kategoriUsia, searchQuery) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const rows = await getPemantauanIndikatorList(kategoriUsia, searchQuery);
      setDataIndikator((prev) => ({
        ...prev,
        [kategoriUsia]: Array.isArray(rows) ? rows : [],
      }));
    } catch (error) {
      setDataIndikator((prev) => ({
        ...prev,
        [kategoriUsia]: [],
      }));
      setErrorMsg("Gagal memuat data indikator");
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = useMemo(() => {
    return dataIndikator[activeKategoriUsia] || [];
  }, [activeKategoriUsia, dataIndikator]);

  const openAddModal = () => {
    setFormMode("add");
    setSelectedItem(null);
    setFormKategoriUsia(activeKategoriUsia || kategoriUmurList[0]?.label || "");
    setFormDeskripsi("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormMode("edit");
    setSelectedItem(item);
    setFormKategoriUsia(item.kategori_usia || activeKategoriUsia || "");
    setFormDeskripsi(item.deskripsi || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormKategoriUsia(activeKategoriUsia || kategoriUmurList[0]?.label || "");
    setFormDeskripsi("");
  };

  const handleSave = async () => {
    if (isSubmitting) return;

    const kategoriUsia = formKategoriUsia.trim();
    const deskripsi = formDeskripsi.trim();

    if (!kategoriUsia) {
      setErrorMsg("Kategori umur wajib dipilih");
      return;
    }
    if (!deskripsi) {
      setErrorMsg("Deskripsi indikator wajib diisi");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setNotice("");

    try {
      if (formMode === "edit" && selectedItem) {
        await updatePemantauanIndikator(selectedItem.id, {
          kategori_usia: kategoriUsia,
          deskripsi,
        });
        setNotice("Indikator berhasil diperbarui");
      } else {
        await createPemantauanIndikator({
          kategori_usia: kategoriUsia,
          deskripsi,
        });
        setNotice("Indikator berhasil ditambahkan");
      }

      closeModal();
      await fetchData(activeKategoriUsia || kategoriUsia, query);
    } catch (error) {
      setErrorMsg("Gagal menyimpan indikator: " + (error?.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedItem || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setNotice("");

    try {
      await deletePemantauanIndikator(selectedItem.id);
      setNotice("Indikator berhasil dihapus");
      closeDeleteModal();
      await fetchData(activeKategoriUsia, query);
    } catch (error) {
      setErrorMsg("Gagal menghapus indikator");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari indikator..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-full text-sm shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Kelola Perawatan Anak</h1>
            <p className="text-slate-500">Mengatur indikator perawatan anak berdasarkan kategori umur.</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm shadow-blue-100"
          >
            <Plus size={18} /> Tambah Indikator
          </button>
        </div>

        {notice ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        ) : null}

        {errorMsg ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        <div className="bg-slate-100/50 p-1.5 rounded-2xl flex flex-wrap gap-1">
          {kategoriUmurList.map((kategori) => (
            <button
              key={kategori.id}
              onClick={() => setActiveKategoriUsia(kategori.label)}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeKategoriUsia === kategori.label
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:bg-slate-100"
                }`}
            >
              {kategori.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-50/50 px-8 py-4 border-b border-slate-100 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
            <div className="col-span-1 text-center">No</div>
            <div className="col-span-3">Kategori Umur</div>
            <div className="col-span-6">Indikator</div>
            <div className="col-span-2 text-right">Kelola</div>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-20 text-center">
                <p className="text-slate-400 text-sm italic">Memuat indikator...</p>
              </div>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 items-center px-8 py-5 hover:bg-slate-50/40 transition-all group">
                  <div className="col-span-1 text-xs font-mono text-slate-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-3 text-sm font-semibold text-blue-600">
                    {item.kategori_usia}
                  </div>
                  <div className="col-span-6 pr-10 text-sm text-slate-700 leading-relaxed">
                    {item.deskripsi}
                  </div>
                  <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <p className="text-slate-400 text-sm italic">
                  Belum ada indikator untuk kategori {activeKategoriUsia || "ini"}.
                </p>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">
                  {formMode === "add" ? "Tambah Indikator" : "Edit Indikator"}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-full text-slate-400 hover:bg-white hover:text-slate-600 shadow-sm transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kategori Umur <span className="text-red-500">*</span></label>
                  <select
                    value={formKategoriUsia}
                    onChange={(e) => setFormKategoriUsia(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  >
                    <option value="">-- Pilih Kategori Umur --</option>
                    {kategoriUmurList.map((kategori) => (
                      <option key={kategori.id} value={kategori.label}>
                        {kategori.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Deskripsi Indikator</label>
                  <textarea
                    rows={6}
                    value={formDeskripsi}
                    onChange={(e) => setFormDeskripsi(e.target.value)}
                    placeholder="Contoh: Anak bisa mengenali suara ibu dan menoleh saat dipanggil..."
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
                >
                  BATAL
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <><RotateCcw className="animate-spin" size={16} /> MENYIMPAN...</> : <><Check size={18} /> SIMPAN INDIKATOR</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Hapus Indikator?</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Indikator ini akan dihapus permanen. Anda yakin?
                </p>
                {selectedItem && (
                  <div className="text-xs bg-slate-50 rounded-xl p-4 text-slate-600 border border-slate-100 italic">
                    "{selectedItem.deskripsi}"
                  </div>
                )}
              </div>
              <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="w-full py-3 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg shadow-red-100"
                >
                  {isSubmitting ? "MENGHAPUS..." : "YA, HAPUS PERMANEN"}
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
                >
                  TIDAK, BATALKAN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}