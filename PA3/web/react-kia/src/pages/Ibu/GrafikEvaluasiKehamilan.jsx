import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getGrafikByKehamilanId, createGrafik, updateGrafik } from "../../services/grafik";
import { getPenjelasanByKehamilanId, createPenjelasan, updatePenjelasan } from "../../services/grafikBB";
import { Line } from "react-chartjs-2";
import { Save, ArrowLeft } from "lucide-react";

export default function GrafikEvaluasiKehamilan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kehamilan, setKehamilan] = useState(null);

  // Data State
  const [grafik, setGrafik] = useState(null);
  const [grafikList, setGrafikList] = useState([]);
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

  const [formPenjelasan, setFormPenjelasan] = useState({
    catatan_penjelasan_grafik: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);

          // Fetch semua data grafik evaluasi kehamilan
          const dataTfu = await getGrafikByKehamilanId(aktif.id);
          if (dataTfu && dataTfu.length > 0) {
            setGrafikList(dataTfu);
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

          // Fetch Penjelasan Grafik
          const dataPenjelasan = await getPenjelasanByKehamilanId(aktif.id);
          if (dataPenjelasan && dataPenjelasan.length > 0) {
            const pen = dataPenjelasan[0];
            setPenjelasan(pen);
            setFormPenjelasan({
              catatan_penjelasan_grafik: pen.catatan_penjelasan_grafik || "",
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleChangePenjelasan = (e) => setFormPenjelasan({ ...formPenjelasan, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) return;
    setSaving(true);
    try {
      // 1. Grafik Indikator TFU/Detak — convert to proper types
      const payloadTfu = {
        kehamilan_id: kehamilan.id,
        tanggal_bulan_tahun: form.tanggal_bulan_tahun || null,
        usia_gestasi_minggu: form.usia_gestasi_minggu ? parseInt(form.usia_gestasi_minggu) : null,
        tinggi_fundus_uteri_cm: form.tinggi_fundus_uteri_cm ? parseFloat(form.tinggi_fundus_uteri_cm) : null,
        denyut_jantung_bayi_x_menit: form.denyut_jantung_bayi_x_menit ? parseInt(form.denyut_jantung_bayi_x_menit) : null,
        tekanan_darah_sistole: form.tekanan_darah_sistole ? parseInt(form.tekanan_darah_sistole) : null,
        tekanan_darah_diastole: form.tekanan_darah_diastole ? parseInt(form.tekanan_darah_diastole) : null,
        nadi_per_menit: form.nadi_per_menit ? parseInt(form.nadi_per_menit) : null,
        gerakan_bayi: form.gerakan_bayi || "",
        urin_protein: form.urin_protein || "",
        urin_reduksi: form.urin_reduksi || "",
        hemoglobin: form.hemoglobin ? parseFloat(form.hemoglobin) : null,
        tablet_tambah_darah: form.tablet_tambah_darah ? parseInt(form.tablet_tambah_darah) : null,
        kalsium: form.kalsium || "",
        aspirin: form.aspirin || "",
      };
      if (grafik) await updateGrafik(grafik.id_grafik, payloadTfu);
      else await createGrafik(payloadTfu);

      // 2. Penjelasan Hasil Grafik
      const payloadPenjelasan = { ...formPenjelasan, kehamilan_id: kehamilan.id };
      if (penjelasan) await updatePenjelasan(penjelasan.id_penjelasan, payloadPenjelasan);
      else await createPenjelasan(payloadPenjelasan);

      alert("Data grafik evaluasi kehamilan berhasil disimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data grafik evaluasi kehamilan");
    } finally {
      setSaving(false);
    }
  };

  // Build chart data from actual data
  const buildChartData = () => {
    if (grafikList.length > 0) {
      const sorted = [...grafikList].sort((a, b) => (a.usia_gestasi_minggu || 0) - (b.usia_gestasi_minggu || 0));
      return {
        labels: sorted.map((g) => g.usia_gestasi_minggu || 0),
        datasets: [
          {
            label: "TFU (cm)",
            data: sorted.map((g) => g.tinggi_fundus_uteri_cm || null),
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: "#6366f1",
          },
          {
            label: "DJJ (x/menit)",
            data: sorted.map((g) => g.denyut_jantung_bayi_x_menit || null),
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: "#ef4444",
          },
        ],
      };
    }
    // Fallback jika belum ada data
    return {
      labels: [8, 12, 16, 20, 24, 28, 32, 36, 40],
      datasets: [
        { label: "TFU (cm)", data: [], borderColor: "#6366f1", fill: false },
        { label: "DJJ (x/menit)", data: [], borderColor: "#ef4444", fill: false },
      ],
    };
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-6">Memuat...</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grafik Evaluasi Kehamilan</h1>
            <p className="text-gray-500">Grafik Evaluasi Kehamilan (TFU & DJJ)</p>
          </div>
        </div>

        {/* Grafik TFU & DJJ */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4 text-indigo-700">Tren TFU & Denyut Jantung Janin</h3>
          <div className="h-72">
            <Line
              data={buildChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  x: { title: { display: true, text: "Usia Gestasi (Minggu)" } },
                  y: { title: { display: true, text: "Nilai" } },
                },
              }}
            />
          </div>
          {grafikList.length === 0 && <p className="text-center text-gray-400 text-sm mt-2">Belum ada data. Isi form di bawah untuk menampilkan grafik.</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Evaluasi Klinis */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-indigo-700">Data Evaluasi Klinis (TFU & DJJ)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal</label>
                <input type="date" name="tanggal_bulan_tahun" value={form.tanggal_bulan_tahun} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Usia Gestasi (mgg)</label>
                <input type="number" name="usia_gestasi_minggu" value={form.usia_gestasi_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">TFU (cm)</label>
                <input type="number" step="0.1" name="tinggi_fundus_uteri_cm" value={form.tinggi_fundus_uteri_cm} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">DJJ (x/menit)</label>
                <input type="number" name="denyut_jantung_bayi_x_menit" value={form.denyut_jantung_bayi_x_menit} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">TD Sistole</label>
                <input type="number" name="tekanan_darah_sistole" value={form.tekanan_darah_sistole} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">TD Diastole</label>
                <input type="number" name="tekanan_darah_diastole" value={form.tekanan_darah_diastole} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nadi (x/mnt)</label>
                <input type="number" name="nadi_per_menit" value={form.nadi_per_menit} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gerakan Bayi</label>
                <input name="gerakan_bayi" value={form.gerakan_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Urin Protein</label>
                <input name="urin_protein" value={form.urin_protein} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Urin Reduksi</label>
                <input name="urin_reduksi" value={form.urin_reduksi} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hemoglobin</label>
                <input type="number" step="0.1" name="hemoglobin" value={form.hemoglobin} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">TTD</label>
                <input type="number" name="tablet_tambah_darah" value={form.tablet_tambah_darah} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kalsium</label>
                <input name="kalsium" value={form.kalsium} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aspirin</label>
                <input name="aspirin" value={form.aspirin} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Penjelasan Hasil Grafik */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-2 text-indigo-700">Penjelasan Hasil Grafik / Ringkasan Klinis</h3>
            <textarea
              name="catatan_penjelasan_grafik"
              value={formPenjelasan.catatan_penjelasan_grafik}
              onChange={handleChangePenjelasan}
              className="w-full border rounded px-3 py-2 mt-2"
              rows="3"
              placeholder="Catatan observasi evaluasi kehamilan..."
            ></textarea>
          </div>

          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Data Evaluasi Kehamilan"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
