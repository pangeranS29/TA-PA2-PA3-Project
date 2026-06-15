import React, { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { getCurrentUser, isDokterUser } from "../../services/auth";
import {
  Building2,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Syringe,
  ShieldCheck,
  Activity,
} from "lucide-react";

const DashboardPuskesmas = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalVaksin: 0,
    totalDosis: 0,
    jadwalHariIni: 0,
    pasienAktif: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Placeholder stats — replace with real API calls later
      setStats({
        totalVaksin: 12,
        totalDosis: 36,
        jadwalHariIni: 8,
        pasienAktif: 245,
      });
    } catch (error) {
      console.error("Gagal memuat dashboard puskesmas:", error);
    }
  };

  const isDokter = isDokterUser(user);

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard Puskesmas
              </h1>
              <p className="text-gray-500 text-sm">
                Selamat datang,{" "}
                {user?.nama || user?.name || user?.role || "User"}
                {!isDokter ? " (Bidan Puskesmas)" : " (Dokter)"}
              </p>
            </div>
          </div>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Vaksin</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalVaksin}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
                <Syringe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Dosis</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalDosis}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 text-purple-800">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Jadwal Hari Ini
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.jadwalHariIni}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 text-green-800">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pasien Aktif</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.pasienAktif}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 text-orange-800">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Syringe className="w-5 h-5 text-blue-600" />
              Manajemen Vaksin & Dosis
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Kelola data vaksin dan dosis vaksin untuk pelayanan imunisasi.
            </p>
            <a
              href="/puskesmas/kelola-vaksin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Syringe className="w-4 h-4" />
              Kelola Vaksin
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-green-600" />
              Dashboard Dokter
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Lihat jadwal pemeriksaan, pasien terbaru, dan data rujukan.
            </p>
            <a
              href="/puskesmas/dashboard-dokter"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Stethoscope className="w-4 h-4" />
              Buka Dashboard Dokter
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPuskesmas;
