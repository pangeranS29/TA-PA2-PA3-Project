// src/pages/Ibu/Rujukan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getRujukanByKehamilanId, createRujukan, updateRujukan } from "../../services/rujukanService";
import { Save, Home, Plus, Edit2, CheckCircle, X } from "lucide-react";

// ============================================================
// KOMPONEN EMPTY STATE
// ============================================================
const EmptyState = ({ title, message, onAdd }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-indigo-50 rounded-full">
        <Plus size={40} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
      <button
        onClick={onAdd}
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
      >
        <Plus size={18} /> Tambah Rujukan
      </button>
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
const DetailRujukan = ({ data, onEdit }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle size={20} />
        <h2 className="text-lg font-semibold text-gray-800">Data Rujukan</h2>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
      >
        <Edit2 size={14} /> Edit
      </button>
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
        <DetailItem label="Tanggal Rujukan Balik" value={data.rujukan_balik_tanggal} />
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

  // Breadcrumb component
  const Breadcrumb = () => {
    if (!kehamilan) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <Home size={14} /> Beranda
        </Link>
        <span>/</span>
        <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
        <span>/</span>
        <Link to={`/data-ibu/${id}?kehamilan_id=${kehamilan.id}`} className="hover:text-indigo-600">
          Detail Ibu
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Rujukan</span>
      </div>
    );
  };

  // Fungsi untuk mereset form ke kosong
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

  // Fungsi untuk mengisi form dengan data rujukan yang ada
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
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);
          const result = await getRujukanByKehamilanId(aktif.id);
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setMode("form");
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
        {/* Breadcrumb */}
        <Breadcrumb />

        <h1 className="text-2xl font-bold mb-2">Rujukan</h1>
        <p className="text-gray-500 mb-6">Dokumentasi rujukan ke FKRTL dan rujukan balik.</p>

        {mode === "empty" && (
          <EmptyState
            title="Belum Ada Data Rujukan"
            message="Silakan tambah data rujukan untuk ibu ini."
            onAdd={() => setMode("form")}
          />
        )}

        {mode === "detail" && data && (
          <DetailRujukan data={data} onEdit={handleEdit} />
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
                <div><label className="block text-sm font-medium mb-1">Resume Pemeriksaan & Tatalaksana</label><textarea name="rujukan_resume_pemeriksaan_tatalaksana" value={form.rujukan_resume_pemeriksaan_tatalaksana} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows="3" /></div>
                <div><label className="block text-sm font-medium mb-1">Diagnosis Akhir</label><input name="rujukan_diagnosis_akhir" value={form.rujukan_diagnosis_akhir} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Alasan Dirujuk ke FKRTL</label><textarea name="rujukan_alasan_dirujuk_ke_fkrtl" value={form.rujukan_alasan_dirujuk_ke_fkrtl} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows="3" /></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-indigo-700">Rujukan Balik</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Tanggal Rujukan Balik</label><input type="date" name="rujukan_balik_tanggal" value={form.rujukan_balik_tanggal} onChange={handleChange} className="w-full max-w-xs border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Diagnosis Akhir</label><input name="rujukan_balik_diagnosis_akhir" value={form.rujukan_balik_diagnosis_akhir} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Resume Pemeriksaan & Tatalaksana</label><textarea name="rujukan_balik_resume_pemeriksaan_tatalaksana" value={form.rujukan_balik_resume_pemeriksaan_tatalaksana} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows="3" /></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-indigo-700">Anjuran</h3>
              <div><label className="block text-sm font-medium mb-1">Rekomendasi Tempat Melahirkan</label><input name="anjuran_rekomendasi_tempat_melahirkan" value={form.anjuran_rekomendasi_tempat_melahirkan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            </div>
            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
              <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Rujukan"}
            </button>
          </form>
        )}
      </div>
    </MainLayout>
  );
}