import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { getAnak } from "../../services/Anak";
import { getRentangPerkembangan, getPerkembanganHistory } from "../../services/perkembanganAnak";
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  Download,
  RotateCcw,
  Eye,
  Search,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LihatDataPerkembangan() {
  const [loading, setLoading] = useState(true);
  const [dataBayi, setDataBayi] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, sesuai: 0, perlu_pantau: 0 });

  const loadData = async () => {
    setLoading(true);
    try {
      const resAnak = await getAnak();
      const listAnak = Array.isArray(resAnak?.data) ? resAnak.data : (Array.isArray(resAnak) ? resAnak : []);

      const resRentang = await getRentangPerkembangan();
      const rentangList = Array.isArray(resRentang?.data) ? resRentang.data : (Array.isArray(resRentang) ? resRentang : []);
      const latestRentang = rentangList?.[0];

      const processedData = await Promise.all(
        listAnak.map(async (anak) => {
          try {
            let history = [];
            // We use 0 to get all history, backend repo handles this
            const resHistory = await getPerkembanganHistory(anak.id, 0);
            history = Array.isArray(resHistory?.data) ? resHistory.data : (Array.isArray(resHistory) ? resHistory : []);

            const latestEntry = history[0];
            const details = latestEntry?.detail_perkembangan || [];
            const hasIssues = details.some(d => d.jawaban === false);
            const hasFilled = details.length > 0;

            let status = "BELUM_ISI";
            if (hasFilled) {
              status = hasIssues ? "PERLU_PANTAU" : "SESUAI";
            }

            return {
              id: anak.id,
              nama: anak.nama || "Tanpa Nama",
              ibu: anak.kehamilan?.ibu?.nama_ibu || "-",
              usia: anak.usia_teks || "-",
              tanggal: latestEntry ? new Date(latestEntry.updated_at).toLocaleDateString("id-ID") : "-",
              status: status,
              milestone: latestEntry?.rentang_usia?.nama_rentang || "-"
            };
          } catch (err) {
            console.error(`Error processing anak ${anak.id}:`, err);
            return {
              id: anak.id,
              nama: anak.nama || "Tanpa Nama",
              ibu: anak.kehamilan?.ibu?.nama_ibu || "-",
              usia: anak.usia_teks || "-",
              tanggal: "-",
              status: "BELUM_ISI",
              milestone: "-"
            };
          }
        })
      );

      setDataBayi(processedData);
      setStats({
        total: processedData.length,
        sesuai: processedData.filter(d => d.status === "SESUAI").length,
        perlu_pantau: processedData.filter(d => d.status === "PERLU_PANTAU").length,
      });

    } catch (error) {
      console.error("Error loading perkembangan data:", error);
      // Fallback to empty but at least don't crash
      setDataBayi([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return dataBayi.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = statusFilter === "Semua" || item.status === statusFilter.toUpperCase();
      return matchesSearch && matchesFilter;
    });
  }, [dataBayi, searchTerm, statusFilter]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Monitoring Perkembangan Anak</h1>
            <p className="text-slate-500">Pantau pencapaian milestone perkembangan anak dari laporan Ibu.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm shadow-indigo-100">
            <Download size={18} /> Ekspor Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<ClipboardCheck className="text-indigo-600" />} label="TOTAL ANAK" value={stats.total} color="bg-indigo-50" />
          <StatCard icon={<CheckCircle className="text-green-600" />} label="SESUAI UMUR" value={stats.sesuai} color="bg-green-50" />
          <StatCard icon={<AlertTriangle className="text-amber-600" />} label="PERLU PANTAU" value={stats.perlu_pantau} color="bg-amber-50" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-5">
            <div className="flex flex-wrap items-center gap-6">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama anak..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {["Semua", "Sesuai", "Perlu_Pantau", "Belum_Isi"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${statusFilter === s
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { setStatusFilter("Semua"); setSearchTerm(""); }} className="text-indigo-600 text-xs font-bold flex items-center gap-1">
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 px-2">IDENTITAS ANAK</th>
                  <th className="pb-4 px-2">KATEGORI UMUR</th>
                  <th className="pb-4 px-2">TERAKHIR CEK</th>
                  <th className="pb-4 px-2 text-center">STATUS</th>
                  <th className="pb-4 px-2 text-right">DETAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-300 italic">Memproses data...</td></tr>
                ) : filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-2">
                      <div className="font-bold text-slate-800">{item.nama}</div>
                      <div className="text-[10px] text-slate-400 font-medium">IBU: {item.ibu}</div>
                    </td>
                    <td className="py-5 px-2">
                      <div className="text-sm font-semibold text-slate-600">{item.milestone}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.usia}</div>
                    </td>
                    <td className="py-5 px-2">
                      <div className="text-xs font-medium text-slate-500">{item.tanggal}</div>
                    </td>
                    <td className="py-5 px-2 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-5 px-2">
                      <div className="flex justify-end">
                        <Link
                          to={`/data-anak/perkembangan/${item.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-bold"
                        >
                          <Eye size={14} /> LIHAT HASIL <ChevronRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && !loading && (
              <div className="py-20 text-center text-slate-400 italic">Data tidak ditemukan.</div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

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

function StatusBadge({ status }) {
  const configs = {
    SESUAI: "bg-green-100 text-green-700",
    PERLU_PANTAU: "bg-amber-100 text-amber-700",
    BELUM_ISI: "bg-slate-100 text-slate-400",
  };
  return (
    <span className={`px-3 py-1 rounded-md text-[10px] font-black tracking-widest inline-block ${configs[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
