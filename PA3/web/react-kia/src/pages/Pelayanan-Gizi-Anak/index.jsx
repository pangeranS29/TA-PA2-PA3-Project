import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { PelayananGiziService } from "../../services/Pelayanan-gizi-anak";
import { Plus, Calendar, Baby, FileText, ChevronRight, Loader2, Trash2, Edit } from 'lucide-react';

const PelayananGiziIndex = () => {
  const { id: anakId } = useParams();
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const data = await PelayananGiziService.getByAnakId(anakId);
      // Mengurutkan dari bulan terbaru ke terlama
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => b.bulan_ke - a.bulan_ke) 
        : [];
      setRiwayat(sortedData);
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (anakId) fetchRiwayat();
  }, [anakId]);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan bulan ini?")) {
      try {
        await PelayananGiziService.delete(id);
        fetchRiwayat(); 
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-8 bg-slate-50 min-h-screen">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                <Baby size={28} />
              </div>
              Riwayat Gizi
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3 ml-1">
              ID Anak: {anakId} • Pantau Nutrisi Bulanan
            </p>
          </div>
          
          <button 
            onClick={() => navigate(`/data-anak/pelayanan-gizi/${anakId}/create`)}
            className="group flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            Input Data Baru
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4 opacity-20" />
            <p className="font-black text-slate-300 uppercase tracking-[0.3em] text-[10px]">Sinkronisasi Data...</p>
          </div>
        ) : riwayat.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {riwayat.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all relative">
                
                {/* Header Card */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                      <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-blue-200">Bulan</span>
                      <span className="text-2xl font-black text-slate-800 group-hover:text-white leading-none">{item.bulan_ke}</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Calendar size={10} /> {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                        </p>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-lg uppercase">Record #{item.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate(`/pelayanan-gizi/anak/${anakId}/edit/${item.id}`)}
                      className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Posisi Menyusu</span>
                    <span className={`text-[10px] font-black uppercase ${item.asi?.posisi_menyusui === 'benar' ? 'text-green-600' : 'text-amber-600'}`}>
                      {item.asi?.posisi_menyusui || '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Status MPASI</span>
                    <span className={`text-[10px] font-black uppercase ${item.mpasi?.sudah_mpasi ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.mpasi?.sudah_mpasi ? 'Sudah MPASI' : 'Hanya ASI'}
                    </span>
                  </div>
                </div>

                {/* Footer Card */}
                <button 
                  onClick={() => navigate(`/pelayanan-gizi/anak/${anakId}/edit/${item.id}`)}
                  className="w-full py-4 bg-slate-50 group-hover:bg-blue-50 rounded-2xl text-slate-400 group-hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  Lihat Detail <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-[3rem] p-20 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 border border-slate-50">
              <FileText size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Data Masih Kosong</h3>
            <p className="text-slate-400 max-w-sm mb-10 text-sm font-medium leading-relaxed">
              Anak ini belum memiliki riwayat pelayanan gizi. Mulai catat perkembangan nutrisinya sekarang.
            </p>
            <button 
              onClick={() => navigate(`/data-anak/pelayanan-gizi/${anakId}/create`)}
              className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 shadow-2xl shadow-blue-200 transition-all"
            >
              Buat Catatan Pertama
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PelayananGiziIndex;