import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { PelayananGiziService } from "../../services/Pelayanan-gizi-anak";
import { 
  ChevronLeft, Save, Baby, Utensils, Droplets, 
  CheckCircle2, Circle, Loader2, Code 
} from 'lucide-react';

const PelayananGiziCreate = () => {
  const { id } = useParams(); // Sesuai route :id
  const navigate = useNavigate();
  
  const [submitting, setSubmitting] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const authUser = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { id: 0, nama: 'Unknown', lokasi: 'Puskesmas' };
    } catch {
      return { id: 0, nama: 'Guest', lokasi: 'Puskesmas' };
    }
  }, []);

  const [formData, setFormData] = useState({
    bulan_ke: 1,
    asi: {
      frekuensi_menyusui: "",
      posisi_menyusui: "",
      asiperah: "" 
    },
    mpasi: {
      sudah_mpasi: null,
      varian_mpasi: [],
      tekstur_mpasi: "",
      jumlah_makan: "",
      frekuensi_makan: {
        makanan_utama: "",
        makanan_selingan: ""
      }
    }
  });

  // --- LOGIC MAPPING PAYLOAD (SOLUSI ERROR 400) ---
  const requestPayload = useMemo(() => {
    return {
      anak_id: parseInt(id) || 0,
      tanggal: new Date().toISOString().split('T')[0],
      tenaga_kesehatan_id: parseInt(authUser.id || authUser.user_id) || 0,
      bulan_ke: parseInt(formData.bulan_ke) || 1,
      lokasi: authUser.lokasi || "Puskesmas Sawo",

      asi: {
        frekuensi_menyusui: parseInt(formData.asi.frekuensi_menyusui) || 0, // Integer
        posisi_menyusui: formData.asi.posisi_menyusui || "tidak",
        asiperah: formData.asi.asiperah || "tidak" // Nama field sesuai JSON target
      },

      mpasi: {
        diberikan_mp_asi: formData.mpasi.sudah_mpasi === true, // Boolean
        variasi_mpasi: formData.mpasi.varian_mpasi,
        jumlah_makan_perporsi: formData.mpasi.jumlah_makan || "",
        // Menggabungkan object frekuensi menjadi string sesuai contoh JSON kamu
        frekuensi_makan_perhari: `${formData.mpasi.frekuensi_makan.makanan_utama || 0}x utama, ${formData.mpasi.frekuensi_makan.makanan_selingan || 0}x selingan`
      }
    };
  }, [formData, id, authUser]);

  // --- Handlers ---
  const handleSubmit = async () => {
    if (formData.mpasi.sudah_mpasi === null) {
      return alert("Mohon tentukan status MPASI (Sudah/Belum)");
    }

    setSubmitting(true);
    try {
      await PelayananGiziService.create(requestPayload);
      alert("✅ Data Pelayanan Gizi Berhasil Disimpan!");
      navigate(`/data-anak/pelayanan-gizi/${id}`);
    } catch (err) {
      console.error("Gagal simpan:", err);
      // Menangkap detail pesan error dari backend
      const errMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
      alert("❌ Gagal Simpan: " + errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAsiChange = (field, value) => {
    setFormData(prev => ({ ...prev, asi: { ...prev.asi, [field]: value } }));
  };

  const handleMpasiToggle = (value) => {
    setFormData(prev => ({
      ...prev,
      mpasi: { 
        ...prev.mpasi, 
        sudah_mpasi: value,
        varian_mpasi: value ? prev.mpasi.varian_mpasi : [],
        tekstur_mpasi: value ? prev.mpasi.tekstur_mpasi : "",
        jumlah_makan: value ? prev.mpasi.jumlah_makan : "",
      }
    }));
  };

  const handleVarianChange = (item) => {
    setFormData(prev => {
      const current = prev.mpasi.varian_mpasi;
      const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
      return { ...prev, mpasi: { ...prev.mpasi, varian_mpasi: next } };
    });
  };

  const updateMpasiField = (field, value) => {
    setFormData(prev => ({ ...prev, mpasi: { ...prev.mpasi, [field]: value } }));
  };

  const handleFrekuensiMakan = (field, value) => {
    setFormData(prev => ({
      ...prev,
      mpasi: {
        ...prev.mpasi,
        frekuensi_makan: { ...prev.mpasi.frekuensi_makan, [field]: value }
      }
    }));
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen pb-24 font-sans">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3">
              <span>Data Anak</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-blue-600 font-black">Pelayanan Gizi</span>
            </nav>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight tracking-tighter">Input Pelayanan Gizi</h1>
            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Petugas: {authUser.nama} • ID Anak: {id}</p>
          </div>
          
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
            <span className="pl-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Bulan Ke-</span>
            <select 
              className="bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold text-blue-700 outline-none cursor-pointer"
              value={formData.bulan_ke}
              onChange={(e) => setFormData({...formData, bulan_ke: e.target.value})}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <Droplets className="text-blue-500" /> Pola ASI
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Frekuensi Menyusui</label>
                  <input 
                    type="number" placeholder="8"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none"
                    value={formData.asi.frekuensi_menyusui}
                    onChange={(e) => handleAsiChange('frekuensi_menyusui', e.target.value)}
                  />
                </div>

                {['posisi_menyusui', 'asiperah'].map((field) => (
                  <div key={field}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{field === 'asiperah' ? 'ASI PERAH' : field.replace('_', ' ')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(field === 'posisi_menyusui' ? ['BAIK', 'TIDAK'] : ['YA', 'TIDAK']).map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleAsiChange(field, opt.toLowerCase())}
                          className={`py-3 rounded-xl text-xs font-black transition-all border-2 ${
                            formData.asi[field] === opt.toLowerCase() 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-200">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Baby size={24} /> Status MPASI</h3>
              <div className="grid grid-cols-2 gap-3">
                {[ { label: 'SUDAH', val: true }, { label: 'BELUM', val: false } ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => handleMpasiToggle(item.val)}
                    className={`py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 ${formData.mpasi.sudah_mpasi === item.val ? 'bg-white text-orange-600 shadow-xl' : 'bg-orange-400/30 text-white border border-orange-400'}`}
                  >
                    {formData.mpasi.sudah_mpasi === item.val && <CheckCircle2 size={16} />}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8">
            {formData.mpasi.sudah_mpasi ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3"><Utensils className="text-orange-500" /> Variasi Makanan</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {['nasi', 'sayur', 'buah', 'Lauk Pauk', 'Minyak/Lemak', 'Lainnya'].map(item => {
                      const isSelected = formData.mpasi.varian_mpasi.includes(item);
                      return (
                        <button
                          key={item} onClick={() => handleVarianChange(item)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 ${isSelected ? 'border-orange-500 bg-orange-50/50' : 'border-slate-50 bg-slate-50 text-slate-500'}`}
                        >
                          <div className={isSelected ? 'text-orange-500' : 'text-slate-300'}>{isSelected ? <CheckCircle2 size={20} /> : <Circle size={20} />}</div>
                          <span className="text-xs font-black">{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Porsi & Jadwal</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Jumlah per Porsi</label>
                        <select 
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                          onChange={(e) => updateMpasiField('jumlah_makan', e.target.value)}
                        >
                          <option value="">Pilih Porsi</option>
                          <option value="1 mangkuk">1 Mangkuk</option>
                          <option value="1/2 mangkuk">1/2 Mangkuk</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Utama</label>
                            <input type="text" placeholder="3x" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={(e) => handleFrekuensiMakan('makanan_utama', e.target.value)} />
                         </div>
                         <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Selingan</label>
                            <input type="text" placeholder="2x" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold outline-none" onChange={(e) => handleFrekuensiMakan('makanan_selingan', e.target.value)} />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <Utensils size={40} className="mb-4 opacity-20" />
                <h4 className="text-xl font-black">Data MPASI Terkunci</h4>
              </div>
            )}
          </div>
        </div>

        {/* --- DEBUG PAYLOAD --- */}
        <div className="mt-16 border-t border-dashed border-slate-200 pt-10 pb-24">
          <button onClick={() => setShowDebug(!showDebug)} className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-6 hover:text-blue-600 transition-colors">
            <Code size={14} /> {showDebug ? 'Sembunyikan Debug' : 'Tampilkan Debug Payload'}
          </button>
          {showDebug && (
            <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
               <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed overflow-auto max-h-[400px]">
                 {JSON.stringify(requestPayload, null, 2)}
               </pre>
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-50">
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="px-6 py-3 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all flex items-center gap-2">
              <ChevronLeft size={16} /> Kembali
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Simpan Data Gizi
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PelayananGiziCreate;