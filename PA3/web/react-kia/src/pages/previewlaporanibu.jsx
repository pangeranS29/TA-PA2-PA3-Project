import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { previewLaporanIbu, exportLaporanIbu } from "../services/laporan";
import { Download, ArrowLeft, Loader2, Table } from "lucide-react";

export default function LaporanIbuPreview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchPreview();
  }, []);

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const rawData = await previewLaporanIbu();
      // Sesuaikan jika API mengembalikan { data: [...] }
      const normalized = Array.isArray(rawData) ? rawData : rawData?.data || [];
      setData(normalized);
      if (normalized.length === 0) setError("Tidak ada data ibu");
    } catch (err) {
      console.error(err);
      setError("Gagal memuat preview data ibu");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportLaporanIbu();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan_data_ibu.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengekspor laporan ibu");
    } finally {
      setExporting(false);
    }
  };

  const renderTable = () => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const columns = Object.keys(data[0]);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                    {row[col] !== undefined && row[col] !== null ? String(row[col]) : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-sm text-gray-500 mt-2">
          Total {data.length} data
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} /> Kembali
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || !data?.length}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {exporting ? "Memproses..." : "Download Excel"}
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4">Preview Laporan Data Ibu</h1>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && data?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Table size={48} className="mx-auto mb-2" />
            <p>Tidak ada data ibu</p>
          </div>
        )}

        {!loading && !error && data?.length > 0 && renderTable()}
      </div>
    </MainLayout>
  );
}