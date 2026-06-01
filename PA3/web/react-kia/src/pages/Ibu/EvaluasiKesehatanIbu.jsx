// src/pages/Ibu/EvaluasiKesehatanIbu.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import {
  getEvaluasiByKehamilanId,
  createEvaluasi,
  updateEvaluasi,
  getRiwayatKehamilanByEvaluasiId,
  createRiwayatKehamilan,
  deleteEvaluasi,
  deleteRiwayatKehamilan,
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
  Trash2,
} from "lucide-react";
import { getCurrentUser, isDokterUser } from "../../services/auth";

// Helper untuk menampilkan checkbox dengan teks Ya/Tidak
const RenderCheck = ({ value }) =>
  value ? (
    <span className="inline-flex items-center gap-1 text-[#3B6D11] font-semibold text-sm">
      <CheckCircle size={14} /> Ya
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
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
  <span className="inline-block ml-1 text-[#185FA5] cursor-help group relative">
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
  handleDeleteEvaluasi,
  handleDeleteRiwayat,
  saving,
}) => {
  if (!evaluasi) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
        <div className="text-gray-500 mb-4 text-sm">
          Belum ada data evaluasi kesehatan untuk kehamilan ini.
        </div>
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#185FA5] text-white rounded-full px-6 py-3 text-sm font-semibold flex items-center gap-2 mx-auto hover:bg-[#0F4A82] transition"
          >
            <Plus size={16} /> Buat Evaluasi Baru
          </button>
        )}
        {/* {!canEdit && (
          <p className="text-gray-400 text-xs mt-2">
            Kehamilan sudah selesai (NON-AKTIF), tidak dapat menambahkan data baru.
          </p>
        )} */}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header informasi umum */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
          <div>
            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide block mb-1">Nama Dokter</span>
            {form.nama_dokter || "-"}
          </div>
          <div>
            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide block mb-1">Tanggal Periksa</span>
            {form.tanggal_periksa || "-"}
          </div>
          <div>
            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide block mb-1">Fasilitas Kesehatan</span>
            {form.fasilitas_kesehatan || "-"}
          </div>
        </div>
      </div>

      {/* Kondisi Kesehatan Ibu */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
        <h3 className="font-semibold text-[22px] text-[#185FA5] mb-6 flex items-center gap-2">
          Kondisi Kesehatan Ibu <HelpTooltip text="Tinggi Badan (TB), Berat Badan (BB), Indeks Massa Tubuh (IMT), dan Lingkar Lengan Atas (LiLA)" />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-base">
          <div>
            <span className="font-bold text-gray-500 text-xs uppercase block mb-1">TB (Tinggi)</span>
            {form.tb_cm ? `${form.tb_cm} cm` : "-"}
          </div>
          <div>
            <span className="font-bold text-gray-500 text-xs uppercase block mb-1">BB (Berat)</span>
            {form.bb_kg ? `${form.bb_kg} kg` : "-"}
          </div>
          <div>
            <span className="font-bold text-gray-500 text-xs uppercase block mb-1">IMT</span>
            {form.tb_cm && form.bb_kg
              ? `${calculateIMT(form.tb_cm, form.bb_kg).imt} kg/m²`
              : "-"}
          </div>
          <div>
            <span className="font-bold text-gray-500 text-xs uppercase block mb-1">Status Gizi</span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              form.imt_kategori === 'Normal' ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-[#FAEEDA] text-[#633806]'
            }`}>
              {form.imt_kategori || "-"}
            </span>
          </div>
          <div>
            <span className="font-bold text-gray-500 text-xs uppercase block mb-1">LiLA (Lengan)</span>
            {form.lila_cm ? `${form.lila_cm} cm` : "-"}
          </div>
        </div>
      </div>

      {/* Status Imunisasi TT */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
        <h3 className="font-semibold text-[22px] text-[#185FA5] border-b pb-3 mb-5 flex items-center gap-2">
          Status Imunisasi TT <HelpTooltip text="TT = Tetanus Toxoid. Dosis lengkap 5 kali memberikan perlindungan seumur hidup." />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span className="font-bold text-gray-700 text-base">TT {n}</span>
              <RenderCheck value={form[`status_tt_${n}`]} />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-gray-100">
          <span className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Imunisasi Lainnya (Misal: Covid-19)</span>
          <p className="text-base text-gray-900">{form.imunisasi_lainnya_covid19 || "-"}</p>
        </div>
      </div>

      {/* Pemeriksaan Khusus (Inspeksi) */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
        <h3 className="font-semibold text-[22px] text-[#185FA5] mb-6">
          Pemeriksaan Khusus (Inspeksi)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-base">
          {["porsio", "uretra", "vagina", "vulva", "fluksus", "fluor"].map(
            (item) => (
              <div key={item}>
                <span className="font-bold text-gray-500 text-xs uppercase block mb-1">{item}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  form[`inspeksi_${item}`] === 'Normal' ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-[#FCEBEB] text-[#791F1F]'
                }`}>
                  {form[`inspeksi_${item}`] || "-"}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Riwayat Kesehatan Ibu */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
        <h3 className="font-semibold text-[22px] text-[#185FA5] mb-6">
          Riwayat Kesehatan Ibu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm mb-3">
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
            <div key={key} className="flex items-center gap-1.5">
              <span className="font-medium text-gray-700">{label}:</span>{" "}
              <RenderCheck value={form[`riwayat_${key}`]} />
            </div>
          ))}
        </div>
        <div>
          <span className="font-medium text-sm text-gray-700">Lainnya:</span>{" "}
          {form.riwayat_kesehatan_lainnya || "-"}
        </div>
      </div>

      {/* Riwayat Perilaku Berisiko */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-lg text-[#185FA5] mb-6">
          Perilaku Berisiko (1 bulan sebelum hamil)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
          {[
            ["aktivitas_fisik_kurang", "Kurang aktivitas fisik"],
            ["alkohol", "Konsumsi alkohol"],
            ["kosmetik_berbahaya", "Kosmetik berbahaya"],
            ["merokok", "Merokok"],
            ["obat_teratogenik", "Obat teratogenik"],
            ["pola_makan_berisiko", "Pola makan berisiko"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="font-medium text-gray-700">{label}:</span>{" "}
              <RenderCheck value={form[`perilaku_${key}`]} />
            </div>
          ))}
        </div>
        <div>
          <span className="font-medium text-sm text-gray-700">Lainnya:</span>{" "}
          {form.perilaku_lainnya || "-"}
        </div>
      </div>

      {/* Riwayat Penyakit Keluarga */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-lg text-[#185FA5] mb-6">
          Riwayat Penyakit Keluarga
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm mb-3">
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
            <div key={key} className="flex items-center gap-1.5">
              <span className="font-medium text-gray-700">{label}:</span>{" "}
              <RenderCheck value={form[`keluarga_${key}`]} />
            </div>
          ))}
        </div>
        <div>
          <span className="font-medium text-sm text-gray-700">Lainnya:</span>{" "}
          {form.keluarga_lainnya || "-"}
        </div>
      </div>

      {/* Riwayat Kehamilan dan Proses Melahirkan */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
        <h3 className="font-semibold text-[22px] text-[#185FA5] mb-6">
          Riwayat Kehamilan Lalu
        </h3>
        {riwayatList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E2E8F0] text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left">No</th>
                  <th className="px-3 py-3 text-left">Tahun</th>
                  <th className="px-3 py-3 text-left">Berat (gr)</th>
                  <th className="px-3 py-2 text-left">Proses Melahirkan</th>
                  <th className="px-3 py-2 text-left">Penolong</th>
                  <th className="px-3 py-2 text-left">Masalah</th>
                  {canEdit && <th className="px-3 py-2 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {riwayatList.map((r, idx) => (
                  <tr key={r.id_riwayat || idx} className="border-b border-[#F1F5F9] hover:bg-gray-50">
                    <td className="px-3 py-4">{r.no_urut}</td>
                    <td className="px-3 py-4 font-bold">{r.tahun}</td>
                    <td className="px-3 py-4">{r.bb_gram}</td>
                    <td className="px-3 py-4">{r.proses_melahirkan}</td>
                    <td className="px-3 py-2">{r.penolong_proses_melahirkan}</td>
                    <td className="px-3 py-2">{r.masalah}</td>
                    {canEdit && (
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleDeleteRiwayat(r.id_riwayat)}
                          className="p-1 text-[#A32D2D] hover:bg-red-50 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-3">Belum ada riwayat kehamilan lalu.</p>
        )}
        {canEdit && evaluasi && (
          <div className="pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={async () => {
                const { value: formValues } = await Swal.fire({
                  title: 'Tambah Riwayat Kehamilan',
                  html:
                    '<input id="swal-input1" class="swal2-input" placeholder="Tahun (contoh: 2022)">' +
                    '<input id="swal-input2" class="swal2-input" placeholder="Proses (Normal/SC)">',
                  focusConfirm: false,
                  preConfirm: () => {
                    return [
                      document.getElementById('swal-input1').value,
                      document.getElementById('swal-input2').value
                    ]
                  }
                });

                if (formValues && formValues[0] && formValues[1]) {
                  handleAddRiwayat({ tahun: formValues[0], proses_melahirkan: formValues[1] });
                }
              }}
              className="text-[#185FA5] hover:text-[#185FA5]/80 text-base font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} /> Tambah Riwayat Kehamilan
            </button>
          </div>
        )}
      </div>

      {canEdit && evaluasi && (
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#185FA5] text-white rounded-full px-8 py-3 text-base font-semibold flex items-center gap-2 hover:bg-[#185FA5]/90 transition shadow-lg min-h-[48px]"
          >
            <Edit size={16} /> Edit Evaluasi
          </button>
          <button
            onClick={handleDeleteEvaluasi}
            disabled={saving}
            className="bg-[#A32D2D] text-white rounded-full px-8 py-3 text-base font-semibold flex items-center gap-2 hover:bg-[#A32D2D]/90 transition shadow-lg disabled:opacity-50 min-h-[48px]"
          >
            <Trash2 size={18} /> Hapus Data
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
  handleDeleteRiwayat,
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
    <form onSubmit={handleSubmitEvaluasi} noValidate className="space-y-4">
      {/* Data Umum */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-[22px] text-[#185FA5] mb-6">
          Data Pemeriksaan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              Nama Dokter
            </label>
            <input
              name="nama_dokter"
              value={form.nama_dokter}
              onChange={handleChange}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 bg-gray-100 text-base focus:outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#185FA5]/20 transition"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              Tanggal Periksa <span className="text-[#A32D2D]">*</span>
            </label>
            <input
              type="date"
              name="tanggal_periksa"
              value={form.tanggal_periksa}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 h-12 text-base focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 transition ${
                errors.tanggal_periksa ? "border-[#A32D2D] focus:border-[#A32D2D]" : "border-[#E2E8F0] focus:border-[#185FA5]"
              }`}
            />
            {errors.tanggal_periksa && (
              <p className="text-[#A32D2D] text-xs mt-1">{errors.tanggal_periksa}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              Fasilitas Kesehatan
            </label>
            <input
              name="fasilitas_kesehatan"
              value={form.fasilitas_kesehatan}
              onChange={handleChange}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 h-12 text-base focus:outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#185FA5]/20 transition"
            />
          </div>
        </div>
      </div>

      {/* Antropometri */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-[22px] text-[#185FA5] mb-6 flex items-center gap-2">
          Antropometri <HelpTooltip text="Tinggi Badan, Berat Badan, Lingkar Lengan Atas" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              TB (cm) <span className="text-[#A32D2D]">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              name="tb_cm"
              value={form.tb_cm}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 h-12 text-base focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 transition ${
                errors.tb_cm ? "border-[#A32D2D] focus:border-[#A32D2D]" : "border-[#E2E8F0] focus:border-[#185FA5]"
              }`}
            />
            {errors.tb_cm && <p className="text-[#A32D2D] text-xs mt-1">{errors.tb_cm}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              BB (kg) <span className="text-[#A32D2D]">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              name="bb_kg"
              value={form.bb_kg}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 h-12 text-base focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 transition ${
                errors.bb_kg ? "border-[#A32D2D] focus:border-[#A32D2D]" : "border-[#E2E8F0] focus:border-[#185FA5]"
              }`}
            />
            {errors.bb_kg && <p className="text-[#A32D2D] text-xs mt-1">{errors.bb_kg}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              IMT (kg/m²)
            </label>
            <input
              type="text"
              value={imtNumeric ? `${imtNumeric}` : "-"}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 h-12 bg-gray-100 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              Kategori IMT
            </label>
            <input
              type="text"
              value={form.imt_kategori || "-"}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 h-12 bg-gray-100 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              LiLA (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="lila_cm"
              value={form.lila_cm}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 h-12 text-base focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 transition ${
                errors.lila_cm ? "border-[#A32D2D] focus:border-[#A32D2D]" : "border-[#E2E8F0] focus:border-[#185FA5]"
              }`}
            />
            {errors.lila_cm && <p className="text-[#A32D2D] text-xs mt-1">{errors.lila_cm}</p>}
          </div>
        </div>
      </div>

      {/* Status Imunisasi TT */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-[22px] text-[#185FA5] border-b pb-3 mb-5 flex items-center gap-2">
          Status Imunisasi TT <HelpTooltip text="TT = Tetanus Toxoid. Dosis lengkap 5 kali memberikan perlindungan seumur hidup." />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
          {[
            { n: 1, desc: "Kunjungan pertama (TT1)" },
            { n: 2, desc: "4 minggu setelah TT1 (TT2)" },
            { n: 3, desc: "6 bulan setelah TT2 (TT3)" },
            { n: 4, desc: "1 tahun setelah TT3 (TT4)" },
            { n: 5, desc: "1 tahun setelah TT4 (TT5)" },
          ].map(({ n, desc }) => (
            <label
              key={n}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors text-sm"
              title={desc}
            >
              <input
                type="checkbox"
                name={`status_tt_${n}`}
                checked={form[`status_tt_${n}`]}
                onChange={handleChange}
                className="w-4 h-4 text-[#185FA5] border-[#E2E8F0] rounded focus:ring-[#185FA5]"
              />
              <span>TT{n}</span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
            Imunisasi Lainnya (Covid-19, dll)
          </label>
          <input
            name="imunisasi_lainnya_covid19"
            value={form.imunisasi_lainnya_covid19}
            onChange={handleChange}
            className="w-full border border-[#E2E8F0] rounded-lg px-4 h-12 text-base focus:outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#185FA5]/20 transition"
            placeholder="Contoh: Covid-19 dosis 2, Influenza..."
          />
        </div>
      </div>

      {/* Riwayat Kesehatan, Perilaku, Keluarga */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-8 border border-[#E2E8F0]">
        <div>
          <h4 className="font-semibold text-base text-[#185FA5] mb-3">Riwayat Kesehatan Ibu</h4>
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
            className="w-full border border-[#E2E8F0] rounded-lg px-4 h-12 mt-3 text-base"
          />
        </div>
        <div>
          <h4 className="font-semibold text-base text-[#185FA5] mb-3">Perilaku Berisiko (1 bulan sebelum hamil)</h4>
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
            className="w-full border border-[#E2E8F0] rounded-lg px-4 h-12 mt-3 text-base"
          />
        </div>
        <div>
          <h4 className="font-bold text-[22px] text-[#185FA5] mb-3">Riwayat Kesehatan Keluarga</h4>
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
            className="w-full border border-[#E2E8F0] rounded-lg px-4 h-12 mt-3 text-base"
          />
        </div>
      </div>

      {/* Inspeksi */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-[22px] text-[#185FA5] border-b pb-3 mb-6">
          Inspeksi Medis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["porsio", "uretra", "vagina", "vulva", "fluksus", "fluor"].map(
            (item) => (
              <div key={item}>
                <label className="block capitalize text-sm font-bold text-gray-500 uppercase mb-2">
                  {item}
                </label>
                <select
                  name={`inspeksi_${item}`}
                  value={form[`inspeksi_${item}`]}
                  onChange={handleChange}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 h-12 text-base focus:outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#185FA5]/20 transition"
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
        <h3 className="font-semibold text-[22px] text-[#185FA5] mb-6">
          Riwayat Kehamilan Lalu
        </h3>
        {riwayatList.length > 0 && (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full text-base border border-[#E2E8F0]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1">No</th>
                  <th className="px-2 py-3">Tahun</th>
                  <th className="px-2 py-1">BB(gram)</th>
                  <th className="px-2 py-1">Proses</th>
                  <th className="px-2 py-1">Penolong</th>
                  <th className="px-2 py-1">Masalah</th>
                  <th className="px-2 py-1">Aksi</th>
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
                    <td className="px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRiwayat(r.id_riwayat)}
                        className="p-1 text-[#A32D2D] hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
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
            className="border border-[#E2E8F0] rounded-lg px-3 h-12 text-base"
          />
          <input
            type="number"
            placeholder="Tahun *"
            value={formRiwayat.tahun}
            onChange={(e) =>
              setFormRiwayat({ ...formRiwayat, tahun: e.target.value })
            }
            className="border border-[#E2E8F0] rounded-lg px-3 h-12 text-base"
          />
          <input
            type="number"
            placeholder="BB gram"
            value={formRiwayat.bb_gram}
            onChange={(e) =>
              setFormRiwayat({ ...formRiwayat, bb_gram: e.target.value })
            }
            className="border border-[#E2E8F0] rounded-lg px-3 h-12 text-base"
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
            className="border border-[#E2E8F0] rounded-lg px-3 h-12 text-base"
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
            className="border border-[#E2E8F0] rounded-lg px-3 h-12 text-base"
          />
          <input
            placeholder="Masalah"
            value={formRiwayat.masalah}
            onChange={(e) =>
              setFormRiwayat({ ...formRiwayat, masalah: e.target.value })
            }
            className="border border-[#E2E8F0] rounded-lg px-3 h-12 text-base col-span-2"
          />
          <button
            type="button"
            onClick={handleAddRiwayat}
            className="bg-[#185FA5] text-white rounded-full px-6 py-2 text-base font-semibold flex items-center gap-2 justify-center hover:bg-[#185FA5]/90 transition min-h-[44px]"
          >
            <Plus size={18} /> Tambah Riwayat
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-8 py-3 rounded-full border-[1.5px] border-[#185FA5] text-[#185FA5] text-base font-semibold hover:bg-[#185FA5]/5 transition min-h-[48px]"
        >
          Batalkan
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#185FA5] text-white rounded-full px-10 py-3 text-base font-semibold flex items-center gap-2 hover:bg-[#185FA5]/90 disabled:opacity-50 transition shadow-lg min-h-[48px]"
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
          Swal.fire({
            icon: 'info',
            title: 'Data Tidak Tersedia',
            text: 'Ibu belum memiliki data kehamilan.',
            confirmButtonColor: '#185FA5'
          });
          navigate(`/data-ibu/${ibuId}`);
          return;
        }
        let targetKehamilan = null;
        if (kehamilanId) {
          targetKehamilan = kehamilanList.find((k) => k.id == kehamilanId);
          if (!targetKehamilan) {
            Swal.fire({
              icon: 'error',
              title: 'Tidak Ditemukan',
              text: `Kehamilan dengan ID ${kehamilanId} tidak ditemukan.`
            });
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat data. Silakan coba lagi.'
        });
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
      Swal.fire('Akses Dibatasi', 'Tidak dapat mengubah data karena kehamilan sudah selesai.', 'warning');
      return;
    }
    if (!kehamilan) {
      Swal.fire('Error', 'Kehamilan tidak ditemukan', 'error');
      return;
    }
    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validasi Gagal',
        text: 'Mohon perbaiki data yang bermasalah sebelum menyimpan.',
        confirmButtonColor: '#185FA5'
      });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        kehamilan_id: parseInt(kehamilan.id),
        tb_cm: form.tb_cm !== "" ? parseFloat(form.tb_cm) : null,
        bb_kg: form.bb_kg !== "" ? parseFloat(form.bb_kg) : null,
        lila_cm: form.lila_cm !== "" ? parseFloat(form.lila_cm) : null,
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
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Evaluasi kesehatan ibu berhasil disimpan',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Gagal Menyimpan', 'Periksa koneksi Anda atau hubungi admin.', 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvaluasi = async () => {
    if (!evaluasi) return;

    const result = await Swal.fire({
      title: 'Hapus Evaluasi Kesehatan?',
      text: 'Tindakan ini akan menghapus seluruh data evaluasi kesehatan ibu, termasuk riwayat kehamilan lalu. Apakah Anda yakin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      await deleteEvaluasi(evaluasi.id);
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data evaluasi kesehatan berhasil dihapus.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setEvaluasi(null);
      setRiwayatList([]);
      setIsEditing(false);

      // RESET FORM STATE: Memastikan data lama benar-benar hilang dari formulir
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const dokterNama = storedUser.nama || "";
      setForm({
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
      });
      setFormRiwayat({
        no_urut: 1,
        tahun: "",
        bb_gram: "",
        proses_melahirkan: "",
        penolong_proses_melahirkan: "",
        masalah: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: err.response?.data?.message || err.message || 'Terjadi kesalahan saat menghapus data.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRiwayat = async (riwayatId) => {
    const result = await Swal.fire({
      title: 'Hapus Riwayat?',
      text: 'Yakin ingin menghapus baris riwayat kehamilan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRiwayatKehamilan(riwayatId);
      setRiwayatList(prev => prev.filter(r => r.id_riwayat !== riwayatId));
      Swal.fire('Berhasil', 'Riwayat berhasil dihapus', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal menghapus riwayat.', 'error');
    }
  };

  const handleAddRiwayat = async (data = null) => {
    if (!canEdit) {
      Swal.fire('Akses Dibatasi', 'Tidak dapat menambah riwayat karena kehamilan sudah selesai.', 'warning');
      return;
    }
    if (!evaluasi) {
      Swal.fire('Perhatian', 'Simpan evaluasi terlebih dahulu sebelum menambah riwayat.', 'info');
      return;
    }

    const current = data || formRiwayat;
    if (!current.tahun || !current.proses_melahirkan) {
      Swal.fire('Data Tidak Lengkap', 'Tahun dan Proses Melahirkan wajib diisi.', 'warning');
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
      Swal.fire({
        icon: 'success',
        title: 'Riwayat Ditambahkan',
        text: 'Riwayat kehamilan lalu berhasil disimpan',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Error', 'Gagal menambahkan riwayat. Periksa data Anda.', 'error');
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
            <div className="bg-[#FAEEDA] border-l-4 border-[#BA7517] rounded-lg p-4 text-[#633806] text-base flex items-center gap-2">
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
              handleDeleteRiwayat={handleDeleteRiwayat}
            />
          ) : (
            <EvaluationView
              evaluasi={evaluasi}
              form={form}
              riwayatList={riwayatList}
              canEdit={canEdit}
              handleAddRiwayat={handleAddRiwayat}
              setIsEditing={setIsEditing}
              handleDeleteEvaluasi={handleDeleteEvaluasi}
              handleDeleteRiwayat={handleDeleteRiwayat}
              saving={saving}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}