import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getRencanaById } from "../../services/persalinan";
import { getCurrentUser, isDokterUser } from "../../services/auth";
import { Edit, Download, ArrowLeft, Home } from "lucide-react";

export default function RencanaPersalinanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rencanaId = searchParams.get("id");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Role: bidan bisa edit, dokter hanya baca
  const user = getCurrentUser();
  const isDokter = isDokterUser(user);
  const canEdit = !isDokter; // bidan

  useEffect(() => {
    const fetchData = async () => {
      if (!rencanaId || rencanaId === "undefined" || rencanaId === "null") {
        setError("ID rencana tidak valid. Kembali ke halaman sebelumnya.");
        setLoading(false);
        return;
      }
      try {
        const result = await getRencanaById(rencanaId);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rencanaId]);

  const handleExport = () => window.print();

  // Breadcrumb component
  const Breadcrumb = () => {
    if (!data) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <Home size={14} /> Beranda
        </Link>
        <span>/</span>
        <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
        <span>/</span>
        <Link to={`/data-ibu/${id}`} className="hover:text-indigo-600">
          Detail Ibu
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Rencana Persalinan</span>
      </div>
    );
  };

  if (loading) return <MainLayout><div className="p-6 text-center">Memuat data...</div></MainLayout>;
  if (error) return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 mb-4">{error}</div>
        <button onClick={() => navigate(`/data-ibu/${id}/rencana-persalinan`)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Kembali ke Rencana Persalinan</button>
      </div>
    </MainLayout>
  );
  if (!data) return <MainLayout><div className="p-6 text-center">Data tidak ditemukan.</div></MainLayout>;

  const editId = data.id_rencana_persalinan || data.id;
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto print:p-0">
        <Breadcrumb />
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/data-ibu/${id}`)} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
            <h1 className="text-2xl font-bold">Detail Rencana Persalinan</h1>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <button onClick={() => navigate(`/data-ibu/${id}/rencana-persalinan/form?id=${editId}`)} className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-2 hover:bg-amber-600">
                <Edit size={18} /> Edit
              </button>
            )}
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
              <Download size={18} /> Export PDF
            </button>
          </div>
        </div>
        {!canEdit && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 text-blue-700 text-sm flex items-center gap-2">
            <Home size={16} /> Anda dalam mode baca (Dokter). Data hanya dapat dilihat, tidak dapat diubah.
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Rencana Persalinan</h2>
            <p className="text-gray-500">Dibuat untuk ibu: {data.nama_ibu_pernyataan}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b pb-2 col-span-full"><h3 className="font-semibold text-lg">Data Ibu</h3></div>
            <div><label className="text-gray-500">Nama Ibu</label><p className="font-medium">{data.nama_ibu_pernyataan || "-"}</p></div>
            <div><label className="text-gray-500">Alamat Ibu</label><p>{data.alamat_ibu_pernyataan || "-"}</p></div>
            <div><label className="text-gray-500">Perkiraan Bulan Persalinan</label><p>{data.perkiraan_bulan_persalinan || "-"}</p></div>
            <div><label className="text-gray-500">Perkiraan Tahun Persalinan</label><p>{data.perkiraan_tahun_persalinan || "-"}</p></div>
            <div><label className="text-gray-500">Sumber Dana</label><p>{data.sumber_dana_persalinan || "-"}</p></div>
            <div className="border-b pb-2 col-span-full mt-4"><h3 className="font-semibold text-lg">Fasilitas Kesehatan</h3></div>
            <div><label className="text-gray-500">Faskes 1 - Tenaga</label><p>{data.fasyankes_1_nama_tenaga || "-"}</p></div>
            <div><label className="text-gray-500">Faskes 1 - Fasilitas</label><p>{data.fasyankes_1_nama_fasilitas || "-"}</p></div>
            <div><label className="text-gray-500">Faskes 2 - Tenaga</label><p>{data.fasyankes_2_nama_tenaga || "-"}</p></div>
            <div><label className="text-gray-500">Faskes 2 - Fasilitas</label><p>{data.fasyankes_2_nama_fasilitas || "-"}</p></div>
            <div className="border-b pb-2 col-span-full mt-4"><h3 className="font-semibold text-lg">Transportasi & Kontrasepsi</h3></div>
            <div><label className="text-gray-500">Kendaraan / Pengantar</label><p>{data.kendaraan_1_nama || "-"} - {data.kendaraan_1_hp || "-"}</p></div>
            <div><label className="text-gray-500">Metode Kontrasepsi Pilihan</label><p>{data.metode_kontrasepsi_pilihan || "-"}</p></div>
            <div className="border-b pb-2 col-span-full mt-4"><h3 className="font-semibold text-lg">Donor Darah</h3></div>
            <div><label className="text-gray-500">Golongan Darah Donor</label><p>{data.donor_golongan_darah || "-"}</p></div>
            <div><label className="text-gray-500">Rhesus Donor</label><p>{data.donor_rhesus || "-"}</p></div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-400 print:block hidden">Dicetak dari Sistem KIA</div>
        </div>
      </div>
    </MainLayout>
  );
}