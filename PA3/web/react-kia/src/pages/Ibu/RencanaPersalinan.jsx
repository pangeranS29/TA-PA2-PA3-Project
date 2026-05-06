// src/pages/Ibu/RencanaPersalinan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getRencanaByKehamilanId, createRencana, updateRencana } from "../../services/persalinan";
import { getCurrentUser, isDokterUser } from "../../services/auth";
import { Save, CheckCircle, AlertCircle, ArrowLeft, Home, Eye, Edit, Plus, ClipboardList } from "lucide-react";

export default function RencanaPersalinan() {
  const { id } = useParams(); // id ibu
  const navigate = useNavigate();

  const user = getCurrentUser();
  const isDokter = isDokterUser(user);
  const canEdit = !isDokter; // bidan bisa edit

  const [kehamilan, setKehamilan] = useState(null);
  const [existingRencana, setExistingRencana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  // Breadcrumb
  const Breadcrumb = () => {
    if (!kehamilan) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <Home size={14} /> Beranda
        </Link>
        <span>/</span>
        <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
        <span>/</span>
        <Link to={`/data-ibu/${id}`} className="hover:text-indigo-600">Detail Ibu</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Rencana Persalinan</span>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length === 0) {
          setErrorMessage("Data kehamilan tidak ditemukan untuk ibu ini.");
          setKehamilan(null);
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
        } else {
          setExistingRencana(null);
        }
        // Mode edit tidak langsung aktif
        setIsEditing(false);
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
    if (!canEdit) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("Anda tidak memiliki izin untuk mengubah data.");
      return;
    }
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
        perkiraan_tahun_persalinan: form.perkiraan_tahun_persalinan ? parseInt(form.perkiraan_tahun_persalinan) : null,
      };
      if (existingRencana) {
        await updateRencana(existingRencana.id, payload);
        setSuccessMessage("Rencana persalinan berhasil diperbarui.");
      } else {
        await createRencana(payload);
        setSuccessMessage("Rencana persalinan berhasil disimpan.");
      }
      // Refresh data
      const updated = await getRencanaByKehamilanId(kehamilan.id);
      if (updated && updated.length > 0) {
        const data = updated[0];
        setExistingRencana(data);
        setForm({
          ...form,
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
      } else {
        setExistingRencana(null);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal menyimpan: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Tampilan ringkasan (jika data sudah ada)
  const EvaluationView = () => {
    if (!existingRencana) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-full">
              <ClipboardList size={48} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Belum Ada Rencana Persalinan</h3>
            <p className="text-gray-500 max-w-md">
              Silakan buat rencana persalinan untuk ibu hamil ini.
            </p>
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2"
              >
                <Plus size={18} /> Buat Rencana Persalinan
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Informasi ringkasan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Data Rencana Persalinan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-semibold">Nama Ibu:</span> {existingRencana.nama_ibu_pernyataan || "-"}</div>
            <div><span className="font-semibold">Alamat Ibu:</span> {existingRencana.alamat_ibu_pernyataan || "-"}</div>
            <div><span className="font-semibold">Perkiraan Bulan:</span> {existingRencana.perkiraan_bulan_persalinan || "-"}</div>
            <div><span className="font-semibold">Perkiraan Tahun:</span> {existingRencana.perkiraan_tahun_persalinan || "-"}</div>
            <div><span className="font-semibold">Sumber Dana:</span> {existingRencana.sumber_dana_persalinan || "-"}</div>
            <div><span className="font-semibold">Metode Kontrasepsi Pilihan:</span> {existingRencana.metode_kontrasepsi_pilihan || "-"}</div>
            <div><span className="font-semibold">Faskes 1 Tenaga:</span> {existingRencana.fasyankes_1_nama_tenaga || "-"}</div>
            <div><span className="font-semibold">Faskes 1 Fasilitas:</span> {existingRencana.fasyankes_1_nama_fasilitas || "-"}</div>
            <div><span className="font-semibold">Faskes 2 Tenaga:</span> {existingRencana.fasyankes_2_nama_tenaga || "-"}</div>
            <div><span className="font-semibold">Faskes 2 Fasilitas:</span> {existingRencana.fasyankes_2_nama_fasilitas || "-"}</div>
            <div><span className="font-semibold">Kendaraan / Pengantar:</span> {existingRencana.kendaraan_1_nama || "-"} {existingRencana.kendaraan_1_hp ? `(${existingRencana.kendaraan_1_hp})` : ""}</div>
            <div><span className="font-semibold">Donor - Golongan Darah:</span> {existingRencana.donor_golongan_darah || "-"}</div>
            <div><span className="font-semibold">Donor - Rhesus:</span> {existingRencana.donor_rhesus || "-"}</div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"
            >
              <Edit size={18} /> Edit Rencana
            </button>
          )}
          <button
            onClick={() => navigate(`/data-ibu/${id}`)}
            className="bg-gray-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2"
          >
            <Eye size={18} /> Kembali ke Detail Ibu
          </button>
        </div>
      </div>
    );
  };

  // Form input (create / edit)
  const FormView = () => (
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
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
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
            disabled={!canEdit}
            rows="2"
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        {/* Perkiraan Bulan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Perkiraan Bulan Persalinan</label>
          <input
            name="perkiraan_bulan_persalinan"
            placeholder="Contoh: Januari"
            value={form.perkiraan_bulan_persalinan}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        {/* Perkiraan Tahun */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Perkiraan Tahun Persalinan</label>
          <input
            type="number"
            name="perkiraan_tahun_persalinan"
            placeholder="2025"
            value={form.perkiraan_tahun_persalinan}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        {/* Fasyankes 1 Tenaga */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fasilitas Kesehatan 1 - Nama Tenaga</label>
          <input
            name="fasyankes_1_nama_tenaga"
            value={form.fasyankes_1_nama_tenaga}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fasilitas Kesehatan 1 - Nama Fasilitas</label>
          <input
            name="fasyankes_1_nama_fasilitas"
            value={form.fasyankes_1_nama_fasilitas}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fasilitas Kesehatan 2 - Nama Tenaga</label>
          <input
            name="fasyankes_2_nama_tenaga"
            value={form.fasyankes_2_nama_tenaga}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fasilitas Kesehatan 2 - Nama Fasilitas</label>
          <input
            name="fasyankes_2_nama_fasilitas"
            value={form.fasyankes_2_nama_fasilitas}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Sumber Dana Persalinan</label>
          <select
            name="sumber_dana_persalinan"
            value={form.sumber_dana_persalinan}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          >
            <option>JKN/BPJS</option>
            <option>Jamkesda</option>
            <option>Asuransi Swasta</option>
            <option>Biaya sendiri</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Kendaraan / Nama Pengantar</label>
          <input
            name="kendaraan_1_nama"
            value={form.kendaraan_1_nama}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">No HP Kendaraan / Pengantar</label>
          <input
            name="kendaraan_1_hp"
            value={form.kendaraan_1_hp}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Metode Kontrasepsi Pilihan</label>
          <input
            name="metode_kontrasepsi_pilihan"
            value={form.metode_kontrasepsi_pilihan}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Golongan Darah Donor</label>
          <input
            name="donor_golongan_darah"
            value={form.donor_golongan_darah}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rhesus Donor</label>
          <input
            name="donor_rhesus"
            value={form.donor_rhesus}
            onChange={handleChange}
            disabled={!canEdit}
            className={`w-full border rounded-lg px-4 py-2 ${!canEdit ? 'bg-gray-100' : 'border-gray-300'}`}
          />
        </div>
      </div>

      {canEdit && (
        <div className="flex gap-4 justify-end pt-6 border-t mt-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
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
      )}
    </form>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Memuat data...</div>
      </MainLayout>
    );
  }

  if (!kehamilan) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 mb-4">{errorMessage}</div>
          <button onClick={() => navigate(`/data-ibu/${id}`)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Kembali</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
       <div className="p-6 max-w-5xl">
        <Breadcrumb />

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/data-ibu/${id}`)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Rencana Persalinan</h1>
            <p className="text-gray-500">Kelola rencana persalinan ibu hamil.</p>
          </div>
        </div>

        {!canEdit && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-blue-700 text-sm flex items-center gap-2">
            <Eye size={16} /> Anda dalam mode baca (Dokter). Data hanya dapat dilihat, tidak dapat diubah.
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

        {isEditing ? <FormView /> : <EvaluationView />}
        {/* {!existingRencana ? <FormView /> : (isEditing ? <FormView /> : <EvaluationView />)} */}
      </div>
    </MainLayout>
  );
}