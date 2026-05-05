// src/pages/Ibu/RencanaPersalinan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getRencanaByKehamilanId, createRencana, updateRencana } from "../../services/persalinan";
import { Save, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function RencanaPersalinan() {
  const { id } = useParams(); // id ibu
  const navigate = useNavigate();
  const [kehamilan, setKehamilan] = useState(null);
  const [existingRencana, setExistingRencana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    nama_ibu_pernyataan: "",
    alamat_ibu_pernyataan: "",
    perkiraan_bulan_persalinan: "",
    perkiraan_tahun_persalinan: "",
    fasyankes_1_nama_tenaga: "",
    fasyankes_1_nama_fasilitas: "",
    fasyankes_2_nama_tenaga: "",
    fasyankes_2_nama_fasilitas: "",
    sumber_dana_persalinan: "JKN/BPJS",
    kendaraan_1_nama: "",
    kendaraan_1_hp: "",
    metode_kontrasepsi_pilihan: "",
    donor_golongan_darah: "",
    donor_rhesus: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length === 0) {
          setErrorMessage("Data kehamilan tidak ditemukan untuk ibu ini.");
          setLoading(false);
          return;
        }
        const aktif = kehamilanList[0];
        setKehamilan(aktif);

        const rencanaData = await getRencanaByKehamilanId(aktif.id);
        if (rencanaData && rencanaData.length > 0) {
          const data = rencanaData[0];
          setExistingRencana(data);
          setForm({
            nama_ibu_pernyataan: data.nama_ibu_pernyataan || "",
            alamat_ibu_pernyataan: data.alamat_ibu_pernyataan || "",
            perkiraan_bulan_persalinan: data.perkiraan_bulan_persalinan || "",
            perkiraan_tahun_persalinan: data.perkiraan_tahun_persalinan || "",
            fasyankes_1_nama_tenaga: data.fasyankes_1_nama_tenaga || "",
            fasyankes_1_nama_fasilitas: data.fasyankes_1_nama_fasilitas || "",
            fasyankes_2_nama_tenaga: data.fasyankes_2_nama_tenaga || "",
            fasyankes_2_nama_fasilitas: data.fasyankes_2_nama_fasilitas || "",
            sumber_dana_persalinan: data.sumber_dana_persalinan || "JKN/BPJS",
            kendaraan_1_nama: data.kendaraan_1_nama || "",
            kendaraan_1_hp: data.kendaraan_1_hp || "",
            metode_kontrasepsi_pilihan: data.metode_kontrasepsi_pilihan || "",
            donor_golongan_darah: data.donor_golongan_darah || "",
            donor_rhesus: data.donor_rhesus || "",
          });
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Gagal memuat data. " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) {
      setErrorMessage("Data kehamilan tidak ditemukan.");
      return;
    }
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const payload = {
        ...form,
        kehamilan_id: kehamilan.id,
        perkiraan_tahun_persalinan: form.perkiraan_tahun_persalinan
          ? parseInt(form.perkiraan_tahun_persalinan)
          : null,
      };
      if (existingRencana) {
        await updateRencana(existingRencana.id, payload);
        setSuccessMessage("Rencana persalinan berhasil diperbarui.");
      } else {
        await createRencana(payload);
        setSuccessMessage("Rencana persalinan berhasil disimpan.");
      }
      // Refresh data setelah simpan
      const updated = await getRencanaByKehamilanId(kehamilan.id);
      if (updated && updated.length > 0) {
        const data = updated[0];
        setExistingRencana(data);
        setForm({
          nama_ibu_pernyataan: data.nama_ibu_pernyataan || "",
          alamat_ibu_pernyataan: data.alamat_ibu_pernyataan || "",
          perkiraan_bulan_persalinan: data.perkiraan_bulan_persalinan || "",
          perkiraan_tahun_persalinan: data.perkiraan_tahun_persalinan || "",
          fasyankes_1_nama_tenaga: data.fasyankes_1_nama_tenaga || "",
          fasyankes_1_nama_fasilitas: data.fasyankes_1_nama_fasilitas || "",
          fasyankes_2_nama_tenaga: data.fasyankes_2_nama_tenaga || "",
          fasyankes_2_nama_fasilitas: data.fasyankes_2_nama_fasilitas || "",
          sumber_dana_persalinan: data.sumber_dana_persalinan || "JKN/BPJS",
          kendaraan_1_nama: data.kendaraan_1_nama || "",
          kendaraan_1_hp: data.kendaraan_1_hp || "",
          metode_kontrasepsi_pilihan: data.metode_kontrasepsi_pilihan || "",
          donor_golongan_darah: data.donor_golongan_darah || "",
          donor_rhesus: data.donor_rhesus || "",
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal menyimpan: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Memuat data...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/data-ibu/${id}`)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Rencana Persalinan</h1>
            <p className="text-gray-500">Isi rencana persalinan ibu hamil.</p>
          </div>
        </div>

        {existingRencana && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle size={20} />
            <span>Data rencana persalinan sudah tersimpan. Anda dapat mengeditnya di bawah ini.</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Ibu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama Ibu <span className="text-red-500">*</span>
              </label>
              <input
                name="nama_ibu_pernyataan"
                value={form.nama_ibu_pernyataan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            {/* Alamat Ibu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Ibu</label>
              <textarea
                name="alamat_ibu_pernyataan"
                value={form.alamat_ibu_pernyataan}
                onChange={handleChange}
                rows="2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Perkiraan Bulan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Perkiraan Bulan Persalinan
              </label>
              <input
                name="perkiraan_bulan_persalinan"
                placeholder="Contoh: Januari"
                value={form.perkiraan_bulan_persalinan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Perkiraan Tahun */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Perkiraan Tahun Persalinan
              </label>
              <input
                type="number"
                name="perkiraan_tahun_persalinan"
                placeholder="2025"
                value={form.perkiraan_tahun_persalinan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Fasyankes 1 Tenaga */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fasilitas Kesehatan 1 - Nama Tenaga
              </label>
              <input
                name="fasyankes_1_nama_tenaga"
                value={form.fasyankes_1_nama_tenaga}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Fasyankes 1 Fasilitas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fasilitas Kesehatan 1 - Nama Fasilitas
              </label>
              <input
                name="fasyankes_1_nama_fasilitas"
                value={form.fasyankes_1_nama_fasilitas}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Fasyankes 2 Tenaga */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fasilitas Kesehatan 2 - Nama Tenaga
              </label>
              <input
                name="fasyankes_2_nama_tenaga"
                value={form.fasyankes_2_nama_tenaga}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Fasyankes 2 Fasilitas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fasilitas Kesehatan 2 - Nama Fasilitas
              </label>
              <input
                name="fasyankes_2_nama_fasilitas"
                value={form.fasyankes_2_nama_fasilitas}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Sumber Dana */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sumber Dana Persalinan
              </label>
              <select
                name="sumber_dana_persalinan"
                value={form.sumber_dana_persalinan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option>JKN/BPJS</option>
                <option>Jamkesda</option>
                <option>Asuransi Swasta</option>
                <option>Biaya sendiri</option>
              </select>
            </div>
            {/* Kendaraan 1 Nama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Kendaraan / Nama Pengantar
              </label>
              <input
                name="kendaraan_1_nama"
                value={form.kendaraan_1_nama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Kendaraan HP */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                No HP Kendaraan / Pengantar
              </label>
              <input
                name="kendaraan_1_hp"
                value={form.kendaraan_1_hp}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Metode Kontrasepsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Metode Kontrasepsi Pilihan
              </label>
              <input
                name="metode_kontrasepsi_pilihan"
                value={form.metode_kontrasepsi_pilihan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Donor Golongan Darah */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Golongan Darah Donor
              </label>
              <input
                name="donor_golongan_darah"
                value={form.donor_golongan_darah}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            {/* Donor Rhesus */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Rhesus Donor
              </label>
              <input
                name="donor_rhesus"
                value={form.donor_rhesus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t mt-4">
            <button
              type="button"
              onClick={() => navigate(`/data-ibu/${id}`)}
              className="px-6 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Save size={18} />
              {saving ? "Menyimpan..." : existingRencana ? "Perbarui Rencana" : "Simpan Rencana"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}