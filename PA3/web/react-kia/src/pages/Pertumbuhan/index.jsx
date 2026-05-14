import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import {
  getRiwayatPertumbuhan,
  addCatatanPertumbuhan,
  deleteCatatanPertumbuhan,
  updateCatatanPertumbuhan,
  prediksiStunting,
  getLatestPrediksi,
} from "../../services/pertumbuhan";
import { getAnakById } from "../../services/Anak";
import {
  ChevronLeft, Plus, Trash2, Calendar, Scale, Ruler,
  Info, Pencil, Brain, AlertTriangle, CheckCircle, TrendingUp,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PertumbuhanIndex() {
  const { id } = useParams();
  const [riwayat, setRiwayat] = useState([]);
  const [anak, setAnak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [prediksi, setPrediksi] = useState(null);
  const [prediksiLoading, setPrediksiLoading] = useState(false);
  const [activeChart, setActiveChart] = useState("bb");

  const initialForm = {
    anak_id: parseInt(id),
    tgl_ukur: new Date().toISOString().split("T")[0],
    berat_badan: "",
    tinggi_badan: "",
    lingkar_kepala: "",
    hasil_lila: "",
    catatan_nakes: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resAnak, resRiwayat] = await Promise.all([
        getAnakById(id),
        getRiwayatPertumbuhan(id),
      ]);
      setAnak(resAnak.data || resAnak);
      setRiwayat(resRiwayat.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrediksi = async () => {
    try {
      const res = await getLatestPrediksi(id);
      setPrediksi(res);
    } catch {
      // belum ada prediksi
    }
  };

  useEffect(() => {
    fetchData();
    fetchPrediksi();
  }, [id]);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (r) => {
    setIsEdit(true);
    setCurrentId(r.id);
    setFormData({
      anak_id: r.anak_id,
      tgl_ukur: r.tgl_ukur,
      berat_badan: r.berat_badan?.toString() ?? "",
      tinggi_badan: r.tinggi_badan?.toString() ?? "",
      lingkar_kepala: r.lingkar_kepala?.toString() ?? "",
      hasil_lila: r.hasil_lila?.toString() ?? "",
      catatan_nakes: r.catatan_nakes ?? "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        berat_badan: parseFloat(formData.berat_badan),
        tinggi_badan: parseFloat(formData.tinggi_badan),
        lingkar_kepala: parseFloat(formData.lingkar_kepala) || 0,
        hasil_lila: parseFloat(formData.hasil_lila) || 0,
      };
      if (isEdit) {
        await updateCatatanPertumbuhan(currentId, payload);
      } else {
        await addCatatanPertumbuhan(payload);
      }
      setIsModalOpen(false);
      await fetchData();
      // Prediksi otomatis setelah simpan jika ada LILA
      await runPrediksiOtomatis();
    } catch (err) {
      console.error("Save Error:", err);
      const msg = err.response?.data?.message || err.message || "Gagal menyimpan data";
      alert(msg);
    }
  };

  const runPrediksiOtomatis = async () => {
    try {
      // Ambil riwayat terbaru setelah save
      const res = await getRiwayatPertumbuhan(id);
      const latestRiwayat = res.data || [];
      const lastWithLila = [...latestRiwayat].reverse().find((r) => r.hasil_lila && r.hasil_lila > 0);
      const last = lastWithLila || latestRiwayat[latestRiwayat.length - 1];
      if (!last || !last.hasil_lila) return; // tidak ada LILA, skip

      const rawGender = anak?.jenis_kelamin || "";
      const jenisKelamin = rawGender.toLowerCase().includes("perempuan") ? "Perempuan" : "Laki-laki";

      setPrediksiLoading(true);
      const res2 = await prediksiStunting({
        anak_id:         parseInt(id),
        berat_lahir_kg:  anak?.berat_lahir_kg,
        tinggi_lahir_cm: anak?.tinggi_lahir_cm,
        berat_badan:     last.berat_badan,
        tinggi_badan:    last.tinggi_badan,
        hasil_lila:      last.hasil_lila,
        usia_ukur_bulan: last.usia_ukur_bulan,
        jenis_kelamin:   jenisKelamin,
      });
      setPrediksi(res2);
    } catch {
      // prediksi gagal, abaikan
    } finally {
      setPrediksiLoading(false);
    }
  };

  const handleDelete = async (recId) => {
    if (!window.confirm("Hapus catatan ini?")) return;
    try {
      await deleteCatatanPertumbuhan(recId);
      fetchData();
    } catch {
      alert("Gagal menghapus data");
    }
  };

  // ── Konfigurasi grafik ────────────────────────────────────────────────────
  const chartConfig = {
    bb:   { label: "Berat Badan (kg)", color: "#6366f1", unit: "kg" },
    tb:   { label: "Tinggi Badan (cm)", color: "#8b5cf6", unit: "cm" },
    lila: { label: "LILA (cm)", color: "#f59e0b", unit: "cm" },
    lk:   { label: "Lingkar Kepala (cm)", color: "#10b981", unit: "cm" },
  };

  const chartData = [...riwayat].reverse().map((r) => ({
    bulan: `${r.usia_ukur_bulan}bln`,
    bb:   r.berat_badan   || null,
    tb:   r.tinggi_badan  || null,
    lila: r.hasil_lila    || null,
    lk:   r.lingkar_kepala || null,
  }));

  const clsStyle = (cls) => {
    if (cls === "STUNTING") return { bg: "bg-red-50 border-red-200",    text: "text-red-700",    icon: <AlertTriangle size={20} className="text-red-500" />,    label: "STUNTING"  };
    if (cls === "AT_RISK")  return { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", icon: <AlertTriangle size={20} className="text-orange-500" />, label: "BERISIKO"  };
    return                         { bg: "bg-green-50 border-green-200",  text: "text-green-700",  icon: <CheckCircle   size={20} className="text-green-500" />,   label: "NORMAL"    };
  };

  if (loading) return (
    <MainLayout>
      <div className="p-10 text-center font-medium text-gray-400 animate-pulse">Memuat data...</div>
    </MainLayout>
  );

  const lastData  = riwayat[riwayat.length - 1] || riwayat[0];
  const predStyle = prediksi ? clsStyle(prediksi.classification) : null;

  return (
    <MainLayout>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link
                to={`/data-anak/dashboard/${id}`}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 mb-2 transition-all group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Kembali ke Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Pertumbuhan</h1>
              <p className="text-sm font-semibold text-gray-500 mt-1">
                Anak: <span className="text-indigo-600">{anak?.nama}</span>
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleOpenAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                <Plus size={18} strokeWidth={3} /> Input Pengukuran
              </button>
            </div>
          </div>

          {/* ── PANEL PREDIKSI ML ── */}
          {prediksiLoading && (
            <div className="rounded-3xl border border-purple-200 bg-purple-50 p-4 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-purple-700">Menganalisis risiko stunting...</p>
            </div>
          )}
          {!prediksiLoading && prediksi && predStyle && (
            <div className={`rounded-3xl border p-6 ${predStyle.bg}`}>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex items-center gap-3">
                  {predStyle.icon}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hasil Prediksi ML</p>
                    <p className={`text-2xl font-black ${predStyle.text}`}>{predStyle.label}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 flex-1">
                  <StatChip label="Risiko Stunting" value={`${(prediksi.risk_percentage ?? prediksi.stunting_risk ?? 0).toFixed(1)}%`} color="purple" />
                  <StatChip label="Confidence"      value={`${(prediksi.confidence ?? 0).toFixed(1)}%`}                                color="blue"   />
                  <StatChip label="Z-Score TB/U"    value={(prediksi.z_score_tb_u_estimated ?? prediksi.z_score_tb_u ?? 0).toFixed(2)} color="indigo" />
                  <StatChip label="Status TB/U"     value={prediksi.status_tb_u ?? "-"}                                                color="gray"   />
                </div>
              </div>
              {(prediksi.rekomendasi || prediksi.message) && (
                <div className="mt-4 p-4 bg-white/60 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Rekomendasi</p>
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed">{prediksi.rekomendasi || prediksi.message}</p>
                </div>
              )}
            </div>
          )}

          {/* ── GRAFIK + PANEL KANAN ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Grafik */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-500" /> Grafik Pertumbuhan
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(chartConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setActiveChart(key)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeChart === key ? "text-white shadow-sm" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                      style={activeChart === key ? { backgroundColor: cfg.color } : {}}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: 12 }}
                      formatter={(v) => [`${v} ${chartConfig[activeChart].unit}`, chartConfig[activeChart].label]}
                    />
                    <Line
                      type="monotone"
                      dataKey={activeChart}
                      stroke={chartConfig[activeChart].color}
                      strokeWidth={3}
                      dot={{ r: 5, fill: chartConfig[activeChart].color, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 7 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-gray-300 font-medium italic">
                  Belum ada data untuk ditampilkan
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-50">
                {Object.entries(chartConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="text-[10px] font-bold text-gray-500">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel kanan */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl" />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-3">Pengukuran Terakhir</p>
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="BB"   value={lastData?.berat_badan    ?? "-"} unit="kg" />
                  <MiniStat label="TB"   value={lastData?.tinggi_badan   ?? "-"} unit="cm" />
                  <MiniStat label="LILA" value={lastData?.hasil_lila     || "-"} unit="cm" />
                  <MiniStat label="LK"   value={lastData?.lingkar_kepala || "-"} unit="cm" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info size={14} className="text-indigo-500" /> Status Gizi Terakhir
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "BB/U",  val: lastData?.status_bb_u  },
                    { label: "TB/U",  val: lastData?.status_tb_u  },
                    { label: "BB/TB", val: lastData?.status_bb_tb },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase">{label}</span>
                      <StatusBadge status={val} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-100 p-5 rounded-3xl">
                <h4 className="text-xs font-black text-purple-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Brain size={14} /> Prediksi Stunting
                </h4>
                {prediksiLoading ? (
                  <p className="text-[10px] text-purple-600 font-medium">Menganalisis data...</p>
                ) : prediksi ? (
                  <p className="text-[10px] text-purple-600 leading-relaxed font-medium">
                    Prediksi diperbarui otomatis setiap kali data pengukuran disimpan.
                  </p>
                ) : (
                  <p className="text-[10px] text-purple-600 leading-relaxed font-medium">
                    Prediksi akan berjalan otomatis saat menyimpan data pengukuran dengan <strong>LILA</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── TABEL RIWAYAT ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="text-base font-extrabold text-gray-900">Riwayat Pengukuran</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                    <th className="px-5 py-4">Usia</th>
                    <th className="px-5 py-4">Tanggal</th>
                    <th className="px-5 py-4 text-center">BB (kg)</th>
                    <th className="px-5 py-4 text-center">TB (cm)</th>
                    <th className="px-5 py-4 text-center">LILA (cm)</th>
                    <th className="px-5 py-4 text-center">LK (cm)</th>
                    <th className="px-5 py-4">Status Gizi</th>
                    <th className="px-5 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {riwayat.length > 0 ? riwayat.map((r) => (
                    <tr key={r.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-900">{r.usia_ukur_bulan}</span>
                        <span className="text-[10px] text-gray-400 ml-1 font-bold uppercase">Bln</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar size={11} className="text-gray-300" />
                          <span className="text-xs font-semibold">{r.tgl_ukur}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">{r.berat_badan}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">{r.tinggi_badan}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">{r.hasil_lila || "-"}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">{r.lingkar_kepala || "-"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-gray-400 w-8">BB/U:</span>
                            <StatusBadge status={r.status_bb_u} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-gray-400 w-8">TB/U:</span>
                            <StatusBadge status={r.status_tb_u} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleEdit(r)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-20 text-center text-gray-400 font-medium italic">
                        Belum ada riwayat pengukuran
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* ── MODAL INPUT / EDIT ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-white overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">{isEdit ? "Update Pengukuran" : "Input Pengukuran"}</h2>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isEdit ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                {isEdit ? "Mode Edit" : "Data Baru"}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tanggal */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tanggal Ukur</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input type="date" required
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.tgl_ukur}
                    onChange={(e) => setFormData({ ...formData, tgl_ukur: e.target.value })}
                  />
                </div>
              </div>

              {/* BB & TB */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Berat (kg) *</label>
                  <div className="relative">
                    <Scale size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="number" step="0.01" placeholder="0.0" required
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-10 pr-3 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.berat_badan}
                      onChange={(e) => setFormData({ ...formData, berat_badan: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tinggi (cm) *</label>
                  <div className="relative">
                    <Ruler size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="number" step="0.1" placeholder="0.0" required
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-10 pr-3 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.tinggi_badan}
                      onChange={(e) => setFormData({ ...formData, tinggi_badan: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* LILA & LK */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">LILA (cm)</label>
                  <input type="number" step="0.1" placeholder="Opsional"
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 font-bold text-gray-800 focus:ring-2 focus:ring-amber-400 outline-none"
                    value={formData.hasil_lila}
                    onChange={(e) => setFormData({ ...formData, hasil_lila: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Lingkar Kepala (cm)</label>
                  <input type="number" step="0.1" placeholder="Opsional"
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 font-bold text-gray-800 focus:ring-2 focus:ring-emerald-400 outline-none"
                    value={formData.lingkar_kepala}
                    onChange={(e) => setFormData({ ...formData, lingkar_kepala: e.target.value })}
                  />
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Catatan</label>
                <textarea rows={2} placeholder="Catatan tambahan..."
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.catatan_nakes}
                  onChange={(e) => setFormData({ ...formData, catatan_nakes: e.target.value })}
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-[10px] font-bold text-purple-600">
                  Prediksi stunting ML akan berjalan otomatis setelah menyimpan jika LILA diisi.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all">
                  Batal
                </button>
                <button type="submit"
                  className={`flex-[2] py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${isEdit ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {isEdit ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

// ── Helper Components ─────────────────────────────────────────────────────

function StatusBadge({ status }) {
  if (!status || status === "Data Standar Tidak Tersedia") {
    return <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight bg-gray-100 text-gray-400">-</span>;
  }
  const isNormal   = status.includes("Normal") || status.includes("Baik");
  const isWarning  = status.includes("Kurang") || status.includes("Pendek") || status.includes("Risiko");
  const isCritical = status.includes("Buruk")  || status.includes("Sangat") || status.includes("Stunting") || status.includes("Obesitas");
  let cls = "bg-blue-100 text-blue-700";
  if (isNormal)   cls = "bg-green-100 text-green-700";
  if (isWarning)  cls = "bg-orange-100 text-orange-700";
  if (isCritical) cls = "bg-red-100 text-red-700";
  return <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight ${cls}`}>{status}</span>;
}

function StatChip({ label, value, color }) {
  const map = {
    purple: "bg-purple-100 text-purple-700",
    blue:   "bg-blue-100 text-blue-700",
    indigo: "bg-indigo-100 text-indigo-700",
    gray:   "bg-gray-100 text-gray-700",
  };
  return (
    <div className={`px-4 py-2 rounded-2xl ${map[color] || map.gray}`}>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-base font-black">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, unit }) {
  return (
    <div className="bg-white/10 rounded-2xl p-3">
      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-lg font-black">
        {value} <span className="text-[10px] opacity-60">{unit}</span>
      </p>
    </div>
  );
}
