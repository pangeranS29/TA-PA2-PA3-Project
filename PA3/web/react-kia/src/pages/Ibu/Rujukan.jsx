// src/pages/Ibu/Rujukan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getRujukanByKehamilanId, createRujukan, updateRujukan } from "../../services/rujukanService";
import { getCurrentUser, isDokterUser } from "../../services/auth";
import { Save, Home, Plus, Edit2, CheckCircle, X, Eye, EyeOff } from "lucide-react";

// ============================================================
// KOMPONEN EMPTY STATE
// ============================================================
const EmptyState = ({ title, message, onAdd, canAdd }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-indigo-50 rounded-full">
        <Plus size={40} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
      {canAdd && (
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Tambah Rujukan
        </button>
      )}
      {!canAdd && (
        <p className="text-gray-400 text-sm mt-2">Tidak dapat menambah data karena kehamilan sudah selesai.</p>
      )}
    </div>
  </div>
);

// ============================================================
// KOMPONEN DETAIL ITEM
// ============================================================
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800 font-semibold mt-0.5">{value ?? "-"}</span>
  </div>
);

// ============================================================
// KOMPONEN DETAIL RUJUKAN
// ============================================================
const DetailRujukan = ({ data, onEdit, canEdit }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle size={20} />
        <h2 className="text-lg font-semibold text-gray-800">Data Rujukan</h2>
      </div>
      {canEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
        >
          <Edit2 size={14} /> Edit
        </button>
      )}
    </div>

    <div>
      <h3 className="font-semibold text-indigo-700 mb-3">Rujukan ke FKRTL</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
        <DetailItem label="Resume Pemeriksaan & Tatalaksana" value={data.rujukan_resume_pemeriksaan_tatalaksana} />
        <DetailItem label="Diagnosis Akhir" value={data.rujukan_diagnosis_akhir} />
        <DetailItem label="Alasan Dirujuk ke FKRTL" value={data.rujukan_alasan_dirujuk_ke_fkrtl} />
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-indigo-700 mb-3">Rujukan Balik</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
        <DetailItem label="Tanggal Rujukan Balik" value={data.rujukan_balik_tanggal ? new Date(data.rujukan_balik_tanggal).toLocaleDateString("id-ID") : "-"} />
        <DetailItem label="Diagnosis Akhir" value={data.rujukan_balik_diagnosis_akhir} />
        <DetailItem label="Resume Pemeriksaan & Tatalaksana" value={data.rujukan_balik_resume_pemeriksaan_tatalaksana} />
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-indigo-700 mb-3">Anjuran</h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <DetailItem label="Rekomendasi Tempat Melahirkan" value={data.anjuran_rekomendasi_tempat_melahirkan} />
      </div>
    </div>
  </div>
);

