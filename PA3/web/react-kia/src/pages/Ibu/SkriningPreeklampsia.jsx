// src/pages/Ibu/SkriningPreeklampsia.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getSkriningByKehamilanId, createSkrining, updateSkrining } from "../../services/skrining";
import { AlertCircle, Save } from "lucide-react";

export default function SkriningPreeklampsia() {
  const { id } = useParams();
  const [kehamilan, setKehamilan] = useState(null);
  const [skrining, setSkrining] = useState(null);
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
    gula_darah_puasa_hasil: "",
    gula_darah_puasa_rencana: "",
    gula_darah_2_jam_post_prandial_hasil: "",
    gula_darah_2_jam_post_prandial_rencana: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);
          const skriningData = await getSkriningByKehamilanId(aktif.id);
          if (skriningData && skriningData.length > 0) {
            const s = skriningData[0];
            setSkrining(s);
            setForm({
              ...s,
              gula_darah_puasa_hasil: s.gula_darah_puasa_hasil || "",
              gula_darah_puasa_rencana: s.gula_darah_puasa_rencana || "",
              gula_darah_2_jam_post_prandial_hasil: s.gula_darah_2_jam_post_prandial_hasil || "",
              gula_darah_2_jam_post_prandial_rencana: s.gula_darah_2_jam_post_prandial_rencana || "",
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) return;
    setSaving(true);
    try {
      const payload = { ...form, kehamilan_id: kehamilan.id };
      if (skrining) {
        await updateSkrining(skrining.id, payload);
      } else {
        await createSkrining(payload);
      }
      alert("Skrining berhasil disimpan");
    } catch (err) {
      alert("Gagal menyimpan skrining");
    } finally {
      setSaving(false);
    }
  };

  const hitungRisiko = () => {
    const risikoSedang = [
      form.anamnesis_multipara_pasangan_baru_sedang,
      form.anamnesis_teknologi_reproduksi_berbantu_sedang,
      form.anamnesis_umur_diatas_35_tahun_sedang,
      form.anamnesis_nulipara_sedang,
      form.anamnesis_jarak_kehamilan_diatas_10_tahun_sedang,
      form.anamnesis_riwayat_preeklampsia_keluarga_sedang,
      form.anamnesis_obesitas_imt_diatas_30_sedang,
    ].filter(Boolean).length;
    const risikoTinggi = [
      form.anamnesis_riwayat_preeklampsia_sebelumnya_tinggi,
      form.anamnesis_kehamilan_multipel_tinggi,
      form.anamnesis_diabetes_dalam_kehamilan_tinggi,
      form.anamnesis_hipertensi_kronik_tinggi,
      form.anamnesis_penyakit_ginjal_tinggi,
      form.anamnesis_penyakit_autoimun_sle_tinggi,
      form.anamnesis_anti_phospholipid_syndrome_tinggi,
    ].filter(Boolean).length;
    const map = form.fisik_map_diatas_90_mmhg;
    const protein = form.fisik_proteinuria_urin_celup;
    if (risikoTinggi >= 1 || risikoSedang >= 2 || map || protein) return "PERLU RUJUKAN";
    return "TIDAK PERLU RUJUKAN";
  };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Skrining Preeklampsia</h1>
        <p className="text-gray-500 mb-6">Evaluasi risiko preeklampsia dan diabetes gestasional.</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><h3 className="font-semibold mb-2">Anamnesis - Risiko Sedang</h3></div>
            {[
              { label: "Multipara Dengan Kehamilan oleh Pasangan Baru", name: "anamnesis_multipara_pasangan_baru_sedang" },
              { label: "Kehamilan dengan Teknologi Reproduksi Berbantu", name: "anamnesis_teknologi_reproduksi_berbantu_sedang" },
              { label: "Umur ≥ 35 Tahun", name: "anamnesis_umur_diatas_35_tahun_sedang" },
              { label: "Nulipara", name: "anamnesis_nulipara_sedang" },
              { label: "Jarak Kehamilan Sebelumnya > 10 Tahun", name: "anamnesis_jarak_kehamilan_diatas_10_tahun_sedang" },
              { label: "Riwayat Preeklampsia pada Ibu/Saudara Perempuan", name: "anamnesis_riwayat_preeklampsia_keluarga_sedang" },
              { label: "Obesitas Sebelum Hamil (IMT > 30)", name: "anamnesis_obesitas_imt_diatas_30_sedang" },
            ].map((item) => (
              <label key={item.name} className="flex items-center gap-2"><input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} /> {item.label}</label>
            ))}
            <div className="md:col-span-2"><h3 className="font-semibold mb-2 mt-4">Anamnesis - Risiko Tinggi</h3></div>
            {[
              { label: "Riwayat Preeklampsia Sebelumnya", name: "anamnesis_riwayat_preeklampsia_sebelumnya_tinggi" },
              { label: "Kehamilan Multipel", name: "anamnesis_kehamilan_multipel_tinggi" },
              { label: "Diabetes dalam Kehamilan", name: "anamnesis_diabetes_dalam_kehamilan_tinggi" },
              { label: "Hipertensi Kronik", name: "anamnesis_hipertensi_kronik_tinggi" },
              { label: "Penyakit Ginjal", name: "anamnesis_penyakit_ginjal_tinggi" },
              { label: "Penyakit Autoimun, SLE", name: "anamnesis_penyakit_autoimun_sle_tinggi" },
              { label: "Anti Phospholipid Syndrome", name: "anamnesis_anti_phospholipid_syndrome_tinggi" },
            ].map((item) => (
              <label key={item.name} className="flex items-center gap-2"><input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} /> {item.label}</label>
            ))}
            <div className="md:col-span-2"><h3 className="font-semibold mb-2 mt-4">Pemeriksaan Fisik</h3></div>
<label className="flex items-center gap-2">
  <input 
    type="checkbox" 
    name="fisik_map_diatas_90_mmhg" 
    checked={form.fisik_map_diatas_90_mmhg} 
    onChange={handleChange} 
  /> 
  Mean Arterial Pressure &gt; 90 mmHg
</label>

<label className="flex items-center gap-2">
  <input 
    type="checkbox" 
    name="fisik_proteinuria_urin_celup" 
    checked={form.fisik_proteinuria_urin_celup} 
    onChange={handleChange} 
  /> 
  Proteinuria (Urin Celup &gt; +1)
</label>
            <div className="md:col-span-2"><label className="block font-medium mb-1">Kesimpulan Skrining</label><textarea name="kesimpulan" value={form.kesimpulan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows="2" /></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Status: {hitungRisiko()}</p>
            {hitungRisiko() === "PERLU RUJUKAN" && <p className="text-red-600 text-sm">Pasien perlu dirujuk ke rumah sakit.</p>}
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Skrining Diabetes Melitus Gestasional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label>Gula Darah Puasa (mg/dL)</label><input type="number" name="gula_darah_puasa_hasil" value={form.gula_darah_puasa_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Rencana Tindak Lanjut</label><input name="gula_darah_puasa_rencana" value={form.gula_darah_puasa_rencana} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Gula Darah 2 Jam Post Prandial (mg/dL)</label><input type="number" name="gula_darah_2_jam_post_prandial_hasil" value={form.gula_darah_2_jam_post_prandial_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Rencana Tindak Lanjut</label><input name="gula_darah_2_jam_post_prandial_rencana" value={form.gula_darah_2_jam_post_prandial_rencana} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={18} /> {saving ? "Menyimpan..." : "Simpan Hasil Skrining"}</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}