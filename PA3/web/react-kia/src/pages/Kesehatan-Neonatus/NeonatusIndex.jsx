import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from "../../components/Layout/MainLayout";
import DynamicInput from "./DynamicInput";
import { neonatusService } from "../../services/Neonatus";
import { Scale, User, Loader2, ClipboardCheck, Stethoscope, ChevronLeft, Calendar, Edit3, PlusCircle, Save } from 'lucide-react';

const NeonatusIndex = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const authUser = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { id: 0, nama: 'Unknown', lokasi: 'Puskesmas' };
    } catch {
      return { id: 0, nama: 'Guest', lokasi: 'Puskesmas' };
    }
  }, []);

  const [activeTab, setActiveTab] = useState('0-6 JAM');
  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' or 'FORM'
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [pelayananList, setPelayananList] = useState([]);
  const [allRecords, setAllRecords] = useState([]); // Store all 4 periods data
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingRecordId, setExistingRecordId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const tabToPeriode = { '0-6 JAM': 1, 'KN1': 2, 'KN2': 3, 'KN3': 4 };

  // --- LOAD ALL DATA FOR LIST ---
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await neonatusService.getPemeriksaanDetail(id);
      setAllRecords(Array.isArray(res) ? res : (res ? [res] : []));
    } catch (err) {
      console.error("Gagal memuat daftar pemeriksaan:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && viewMode === 'LIST') loadAllData();
  }, [id, viewMode, loadAllData]);

  // --- LOAD STRUCTURE FOR SPECIFIC FORM ---
  useEffect(() => {
    const loadFormStructure = async () => {
      if (viewMode !== 'FORM') return;
      
      setLoading(true);
      setFormData({});
      setExistingRecordId(null);

      try {
        const periodeId = tabToPeriode[activeTab];

        // 1. Load Struktur Form
        const list = await neonatusService.getJenisPelayanan(periodeId);
        setPelayananList(list || []);

        // 2. Find Existing Data from allRecords
        const data = allRecords.find(r => r.periode_id === periodeId);
        if (data) {
          setExistingRecordId(data.id);
          if (data.tanggal) setTanggal(data.tanggal.split('T')[0]);

          const mapped = {};
          if (data.detail_pelayanan) {
            data.detail_pelayanan.forEach(d => {
              mapped[d.jenis_pelayanan_id] = d.nilai;
            });
          }
          setFormData(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat struktur form:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFormStructure();
  }, [activeTab, viewMode, allRecords]);

  // --- HANDLERS ---
  const handleInputChange = useCallback((itemId, val) => {
    setFormData(prev => ({ ...prev, [itemId]: val }));
  }, []);

  const handleCheckboxChange = useCallback((itemId) => {
    setFormData(prev => {
      const val = prev[itemId];
      const isCurrentlyChecked = val === true || val === "true" || val === 1 || val === "1";
      return { ...prev, [itemId]: !isCurrentlyChecked };
    });
  }, []);

  const groups = useMemo(() => {
    const filter = (g) => pelayananList.filter(i => i.group_name?.toLowerCase().includes(g.toLowerCase()));
    return {
      antropometri: filter('antropometri'),
      bbl: filter('bbl'),
      observasi: filter('observasi'),
    };
  }, [pelayananList]);

  const requestPayload = useMemo(() => {
    const nakesId = authUser?.tenaga_kesehatan_id || authUser?.user_id || authUser?.id || 0;
    return {
      anak_id: parseInt(id),
      tanggal: tanggal,
      periode_id: tabToPeriode[activeTab],
      kategori_umur_id: 1,
      lokasi: authUser.lokasi || "Puskesmas Sawo Hutabulu",
      tenaga_kesehatan_id: parseInt(nakesId),
      detail_pelayanan: Object.keys(formData).map(key => ({
        jenis_pelayanan_id: parseInt(key),
        nilai: formData[key] === true || formData[key] === "1" ? "1" : 
               formData[key] === false || formData[key] === "0" ? "0" : 
               (formData[key] || "").toString(),
        keterangan: ""
      }))
    };
  }, [id, tanggal, activeTab, formData, authUser]);

  const handleFinalSubmit = async () => {
    if (requestPayload.detail_pelayanan.length === 0) return alert("Mohon isi data terlebih dahulu.");

    setSubmitting(true);
    try {
      if (existingRecordId) {
        await neonatusService.updatePemeriksaan(existingRecordId, requestPayload);
      } else {
        await neonatusService.savePemeriksaan(requestPayload);
      }
      
      // AUTO REDIRECT TO LIST AFTER SUCCESS
      setViewMode('LIST');
      loadAllData(); // Refresh list
      alert("✅ Data berhasil disimpan.");
    } catch (err) {
      alert("❌ Gagal: " + (err.message || "Kesalahan Server"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (periodeName) => {
    setActiveTab(periodeName);
    setViewMode('FORM');
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-20 px-4">
        {/* HEADER */}
        <header className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <User size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">Pemeriksaan Neonatus</h1>
                {existingRecordId ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded border border-amber-200 uppercase">
                    <Edit3 size={10} /> Mode Edit
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black rounded border border-green-200 uppercase">
                    <PlusCircle size={10} /> Mode Baru
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest">
                ID Anak: {id} • Petugas: {authUser.nama}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
                onClick={() => navigate(`/data-anak/dashboard/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
                <ClipboardCheck size={12} /> Kembali ke Dashboard
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="font-bold text-gray-400 uppercase text-[9px] tracking-widest leading-relaxed">Menyinkronkan Data...</p>
          </div>
        ) : viewMode === 'LIST' ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Periode Pemeriksaan</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Object.keys(tabToPeriode).map(key => {
                    const record = allRecords.find(r => r.periode_id === tabToPeriode[key]);
                    return (
                      <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <p className="text-xs font-bold text-slate-900">{key}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Kesehatan Neonatus</p>
                        </td>
                        <td className="p-5 text-xs font-bold text-slate-600">
                          {record?.tanggal ? new Date(record.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                        </td>
                        <td className="p-5">
                          {record ? (
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[9px] font-black rounded-full uppercase">Lengkap</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-[9px] font-black rounded-full uppercase">Belum Diisi</span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => handleEdit(key)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            {record ? 'Edit Data' : 'Isi Form'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setViewMode('LIST')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Input Data {activeTab}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lengkapi parameter klinis dibawah ini</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-blue-600" size={14} />
                        <input
                            type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                            className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                    <Scale size={14} /> Vital Signs
                  </h3>
                  <div className="space-y-4">
                    {groups.antropometri.map(item => (
                      <DynamicInput key={item.jenis_pelayanan_id} item={item} value={formData[item.jenis_pelayanan_id]} onChange={handleInputChange} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                    <ClipboardCheck size={14} /> Tindakan Medis
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {groups.bbl.map(item => (
                      <DynamicInput key={item.jenis_pelayanan_id} item={item} value={formData[item.jenis_pelayanan_id]} onToggle={handleCheckboxChange} />
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                    <Stethoscope size={14} /> Pemeriksaan Fisik
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {groups.observasi.filter(i => i.tipe_input === 'checkbox').map(item => (
                        <DynamicInput key={item.jenis_pelayanan_id} item={item} value={formData[item.jenis_pelayanan_id]} onToggle={handleCheckboxChange} />
                      ))}
                    </div>
                    {groups.observasi.filter(i => i.tipe_input === 'text').map(item => (
                      <DynamicInput key={item.jenis_pelayanan_id} item={item} value={formData[item.jenis_pelayanan_id]} onChange={handleInputChange} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                <button 
                    onClick={() => setViewMode('LIST')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={handleFinalSubmit} disabled={submitting}
                    className="px-10 py-3 bg-blue-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
                >
                    {submitting ? 'Proses...' : existingRecordId ? 'Simpan Perubahan' : 'Finalisasi & Simpan'}
                </button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default NeonatusIndex;