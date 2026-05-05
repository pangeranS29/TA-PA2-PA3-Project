// src/pages/Ibu/SkriningPreeklampsia.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getSkriningByKehamilanId, createSkrining, updateSkrining } from "../../services/skrining";
import { getCurrentUser, isDokterUser } from "../../services/auth";
import {
  AlertCircle, Save, ArrowRight, ShieldAlert, CheckCircle2,
  Edit2, Plus, Heart, Eye, ClipboardList, Home, EyeOff
} from "lucide-react";

const CheckboxToggle = ({ name, label, form, handleChange }) => {
  const isChecked = form[name];
  return (
    <label
      className={`cursor-pointer select-none flex items-center gap-2 text-sm px-4 py-3 rounded-xl border transition-all duration-300 w-full ${
        isChecked
          ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200"
          : "bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
      }`}
    >
      <input type="checkbox" name={name} checked={!!isChecked} onChange={handleChange} className="hidden" />
      {label}
    </label>
  );
};

export default function SkriningPreeklampsia() {
  const { id: ibuId } = useParams();
  const [searchParams] = useSearchParams();
  const kehamilanId = searchParams.get("kehamilan_id");
  const navigate = useNavigate();

  const user = getCurrentUser();
  const isDokter = isDokterUser(user);

  const [kehamilan, setKehamilan] = useState(null);
  const [skrining, setSkrining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(true); // ✅ status aktif kehamilan

  // Hak edit: dokter DAN kehamilan aktif (bukan NON-AKTIF)
  const canEdit = isDokter && isActive;

  const [form, setForm] = useState({
    anamnesis_multipara_pasangan_baru_sedang: false,
    anamnesis_teknologi_reproduksi_berbantu_sedang: false,
    anamnesis_umur_diatas_35_tahun_sedang: false,
    anamnesis_nulipara_sedang: false,
    anamnesis_jarak_kehamilan_diatas_10_tahun_sedang: false,
    anamnesis_riwayat_preeklampsia_keluarga_sedang: false,
    anamnesis_obesitas_imt_diatas_30_sedang: false,
    anamnesis_riwayat_preeklampsia_sebelumnya_tinggi: false,
    anamnesis_kehamilan_multipel_tinggi: false,
    anamnesis_diabetes_dalam_kehamilan_tinggi: false,
    anamnesis_hipertensi_kronik_tinggi: false,
    anamnesis_penyakit_ginjal_tinggi: false,
    anamnesis_penyakit_autoimun_sle_tinggi: false,
    anamnesis_anti_phospholipid_syndrome_tinggi: false,
    fisik_map_diatas_90_mmhg: false,
    fisik_proteinuria_urin_celup: false,
    kesimpulan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const kehamilanList = await getKehamilanByIbuId(ibuId);
        if (!kehamilanList.length) {
          alert("Ibu belum memiliki data kehamilan.");
          navigate(`/data-ibu/${ibuId}`);
          return;
        }

        let targetKehamilan = null;
        if (kehamilanId) {
          targetKehamilan = kehamilanList.find(k => k.id == kehamilanId);
          if (!targetKehamilan) {
            alert(`Kehamilan dengan ID ${kehamilanId} tidak ditemukan.`);
            navigate(`/data-ibu/${ibuId}`);
            return;
          }
        } else {
          targetKehamilan = kehamilanList[0];
        }
        setKehamilan(targetKehamilan);

        // ✅ Tentukan status aktif (non-aktif hanya jika status === "NON-AKTIF")
        const status = targetKehamilan.status_kehamilan || "";
        const aktif = status !== "NON-AKTIF";
        setIsActive(aktif);

        const skriningData = await getSkriningByKehamilanId(targetKehamilan.id);
        if (skriningData && skriningData.length > 0) {
          const s = skriningData[0];
          setSkrining(s);
          setForm({
            ...s,
            kesimpulan: s.kesimpulan_skrining_preeklampsia || "",
          });
        }

        const isEditMode = searchParams.get("edit") === "true";
        setIsEditing(canEdit && isEditMode);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    if (ibuId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ibuId, kehamilanId, navigate, searchParams]); // canEdit tidak perlu dimasukkan karena isActive akan berubah

  const handleChange = (e) => {
    if (!canEdit) return;
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("Anda tidak memiliki izin untuk mengubah data.");
      return;
    }
    if (!kehamilan) {
      alert("Data kehamilan tidak ditemukan");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        kehamilan_id: kehamilan.id,
        kesimpulan_skrining_preeklampsia: form.kesimpulan,
      };
      delete payload.kesimpulan;

      if (skrining) {
        await updateSkrining(skrining.id, payload);
      } else {
        const newSkrining = await createSkrining(payload);
        setSkrining(newSkrining);
      }
      alert("Skrining preeklampsia berhasil disimpan!");
      setIsEditing(false);
      const refreshed = await getSkriningByKehamilanId(kehamilan.id);
      if (refreshed && refreshed.length > 0) setSkrining(refreshed[0]);
    } catch (err) {
      console.error(err);
      alert(`Gagal menyimpan: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const hitungRisiko = () => {
    if (!skrining) return "TIDAK ADA DATA";
    const risikoSedang = [
      skrining.anamnesis_multipara_pasangan_baru_sedang,
      skrining.anamnesis_teknologi_reproduksi_berbantu_sedang,
      skrining.anamnesis_umur_diatas_35_tahun_sedang,
      skrining.anamnesis_nulipara_sedang,
      skrining.anamnesis_jarak_kehamilan_diatas_10_tahun_sedang,
      skrining.anamnesis_riwayat_preeklampsia_keluarga_sedang,
      skrining.anamnesis_obesitas_imt_diatas_30_sedang,
    ].filter(Boolean).length;
    const risikoTinggi = [
      skrining.anamnesis_riwayat_preeklampsia_sebelumnya_tinggi,
      skrining.anamnesis_kehamilan_multipel_tinggi,
      skrining.anamnesis_diabetes_dalam_kehamilan_tinggi,
      skrining.anamnesis_hipertensi_kronik_tinggi,
      skrining.anamnesis_penyakit_ginjal_tinggi,
      skrining.anamnesis_penyakit_autoimun_sle_tinggi,
      skrining.anamnesis_anti_phospholipid_syndrome_tinggi,
    ].filter(Boolean).length;
    const map = skrining.fisik_map_diatas_90_mmhg;
    const protein = skrining.fisik_proteinuria_urin_celup;
    if (risikoTinggi >= 1 || risikoSedang >= 2 || map || protein) return "PERLU RUJUKAN";
    return "TIDAK PERLU RUJUKAN";
  };

  const isRujukan = hitungRisiko() === "PERLU RUJUKAN";



  const FormView = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className={`p-6 rounded-2xl flex items-center justify-between shadow-sm border ${hitungRisiko() === "PERLU RUJUKAN" ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
        <div className="flex items-center gap-4">
          {hitungRisiko() === "PERLU RUJUKAN" ? <ShieldAlert size={36} className="text-red-600" /> : <CheckCircle2 size={36} className="text-emerald-600" />}
          <div>
            <h3 className="text-xl font-bold">Status Risiko: {hitungRisiko()}</h3>
            <p className="text-sm opacity-80">{hitungRisiko() === "PERLU RUJUKAN" ? "Pasien ini memiliki indikasi risiko tinggi dan disarankan untuk segera dirujuk." : "Risiko rendah terpantau. Dapat melanjutkan ANC secara rutin."}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow p-8">
        <h3 className="font-bold mb-4 text-lg text-amber-600 border-b pb-2 flex items-center gap-2">
          <AlertCircle size={20} /> Anamnesis - Risiko Sedang
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "Multipara Dengan Kehamilan oleh Pasangan Baru", name: "anamnesis_multipara_pasangan_baru_sedang" },
            { label: "Kehamilan dengan Teknologi Reproduksi Berbantu", name: "anamnesis_teknologi_reproduksi_berbantu_sedang" },
            { label: "Umur ≥ 35 Tahun", name: "anamnesis_umur_diatas_35_tahun_sedang" },
            { label: "Nulipara", name: "anamnesis_nulipara_sedang" },
            { label: "Jarak Kehamilan Sebelumnya > 10 Tahun", name: "anamnesis_jarak_kehamilan_diatas_10_tahun_sedang" },
            { label: "Riwayat Preeklampsia pada Ibu/Saudara Perempuan", name: "anamnesis_riwayat_preeklampsia_keluarga_sedang" },
            { label: "Obesitas Sebelum Hamil (IMT > 30)", name: "anamnesis_obesitas_imt_diatas_30_sedang" },
          ].map((item) => (
            <CheckboxToggle key={item.name} name={item.name} label={item.label} />
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow p-8">
        <h3 className="font-bold mb-4 text-lg text-rose-600 border-b pb-2 flex items-center gap-2">
          <ShieldAlert size={20} /> Anamnesis - Risiko Tinggi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "Riwayat Preeklampsia Sebelumnya", name: "anamnesis_riwayat_preeklampsia_sebelumnya_tinggi" },
            { label: "Kehamilan Multipel", name: "anamnesis_kehamilan_multipel_tinggi" },
            { label: "Diabetes dalam Kehamilan", name: "anamnesis_diabetes_dalam_kehamilan_tinggi" },
            { label: "Hipertensi Kronik", name: "anamnesis_hipertensi_kronik_tinggi" },
            { label: "Penyakit Ginjal", name: "anamnesis_penyakit_ginjal_tinggi" },
            { label: "Penyakit Autoimun, SLE", name: "anamnesis_penyakit_autoimun_sle_tinggi" },
            { label: "Anti Phospholipid Syndrome", name: "anamnesis_anti_phospholipid_syndrome_tinggi" },
          ].map((item) => (
            <CheckboxToggle key={item.name} name={item.name} label={item.label} />
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow p-8">
        <h3 className="font-bold mb-4 text-lg text-indigo-900 border-b pb-2">Pemeriksaan Fisik Khusus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <CheckboxToggle name="fisik_map_diatas_90_mmhg" label={`Mean Arterial Pressure >90 mmHg`} />
          <CheckboxToggle name="fisik_proteinuria_urin_celup" label={`Proteinuria (Urin Celup >+1)`} />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Kesimpulan Klinis (Opsional)</label>
          <textarea name="kesimpulan" value={form.kesimpulan} onChange={handleChange} disabled={!canEdit} className="w-full border rounded-xl p-4" rows="3" placeholder="Tambahkan catatan khusus hasil skrining..." />
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border rounded-xl font-semibold">Batal</button>
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3">
            {saving ? "Menyimpan..." : "Simpan Skrining"} <ArrowRight size={20} />
          </button>
        </div>
      )}
    </form>
  );

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;
  if (!kehamilan) return <MainLayout><div className="p-6 text-red-600">Error: Kehamilan tidak ditemukan</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl">
        {/* Header dan banner peringatan */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Skrining Preeklampsia</h1>
          {!isActive && (
            <div className="mt-2 bg-gray-100 border-l-4 border-gray-500 p-3 rounded text-gray-700 text-sm flex items-center gap-2">
              <EyeOff size={16} /> Kehamilan ini sudah selesai (NON-AKTIF). Data hanya dapat dilihat, tidak dapat diubah.
            </div>
          )}
          {!canEdit && isActive && (
            <div className="mt-2 bg-blue-50 border border-blue-200 p-2 rounded-lg text-blue-700 text-sm flex items-center gap-2">
              <Eye size={16} /> Anda dalam mode baca (Bidan). Data hanya dapat dilihat, tidak dapat diubah.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Anamnesis Risiko Tinggi */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h3 className="font-bold mb-4 text-lg text-rose-600 border-b border-rose-100 pb-2 flex items-center gap-2">
              <ShieldAlert size={20} /> Anamnesis - Risiko Tinggi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Riwayat Preeklampsia Sebelumnya", name: "anamnesis_riwayat_preeklampsia_sebelumnya_tinggi" },
                { label: "Kehamilan Multipel", name: "anamnesis_kehamilan_multipel_tinggi" },
                { label: "Diabetes dalam Kehamilan", name: "anamnesis_diabetes_dalam_kehamilan_tinggi" },
                { label: "Hipertensi Kronik", name: "anamnesis_hipertensi_kronik_tinggi" },
                { label: "Penyakit Ginjal", name: "anamnesis_penyakit_ginjal_tinggi" },
                { label: "Penyakit Autoimun, SLE", name: "anamnesis_penyakit_autoimun_sle_tinggi" },
                { label: "Anti Phospholipid Syndrome", name: "anamnesis_anti_phospholipid_syndrome_tinggi" },
              ].map((item) => (
                <CheckboxToggle key={item.name} name={item.name} label={item.label} />
              ))}
            </div>
          </div>

          {/* Pemeriksaan Fisik */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h3 className="font-bold mb-4 text-lg text-indigo-900 border-b border-indigo-100 pb-2">Pemeriksaan Fisik Khusus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <CheckboxToggle form={formPreeklampsia} handleChange={handleChangePreeklampsia} name="fisik_map_diatas_90_mmhg" label={`Mean Arterial Pressure ${'>'}90 mmHg`} />
              <CheckboxToggle form={formPreeklampsia} handleChange={handleChangePreeklampsia} name="fisik_proteinuria_urin_celup" label={`Proteinuria (Urin Celup ${'>'}+1)`} />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Kesimpulan Klinis (Opsional)</label>
              <textarea name="kesimpulan" value={formPreeklampsia.kesimpulan} onChange={handleChangePreeklampsia} className="w-full border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4" rows="3" placeholder="Tambahkan catatan khusus hasil skrining..." />
            </div>
          </div>

          {/* Skrining DMG */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h3 className="font-bold mb-6 text-lg text-indigo-900 border-b border-indigo-100 pb-2">Skrining Diabetes Melitus Gestasional (DMG)</h3>
            
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-indigo-800 mb-2">Test Toleransi Glukosa Oral (TTGO)</h4>
              <p className="text-sm text-indigo-700">Dilakukan umumnya pada usia kehamilan 24-28 minggu atau jika terdapat faktor risiko (misal: riwayat keluarga DM, obesitas, riwayat melahirkan bayi besar &gt;4000g, atau riwayat abortus berulang).</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">1. Gula Darah Puasa (GDP)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hasil (mg/dL)</label>
                    <input 
                      type="text" 
                      name="gula_darah_puasa_hasil" 
                      value={formDMG.gula_darah_puasa_hasil} 
                      onChange={handleChangeDMG} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm" 
                      placeholder="Contoh: 90" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Rencana Tindak Lanjut</label>
                    <input 
                      name="gula_darah_puasa_rencana_tindak_lanjut" 
                      value={formDMG.gula_darah_puasa_rencana_tindak_lanjut} 
                      onChange={handleChangeDMG} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm" 
                      placeholder="Tindakan yang akan dilakukan berdasarkan hasil" 
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Nilai rujukan normal: {"< 92 mg/dL"}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-gray-800">2. Gula Darah 2 Jam Post Prandial (TTGO 75g)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hasil (mg/dL)</label>
                    <input 
                      type="text" 
                      name="gula_darah_2_jam_post_prandial_hasil" 
                      value={formDMG.gula_darah_2_jam_post_prandial_hasil} 
                      onChange={handleChangeDMG} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm" 
                      placeholder="Contoh: 140" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Rencana Tindak Lanjut</label>
                    <input 
                      name="gula_darah_2_jam_post_prandial_rencana_tindak_lanjut" 
                      value={formDMG.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut} 
                      onChange={handleChangeDMG} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm" 
                      placeholder="Tindakan yang akan dilakukan berdasarkan hasil" 
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Nilai rujukan normal 2 jam setelah minum glukosa: {"< 153 mg/dL"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-12">
            <button type="submit" disabled={saving} className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transform transition-all hover:-translate-y-1 flex items-center gap-3">
              {saving ? "Menyimpan..." : "Simpan Skrining"} <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}