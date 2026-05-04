// src/pages/Ibu/PemeriksaanDokterT3Complete.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";

// ─── Helper Components ────────────────────────────────────────────────────────

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
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PemeriksaanDokterT3Complete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kehamilan, setKehamilan] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  const initialState = {
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
    usg_trimester_3_dilakukan: "Ya",
    uk_berdasarkan_usg_trimester_1_minggu: "",
    uk_berdasarkan_hpht_minggu: "",
    uk_berdasarkan_biometri_usg_trimester_3_minggu: "",
    selisih_uk_3_minggu_atau_lebih: "Tidak",
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
    biometri_efw_tbj_gram: "",
    biometri_efw_tbj_minggu: "",
    usg_kecurigaan_temuan_abnormal: "Tidak",
    usg_keterangan_temuan_abnormal: "",
    hasil_usg_catatan: "",
    // Lanjutan T3 lab
    tanggal_lab: "",
    lab_hemoglobin_hasil: "",
    lab_hemoglobin_rencana_tindak_lanjut: "",
    lab_protein_urin_hasil: "",
    lab_protein_urin_rencana_tindak_lanjut: "",
    lab_urin_reduksi_hasil: "",
    lab_urin_reduksi_rencana_tindak_lanjut: "",
    // Skrining jiwa lanjutan
    tanggal_skrining_jiwa: "",
    skrining_jiwa_hasil: "",
    skrining_jiwa_tindak_lanjut: "",
    skrining_jiwa_perlu_rujukan: "Tidak",
    // Rencana
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
    // Lab Jiwa T3
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
    // Skrining Jiwa TR
    tanggal_skrining_jiwa_tr: "",
    skrining_jiwa_hasil_tr: "",
    skrining_jiwa_tindak_lanjut_tr: "",
    skrining_jiwa_perlu_rujukan_tr: "Tidak",
    kesimpulan_tr: "",
    rekomendasi_tr: "",
  };

  const [form, setForm] = useState(initialState);

  // ── Fetch data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = getCurrentUser();
        const dokterName = currentUser?.nama || currentUser?.name || "";

        const kehamilanList = await getKehamilanByIbuId(id);
        if (!kehamilanList || kehamilanList.length === 0) {
          setError("Belum ada data kehamilan untuk ibu ini. Silakan tambah data kehamilan terlebih dahulu.");
          setLoading(false);
          return;
        }
        const aktif = kehamilanList[0];
        setKehamilan(aktif);

        const res = await getDokterT3CompleteByKehamilanId(aktif.id);
        if (res && res.dokter) {
          setExistingData(res.dokter);
          const d = res.dokter;
          const lab = res.lab_jiwa;
          setForm({
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
            usg_trimester_3_dilakukan: d.usg_trimester_3_dilakukan || "Ya",
            uk_berdasarkan_usg_trimester_1_minggu: d.uk_berdasarkan_usg_trimester_1_minggu?.toString() || "",
            uk_berdasarkan_hpht_minggu: d.uk_berdasarkan_hpht_minggu?.toString() || "",
            uk_berdasarkan_biometri_usg_trimester_3_minggu: d.uk_berdasarkan_biometri_usg_trimester_3_minggu?.toString() || "",
            selisih_uk_3_minggu_atau_lebih: d.selisih_uk_3_minggu_atau_lebih || "Tidak",
            usg_jumlah_bayi: d.usg_jumlah_bayi || "",
            usg_letak_bayi: d.usg_letak_bayi || "",
            usg_presentasi_bayi: d.usg_presentasi_bayi || "",
            usg_keadaan_bayi: d.usg_keadaan_bayi || "",
            usg_djj_nilai: d.usg_djj_nilai?.toString() || "",
            usg_djj_status: d.usg_djj_status || "Normal",
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
            biometri_efw_tbj_gram: d.biometri_efw_tbj_gram?.toString() || "",
            biometri_efw_tbj_minggu: d.biometri_efw_tbj_minggu?.toString() || "",
            usg_kecurigaan_temuan_abnormal: d.usg_kecurigaan_temuan_abnormal || "Tidak",
            usg_keterangan_temuan_abnormal: d.usg_keterangan_temuan_abnormal || "",
            hasil_usg_catatan: d.hasil_usg_catatan || "",
            tanggal_lab: d.tanggal_lab ? d.tanggal_lab.split("T")[0] : "",
            lab_hemoglobin_hasil: d.lab_hemoglobin_hasil?.toString() || "",
            lab_hemoglobin_rencana_tindak_lanjut: d.lab_hemoglobin_rencana_tindak_lanjut || "",
            lab_protein_urin_hasil: d.lab_protein_urin_hasil?.toString() || "",
            lab_protein_urin_rencana_tindak_lanjut: d.lab_protein_urin_rencana_tindak_lanjut || "",
            lab_urin_reduksi_hasil: d.lab_urin_reduksi_hasil || "",
            lab_urin_reduksi_rencana_tindak_lanjut: d.lab_urin_reduksi_rencana_tindak_lanjut || "",
            tanggal_skrining_jiwa: d.tanggal_skrining_jiwa ? d.tanggal_skrining_jiwa.split("T")[0] : "",
            skrining_jiwa_hasil: d.skrining_jiwa_hasil || "",
            skrining_jiwa_tindak_lanjut: d.skrining_jiwa_tindak_lanjut || "",
            skrining_jiwa_perlu_rujukan: d.skrining_jiwa_perlu_rujukan || "Tidak",
            rencana_konsultasi_gizi: d.rencana_konsultasi_gizi || false,
            rencana_konsultasi_kebidanan: d.rencana_konsultasi_kebidanan || false,
            rencana_konsultasi_anak: d.rencana_konsultasi_anak || false,
            rencana_konsultasi_penyakit_dalam: d.rencana_konsultasi_penyakit_dalam || false,
            rencana_konsultasi_neurologi: d.rencana_konsultasi_neurologi || false,
            rencana_konsultasi_tht: d.rencana_konsultasi_tht || false,
            rencana_konsultasi_psikiatri: d.rencana_konsultasi_psikiatri || false,
            rencana_konsultasi_lain_lain: d.rencana_konsultasi_lain_lain || "",
            rencana_proses_melahirkan: d.rencana_proses_melahirkan || "",
            rencana_kontrasepsi_akdr: d.rencana_kontrasepsi_akdr || false,
            rencana_kontrasepsi_pil: d.rencana_kontrasepsi_pil || false,
            rencana_kontrasepsi_suntik: d.rencana_kontrasepsi_suntik || false,
            rencana_kontrasepsi_steril: d.rencana_kontrasepsi_steril || false,
            rencana_kontrasepsi_mal: d.rencana_kontrasepsi_mal || false,
            rencana_kontrasepsi_implan: d.rencana_kontrasepsi_implan || false,
            rencana_kontrasepsi_belum_memilih: d.rencana_kontrasepsi_belum_memilih || false,
            kebutuhan_konseling: d.kebutuhan_konseling || "Tidak",
            penjelasan: d.penjelasan || "",
            kesimpulan_rekomendasi_tempat_melahirkan: d.kesimpulan_rekomendasi_tempat_melahirkan || "",
            tanggal_lab_jiwa: lab?.tanggal_lab ? lab.tanggal_lab.split("T")[0] : "",
            lab_hemoglobin_hasil_jiwa: lab?.lab_hemoglobin_hasil?.toString() || "",
            lab_hemoglobin_rencana_tindak_lanjut_jiwa: lab?.lab_hemoglobin_rencana_tindak_lanjut || "",
            lab_golongan_darah_rhesus_hasil: lab?.lab_golongan_darah_rhesus_hasil || "",
            lab_golongan_darah_rhesus_rencana_tindak_lanjut: lab?.lab_golongan_darah_rhesus_rencana_tindak_lanjut || "",
            lab_gula_darah_sewaktu_hasil: lab?.lab_gula_darah_sewaktu_hasil?.toString() || "",
            lab_gula_darah_sewaktu_rencana_tindak_lanjut: lab?.lab_gula_darah_sewaktu_rencana_tindak_lanjut || "",
            lab_hiv_hasil: lab?.lab_hiv_hasil || "NonReaktif",
            lab_hiv_rencana_tindak_lanjut: lab?.lab_hiv_rencana_tindak_lanjut || "",
            lab_sifilis_hasil: lab?.lab_sifilis_hasil || "NonReaktif",
            lab_sifilis_rencana_tindak_lanjut: lab?.lab_sifilis_rencana_tindak_lanjut || "",
            lab_hepatitis_b_hasil: lab?.lab_hepatitis_b_hasil || "NonReaktif",
            lab_hepatitis_b_rencana_tindak_lanjut: lab?.lab_hepatitis_b_rencana_tindak_lanjut || "",
            tanggal_skrining_jiwa_tr: lab?.tanggal_skrining_jiwa ? lab.tanggal_skrining_jiwa.split("T")[0] : "",
            skrining_jiwa_hasil_tr: lab?.skrining_jiwa_hasil || "",
            skrining_jiwa_tindak_lanjut_tr: lab?.skrining_jiwa_tindak_lanjut || "",
            skrining_jiwa_perlu_rujukan_tr: lab?.skrining_jiwa_perlu_rujukan || "Tidak",
            kesimpulan_tr: lab?.kesimpulan || "",
            rekomendasi_tr: lab?.rekomendasi || "",
          });
        } else {
          setForm((prev) => ({ 
            ...prev, 
            kehamilan_id: aktif.id,
            nama_dokter: dokterName || ""
          }));
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ── Validasi tiap langkah ───────────────────────────────────────────────
  const validateStep1 = () => {
    const errors = {};
    if (!form.tanggal_periksa?.trim()) errors.tanggal_periksa = "Tanggal periksa harus diisi";
    if (!form.konsep_anamnesa_pemeriksaan?.trim()) errors.konsep_anamnesa_pemeriksaan = "Anamnesa harus diisi";
    const fisikFields = [
      "fisik_konjungtiva", "fisik_sklera", "fisik_kulit", "fisik_leher",
      "fisik_gigi_mulut", "fisik_tht", "fisik_dada_jantung", "fisik_dada_paru",
      "fisik_perut", "fisik_tungkai"
    ];
    fisikFields.forEach(field => {
      if (!form[field]?.trim()) errors[field] = "Harus diisi";
    });
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (form.usg_trimester_3_dilakukan === "Ya") {
      if (!form.uk_berdasarkan_hpht_minggu?.toString().trim()) errors.uk_berdasarkan_hpht_minggu = "UK HPHT (minggu) harus diisi";
      if (!form.usg_jumlah_bayi?.toString().trim()) errors.usg_jumlah_bayi = "Jumlah bayi harus diisi";
      if (!form.usg_letak_bayi?.trim()) errors.usg_letak_bayi = "Letak bayi harus diisi";
      if (!form.usg_presentasi_bayi?.trim()) errors.usg_presentasi_bayi = "Presentasi bayi harus diisi";
      if (!form.usg_keadaan_bayi?.trim()) errors.usg_keadaan_bayi = "Keadaan bayi harus diisi";
      if (!form.usg_djj_nilai?.toString().trim()) errors.usg_djj_nilai = "DJJ harus diisi";
      if (!form.usg_lokasi_plasenta?.trim()) errors.usg_lokasi_plasenta = "Lokasi plasenta harus diisi";
      if (!form.usg_cairan_ketuban_sdp_cm?.toString().trim()) errors.usg_cairan_ketuban_sdp_cm = "Cairan ketuban SDP (cm) harus diisi";
      // Biometri minimal BPD, HC, AC, FL, EFW
      if (!form.biometri_bpd_cm?.toString().trim()) errors.biometri_bpd_cm = "BPD (cm) harus diisi";
      if (!form.biometri_hc_cm?.toString().trim()) errors.biometri_hc_cm = "HC (cm) harus diisi";
      if (!form.biometri_ac_cm?.toString().trim()) errors.biometri_ac_cm = "AC (cm) harus diisi";
      if (!form.biometri_fl_cm?.toString().trim()) errors.biometri_fl_cm = "FL (cm) harus diisi";
      if (!form.biometri_efw_tbj_gram?.toString().trim()) errors.biometri_efw_tbj_gram = "EFW/TBJ harus diisi";
      if (!form.usg_kecurigaan_temuan_abnormal?.trim()) errors.usg_kecurigaan_temuan_abnormal = "Status temuan abnormal harus diisi";
      if (form.usg_kecurigaan_temuan_abnormal === "Ya" && !form.usg_keterangan_temuan_abnormal?.trim()) {
        errors.usg_keterangan_temuan_abnormal = "Keterangan abnormal harus diisi";
      }
    }
    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    // Lab Lanjutan
    if (form.tanggal_lab?.trim()) {
      if (!form.lab_hemoglobin_hasil?.toString().trim()) errors.lab_hemoglobin_hasil = "Hb hasil harus diisi";
      if (!form.lab_hemoglobin_rencana_tindak_lanjut?.trim()) errors.lab_hemoglobin_rencana_tindak_lanjut = "Rencana Hb harus diisi";
      if (!form.lab_protein_urin_hasil?.toString().trim()) errors.lab_protein_urin_hasil = "Protein urin hasil harus diisi";
      if (!form.lab_protein_urin_rencana_tindak_lanjut?.trim()) errors.lab_protein_urin_rencana_tindak_lanjut = "Rencana protein urin harus diisi";
      if (!form.lab_urin_reduksi_hasil?.trim()) errors.lab_urin_reduksi_hasil = "Urin reduksi hasil harus diisi";
      if (!form.lab_urin_reduksi_rencana_tindak_lanjut?.trim()) errors.lab_urin_reduksi_rencana_tindak_lanjut = "Rencana urin reduksi harus diisi";
    }
    // Lab Jiwa - wajib diisi (sebagai lab T3)
    if (!form.tanggal_lab_jiwa?.trim()) errors.tanggal_lab_jiwa = "Tanggal lab harus diisi";
    if (!form.lab_hemoglobin_hasil_jiwa?.toString().trim()) errors.lab_hemoglobin_hasil_jiwa = "Hb hasil (jiwa) harus diisi";
    if (!form.lab_hemoglobin_rencana_tindak_lanjut_jiwa?.trim()) errors.lab_hemoglobin_rencana_tindak_lanjut_jiwa = "Rencana Hb (jiwa) harus diisi";
    if (!form.lab_gula_darah_sewaktu_hasil?.toString().trim()) errors.lab_gula_darah_sewaktu_hasil = "Gula darah hasil harus diisi";
    if (!form.lab_gula_darah_sewaktu_rencana_tindak_lanjut?.trim()) errors.lab_gula_darah_sewaktu_rencana_tindak_lanjut = "Rencana gula darah harus diisi";
    if (!form.lab_golongan_darah_rhesus_hasil?.trim()) errors.lab_golongan_darah_rhesus_hasil = "Golongan darah harus diisi";
    if (!form.lab_golongan_darah_rhesus_rencana_tindak_lanjut?.trim()) errors.lab_golongan_darah_rhesus_rencana_tindak_lanjut = "Rencana golongan darah harus diisi";
    if (!form.lab_hiv_hasil?.trim()) errors.lab_hiv_hasil = "Hasil HIV harus diisi";
    if (!form.lab_hiv_rencana_tindak_lanjut?.trim()) errors.lab_hiv_rencana_tindak_lanjut = "Rencana HIV harus diisi";
    if (!form.lab_sifilis_hasil?.trim()) errors.lab_sifilis_hasil = "Hasil sifilis harus diisi";
    if (!form.lab_sifilis_rencana_tindak_lanjut?.trim()) errors.lab_sifilis_rencana_tindak_lanjut = "Rencana sifilis harus diisi";
    if (!form.lab_hepatitis_b_hasil?.trim()) errors.lab_hepatitis_b_hasil = "Hasil hepatitis B harus diisi";
    if (!form.lab_hepatitis_b_rencana_tindak_lanjut?.trim()) errors.lab_hepatitis_b_rencana_tindak_lanjut = "Rencana hepatitis B harus diisi";
    return errors;
  };

  const validateStep4 = () => {
    const errors = {};
    // Skrining Jiwa Lanjutan
    if (!form.tanggal_skrining_jiwa?.trim()) errors.tanggal_skrining_jiwa = "Tanggal skrining jiwa lanjutan harus diisi";
    if (!form.skrining_jiwa_hasil?.trim()) errors.skrining_jiwa_hasil = "Hasil skrining jiwa lanjutan harus diisi";
    if (!form.skrining_jiwa_tindak_lanjut?.trim()) errors.skrining_jiwa_tindak_lanjut = "Tindak lanjut jiwa lanjutan harus diisi";
    // Skrining Jiwa TR
    if (!form.tanggal_skrining_jiwa_tr?.trim()) errors.tanggal_skrining_jiwa_tr = "Tanggal skrining jiwa TR harus diisi";
    if (!form.skrining_jiwa_hasil_tr?.trim()) errors.skrining_jiwa_hasil_tr = "Hasil skrining jiwa TR harus diisi";
    if (!form.skrining_jiwa_tindak_lanjut_tr?.trim()) errors.skrining_jiwa_tindak_lanjut_tr = "Tindak lanjut jiwa TR harus diisi";
    if (!form.kesimpulan_tr?.trim()) errors.kesimpulan_tr = "Kesimpulan TR harus diisi";
    if (!form.rekomendasi_tr?.trim()) errors.rekomendasi_tr = "Rekomendasi TR harus diisi";
    // Rencana melahirkan & tempat
    if (!form.rencana_proses_melahirkan?.trim()) errors.rencana_proses_melahirkan = "Rencana proses melahirkan harus diisi";
    if (!form.kesimpulan_rekomendasi_tempat_melahirkan?.trim()) errors.kesimpulan_rekomendasi_tempat_melahirkan = "Rekomendasi tempat melahirkan harus diisi";
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
      alert("Mohon lengkapi semua data yang wajib diisi!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateStep4();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      alert("Mohon lengkapi semua data yang wajib diisi!");
      return;
    }

    if (!kehamilan) {
      alert("Data kehamilan tidak ditemukan.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        kehamilan_id: kehamilan.id,
        uk_berdasarkan_usg_trimester_1_minggu: form.uk_berdasarkan_usg_trimester_1_minggu ? parseInt(form.uk_berdasarkan_usg_trimester_1_minggu) : null,
        uk_berdasarkan_hpht_minggu: form.uk_berdasarkan_hpht_minggu ? parseInt(form.uk_berdasarkan_hpht_minggu) : null,
        uk_berdasarkan_biometri_usg_trimester_3_minggu: form.uk_berdasarkan_biometri_usg_trimester_3_minggu ? parseInt(form.uk_berdasarkan_biometri_usg_trimester_3_minggu) : null,
        usg_djj_nilai: form.usg_djj_nilai ? parseInt(form.usg_djj_nilai) : null,
        usg_cairan_ketuban_sdp_cm: form.usg_cairan_ketuban_sdp_cm ? parseFloat(form.usg_cairan_ketuban_sdp_cm) : null,
        biometri_bpd_cm: form.biometri_bpd_cm ? parseFloat(form.biometri_bpd_cm) : null,
        biometri_bpd_minggu: form.biometri_bpd_minggu ? parseInt(form.biometri_bpd_minggu) : null,
        biometri_hc_cm: form.biometri_hc_cm ? parseFloat(form.biometri_hc_cm) : null,
        biometri_hc_minggu: form.biometri_hc_minggu ? parseInt(form.biometri_hc_minggu) : null,
        biometri_ac_cm: form.biometri_ac_cm ? parseFloat(form.biometri_ac_cm) : null,
        biometri_ac_minggu: form.biometri_ac_minggu ? parseInt(form.biometri_ac_minggu) : null,
        biometri_fl_cm: form.biometri_fl_cm ? parseFloat(form.biometri_fl_cm) : null,
        biometri_fl_minggu: form.biometri_fl_minggu ? parseInt(form.biometri_fl_minggu) : null,
        biometri_efw_tbj_gram: form.biometri_efw_tbj_gram ? parseInt(form.biometri_efw_tbj_gram) : null,
        biometri_efw_tbj_minggu: form.biometri_efw_tbj_minggu ? parseInt(form.biometri_efw_tbj_minggu) : null,
        lab_hemoglobin_hasil: form.lab_hemoglobin_hasil ? parseFloat(form.lab_hemoglobin_hasil) : null,
        lab_protein_urin_hasil: form.lab_protein_urin_hasil ? parseInt(form.lab_protein_urin_hasil) : null,
        lab_hemoglobin_hasil_jiwa: form.lab_hemoglobin_hasil_jiwa ? parseFloat(form.lab_hemoglobin_hasil_jiwa) : null,
        lab_gula_darah_sewaktu_hasil: form.lab_gula_darah_sewaktu_hasil ? parseInt(form.lab_gula_darah_sewaktu_hasil) : null,
      };

      if (existingData) {
        await updateDokterT3Complete(existingData.id, payload);
        alert("Data berhasil diperbarui!");
      } else {
        await createDokterT3Complete(payload);
        alert("Data berhasil disimpan!");
      }
      navigate(`/data-ibu/${id}/pemeriksaan-dokter-t3-complete/detail`);
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
            <h2 className="text-xl font-bold text-red-700 mb-2">Data Tidak Ditemukan</h2>
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

  // ── Render helpers ─────────────────────────────────────────────────────
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

  const labReaktifFields = [
    { name: "lab_hiv_hasil", label: "HIV", rencana: "lab_hiv_rencana_tindak_lanjut" },
    { name: "lab_sifilis_hasil", label: "Sifilis", rencana: "lab_sifilis_rencana_tindak_lanjut" },
    { name: "lab_hepatitis_b_hasil", label: "Hepatitis B", rencana: "lab_hepatitis_b_rencana_tindak_lanjut" },
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
    { name: "rencana_kontrasepsi_akdr", label: "AKDR" },
    { name: "rencana_kontrasepsi_pil", label: "Pil" },
    { name: "rencana_kontrasepsi_suntik", label: "Suntik" },
    { name: "rencana_kontrasepsi_steril", label: "Steril / MOW / MOP" },
    { name: "rencana_kontrasepsi_mal", label: "MAL" },
    { name: "rencana_kontrasepsi_implan", label: "Implan" },
    { name: "rencana_kontrasepsi_belum_memilih", label: "Belum Memilih" },
  ];

  const stepTitles = [
    "Data Dokter & Pemeriksaan Fisik",
    "USG Trimester 3 & Biometri Janin",
    "Pemeriksaan Laboratorium",
    "Skrining Jiwa & Rencana Lanjutan"
  ];

  const stepIcons = [User, Eye, FlaskConical, Brain];
  const stepColors = ["indigo", "violet", "amber", "rose"];

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
            <p className="text-sm text-gray-500 mt-0.5">
              {stepTitles[currentStep - 1]}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              const Icon = stepIcons[step - 1];
              const color = stepColors[step - 1];

              const bgColor = isActive
                ? `bg-${color}-500 text-white shadow-lg scale-110`
                : isCompleted
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-500";

              const titleColor = isActive ? `text-${color}-600` : isCompleted ? "text-emerald-600" : "text-gray-500";

              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${bgColor} mb-2`}>
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={18} />}
                  </div>
                  <p className={`text-xs font-semibold text-center ${titleColor} transition`}>
                    {step === 1 ? "Dokter & Fisik" : step === 2 ? "USG & Biometri" : step === 3 ? "Lab" : "Skrining & Rencana"}
                  </p>
                  {step < 4 && (
                    <div className={`h-1 mt-3 flex-1 transition ${isCompleted ? "bg-emerald-500" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1: Data Dokter & Pemeriksaan Fisik */}
          {currentStep === 1 && (
            <>
              <Section icon={User} title="Data Dokter & Anamnesis" color="indigo">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="Nama Dokter">
                    <input name="nama_dokter" value={form.nama_dokter} onChange={handleChange} placeholder="dr. Nama Dokter" className={inputCls} readOnly />
                    <p className="text-xs text-gray-400 mt-1">Diambil dari data login</p>
                  </Field>
                  <Field label="Tanggal Periksa">
                    <input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.tanggal_periksa ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.tanggal_periksa} />
                  </Field>
                  <Field label="Konsep Anamnesa" colSpan="sm:col-span-2 md:col-span-1">
                    <textarea name="konsep_anamnesa_pemeriksaan" value={form.konsep_anamnesa_pemeriksaan} onChange={handleChange}
                      placeholder="Tulis anamnesa pemeriksaan..." className={`${inputCls} ${validationErrors.konsep_anamnesa_pemeriksaan ? "border-red-500 bg-red-50" : ""}`} rows={3} />
                    <ErrorMessage message={validationErrors.konsep_anamnesa_pemeriksaan} />
                  </Field>
                </div>
              </Section>

              <Section icon={Activity} title="Pemeriksaan Fisik" color="teal">
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
                          validationErrors[field.name]
                            ? "border-red-500 bg-red-50"
                            : form[field.name] === "Abnormal"
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Abnormal">Abnormal</option>
                      </select>
                      <ErrorMessage message={validationErrors[field.name]} />
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* STEP 2: USG T3 & Biometri */}
          {currentStep === 2 && (
            <Section icon={Eye} title="USG Trimester 3 & Biometri Janin" color="violet" defaultOpen={true}>
              {/* Status USG */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Status USG</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="USG Dilakukan?">
                    <select name="usg_trimester_3_dilakukan" value={form.usg_trimester_3_dilakukan} onChange={handleChange}
                      className={`${selectCls} ${form.usg_trimester_3_dilakukan === "Tidak" ? "border-amber-300 bg-amber-50 text-amber-700" : ""}`}>
                      <option value="Ya">Ya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </Field>
                  {form.usg_trimester_3_dilakukan === "Ya" && (
                    <>
                      <Field label="UK HPHT (minggu)">
                        <input type="number" name="uk_berdasarkan_hpht_minggu" value={form.uk_berdasarkan_hpht_minggu} onChange={handleChange} placeholder="0"
                          className={`${inputCls} ${validationErrors.uk_berdasarkan_hpht_minggu ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.uk_berdasarkan_hpht_minggu} />
                      </Field>
                      <Field label="UK Biometri T3 (minggu)">
                        <input type="number" name="uk_berdasarkan_biometri_usg_trimester_3_minggu" value={form.uk_berdasarkan_biometri_usg_trimester_3_minggu} onChange={handleChange} placeholder="0" className={inputCls} />
                      </Field>
                      <Field label="Selisih ≥3 Minggu?">
                        <select name="selisih_uk_3_minggu_atau_lebih" value={form.selisih_uk_3_minggu_atau_lebih} onChange={handleChange}
                          className={`${selectCls} ${form.selisih_uk_3_minggu_atau_lebih === "Ya" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                          <option value="Tidak">Tidak</option>
                          <option value="Ya">Ya</option>
                        </select>
                      </Field>
                    </>
                  )}
                </div>
              </div>

              {form.usg_trimester_3_dilakukan === "Ya" && (
                <>
                  {/* Kondisi Bayi */}
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Kondisi Bayi</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Field label="Jumlah Bayi">
                        <input name="usg_jumlah_bayi" value={form.usg_jumlah_bayi} onChange={handleChange} placeholder="1"
                          className={`${inputCls} ${validationErrors.usg_jumlah_bayi ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.usg_jumlah_bayi} />
                      </Field>
                      <Field label="Letak Bayi">
                        <input name="usg_letak_bayi" value={form.usg_letak_bayi} onChange={handleChange} placeholder="Kepala / Sungsang"
                          className={`${inputCls} ${validationErrors.usg_letak_bayi ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.usg_letak_bayi} />
                      </Field>
                      <Field label="Presentasi Bayi">
                        <input name="usg_presentasi_bayi" value={form.usg_presentasi_bayi} onChange={handleChange} placeholder="Vertex / dll"
                          className={`${inputCls} ${validationErrors.usg_presentasi_bayi ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.usg_presentasi_bayi} />
                      </Field>
                      <Field label="Keadaan Bayi">
                        <input name="usg_keadaan_bayi" value={form.usg_keadaan_bayi} onChange={handleChange} placeholder="Hidup / Meninggal"
                          className={`${inputCls} ${validationErrors.usg_keadaan_bayi ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.usg_keadaan_bayi} />
                      </Field>
                      <Field label="DJJ (x/menit)">
                        <input type="number" name="usg_djj_nilai" value={form.usg_djj_nilai} onChange={handleChange} placeholder="140"
                          className={`${inputCls} ${validationErrors.usg_djj_nilai ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.usg_djj_nilai} />
                      </Field>
                      <Field label="Status DJJ">
                        <select name="usg_djj_status" value={form.usg_djj_status} onChange={handleChange}
                          className={`${selectCls} ${form.usg_djj_status === "Abnormal" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
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
                      <Field label="Lokasi Plasenta">
                        <input name="usg_lokasi_plasenta" value={form.usg_lokasi_plasenta} onChange={handleChange} placeholder="Anterior / Posterior"
                          className={`${inputCls} ${validationErrors.usg_lokasi_plasenta ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.usg_lokasi_plasenta} />
                      </Field>
                      <Field label="Cairan Ketuban SDP (cm)">
                        <input type="number" step="0.1" name="usg_cairan_ketuban_sdp_cm" value={form.usg_cairan_ketuban_sdp_cm} onChange={handleChange} placeholder="0.0"
                          className={`${inputCls} ${validationErrors.usg_cairan_ketuban_sdp_cm ? "border-red-500 bg-red-50" : ""}`} />
                        <ErrorMessage message={validationErrors.usg_cairan_ketuban_sdp_cm} />
                      </Field>
                      <Field label="Status Ketuban">
                        <select name="usg_cairan_ketuban_status" value={form.usg_cairan_ketuban_status} onChange={handleChange}
                          className={`${selectCls} ${form.usg_cairan_ketuban_status !== "Normal" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                          <option value="Normal">Normal</option>
                          <option value="Oligohidramnion">Oligohidramnion</option>
                          <option value="Polihidramnion">Polihidramnion</option>
                        </select>
                      </Field>
                    </div>
                  </div>

                  {/* Biometri Janin */}
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
                            { label: "BPD", cm: "biometri_bpd_cm", minggu: "biometri_bpd_minggu", cmLabel: "cm" },
                            { label: "HC", cm: "biometri_hc_cm", minggu: "biometri_hc_minggu", cmLabel: "cm" },
                            { label: "AC", cm: "biometri_ac_cm", minggu: "biometri_ac_minggu", cmLabel: "cm" },
                            { label: "FL", cm: "biometri_fl_cm", minggu: "biometri_fl_minggu", cmLabel: "cm" },
                            { label: "EFW/TBJ", cm: "biometri_efw_tbj_gram", minggu: "biometri_efw_tbj_minggu", cmLabel: "gram" },
                          ].map((row, idx) => (
                            <tr key={row.cm} className={idx % 2 === 1 ? "bg-gray-50/50" : ""}>
                              <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <input type="number" step="0.1" name={row.cm} value={form[row.cm]} onChange={handleChange} placeholder="0"
                                    className={`${inputCls} ${validationErrors[row.cm] ? "border-red-500 bg-red-50" : ""}`} />
                                  <span className="text-xs text-gray-400 whitespace-nowrap">{row.cmLabel}</span>
                                </div>
                                <ErrorMessage message={validationErrors[row.cm]} />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <input type="number" name={row.minggu} value={form[row.minggu]} onChange={handleChange} placeholder="0" className={inputCls} />
                                  <span className="text-xs text-gray-400 whitespace-nowrap">mg</span>
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
                    <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Temuan Abnormal</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Field label="Kecurigaan Abnormal">
                        <select name="usg_kecurigaan_temuan_abnormal" value={form.usg_kecurigaan_temuan_abnormal} onChange={handleChange}
                          className={`${selectCls} ${validationErrors.usg_kecurigaan_temuan_abnormal ? "border-red-500 bg-red-50" : form.usg_kecurigaan_temuan_abnormal === "Ya" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                          <option value="Tidak">Tidak</option>
                          <option value="Ya">Ya</option>
                        </select>
                        <ErrorMessage message={validationErrors.usg_kecurigaan_temuan_abnormal} />
                      </Field>
                      {form.usg_kecurigaan_temuan_abnormal === "Ya" && (
                        <Field label="Keterangan Abnormal" colSpan="sm:col-span-3">
                          <input name="usg_keterangan_temuan_abnormal" value={form.usg_keterangan_temuan_abnormal} onChange={handleChange} placeholder="Jelaskan temuan..."
                            className={`${inputCls} border-red-200 ${validationErrors.usg_keterangan_temuan_abnormal ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.usg_keterangan_temuan_abnormal} />
                        </Field>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Catatan USG */}
              <div>
                <Field label="Hasil USG / Catatan Tambahan">
                  <textarea name="hasil_usg_catatan" value={form.hasil_usg_catatan} onChange={handleChange} placeholder="Tuliskan catatan hasil USG..." rows={3} className={inputCls} />
                </Field>
              </div>
            </Section>
          )}

          {/* STEP 3: Pemeriksaan Laboratorium */}
          {currentStep === 3 && (
            <Section icon={FlaskConical} title="Pemeriksaan Laboratorium" color="amber" defaultOpen={true}>
              {/* Laboratorium Lanjutan */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Laboratorium Lanjutan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <Field label="Tanggal Lab">
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
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700">Hemoglobin</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <input type="number" step="0.1" name="lab_hemoglobin_hasil" value={form.lab_hemoglobin_hasil} onChange={handleChange} placeholder="0.0"
                              className={`${inputCls} ${validationErrors.lab_hemoglobin_hasil ? "border-red-500 bg-red-50" : ""}`} />
                            <span className="text-xs text-gray-400">g/dL</span>
                          </div>
                          <ErrorMessage message={validationErrors.lab_hemoglobin_hasil} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_hemoglobin_rencana_tindak_lanjut" value={form.lab_hemoglobin_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..."
                            className={`${inputCls} ${validationErrors.lab_hemoglobin_rencana_tindak_lanjut ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_hemoglobin_rencana_tindak_lanjut} />
                        </td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-700">Protein Urin</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <input type="number" name="lab_protein_urin_hasil" value={form.lab_protein_urin_hasil} onChange={handleChange} placeholder="0"
                              className={`${inputCls} ${validationErrors.lab_protein_urin_hasil ? "border-red-500 bg-red-50" : ""}`} />
                            <span className="text-xs text-gray-400">mg/dL</span>
                          </div>
                          <ErrorMessage message={validationErrors.lab_protein_urin_hasil} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_protein_urin_rencana_tindak_lanjut" value={form.lab_protein_urin_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..."
                            className={`${inputCls} ${validationErrors.lab_protein_urin_rencana_tindak_lanjut ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_protein_urin_rencana_tindak_lanjut} />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700">Urin Reduksi</td>
                        <td className="px-4 py-3">
                          <input name="lab_urin_reduksi_hasil" value={form.lab_urin_reduksi_hasil} onChange={handleChange} placeholder="Negatif / Positif"
                            className={`${inputCls} ${validationErrors.lab_urin_reduksi_hasil ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_urin_reduksi_hasil} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_urin_reduksi_rencana_tindak_lanjut" value={form.lab_urin_reduksi_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..."
                            className={`${inputCls} ${validationErrors.lab_urin_reduksi_rencana_tindak_lanjut ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_urin_reduksi_rencana_tindak_lanjut} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Laboratorium Jiwa (T3) */}
              <div>
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Laboratorium Trimester 3 (Jiwa)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Tanggal Lab">
                    <input type="date" name="tanggal_lab_jiwa" value={form.tanggal_lab_jiwa} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.tanggal_lab_jiwa ? "border-red-500 bg-red-50" : ""}`} />
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
                            <input type="number" step="0.1" name="lab_hemoglobin_hasil_jiwa" value={form.lab_hemoglobin_hasil_jiwa} onChange={handleChange} placeholder="0.0"
                              className={`${inputCls} ${validationErrors.lab_hemoglobin_hasil_jiwa ? "border-red-500 bg-red-50" : ""}`} />
                            <span className="text-xs text-gray-400">g/dL</span>
                          </div>
                          <ErrorMessage message={validationErrors.lab_hemoglobin_hasil_jiwa} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_hemoglobin_rencana_tindak_lanjut_jiwa" value={form.lab_hemoglobin_rencana_tindak_lanjut_jiwa} onChange={handleChange} placeholder="Rencana..."
                            className={`${inputCls} ${validationErrors.lab_hemoglobin_rencana_tindak_lanjut_jiwa ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_hemoglobin_rencana_tindak_lanjut_jiwa} />
                        </td>
                      </tr>
                      <tr className="bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-700">Gula Darah Sewaktu</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <input type="number" name="lab_gula_darah_sewaktu_hasil" value={form.lab_gula_darah_sewaktu_hasil} onChange={handleChange} placeholder="0"
                              className={`${inputCls} ${validationErrors.lab_gula_darah_sewaktu_hasil ? "border-red-500 bg-red-50" : ""}`} />
                            <span className="text-xs text-gray-400">mg/dL</span>
                          </div>
                          <ErrorMessage message={validationErrors.lab_gula_darah_sewaktu_hasil} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_gula_darah_sewaktu_rencana_tindak_lanjut" value={form.lab_gula_darah_sewaktu_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..."
                            className={`${inputCls} ${validationErrors.lab_gula_darah_sewaktu_rencana_tindak_lanjut ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_gula_darah_sewaktu_rencana_tindak_lanjut} />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-700">Golongan Darah & Rhesus</td>
                        <td className="px-4 py-3">
                          <input name="lab_golongan_darah_rhesus_hasil" value={form.lab_golongan_darah_rhesus_hasil} onChange={handleChange} placeholder="A+ / B- / dll"
                            className={`${inputCls} ${validationErrors.lab_golongan_darah_rhesus_hasil ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_golongan_darah_rhesus_hasil} />
                        </td>
                        <td className="px-4 py-3">
                          <input name="lab_golongan_darah_rhesus_rencana_tindak_lanjut" value={form.lab_golongan_darah_rhesus_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..."
                            className={`${inputCls} ${validationErrors.lab_golongan_darah_rhesus_rencana_tindak_lanjut ? "border-red-500 bg-red-50" : ""}`} />
                          <ErrorMessage message={validationErrors.lab_golongan_darah_rhesus_rencana_tindak_lanjut} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Tabel Reaktif */}
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
                              className={`${selectCls} ${validationErrors[lf.name] ? "border-red-500 bg-red-50" : form[lf.name] === "Reaktif" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                              <option value="NonReaktif">Non Reaktif</option>
                              <option value="Reaktif">Reaktif</option>
                            </select>
                            <ErrorMessage message={validationErrors[lf.name]} />
                          </td>
                          <td className="px-4 py-3">
                            <input name={lf.rencana} value={form[lf.rencana]} onChange={handleChange} placeholder="Rencana..."
                              className={`${inputCls} ${validationErrors[lf.rencana] ? "border-red-500 bg-red-50" : ""}`} />
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

          {/* STEP 4: Skrining Jiwa & Rencana Lanjutan */}
          {currentStep === 4 && (
            <Section icon={Brain} title="Skrining Jiwa & Rencana Tindak Lanjut" color="rose" defaultOpen={true}>
              {/* Skrining Jiwa Lanjutan */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Skrining Jiwa (Lanjutan)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Tanggal Skrining">
                    <input type="date" name="tanggal_skrining_jiwa" value={form.tanggal_skrining_jiwa} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.tanggal_skrining_jiwa ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.tanggal_skrining_jiwa} />
                  </Field>
                  <Field label="Hasil">
                    <input name="skrining_jiwa_hasil" value={form.skrining_jiwa_hasil} onChange={handleChange} placeholder="Hasil skrining..."
                      className={`${inputCls} ${validationErrors.skrining_jiwa_hasil ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.skrining_jiwa_hasil} />
                  </Field>
                  <Field label="Tindak Lanjut">
                    <input name="skrining_jiwa_tindak_lanjut" value={form.skrining_jiwa_tindak_lanjut} onChange={handleChange} placeholder="Tindak lanjut..."
                      className={`${inputCls} ${validationErrors.skrining_jiwa_tindak_lanjut ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.skrining_jiwa_tindak_lanjut} />
                  </Field>
                  <Field label="Perlu Rujukan?">
                    <select name="skrining_jiwa_perlu_rujukan" value={form.skrining_jiwa_perlu_rujukan} onChange={handleChange}
                      className={`${selectCls} ${form.skrining_jiwa_perlu_rujukan === "Ya" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Skrining Jiwa TR */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Skrining Jiwa (TR)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Tanggal Skrining TR">
                    <input type="date" name="tanggal_skrining_jiwa_tr" value={form.tanggal_skrining_jiwa_tr} onChange={handleChange}
                      className={`${inputCls} ${validationErrors.tanggal_skrining_jiwa_tr ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.tanggal_skrining_jiwa_tr} />
                  </Field>
                  <Field label="Hasil TR">
                    <input name="skrining_jiwa_hasil_tr" value={form.skrining_jiwa_hasil_tr} onChange={handleChange} placeholder="Hasil..."
                      className={`${inputCls} ${validationErrors.skrining_jiwa_hasil_tr ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.skrining_jiwa_hasil_tr} />
                  </Field>
                  <Field label="Tindak Lanjut TR">
                    <input name="skrining_jiwa_tindak_lanjut_tr" value={form.skrining_jiwa_tindak_lanjut_tr} onChange={handleChange} placeholder="Tindak lanjut..."
                      className={`${inputCls} ${validationErrors.skrining_jiwa_tindak_lanjut_tr ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.skrining_jiwa_tindak_lanjut_tr} />
                  </Field>
                  <Field label="Perlu Rujukan TR">
                    <select name="skrining_jiwa_perlu_rujukan_tr" value={form.skrining_jiwa_perlu_rujukan_tr} onChange={handleChange}
                      className={`${selectCls} ${form.skrining_jiwa_perlu_rujukan_tr === "Ya" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Field label="Kesimpulan TR">
                    <textarea name="kesimpulan_tr" value={form.kesimpulan_tr} onChange={handleChange} placeholder="Kesimpulan..."
                      className={`${inputCls} ${validationErrors.kesimpulan_tr ? "border-red-500 bg-red-50" : ""}`} rows={3} />
                    <ErrorMessage message={validationErrors.kesimpulan_tr} />
                  </Field>
                  <Field label="Rekomendasi TR">
                    <textarea name="rekomendasi_tr" value={form.rekomendasi_tr} onChange={handleChange} placeholder="Rekomendasi..."
                      className={`${inputCls} ${validationErrors.rekomendasi_tr ? "border-red-500 bg-red-50" : ""}`} rows={3} />
                    <ErrorMessage message={validationErrors.rekomendasi_tr} />
                  </Field>
                </div>
              </div>

              {/* Rencana Konsultasi */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Rencana Konsultasi</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                  {konsultasiFields.map((item) => (
                    <label key={item.name} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer transition ${form[item.name] ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} className="rounded" />
                      {item.label}
                    </label>
                  ))}
                </div>
                <Field label="Konsultasi Lain-lain">
                  <input name="rencana_konsultasi_lain_lain" value={form.rencana_konsultasi_lain_lain} onChange={handleChange} placeholder="Tuliskan konsultasi lainnya..." className={inputCls} />
                </Field>
              </div>

              {/* Rencana Persalinan & Kontrasepsi */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Rencana Persalinan & Kontrasepsi Pasca Persalinan</h3>
                <div className="mb-3">
                  <Field label="Rencana Proses Melahirkan">
                    <input name="rencana_proses_melahirkan" value={form.rencana_proses_melahirkan} onChange={handleChange} placeholder="Normal / SC / dll"
                      className={`${inputCls} ${validationErrors.rencana_proses_melahirkan ? "border-red-500 bg-red-50" : ""}`} />
                    <ErrorMessage message={validationErrors.rencana_proses_melahirkan} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {kontrasepsiFields.map((item) => (
                    <label key={item.name} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border cursor-pointer transition ${form[item.name] ? "bg-teal-50 border-teal-300 text-teal-700 font-medium" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} className="rounded" />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Konseling & Penjelasan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Kebutuhan Konseling">
                  <select name="kebutuhan_konseling" value={form.kebutuhan_konseling} onChange={handleChange}
                    className={`${selectCls} ${form.kebutuhan_konseling === "Ya" ? "border-amber-300 bg-amber-50 text-amber-700" : ""}`}>
                    <option value="Tidak">Tidak</option>
                    <option value="Ya">Ya</option>
                  </select>
                </Field>
                <Field label="Rekomendasi Tempat Melahirkan">
                  <input name="kesimpulan_rekomendasi_tempat_melahirkan" value={form.kesimpulan_rekomendasi_tempat_melahirkan} onChange={handleChange} placeholder="RS / Puskesmas / Klinik"
                    className={`${inputCls} ${validationErrors.kesimpulan_rekomendasi_tempat_melahirkan ? "border-red-500 bg-red-50" : ""}`} />
                  <ErrorMessage message={validationErrors.kesimpulan_rekomendasi_tempat_melahirkan} />
                </Field>
                <Field label="Penjelasan" colSpan="sm:col-span-2">
                  <textarea name="penjelasan" value={form.penjelasan} onChange={handleChange} placeholder="Tuliskan penjelasan kepada pasien..."
                    className={`${inputCls} ${validationErrors.penjelasan ? "border-red-500 bg-red-50" : ""}`} rows={3} />
                  <ErrorMessage message={validationErrors.penjelasan} />
                </Field>
              </div>
            </Section>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 pb-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              Batalkan
            </button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
                >
                  <ChevronLeft size={16} />
                  Sebelumnya
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                >
                  Selanjutnya
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                >
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