// src/pages/Ibu/PemeriksaanDokterT3CompleteDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import {
  getDokterT3CompleteByKehamilanId,
  deleteDokterT3Complete,
  getCatatanT3ByKehamilanId,
  createCatatanT3,
  updateCatatanT3,
  deleteCatatanT3,
} from "../../services/pemeriksaanDokter";
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  StickyNote,
  Plus,
  X,
  Save,
  Calendar,
  CalendarCheck,
  User,
  Activity,
  Eye,
  FlaskConical,
  Brain,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Pencil,
} from "lucide-react";

// ─── Helper Components ────────────────────────────────────────────────────────

function InfoRow({ label, value, highlight = false }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-indigo-700" : "text-gray-800"
        } ${!value || value === "-" ? "text-gray-400 italic" : ""}`}
      >
        {value || "-"}
      </span>
    </div>
  );
}

function StatusBadge({ value }) {
  if (!value || value === "-") return <span className="text-gray-400 text-sm italic">-</span>;
  return value === "Normal" ? (
    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
      <CheckCircle size={10} /> Normal
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
      <XCircle size={10} /> Abnormal
    </span>
  );
}

function ReaktifBadge({ value }) {
  const lower = (value || "").toLowerCase();
  if (!value || value === "-") return <span className="text-gray-400 text-sm italic">-</span>;
  return lower === "nonreaktif" || lower === "non reaktif" ? (
    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
      <CheckCircle size={10} /> Non Reaktif
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
      <XCircle size={10} /> Reaktif
    </span>
  );
}

function fmtDate(val) {
  if (!val) return "-";
  try {
    return new Date(val).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function DetailSection({ icon: Icon, title, colorCls = "bg-indigo-50 text-indigo-700 border-indigo-100", children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-5 py-4 border-b ${colorCls} transition-colors`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={17} />}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

// ─── Modal Catatan (T3) ───────────────────────────────────────────────────────

