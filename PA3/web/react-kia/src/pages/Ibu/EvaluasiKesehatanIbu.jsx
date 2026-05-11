// src/pages/Ibu/EvaluasiKesehatanIbu.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import {
  getEvaluasiByKehamilanId,
  createEvaluasi,
  updateEvaluasi,
  getRiwayatKehamilanByEvaluasiId,
  createRiwayatKehamilan,
} from "../../services/evaluasiKesehatan";
import {
  Plus,
  Edit,
  Save,
  ArrowLeft,
  Eye,
  CheckCircle,
  EyeOff,
  XCircle,
  Info,
} from "lucide-react";
import { getCurrentUser, isDokterUser } from "../../services/auth";

// Helper untuk menampilkan checkbox dengan teks Ya/Tidak
const RenderCheck = ({ value }) =>
  value ? (
    <span className="inline-flex items-center gap-1 text-[#3B6D11] font-medium">
      <CheckCircle size={16} /> Ya
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-gray-500">
      <XCircle size={14} /> Tidak
    </span>
  );

// Helper untuk menghitung IMT dan kategorinya
const calculateIMT = (tbCm, bbKg) => {
  const tb = parseFloat(tbCm);
  const bb = parseFloat(bbKg);
  if (isNaN(tb) || isNaN(bb) || tb <= 0 || bb <= 0) return { imt: null, kategori: "" };
  const heightM = tb / 100;
  const imt = bb / (heightM * heightM);
  let kategori = "";
  if (imt < 18.5) kategori = "Kurus";
  else if (imt < 25) kategori = "Normal";
  else if (imt < 30) kategori = "Gemuk";
  else kategori = "Obesitas";
  return { imt: imt.toFixed(1), kategori };
};

// Komponen untuk menampilkan info bantuan (tooltip sederhana)
const HelpTooltip = ({ text }) => (
  <span className="inline-block ml-1 text-gray-400 cursor-help group relative">
    <Info size={14} />
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
      {text}
    </span>
  </span>
);

