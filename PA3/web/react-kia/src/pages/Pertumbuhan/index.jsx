import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getRiwayatPertumbuhan, addCatatanPertumbuhan, deleteCatatanPertumbuhan, updateCatatanPertumbuhan } from "../../services/pertumbuhan";
import { getAnakById } from "../../services/Anak";
import { ChevronLeft, Plus, Trash2, Calendar, Scale, Ruler, Info, Pencil, HelpCircle } from "lucide-react";

export default function PertumbuhanIndex() {
  const { id } = useParams();
  const [riwayat, setRiwayat] = useState([]);
  const [anak, setAnak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const initialForm = {
    anak_id: parseInt(id),
    tgl_ukur: new Date().toISOString().split("T")[0],
    berat_badan: "",
    tinggi_badan: "",
    lingkar_kepala: "",
    catatan_nakes: ""
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resAnak, resRiwayat] = await Promise.all([
        getAnakById(id),
        getRiwayatPertumbuhan(id)
      ]);
      setAnak(resAnak.data || resAnak);
      setRiwayat(resRiwayat.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEdit(true);
    setCurrentId(record.id);
    setFormData({
      anak_id: record.anak_id,
      tgl_ukur: record.tgl_ukur,
      berat_badan: record.berat_badan.toString(),
      tinggi_badan: record.tinggi_badan.toString(),
      lingkar_kepala: record.lingkar_kepala.toString(),
      catatan_nakes: record.catatan_nakes || ""
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
        lingkar_kepala: parseFloat(formData.lingkar_kepala)
      };

      if (isEdit) {
        await updateCatatanPertumbuhan(currentId, payload);
      } else {
        await addCatatanPertumbuhan(payload);
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (recId) => {
    if (window.confirm("Hapus catatan ini?")) {
      try {
        await deleteCatatanPertumbuhan(recId);
        fetchData();
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };

  if (loading) return <MainLayout><div className="p-10 text-center font-medium text-gray-400 animate-pulse">Memuat data...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Link to={`/data-anak/dashboard/${id}`} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 mb-2 transition-all group">
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Kembali ke Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Pertumbuhan</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Anak: {anak?.nama}</p>
              </div>
            </div>
            <button 
              onClick={handleOpenAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <Plus size={20} strokeWidth={3} /> Input Hasil Pengukuran
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: TABLE SECTION */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                        <th className="px-6 py-5">Usia</th>
                        <th className="px-6 py-5">Tanggal</th>
                        <th className="px-6 py-5 text-center">BB (kg)</th>
                        <th className="px-6 py-5 text-center">TB (cm)</th>
                        <th className="px-6 py-5">Status Gizi</th>
                        <th className="px-6 py-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {riwayat.length > 0 ? riwayat.map((r) => (
                        <tr key={r.id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-5">
                            <span className="text-sm font-bold text-gray-900">{r.usia_ukur_bulan}</span>
                            <span className="text-[10px] text-gray-400 ml-1 font-bold uppercase">Bln</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar size={12} className="text-gray-300" />
                                <span className="text-xs font-semibold">{r.tgl_ukur}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                             <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                                {r.berat_badan}
                             </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                             <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                                {r.tinggi_badan}
                             </span>
                          </td>
                          <td className="px-6 py-5">
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
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleEdit(r)}
                                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                  title="Edit Data"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(r.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                  title="Hapus Data"
                                >
                                  <Trash2 size={18} />
                                </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-medium italic">
                            Belum ada riwayat pengukuran
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT: INFO PANEL */}
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                      <HelpCircle size={80} />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <Info size={20} className="text-indigo-500" />
                    Penjelasan Status Gizi
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1.5">BB/U (Berat Badan / Umur)</h4>
                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                            Menentukan kategori berat badan anak (Gizi Buruk, Gizi Kurang, Normal, atau Risiko Berat Badan Lebih). Parameter ini cepat menunjukkan perubahan status gizi saat ini.
                        </p>
                    </div>

                    <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                        <h4 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1.5">TB/U (Tinggi Badan / Umur)</h4>
                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                            Menentukan kategori tinggi badan (Sangat Pendek/Stunting, Pendek, Normal, atau Tinggi). Parameter ini mencerminkan status gizi masa lalu (kronis).
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <LegendBadge label="Normal" color="green" />
                        <LegendBadge label="Kurang/Pendek" color="orange" />
                        <LegendBadge label="Buruk/Stunting" color="red" />
                        <LegendBadge label="Lebih/Tinggi" color="blue" />
                    </div>
                  </div>
               </div>

               {/* QUICK STATS */}
               <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                  <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">Ringkasan Terakhir</h4>
                  <div className="flex justify-between items-end">
                      <div>
                          <p className="text-3xl font-black">{riwayat[0]?.berat_badan || 0} <span className="text-sm opacity-60">kg</span></p>
                          <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Berat Terakhir</p>
                      </div>
                      <div className="text-right">
                          <p className="text-xl font-bold uppercase tracking-tight">{riwayat[0]?.status_bb_u || '-'}</p>
                          <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Kategori BB/U</p>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL INPUT / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200 border border-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900">{isEdit ? 'Update Pengukuran' : 'Input Pengukuran'}</h2>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isEdit ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {isEdit ? 'Mode Edit' : 'Data Baru'}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tanggal Ukur</label>
                <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input 
                      type="date" 
                      className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                      value={formData.tgl_ukur}
                      onChange={(e) => setFormData({...formData, tgl_ukur: e.target.value})}
                      required 
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Berat (kg)</label>
                  <div className="relative">
                    <Scale size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input 
                        type="number" step="0.01" 
                        className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                        value={formData.berat_badan}
                        onChange={(e) => setFormData({...formData, berat_badan: e.target.value})}
                        placeholder="0.0"
                        required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tinggi (cm)</label>
                  <div className="relative">
                    <Ruler size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input 
                        type="number" step="0.1" 
                        className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                        value={formData.tinggi_badan}
                        onChange={(e) => setFormData({...formData, tinggi_badan: e.target.value})}
                        placeholder="0.0"
                        required 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Lingkar Kepala (cm)</label>
                <input 
                  type="number" step="0.1" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                  value={formData.lingkar_kepala}
                  onChange={(e) => setFormData({...formData, lingkar_kepala: e.target.value})}
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Catatan Tambahan</label>
                <textarea 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
                  value={formData.catatan_nakes}
                  onChange={(e) => setFormData({...formData, catatan_nakes: e.target.value})}
                  rows={2}
                  placeholder="Ketik catatan di sini..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all"
                >
                    Batal
                </button>
                <button 
                  type="submit" 
                  className={`flex-[2] py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${isEdit ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                >
                    {isEdit ? 'Simpan Perubahan' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

function StatusBadge({ status }) {
    if (!status || status === "Data Standar Tidak Tersedia") {
        return <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight bg-gray-100 text-gray-400">Belum Terhitung</span>;
    }
    
    const isNormal = status.includes('Normal') || status.includes('Baik');
    const isWarning = status.includes('Kurang') || status.includes('Pendek') || status.includes('Risiko');
    const isCritical = status.includes('Buruk') || status.includes('Sangat') || status.includes('Stunting') || status.includes('Obesitas');

    let bgColor = "bg-blue-100 text-blue-700"; // Default (Lebih/Tinggi)
    if (isNormal) bgColor = "bg-green-100 text-green-700";
    if (isWarning) bgColor = "bg-orange-100 text-orange-700";
    if (isCritical) bgColor = "bg-red-100 text-red-700";

    return (
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight ${bgColor}`}>
            {status}
        </span>
    );
}

function LegendBadge({ label, color }) {
    const colors = {
        green: "bg-green-500",
        orange: "bg-orange-500",
        red: "bg-red-500",
        blue: "bg-blue-500"
    };
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${colors[color]}`}></div>
            <span className="text-[10px] font-bold text-gray-500">{label}</span>
        </div>
    );
}
