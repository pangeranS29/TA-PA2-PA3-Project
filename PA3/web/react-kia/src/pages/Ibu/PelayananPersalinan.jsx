// src/pages/Ibu/PelayananPersalinan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId, updateKehamilan, updateStatusKehamilan } from "../../services/kehamilan";
import { getIbuById } from "../../services/ibu";
import Swal from "sweetalert2";
import {
  getRingkasanPersalinanByKehamilanId,
  createRingkasanPersalinan,
  updateRingkasanPersalinan,
  getRiwayatMelahirkanByKehamilanId,
  createRiwayatMelahirkan,
  updateRiwayatMelahirkan,
  getKeteranganLahirByIbuId,
  createKeteranganLahir,
  updateKeteranganLahir,
} from "../../services/prosesMelahirkan";
import {
  createAnakDenganPenduduk,
  getAnakByKehamilanId,
} from "../../services/Anak";
import {
  Save, ArrowLeft, Edit2, CheckCircle, Printer,
  Plus, ChevronDown, ChevronUp, Baby, X
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800 font-semibold mt-0.5">{value ?? "-"}</span>
  </div>
);

const emptyRingkasan = () => ({
  tanggal_melahirkan: "", umur_kehamilan_minggu: "",
  penolong_proses_melahirkan: "", cara_melahirkan: "",
  keadaan_ibu: "", keadaan_ibu_detail_sakit: "", keterangan_tambahan_ibu: "",
  kb_pasca_melahirkan: "",
  gravida: "", paritas: "", abortus: "",
  kondisi_bayi_segera_menangis: false,
  kondisi_bayi_menangis_beberapa_saat: false,
  kondisi_bayi_tidak_menangis: false,
  kondisi_bayi_seluruh_tubuh_kemerahan: false,
  kondisi_bayi_anggota_gerak_kebiruan: false,
  kondisi_bayi_seluruh_tubuh_biru: false,
  kondisi_bayi_kelainan_bawaan: false,
  kondisi_bayi_kelainan_bawaan_detail: "",
  kondisi_bayi_meninggal: false,
  asuhan_imd_1_jam_pertama: false,
  asuhan_suntikan_vitamin_k1: false,
  asuhan_salep_mata_antibiotika: false,
  asuhan_imunisasi_hb0: false,
  keterangan_tambahan_bayi: "",
  bayi_anak_ke: "", bayi_berat_lahir_gram: "",
  bayi_panjang_badan_cm: "", bayi_lingkar_kepala_cm: "",
  // Data anak baru
  nama_anak: "", anak_tanggal_lahir: "", anak_jenis_kelamin: "",
  anak_nama_ibu: "", anak_nama_ayah: "",
});

// ─── SuratKeteranganLahir ───────────────────────────────────────────────────

const SuratKeteranganLahir = ({ data }) => (
  <div id="surat-keterangan-lahir" className="bg-white p-10 max-w-2xl mx-auto font-serif text-sm text-gray-800 border border-gray-300 shadow">
    <h1 className="text-center text-xl font-bold tracking-widest mb-1">KETERANGAN LAHIR</h1>
    <div className="flex justify-center mb-4">
      <span className="text-sm">No. <span className="inline-block border-b border-dotted border-gray-400 w-48 ml-1">{data?.nomor_surat || ""}</span></span>
    </div>
    <p className="mb-4">Yang bertandatangan di bawah ini, menerangkan bahwa;</p>
    <div className="flex gap-2 mb-4 flex-wrap items-end">
      <span>Pada hari ini</span>
      <span className="border-b border-dotted border-gray-400 flex-1 min-w-16">{data?.hari_lahir || ""}</span>
      <span>Tanggal</span>
      <span className="border-b border-dotted border-gray-400 flex-1 min-w-24">{data?.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString("id-ID") : ""}</span>
      <span>Pukul</span>
      <span className="border-b border-dotted border-gray-400 flex-1 min-w-16">{data?.pukul_lahir || ""}</span>
    </div>
    <p className="font-bold mb-3">Telah lahir seorang bayi:</p>
    <table className="w-full mb-4 text-sm">
      <tbody>
        <tr><td className="py-1 w-36">Jenis Kelamin</td><td><span className="border-b border-dotted border-gray-400 block w-full">{data?.jenis_kelamin || ""}</span></td></tr>
        <tr><td className="py-1">Jenis Kelahiran</td><td><span className="border-b border-dotted border-gray-400 block w-full">{data?.jenis_kelahiran || ""}</span></td></tr>
        <tr><td className="py-1">Anak ke-</td><td><span className="border-b border-dotted border-gray-400 w-16 inline-block">{data?.anak_ke || ""}</span> Usia gestasi <span className="border-b border-dotted border-gray-400 w-20 inline-block">{data?.usia_gestasi_minggu ? `${data.usia_gestasi_minggu} minggu` : ""}</span></td></tr>
        <tr><td className="py-1">Berat Lahir</td><td><span className="border-b border-dotted border-gray-400 w-20 inline-block">{data?.berat_lahir_gram || ""}</span> g Panjang <span className="border-b border-dotted border-gray-400 w-14 inline-block">{data?.panjang_badan_cm || ""}</span> cm LK <span className="border-b border-dotted border-gray-400 w-12 inline-block">{data?.lingkar_kepala_cm || ""}</span> cm</td></tr>
      </tbody>
    </table>
    <hr className="border-gray-400 my-4" />
    <p className="font-bold mb-3">Dari Orang Tua;</p>
    <table className="w-full text-sm mb-6">
      <tbody>
        <tr><td className="py-1 w-28">Nama Ibu</td><td><span className="border-b border-dotted border-gray-400 block w-full">{data?.nama_ibu || ""}</span></td></tr>
        <tr><td className="py-1">Nama Ayah</td><td><span className="border-b border-dotted border-gray-400 block w-full">{data?.nama_ayah || ""}</span></td></tr>
        <tr><td className="py-1">Pekerjaan</td><td><span className="border-b border-dotted border-gray-400 block w-full">{data?.pekerjaan_orang_tua || ""}</span></td></tr>
        <tr><td className="py-1">Alamat</td><td><span className="border-b border-dotted border-gray-400 block w-full">{data?.alamat_orang_tua || ""}</span></td></tr>
      </tbody>
    </table>
    <div className="grid grid-cols-3 text-center gap-4 mt-4">
      {["Saksi I", "Saksi II", "Penolong Kelahiran"].map((label, i) => (
        <div key={i}><p className="mb-16">{label}</p><p className="border-t border-gray-400 pt-1">(<span className="border-b border-dotted border-gray-400 inline-block w-24">{i === 2 ? data?.nama_penolong_kelahiran || "" : ""}</span>)</p></div>
      ))}
    </div>
  </div>
);

