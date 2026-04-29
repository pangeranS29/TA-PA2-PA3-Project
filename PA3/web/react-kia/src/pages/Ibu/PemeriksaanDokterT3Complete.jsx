import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import {
  getDokterT3ByKehamilanId,
  createDokterT3,
  updateDokterT3,
} from "../../services/pemeriksaanDokter";
import { Save, ArrowLeft } from "lucide-react";

export default function PemeriksaanDokterT3Complete() {
  const { id } = useParams(); // id ibu
  const navigate = useNavigate();
  const [kehamilan, setKehamilan] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

    // USG Trimester 3
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

    // LANJUTAN TRIMESTER 3
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

    // Laboratorium & Skrining Jiwa (khusus trimester 3, terpisah jika tidak digabung dengan field di atas)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length === 0) {
          console.warn("Tidak ada kehamilan aktif");
          setLoading(false);
          return;
        }
        const aktif = kehamilanList[0];
        setKehamilan(aktif);
        setForm((prev) => ({ ...prev, kehamilan_id: aktif.id }));

        const res = await getDokterT3ByKehamilanId(aktif.id);
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

            usg_trimester_3_dilakukan: d.usg_trimester_3_dilakukan || "Ya",
            uk_berdasarkan_usg_trimester_1_minggu: d.uk_berdasarkan_usg_trimester_1_minggu || "",
            uk_berdasarkan_hpht_minggu: d.uk_berdasarkan_hpht_minggu || "",
            uk_berdasarkan_biometri_usg_trimester_3_minggu: d.uk_berdasarkan_biometri_usg_trimester_3_minggu || "",
            selisih_uk_3_minggu_atau_lebih: d.selisih_uk_3_minggu_atau_lebih || "Tidak",
            usg_jumlah_bayi: d.usg_jumlah_bayi || "",
            usg_letak_bayi: d.usg_letak_bayi || "",
            usg_presentasi_bayi: d.usg_presentasi_bayi || "",
            usg_keadaan_bayi: d.usg_keadaan_bayi || "",
            usg_djj_nilai: d.usg_djj_nilai || "",
            usg_djj_status: d.usg_djj_status || "Normal",
            usg_lokasi_plasenta: d.usg_lokasi_plasenta || "",
            usg_cairan_ketuban_sdp_cm: d.usg_cairan_ketuban_sdp_cm || "",
            usg_cairan_ketuban_status: d.usg_cairan_ketuban_status || "Normal",

            biometri_bpd_cm: d.biometri_bpd_cm || "",
            biometri_bpd_minggu: d.biometri_bpd_minggu || "",
            biometri_hc_cm: d.biometri_hc_cm || "",
            biometri_hc_minggu: d.biometri_hc_minggu || "",
            biometri_ac_cm: d.biometri_ac_cm || "",
            biometri_ac_minggu: d.biometri_ac_minggu || "",
            biometri_fl_cm: d.biometri_fl_cm || "",
            biometri_fl_minggu: d.biometri_fl_minggu || "",
            biometri_efw_tbj_gram: d.biometri_efw_tbj_gram || "",
            biometri_efw_tbj_minggu: d.biometri_efw_tbj_minggu || "",

            usg_kecurigaan_temuan_abnormal: d.usg_kecurigaan_temuan_abnormal || "Tidak",
            usg_keterangan_temuan_abnormal: d.usg_keterangan_temuan_abnormal || "",

            hasil_usg_catatan: d.hasil_usg_catatan || "",
            tanggal_lab: d.tanggal_lab ? d.tanggal_lab.split("T")[0] : "",
            lab_hemoglobin_hasil: d.lab_hemoglobin_hasil || "",
            lab_hemoglobin_rencana_tindak_lanjut: d.lab_hemoglobin_rencana || "",
            lab_protein_urin_hasil: d.lab_protein_urin_hasil || "",
            lab_protein_urin_rencana_tindak_lanjut: d.lab_protein_urin_rencana || "",
            lab_urin_reduksi_hasil: d.lab_urin_reduksi_hasil || "",
            lab_urin_reduksi_rencana_tindak_lanjut: d.lab_urin_reduksi_rencana || "",
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

            // lab jiwa terpisah dari tabel pemeriksaan_laboratorium_jiwa
            tanggal_lab_jiwa: lab?.tanggal_lab ? lab.tanggal_lab.split("T")[0] : "",
            lab_hemoglobin_hasil_jiwa: lab?.lab_hemoglobin_hasil || "",
            lab_hemoglobin_rencana_tindak_lanjut_jiwa: lab?.lab_hemoglobin_rencana_tindak_lanjut || "",
            lab_golongan_darah_rhesus_hasil: lab?.lab_golongan_darah_rhesus_hasil || "",
            lab_golongan_darah_rhesus_rencana_tindak_lanjut: lab?.lab_golongan_darah_rhesus_rencana || "",
            lab_gula_darah_sewaktu_hasil: lab?.lab_gula_darah_sewaktu_hasil || "",
            lab_gula_darah_sewaktu_rencana_tindak_lanjut: lab?.lab_gula_darah_sewaktu_rencana || "",
            lab_hiv_hasil: lab?.lab_hiv_hasil || "NonReaktif",
            lab_hiv_rencana_tindak_lanjut: lab?.lab_hiv_rencana || "",
            lab_sifilis_hasil: lab?.lab_sifilis_hasil || "NonReaktif",
            lab_sifilis_rencana_tindak_lanjut: lab?.lab_sifilis_rencana || "",
            lab_hepatitis_b_hasil: lab?.lab_hepatitis_b_hasil || "NonReaktif",
            lab_hepatitis_b_rencana_tindak_lanjut: lab?.lab_hepatitis_b_rencana || "",
            tanggal_skrining_jiwa_tr: lab?.tanggal_skrining_jiwa ? lab.tanggal_skrining_jiwa.split("T")[0] : "",
            skrining_jiwa_hasil_tr: lab?.skrining_jiwa_hasil || "",
            skrining_jiwa_tindak_lanjut_tr: lab?.skrining_jiwa_tindak_lanjut || "",
            skrining_jiwa_perlu_rujukan_tr: lab?.skrining_jiwa_perlu_rujukan || "Tidak",
            kesimpulan_tr: lab?.kesimpulan || "",
            rekomendasi_tr: lab?.rekomendasi || "",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
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
        // parse angka
        uk_berdasarkan_usg_trimester_1_minggu: parseInt(form.uk_berdasarkan_usg_trimester_1_minggu) || null,
        uk_berdasarkan_hpht_minggu: parseInt(form.uk_berdasarkan_hpht_minggu) || null,
        uk_berdasarkan_biometri_usg_trimester_3_minggu:
          parseInt(form.uk_berdasarkan_biometri_usg_trimester_3_minggu) || null,
        usg_djj_nilai: parseInt(form.usg_djj_nilai) || null,
        biometri_bpd_cm: parseFloat(form.biometri_bpd_cm) || null,
        biometri_bpd_minggu: parseInt(form.biometri_bpd_minggu) || null,
        biometri_hc_cm: parseFloat(form.biometri_hc_cm) || null,
        biometri_hc_minggu: parseInt(form.biometri_hc_minggu) || null,
        biometri_ac_cm: parseFloat(form.biometri_ac_cm) || null,
        biometri_ac_minggu: parseInt(form.biometri_ac_minggu) || null,
        biometri_fl_cm: parseFloat(form.biometri_fl_cm) || null,
        biometri_fl_minggu: parseInt(form.biometri_fl_minggu) || null,
        biometri_efw_tbj_gram: parseInt(form.biometri_efw_tbj_gram) || null,
        biometri_efw_tbj_minggu: parseInt(form.biometri_efw_tbj_minggu) || null,
        usg_cairan_ketuban_sdp_cm: parseFloat(form.usg_cairan_ketuban_sdp_cm) || null,
        lab_hemoglobin_hasil: parseFloat(form.lab_hemoglobin_hasil) || null,
        lab_protein_urin_hasil: parseInt(form.lab_protein_urin_hasil) || null,
        lab_hemoglobin_hasil_jiwa: parseFloat(form.lab_hemoglobin_hasil_jiwa) || null,
        lab_gula_darah_sewaktu_hasil: parseInt(form.lab_gula_darah_sewaktu_hasil) || null,
      };
      if (existingData) {
        await updateDokterT3(existingData.id, payload);
      } else {
        await createDokterT3(payload);
      }
      alert("Data pemeriksaan dokter trimester 3 & laboratorium jiwa berhasil disimpan");
      navigate(`/data-ibu/${id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Memuat data...</div>
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
            <h1 className="text-2xl font-bold">Pemeriksaan Dokter Trimester 3 (Lengkap)</h1>
            <p className="text-gray-500">
              Meliputi pemeriksaan fisik, USG, biometri, lanjutan, dan pemeriksaan laboratorium & skrining jiwa.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Data Dokter & Anamnesa */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-indigo-700">Data Pemeriksaan Dokter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Nama Dokter</label>
                <input
                  name="nama_dokter"
                  value={form.nama_dokter}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tanggal Periksa</label>
                <input
                  type="date"
                  name="tanggal_periksa"
                  value={form.tanggal_periksa}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium">Konsep Anamnesa/Pemeriksaan</label>
                <textarea
                  name="konsep_anamnesa_pemeriksaan"
                  value={form.konsep_anamnesa_pemeriksaan}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* 2. Pemeriksaan Fisik (10 bagian) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-indigo-700 mb-4">Pemeriksaan Fisik</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "fisik_konjungtiva", label: "Konjungtiva" },
                { name: "fisik_sklera", label: "Sklera" },
                { name: "fisik_kulit", label: "Kulit" },
                { name: "fisik_leher", label: "Leher" },
                { name: "fisik_gigi_mulut", label: "Gigi/Mulut" },
                { name: "fisik_tht", label: "THT" },
                { name: "fisik_dada_jantung", label: "Dada/Jantung" },
                { name: "fisik_dada_paru", label: "Dada/Paru" },
                { name: "fisik_perut", label: "Perut" },
                { name: "fisik_tungkai", label: "Tungkai" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">{field.label}</label>
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option>Normal</option>
                    <option>Abnormal</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* 3. USG Trimester 3 */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-indigo-700">USG Trimester 3</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label>USG Dilakukan?</label>
                <select name="usg_trimester_3_dilakukan" value={form.usg_trimester_3_dilakukan} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option>Ya</option>
                  <option>Tidak</option>
                </select>
              </div>
              <div>
                <label>UK USG T1 (minggu)</label>
                <input type="number" name="uk_berdasarkan_usg_trimester_1_minggu" value={form.uk_berdasarkan_usg_trimester_1_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>UK HPHT (minggu)</label>
                <input type="number" name="uk_berdasarkan_hpht_minggu" value={form.uk_berdasarkan_hpht_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>UK Biometri T3 (minggu)</label>
                <input type="number" name="uk_berdasarkan_biometri_usg_trimester_3_minggu" value={form.uk_berdasarkan_biometri_usg_trimester_3_minggu} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Selisih ≥3 minggu?</label>
                <select name="selisih_uk_3_minggu_atau_lebih" value={form.selisih_uk_3_minggu_atau_lebih} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option>Tidak</option>
                  <option>Ya</option>
                </select>
              </div>
              <div>
                <label>Jumlah Bayi</label>
                <input name="usg_jumlah_bayi" value={form.usg_jumlah_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Letak Bayi</label>
                <input name="usg_letak_bayi" value={form.usg_letak_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Presentasi Bayi</label>
                <input name="usg_presentasi_bayi" value={form.usg_presentasi_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Keadaan Bayi</label>
                <input name="usg_keadaan_bayi" value={form.usg_keadaan_bayi} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>DJJ (x/menit)</label>
                <input type="number" name="usg_djj_nilai" value={form.usg_djj_nilai} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Status DJJ</label>
                <select name="usg_djj_status" value={form.usg_djj_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option>Normal</option>
                  <option>Abnormal</option>
                </select>
              </div>
              <div>
                <label>Lokasi Plasenta</label>
                <input name="usg_lokasi_plasenta" value={form.usg_lokasi_plasenta} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Cairan Ketuban SDP (cm)</label>
                <input type="number" step="0.1" name="usg_cairan_ketuban_sdp_cm" value={form.usg_cairan_ketuban_sdp_cm} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Status Ketuban</label>
                <select name="usg_cairan_ketuban_status" value={form.usg_cairan_ketuban_status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option>Normal</option>
                  <option>Oligohidramnion</option>
                  <option>Polihidramnion</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Biometri Janin */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-indigo-700">Biometri Janin</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "BPD (cm)", name: "biometri_bpd_cm", type: "number", step: "0.1" },
                { label: "BPD (minggu)", name: "biometri_bpd_minggu", type: "number" },
                { label: "HC (cm)", name: "biometri_hc_cm", type: "number", step: "0.1" },
                { label: "HC (minggu)", name: "biometri_hc_minggu", type: "number" },
                { label: "AC (cm)", name: "biometri_ac_cm", type: "number", step: "0.1" },
                { label: "AC (minggu)", name: "biometri_ac_minggu", type: "number" },
                { label: "FL (cm)", name: "biometri_fl_cm", type: "number", step: "0.1" },
                { label: "FL (minggu)", name: "biometri_fl_minggu", type: "number" },
                { label: "EFW/TBJ (gram)", name: "biometri_efw_tbj_gram", type: "number" },
                { label: "EFW/TBJ (minggu)", name: "biometri_efw_tbj_minggu", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    step={field.step}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              ))}
              <div>
                <label>Kecurigaan Abnormal</label>
                <select name="usg_kecurigaan_temuan_abnormal" value={form.usg_kecurigaan_temuan_abnormal} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option>Tidak</option>
                  <option>Ya</option>
                </select>
              </div>
              <div>
                <label>Keterangan Abnormal</label>
                <input name="usg_keterangan_temuan_abnormal" value={form.usg_keterangan_temuan_abnormal} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>

          {/* 5. Lanjutan Trimester 3 (Catatan USG, Lab, Konsultasi, Kontrasepsi) */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="font-semibold text-indigo-700">Lanjutan Trimester 3</h2>
            <div>
              <label>Hasil USG / Catatan</label>
              <textarea name="hasil_usg_catatan" value={form.hasil_usg_catatan} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Tanggal Lab</label>
                <input type="date" name="tanggal_lab" value={form.tanggal_lab} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Hemoglobin (g/dL)</label>
                <input type="number" step="0.1" name="lab_hemoglobin_hasil" value={form.lab_hemoglobin_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label>Rencana Tindak Lanjut Hb</label>
                <input name="lab_hemoglobin_rencana_tindak_lanjut" value={form.lab_hemoglobin_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Protein Urin (mg/dL)</label>
                <input type="number" name="lab_protein_urin_hasil" value={form.lab_protein_urin_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label>Rencana Tindak Lanjut Protein Urin</label>
                <input name="lab_protein_urin_rencana_tindak_lanjut" value={form.lab_protein_urin_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Urin Reduksi</label>
                <input name="lab_urin_reduksi_hasil" value={form.lab_urin_reduksi_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label>Rencana Urin Reduksi</label>
                <input name="lab_urin_reduksi_rencana_tindak_lanjut" value={form.lab_urin_reduksi_rencana_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Tanggal Skrining Jiwa</label>
                <input type="date" name="tanggal_skrining_jiwa" value={form.tanggal_skrining_jiwa} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Hasil Skrining Jiwa</label>
                <input name="skrining_jiwa_hasil" value={form.skrining_jiwa_hasil} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Tindak Lanjut</label>
                <input name="skrining_jiwa_tindak_lanjut" value={form.skrining_jiwa_tindak_lanjut} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label>Perlu Rujukan?</label>
                <select name="skrining_jiwa_perlu_rujukan" value={form.skrining_jiwa_perlu_rujukan} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option>Tidak</option>
                  <option>Ya</option>
                </select>
              </div>
            </div>

            <h3 className="font-semibold">Rencana Konsultasi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { name: "rencana_konsultasi_gizi", label: "Gizi" },
                { name: "rencana_konsultasi_kebidanan", label: "Kebidanan" },
                { name: "rencana_konsultasi_anak", label: "Anak" },
                { name: "rencana_konsultasi_penyakit_dalam", label: "Penyakit Dalam" },
                { name: "rencana_konsultasi_neurologi", label: "Neurologi" },
                { name: "rencana_konsultasi_tht", label: "THT" },
                { name: "rencana_konsultasi_psikiatri", label: "Psikiatri" },
              ].map((item) => (
                <label key={item.name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={form[item.name]}
                    onChange={handleChange}
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <div>
              <label>Konsultasi Lain-lain</label>
              <input name="rencana_konsultasi_lain_lain" value={form.rencana_konsultasi_lain_lain} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label>Rencana Proses Melahirkan</label>
              <input name="rencana_proses_melahirkan" value={form.rencana_proses_melahirkan} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>

            <h3 className="font-semibold">Rencana Kontrasepsi Pasca Persalinan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { name: "rencana_kontrasepsi_akdr", label: "AKDR" },
                { name: "rencana_kontrasepsi_pil", label: "Pil" },
                { name: "rencana_kontrasepsi_suntik", label: "Suntik" },
                { name: "rencana_kontrasepsi_steril", label: "Steril" },
                { name: "rencana_kontrasepsi_mal", label: "MAL" },
                { name: "rencana_kontrasepsi_implan", label: "Implan" },
                { name: "rencana_kontrasepsi_belum_memilih", label: "Belum Memilih" },
              ].map((item) => (
                <label key={item.name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={form[item.name]}
                    onChange={handleChange}
                  />
                  {item.label}
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Kebutuhan Konseling</label>
                <select name="kebutuhan_konseling" value={form.kebutuhan_konseling} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option>Tidak</option>
                  <option>Ya</option>
                </select>
              </div>
              <div>
                <label>Rekomendasi Tempat Melahirkan</label>
                <input name="kesimpulan_rekomendasi_tempat_melahirkan" value={form.kesimpulan_rekomendasi_tempat_melahirkan} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label>Penjelasan</label>
              <textarea name="penjelasan" value={form.penjelasan} onChange={handleChange} rows="3" className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          {/* 6. Pemeriksaan Laboratorium & Skrining Jiwa (tabel terpisah trimester 3) */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-indigo-700">Pemeriksaan Laboratorium & Skrining Jiwa (Trimester 3)</h2>
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
              <div><label>Tanggal Skrining Jiwa</label><input type="date" name="tanggal_skrining_jiwa_tr" value={form.tanggal_skrining_jiwa_tr} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Hasil Skrining Jiwa</label><input name="skrining_jiwa_hasil_tr" value={form.skrining_jiwa_hasil_tr} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Tindak Lanjut Skrining Jiwa</label><input name="skrining_jiwa_tindak_lanjut_tr" value={form.skrining_jiwa_tindak_lanjut_tr} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
              <div><label>Perlu Rujukan Jiwa</label><select name="skrining_jiwa_perlu_rujukan_tr" value={form.skrining_jiwa_perlu_rujukan_tr} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>Tidak</option><option>Ya</option></select></div>
              <div className="md:col-span-2"><label>Kesimpulan</label><textarea name="kesimpulan_tr" value={form.kesimpulan_tr} onChange={handleChange} rows="2" className="w-full border rounded px-3 py-2" /></div>
              <div className="md:col-span-2"><label>Rekomendasi</label><textarea name="rekomendasi_tr" value={form.rekomendasi_tr} onChange={handleChange} rows="2" className="w-full border rounded px-3 py-2" /></div>
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