// src/pages/Ibu/IbuDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuById } from "../../services/ibu";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { Users, Heart, Phone, MapPin, Clipboard, Home, ChevronRight } from "lucide-react";

export default function IbuDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const kehamilanId = searchParams.get("kehamilan_id");

  const [ibu, setIbu] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          targetKehamilan = kehamilanRes.find(k => k.id == kehamilanId);
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

  // Breadcrumb component
  // const Breadcrumb = () => {
  //   const namaIbu = ibu?.kependudukan?.nama_lengkap || "Detail Ibu";
  //   return (
  //     <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
  //       <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
  //         <Home size={14} /> Beranda
  //       </Link>
  //       <ChevronRight size={14} />
  //       <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
  //       <ChevronRight size={14} />
  //       <span className="text-gray-700 font-medium">{namaIbu}</span>
  //     </div>
  //   );
  // };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;
  if (!ibu) return <MainLayout><div className="p-6">Data ibu tidak ditemukan</div></MainLayout>;
  if (error) return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">{error}</div>
        <Link to="/data-ibu" className="text-indigo-600">← Kembali ke daftar</Link>
      </div>
    </MainLayout>
  );
  if (!kehamilan) return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">Belum ada data kehamilan.</div>
        <Link to="/data-ibu" className="text-indigo-600">← Kembali</Link>
      </div>
    </MainLayout>
  );

  const kependudukan = ibu.kependudukan || {};
  const usiaKehamilan = `${kehamilan.uk_kehamilan_saat_ini || 0} Minggu`;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString("id-ID") : "-";

  const withKehamilan = (path) => `${path}?kehamilan_id=${kehamilan.id}`;

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        {/* <Breadcrumb /> */}

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Identitas Ibu</h1>
            <p className="text-gray-500">Kehamilan ID: {kehamilan.id}</p>
          </div>
          <Link to={`/data-ibu/${id}/edit`} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Edit Profil</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Data Identitas dan Suami */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Identitas Utama */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users size={20} /> Data Identitas Utama</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="text-gray-500 text-sm">Nama Lengkap</span><p>{kependudukan.nama_lengkap || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">NIK</span><p>{kependudukan.nik || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">No. JKN</span><p>0001234567890 <span className="text-green-600 text-xs">AKTIF</span></p></div>
                <div><span className="text-gray-500 text-sm">Anak ke-</span><p>{kehamilan.gravida || 0}</p></div>
                <div><span className="text-gray-500 text-sm">Tanggal Lahir</span><p>{kependudukan.tanggal_lahir || "-"} ({ibu.usia || 0} Tahun)</p></div>
                <div><span className="text-gray-500 text-sm">Golongan Darah</span><p>{kependudukan.golongan_darah || "-"} {ibu.rhesus === "Positif" ? "Rhesus Positif" : ""}</p></div>
                <div><span className="text-gray-500 text-sm">Pendidikan</span><p>{kependudukan.pendidikan_terakhir || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Pekerjaan</span><p>{kependudukan.pekerjaan || "-"}</p></div>
              </div>
              <div className="mt-4"><span className="text-gray-500 text-sm">Alamat</span><p>{kependudukan.alamat || "-"}</p></div>
            </div>

            {/* Identitas Suami */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Heart size={20} /> Identitas Suami</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="text-gray-500 text-sm">Nama Suami</span><p>{kependudukan.nama_suami || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">NIK Suami</span><p>{kependudukan.nik_suami || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Pekerjaan</span><p>{kependudukan.pekerjaan_suami || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Gol. Darah</span><p>{kependudukan.golongan_darah_suami || "-"}</p></div>
                <div className="md:col-span-2"><span className="text-gray-500 text-sm">Telepon</span><p>{kependudukan.telepon_suami || "-"}</p></div>
              </div>
            </div>

            {/* Timeline Layanan KIA - diperbaiki tampilannya */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Jalur Pelayanan KIA</h2>
              <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8 pb-4">
                {/* Step 1: Evaluasi & Skrining */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-indigo-600 border-4 border-white"></div>
                  <h3 className="font-bold text-indigo-900">1. Evaluasi & Skrining Awal</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    <Link to={withKehamilan(`/data-ibu/${id}/evaluasi-kesehatan`)} className="p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-center transition">📋 Evaluasi Kesehatan Ibu</Link>
                    <Link to={withKehamilan(`/data-ibu/${id}/skrining-preeklampsia`)} className="p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-center transition">🔍 Skrining Preeklampsia</Link>
                    <Link to={withKehamilan(`/data-ibu/${id}/Skrining-Diabetes-Melitus-Gestasional`)} className="p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-center transition">🔍 Skrining Diabetes Melitus Gestasional</Link>
                  </div>
                </div>

                {/* Step 2: Pemantauan ANC */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-blue-400 border-4 border-white"></div>
                  <h3 className="font-bold text-gray-800">2. Pemantauan & ANC</h3>
                  <div className="space-y-2 mt-2">
                    <Link to={withKehamilan(`/data-ibu/${id}/pemeriksaan-rutin`)} className="block p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition text-center">🩺 Input Pemeriksaan ANC Rutin</Link>
                    <div className="flex gap-2">
                      <Link to={withKehamilan(`/data-ibu/${id}/pemeriksaan-dokter-t1-complete/form`)} className="flex-1 text-center text-xs p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">👩‍⚕️ Dokter T1</Link>
                      <Link to={withKehamilan(`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/form`)} className="flex-1 text-center text-xs p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">👩‍⚕️ Dokter T3</Link>
                    </div>
                  </div>
                </div>

                {/* Step 3: Persalinan & Nifas */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-rose-400 border-4 border-white"></div>
                  <h3 className="font-bold text-gray-800">3. Persalinan & Nifas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <Link to={withKehamilan(`/data-ibu/${id}/rencana-persalinan`)} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-center transition">🏥 Rencana Persalinan</Link>
                    <Link to={withKehamilan(`/data-ibu/${id}/pelayanan-persalinan`)} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-center transition">👶 Proses & Riwayat Melahirkan</Link>
                    <Link to={withKehamilan(`/data-ibu/${id}/pelayanan-nifas`)} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-center transition">🤱 Pelayanan Nifas</Link>
                  </div>
                </div>

                {/* Rujukan */}
                <div className="relative pl-8 mt-6">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-amber-400 border-4 border-white"></div>
                  <h3 className="font-bold text-gray-800">⚠️ Rujukan Medis</h3>
                  <div className="mt-2 space-y-2">
                    <Link to={withKehamilan(`/data-ibu/${id}/rujukan`)} className="block p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition text-center">Buat / Lihat Rujukan</Link>
                    <Link to="/daftar-rujukan" className="block text-xs text-center text-amber-700 mt-1 hover:underline">Lihat Dashboard Semua Rujukan</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Profil Kehamilan</h2>
              <div className="space-y-2 text-sm">
                <p><strong>ID Ibu:</strong> KIA-{String(ibu.id_ibu || id).padStart(4, "0")}</p>
                <p><strong>ID Kehamilan:</strong> {kehamilan.id}</p>
                <p><strong>Kehamilan ke-:</strong> {kehamilan.gravida || "-"}</p>
                <p><strong>Usia Kehamilan:</strong> {usiaKehamilan}</p>
                <p><strong>HPHT:</strong> {formatDate(kehamilan.hpht)}</p>
                <p><strong>HPL:</strong> {formatDate(kehamilan.taksiran_persalinan)}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Kontak Utama</h2>
              <p><Phone size={16} className="inline mr-2" /> {ibu.telepon || "-"}</p>
              <p><MapPin size={16} className="inline mr-2" /> Puskesmas Jatiasih</p>
              <p><Clipboard size={16} className="inline mr-2" /> RSUD dr. Chasbullah Abdulmadjid</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}