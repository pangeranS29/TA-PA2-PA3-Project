import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import {
  getDokterT1CompleteByKehamilanId,
  createDokterT1Complete,
  updateDokterT1Complete,
} from "../../services/pemeriksaanDokter";
import { Save, ArrowLeft, AlertCircle, PlusCircle } from "lucide-react";

export default function PemeriksaanDokterT1Complete() {
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
    // lab jiwa
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
  };
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    const fetch = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (!kehamilanList || kehamilanList.length === 0) {
          setError("Belum ada data kehamilan untuk ibu ini. Silakan tambah data kehamilan terlebih dahulu.");
          setLoading(false);
          return;
        }
        const aktif = kehamilanList[0];
        setKehamilan(aktif);
        setForm((prev) => ({ ...prev, kehamilan_id: aktif.id }));

        const res = await getDokterT1CompleteByKehamilanId(aktif.id);
        if (res && res.dokter) {
          setExistingData(res.dokter);
          const d = res.dokter;
          const lab = res.lab_jiwa;
          setForm({
            ...initialState,
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
            hpl_berdasarkan_hpht: d.hpl_berdasarkan_hpht ? d.hpl_berdasarkan_hpht.split("T")[0] : "",
            umur_hamil_usg_minggu: d.umur_hamil_usg_minggu?.toString() || "",
            hpl_berdasarkan_usg: d.hpl_berdasarkan_usg ? d.hpl_berdasarkan_usg.split("T")[0] : "",
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
            // lab
            tanggal_lab_jiwa: lab?.tanggal_lab ? lab.tanggal_lab.split("T")[0] : "",
            lab_hemoglobin_hasil_jiwa: lab?.lab_hemoglobin_hasil?.toString() || "",
            lab_hemoglobin_rencana_tindak_lanjut_jiwa: lab?.lab_hemoglobin_rencana_tindak_lanjut || "",
            lab_golongan_darah_rhesus_hasil: lab?.lab_golongan_darah_rhesus_hasil || "",
            lab_golongan_darah_rhesus_rencana_tindak_lanjut: lab?.lab_golongan_darah_rhesus_rencana || "",
            lab_gula_darah_sewaktu_hasil: lab?.lab_gula_darah_sewaktu_hasil?.toString() || "",
            lab_gula_darah_sewaktu_rencana_tindak_lanjut: lab?.lab_gula_darah_sewaktu_rencana || "",
            lab_hiv_hasil: lab?.lab_hiv_hasil || "NonReaktif",
            lab_hiv_rencana_tindak_lanjut: lab?.lab_hiv_rencana || "",
            lab_sifilis_hasil: lab?.lab_sifilis_hasil || "NonReaktif",
            lab_sifilis_rencana_tindak_lanjut: lab?.lab_sifilis_rencana || "",
            lab_hepatitis_b_hasil: lab?.lab_hepatitis_b_hasil || "NonReaktif",
            lab_hepatitis_b_rencana_tindak_lanjut: lab?.lab_hepatitis_b_rencana || "",
            tanggal_skrining_jiwa: lab?.tanggal_skrining_jiwa ? lab.tanggal_skrining_jiwa.split("T")[0] : "",
            skrining_jiwa_hasil: lab?.skrining_jiwa_hasil || "",
            skrining_jiwa_tindak_lanjut: lab?.skrining_jiwa_tindak_lanjut || "",
            skrining_jiwa_perlu_rujukan: lab?.skrining_jiwa_perlu_rujukan || "Tidak",
            kesimpulan: lab?.kesimpulan || "",
            rekomendasi: lab?.rekomendasi || "",
          });
        }
      } catch (err) {
        console.error("Error fetch data:", err);
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kehamilan) {
      alert("Data kehamilan tidak ditemukan.");
      return;
    }
    setSaving(true);
    try {
      // Parsing semua field numerik
      const payload = {
        ...form,
        kehamilan_id: kehamilan.id,
        // integer
        umur_hamil_hpht_minggu: form.umur_hamil_hpht_minggu ? parseInt(form.umur_hamil_hpht_minggu) : null,
        umur_hamil_usg_minggu: form.umur_hamil_usg_minggu ? parseInt(form.umur_hamil_usg_minggu) : null,
        usg_diameter_gs_minggu: form.usg_diameter_gs_minggu ? parseInt(form.usg_diameter_gs_minggu) : null,
        usg_diameter_gs_hari: form.usg_diameter_gs_hari ? parseInt(form.usg_diameter_gs_hari) : null,
        usg_crl_minggu: form.usg_crl_minggu ? parseInt(form.usg_crl_minggu) : null,
        usg_crl_hari: form.usg_crl_hari ? parseInt(form.usg_crl_hari) : null,
        lab_gula_darah_sewaktu_hasil: form.lab_gula_darah_sewaktu_hasil ? parseInt(form.lab_gula_darah_sewaktu_hasil) : null,
        // float
        usg_diameter_gs_cm: form.usg_diameter_gs_cm ? parseFloat(form.usg_diameter_gs_cm) : null,
        usg_crl_cm: form.usg_crl_cm ? parseFloat(form.usg_crl_cm) : null,
        lab_hemoglobin_hasil_jiwa: form.lab_hemoglobin_hasil_jiwa ? parseFloat(form.lab_hemoglobin_hasil_jiwa) : null,
      };
      if (existingData) {
        await updateDokterT1Complete(existingData.id, payload);
        alert("Data berhasil diperbarui!");
      } else {
        await createDokterT1Complete(payload);
        alert("Data berhasil disimpan!");
      }
      navigate(`/data-ibu/${id}`);
    } catch (err) {
      console.error("Error saving:", err);
      const errorMsg = err.response?.data?.message || err.message || "Terjadi kesalahan";
      alert("Gagal menyimpan: " + errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Memuat...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-3">Data Kehamilan Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              Untuk mengisi pemeriksaan dokter trimester 1, ibu harus memiliki data kehamilan terlebih dahulu.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to={`/data-ibu/${id}/edit`}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
              >
                <PlusCircle size={18} /> Tambah Data Kehamilan
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Pemeriksaan Dokter Trimester 1 & Laboratorium Jiwa</h1>
            <p className="text-gray-500">Lengkapi data pemeriksaan fisik, USG, dan penunjang lab untuk trimester 1.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Data Dokter & Anamnesis */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-indigo-700">Data Pemeriksaan Dokter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium">Nama Dokter</label><input name="nama_dokter" value={form.nama_dokter} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium">Tanggal Periksa</label><input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label className="block text-sm font-medium">Konsep Anamnesa / Pemeriksaan</label><textarea name="konsep_anamnesa_pemeriksaan" value={form.konsep_anamnesa_pemeriksaan} onChange={handleChange} className="w-full border rounded px-3 py-2" rows="2" /></div>
            </div>
          </div>

          {/* Pemeriksaan Fisik (10 item) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-indigo-700 mb-4">Pemeriksaan Fisik</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
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
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">{field.label}</label>
                  <select name={field.name} value={form[field.name]} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option>Normal</option><option>Abnormal</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* USG Trimester 1 */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-indigo-700">USG Trimester 1</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label>HPHT</label><input type="date" name="hpht" value={form.hpht} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Keteraturan Haid</label><select name="keteraturan_haid" value={form.keteraturan_haid} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>Teratur</option><option>Tidak Teratur</option></select></div>
              <div><label>UK HPHT (minggu)</label><input type="number" name="umur_hamil_hpht_minggu" value={form.umur_hamil_hpht_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>HPL HPHT</label><input type="date" name="hpl_berdasarkan_hpht" value={form.hpl_berdasarkan_hpht} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>UK USG (minggu)</label><input type="number" name="umur_hamil_usg_minggu" value={form.umur_hamil_usg_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>HPL USG</label><input type="date" name="hpl_berdasarkan_usg" value={form.hpl_berdasarkan_usg} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Jumlah GS</label><input name="usg_jumlah_gs" value={form.usg_jumlah_gs} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Diameter GS (cm)</label><input type="number" step="0.1" name="usg_diameter_gs_cm" value={form.usg_diameter_gs_cm} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Diameter GS (minggu)</label><input type="number" name="usg_diameter_gs_minggu" value={form.usg_diameter_gs_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Diameter GS (hari)</label><input type="number" name="usg_diameter_gs_hari" value={form.usg_diameter_gs_hari} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Jumlah Bayi</label><input name="usg_jumlah_bayi" value={form.usg_jumlah_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>CRL (cm)</label><input type="number" step="0.1" name="usg_crl_cm" value={form.usg_crl_cm} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>CRL (minggu)</label><input type="number" name="usg_crl_minggu" value={form.usg_crl_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>CRL (hari)</label><input type="number" name="usg_crl_hari" value={form.usg_crl_hari} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Letak Produk Kehamilan</label><input name="usg_letak_produk_kehamilan" value={form.usg_letak_produk_kehamilan} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Pulsasi Jantung</label><input name="usg_pulsasi_jantung" value={form.usg_pulsasi_jantung} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Kecurigaan Temuan Abnormal</label><select name="usg_kecurigaan_temuan_abnormal" value={form.usg_kecurigaan_temuan_abnormal} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>Tidak</option><option>Ya</option></select></div>
              <div><label>Keterangan Temuan Abnormal</label><input name="usg_keterangan_temuan_abnormal" value={form.usg_keterangan_temuan_abnormal} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
            </div>
          </div>

          {/* Pemeriksaan Laboratorium & Skrining Jiwa */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-indigo-700">Pemeriksaan Laboratorium & Skrining Jiwa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label>Tanggal Lab</label><input type="date" name="tanggal_lab_jiwa" value={form.tanggal_lab_jiwa} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Hemoglobin (g/dL)</label><input type="number" step="0.1" name="lab_hemoglobin_hasil_jiwa" value={form.lab_hemoglobin_hasil_jiwa} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Rencana Tindak Lanjut Hb</label><input name="lab_hemoglobin_rencana_tindak_lanjut_jiwa" value={form.lab_hemoglobin_rencana_tindak_lanjut_jiwa} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Golongan Darah & Rhesus</label><input name="lab_golongan_darah_rhesus_hasil" value={form.lab_golongan_darah_rhesus_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Rencana Tindak Lanjut Golongan Darah</label><input name="lab_golongan_darah_rhesus_rencana_tindak_lanjut" value={form.lab_golongan_darah_rhesus_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Gula Darah Sewaktu (mg/dL)</label><input type="number" name="lab_gula_darah_sewaktu_hasil" value={form.lab_gula_darah_sewaktu_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Rencana Tindak Lanjut GDS</label><input name="lab_gula_darah_sewaktu_rencana_tindak_lanjut" value={form.lab_gula_darah_sewaktu_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>HIV Hasil</label><select name="lab_hiv_hasil" value={form.lab_hiv_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>NonReaktif</option><option>Reaktif</option></select></div>
              <div><label>Rencana HIV</label><input name="lab_hiv_rencana_tindak_lanjut" value={form.lab_hiv_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Sifilis Hasil</label><select name="lab_sifilis_hasil" value={form.lab_sifilis_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>NonReaktif</option><option>Reaktif</option></select></div>
              <div><label>Rencana Sifilis</label><input name="lab_sifilis_rencana_tindak_lanjut" value={form.lab_sifilis_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Hepatitis B Hasil</label><select name="lab_hepatitis_b_hasil" value={form.lab_hepatitis_b_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>NonReaktif</option><option>Reaktif</option></select></div>
              <div><label>Rencana Hepatitis B</label><input name="lab_hepatitis_b_rencana_tindak_lanjut" value={form.lab_hepatitis_b_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Tanggal Skrining Jiwa</label><input type="date" name="tanggal_skrining_jiwa" value={form.tanggal_skrining_jiwa} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Hasil Skrining Jiwa</label><input name="skrining_jiwa_hasil" value={form.skrining_jiwa_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Tindak Lanjut Jiwa</label><input name="skrining_jiwa_tindak_lanjut" value={form.skrining_jiwa_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Perlu Rujukan Jiwa</label><select name="skrining_jiwa_perlu_rujukan" value={form.skrining_jiwa_perlu_rujukan} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>Tidak</option><option>Ya</option></select></div>
              <div className="md:col-span-2"><label>Kesimpulan</label><textarea name="kesimpulan" value={form.kesimpulan} onChange={handleChange} className="w-full border rounded px-3 py-2" rows="2" /></div>
              <div className="md:col-span-2"><label>Rekomendasi</label><textarea name="rekomendasi" value={form.rekomendasi} onChange={handleChange} className="w-full border rounded px-3 py-2" rows="2" /></div>
            </div>
          </div>

          <div className="flex justify-end pb-8">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Menyimpan..." : "Simpan Semua Data"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}