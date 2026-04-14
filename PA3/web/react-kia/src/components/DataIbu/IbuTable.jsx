import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";

const IbuTable = ({ data = [], onEdit, onDelete, onAdd }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pastikan data adalah array
  const safeData = Array.isArray(data) ? data : [];
  
  const filtered = safeData.filter((ibu) =>
    ibu.nama && ibu.nama.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    const colors = {
      "TRIMESTER 1": "bg-blue-100 text-blue-800",
      "TRIMESTER 2": "bg-yellow-100 text-yellow-800",
      "TRIMESTER 3": "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari Nama Ibu..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={18} /> Tambah Ibu
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama / ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Kehamilan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Gizi</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  {search ? "Tidak ada data yang sesuai" : "Belum ada data ibu hamil"}
                </td>
              </tr>
            ) : (
              paginated.map((ibu) => (
                <tr key={ibu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{ibu.nama || "-"}</div>
                    <div className="text-sm text-gray-500">ID: P-{String(ibu.id).padStart(3, "0")}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ibu.usia || "-"} Tahun</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(ibu.statusKehamilan)}`}>
                      {ibu.statusKehamilan || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Normal</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => onEdit(ibu)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDelete(ibu.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="px-6 py-3 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Menampilkan {paginated.length} dari {filtered.length} data
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-2">Halaman {currentPage} dari {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IbuTable;