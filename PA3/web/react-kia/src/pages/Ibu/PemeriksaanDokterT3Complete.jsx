// src/pages/Ibu/PemeriksaanDokterT3Complete.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getCurrentUser } from "../../services/auth";
import {
  getDokterT3CompleteByKehamilanId,
  createDokterT3Complete,
  updateDokterT3Complete,
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
  ChevronRight,
  ChevronLeft,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────
   Helper Components
   ──────────────────────────────────────────────────────────────────────── */

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

function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 font-medium mt-0.5">{message}</p>;
}

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white transition";
const selectCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white transition";

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

/* ────────────────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────────────────── */

export default function PemeriksaanDokterT3Complete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [kehamilan, setKehamilan] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const stepParam = new URLSearchParams(location.search).get("step");
    const step = parseInt(stepParam, 10);
    if (!Number.isNaN(step) && step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, [location.search]);

  // State untuk gambar USG
  const [usgImageFile, setUsgImageFile] = useState(null);
  const [usgImagePreview, setUsgImagePreview] = useState("");

  /* ── Form state (field sesuai DB schema) ───────────────────────────── */
  const [form, setForm] = useState({
    // === pemeriksaan_dokter_trimester_3 ===
    kehamilan_id: "",
    nama_dokter: "",
    tanggal_periksa: "",
    konsep_anamnesa_pemeriksaan: "",
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
    usg_trimester3_dilakukan: "Ya",
    uk_berdasarkan_usg_trimester1_minggu: "",
    uk_berdasarkan_hpht_minggu: "",
    uk_berdasarkan_biometri_usg_trimester3_minggu: "",
    selisih_uk3_minggu_atau_lebih: "Tidak",
    usg_jumlah_bayi: "",
    usg_letak_bayi: "",
    usg_presentasi_bayi: "",
    usg_keadaan_bayi: "",
    usg_djj_nilai: "",
    usg_djj_status: "Normal",
    usg_lokasi_plasenta: "",
    usg_cairan_ketuban_sdp_cm: "",
    usg_cairan_ketuban_status: "Normal",
    biometri_bpd_cm: "",
    biometri_bpd_minggu: "",
    biometri_hc_cm: "",
    biometri_hc_minggu: "",
    biometri_ac_cm: "",
    biometri_ac_minggu: "",
    biometri_fl_cm: "",
    biometri_fl_minggu: "",
    biometri_efwtbj_gram: "",
    biometri_efwtbj_minggu: "",
    usg_kecurigaan_temuan_abnormal: "Tidak",
    usg_keterangan_temuan_abnormal: "",
    // Tambahan gambar USG (base64)
    gambar_usg: "",

    // === pemeriksaan_lanjutan_trimester_3 ===
    hasil_usg_catatan: "",
    tanggal_lab: "",
    lab_hemoglobin_hasil: "",
    lab_hemoglobin_rencana: "",
    lab_protein_urin_hasil: "",
    lab_protein_urin_rencana: "",
    lab_urin_reduksi_hasil: "",
    lab_urin_reduksi_rencana: "",
    tanggal_skrining_jiwa: "",
    skrining_jiwa_hasil: "",
    skrining_jiwa_tindak_lanjut: "",
    skrining_jiwa_perlu_rujukan: "Tidak",
    rencana_konsultasi_gizi: false,
    rencana_konsultasi_kebidanan: false,
    rencana_konsultasi_anak: false,
    rencana_konsultasi_penyakit_dalam: false,
    rencana_konsultasi_neurologi: false,
    rencana_konsultasi_tht: false,
    rencana_konsultasi_psikiatri: false,
    rencana_konsultasi_lain_lain: "",
    rencana_proses_melahirkan: "",
    rencana_kontrasepsi_akdr: false,
    rencana_kontrasepsi_pil: false,
    rencana_kontrasepsi_suntik: false,
    rencana_kontrasepsi_steril: false,
    rencana_kontrasepsi_mal: false,
    rencana_kontrasepsi_implan: false,
    rencana_kontrasepsi_belum_memilih: false,
    kebutuhan_konseling: "Tidak",
    penjelasan: "",
    kesimpulan_rekomendasi_tempat_melahirkan: "",

    // === pemeriksaan_laboratorium_jiwa (trimester=3) ===
    tanggal_lab_jiwa: "",
    lab_hemoglobin_hasil_jiwa: "",
    lab_hemoglobin_rencana_tindak_lanjut_jiwa: "",
    lab_golongan_darah_rhesus_hasil: "",
    lab_golongan_darah_rhesus_rencana: "",
    lab_gula_darah_sewaktu_hasil: "",
    lab_gula_darah_sewaktu_rencana: "",
    lab_hiv_hasil: "NonReaktif",
    lab_hiv_rencana: "",
    lab_sifilis_hasil: "NonReaktif",
    lab_sifilis_rencana: "",
    lab_hepatitis_b_hasil: "NonReaktif",
    lab_hepatitis_b_rencana: "",
    tanggal_skrining_jiwa_tr: "",
    skrining_jiwa_hasil_tr: "",
    skrining_jiwa_tindak_lanjut_tr: "",
    skrining_jiwa_perlu_rujukan_tr: "Tidak",
    kesimpulan_tr: "",
    rekomendasi_tr: "",
  });

  /* ── Fetch data ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = getCurrentUser();
        const dokterName = currentUser?.nama || currentUser?.name || "";

        const kehamilanList = await getKehamilanByIbuId(id);
        if (!kehamilanList || kehamilanList.length === 0) {
          setError("Belum ada data kehamilan untuk ibu ini.");
          setLoading(false);
          return;
        }
        const aktif = kehamilanList[0];
        setKehamilan(aktif);

        const res = await getDokterT3CompleteByKehamilanId(aktif.id);
        if (res && res.dokter) {
          setExistingData(res.dokter);
          const d = res.dokter;           // pemeriksaan_dokter_trimester_3
          const lanjutan = res.lanjutan;  // pemeriksaan_lanjutan_trimester_3
          const lab = res.lab_jiwa;       // pemeriksaan_laboratorium_jiwa (trimester=3)

          setForm(prev => ({
            ...prev,
            kehamilan_id: d.kehamilan_id,
            nama_dokter: d.nama_dokter || dokterName || "",
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
            usg_trimester3_dilakukan: d.usg_trimester3_dilakukan || "Ya",
            uk_berdasarkan_usg_trimester1_minggu: d.uk_berdasarkan_usg_trimester1_minggu?.toString() || "",
            uk_berdasarkan_hpht_minggu: d.uk_berdasarkan_hpht_minggu?.toString() || "",
            uk_berdasarkan_biometri_usg_trimester3_minggu: d.uk_berdasarkan_biometri_usg_trimester3_minggu?.toString() || "",
            selisih_uk3_minggu_atau_lebih: d.selisih_uk3_minggu_atau_lebih || "Tidak",
            usg_jumlah_bayi: d.usg_jumlah_bayi || "",
            usg_letak_bayi: d.usg_letak_bayi || "",
            usg_presentasi_bayi: d.usg_presentasi_bayi || "",
            usg_keadaan_bayi: d.usg_keadaan_bayi || "",
            usgdj_nilai: d.usg_djj_nilai?.toString() || "",
            usgdjj_status: d.usg_djj_status || "Normal",
            usg_lokasi_plasenta: d.usg_lokasi_plasenta || "",
            usg_cairan_ketuban_sdp_cm: d.usg_cairan_ketuban_sdp_cm?.toString() || "",
            usg_cairan_ketuban_status: d.usg_cairan_ketuban_status || "Normal",
            biometri_bpd_cm: d.biometri_bpd_cm?.toString() || "",
            biometri_bpd_minggu: d.biometri_bpd_minggu?.toString() || "",
            biometri_hc_cm: d.biometri_hc_cm?.toString() || "",
            biometri_hc_minggu: d.biometri_hc_minggu?.toString() || "",
            biometri_ac_cm: d.biometri_ac_cm?.toString() || "",
            biometri_ac_minggu: d.biometri_ac_minggu?.toString() || "",
            biometri_fl_cm: d.biometri_fl_cm?.toString() || "",
            biometri_fl_minggu: d.biometri_fl_minggu?.toString() || "",
            biometri_efwtbj_gram: d.biometri_efwtbj_gram?.toString() || "",
            biometri_efwtbj_minggu: d.biometri_efwtbj_minggu?.toString() || "",
            usg_kecurigaan_temuan_abnormal: d.usg_kecurigaan_temuan_abnormal || "Tidak",
            usg_keterangan_temuan_abnormal: d.usg_keterangan_temuan_abnormal || "",
            usg_image: d.usg_image || "",
            // Lanjutan T3
            hasil_usg_catatan: lanjutan?.hasil_usg_catatan || d.hasil_usg_catatan || "",
            tanggal_lab: lanjutan?.tanggal_lab ? lanjutan.tanggal_lab.split("T")[0] : (d.tanggal_lab ? d.tanggal_lab.split("T")[0] : ""),
            lab_hemoglobin_hasil: lanjutan?.lab_hemoglobin_hasil?.toString() || d.lab_hemoglobin_hasil?.toString() || "",
            lab_hemoglobin_rencana: lanjutan?.lab_hemoglobin_rencana || d.lab_hemoglobin_rencana || "",
            lab_protein_urin_hasil: lanjutan?.lab_protein_urin_hasil?.toString() || d.lab_protein_urin_hasil?.toString() || "",
            lab_protein_urin_rencana: lanjutan?.lab_protein_urin_rencana || d.lab_protein_urin_rencana || "",
            lab_urin_reduksi_hasil: lanjutan?.lab_urin_reduksi_hasil || d.lab_urin_reduksi_hasil || "",
            lab_urin_reduksi_rencana: lanjutan?.lab_urin_reduksi_rencana || d.lab_urin_reduksi_rencana || "",
            tanggal_skrining_jiwa: d.tanggal_skrining_jiwa ? d.tanggal_skrining_jiwa.split("T")[0] : "",
            skrining_jiwa_hasil: d.skrining_jiwa_hasil || "",
            skrining_jiwa_tindak_lanjut: d.skrining_jiwa_tindak_lanjut || "",
            skrining_jiwa_perlu_rujukan: d.skrining_jiwa_perlu_rujukan || "Tidak",
            rencana_konsultasi_gizi: lanjutan?.rencana_konsultasi_gizi || d.rencana_konsultasi_gizi || false,
            rencana_konsultasi_kebidanan: lanjutan?.rencana_konsultasi_kebidanan || d.rencana_konsultasi_kebidanan || false,
            rencana_konsultasi_anak: lanjutan?.rencana_konsultasi_anak || d.rencana_konsultasi_anak || false,
            rencana_konsultasi_penyakit_dalam: lanjutan?.rencana_konsultasi_penyakit_dalam || d.rencana_konsultasi_penyakit_dalam || false,
            rencana_konsultasi_neurologi: lanjutan?.rencana_konsultasi_neurologi || d.rencana_konsultasi_neurologi || false,
            rencana_konsultasi_tht: lanjutan?.rencana_konsultasi_tht || d.rencana_konsultasi_tht || false,
            rencana_konsultasi_psikiatri: lanjutan?.rencana_konsultasi_psikiatri || d.rencana_konsultasi_psikiatri || false,
            rencana_konsultasi_lain_lain: lanjutan?.rencana_konsultasi_lain_lain || d.rencana_konsultasi_lain_lain || "",
            rencana_proses_melahirkan: lanjutan?.rencana_proses_melahirkan || d.rencana_proses_melahirkan || "",
            rencana_kontrasepsi_akdr: lanjutan?.rencana_kontrasepsi_akdr || d.rencana_kontrasepsi_akdr || false,
            rencana_kontrasepsi_pil: lanjutan?.rencana_kontrasepsi_pil || d.rencana_kontrasepsi_pil || false,
            rencana_kontrasepsi_suntik: lanjutan?.rencana_kontrasepsi_suntik || d.rencana_kontrasepsi_suntik || false,
            rencana_kontrasepsi_steril: lanjutan?.rencana_kontrasepsi_steril || d.rencana_kontrasepsi_steril || false,
            rencana_kontrasepsi_mal: lanjutan?.rencana_kontrasepsi_mal || d.rencana_kontrasepsi_mal || false,
            rencana_kontrasepsi_implan: lanjutan?.rencana_kontrasepsi_implan || d.rencana_kontrasepsi_implan || false,
            rencana_kontrasepsi_belum_memilih: lanjutan?.rencana_kontrasepsi_belum_memilih || d.rencana_kontrasepsi_belum_memilih || false,
            kebutuhan_konseling: lanjutan?.kebutuhan_konseling || d.kebutuhan_konseling || "Tidak",
            penjelasan: lanjutan?.penjelasan || d.penjelasan || "",
            kesimpulan_rekomendasi_tempat_melahirkan: lanjutan?.kesimpulan_rekomendasi_tempat_melahirkan || d.kesimpulan_rekomendasi_tempat_melahirkan || "",
            // Lab Jiwa T3
            tanggal_lab_jiwa: lab?.tanggal_lab ? lab.tanggal_lab.split("T")[0] : "",
            lab_hemoglobin_hasil_jiwa: lab?.lab_hemoglobin_hasil?.toString() || "",
            lab_hemoglobin_rencana_tindak_lanjut_jiwa: lab?.lab_hemoglobin_rencana_tindak_lanjut || "",
            lab_golongan_darah_rhesus_hasil: lab?.lab_golongan_darah_rhesus_hasil || "",
            lab_golongan_darah_rhesus_rencana: lab?.lab_golongan_darah_rhesus_rencana || "",
            lab_gula_darah_sewaktu_hasil: lab?.lab_gula_darah_sewaktu_hasil?.toString() || "",
            lab_gula_darah_sewaktu_rencana: lab?.lab_gula_darah_sewaktu_rencana || "",
            lab_hiv_hasil: lab?.lab_hiv_hasil || "NonReaktif",
            lab_hiv_rencana: lab?.lab_hiv_rencana || "",
            lab_sifilis_hasil: lab?.lab_sifilis_hasil || "NonReaktif",
            lab_sifilis_rencana: lab?.lab_sifilis_rencana || "",
            lab_hepatitis_b_hasil: lab?.lab_hepatitis_b_hasil || "NonReaktif",
            lab_hepatitis_b_rencana: lab?.lab_hepatitis_b_rencana || "",
            tanggal_skrining_jiwa_tr: lab?.tanggal_skrining_jiwa ? lab.tanggal_skrining_jiwa.split("T")[0] : "",
            skrining_jiwa_hasil_tr: lab?.skrining_jiwa_hasil || "",
            skrining_jiwa_tindak_lanjut_tr: lab?.skrining_jiwa_tindak_lanjut || "",
            skrining_jiwa_perlu_rujukan_tr: lab?.skrining_jiwa_perlu_rujukan || "Tidak",
            kesimpulan_tr: lab?.kesimpulan || "",
            rekomendasi_tr: lab?.rekomendasi || "",
          }));

          // Jika ada gambar USG, tampilkan preview
          if (d.usg_image && d.usg_image.startsWith("data:image")) {
            setUsgImagePreview(d.usg_image);
          }
        } else {
          setForm(prev => ({
            ...prev,
            kehamilan_id: aktif.id,
            nama_dokter: dokterName || "",
          }));
        }
      } catch (err) {
        console.error("Error fetch data:", err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /* ── Handler ────────────────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  // Upload gambar USG
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUsgImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUsgImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUsgImageFile(null);
    setUsgImagePreview("");
    setForm(prev => ({ ...prev, usg_image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Validasi ──────────────────────────────────────────────────────── */
  const validateStep1 = () => {
    const errors = {};
    if (!form.tanggal_periksa?.trim()) errors.tanggal_periksa = "Tanggal periksa harus diisi";
    if (!form.konsep_anamnesa_pemeriksaan?.trim()) errors.konsep_anamnesa_pemeriksaan = "Anamnesa harus diisi";
    ["fisik_konjungtiva","fisik_sklera","fisik_kulit","fisik_leher","fisik_gigi_mulut","fisik_tht","fisik_dada_jantung","fisik_dada_paru","fisik_perut","fisik_tungkai"]
      .forEach(f => { if (!form[f]?.trim()) errors[f] = "Harus diisi"; });
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (form.usg_trimester3_dilakukan === "Ya") {
      if (!form.uk_berdasarkan_hpht_minggu?.toString().trim()) errors.uk_berdasarkan_hpht_minggu = "UK HPHT harus diisi";
      if (!form.usg_jumlah_bayi?.toString().trim()) errors.usg_jumlah_bayi = "Jumlah bayi harus diisi";
      if (!form.usg_letak_bayi?.trim()) errors.usg_letak_bayi = "Letak bayi harus diisi";
      if (!form.usg_presentasi_bayi?.trim()) errors.usg_presentasi_bayi = "Presentasi bayi harus diisi";
      if (!form.usg_keadaan_bayi?.trim()) errors.usg_keadaan_bayi = "Keadaan bayi harus diisi";
      if (!form.usgdj_nilai?.toString().trim()) errors.usgdj_nilai = "DJJ harus diisi";
      if (!form.usg_lokasi_plasenta?.trim()) errors.usg_lokasi_plasenta = "Lokasi plasenta harus diisi";
      if (!form.usg_cairan_ketuban_sdp_cm?.toString().trim()) errors.usg_cairan_ketuban_sdp_cm = "SDP harus diisi";
      if (!form.biometri_bpd_cm?.toString().trim()) errors.biometri_bpd_cm = "BPD harus diisi";
      if (!form.biometri_hc_cm?.toString().trim()) errors.biometri_hc_cm = "HC harus diisi";
      if (!form.biometri_ac_cm?.toString().trim()) errors.biometri_ac_cm = "AC harus diisi";
      if (!form.biometri_fl_cm?.toString().trim()) errors.biometri_fl_cm = "FL harus diisi";
      if (!form.biometri_efwtbj_gram?.toString().trim()) errors.biometri_efwtbj_gram = "EFW/TBJ harus diisi";
      if (!form.usg_kecurigaan_temuan_abnormal?.trim()) errors.usg_kecurigaan_temuan_abnormal = "Status temuan harus diisi";
      if (form.usg_kecurigaan_temuan_abnormal === "Ya" && !form.usg_keterangan_temuan_abnormal?.trim())
        errors.usg_keterangan_temuan_abnormal = "Keterangan harus diisi";
    }
    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    // Lab Lanjutan (optional jika tanggal diisi)
    if (form.tanggal_lab?.trim()) {
      if (!form.lab_hemoglobin_hasil?.toString().trim()) errors.lab_hemoglobin_hasil = "Hb harus diisi";
      if (!form.lab_hemoglobin_rencana?.trim()) errors.lab_hemoglobin_rencana = "Rencana Hb harus diisi";
      if (!form.lab_protein_urin_hasil?.toString().trim()) errors.lab_protein_urin_hasil = "Protein urin harus diisi";
      if (!form.lab_protein_urin_rencana?.trim()) errors.lab_protein_urin_rencana = "Rencana protein urin harus diisi";
      if (!form.lab_urin_reduksi_hasil?.trim()) errors.lab_urin_reduksi_hasil = "Urin reduksi harus diisi";
      if (!form.lab_urin_reduksi_rencana?.trim()) errors.lab_urin_reduksi_rencana = "Rencana urin reduksi harus diisi";
    }
    // Lab Jiwa T3 wajib
    if (!form.tanggal_lab_jiwa?.trim()) errors.tanggal_lab_jiwa = "Tanggal lab jiwa harus diisi";
    if (!form.lab_hemoglobin_hasil_jiwa?.toString().trim()) errors.lab_hemoglobin_hasil_jiwa = "Hb (jiwa) harus diisi";
    if (!form.lab_hemoglobin_rencana_tindak_lanjut_jiwa?.trim()) errors.lab_hemoglobin_rencana_tindak_lanjut_jiwa = "Rencana Hb jiwa harus diisi";
    if (!form.lab_gula_darah_sewaktu_hasil?.toString().trim()) errors.lab_gula_darah_sewaktu_hasil = "Gula darah harus diisi";
    if (!form.lab_gula_darah_sewaktu_rencana?.trim()) errors.lab_gula_darah_sewaktu_rencana = "Rencana gula darah harus diisi";
    if (!form.lab_golongan_darah_rhesus_hasil?.trim()) errors.lab_golongan_darah_rhesus_hasil = "Goldar harus diisi";
    if (!form.lab_golongan_darah_rhesus_rencana?.trim()) errors.lab_golongan_darah_rhesus_rencana = "Rencana goldar harus diisi";
    if (!form.lab_hiv_rencana?.trim()) errors.lab_hiv_rencana = "Rencana HIV harus diisi";
    if (!form.lab_sifilis_rencana?.trim()) errors.lab_sifilis_rencana = "Rencana sifilis harus diisi";
    if (!form.lab_hepatitis_b_rencana?.trim()) errors.lab_hepatitis_b_rencana = "Rencana hepatitis B harus diisi";
    return errors;
  };

  const validateStep4 = () => {
    const errors = {};
    if (!form.tanggal_skrining_jiwa?.trim()) errors.tanggal_skrining_jiwa = "Tanggal skrining jiwa harus diisi";
    if (!form.skrining_jiwa_hasil?.trim()) errors.skrining_jiwa_hasil = "Hasil skrining jiwa harus diisi";
    if (!form.skrining_jiwa_tindak_lanjut?.trim()) errors.skrining_jiwa_tindak_lanjut = "Tindak lanjut jiwa harus diisi";
    if (!form.tanggal_skrining_jiwa_tr?.trim()) errors.tanggal_skrining_jiwa_tr = "Tanggal skrining jiwa TR harus diisi";
    if (!form.skrining_jiwa_hasil_tr?.trim()) errors.skrining_jiwa_hasil_tr = "Hasil skrining jiwa TR harus diisi";
    if (!form.skrining_jiwa_tindak_lanjut_tr?.trim()) errors.skrining_jiwa_tindak_lanjut_tr = "Tindak lanjut jiwa TR harus diisi";
    if (!form.kesimpulan_tr?.trim()) errors.kesimpulan_tr = "Kesimpulan TR harus diisi";
    if (!form.rekomendasi_tr?.trim()) errors.rekomendasi_tr = "Rekomendasi TR harus diisi";
    if (!form.rencana_proses_melahirkan?.trim()) errors.rencana_proses_melahirkan = "Rencana melahirkan harus diisi";
    if (!form.kesimpulan_rekomendasi_tempat_melahirkan?.trim()) errors.kesimpulan_rekomendasi_tempat_melahirkan = "Rekomendasi tempat harus diisi";
    if (!form.penjelasan?.trim()) errors.penjelasan = "Penjelasan harus diisi";
    return errors;
  };

  const handleNextStep = () => {
    let errors = {};
    if (currentStep === 1) errors = validateStep1();
    else if (currentStep === 2) errors = validateStep2();
    else if (currentStep === 3) errors = validateStep3();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi data wajib sebelum melanjutkan.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }
    setCurrentStep(currentStep + 1);
    setValidationErrors({});
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
      window.scrollTo(0, 0);
    }
  };

  /* ── Submit ────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateStep4();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi semua data wajib sebelum menyimpan.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }
    if (!kehamilan) {
      Swal.fire({
        icon: 'error',
        title: 'Data Tidak Ditemukan',
        text: 'Data kehamilan tidak ditemukan.',
      });
      return;
    }
    setSaving(true);

    try {
      // Proses gambar USG jika ada
      let imageBase64 = form.usg_image;
      if (usgImageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(usgImageFile);
        });
      }

      // Destructure form untuk menghapus field redundan sesuai README_PERBAIKAN_TRIMESTER.md
      const {
        tanggal_periksa,
        tanggal_lab,
        tanggal_skrining_jiwa,
        tanggal_lab_jiwa,
        tanggal_skrining_jiwa_tr,
        ...formClean
      } = form;

      const payload = {
        ...formClean,
        kehamilan_id: kehamilan.id,
        gambar_usg: imageBase64,
        // === pemeriksaan_dokter_trimester_3 ===
        nama_dokter: form.nama_dokter,
        konsep_anamnesa_pemeriksaan: form.konsep_anamnesa_pemeriksaan,
        fisik_konjungtiva: form.fisik_konjungtiva,
        fisik_sklera: form.fisik_sklera,
        fisik_kulit: form.fisik_kulit,
        fisik_leher: form.fisik_leher,
        fisik_gigi_mulut: form.fisik_gigi_mulut,
        fisik_tht: form.fisik_tht,
        fisik_dada_jantung: form.fisik_dada_jantung,
        fisik_dada_paru: form.fisik_dada_paru,
        fisik_perut: form.fisik_perut,
        fisik_tungkai: form.fisik_tungkai,
        usg_trimester3_dilakukan: form.usg_trimester3_dilakukan,
        uk_berdasarkan_usg_trimester1_minggu: form.uk_berdasarkan_usg_trimester1_minggu ? parseInt(form.uk_berdasarkan_usg_trimester1_minggu) : null,
        uk_berdasarkan_hpht_minggu: form.uk_berdasarkan_hpht_minggu ? parseInt(form.uk_berdasarkan_hpht_minggu) : null,
        uk_berdasarkan_biometri_usg_trimester3_minggu: form.uk_berdasarkan_biometri_usg_trimester3_minggu ? parseInt(form.uk_berdasarkan_biometri_usg_trimester3_minggu) : null,
        selisih_uk3_minggu_atau_lebih: form.selisih_uk3_minggu_atau_lebih,
        usg_jumlah_bayi: form.usg_jumlah_bayi,
        usg_letak_bayi: form.usg_letak_bayi,
        usg_presentasi_bayi: form.usg_presentasi_bayi,
        usg_keadaan_bayi: form.usg_keadaan_bayi,
        usgdj_nilai: form.usg_djj_nilai ? parseInt(form.usg_djj_nilai) : null,
        usgdjj_status: form.usg_djj_status,
        usg_lokasi_plasenta: form.usg_lokasi_plasenta,
        usg_cairan_ketuban_sdp_cm: form.usg_cairan_ketuban_sdp_cm ? parseFloat(form.usg_cairan_ketuban_sdp_cm) : null,
        usg_cairan_ketuban_status: form.usg_cairan_ketuban_status,
        biometri_bpd_cm: form.biometri_bpd_cm ? parseFloat(form.biometri_bpd_cm) : null,
        biometri_bpd_minggu: form.biometri_bpd_minggu ? parseInt(form.biometri_bpd_minggu) : null,
        biometri_hc_cm: form.biometri_hc_cm ? parseFloat(form.biometri_hc_cm) : null,
        biometri_hc_minggu: form.biometri_hc_minggu ? parseInt(form.biometri_hc_minggu) : null,
        biometri_ac_cm: form.biometri_ac_cm ? parseFloat(form.biometri_ac_cm) : null,
        biometri_ac_minggu: form.biometri_ac_minggu ? parseInt(form.biometri_ac_minggu) : null,
        biometri_fl_cm: form.biometri_fl_cm ? parseFloat(form.biometri_fl_cm) : null,
        biometri_fl_minggu: form.biometri_fl_minggu ? parseInt(form.biometri_fl_minggu) : null,
        biometri_efwtbj_gram: form.biometri_efwtbj_gram ? parseInt(form.biometri_efwtbj_gram) : null,
        biometri_efwtbj_minggu: form.biometri_efwtbj_minggu ? parseInt(form.biometri_efwtbj_minggu) : null,
        usg_kecurigaan_temuan_abnormal: form.usg_kecurigaan_temuan_abnormal,
        usg_keterangan_temuan_abnormal: form.usg_keterangan_temuan_abnormal,
        gambar_usg: imageBase64,
        // Skrining jiwa di tabel dokter T3
        tanggal_skrining_jiwa: form.tanggal_skrining_jiwa,
        skrining_jiwa_hasil: form.skrining_jiwa_hasil,
        skrining_jiwa_tindak_lanjut: form.skrining_jiwa_tindak_lanjut,
        skrining_jiwa_perlu_rujukan: form.skrining_jiwa_perlu_rujukan,

        // === pemeriksaan_lanjutan_trimester_3 ===
        hasil_usg_catatan: form.hasil_usg_catatan,
        tanggal_lab: form.tanggal_lab,
        lab_hemoglobin_hasil: form.lab_hemoglobin_hasil ? parseFloat(form.lab_hemoglobin_hasil) : null,
        lab_hemoglobin_rencana: form.lab_hemoglobin_rencana,
        lab_protein_urin_hasil: form.lab_protein_urin_hasil ? parseInt(form.lab_protein_urin_hasil) : null,
        lab_protein_urin_rencana: form.lab_protein_urin_rencana,
        lab_urin_reduksi_hasil: form.lab_urin_reduksi_hasil,
        lab_urin_reduksi_rencana: form.lab_urin_reduksi_rencana,
        rencana_konsultasi_gizi: form.rencana_konsultasi_gizi,
        rencana_konsultasi_kebidanan: form.rencana_konsultasi_kebidanan,
        rencana_konsultasi_anak: form.rencana_konsultasi_anak,
        rencana_konsultasi_penyakit_dalam: form.rencana_konsultasi_penyakit_dalam,
        rencana_konsultasi_neurologi: form.rencana_konsultasi_neurologi,
        rencana_konsultasi_tht: form.rencana_konsultasi_tht,
        rencana_konsultasi_psikiatri: form.rencana_konsultasi_psikiatri,
        rencana_konsultasi_lain_lain: form.rencana_konsultasi_lain_lain,
        rencana_proses_melahirkan: form.rencana_proses_melahirkan,
        rencana_kontrasepsi_akdr: form.rencana_kontrasepsi_akdr,
        rencana_kontrasepsi_pil: form.rencana_kontrasepsi_pil,
        rencana_kontrasepsi_suntik: form.rencana_kontrasepsi_suntik,
        rencana_kontrasepsi_steril: form.rencana_kontrasepsi_steril,
        rencana_kontrasepsi_mal: form.rencana_kontrasepsi_mal,
        rencana_kontrasepsi_implan: form.rencana_kontrasepsi_implan,
        rencana_kontrasepsi_belum_memilih: form.rencana_kontrasepsi_belum_memilih,
        kebutuhan_konseling: form.kebutuhan_konseling,
        penjelasan: form.penjelasan,
        kesimpulan_rekomendasi_tempat_melahirkan: form.kesimpulan_rekomendasi_tempat_melahirkan,

        // === pemeriksaan_laboratorium_jiwa (trimester=3) ===
        trimester: 3,
        tanggal_lab_jiwa: form.tanggal_lab_jiwa,
        lab_hemoglobin_hasil_jiwa: form.lab_hemoglobin_hasil_jiwa ? parseFloat(form.lab_hemoglobin_hasil_jiwa) : null,
        lab_hemoglobin_rencana_tindak_lanjut_jiwa: form.lab_hemoglobin_rencana_tindak_lanjut_jiwa,
        lab_golongan_darah_rhesus_hasil: form.lab_golongan_darah_rhesus_hasil,
        lab_golongan_darah_rhesus_rencana: form.lab_golongan_darah_rhesus_rencana,
        lab_gula_darah_sewaktu_hasil: form.lab_gula_darah_sewaktu_hasil ? parseInt(form.lab_gula_darah_sewaktu_hasil) : null,
        lab_gula_darah_sewaktu_rencana: form.lab_gula_darah_sewaktu_rencana,
        lab_hiv_hasil: form.lab_hiv_hasil,
        lab_hiv_rencana: form.lab_hiv_rencana,
        lab_sifilis_hasil: form.lab_sifilis_hasil,
        lab_sifilis_rencana: form.lab_sifilis_rencana,
        lab_hepatitis_b_hasil: form.lab_hepatitis_b_hasil,
        lab_hepatitis_b_rencana: form.lab_hepatitis_b_rencana,
        tanggal_skrining_jiwa_tr: form.tanggal_skrining_jiwa_tr,
        skrining_jiwa_hasil_tr: form.skrining_jiwa_hasil_tr,
        skrining_jiwa_tindak_lanjut_tr: form.skrining_jiwa_tindak_lanjut_tr,
        skrining_jiwa_perlu_rujukan_tr: form.skrining_jiwa_perlu_rujukan_tr,
        kesimpulan_tr: form.kesimpulan_tr,
        rekomendasi_tr: form.rekomendasi_tr,
      };

      if (existingData) {
        await updateDokterT3Complete(existingData.id, payload);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data pemeriksaan berhasil diperbarui!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await createDokterT3Complete(payload);
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data pemeriksaan berhasil disimpan!',
          timer: 2000,
          showConfirmButton: false
        });
      }
      navigate(`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/detail`);
    } catch (err) {
      console.error("Error saving:", err);
      Swal.fire('Error', 'Gagal menyimpan: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading & Error ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 max-w-2xl mx-auto mt-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={32} />
            <h2 className="text-xl font-bold text-red-700 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
              Kembali
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ── Data tampilan ──────────────────────────────────────────────────── */
  const fisikFields = [
    "fisik_konjungtiva","fisik_sklera","fisik_kulit","fisik_leher",
    "fisik_gigi_mulut","fisik_tht","fisik_dada_jantung","fisik_dada_paru",
    "fisik_perut","fisik_tungkai"
  ];

  const labReaktifFields = [
    { name: "lab_hiv_hasil", label: "HIV (H)", rencana: "lab_hiv_rencana" },
    { name: "lab_sifilis_hasil", label: "Sifilis (S)", rencana: "lab_sifilis_rencana" },
    { name: "lab_hepatitis_b_hasil", label: "Hepatitis B", rencana: "lab_hepatitis_b_rencana" },
  ];

  const konsultasiFields = [
    { name: "rencana_konsultasi_gizi", label: "Gizi" },
    { name: "rencana_konsultasi_kebidanan", label: "Kebidanan" },
    { name: "rencana_konsultasi_anak", label: "Anak" },
    { name: "rencana_konsultasi_penyakit_dalam", label: "Penyakit Dalam" },
    { name: "rencana_konsultasi_neurologi", label: "Neurologi" },
    { name: "rencana_konsultasi_tht", label: "THT" },
    { name: "rencana_konsultasi_psikiatri", label: "Psikiatri" },
  ];

  const kontrasepsiFields = [
    "AKDR", "Pil", "Suntik", "Steril / MOW / MOP", "MAL", "Implan", "Belum Memilih"
  ].map((label, idx) => ({
    name: [
      "rencana_kontrasepsi_akdr","rencana_kontrasepsi_pil","rencana_kontrasepsi_suntik",
      "rencana_kontrasepsi_steril","rencana_kontrasepsi_mal","rencana_kontrasepsi_implan",
      "rencana_kontrasepsi_belum_memilih"
    ][idx],
    label,
  }));

  const stepTitles = [
    "Data Dokter & Pemeriksaan Fisik",
    "USG Trimester 3 & Biometri Janin",
    "Pemeriksaan Laboratorium",
    "Skrining Jiwa & Rencana Lanjutan",
  ];
  const stepIcons = [User, Eye, FlaskConical, Brain];
  const stepColors = ["indigo", "violet", "amber", "rose"];

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {existingData ? "Edit" : "Tambah"} Pemeriksaan Dokter Trimester 3
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{stepTitles[currentStep - 1]}</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1,2,3,4].map(step => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              const Icon = stepIcons[step - 1];
              const color = stepColors[step - 1];
              const bgColor = isActive
                ? `bg-${color}-500 text-white shadow-lg scale-110`
                : isCompleted ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500";
              const titleColor = isActive ? `text-${color}-600` : isCompleted ? "text-emerald-600" : "text-gray-500";
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${bgColor} mb-2`}>
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={18} />}
                  </div>
                  <p className={`text-xs font-semibold text-center ${titleColor} transition`}>
                    {step === 1 ? "Dokter & Fisik" : step === 2 ? "USG & Biometri" : step === 3 ? "Lab" : "Skrining & Rencana"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ══ STEP 1 ══ */}
          {currentStep === 1 && (
            <>
              <Section icon={User} title="Data Dokter & Anamnesis" color="indigo">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="Nama Dokter">
                    <input name="nama_dokter" value={form.nama_dokter} readOnly className={inputCls} />
                  </Field>
                  <Field label="Tanggal Periksa">
                    <input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.tanggal_periksa ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.tanggal_periksa} />
                  </Field>
                  <Field label="Konsep Anamnesa" colSpan="sm:col-span-2 md:col-span-1">
                    <textarea name="konsep_anamnesa_pemeriksaan" value={form.konsep_anamnesa_pemeriksaan}
                      onChange={handleChange} placeholder="Tulis anamnesa..." rows={3}
                      className={`${inputCls} ${validationErrors.konsep_anamnesa_pemeriksaan ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.konsep_anamnesa_pemeriksaan} />
                  </Field>
                </div>
              </Section>

              <Section icon={Activity} title="Pemeriksaan Fisik" color="teal">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {fisikFields.map(field => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        {field.replace("fisik_", "").replace(/_/g, " ")}
                      </label>
                      <select name={field} value={form[field]} onChange={handleChange}
                        className={`${selectCls} ${
                          validationErrors[field] ? "border-red-500" : form[field]==="Abnormal" ? "border-red-300 bg-red-50 text-red-700" : ""
                        }`}>
                        <option value="Normal">Normal</option>
                        <option value="Abnormal">Abnormal</option>
                      </select>
                      <ErrorMessage message={validationErrors[field]} />
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ══ STEP 2: USG T3 & Biometri ══ */}
          {currentStep === 2 && (
            <Section icon={Eye} title="USG Trimester 3 & Biometri Janin" color="violet" defaultOpen={true}>
              {/* Status USG */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Status USG</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="USG Dilakukan?">
                    <select name="usg_trimester3_dilakukan" value={form.usg_trimester3_dilakukan} onChange={handleChange}
                      className={`${selectCls} ${form.usg_trimester3_dilakukan==="Tidak" ? "border-amber-300 bg-amber-50 text-amber-700" : ""}`}>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </Field>
                  {form.usg_trimester3_dilakukan === "Ya" && (
                    <>
                      <Field label="UK USG T1 (minggu)">
                        <input type="number" name="uk_berdasarkan_usg_trimester1_minggu" value={form.uk_berdasarkan_usg_trimester1_minggu} onChange={handleChange} className={inputCls} />
                      </Field>
                      <Field label="UK HPHT (minggu)">
                        <input type="number" name="uk_berdasarkan_hpht_minggu" value={form.uk_berdasarkan_hpht_minggu} onChange={handleChange}
                          className={`${inputCls} ${validationErrors.uk_berdasarkan_hpht_minggu ? "border-red-500" : ""}`} />
                        <ErrorMessage message={validationErrors.uk_berdasarkan_hpht_minggu} />
                      </Field>
                      <Field label="UK Biometri T3 (minggu)">
                        <input type="number" name="uk_berdasarkan_biometri_usg_trimester3_minggu" value={form.uk_berdasarkan_biometri_usg_trimester3_minggu} onChange={handleChange} className={inputCls} />
                      </Field>
                      <Field label="Selisih ≥3 Minggu?">
                        <select name="selisih_uk3_minggu_atau_lebih" value={form.selisih_uk3_minggu_atau_lebih} onChange={handleChange}
                          className={`${selectCls} ${form.selisih_uk3_minggu_atau_lebih==="Ya" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                          <option value="Tidak">Tidak</option>
                          <option value="Ya">Ya</option>
                        </select>
                      </Field>
                    </>
                  )}
                </div>
              </div>

              {form.usg_trimester3_dilakukan === "Ya" && (
                <>
                  {/* Kondisi Bayi */}
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Kondisi Bayi</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Field label="Jumlah Bayi"><input name="usg_jumlah_bayi" value={form.usg_jumlah_bayi} onChange={handleChange}
                        className={`${inputCls} ${validationErrors.usg_jumlah_bayi ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.usg_jumlah_bayi} /></Field>
                      <Field label="Letak Bayi"><input name="usg_letak_bayi" value={form.usg_letak_bayi} onChange={handleChange}
                        className={`${inputCls} ${validationErrors.usg_letak_bayi ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.usg_letak_bayi} /></Field>
                      <Field label="Presentasi Bayi"><input name="usg_presentasi_bayi" value={form.usg_presentasi_bayi} onChange={handleChange}
                        className={`${inputCls} ${validationErrors.usg_presentasi_bayi ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.usg_presentasi_bayi} /></Field>
                      <Field label="Keadaan Bayi"><input name="usg_keadaan_bayi" value={form.usg_keadaan_bayi} onChange={handleChange}
                        className={`${inputCls} ${validationErrors.usg_keadaan_bayi ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.usg_keadaan_bayi} /></Field>
                      <Field label="DJJ (x/menit)"><input type="number" name="usgdj_nilai" value={form.usgdj_nilai} onChange={handleChange}
                        className={`${inputCls} ${validationErrors.usgdj_nilai ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.usgdj_nilai} /></Field>
                      <Field label="Status DJJ">
                        <select name="usgdjj_status" value={form.usgdjj_status} onChange={handleChange}
                          className={`${selectCls} ${form.usgdjj_status==="Abnormal" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                          <option value="Normal">Normal</option>
                          <option value="Abnormal">Abnormal</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                  {/* Plasenta & Ketuban */}
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Plasenta & Cairan Ketuban</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Field label="Lokasi Plasenta"><input name="usg_lokasi_plasenta" value={form.usg_lokasi_plasenta} onChange={handleChange}
                        className={`${inputCls} ${validationErrors.usg_lokasi_plasenta ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.usg_lokasi_plasenta} /></Field>
                      <Field label="SDP (cm)"><input type="number" step="0.1" name="usg_cairan_ketuban_sdp_cm" value={form.usg_cairan_ketuban_sdp_cm} onChange={handleChange}
                        className={`${inputCls} ${validationErrors.usg_cairan_ketuban_sdp_cm ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.usg_cairan_ketuban_sdp_cm} /></Field>
                      <Field label="Status Ketuban">
                        <select name="usg_cairan_ketuban_status" value={form.usg_cairan_ketuban_status} onChange={handleChange}
                          className={`${selectCls} ${form.usg_cairan_ketuban_status!=="Normal" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                          <option value="Normal">Normal</option>
                          <option value="Oligohidramnion">Oligohidramnion</option>
                          <option value="Polihidramnion">Polihidramnion</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                  {/* Biometri */}
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Biometri Janin</h3>
                    <div className="rounded-xl border border-violet-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-violet-50">
                          <tr>
                            <th className="text-left px-4 py-2.5 text-xs font-bold text-violet-700 uppercase tracking-wide">Parameter</th>
                            <th className="text-left px-4 py-2.5 text-xs font-bold text-violet-700 uppercase tracking-wide">Nilai (cm / gram)</th>
                            <th className="text-left px-4 py-2.5 text-xs font-bold text-violet-700 uppercase tracking-wide">Setara (minggu)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-50">
                          {[
                            { label: "BPD", cm: "biometri_bpd_cm", minggu: "biometri_bpd_minggu", unit: "cm" },
                            { label: "HC", cm: "biometri_hc_cm", minggu: "biometri_hc_minggu", unit: "cm" },
                            { label: "AC", cm: "biometri_ac_cm", minggu: "biometri_ac_minggu", unit: "cm" },
                            { label: "FL", cm: "biometri_fl_cm", minggu: "biometri_fl_minggu", unit: "cm" },
                            { label: "EFW/TBJ", cm: "biometri_efwtbj_gram", minggu: "biometri_efwtbj_minggu", unit: "gram" },
                          ].map((row, idx) => (
                            <tr key={row.cm} className={idx % 2 === 1 ? "bg-gray-50/50" : ""}>
                              <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <input type="number" step="0.1" name={row.cm} value={form[row.cm]} onChange={handleChange}
                                    className={`${inputCls} ${validationErrors[row.cm] ? "border-red-500" : ""}`} />
                                  <span className="text-xs text-gray-400">{row.unit}</span>
                                </div>
                                <ErrorMessage message={validationErrors[row.cm]} />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <input type="number" name={row.minggu} value={form[row.minggu]} onChange={handleChange} className={inputCls} />
                                  <span className="text-xs text-gray-400">mg</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Temuan Abnormal */}
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Kecurigaan Temuan Abnormal</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Field label="Kecurigaan Abnormal">
                        <select name="usg_kecurigaan_temuan_abnormal" value={form.usg_kecurigaan_temuan_abnormal} onChange={handleChange}
                          className={`${selectCls} ${validationErrors.usg_kecurigaan_temuan_abnormal ? "border-red-500" : form.usg_kecurigaan_temuan_abnormal==="Ya" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                          <option value="Tidak">Tidak</option>
                          <option value="Ya">Ya</option>
                        </select>
                        <ErrorMessage message={validationErrors.usg_kecurigaan_temuan_abnormal} />
                      </Field>
                      {form.usg_kecurigaan_temuan_abnormal === "Ya" && (
                        <Field label="Keterangan Abnormal" colSpan="sm:col-span-3">
                          <input name="usg_keterangan_temuan_abnormal" value={form.usg_keterangan_temuan_abnormal} onChange={handleChange}
                            className={`${inputCls} border-red-200 ${validationErrors.usg_keterangan_temuan_abnormal ? "border-red-500" : ""}`} />
                          <ErrorMessage message={validationErrors.usg_keterangan_temuan_abnormal} />
                        </Field>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Upload Gambar USG */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
                  <ImageIcon className="inline mr-1" size={16} /> Hasil USG (Gambar)
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-shrink-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="usg-image-upload-t3"
                    />
                    <label
                      htmlFor="usg-image-upload-t3"
                      className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <Upload size={16} />
                      Pilih Gambar
                    </label>
                  </div>
                  {usgImagePreview && (
                    <div className="relative border rounded-lg overflow-hidden max-w-xs">
                      <img src={usgImagePreview} alt="Preview USG" className="max-h-48 object-contain" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Unggah hasil USG (JPG/PNG), akan dikonversi ke data digital.</p>
              </div>

              {/* Hasil USG Catatan */}
              <div>
                <Field label="Hasil USG / Catatan Tambahan">
                  <textarea name="hasil_usg_catatan" value={form.hasil_usg_catatan} onChange={handleChange} rows={3} className={inputCls} />
                </Field>
              </div>
            </Section>
          )}

          {/* ══ STEP 3: Laboratorium ══ */}
          {currentStep === 3 && (
            <Section icon={FlaskConical} title="Pemeriksaan Laboratorium" color="amber" defaultOpen={true}>
              {/* Lab Lanjutan T3 */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Laboratorium Lanjutan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <Field label="Tanggal Lab Lanjutan">
                    <input type="date" name="tanggal_lab" value={form.tanggal_lab} onChange={handleChange} className={inputCls} />
                  </Field>
                </div>
                <div className="rounded-xl border border-amber-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Pemeriksaan</th>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Hasil</th>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Rencana Tindak Lanjut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                      {[
                        { label: "Hemoglobin", hasil: "lab_hemoglobin_hasil", rencana: "lab_hemoglobin_rencana", satuan: "g/dL" },
                        { label: "Protein Urin", hasil: "lab_protein_urin_hasil", rencana: "lab_protein_urin_rencana", satuan: "mg/dL" },
                        { label: "Urin Reduksi", hasil: "lab_urin_reduksi_hasil", rencana: "lab_urin_reduksi_rencana", satuan: "" },
                      ].map((item, idx) => (
                        <tr key={item.hasil} className={idx % 2 === 1 ? "bg-gray-50/50" : ""}>
                          <td className="px-4 py-3 font-medium text-gray-700">{item.label}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <input type="number" step={item.satuan ? "0.1" : undefined} name={item.hasil} value={form[item.hasil]} onChange={handleChange}
                                className={`${inputCls} ${validationErrors[item.hasil] ? "border-red-500" : ""}`} />
                              {item.satuan && <span className="text-xs text-gray-400">{item.satuan}</span>}
                            </div>
                            <ErrorMessage message={validationErrors[item.hasil]} />
                          </td>
                          <td className="px-4 py-3">
                            <input name={item.rencana} value={form[item.rencana]} onChange={handleChange}
                              className={`${inputCls} ${validationErrors[item.rencana] ? "border-red-500" : ""}`} />
                            <ErrorMessage message={validationErrors[item.rencana]} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab Jiwa T3 */}
              <div>
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Laboratorium Trimester 3 (Jiwa)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Tanggal Lab Jiwa">
                    <input type="date" name="tanggal_lab_jiwa" value={form.tanggal_lab_jiwa} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.tanggal_lab_jiwa ? "border-red-500" : ""}`} />
                    <ErrorMessage message={validationErrors.tanggal_lab_jiwa} />
                  </Field>
                </div>
                {/* Tabel kuantitatif */}
                <div className="rounded-xl border border-amber-100 overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Pemeriksaan</th>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Hasil</th>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Rencana Tindak Lanjut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700">Hemoglobin</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <input type="number" step="0.1" name="lab_hemoglobin_hasil_jiwa" value={form.lab_hemoglobin_hasil_jiwa} onChange={handleChange}
                              className={`${inputCls} ${validationErrors.lab_hemoglobin_hasil_jiwa ? "border-red-500" : ""}`} />
                            <span className="text-xs text-gray-400">g/dL</span>
                          </div>
                          <ErrorMessage message={validationErrors.lab_hemoglobin_hasil_jiwa} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_hemoglobin_rencana_tindak_lanjut_jiwa" value={form.lab_hemoglobin_rencana_tindak_lanjut_jiwa} onChange={handleChange}
                            className={`${inputCls} ${validationErrors.lab_hemoglobin_rencana_tindak_lanjut_jiwa ? "border-red-500" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_hemoglobin_rencana_tindak_lanjut_jiwa} />
                        </td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-700">Gula Darah Sewaktu</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <input type="number" name="lab_gula_darah_sewaktu_hasil" value={form.lab_gula_darah_sewaktu_hasil} onChange={handleChange}
                              className={`${inputCls} ${validationErrors.lab_gula_darah_sewaktu_hasil ? "border-red-500" : ""}`} />
                            <span className="text-xs text-gray-400">mg/dL</span>
                          </div>
                          <ErrorMessage message={validationErrors.lab_gula_darah_sewaktu_hasil} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_gula_darah_sewaktu_rencana" value={form.lab_gula_darah_sewaktu_rencana} onChange={handleChange}
                            className={`${inputCls} ${validationErrors.lab_gula_darah_sewaktu_rencana ? "border-red-500" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_gula_darah_sewaktu_rencana} />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700">Golongan Darah & Rhesus</td>
                        <td className="px-4 py-3">
                          <input name="lab_golongan_darah_rhesus_hasil" value={form.lab_golongan_darah_rhesus_hasil} onChange={handleChange}
                            className={`${inputCls} ${validationErrors.lab_golongan_darah_rhesus_hasil ? "border-red-500" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_golongan_darah_rhesus_hasil} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_golongan_darah_rhesus_rencana" value={form.lab_golongan_darah_rhesus_rencana} onChange={handleChange}
                            className={`${inputCls} ${validationErrors.lab_golongan_darah_rhesus_rencana ? "border-red-500" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_golongan_darah_rhesus_rencana} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Reaktif */}
                <div className="rounded-xl border border-amber-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Pemeriksaan</th>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Hasil</th>
                        <th className="text-left px-4 py-2 text-xs font-bold text-amber-700 uppercase tracking-wide w-1/3">Rencana Tindak Lanjut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                      {labReaktifFields.map((lf, idx) => (
                        <tr key={lf.name} className={idx % 2 === 1 ? "bg-gray-50/50" : ""}>
                          <td className="px-4 py-3 font-medium text-gray-700">{lf.label}</td>
                          <td className="px-4 py-3">
                            <select name={lf.name} value={form[lf.name]} onChange={handleChange}
                              className={`${selectCls} ${
                                validationErrors[lf.name] ? "border-red-500" : form[lf.name]==="Reaktif" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                              }`}>
                              <option value="NonReaktif">Non Reaktif</option>
                              <option value="Reaktif">Reaktif</option>
                            </select>
                            <ErrorMessage message={validationErrors[lf.name]} />
                          </td>
                          <td className="px-4 py-3">
                            <input name={lf.rencana} value={form[lf.rencana]} onChange={handleChange}
                              className={`${inputCls} ${validationErrors[lf.rencana] ? "border-red-500" : ""}`} />
                            <ErrorMessage message={validationErrors[lf.rencana]} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>
          )}

          {/* ══ STEP 4: Skrining Jiwa & Rencana Lanjutan ══ */}
          {currentStep === 4 && (
            <Section icon={Brain} title="Skrining Jiwa & Rencana Lanjutan" color="rose" defaultOpen={true}>
              {/* Skrining Jiwa Lanjutan (dari tabel dokter T3) */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Skrining Kesehatan Jiwa (Lanjutan)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Tanggal Skrining"><input type="date" name="tanggal_skrining_jiwa" value={form.tanggal_skrining_jiwa} onChange={handleChange}
                    className={`${inputCls} ${validationErrors.tanggal_skrining_jiwa ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.tanggal_skrining_jiwa} /></Field>
                  <Field label="Skrining Jiwa">
                    <select name="skrining_jiwa_hasil" value={form.skrining_jiwa_hasil} onChange={handleChange}
                      className={`${selectCls} ${validationErrors.skrining_jiwa_hasil ? "border-red-500" : ""}`}>
                      <option value="">-- Pilih --</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                    <ErrorMessage message={validationErrors.skrining_jiwa_hasil} />
                  </Field>
                  <Field label="Tindak Lanjut">
                    <select name="skrining_jiwa_tindak_lanjut" value={form.skrining_jiwa_tindak_lanjut} onChange={handleChange}
                      className={`${selectCls} ${validationErrors.skrining_jiwa_tindak_lanjut ? "border-red-500" : ""}`}>
                      <option value="">-- Pilih --</option>
                      <option value="Edukasi">Edukasi</option>
                      <option value="Konseling">Konseling</option>
                    </select>
                    <ErrorMessage message={validationErrors.skrining_jiwa_tindak_lanjut} />
                  </Field>
                  <Field label="Perlu Rujukan?">
                    <select name="skrining_jiwa_perlu_rujukan" value={form.skrining_jiwa_perlu_rujukan} onChange={handleChange}
                      className={`${selectCls} ${form.skrining_jiwa_perlu_rujukan==="Ya" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Skrining Jiwa TR (dari lab jiwa T3) */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Skrining Kesehatan Jiwa (TR)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Tanggal Skrining TR"><input type="date" name="tanggal_skrining_jiwa_tr" value={form.tanggal_skrining_jiwa_tr} onChange={handleChange}
                    className={`${inputCls} ${validationErrors.tanggal_skrining_jiwa_tr ? "border-red-500" : ""}`} /><ErrorMessage message={validationErrors.tanggal_skrining_jiwa_tr} /></Field>
                  <Field label="Skrining Jiwa TR">
                    <select name="skrining_jiwa_hasil_tr" value={form.skrining_jiwa_hasil_tr} onChange={handleChange}
                      className={`${selectCls} ${validationErrors.skrining_jiwa_hasil_tr ? "border-red-500" : ""}`}>
                      <option value="">-- Pilih --</option>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                    <ErrorMessage message={validationErrors.skrining_jiwa_hasil_tr} />
                  </Field>
                  <Field label="Tindak Lanjut TR">
                    <select name="skrining_jiwa_tindak_lanjut_tr" value={form.skrining_jiwa_tindak_lanjut_tr} onChange={handleChange}
                      className={`${selectCls} ${validationErrors.skrining_jiwa_tindak_lanjut_tr ? "border-red-500" : ""}`}>
                      <option value="">-- Pilih --</option>
                      <option value="Edukasi">Edukasi</option>
                      <option value="Konseling">Konseling</option>
                    </select>
                    <ErrorMessage message={validationErrors.skrining_jiwa_tindak_lanjut_tr} />
                  </Field>
                  <Field label="Perlu Rujukan TR?">
                    <select name="skrining_jiwa_perlu_rujukan_tr" value={form.skrining_jiwa_perlu_rujukan_tr} onChange={handleChange}
                      className={`${selectCls} ${form.skrining_jiwa_perlu_rujukan_tr==="Ya" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Field label="Kesimpulan TR">
                    <textarea name="kesimpulan_tr" value={form.kesimpulan_tr} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.kesimpulan_tr ? "border-red-500" : ""}`} rows={3} />
                    <ErrorMessage message={validationErrors.kesimpulan_tr} />
                  </Field>
                  <Field label="Rekomendasi TR">
                    <textarea name="rekomendasi_tr" value={form.rekomendasi_tr} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.rekomendasi_tr ? "border-red-500" : ""}`} rows={3} />
                    <ErrorMessage message={validationErrors.rekomendasi_tr} />
                  </Field>
                </div>
              </div>

              {/* Rencana Konsultasi */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Rencana Konsultasi</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                  {konsultasiFields.map(item => (
                    <label key={item.name}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer transition ${
                        form[item.name] ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
                      <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} className="rounded" />
                      {item.label}
                    </label>
                  ))}
                </div>
                <Field label="Konsultasi Lain-lain">
                  <input name="rencana_konsultasi_lain_lain" value={form.rencana_konsultasi_lain_lain} onChange={handleChange} className={inputCls} />
                </Field>
              </div>

              {/* Rencana Melahirkan */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Rencana Proses Melahirkan</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {["Normal", "Pervaginam berbantu", "Sectio caesaria"].map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setForm(prev => ({ ...prev, rencana_proses_melahirkan: opt }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                        form.rencana_proses_melahirkan === opt
                          ? opt === "Normal" ? "bg-emerald-500 text-white border-emerald-500"
                            : opt === "Sectio caesaria" ? "bg-red-500 text-white border-red-500"
                            : "bg-amber-500 text-white border-amber-500"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
                <ErrorMessage message={validationErrors.rencana_proses_melahirkan} />
              </div>

              {/* Kontrasepsi */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Pilihan Rencana Kontrasepsi Pasca Persalinan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {kontrasepsiFields.map(item => (
                    <label key={item.name}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer transition ${
                        form[item.name] ? "bg-teal-50 border-teal-300 text-teal-700 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
                      <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} className="rounded" />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Kebutuhan Konseling & Tempat Melahirkan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Kebutuhan Konseling">
                  <select name="kebutuhan_konseling" value={form.kebutuhan_konseling} onChange={handleChange}
                    className={`${selectCls} ${form.kebutuhan_konseling==="Ya" ? "border-amber-300 bg-amber-50 text-amber-700" : ""}`}>
                    <option value="Tidak">Tidak</option>
                    <option value="Ya">Ya</option>
                  </select>
                </Field>
                <Field label="Rekomendasi Tempat Melahirkan">
                  <select name="kesimpulan_rekomendasi_tempat_melahirkan" value={form.kesimpulan_rekomendasi_tempat_melahirkan} onChange={handleChange}
                    className={`${selectCls} ${validationErrors.kesimpulan_rekomendasi_tempat_melahirkan ? "border-red-500" : ""}`}>
                    <option value="">-- Pilih --</option>
                    <option value="FKTP">FKTP</option>
                    <option value="FKRTL">FKRTL</option>
                  </select>
                  <ErrorMessage message={validationErrors.kesimpulan_rekomendasi_tempat_melahirkan} />
                </Field>
                <Field label="Penjelasan" colSpan="sm:col-span-2">
                  <textarea name="penjelasan" value={form.penjelasan} onChange={handleChange}
                    className={`${inputCls} ${validationErrors.penjelasan ? "border-red-500" : ""}`} rows={3} />
                  <ErrorMessage message={validationErrors.penjelasan} />
                </Field>
              </div>
            </Section>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 pb-6 border-t border-gray-200">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Batalkan</button>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button type="button" onClick={handlePrevStep} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100">
                  <ChevronLeft size={16} /> Sebelumnya
                </button>
              )}
              {currentStep < 4 ? (
                <button type="button" onClick={handleNextStep} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
                  Selanjutnya <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {saving ? "Menyimpan..." : "Simpan Semua Data"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </MainLayout> 
  );
}