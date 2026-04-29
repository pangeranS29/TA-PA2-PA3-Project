// src/pages/Ibu/SkriningPreeklampsia.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getSkriningByKehamilanId, createSkrining, updateSkrining } from "../../services/skrining";
import api from "../../services/api";
import { AlertCircle, Save, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SkriningPreeklampsia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kehamilan, setKehamilan] = useState(null);
  const [skrining, setSkrining] = useState(null);
  const [skriningDMG, setSkriningDMG] = useState(null);
  
  // State untuk preeklampsia
  const [formPreeklampsia, setFormPreeklampsia] = useState({
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

  // State untuk DM Gestasional
  const [formDMG, setFormDMG] = useState({
    gula_darah_puasa_hasil: "",
    gula_darah_puasa_rencana_tindak_lanjut: "",
    gula_darah_2_jam_post_prandial_hasil: "",
    gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        console.log("Kehamilan data:", kehamilanList);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);
          
          // Fetch skrining preeklampsia
          const skriningData = await getSkriningByKehamilanId(aktif.id);
          if (skriningData && skriningData.length > 0) {
            const s = skriningData[0];
            setSkrining(s);
            setFormPreeklampsia({
              ...s,
              kesimpulan: s.kesimpulan_skrining_preeklampsia || "",
            });
          }

          // Fetch skrining DM gestasional
          const dmRes = await api.get(`/tenaga-kesehatan/skrining-dm-gestasional?kehamilan_id=${aktif.id}`);
          const dmgData = dmRes.data?.data;
          if (dmgData && dmgData.length > 0) {
            const d = dmgData[0];
            setSkriningDMG(d);
            setFormDMG({
              gula_darah_puasa_hasil: d.gula_darah_puasa_hasil || "",
              gula_darah_puasa_rencana_tindak_lanjut: d.gula_darah_puasa_rencana_tindak_lanjut || "",
              gula_darah_2_jam_post_prandial_hasil: d.gula_darah_2_jam_post_prandial_hasil || "",
              gula_darah_2_jam_post_prandial_rencana_tindak_lanjut: d.gula_darah_2_jam_post_prandial_rencana_tindak_lanjut || "",
            });
          }

          // Jika data sudah ada dan user tidak dalam mode edit, redirect ke display page
          if (skriningData && skriningData.length > 0) {
            const params = new URLSearchParams(window.location.search);
            const isEditMode = params.get('edit') === 'true';
            
            if (!isEditMode) {
              setTimeout(() => {
                navigate(`/data-ibu/${id}/skrining-dashboard`);
              }, 500);
            }
          }
        } else {
          console.warn("Tidak ada kehamilan untuk ibu ID:", id);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleChangePreeklampsia = (e) => {
    const { name, value, type, checked } = e.target;
    setFormPreeklampsia({ 
      ...formPreeklampsia, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleChangeDMG = (e) => {
    const { name, value } = e.target;
    setFormDMG({ ...formDMG, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) {
      alert("Data kehamilan tidak ditemukan");
      return;
    }
    
    setSaving(true);
    try {
      // Submit ke ENDPOINT 1: Skrining Preeklampsia
      const payloadPreeklampsia = {
        ...formPreeklampsia,
        kehamilan_id: kehamilan.id,
        kesimpulan_skrining_preeklampsia: formPreeklampsia.kesimpulan,
      };
      delete payloadPreeklampsia.kesimpulan;

      if (skrining) {
        await updateSkrining(skrining.id, payloadPreeklampsia);
      } else {
        await createSkrining(payloadPreeklampsia);
      }
      console.log("Skrining preeklampsia saved:", payloadPreeklampsia);

      // Submit ke ENDPOINT 2: Skrining DM Gestasional
      const payloadDMG = {
        kehamilan_id: kehamilan.id,
        ...formDMG,
      };

      if (skriningDMG) {
        await api.put(`/tenaga-kesehatan/skrining-dm-gestasional/${skriningDMG.id_skrining_dm}`, payloadDMG);
      } else {
        await api.post(`/tenaga-kesehatan/skrining-dm-gestasional`, payloadDMG);
      }
      console.log("Skrining DMG saved:", payloadDMG);

      alert("Skrining berhasil disimpan!");
      // Selalu redirect ke halaman dashboard skrining
      navigate(`/data-ibu/${id}/skrining-dashboard`);
    } catch (err) {
      console.error("Error saving:", err);
      const errorMsg = err.response?.data?.message || err.message || "Gagal menyimpan";
      alert(`Gagal: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const hitungRisiko = () => {
    const risikoSedang = [
      formPreeklampsia.anamnesis_multipara_pasangan_baru_sedang,
      formPreeklampsia.anamnesis_teknologi_reproduksi_berbantu_sedang,
      formPreeklampsia.anamnesis_umur_diatas_35_tahun_sedang,
      formPreeklampsia.anamnesis_nulipara_sedang,
      formPreeklampsia.anamnesis_jarak_kehamilan_diatas_10_tahun_sedang,
      formPreeklampsia.anamnesis_riwayat_preeklampsia_keluarga_sedang,
      formPreeklampsia.anamnesis_obesitas_imt_diatas_30_sedang,
    ].filter(Boolean).length;
    const risikoTinggi = [
      formPreeklampsia.anamnesis_riwayat_preeklampsia_sebelumnya_tinggi,
      formPreeklampsia.anamnesis_kehamilan_multipel_tinggi,
      formPreeklampsia.anamnesis_diabetes_dalam_kehamilan_tinggi,
      formPreeklampsia.anamnesis_hipertensi_kronik_tinggi,
      formPreeklampsia.anamnesis_penyakit_ginjal_tinggi,
      formPreeklampsia.anamnesis_penyakit_autoimun_sle_tinggi,
      formPreeklampsia.anamnesis_anti_phospholipid_syndrome_tinggi,
    ].filter(Boolean).length;
    const map = formPreeklampsia.fisik_map_diatas_90_mmhg;
    const protein = formPreeklampsia.fisik_proteinuria_urin_celup;
    if (risikoTinggi >= 1 || risikoSedang >= 2 || map || protein) return "PERLU RUJUKAN";
    return "TIDAK PERLU RUJUKAN";
  };

  const isRujukan = hitungRisiko() === "PERLU RUJUKAN";

  const CheckboxToggle = ({ name, label }) => {
    const isChecked = formPreeklampsia[name];
    return (
      <label 
        className={`cursor-pointer select-none flex items-center gap-2 text-sm px-4 py-3 rounded-xl border transition-all duration-300 w-full ${
          isChecked 
            ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200" 
            : "bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
        }`}
      >
        <input type="checkbox" name={name} checked={isChecked} onChange={handleChangePreeklampsia} className="hidden" />
        {label}
      </label>
    );
  };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  if (!kehamilan) return <MainLayout><div className="p-6 text-red-600">Error: Tidak ada data kehamilan untuk ibu ini</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">Skrining Risiko Kehamilan</h1>
        <p className="text-gray-500 mb-8 text-lg">Evaluasi terpadu risiko preeklampsia dan diabetes gestasional pada ibu hamil.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Status Badge */}
          <div className={`p-6 rounded-2xl flex items-center justify-between shadow-sm border ${isRujukan ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
            <div className="flex items-center gap-4">
              {isRujukan ? <ShieldAlert size={36} className="text-red-600" /> : <CheckCircle2 size={36} className="text-emerald-600" />}
              <div>
                <h3 className="text-xl font-bold">Status Risiko: {hitungRisiko()}</h3>
                <p className="text-sm opacity-80">{isRujukan ? "Pasien ini memiliki indikasi risiko tinggi dan disarankan untuk segera dirujuk." : "Risiko rendah terpantau. Dapat melanjutkan ANC secara rutin."}</p>
              </div>
            </div>
          </div>

          {/* Anamnesis Risiko Sedang */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h3 className="font-bold mb-4 text-lg text-amber-600 border-b border-amber-100 pb-2 flex items-center gap-2">
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
              <CheckboxToggle name="fisik_map_diatas_90_mmhg" label={`Mean Arterial Pressure ${'>'}90 mmHg`} />
              <CheckboxToggle name="fisik_proteinuria_urin_celup" label={`Proteinuria (Urin Celup ${'>'}+1)`} />
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