import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getAnakById } from "../../services/Anak";
import { getPertumbuhanChart } from "../../services/pertumbuhan";
import GrowthChart from "../../components/Dashboard/GrowthChart";

import {
  ChevronLeft, Baby, Ruler, Activity, Calendar, User,
  Plus, X, Apple, Syringe, TrendingUp, Smile, ChartLine, Stethoscope, ClipboardList
} from "lucide-react";

export default function AnakDashboard() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState("bb_u"); // "bb_u" or "tb_u"

  useEffect(() => {
    let isMounted = true;
    const fetchDetailData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const [resAnak, resChart] = await Promise.all([
          getAnakById(id),
          getPertumbuhanChart(id)
        ]);

        if (isMounted) {
          const childData = resAnak.data || resAnak;
          // Guard: pastikan data valid minimal punya nama/id
          if (childData && (childData.nama || childData.id)) {
            setChild(childData);
          } else {
            throw new Error("Data tidak ditemukan");
          }
          setChartData(resChart.data || resChart);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching detail data:", err);
          setError("Gagal mengambil data detail anak.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDetailData();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) return <MainLayout><div className="p-10 text-center font-medium text-gray-400">Memuat...</div></MainLayout>;
  if (error) return <MainLayout><div className="p-10 text-center text-red-500">{error}</div></MainLayout>;

  const growthData = child?.pertumbuhan || [];
  const isLaki = child?.jenis_kelamin?.toLowerCase() === "laki-laki";
  const themeColor = isLaki ? "#3b82f6" : "#ec4899";

  const menuInput = [
    { title: "Kesehatan Bayi", subtitle: "(0 - 28 Hari)", icon: <Baby size={32} />, link: `/data-anak/neonatus/${id}` },
    { title: "Gizi & Obat Cacing", icon: <Apple size={32} />, link: `/data-anak/pelayanan-gizi/${id}` },
    { title: "Imunisasi", icon: <Syringe size={32} />, link: `/data-anak/pelayanan-Imunisasi/${id}` },
    { title: "Kesehatan Gigi", icon: <Smile size={32} />, link: `/data-anak/pelayanan-Gigi/${id}` },
    { title: "Tumbuh Kembang", icon: <TrendingUp size={32} />, link: `/data-anak/Tumbuh-kembang-Anak/${id}` },
    { title: "Pencatatan LILA", icon: <Ruler size={32} />, link: `/data-anak/lila/${id}` },
    { title: "Pertumbuhan", icon: <Activity size={32} />, link: `/data-anak/pertumbuhan/${id}` },
    { title: "Keluhan Anak", icon: <Stethoscope size={32} />, link: `/data-anak/keluhan/${id}` },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">

        {/* HEADER: Lebih rapat */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Link to="/daftar-anak" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 mb-1 transition-all">
              <ChevronLeft size={14} /> Kembali
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{child.nama}</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <Plus size={18} /> Input Data
          </button>
        </div>

        {/* STAT CARDS: Lebih ramping */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Calendar size={20} />} label="Usia" value={child.usia_teks || "-"} color="blue" />
          <StatCard icon={<User size={20} />} label="Ibu" value={child.kehamilan?.ibu?.nama_ibu || "-"} color="blue" />
          <StatCard icon={<Activity size={20} />} label="BB" value={`${growthData[growthData.length - 1]?.berat_badan || 0} kg`} color="blue" />
          <StatCard icon={<Ruler size={20} />} label="TB" value={`${growthData[growthData.length - 1]?.tinggi_badan || 0} cm`} color="blue" />
        </div>

        {/* GRAFIK: Ukuran standar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveChart("bb_u")}
                className={`text-sm font-bold px-3 py-1 rounded-lg transition-all ${activeChart === 'bb_u' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                Berat Badan
              </button>
              <button
                onClick={() => setActiveChart("tb_u")}
                className={`text-sm font-bold px-3 py-1 rounded-lg transition-all ${activeChart === 'tb_u' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                Tinggi Badan
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              <Activity size={12} />
              Standar Permenkes 2/2020
            </div>
          </div>

          <div className="h-[280px]">
            <GrowthChart
              data={chartData}
              type={activeChart}
              gender={child.jenis_kelamin}
            />
          </div>
        </div>

        {/* MODAL: Versi Ringkas (Compact) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Container Modal */}
            <div className="relative bg-[#F3F4F6] w-full max-w-lg rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">

              {/* Tombol Close (Opsional, di gambar tidak ada tapi bagus untuk UX) */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-0 -right-0    z-[1000] bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-all active:scale-90"
              >
                <X size={20} strokeWidth={3} />
              </button>

              {/* Grid Menu */}
              <div className="grid grid-cols-2 gap-5">
                {menuInput.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className={`
              relative bg-white p-6 rounded-[28px] flex flex-col items-center text-center justify-center gap-3 
              transition-all duration-200 group shadow-sm hover:shadow-md active:scale-95
              ${item.active ? 'border-[3px] border-blue-400' : 'border-[3px] border-transparent'}
            `}
                  >
                    {/* Icon Box */}
                    <div className="text-blue-600 transition-transform group-hover:scale-110">
                      {item.icon}
                    </div>

                    {/* Text Box */}
                    <div className="flex flex-col items-center">
                      <span className="text-[15px] font-bold text-gray-900 leading-tight">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[14px] font-bold text-gray-900 mt-1">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    purple: "bg-blue-50 text-blue-500",
  };
  return (
    <div className="bg-white p-3.5 rounded-xl border border-gray-100 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</p>
        <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}