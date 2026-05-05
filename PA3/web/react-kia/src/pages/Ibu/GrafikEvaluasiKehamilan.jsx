import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { Line } from "react-chartjs-2";
import { Save, X } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { createGrafik, getGrafikChart } from "../../services/grafik";

export default function GrafikEvaluasi() {
  const { id } = useParams();

  const [kehamilan, setKehamilan] = useState(null);
  const [grafikTFU, setGrafikTFU] = useState([]);
  const [grafikDJJ, setGrafikDJJ] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    tanggal_bulan_tahun: "",
    usia_gestasi_minggu: "",
    tinggi_fundus_uteri_cm: "",
    denyut_jantung_bayi_x_menit: "",
  });

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);

        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);

          const res = await getGrafikChart(aktif.id);

          const data = res?.data || res;

          setGrafikTFU(data?.grafik_tfu || []);
          setGrafikDJJ(data?.grafik_djj || []);
        } else {
          setGrafikTFU([]);
          setGrafikDJJ([]);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // HANDLE FORM
  // =========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) return;

    setSaving(true);

    try {
      const payload = {
        kehamilan_id: kehamilan.id,
        tanggal_bulan_tahun: form.tanggal_bulan_tahun || null,
        usia_gestasi_minggu: Number(form.usia_gestasi_minggu),
        tinggi_fundus_uteri_cm: Number(form.tinggi_fundus_uteri_cm),
        denyut_jantung_bayi_x_menit: Number(form.denyut_jantung_bayi_x_menit),
      };

      await createGrafik(payload);

      setOpenModal(false);

      // reload chart
      const res = await getGrafikChart(kehamilan.id);
      const data = res?.data || res;

      setGrafikTFU(data?.grafik_tfu || []);
      setGrafikDJJ(data?.grafik_djj || []);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHART DATA (ANTI RE-RENDER)
  // =========================
const chartTFUData = useMemo(() => ({
  labels: grafikTFU.map((d) => `Usia ${d.usia} minggu`),
  datasets: [
    {
      label: "TFU Aktual",
      data: grafikTFU.map((d) => d.tfu ?? 0),
      borderColor: "#4f46e5", // indigo
      backgroundColor: "#4f46e5",
      borderWidth: 3,
      pointRadius: 6,
      tension: 0.3,
    },
    {
      label: "Median",
      data: grafikTFU.map((d) => d.normal ?? 0),
      borderColor: "#16a34a", // hijau
      borderWidth: 2,
      tension: 0.3,
    },
    {
      label: "Batas Atas",
      data: grafikTFU.map((d) => d.upper ?? 0),
      borderColor: "#dc2626", // merah
      borderDash: [6, 4],
      borderWidth: 2,
      tension: 0.3,
    },
    {
      label: "Batas Bawah",
      data: grafikTFU.map((d) => d.lower ?? 0),
      borderColor: "#dc2626",
      borderDash: [6, 4],
      borderWidth: 2,
      fill: "-1", // isi area ke dataset sebelumnya
      backgroundColor: "rgba(220,38,38,0.1)",
      tension: 0.3,
    },
  ],
}), [grafikTFU]);
  
const chartDJJData = useMemo(() => ({
  labels: grafikDJJ.map((d) => `Usia ${d.usia} minggu`),
  datasets: [
    {
      label: "DJJ Aktual",
      data: grafikDJJ.map((d) => d.djj ?? 0),
      borderColor: "#2563eb", // biru
      backgroundColor: "#2563eb",
      borderWidth: 3,
      pointRadius: 6,
      tension: 0.3,
    },
    {
      label: "Batas Bawah (110)",
      data: grafikDJJ.map(() => 110),
      borderColor: "#dc2626",
      borderDash: [6, 4],
      borderWidth: 2,
      tension: 0.3,
    },
    {
      label: "Batas Atas (160)",
      data: grafikDJJ.map(() => 160),
      borderColor: "#dc2626",
      borderDash: [6, 4],
      borderWidth: 2,
      fill: "-1",
      backgroundColor: "rgba(34,197,94,0.15)", // hijau transparan
      tension: 0.3,
    },
  ],
}), [grafikDJJ]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">Memuat data...</div>
      </MainLayout>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">

        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Monitoring Kehamilan (TFU & DJJ)
            </h1>
            <p className="text-gray-500">
              Grafik KIA berbasis usia gestasi
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Input Pemeriksaan
          </button>
        </div>

        {/* TFU */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-2">📊 Tinggi Fundus Uteri (TFU)</h2>
          <div className="h-80">
            {grafikTFU.length === 0 ? (
              <p className="text-gray-400">Belum ada data</p>
            ) : (
              <Line
                redraw={true}
                data={chartTFUData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>

        {/* DJJ */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">📊 Denyut Jantung Bayi (DJJ)</h2>
          <div className="h-80">
            {grafikDJJ.length === 0 ? (
              <p className="text-gray-400">Belum ada data</p>
            ) : (
              <Line
                redraw={true}
                data={chartDJJData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>

      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl relative">

            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                type="date"
                name="tanggal_bulan_tahun"
                value={form.tanggal_bulan_tahun}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <input
                type="number"
                name="usia_gestasi_minggu"
                placeholder="Usia"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <input
                type="number"
                name="tinggi_fundus_uteri_cm"
                placeholder="TFU"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <input
                type="number"
                name="denyut_jantung_bayi_x_menit"
                placeholder="DJJ"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white w-full py-2 rounded"
              >
                <Save size={18} />
                {saving ? "Menyimpan..." : "Simpan"}
              </button>

            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}