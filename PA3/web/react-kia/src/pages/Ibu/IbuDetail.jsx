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
    const fetch = async () => {
      try {
        const ibuData = await getIbuById(id);
        setIbu(ibuData);
        const kehamilanData = await getKehamilanByIbuId(id);
        if (kehamilanData.length > 0) setKehamilan(kehamilanData[0]); // ambil kehamilan aktif
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
            <Link to={`/data-ibu/${id}/edit`} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Edit Profil Lengkap</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Identitas Utama */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users size={20} /> Data Identitas Utama</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="text-gray-500 text-sm">Nama Lengkap</span><p className="font-medium">{kependudukan.nama_lengkap || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">NIK</span><p className="font-medium">{kependudukan.nik || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">No. JKN/BPJS</span><p className="font-medium">0001234567890 <span className="text-green-600 text-xs ml-2">AKTIF</span></p></div>
                <div><span className="text-gray-500 text-sm">Anak ke-</span><p className="font-medium">{kehamilan?.gravida || 0}</p></div>
                <div><span className="text-gray-500 text-sm">Tanggal Lahir</span><p className="font-medium">{kependudukan.tanggal_lahir || "-"} ({ibu.usia || 0} Tahun)</p></div>
                <div><span className="text-gray-500 text-sm">Golongan Darah</span><p className="font-medium">{kependudukan.golongan_darah || "-"} {ibu.rhesus === "Positif" ? "Rhesus Positif" : ""}</p></div>
                <div><span className="text-gray-500 text-sm">Pendidikan</span><p className="font-medium">{kependudukan.pendidikan_terakhir || "-"}</p></div>
                <div><span className="text-gray-500 text-sm">Pekerjaan</span><p className="font-medium">{kependudukan.pekerjaan || "-"}</p></div>
              </div>
              <div className="mt-4">
                <span className="text-gray-500 text-sm">Alamat Domisili</span>
                <p className="font-medium">{kependudukan.alamat || "-"}</p>
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Profil Lengkap</h2>
              <div className="space-y-3 text-sm">
                <p><strong>ID:</strong> KIA-{String(ibu.id).padStart(4,"0")}</p>
                <p><strong>Kehamilan Saat Ini:</strong> {usiaKehamilan}</p>
                <p><strong>HPHT:</strong> {kehamilan?.hpht ? new Date(kehamilan.hpht).toLocaleDateString("id-ID") : "-"}</p>
                <p><strong>HPL:</strong> {kehamilan?.taksiran_persalinan ? new Date(kehamilan.taksiran_persalinan).toLocaleDateString("id-ID") : "-"}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Kontak Utama</h2>
              <div className="space-y-2">
                <p><Phone size={16} className="inline mr-2" /> {ibu.telepon || "-"}</p>
                <p><MapPin size={16} className="inline mr-2" /> Puskesmas Primer: Puskesmas Jatiasih</p>
                <p><Clipboard size={16} className="inline mr-2" /> RS Rujukan Utama: RSUD dr. Chasbullah Abdulmadjid</p>
              </div>
            </div>

            {/* Navigasi Cepat */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="font-semibold">Menu Terkait:</p>
              <Link to={`/data-ibu/${id}/skrining-preeklampsia`} className="block text-indigo-600 hover:underline">Skrining Preeklampsia</Link>
              <Link to={`/data-ibu/${id}/pemeriksaan-fisik`} className="block text-indigo-600 hover:underline">Pemeriksaan Fisik / ANC</Link>
              <Link to={`/data-ibu/${id}/grafik-evaluasi`} className="block text-indigo-600 hover:underline">Grafik Evaluasi</Link>
              <Link to={`/data-ibu/${id}/rencana-persalinan`} className="block text-indigo-600 hover:underline">Rencana Persalinan</Link>
              <Link to={`/data-ibu/${id}/pelayanan-nifas`} className="block text-indigo-600 hover:underline">Pelayanan Nifas</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}