// src/pages/Ibu/GrafikEvaluasi.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getGrafikByKehamilanId, createGrafik, updateGrafik } from "../../services/grafik";
import { Line } from "react-chartjs-2";
import { Save, Activity, Heart, Droplet } from "lucide-react";

export default function GrafikEvaluasi() {
  const { id } = useParams();
  const [kehamilan, setKehamilan] = useState(null);
  const [grafik, setGrafik] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);
          const data = await getGrafikByKehamilanId(aktif.id);
          if (data && data.length > 0) {
            const g = data[0];
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) return;
    setSaving(true);
    try {
      const payload = { ...form, kehamilan_id: kehamilan.id };
      if (grafik) {
        await updateGrafik(grafik.id, payload);
      } else {
        await createGrafik(payload);
      }
      alert("Data grafik berhasil disimpan");
    } catch (err) {
      alert("Gagal menyimpan grafik");
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

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label>Tanggal</label><input type="date" name="tanggal_bulan_tahun" value={form.tanggal_bulan_tahun} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Usia Gestasi (minggu)</label><input type="number" name="usia_gestasi_minggu" value={form.usia_gestasi_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>TFU (cm)</label><input type="number" step="0.1" name="tinggi_fundus_uteri_cm" value={form.tinggi_fundus_uteri_cm} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>DJJ (x/menit)</label><input type="number" name="denyut_jantung_bayi_x_menit" value={form.denyut_jantung_bayi_x_menit} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Tekanan Darah Sistole</label><input type="number" name="tekanan_darah_sistole" value={form.tekanan_darah_sistole} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Tekanan Darah Diastole</label><input type="number" name="tekanan_darah_diastole" value={form.tekanan_darah_diastole} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Nadi (x/menit)</label><input type="number" name="nadi_per_menit" value={form.nadi_per_menit} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Gerakan Bayi</label><input name="gerakan_bayi" value={form.gerakan_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Urin Protein</label><input name="urin_protein" value={form.urin_protein} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Urin Reduksi</label><input name="urin_reduksi" value={form.urin_reduksi} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Hemoglobin (g/dL)</label><input type="number" step="0.1" name="hemoglobin" value={form.hemoglobin} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Tablet Tambah Darah</label><input type="number" name="tablet_tambah_darah" value={form.tablet_tambah_darah} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Kalsium</label><input name="kalsium" value={form.kalsium} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label>Aspirin</label><input name="aspirin" value={form.aspirin} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Ringkasan Klinis</h3>
            <textarea className="w-full border rounded px-3 py-2 mt-2" rows="3" placeholder="Catatan observasi minggu ini..."></textarea>
          </div>
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={18} /> Simpan Data Grafik</button>
        </form>
      </div>
    </MainLayout>
  );
}