// ===================== KOMPONEN LIHAT EVALUASI =====================
const EvaluationView = ({
  evaluasi,
  form,
  riwayatList,
  canEdit,
  handleAddRiwayat,
  setIsEditing,
}) => {
  if (!evaluasi) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-gray-500 mb-4 text-base">
          Belum ada data evaluasi kesehatan untuk kehamilan ini.
        </div>
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#185FA5] text-white rounded-full px-6 py-3 text-base font-semibold flex items-center gap-2 mx-auto hover:bg-[#185FA5]/90 transition"
          >
            <Plus size={20} /> Buat Evaluasi Baru
          </button>
        )}
        {!canEdit && (
          <p className="text-gray-400 text-sm mt-2">
            Kehamilan sudah selesai (NON-AKTIF), tidak dapat menambahkan data baru.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header informasi umum */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
          <div>
            <span className="font-semibold text-gray-700">Nama Dokter:</span>{" "}
            {form.nama_dokter || "-"}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Tanggal Periksa:</span>{" "}
            {form.tanggal_periksa || "-"}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Fasilitas Kesehatan:</span>{" "}
            {form.fasilitas_kesehatan || "-"}
          </div>
        </div>
      </div>

      {/* Kondisi Kesehatan Ibu */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4 flex items-center gap-2">
          Kondisi Kesehatan Ibu <HelpTooltip text="Tinggi Badan (TB), Berat Badan (BB), Indeks Massa Tubuh (IMT), dan Lingkar Lengan Atas (LiLA)" />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
          <div>
            <span className="font-semibold">TB:</span>{" "}
            {form.tb_cm ? `${form.tb_cm} cm` : "-"}
          </div>
          <div>
            <span className="font-semibold">BB:</span>{" "}
            {form.bb_kg ? `${form.bb_kg} kg` : "-"}
          </div>
          <div>
            <span className="font-semibold">IMT:</span>{" "}
            {form.tb_cm && form.bb_kg
              ? `${calculateIMT(form.tb_cm, form.bb_kg).imt} kg/m²`
              : "-"}
          </div>
          <div>
            <span className="font-semibold">Kategori IMT:</span>{" "}
            {form.imt_kategori || "-"}
          </div>
          <div>
            <span className="font-semibold">LiLA:</span>{" "}
            {form.lila_cm ? `${form.lila_cm} cm` : "-"}
          </div>
        </div>
      </div>

      {/* Status Imunisasi TT */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4 flex items-center gap-2">
          Status Imunisasi TT <HelpTooltip text="TT = Tetanus Toxoid. Dosis lengkap 5 kali memberikan perlindungan seumur hidup." />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span className="w-12 font-medium">TT {n}:</span>{" "}
              <RenderCheck value={form[`status_tt_${n}`]} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <span className="font-semibold">Imunisasi Lainnya (Covid-19, dll):</span>{" "}
          {form.imunisasi_lainnya_covid19 || "-"}
        </div>
      </div>

      {/* Pemeriksaan Khusus (Inspeksi) */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Pemeriksaan Khusus (Inspeksi)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-base">
          {["porsio", "uretra", "vagina", "vulva", "fluksus", "fluor"].map(
            (item) => (
              <div key={item}>
                <span className="font-semibold capitalize">{item}:</span>{" "}
                {form[`inspeksi_${item}`] || "-"}
              </div>
            )
          )}
        </div>
      </div>

      {/* Riwayat Kesehatan Ibu */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Riwayat Kesehatan Ibu
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-base">
          {[
            ["alergi", "Alergi"],
            ["asma", "Asma"],
            ["autoimun", "Autoimun"],
            ["diabetes", "Diabetes"],
            ["hepatitis_b", "Hepatitis B"],
            ["hipertensi", "Hipertensi"],
            ["jantung", "Jantung"],
            ["jiwa", "Gangguan Jiwa"],
            ["sifilis", "Sifilis"],
            ["tb", "Tuberkulosis"],
          ].map(([key, label]) => (
            <div key={key} className="w-44 flex items-center gap-2">
              <span className="font-medium">{label}:</span>{" "}
              <RenderCheck value={form[`riwayat_${key}`]} />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <span className="font-semibold">Lainnya:</span>{" "}
          {form.riwayat_kesehatan_lainnya || "-"}
        </div>
      </div>

      {/* Riwayat Perilaku Berisiko */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Perilaku Berisiko (1 bulan sebelum hamil)
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-base">
          {[
            ["aktivitas_fisik_kurang", "Kurang aktivitas fisik"],
            ["alkohol", "Konsumsi alkohol"],
            ["kosmetik_berbahaya", "Kosmetik berbahaya"],
            ["merokok", "Merokok"],
            ["obat_teratogenik", "Obat teratogenik"],
            ["pola_makan_berisiko", "Pola makan berisiko"],
          ].map(([key, label]) => (
            <div key={key} className="w-56 flex items-center gap-2">
              <span className="font-medium">{label}:</span>{" "}
              <RenderCheck value={form[`perilaku_${key}`]} />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <span className="font-semibold">Lainnya:</span>{" "}
          {form.perilaku_lainnya || "-"}
        </div>
      </div>

      {/* Riwayat Penyakit Keluarga */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Riwayat Penyakit Keluarga
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-base">
          {[
            ["alergi", "Alergi"],
            ["asma", "Asma"],
            ["autoimun", "Autoimun"],
            ["diabetes", "Diabetes"],
            ["hepatitis_b", "Hepatitis B"],
            ["hipertensi", "Hipertensi"],
            ["jantung", "Jantung"],
            ["jiwa", "Gangguan Jiwa"],
            ["sifilis", "Sifilis"],
            ["tb", "Tuberkulosis"],
          ].map(([key, label]) => (
            <div key={key} className="w-44 flex items-center gap-2">
              <span className="font-medium">{label}:</span>{" "}
              <RenderCheck value={form[`keluarga_${key}`]} />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <span className="font-semibold">Lainnya:</span>{" "}
          {form.keluarga_lainnya || "-"}
        </div>
      </div>

      {/* Riwayat Kehamilan dan Proses Melahirkan */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Riwayat Kehamilan Lalu
        </h3>
        {riwayatList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">No</th>
                  <th className="px-3 py-2 text-left">Tahun</th>
                  <th className="px-3 py-2 text-left">BB (gram)</th>
                  <th className="px-3 py-2 text-left">Proses Melahirkan</th>
                  <th className="px-3 py-2 text-left">Penolong</th>
                  <th className="px-3 py-2 text-left">Masalah</th>
                </tr>
              </thead>
              <tbody>
                {riwayatList.map((r, idx) => (
                  <tr key={r.id_riwayat || idx} className="border-b">
                    <td className="px-3 py-2">{r.no_urut}</td>
                    <td className="px-3 py-2">{r.tahun}</td>
                    <td className="px-3 py-2">{r.bb_gram}</td>
                    <td className="px-3 py-2">{r.proses_melahirkan}</td>
                    <td className="px-3 py-2">{r.penolong_proses_melahirkan}</td>
                    <td className="px-3 py-2">{r.masalah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-base">Belum ada riwayat kehamilan lalu.</p>
        )}
        {canEdit && evaluasi && (
          <div className="mt-5 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                const tahun = prompt("Masukkan tahun (contoh: 2022):");
                const proses = prompt("Proses melahirkan (normal/caesar/dll):");
                if (tahun && proses) {
                  handleAddRiwayat({ tahun, proses_melahirkan: proses });
                }
              }}
              className="text-[#185FA5] hover:text-[#185FA5]/80 text-base font-medium flex items-center gap-2"
            >
              <Plus size={18} /> Tambah Riwayat Kehamilan
            </button>
          </div>
        )}
      </div>

      {canEdit && evaluasi && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#185FA5] text-white rounded-full px-6 py-3 text-base font-semibold flex items-center gap-2 hover:bg-[#185FA5]/90 transition"
          >
            <Edit size={18} /> Edit Evaluasi
          </button>
        </div>
      )}
    </div>
  );
};

// ===================== KOMPONEN FORM EDIT EVALUASI =====================
const EvaluationForm = ({
  form,
  handleChange,
  handleSubmitEvaluasi,
  errors,
  saving,
  setIsEditing,
  riwayatList,
  formRiwayat,
  setFormRiwayat,
  handleAddRiwayat,
}) => {
  // Hitung IMT secara otomatis dari TB dan BB
  const { imt: imtNumeric, kategori: computedKategori } = useMemo(
    () => calculateIMT(form.tb_cm, form.bb_kg),
    [form.tb_cm, form.bb_kg]
  );

  // Sinkronkan kategori hasil hitung ke form.imt_kategori
  useEffect(() => {
    if (computedKategori && computedKategori !== form.imt_kategori) {
      handleChange({
        target: { name: "imt_kategori", value: computedKategori },
      });
    } else if (!computedKategori && form.imt_kategori) {
      handleChange({ target: { name: "imt_kategori", value: "" } });
    }
  }, [computedKategori, form.imt_kategori, handleChange]);

  return (
    <form onSubmit={handleSubmitEvaluasi} noValidate className="space-y-6">
      {/* Data Umum */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Data Pemeriksaan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Nama Dokter
            </label>
            <input
              name="nama_dokter"
              value={form.nama_dokter}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-base"
              readOnly
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Tanggal Periksa <span className="text-[#A32D2D]">*</span>
            </label>
            <input
              type="date"
              name="tanggal_periksa"
              value={form.tanggal_periksa}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-2 text-base ${
                errors.tanggal_periksa ? "border-[#A32D2D]" : "border-gray-300"
              }`}
            />
            {errors.tanggal_periksa && (
              <p className="text-[#A32D2D] text-sm mt-1">{errors.tanggal_periksa}</p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Fasilitas Kesehatan
            </label>
            <input
              name="fasilitas_kesehatan"
              value={form.fasilitas_kesehatan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
            />
          </div>
        </div>
      </div>

      {/* Antropometri */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4 flex items-center gap-2">
          Antropometri <HelpTooltip text="Tinggi Badan, Berat Badan, Lingkar Lengan Atas" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              TB (cm) <span className="text-[#A32D2D]">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              name="tb_cm"
              value={form.tb_cm}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-2 text-base ${
                errors.tb_cm ? "border-[#A32D2D]" : "border-gray-300"
              }`}
            />
            {errors.tb_cm && <p className="text-[#A32D2D] text-sm mt-1">{errors.tb_cm}</p>}
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              BB (kg) <span className="text-[#A32D2D]">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              name="bb_kg"
              value={form.bb_kg}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-2 text-base ${
                errors.bb_kg ? "border-[#A32D2D]" : "border-gray-300"
              }`}
            />
            {errors.bb_kg && <p className="text-[#A32D2D] text-sm mt-1">{errors.bb_kg}</p>}
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              IMT (kg/m²)
            </label>
            <input
              type="text"
              value={imtNumeric ? `${imtNumeric}` : "-"}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-base"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Kategori IMT
            </label>
            <input
              type="text"
              value={form.imt_kategori || "-"}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-base"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              LiLA (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="lila_cm"
              value={form.lila_cm}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 text-base ${
                errors.lila_cm ? "border-[#A32D2D]" : "border-gray-300"
              }`}
            />
            {errors.lila_cm && <p className="text-[#A32D2D] text-sm mt-1">{errors.lila_cm}</p>}
          </div>
        </div>
      </div>

      {/* Status Imunisasi TT */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4 flex items-center gap-2">
          Status Imunisasi TT <HelpTooltip text="TT = Tetanus Toxoid. Dosis lengkap 5 kali memberikan perlindungan seumur hidup." />
        </h3>
        <div className="flex flex-wrap gap-5">
          {[
            { n: 1, desc: "Kunjungan pertama (TT1)" },
            { n: 2, desc: "4 minggu setelah TT1 (TT2)" },
            { n: 3, desc: "6 bulan setelah TT2 (TT3)" },
            { n: 4, desc: "1 tahun setelah TT3 (TT4)" },
            { n: 5, desc: "1 tahun setelah TT4 (TT5)" },
          ].map(({ n, desc }) => (
            <label
              key={n}
              className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition-colors"
              title={desc}
            >
              <input
                type="checkbox"
                name={`status_tt_${n}`}
                checked={form[`status_tt_${n}`]}
                onChange={handleChange}
                className="w-5 h-5 text-[#185FA5] border-gray-300 rounded focus:ring-[#185FA5]"
              />
              <span className="text-base">
                TT{n} <span className="text-gray-500 text-sm">({desc})</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-base font-medium text-gray-700 mb-1">
            Imunisasi Lainnya (Covid-19, dll)
          </label>
          <input
            name="imunisasi_lainnya_covid19"
            value={form.imunisasi_lainnya_covid19}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
            placeholder="Contoh: Covid-19 dosis 2, Influenza..."
          />
        </div>
      </div>

      {/* Riwayat Kesehatan, Perilaku, Keluarga */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
        <div>
          <h4 className="font-bold text-lg text-[#185FA5] mb-3">Riwayat Kesehatan Ibu</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["alergi", "Alergi"],
              ["asma", "Asma"],
              ["autoimun", "Autoimun"],
              ["diabetes", "Diabetes"],
              ["hepatitis_b", "Hepatitis B"],
              ["hipertensi", "Hipertensi"],
              ["jantung", "Jantung"],
              ["jiwa", "Gangguan Jiwa"],
              ["sifilis", "Sifilis"],
              ["tb", "Tuberkulosis"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-base">
                <input
                  type="checkbox"
                  name={`riwayat_${key}`}
                  checked={form[`riwayat_${key}`]}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                {label}
              </label>
            ))}
          </div>
          <input
            name="riwayat_kesehatan_lainnya"
            placeholder="Riwayat kesehatan lainnya"
            value={form.riwayat_kesehatan_lainnya}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 text-base"
          />
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#185FA5] mb-3">Perilaku Berisiko (1 bulan sebelum hamil)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["aktivitas_fisik_kurang", "Kurang aktivitas fisik"],
              ["alkohol", "Konsumsi alkohol"],
              ["kosmetik_berbahaya", "Kosmetik berbahaya"],
              ["merokok", "Merokok"],
              ["obat_teratogenik", "Obat teratogenik"],
              ["pola_makan_berisiko", "Pola makan berisiko"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-base">
                <input
                  type="checkbox"
                  name={`perilaku_${key}`}
                  checked={form[`perilaku_${key}`]}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                {label}
              </label>
            ))}
          </div>
          <input
            name="perilaku_lainnya"
            placeholder="Perilaku berisiko lainnya"
            value={form.perilaku_lainnya}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 text-base"
          />
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#185FA5] mb-3">Riwayat Kesehatan Keluarga</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["alergi", "Alergi"],
              ["asma", "Asma"],
              ["autoimun", "Autoimun"],
              ["diabetes", "Diabetes"],
              ["hepatitis_b", "Hepatitis B"],
              ["hipertensi", "Hipertensi"],
              ["jantung", "Jantung"],
              ["jiwa", "Gangguan Jiwa"],
              ["sifilis", "Sifilis"],
              ["tb", "Tuberkulosis"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-base">
                <input
                  type="checkbox"
                  name={`keluarga_${key}`}
                  checked={form[`keluarga_${key}`]}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                {label}
              </label>
            ))}
          </div>
          <input
            name="keluarga_lainnya"
            placeholder="Penyakit keluarga lainnya"
            value={form.keluarga_lainnya}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 text-base"
          />
        </div>
      </div>

      {/* Inspeksi */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Inspeksi Medis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["porsio", "uretra", "vagina", "vulva", "fluksus", "fluor"].map(
            (item) => (
              <div key={item}>
                <label className="block capitalize text-base font-medium text-gray-700 mb-1">
                  {item}
                </label>
                <select
                  name={`inspeksi_${item}`}
                  value={form[`inspeksi_${item}`]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
                >
                  <option value="">-- Pilih --</option>
                  <option>Normal</option>
                  <option>Abnormal</option>
                </select>
              </div>
            )
          )}
        </div>
      </div>

      {/* Riwayat Kehamilan Lalu */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-xl text-[#185FA5] border-b pb-2 mb-4">
          Riwayat Kehamilan Lalu
        </h3>
        {riwayatList.length > 0 && (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-sm md:text-base border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1">No</th>
                  <th className="px-2 py-1">Tahun</th>
                  <th className="px-2 py-1">BB(gram)</th>
                  <th className="px-2 py-1">Proses</th>
                  <th className="px-2 py-1">Penolong</th>
                  <th className="px-2 py-1">Masalah</th>
                </tr>
              </thead>
              <tbody>
                {riwayatList.map((r) => (
                  <tr key={r.id_riwayat}>
                    <td className="px-2 py-1">{r.no_urut}</td>
                    <td className="px-2 py-1">{r.tahun}</td>
                    <td className="px-2 py-1">{r.bb_gram}</td>
                    <td className="px-2 py-1">{r.proses_melahirkan}</td>
                    <td className="px-2 py-1">{r.penolong_proses_melahirkan}</td>
                    <td className="px-2 py-1">{r.masalah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <input
            type="number"
            placeholder="No Urut"
            value={formRiwayat.no_urut}
            onChange={(e) =>
              setFormRiwayat({ ...formRiwayat, no_urut: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
          />
          <input
            type="number"
            placeholder="Tahun *"
            value={formRiwayat.tahun}
            onChange={(e) =>
              setFormRiwayat({ ...formRiwayat, tahun: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
          />
          <input
            type="number"
            placeholder="BB gram"
            value={formRiwayat.bb_gram}
            onChange={(e) =>
              setFormRiwayat({ ...formRiwayat, bb_gram: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
          />
          <input
            placeholder="Proses melahirkan *"
            value={formRiwayat.proses_melahirkan}
            onChange={(e) =>
              setFormRiwayat({
                ...formRiwayat,
                proses_melahirkan: e.target.value,
              })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
          />
          <input
            placeholder="Penolong"
            value={formRiwayat.penolong_proses_melahirkan}
            onChange={(e) =>
              setFormRiwayat({
                ...formRiwayat,
                penolong_proses_melahirkan: e.target.value,
              })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
          />
          <input
            placeholder="Masalah"
            value={formRiwayat.masalah}
            onChange={(e) =>
              setFormRiwayat({ ...formRiwayat, masalah: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-base col-span-2"
          />
          <button
            type="button"
            onClick={handleAddRiwayat}
            className="bg-[#3B6D11] text-white rounded-full px-4 py-2 text-base font-semibold flex items-center gap-2 justify-center hover:bg-[#3B6D11]/90 transition"
          >
            <Plus size={18} /> Tambah Riwayat
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-6 py-3 rounded-full border border-[#185FA5] text-[#185FA5] text-base font-semibold hover:bg-[#185FA5]/5 transition"
        >
          Batalkan
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#185FA5] text-white rounded-full px-6 py-3 text-base font-semibold flex items-center gap-2 hover:bg-[#185FA5]/90 disabled:opacity-50 transition"
        >
          <Save size={20} /> {saving ? "Menyimpan..." : "Simpan Evaluasi"}
        </button>
      </div>
    </form>
  );
};

// ===================== KOMPONEN UTAMA =====================
export default function EvaluasiKesehatanIbu() {
  const { id: ibuId } = useParams();
  const [searchParams] = useSearchParams();
  const kehamilanId = searchParams.get("kehamilan_id");
  const navigate = useNavigate();

  const user = getCurrentUser();
  const isDokter = isDokterUser(user);

  const [kehamilan, setKehamilan] = useState(null);
  const [evaluasi, setEvaluasi] = useState(null);
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isActive, setIsActive] = useState(true);

  const canEdit = isDokter && isActive;

  const [form, setForm] = useState({
    nama_dokter: "",
    tanggal_periksa: new Date().toISOString().split("T")[0],
    fasilitas_kesehatan: "",
    tb_cm: "",
    bb_kg: "",
    imt_kategori: "",
    lila_cm: "",
    status_tt_1: false,
    status_tt_2: false,
    status_tt_3: false,
    status_tt_4: false,
    status_tt_5: false,
    imunisasi_lainnya_covid19: "",
    riwayat_alergi: false,
    riwayat_asma: false,
    riwayat_autoimun: false,
    riwayat_diabetes: false,
    riwayat_hepatitis_b: false,
    riwayat_hipertensi: false,
    riwayat_jantung: false,
    riwayat_jiwa: false,
    riwayat_sifilis: false,
    riwayat_tb: false,
    riwayat_kesehatan_lainnya: "",
    perilaku_aktivitas_fisik_kurang: false,
    perilaku_alkohol: false,
    perilaku_kosmetik_berbahaya: false,
    perilaku_merokok: false,
    perilaku_obat_teratogenik: false,
    perilaku_pola_makan_berisiko: false,
    perilaku_lainnya: "",
    keluarga_alergi: false,
    keluarga_asma: false,
    keluarga_autoimun: false,
    keluarga_diabetes: false,
    keluarga_hepatitis_b: false,
    keluarga_hipertensi: false,
    keluarga_jantung: false,
    keluarga_jiwa: false,
    keluarga_sifilis: false,
    keluarga_tb: false,
    keluarga_lainnya: "",
    inspeksi_porsio: "",
    inspeksi_uretra: "",
    inspeksi_vagina: "",
    inspeksi_vulva: "",
    inspeksi_fluksus: "",
    inspeksi_fluor: "",
  });

  const [formRiwayat, setFormRiwayat] = useState({
    no_urut: 1,
    tahun: "",
    bb_gram: "",
    proses_melahirkan: "",
    penolong_proses_melahirkan: "",
    masalah: "",
  });

  // Ambil nama dokter dari localStorage sekali saat mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.nama) {
      setForm((prev) => ({ ...prev, nama_dokter: storedUser.nama }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const kehamilanList = await getKehamilanByIbuId(ibuId);
        if (!kehamilanList || kehamilanList.length === 0) {
          alert("Ibu belum memiliki data kehamilan.");
          navigate(`/data-ibu/${ibuId}`);
          return;
        }
        let targetKehamilan = null;
        if (kehamilanId) {
          targetKehamilan = kehamilanList.find((k) => k.id == kehamilanId);
          if (!targetKehamilan) {
            alert(`Kehamilan dengan ID ${kehamilanId} tidak ditemukan.`);
            navigate(`/data-ibu/${ibuId}`);
            return;
          }
        } else {
          targetKehamilan = kehamilanList[0];
        }
        setKehamilan(targetKehamilan);

        const status = targetKehamilan.status_kehamilan || "";
        const aktif = status !== "NON-AKTIF";
        setIsActive(aktif);

        const evalData = await getEvaluasiByKehamilanId(targetKehamilan.id);
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const dokterNama = storedUser.nama || "";

        if (evalData && evalData.length > 0) {
          const e = evalData[0];
          setEvaluasi(e);
          setForm({
            nama_dokter: dokterNama,
            tanggal_periksa: e.tanggal_periksa
              ? e.tanggal_periksa.split("T")[0]
              : new Date().toISOString().split("T")[0],
            fasilitas_kesehatan: e.fasilitas_kesehatan || "",
            tb_cm: e.tb_cm ?? "",
            bb_kg: e.bb_kg ?? "",
            imt_kategori: e.imt_kategori || "",
            lila_cm: e.lila_cm ?? "",
            status_tt_1: e.status_tt_1 || false,
            status_tt_2: e.status_tt_2 || false,
            status_tt_3: e.status_tt_3 || false,
            status_tt_4: e.status_tt_4 || false,
            status_tt_5: e.status_tt_5 || false,
            imunisasi_lainnya_covid19: e.imunisasi_lainnya_covid19 || "",
            riwayat_alergi: e.riwayat_alergi || false,
            riwayat_asma: e.riwayat_asma || false,
            riwayat_autoimun: e.riwayat_autoimun || false,
            riwayat_diabetes: e.riwayat_diabetes || false,
            riwayat_hepatitis_b: e.riwayat_hepatitis_b || false,
            riwayat_hipertensi: e.riwayat_hipertensi || false,
            riwayat_jantung: e.riwayat_jantung || false,
            riwayat_jiwa: e.riwayat_jiwa || false,
            riwayat_sifilis: e.riwayat_sifilis || false,
            riwayat_tb: e.riwayat_tb || false,
            riwayat_kesehatan_lainnya: e.riwayat_kesehatan_lainnya || "",
            perilaku_aktivitas_fisik_kurang: e.perilaku_aktivitas_fisik_kurang || false,
            perilaku_alkohol: e.perilaku_alkohol || false,
            perilaku_kosmetik_berbahaya: e.perilaku_kosmetik_berbahaya || false,
            perilaku_merokok: e.perilaku_merokok || false,
            perilaku_obat_teratogenik: e.perilaku_obat_teratogenik || false,
            perilaku_pola_makan_berisiko: e.perilaku_pola_makan_berisiko || false,
            perilaku_lainnya: e.perilaku_lainnya || "",
            keluarga_alergi: e.keluarga_alergi || false,
            keluarga_asma: e.keluarga_asma || false,
            keluarga_autoimun: e.keluarga_autoimun || false,
            keluarga_diabetes: e.keluarga_diabetes || false,
            keluarga_hepatitis_b: e.keluarga_hepatitis_b || false,
            keluarga_hipertensi: e.keluarga_hipertensi || false,
            keluarga_jantung: e.keluarga_jantung || false,
            keluarga_jiwa: e.keluarga_jiwa || false,
            keluarga_sifilis: e.keluarga_sifilis || false,
            keluarga_tb: e.keluarga_tb || false,
            keluarga_lainnya: e.keluarga_lainnya || "",
            inspeksi_porsio: e.inspeksi_porsio || "",
            inspeksi_uretra: e.inspeksi_uretra || "",
            inspeksi_vagina: e.inspeksi_vagina || "",
            inspeksi_vulva: e.inspeksi_vulva || "",
            inspeksi_fluksus: e.inspeksi_fluksus || "",
            inspeksi_fluor: e.inspeksi_fluor || "",
          });
          try {
            const riwayat = await getRiwayatKehamilanByEvaluasiId(e.id);
            if (riwayat) setRiwayatList(riwayat);
          } catch (err) {
            console.error("Gagal load riwayat:", err);
          }
        } else {
          setEvaluasi(null);
          setRiwayatList([]);
          setForm((prev) => ({
            ...prev,
            nama_dokter: dokterNama,
            tanggal_periksa: new Date().toISOString().split("T")[0],
            fasilitas_kesehatan: "",
            tb_cm: "",
            bb_kg: "",
            imt_kategori: "",
            lila_cm: "",
            status_tt_1: false,
            status_tt_2: false,
            status_tt_3: false,
            status_tt_4: false,
            status_tt_5: false,
            imunisasi_lainnya_covid19: "",
            riwayat_alergi: false,
            riwayat_asma: false,
            riwayat_autoimun: false,
            riwayat_diabetes: false,
            riwayat_hepatitis_b: false,
            riwayat_hipertensi: false,
            riwayat_jantung: false,
            riwayat_jiwa: false,
            riwayat_sifilis: false,
            riwayat_tb: false,
            riwayat_kesehatan_lainnya: "",
            perilaku_aktivitas_fisik_kurang: false,
            perilaku_alkohol: false,
            perilaku_kosmetik_berbahaya: false,
            perilaku_merokok: false,
            perilaku_obat_teratogenik: false,
            perilaku_pola_makan_berisiko: false,
            perilaku_lainnya: "",
            keluarga_alergi: false,
            keluarga_asma: false,
            keluarga_autoimun: false,
            keluarga_diabetes: false,
            keluarga_hepatitis_b: false,
            keluarga_hipertensi: false,
            keluarga_jantung: false,
            keluarga_jiwa: false,
            keluarga_sifilis: false,
            keluarga_tb: false,
            keluarga_lainnya: "",
            inspeksi_porsio: "",
            inspeksi_uretra: "",
            inspeksi_vagina: "",
            inspeksi_vulva: "",
            inspeksi_fluksus: "",
            inspeksi_fluor: "",
          }));
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    if (ibuId) fetchData();
  }, [ibuId, kehamilanId, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.tanggal_periksa) newErrors.tanggal_periksa = "Tanggal periksa wajib diisi";

    if (!form.tb_cm) {
      newErrors.tb_cm = "Tinggi badan wajib diisi";
    } else if (isNaN(parseFloat(form.tb_cm)) || parseFloat(form.tb_cm) <= 0) {
      newErrors.tb_cm = "Tinggi badan harus angka lebih dari 0";
    }

    if (!form.bb_kg) {
      newErrors.bb_kg = "Berat badan wajib diisi";
    } else if (isNaN(parseFloat(form.bb_kg)) || parseFloat(form.bb_kg) <= 0) {
      newErrors.bb_kg = "Berat badan harus angka lebih dari 0";
    }

    if (form.lila_cm) {
      if (isNaN(parseFloat(form.lila_cm)) || parseFloat(form.lila_cm) <= 0) {
        newErrors.lila_cm = "Lingkar lengan atas harus angka lebih dari 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmitEvaluasi = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("Tidak dapat mengedit karena kehamilan sudah selesai (NON-AKTIF).");
      return;
    }
    if (!kehamilan) {
      alert("Kehamilan tidak ditemukan");
      return;
    }
    if (!validateForm()) {
      alert("Mohon perbaiki data yang bermasalah.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        kehamilan_id: kehamilan.id,
        tb_cm: form.tb_cm === "" ? 0 : Number(form.tb_cm),
        bb_kg: form.bb_kg === "" ? 0 : Number(form.bb_kg),
        lila_cm: form.lila_cm === "" ? 0 : Number(form.lila_cm),
      };
      let savedEvaluasi;
      if (evaluasi) {
        await updateEvaluasi(evaluasi.id, payload);
        savedEvaluasi = { ...evaluasi, ...payload };
      } else {
        savedEvaluasi = await createEvaluasi(payload);
      }
      setEvaluasi(savedEvaluasi);
      setIsEditing(false);
      alert("Evaluasi kesehatan ibu berhasil disimpan");
    } catch (err) {
      alert("Gagal menyimpan evaluasi. Periksa koneksi Anda.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddRiwayat = async (data = null) => {
    if (!canEdit) {
      alert("Tidak dapat menambah riwayat karena kehamilan sudah selesai (NON-AKTIF).");
      return;
    }
    if (!evaluasi) {
      alert("Simpan evaluasi terlebih dahulu sebelum menambah riwayat.");
      return;
    }

    const current = data || formRiwayat;
    if (!current.tahun || !current.proses_melahirkan) {
      alert("Tahun dan Proses Melahirkan wajib diisi.");
      return;
    }
    try {
      const payload = {
        id_evaluasi: evaluasi.id,
        no_urut: parseInt(current.no_urut) || 1,
        tahun: parseInt(current.tahun) || 0,
        bb_gram: parseInt(current.bb_gram) || 0,
        proses_melahirkan: current.proses_melahirkan,
        penolong_proses_melahirkan: current.penolong_proses_melahirkan,
        masalah: current.masalah,
      };
      const created = await createRiwayatKehamilan(payload);
      setRiwayatList([...riwayatList, created]);
      setFormRiwayat({
        no_urut: riwayatList.length + 2,
        tahun: "",
        bb_gram: "",
        proses_melahirkan: "",
        penolong_proses_melahirkan: "",
        masalah: "",
      });
      alert("Riwayat kehamilan lalu berhasil ditambahkan");
    } catch (err) {
      alert("Gagal menambahkan riwayat. Periksa data Anda.");
      console.error(err);
    }
  };

  if (loading) return <MainLayout><div className="p-6 text-base">Memuat data...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7FAFB]">
        <div className="max-w-5xl mx-auto p-5 space-y-5">
          {/* Header dengan navigasi */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#185FA5] hover:text-[#185FA5]/80 text-base font-medium"
            >
              <ArrowLeft size={20} /> Kembali
            </button>
            <h1 className="text-[28px] font-bold text-gray-900">
              Evaluasi Kesehatan Ibu
            </h1>
          </div>

          {!isActive && (
            <div className="bg-yellow-50 border-l-4 border-[#BA7517] rounded-lg p-4 text-[#BA7517] text-base flex items-center gap-2">
              <EyeOff size={18} /> Kehamilan ini sudah selesai (NON-AKTIF). Anda tidak dapat membuat, mengedit, atau menambahkan data. Hanya mode baca.
            </div>
          )}

          {!canEdit && isActive && (
            <div className="bg-blue-50 border-l-4 border-[#185FA5] rounded-lg p-4 text-[#185FA5] text-base flex items-center gap-2">
              <Eye size={18} /> Anda dalam mode baca (Bidan). Data hanya dapat dilihat, tidak dapat diubah.
            </div>
          )}

          {isEditing ? (
            <EvaluationForm
              form={form}
              handleChange={handleChange}
              handleSubmitEvaluasi={handleSubmitEvaluasi}
              errors={errors}
              saving={saving}
              setIsEditing={setIsEditing}
              riwayatList={riwayatList}
              formRiwayat={formRiwayat}
              setFormRiwayat={setFormRiwayat}
              handleAddRiwayat={() => handleAddRiwayat()}
            />
          ) : (
            <EvaluationView
              evaluasi={evaluasi}
              form={form}
              riwayatList={riwayatList}
              canEdit={canEdit}
              handleAddRiwayat={handleAddRiwayat}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}