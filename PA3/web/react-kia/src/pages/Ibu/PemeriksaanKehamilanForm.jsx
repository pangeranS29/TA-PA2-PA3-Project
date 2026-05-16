// src/pages/Ibu/PemeriksaanKehamilanForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import MainLayout from "../../components/Layout/MainLayout";
import {
  getPemeriksaanKehamilanById,
  createPemeriksaanKehamilan,
  updatePemeriksaanKehamilan,
} from "../../services/pemeriksaanKehamilan";
import {
  Save, ArrowLeft, Loader2, Activity, Beaker, MessageCircle,
  AlertCircle, Home, CheckCircle, AlertTriangle, ShieldAlert, Info,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Hitung status risiko dari data klinis (standar Buku KIA)
// Menerima objek dengan field yang sama seperti form / data API
// ─────────────────────────────────────────────────────────────
const hitungStatusRisiko = (data) => {
  if (!data) return null;

  const faktorRujukan  = [];
  const faktorTindakan = [];

  // 1. Tekanan darah
  const sistole  = parseFloat(data.sistole)  || 0;
  const diastole = parseFloat(data.diastole) || 0;
  if (sistole > 0 || diastole > 0) {
    if (sistole >= 140 || diastole >= 90) {
      faktorRujukan.push(`Tekanan darah tinggi (${sistole}/${diastole} mmHg)`);
    } else if (sistole >= 130 || diastole >= 80) {
      faktorTindakan.push(`Tekanan darah batas waspada (${sistole}/${diastole} mmHg)`);
    }
  }

  // 2. DJJ
  const djj = parseInt(data.denyut_jantung_janin) || 0;
  if (djj > 0) {
    if (djj < 100 || djj > 180) {
      faktorRujukan.push(`DJJ tidak normal (${djj} bpm)`);
    } else if (djj < 120 || djj > 160) {
      faktorTindakan.push(`DJJ di luar batas normal (${djj} bpm)`);
    }
  }

  // 3. Hemoglobin
  const hb = parseFloat(data.tes_lab_hb) || 0;
  if (hb > 0) {
    if (hb < 7) {
      faktorRujukan.push(`Anemia berat, Hb ${hb} g/dL`);
    } else if (hb < 10) {
      faktorTindakan.push(`Anemia sedang, Hb ${hb} g/dL`);
    }
  }

  // 4. Gula darah
  const gds = parseInt(data.tes_lab_gula_darah) || 0;
  if (gds > 0) {
    if (gds > 200) {
      faktorRujukan.push(`Gula darah sangat tinggi (${gds} mg/dL)`);
    } else if (gds > 140) {
      faktorTindakan.push(`Gula darah meningkat (${gds} mg/dL)`);
    }
  }

  // 5. Protein urine
  const protein = (data.tes_lab_protein_urine || "").toLowerCase();
  if (protein.includes("positif 2") || protein.includes("positif 3") || protein === "++" || protein === "+++") {
    faktorRujukan.push(`Protein urine positif (${data.tes_lab_protein_urine})`);
  } else if (protein.includes("positif 1") || protein === "+" || protein.includes("trace")) {
    faktorTindakan.push(`Protein urine positif 1 (${data.tes_lab_protein_urine})`);
  }

  // 6. LILA
  const lila = parseFloat(data.lingkar_lengan_atas) || 0;
  if (lila > 0 && lila < 23.5) {
    faktorTindakan.push(`LILA kurang dari normal (${lila} cm)`);
  }

  // 7. Triple eliminasi reaktif
  const tripel = (data.tripel_eliminasi || "").toLowerCase();
  if (tripel.includes("reaktif") && !tripel.includes("non")) {
    faktorRujukan.push(`Triple eliminasi reaktif (${data.tripel_eliminasi})`);
  }

  // Tentukan status & skor sederhana
  const skor = faktorRujukan.length * 2 + faktorTindakan.length;
  let status_risiko, ringkasan;

  if (faktorRujukan.length > 0) {
    status_risiko = "PERLU RUJUKAN";
    ringkasan = faktorRujukan.join("; ");
  } else if (faktorTindakan.length > 0) {
    status_risiko = "PERLU TINDAKAN";
    ringkasan = faktorTindakan.join("; ");
  } else {
    status_risiko = "NORMAL";
    ringkasan = "Semua parameter klinis dalam batas normal.";
  }

  return { status_risiko, skor_risiko: skor, ringkasan, faktorRujukan, faktorTindakan };
};

// ─────────────────────────────────────────────────────────────
// Komponen utama
// ─────────────────────────────────────────────────────────────
export default function PemeriksaanKehamilanForm() {
  const { id: ibuId, periksaId } = useParams();
  const [searchParams] = useSearchParams();
  const kehamilanId = searchParams.get("kehamilan_id");

  const navigate = useNavigate();
  const isEdit = periksaId !== "baru";

  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [errors,       setErrors]       = useState({});
  const [step,         setStep]         = useState(1);
  const [showDebug,    setShowDebug]    = useState(false);
  const [debugPayload, setDebugPayload] = useState(null);

  const [form, setForm] = useState({
    kehamilan_id:            kehamilanId || "",
    minggu_kehamilan:        "",
    berat_badan:             "",
    tinggi_badan:            "",
    lingkar_lengan_atas:     "",
    sistole:                 "",
    diastole:                "",
    tinggi_rahim:            "",
    denyut_jantung_janin:    "",
    tablet_tambah_darah:     "",
    tes_lab_hb:              "",
    tes_lab_gula_darah:      "",
    tes_lab_protein_urine:   "negatif",
    tripel_eliminasi:        "non reaktif",
    usg:                     "",
    trimester:               "I",
    kunjungan_ke:            "1",
    tanggal_periksa:         new Date().toISOString().split("T")[0],
    tempat_periksa:          "",
    letak_denyut_jantung_bayi: "",
    status_imunisasi_tetanus:  "Belum pernah imunisasi TT",
    konseling:               "",
    skrining_dokter:         "",
    tes_golongan_darah:      "",
    tata_laksana_kasus:      "",
  });

  // Hitung risiko secara reaktif setiap kali form berubah
  const risikoHasil = useMemo(() => {
    // Hanya hitung jika minimal ada 1 data klinis yang diisi
    const adaData = form.sistole || form.diastole || form.denyut_jantung_janin ||
                    form.tes_lab_hb || form.tes_lab_gula_darah;
    if (!adaData) return null;
    return hitungStatusRisiko(form);
  }, [
    form.sistole, form.diastole, form.denyut_jantung_janin,
    form.tes_lab_hb, form.tes_lab_gula_darah, form.tes_lab_protein_urine,
    form.lingkar_lengan_atas, form.tripel_eliminasi,
  ]);

  // ── Breadcrumb ──
  const Breadcrumb = () => {
    if (!kehamilanId) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <Home size={14} /> Beranda
        </Link>
        <span>/</span>
        <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
        <span>/</span>
        <Link to={`/data-ibu/${ibuId}?kehamilan_id=${kehamilanId}`} className="hover:text-indigo-600">
          Detail Ibu
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">
          {isEdit ? "Edit Pemeriksaan ANC" : "Tambah Pemeriksaan ANC"}
        </span>
      </div>
    );
  };

  // ── Validasi ──
  const validateNumber = (value, fieldName, min = 0, max = null, allowZero = false) => {
    const num = parseFloat(value);
    if (isNaN(num)) return `${fieldName} harus diisi angka`;
    if (!allowZero && num === 0) return `${fieldName} tidak boleh 0`;
    if (num < min) return `${fieldName} tidak boleh kurang dari ${min}`;
    if (max !== null && num > max) return `${fieldName} tidak boleh lebih dari ${max}`;
    return "";
  };

  const validateDate = (dateStr) => {
    if (!dateStr) return "Tanggal periksa wajib diisi";
    const selected = new Date(dateStr);
    const today    = new Date();
    if (selected > today) return "Tanggal periksa tidak boleh melebihi hari ini";
    return "";
  };

  const validateTrimesterMinggu = (minggu, trimester) => {
    const m = parseInt(minggu);
    if (isNaN(m)) return "";
    if (trimester === "I"   && (m < 0  || m > 12)) return "Trimester 1 harus berisi minggu 0-12";
    if (trimester === "II"  && (m < 13 || m > 24)) return "Trimester 2 harus berisi minggu 13-24";
    if (trimester === "III" && m < 25)              return "Trimester 3 harus berisi minggu ≥25";
    return "";
  };

  const validateStep1 = () => {
    const newErrors = {};
    const tanggalErr = validateDate(form.tanggal_periksa);
    if (tanggalErr) newErrors.tanggal_periksa = tanggalErr;
    if (!form.kunjungan_ke) newErrors.kunjungan_ke = "Kunjungan ke- wajib dipilih";

    const mingguErr = validateNumber(form.minggu_kehamilan, "Minggu kehamilan", 0, 42, true);
    if (mingguErr) newErrors.minggu_kehamilan = mingguErr;
    else {
      const trimErr = validateTrimesterMinggu(form.minggu_kehamilan, form.trimester);
      if (trimErr) newErrors.minggu_kehamilan = trimErr;
    }

    const fields = [
      ["berat_badan",          "Berat badan",          20,  200,  false],
      ["tinggi_badan",         "Tinggi badan",          100, 200,  false],
      ["lingkar_lengan_atas",  "LILA",                  15,  50,   true],
      ["sistole",              "Sistole",               70,  200,  false],
      ["diastole",             "Diastole",              40,  130,  false],
      ["tinggi_rahim",         "Tinggi rahim",          5,   50,   true],
      ["denyut_jantung_janin", "Denyut jantung janin",  80,  200,  false],
    ];
    fields.forEach(([name, label, min, max, allowZero]) => {
      const err = validateNumber(form[name], label, min, max, allowZero);
      if (err) newErrors[name] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const fields = [
      ["tablet_tambah_darah",  "Tablet tambah darah", 0,  365, true],
      ["tes_lab_hb",           "Kadar Hb",            3,  20,  true],
      ["tes_lab_gula_darah",   "Gula darah",          40, 500, true],
    ];
    fields.forEach(([name, label, min, max, allowZero]) => {
      const err = validateNumber(form[name], label, min, max, allowZero);
      if (err) newErrors[name] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => true;

  const handleNext = () => {
    const valid = step === 1 ? validateStep1() : step === 2 ? validateStep2() : validateStep3();
    if (valid) { setStep(step + 1); setErrors({}); }
    else {
      Swal.fire({ icon: "error", title: "Validasi Gagal", text: "Mohon perbaiki data yang masih bermasalah.", confirmButtonColor: "#4f46e5" });
    }
  };

  const handlePrev = () => { setStep(step - 1); setErrors({}); };

  // ── Fetch data jika edit ──
  useEffect(() => {
    if (isEdit && periksaId) {
      setLoading(true);
      getPemeriksaanKehamilanById(periksaId)
        .then((data) => {
          setForm({
            kehamilan_id:              data.kehamilan_id              || kehamilanId,
            minggu_kehamilan:          data.minggu_kehamilan          || "",
            berat_badan:               data.berat_badan               || "",
            tinggi_badan:              data.tinggi_badan              || "",
            lingkar_lengan_atas:       data.lingkar_lengan_atas       || "",
            sistole:                   data.sistole                   || "",
            diastole:                  data.diastole                  || "",
            tinggi_rahim:              data.tinggi_rahim              || "",
            denyut_jantung_janin:      data.denyut_jantung_janin      || "",
            tablet_tambah_darah:       data.tablet_tambah_darah       || "",
            tes_lab_hb:                data.tes_lab_hb                || "",
            tes_lab_gula_darah:        data.tes_lab_gula_darah        || "",
            tes_lab_protein_urine:     data.tes_lab_protein_urine     || "negatif",
            tripel_eliminasi:          data.tripel_eliminasi          || "non reaktif",
            usg:                       data.usg                       || "",
            trimester:                 data.trimester                 || "I",
            kunjungan_ke:              data.kunjungan_ke              || "1",
            tanggal_periksa:           data.tanggal_periksa ? data.tanggal_periksa.split("T")[0] : new Date().toISOString().split("T")[0],
            tempat_periksa:            data.tempat_periksa            || "",
            letak_denyut_jantung_bayi: data.letak_denyut_jantung_bayi || "",
            status_imunisasi_tetanus:  data.status_imunisasi_tetanus  || "Belum pernah imunisasi TT",
            konseling:                 data.konseling                 || "",
            skrining_dokter:           data.skrining_dokter           || "",
            tes_golongan_darah:        data.tes_golongan_darah        || "",
            tata_laksana_kasus:        data.tata_laksana_kasus        || "",
          });
        })
        .catch((err) => { console.error(err); alert("Gagal memuat data pemeriksaan"); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEdit, periksaId, kehamilanId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (name === "trimester" || name === "minggu_kehamilan") {
      const newMinggu    = name === "minggu_kehamilan" ? value : form.minggu_kehamilan;
      const newTrimester = name === "trimester"        ? value : form.trimester;
      if (newMinggu && newTrimester) {
        const err = validateTrimesterMinggu(newMinggu, newTrimester);
        setErrors(prev => ({ ...prev, minggu_kehamilan: err || "" }));
      }
    }
  };

  const buildPayload = () => ({
    kehamilan_id:              parseInt(kehamilanId || form.kehamilan_id),
    minggu_kehamilan:          parseInt(form.minggu_kehamilan)      || 0,
    berat_badan:               parseFloat(form.berat_badan)         || 0,
    tinggi_badan:              parseFloat(form.tinggi_badan)        || 0,
    lingkar_lengan_atas:       parseFloat(form.lingkar_lengan_atas) || 0,
    sistole:                   parseInt(form.sistole)               || 0,
    diastole:                  parseInt(form.diastole)              || 0,
    tinggi_rahim:              parseFloat(form.tinggi_rahim)        || 0,
    denyut_jantung_janin:      parseInt(form.denyut_jantung_janin)  || 0,
    tablet_tambah_darah:       parseInt(form.tablet_tambah_darah)   || 0,
    tes_lab_hb:                parseFloat(form.tes_lab_hb)          || 0,
    tes_lab_gula_darah:        parseInt(form.tes_lab_gula_darah)    || 0,
    kunjungan_ke:              parseInt(form.kunjungan_ke)          || 0,
    tanggal_periksa:           form.tanggal_periksa,
    tempat_periksa:            form.tempat_periksa,
    letak_denyut_jantung_bayi: form.letak_denyut_jantung_bayi,
    status_imunisasi_tetanus:  form.status_imunisasi_tetanus,
    tes_lab_protein_urine:     form.tes_lab_protein_urine,
    tripel_eliminasi:          form.tripel_eliminasi,
    usg:                       form.usg,
    konseling:                 form.konseling,
    skrining_dokter:           form.skrining_dokter,
    tes_golongan_darah:        form.tes_golongan_darah,
    tata_laksana_kasus:        form.tata_laksana_kasus,
    trimester:                 form.trimester,
  });

  const handleDebug = () => {
    const payload = buildPayload();
    setDebugPayload(payload);
    setShowDebug(true);
    console.log("Debug Payload:", payload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilanId && !form.kehamilan_id) {
      alert("Kehamilan ID tidak ditemukan. Pastikan URL menyertakan ?kehamilan_id=...");
      return;
    }
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();
    if (!step1Valid || !step2Valid) {
      Swal.fire({ icon: "warning", title: "Data Belum Lengkap", text: "Masih ada data yang belum lengkap atau tidak valid.", confirmButtonColor: "#4f46e5" });
      if (!step1Valid) setStep(1);
      else if (!step2Valid) setStep(2);
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      console.log("PAYLOAD:", JSON.stringify(payload, null, 2));
      if (isEdit) {
        await updatePemeriksaanKehamilan(periksaId, payload);
        await Swal.fire({ icon: "success", title: "Berhasil", text: "Pemeriksaan ANC berhasil diperbarui", timer: 2000, showConfirmButton: false });
      } else {
        await createPemeriksaanKehamilan(payload);
        await Swal.fire({ icon: "success", title: "Berhasil", text: "Pemeriksaan ANC berhasil disimpan", timer: 2000, showConfirmButton: false });
      }
      navigate(`/data-ibu/${ibuId}/pemeriksaan-rutin?kehamilan_id=${kehamilanId}`);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan data pemeriksaan", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout><div className="p-6 text-center">Memuat data...</div></MainLayout>;

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[field]}
      </p>
    ) : null;

  // ── Card Risiko ──
  // Konfigurasi tampilan berdasarkan status
  const risikoConfig = {
    "NORMAL": {
      bg: "bg-green-50", border: "border-green-500",
      label: "bg-green-100 text-green-800",
      icon: <CheckCircle className="text-green-600 flex-shrink-0" size={28} />,
    },
    "PERLU TINDAKAN": {
      bg: "bg-yellow-50", border: "border-yellow-500",
      label: "bg-yellow-100 text-yellow-800",
      icon: <AlertTriangle className="text-yellow-600 flex-shrink-0" size={28} />,
    },
    "PERLU RUJUKAN": {
      bg: "bg-red-50", border: "border-red-500",
      label: "bg-red-100 text-red-800",
      icon: <ShieldAlert className="text-red-600 flex-shrink-0" size={28} />,
    },
  };

  const RiskCard = () => {
    if (!risikoHasil) return null;
    const { status_risiko, skor_risiko, ringkasan, faktorRujukan, faktorTindakan } = risikoHasil;
    const cfg = risikoConfig[status_risiko] || risikoConfig["PERLU RUJUKAN"];

    return (
      <div className={`mb-6 p-4 rounded-lg border-l-4 ${cfg.border} ${cfg.bg} shadow-sm`}>
        <div className="flex items-start gap-3">
          <div className="mt-1">{cfg.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg flex items-center gap-2 flex-wrap">
              Hasil Prediksi Risiko:
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${cfg.label}`}>
                {status_risiko}
              </span>
              <span className="text-sm text-gray-500">(Skor: {skor_risiko})</span>
            </h3>

            {/* Ringkasan */}
            <p className="mt-2 text-sm text-gray-700">{ringkasan}</p>

            {/* Detail faktor risiko */}
            {(faktorRujukan?.length > 0 || faktorTindakan?.length > 0) && (
              <div className="mt-3 bg-white rounded border p-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Info size={13} /> Detail Indikator
                </p>
                {faktorRujukan?.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <ShieldAlert size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                {faktorTindakan?.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-yellow-700">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              * Prediksi dihitung otomatis berdasarkan data yang Anda masukkan. Diperbarui secara langsung.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <Breadcrumb />

        {/* Card Risiko — tampil jika sudah ada data klinis */}
        <RiskCard />

        {/* Info awal jika belum ada data */}
        {!risikoHasil && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 flex items-center gap-2">
            <Info size={20} />
            <span>Sistem akan menghitung tingkat risiko kehamilan secara otomatis berdasarkan data yang Anda masukkan.</span>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow hover:shadow-md transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Edit" : "Input"} Pemeriksaan ANC</h1>
            <p className="text-gray-500">Formulir standar pelayanan kehamilan terintegrasi (Wizard)</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {[Activity, Beaker, MessageCircle].map((Icon, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className={`w-16 h-0.5 ${step > i ? "bg-indigo-600" : "bg-gray-200"}`} />}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                  <Icon size={20} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Fisik & Antropometri */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Activity size={20} /> Pemeriksaan Fisik & Antropometri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Periksa <span className="text-red-500">*</span></label>
                  <input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 ${errors.tanggal_periksa ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="tanggal_periksa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tempat Periksa</label>
                  <input name="tempat_periksa" value={form.tempat_periksa} onChange={handleChange} placeholder="Puskesmas / Klinik / RS" className="mt-1 w-full border rounded-lg p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kunjungan Ke- <span className="text-red-500">*</span></label>
                  <select name="kunjungan_ke" value={form.kunjungan_ke} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 ${errors.kunjungan_ke ? "border-red-500" : "border-gray-300"}`}>
                    {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
                  </select>
                  <ErrorMsg field="kunjungan_ke" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trimester</label>
                  <select name="trimester" value={form.trimester} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 border-gray-300">
                    <option value="I">Trimester 1 (0-12 minggu)</option>
                    <option value="II">Trimester 2 (13-24 minggu)</option>
                    <option value="III">Trimester 3 (≥25 minggu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minggu Kehamilan</label>
                  <input name="minggu_kehamilan" type="number" value={form.minggu_kehamilan} onChange={handleChange} placeholder="26" className={`mt-1 w-full border rounded-lg p-2 ${errors.minggu_kehamilan ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="minggu_kehamilan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Berat Badan (kg)</label>
                  <input name="berat_badan" type="number" step="0.1" value={form.berat_badan} onChange={handleChange} placeholder="58" className={`mt-1 w-full border rounded-lg p-2 ${errors.berat_badan ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="berat_badan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
                  <input name="tinggi_badan" type="number" step="0.1" value={form.tinggi_badan} onChange={handleChange} placeholder="150" className={`mt-1 w-full border rounded-lg p-2 ${errors.tinggi_badan ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="tinggi_badan" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LILA (cm)</label>
                  <input name="lingkar_lengan_atas" type="number" step="0.1" value={form.lingkar_lengan_atas} onChange={handleChange} placeholder="23" className={`mt-1 w-full border rounded-lg p-2 ${errors.lingkar_lengan_atas ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="lingkar_lengan_atas" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sistole (mmHg)</label>
                  <input name="sistole" type="number" value={form.sistole} onChange={handleChange} placeholder="135" className={`mt-1 w-full border rounded-lg p-2 ${errors.sistole ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="sistole" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diastole (mmHg)</label>
                  <input name="diastole" type="number" value={form.diastole} onChange={handleChange} placeholder="85" className={`mt-1 w-full border rounded-lg p-2 ${errors.diastole ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="diastole" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tinggi Rahim / TFU (cm)</label>
                  <input name="tinggi_rahim" type="number" step="0.1" value={form.tinggi_rahim} onChange={handleChange} placeholder="20" className={`mt-1 w-full border rounded-lg p-2 ${errors.tinggi_rahim ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="tinggi_rahim" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Denyut Jantung Janin (x/menit)</label>
                  <input name="denyut_jantung_janin" type="number" value={form.denyut_jantung_janin} onChange={handleChange} placeholder="150" className={`mt-1 w-full border rounded-lg p-2 ${errors.denyut_jantung_janin ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="denyut_jantung_janin" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Letak (deskripsi)</label>
                  <input name="letak_denyut_jantung_bayi" value={form.letak_denyut_jantung_bayi} onChange={handleChange} placeholder="kepala" className="mt-1 w-full border rounded-lg p-2 border-gray-300" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Laboratorium */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Beaker size={20} /> Laboratorium & Penunjang</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kadar Hb (g/dL)</label>
                  <input name="tes_lab_hb" type="number" step="0.1" value={form.tes_lab_hb} onChange={handleChange} placeholder="10.8" className={`mt-1 w-full border rounded-lg p-2 ${errors.tes_lab_hb ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="tes_lab_hb" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gula Darah (mg/dL)</label>
                  <input name="tes_lab_gula_darah" type="number" value={form.tes_lab_gula_darah} onChange={handleChange} placeholder="110" className={`mt-1 w-full border rounded-lg p-2 ${errors.tes_lab_gula_darah ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="tes_lab_gula_darah" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Protein Urine</label>
                  <select name="tes_lab_protein_urine" value={form.tes_lab_protein_urine} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 border-gray-300">
                    <option>negatif</option>
                    <option>positif 1</option>
                    <option>positif 2</option>
                    <option>positif 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Triple Eliminasi</label>
                  <select name="tripel_eliminasi" value={form.tripel_eliminasi} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 border-gray-300">
                    <option>non reaktif</option>
                    <option>reaktif HIV</option>
                    <option>reaktif Sifilis</option>
                    <option>reaktif HBsAg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Golongan Darah</label>
                  <input name="tes_golongan_darah" value={form.tes_golongan_darah} onChange={handleChange} placeholder="A / B / AB / O" className="mt-1 w-full border rounded-lg p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">USG (temuan)</label>
                  <input name="usg" value={form.usg} onChange={handleChange} placeholder="Normal / Plasenta letak rendah dll" className="mt-1 w-full border rounded-lg p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tablet Tambah Darah (jumlah)</label>
                  <input name="tablet_tambah_darah" type="number" value={form.tablet_tambah_darah} onChange={handleChange} placeholder="80" className={`mt-1 w-full border rounded-lg p-2 ${errors.tablet_tambah_darah ? "border-red-500" : "border-gray-300"}`} />
                  <ErrorMsg field="tablet_tambah_darah" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Imunisasi Tetanus</label>
                  <select name="status_imunisasi_tetanus" value={form.status_imunisasi_tetanus} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 border-gray-300">
                    {["Belum pernah imunisasi TT","Dosis pertama","Dosis kedua","Dosis ketiga","Dosis keempat","Dosis kelima (perlindungan jangka panjang)"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Konseling */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><MessageCircle size={20} /> Konseling & Tindak Lanjut</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skrining Dokter / Temuan</label>
                  <textarea name="skrining_dokter" value={form.skrining_dokter} onChange={handleChange} rows={2} placeholder="Hasil skrining preeklampsia, diabetes, dll" className="mt-1 w-full border rounded-lg p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konseling yang Diberikan</label>
                  <textarea name="konseling" value={form.konseling} onChange={handleChange} rows={2} placeholder="Edukasi tanda bahaya, gizi, imunisasi, KB pasca persalinan" className="mt-1 w-full border rounded-lg p-2 border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tata Laksana Kasus</label>
                  <textarea name="tata_laksana_kasus" value={form.tata_laksana_kasus} onChange={handleChange} rows={2} placeholder="Obat, rujukan, jadwal kontrol berikutnya" className="mt-1 w-full border rounded-lg p-2 border-gray-300" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pb-8">
            {step > 1 && (
              <button type="button" onClick={handlePrev} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                ← Kembali
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow">
                Selanjutnya →
              </button>
            ) : (
              <>
                <button type="button" onClick={handleDebug} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow flex items-center gap-2">
                  🐞 Debug Payload
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {saving ? "Menyimpan..." : "Simpan Pemeriksaan"}
                </button>
              </>
            )}
          </div>

          {/* Debug panel */}
          {showDebug && debugPayload && (
            <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg overflow-auto max-h-96">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-green-400">📦 Payload yang akan dikirim:</strong>
                <button onClick={() => setShowDebug(false)} className="text-gray-400 hover:text-white">✖ Tutup</button>
              </div>
              <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(debugPayload, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </MainLayout>
  );
}
