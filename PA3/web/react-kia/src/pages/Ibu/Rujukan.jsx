// src/pages/Ibu/Rujukan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getRujukanByKehamilanId, createRujukan, updateRujukan } from "../../services/rujukanService";
import { getCurrentUser, isBidanUser } from "../../services/auth";
import { Save, Plus, Edit2, CheckCircle, X, Eye, EyeOff, ArrowLeft } from "lucide-react";

// ============================================================
// KOMPONEN EMPTY STATE
// ============================================================
const EmptyState = ({ title, message, onAdd, canAdd }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-[#185FA5]/10 rounded-full">
        <Plus size={48} className="text-[#185FA5]" />
      </div>
      <h3 className="text-[22px] font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 text-base max-w-md">{message}</p>
      {canAdd && (
        <button
          onClick={onAdd}
          className="bg-[#185FA5] text-white rounded-lg px-5 py-2.5 font-semibold flex items-center gap-2 text-base"
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
    <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{label}</span>
    <span className="text-base text-gray-800 font-semibold mt-0.5">{value ?? "-"}</span>
  </div>
);

// ============================================================
// KOMPONEN DETAIL RUJUKAN
// ============================================================
const DetailRujukan = ({ data, onEdit, canEdit }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-[#3B6D11]">
        <CheckCircle size={20} />
        <h2 className="text-[22px] font-semibold text-gray-800">Data Rujukan</h2>
      </div>
      {canEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-sm text-[#185FA5] border border-[#185FA5] px-3 py-1.5 rounded-lg hover:bg-[#185FA5]/5 font-semibold"
        >
          <Edit2 size={14} /> Edit
        </button>
      )}
    </div>

    <div>
      <h3 className="font-semibold text-[#185FA5] text-base mb-3">Rujukan ke FKRTL</h3>
      <p className="text-sm text-gray-500 mb-2">FKRTL = Fasilitas Kesehatan Rujukan Tingkat Lanjut (RS)</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
        <DetailItem label="Resume Pemeriksaan & Tatalaksana" value={data.rujukan_resume_pemeriksaan_tatalaksana} />
        <DetailItem label="Diagnosis Akhir" value={data.rujukan_diagnosis_akhir} />
        <DetailItem label="Alasan Dirujuk ke FKRTL" value={data.rujukan_alasan_dirujuk_ke_fkrtl} />
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-[#185FA5] text-base mb-3">Rujukan Balik</h3>
      <p className="text-sm text-gray-500 mb-2">Rujukan balik dari FKRTL ke fasilitas kesehatan tingkat pertama</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
        <DetailItem label="Tanggal Rujukan Balik" value={data.rujukan_balik_tanggal ? new Date(data.rujukan_balik_tanggal).toLocaleDateString("id-ID") : "-"} />
        <DetailItem label="Diagnosis Akhir" value={data.rujukan_balik_diagnosis_akhir} />
        <DetailItem label="Resume Pemeriksaan & Tatalaksana" value={data.rujukan_balik_resume_pemeriksaan_tatalaksana} />
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-[#185FA5] text-base mb-3">Anjuran</h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <DetailItem label="Rekomendasi Tempat Melahirkan" value={data.anjuran_rekomendasi_tempat_melahirkan} />
      </div>
    </div>
  </div>
);

export default function Rujukan() {
  const { id: ibuId } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isDokter = isBidanUser(user);

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
  const [isActive, setIsActive] = useState(true);

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
        const kehamilanList = await getKehamilanByIbuId(ibuId);
        if (!kehamilanList.length) {
          await Swal.fire({
            icon: 'info',
            title: 'Informasi',
            text: 'Ibu belum memiliki data kehamilan.',
            confirmButtonColor: '#4f46e5'
          });
          navigate(`/data-ibu/${ibuId}`);
          return;
        }
        // Ambil kehamilan pertama (bisa disesuaikan dengan kehamilan_id dari URL jika ada)
        const aktifKehamilan = kehamilanList[0];
        setKehamilan(aktifKehamilan);
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
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Gagal memuat data kehamilan. Silakan coba lagi.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ibuId, navigate]);

  const handleChange = (e) => {
    if (!canEdit) return;
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Anda tidak memiliki izin untuk mengubah data.'
      });
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
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data rujukan berhasil disimpan',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Gagal menyimpan data";
      Swal.fire('Error', 'Gagal menyimpan rujukan: ' + errorMsg, 'error');
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

  if (loading) return <MainLayout><div className="min-h-screen bg-[#F7FAFB] flex items-center justify-center"><div className="text-[#185FA5] text-base">Memuat data...</div></div></MainLayout>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7FAFB]">
        <div className="max-w-5xl mx-auto p-5 space-y-5">
          {/* Header dengan tombol kembali */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-200 transition">
              <ArrowLeft size={20} className="text-[#185FA5]" />
            </button>
            <div>
              <h1 className="text-[28px] font-bold text-gray-900">Rujukan Medis</h1>
              <p className="text-gray-500 text-base">Dokumentasi rujukan ke FKRTL dan rujukan balik.</p>
            </div>
          </div>

          {/* Banner peringatan status kehamilan dan hak akses */}
          {!isActive && (
            <div className="bg-gray-100 border-l-4 border-gray-500 p-3 rounded text-gray-700 text-base flex items-center gap-2">
              <EyeOff size={16} className="text-gray-600" />
              <span>Kehamilan ini sudah selesai (NON-AKTIF). Data hanya dapat dilihat, tidak dapat diubah atau ditambahkan.</span>
            </div>
          )}
          {!canEdit && isActive && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-700 text-base flex items-center gap-2">
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
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-[22px] font-semibold text-[#185FA5]">
                  {data ? "Edit Rujukan" : "Tambah Rujukan"}
                </h2>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-base text-[#185FA5] border border-[#185FA5] px-4 py-1.5 rounded-lg font-semibold hover:bg-[#185FA5]/5"
                >
                  <X size={16} /> Batal
                </button>
              </div>

              {/* Rujukan ke FKRTL */}
              <div>
                <h3 className="font-semibold text-base text-[#185FA5] mb-3">Rujukan ke FKRTL</h3>
                <p className="text-sm text-gray-500 mb-3">FKRTL = Fasilitas Kesehatan Rujukan Tingkat Lanjut (Rumah Sakit)</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-medium mb-1">Resume Pemeriksaan & Tatalaksana</label>
                    <textarea
                      name="rujukan_resume_pemeriksaan_tatalaksana"
                      value={form.rujukan_resume_pemeriksaan_tatalaksana}
                      onChange={handleChange}
                      disabled={!canEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] disabled:bg-gray-100"
                      rows="3"
                      placeholder="Ringkasan hasil pemeriksaan dan tatalaksana yang telah diberikan"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1">Diagnosis Akhir</label>
                    <input
                      name="rujukan_diagnosis_akhir"
                      value={form.rujukan_diagnosis_akhir}
                      onChange={handleChange}
                      disabled={!canEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] disabled:bg-gray-100"
                      placeholder="Diagnosis akhir sebelum dirujuk"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1">Alasan Dirujuk ke FKRTL</label>
                    <textarea
                      name="rujukan_alasan_dirujuk_ke_fkrtl"
                      value={form.rujukan_alasan_dirujuk_ke_fkrtl}
                      onChange={handleChange}
                      disabled={!canEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] disabled:bg-gray-100"
                      rows="3"
                      placeholder="Jelaskan alasan perlunya rujukan ke rumah sakit"
                    />
                  </div>
                </div>
              </div>

              {/* Rujukan Balik */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-base text-[#185FA5] mb-3">Rujukan Balik</h3>
                <p className="text-sm text-gray-500 mb-3">Rujukan balik dari FKRTL ke fasilitas kesehatan tingkat pertama</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-medium mb-1">Tanggal Rujukan Balik</label>
                    <input
                      type="date"
                      name="rujukan_balik_tanggal"
                      value={form.rujukan_balik_tanggal}
                      onChange={handleChange}
                      disabled={!canEdit}
                      className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-base focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1">Diagnosis Akhir (dari RS)</label>
                    <input
                      name="rujukan_balik_diagnosis_akhir"
                      value={form.rujukan_balik_diagnosis_akhir}
                      onChange={handleChange}
                      disabled={!canEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] disabled:bg-gray-100"
                      placeholder="Diagnosis dari rumah sakit"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium mb-1">Resume Pemeriksaan & Tatalaksana (dari RS)</label>
                    <textarea
                      name="rujukan_balik_resume_pemeriksaan_tatalaksana"
                      value={form.rujukan_balik_resume_pemeriksaan_tatalaksana}
                      onChange={handleChange}
                      disabled={!canEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] disabled:bg-gray-100"
                      rows="3"
                      placeholder="Ringkasan hasil pemeriksaan dan tatalaksana dari rumah sakit"
                    />
                  </div>
                </div>
              </div>

              {/* Anjuran */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-base text-[#185FA5] mb-3">Anjuran</h3>
                <div>
                  <label className="block text-base font-medium mb-1">Rekomendasi Tempat Melahirkan</label>
                  <input
                    name="anjuran_rekomendasi_tempat_melahirkan"
                    value={form.anjuran_rekomendasi_tempat_melahirkan}
                    onChange={handleChange}
                    disabled={!canEdit}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] disabled:bg-gray-100"
                    placeholder="Contoh: RSUD X, Klinik Y"
                  />
                </div>
              </div>

              {canEdit && (
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 border border-[#185FA5] text-[#185FA5] rounded-lg font-semibold text-base"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#185FA5] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-base font-semibold hover:bg-[#185FA5]/90 disabled:opacity-50"
                  >
                    <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Rujukan"}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}