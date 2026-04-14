import React, { useEffect, useState } from "react";
import { Users, Baby, Activity, MapPin } from "lucide-react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import StatsCard from "../components/Dashboard/StatsCard";
import WilayahTable from "../components/Dashboard/WilayahTable";
import TrendChart from "../components/Dashboard/TrendChart";
import PrioritasList from "../components/Dashboard/PrioritasList";
import { getDashboardData } from "../services/dashboardService";
import { getCurrentUser } from "../services/auth";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [wilayahData, setWilayahData] = useState([]);
  const [trendData, setTrendData] = useState({ labels: [], values: [] });
  const [prioritasData, setPrioritasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setStats(data.stats);
        setWilayahData(data.wilayah);
        setTrendData(data.trend);
        setPrioritasData(data.prioritas);
      } catch (error) {
        console.error("Failed to load dashboard", error);
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
        <Header user={user} />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Ibu Hamil" value={stats?.totalIbuHamil} target={stats?.targetIbuHamil} icon={Users} color="indigo" />
            <StatsCard title="Total Anak" value={stats?.totalAnak} icon={Baby} color="green" />
            <StatsCard title="Imunisasi" value={stats?.imunisasi} suffix="%" icon={Activity} color="yellow" />
            <StatsCard title="Jumlah Wilayah" value={stats?.jumlahWilayah} icon={MapPin} color="purple" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <WilayahTable data={wilayahData} />
            </div>
            <div className="lg:col-span-1">
              <PrioritasList data={prioritasData} />
            </div>
          </div>
          <div className="mb-6">
            <TrendChart data={trendData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;