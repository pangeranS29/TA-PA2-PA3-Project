// src/pages/Ibu/PemeriksaanKehamilanForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { 
  getPemeriksaanKehamilanById, 
  createPemeriksaanKehamilan, 
  updatePemeriksaanKehamilan 
} from "../../services/pemeriksaanKehamilan";
import { Save, ArrowLeft, Loader2, ClipboardCheck, Activity, Beaker, MessageCircle, AlertCircle } from "lucide-react";

export default function PemeriksaanKehamilanForm() {
  const { id: ibuId, periksaId } = useParams();
  const [searchParams] = useSearchParams();
  const kehamilanId = searchParams.get("kehamilan_id");

  const navigate = useNavigate();
  const isEdit = periksaId !== "baru";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Fisik, 2: Lab, 3: Konseling

  const [form, setForm] = useState({
    kehamilan_id: kehamilanId || "",
    minggu_kehamilan: "",
    berat_badan: "",
    tinggi_badan: "",
    lingkar_lengan_atas: "",
    sistole: "",
    diastole: "",
    tinggi_rahim: "",
    denyut_jantung_janin: "",
    tablet_tambah_darah: "",
    tes_lab_hb: "",
    tes_lab_gula_darah: "",
    tes_lab_protein_urine: "negatif",
    tripel_eliminasi: "non reaktif",
    usg: "",
    trimester: "T1",
    kunjungan_ke: "1",
    tanggal_periksa: new Date().toISOString().split("T")[0],
    tempat_periksa: "",
    letak_denyut_jantung_bayi: "",
    status_imunisasi_tetanus: "T1",
    konseling: "",
    skrining_dokter: "",
    tes_golongan_darah: "",
    tata_laksana_kasus: "",
  });

  // ================= VALIDATION FUNCTIONS =================
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
  const today = new Date();
  if (selected.getFullYear() > today.getFullYear()) return "Tanggal periksa tidak boleh melebihi hari ini";
  if (selected.getFullYear() === today.getFullYear() && selected.getMonth() > today.getMonth()) return "Tanggal periksa tidak boleh melebihi hari ini";
  if (selected.getFullYear() === today.getFullYear() && selected.getMonth() === today.getMonth() && selected.getDate() > today.getDate()) return "Tanggal periksa tidak boleh melebihi hari ini";
  return "";
};

  const validateTrimesterMinggu = (minggu, trimester) => {
    const m = parseInt(minggu);
    if (isNaN(m)) return "";
    if (trimester === "T1" && (m < 0 || m > 12)) return "Trimester 1 harus berisi minggu 0-12";
    if (trimester === "T2" && (m < 13 || m > 24)) return "Trimester 2 harus berisi minggu 13-24";
    if (trimester === "T3" && m < 25) return "Trimester 3 harus berisi minggu ≥25";
    return "";
  };

  // Validasi Step 1 (Kunjungan & Fisik)
  const validateStep1 = () => {
    const newErrors = {};
    const tanggalErr = validateDate(form.tanggal_periksa);
    if (tanggalErr) newErrors.tanggal_periksa = tanggalErr;
    if (!form.kunjungan_ke) newErrors.kunjungan_ke = "Kunjungan ke- wajib dipilih";

    const mingguErr = validateNumber(form.minggu_kehamilan, "Minggu kehamilan", 0, 42, true);
    if (mingguErr) newErrors.minggu_kehamilan = mingguErr;
    else {
      const trimesterErr = validateTrimesterMinggu(form.minggu_kehamilan, form.trimester);
      if (trimesterErr) newErrors.minggu_kehamilan = trimesterErr;
    }

    const bbErr = validateNumber(form.berat_badan, "Berat badan", 20, 200, false);
    if (bbErr) newErrors.berat_badan = bbErr;
    const tbErr = validateNumber(form.tinggi_badan, "Tinggi badan", 100, 200, false);
    if (tbErr) newErrors.tinggi_badan = tbErr;
    const lilaErr = validateNumber(form.lingkar_lengan_atas, "LILA", 15, 50, true);
    if (lilaErr) newErrors.lingkar_lengan_atas = lilaErr;
    const sistoleErr = validateNumber(form.sistole, "Sistole", 70, 200, false);
    if (sistoleErr) newErrors.sistole = sistoleErr;
    const diastoleErr = validateNumber(form.diastole, "Diastole", 40, 130, false);
    if (diastoleErr) newErrors.diastole = diastoleErr;
    const tfuErr = validateNumber(form.tinggi_rahim, "Tinggi rahim", 5, 50, true);
    if (tfuErr) newErrors.tinggi_rahim = tfuErr;
    const djjErr = validateNumber(form.denyut_jantung_janin, "Denyut jantung janin", 80, 200, false);
    if (djjErr) newErrors.denyut_jantung_janin = djjErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validasi Step 2 (Laboratorium)
  const validateStep2 = () => {
    const newErrors = {};
    const tabletErr = validateNumber(form.tablet_tambah_darah, "Tablet tambah darah", 0, 365, true);
    if (tabletErr) newErrors.tablet_tambah_darah = tabletErr;
    const hbErr = validateNumber(form.tes_lab_hb, "Kadar Hb", 3, 20, true);
    if (hbErr) newErrors.tes_lab_hb = hbErr;
    const gulaErr = validateNumber(form.tes_lab_gula_darah, "Gula darah", 40, 500, true);
    if (gulaErr) newErrors.tes_lab_gula_darah = gulaErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validasi Step 3 (Konseling) tidak ada required, selalu true
  const validateStep3 = () => true;

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else isValid = validateStep3();

    if (isValid) {
      setStep(step + 1);
      setErrors({});
    } else {
      alert("Mohon lengkapi data yang masih bermasalah.");
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
    setErrors({});
  };

  // Ambil data existing jika edit
  useEffect(() => {
    if (isEdit && periksaId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getPemeriksaanKehamilanById(periksaId);
          setForm({
            ...form,
            kehamilan_id: data.kehamilan_id || kehamilanId,
            minggu_kehamilan: data.minggu_kehamilan || "",
            berat_badan: data.berat_badan || "",
            tinggi_badan: data.tinggi_badan || "",
            lingkar_lengan_atas: data.lingkar_lengan_atas || "",
            sistole: data.sistole || "",
            diastole: data.diastole || "",
            tinggi_rahim: data.tinggi_rahim || "",
            denyut_jantung_janin: data.denyut_jantung_janin || "",
            tablet_tambah_darah: data.tablet_tambah_darah || "",
            tes_lab_hb: data.tes_lab_hb || "",
            tes_lab_gula_darah: data.tes_lab_gula_darah || "",
            tes_lab_protein_urine: data.tes_lab_protein_urine || "negatif",
            tripel_eliminasi: data.tripel_eliminasi || "non reaktif",
            usg: data.usg || "",
            trimester: data.trimester || "T1",
            kunjungan_ke: data.kunjungan_ke || "1",
            tanggal_periksa: data.tanggal_periksa ? data.tanggal_periksa.split("T")[0] : new Date().toISOString().split("T")[0],
            tempat_periksa: data.tempat_periksa || "",
            letak_denyut_jantung_bayi: data.letak_denyut_jantung_bayi || "",
            status_imunisasi_tetanus: data.status_imunisasi_tetanus || "T1",
            konseling: data.konseling || "",
            skrining_dokter: data.skrining_dokter || "",
            tes_golongan_darah: data.tes_golongan_darah || "",
            tata_laksana_kasus: data.tata_laksana_kasus || "",
          });
        } catch (err) {
          console.error(err);
          alert("Gagal memuat data pemeriksaan");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isEdit, periksaId, kehamilanId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Validasi silang trimester-minggu saat mengubah
    if (name === "trimester" || name === "minggu_kehamilan") {
      const newMinggu = name === "minggu_kehamilan" ? value : form.minggu_kehamilan;
      const newTrimester = name === "trimester" ? value : form.trimester;
      if (newMinggu && newTrimester) {
        const err = validateTrimesterMinggu(newMinggu, newTrimester);
        if (err) setErrors(prev => ({ ...prev, minggu_kehamilan: err }));
        else setErrors(prev => ({ ...prev, minggu_kehamilan: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilanId && !form.kehamilan_id) {
      alert("Kehamilan ID tidak ditemukan. Pastikan URL menyertakan ?kehamilan_id=...");
      return;
    }

    // Validasi final semua step
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();
    const step3Valid = validateStep3();
    if (!step1Valid || !step2Valid || !step3Valid) {
      alert("Masih ada data yang belum lengkap atau tidak valid. Periksa kembali.");
      if (!step1Valid) setStep(1);
      else if (!step2Valid) setStep(2);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        kehamilan_id: parseInt(kehamilanId || form.kehamilan_id),
        minggu_kehamilan: parseInt(form.minggu_kehamilan) || 0,
        berat_badan: parseFloat(form.berat_badan) || 0,
        tinggi_badan: parseFloat(form.tinggi_badan) || 0,
        lingkar_lengan_atas: parseFloat(form.lingkar_lengan_atas) || 0,
        sistole: parseInt(form.sistole) || 0,
        diastole: parseInt(form.diastole) || 0,
        tinggi_rahim: parseFloat(form.tinggi_rahim) || 0,
        denyut_jantung_janin: parseInt(form.denyut_jantung_janin) || 0,
        tablet_tambah_darah: parseInt(form.tablet_tambah_darah) || 0,
        tes_lab_hb: parseFloat(form.tes_lab_hb) || 0,
        tes_lab_gula_darah: parseInt(form.tes_lab_gula_darah) || 0,
        kunjungan_ke: parseInt(form.kunjungan_ke) || 0,
      };
      if (isEdit) {
        await updatePemeriksaanKehamilan(periksaId, payload);
        alert("Pemeriksaan ANC berhasil diperbarui");
      } else {
        await createPemeriksaanKehamilan(payload);
        alert("Pemeriksaan ANC berhasil disimpan");
      }
      navigate(`/data-ibu/${ibuId}/pemeriksaan-rutin?kehamilan_id=${kehamilanId}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data pemeriksaan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout><div className="p-6 text-center">Memuat data...</div></MainLayout>;

  const ErrorMsg = ({ field }) => errors[field] ? (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors[field]}</p>
  ) : null;

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}><Activity size={20} /></div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}><Beaker size={20} /></div>
            <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}><MessageCircle size={20} /></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Kunjungan & Fisik */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Activity size={20} /> Pemeriksaan Fisik & Antropometri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Periksa <span className="text-red-500">*</span></label>
                  <input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 ${errors.tanggal_periksa ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="tanggal_periksa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tempat Periksa</label>
                  <input name="tempat_periksa" value={form.tempat_periksa} onChange={handleChange} placeholder="Puskesmas / Klinik / RS" className="mt-1 w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kunjungan Ke- <span className="text-red-500">*</span></label>
                  <select name="kunjungan_ke" value={form.kunjungan_ke} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 ${errors.kunjungan_ke ? 'border-red-500' : 'border-gray-300'}`}>
                    {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
                  </select>
                  <ErrorMsg field="kunjungan_ke" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trimester</label>
                  <select name="trimester" value={form.trimester} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2">
                    <option value="I">Trimester 1 (0-12 minggu)</option>
                    <option value="II">Trimester 2 (13-24 minggu)</option>
                    <option value="III">Trimester 3 (≥25 minggu)</option>
                  </select>
                </div>
                <div>
                  <label>Minggu Kehamilan</label>
                  <input name="minggu_kehamilan" type="number" value={form.minggu_kehamilan} onChange={handleChange} placeholder="26" className={`mt-1 w-full border rounded-lg p-2 ${errors.minggu_kehamilan ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="minggu_kehamilan" />
                </div>
                <div>
                  <label>Berat Badan (kg)</label>
                  <input name="berat_badan" type="number" step="0.1" value={form.berat_badan} onChange={handleChange} placeholder="58" className={`mt-1 w-full border rounded-lg p-2 ${errors.berat_badan ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="berat_badan" />
                </div>
                <div>
                  <label>Tinggi Badan (cm)</label>
                  <input name="tinggi_badan" type="number" step="0.1" value={form.tinggi_badan} onChange={handleChange} placeholder="150" className={`mt-1 w-full border rounded-lg p-2 ${errors.tinggi_badan ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="tinggi_badan" />
                </div>
                <div>
                  <label>LILA (cm)</label>
                  <input name="lingkar_lengan_atas" type="number" step="0.1" value={form.lingkar_lengan_atas} onChange={handleChange} placeholder="23" className={`mt-1 w-full border rounded-lg p-2 ${errors.lingkar_lengan_atas ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="lingkar_lengan_atas" />
                </div>
                <div>
                  <label>Sistole (mmHg)</label>
                  <input name="sistole" type="number" value={form.sistole} onChange={handleChange} placeholder="135" className={`mt-1 w-full border rounded-lg p-2 ${errors.sistole ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="sistole" />
                </div>
                <div>
                  <label>Diastole (mmHg)</label>
                  <input name="diastole" type="number" value={form.diastole} onChange={handleChange} placeholder="85" className={`mt-1 w-full border rounded-lg p-2 ${errors.diastole ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="diastole" />
                </div>
                <div>
                  <label>Tinggi Rahim (TFU cm)</label>
                  <input name="tinggi_rahim" type="number" step="0.1" value={form.tinggi_rahim} onChange={handleChange} placeholder="20" className={`mt-1 w-full border rounded-lg p-2 ${errors.tinggi_rahim ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="tinggi_rahim" />
                </div>
                <div>
                  <label>Denyut Jantung Janin (x/menit)</label>
                  <input name="denyut_jantung_janin" type="number" value={form.denyut_jantung_janin} onChange={handleChange} placeholder="150" className={`mt-1 w-full border rounded-lg p-2 ${errors.denyut_jantung_janin ? 'border-red-500' : 'border-gray-300'}`} />
                  <ErrorMsg field="denyut_jantung_janin" />
                </div>
                <div className="md:col-span-2">
                  <label>Letak  (deskripsi)</label>
                  <input name="letak_denyut_jantung_bayi" value={form.letak_denyut_jantung_bayi} onChange={handleChange} placeholder="kepala" className="mt-1 w-full border rounded-lg p-2" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Laboratorium & Penunjang */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Beaker size={20} /> Laboratorium & Penunjang</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Kadar Hb (g/dL)</label><input name="tes_lab_hb" type="number" step="0.1" value={form.tes_lab_hb} onChange={handleChange} placeholder="10.8" className={`mt-1 w-full border rounded-lg p-2 ${errors.tes_lab_hb ? 'border-red-500' : 'border-gray-300'}`} /><ErrorMsg field="tes_lab_hb" /></div>
                <div><label>Gula Darah (mg/dL)</label><input name="tes_lab_gula_darah" type="number" value={form.tes_lab_gula_darah} onChange={handleChange} placeholder="110" className={`mt-1 w-full border rounded-lg p-2 ${errors.tes_lab_gula_darah ? 'border-red-500' : 'border-gray-300'}`} /><ErrorMsg field="tes_lab_gula_darah" /></div>
                <div><label>Protein Urine</label><select name="tes_lab_protein_urine" value={form.tes_lab_protein_urine} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2"><option>negatif</option><option>positif 1</option><option>positif 2</option><option>positif 3</option></select></div>
                <div><label>Triple Eliminasi</label><select name="tripel_eliminasi" value={form.tripel_eliminasi} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2"><option>non reaktif</option><option>reaktif HIV</option><option>reaktif Sifilis</option><option>reaktif HBsAg</option></select></div>
                <div><label>Golongan Darah</label><input name="tes_golongan_darah" value={form.tes_golongan_darah} onChange={handleChange} placeholder="A / B / AB / O" className="mt-1 w-full border rounded-lg p-2" /></div>
                <div><label>USG (temuan)</label><input name="usg" value={form.usg} onChange={handleChange} placeholder="Normal / Plasenta letak rendah dll" className="mt-1 w-full border rounded-lg p-2" /></div>
                <div><label>Tablet Tambah Darah (jumlah)</label><input name="tablet_tambah_darah" type="number" value={form.tablet_tambah_darah} onChange={handleChange} placeholder="80" className={`mt-1 w-full border rounded-lg p-2 ${errors.tablet_tambah_darah ? 'border-red-500' : 'border-gray-300'}`} /><ErrorMsg field="tablet_tambah_darah" /></div>
                <div><label>Status dan Imunisasi Tetanus</label><select name="status_imunisasi_tetanus" value={form.status_imunisasi_tetanus} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2">{["Belum pernah imunisasi TT","Dosis pertama","Dosis kedua","Dosis ketiga","Dosis keempat","Dosis kelima (perlindungan jangka panjang)"].map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
            </div>
          )}

          {/* Step 3: Konseling & Tindak Lanjut */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><MessageCircle size={20} /> Konseling & Tindak Lanjut</h2>
              <div className="grid grid-cols-1 gap-4">
                <div><label>Skrining Dokter / Temuan</label><textarea name="skrining_dokter" value={form.skrining_dokter} onChange={handleChange} rows={2} placeholder="Hasil skrining preeklampsia, diabetes, dll" className="mt-1 w-full border rounded-lg p-2"></textarea></div>
                <div><label>Konseling yang Diberikan</label><textarea name="konseling" value={form.konseling} onChange={handleChange} rows={2} placeholder="Edukasi tanda bahaya, gizi, imunisasi, KB pasca persalinan" className="mt-1 w-full border rounded-lg p-2"></textarea></div>
                <div><label>Tata Laksana Kasus</label><textarea name="tata_laksana_kasus" value={form.tata_laksana_kasus} onChange={handleChange} rows={2} placeholder="Obat, rujukan, jadwal kontrol berikutnya" className="mt-1 w-full border rounded-lg p-2"></textarea></div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
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
              <button type="submit" disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow flex items-center justify-center gap-2">
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {saving ? "Menyimpan..." : "Simpan Pemeriksaan"}
              </button>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
}