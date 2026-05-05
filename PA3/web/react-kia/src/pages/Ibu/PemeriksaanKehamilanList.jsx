import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getPemeriksaanKehamilanByKehamilanId } from "../../services/pemeriksaanKehamilan";
import { getGrafikehamilanByKehamilanId } from "../../services/pemeriksaanKehamilan";
import { getCurrentUser, isDokterUser } from "../../services/auth";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Plus, AlertTriangle, Activity, Scale, Heart, Droplets, Home } from "lucide-react";

// Registrasi ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// Helper Buku KIA
const getBatasBB = (minggu, kategoriIMT) => {
  let rateMin = 0.35, rateMax = 0.50, t1Min = 0.5, t1Max = 2.0; // Default Normal
  const kat = kategoriIMT?.toLowerCase() || "";
  if (kat.includes("kurang")) { rateMin = 0.44; rateMax = 0.58; t1Min = 1.0; t1Max = 2.0; }
  else if (kat.includes("overweight")) { rateMin = 0.23; rateMax = 0.33; t1Min = 0.5; t1Max = 1.0; }
  else if (kat.includes("obesitas")) { rateMin = 0.17; rateMax = 0.27; t1Min = 0.2; t1Max = 0.5; }

  if (minggu <= 12) {
    return { min: (t1Min / 12) * minggu, max: (t1Max / 12) * minggu };
  }
  return {
    min: t1Min + ((minggu - 12) * rateMin),
    max: t1Max + ((minggu - 12) * rateMax)
  };
};

