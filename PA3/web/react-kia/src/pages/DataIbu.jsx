import React, { useEffect, useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import IbuTable from "../components/DataIbu/IbuTable";
import DusunChart from "../components/DataIbu/DusunChart";
import JadwalPemeriksaan from "../components/DataIbu/JadwalPemeriksaan";
import AddEditIbuModal from "../components/DataIbu/AddEditIbuModal";
import { getAllIbu, createIbu, updateIbu, deleteIbu, getJadwalPemeriksaan } from "../services/ibuService";
import { getCurrentUser } from "../services/auth";

const DataIbu = () => {
  const [ibuList, setIbuList] = useState([]);
  const [dusunStats, setDusunStats] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [totalTerdaftar, setTotalTerdaftar] = useState(0);
  const [totalHamil, setTotalHamil] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIbu, setEditingIbu] = useState(null);
  const user = getCurrentUser();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ibu = await getAllIbu();
      setIbuList(ibu);
      setTotalTerdaftar(ibu.length);
      setTotalHamil(ibu.filter(i => i.statusKehamilan && i.statusKehamilan !== "NIFAS").length);

      // Hitung per dusun
      const dusunMap = ibu.reduce((acc, curr) => {
        const dusun = curr.dusun || "Lainnya";
        acc[dusun] = (acc[dusun] || 0) + 1;
        return acc;
      }, {});
      const dusunArr = Object.entries(dusunMap).map(([dusun, jumlah]) => ({ dusun, jumlah }));
      setDusunStats(dusunArr);

      const jadwalData = await getJadwalPemeriksaan();
      setJadwal(jadwalData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat data. Pastikan server berjalan dan token valid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingIbu(null);
    setModalOpen(true);
  };

  const handleEdit = (ibu) => {
    setEditingIbu(ibu);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus data ibu ini?")) {
      try {
        await deleteIbu(id);
        fetchData();
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingIbu) {
        await updateIbu(editingIbu.id, formData);
      } else {
        await createIbu(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
            <p>{error}</p>
            <button 
              onClick={fetchData} 
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header user={user} />
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm">TOTAL TERDAFTAR</p>
              <p className="text-3xl font-bold">{totalTerdaftar.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-500 text-sm">IBU SEDANG HAMIL</p>
              <p className="text-3xl font-bold">{totalHamil.toLocaleString()}</p>
            </div>
          </div>

          <IbuTable 
            data={ibuList} 
            onAdd={handleAdd} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Jumlah Ibu per Dusun</h3>
              <DusunChart data={dusunStats} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Jadwal Pemeriksaan</h3>
              <JadwalPemeriksaan jadwal={jadwal} />
            </div>
          </div>
        </main>
      </div>
      <AddEditIbuModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingIbu}
      />
    </div>
  );
};

export default DataIbu;