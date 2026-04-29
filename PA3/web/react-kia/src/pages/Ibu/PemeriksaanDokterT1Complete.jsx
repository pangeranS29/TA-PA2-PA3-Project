// src/pages/Ibu/PemeriksaanDokterT1Complete.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import {
  getDokterT1CompleteByKehamilanId,
  createDokterT1Complete,
  updateDokterT1Complete,
} from "../../services/pemeriksaanDokter";
import {
  Save,
  ArrowLeft,
  AlertCircle,
  Loader2,
  User,
  Activity,
  Eye,
  FlaskConical,
  Brain,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ─── Komponen helper ────────────────────────────────────────────────────────

/** Label + input teks biasa */
function Field({ label, children, colSpan = "" }) {
  return (
    <div className={colSpan}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white transition";

const selectCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white transition";

/** Kartu seksi yang bisa di-collapse */
function Section({ icon: Icon, title, color = "indigo", children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const headerColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-6 py-4 border-b ${headerColor} transition-colors`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} />}
          <span className="font-semibold text-sm tracking-wide">{title}</span>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

/** Badge status Normal/Abnormal */
function StatusBadge({ value }) {
  return value === "Normal" ? (
    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
      <CheckCircle size={10} /> Normal
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
      <XCircle size={10} /> Abnormal
    </span>
  );
}

// ─── Komponen utama ─────────────────────────────────────────────────────────

export default function PemeriksaanDokterT1Complete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kehamilan, setKehamilan] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    kehamilan_id: "",
    nama_dokter: "",
    tanggal_periksa: "",
    konsep_anamnesa_pemeriksaan: "",
    // Fisik
    fisik_konjungtiva: "Normal",
    fisik_sklera: "Normal",
    fisik_kulit: "Normal",
    fisik_leher: "Normal",
    fisik_gigi_mulut: "Normal",
    fisik_tht: "Normal",
    fisik_dada_jantung: "Normal",
    fisik_dada_paru: "Normal",
    fisik_perut: "Normal",
    fisik_tungkai: "Normal",
    // USG
    hpht: "",
    keteraturan_haid: "Teratur",
    umur_hamil_hpht_minggu: "",
    hpl_berdasarkan_hpht: "",
    umur_hamil_usg_minggu: "",
    hpl_berdasarkan_usg: "",
    usg_jumlah_gs: "",
    usg_diameter_gs_cm: "",
    usg_diameter_gs_minggu: "",
    usg_diameter_gs_hari: "",
    usg_jumlah_bayi: "",
    usg_crl_cm: "",
    usg_crl_minggu: "",
    usg_crl_hari: "",
    usg_letak_produk_kehamilan: "",
    usg_pulsasi_jantung: "",
    usg_kecurigaan_temuan_abnormal: "Tidak",
    usg_keterangan_temuan_abnormal: "",
    // Lab & Jiwa
    tanggal_lab_jiwa: "",
    lab_hemoglobin_hasil_jiwa: "",
    lab_hemoglobin_rencana_tindak_lanjut_jiwa: "",
    lab_golongan_darah_rhesus_hasil: "",
    lab_golongan_darah_rhesus_rencana_tindak_lanjut: "",
    lab_gula_darah_sewaktu_hasil: "",
    lab_gula_darah_sewaktu_rencana_tindak_lanjut: "",
    lab_hiv_hasil: "NonReaktif",
    lab_hiv_rencana_tindak_lanjut: "",
    lab_sifilis_hasil: "NonReaktif",
    lab_sifilis_rencana_tindak_lanjut: "",
    lab_hepatitis_b_hasil: "NonReaktif",
    lab_hepatitis_b_rencana_tindak_lanjut: "",
    tanggal_skrining_jiwa: "",
    skrining_jiwa_hasil: "",
    skrining_jiwa_tindak_lanjut: "",
    skrining_jiwa_perlu_rujukan: "Tidak",
    kesimpulan: "",
    rekomendasi: "",
  });

  // ── Fetch data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (!kehamilanList || kehamilanList.length === 0) {
          setError(
            "Belum ada data kehamilan untuk ibu ini. Silakan tambah data kehamilan terlebih dahulu."
          );
          setLoading(false);
          return;
        }
        const aktif = kehamilanList[0];
        setKehamilan(aktif);

        const res = await getDokterT1CompleteByKehamilanId(aktif.id);
        if (res && res.dokter) {
          setExistingData(res.dokter);
          const d = res.dokter;
          const lab = res.lab_jiwa;
          setForm({
            kehamilan_id: d.kehamilan_id,
            nama_dokter: d.nama_dokter || "",
            tanggal_periksa: d.tanggal_periksa ? d.tanggal_periksa.split("T")[0] : "",
            konsep_anamnesa_pemeriksaan: d.konsep_anamnesa_pemeriksaan || "",
            fisik_konjungtiva: d.fisik_konjungtiva || "Normal",
            fisik_sklera: d.fisik_sklera || "Normal",
            fisik_kulit: d.fisik_kulit || "Normal",
            fisik_leher: d.fisik_leher || "Normal",
            fisik_gigi_mulut: d.fisik_gigi_mulut || "Normal",
            fisik_tht: d.fisik_tht || "Normal",
            fisik_dada_jantung: d.fisik_dada_jantung || "Normal",
            fisik_dada_paru: d.fisik_dada_paru || "Normal",
            fisik_perut: d.fisik_perut || "Normal",
            fisik_tungkai: d.fisik_tungkai || "Normal",
            hpht: d.hpht ? d.hpht.split("T")[0] : "",
            keteraturan_haid: d.keteraturan_haid || "Teratur",
            umur_hamil_hpht_minggu: d.umur_hamil_hpht_minggu?.toString() || "",
            hpl_berdasarkan_hpht: d.hpl_berdasarkan_hpht
              ? d.hpl_berdasarkan_hpht.split("T")[0]
              : "",
            umur_hamil_usg_minggu: d.umur_hamil_usg_minggu?.toString() || "",
            hpl_berdasarkan_usg: d.hpl_berdasarkan_usg
              ? d.hpl_berdasarkan_usg.split("T")[0]
              : "",
            usg_jumlah_gs: d.usg_jumlah_gs || "",
            usg_diameter_gs_cm: d.usg_diameter_gs_cm?.toString() || "",
            usg_diameter_gs_minggu: d.usg_diameter_gs_minggu?.toString() || "",
            usg_diameter_gs_hari: d.usg_diameter_gs_hari?.toString() || "",
            usg_jumlah_bayi: d.usg_jumlah_bayi || "",
            usg_crl_cm: d.usg_crl_cm?.toString() || "",
            usg_crl_minggu: d.usg_crl_minggu?.toString() || "",
            usg_crl_hari: d.usg_crl_hari?.toString() || "",
            usg_letak_produk_kehamilan: d.usg_letak_produk_kehamilan || "",
            usg_pulsasi_jantung: d.usg_pulsasi_jantung || "",
            usg_kecurigaan_temuan_abnormal: d.usg_kecurigaan_temuan_abnormal || "Tidak",
            usg_keterangan_temuan_abnormal: d.usg_keterangan_temuan_abnormal || "",
            tanggal_lab_jiwa: lab?.tanggal_lab ? lab.tanggal_lab.split("T")[0] : "",
            lab_hemoglobin_hasil_jiwa: lab?.lab_hemoglobin_hasil?.toString() || "",
            lab_hemoglobin_rencana_tindak_lanjut_jiwa:
              lab?.lab_hemoglobin_rencana_tindak_lanjut || "",
            lab_golongan_darah_rhesus_hasil: lab?.lab_golongan_darah_rhesus_hasil || "",
            lab_golongan_darah_rhesus_rencana_tindak_lanjut:
              lab?.lab_golongan_darah_rhesus_rencana_tindak_lanjut || "",
            lab_gula_darah_sewaktu_hasil: lab?.lab_gula_darah_sewaktu_hasil?.toString() || "",
            lab_gula_darah_sewaktu_rencana_tindak_lanjut:
              lab?.lab_gula_darah_sewaktu_rencana_tindak_lanjut || "",
            lab_hiv_hasil: lab?.lab_hiv_hasil || "NonReaktif",
            lab_hiv_rencana_tindak_lanjut: lab?.lab_hiv_rencana_tindak_lanjut || "",
            lab_sifilis_hasil: lab?.lab_sifilis_hasil || "NonReaktif",
            lab_sifilis_rencana_tindak_lanjut: lab?.lab_sifilis_rencana_tindak_lanjut || "",
            lab_hepatitis_b_hasil: lab?.lab_hepatitis_b_hasil || "NonReaktif",
            lab_hepatitis_b_rencana_tindak_lanjut:
              lab?.lab_hepatitis_b_rencana_tindak_lanjut || "",
            tanggal_skrining_jiwa: lab?.tanggal_skrining_jiwa
              ? lab.tanggal_skrining_jiwa.split("T")[0]
              : "",
            skrining_jiwa_hasil: lab?.skrining_jiwa_hasil || "",
            skrining_jiwa_tindak_lanjut: lab?.skrining_jiwa_tindak_lanjut || "",
            skrining_jiwa_perlu_rujukan: lab?.skrining_jiwa_perlu_rujukan || "Tidak",
            kesimpulan: lab?.kesimpulan || "",
            rekomendasi: lab?.rekomendasi || "",
          });
        } else {
          // form baru, set kehamilan_id saja
          setForm((prev) => ({ ...prev, kehamilan_id: aktif.id }));
        }
      } catch (err) {
        console.error("Error fetch data:", err);
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Handler ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) {
      alert("Data kehamilan tidak ditemukan.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        kehamilan_id: kehamilan.id,
        umur_hamil_hpht_minggu: form.umur_hamil_hpht_minggu
          ? parseInt(form.umur_hamil_hpht_minggu)
          : null,
        umur_hamil_usg_minggu: form.umur_hamil_usg_minggu
          ? parseInt(form.umur_hamil_usg_minggu)
          : null,
        usg_diameter_gs_cm: form.usg_diameter_gs_cm
          ? parseFloat(form.usg_diameter_gs_cm)
          : null,
        usg_diameter_gs_minggu: form.usg_diameter_gs_minggu
          ? parseInt(form.usg_diameter_gs_minggu)
          : null,
        usg_diameter_gs_hari: form.usg_diameter_gs_hari
          ? parseInt(form.usg_diameter_gs_hari)
          : null,
        usg_crl_cm: form.usg_crl_cm ? parseFloat(form.usg_crl_cm) : null,
        usg_crl_minggu: form.usg_crl_minggu ? parseInt(form.usg_crl_minggu) : null,
        usg_crl_hari: form.usg_crl_hari ? parseInt(form.usg_crl_hari) : null,
        lab_hemoglobin_hasil_jiwa: form.lab_hemoglobin_hasil_jiwa
          ? parseFloat(form.lab_hemoglobin_hasil_jiwa)
          : null,
        lab_gula_darah_sewaktu_hasil: form.lab_gula_darah_sewaktu_hasil
          ? parseInt(form.lab_gula_darah_sewaktu_hasil)
          : null,
      };

      if (existingData) {
        await updateDokterT1Complete(existingData.id, payload);
        alert("Data berhasil diperbarui!");
      } else {
        await createDokterT1Complete(payload);
        alert("Data berhasil disimpan!");
      }
      navigate(`/data-ibu/${id}/pemeriksaan-dokter-t1-complete/detail`);
    } catch (err) {
      console.error("Error saving:", err);
      const errorMsg = err.response?.data?.message || err.message || "Terjadi kesalahan";
      alert("Gagal menyimpan: " + errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading & Error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-indigo-600">
            <Loader2 className="animate-spin" size={40} />
            <p className="text-sm font-medium text-gray-500">Memuat data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 max-w-2xl mx-auto mt-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-red-700 mb-2">Data Kehamilan Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <div className="flex gap-3 justify-center">
              <Link
                to={`/data-ibu/${id}/edit`}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Tambah Data Kehamilan
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

  // ── Render fisik fields ──────────────────────────────────────────────────
  const fisikFields = [
    { name: "fisik_konjungtiva", label: "Konjungtiva" },
    { name: "fisik_sklera", label: "Sklera" },
    { name: "fisik_kulit", label: "Kulit" },
    { name: "fisik_leher", label: "Leher" },
    { name: "fisik_gigi_mulut", label: "Gigi & Mulut" },
    { name: "fisik_tht", label: "THT" },
    { name: "fisik_dada_jantung", label: "Dada / Jantung" },
    { name: "fisik_dada_paru", label: "Dada / Paru" },
    { name: "fisik_perut", label: "Perut" },
    { name: "fisik_tungkai", label: "Tungkai" },
  ];

  // ── Render lab rows ─────────────────────────────────────────────────────
  const labReaktifFields = [
    {
      name: "lab_hiv_hasil",
      label: "HIV",
      rencana: "lab_hiv_rencana_tindak_lanjut",
    },
    {
      name: "lab_sifilis_hasil",
      label: "Sifilis",
      rencana: "lab_sifilis_rencana_tindak_lanjut",
    },
    {
      name: "lab_hepatitis_b_hasil",
      label: "Hepatitis B",
      rencana: "lab_hepatitis_b_rencana_tindak_lanjut",
    },
  ];

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {existingData ? "Edit" : "Tambah"} Pemeriksaan Dokter Trimester 1
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Lengkapi data pemeriksaan fisik, USG, dan laboratorium trimester 1
            </p>
          </div>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { icon: User, label: "Data Dokter", color: "bg-indigo-500" },
            { icon: Activity, label: "Pemeriksaan Fisik", color: "bg-teal-500" },
            { icon: Eye, label: "USG", color: "bg-violet-500" },
            { icon: FlaskConical, label: "Laboratorium", color: "bg-amber-500" },
            { icon: Brain, label: "Skrining Jiwa", color: "bg-rose-500" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div
                className={`${step.color} text-white rounded-full w-7 h-7 flex items-center justify-center`}
              >
                <step.icon size={13} />
              </div>
              <span className="text-xs font-medium text-gray-600 hidden sm:block">
                {step.label}
              </span>
              {i < 4 && <div className="w-4 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ══ SEKSI 1: Data Dokter ══ */}
          <Section icon={User} title="Data Dokter & Anamnesis" color="indigo">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Nama Dokter">
                <input
                  name="nama_dokter"
                  value={form.nama_dokter}
                  onChange={handleChange}
                  placeholder="dr. Nama Dokter"
                  className={inputCls}
                />
              </Field>
              <Field label="Tanggal Periksa">
                <input
                  type="date"
                  name="tanggal_periksa"
                  value={form.tanggal_periksa}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
              <Field label="Konsep Anamnesa" colSpan="sm:col-span-2 md:col-span-1">
                <textarea
                  name="konsep_anamnesa_pemeriksaan"
                  value={form.konsep_anamnesa_pemeriksaan}
                  onChange={handleChange}
                  placeholder="Tulis anamnesa pemeriksaan..."
                  className={inputCls}
                  rows={3}
                />
              </Field>
            </div>
          </Section>

          {/* ══ SEKSI 2: Pemeriksaan Fisik ══ */}
          <Section icon={Activity} title="Pemeriksaan Fisik" color="teal">
            {/* Summary badge sebelum expand */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2 font-medium">Ringkasan Status</p>
              <div className="flex flex-wrap gap-2">
                {fisikFields.map((f) => (
                  <span key={f.name} className="text-xs text-gray-600">
                    <span className="font-medium">{f.label}:</span>{" "}
                    {form[f.name] === "Normal" ? (
                      <span className="text-emerald-600 font-semibold">✓</span>
                    ) : (
                      <span className="text-red-500 font-semibold">!</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {fisikFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={`${selectCls} ${
                      form[field.name] === "Abnormal"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                  </select>
                </div>
              ))}
            </div>
          </Section>

          {/* ══ SEKSI 3: USG ══ */}
          <Section icon={Eye} title="USG Trimester 1" color="violet">
            {/* Sub-grup: Berdasarkan HPHT */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
                Berdasarkan HPHT
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="HPHT">
                  <input
                    type="date"
                    name="hpht"
                    value={form.hpht}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
                <Field label="Keteraturan Haid">
                  <select
                    name="keteraturan_haid"
                    value={form.keteraturan_haid}
                    onChange={handleChange}
                    className={selectCls}
                  >
                    <option value="Teratur">Teratur</option>
                    <option value="Tidak Teratur">Tidak Teratur</option>
                  </select>
                </Field>
                <Field label="UK HPHT (minggu)">
                  <input
                    type="number"
                    name="umur_hamil_hpht_minggu"
                    value={form.umur_hamil_hpht_minggu}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
                <Field label="HPL (HPHT)">
                  <input
                    type="date"
                    name="hpl_berdasarkan_hpht"
                    value={form.hpl_berdasarkan_hpht}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            {/* Sub-grup: Berdasarkan USG */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
                Berdasarkan USG
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="UK USG (minggu)">
                  <input
                    type="number"
                    name="umur_hamil_usg_minggu"
                    value={form.umur_hamil_usg_minggu}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
                <Field label="HPL (USG)">
                  <input
                    type="date"
                    name="hpl_berdasarkan_usg"
                    value={form.hpl_berdasarkan_usg}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            {/* Sub-grup: Gestational Sac */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
                Gestational Sac (GS)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Jumlah GS">
                  <input
                    name="usg_jumlah_gs"
                    value={form.usg_jumlah_gs}
                    onChange={handleChange}
                    placeholder="1"
                    className={inputCls}
                  />
                </Field>
                <Field label="Diameter GS (cm)">
                  <input
                    type="number"
                    step="0.1"
                    name="usg_diameter_gs_cm"
                    value={form.usg_diameter_gs_cm}
                    onChange={handleChange}
                    placeholder="0.0"
                    className={inputCls}
                  />
                </Field>
                <Field label="Diameter GS (minggu)">
                  <input
                    type="number"
                    name="usg_diameter_gs_minggu"
                    value={form.usg_diameter_gs_minggu}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
                <Field label="Diameter GS (hari)">
                  <input
                    type="number"
                    name="usg_diameter_gs_hari"
                    value={form.usg_diameter_gs_hari}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            {/* Sub-grup: CRL */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
                Crown-Rump Length (CRL)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Jumlah Bayi">
                  <input
                    name="usg_jumlah_bayi"
                    value={form.usg_jumlah_bayi}
                    onChange={handleChange}
                    placeholder="1"
                    className={inputCls}
                  />
                </Field>
                <Field label="CRL (cm)">
                  <input
                    type="number"
                    step="0.1"
                    name="usg_crl_cm"
                    value={form.usg_crl_cm}
                    onChange={handleChange}
                    placeholder="0.0"
                    className={inputCls}
                  />
                </Field>
                <Field label="CRL (minggu)">
                  <input
                    type="number"
                    name="usg_crl_minggu"
                    value={form.usg_crl_minggu}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
                <Field label="CRL (hari)">
                  <input
                    type="number"
                    name="usg_crl_hari"
                    value={form.usg_crl_hari}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            {/* Sub-grup: Temuan Lainnya */}
            <div>
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
                Temuan Lainnya
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Letak Produk Kehamilan">
                  <input
                    name="usg_letak_produk_kehamilan"
                    value={form.usg_letak_produk_kehamilan}
                    onChange={handleChange}
                    placeholder="Intrauterin"
                    className={inputCls}
                  />
                </Field>
                <Field label="Pulsasi Jantung">
                  <input
                    name="usg_pulsasi_jantung"
                    value={form.usg_pulsasi_jantung}
                    onChange={handleChange}
                    placeholder="Ada / Tidak"
                    className={inputCls}
                  />
                </Field>
                <Field label="Kecurigaan Abnormal">
                  <select
                    name="usg_kecurigaan_temuan_abnormal"
                    value={form.usg_kecurigaan_temuan_abnormal}
                    onChange={handleChange}
                    className={`${selectCls} ${
                      form.usg_kecurigaan_temuan_abnormal === "Ya"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : ""
                    }`}
                  >
                    <option value="Tidak">Tidak</option>
                    <option value="Ya">Ya</option>
                  </select>
                </Field>
                {form.usg_kecurigaan_temuan_abnormal === "Ya" && (
                  <Field label="Keterangan Abnormal">
                    <input
                      name="usg_keterangan_temuan_abnormal"
                      value={form.usg_keterangan_temuan_abnormal}
                      onChange={handleChange}
                      placeholder="Jelaskan temuan..."
                      className={`${inputCls} border-red-200`}
                    />
                  </Field>
                )}
              </div>
            </div>
          </Section>

          {/* ══ SEKSI 4: Laboratorium ══ */}
          <Section icon={FlaskConical} title="Pemeriksaan Laboratorium" color="amber">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Tanggal Lab">
                <input
                  type="date"
                  name="tanggal_lab_jiwa"
                  value={form.tanggal_lab_jiwa}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Tabel lab: Hemoglobin, Gula Darah, Golongan Darah */}
            <div className="rounded-xl border border-amber-100 overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">
                      Pemeriksaan
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">
                      Hasil
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">
                      Rencana Tindak Lanjut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Hemoglobin</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          name="lab_hemoglobin_hasil_jiwa"
                          value={form.lab_hemoglobin_hasil_jiwa}
                          onChange={handleChange}
                          placeholder="0.0"
                          className={inputCls}
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">g/dL</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        name="lab_hemoglobin_rencana_tindak_lanjut_jiwa"
                        value={form.lab_hemoglobin_rencana_tindak_lanjut_jiwa}
                        onChange={handleChange}
                        placeholder="Rencana..."
                        className={inputCls}
                      />
                    </td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">Gula Darah Sewaktu</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          name="lab_gula_darah_sewaktu_hasil"
                          value={form.lab_gula_darah_sewaktu_hasil}
                          onChange={handleChange}
                          placeholder="0"
                          className={inputCls}
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">mg/dL</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        name="lab_gula_darah_sewaktu_rencana_tindak_lanjut"
                        value={form.lab_gula_darah_sewaktu_rencana_tindak_lanjut}
                        onChange={handleChange}
                        placeholder="Rencana..."
                        className={inputCls}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Golongan Darah & Rhesus
                    </td>
                    <td className="px-4 py-3">
                      <input
                        name="lab_golongan_darah_rhesus_hasil"
                        value={form.lab_golongan_darah_rhesus_hasil}
                        onChange={handleChange}
                        placeholder="A+ / B- / dll"
                        className={inputCls}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        name="lab_golongan_darah_rhesus_rencana_tindak_lanjut"
                        value={form.lab_golongan_darah_rhesus_rencana_tindak_lanjut}
                        onChange={handleChange}
                        placeholder="Rencana..."
                        className={inputCls}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabel lab: HIV, Sifilis, Hepatitis B */}
            <div className="rounded-xl border border-amber-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">
                      Pemeriksaan
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">
                      Hasil
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">
                      Rencana Tindak Lanjut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {labReaktifFields.map((lf, idx) => (
                    <tr key={lf.name} className={idx % 2 === 1 ? "bg-gray-50/50" : ""}>
                      <td className="px-4 py-3 font-medium text-gray-700">{lf.label}</td>
                      <td className="px-4 py-3">
                        <select
                          name={lf.name}
                          value={form[lf.name]}
                          onChange={handleChange}
                          className={`${selectCls} ${
                            form[lf.name] === "Reaktif"
                              ? "border-red-300 bg-red-50 text-red-700"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <option value="NonReaktif">Non Reaktif</option>
                          <option value="Reaktif">Reaktif</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name={lf.rencana}
                          value={form[lf.rencana]}
                          onChange={handleChange}
                          placeholder="Rencana..."
                          className={inputCls}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ══ SEKSI 5: Skrining Jiwa & Kesimpulan ══ */}
          <Section icon={Brain} title="Skrining Jiwa & Kesimpulan" color="rose">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Tanggal Skrining Jiwa">
                <input
                  type="date"
                  name="tanggal_skrining_jiwa"
                  value={form.tanggal_skrining_jiwa}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
              <Field label="Hasil Skrining Jiwa">
                <input
                  name="skrining_jiwa_hasil"
                  value={form.skrining_jiwa_hasil}
                  onChange={handleChange}
                  placeholder="Tuliskan hasil skrining..."
                  className={inputCls}
                />
              </Field>
              <Field label="Tindak Lanjut Jiwa">
                <input
                  name="skrining_jiwa_tindak_lanjut"
                  value={form.skrining_jiwa_tindak_lanjut}
                  onChange={handleChange}
                  placeholder="Tindak lanjut..."
                  className={inputCls}
                />
              </Field>
              <Field label="Perlu Rujukan Jiwa">
                <select
                  name="skrining_jiwa_perlu_rujukan"
                  value={form.skrining_jiwa_perlu_rujukan}
                  onChange={handleChange}
                  className={`${selectCls} ${
                    form.skrining_jiwa_perlu_rujukan === "Ya"
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <option value="Tidak">Tidak</option>
                  <option value="Ya">Ya</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kesimpulan">
                <textarea
                  name="kesimpulan"
                  value={form.kesimpulan}
                  onChange={handleChange}
                  placeholder="Kesimpulan pemeriksaan..."
                  className={inputCls}
                  rows={3}
                />
              </Field>
              <Field label="Rekomendasi">
                <textarea
                  name="rekomendasi"
                  value={form.rekomendasi}
                  onChange={handleChange}
                  placeholder="Rekomendasi tindak lanjut..."
                  className={inputCls}
                  rows={3}
                />
              </Field>
            </div>
          </Section>

          {/* ── Tombol simpan ── */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Menyimpan..." : existingData ? "Simpan Perubahan" : "Simpan Semua Data"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