export default function PemeriksaanKehamilanList() {
  const { id: ibuId } = useParams();
  const [searchParams] = useSearchParams();
  const kehamilanIdQuery = searchParams.get("kehamilan_id");

  // Role: dokter hanya baca, bidan bisa edit/create
  const user = getCurrentUser();
  const isDokter = isDokterUser(user);
  const canEdit = !isDokter; // bidan bisa edit/create

  const [kehamilan, setKehamilan] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [grafik, setGrafik] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <Link to={`/data-ibu/${ibuId}?kehamilan_id=${kehamilan.id}`} className="hover:text-indigo-600">
          Detail Ibu
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Pemantauan ANC</span>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const kehamilanList = await getKehamilanByIbuId(ibuId);
        if (!kehamilanList || kehamilanList.length === 0) {
          setError("Belum ada data kehamilan untuk ibu ini.");
          setKehamilan(null);
          return;
        }

        let selectedKehamilan = null;
        if (kehamilanIdQuery) {
          selectedKehamilan = kehamilanList.find(k => k.id == kehamilanIdQuery);
          if (!selectedKehamilan) {
            setError(`Kehamilan dengan ID ${kehamilanIdQuery} tidak ditemukan untuk ibu ini.`);
            setKehamilan(null);
            return;
          }
        } else {
          selectedKehamilan = kehamilanList[0];
        }

        setKehamilan(selectedKehamilan);

        const [examRes, grafikRes] = await Promise.all([
          getPemeriksaanKehamilanByKehamilanId(selectedKehamilan.id),
          getGrafikehamilanByKehamilanId(selectedKehamilan.id),
        ]);

        setExaminations(
          (examRes || []).sort((a, b) => a.kunjungan_ke - b.kunjungan_ke)
        );
        setGrafik(grafikRes?.data || grafikRes || null);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data pemeriksaan kehamilan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ibuId, kehamilanIdQuery]);

  const tfu = grafik?.grafik_tfu ?? [];
  const djj = grafik?.grafik_djj ?? [];
  const td = grafik?.grafik_tekanan_darah ?? [];
  const bb = grafik?.grafik_berat_badan ?? [];
  const risk = grafik?.detail_risiko;
  const kategoriIMT = grafik?.kategori_imt;

  const getRiskStyles = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("tinggi")) return "bg-red-50 border-red-200 text-red-700";
    if (s.includes("sedang")) return "bg-yellow-50 border-yellow-200 text-yellow-700";
    return "bg-green-50 border-green-200 text-green-700";
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
    },
    scales: {
      y: { beginAtZero: false, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  const chartTFU = useMemo(() => ({
    labels: tfu.map((d) => `Mgg ${d.minggu}`),
    datasets: [
      {
        label: "Batas Atas (+2cm)",
        data: tfu.map((d) => d.minggu + 2),
        borderColor: "#10b981", 
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
      {
        label: "Batas Bawah (-2cm)",
        data: tfu.map((d) => d.minggu - 2),
        borderColor: "#10b981",
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
        fill: '-1',
        backgroundColor: "rgba(16, 185, 129, 0.15)", 
      },
      {
        label: "TFU Pasien (cm)",
        data: tfu.map((d) => d.value),
        borderColor: "#4f46e5", 
        backgroundColor: "#4f46e5",
        borderWidth: 3,
        pointRadius: 5,
        zIndex: 10,
      }
    ],
  }), [tfu]);

  const chartDJJ = useMemo(() => ({
    labels: djj.map((d) => `Mgg ${d.minggu}`),
    datasets: [
      {
        label: "Batas Atas (160)",
        data: djj.map(() => 160),
        borderColor: "#ef4444",
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
      {
        label: "Batas Bawah (120)",
        data: djj.map(() => 120),
        borderColor: "#ef4444",
        borderWidth: 1,
        pointRadius: 0,
        fill: '-1',
        backgroundColor: "rgba(16, 185, 129, 0.15)",
      },
      {
        label: "DJJ Pasien (bpm)",
        data: djj.map((d) => d.value),
        borderColor: "#06b6d4",
        backgroundColor: "#06b6d4",
        borderWidth: 3,
        pointRadius: 5,
        zIndex: 10,
      }
    ],
  }), [djj]);

  const chartTD = useMemo(() => ({
    labels: td.map((d) => `Mgg ${d.minggu}`),
    datasets: [
      {
        label: "Batas Waspada Sistole (130)",
        data: td.map(() => 130),
        borderColor: "#ef4444",
        borderDash: [10, 5],
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Batas Waspada Diastole (80)",
        data: td.map(() => 80),
        borderColor: "#f59e0b",
        borderDash: [10, 5],
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Sistole Pasien",
        data: td.map((d) => d.sistole),
        borderColor: "#4f46e5",
        backgroundColor: "#4f46e5",
        borderWidth: 3,
        pointRadius: 4,
      },
      {
        label: "Diastole Pasien",
        data: td.map((d) => d.diastole),
        borderColor: "#06b6d4",
        backgroundColor: "#06b6d4",
        borderWidth: 3,
        pointRadius: 4,
      },
    ],
  }), [td]);

  const chartBB = useMemo(() => ({
    labels: bb.map((d) => `Mgg ${d.minggu}`),
    datasets: [
      {
        label: `Batas Atas PBB`,
        data: bb.map((d) => getBatasBB(d.minggu, kategoriIMT).max),
        borderColor: "#ec4899", 
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
      {
        label: `Batas Bawah PBB`,
        data: bb.map((d) => getBatasBB(d.minggu, kategoriIMT).min),
        borderColor: "#ec4899",
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 0,
        fill: '-1',
        backgroundColor: "rgba(236, 72, 153, 0.15)",
      },
      {
        label: "Kenaikan BB Pasien (kg)",
        data: bb.map((d) => d.berat),
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        borderWidth: 3,
        pointRadius: 5,
        zIndex: 10,
      }
    ],
  }), [bb, kategoriIMT]);

  const latestExam = examinations.at(-1);

  if (loading) return <MainLayout><div className="p-10 text-center">Memuat data medis...</div></MainLayout>;
  if (error) return <MainLayout><div className="p-10 text-center text-red-600">{error}</div></MainLayout>;
  if (!kehamilan) return <MainLayout><div className="p-10 text-center">Data kehamilan tidak tersedia</div></MainLayout>;

  const withKehamilan = (path) => `${path}?kehamilan_id=${kehamilan.id}`;

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Pemantauan ANC</h1>
            <p className="text-gray-500 italic">Berdasarkan Standar Buku KIA & Skrining Risiko</p>
            <p className="text-xs text-gray-400 mt-1">Kehamilan ID: {kehamilan.id}</p>
          </div>
          {canEdit && (
            <Link
              to={withKehamilan(`/data-ibu/${ibuId}/pemeriksaan-rutin/baru`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
            >
              <Plus size={20} /> Catat Pemeriksaan
            </Link>
          )}
        </div>

        {/* Pesan role */}
        {!canEdit && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> Anda dalam mode baca (Dokter). Data hanya dapat dilihat, tidak dapat diubah atau menambah pemeriksaan.
          </div>
        )}

        {/* Status Risiko */}
        {risk && (
          <div className={`border-l-4 p-5 rounded-r-2xl shadow-sm flex gap-4 ${getRiskStyles(risk.status_risiko)}`}>
            <AlertTriangle className="flex-shrink-0" size={28} />
            <div>
              <h3 className="font-bold text-lg uppercase tracking-wide">Status: {risk.status_risiko} (Skor: {risk.skor_risiko})</h3>
              <p className="text-sm leading-relaxed">{risk.ringkasan}</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Activity size={18} /> <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">IMT Awal</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{grafik?.imt_awal?.toFixed(2) || "-"}</p>
            <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg">{kategoriIMT || "-"}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <Heart size={18} /> <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">DJJ Terakhir</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{djj.at(-1)?.value || "-"} <span className="text-sm font-normal text-gray-400">bpm</span></p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-orange-600 mb-2">
              <Scale size={18} /> <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Kenaikan BB</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{bb.at(-1)?.berat || "0"} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Droplets size={18} /> <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Kunjungan</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{examinations.length} <span className="text-sm font-normal text-gray-400">Kali</span></p>
          </div>
        </div>

        {/* Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">📈 Tinggi Fundus (TFU)</h2>
            <div className="h-64"><Line data={chartTFU} options={commonOptions} /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">💓 Detak Jantung Janin</h2>
            <div className="h-64"><Line data={chartDJJ} options={commonOptions} /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">🩸 Tekanan Darah</h2>
            <div className="h-64"><Line data={chartTD} options={commonOptions} /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">⚖️ Grafik Berat Badan (PBB)</h2>
            <div className="h-64"><Line data={chartBB} options={commonOptions} /></div>
          </div>
        </div>

        {/* Riwayat Pemeriksaan */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Riwayat Pemeriksaan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examinations.map((exam) => (
              <div key={exam.id_periksa} className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Kunjungan {exam.kunjungan_ke}</span>
                  {latestExam?.id_periksa === exam.id_periksa && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> TERBARU
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mb-1">Tanggal Periksa</p>
                <p className="font-bold text-gray-800 mb-4">{new Date(exam.tanggal_periksa).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <Link
                  to={withKehamilan(`/data-ibu/${ibuId}/pemeriksaan-rutin/${exam.id_periksa}`)}
                  className="w-full block text-center py-2 bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 rounded-xl text-sm font-semibold transition-all"
                >
                  Lihat Detail
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}