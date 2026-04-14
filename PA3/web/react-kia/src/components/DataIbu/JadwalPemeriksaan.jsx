import React from "react";
import { Calendar, Clock } from "lucide-react";

const JadwalPemeriksaan = ({ jadwal }) => {
  if (!jadwal || jadwal.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-gray-500 text-center">
        Tidak ada jadwal pemeriksaan
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Jadwal Pemeriksaan</h3>
        <button className="text-indigo-600 text-sm hover:underline">Lihat Seluruh Jadwal</button>
      </div>
      <div className="divide-y divide-gray-100">
        {jadwal.map((item) => (
          <div key={item.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{item.namaIbu}</p>
              <p className="text-sm text-gray-500">{item.jenisPemeriksaan}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Calendar size={12} /> {item.tanggal}
                <Clock size={12} /> {item.jam}
              </div>
            </div>
            <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{item.dusun}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JadwalPemeriksaan;