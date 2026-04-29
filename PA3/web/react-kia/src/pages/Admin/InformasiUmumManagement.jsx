import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, RefreshCw, Save, Search, Trash2 } from "lucide-react";
import MainLayout from "../../components/Layout/MainLayout";
import {
  createInformasiUmum,
  deleteInformasiUmum,
  informasiUmumErrorMessage,
  listInformasiUmum,
  updateInformasiUmum,
} from "../../services/informasiUmum";

const cardClass = "bg-white rounded-2xl shadow-sm border border-slate-100";

const emptyForm = {
  tipe: "ARTIKEL",
  judul: "",
  umur_target: "Semua Umur",
  durasi_baca: "5 Menit Baca",
  ringkasan: "",
  konten: "",
  thumbnail_url: "",
  is_active: true,
};

const InformasiUmumManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => {
      return [item.judul, item.tipe, item.umur_target, item.ringkasan]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [items, search]);

  const resetNotice = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await listInformasiUmum();
      const data = response?.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(informasiUmumErrorMessage(error, "Gagal memuat informasi umum"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    resetNotice();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      tipe: item.tipe || "ARTIKEL",
      judul: item.judul || "",
      umur_target: item.umur_target || "Semua Umur",
      durasi_baca: item.durasi_baca || "5 Menit Baca",
      ringkasan: item.ringkasan || "",
      konten: item.konten || "",
      thumbnail_url: item.thumbnail_url || "",
      is_active: item.is_active ?? true,
    });
    resetNotice();
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.tipe.trim()) return "Tipe wajib diisi";
    if (!form.judul.trim()) return "Judul wajib diisi";
    if (!form.konten.trim()) return "Konten wajib diisi";
    return "";
  };

  const buildPayload = () => ({
    tipe: form.tipe.trim(),
    judul: form.judul.trim(),
    umur_target: form.umur_target.trim(),
    durasi_baca: form.durasi_baca.trim(),
    ringkasan: form.ringkasan.trim(),
    konten: form.konten.trim(),
    thumbnail_url: form.thumbnail_url.trim(),
    is_active: Boolean(form.is_active),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetNotice();

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingId) {
        await updateInformasiUmum(editingId, payload);
        setSuccessMessage("Informasi umum berhasil diperbarui");
      } else {
        await createInformasiUmum(payload);
        setSuccessMessage("Informasi umum berhasil ditambahkan");
      }
      setEditingId(null);
      setForm(emptyForm);
      await loadItems();
    } catch (error) {
      setErrorMessage(
        informasiUmumErrorMessage(
          error,
          editingId ? "Gagal memperbarui informasi umum" : "Gagal menambahkan informasi umum"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus data informasi umum ini?")) return;

    resetNotice();
    setSaving(true);
    try {
      await deleteInformasiUmum(id);
      if (editingId === id) {
        startCreate();
      }
      await loadItems();
      setSuccessMessage("Informasi umum berhasil dihapus");
    } catch (error) {
      setErrorMessage(informasiUmumErrorMessage(error, "Gagal menghapus informasi umum"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">CRUD Informasi Umum</h1>
            <p className="text-sm text-slate-500">Kelola artikel dan video edukasi untuk menu Informasi Umum.</p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Data Baru
          </button>
        </div>

        {errorMessage && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">{errorMessage}</div>}
        {successMessage && <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm">{successMessage}</div>}

        <section className={`${cardClass} p-5`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{editingId ? "Edit Informasi Umum" : "Tambah Informasi Umum"}</h2>
              <p className="text-sm text-slate-500">Field minimal: tipe, judul, dan konten.</p>
            </div>
            <button
              type="button"
              onClick={loadItems}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
            >
              <RefreshCw size={16} />
              Muat Ulang
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">Tipe</label>
              <select
                value={form.tipe}
                onChange={(e) => handleChange("tipe", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              >
                <option value="ARTIKEL">ARTIKEL</option>
                <option value="VIDEO">VIDEO</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Judul</label>
              <input
                type="text"
                value={form.judul}
                onChange={(e) => handleChange("judul", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                placeholder="Contoh: Cuci Tangan Pakai Sabun"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Umur Target</label>
              <input
                type="text"
                value={form.umur_target}
                onChange={(e) => handleChange("umur_target", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                placeholder="Contoh: Semua Umur"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Durasi Baca</label>
              <input
                type="text"
                value={form.durasi_baca}
                onChange={(e) => handleChange("durasi_baca", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                placeholder="Contoh: 5 Menit Baca"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Ringkasan</label>
              <textarea
                value={form.ringkasan}
                onChange={(e) => handleChange("ringkasan", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-24"
                placeholder="Ringkasan singkat konten"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Konten</label>
              <textarea
                value={form.konten}
                onChange={(e) => handleChange("konten", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-40"
                placeholder="Isi artikel atau deskripsi video"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnail_url}
                onChange={(e) => handleChange("thumbnail_url", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-600">Aktif</span>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Data"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={startCreate}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={`${cardClass} p-5`}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Daftar Informasi Umum</h2>
              <p className="text-sm text-slate-500">Cari, edit, atau hapus konten yang sudah dibuat.</p>
            </div>
            <div className="w-full md:w-80">
              <label className="text-sm text-slate-600">Cari</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full outline-none"
                  placeholder="Cari judul / tipe / ringkasan"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold w-20">ID</th>
                  <th className="text-left px-4 py-3 font-semibold">Judul</th>
                  <th className="text-left px-4 py-3 font-semibold w-28">Tipe</th>
                  <th className="text-left px-4 py-3 font-semibold w-36">Target</th>
                  <th className="text-left px-4 py-3 font-semibold w-28">Status</th>
                  <th className="text-left px-4 py-3 font-semibold w-40">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-8 text-slate-500" colSpan={6}>
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Memuat data...
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-slate-500" colSpan={6}>
                      Belum ada data informasi umum.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-3 text-slate-700">{item.id}</td>
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        <div className="space-y-1">
                          <p>{item.judul || "-"}</p>
                          <p className="text-xs text-slate-500 line-clamp-2">{item.ringkasan || item.konten || "-"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.tipe || "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{item.umur_target || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {item.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => { setPreviewItem(item); setShowPreview(true); }}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
                          >
                            Lihat
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-blue-700 hover:bg-blue-100"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-red-700 hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        {showPreview && previewItem && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowPreview(false)} />
            <div className="relative w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Detail Konten</h3>
                <button className="text-slate-600" onClick={() => setShowPreview(false)}>Tutup</button>
              </div>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl overflow-hidden bg-yellow-50 h-48 flex items-center justify-center">
                  {previewItem.thumbnail_url ? (
                    <img src={previewItem.thumbnail_url} alt="thumb" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-slate-400">No image</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{previewItem.tipe}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{previewItem.umur_target || 'Semua Umur'}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{previewItem.durasi_baca || '5 Menit Baca'}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">{previewItem.judul}</h2>
                {previewItem.ringkasan && (
                  <div>
                    <h4 className="font-semibold">Ringkasan</h4>
                    <p className="text-slate-600">{previewItem.ringkasan}</p>
                  </div>
                )}

                {/* Tutorial steps */}
                {(() => {
                  const steps = (previewItem.konten || '').split(/\n/).map(s=>s.trim()).filter(Boolean).filter(s=>/^\d+\./.test(s));
                  if (steps.length === 0) {
                    // fallback: take first 5 paragraph lines
                    const parts = (previewItem.konten || '').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
                    for (let i=0;i<Math.min(5, parts.length); i++) steps.push(parts[i]);
                  }
                  if (steps.length>0) {
                    return (
                      <div>
                        <h4 className="font-semibold mb-3">Tutorial Edukasi</h4>
                        <div className="space-y-3">
                          {steps.map((s, i) => (
                            <div key={i} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                              <div className="text-blue-600 font-bold w-8 h-8 flex items-center justify-center rounded-full bg-blue-50">{i+1}</div>
                              <div className="text-slate-700">{s.replace(/^\d+\.\s*/, '')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null;
                })()}

                {/* Materi Inti (accordion-like simple) */}
                {(() => {
                  const parts = (previewItem.konten || '').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
                  if (parts.length>0) {
                    return (
                      <div>
                        <h4 className="font-semibold mb-2">Materi Inti</h4>
                        <div className="space-y-2">
                          {parts.slice(0,5).map((p, idx) => (
                            <details key={idx} className="rounded-xl border border-slate-100 p-3">
                              <summary className="cursor-pointer font-medium">{p.split(/[\.\n]/)[0].slice(0,60)}</summary>
                              <div className="mt-2 text-slate-600">{p}</div>
                            </details>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null;
                })()}

                {/* Yang Perlu Diingat */}
                {(() => {
                  const reminders = (previewItem.konten || '').split(/\n/).map(s=>s.trim()).filter(s=>/^[-•*]/.test(s));
                  if (reminders.length===0) {
                    const parts = (previewItem.konten || '').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
                    reminders.push(...parts.slice(-3));
                  }
                  if (reminders.length>0) {
                    return (
                      <div className="rounded-xl bg-blue-50 p-4">
                        <h4 className="font-semibold mb-2">Yang Perlu Diingat</h4>
                        <ul className="list-disc pl-5 text-slate-700">
                          {reminders.map((r, i) => <li key={i}>{r.replace(/^[-•*]\s*/, '')}</li>)}
                        </ul>
                      </div>
                    )
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default InformasiUmumManagement;