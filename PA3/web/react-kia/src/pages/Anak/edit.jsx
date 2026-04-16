import React, { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { updateAnak, getAnak } from "../../services/Anak";
import { ArrowLeft, Save, Baby, AlertCircle, Loader2 } from "lucide-react";

export default function EditAnak() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Loading saat simpan
  const [fetching, setFetching] = useState(true); // Loading saat ambil data awal
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const [form, setForm] = useState({
    nama: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    berat_lahir_kg: ""
  });

  // 1. Ambil data lama saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const res = await getAnak();
        // Mencari data anak berdasarkan ID dari parameter URL
        const data = res.data.find((item) => item.id === parseInt(id));

        if (data) {
          // Format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
          const formattedDate = data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : "";
          
          setForm({
            nama: data.nama || "",
            jenis_kelamin: data.jenis_kelamin || "",
            tanggal_lahir: formattedDate,
            berat_lahir_kg: data.berat_lahir_kg || ""
          });
        } else {
          setGeneralError("Data anak tidak ditemukan. Pastikan Anda memilih data yang benar.");
        }
      } catch (err) {
        console.error(err);
        setGeneralError("Gagal mengambil data dari server. Silakan coba segarkan halaman.");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Hapus pesan error kolom saat pengguna mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 2. Validasi Form
  const validateForm = () => {
    let tempErrors = {};
    if (!form.nama.trim()) tempErrors.nama = "Nama anak tidak boleh kosong.";
    if (!form.jenis_kelamin) tempErrors.jenis_kelamin = "Silakan pilih jenis kelamin.";
    if (!form.tanggal_lahir) tempErrors.tanggal_lahir = "Tanggal lahir harus diisi.";
    if (!form.berat_lahir_kg || form.berat_lahir_kg <= 0) tempErrors.berat_lahir_kg = "Berat lahir harus diisi dengan angka (contoh: 3.2).";
    
    if (form.tanggal_lahir && new Date(form.tanggal_lahir) > new Date()) {
      tempErrors.tanggal_lahir = "Tanggal lahir tidak boleh di masa depan.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 3. Simpan Perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        berat_lahir_kg: parseFloat(form.berat_lahir_kg)
      };

      await updateAnak(id, payload);
      alert("Perubahan data anak telah disimpan.");
      navigate("/Daftar-Anak");
    } catch (err) {
      console.error("ERROR UPDATE:", err);
      if (err?.response?.status === 400) {
        setGeneralError("Ada data yang kurang tepat. Periksa kembali isian Anda.");
      } else {
        setGeneralError("Terjadi kesalahan saat menyimpan. Mohon coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Baby size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Ubah Data Anak</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>

        {/* Error Banner */}
        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start gap-3 rounded-r-lg">
            <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
            <p className="text-sm font-medium">{generalError}</p>
          </div>
        )}

        {fetching ? (
          // Tampilan saat loading ambil data awal
          <div className="bg-white rounded-xl p-20 border border-gray-100 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="animate-spin mb-4 text-indigo-600" size={40} />
            <p>Sedang mengambil data anak...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nama Anak */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nama Lengkap Anak <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nama"
                    type="text"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className={`w-full p-3 rounded-lg border outline-none transition-all ${
                      errors.nama ? "border-red-500 bg-red-50" : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                  {errors.nama && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.nama}</p>}
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenis_kelamin"
                    value={form.jenis_kelamin}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border outline-none transition-all ${
                      errors.jenis_kelamin ? "border-red-500 bg-red-50" : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  >
                    <option value="">Pilih...</option>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                  {errors.jenis_kelamin && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.jenis_kelamin}</p>}
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={form.tanggal_lahir}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border outline-none transition-all ${
                      errors.tanggal_lahir ? "border-red-500 bg-red-50" : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                  {errors.tanggal_lahir && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.tanggal_lahir}</p>}
                </div>

                {/* Berat Lahir */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Berat Lahir (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="berat_lahir_kg"
                    value={form.berat_lahir_kg}
                    onChange={handleChange}
                    placeholder="Contoh: 3.2"
                    className={`w-full p-3 rounded-lg border outline-none transition-all ${
                      errors.berat_lahir_kg ? "border-red-500 bg-red-50" : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                  {errors.berat_lahir_kg && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12}/> {errors.berat_lahir_kg}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-all border border-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all
                    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md hover:shadow-lg'}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sedang Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}