function ModalCatatan({ kehamilanId, catatan, onClose, onSaved }) {
  const isEdit = Boolean(catatan);
  const [form, setForm] = useState({
    tanggal_periksa_stamp_paraf: catatan?.tanggal_periksa_stamp_paraf
      ? catatan.tanggal_periksa_stamp_paraf.split("T")[0]
      : "",
    keluhan_pemeriksaan_tindakan_saran:
      catatan?.keluhan_pemeriksaan_tindakan_saran || "",
    tanggal_kembali: catatan?.tanggal_kembali
      ? catatan.tanggal_kembali.split("T")[0]
      : "",
  });
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.keluhan_pemeriksaan_tindakan_saran.trim()) {
      setFieldError("Keluhan / tindakan / saran tidak boleh kosong.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        kehamilan_id: kehamilanId,
        tanggal_periksa_stamp_paraf: form.tanggal_periksa_stamp_paraf || null,
        keluhan_pemeriksaan_tindakan_saran: form.keluhan_pemeriksaan_tindakan_saran.trim(),
        tanggal_kembali: form.tanggal_kembali || null,
      };

      if (isEdit) {
        await updateCatatanT3(catatan.id_catatan_t3, payload);
      } else {
        await createCatatanT3(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Terjadi kesalahan";
      setFieldError("Gagal menyimpan: " + msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-700">
            <StickyNote size={18} />
            <h2 className="font-bold text-sm">
              {isEdit ? "Edit Catatan" : "Tambah Catatan Baru"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-indigo-100 transition text-indigo-500"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Tanggal Periksa / Stempel / Paraf
            </label>
            <input
              type="date"
              name="tanggal_periksa_stamp_paraf"
              value={form.tanggal_periksa_stamp_paraf}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Keluhan / Pemeriksaan / Tindakan / Saran{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="keluhan_pemeriksaan_tindakan_saran"
              value={form.keluhan_pemeriksaan_tindakan_saran}
              onChange={handleChange}
              placeholder="Tuliskan keluhan pasien, hasil pemeriksaan, tindakan yang dilakukan, atau saran dokter..."
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Tanggal Kembali (Kontrol Selanjutnya)
            </label>
            <input
              type="date"
              name="tanggal_kembali"
              value={form.tanggal_kembali}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          {fieldError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600">{fieldError}</p>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2 rounded-xl text-sm font-semibold transition"
            >
              {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function PemeriksaanDokterT3CompleteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kehamilan, setKehamilan] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [catatanList, setCatatanList] = useState([]);
  const [loadingCatatan, setLoadingCatatan] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCatatan, setEditCatatan] = useState(null);

  // Fetch data pemeriksaan utama T3
  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (!kehamilanList || kehamilanList.length === 0) {
          setError("Data kehamilan tidak ditemukan.");
          setLoading(false);
          return;
        }
        const aktif = kehamilanList[0];
        setKehamilan(aktif);

        const res = await getDokterT3CompleteByKehamilanId(aktif.id);
        if (!res || !res.dokter) {
          setError("Belum ada data pemeriksaan Trimester 3. Silakan buat data terlebih dahulu.");
        } else {
          setData(res);
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch catatan T3
  const fetchCatatan = useCallback(async () => {
    if (!kehamilan) return;
    setLoadingCatatan(true);
    try {
      const res = await getCatatanT3ByKehamilanId(kehamilan.id);
      if (Array.isArray(res)) {
        setCatatanList(res);
      } else if (res && Array.isArray(res.data)) {
        setCatatanList(res.data);
      } else {
        setCatatanList([]);
      }
    } catch (err) {
      console.error("Error fetch catatan T3:", err);
      setCatatanList([]);
    } finally {
      setLoadingCatatan(false);
    }
  }, [kehamilan]);

  useEffect(() => {
    fetchCatatan();
  }, [fetchCatatan]);

  // Hapus pemeriksaan utama T3
  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus semua data pemeriksaan Trimester 3 ini?"))
      return;
    try {
      await deleteDokterT3Complete(data.dokter.id);
      alert("Data berhasil dihapus.");
      navigate(`/data-ibu/${id}`);
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  // Hapus catatan T3
  const handleDeleteCatatan = async (idCatatan) => {
    if (!window.confirm("Hapus catatan ini?")) return;
    try {
      await deleteCatatanT3(idCatatan);
      fetchCatatan();
    } catch (err) {
      alert("Gagal menghapus catatan.");
    }
  };

  const handleTambahCatatan = () => {
    setEditCatatan(null);
    setModalOpen(true);
  };

  const handleEditCatatan = (catatan) => {
    setEditCatatan(catatan);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditCatatan(null);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-indigo-600">
            <Loader2 className="animate-spin" size={40} />
            <p className="text-sm text-gray-500">Memuat data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <div className="p-6 max-w-2xl mx-auto mt-10">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-yellow-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-yellow-700 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6 text-sm">{error || "Belum ada data pemeriksaan Trimester 3."}</p>
            <div className="flex gap-3 justify-center">
              <Link
                to={`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/form`}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Buat Data Baru
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const d = data.dokter;
  const lab = data.lab_jiwa;

  const fisikItems = [
    { label: "Konjungtiva", value: d.fisik_konjungtiva },
    { label: "Sklera", value: d.fisik_sklera },
    { label: "Kulit", value: d.fisik_kulit },
    { label: "Leher", value: d.fisik_leher },
    { label: "Gigi & Mulut", value: d.fisik_gigi_mulut },
    { label: "THT", value: d.fisik_tht },
    { label: "Dada / Jantung", value: d.fisik_dada_jantung },
    { label: "Dada / Paru", value: d.fisik_dada_paru },
    { label: "Perut", value: d.fisik_perut },
    { label: "Tungkai", value: d.fisik_tungkai },
  ];

  const abnormalCount = fisikItems.filter((f) => f.value === "Abnormal").length;

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/data-ibu/${id}`)}
              className="p-2 rounded-full hover:bg-gray-100 transition shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Pemeriksaan Dokter Trimester 3
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Detail pemeriksaan fisik, USG, biometri, lanjutan, dan laboratorium
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/form`}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <Edit size={15} /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <Trash2 size={15} /> Hapus
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
            <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">
              Dokter
            </p>
            <p className="text-sm font-bold text-indigo-800 truncate">
              {d.nama_dokter || "-"}
            </p>
          </div>
          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
            <p className="text-xs text-teal-500 font-semibold uppercase tracking-wide mb-1">
              Tanggal Periksa
            </p>
            <p className="text-sm font-bold text-teal-800">{fmtDate(d.tanggal_periksa)}</p>
          </div>
          <div
            className={`rounded-2xl p-4 border ${
              abnormalCount > 0
                ? "bg-red-50 border-red-100"
                : "bg-emerald-50 border-emerald-100"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                abnormalCount > 0 ? "text-red-500" : "text-emerald-500"
              }`}
            >
              Fisik Abnormal
            </p>
            <p
              className={`text-2xl font-bold ${
                abnormalCount > 0 ? "text-red-700" : "text-emerald-700"
              }`}
            >
              {abnormalCount}
              <span className="text-sm font-normal"> / 10</span>
            </p>
          </div>
          <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
            <p className="text-xs text-violet-500 font-semibold uppercase tracking-wide mb-1">
              UK Biometri T3
            </p>
            <p className="text-sm font-bold text-violet-800">
              {d.uk_berdasarkan_biometri_usg_trimester_3_minggu
                ? `${d.uk_berdasarkan_biometri_usg_trimester_3_minggu} minggu`
                : "-"}
            </p>
          </div>
        </div>

        {/* Detail sections */}
        <div className="space-y-4">
          {/* Data Dokter */}
          <DetailSection icon={User} title="Data Dokter & Anamnesis" colorCls="bg-indigo-50 text-indigo-700 border-indigo-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoRow label="Nama Dokter" value={d.nama_dokter} highlight />
              <InfoRow label="Tanggal Periksa" value={fmtDate(d.tanggal_periksa)} />
              <div className="sm:col-span-3">
                <InfoRow label="Konsep Anamnesa Pemeriksaan" value={d.konsep_anamnesa_pemeriksaan} />
              </div>
            </div>
          </DetailSection>

          {/* Fisik */}
          <DetailSection icon={Activity} title="Pemeriksaan Fisik" colorCls="bg-teal-50 text-teal-700 border-teal-100">
            {abnormalCount > 0 && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-600 font-medium">
                  Terdapat {abnormalCount} temuan abnormal pada pemeriksaan fisik.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {fisikItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </span>
                  <StatusBadge value={item.value} />
                </div>
              ))}
            </div>
          </DetailSection>

          {/* USG Trimester 3 */}
          <DetailSection icon={Eye} title="USG Trimester 3" colorCls="bg-violet-50 text-violet-700 border-violet-100">
            <InfoRow label="USG Dilakukan?" value={d.usg_trimester_3_dilakukan === "Ya" ? "Ya" : (d.usg_trimester_3_dilakukan || "-")} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <InfoRow label="UK USG T1 (mg)" value={d.uk_berdasarkan_usg_trimester_1_minggu ? `${d.uk_berdasarkan_usg_trimester_1_minggu} mg` : null} />
              <InfoRow label="UK HPHT (mg)" value={d.uk_berdasarkan_hpht_minggu ? `${d.uk_berdasarkan_hpht_minggu} mg` : null} />
              <InfoRow label="UK Biometri T3 (mg)" value={d.uk_berdasarkan_biometri_usg_trimester_3_minggu ? `${d.uk_berdasarkan_biometri_usg_trimester_3_minggu} mg` : null} highlight />
              <InfoRow label="Selisih ≥3 mg?" value={d.selisih_uk_3_minggu_atau_lebih || "-"} />
              <InfoRow label="Jumlah Bayi" value={d.usg_jumlah_bayi || "-"} />
              <InfoRow label="Letak Bayi" value={d.usg_letak_bayi || "-"} />
              <InfoRow label="Presentasi Bayi" value={d.usg_presentasi_bayi || "-"} />
              <InfoRow label="Keadaan Bayi" value={d.usg_keadaan_bayi || "-"} />
              <InfoRow label="DJJ (x/menit)" value={d.usg_djj_nilai || "-"} />
              <InfoRow label="Status DJJ" value={d.usg_djj_status || "-"} />
              <InfoRow label="Lokasi Plasenta" value={d.usg_lokasi_plasenta || "-"} />
              <InfoRow label="Cairan Ketuban (cm)" value={d.usg_cairan_ketuban_sdp_cm ? `${d.usg_cairan_ketuban_sdp_cm} cm` : null} />
              <InfoRow label="Status Ketuban" value={d.usg_cairan_ketuban_status || "-"} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Kecurigaan Abnormal
                </span>
                {d.usg_kecurigaan_temuan_abnormal === "Ya" ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                    <XCircle size={10} /> Ya
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                    <CheckCircle size={10} /> Tidak
                  </span>
                )}
              </div>
              {d.usg_kecurigaan_temuan_abnormal === "Ya" && (
                <InfoRow label="Keterangan Abnormal" value={d.usg_keterangan_temuan_abnormal} />
              )}
            </div>
          </DetailSection>

          {/* Biometri Janin */}
          <DetailSection icon={Activity} title="Biometri Janin" colorCls="bg-blue-50 text-blue-700 border-blue-100">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <InfoRow label="BPD (cm)" value={d.biometri_bpd_cm ? `${d.biometri_bpd_cm} cm` : null} />
              <InfoRow label="BPD (mg)" value={d.biometri_bpd_minggu ? `${d.biometri_bpd_minggu} mg` : null} />
              <InfoRow label="HC (cm)" value={d.biometri_hc_cm ? `${d.biometri_hc_cm} cm` : null} />
              <InfoRow label="HC (mg)" value={d.biometri_hc_minggu ? `${d.biometri_hc_minggu} mg` : null} />
              <InfoRow label="AC (cm)" value={d.biometri_ac_cm ? `${d.biometri_ac_cm} cm` : null} />
              <InfoRow label="AC (mg)" value={d.biometri_ac_minggu ? `${d.biometri_ac_minggu} mg` : null} />
              <InfoRow label="FL (cm)" value={d.biometri_fl_cm ? `${d.biometri_fl_cm} cm` : null} />
              <InfoRow label="FL (mg)" value={d.biometri_fl_minggu ? `${d.biometri_fl_minggu} mg` : null} />
              <InfoRow label="EFW/TBJ (gram)" value={d.biometri_efw_tbj_gram ? `${d.biometri_efw_tbj_gram} gr` : null} />
              <InfoRow label="EFW/TBJ (mg)" value={d.biometri_efw_tbj_minggu ? `${d.biometri_efw_tbj_minggu} mg` : null} />
            </div>
          </DetailSection>

          {/* Lanjutan Trimester 3 */}
          <DetailSection icon={StickyNote} title="Lanjutan Trimester 3 & Rencana" colorCls="bg-amber-50 text-amber-700 border-amber-100">
            <div className="space-y-4">
              <InfoRow label="Hasil USG/Catatan" value={d.hasil_usg_catatan} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow label="Tanggal Lab Lanjutan" value={fmtDate(d.tanggal_lab)} />
                <InfoRow label="Hemoglobin (g/dL)" value={d.lab_hemoglobin_hasil ? `${d.lab_hemoglobin_hasil} g/dL` : null} />
                <InfoRow label="Rencana Hb" value={d.lab_hemoglobin_rencana} />
                <InfoRow label="Protein Urin (hasil)" value={d.lab_protein_urin_hasil || "-"} />
                <InfoRow label="Rencana Protein Urin" value={d.lab_protein_urin_rencana} />
                <InfoRow label="Urin Reduksi" value={d.lab_urin_reduksi_hasil} />
                <InfoRow label="Rencana Urin Reduksi" value={d.lab_urin_reduksi_rencana} />
                <InfoRow label="Tanggal Skrining Jiwa" value={fmtDate(d.tanggal_skrining_jiwa)} />
                <InfoRow label="Hasil Skrining Jiwa" value={d.skrining_jiwa_hasil} />
                <InfoRow label="Tindak Lanjut Jiwa" value={d.skrining_jiwa_tindak_lanjut} />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Perlu Rujukan Jiwa
                  </span>
                  {d.skrining_jiwa_perlu_rujukan === "Ya" ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                      <XCircle size={10} /> Ya
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle size={10} /> Tidak
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Rencana Konsultasi</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <span>Gizi: {d.rencana_konsultasi_gizi ? "✅ Ya" : "❌ Tidak"}</span>
                  <span>Kebidanan: {d.rencana_konsultasi_kebidanan ? "✅ Ya" : "❌ Tidak"}</span>
                  <span>Anak: {d.rencana_konsultasi_anak ? "✅ Ya" : "❌ Tidak"}</span>
                  <span>Penyakit Dalam: {d.rencana_konsultasi_penyakit_dalam ? "✅ Ya" : "❌ Tidak"}</span>
                  <span>Neurologi: {d.rencana_konsultasi_neurologi ? "✅ Ya" : "❌ Tidak"}</span>
                  <span>THT: {d.rencana_konsultasi_tht ? "✅ Ya" : "❌ Tidak"}</span>
                  <span>Psikiatri: {d.rencana_konsultasi_psikiatri ? "✅ Ya" : "❌ Tidak"}</span>
                  {d.rencana_konsultasi_lain_lain && <span>Lainnya: {d.rencana_konsultasi_lain_lain}</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Rencana Proses Melahirkan & Kontrasepsi</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-700">
                  <span>Proses Melahirkan: {d.rencana_proses_melahirkan || "-"}</span>
                  <span>AKDR: {d.rencana_kontrasepsi_akdr ? "✅" : "❌"}</span>
                  <span>Pil: {d.rencana_kontrasepsi_pil ? "✅" : "❌"}</span>
                  <span>Suntik: {d.rencana_kontrasepsi_suntik ? "✅" : "❌"}</span>
                  <span>Steril: {d.rencana_kontrasepsi_steril ? "✅" : "❌"}</span>
                  <span>MAL: {d.rencana_kontrasepsi_mal ? "✅" : "❌"}</span>
                  <span>Implan: {d.rencana_kontrasepsi_implan ? "✅" : "❌"}</span>
                  <span>Belum Memilih: {d.rencana_kontrasepsi_belum_memilih ? "✅" : "❌"}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Kebutuhan Konseling</p>
                <p className="text-sm text-gray-700">{d.kebutuhan_konseling || "-"}</p>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-2 mb-1">Penjelasan</p>
                <p className="text-sm text-gray-700">{d.penjelasan || "-"}</p>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-2 mb-1">Rekomendasi Tempat Melahirkan</p>
                <p className="text-sm text-gray-700">{d.kesimpulan_rekomendasi_tempat_melahirkan || "-"}</p>
              </div>
            </div>
          </DetailSection>

          {/* Pemeriksaan Laboratorium & Skrining Jiwa (tabel terpisah) */}
          <DetailSection icon={FlaskConical} title="Pemeriksaan Laboratorium & Skrining Jiwa" colorCls="bg-amber-50 text-amber-700 border-amber-100">
            {lab ? (
              <>
                <InfoRow label="Tanggal Lab" value={fmtDate(lab.tanggal_lab)} />
                <div className="rounded-xl border border-amber-100 overflow-hidden mt-3">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50">
                      <tr><th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide">Pemeriksaan</th><th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide">Hasil</th><th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide">Rencana</th></tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                      <tr><td className="px-4 py-3">Hemoglobin</td><td className="px-4 py-3">{lab.lab_hemoglobin_hasil ? `${lab.lab_hemoglobin_hasil} g/dL` : "-"}</td><td className="px-4 py-3">{lab.lab_hemoglobin_rencana_tindak_lanjut || "-"}</td></tr>
                      <tr className="bg-gray-50/60"><td className="px-4 py-3">Gula Darah Sewaktu</td><td className="px-4 py-3">{lab.lab_gula_darah_sewaktu_hasil ? `${lab.lab_gula_darah_sewaktu_hasil} mg/dL` : "-"}</td><td className="px-4 py-3">{lab.lab_gula_darah_sewaktu_rencana_tindak_lanjut || "-"}</td></tr>
                      <tr><td className="px-4 py-3">Golongan Darah & Rhesus</td><td className="px-4 py-3 font-semibold">{lab.lab_golongan_darah_rhesus_hasil || "-"}</td><td className="px-4 py-3">{lab.lab_golongan_darah_rhesus_rencana_tindak_lanjut || "-"}</td></tr>
                      <tr className="bg-gray-50/60"><td className="px-4 py-3">HIV</td><td className="px-4 py-3"><ReaktifBadge value={lab.lab_hiv_hasil} /></td><td className="px-4 py-3">{lab.lab_hiv_rencana_tindak_lanjut || "-"}</td></tr>
                      <tr><td className="px-4 py-3">Sifilis</td><td className="px-4 py-3"><ReaktifBadge value={lab.lab_sifilis_hasil} /></td><td className="px-4 py-3">{lab.lab_sifilis_rencana_tindak_lanjut || "-"}</td></tr>
                      <tr className="bg-gray-50/60"><td className="px-4 py-3">Hepatitis B</td><td className="px-4 py-3"><ReaktifBadge value={lab.lab_hepatitis_b_hasil} /></td><td className="px-4 py-3">{lab.lab_hepatitis_b_rencana_tindak_lanjut || "-"}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoRow label="Tanggal Skrining Jiwa" value={fmtDate(lab.tanggal_skrining_jiwa)} />
                  <InfoRow label="Hasil Skrining Jiwa" value={lab.skrining_jiwa_hasil} />
                  <InfoRow label="Tindak Lanjut Jiwa" value={lab.skrining_jiwa_tindak_lanjut} />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Perlu Rujukan Jiwa</span>
                    {lab.skrining_jiwa_perlu_rujukan === "Ya" ? <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full w-fit">Ya</span> : <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full w-fit">Tidak</span>}
                  </div>
                  <div className="sm:col-span-2"><InfoRow label="Kesimpulan" value={lab.kesimpulan} /></div>
                  <div className="sm:col-span-2"><InfoRow label="Rekomendasi" value={lab.rekomendasi} /></div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">Data laboratorium belum diisi.</p>
            )}
          </DetailSection>

          {/* Catatan Pelayanan Trimester 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-indigo-50 border-b border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700">
                <StickyNote size={17} />
                <span className="font-semibold text-sm">Catatan Pelayanan Trimester 3</span>
                {catatanList.length > 0 && (
                  <span className="bg-indigo-200 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {catatanList.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleTambahCatatan}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm"
              >
                <Plus size={14} /> Tambah Catatan
              </button>
            </div>
            <div className="p-5">
              {loadingCatatan ? (
                <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm">Memuat catatan...</span>
                </div>
              ) : catatanList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                    <MessageSquarePlus size={24} className="text-indigo-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Belum ada catatan pelayanan</p>
                  <p className="text-xs text-gray-400 mb-4">Tambahkan catatan keluhan, tindakan, atau saran untuk kunjungan ini</p>
                  <button
                    type="button"
                    onClick={handleTambahCatatan}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    <Plus size={15} /> Tambah Catatan Pertama
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {catatanList.map((catatan, idx) => (
                    <div
                      key={catatan.id_catatan_t3}
                      className="group relative bg-gray-50 hover:bg-indigo-50/40 border border-gray-100 hover:border-indigo-200 rounded-2xl p-4 transition-all"
                    >
                      <div className="absolute top-4 left-4 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div className="ml-9">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          {catatan.tanggal_periksa_stamp_paraf && (
                            <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full font-medium">
                              <Calendar size={11} />
                              {fmtDate(catatan.tanggal_periksa_stamp_paraf)}
                            </div>
                          )}
                          {catatan.tanggal_kembali && (
                            <div className="flex items-center gap-1.5 text-xs text-teal-600 bg-teal-100 px-2.5 py-1 rounded-full font-medium">
                              <CalendarCheck size={11} />
                              Kembali: {fmtDate(catatan.tanggal_kembali)}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {catatan.keluhan_pemeriksaan_tindakan_saran || <span className="italic text-gray-400">Tidak ada isi catatan</span>}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEditCatatan(catatan)}
                          className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 transition shadow-sm"
                          title="Edit catatan"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCatatan(catatan.id_catatan_t3)}
                          className="p-1.5 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 transition shadow-sm"
                          title="Hapus catatan"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Catatan */}
      {modalOpen && (
        <ModalCatatan
          kehamilanId={kehamilan?.id}
          catatan={editCatatan}
          onClose={handleModalClose}
          onSaved={fetchCatatan}
        />
      )}
    </MainLayout>
  );
}