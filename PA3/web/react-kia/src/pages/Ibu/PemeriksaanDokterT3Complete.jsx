// src/pages/Ibu/PemeriksaanDokterT3Complete.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
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
  Baby,
  Ruler,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
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
    orange: "bg-orange-50 text-orange-700 border-orange-200",
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

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function PemeriksaanDokterT3Complete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kehamilan, setKehamilan] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const initialState = {
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
    // USG T3
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
    // Biometri
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
    // Lanjutan T3
    hasil_usg_catatan: "",
    tanggal_lab: "",
    lab_hemoglobin_hasil: "",
    lab_hemoglobin_rencana_tindak_lanjut: "",
    lab_protein_urin_hasil: "",
    lab_protein_urin_rencana_tindak_lanjut: "",
    lab_urin_reduksi_hasil: "",
    lab_urin_reduksi_rencana_tindak_lanjut: "",
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
          setForm((prev) => ({ ...prev, kehamilan_id: aktif.id }));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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

  // ── Loading state ────────────────────────────────────────────────────────
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
              <Link to={`/data-ibu/${id}/edit`} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                Tambah Data Kehamilan
              </Link>
              <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                Kembali
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {existingData ? "Edit" : "Tambah"} Pemeriksaan Dokter Trimester 3
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Pemeriksaan fisik, USG, biometri, lanjutan, dan laboratorium trimester 3
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ══ SEKSI 1: Data Dokter ══ */}
          <Section icon={User} title="Data Dokter & Anamnesis" color="indigo">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Nama Dokter">
                <input name="nama_dokter" value={form.nama_dokter} onChange={handleChange} placeholder="dr. Nama Dokter" className={inputCls} />
              </Field>
              <Field label="Tanggal Periksa">
                <input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Konsep Anamnesa" colSpan="sm:col-span-2 md:col-span-1">
                <textarea name="konsep_anamnesa_pemeriksaan" value={form.konsep_anamnesa_pemeriksaan} onChange={handleChange} placeholder="Tulis anamnesa pemeriksaan..." className={inputCls} rows={3} />
              </Field>
            </div>
          </Section>

          {/* ══ SEKSI 2: Pemeriksaan Fisik ══ */}
          <Section icon={Activity} title="Pemeriksaan Fisik" color="teal">
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2 font-medium">Ringkasan Status Fisik</p>
              <div className="flex flex-wrap gap-2">
                {fisikFields.map((f) => (
                  <span key={f.name} className="text-xs text-gray-600">
                    <span className="font-medium">{f.label}:</span>{" "}
                    {form[f.name] === "Normal"
                      ? <span className="text-emerald-600 font-semibold">✓</span>
                      : <span className="text-red-500 font-semibold">!</span>
                    }
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
                    className={`${selectCls} ${form[field.name] === "Abnormal" ? "border-red-300 bg-red-50 text-red-700" : ""}`}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                  </select>
                </div>
              ))}
            </div>
          </Section>

          {/* ══ SEKSI 3: USG T3 ══ */}
          <Section icon={Eye} title="USG Trimester 3" color="violet">
            {/* Sub: Status USG */}
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
                <Field label="UK USG T1 (minggu)">
                  <input type="number" name="uk_berdasarkan_usg_trimester_1_minggu" value={form.uk_berdasarkan_usg_trimester_1_minggu} onChange={handleChange} placeholder="0" className={inputCls} />
                </Field>
                <Field label="UK HPHT (minggu)">
                  <input type="number" name="uk_berdasarkan_hpht_minggu" value={form.uk_berdasarkan_hpht_minggu} onChange={handleChange} placeholder="0" className={inputCls} />
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
              </div>
            </div>

            {/* Sub: Kondisi Bayi */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Kondisi Bayi</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Jumlah Bayi">
                  <input name="usg_jumlah_bayi" value={form.usg_jumlah_bayi} onChange={handleChange} placeholder="1" className={inputCls} />
                </Field>
                <Field label="Letak Bayi">
                  <input name="usg_letak_bayi" value={form.usg_letak_bayi} onChange={handleChange} placeholder="Kepala / Sungsang" className={inputCls} />
                </Field>
                <Field label="Presentasi Bayi">
                  <input name="usg_presentasi_bayi" value={form.usg_presentasi_bayi} onChange={handleChange} placeholder="Vertex / dll" className={inputCls} />
                </Field>
                <Field label="Keadaan Bayi">
                  <input name="usg_keadaan_bayi" value={form.usg_keadaan_bayi} onChange={handleChange} placeholder="Hidup / Meninggal" className={inputCls} />
                </Field>
                <Field label="DJJ (x/menit)">
                  <input type="number" name="usg_djj_nilai" value={form.usg_djj_nilai} onChange={handleChange} placeholder="140" className={inputCls} />
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

            {/* Sub: Plasenta & Ketuban */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Plasenta & Cairan Ketuban</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Lokasi Plasenta">
                  <input name="usg_lokasi_plasenta" value={form.usg_lokasi_plasenta} onChange={handleChange} placeholder="Anterior / Posterior" className={inputCls} />
                </Field>
                <Field label="Cairan Ketuban SDP (cm)">
                  <input type="number" step="0.1" name="usg_cairan_ketuban_sdp_cm" value={form.usg_cairan_ketuban_sdp_cm} onChange={handleChange} placeholder="0.0" className={inputCls} />
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

            {/* Sub: Kecurigaan */}
            <div>
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Temuan Abnormal</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Kecurigaan Abnormal">
                  <select name="usg_kecurigaan_temuan_abnormal" value={form.usg_kecurigaan_temuan_abnormal} onChange={handleChange}
                    className={`${selectCls} ${form.usg_kecurigaan_temuan_abnormal === "Ya" ? "border-red-300 bg-red-50 text-red-700" : ""}`}>
                    <option value="Tidak">Tidak</option>
                    <option value="Ya">Ya</option>
                  </select>
                </Field>
                {form.usg_kecurigaan_temuan_abnormal === "Ya" && (
                  <Field label="Keterangan Abnormal" colSpan="sm:col-span-3">
                    <input name="usg_keterangan_temuan_abnormal" value={form.usg_keterangan_temuan_abnormal} onChange={handleChange} placeholder="Jelaskan temuan..." className={`${inputCls} border-red-200`} />
                  </Field>
                )}
              </div>
            </div>
          </Section>

          {/* ══ SEKSI 4: Biometri Janin ══ */}
          <Section icon={Ruler} title="Biometri Janin" color="cyan">
            <div className="rounded-xl border border-cyan-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cyan-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-cyan-700 uppercase tracking-wide">Parameter</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-cyan-700 uppercase tracking-wide">Nilai (cm / gram)</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-cyan-700 uppercase tracking-wide">Setara (minggu)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-50">
                  {[
                    { label: "BPD (Biparietal Diameter)", cm: "biometri_bpd_cm", minggu: "biometri_bpd_minggu", cmLabel: "cm", step: "0.1" },
                    { label: "HC (Head Circumference)", cm: "biometri_hc_cm", minggu: "biometri_hc_minggu", cmLabel: "cm", step: "0.1" },
                    { label: "AC (Abdominal Circumference)", cm: "biometri_ac_cm", minggu: "biometri_ac_minggu", cmLabel: "cm", step: "0.1" },
                    { label: "FL (Femur Length)", cm: "biometri_fl_cm", minggu: "biometri_fl_minggu", cmLabel: "cm", step: "0.1" },
                    { label: "EFW / TBJ (Est. Fetal Weight)", cm: "biometri_efw_tbj_gram", minggu: "biometri_efw_tbj_minggu", cmLabel: "gram", step: "1" },
                  ].map((row, idx) => (
                    <tr key={row.cm} className={idx % 2 === 1 ? "bg-gray-50/50" : ""}>
                      <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input type="number" step={row.step} name={row.cm} value={form[row.cm]} onChange={handleChange} placeholder="0" className={inputCls} />
                          <span className="text-xs text-gray-400 whitespace-nowrap">{row.cmLabel}</span>
                        </div>
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
          </Section>

          {/* ══ SEKSI 5: Lanjutan T3 ══ */}
          <Section icon={ClipboardList} title="Lanjutan Trimester 3 (Lab, Konsultasi, Kontrasepsi)" color="orange">
            {/* Catatan USG */}
            <div className="mb-5">
              <Field label="Hasil USG / Catatan Tambahan">
                <textarea name="hasil_usg_catatan" value={form.hasil_usg_catatan} onChange={handleChange} placeholder="Tuliskan catatan hasil USG..." rows={3} className={inputCls} />
              </Field>
            </div>

            {/* Lab Lanjutan */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Laboratorium Lanjutan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <Field label="Tanggal Lab">
                  <input type="date" name="tanggal_lab" value={form.tanggal_lab} onChange={handleChange} className={inputCls} />
                </Field>
              </div>
              <div className="rounded-xl border border-orange-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-bold text-orange-700 uppercase tracking-wide w-1/3">Pemeriksaan</th>
                      <th className="text-left px-4 py-2 text-xs font-bold text-orange-700 uppercase tracking-wide w-1/3">Hasil</th>
                      <th className="text-left px-4 py-2 text-xs font-bold text-orange-700 uppercase tracking-wide w-1/3">Rencana Tindak Lanjut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50">
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Hemoglobin</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input type="number" step="0.1" name="lab_hemoglobin_hasil" value={form.lab_hemoglobin_hasil} onChange={handleChange} placeholder="0.0" className={inputCls} />
                          <span className="text-xs text-gray-400 whitespace-nowrap">g/dL</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input name="lab_hemoglobin_rencana_tindak_lanjut" value={form.lab_hemoglobin_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..." className={inputCls} />
                      </td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-700">Protein Urin</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input type="number" name="lab_protein_urin_hasil" value={form.lab_protein_urin_hasil} onChange={handleChange} placeholder="0" className={inputCls} />
                          <span className="text-xs text-gray-400 whitespace-nowrap">mg/dL</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input name="lab_protein_urin_rencana_tindak_lanjut" value={form.lab_protein_urin_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..." className={inputCls} />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Urin Reduksi</td>
                      <td className="px-4 py-3">
                        <input name="lab_urin_reduksi_hasil" value={form.lab_urin_reduksi_hasil} onChange={handleChange} placeholder="Negatif / Positif" className={inputCls} />
                      </td>
                      <td className="px-4 py-3">
                        <input name="lab_urin_reduksi_rencana_tindak_lanjut" value={form.lab_urin_reduksi_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..." className={inputCls} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Skrining Jiwa Lanjutan */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Skrining Jiwa (Lanjutan)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Tanggal Skrining Jiwa">
                  <input type="date" name="tanggal_skrining_jiwa" value={form.tanggal_skrining_jiwa} onChange={handleChange} className={inputCls} />
                </Field>
                <Field label="Hasil">
                  <input name="skrining_jiwa_hasil" value={form.skrining_jiwa_hasil} onChange={handleChange} placeholder="Hasil skrining..." className={inputCls} />
                </Field>
                <Field label="Tindak Lanjut">
                  <input name="skrining_jiwa_tindak_lanjut" value={form.skrining_jiwa_tindak_lanjut} onChange={handleChange} placeholder="Tindak lanjut..." className={inputCls} />
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

            {/* Rencana Konsultasi */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Rencana Konsultasi</h3>
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
              <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">Rencana Persalinan & Kontrasepsi Pasca Persalinan</h3>
              <div className="mb-3">
                <Field label="Rencana Proses Melahirkan">
                  <input name="rencana_proses_melahirkan" value={form.rencana_proses_melahirkan} onChange={handleChange} placeholder="Normal / SC / dll" className={inputCls} />
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
                <input name="kesimpulan_rekomendasi_tempat_melahirkan" value={form.kesimpulan_rekomendasi_tempat_melahirkan} onChange={handleChange} placeholder="RS / Puskesmas / Klinik" className={inputCls} />
              </Field>
              <Field label="Penjelasan" colSpan="sm:col-span-2">
                <textarea name="penjelasan" value={form.penjelasan} onChange={handleChange} placeholder="Tuliskan penjelasan kepada pasien..." rows={3} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ══ SEKSI 6: Lab Jiwa T3 ══ */}
          <Section icon={FlaskConical} title="Pemeriksaan Laboratorium Trimester 3" color="amber">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Tanggal Lab">
                <input type="date" name="tanggal_lab_jiwa" value={form.tanggal_lab_jiwa} onChange={handleChange} className={inputCls} />
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
                        <input type="number" step="0.1" name="lab_hemoglobin_hasil_jiwa" value={form.lab_hemoglobin_hasil_jiwa} onChange={handleChange} placeholder="0.0" className={inputCls} />
                        <span className="text-xs text-gray-400 whitespace-nowrap">g/dL</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input name="lab_hemoglobin_rencana_tindak_lanjut_jiwa" value={form.lab_hemoglobin_rencana_tindak_lanjut_jiwa} onChange={handleChange} placeholder="Rencana..." className={inputCls} />
                    </td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">Gula Darah Sewaktu</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input type="number" name="lab_gula_darah_sewaktu_hasil" value={form.lab_gula_darah_sewaktu_hasil} onChange={handleChange} placeholder="0" className={inputCls} />
                        <span className="text-xs text-gray-400 whitespace-nowrap">mg/dL</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input name="lab_gula_darah_sewaktu_rencana_tindak_lanjut" value={form.lab_gula_darah_sewaktu_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..." className={inputCls} />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Golongan Darah & Rhesus</td>
                    <td className="px-4 py-3">
                      <input name="lab_golongan_darah_rhesus_hasil" value={form.lab_golongan_darah_rhesus_hasil} onChange={handleChange} placeholder="A+ / B- / dll" className={inputCls} />
                    </td>
                    <td className="px-4 py-3">
                      <input name="lab_golongan_darah_rhesus_rencana_tindak_lanjut" value={form.lab_golongan_darah_rhesus_rencana_tindak_lanjut} onChange={handleChange} placeholder="Rencana..." className={inputCls} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabel reaktif */}
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
                          className={`${selectCls} ${form[lf.name] === "Reaktif" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                          <option value="NonReaktif">Non Reaktif</option>
                          <option value="Reaktif">Reaktif</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input name={lf.rencana} value={form[lf.rencana]} onChange={handleChange} placeholder="Rencana..." className={inputCls} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ══ SEKSI 7: Skrining Jiwa T3 ══ */}
          <Section icon={Brain} title="Skrining Jiwa & Kesimpulan Trimester 3" color="rose">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Tanggal Skrining Jiwa">
                <input type="date" name="tanggal_skrining_jiwa_tr" value={form.tanggal_skrining_jiwa_tr} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Hasil Skrining Jiwa">
                <input name="skrining_jiwa_hasil_tr" value={form.skrining_jiwa_hasil_tr} onChange={handleChange} placeholder="Tuliskan hasil..." className={inputCls} />
              </Field>
              <Field label="Tindak Lanjut">
                <input name="skrining_jiwa_tindak_lanjut_tr" value={form.skrining_jiwa_tindak_lanjut_tr} onChange={handleChange} placeholder="Tindak lanjut..." className={inputCls} />
              </Field>
              <Field label="Perlu Rujukan Jiwa?">
                <select name="skrining_jiwa_perlu_rujukan_tr" value={form.skrining_jiwa_perlu_rujukan_tr} onChange={handleChange}
                  className={`${selectCls} ${form.skrining_jiwa_perlu_rujukan_tr === "Ya" ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                  <option value="Tidak">Tidak</option>
                  <option value="Ya">Ya</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kesimpulan">
                <textarea name="kesimpulan_tr" value={form.kesimpulan_tr} onChange={handleChange} placeholder="Kesimpulan pemeriksaan..." rows={3} className={inputCls} />
              </Field>
              <Field label="Rekomendasi">
                <textarea name="rekomendasi_tr" value={form.rekomendasi_tr} onChange={handleChange} placeholder="Rekomendasi tindak lanjut..." rows={3} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Tombol ── */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
              Batal
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? "Menyimpan..." : existingData ? "Simpan Perubahan" : "Simpan Semua Data"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
