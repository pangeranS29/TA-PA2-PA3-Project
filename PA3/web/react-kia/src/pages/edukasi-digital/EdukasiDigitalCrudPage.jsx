import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createEdukasi,
  deleteEdukasi,
  getEdukasiById,
  listEdukasi,
  updateEdukasi,
} from "../../services/edukasiDigital";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  RefreshCw, 
  BookOpen, 
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";

const emptyForm = {
  judul: "",
  gambar_url: "",
  deskripsi: "",
  isi_konten: "",
  materi_inti: "",
  hal_penting: "",
};

const guessId = (item) =>
  item?.id ?? item?.ID ?? item?.id_edukasi ?? item?.id_informasi ?? null;

const guessImage = (item) => 
  item?.gambar_url ?? item?.GambarURL ?? item?.image_url ?? item?.image ?? "";

export default function EdukasiDigitalCrudPage({
  title,
  resourcePath,
  view = "inline",
  createPath,
  listPath,
  fields = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initialForm = useMemo(() => {
    if (fields && Array.isArray(fields)) {
      const f = {};
      fields.forEach((it) => {
        f[it.key] = it.default ?? "";
      });
      return f;
    }
    return {
      judul: "",
      gambar_url: "",
      deskripsi: "",
      isi_konten: "",
      isi: "",
      materi_inti: "",
      hal_penting: "",
      ringkasan: "",
    };
  }, [fields]);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const ta = new Date(a.updated_at || a.created_at || 0).getTime();
      const tb = new Date(b.updated_at || b.created_at || 0).getTime();
      return tb - ta;
    });
  }, [rows]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listEdukasi(resourcePath);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat data edukasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "form") return;
    loadData();
  }, [resourcePath, view]);

  useEffect(() => {
    if (view !== "form") return;

    const loadFormData = async () => {
      setLoading(true);
      setError("");

      try {
        // Try to get from URL params (direct edit link)
        if (params.id) {
          const item = await getEdukasiById(resourcePath, params.id);
          if (item) {
            setEditingId(String(guessId(item)));
            if (fields && Array.isArray(fields)) {
              const f = {};
              fields.forEach((it) => {
                f[it.key] = item[it.key] ?? item[it.alt] ?? "";
              });
              setForm(f);
            } else {
              setForm({
                judul: item.judul || "",
                gambar_url: item.gambar_url || "",
                deskripsi: item.deskripsi || "",
                isi_konten: item.isi_konten || item.isi || "",
                isi: item.isi || "",
                materi_inti: item.materi_inti || "",
                hal_penting: item.hal_penting || "",
                ringkasan: item.ringkasan || "",
              });
            }
          } else {
            setError("Data tidak ditemukan");
          }
          return;
        }

        // Try to get from location state (navigate from list)
        const item = location.state?.item;
        if (!item) {
          setEditingId(null);
          setForm(emptyForm);
          return;
        }

        setEditingId(String(guessId(item)));
        setForm({
          judul: item.judul || "",
          gambar_url: item.gambar_url || "",
          deskripsi: item.deskripsi || "",
          isi_konten: item.isi_konten || item.isi || "",
          materi_inti: item.materi_inti || "",
          hal_penting: item.hal_penting || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Gagal memuat data");
        setForm(emptyForm);
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [location.state, view, params.id, resourcePath, fields]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toPayload = () => {
    if (fields && Array.isArray(fields)) {
      const payload = {};
      fields.forEach((f) => {
        const val = form[f.key];
        payload[f.key] = typeof val === "string" ? val.trim() : val;
      });
      return payload;
    }

    return {
      judul: (form.judul || "").trim(),
      gambar_url: (form.gambar_url || "").trim(),
      deskripsi: (form.deskripsi || "").trim(),
      isi_konten: (form.isi_konten || "").trim(),
      isi: (form.isi || "").trim(),
      materi_inti: (form.materi_inti || "").trim(),
      hal_penting: (form.hal_penting || "").trim(),
      ringkasan: (form.ringkasan || "").trim(),
    };
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.judul.trim()) {
      setError("Judul wajib diisi");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = toPayload();
      if (editingId) {
        await updateEdukasi(resourcePath, editingId, payload);
      } else {
        await createEdukasi(resourcePath, payload);
      }

      if (view === "form") {
        navigate(listPath || "/edukasi-digital/informasi-umum");
        return;
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const id = guessId(item);
    if (!id) {
      setError("ID data tidak ditemukan");
      return;
    }
    
    if (createPath) {
      navigate(createPath, { state: { item } });
      return;
    }

    // Navigate to edit form with ID in URL
    navigate(`${location.pathname.replace(/\/[^/]*$/, "")}/form/${id}`, { state: { item } });
  };

  const handleDelete = async (item) => {
    const id = guessId(item);
    if (!id) {
      setError("ID data tidak ditemukan");
      return;
    }

    const confirmed = window.confirm("Hapus data edukasi ini?");
    if (!confirmed) return;

    setError("");
    try {
      await deleteEdukasi(resourcePath, id);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menghapus data");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-sm text-slate-500 mt-2">
            Kelola konten edukasi digital untuk kategori ini.
          </p>
        </section>

        {view !== "form" ? (
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Daftar Konten</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (createPath) {
                    navigate(createPath);
                    return;
                  }

                  setForm(emptyForm);
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus size={18} /> Tambah Konten
              </button>
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sortedRows.length === 0 && !loading ? (
              <p className="text-sm text-slate-500">Belum ada konten.</p>
            ) : null}

            {sortedRows.map((item) => {
              const id = guessId(item);
              return (
                <article
                  key={id || item.judul}
                  className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 flex flex-col md:flex-row gap-6"
                >
                  {/* Image Section */}
                  <div className="w-full md:w-48 h-48 md:h-32 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative group-hover:border-blue-100 transition-colors">
                    {guessImage(item) ? (
                      <img 
                        src={guessImage(item)} 
                        alt={item.judul}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                        <ImageIcon size={32} strokeWidth={1.5} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.judul || "Tanpa Judul"}
                        </h3>
                        <span className="shrink-0 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Edukasi
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.deskripsi || item.isi_konten || item.isi || "Tidak ada deskripsi singkat untuk konten ini."}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-600 text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-100/50"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100/50"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-blue-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Detail <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          </section>
        ) : null}

        {(view === "form" || (view === "inline" && showForm)) && (
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingId ? "Edit Konten" : "Tambah Konten"}
              </h2>
              {view === "form" ? (
                <button
                  type="button"
                  onClick={() => navigate(listPath || "/edukasi-digital/informasi-umum")}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Kembali ke Daftar
                </button>
              ) : null}
            </div>

            {view === "form" && loading ? (
              <div className="py-8 text-center">
                <p className="text-slate-600">Memuat data...</p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {(fields && Array.isArray(fields) ? fields : [
                { key: "judul", label: "Judul", type: "text" },
                { key: "gambar_url", label: "URL gambar (opsional)", type: "text" },
                { key: "deskripsi", label: "Deskripsi", type: "textarea", rows: 2 },
                { key: "isi_konten", label: "Isi konten", type: "textarea", rows: 4 },
                { key: "materi_inti", label: "Materi inti", type: "textarea", rows: 2 },
                { key: "hal_penting", label: "Hal penting", type: "textarea", rows: 2 },
              ]).map((f) => {
                const value = form[f.key] ?? "";
                if (f.type === "textarea") {
                  return (
                    <textarea
                      key={f.key}
                      name={f.key}
                      value={value}
                      onChange={handleChange}
                      placeholder={f.label}
                      rows={f.rows || 3}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all"
                    />
                  );
                }

                return (
                  <div key={f.key} className="space-y-1">
                    <input
                      name={f.key}
                      value={value}
                      onChange={handleChange}
                      placeholder={f.label}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all"
                    />
                    {f.key === "gambar_url" && value && (
                      <div className="mt-2 w-full max-w-xs h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
                        <img 
                          src={value} 
                          alt="Preview" 
                          key={value} // Force re-render when value changes
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.opacity = '0';
                            e.target.parentElement.classList.add('bg-red-50');
                          }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 text-slate-300 gap-1">
                          <ImageIcon size={24} />
                          <span className="text-[8px] font-bold uppercase">Invalid URL</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60 hover:bg-blue-700 transition-colors"
                >
                  {saving ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (view === "form") {
                      navigate(listPath || "/edukasi-digital/informasi-umum");
                      return;
                    }
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
            )}
          </section>
        )}
      </div>
    </MainLayout>
  );
}
