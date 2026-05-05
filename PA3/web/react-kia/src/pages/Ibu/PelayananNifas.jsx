// src/pages/Ibu/PelayananNifas.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getNifasByKehamilanId, createNifas, updateNifas } from "../../services/nifas";
import { 
  getCatatanNifasByKehamilanId, 
  createCatatanNifas, 
  updateCatatanNifas, 
  deleteCatatanNifas 
} from "../../services/catatanNifas";
import { Save, ArrowLeft, Edit2, CheckCircle, FileText, X, Trash2, Plus, Home } from "lucide-react";

// ============================================================
// KOMPONEN EMPTY STATE
// ============================================================
const EmptyState = ({ title, message, onAdd }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-indigo-50 rounded-full">
        <Plus size={40} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
      <button
        onClick={onAdd}
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
      >
        <Plus size={18} /> Tambah Data
      </button>
    </div>
  </div>
);

// ============================================================
// KOMPONEN MODAL CATATAN
// ============================================================
const ModalCatatan = ({ isOpen, onClose, catatanData, onSave, onDelete, kunjunganLabel, saving }) => {
  const [formCatatan, setFormCatatan] = useState({
    tanggal_periksa_stamp_paraf: "",
    keluhan_pemeriksaan_tindakan_saran: "",
    tanggal_kembali: "",
  });

  useEffect(() => {
    if (catatanData) {
      setFormCatatan({
        tanggal_periksa_stamp_paraf: catatanData.tanggal_periksa_stamp_paraf || "",
        keluhan_pemeriksaan_tindakan_saran: catatanData.keluhan_pemeriksaan_tindakan_saran || "",
        tanggal_kembali: catatanData.tanggal_kembali || "",
      });
    } else {
      setFormCatatan({
        tanggal_periksa_stamp_paraf: new Date().toISOString().split("T")[0],
        keluhan_pemeriksaan_tindakan_saran: "",
        tanggal_kembali: "",
      });
    }
  }, [catatanData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormCatatan(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {catatanData ? "Edit" : "Tambah"} Catatan Pelayanan Nifas - {kunjunganLabel}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Periksa / Stamp / Paraf <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tanggal_periksa_stamp_paraf"
              value={formCatatan.tanggal_periksa_stamp_paraf}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Keluhan / Pemeriksaan / Tindakan / Saran
            </label>
            <textarea
              name="keluhan_pemeriksaan_tindakan_saran"
              value={formCatatan.keluhan_pemeriksaan_tindakan_saran}
              onChange={handleChange}
              rows={6}
              placeholder="Catatan keluhan ibu, hasil pemeriksaan, tindakan yang dilakukan, dan saran yang diberikan..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Kembali (Kontrol Ulang)
            </label>
            <input
              type="date"
              name="tanggal_kembali"
              value={formCatatan.tanggal_kembali}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kosongkan jika tidak ada jadwal kontrol
            </p>
          </div>
        </div>
        
        <div className="flex justify-between gap-2 p-4 border-t">
          {catatanData && (
            <button
              onClick={() => onDelete(catatanData.id_catatan_nifas)}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-2"
              disabled={saving}
            >
              <Trash2 size={16} />
              Hapus
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={saving}
            >
              Batal
            </button>
            <button
              onClick={() => onSave(formCatatan)}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan Catatan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// KOMPONEN CARD RIWAYAT CATATAN
// ============================================================
const RiwayatCatatanCard = ({ catatan, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {catatan.tanggal_periksa_stamp_paraf}
            </span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {catatan.keluhan_pemeriksaan_tindakan_saran}
          </p>
          {catatan.tanggal_kembali && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span>📅 Kontrol kembali:</span>
              <span className="font-medium">{catatan.tanggal_kembali}</span>
            </p>
          )}
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(catatan)}
            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Edit catatan"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(catatan.id_catatan_nifas)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Hapus catatan"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// KOMPONEN DAFTAR RIWAYAT CATATAN
// ============================================================
const DaftarRiwayatCatatan = ({ catatanList, onEdit, onDelete, kunjunganLabel }) => {
  if (!catatanList || catatanList.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <FileText size={32} className="text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Belum ada catatan untuk kunjungan {kunjunganLabel}</p>
        <p className="text-xs text-gray-400 mt-1">Klik tombol "Tambah Catatan" untuk menambahkan</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={18} className="text-gray-500" />
        <h3 className="text-md font-semibold text-gray-700">Riwayat Catatan</h3>
        <span className="text-xs text-gray-400">({catatanList.length} catatan)</span>
      </div>
      <div className="space-y-3">
        {catatanList.map((catatan) => (
          <RiwayatCatatanCard
            key={catatan.id_catatan_nifas}
            catatan={catatan}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// KOMPONEN DETAIL ITEM
// ============================================================
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800 font-semibold mt-0.5">{value ?? "-"}</span>
  </div>
);

// ============================================================
// KOMPONEN DETAIL NIFAS
// ============================================================
const DetailNifas = ({ data, onEdit, onOpenCatatan, kunjunganLabel }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle size={20} />
        <h2 className="text-lg font-semibold text-gray-800">
          Data Pelayanan Nifas - {kunjunganLabel}
        </h2>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onOpenCatatan}
          className="flex items-center gap-2 text-sm text-blue-600 border border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50"
        >
          <Plus size={14} /> Tambah Catatan
        </button>
        <button 
          onClick={onEdit}
          className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
        >
          <Edit2 size={14} /> Edit Data
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 rounded-lg p-4">
      <DetailItem label="Tanggal Periksa" value={data.tanggal_periksa} />
      <DetailItem label="Tekanan Darah" value={data.tanda_vital_tekanan_darah} />
      <DetailItem label="Suhu Tubuh" value={data.tanda_vital_suhu_tubuh ? `${data.tanda_vital_suhu_tubuh} °C` : "-"} />
      <DetailItem label="Involusi Uteri" value={data.pelayanan_involusi_uteri} />
      <DetailItem label="Cairan Pervaginam" value={data.pelayanan_cairan_pervaginam} />
      <DetailItem label="Periksa Jalan Lahir" value={data.pelayanan_periksa_jalan_lahir} />
      <DetailItem label="Periksa Payudara" value={data.pelayanan_periksa_payudara} />
      <DetailItem label="ASI Eksklusif" value={data.pelayanan_asi_eksklusif} />
      <DetailItem label="Vitamin A" value={data.pemberian_kapsul_vitamin_a ? "Sudah diberikan" : "Belum diberikan"} />
      <DetailItem label="Tablet Tambah Darah" value={data.pemberian_tablet_tambah_darah_jumlah ? `${data.pemberian_tablet_tambah_darah_jumlah} tablet` : "-"} />
      <DetailItem label="Skrining Depresi Nifas" value={data.pelayanan_skrining_depresi_nifas} />
      <DetailItem label="Kontrasepsi Pasca Persalinan" value={data.pelayanan_kontrasepsi_pasca_persalinan} />
      <DetailItem label="Penanganan Risiko Malaria" value={data.pelayanan_penanganan_risiko_malaria} />
      <DetailItem label="Komplikasi Nifas" value={data.komplikasi_nifas} />
      <DetailItem label="Tindakan/Saran" value={data.tindakan_saran} />
      <DetailItem label="Nama Pemeriksa/Paraf" value={data.nama_pemeriksa_paraf} />
      <DetailItem label="Tanggal Kembali" value={data.tanggal_kembali} />
    </div>
  </div>
);

const emptyForm = (kunjungan) => ({
  kunjungan_ke: kunjungan,
  tanggal_periksa: "",
  tanda_vital_tekanan_darah: "",
  tanda_vital_suhu_tubuh: "",
  pelayanan_involusi_uteri: "",
  pelayanan_cairan_pervaginam: "",
  pelayanan_periksa_jalan_lahir: "",
  pelayanan_periksa_payudara: "",
  pelayanan_asi_eksklusif: "",
  pemberian_kapsul_vitamin_a: false,
  pemberian_tablet_tambah_darah_jumlah: "",
  pelayanan_skrining_depresi_nifas: "",
  pelayanan_kontrasepsi_pasca_persalinan: "",
  pelayanan_penanganan_risiko_malaria: "",
  komplikasi_nifas: "",
  tindakan_saran: "",
  nama_pemeriksa_paraf: "",
  tanggal_kembali: "",
});

export default function PelayananNifas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kehamilan, setKehamilan] = useState(null);
  const [nifas, setNifas] = useState([]);
  const [selectedKunjungan, setSelectedKunjungan] = useState("KF1");
  const [form, setForm] = useState(emptyForm("KF1"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);
          const data = await getNifasByKehamilanId(aktif.id);
          setNifas(data);
          const existing = data.find((n) => n.kunjungan_ke === selectedKunjungan);
          if (existing) {
            setForm({
              kunjungan_ke: existing.kunjungan_ke,
              tanggal_periksa: existing.tanggal_periksa ? new Date(existing.tanggal_periksa).toISOString().split("T")[0] : "",
              tanda_vital_tekanan_darah: existing.tanda_vital_tekanan_darah || "",
              tanda_vital_suhu_tubuh: existing.tanda_vital_suhu_tubuh || "",
              pelayanan_involusi_uteri: existing.pelayanan_involusi_uteri || "",
              pelayanan_cairan_pervaginam: existing.pelayanan_cairan_pervaginam || "",
              pelayanan_periksa_jalan_lahir: existing.pelayanan_periksa_jalan_lahir || "",
              pelayanan_periksa_payudara: existing.pelayanan_periksa_payudara || "",
              pelayanan_asi_eksklusif: existing.pelayanan_asi_eksklusif || "",
              pemberian_kapsul_vitamin_a: existing.pemberian_kapsul_vitamin_a || false,
              pemberian_tablet_tambah_darah_jumlah: existing.pemberian_tablet_tambah_darah_jumlah || "",
              pelayanan_skrining_depresi_nifas: existing.pelayanan_skrining_depresi_nifas || "",
              pelayanan_kontrasepsi_pasca_persalinan: existing.pelayanan_kontrasepsi_pasca_persalinan || "",
              pelayanan_penanganan_risiko_malaria: existing.pelayanan_penanganan_risiko_malaria || "",
              komplikasi_nifas: existing.komplikasi_nifas || "",
              tindakan_saran: existing.tindakan_saran || "",
              nama_pemeriksa_paraf: existing.nama_pemeriksa_paraf || "",
              tanggal_kembali: existing.tanggal_kembali ? new Date(existing.tanggal_kembali).toISOString().split("T")[0] : "",
            });
          } else {
            setForm(emptyForm(selectedKunjungan));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, selectedKunjungan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleEdit = () => {
    setMode("form");
  };

  const handleCancel = () => {
    if (currentData) {
      setMode("detail");
      populateForm(currentData);
    } else {
      setMode("empty");
      resetForm(selectedKunjungan);
    }
  };

  const handleOpenTambahCatatan = () => {
    setSelectedCatatan(null);
    setIsModalCatatanOpen(true);
  };

  const handleEditCatatan = (catatan) => {
    setSelectedCatatan(catatan);
    setIsModalCatatanOpen(true);
  };

  // Fungsi untuk menyimpan catatan
  const handleSaveCatatan = async (catatanForm) => {
    if (!kehamilan) {
      alert("Data kehamilan tidak ditemukan!");
      return;
    }
    
    setSavingCatatan(true);
    try {
      const payload = {
        kehamilan_id: kehamilan.id,
        kunjungan_ke: selectedKunjungan,
        tanggal_periksa_stamp_paraf: catatanForm.tanggal_periksa_stamp_paraf,
        keluhan_pemeriksaan_tindakan_saran: catatanForm.keluhan_pemeriksaan_tindakan_saran,
        tanggal_kembali: catatanForm.tanggal_kembali || null,
      };
      
      delete payload.id_catatan_nifas;
      delete payload.id;
      
      if (selectedCatatan && selectedCatatan.id_catatan_nifas) {
        await updateCatatanNifas(selectedCatatan.id_catatan_nifas, payload);
      } else {
        await createCatatanNifas(payload);
      }
      
      // Refresh data
      const dataCatatan = await getCatatanNifasByKehamilanId(kehamilan.id);
      setCatatanList(dataCatatan);
      
      alert("Catatan berhasil disimpan!");
      setIsModalCatatanOpen(false);
      setSelectedCatatan(null);
      
    } catch (err) {
      console.error("Error:", err);
      alert("Gagal menyimpan catatan: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingCatatan(false);
    }
  };
  
  // Fungsi untuk menghapus catatan
  const handleDeleteCatatan = async (idCatatan) => {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;
    
    setSavingCatatan(true);
    try {
      await deleteCatatanNifas(idCatatan);
      setCatatanList(prev => prev.filter(c => c.id_catatan_nifas !== idCatatan));
      alert("Catatan berhasil dihapus!");
      setIsModalCatatanOpen(false);
      setSelectedCatatan(null);
    } catch (err) {
      console.error("Error menghapus catatan:", err);
      alert("Gagal menghapus catatan");
    } finally {
      setSavingCatatan(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) {
      alert("Data kehamilan tidak ditemukan!");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        kehamilan_id: kehamilan.id,
        kunjungan_ke: form.kunjungan_ke,
        tanggal_periksa: form.tanggal_periksa || null,
        tanda_vital_tekanan_darah: form.tanda_vital_tekanan_darah || "",
        tanda_vital_suhu_tubuh: form.tanda_vital_suhu_tubuh ? parseFloat(form.tanda_vital_suhu_tubuh) : null,
        pelayanan_involusi_uteri: form.pelayanan_involusi_uteri || "",
        pelayanan_cairan_pervaginam: form.pelayanan_cairan_pervaginam || "",
        pelayanan_periksa_jalan_lahir: form.pelayanan_periksa_jalan_lahir || "",
        pelayanan_periksa_payudara: form.pelayanan_periksa_payudara || "",
        pelayanan_asi_eksklusif: form.pelayanan_asi_eksklusif || "",
        pemberian_kapsul_vitamin_a: form.pemberian_kapsul_vitamin_a,
        pemberian_tablet_tambah_darah_jumlah: form.pemberian_tablet_tambah_darah_jumlah ? parseInt(form.pemberian_tablet_tambah_darah_jumlah) : 0,
        pelayanan_skrining_depresi_nifas: form.pelayanan_skrining_depresi_nifas || "",
        pelayanan_kontrasepsi_pasca_persalinan: form.pelayanan_kontrasepsi_pasca_persalinan || "",
        pelayanan_penanganan_risiko_malaria: form.pelayanan_penanganan_risiko_malaria || "",
        komplikasi_nifas: form.komplikasi_nifas || "",
        tindakan_saran: form.tindakan_saran || "",
        nama_pemeriksa_paraf: form.nama_pemeriksa_paraf || "",
        tanggal_kembali: form.tanggal_kembali || null,
      };
      
      Object.keys(payload).forEach(key => {
        if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
          delete payload[key];
        }
      });
      
      const existing = nifas.find((n) => n.kunjungan_ke === selectedKunjungan);
      
      if (existing) {
        await updateNifas(existing.id, payload);
        alert("Data pelayanan nifas berhasil diperbarui");
      } else {
        await createNifas(payload);
        alert("Data pelayanan nifas berhasil disimpan");
      }
      
      // Refresh data nifas
      const refreshedData = await getNifasByKehamilanId(kehamilan.id);
      const nifasArray = Array.isArray(refreshedData) ? refreshedData : [];
      setNifas(nifasArray);
      
      const newCurrentData = nifasArray.find((n) => n.kunjungan_ke === selectedKunjungan);
      setCurrentData(newCurrentData);
      setMode("detail");
      
      if (newCurrentData) {
        populateForm(newCurrentData);
      }
      
    } catch (err) {
      alert("Gagal menyimpan data nifas");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl">
        {/* Breadcrumb */}
        {/* <Breadcrumb /> */}

        <div className="flex items-center gap-4 mb-6">
          <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pelayanan Nifas</h1>
            <p className="text-gray-500">Pencatatan pelayanan pasca persalinan.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["KF1", "KF2", "KF3", "KF4"].map((k) => (
            <button key={k} type="button" onClick={() => setSelectedKunjungan(k)}
              className={`px-4 py-2 rounded-lg ${selectedKunjungan === k ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>
              {k === "KF1" ? "6-48 Jam" : k === "KF2" ? "3-7 Hari" : k === "KF3" ? "8-28 Hari" : "29-42 Hari"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700">Kunjungan {selectedKunjungan}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Tanggal Periksa</label><input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Tekanan Darah</label><input name="tanda_vital_tekanan_darah" value={form.tanda_vital_tekanan_darah} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Suhu Tubuh</label><input type="number" step="0.1" name="tanda_vital_suhu_tubuh" value={form.tanda_vital_suhu_tubuh} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Involusi Uteri</label><input name="pelayanan_involusi_uteri" value={form.pelayanan_involusi_uteri} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Cairan Pervaginam</label><input name="pelayanan_cairan_pervaginam" value={form.pelayanan_cairan_pervaginam} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Periksa Jalan Lahir</label><input name="pelayanan_periksa_jalan_lahir" value={form.pelayanan_periksa_jalan_lahir} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Periksa Payudara</label><input name="pelayanan_periksa_payudara" value={form.pelayanan_periksa_payudara} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">ASI Eksklusif</label><input name="pelayanan_asi_eksklusif" value={form.pelayanan_asi_eksklusif} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" name="pemberian_kapsul_vitamin_a" checked={form.pemberian_kapsul_vitamin_a} onChange={handleChange} />
              <label className="text-sm font-medium">Vitamin A</label>
            </div>
            <div><label className="block text-sm font-medium mb-1">Tablet Tambah Darah</label><input type="number" name="pemberian_tablet_tambah_darah_jumlah" value={form.pemberian_tablet_tambah_darah_jumlah} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Skrining Depresi Nifas</label><input name="pelayanan_skrining_depresi_nifas" value={form.pelayanan_skrining_depresi_nifas} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Kontrasepsi Pasca Persalinan</label><input name="pelayanan_kontrasepsi_pasca_persalinan" value={form.pelayanan_kontrasepsi_pasca_persalinan} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Penanganan Risiko Malaria</label><input name="pelayanan_penanganan_risiko_malaria" value={form.pelayanan_penanganan_risiko_malaria} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Komplikasi Nifas</label><textarea name="komplikasi_nifas" value={form.komplikasi_nifas} onChange={handleChange} className="w-full border rounded px-3 py-2" rows="2" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Tindakan/Saran</label><textarea name="tindakan_saran" value={form.tindakan_saran} onChange={handleChange} className="w-full border rounded px-3 py-2" rows="2" /></div>
            <div><label className="block text-sm font-medium mb-1">Nama Pemeriksa/Paraf</label><input name="nama_pemeriksa_paraf" value={form.nama_pemeriksa_paraf} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Tanggal Kembali</label><input type="date" name="tanggal_kembali" value={form.tanggal_kembali} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          </div>
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Nifas"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}