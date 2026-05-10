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
          <div className="text-[#185FA5] text-lg">Memuat data...</div>
        </div>
      </MainLayout>
    );

  if (!ibu)
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAFB]">
          <div className="text-[#A32D2D] text-lg">Data ibu tidak ditemukan</div>
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#F7FAFB] p-6">
          <div className="bg-red-50 border-l-4 border-[#A32D2D] p-4 mb-4 text-[#A32D2D]">
            {error}
          </div>
          <Link to="/data-ibu" className="text-[#185FA5] flex items-center gap-2">
            <ArrowLeft size={18} /> Kembali ke daftar
          </Link>
        </div>
      </MainLayout>
    );

  if (!kehamilan)
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#F7FAFB] p-6">
          <div className="bg-yellow-50 border-l-4 border-[#BA7517] p-4 text-[#BA7517]">
            Belum ada data kehamilan.
          </div>
          <Link to="/data-ibu" className="text-[#185FA5] flex items-center gap-2 mt-4">
            <ArrowLeft size={18} /> Kembali
          </Link>
        </div>
      </MainLayout>
    );

  const kependudukan = ibu.kependudukan || {};
  const usiaKehamilan = hitungUsiaKehamilan(kehamilan.hpht);
  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("id-ID") : "-");

  const withKehamilan = (path) => `${path}?kehamilan_id=${kehamilan.id}`;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7FAFB]">
        <div className="max-w-7xl mx-auto p-5 space-y-6">
          {/* Header dengan tombol navigasi primary dan badge informasi */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Secondary Button: Kembali ke Ibu */}
            <Link
              to="/data-ibu"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#185FA5] text-[#185FA5] text-base font-semibold hover:bg-[#185FA5]/5 transition w-fit"
            >
              <ArrowLeft size={20} />
              <span>Kembali ke Ibu</span>
            </Link>

            {/* Badge informasi kehamilan */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm md:text-base">
                <Calendar size={18} className="text-[#0F6E56]" />
                <span className="text-gray-700">HPHT: <span className="font-medium">{formatDate(kehamilan.hpht)}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm md:text-base">
                <Target size={18} className="text-[#BA7517]" />
                <span className="text-gray-700">HPL: <span className="font-medium">{formatDate(kehamilan.taksiran_persalinan)}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-[#E1F5EE] px-4 py-2 rounded-full text-sm md:text-base">
                <Baby size={18} className="text-[#0F6E56]" />
                <span className="text-[#085041] font-semibold">Usia: {usiaKehamilan}</span>
              </div>
            </div>
          </div>

          {/* Kartu Identitas Ibu dan Suami - menggunakan card design system */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card Data Ibu */}
            <div className="bg-white shadow-sm rounded-xl p-4 md:p-5">
              <h2 className="text-[22px] font-semibold text-[#185FA5] flex items-center gap-2 mb-4">
                <Users size={24} /> Data Ibu
              </h2>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-base">
                <span className="text-gray-500">Nama Lengkap</span>
                <span className="font-medium text-gray-800">{kependudukan.nama_lengkap || "-"}</span>
                
                <span className="text-gray-500">NIK</span>
                <span className="text-gray-800">{kependudukan.nik || "-"}</span>
                
                <span className="text-gray-500">Tanggal Lahir</span>
                <span className="text-gray-800">{kependudukan.tanggal_lahir || "-"} ({ibu.usia || 0} tahun)</span>
                
                <span className="text-gray-500">Golongan Darah</span>
                <span className="text-gray-800">{kependudukan.golongan_darah || "-"} {ibu.rhesus === "Positif" ? "(Rh+)" : ""}</span>
                
                <span className="text-gray-500">Alamat</span>
                <span className="text-gray-800">{kependudukan.dusun || "-"}</span>
              </div>
            </div>

            {/* Card Data Suami */}
            <div className="bg-white shadow-sm rounded-xl p-4 md:p-5">
              <h2 className="text-[22px] font-semibold text-[#0F6E56] flex items-center gap-2 mb-4">
                <Heart size={24} /> Data Suami
              </h2>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-base">
                <span className="text-gray-500">Nama Lengkap</span>
                <span className="font-medium text-gray-800">Nicholas Sitorus</span>
                
                <span className="text-gray-500">NIK</span>
                <span className="text-gray-800">121212141306050001</span>
                
                <span className="text-gray-500">Pekerjaan</span>
                <span className="text-gray-800">Wiraswasta</span>
                
                <span className="text-gray-500">Golongan Darah</span>
                <span className="text-gray-800">B</span>

                <span className="text-gray-500">Alamat</span>
                <span className="text-gray-800">Dusun Hutagurgur</span>
              </div>
            </div>
          </div>

          {/* Jalur Pelayanan KIA - dengan card dan tombol rounded-full */}
          {/* Jalur Pelayanan KIA - gaya seragam untuk semua link */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {/* Skrining & Evaluasi */}
  <div className="bg-white shadow-sm rounded-xl overflow-hidden">
    <div className="bg-[#185FA5]/10 px-4 py-3 border-b border-[#185FA5]/20">
      <h3 className="text-base font-bold text-[#185FA5] uppercase tracking-wide flex items-center gap-2">
        <ClipboardList size={18} /> Skrining & Evaluasi
      </h3>
    </div>
    <div className="p-4 space-y-2">
      <Link 
        to={withKehamilan(`/data-ibu/${id}/evaluasi-kesehatan`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <Activity size={18} className="text-[#0F6E56]" /> Evaluasi Kesehatan
      </Link>
      <Link 
        to={withKehamilan(`/data-ibu/${id}/skrining-preeklampsia`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <Search size={18} className="text-[#BA7517]" /> Skrining Preeklampsia
      </Link>
      <Link 
        to={withKehamilan(`/data-ibu/${id}/Skrining-Diabetes-Melitus-Gestasional`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <Droplet size={18} className="text-[#185FA5]" /> Skrining DMG
      </Link>
    </div>
  </div>

  {/* Pemantauan ANC */}
  <div className="bg-white shadow-sm rounded-xl overflow-hidden">
    <div className="bg-[#0F6E56]/10 px-4 py-3 border-b border-[#0F6E56]/20">
      <h3 className="text-base font-bold text-[#0F6E56] uppercase tracking-wide flex items-center gap-2">
        <Stethoscope size={18} /> Pemantauan ANC
      </h3>
    </div>
    <div className="p-4 space-y-3">
      {/* Input ANC Rutin (sekarang gaya link biasa) */}
      <Link 
        to={withKehamilan(`/data-ibu/${id}/pemeriksaan-rutin`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <Activity size={18} className="text-[#185FA5]" /> Input ANC Rutin
      </Link>
      {/* Tombol Trimester disusun vertikal, tanpa rounded-full */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleT1Click} 
          disabled={checkingT1}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#185FA5] text-[#185FA5] text-base font-semibold hover:bg-[#185FA5]/5 disabled:opacity-50"
        >
          {checkingT1 ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />} Trimester 1
        </button>
        <button 
          onClick={handleT3Click} 
          disabled={checkingT3}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#185FA5] text-[#185FA5] text-base font-semibold hover:bg-[#185FA5]/5 disabled:opacity-50"
        >
          {checkingT3 ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />} Trimester 3
        </button>
      </div>
    </div>
  </div>

  {/* Persalinan & Nifas */}
  <div className="bg-white shadow-sm rounded-xl overflow-hidden">
    <div className="bg-[#BA7517]/10 px-4 py-3 border-b border-[#BA7517]/20">
      <h3 className="text-base font-bold text-[#BA7517] uppercase tracking-wide flex items-center gap-2">
        <Hospital size={18} /> Persalinan & Nifas
      </h3>
    </div>
    <div className="p-4 space-y-2">
      <Link 
        to={withKehamilan(`/data-ibu/${id}/rencana-persalinan`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <FileText size={18} className="text-[#BA7517]" /> Rencana Persalinan
      </Link>
      <Link 
        to={withKehamilan(`/data-ibu/${id}/pelayanan-persalinan`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <Baby size={18} className="text-[#0F6E56]" /> Riwayat Melahirkan
      </Link>
      <Link 
        to={withKehamilan(`/data-ibu/${id}/pelayanan-nifas`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <Heart size={18} className="text-[#185FA5]" /> Pelayanan Nifas
      </Link>
    </div>
  </div>

  {/* Rujukan Medis */}
  <div className="bg-white shadow-sm rounded-xl overflow-hidden">
    <div className="bg-[#A32D2D]/10 px-4 py-3 border-b border-[#A32D2D]/20">
      <h3 className="text-base font-bold text-[#A32D2D] uppercase tracking-wide flex items-center gap-2">
        <AlertTriangle size={18} /> Rujukan Medis
      </h3>
    </div>
    <div className="p-4 space-y-2">
      {/* Buat / Lihat Rujukan menjadi link biasa */}
      <Link 
        to={withKehamilan(`/data-ibu/${id}/rujukan`)}
        className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
      >
        <AlertTriangle size={18} className="text-[#A32D2D]" /> Buat / Lihat Rujukan
      </Link>
      <Link 
        to="/daftar-rujukan"
        className="block text-center text-[#185FA5] text-base font-semibold py-2 hover:underline"
      >
        Daftar Semua Rujukan
      </Link>
    </div>
  </div>
</div>
          {/* Catatan: semua tombol navigasi sudah dilengkapi ikon + teks, teks minimal 16sp, rounded-full untuk tombol aksi utama */}
        </div>
      </div>
    </MainLayout>
  );
}