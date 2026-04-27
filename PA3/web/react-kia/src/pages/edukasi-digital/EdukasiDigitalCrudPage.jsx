import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createEdukasi,
  deleteEdukasi,
  listEdukasi,
  updateEdukasi,
} from "../../services/edukasiDigital";

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
  }, [location.state, view]);

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
    if (createPath) {
      navigate(createPath, { state: { item } });
      return;
    }
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
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold"
              >
                + Tambah Konten
              </button>
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                {loading ? "Memuat..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {sortedRows.length === 0 && !loading ? (
              <p className="text-sm text-slate-500">Belum ada konten.</p>
            ) : null}

            {sortedRows.map((item) => {
              const id = guessId(item);
              return (
                <article
                  key={id || item.judul}
                  className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-semibold text-slate-800">{item.judul || "Tanpa Judul"}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {item.deskripsi || item.isi_konten || item.isi || "Tidak ada deskripsi"}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold hover:bg-amber-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-xs font-semibold hover:bg-rose-200 transition-colors"
                    >
                      Hapus
                    </button>
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
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    />
                  );
                }

                return (
                  <input
                    key={f.key}
                    name={f.key}
                    value={value}
                    onChange={handleChange}
                    placeholder={f.label}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  />
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
          </section>
        )}
      </div>
    </MainLayout>
  );
}