// ─── KelahiranCard ──────────────────────────────────────────────────────────
// Menampilkan 1 kelahiran: ringkasan + daftar anak, bisa di-expand/collapse

function KelahiranCard({ index, ringkasan, anakList, kehamilanId, ibuId, onEdit, onAnakAdded }) {
  const [expanded, setExpanded] = useState(index === 0);

  const kondisiList = [
    ringkasan.kondisi_bayi_segera_menangis && "Segera menangis",
    ringkasan.kondisi_bayi_menangis_beberapa_saat && "Menangis beberapa saat",
    ringkasan.kondisi_bayi_tidak_menangis && "Tidak menangis",
    ringkasan.kondisi_bayi_seluruh_tubuh_kemerahan && "Seluruh tubuh kemerahan",
    ringkasan.kondisi_bayi_anggota_gerak_kebiruan && "Anggota gerak kebiruan",
    ringkasan.kondisi_bayi_seluruh_tubuh_biru && "Seluruh tubuh biru",
    ringkasan.kondisi_bayi_kelainan_bawaan && "Kelainan bawaan",
    ringkasan.kondisi_bayi_meninggal && "Meninggal",
  ].filter(Boolean);

  const asuhanList = [
    ringkasan.asuhan_imd_1_jam_pertama && "IMD 1 jam pertama",
    ringkasan.asuhan_suntikan_vitamin_k1 && "Suntikan Vitamin K1",
    ringkasan.asuhan_salep_mata_antibiotika && "Salep mata antibiotika",
    ringkasan.asuhan_imunisasi_hb0 && "Imunisasi HB0",
  ].filter(Boolean);

  return (
    <div className="border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-white cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {index + 1}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm md:text-base">
              Kelahiran ke-{index + 1}
            </p>
            <p className="text-xs text-gray-500">
              {ringkasan.tanggal_melahirkan || "-"} &bull; {ringkasan.cara_melahirkan || "-"} &bull; {anakList.length} anak
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(ringkasan); }}
            className="text-xs text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50 flex items-center gap-1"
          >
            <Edit2 size={12} /> Edit
          </button>
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-5 space-y-5 bg-white">
          {/* Ringkasan detail */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ringkasan Persalinan</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 bg-gray-50 rounded-xl p-4">
              <DetailItem label="Tanggal Melahirkan" value={ringkasan.tanggal_melahirkan} />
              <DetailItem label="Umur Kehamilan" value={ringkasan.umur_kehamilan_minggu ? `${ringkasan.umur_kehamilan_minggu} mgg` : "-"} />
              <DetailItem label="Penolong" value={ringkasan.penolong_proses_melahirkan} />
              <DetailItem label="Cara Melahirkan" value={ringkasan.cara_melahirkan} />
              <DetailItem label="Keadaan Ibu" value={ringkasan.keadaan_ibu} />
              <DetailItem label="KB Pasca Salin" value={ringkasan.kb_pasca_melahirkan} />
            </div>
          </div>

          {/* Kondisi & Asuhan Bayi */}
          {(kondisiList.length > 0 || asuhanList.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kondisiList.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Kondisi Bayi Saat Lahir</p>
                  <div className="flex flex-wrap gap-1.5">
                    {kondisiList.map((k, i) => (
                      <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">{k}</span>
                    ))}
                  </div>
                </div>
              )}
              {asuhanList.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Asuhan Bayi Baru Lahir</p>
                  <div className="flex flex-wrap gap-1.5">
                    {asuhanList.map((a, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">✓ {a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Daftar Anak */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Baby size={14} /> Anak yang Lahir ({anakList.length})
            </p>
            {anakList.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Belum ada data anak untuk kelahiran ini.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {anakList.map((anak) => (
                  <div key={anak.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-gray-800">{anak.nama || "Tanpa Nama"}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Anak ke-{anak.anak_ke ?? "-"} &bull; {anak.jenis_kelamin || "-"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap">Lahir: {anak.tanggal_lahir || "-"}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div className="rounded-lg bg-white px-2 py-1.5 border text-center">
                        <p className="text-gray-400 text-[10px]">BB</p>
                        <p className="font-bold">{anak.berat_lahir_kg ?? "-"} kg</p>
                      </div>
                      <div className="rounded-lg bg-white px-2 py-1.5 border text-center">
                        <p className="text-gray-400 text-[10px]">PB</p>
                        <p className="font-bold">{anak.tinggi_lahir_cm ?? "-"} cm</p>
                      </div>
                      <div className="rounded-lg bg-white px-2 py-1.5 border text-center">
                        <p className="text-gray-400 text-[10px]">LK</p>
                        <p className="font-bold">{anak.lingkar_kepala_cm ?? "-"} cm</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RingkasanForm ──────────────────────────────────────────────────────────

function RingkasanForm({ initial, onSubmit, onCancel, saving, title }) {
  const [form, setForm] = useState(initial || emptyRingkasan());

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-indigo-700">{title}</h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Info Persalinan */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Info Persalinan</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div><label className="block text-xs font-medium mb-1">Tanggal Melahirkan</label>
            <input type="date" name="tanggal_melahirkan" value={form.tanggal_melahirkan} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Umur Kehamilan (Mgg)</label>
            <input type="number" name="umur_kehamilan_minggu" value={form.umur_kehamilan_minggu} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Penolong</label>
            <input name="penolong_proses_melahirkan" value={form.penolong_proses_melahirkan} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Cara Melahirkan</label>
            <select name="cara_melahirkan" value={form.cara_melahirkan} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm">
              <option value="">-- Pilih --</option>
              <option>Spontan/Normal</option><option>SC</option><option>Vakum</option>
            </select></div>
          <div><label className="block text-xs font-medium mb-1">Keadaan Ibu</label>
            <input name="keadaan_ibu" value={form.keadaan_ibu} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">KB Pasca Salin</label>
            <input name="kb_pasca_melahirkan" value={form.kb_pasca_melahirkan} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
        </div>
      </div>

      {/* Data Bayi */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Data Bayi</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div><label className="block text-xs font-medium mb-1">Anak Ke</label>
            <input type="number" name="bayi_anak_ke" value={form.bayi_anak_ke} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Berat (gram)</label>
            <input type="number" name="bayi_berat_lahir_gram" value={form.bayi_berat_lahir_gram} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Panjang (cm)</label>
            <input type="number" name="bayi_panjang_badan_cm" value={form.bayi_panjang_badan_cm} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Lingkar Kepala (cm)</label>
            <input type="number" name="bayi_lingkar_kepala_cm" value={form.bayi_lingkar_kepala_cm} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
        </div>
      </div>

      {/* Kondisi Bayi */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kondisi Bayi Saat Lahir</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {[
            ["kondisi_bayi_segera_menangis", "Segera menangis"],
            ["kondisi_bayi_menangis_beberapa_saat", "Menangis beberapa saat"],
            ["kondisi_bayi_tidak_menangis", "Tidak menangis"],
            ["kondisi_bayi_seluruh_tubuh_kemerahan", "Seluruh tubuh kemerahan"],
            ["kondisi_bayi_anggota_gerak_kebiruan", "Anggota gerak kebiruan"],
            ["kondisi_bayi_seluruh_tubuh_biru", "Seluruh tubuh biru"],
            ["kondisi_bayi_kelainan_bawaan", "Kelainan bawaan"],
            ["kondisi_bayi_meninggal", "Meninggal"],
          ].map(([name, label]) => (
            <label key={name} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-4 h-4 accent-indigo-600" />
              {label}
            </label>
          ))}
        </div>
        {form.kondisi_bayi_kelainan_bawaan && (
          <div><label className="block text-xs font-medium mb-1">Detail Kelainan Bawaan</label>
            <input name="kondisi_bayi_kelainan_bawaan_detail" value={form.kondisi_bayi_kelainan_bawaan_detail} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
        )}
      </div>

      {/* Asuhan Bayi */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Asuhan Bayi Baru Lahir</p>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {[
            ["asuhan_imd_1_jam_pertama", "Inisiasi Menyusu Dini (IMD) dalam 1 jam pertama"],
            ["asuhan_suntikan_vitamin_k1", "Suntikan Vitamin K1"],
            ["asuhan_salep_mata_antibiotika", "Salep mata Antibiotika Profilaksis"],
            ["asuhan_imunisasi_hb0", "Imunisasi HB0"],
          ].map(([name, label]) => (
            <label key={name} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-4 h-4 accent-indigo-600" />
              {label}
            </label>
          ))}
        </div>
        <div><label className="block text-xs font-medium mb-1">Keterangan Tambahan Bayi</label>
          <textarea name="keterangan_tambahan_bayi" value={form.keterangan_tambahan_bayi} onChange={handleChange} rows={2} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
      </div>

      {/* Data Anak (opsional) */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Data Anak Lahir <span className="normal-case font-normal text-gray-400">(opsional — isi jika ingin mendaftarkan anak)</span></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className="block text-xs font-medium mb-1">Nama Anak</label>
            <input name="nama_anak" value={form.nama_anak} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Tanggal Lahir Anak</label>
            <input type="date" name="anak_tanggal_lahir" value={form.anak_tanggal_lahir} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Jenis Kelamin</label>
            <select name="anak_jenis_kelamin" value={form.anak_jenis_kelamin} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm">
              <option value="">-- Pilih --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select></div>
          <div><label className="block text-xs font-medium mb-1">Nama Ibu</label>
            <input name="anak_nama_ibu" value={form.anak_nama_ibu} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Nama Ayah</label>
            <input name="anak_nama_ayah" value={form.anak_nama_ayah} onChange={handleChange} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-semibold text-sm">
          <Save size={16} /> {saving ? "Menyimpan..." : "Simpan"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

// ─── HALAMAN UTAMA ──────────────────────────────────────────────────────────

export default function PelayananPersalinan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [kehamilan, setKehamilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Multiple ringkasan: array of { ringkasan, anakList }
  const [kelahiranList, setKelahiranList] = useState([]);

  // Form state
  const [showNewForm, setShowNewForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // ringkasan object yang sedang di-edit

  // Riwayat & Keterangan (tetap single)
  const [modeRiwayat, setModeRiwayat] = useState("empty");
  const [riwayat, setRiwayat] = useState(null);
  const [formRiwayat, setFormRiwayat] = useState({
    g_gravida: "", p_partus: "", a_abortus: "",
    tanggal_melahirkan: "", fasyankes_tempat_melahirkan: "",
    cara_melahirkan_spontan: false, tindakan_sc: false,
  });

  const [modeKeterangan, setModeKeterangan] = useState("empty");
  const [keterangan, setKeterangan] = useState(null);
  const [formKeterangan, setFormKeterangan] = useState({
    nomor_surat: "", hari_lahir: "", tanggal_lahir: "", pukul_lahir: "",
    jenis_kelamin: "", jenis_kelahiran: "", anak_ke: "", usia_gestasi_minggu: "",
    berat_lahir_gram: "", panjang_badan_cm: "", lingkar_kepala_cm: "",
    lokasi_persalinan: "", alamat_lokasi_persalinan: "",
    nama_bayi_diberi_nama: "", nama_ibu: "", nik_ibu: "",
    nama_ayah: "", pekerjaan_orang_tua: "", alamat_orang_tua: "",
    nama_penolong_kelahiran: "",
  });

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchKelahiran = async (kehamilanId, ibuIdParam) => {
    try {
      const [ringkasanList, anakList] = await Promise.all([
        getRingkasanPersalinanByKehamilanId(kehamilanId),
        getAnakByKehamilanId(kehamilanId),
      ]);

      const safeRingkasan = Array.isArray(ringkasanList) ? ringkasanList : [];
      const safeAnak = Array.isArray(anakList) ? anakList : [];

      // Group anak ke ringkasan terdekat berdasarkan tanggal_melahirkan
      // Anak yang tidak bisa digroup masuk ke kelahiran pertama
      const sorted = [...safeRingkasan].sort(
        (a, b) => new Date(a.tanggal_melahirkan) - new Date(b.tanggal_melahirkan)
      );

      const grouped = sorted.map((r, i) => {
        const nextDate = sorted[i + 1]?.tanggal_melahirkan;
        const anakForThis = safeAnak.filter((a) => {
          if (!a.tanggal_lahir) return i === 0;
          const tgl = new Date(a.tanggal_lahir);
          const from = new Date(r.tanggal_melahirkan);
          const to = nextDate ? new Date(nextDate) : new Date("9999-12-31");
          return tgl >= from && tgl < to;
        });
        return { ringkasan: r, anakList: anakForThis };
      });

      // Anak tanpa kecocokan tanggal → masuk kelahiran pertama
      if (grouped.length > 0) {
        const allGroupedAnakIds = grouped.flatMap((g) => g.anakList.map((a) => a.id));
        const orphans = safeAnak.filter((a) => !allGroupedAnakIds.includes(a.id));
        grouped[0].anakList = [...orphans, ...grouped[0].anakList];
      }

      setKelahiranList(grouped);
    } catch (err) {
      console.error("Error fetching kelahiran:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanListRes = await getKehamilanByIbuId(id);
        if (kehamilanListRes.length > 0) {
          const aktif = kehamilanListRes[0];
          setKehamilan(aktif);
          await fetchKelahiran(aktif.id, id);

          // Riwayat
          const dRiwayat = await getRiwayatMelahirkanByKehamilanId(aktif.id);
          if (dRiwayat && dRiwayat.length > 0) {
            const d = dRiwayat[0];
            setRiwayat(d);
            setFormRiwayat({
              g_gravida: d.g_gravida ?? "", p_partus: d.p_partus ?? "",
              a_abortus: d.a_abortus ?? "",
              tanggal_melahirkan: d.tanggal_melahirkan ? d.tanggal_melahirkan.split("T")[0] : "",
              fasyankes_tempat_melahirkan: d.fasyankes_tempat_melahirkan || "",
              cara_melahirkan_spontan: d.cara_melahirkan_spontan || false,
              tindakan_sc: d.tindakan_sc || false,
            });
            setModeRiwayat("detail");
          }
        }

        // Keterangan
        const dKet = await getKeteranganLahirByIbuId(id);
        if (dKet && dKet.length > 0) {
          const d = dKet[0];
          setKeterangan(d);
          setFormKeterangan({
            nomor_surat: d.nomor_surat || "", hari_lahir: d.hari_lahir || "",
            tanggal_lahir: d.tanggal_lahir ? d.tanggal_lahir.split("T")[0] : "",
            pukul_lahir: d.pukul_lahir || "", jenis_kelamin: d.jenis_kelamin || "",
            jenis_kelahiran: d.jenis_kelahiran || "", anak_ke: d.anak_ke ?? "",
            usia_gestasi_minggu: d.usia_gestasi_minggu ?? "",
            berat_lahir_gram: d.berat_lahir_gram ?? "", panjang_badan_cm: d.panjang_badan_cm ?? "",
            lingkar_kepala_cm: d.lingkar_kepala_cm ?? "", lokasi_persalinan: d.lokasi_persalinan || "",
            alamat_lokasi_persalinan: d.alamat_lokasi_persalinan || "",
            nama_bayi_diberi_nama: d.nama_bayi_diberi_nama || "",
            nama_ibu: d.nama_ibu || "", nik_ibu: d.nik_ibu || "",
            nama_ayah: d.nama_ayah || "", pekerjaan_orang_tua: d.pekerjaan_orang_tua || "",
            alamat_orang_tua: d.alamat_orang_tua || "",
            nama_penolong_kelahiran: d.nama_penolong_kelahiran || "",
          });
          setModeKeterangan("detail");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── submit ringkasan (create / update) ─────────────────────────────────────

  const buildPayload = (form, kehamilanId) => {
    const p = {
      kehamilan_id: kehamilanId,
      tanggal_melahirkan: form.tanggal_melahirkan,
      umur_kehamilan_minggu: parseInt(form.umur_kehamilan_minggu) || 0,
      penolong_proses_melahirkan: form.penolong_proses_melahirkan,
      cara_melahirkan: form.cara_melahirkan,
      keadaan_ibu: form.keadaan_ibu,
      keadaan_ibu_detail_sakit: form.keadaan_ibu_detail_sakit,
      keterangan_tambahan_ibu: form.keterangan_tambahan_ibu,
      kb_pasca_melahirkan: form.kb_pasca_melahirkan,
      gravida: parseInt(form.gravida) || 0,
      paritas: parseInt(form.paritas) || 0,
      abortus: parseInt(form.abortus) || 0,
      kondisi_bayi_segera_menangis: form.kondisi_bayi_segera_menangis,
      kondisi_bayi_menangis_beberapa_saat: form.kondisi_bayi_menangis_beberapa_saat,
      kondisi_bayi_tidak_menangis: form.kondisi_bayi_tidak_menangis,
      kondisi_bayi_seluruh_tubuh_kemerahan: form.kondisi_bayi_seluruh_tubuh_kemerahan,
      kondisi_bayi_anggota_gerak_kebiruan: form.kondisi_bayi_anggota_gerak_kebiruan,
      kondisi_bayi_seluruh_tubuh_biru: form.kondisi_bayi_seluruh_tubuh_biru,
      kondisi_bayi_kelainan_bawaan: form.kondisi_bayi_kelainan_bawaan,
      kondisi_bayi_kelainan_bawaan_detail: form.kondisi_bayi_kelainan_bawaan_detail,
      kondisi_bayi_meninggal: form.kondisi_bayi_meninggal,
      asuhan_imd_1_jam_pertama: form.asuhan_imd_1_jam_pertama,
      asuhan_suntikan_vitamin_k1: form.asuhan_suntikan_vitamin_k1,
      asuhan_salep_mata_antibiotika: form.asuhan_salep_mata_antibiotika,
      asuhan_imunisasi_hb0: form.asuhan_imunisasi_hb0,
      keterangan_tambahan_bayi: form.keterangan_tambahan_bayi,
      bayi_anak_ke: parseInt(form.bayi_anak_ke) || 0,
      bayi_berat_lahir_gram: parseFloat(form.bayi_berat_lahir_gram) || 0,
      bayi_panjang_badan_cm: parseFloat(form.bayi_panjang_badan_cm) || 0,
      bayi_lingkar_kepala_cm: parseFloat(form.bayi_lingkar_kepala_cm) || 0,
      bayi_jenis_kelamin: form.anak_jenis_kelamin || "",
    };
    return p;
  };

  const handleSubmitNew = async (form) => {
    if (!kehamilan) return;
    setSaving(true);
    try {
      const payload = buildPayload(form, kehamilan.id);
      await createRingkasanPersalinan(payload);

      // Update status kehamilan ke NIFAS jika belum
      if (kehamilan.status_kehamilan !== "NIFAS" && kehamilan.status_kehamilan !== "NON-AKTIF") {
        try {
          await updateStatusKehamilan(kehamilan.id, "NIFAS");
          setKehamilan((prev) => ({ ...prev, status_kehamilan: "NIFAS" }));
        } catch (err) {
          console.error("Gagal update status:", err);
        }
      }

      // Simpan anak jika ada
      if (form.nama_anak && form.nama_anak.trim()) {
        await createAnakDenganPenduduk({
          kehamilan_id: kehamilan.id,
          ibu_id: kehamilan.ibu_id,
          nama: form.nama_anak,
          jenis_kelamin: form.anak_jenis_kelamin || "",
          tanggal_lahir: form.anak_tanggal_lahir || "",
          anak_ke: parseInt(form.bayi_anak_ke) || 0,
          berat_lahir_kg: form.bayi_berat_lahir_gram ? parseFloat(form.bayi_berat_lahir_gram) / 1000 : null,
          tinggi_lahir_cm: form.bayi_panjang_badan_cm ? parseFloat(form.bayi_panjang_badan_cm) : null,
          lingkar_kepala_cm: form.bayi_lingkar_kepala_cm ? parseFloat(form.bayi_lingkar_kepala_cm) : null,
          nama_ibu: form.anak_nama_ibu || "",
          nama_ayah: form.anak_nama_ayah || "",
        });
      }

      setShowNewForm(false);
      await fetchKelahiran(kehamilan.id, id);
      await Swal.fire({ icon: "success", title: "Berhasil", text: "Kelahiran baru berhasil disimpan", timer: 1800, showConfirmButton: false });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      Swal.fire({ icon: "error", title: "Gagal", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEdit = async (form) => {
    if (!editTarget || !kehamilan) return;
    setSaving(true);
    try {
      const idR = editTarget.id_ringkasan || editTarget.id || editTarget.ID;
      const payload = buildPayload(form, kehamilan.id);
      await updateRingkasanPersalinan(idR, payload);

      // Simpan anak baru jika ada
      if (form.nama_anak && form.nama_anak.trim()) {
        await createAnakDenganPenduduk({
          kehamilan_id: kehamilan.id,
          ibu_id: kehamilan.ibu_id,
          nama: form.nama_anak,
          jenis_kelamin: form.anak_jenis_kelamin || "",
          tanggal_lahir: form.anak_tanggal_lahir || "",
          anak_ke: parseInt(form.bayi_anak_ke) || 0,
          berat_lahir_kg: form.bayi_berat_lahir_gram ? parseFloat(form.bayi_berat_lahir_gram) / 1000 : null,
          tinggi_lahir_cm: form.bayi_panjang_badan_cm ? parseFloat(form.bayi_panjang_badan_cm) : null,
          lingkar_kepala_cm: form.bayi_lingkar_kepala_cm ? parseFloat(form.bayi_lingkar_kepala_cm) : null,
          nama_ibu: form.anak_nama_ibu || "",
          nama_ayah: form.anak_nama_ayah || "",
        });
      }

      setEditTarget(null);
      await fetchKelahiran(kehamilan.id, id);
      await Swal.fire({ icon: "success", title: "Berhasil", text: "Data berhasil diperbarui", timer: 1800, showConfirmButton: false });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      Swal.fire({ icon: "error", title: "Gagal", text: msg });
    } finally {
      setSaving(false);
    }
  };

  // ── submit riwayat ─────────────────────────────────────────────────────────

  const submitRiwayat = async (e) => {
    e.preventDefault();
    if (!kehamilan) return;
    setSaving(true);
    try {
      const payload = { ...formRiwayat, kehamilan_id: kehamilan.id };
      payload.g_gravida = parseInt(payload.g_gravida) || 0;
      payload.p_partus = parseInt(payload.p_partus) || 0;
      payload.a_abortus = parseInt(payload.a_abortus) || 0;
      if (riwayat) {
        await updateRiwayatMelahirkan(riwayat.id_riwayat_melahirkan || riwayat.id, payload);
      } else {
        const saved = await createRiwayatMelahirkan(payload);
        setRiwayat(saved);
      }
      setModeRiwayat("detail");
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // ── submit keterangan ──────────────────────────────────────────────────────

  const submitKeterangan = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formKeterangan, id_ibu_relasi: parseInt(id) };
      payload.berat_lahir_gram = parseInt(payload.berat_lahir_gram) || 0;
      payload.panjang_badan_cm = parseInt(payload.panjang_badan_cm) || 0;
      payload.lingkar_kepala_cm = parseInt(payload.lingkar_kepala_cm) || 0;
      payload.usia_gestasi_minggu = parseInt(payload.usia_gestasi_minggu) || 0;
      payload.anak_ke = parseInt(payload.anak_ke) || 0;
      if (keterangan) {
        await updateKeteranganLahir(keterangan.id_keterangan_lahir || keterangan.id, payload);
      } else {
        const saved = await createKeteranganLahir(payload);
        setKeterangan(saved);
      }
      setModeKeterangan("detail");
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("surat-keterangan-lahir").innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Surat Keterangan Lahir</title>
      <style>body{font-family:serif;font-size:13px;padding:40px;color:#111}table{width:100%;border-collapse:collapse}td{padding:3px 2px;vertical-align:top}.border-dotted{border-bottom:1px dotted #555;display:inline-block;min-width:60px}hr{border:1px solid #555;margin:16px 0}h1{text-align:center;letter-spacing:6px}</style>
      </head><body>${printContents}</body></html>`);
    w.document.close(); w.print();
  };

  const TabButton = ({ tabId, label }) => (
    <button onClick={() => setActiveTab(tabId)}
      className={`py-2.5 px-4 md:px-5 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tabId ? "border-indigo-600 text-indigo-600 bg-indigo-50" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
      {label}
    </button>
  );

  if (loading) return <MainLayout><div className="p-6 text-gray-400">Memuat...</div></MainLayout>;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Proses & Riwayat Melahirkan</h1>
            <p className="text-sm text-gray-500">Pencatatan proses persalinan hingga bayi lahir.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full border-b border-gray-200 mb-6 flex overflow-x-auto">
          <TabButton tabId="ringkasan" label="Ringkasan Melahirkan" />
          <TabButton tabId="riwayat" label="Riwayat Melahirkan" />
          <TabButton tabId="keterangan" label="Surat Keterangan Lahir" />
        </div>

        {/* ===== TAB RINGKASAN ===== */}
        {activeTab === "ringkasan" && (
          <div className="space-y-4">
            {/* Jika sedang edit salah satu kelahiran */}
            {editTarget && (
              <RingkasanForm
                key={editTarget.id}
                initial={{
                  ...editTarget,
                  bayi_anak_ke: editTarget.bayi_anak_ke ?? "",
                  bayi_berat_lahir_gram: editTarget.bayi_berat_lahir_gram ?? "",
                  bayi_panjang_badan_cm: editTarget.bayi_panjang_badan_cm ?? "",
                  bayi_lingkar_kepala_cm: editTarget.bayi_lingkar_kepala_cm ?? "",
                  nama_anak: "", anak_tanggal_lahir: "", anak_jenis_kelamin: "",
                  anak_nama_ibu: "", anak_nama_ayah: "",
                }}
                title={`Edit Kelahiran`}
                onSubmit={handleSubmitEdit}
                onCancel={() => setEditTarget(null)}
                saving={saving}
              />
            )}

            {/* List kelahiran */}
            {!editTarget && kelahiranList.length === 0 && !showNewForm && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Plus size={24} className="text-indigo-400" />
                  </div>
                  <p className="font-semibold text-gray-700">Belum Ada Data Persalinan</p>
                  <p className="text-sm text-gray-400">Tambahkan ringkasan persalinan pertama.</p>
                  <button onClick={() => setShowNewForm(true)}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 mt-1">
                    <Plus size={16} /> Tambah Kelahiran
                  </button>
                </div>
              </div>
            )}

            {!editTarget && kelahiranList.map(({ ringkasan, anakList }, i) => (
              <KelahiranCard
                key={ringkasan.id || i}
                index={i}
                ringkasan={ringkasan}
                anakList={anakList}
                kehamilanId={kehamilan?.id}
                ibuId={id}
                onEdit={(r) => { setEditTarget(r); setShowNewForm(false); }}
                onAnakAdded={() => fetchKelahiran(kehamilan?.id, id)}
              />
            ))}

            {/* Form kelahiran baru */}
            {!editTarget && showNewForm && (
              <RingkasanForm
                initial={emptyRingkasan()}
                title={`Tambah Kelahiran ke-${kelahiranList.length + 1}`}
                onSubmit={handleSubmitNew}
                onCancel={() => setShowNewForm(false)}
                saving={saving}
              />
            )}

            {/* Tombol tambah kelahiran baru */}
            {!editTarget && !showNewForm && kelahiranList.length > 0 && (
              <button onClick={() => setShowNewForm(true)}
                className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-500 font-semibold text-sm hover:border-indigo-400 hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                <Plus size={18} /> Tambah Kelahiran Baru
              </button>
            )}
          </div>
        )}

        {/* ===== TAB RIWAYAT ===== */}
        {activeTab === "riwayat" && (
          <>
            {modeRiwayat === "detail" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={18} />
                    <h2 className="text-base font-semibold text-gray-800">Riwayat Proses Melahirkan</h2>
                  </div>
                  <button onClick={() => setModeRiwayat("form")} className="text-xs text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50 flex items-center gap-1">
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
                  <DetailItem label="Gravida (G)" value={formRiwayat.g_gravida} />
                  <DetailItem label="Partus (P)" value={formRiwayat.p_partus} />
                  <DetailItem label="Abortus (A)" value={formRiwayat.a_abortus} />
                  <DetailItem label="Tanggal Melahirkan" value={formRiwayat.tanggal_melahirkan} />
                  <DetailItem label="Faskes" value={formRiwayat.fasyankes_tempat_melahirkan} />
                  <DetailItem label="Cara Melahirkan" value={formRiwayat.cara_melahirkan_spontan ? "Spontan/Normal" : formRiwayat.tindakan_sc ? "Operasi Caesar" : "-"} />
                </div>
              </div>
            )}
            {modeRiwayat === "empty" && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <p className="font-semibold text-gray-700 mb-1">Belum Ada Riwayat Melahirkan</p>
                <p className="text-sm text-gray-400 mb-4">Silakan isi riwayat proses melahirkan.</p>
                <button onClick={() => setModeRiwayat("form")} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 mx-auto">
                  <Plus size={16} /> Tambah Data
                </button>
              </div>
            )}
            {modeRiwayat === "form" && (
              <form onSubmit={submitRiwayat} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-indigo-700">Riwayat Proses Melahirkan</h2>
                  {riwayat && <button type="button" onClick={() => setModeRiwayat("detail")} className="p-2 rounded-full hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><label className="block text-xs font-medium mb-1">Gravida (G)</label><input type="number" name="g_gravida" value={formRiwayat.g_gravida} onChange={(e) => setFormRiwayat((p) => ({ ...p, g_gravida: e.target.value }))} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Partus (P)</label><input type="number" name="p_partus" value={formRiwayat.p_partus} onChange={(e) => setFormRiwayat((p) => ({ ...p, p_partus: e.target.value }))} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Abortus (A)</label><input type="number" name="a_abortus" value={formRiwayat.a_abortus} onChange={(e) => setFormRiwayat((p) => ({ ...p, a_abortus: e.target.value }))} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Tanggal Melahirkan</label><input type="date" name="tanggal_melahirkan" value={formRiwayat.tanggal_melahirkan} onChange={(e) => setFormRiwayat((p) => ({ ...p, tanggal_melahirkan: e.target.value }))} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-medium mb-1">Faskes / Tempat Melahirkan</label><input name="fasyankes" value={formRiwayat.fasyankes_tempat_melahirkan} onChange={(e) => setFormRiwayat((p) => ({ ...p, fasyankes_tempat_melahirkan: e.target.value }))} className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={formRiwayat.cara_melahirkan_spontan} onChange={(e) => setFormRiwayat((p) => ({ ...p, cara_melahirkan_spontan: e.target.checked }))} className="accent-indigo-600" /> Spontan/Normal</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={formRiwayat.tindakan_sc} onChange={(e) => setFormRiwayat((p) => ({ ...p, tindakan_sc: e.target.checked }))} className="accent-indigo-600" /> Operasi Caesar</label>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-indigo-700">
                    <Save size={16} /> {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* ===== TAB KETERANGAN ===== */}
        {activeTab === "keterangan" && (
          <>
            {modeKeterangan === "detail" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <button onClick={() => setModeKeterangan("form")} className="text-sm text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50 flex items-center gap-1"><Edit2 size={13} /> Edit Data</button>
                  <button onClick={handlePrint} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"><Printer size={16} /> Cetak</button>
                </div>
                <SuratKeteranganLahir data={formKeterangan} />
              </div>
            )}
            {modeKeterangan === "empty" && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <p className="font-semibold text-gray-700 mb-1">Belum Ada Surat Keterangan Lahir</p>
                <p className="text-sm text-gray-400 mb-4">Silakan isi data untuk membuat Surat Keterangan Lahir.</p>
                <button onClick={() => setModeKeterangan("form")} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 mx-auto"><Plus size={16} /> Tambah Data</button>
              </div>
            )}
            {modeKeterangan === "form" && (
              <form onSubmit={submitKeterangan} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-indigo-700">Surat Keterangan Lahir</h2>
                  {keterangan && <button type="button" onClick={() => setModeKeterangan("detail")} className="p-2 rounded-full hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {[
                    { label: "Nomor Surat", name: "nomor_surat", type: "text" },
                    { label: "Nama Bayi", name: "nama_bayi_diberi_nama", type: "text" },
                    { label: "Tanggal Lahir", name: "tanggal_lahir", type: "date" },
                    { label: "Hari Lahir", name: "hari_lahir", type: "text", placeholder: "Senin" },
                    { label: "Pukul Lahir", name: "pukul_lahir", type: "text", placeholder: "08:30" },
                    { label: "Anak Ke", name: "anak_ke", type: "number" },
                    { label: "Usia Gestasi (Mgg)", name: "usia_gestasi_minggu", type: "number" },
                    { label: "Berat Lahir (gram)", name: "berat_lahir_gram", type: "number" },
                    { label: "Panjang Badan (cm)", name: "panjang_badan_cm", type: "number" },
                    { label: "Lingkar Kepala (cm)", name: "lingkar_kepala_cm", type: "number" },
                    { label: "Nama Ibu", name: "nama_ibu", type: "text" },
                    { label: "NIK Ibu", name: "nik_ibu", type: "text" },
                    { label: "Nama Ayah", name: "nama_ayah", type: "text" },
                    { label: "Pekerjaan", name: "pekerjaan_orang_tua", type: "text" },
                    { label: "Alamat", name: "alamat_orang_tua", type: "text" },
                    { label: "Penolong Kelahiran", name: "nama_penolong_kelahiran", type: "text" },
                    { label: "Lokasi Persalinan", name: "lokasi_persalinan", type: "text" },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name}><label className="block text-xs font-medium mb-1">{label}</label>
                      <input type={type} name={name} value={formKeterangan[name]} placeholder={placeholder}
                        onChange={(e) => setFormKeterangan((p) => ({ ...p, [name]: e.target.value }))}
                        className="w-full border rounded-lg px-2 py-1.5 text-sm" /></div>
                  ))}
                  <div><label className="block text-xs font-medium mb-1">Jenis Kelamin</label>
                    <select name="jenis_kelamin" value={formKeterangan.jenis_kelamin} onChange={(e) => setFormKeterangan((p) => ({ ...p, jenis_kelamin: e.target.value }))} className="w-full border rounded-lg px-2 py-1.5 text-sm">
                      <option value="">-- Pilih --</option><option>Laki-laki</option><option>Perempuan</option>
                    </select></div>
                  <div><label className="block text-xs font-medium mb-1">Jenis Kelahiran</label>
                    <select name="jenis_kelahiran" value={formKeterangan.jenis_kelahiran} onChange={(e) => setFormKeterangan((p) => ({ ...p, jenis_kelahiran: e.target.value }))} className="w-full border rounded-lg px-2 py-1.5 text-sm">
                      <option value="">-- Pilih --</option><option>Tunggal</option><option>Kembar 2</option><option>Kembar 3</option><option>Lainnya</option>
                    </select></div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-indigo-700">
                    <Save size={16} /> {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}