export default function Rujukan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isDokter = isDokterUser(user);

  const [kehamilan, setKehamilan] = useState(null);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("empty"); // "empty", "detail", "form"
  const [form, setForm] = useState({
    rujukan_resume_pemeriksaan_tatalaksana: "",
    rujukan_diagnosis_akhir: "",
    rujukan_alasan_dirujuk_ke_fkrtl: "",
    rujukan_balik_tanggal: "",
    rujukan_balik_diagnosis_akhir: "",
    rujukan_balik_resume_pemeriksaan_tatalaksana: "",
    anjuran_rekomendasi_tempat_melahirkan: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true); // status kehamilan aktif

  const canEdit = isDokter && isActive;

  const resetForm = () => {
    setForm({
      rujukan_resume_pemeriksaan_tatalaksana: "",
      rujukan_diagnosis_akhir: "",
      rujukan_alasan_dirujuk_ke_fkrtl: "",
      rujukan_balik_tanggal: "",
      rujukan_balik_diagnosis_akhir: "",
      rujukan_balik_resume_pemeriksaan_tatalaksana: "",
      anjuran_rekomendasi_tempat_melahirkan: "",
    });
  };

  const populateForm = (rujukanData) => {
    setForm({
      rujukan_resume_pemeriksaan_tatalaksana: rujukanData.rujukan_resume_pemeriksaan_tatalaksana || "",
      rujukan_diagnosis_akhir: rujukanData.rujukan_diagnosis_akhir || "",
      rujukan_alasan_dirujuk_ke_fkrtl: rujukanData.rujukan_alasan_dirujuk_ke_fkrtl || "",
      rujukan_balik_tanggal: rujukanData.rujukan_balik_tanggal ? new Date(rujukanData.rujukan_balik_tanggal).toISOString().split("T")[0] : "",
      rujukan_balik_diagnosis_akhir: rujukanData.rujukan_balik_diagnosis_akhir || "",
      rujukan_balik_resume_pemeriksaan_tatalaksana: rujukanData.rujukan_balik_resume_pemeriksaan_tatalaksana || "",
      anjuran_rekomendasi_tempat_melahirkan: rujukanData.anjuran_rekomendasi_tempat_melahirkan || "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          // Ambil kehamilan yang sedang aktif? Asumsikan ambil pertama, atau bisa juga filter berdasarkan kehamilan_id dari URL
          // Untuk sederhananya kita ambil yang pertama, namun sebaiknya pakai kehamilan_id dari URL jika ada
          const aktifKehamilan = kehamilanList[0];
          setKehamilan(aktifKehamilan);
          
          // Tentukan status aktif (NON-AKTIF = tidak aktif)
          const status = aktifKehamilan.status_kehamilan || "";
          const aktif = status !== "NON-AKTIF";
          setIsActive(aktif);

          const result = await getRujukanByKehamilanId(aktifKehamilan.id);
          if (result && result.length > 0) {
            const d = result[0];
            setData(d);
            populateForm(d);
            setMode("detail");
          } else {
            setMode("empty");
            resetForm();
          }
        } else {
          setMode("empty");
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data kehamilan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    if (!canEdit) return;
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("Anda tidak memiliki izin untuk mengubah data.");
      return;
    }
    if (!kehamilan) return;
    setSaving(true);
    try {
      const payload = {
        kehamilan_id: kehamilan.id,
        rujukan_resume_pemeriksaan_tatalaksana: form.rujukan_resume_pemeriksaan_tatalaksana,
        rujukan_diagnosis_akhir: form.rujukan_diagnosis_akhir,
        rujukan_alasan_dirujuk_ke_fkrtl: form.rujukan_alasan_dirujuk_ke_fkrtl,
        rujukan_balik_tanggal: form.rujukan_balik_tanggal || null,
        rujukan_balik_diagnosis_akhir: form.rujukan_balik_diagnosis_akhir,
        rujukan_balik_resume_pemeriksaan_tatalaksana: form.rujukan_balik_resume_pemeriksaan_tatalaksana,
        anjuran_rekomendasi_tempat_melahirkan: form.anjuran_rekomendasi_tempat_melahirkan,
      };

      if (data) {
        await updateRujukan(data.id, payload);
      } else {
        const newData = await createRujukan(payload);
        setData(newData);
      }

      // Refresh data setelah simpan
      const refreshed = await getRujukanByKehamilanId(kehamilan.id);
      if (refreshed && refreshed.length > 0) {
        const d = refreshed[0];
        setData(d);
        populateForm(d);
        setMode("detail");
      } else {
        setMode("empty");
        resetForm();
      }

      alert("Data rujukan berhasil disimpan");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error tidak diketahui";
      alert("Gagal menyimpan rujukan: " + errorMsg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (canEdit) setMode("form");
  };

  const handleCancel = () => {
    if (data) {
      setMode("detail");
      populateForm(data);
    } else {
      setMode("empty");
      resetForm();
    }
  };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl">
        <h1 className="text-2xl font-bold mb-2">Rujukan</h1>
        <p className="text-gray-500 mb-6">Dokumentasi rujukan ke FKRTL dan rujukan balik.</p>

        {!isActive && (
          <div className="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded flex items-center gap-2">
            <EyeOff size={20} className="text-gray-600" />
            <span className="text-gray-800">Kehamilan ini sudah selesai (NON-AKTIF). Data hanya dapat dilihat, tidak dapat diubah atau ditambahkan.</span>
          </div>
        )}

        {!canEdit && isActive && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm flex items-center gap-2">
            <Eye size={16} /> Anda dalam mode baca (Bidan). Data hanya dapat dilihat, tidak dapat diubah.
          </div>
        )}

        {mode === "empty" && (
          <EmptyState
            title="Belum Ada Data Rujukan"
            message="Silakan tambah data rujukan untuk ibu ini."
            onAdd={() => setMode("form")}
            canAdd={canEdit}
          />
        )}

        {mode === "detail" && data && (
          <DetailRujukan data={data} onEdit={handleEdit} canEdit={canEdit} />
        )}

        {mode === "form" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-700">
                {data ? "Edit Rujukan" : "Tambah Rujukan"}
              </h2>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <X size={14} /> Batal
              </button>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-indigo-700">Rujukan ke FKRTL</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Resume Pemeriksaan & Tatalaksana</label>
                  <textarea
                    name="rujukan_resume_pemeriksaan_tatalaksana"
                    value={form.rujukan_resume_pemeriksaan_tatalaksana}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diagnosis Akhir</label>
                  <input
                    name="rujukan_diagnosis_akhir"
                    value={form.rujukan_diagnosis_akhir}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alasan Dirujuk ke FKRTL</label>
                  <textarea
                    name="rujukan_alasan_dirujuk_ke_fkrtl"
                    value={form.rujukan_alasan_dirujuk_ke_fkrtl}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-indigo-700">Rujukan Balik</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Rujukan Balik</label>
                  <input
                    type="date"
                    name="rujukan_balik_tanggal"
                    value={form.rujukan_balik_tanggal}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className="w-full max-w-xs border rounded-lg px-3 py-2 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diagnosis Akhir</label>
                  <input
                    name="rujukan_balik_diagnosis_akhir"
                    value={form.rujukan_balik_diagnosis_akhir}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Resume Pemeriksaan & Tatalaksana</label>
                  <textarea
                    name="rujukan_balik_resume_pemeriksaan_tatalaksana"
                    value={form.rujukan_balik_resume_pemeriksaan_tatalaksana}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-indigo-700">Anjuran</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Rekomendasi Tempat Melahirkan</label>
                <input
                  name="anjuran_rekomendasi_tempat_melahirkan"
                  value={form.anjuran_rekomendasi_tempat_melahirkan}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                />
              </div>
            </div>

            {canEdit && (
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Rujukan"}
              </button>
            )}
          </form>
        )}
      </div>
    </MainLayout>
  );
}