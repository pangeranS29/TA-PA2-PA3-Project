import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getGrafikByKehamilanId, createGrafik, updateGrafik } from "../../services/grafik";
import { getGrafikBBByKehamilanId, createGrafikBB, updateGrafikBB, getPenjelasanByKehamilanId, createPenjelasan, updatePenjelasan } from "../../services/grafikBB";
import { Line } from "react-chartjs-2";
import { Save } from "lucide-react";

export default function GrafikEvaluasi() {
  const { id } = useParams();
  const [kehamilan, setKehamilan] = useState(null);
  
  // Data State
  const [grafik, setGrafik] = useState(null);
  const [grafikBB, setGrafikBB] = useState(null);
  const [penjelasan, setPenjelasan] = useState(null);

  const [form, setForm] = useState({
    tanggal_bulan_tahun: "",
    usia_gestasi_minggu: "",
    tinggi_fundus_uteri_cm: "",
    denyut_jantung_bayi_x_menit: "",
    tekanan_darah_sistole: "",
    tekanan_darah_diastole: "",
    nadi_per_menit: "",
    gerakan_bayi: "",
    urin_protein: "",
    urin_reduksi: "",
    hemoglobin: "",
    tablet_tambah_darah: "",
    kalsium: "",
    aspirin: "",
  });

  const [formBB, setFormBB] = useState({
    bb_pra_kehamilan_kg: "",
    imt_pra_kehamilan: "",
    kategori_imt_pra_kehamilan: "",
    rekomendasi_peningkatan_bb_min: "",
    rekomendasi_peningkatan_bb_max: "",
    minggu_kehamilan: "",
    peningkatan_bb_kg: "",
  });

  const [formPenjelasan, setFormPenjelasan] = useState({
    catatan_penjelasan_grafik: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);

          // 1. Fetch TFU & Detak Jantung
          const dataTfu = await getGrafikByKehamilanId(aktif.id);
          if (dataTfu && dataTfu.length > 0) {
            const g = dataTfu[0];
            setGrafik(g);
            setForm({
              tanggal_bulan_tahun: g.tanggal_bulan_tahun ? new Date(g.tanggal_bulan_tahun).toISOString().split("T")[0] : "",
              usia_gestasi_minggu: g.usia_gestasi_minggu || "",
              tinggi_fundus_uteri_cm: g.tinggi_fundus_uteri_cm || "",
              denyut_jantung_bayi_x_menit: g.denyut_jantung_bayi_x_menit || "",
              tekanan_darah_sistole: g.tekanan_darah_sistole || "",
              tekanan_darah_diastole: g.tekanan_darah_diastole || "",
              nadi_per_menit: g.nadi_per_menit || "",
              gerakan_bayi: g.gerakan_bayi || "",
              urin_protein: g.urin_protein || "",
              urin_reduksi: g.urin_reduksi || "",
              hemoglobin: g.hemoglobin || "",
              tablet_tambah_darah: g.tablet_tambah_darah || "",
              kalsium: g.kalsium || "",
              aspirin: g.aspirin || "",
            });
          }

          // 2. Fetch Grafik Peningkatan BB
          const dataBB = await getGrafikBBByKehamilanId(aktif.id);
          if (dataBB && dataBB.length > 0) {
            const bb = dataBB[0];
            setGrafikBB(bb);
            setFormBB({
              bb_pra_kehamilan_kg: bb.bb_pra_kehamilan_kg || "",
              imt_pra_kehamilan: bb.imt_pra_kehamilan || "",
              kategori_imt_pra_kehamilan: bb.kategori_imt_pra_kehamilan || "",
              rekomendasi_peningkatan_bb_min: bb.rekomendasi_peningkatan_bb_min || "",
              rekomendasi_peningkatan_bb_max: bb.rekomendasi_peningkatan_bb_max || "",
              minggu_kehamilan: bb.minggu_kehamilan || "",
              peningkatan_bb_kg: bb.peningkatan_bb_kg || "",
            });
          }

          // 3. Fetch Penjelasan Grafik
          const dataPenjelasan = await getPenjelasanByKehamilanId(aktif.id);
          if (dataPenjelasan && dataPenjelasan.length > 0) {
            const pen = dataPenjelasan[0];
            setPenjelasan(pen);
            setFormPenjelasan({
              catatan_penjelasan_grafik: pen.catatan_penjelasan_grafik || ""
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleChangeBB = (e) => setFormBB({ ...formBB, [e.target.name]: e.target.value });
  const handleChangePenjelasan = (e) => setFormPenjelasan({ ...formPenjelasan, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) return;
    setSaving(true);
    try {
      // 1. Grafik Indikator TFU/Detak
      const payloadTfu = { ...form, kehamilan_id: kehamilan.id };
      if (grafik) await updateGrafik(grafik.id, payloadTfu);
      else await createGrafik(payloadTfu);

      // 2. Grafik Peningkatan BB
      const payloadBB = {
        ...formBB,
        kehamilan_id: kehamilan.id,
        bb_pra_kehamilan_kg: parseFloat(formBB.bb_pra_kehamilan_kg) || null,
        imt_pra_kehamilan: parseFloat(formBB.imt_pra_kehamilan) || null,
        rekomendasi_peningkatan_bb_min: parseFloat(formBB.rekomendasi_peningkatan_bb_min) || null,
        rekomendasi_peningkatan_bb_max: parseFloat(formBB.rekomendasi_peningkatan_bb_max) || null,
        minggu_kehamilan: parseInt(formBB.minggu_kehamilan) || null,
        peningkatan_bb_kg: parseFloat(formBB.peningkatan_bb_kg) || null,
      };
      if (grafikBB) await updateGrafikBB(grafikBB.id_grafik_bb, payloadBB);
      else await createGrafikBB(payloadBB);

      // 3. Penjelasan Hasil Grafik
      const payloadPenjelasan = { ...formPenjelasan, kehamilan_id: kehamilan.id };
      if (penjelasan) await updatePenjelasan(penjelasan.id_penjelasan, payloadPenjelasan);
      else await createPenjelasan(payloadPenjelasan);

      alert("Data grafik dan penjelasan berhasil disimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data grafik");
    } finally {
      setSaving(false);
    }
  };

  // Chart data example
  const chartData = {
    labels: [8, 12, 16, 20, 24, 28, 32, 36, 40],
    datasets: [
      { label: "TFU (cm)", data: [10, 14, 18, 22, 26, 30, 32, 34, 36], borderColor: "blue", fill: false },
      { label: "DJJ (bpm)", data: [140, 145, 148, 150, 152, 155, 158, 160, 158], borderColor: "red", fill: false },
    ],
  };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Evaluasi Grafik Klinis</h1>
        <p className="text-gray-500 mb-6">Pemantauan parameter kesehatan ibu dan janin secara berkala.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-2">Grafik Peningkatan Berat Badan Ibu</h3>
            <div className="h-64">{/* Placeholder untuk chart BB */}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-2">Tren TFU & Denyut Jantung Janin</h3>
            <div className="h-64"><Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-indigo-700">1. Data Peningkatan Berat Badan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="block text-sm font-medium mb-1">BB Pra-Kehamilan (kg)</label><input type="number" step="0.1" name="bb_pra_kehamilan_kg" value={formBB.bb_pra_kehamilan_kg} onChange={handleChangeBB} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">IMT</label><input type="number" step="0.1" name="imt_pra_kehamilan" value={formBB.imt_pra_kehamilan} onChange={handleChangeBB} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Kategori IMT</label><input name="kategori_imt_pra_kehamilan" value={formBB.kategori_imt_pra_kehamilan} onChange={handleChangeBB} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Minggu Kehamilan</label><input type="number" name="minggu_kehamilan" value={formBB.minggu_kehamilan} onChange={handleChangeBB} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Peningkatan BB (kg)</label><input type="number" step="0.1" name="peningkatan_bb_kg" value={formBB.peningkatan_bb_kg} onChange={handleChangeBB} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Rekomendasi Min (kg)</label><input type="number" step="0.1" name="rekomendasi_peningkatan_bb_min" value={formBB.rekomendasi_peningkatan_bb_min} onChange={handleChangeBB} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Rekomendasi Max (kg)</label><input type="number" step="0.1" name="rekomendasi_peningkatan_bb_max" value={formBB.rekomendasi_peningkatan_bb_max} onChange={handleChangeBB} className="w-full border rounded px-3 py-2" /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-indigo-700">2. Data Evaluasi Klinis (TFU & DJJ)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" name="tanggal_bulan_tahun" value={form.tanggal_bulan_tahun} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Usia Gestasi (mgg)</label><input type="number" name="usia_gestasi_minggu" value={form.usia_gestasi_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">TFU (cm)</label><input type="number" step="0.1" name="tinggi_fundus_uteri_cm" value={form.tinggi_fundus_uteri_cm} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">DJJ (x/menit)</label><input type="number" name="denyut_jantung_bayi_x_menit" value={form.denyut_jantung_bayi_x_menit} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">TD Sistole</label><input type="number" name="tekanan_darah_sistole" value={form.tekanan_darah_sistole} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">TD Diastole</label><input type="number" name="tekanan_darah_diastole" value={form.tekanan_darah_diastole} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Nadi (x/mnt)</label><input type="number" name="nadi_per_menit" value={form.nadi_per_menit} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Gerakan Bayi</label><input name="gerakan_bayi" value={form.gerakan_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Urin Protein</label><input name="urin_protein" value={form.urin_protein} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Urin Reduksi</label><input name="urin_reduksi" value={form.urin_reduksi} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Hemoglobin</label><input type="number" step="0.1" name="hemoglobin" value={form.hemoglobin} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">TTD</label><input type="number" name="tablet_tambah_darah" value={form.tablet_tambah_darah} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Kalsium</label><input name="kalsium" value={form.kalsium} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Aspirin</label><input name="aspirin" value={form.aspirin} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-2 text-indigo-700">3. Penjelasan Hasil Grafik / Ringkasan Klinis</h3>
            <textarea 
              name="catatan_penjelasan_grafik"
              value={formPenjelasan.catatan_penjelasan_grafik}
              onChange={handleChangePenjelasan}
              className="w-full border rounded px-3 py-2 mt-2" 
              rows="3" 
              placeholder="Catatan observasi keseluruhan evaluasi di atas..."
            ></textarea>
          </div>
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={18} /> Simpan Data Grafik</button>
        </form>
      </div>
    </MainLayout>
  );
}