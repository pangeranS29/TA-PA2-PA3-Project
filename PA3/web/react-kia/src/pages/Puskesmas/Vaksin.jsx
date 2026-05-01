import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/Puskesmas/MainLayout";
import { getVaksinList, updateVaksin, updateVaksinStatus } from "../../services/vaksin";
import VaksinForm from "./VaksinForm";

const cardClass = "bg-white rounded-2xl shadow-sm border border-slate-100";

const emptyForm = {
  jenis_vaksin: "",
  kepanjangan: "",
  ditujukan_kepada: "",
  waktu_pemberian: "",
  deskripsi: "",
  efek_samping: "",
};

export default function VaksinPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetNotice = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const getErrorMessage = (error, fallback) => {
    const status = error?.response?.status;
    if (status === 401) return "Sesi login habis. Silakan login ulang.";
    if (status === 403) return "Anda tidak memiliki akses ke data vaksin.";
    if (status === 404) return "Endpoint vaksin tidak ditemukan. Pastikan backend berjalan.";
    const message = error?.response?.data?.message;
    if (Array.isArray(message) && message[0]) return message[0];
    if (typeof message === "string") return message;
    return fallback;
  };

  const normalizePayload = (values) => {
    const trim = (value) => (value || "").trim();
    return {
      jenis_vaksin: trim(values.jenis_vaksin),
      kepanjangan: trim(values.kepanjangan),
      ditujukan_kepada: trim(values.ditujukan_kepada),
      waktu_pemberian: trim(values.waktu_pemberian),
      deskripsi: trim(values.deskripsi),
      efek_samping: trim(values.efek_samping),
    };
  };

  const normalizeVaksin = (item) => {
    const source = item || {};
    const rawId = source.id ?? source.ID ?? source["id\t"] ?? source["id\n"];
    const fallbackKey = Object.keys(source).find(
      (key) => key.toString().trim().toLowerCase() === "id"
    );
    const idValue = rawId ?? (fallbackKey ? source[fallbackKey] : undefined);
    const parsedId = Number(idValue);
    const statusValue = (source.status || "aktif").toString().trim().toLowerCase();

    return {
      ...source,
      id: Number.isFinite(parsedId) ? parsedId : undefined,
      status: statusValue,
    };
  };

  const loadData = async () => {
    setLoading(true);
    resetNotice();
    try {
      const data = await getVaksinList();
      const normalized = Array.isArray(data) ? data.map(normalizeVaksin) : [];
      setItems(normalized);
    } catch (error) {
      setItems([]);
      setErrorMessage(getErrorMessage(error, "Gagal memuat data vaksin"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.notice) {
      setSuccessMessage(location.state.notice);
      navigate("/vaksin", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (location.state?.editId && items.length > 0) {
      const selected = items.find((item) => item.id === location.state.editId);
      if (selected) {
        startEdit(selected);
        navigate("/vaksin", { replace: true, state: {} });
      }
    }
  }, [items, location.state, navigate]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => {
      const jenis = (item.jenis_vaksin || "").toLowerCase();
      const kepanjangan = (item.kepanjangan || "").toLowerCase();
      const target = (item.ditujukan_kepada || "").toLowerCase();
      const waktu = (item.waktu_pemberian || "").toLowerCase();
      const deskripsi = (item.deskripsi || "").toLowerCase();
      const efek = (item.efek_samping || "").toLowerCase();
      const status = (item.status || "").toLowerCase();
      return (
        jenis.includes(keyword) ||
        kepanjangan.includes(keyword) ||
        target.includes(keyword) ||
        waktu.includes(keyword) ||
        deskripsi.includes(keyword) ||
        efek.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }, [items, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startEdit = (item) => {
    if (!item?.id) {
      setErrorMessage("Format ID Vaksin tidak valid, harus angka");
      return;
    }
    resetNotice();
    setEditingId(item.id);
    setForm({
      jenis_vaksin: item.jenis_vaksin || "",
      kepanjangan: item.kepanjangan || "",
      ditujukan_kepada: item.ditujukan_kepada || "",
      waktu_pemberian: item.waktu_pemberian || "",
      deskripsi: item.deskripsi || "",
      efek_samping: item.efek_samping || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingId) return;

    const payload = normalizePayload(form);
    if (!payload.jenis_vaksin || !payload.kepanjangan || !payload.deskripsi || !payload.efek_samping) {
      setErrorMessage("Jenis vaksin, kepanjangan, deskripsi, dan efek samping wajib diisi");
      return;
    }

    resetNotice();
    setSaving(true);
    try {
      await updateVaksin(editingId, payload);
      setSuccessMessage("Data vaksin berhasil diperbarui");
      resetForm();
      setCurrentPage(1);
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Gagal menyimpan data vaksin"));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const nextStatus = (status || "").toString().trim().toLowerCase();
    if (!id) {
      setErrorMessage("Format ID Vaksin tidak valid, harus angka");
      return;
    }
    const previousItems = items;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
    resetNotice();
    setSaving(true);
    try {
      await updateVaksinStatus(id, nextStatus);
      setSuccessMessage("Status vaksin berhasil diperbarui");
      await loadData();
    } catch (error) {
      setItems(previousItems);
      setErrorMessage(getErrorMessage(error, "Gagal memperbarui status vaksin"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className={`${cardClass} p-6 space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari Vaksin..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                resetNotice();
                navigate("/vaksin/tambah");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-bold"
            >
              <Plus size={18} /> Tambah Vaksin
            </button>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kepanjangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ditujukan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center">Memuat...</td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center">Tidak ada data</td>
                    </tr>
                  ) : (
                    currentItems.map((item) => {
                      const isNonaktif = item.status === "nonaktif";
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{item.jenis_vaksin || "-"}</td>
                        <td className="px-6 py-4 text-sm">{item.kepanjangan || "-"}</td>
                        <td className="px-6 py-4 text-sm">{item.ditujukan_kepada || "-"}</td>
                        <td className="px-6 py-4 text-sm">{item.waktu_pemberian || "-"}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              item.status === "nonaktif"
                                ? "bg-rose-50 text-rose-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {item.status || "aktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!item.id) {
                                  setErrorMessage("Format ID Vaksin tidak valid, harus angka");
                                  return;
                                }
                                navigate(`/vaksin/${item.id}`);
                              }}
                              className="rounded-lg border border-sky-200 bg-sky-50 p-2 text-sky-600 hover:bg-sky-100"
                              aria-label="Lihat"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!item.id) {
                                  setErrorMessage("Format ID Vaksin tidak valid, harus angka");
                                  return;
                                }
                                navigate(`/vaksin/${item.id}/edit`);
                              }}
                              disabled={isNonaktif}
                              className={`rounded-lg border p-2 ${
                                isNonaktif
                                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                  : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                              }`}
                              aria-label="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <select
                              value={item.status || "aktif"}
                              onChange={(event) => handleStatusChange(item.id, event.target.value)}
                              className={`rounded-lg border px-2 py-1 text-xs font-semibold ${
                                item.status === "nonaktif"
                                  ? "border-rose-200 bg-rose-50 text-rose-600"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              <option
                                value="aktif"
                                className="text-emerald-600"
                                style={{ backgroundColor: "#ecfdf5", color: "#16a34a" }}
                              >
                                Aktif
                              </option>
                              <option
                                value="nonaktif"
                                className="text-rose-600"
                                style={{ backgroundColor: "#fff1f2", color: "#e11d48" }}
                              >
                                Nonaktif
                              </option>
                            </select>
                          </div>
                        </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Menampilkan {currentItems.length} dari {filteredItems.length} data
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2">Halaman {currentPage} dari {totalPages || 1}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={resetForm}
          />
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Edit Vaksin</h2>
                <p className="text-xs text-slate-500 mt-1">Perbarui informasi vaksin sebelum disimpan.</p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <VaksinForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              saving={saving}
              submitLabel="Simpan Perubahan"
              showCancel
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
