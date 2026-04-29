// src/pages/Ibu/IbuDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuById } from "../../services/ibu";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { Calendar, MapPin, Phone, Users, Droplet, Clipboard, Heart, FileText } from "lucide-react";

export default function IbuDetail() {
  const { id } = useParams();
  const [ibu, setIbu] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ibuData = await getIbuById(id);
        setIbu(ibuData);
        const kehamilanData = await getKehamilanByIbuId(id);
        if (kehamilanData.length > 0) setKehamilan(kehamilanData[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;
  if (!ibu) return <MainLayout><div className="p-6">Data tidak ditemukan</div></MainLayout>;

  const kependudukan = ibu.kependudukan || {};
  const usiaKehamilan = kehamilan ? `${kehamilan.uk_kehamilan_saat_ini || 0} Minggu` : "-";

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Identitas Ibu</h1>
            <p className="text-gray-500">Manajemen data fundamental pasien untuk pemantauan klinis kehamilan yang komprehensif.</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/data-ibu/${id}/edit`} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Edit Profil Lengkap
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Identitas Utama */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users size={20} /> Data Identitas Utama</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="text-gray-500 text-sm">NIK</span><p className="font-medium">{kependudukan.nik || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">No. KK</span><p className="font-medium">{kependudukan.no_kk || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Anak ke-</span><p className="font-medium">{kehamilan?.gravida || 0}</p></div>
                <div><span className="text-gray-500 text-sm">Tanggal Lahir</span><p className="font-medium">{kependudukan.tanggal_lahir || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Golongan Darah</span><p className="font-medium">{kependudukan.golongan_darah || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Pendidikan</span><p className="font-medium">{kependudukan.pendidikan_terakhir || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Pekerjaan</span><p className="font-medium">{kependudukan.pekerjaan || "-"}</p></div>
                <div className="md:col-span-2"><span className="text-gray-500 text-sm">Alamat</span><p className="font-medium">{kependudukan.alamat || "-"}</p></div>
              </div>
            </div>

            {/* Identitas Suami */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Heart size={20} /> Identitas Suami / Keluarga</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="text-gray-500 text-sm">Nama Suami</span><p className="font-medium">{kependudukan.nama_suami || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">NIK Suami</span><p className="font-medium">{kependudukan.nik_suami || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Pekerjaan</span><p className="font-medium">{kependudukan.pekerjaan_suami || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Gol. Darah & Rhesus</span><p className="font-medium">{kependudukan.golongan_darah_suami || "-"}</p></div>
                <div className="md:col-span-2"><span className="text-gray-500 text-sm">Nomor Telepon</span><p className="font-medium">{kependudukan.telepon_suami || "-"}</p></div>
              </div>
            </div>

            {/* Patient Journey Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Jalur Pelayanan KIA</h2>
              <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8 pb-4">
                {/* Step 1 */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>
                  <h3 className="font-bold text-indigo-900 text-lg">1. Evaluasi & Skrining Awal</h3>
                  <p className="text-sm text-gray-500 mb-3 mt-1">Lakukan pemeriksaan dasar dan skrining risiko.</p>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/data-ibu/${id}/evaluasi-kesehatan`} className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all min-w-[240px] flex-1">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">📋 Evaluasi Kesehatan Ibu</span>
                    </Link>
                    <Link to={`/data-ibu/${id}/skrining-preeklampsia`} className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all min-w-[200px] flex-1">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">🔍 Skrining Preeklampsia</span>
                    </Link>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-blue-400 border-4 border-white shadow-sm"></div>
                  <h3 className="font-bold text-gray-800 text-lg">2. Pemantauan & ANC</h3>
                  <p className="text-sm text-gray-500 mb-3 mt-1">Pemeriksaan rutin K1-K6 dan pemantauan dokter.</p>
                  <div className="flex flex-col gap-2">
                    <Link to={`/data-ibu/${id}/pemeriksaan-rutin`} className="group flex items-center justify-between p-3 rounded-xl bg-blue-50/50 hover:bg-blue-100/50 border border-transparent hover:border-blue-200 transition-all">
                      <span className="text-sm font-medium text-blue-800">🩺 Input Pemeriksaan ANC Rutin</span>
                    </Link>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                      <Link to={`/data-ibu/${id}/pemeriksaan-dokter-t1-complete`} className="text-xs p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border flex items-center gap-1 justify-center">👩‍⚕️ Dokter T1</Link>
                      <Link to={`/data-ibu/${id}/pemeriksaan-dokter-t3-complete`} className="text-xs p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border flex items-center gap-1 justify-center">👩‍⚕️ Dokter T3</Link>
                      <Link to={`/data-ibu/${id}/pemeriksaan-lab-jiwa`} className="text-xs p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border flex items-center gap-1 justify-center">🧪 Lab & Jiwa</Link>
                      <Link to={`/data-ibu/${id}/pemeriksaan-lanjutan-t3`} className="text-xs p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border flex items-center gap-1 justify-center">🔬 Lanjut T3</Link>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-emerald-400 border-4 border-white shadow-sm"></div>
                  <h3 className="font-bold text-gray-800 text-lg">3. Analisis Grafik</h3>
                  <div className="flex flex-col gap-2 mt-3">
                    <Link to={`/data-ibu/${id}/grafik-evaluasi`} className="group flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/50 border border-transparent hover:border-emerald-200 transition-all">
                      <span className="text-sm font-medium text-emerald-800">📊 Grafik Evaluasi Kehamilan (TFU & DJJ)</span>
                    </Link>
                    <Link to={`/data-ibu/${id}/grafik-bb`} className="group flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/50 border border-transparent hover:border-emerald-200 transition-all">
                      <span className="text-sm font-medium text-emerald-800">⚖️ Grafik Peningkatan Berat Badan</span>
                    </Link>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-rose-400 border-4 border-white shadow-sm"></div>
                  <h3 className="font-bold text-gray-800 text-lg">4. Persalinan & Nifas</h3>
                  <p className="text-sm text-gray-500 mb-3 mt-1">Pencatatan proses persalinan hingga bayi lahir.</p>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/data-ibu/${id}/rencana-persalinan`} className="text-sm p-3 rounded-xl bg-gray-50 hover:bg-rose-50 border border-transparent hover:border-rose-100 text-gray-700 hover:text-rose-700 transition-all flex-1 min-w-[200px] text-center">🏥 Rencana Persalinan</Link>
                    <Link to={`/data-ibu/${id}/pelayanan-persalinan`} className="text-sm p-3 rounded-xl bg-gray-50 hover:bg-rose-50 border border-transparent hover:border-rose-100 text-gray-700 hover:text-rose-700 transition-all flex-1 min-w-[200px] text-center">👶 Proses & Riwayat Melahirkan</Link>
                    <Link to={`/data-ibu/${id}/pelayanan-nifas`} className="text-sm p-3 rounded-xl bg-gray-50 hover:bg-rose-50 border border-transparent hover:border-rose-100 text-gray-700 hover:text-rose-700 transition-all flex-1 min-w-[200px] text-center">🤱 Pelayanan Nifas</Link>
                  </div>
                </div>

                {/* Step 5: Rujukan */}
                <div className="relative pl-8 mt-6">
                  <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-amber-400 border-4 border-white shadow-sm"></div>
                  <h3 className="font-bold text-gray-800 text-lg">⚠️ Rujukan Medis</h3>
                  <div className="flex flex-col gap-2 mt-3">
                    <Link to={`/data-ibu/${id}/rujukan`} className="group flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all">
                      <span className="text-sm font-semibold text-amber-800">Buat Proposal Rujukan</span>
                    </Link>
                    <Link to="/daftar-rujukan" className="text-xs text-center text-amber-700 hover:underline mt-1">Lihat Dashboard Semua Rujukan</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Profil Lengkap</h2>
              <div className="space-y-3 text-sm">
                <p><strong>ID:</strong> KIA-{String(ibu.id_ibu || id).padStart(4, "0")}</p>
                <p><strong>Kehamilan Saat Ini:</strong> {usiaKehamilan}</p>
                <p><strong>HPHT:</strong> {kehamilan?.hpht ? new Date(kehamilan.hpht).toLocaleDateString("id-ID") : "-"}</p>
                <p><strong>HPL:</strong> {kehamilan?.taksiran_persalinan ? new Date(kehamilan.taksiran_persalinan).toLocaleDateString("id-ID") : "-"}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Kontak Utama</h2>
              <div className="space-y-2">
                <p><Phone size={16} className="inline mr-2" /> {kependudukan.telepon || "-"}</p>
                <p><MapPin size={16} className="inline mr-2" /> Dusun: {kependudukan.dusun || "-"}</p>
                <p><Calendar size={16} className="inline mr-2" /> Status: {ibu.status_kehamilan || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
