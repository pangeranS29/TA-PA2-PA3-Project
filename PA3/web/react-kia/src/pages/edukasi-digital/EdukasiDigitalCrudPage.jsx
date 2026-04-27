import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
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

export default function EdukasiDigitalCrudPage({ title, resourcePath }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

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
    loadData();
  }, [resourcePath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toPayload = () => {
    return {
      judul: form.judul.trim(),
      gambar_url: form.gambar_url.trim(),
      deskripsi: form.deskripsi.trim(),
      isi_konten: form.isi_konten.trim(),
      materi_inti: form.materi_inti.trim(),
      hal_penting: form.hal_penting.trim(),
    };
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
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
      resetForm();
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(String(guessId(item)));
    setForm({
      judul: item.judul || "",
      gambar_url: item.gambar_url || "",
      deskripsi: item.deskripsi || "",
      isi_konten: item.isi_konten || item.isi || "",
      materi_inti: item.materi_inti || "",
      hal_penting: item.hal_penting || "",
    });
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

        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editingId ? "Edit Konten" : "Tambah Konten"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Judul edukasi"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
            <input
              name="gambar_url"
              value={form.gambar_url}
              onChange={handleChange}
              placeholder="URL gambar (opsional)"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Deskripsi"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
            <textarea
              name="isi_konten"
              value={form.isi_konten}
              onChange={handleChange}
              placeholder="Isi konten"
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
            <textarea
              name="materi_inti"
              value={form.materi_inti}
              onChange={handleChange}
              placeholder="Materi inti"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
            <textarea
              name="hal_penting"
              value={form.hal_penting}
              onChange={handleChange}
              placeholder="Hal penting"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold"
                >
                  Batal
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Daftar Konten</h2>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              {loading ? "Memuat..." : "Refresh"}
            </button>
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
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <h3 className="font-semibold text-slate-800">{item.judul || "Tanpa Judul"}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {item.deskripsi || item.isi_konten || item.isi || "Tidak ada deskripsi"}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-xs font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
