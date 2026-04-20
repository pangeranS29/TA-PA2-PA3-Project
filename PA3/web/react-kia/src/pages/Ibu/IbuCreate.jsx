// src/pages/Ibu/IbuCreate.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ tambahkan Link
import MainLayout from "../../components/Layout/MainLayout";
import { createIbu } from "../../services/ibu";
import { getKependudukanList } from "../../services/kependudukan";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export default function IbuCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [kkList, setKkList] = useState([]);
  const [form, setForm] = useState({
    id_kependudukan: "",
    status_kehamilan: "TRIMESTER 1",
  });

  useEffect(() => {
    const fetchKK = async () => {
      try {
        const data = await getKependudukanList();
        setKkList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchKK();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_kependudukan) {
      alert("Pilih KK terlebih dahulu");
      return;
    }
    setLoading(true);
    try {
      // ✅ Konversi id_kependudukan ke number
      const payload = {
        id_kependudukan: Number(form.id_kependudukan),
        status_kehamilan: form.status_kehamilan,
      };
      await createIbu(payload);
      alert("Data ibu berhasil ditambahkan");
      navigate("/data-ibu");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menambahkan data ibu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Tambah Data Ibu Baru</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Kartu Keluarga (KK)</label>
            <select
              name="id_kependudukan"
              value={form.id_kependudukan}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Pilih KK --</option>
              {kkList.map((kk) => (
                <option key={kk.id_kependudukan} value={kk.id_kependudukan}>
                  {kk.nama_lengkap} - {kk.nik} - {kk.no_kk}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Data KK harus ditambahkan terlebih dahulu di menu{" "}
              <Link to="/kependudukan" className="text-indigo-600 hover:underline">
                Manajemen KK
              </Link>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status Kehamilan</label>
            <select
              name="status_kehamilan"
              value={form.status_kehamilan}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option>TRIMESTER 1</option>
              <option>TRIMESTER 2</option>
              <option>TRIMESTER 3</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Menyimpan..." : "Simpan Data Ibu"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/kependudukan" className="text-indigo-600 text-sm hover:underline">
            + Tambah KK baru dulu jika belum ada
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}