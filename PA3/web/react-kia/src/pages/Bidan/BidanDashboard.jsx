import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";

export default function BidanDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Bidan"); // atau "Kader"

  const menuItems = [
    {
      id: 1,
      title: "Kelola Profil Ibu",
      description: "Cari dan kelola data profil ibu hamil",
      icon: "👩‍🤰",
      color: "from-pink-500 to-pink-600",
      action: () => navigate("/bidan/profil-ibu"),
    },
    {
      id: 2,
      title: "Data Kehamilan",
      description: "Input dan monitor data kehamilan ibu",
      icon: "🤰",
      color: "from-purple-500 to-purple-600",
      action: () => navigate("/bidan/kehamilan"),
    },
    {
      id: 3,
      title: "Kelola Profil Anak",
      description: "Kelola data profil dan riwayat anak",
      icon: "👶",
      color: "from-blue-500 to-blue-600",
      action: () => navigate("/bidan/profil-anak"),
    },
    {
      id: 4,
      title: "Rekap Imunisasi",
      description: "Lihat rekap lengkap imunisasi anak",
      icon: "📊",
      color: "from-green-500 to-green-600",
      action: () => navigate("/bidan/imunisasi"),
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Bidan/Kader
          </h1>
          <p className="text-gray-600">
            Kelola data ibu hamil, anak, dan imunisasi dengan mudah
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-8 flex gap-3">
          {["Bidan", "Kader"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {r === "Bidan" ? "👨‍⚕️" : "👤"} {r}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="text-left transform transition hover:scale-105"
            >
              <div className={`bg-gradient-to-br ${item.color} rounded-lg shadow-lg p-6 text-white h-full`}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-blue-100">{item.description}</p>
                <div className="mt-4 inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
                  Buka →
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <h4 className="font-bold text-blue-900 mb-2">📋 Total Ibu Hamil</h4>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <h4 className="font-bold text-green-900 mb-2">👶 Total Anak</h4>
            <p className="text-2xl font-bold text-green-600">32</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <h4 className="font-bold text-purple-900 mb-2">💉 Imunisasi Hari Ini</h4>
            <p className="text-2xl font-bold text-purple-600">5</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
