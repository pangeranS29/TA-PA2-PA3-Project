// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Users, Baby, Activity, MapPin } from "lucide-react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import StatsCard from "../components/Dashboard/StatsCard";
import WilayahTable from "../components/Dashboard/WilayahTable";
import TrendChart from "../components/Dashboard/TrendChart";
import PrioritasList from "../components/Dashboard/PrioritasList";
import { getDashboardData } from "../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIbuHamil: 124,
    targetIbuHamil: 95,
    totalAnak: 542,
    jumlahWilayah: 4,
    imunisasi: 90.2,
  });
  const [wilayahData, setWilayahData] = useState([]);
  const [trendData, setTrendData] = useState({ labels: [], values: [] });
  const [prioritasData, setPrioritasData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardData();
        if (res) {
          setStats(res.stats);
          setWilayahData(res.wilayah);
          setTrendData(res.trend);
          setPrioritasData(res.prioritas);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        // Fallback to mock data
        setWilayahData([
          { dusun: "Dusun Mawar", ibuHamil: 42, anak: 156, risikoTinggi: 12, cakupanImunisasi: 88.5, status: "Risiko Tinggi" },
          { dusun: "Dusun Kenanga", ibuHamil: 35, anak: 124, risikoTinggi: 3, cakupanImunisasi: 96.2, status: "Aman (Low)" },
          { dusun: "Dusun Anggrek", ibuHamil: 28, anak: 98, risikoTinggi: 5, cakupanImunisasi: 91.0, status: "Waspada (Med)" },
          { dusun: "Dusun Kamboja", ibuHamil: 19, anak: 164, risikoTinggi: 8, cakupanImunisasi: 85.4, status: "Risiko Tinggi" },
        ]);
        setTrendData({
          labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
          values: [20, 15, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
        });
        setPrioritasData([
          { dusun: "Dusun Mawar", kasus: 12, priority: "High" },
          { dusun: "Dusun Kamboja", kasus: 8, priority: "High" },
          { dusun: "Dusun Anggrek", kasus: 5, priority: "Med" },
          { dusun: "Dusun Kenanga", kasus: 3, priority: "Low" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Ibu Hamil" value={stats.totalIbuHamil} target={stats.targetIbuHamil} icon={Users} color="indigo" />
            <StatsCard title="Total Anak" value={stats.totalAnak} icon={Baby} color="green" />
            <StatsCard title="Imunisasi" value={stats.imunisasi} suffix="%" icon={Activity} color="yellow" />
            <StatsCard title="Jumlah Wilayah" value={stats.jumlahWilayah} icon={MapPin} color="purple" />
          </div>

          {/* Table & Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <WilayahTable data={wilayahData} />
            </div>
            <div className="lg:col-span-1">
              <PrioritasList data={prioritasData} />
            </div>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <TrendChart data={trendData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;