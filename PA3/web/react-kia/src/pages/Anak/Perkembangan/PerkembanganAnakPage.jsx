import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../../components/Layout/MainLayout";
import { ChevronLeft, ClipboardList, Info, CheckCircle2, XCircle } from "lucide-react";
import { getAnakById } from "../../../services/Anak";
import {
  getRentangPerkembangan,
  getKategoriPerkembangan,
  getPerkembanganHistory,
  savePerkembanganAnak
} from "../../../services/perkembanganAnak";

export default function PerkembanganAnakPage() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [rentangList, setRentangList] = useState([]);
  const [selectedRentangId, setSelectedRentangId] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnak, resRentang] = await Promise.all([
          getAnakById(id),
          getRentangPerkembangan()
        ]);
        
        const childData = resAnak?.data || resAnak;
        const rentangData = Array.isArray(resRentang?.data) ? resRentang.data : (Array.isArray(resRentang) ? resRentang : []);

        setChild(childData);
        setRentangList(rentangData);

        if (rentangData.length > 0) {
          setSelectedRentangId(String(rentangData[0].id));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!selectedRentangId) return;

    const fetchTableData = async () => {
      setLoadingTable(true);
      try {
        const [resKat, resHist] = await Promise.all([
          getKategoriPerkembangan(selectedRentangId),
          getPerkembanganHistory(id, selectedRentangId)
        ]);
        
        const katData = Array.isArray(resKat?.data) ? resKat.data : (Array.isArray(resKat) ? resKat : []);
        const histData = Array.isArray(resHist?.data) ? resHist.data : (Array.isArray(resHist) ? resHist : []);

        setKategoriList(katData);
        setHistory(histData);
      } catch (err) {
        console.error("Error fetching table data:", err);
      } finally {
        setLoadingTable(false);
      }
    };
    fetchTableData();
  }, [id, selectedRentangId]);

  const handleSave = async (kategoriId, value) => {
    try {
      // Find current state for this range from history
      const latestHistory = history[0]?.detail_perkembangan || [];
      
      let updatedDetails = [...latestHistory.map(d => ({
        kategori_perkembangan_id: d.kategori_perkembangan_id,
        jawaban: d.jawaban
      }))];

      const index = updatedDetails.findIndex(d => d.kategori_perkembangan_id === kategoriId);
      if (index > -1) {
        updatedDetails[index].jawaban = value;
      } else {
        updatedDetails.push({ kategori_perkembangan_id: kategoriId, jawaban: value });
      }

      const payload = {
        anak_id: Number(id),
        rentang_usia_perkembangan_id: Number(selectedRentangId),
        tanggal_periksa: new Date().toISOString().split('T')[0],
        pemeriksa: "Ibu Mandiri",
        detail_perkembangan: updatedDetails
      };

      await savePerkembanganAnak(payload);
      
      // Refresh
      const newHistory = await getPerkembanganHistory(id, selectedRentangId);
      setHistory(newHistory || []);
    } catch (err) {
      alert("Gagal menyimpan: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <MainLayout><div className="p-10 text-center font-medium text-gray-400">Memuat...</div></MainLayout>;

  const currentDetails = history[0]?.detail_perkembangan || [];

  return (
    <MainLayout>
      <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to={`/data-anak/dashboard/${id}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 mb-1 transition-all">
              <ChevronLeft size={14} /> Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Perkembangan Anak</h1>
            <p className="text-sm text-gray-500">Cek milestone perkembangan {child.nama}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-indigo-500" /> Kategori Umur
              </h2>
              <div className="space-y-2">
                {rentangList.map((rentang) => (
                  <button
                    key={rentang.id}
                    onClick={() => setSelectedRentangId(String(rentang.id))}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all ${selectedRentangId === String(rentang.id)
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {rentang.nama_rentang}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Info size={18} /> Informasi
              </h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Beri tanda centang pada kolom <b>Ya</b> atau <b>Tidak</b>. Jika ada salah satu hal yang belum bisa dilakukan anak, segera konsultasikan ke Bidan atau Puskesmas.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-amber-400 p-4">
                 <p className="text-sm font-bold text-amber-900">
                   Beri tanda (✔) pada kolom Ya/Tidak. Jika anak belum bisa melakukan salah satu dari hal berikut ini, segera bawa ke Puskesmas.
                 </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">No</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Penanda Perkembangan Anak</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Ya</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Tidak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loadingTable ? (
                      <tr><td colSpan={4} className="py-20 text-center text-gray-400">Memuat pertanyaan...</td></tr>
                    ) : kategoriList.length > 0 ? (
                      kategoriList.map((item, idx) => {
                        const answer = currentDetails.find(d => d.kategori_perkembangan_id === item.id);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{idx + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{item.indikator}</td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => handleSave(item.id, true)}
                                className={`p-2 rounded-lg transition-all ${answer?.jawaban === true ? 'bg-green-100 text-green-600' : 'text-gray-200 hover:text-green-300'}`}
                              >
                                <CheckCircle2 size={24} />
                              </button>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => handleSave(item.id, false)}
                                className={`p-2 rounded-lg transition-all ${answer?.jawaban === false ? 'bg-red-100 text-red-600' : 'text-gray-200 hover:text-red-300'}`}
                              >
                                <XCircle size={24} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td colSpan={4} className="py-20 text-center text-gray-400 italic">Belum ada data indikator untuk rentang usia ini.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {history.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terakhir Diperbarui: {new Date(history[0].updated_at).toLocaleString('id-ID')}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">PEMERIKSA: {history[0].pemeriksa}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
