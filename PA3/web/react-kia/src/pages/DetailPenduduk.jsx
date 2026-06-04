// src/pages/DetailPenduduk.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { getRiwayatCard } from "../services/dashboardService";

export default function DetailPenduduk() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // untuk toggle detail riwayat

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getRiwayatCard(id);
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data penduduk");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <MainLayout><div className="p-4 text-center">Memuat data...</div></MainLayout>;
  if (error) return <MainLayout><div className="p-4 text-center text-red-600">{error}</div></MainLayout>;
  if (!data) return <MainLayout><div className="p-4 text-center">Data tidak ditemukan</div></MainLayout>;

  // 🔧 PERBAIKAN: pastikan riwayat selalu array (bukan null)
  const { data_diri, riwayat: rawRiwayat } = data;
  const riwayat = Array.isArray(rawRiwayat) ? rawRiwayat : [];
  const latest = riwayat.length > 0 ? riwayat[0] : null;

  const tglLahir = data_diri?.tanggal_lahir
    ? new Date(data_diri.tanggal_lahir).toLocaleDateString('id-ID')
    : '-';

  const formatValue = (val) => (val ? val : '-');

  const toggleDetail = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper untuk badge risiko
  const getRiskBadge = (risiko) => {
    if (risiko === 'Tinggi') return 'bg-red-100 text-red-700';
    if (risiko === 'Sedang') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Kembali
        </button>

        {/* Dua kolom: Data Diri (kiri) dan Detail Kesehatan Terakhir (kanan) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Kiri: Data Diri */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Data Diri</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Nama</div>
                <div className="font-medium">{data_diri?.nama_lengkap || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">NIK</div>
                <div className="font-medium">{data_diri?.nik || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tanggal Lahir</div>
                <div className="font-medium">{tglLahir}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Jenis Kelamin</div>
                <div className="font-medium">{data_diri?.jenis_kelamin || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dusun</div>
                <div className="font-medium">{data_diri?.dusun || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Usia</div>
                <div className="font-medium">{data_diri?.usia ?? '-'} tahun</div>
              </div>
            </div>
          </div>

          {/* Kanan: Detail Kesehatan Terakhir */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Detail Kesehatan Terakhir</h2>
            {!latest ? (
              <div className="text-center text-gray-500 py-8">Belum ada pemeriksaan.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Tanggal Pemeriksaan</div>
                    <div className="font-medium">
                      {latest.tanggal_pemeriksaan
                        ? new Date(latest.tanggal_pemeriksaan).toLocaleDateString('id-ID')
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Kategori Risiko</div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(latest.kategori_risiko)}`}>
                      {latest.kategori_risiko || 'Normal'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tekanan Darah</div>
                    <div className="font-medium">{formatValue(latest.tekanan_darah)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tinggi Badan</div>
                    <div className="font-medium">{latest.tinggi_badan ? `${latest.tinggi_badan} cm` : '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Berat Badan</div>
                    <div className="font-medium">{latest.berat_badan ? `${latest.berat_badan} kg` : '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">IMT</div>
                    <div className="font-medium">{latest.imt ? latest.imt.toFixed(1) : '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Gula Darah</div>
                    <div className="font-medium">{latest.gula_darah ? `${latest.gula_darah} mg/dL` : '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Kolesterol</div>
                    <div className="font-medium">{latest.kolesterol ? `${latest.kolesterol} mg/dL` : '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Asam Urat</div>
                    <div className="font-medium">{formatValue(latest.asam_urat)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Hemoglobin</div>
                    <div className="font-medium">{formatValue(latest.hemoglobin)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">Catatan Khusus</div>
                    <div className="font-medium">{formatValue(latest.catatan_khusus)}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Riwayat Pemeriksaan - Card yang bisa di-click untuk detail */}
        {riwayat.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Riwayat Pemeriksaan</h2>
            <div className="space-y-3">
              {riwayat.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleDetail(item.id)}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {new Date(item.tanggal_pemeriksaan).toLocaleDateString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-500">({item.kelompok || item.kategori})</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getRiskBadge(item.kategori_risiko)}`}>
                        Risiko: {item.kategori_risiko || 'Normal'}
                      </span>
                    </div>
                    <svg className={`w-5 h-5 transform transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedId === item.id && (
                    <div className="px-4 py-3 bg-white border-t text-sm space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {item.imt !== null && item.imt !== undefined && (
                          <div><span className="text-gray-600">IMT:</span> {typeof item.imt === 'number' ? item.imt.toFixed(1) : item.imt}</div>
                        )}
                        {item.status_gizi && <div><span className="text-gray-600">Status Gizi:</span> {item.status_gizi}</div>}
                        {item.berat_badan && <div><span className="text-gray-600">Berat Badan:</span> {item.berat_badan} kg</div>}
                        {item.tinggi_badan && <div><span className="text-gray-600">Tinggi Badan:</span> {item.tinggi_badan} cm</div>}
                        {item.tekanan_darah && <div><span className="text-gray-600">Tekanan Darah:</span> {item.tekanan_darah}</div>}
                        {item.gula_darah ? <div><span className="text-gray-600">Gula Darah:</span> {item.gula_darah} mg/dL</div> : null}
                        {item.kolesterol ? <div><span className="text-gray-600">Kolesterol:</span> {item.kolesterol} mg/dL</div> : null}
                        {item.asam_urat && <div><span className="text-gray-600">Asam Urat:</span> {item.asam_urat}</div>}
                        {item.hemoglobin && <div><span className="text-gray-600">Hemoglobin:</span> {item.hemoglobin}</div>}
                      </div>
                      {item.catatan_khusus && (
                        <div><span className="text-gray-600">Catatan:</span> {item.catatan_khusus}</div>
                      )}
                      {item.rekomendasi && (
                        <div className="mt-2 pt-2 border-t text-blue-700"><span className="font-medium">Rekomendasi:</span> {item.rekomendasi}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}