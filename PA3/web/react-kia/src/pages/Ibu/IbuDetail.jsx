// src/pages/Ibu/IbuDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuById } from "../../services/ibu";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import {
  getDokterT1CompleteByKehamilanId,
  getDokterT3CompleteByKehamilanId,
} from "../../services/pemeriksaanDokter";
import { 
  ArrowLeft, 
  Users, 
  Heart, 
  Loader2, 
  Calendar, 
  Target, 
  Baby,
  ClipboardList,
  Search,
  Activity,
  FileText,
  AlertTriangle,
  ListChecks,
  Stethoscope,
  Hospital,
  Droplet,
  UserPlus
} from "lucide-react";

export default function IbuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const kehamilanId = searchParams.get("kehamilan_id");

  const [ibu, setIbu] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkingT1, setCheckingT1] = useState(false);
  const [checkingT3, setCheckingT3] = useState(false);

  // Hitung usia kehamilan dari HPHT
  const hitungUsiaKehamilan = (hpht) => {
    if (!hpht) return "? minggu";
    const hphtDate = new Date(hpht);
    const now = new Date();
    const diffTime = now - hphtDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Belum hamil";
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return `${weeks} minggu ${days} hari`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const ibuRes = await getIbuById(id);
        setIbu(ibuRes);

        const kehamilanRes = await getKehamilanByIbuId(id);
        if (!kehamilanRes || kehamilanRes.length === 0) {
          setError("Ibu ini belum memiliki data kehamilan.");
          setKehamilan(null);
          return;
        }

        let targetKehamilan = null;
        if (kehamilanId) {
          targetKehamilan = kehamilanRes.find((k) => k.id == kehamilanId);
          if (!targetKehamilan) {
            setError(`Kehamilan dengan ID ${kehamilanId} tidak ditemukan.`);
          }
        } else {
          targetKehamilan = kehamilanRes[0];
        }
        setKehamilan(targetKehamilan);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, kehamilanId]);

  const handleT1Click = async () => {
    if (!kehamilan) return;
    setCheckingT1(true);
    try {
      const data = await getDokterT1CompleteByKehamilanId(kehamilan.id);
      if (data && data.dokter) {
        navigate(`/data-ibu/${id}/pemeriksaan-dokter-t1-complete/detail?kehamilan_id=${kehamilan.id}`);
      } else {
        navigate(`/data-ibu/${id}/pemeriksaan-dokter-t1-complete/form?kehamilan_id=${kehamilan.id}`);
      }
    } catch (err) {
      navigate(`/data-ibu/${id}/pemeriksaan-dokter-t1-complete/form?kehamilan_id=${kehamilan.id}`);
    } finally {
      setCheckingT1(false);
    }
  };

  const handleT3Click = async () => {
    if (!kehamilan) return;
    setCheckingT3(true);
    try {
      const data = await getDokterT3CompleteByKehamilanId(kehamilan.id);
      if (data && data.dokter) {
        navigate(`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/detail?kehamilan_id=${kehamilan.id}`);
      } else {
        navigate(`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/form?kehamilan_id=${kehamilan.id}`);
      }
    } catch (err) {
      navigate(`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/form?kehamilan_id=${kehamilan.id}`);
    } finally {
      setCheckingT3(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAFB]">
          <div className="text-[#185FA5] text-sm">Memuat data...</div>
        </div>
      </MainLayout>
    );

  if (!ibu)
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAFB]">
          <div className="text-[#A32D2D] text-sm">Data ibu tidak ditemukan</div>
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#F7FAFB] p-4">
          <div className="bg-[#FCEBEB] border-l-4 border-[#A32D2D] p-3 mb-3 text-[#791F1F] text-sm">
            {error}
          </div>
          <Link to="/data-ibu" className="text-[#185FA5] flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> Kembali ke daftar
          </Link>
        </div>
      </MainLayout>
    );

  if (!kehamilan)
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#F7FAFB] p-4">
          <div className="bg-[#FAEEDA] border-l-4 border-[#BA7517] p-3 text-[#633806] text-sm">
            Belum ada data kehamilan.
          </div>
          <Link to="/data-ibu" className="text-[#185FA5] flex items-center gap-2 mt-3 text-sm">
            <ArrowLeft size={16} /> Kembali
          </Link>
        </div>
      </MainLayout>
    );

  const kependudukan = ibu.kependudukan || {};
  const suami = ibu.suami; // data suami dari API
  const usiaKehamilan = hitungUsiaKehamilan(kehamilan.hpht);
  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("id-ID") : "-");

  const withKehamilan = (path) => `${path}?kehamilan_id=${kehamilan.id}`;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7FAFB]">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          {/* Header dengan tombol navigasi primary dan badge informasi */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Link
              to="/data-ibu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#185FA5] text-[#185FA5] text-sm font-semibold hover:bg-[#185FA5]/5 transition w-fit"
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </Link>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm text-xs md:text-sm border border-gray-100">
                <Calendar size={16} className="text-[#0F6E56]" />
                <span className="text-gray-700">HPHT: <span className="font-semibold">{formatDate(kehamilan.hpht)}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm text-xs md:text-sm border border-gray-100">
                <Target size={16} className="text-[#BA7517]" />
                <span className="text-gray-700">HPL: <span className="font-semibold">{formatDate(kehamilan.taksiran_persalinan)}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-[#E1F5EE] px-4 py-2 rounded-xl text-xs md:text-sm border border-[#0F6E56]/20">
                <Baby size={16} className="text-[#085041]" />
                <span className="text-[#085041] font-semibold">Usia: {usiaKehamilan}</span>
              </div>
            </div>
          </div>

          {/* Kartu Identitas Ibu dan Suami */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Card Data Ibu */}
            <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
              <h2 className="text-base font-semibold text-[#185FA5] flex items-center gap-2 mb-3">
                <Users size={18} /> Data Ibu
              </h2>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
                <span className="text-gray-500 text-xs">Nama Lengkap</span>
                <span className="font-medium text-gray-800 text-sm">{kependudukan.nama_lengkap || "-"}</span>
                
                <span className="text-gray-500 text-xs">NIK</span>
                <span className="text-gray-800 text-sm">{kependudukan.nik || "-"}</span>
                
                <span className="text-gray-500 text-xs">Tanggal Lahir</span>
                <span className="text-gray-800 text-sm">{kependudukan.tanggal_lahir || "-"} ({ibu.usia || 0} tahun)</span>
                
                <span className="text-gray-500 text-xs">Golongan Darah</span>
                <span className="text-gray-800 text-sm">{kependudukan.golongan_darah || "-"} {ibu.rhesus === "Positif" ? "(Rh+)" : ""}</span>
                
                <span className="text-gray-500 text-xs">Alamat</span>
                <span className="text-gray-800 text-sm">{kependudukan.dusun || "-"}</span>
              </div>
            </div>

            {/* Card Data Suami - data dinamis dari API */}
            <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
              <h2 className="text-base font-semibold text-[#0F6E56] flex items-center gap-2 mb-3">
                <Heart size={18} /> Data Suami
              </h2>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
                <span className="text-gray-500 text-xs">Nama Lengkap</span>
                <span className="font-medium text-gray-800 text-sm">{suami?.nama_lengkap || "-"}</span>
                
                <span className="text-gray-500 text-xs">NIK</span>
                <span className="text-gray-800 text-sm">{suami?.nik || "-"}</span>
                
                <span className="text-gray-500 text-xs">Pekerjaan</span>
                <span className="text-gray-800 text-sm">{suami?.pekerjaan || "-"}</span>
                
                <span className="text-gray-500 text-xs">Golongan Darah</span>
                <span className="text-gray-800 text-sm">{suami?.golongan_darah || "-"}</span>

                <span className="text-gray-500 text-xs">Alamat</span>
                <span className="text-gray-800 text-sm">{suami?.dusun || "-"}</span>
              </div>
              {!suami && (
                <div className="mt-3 text-xs text-gray-400 italic">Data suami tidak tersedia</div>
              )}
            </div>
          </div>

          {/* Jalur Pelayanan KIA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Skrining & Evaluasi */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-transparent px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-[#185FA5] uppercase tracking-wide flex items-center gap-2">
                  <ClipboardList size={16} /> Skrining & Evaluasi
                </h3>
              </div>
              <div className="p-4 space-y-1">
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/evaluasi-kesehatan`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <Activity size={16} className="text-[#0F6E56] flex-shrink-0" /> Evaluasi Kesehatan
                </Link>
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/skrining-preeklampsia`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <Search size={16} className="text-[#BA7517] flex-shrink-0" /> Skrining Preeklampsia
                </Link>
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/Skrining-Diabetes-Melitus-Gestasional`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <Droplet size={16} className="text-[#185FA5] flex-shrink-0" /> Skrining DMG
                </Link>
              </div>
            </div>

            {/* Pemantauan ANC */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-transparent px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-[#0F6E56] uppercase tracking-wide flex items-center gap-2">
                  <Stethoscope size={16} /> Pemantauan ANC
                </h3>
              </div>
              <div className="p-4 space-y-1">
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/pemeriksaan-rutin`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <Activity size={16} className="text-[#185FA5] flex-shrink-0" /> Input ANC Rutin
                </Link>
                <div className="flex flex-col gap-1.5 pt-1">
                  <button 
                    onClick={handleT1Click} 
                    disabled={checkingT1}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-[#185FA5] text-[#185FA5] text-sm font-semibold hover:bg-[#185FA5]/5 disabled:opacity-50 transition"
                  >
                    {checkingT1 ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />} Trimester 1
                  </button>
                  <button 
                    onClick={handleT3Click} 
                    disabled={checkingT3}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-[#185FA5] text-[#185FA5] text-sm font-semibold hover:bg-[#185FA5]/5 disabled:opacity-50 transition"
                  >
                    {checkingT3 ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />} Trimester 3
                  </button>
                </div>
              </div>
            </div>

            {/* Persalinan & Nifas */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-transparent px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-[#BA7517] uppercase tracking-wide flex items-center gap-2">
                  <Hospital size={16} /> Persalinan & Nifas
                </h3>
              </div>
              <div className="p-4 space-y-1">
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/rencana-persalinan`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <FileText size={16} className="text-[#BA7517] flex-shrink-0" /> Rencana Persalinan
                </Link>
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/pelayanan-persalinan`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <Baby size={16} className="text-[#0F6E56] flex-shrink-0" /> Riwayat Melahirkan
                </Link>
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/pelayanan-nifas`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <Heart size={16} className="text-[#185FA5] flex-shrink-0" /> Pelayanan Nifas
                </Link>
              </div>
            </div>

            {/* Rujukan Medis */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-transparent px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-[#A32D2D] uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle size={16} /> Rujukan Medis
                </h3>
              </div>
              <div className="p-4 space-y-1">
                <Link 
                  to={withKehamilan(`/data-ibu/${id}/rujukan`)}
                  className="flex items-center gap-2 w-full text-left p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <AlertTriangle size={16} className="text-[#A32D2D] flex-shrink-0" /> Buat / Lihat Rujukan
                </Link>
                <Link 
                  to="/daftar-rujukan"
                  className="block text-center text-[#185FA5] text-sm font-semibold py-2.5 hover:underline"
                >
                  Daftar Semua Rujukan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}