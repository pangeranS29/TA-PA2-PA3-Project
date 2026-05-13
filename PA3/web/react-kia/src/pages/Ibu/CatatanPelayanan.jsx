// src/pages/Ibu/CatatanPelayanan.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { catatanT1, catatanT2, catatanT3, catatanNifas } from "../../services/catatanPelayanan";
import { Save, Plus, Trash2, AlertCircle } from "lucide-react";

const services = { T1: catatanT1, T2: catatanT2, T3: catatanT3, Nifas: catatanNifas };
const tabLabels = { T1: "Trimester 1", T2: "Trimester 2", T3: "Trimester 3", Nifas: "Nifas" };

export default function CatatanPelayanan() {
  const { id } = useParams();
  const [kehamilan, setKehamilan] = useState(null);
  const [activeTab, setActiveTab] = useState("T1");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    tanggal_periksa_stamp_paraf: "",
    keluhan_pemeriksaan_tindakan_saran: "",
    tanggal_kembali: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Helper untuk mendapatkan field ID yang tepat berdasarkan tab
  const getIdFieldName = (tab) => {
    if (tab === "Nifas") return "id_catatan_nifas";
    if (tab === "T3") return "id_catatan_t3";
    return "id_catatan";
  };

  // Fetch kehamilan dan catatan saat komponen mount atau tab berubah
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);

          // Fetch catatan untuk trimester aktif
          const svc = services[activeTab];
          const data = await svc.getByKehamilanId(aktif.id);
          setRecords(data || []);
        } else {
          setError("Data kehamilan tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, activeTab]);

  // Handler perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler submit form - CREATE catatan baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) {
      setError("Data kehamilan tidak ditemukan");
      return;
    }

    // Validasi input
    if (!form.tanggal_periksa_stamp_paraf?.trim()) {
      setError("Tanggal periksa harus diisi");
      return;
    }
    if (!form.keluhan_pemeriksaan_tindakan_saran?.trim()) {
      setError("Keluhan/Pemeriksaan/Tindakan/Saran harus diisi");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const svc = services[activeTab];
      const payload = {
        ...form,
        kehamilan_id: kehamilan.id,
      };

      // Call API create
      const created = await svc.create(payload);

      // PENTING: Tambahkan data yang baru dibuat ke dalam list
      // Frontend harus refresh data setelah Create
      setRecords((prev) => [created, ...prev]);

      // Reset form
      setForm({
        tanggal_periksa_stamp_paraf: "",
        keluhan_pemeriksaan_tindakan_saran: "",
        tanggal_kembali: "",
      });

      setSuccessMessage("Catatan pelayanan berhasil ditambahkan");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error creating catatan:", err);
      setError(
        "Gagal menyimpan catatan: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  // Handler DELETE catatan
  const handleDelete = async (recordId) => {
    const result = await Swal.fire({
      title: 'Hapus Catatan?',
      text: 'Yakin ingin menghapus catatan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    setDeleteLoading(recordId);
    setError(null);
    try {
      const svc = services[activeTab];
      await svc.delete(recordId);

      // PENTING: Hapus dari state setelah Delete berhasil
      setRecords((prev) => prev.filter((r) => r[getIdFieldName(activeTab)] !== recordId));

      setSuccessMessage("Catatan berhasil dihapus");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting catatan:", err);
      setError(
        "Gagal menghapus catatan: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const idKey = getIdFieldName(activeTab);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Catatan Pelayanan</h1>
        <p className="text-gray-500 mb-6">
          Catatan kunjungan pelayanan per trimester dan nifas.
        </p>

        {/* Pesan error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Pesan sukses */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Tab buttons */}
        <div className="flex gap-2 mb-6 border-b">
          {Object.keys(tabLabels).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setError(null);
                setSuccessMessage(null);
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Tabel Catatan - Riwayat */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">
            Riwayat Catatan - {tabLabels[activeTab]}
          </h3>

          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tanggal Periksa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Keluhan / Pemeriksaan / Tindakan / Saran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tanggal Kembali
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((r, idx) => (
                    <tr key={r[idKey] || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.tanggal_periksa_stamp_paraf
                          ? new Date(r.tanggal_periksa_stamp_paraf).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-pre-wrap max-w-xs">
                        {r.keluhan_pemeriksaan_tindakan_saran || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.tanggal_kembali
                          ? new Date(r.tanggal_kembali).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(r[idKey])}
                          disabled={deleteLoading === r[idKey]}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === r[idKey] ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-1 border-red-600 border-t-transparent"></div>
                              Hapus...
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Hapus
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              Belum ada catatan pelayanan {tabLabels[activeTab]}.
            </p>
          )}
        </div>

        {/* Form Tambah Catatan */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4"
        >
          <h3 className="font-semibold text-lg">Tambah Catatan Baru - {tabLabels[activeTab]}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Periksa / Stempel / Paraf
              </label>
              <input
                type="date"
                name="tanggal_periksa_stamp_paraf"
                value={form.tanggal_periksa_stamp_paraf}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Kembali
              </label>
              <input
                type="date"
                name="tanggal_kembali"
                value={form.tanggal_kembali}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keluhan / Pemeriksaan / Tindakan / Saran
            </label>
            <textarea
              name="keluhan_pemeriksaan_tindakan_saran"
              value={form.keluhan_pemeriksaan_tindakan_saran}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="5"
              required
              placeholder="Tuliskan keluhan, hasil pemeriksaan, tindakan yang dilakukan, dan saran untuk pasien..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Plus size={18} />
                Tambah Catatan
              </>
            )}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
