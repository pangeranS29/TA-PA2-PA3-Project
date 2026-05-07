// src/pages/Ibu/SkriningDMGestasional.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getSkriningDMByKehamilanId, createSkriningDM, updateSkriningDM } from "../../services/rujukanService";
import { Save, ArrowLeft, Loader2, Edit, Plus, X } from "lucide-react";

export default function SkriningDMGestasional() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kehamilan, setKehamilan] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false); // kontrol tampilan form

  const [form, setForm] = useState({
    gula_darah_puasa_hasil: "",
    gula_darah_puasa_rencana_tindak_lanjut: "",
    gula_darah_2_jam_post_prandial_hasil: "",
    gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: "",
  });

  // Fetch data kehamilan dan skrining
  const fetchData = async () => {
    try {
      const kehamilanList = await getKehamilanByIbuId(id);
      if (kehamilanList.length > 0) {
        const aktif = kehamilanList[0];
        setKehamilan(aktif);
        const result = await getSkriningDMByKehamilanId(aktif.id);
        if (result && result.length > 0) {
          const d = result[0];
          setData(d);
          setForm({
            gula_darah_puasa_hasil: d.gula_darah_puasa_hasil || "",
            gula_darah_puasa_rencana_tindak_lanjut: d.gula_darah_puasa_rencana_tindak_lanjut || "",
            gula_darah_2_jam_post_prandial_hasil: d.gula_darah_2_jam_post_prandial_hasil || "",
            gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: d.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut || "",
          });
        } else {
          setData(null);
          // Reset form ke kosong
          setForm({
            gula_darah_puasa_hasil: "",
            gula_darah_puasa_rencana_tindak_lanjut: "",
            gula_darah_2_jam_post_prandial_hasil: "",
            gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: "",
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) return;
    setSaving(true);
    try {
      const payload = {
        kehamilan_id: kehamilan.id,
        gula_darah_puasa_hasil: form.gula_darah_puasa_hasil || "",
        gula_darah_puasa_rencana_tindak_lanjut: form.gula_darah_puasa_rencana_tindak_lanjut || "",
        gula_darah_2_jam_post_prandial_hasil: form.gula_darah_2_jam_post_prandial_hasil || "",
        gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: form.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut || "",
      };

      if (data) {
        await updateSkriningDM(data.id_skrining_dm, payload);
      } else {
        await createSkriningDM(payload);
      }
      alert("Skrining DM Gestasional berhasil disimpan");
      // Refresh data dan kembali ke mode rekap
      await fetchData();
      setShowForm(false);
    } catch (err) {
      console.error("Gagal simpan:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal menyimpan data skrining DM");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  const handleAdd = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Skrining DM Gestasional</h1>
            <p className="text-gray-500">Pemeriksaan profil glukosa untuk mendeteksi diabetes melitus gestasional.</p>
          </div>
        </div>

        {/* Jika belum ada data dan form tidak aktif, tampilkan tombol buat */}
        {!data && !showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500 mb-4">Belum ada data skrining DM Gestasional.</p>
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-indigo-700"
            >
              <Plus size={18} />
              Buat Skrining DM
            </button>
          </div>
        )}

        {/* Jika sudah ada data dan form tidak aktif, tampilkan rekap data */}
        {data && !showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Rekap Skrining DM Gestasional</h2>
              <button
                onClick={handleEdit}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-indigo-200"
              >
                <Edit size={16} />
                Edit Data
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-medium text-gray-700">1. Gula Darah Puasa (GDP)</h3>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Hasil:</span>
                    <p className="font-medium">{data.gula_darah_puasa_hasil || "-"} mg/dL</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Rencana Tindak Lanjut:</span>
                    <p className="font-medium">{data.gula_darah_puasa_rencana_tindak_lanjut || "-"}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">2. Gula Darah 2 Jam Post Prandial (TTGO 75g)</h3>
                <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Hasil:</span>
                    <p className="font-medium">{data.gula_darah_2_jam_post_prandial_hasil || "-"} mg/dL</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Rencana Tindak Lanjut:</span>
                    <p className="font-medium">{data.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Terakhir diperbarui: {data.updated_at ? new Date(data.updated_at).toLocaleString() : "Belum diperbarui"}
            </div>
          </div>
        )}

        {/* Form input (create / edit) */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{data ? "Edit Skrining DM" : "Buat Skrining DM Baru"}</h2>
              <button type="button" onClick={handleCancelForm} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-indigo-800 mb-2">Test Toleransi Glukosa Oral (TTGO)</h2>
              <p className="text-sm text-indigo-700">Dilakukan umumnya pada usia kehamilan 24-28 minggu atau jika terdapat faktor risiko (misal: riwayat keluarga DM, obesitas, riwayat melahirkan bayi besar &gt;4000g, atau riwayat abortus berulang).</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">1. Gula Darah Puasa (GDP)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hasil (mg/dL)</label>
                    <input 
                      type="text" 
                      inputMode="text"
                      name="gula_darah_puasa_hasil" 
                      value={form.gula_darah_puasa_hasil} 
                      onChange={handleChange} 
                      className="w-full border rounded-lg px-3 py-2" 
                      placeholder="Contoh: 90" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Rencana Tindak Lanjut</label>
                    <input 
                      type="text"
                      name="gula_darah_puasa_rencana_tindak_lanjut" 
                      value={form.gula_darah_puasa_rencana_tindak_lanjut} 
                      onChange={handleChange} 
                      className="w-full border rounded-lg px-3 py-2" 
                      placeholder="Tindakan yang akan dilakukan berdasarkan hasil" 
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Nilai rujukan normal: {"< 92 mg/dL"}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-gray-800">2. Gula Darah 2 Jam Post Prandial (TTGO 75g)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hasil (mg/dL)</label>
                    <input 
                      type="text" 
                      inputMode="test"
                      name="gula_darah_2_jam_post_prandial_hasil" 
                      value={form.gula_darah_2_jam_post_prandial_hasil} 
                      onChange={handleChange} 
                      className="w-full border rounded-lg px-3 py-2" 
                      placeholder="Contoh: Normal" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Rencana Tindak Lanjut</label>
                    <input 
                      type="text"
                      name="gula_darah_2_jam_post_prandial_rencana_tindak_lanjut" 
                      value={form.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut} 
                      onChange={handleChange} 
                      className="w-full border rounded-lg px-3 py-2" 
                      placeholder="Tindakan yang akan dilakukan berdasarkan hasil" 
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Nilai rujukan normal 2 jam setelah minum glukosa: {"< 153 mg/dL"}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t mt-6">
              <button type="button" onClick={handleCancelForm} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button 
                type="submit" 
                disabled={saving} 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? "Menyimpan..." : "Simpan Data Skrining"}
              </button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}