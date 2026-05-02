import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { Search, Plus, Pencil, Trash2, X, Check, ClipboardList } from "lucide-react";
import { 
  getRentangPerkembangan, 
  getKategoriPerkembangan, 
  createKategoriPerkembangan, 
  updateKategoriPerkembangan, 
  deleteKategoriPerkembangan 
} from "../../services/perkembanganAnak";

export default function KelolaPerkembangan() {
  const [rentangList, setRentangList] = useState([]);
  const [activeRentangId, setActiveRentangId] = useState("");
  const [query, setQuery] = useState("");
  const [dataIndikator, setDataIndikator] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formText, setFormText] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [clickedBtn, setClickedBtn] = useState({ id: null, type: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getRentangPerkembangan();
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setRentangList(list);
        if (list.length > 0) {
          setActiveRentangId(String(list[0].id));
        }
      } catch (e) {
        setErrorMsg("Gagal memuat kategori usia perkembangan");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeRentangId) return;
    const t = setTimeout(() => {
      fetchData(activeRentangId, query);
    }, 300);

    return () => clearTimeout(t);
  }, [activeRentangId, query]);

  const fetchData = async (rentangId, q) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await getKategoriPerkembangan(rentangId);
      const rows = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      
      const filtered = q 
        ? rows.filter(item => item.indikator.toLowerCase().includes(q.toLowerCase()))
        : rows;

      setDataIndikator((prev) => ({
        ...prev,
        [rentangId]: filtered,
      }));
    } catch (error) {
      setErrorMsg("Gagal memuat data indikator perkembangan");
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = useMemo(() => {
    return dataIndikator[activeRentangId] || [];
  }, [activeRentangId, dataIndikator]);

  const openAddModal = () => {
    setFormMode("add");
    setSelectedItem(null);
    setFormText("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormMode("edit");
    setSelectedItem(item);
    setFormText(item.indikator);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormText("");
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    const value = formText.trim();
    if (!value) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setNotice("");

    try {
      if (formMode === "edit" && selectedItem) {
        await updateKategoriPerkembangan(selectedItem.id, {
          rentang_usia_perkembangan_id: Number(activeRentangId),
          indikator: value,
        });
        setNotice("Indikator perkembangan berhasil diperbarui");
      } else {
        await createKategoriPerkembangan({
          rentang_usia_perkembangan_id: Number(activeRentangId),
          indikator: value,
        });
        setNotice("Indikator perkembangan berhasil ditambahkan");
      }

      closeModal();
      await fetchData(activeRentangId, query);
    } catch (error) {
      setErrorMsg("Gagal menyimpan indikator: " + (error.response?.data?.message || error.message));
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
      await deleteKategoriPerkembangan(selectedItem.id);
      setNotice("Indikator berhasil dihapus");
      closeDeleteModal();
      await fetchData(activeRentangId, query);
    } catch (error) {
      setErrorMsg("Gagal menghapus indikator");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder={`Cari penanda perkembangan...`}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-full text-sm shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Kelola Indikator Perkembangan</h1>
            <p className="text-sm text-slate-500 mt-1">Mengatur pertanyaan milestone perkembangan anak (29 hari - 6 tahun).</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={18} /> Tambah Indikator
          </button>
        </div>

        {notice && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-in fade-in slide-in-from-top-1 duration-300">
            {notice}
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="bg-slate-100/50 p-1.5 rounded-2xl flex flex-wrap gap-1">
          {rentangList.map((rentang) => (
            <button
              key={rentang.id}
              onClick={() => setActiveRentangId(String(rentang.id))}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                activeRentangId === String(rentang.id)
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {rentang.nama_rentang}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-50/50 px-8 py-4 border-b border-slate-100 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
            <div className="col-span-1 text-center">No</div>
            <div className="col-span-9">Penanda Perkembangan</div>
            <div className="col-span-2 text-right">Kelola</div>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-20 text-center">
                <p className="text-slate-400 text-sm italic">Memproses data...</p>
              </div>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 items-center px-8 py-6 hover:bg-slate-50/30 transition-all group">
                  <div className="col-span-1 text-xs font-mono text-slate-400 text-center">
                    {index + 1}
                  </div>
                  <div className="col-span-9 pr-10 text-sm text-slate-700 leading-relaxed">
                    {item.indikator}
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
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
                <ClipboardList className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 text-sm italic">Belum ada indikator untuk rentang usia ini.</p>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">
                  {formMode === "add" ? "Tambah Indikator" : "Edit Indikator"}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-full text-slate-400 hover:bg-white hover:text-slate-600 shadow-sm transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-indigo-50 px-4 py-2 rounded-xl inline-block text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                  {rentangList.find(r => String(r.id) === activeRentangId)?.nama_rentang}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Deskripsi Indikator Perkembangan</label>
                  <textarea
                    rows={6}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Contoh: Bayi bisa mengangkat kepala secara mandiri..."
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none"
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
                  className="px-8 py-2.5 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <><RotateCcw className="animate-spin" size={16} /> MENYIMPAN...</> : <><Check size={18} /> SIMPAN INDIKATOR</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Hapus Indikator?</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Indikator ini akan dihapus permanen dari bank soal perkembangan. Anda yakin?
                </p>
                {selectedItem && (
                  <div className="text-xs bg-slate-50 rounded-xl p-4 text-slate-600 border border-slate-100 italic">
                    "{selectedItem.indikator}"
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

function RotateCcw({ className, size }) {
  return <div className={className}><Check size={size} /></div>; // Fallback icon or import actual RotateCcw if needed
}
