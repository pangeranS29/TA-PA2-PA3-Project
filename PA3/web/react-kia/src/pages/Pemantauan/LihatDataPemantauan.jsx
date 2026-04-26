import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import {
  getDaftarRisikoTinggi,
  getPrioritasKunjungan,
  getRekapWilayah,
} from "../../services/monitoring";
import { 
  FileText, 
  TriangleAlert, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  Eye, 
  PhoneCall 
} from "lucide-react";

export default function LihatDataPemantauan() {
  const [loading, setLoading] = useState(true);
  const [dataBayi, setDataBayi] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Semua");

  const loadData = async () => {
    setLoading(true);
    try {
      // Menyesuaikan dengan struktur data di gambar
      // Contoh mock data berdasarkan gambar yang Anda berikan
      const mockData = [
        { id: 1, nama: "Bayi Anugrah", ibu: "Siti Aminah", usia: "12 Hari", tanggal: "14 Okt 2023, 08:30", kondisi: ["Sesak Napas", "Demam Tinggi"], status: "BAHAYA" },
        { id: 2, nama: "Bayi Cahaya", ibu: "Ratna Sari", usia: "3 Bulan", tanggal: "14 Okt 2023, 09:15", kondisi: ["Batuk Ringan"], status: "WASPADA" },
        { id: 3, nama: "Bayi Bintang", ibu: "Maya Dwi", usia: "45 Hari", tanggal: "14 Okt 2023, 07:45", kondisi: [], status: "NORMAL" },
        { id: 4, nama: "Bayi Fajar", ibu: "Linda Lestari", usia: "1 Tahun", tanggal: "14 Okt 2023, 10:05", kondisi: ["Kejang"], status: "BAHAYA" },
      ];
      setDataBayi(mockData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    if (statusFilter === "Semua") return dataBayi;
    return dataBayi.filter((item) => item.status === statusFilter.toUpperCase());
  }, [dataBayi, statusFilter]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Data Pemantauan Bayi</h1>
            <p className="text-slate-500">Pantau kondisi bayi berdasarkan laporan checklist harian ibu.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#0052CC] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold">
            <Download size={18} /> Ekspor Laporan
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<FileText className="text-blue-600" />} label="TOTAL INPUT HARI INI" value="124" color="bg-blue-50" />
          <StatCard icon={<TriangleAlert className="text-red-600" />} label="KASUS BAHAYA" value="12" color="bg-red-50" />
          <StatCard icon={<AlertCircle className="text-orange-600" />} label="KASUS WASPADA" value="28" color="bg-orange-50" />
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <FilterGroup label="PERIODE" defaultValue="Hari Ini" />
              <FilterGroup label="KELOMPOK USIA" defaultValue="Semua Usia" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">STATUS</label>
                <div className="flex gap-2">
                  {["Bahaya", "Waspada", "Normal"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                        statusFilter === s ? "bg-slate-800 text-white" : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setStatusFilter("Semua")} className="text-blue-600 text-sm font-semibold flex items-center gap-1">
              <RotateCcw size={14} /> Reset Filter
            </button>
          </div>

          {/* Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 px-2">IDENTITAS</th>
                  <th className="pb-4 px-2">USIA & TANGGAL</th>
                  <th className="pb-4 px-2 text-center">KONDISI TERDETEKSI</th>
                  <th className="pb-4 px-2 text-center">STATUS</th>
                  <th className="pb-4 px-2 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-2">
                      <div className="font-bold text-slate-800">{item.nama}</div>
                      <div className="text-xs text-slate-400">Ibu: {item.ibu}</div>
                    </td>
                    <td className="py-5 px-2">
                      <div className="text-sm font-medium text-slate-700">{item.usia}</div>
                      <div className="text-[11px] text-slate-400">{item.tanggal}</div>
                    </td>
                    <td className="py-5 px-2 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {item.kondisi.length > 0 ? (
                          item.kondisi.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">
                              {c.toUpperCase()}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-300 italic text-xs">Tidak ada keluhan</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-2 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-5 px-2">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 bg-[#0052CC] text-white rounded-lg hover:bg-blue-700">
                          <PhoneCall size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Reusable Components for the UI
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-4`}>
      <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function FilterGroup({ label, defaultValue }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none min-w-[140px]">
        <option>{defaultValue}</option>
      </select>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    BAHAYA: "bg-red-600 text-white",
    WASPADA: "bg-orange-500 text-white",
    NORMAL: "bg-white text-slate-400 border border-slate-200",
  };
  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest inline-block ${styles[status]}`}>
      {status}
    </span>
  );
}