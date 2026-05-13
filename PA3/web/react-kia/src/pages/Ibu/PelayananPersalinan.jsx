// src/pages/Ibu/PelayananPersalinan.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId, updateKehamilan } from "../../services/kehamilan";
import { getIbuById } from "../../services/ibu";
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
import { Save, ArrowLeft, Edit2, CheckCircle, Printer, Home, Plus } from "lucide-react";
import { createAnakDenganPenduduk } from "../../services/Anak";

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
  const [ibu, setIbu] = useState(null);
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
    // Data Anak Lahir
    nama_anak: "", anak_tanggal_lahir: "", anak_jenis_kelamin: "",
    bayi_anak_ke: "", bayi_berat_lahir_gram: "", bayi_panjang_badan_cm: "", bayi_lingkar_kepala_cm: "",
    anak_nama_ibu: "", anak_nama_ayah: "",
  });

  const [riwayat, setRiwayat] = useState(null);
  const [formRiwayat, setFormRiwayat] = useState({
    g_gravida: "", p_partus: "", a_abortus: "",
    tanggal_melahirkan: "", fasyankes_tempat_melahirkan: "",
    cara_melahirkan_spontan: false, tindakan_sc: false,
  });
  const [editRiwayatGpa, setEditRiwayatGpa] = useState(false);

  
  const [daftarAnak, setDaftarAnak] = useState([]);

  
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
          
          // Fetch ibu data untuk mendapatkan penduduk_id
          if (aktif.ibu_id) {
            try {
              const ibuData = await getIbuById(aktif.ibu_id);
              setIbu(ibuData);
            } catch (err) {
              console.error("Failed to fetch ibu data:", err);
            }
          }
          
          const gpaAktif = {
            gravida: aktif.gravida ?? "",
            paritas: aktif.paritas ?? "",
            abortus: aktif.abortus ?? "",
          };

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
              keadaan_ibu_detail_sakit: d.keadaan_ibu_detail_sakit || "",
              keterangan_tambahan_ibu: d.keterangan_tambahan_ibu || "",
              kb_pasca_melahirkan: d.kb_pasca_melahirkan || "",
              gravida: gpaAktif.gravida,
              paritas: gpaAktif.paritas,
              abortus: gpaAktif.abortus,
              // Keadaan Bayi (sesuai DB)
              kondisi_bayi_segera_menangis: d.kondisi_bayi_segera_menangis || false,
              kondisi_bayi_menangis_beberapa_saat: d.kondisi_bayi_menangis_beberapa_saat || false,
              kondisi_bayi_tidak_menangis: d.kondisi_bayi_tidak_menangis || false,
              kondisi_bayi_seluruh_tubuh_kemerahan: d.kondisi_bayi_seluruh_tubuh_kemerahan || false,
              kondisi_bayi_anggota_gerak_kebiruan: d.kondisi_bayi_anggota_gerak_kebiruan || false,
              kondisi_bayi_seluruh_tubuh_biru: d.kondisi_bayi_seluruh_tubuh_biru || false,
              kondisi_bayi_kelainan_bawaan: d.kondisi_bayi_kelainan_bawaan || false,
              kondisi_bayi_kelainan_bawaan_detail: d.kondisi_bayi_kelainan_bawaan_detail || "",
              kondisi_bayi_meninggal: d.kondisi_bayi_meninggal || false,
              // Asuhan Bayi Baru Lahir (sesuai DB)
              asuhan_imd_1_jam_pertama: d.asuhan_imd_1_jam_pertama || false,
              asuhan_suntikan_vitamin_k1: d.asuhan_suntikan_vitamin_k1 || false,
              asuhan_salep_mata_antibiotika: d.asuhan_salep_mata_antibiotika || false,
              asuhan_imunisasi_hb0: d.asuhan_imunisasi_hb0 || false,
              keterangan_tambahan_bayi: d.keterangan_tambahan_bayi || "",
              nama_anak: "",
              anak_tanggal_lahir: "",
              anak_jenis_kelamin: "",
              bayi_anak_ke: d.bayi_anak_ke ?? "",
              bayi_berat_lahir_gram: d.bayi_berat_lahir_gram ?? "",
              bayi_panjang_badan_cm: d.bayi_panjang_badan_cm ?? "",
              bayi_lingkar_kepala_cm: d.bayi_lingkar_kepala_cm ?? "",
              anak_nama_ibu: "",
              anak_nama_ayah: "",
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
              g_gravida: d.g_gravida ?? gpaAktif.gravida ?? "",
              p_partus: d.p_partus ?? gpaAktif.paritas ?? "",
              a_abortus: d.a_abortus ?? gpaAktif.abortus ?? "",
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

  

  const resetFormAnakRingkasan = () => {
    setFormRingkasan((prev) => ({
      ...prev,
      nama_anak: "", anak_tanggal_lahir: "", anak_jenis_kelamin: "",
      anak_berat_lahir_kg: "", anak_tinggi_lahir_cm: "", anak_lingkar_kepala_cm: "",
      anak_nama_ibu: "", anak_nama_ayah: "",
    }));
  };

  

  const submitRingkasan = async (e) => {
    e.preventDefault();
    if (!kehamilan) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Data kehamilan tidak ditemukan!'
      });
      return;
    }
    setSaving(true);
    try {
      // Persiapan payload ringkasan + data anak dalam satu submit
      const payloadRingkasan = { 
        kehamilan_id: kehamilan.id,
        tanggal_melahirkan: formRingkasan.tanggal_melahirkan,
        umur_kehamilan_minggu: formRingkasan.umur_kehamilan_minggu,
        penolong_proses_melahirkan: formRingkasan.penolong_proses_melahirkan,
        cara_melahirkan: formRingkasan.cara_melahirkan,
        keadaan_ibu: formRingkasan.keadaan_ibu,
        keadaan_ibu_detail_sakit: formRingkasan.keadaan_ibu_detail_sakit,
        keterangan_tambahan_ibu: formRingkasan.keterangan_tambahan_ibu,
        kb_pasca_melahirkan: formRingkasan.kb_pasca_melahirkan,
        gravida: formRingkasan.gravida,
        paritas: formRingkasan.paritas,
        abortus: formRingkasan.abortus,
        kondisi_bayi_segera_menangis: formRingkasan.kondisi_bayi_segera_menangis,
        kondisi_bayi_menangis_beberapa_saat: formRingkasan.kondisi_bayi_menangis_beberapa_saat,
        kondisi_bayi_tidak_menangis: formRingkasan.kondisi_bayi_tidak_menangis,
        kondisi_bayi_seluruh_tubuh_kemerahan: formRingkasan.kondisi_bayi_seluruh_tubuh_kemerahan,
        kondisi_bayi_anggota_gerak_kebiruan: formRingkasan.kondisi_bayi_anggota_gerak_kebiruan,
        kondisi_bayi_seluruh_tubuh_biru: formRingkasan.kondisi_bayi_seluruh_tubuh_biru,
        kondisi_bayi_kelainan_bawaan: formRingkasan.kondisi_bayi_kelainan_bawaan,
        kondisi_bayi_kelainan_bawaan_detail: formRingkasan.kondisi_bayi_kelainan_bawaan_detail,
        kondisi_bayi_meninggal: formRingkasan.kondisi_bayi_meninggal,
        asuhan_imd_1_jam_pertama: formRingkasan.asuhan_imd_1_jam_pertama,
        asuhan_suntikan_vitamin_k1: formRingkasan.asuhan_suntikan_vitamin_k1,
        asuhan_salep_mata_antibiotika: formRingkasan.asuhan_salep_mata_antibiotika,
        asuhan_imunisasi_hb0: formRingkasan.asuhan_imunisasi_hb0,
        keterangan_tambahan_bayi: formRingkasan.keterangan_tambahan_bayi,
        bayi_anak_ke: formRingkasan.bayi_anak_ke,
        bayi_berat_lahir_gram: formRingkasan.bayi_berat_lahir_gram,
        bayi_panjang_badan_cm: formRingkasan.bayi_panjang_badan_cm,
        bayi_lingkar_kepala_cm: formRingkasan.bayi_lingkar_kepala_cm,
        bayi_jenis_kelamin: formRingkasan.anak_jenis_kelamin,
      };
      payloadRingkasan.umur_kehamilan_minggu = parseInt(payloadRingkasan.umur_kehamilan_minggu) || 0;
      payloadRingkasan.gravida = parseInt(payloadRingkasan.gravida) || 0;
      payloadRingkasan.paritas = parseInt(payloadRingkasan.paritas) || 0;
      payloadRingkasan.abortus = parseInt(payloadRingkasan.abortus) || 0;
      payloadRingkasan.bayi_anak_ke = parseInt(payloadRingkasan.bayi_anak_ke) || 0;
      payloadRingkasan.bayi_berat_lahir_gram = parseFloat(payloadRingkasan.bayi_berat_lahir_gram) || 0;
      payloadRingkasan.bayi_panjang_badan_cm = parseFloat(payloadRingkasan.bayi_panjang_badan_cm) || 0;
      payloadRingkasan.bayi_lingkar_kepala_cm = parseFloat(payloadRingkasan.bayi_lingkar_kepala_cm) || 0;
      
      // Simpan ringkasan
      if (ringkasan) {
        const idRingkasan = ringkasan.id_ringkasan || ringkasan.id || ringkasan.ID;
        await updateRingkasanPersalinan(idRingkasan, payloadRingkasan);
      } else {
        const saved = await createRingkasanPersalinan(payloadRingkasan);
        setRingkasan(saved);
      }
      
      // Update kehamilan dengan G/P/A
      await updateKehamilan(kehamilan.id, {
        gravida: payloadRingkasan.gravida,
        paritas: payloadRingkasan.paritas,
        abortus: payloadRingkasan.abortus,
      });
      setFormRiwayat((prev) => ({
        ...prev,
        g_gravida: payloadRingkasan.gravida,
        p_partus: payloadRingkasan.paritas,
        a_abortus: payloadRingkasan.abortus,
      }));
      
      // Jika ada nama anak, buat record Anak baru
      if (formRingkasan.nama_anak && formRingkasan.nama_anak.trim()) {
        const payloadAnak = {
          kehamilan_id: kehamilan.id,
          ibu_id: kehamilan.ibu_id,
          nama: formRingkasan.nama_anak,
          jenis_kelamin: formRingkasan.anak_jenis_kelamin || "",
          tanggal_lahir: formRingkasan.anak_tanggal_lahir || "",
          anak_ke: parseInt(formRingkasan.bayi_anak_ke) || 0,
          berat_lahir_kg: formRingkasan.bayi_berat_lahir_gram ? parseFloat(formRingkasan.bayi_berat_lahir_gram) / 1000 : null,
          tinggi_lahir_cm: formRingkasan.bayi_panjang_badan_cm ? parseFloat(formRingkasan.bayi_panjang_badan_cm) : null,
          lingkar_kepala_cm: formRingkasan.bayi_lingkar_kepala_cm ? parseFloat(formRingkasan.bayi_lingkar_kepala_cm) : null,
          nama_ibu: formRingkasan.anak_nama_ibu || "",
          nama_ayah: formRingkasan.anak_nama_ayah || "",
        };
        const savedAnak = await createAnakDenganPenduduk(payloadAnak);
        setDaftarAnak((prev) => [savedAnak.data || savedAnak, ...prev]);
        resetFormAnakRingkasan();
      }
      
      setModeRingkasan("detail");
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Ringkasan persalinan berhasil disimpan',
        timer: 2000,
        showConfirmButton: false
      });
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
          nama_anak: d.nama_bayi || "",
          anak_tanggal_lahir: d.anak_tanggal_lahir ? d.anak_tanggal_lahir.split("T")[0] : "",
          anak_jenis_kelamin: d.bayi_jenis_kelamin || "",
          anak_nama_ibu: d.nama_ibu_anak || "",
          anak_nama_ayah: d.nama_ayah_anak || "",
          kondisi_bayi_segera_menangis: d.kondisi_bayi_segera_menangis || false,
          kondisi_bayi_menangis_beberapa_saat: d.kondisi_bayi_menangis_beberapa_saat || false,
          kondisi_bayi_tidak_menangis: d.kondisi_bayi_tidak_menangis || false,
          kondisi_bayi_seluruh_tubuh_kemerahan: d.kondisi_bayi_seluruh_tubuh_kemerahan || false,
          kondisi_bayi_anggota_gerak_kebiruan: d.kondisi_bayi_anggota_gerak_kebiruan || false,
          kondisi_bayi_seluruh_tubuh_biru: d.kondisi_bayi_seluruh_tubuh_biru || false,
          kondisi_bayi_kelainan_bawaan: d.kondisi_bayi_kelainan_bawaan || false,
          kondisi_bayi_kelainan_bawaan_detail: d.kondisi_bayi_kelainan_bawaan_detail || "",
          kondisi_bayi_meninggal: d.kondisi_bayi_meninggal || false,
          asuhan_imd_1_jam_pertama: d.asuhan_imd_1_jam_pertama || false,
          asuhan_suntikan_vitamin_k1: d.asuhan_suntikan_vitamin_k1 || false,
          asuhan_salep_mata_antibiotika: d.asuhan_salep_mata_antibiotika || false,
          asuhan_imunisasi_hb0: d.asuhan_imunisasi_hb0 || false,
          keterangan_tambahan_bayi: d.keterangan_tambahan_bayi || "",
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
      const sourceGpa = editRiwayatGpa ? formRiwayat : formRingkasan;
      payload.g_gravida = parseInt(sourceGpa.g_gravida ?? sourceGpa.gravida) || 0;
      payload.p_partus = parseInt(sourceGpa.p_partus ?? sourceGpa.paritas) || 0;
      payload.a_abortus = parseInt(sourceGpa.a_abortus ?? sourceGpa.abortus) || 0;
      await updateKehamilan(kehamilan.id, {
        gravida: payload.g_gravida,
        paritas: payload.p_partus,
        abortus: payload.a_abortus,
      });
      if (riwayat) {
        const idRiwayat = riwayat.id_riwayat_melahirkan || riwayat.id || riwayat.ID;
        await updateRiwayatMelahirkan(idRiwayat, payload);
        setEditRiwayatGpa(false);
      } else {
        const saved = await createRiwayatMelahirkan(payload);
        setRiwayat(saved);
        setEditRiwayatGpa(false);
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

        {/* (Child fields moved into ringkasan form) */}

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
                {/* Data Anak Lahir */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Data Anak Lahir (opsional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nama Anak</label>
                      <input name="nama_anak" value={formRingkasan.nama_anak}
                        onChange={(e)=>handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
                      <input type="date" name="anak_tanggal_lahir" value={formRingkasan.anak_tanggal_lahir}
                        onChange={(e)=>handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                      <select name="anak_jenis_kelamin" value={formRingkasan.anak_jenis_kelamin}
                        onChange={(e)=>handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2">
                        <option value="">-- Pilih --</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Anak Ke</label>
                      <input type="number" name="bayi_anak_ke" value={formRingkasan.bayi_anak_ke}
                        onChange={(e)=>handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Berat (gram)</label>
                      <input type="number" name="bayi_berat_lahir_gram" value={formRingkasan.bayi_berat_lahir_gram}
                        onChange={(e)=>handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Panjang (cm)</label>
                      <input type="number" name="bayi_panjang_badan_cm" value={formRingkasan.bayi_panjang_badan_cm}
                        onChange={(e)=>handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Lingkar Kepala (cm)</label>
                      <input type="number" name="bayi_lingkar_kepala_cm" value={formRingkasan.bayi_lingkar_kepala_cm}
                        onChange={(e)=>handleChange(e, setFormRingkasan)} className="w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Kondisi Bayi Saat Lahir**</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_segera_menangis" checked={formRingkasan.kondisi_bayi_segera_menangis} onChange={(e) => handleChange(e, setFormRingkasan)} /> Segera menangis</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_anggota_gerak_kebiruan" checked={formRingkasan.kondisi_bayi_anggota_gerak_kebiruan} onChange={(e) => handleChange(e, setFormRingkasan)} /> Anggota gerak kebiruan</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_menangis_beberapa_saat" checked={formRingkasan.kondisi_bayi_menangis_beberapa_saat} onChange={(e) => handleChange(e, setFormRingkasan)} /> Menangis beberapa saat</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_seluruh_tubuh_biru" checked={formRingkasan.kondisi_bayi_seluruh_tubuh_biru} onChange={(e) => handleChange(e, setFormRingkasan)} /> Seluruh tubuh biru</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_tidak_menangis" checked={formRingkasan.kondisi_bayi_tidak_menangis} onChange={(e) => handleChange(e, setFormRingkasan)} /> Tidak menangis</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_kelainan_bawaan" checked={formRingkasan.kondisi_bayi_kelainan_bawaan} onChange={(e) => handleChange(e, setFormRingkasan)} /> Kelainan bawaan</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_seluruh_tubuh_kemerahan" checked={formRingkasan.kondisi_bayi_seluruh_tubuh_kemerahan} onChange={(e) => handleChange(e, setFormRingkasan)} /> Seluruh tubuh kemerahan</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_meninggal" checked={formRingkasan.kondisi_bayi_meninggal} onChange={(e) => handleChange(e, setFormRingkasan)} /> Meninggal</label>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-1">Detail Kelainan Bawaan</label>
                      <input
                        name="kondisi_bayi_kelainan_bawaan_detail"
                        value={formRingkasan.kondisi_bayi_kelainan_bawaan_detail}
                        onChange={(e) => handleChange(e, setFormRingkasan)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Asuhan Bayi Baru Lahir**</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_imd_1_jam_pertama" checked={formRingkasan.asuhan_imd_1_jam_pertama} onChange={(e) => handleChange(e, setFormRingkasan)} /> Inisiasi menyusu dini (IMD) dalam 1 jam pertama kelahiran bayi</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_suntikan_vitamin_k1" checked={formRingkasan.asuhan_suntikan_vitamin_k1} onChange={(e) => handleChange(e, setFormRingkasan)} /> Suntikan Vitamin K1</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_salep_mata_antibiotika" checked={formRingkasan.asuhan_salep_mata_antibiotika} onChange={(e) => handleChange(e, setFormRingkasan)} /> Salep mata Antibiotika Profilaksis</label>
                      <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_imunisasi_hb0" checked={formRingkasan.asuhan_imunisasi_hb0} onChange={(e) => handleChange(e, setFormRingkasan)} /> Imunisasi HB0</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Keterangan Tambahan</label>
                    <textarea
                      name="keterangan_tambahan_bayi"
                      value={formRingkasan.keterangan_tambahan_bayi}
                      onChange={(e) => handleChange(e, setFormRingkasan)}
                      rows={3}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <button type="submit" disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                  <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Ringkasan"}
                </button>
              </form>
            )}
          </>
        )}

        {/* ===== PREVIEW DAFTAR ANAK RINGKASAN ===== */}
        {activeTab === "ringkasan" && daftarAnak.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
              Anak yang Ditambahkan ({daftarAnak.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {daftarAnak.map((anak) => (
                <div key={anak.id || `${anak.nama}-${anak.tanggal_lahir}`} className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-800">{anak.nama || "Tanpa Nama"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Anak ke-{anak.anak_ke ?? "-"} • {anak.jenis_kelamin || "-"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>Lahir: {anak.tanggal_lahir || "-"}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div className="rounded bg-white px-2 py-1 border">BB: {anak.berat_lahir_kg ?? "-"} kg</div>
                    <div className="rounded bg-white px-2 py-1 border">PB: {anak.tinggi_lahir_cm ?? "-"} cm</div>
                    <div className="rounded bg-white px-2 py-1 border">LK: {anak.lingkar_kepala_cm ?? "-"} cm</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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