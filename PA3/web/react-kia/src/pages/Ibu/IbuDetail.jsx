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
  Users,
  Heart,
  Phone,
  MapPin,
  Clipboard,
  ChevronRight,
  Loader2,
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

  // State untuk menahan proses pengecekan saat link diklik
  const [checkingT1, setCheckingT1] = useState(false);
  const [checkingT3, setCheckingT3] = useState(false);

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
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, kehamilanId]);

  // ─── Fungsi untuk mengecek dan menavigasi ke menu T1 ───
  const handleT1Click = async () => {
    if (!kehamilan) return;
    setCheckingT1(true);
    try {
      const data = await getDokterT1CompleteByKehamilanId(kehamilan.id);
      // data biasanya berbentuk { dokter: {...}, lab_jiwa: {...} }
      if (data && data.dokter) {
        // Data sudah ada → ke halaman detail
        navigate(
          `/data-ibu/${id}/pemeriksaan-dokter-t1-complete/detail?kehamilan_id=${kehamilan.id}`
        );
      } else {
        // Belum ada → ke form input
        navigate(
          `/data-ibu/${id}/pemeriksaan-dokter-t1-complete/form?kehamilan_id=${kehamilan.id}`
        );
      }
    } catch (err) {
      // Jika error (misal jaringan), arahkan ke form sebagai fallback
      navigate(
        `/data-ibu/${id}/pemeriksaan-dokter-t1-complete/form?kehamilan_id=${kehamilan.id}`
      );
    } finally {
      setCheckingT1(false);
    }
  };

  // ─── Fungsi untuk mengecek dan menavigasi ke menu T3 ───
  const handleT3Click = async () => {
    if (!kehamilan) return;
    setCheckingT3(true);
    try {
      const data = await getDokterT3CompleteByKehamilanId(kehamilan.id);
      if (data && data.dokter) {
        navigate(
          `/data-ibu/${id}/pemeriksaan-dokter-t3-complete/detail?kehamilan_id=${kehamilan.id}`
        );
      } else {
        navigate(
          `/data-ibu/${id}/pemeriksaan-dokter-t3-complete/form?kehamilan_id=${kehamilan.id}`
        );
      }
    } catch (err) {
      navigate(
        `/data-ibu/${id}/pemeriksaan-dokter-t3-complete/form?kehamilan_id=${kehamilan.id}`
      );
    } finally {
      setCheckingT3(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-6">Memuat...</div>
      </MainLayout>
    );

  if (!ibu)
    return (
      <MainLayout>
        <div className="p-6">Data ibu tidak ditemukan</div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">{error}</div>
          <Link to="/data-ibu" className="text-indigo-600">
            ← Kembali ke daftar
          </Link>
        </div>
      </MainLayout>
    );

  if (!kehamilan)
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            Belum ada data kehamilan.
          </div>
          <Link to="/data-ibu" className="text-indigo-600">
            ← Kembali
          </Link>
        </div>
      </MainLayout>
    );

  const kependudukan = ibu.kependudukan || {};
  const usiaKehamilan = `${kehamilan.uk_kehamilan_saat_ini || 0} Minggu`;
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("id-ID") : "-";

  const withKehamilan = (path) => `${path}?kehamilan_id=${kehamilan.id}`;

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Identitas Ibu</h1>
            <p className="text-gray-500">Kehamilan ID: {kehamilan.id}</p>
          </div>
          <Link
            to={`/data-ibu/${id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Edit Profil
          </Link>
        </div>

        {/* ─── Jalur Pelayanan KIA (Horizontal Menu Style) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {/* Group 1: Evaluasi */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-indigo-600 uppercase mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div> Skrining & Evaluasi
            </h3>
            <div className="space-y-2">
              <Link
                to={withKehamilan(`/data-ibu/${id}/evaluasi-kesehatan`)}
                className="block p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-sm font-medium transition border border-transparent hover:border-indigo-200"
              >
                📋 Evaluasi Kesehatan
              </Link>
              <Link
                to={withKehamilan(`/data-ibu/${id}/skrining-preeklampsia`)}
                className="block p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-sm font-medium transition border border-transparent hover:border-indigo-200"
              >
                🔍 Skrining Preeklampsia
              </Link>
              <Link
                to={withKehamilan(`/data-ibu/${id}/Skrining-Diabetes-Melitus-Gestasional`)}
                className="block p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-sm font-medium transition border border-transparent hover:border-indigo-200"
              >
                🔍 Skrining DMG
              </Link>
            </div>
          </div>

          {/* Group 2: ANC */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Pemantauan ANC
            </h3>
            <div className="space-y-2">
              <Link
                to={withKehamilan(`/data-ibu/${id}/pemeriksaan-rutin`)}
                className="block p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-sm font-bold text-blue-700 transition border border-blue-100"
              >
                🩺 Input ANC Rutin
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleT1Click}
                  disabled={checkingT1}
                  className="text-xs p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-1 border border-transparent hover:border-gray-200"
                >
                  {checkingT1 ? <Loader2 size={12} className="animate-spin" /> : "👩‍⚕️"} T1
                </button>
                <button
                  onClick={handleT3Click}
                  disabled={checkingT3}
                  className="text-xs p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-1 border border-transparent hover:border-gray-200"
                >
                  {checkingT3 ? <Loader2 size={12} className="animate-spin" /> : "👩‍⚕️"} T3
                </button>
              </div>
            </div>
          </div>

          {/* Group 3: Persalinan */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-rose-600 uppercase mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div> Persalinan & Nifas
            </h3>
            <div className="space-y-2">
              <Link
                to={withKehamilan(`/data-ibu/${id}/rencana-persalinan`)}
                className="block p-3 rounded-xl bg-gray-50 hover:bg-rose-50 text-sm font-medium transition border border-transparent hover:border-rose-200"
              >
                🏥 Rencana Persalinan
              </Link>
              <Link
                to={withKehamilan(`/data-ibu/${id}/pelayanan-persalinan`)}
                className="block p-3 rounded-xl bg-gray-50 hover:bg-rose-50 text-sm font-medium transition border border-transparent hover:border-rose-200"
              >
                👶 Riwayat Melahirkan
              </Link>
              <Link
                to={withKehamilan(`/data-ibu/${id}/pelayanan-nifas`)}
                className="block p-3 rounded-xl bg-gray-50 hover:bg-rose-50 text-sm font-medium transition border border-transparent hover:border-rose-200"
              >
                🤱 Pelayanan Nifas
              </Link>
            </div>
          </div>

          {/* Group 4: Rujukan */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-amber-600 uppercase mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div> Rujukan Medis
            </h3>
            <div className="space-y-2">
              <Link
                to={withKehamilan(`/data-ibu/${id}/rujukan`)}
                className="block p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-sm font-bold text-amber-700 transition border border-amber-100"
              >
                ⚠️ Buat / Lihat Rujukan
              </Link>
              <Link
                to="/daftar-rujukan"
                className="block text-center text-xs text-amber-700 mt-2 hover:underline"
              >
                Daftar Semua Rujukan
              </Link>
            </div>
          </div>
        </div>  

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Data Identitas dan Suami */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Identitas Utama */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={20} /> Data Identitas Utama
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Nama Lengkap</span>
                  <p>{kependudukan.nama_lengkap || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">NIK</span>
                  <p>{kependudukan.nik || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">No. JKN</span>
                  <p>
                    0001234567890{" "}
                    <span className="text-green-600 text-xs">AKTIF</span>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Anak ke-</span>
                  <p>{kehamilan.gravida || 0}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Tanggal Lahir</span>
                  <p>
                    {kependudukan.tanggal_lahir || "-"} ({ibu.usia || 0} Tahun)
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Golongan Darah</span>
                  <p>
                    {kependudukan.golongan_darah || "-"}{" "}
                    {ibu.rhesus === "Positif" ? "Rhesus Positif" : ""}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Pendidikan</span>
                  <p>{kependudukan.pendidikan_terakhir || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Pekerjaan</span>
                  <p>{kependudukan.pekerjaan || "-"}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-gray-500 text-sm">Alamat</span>
                <p>{kependudukan.alamat || "-"}</p>
              </div>
            </div>

            {/* Identitas Suami */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart size={20} /> Identitas Suami
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Nama Suami</span>
                  <p>{kependudukan.nama_suami || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">NIK Suami</span>
                  <p>{kependudukan.nik_suami || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Pekerjaan</span>
                  <p>{kependudukan.pekerjaan_suami || "-"}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Gol. Darah</span>
                  <p>{kependudukan.golongan_darah_suami || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500 text-sm">Telepon</span>
                  <p>{kependudukan.telepon_suami || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Profil Kehamilan</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>ID Ibu:</strong> KIA-
                  {String(ibu.id_ibu || id).padStart(4, "0")}
                </p>
                <p>
                  <strong>ID Kehamilan:</strong> {kehamilan.id}
                </p>
                <p>
                  <strong>Kehamilan ke-:</strong> {kehamilan.gravida || "-"}
                </p>
                <p>
                  <strong>Usia Kehamilan:</strong> {usiaKehamilan}
                </p>
                <p>
                  <strong>HPHT:</strong> {formatDate(kehamilan.hpht)}
                </p>
                <p>
                  <strong>HPL:</strong>{" "}
                  {formatDate(kehamilan.taksiran_persalinan)}
                </p>
              </div>
            </div>

            {/* Widget Fasilitas & Kontak */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                🏥 Fasilitas Kesehatan
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><MapPin size={18} /></div>
                  <div><p className="text-xs font-bold text-gray-800">Puskesmas Domisili</p><p className="text-xs text-gray-500">Puskesmas Jatiasih</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Phone size={18} /></div>
                  <div><p className="text-xs font-bold text-gray-800">Kontak Darurat</p><p className="text-xs text-gray-500">{ibu.telepon || "-"}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}