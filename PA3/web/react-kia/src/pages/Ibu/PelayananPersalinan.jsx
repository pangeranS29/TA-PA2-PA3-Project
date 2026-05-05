// src/pages/Ibu/PelayananPersalinan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
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
import { Save, ArrowLeft, Edit2, CheckCircle, Printer, Plus, Home } from "lucide-react";

// ============================================================
// KOMPONEN DETAIL ITEM
// ============================================================
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800 font-semibold mt-0.5">{value ?? "-"}</span>
  </div>
);

// ============================================================
// KOMPONEN EMPTY STATE
// ============================================================
const EmptyState = ({ title, message, onAdd }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-indigo-50 rounded-full">
        <Plus size={40} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
      <button
        onClick={onAdd}
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
      >
        <Plus size={18} /> Tambah Data
      </button>
    </div>
  </div>
);

// ============================================================
// KOMPONEN SURAT KETERANGAN LAHIR
// ============================================================
const SuratKeteranganLahir = ({ data }) => (
  <div
    id="surat-keterangan-lahir"
    className="bg-white p-10 max-w-2xl mx-auto font-serif text-sm text-gray-800 border border-gray-300 shadow"
  >
    <div className="text-center text-xs text-green-700 font-sans mb-2 print:hidden">
      Diisi oleh Tenaga Kesehatan
    </div>

    <h1 className="text-center text-xl font-bold tracking-widest mb-1">KETERANGAN LAHIR</h1>
    <div className="flex justify-center mb-4">
      <span className="text-sm">
        No.{" "}
        <span className="inline-block border-b border-dotted border-gray-400 w-48 ml-1">
          {data?.nomor_surat || ""}
        </span>
      </span>
    </div>

    <p className="mb-4">Yang bertandatangan di bawah ini, menerangkan bahwa;</p>

    <div className="flex gap-2 mb-4 flex-wrap items-end">
      <span>Pada hari ini</span>
      <span className="border-b border-dotted border-gray-400 flex-1 min-w-16">{data?.hari_lahir || ""}</span>
      <span>Tanggal</span>
      <span className="border-b border-dotted border-gray-400 flex-1 min-w-24">{data?.tanggal_lahir || ""}</span>
      <span>Pukul</span>
      <span className="border-b border-dotted border-gray-400 flex-1 min-w-16">{data?.pukul_lahir || ""}</span>
    </div>

    <p className="font-bold mb-3">Telah lahir seorang bayi:</p>

    <table className="w-full mb-4 text-sm">
      <tbody>
        <tr>
          <td className="py-1 w-36 align-top">Jenis Kelamin</td>
          <td className="py-1">
            <span className="border-b border-dotted border-gray-400 block w-full">
              {data?.jenis_kelamin || "Laki-laki/Perempuan"}
            </span>
          </td>
        </tr>
        <tr>
          <td className="py-1 align-top">Jenis Kelahiran</td>
          <td className="py-1">
            <span className="border-b border-dotted border-gray-400 block w-full">
              {data?.jenis_kelahiran || "Tunggal/Kembar 2/Kembar 3/Lainnya"}
            </span>
          </td>
        </tr>
        <tr>
          <td className="py-1 align-top">Anak ke-</td>
          <td className="py-1">
            <span className="inline-flex gap-3 flex-wrap items-end w-full">
              <span className="border-b border-dotted border-gray-400 w-16">{data?.anak_ke || ""}</span>
              <span>Usia gestasi</span>
              <span className="border-b border-dotted border-gray-400 w-20">
                {data?.usia_gestasi_minggu ? `${data.usia_gestasi_minggu} minggu` : ""}
              </span>
            </span>
          </td>
        </tr>
        <tr>
          <td className="py-1 align-top">Berat Lahir</td>
          <td className="py-1">
            <span className="inline-flex gap-2 flex-wrap items-end">
              <span className="border-b border-dotted border-gray-400 w-20">{data?.berat_lahir_gram || ""}</span>
              <span>g</span>
              <span className="ml-2">Panjang Badan</span>
              <span className="border-b border-dotted border-gray-400 w-14">{data?.panjang_badan_cm || ""}</span>
              <span>cm</span>
              <span className="ml-2">Lingkar Kepala</span>
              <span className="border-b border-dotted border-gray-400 w-12">{data?.lingkar_kepala_cm || ""}</span>
              <span>cm</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div className="flex gap-2 mb-1 flex-wrap items-end">
      <span>Di Rumah Sakit/Puskesmas/Rumah Bersalin/Praktik Mandiri Bidan/di</span>
      <span className="border-b border-dotted border-gray-400 flex-1 min-w-24">
        {data?.lokasi_persalinan || ""}
      </span>
    </div>

    <hr className="border-gray-400 my-4" />

    <div className="mb-1 font-semibold">Alamat</div>
    <div className="border border-gray-300 rounded p-3 min-h-16 mb-2 text-sm">
      <p className="text-gray-400 text-xs">Diberi Nama</p>
      <p className="mt-1">{data?.nama_bayi_diberi_nama || ""}</p>
    </div>
    <div className="border-b border-dotted border-gray-400 mb-4 w-full min-h-4">
      {data?.alamat_lokasi_persalinan || ""}
    </div>

    <hr className="border-gray-400 my-4" />

    <p className="font-bold mb-3">Dari Orang Tua;</p>
    <table className="w-full text-sm mb-6">
      <tbody>
        <tr>
          <td className="py-1 w-28">Nama Ibu</td>
          <td className="py-1" colSpan={2}>
            <span className="border-b border-dotted border-gray-400 block w-full">{data?.nama_ibu || ""}</span>
          </td>
          <td className="py-1 px-2 whitespace-nowrap">Umur</td>
          <td className="py-1 w-16">
            <span className="border-b border-dotted border-gray-400 block w-full"></span>
          </td>
          <td className="py-1 pl-1 whitespace-nowrap">tahun</td>
        </tr>
        <tr>
          <td className="py-1">NIK</td>
          <td className="py-1" colSpan={5}>
            <span className="border-b border-dotted border-gray-400 block w-full">{data?.nik_ibu || ""}</span>
          </td>
        </tr>
        <tr>
          <td className="py-1">Nama Ayah</td>
          <td className="py-1" colSpan={5}>
            <span className="border-b border-dotted border-gray-400 block w-full">{data?.nama_ayah || ""}</span>
          </td>
        </tr>
        <tr>
          <td className="py-1">NIK</td>
          <td className="py-1" colSpan={5}>
            <span className="border-b border-dotted border-gray-400 block w-full"></span>
          </td>
        </tr>
        <tr>
          <td className="py-1">Pekerjaan</td>
          <td className="py-1" colSpan={5}>
            <span className="border-b border-dotted border-gray-400 block w-full">
              {data?.pekerjaan_orang_tua || ""}
            </span>
          </td>
        </tr>
        <tr>
          <td className="py-1">Alamat</td>
          <td className="py-1" colSpan={2}>
            <span className="border-b border-dotted border-gray-400 block w-full">
              {data?.alamat_orang_tua || ""}
            </span>
          </td>
          <td className="py-1 px-2 whitespace-nowrap">RW/RT</td>
          <td className="py-1" colSpan={2}>
            <span className="border-b border-dotted border-gray-400 block w-full"></span>
          </td>
        </tr>
        <tr>
          <td className="py-1">Kecamatan</td>
          <td className="py-1" colSpan={2}>
            <span className="border-b border-dotted border-gray-400 block w-full"></span>
          </td>
          <td className="py-1 px-2 whitespace-nowrap">Kab./Kota</td>
          <td className="py-1" colSpan={2}>
            <span className="border-b border-dotted border-gray-400 block w-full"></span>
          </td>
        </tr>
      </tbody>
    </table>

    <div className="flex justify-end mb-8 gap-2 items-end">
      <span>Tanggal</span>
      <span className="border-b border-dotted border-gray-400 w-24"></span>
      <span>20</span>
      <span className="border-b border-dotted border-gray-400 w-12"></span>
    </div>

    <div className="grid grid-cols-3 text-center gap-4 mt-4">
      {["Saksi I", "Saksi II", "Penolong Kelahiran"].map((label, i) => (
        <div key={i}>
          <p className="mb-16">{label}</p>
          <p className="border-t border-gray-400 pt-1">
            (<span className="border-b border-dotted border-gray-400 inline-block w-24">
              {i === 2 ? data?.nama_penolong_kelahiran || "" : ""}
            </span>)
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// HALAMAN UTAMA
// ============================================================
export default function PelayananPersalinan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [kehamilan, setKehamilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mode: "empty" -> belum ada data, "detail" -> tampilkan data, "form" -> tampilkan form input
  const [modeRingkasan, setModeRingkasan] = useState("empty");
  const [modeRiwayat, setModeRiwayat] = useState("empty");
  const [modeKeterangan, setModeKeterangan] = useState("empty");

  const [ringkasan, setRingkasan] = useState(null);
  const [formRingkasan, setFormRingkasan] = useState({
    tanggal_melahirkan: "", umur_kehamilan_minggu: "",
    penolong_proses_melahirkan: "", cara_melahirkan: "",
    keadaan_ibu: "", kb_pasca_melahirkan: "",
    bayi_anak_ke: "", bayi_berat_lahir_gram: "",
    bayi_panjang_badan_cm: "", bayi_lingkar_kepala_cm: "",
    bayi_jenis_kelamin: "",
    kondisi_bayi_segera_menangis: false,
    asuhan_imd_1_jam_pertama: false,
  });

  const [riwayat, setRiwayat] = useState(null);
  const [formRiwayat, setFormRiwayat] = useState({
    g_gravida: "", p_partus: "", a_abortus: "",
    tanggal_melahirkan: "", fasyankes_tempat_melahirkan: "",
    cara_melahirkan_spontan: false, tindakan_sc: false,
  });

  const [keterangan, setKeterangan] = useState(null);
  const [formKeterangan, setFormKeterangan] = useState({
    nomor_surat: "", hari_lahir: "", tanggal_lahir: "",
    pukul_lahir: "", jenis_kelamin: "", jenis_kelahiran: "",
    anak_ke: "", usia_gestasi_minggu: "",
    berat_lahir_gram: "", panjang_badan_cm: "", lingkar_kepala_cm: "",
    lokasi_persalinan: "", alamat_lokasi_persalinan: "",
    nama_bayi_diberi_nama: "", nama_ibu: "", nik_ibu: "",
    nama_ayah: "", pekerjaan_orang_tua: "", alamat_orang_tua: "",
    nama_penolong_kelahiran: "",
  });

  // Breadcrumb component
  const Breadcrumb = () => {
    if (!kehamilan) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
          <Home size={14} /> Beranda
        </Link>
        <span>/</span>
        <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
        <span>/</span>
        <Link to={`/data-ibu/${id}?kehamilan_id=${kehamilan.id}`} className="hover:text-indigo-600">
          Detail Ibu
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Proses & Riwayat Melahirkan</span>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);

          const dRingkasan = await getRingkasanPersalinanByKehamilanId(aktif.id);
          if (dRingkasan && dRingkasan.length > 0) {
            const d = dRingkasan[0];
            setRingkasan(d);
            setFormRingkasan({
              tanggal_melahirkan: d.tanggal_melahirkan ? d.tanggal_melahirkan.split("T")[0] : "",
              umur_kehamilan_minggu: d.umur_kehamilan_minggu ?? "",
              penolong_proses_melahirkan: d.penolong_proses_melahirkan || "",
              cara_melahirkan: d.cara_melahirkan || "",
              keadaan_ibu: d.keadaan_ibu || "",
              kb_pasca_melahirkan: d.kb_pasca_melahirkan || "",
              bayi_anak_ke: d.bayi_anak_ke ?? "",
              bayi_berat_lahir_gram: d.bayi_berat_lahir_gram ?? "",
              bayi_panjang_badan_cm: d.bayi_panjang_badan_cm ?? "",
              bayi_lingkar_kepala_cm: d.bayi_lingkar_kepala_cm ?? "",
              bayi_jenis_kelamin: d.bayi_jenis_kelamin || "",
              kondisi_bayi_segera_menangis: d.kondisi_bayi_segera_menangis || false,
              asuhan_imd_1_jam_pertama: d.asuhan_imd_1_jam_pertama || false,
            });
            setModeRingkasan("detail");
          } else {
            setModeRingkasan("empty");
          }

          const dRiwayat = await getRiwayatMelahirkanByKehamilanId(aktif.id);
          if (dRiwayat && dRiwayat.length > 0) {
            const d = dRiwayat[0];
            setRiwayat(d);
            setFormRiwayat({
              g_gravida: d.g_gravida ?? "",
              p_partus: d.p_partus ?? "",
              a_abortus: d.a_abortus ?? "",
              tanggal_melahirkan: d.tanggal_melahirkan ? d.tanggal_melahirkan.split("T")[0] : "",
              fasyankes_tempat_melahirkan: d.fasyankes_tempat_melahirkan || "",
              cara_melahirkan_spontan: d.cara_melahirkan_spontan || false,
              tindakan_sc: d.tindakan_sc || false,
            });
            setModeRiwayat("detail");
          } else {
            setModeRiwayat("empty");
          }
        }

        const dKeterangan = await getKeteranganLahirByIbuId(id);
        if (dKeterangan && dKeterangan.length > 0) {
          const d = dKeterangan[0];
          setKeterangan(d);
          setFormKeterangan({
            nomor_surat: d.nomor_surat || "",
            hari_lahir: d.hari_lahir || "",
            tanggal_lahir: d.tanggal_lahir ? d.tanggal_lahir.split("T")[0] : "",
            pukul_lahir: d.pukul_lahir || "",
            jenis_kelamin: d.jenis_kelamin || "",
            jenis_kelahiran: d.jenis_kelahiran || "",
            anak_ke: d.anak_ke ?? "",
            usia_gestasi_minggu: d.usia_gestasi_minggu ?? "",
            berat_lahir_gram: d.berat_lahir_gram ?? "",
            panjang_badan_cm: d.panjang_badan_cm ?? "",
            lingkar_kepala_cm: d.lingkar_kepala_cm ?? "",
            lokasi_persalinan: d.lokasi_persalinan || "",
            alamat_lokasi_persalinan: d.alamat_lokasi_persalinan || "",
            nama_bayi_diberi_nama: d.nama_bayi_diberi_nama || "",
            nama_ibu: d.nama_ibu || "",
            nik_ibu: d.nik_ibu || "",
            nama_ayah: d.nama_ayah || "",
            pekerjaan_orang_tua: d.pekerjaan_orang_tua || "",
            alamat_orang_tua: d.alamat_orang_tua || "",
            nama_penolong_kelahiran: d.nama_penolong_kelahiran || "",
          });
          setModeKeterangan("detail");
        } else {
          setModeKeterangan("empty");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e, setForm) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submitRingkasan = async (e) => {
    e.preventDefault();
    if (!kehamilan) { alert("Data kehamilan tidak ditemukan!"); return; }
    setSaving(true);
    try {
      const payload = { ...formRingkasan, kehamilan_id: kehamilan.id };
      payload.umur_kehamilan_minggu = parseInt(payload.umur_kehamilan_minggu) || 0;
      payload.bayi_anak_ke = parseInt(payload.bayi_anak_ke) || 0;
      payload.bayi_berat_lahir_gram = parseInt(payload.bayi_berat_lahir_gram) || 0;
      payload.bayi_panjang_badan_cm = parseInt(payload.bayi_panjang_badan_cm) || 0;
      payload.bayi_lingkar_kepala_cm = parseInt(payload.bayi_lingkar_kepala_cm) || 0;
      if (ringkasan) {
        const idRingkasan = ringkasan.id_ringkasan || ringkasan.id || ringkasan.ID;
        await updateRingkasanPersalinan(idRingkasan, payload);
      } else {
        const saved = await createRingkasanPersalinan(payload);
        setRingkasan(saved);
      }
      setModeRingkasan("detail");
      // Refresh data agar tampilan detail terbaru
      const dRingkasan = await getRingkasanPersalinanByKehamilanId(kehamilan.id);
      if (dRingkasan && dRingkasan.length > 0) {
        const d = dRingkasan[0];
        setFormRingkasan({
          tanggal_melahirkan: d.tanggal_melahirkan ? d.tanggal_melahirkan.split("T")[0] : "",
          umur_kehamilan_minggu: d.umur_kehamilan_minggu ?? "",
          penolong_proses_melahirkan: d.penolong_proses_melahirkan || "",
          cara_melahirkan: d.cara_melahirkan || "",
          keadaan_ibu: d.keadaan_ibu || "",
          kb_pasca_melahirkan: d.kb_pasca_melahirkan || "",
          bayi_anak_ke: d.bayi_anak_ke ?? "",
          bayi_berat_lahir_gram: d.bayi_berat_lahir_gram ?? "",
          bayi_panjang_badan_cm: d.bayi_panjang_badan_cm ?? "",
          bayi_lingkar_kepala_cm: d.bayi_lingkar_kepala_cm ?? "",
          bayi_jenis_kelamin: d.bayi_jenis_kelamin || "",
          kondisi_bayi_segera_menangis: d.kondisi_bayi_segera_menangis || false,
          asuhan_imd_1_jam_pertama: d.asuhan_imd_1_jam_pertama || false,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Gagal menyimpan.\nError: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

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
        const idRiwayat = riwayat.id_riwayat_melahirkan || riwayat.id || riwayat.ID;
        await updateRiwayatMelahirkan(idRiwayat, payload);
      } else {
        const saved = await createRiwayatMelahirkan(payload);
        setRiwayat(saved);
      }
      setModeRiwayat("detail");
      const dRiwayat = await getRiwayatMelahirkanByKehamilanId(kehamilan.id);
      if (dRiwayat && dRiwayat.length > 0) {
        const d = dRiwayat[0];
        setFormRiwayat({
          g_gravida: d.g_gravida ?? "",
          p_partus: d.p_partus ?? "",
          a_abortus: d.a_abortus ?? "",
          tanggal_melahirkan: d.tanggal_melahirkan ? d.tanggal_melahirkan.split("T")[0] : "",
          fasyankes_tempat_melahirkan: d.fasyankes_tempat_melahirkan || "",
          cara_melahirkan_spontan: d.cara_melahirkan_spontan || false,
          tindakan_sc: d.tindakan_sc || false,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Gagal menyimpan.\nError: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

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
        const idKeterangan = keterangan.id_keterangan_lahir || keterangan.id || keterangan.ID;
        await updateKeteranganLahir(idKeterangan, payload);
      } else {
        const saved = await createKeteranganLahir(payload);
        setKeterangan(saved);
      }
      setModeKeterangan("detail");
      const dKeterangan = await getKeteranganLahirByIbuId(id);
      if (dKeterangan && dKeterangan.length > 0) {
        const d = dKeterangan[0];
        setFormKeterangan({
          nomor_surat: d.nomor_surat || "",
          hari_lahir: d.hari_lahir || "",
          tanggal_lahir: d.tanggal_lahir ? d.tanggal_lahir.split("T")[0] : "",
          pukul_lahir: d.pukul_lahir || "",
          jenis_kelamin: d.jenis_kelamin || "",
          jenis_kelahiran: d.jenis_kelahiran || "",
          anak_ke: d.anak_ke ?? "",
          usia_gestasi_minggu: d.usia_gestasi_minggu ?? "",
          berat_lahir_gram: d.berat_lahir_gram ?? "",
          panjang_badan_cm: d.panjang_badan_cm ?? "",
          lingkar_kepala_cm: d.lingkar_kepala_cm ?? "",
          lokasi_persalinan: d.lokasi_persalinan || "",
          alamat_lokasi_persalinan: d.alamat_lokasi_persalinan || "",
          nama_bayi_diberi_nama: d.nama_bayi_diberi_nama || "",
          nama_ibu: d.nama_ibu || "",
          nik_ibu: d.nik_ibu || "",
          nama_ayah: d.nama_ayah || "",
          pekerjaan_orang_tua: d.pekerjaan_orang_tua || "",
          alamat_orang_tua: d.alamat_orang_tua || "",
          nama_penolong_kelahiran: d.nama_penolong_kelahiran || "",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Gagal menyimpan.\nError: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("surat-keterangan-lahir").innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Surat Keterangan Lahir</title>
      <style>
        body { font-family: serif; font-size: 13px; padding: 40px; color: #111; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 3px 2px; vertical-align: top; }
        .border-dotted { border-bottom: 1px dotted #555; display: inline-block; min-width: 60px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; gap: 16px; margin-top: 16px; }
        hr { border: 1px solid #555; margin: 16px 0; }
        h1 { text-align: center; letter-spacing: 6px; }
      </style>
      </head><body>${printContents}</body></html>
    `);
    w.document.close();
    w.print();
  };

  const TabButton = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)}
      className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === id
        ? "border-indigo-600 text-indigo-600 bg-indigo-50"
        : "border-transparent text-gray-500 hover:text-gray-700"}`}>
      {label}
    </button>
  );

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Proses & Riwayat Melahirkan</h1>
            <p className="text-gray-500">Pencatatan proses persalinan hingga bayi lahir.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full border-b border-gray-200 mb-6 flex overflow-x-auto">
          <TabButton id="ringkasan" label="Ringkasan Melahirkan" />
          <TabButton id="riwayat" label="Riwayat Melahirkan" />
          <TabButton id="keterangan" label="Surat Keterangan Lahir" />
        </div>

        {/* ===== RINGKASAN ===== */}
        {activeTab === "ringkasan" && (
          <>
            {modeRingkasan === "detail" && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <h2 className="text-lg font-semibold text-gray-800">Ringkasan Pelayanan Persalinan</h2>
                  </div>
                  <button onClick={() => setModeRingkasan("form")}
                    className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 bg-gray-50 rounded-lg p-4">
                  <DetailItem label="Tanggal Melahirkan" value={formRingkasan.tanggal_melahirkan} />
                  <DetailItem label="Umur Kehamilan (Mgg)" value={formRingkasan.umur_kehamilan_minggu} />
                  <DetailItem label="Penolong Persalinan" value={formRingkasan.penolong_proses_melahirkan} />
                  <DetailItem label="Cara Melahirkan" value={formRingkasan.cara_melahirkan} />
                  <DetailItem label="Keadaan Ibu" value={formRingkasan.keadaan_ibu} />
                  <DetailItem label="KB Pasca Salin" value={formRingkasan.kb_pasca_melahirkan} />
                </div>
                <hr />
                <p className="font-semibold text-gray-700">Keadaan Bayi Saat Lahir</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-gray-50 rounded-lg p-4">
                  <DetailItem label="Anak Ke" value={formRingkasan.bayi_anak_ke} />
                  <DetailItem label="Berat (gram)" value={formRingkasan.bayi_berat_lahir_gram} />
                  <DetailItem label="Panjang (cm)" value={formRingkasan.bayi_panjang_badan_cm} />
                  <DetailItem label="Lingkar Kepala (cm)" value={formRingkasan.bayi_lingkar_kepala_cm} />
                  <DetailItem label="Jenis Kelamin" value={formRingkasan.bayi_jenis_kelamin} />
                  <DetailItem label="Segera Menangis" value={formRingkasan.kondisi_bayi_segera_menangis ? "Ya" : "Tidak"} />
                  <DetailItem label="IMD 1 Jam Pertama" value={formRingkasan.asuhan_imd_1_jam_pertama ? "Ya" : "Tidak"} />
                </div>
              </div>
            )}
            {modeRingkasan === "empty" && (
              <EmptyState
                title="Belum Ada Ringkasan Persalinan"
                message="Silakan isi ringkasan pelayanan persalinan untuk ibu ini."
                onAdd={() => setModeRingkasan("form")}
              />
            )}
            {modeRingkasan === "form" && (
              <form onSubmit={submitRingkasan} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-indigo-700">Ringkasan Pelayanan Persalinan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Tanggal Melahirkan</label>
                    <input type="date" name="tanggal_melahirkan" value={formRingkasan.tanggal_melahirkan}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Umur Kehamilan (Mgg)</label>
                    <input type="number" name="umur_kehamilan_minggu" value={formRingkasan.umur_kehamilan_minggu}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Penolong Persalinan</label>
                    <input name="penolong_proses_melahirkan" value={formRingkasan.penolong_proses_melahirkan}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Cara Melahirkan</label>
                    <select name="cara_melahirkan" value={formRingkasan.cara_melahirkan}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2">
                      <option value="">-- Pilih --</option>
                      <option>Spontan/Normal</option><option>SC</option><option>Vakum</option>
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1">Keadaan Ibu</label>
                    <input name="keadaan_ibu" value={formRingkasan.keadaan_ibu}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">KB Pasca Salin</label>
                    <input name="kb_pasca_melahirkan" value={formRingkasan.kb_pasca_melahirkan}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                </div>
                <hr />
                <h3 className="font-semibold text-gray-800">Keadaan Bayi Saat Lahir</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Anak Ke</label>
                    <input type="number" name="bayi_anak_ke" value={formRingkasan.bayi_anak_ke}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Berat (gram)</label>
                    <input type="number" name="bayi_berat_lahir_gram" value={formRingkasan.bayi_berat_lahir_gram}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Panjang (cm)</label>
                    <input type="number" name="bayi_panjang_badan_cm" value={formRingkasan.bayi_panjang_badan_cm}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Lingkar Kepala (cm)</label>
                    <input type="number" name="bayi_lingkar_kepala_cm" value={formRingkasan.bayi_lingkar_kepala_cm}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                    <select name="bayi_jenis_kelamin" value={formRingkasan.bayi_jenis_kelamin}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2">
                      <option value="">-- Pilih --</option>
                      <option>Laki-laki</option><option>Perempuan</option>
                    </select></div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="kondisi_bayi_segera_menangis"
                      checked={formRingkasan.kondisi_bayi_segera_menangis}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-4 h-4" /> Segera Menangis
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="asuhan_imd_1_jam_pertama"
                      checked={formRingkasan.asuhan_imd_1_jam_pertama}
                      onChange={(e) => handleChange(e, setFormRingkasan)} className="w-4 h-4" /> IMD 1 Jam Pertama
                  </label>
                </div>
                <button type="submit" disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                  <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Ringkasan"}
                </button>
              </form>
            )}
          </>
        )}

        {/* ===== RIWAYAT ===== */}
        {activeTab === "riwayat" && (
          <>
            {modeRiwayat === "detail" && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <h2 className="text-lg font-semibold text-gray-800">Riwayat Proses Melahirkan</h2>
                  </div>
                  <button onClick={() => setModeRiwayat("form")}
                    className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 bg-gray-50 rounded-lg p-4">
                  <DetailItem label="Gravida (G)" value={formRiwayat.g_gravida} />
                  <DetailItem label="Partus (P)" value={formRiwayat.p_partus} />
                  <DetailItem label="Abortus (A)" value={formRiwayat.a_abortus} />
                  <DetailItem label="Tanggal Melahirkan" value={formRiwayat.tanggal_melahirkan} />
                  <DetailItem label="Faskes / Tempat Melahirkan" value={formRiwayat.fasyankes_tempat_melahirkan} />
                  <DetailItem label="Cara Melahirkan" value={
                    formRiwayat.cara_melahirkan_spontan ? "Spontan/Normal" :
                    formRiwayat.tindakan_sc ? "Operasi Caesar" : "-"
                  } />
                </div>
              </div>
            )}
            {modeRiwayat === "empty" && (
              <EmptyState
                title="Belum Ada Riwayat Melahirkan"
                message="Silakan isi riwayat proses melahirkan untuk ibu ini."
                onAdd={() => setModeRiwayat("form")}
              />
            )}
            {modeRiwayat === "form" && (
              <form onSubmit={submitRiwayat} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-indigo-700">Riwayat Proses Melahirkan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Gravida (G)</label>
                    <input type="number" name="g_gravida" value={formRiwayat.g_gravida}
                      onChange={(e) => handleChange(e, setFormRiwayat)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Partus (P)</label>
                    <input type="number" name="p_partus" value={formRiwayat.p_partus}
                      onChange={(e) => handleChange(e, setFormRiwayat)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Abortus (A)</label>
                    <input type="number" name="a_abortus" value={formRiwayat.a_abortus}
                      onChange={(e) => handleChange(e, setFormRiwayat)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Tanggal Melahirkan</label>
                    <input type="date" name="tanggal_melahirkan" value={formRiwayat.tanggal_melahirkan}
                      onChange={(e) => handleChange(e, setFormRiwayat)} className="w-full border rounded px-3 py-2" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Faskes / Tempat Melahirkan</label>
                    <input name="fasyankes_tempat_melahirkan" value={formRiwayat.fasyankes_tempat_melahirkan}
                      onChange={(e) => handleChange(e, setFormRiwayat)} className="w-full border rounded px-3 py-2" /></div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="cara_melahirkan_spontan" checked={formRiwayat.cara_melahirkan_spontan}
                      onChange={(e) => handleChange(e, setFormRiwayat)} className="w-4 h-4" /> Spontan/Normal
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="tindakan_sc" checked={formRiwayat.tindakan_sc}
                      onChange={(e) => handleChange(e, setFormRiwayat)} className="w-4 h-4" /> Operasi Caesar
                  </label>
                </div>
                <button type="submit" disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                  <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Riwayat"}
                </button>
              </form>
            )}
          </>
        )}

        {/* ===== KETERANGAN LAHIR ===== */}
        {activeTab === "keterangan" && (
          <>
            {modeKeterangan === "detail" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <button onClick={() => setModeKeterangan("form")}
                    className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                    <Edit2 size={14} /> Edit Data
                  </button>
                  <button onClick={handlePrint}
                    className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <Printer size={16} /> Cetak Surat
                  </button>
                </div>
                <SuratKeteranganLahir data={formKeterangan} />
              </div>
            )}
            {modeKeterangan === "empty" && (
              <EmptyState
                title="Belum Ada Surat Keterangan Lahir"
                message="Silakan isi data untuk membuat Surat Keterangan Lahir."
                onAdd={() => setModeKeterangan("form")}
              />
            )}
            {modeKeterangan === "form" && (
              <form onSubmit={submitKeterangan} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-indigo-700">Surat Keterangan Lahir (Model A.B)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Nomor Surat</label>
                    <input name="nomor_surat" value={formKeterangan.nomor_surat}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Nama Bayi Diberikan</label>
                    <input name="nama_bayi_diberi_nama" value={formKeterangan.nama_bayi_diberi_nama}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
                    <input type="date" name="tanggal_lahir" value={formKeterangan.tanggal_lahir}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Hari Lahir</label>
                    <input name="hari_lahir" value={formKeterangan.hari_lahir}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" placeholder="Contoh: Senin" /></div>
                  <div><label className="block text-sm font-medium mb-1">Pukul Lahir</label>
                    <input name="pukul_lahir" value={formKeterangan.pukul_lahir}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" placeholder="Contoh: 08:30" /></div>
                  <div><label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                    <select name="jenis_kelamin" value={formKeterangan.jenis_kelamin}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2">
                      <option value="">-- Pilih --</option>
                      <option>Laki-laki</option><option>Perempuan</option>
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1">Jenis Kelahiran</label>
                    <select name="jenis_kelahiran" value={formKeterangan.jenis_kelahiran}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2">
                      <option value="">-- Pilih --</option>
                      <option>Tunggal</option><option>Kembar 2</option>
                      <option>Kembar 3</option><option>Lainnya</option>
                    </select></div>
                  <div><label className="block text-sm font-medium mb-1">Anak Ke</label>
                    <input type="number" name="anak_ke" value={formKeterangan.anak_ke}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Usia Gestasi (Minggu)</label>
                    <input type="number" name="usia_gestasi_minggu" value={formKeterangan.usia_gestasi_minggu}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Berat Lahir (gram)</label>
                    <input type="number" name="berat_lahir_gram" value={formKeterangan.berat_lahir_gram}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Panjang Bayi (cm)</label>
                    <input type="number" name="panjang_badan_cm" value={formKeterangan.panjang_badan_cm}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Lingkar Kepala (cm)</label>
                    <input type="number" name="lingkar_kepala_cm" value={formKeterangan.lingkar_kepala_cm}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Lokasi Persalinan</label>
                    <input name="lokasi_persalinan" value={formKeterangan.lokasi_persalinan}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2"
                      placeholder="Nama RS/Puskesmas/Klinik" /></div>
                  <div className="md:col-span-2 border-t pt-4">
                    <h3 className="font-semibold mb-3">Orang Tua</h3>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Nama Ibu</label>
                    <input name="nama_ibu" value={formKeterangan.nama_ibu}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">NIK Ibu</label>
                    <input name="nik_ibu" value={formKeterangan.nik_ibu}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Nama Ayah</label>
                    <input name="nama_ayah" value={formKeterangan.nama_ayah}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Pekerjaan Orang Tua</label>
                    <input name="pekerjaan_orang_tua" value={formKeterangan.pekerjaan_orang_tua}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Alamat Orang Tua</label>
                    <input name="alamat_orang_tua" value={formKeterangan.alamat_orang_tua}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Saksi / Penolong Kelahiran</label>
                    <input name="nama_penolong_kelahiran" value={formKeterangan.nama_penolong_kelahiran}
                      onChange={(e) => handleChange(e, setFormKeterangan)} className="w-full border rounded px-3 py-2" /></div>
                </div>
                <button type="submit" disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                  <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Keterangan Lahir"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}