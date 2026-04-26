// src/pages/Ibu/RencanaPersalinan.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getRencanaByKehamilanId, createRencana, updateRencana, getRiwayatByKehamilanId, createRiwayat, getRingkasanByKehamilanId, createRingkasan, getKeteranganByIbuId, createKeterangan } from "../../services/persalinan";
import { Save, FileText } from "lucide-react";

export default function RencanaPersalinan() {
  const { id } = useParams();
  const [kehamilan, setKehamilan] = useState(null);
  const [rencana, setRencana] = useState(null);
  const [riwayat, setRiwayat] = useState(null);
  const [ringkasan, setRingkasan] = useState(null);
  const [keterangan, setKeterangan] = useState(null);
  const [formRencana, setFormRencana] = useState({
    nama_ibu_pernyataan: "",
    alamat_ibu_pernyataan: "",
    perkiraan_bulan_persalinan: "",
    perkiraan_tahun_persalinan: "",
    fasyankes_1_nama_tenaga: "",
    fasyankes_1_nama_fasilitas: "",
    fasyankes_2_nama_tenaga: "",
    fasyankes_2_nama_fasilitas: "",
    sumber_dana_persalinan: "JKN/BPJS",
    kendaraan_1_nama: "",
    kendaraan_1_hp: "",
    metode_kontrasepsi_pilihan: "",
    donor_golongan_darah: "",
    donor_rhesus: "",
  });
  const [formRiwayat, setFormRiwayat] = useState({
    g_gravida: "",
    p_partus: "",
    a_abortus: "",
    hari_melahirkan: "",
    tanggal_melahirkan: "",
    pukul_melahirkan: "",
    cara_melahirkan_spontan: false,
    cara_melahirkan_sungsang: false,
    tindakan_ekstraksi_vakum: false,
    tindakan_ekstraksi_forsep: false,
    tindakan_sc: false,
    penolong_dokter_spesialis: false,
    penolong_dokter: false,
    penolong_bidan: false,
    taksiran_melahirkan: "",
    fasyankes_tempat_melahirkan: "",
  });
  const [formRingkasan, setFormRingkasan] = useState({
    tanggal_melahirkan: "",
    pukul_melahirkan: "",
    umur_kehamilan_minggu: "",
    penolong_proses_melahirkan: "",
    cara_melahirkan: "",
    keadaan_ibu: "Sehat",
    kb_pasca_melahirkan: "",
    bayi_anak_ke: "",
    bayi_berat_lahir_gram: "",
    bayi_panjang_badan_cm: "",
    bayi_lingkar_kepala_cm: "",
    bayi_jenis_kelamin: "",
    kondisi_bayi_segera_menangis: false,
    asuhan_imd_1_jam_pertama: false,
    asuhan_suntikan_vitamin_k1: false,
    asuhan_salep_mata_antibiotika: false,
    asuhan_imunisasi_hb0: false,
  });
  const [formKeterangan, setFormKeterangan] = useState({
    nomor_surat: "",
    hari_lahir: "",
    tanggal_lahir: "",
    pukul_lahir: "",
    jenis_kelamin: "",
    jenis_kelahiran: "Tunggal",
    anak_ke: "",
    berat_lahir_gram: "",
    panjang_badan_cm: "",
    lingkar_kepala_cm: "",
    lokasi_persalinan: "",
    nama_bayi_diberi_nama: "",
    nama_ibu: "",
    nama_ayah: "",
  });
  const [activeTab, setActiveTab] = useState("rencana");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const kehamilanList = await getKehamilanByIbuId(id);
        if (kehamilanList.length > 0) {
          const aktif = kehamilanList[0];
          setKehamilan(aktif);
          const rencanaData = await getRencanaByKehamilanId(aktif.id);
          if (rencanaData && rencanaData.length > 0) setRencana(rencanaData[0]);
          const riwayatData = await getRiwayatByKehamilanId(aktif.id);
          if (riwayatData && riwayatData.length > 0) setRiwayat(riwayatData[0]);
          const ringkasanData = await getRingkasanByKehamilanId(aktif.id);
          if (ringkasanData && ringkasanData.length > 0) setRingkasan(ringkasanData[0]);
          const keteranganData = await getKeteranganByIbuId(id);
          if (keteranganData && keteranganData.length > 0) setKeterangan(keteranganData[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    setter(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (section) => {
    if (!kehamilan) return;
    setSaving(true);
    try {
      if (section === "rencana") {
        const payload = { ...formRencana, kehamilan_id: kehamilan.id };
        if (rencana) await updateRencana(rencana.id, payload);
        else await createRencana(payload);
        alert("Rencana persalinan disimpan");
      } else if (section === "riwayat") {
        const payload = { ...formRiwayat, kehamilan_id: kehamilan.id };
        if (riwayat) await updateRiwayat(riwayat.id, payload);
        else await createRiwayat(payload);
        alert("Riwayat proses melahirkan disimpan");
      } else if (section === "ringkasan") {
        const payload = { ...formRingkasan, kehamilan_id: kehamilan.id };
        if (ringkasan) await updateRingkasan(ringkasan.id, payload);
        else await createRingkasan(payload);
        alert("Ringkasan pelayanan persalinan disimpan");
      } else if (section === "keterangan") {
        const payload = { ...formKeterangan, id_ibu_relasi: parseInt(id) };
        if (keterangan) await updateKeterangan(keterangan.id, payload);
        else await createKeterangan(payload);
        alert("Keterangan lahir disimpan");
      }
    } catch (err) {
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Persalinan & Pelayanan Kelahiran</h1>
        <div className="flex gap-2 mb-6 border-b">
          {["rencana", "riwayat", "ringkasan", "keterangan"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold" : "text-gray-500"}`}>
              {tab === "rencana" ? "Rencana Persalinan" : tab === "riwayat" ? "Riwayat Proses" : tab === "ringkasan" ? "Ringkasan Persalinan" : "Keterangan Lahir"}
            </button>
          ))}
        </div>

        {/* Rencana Persalinan Tab */}
        {activeTab === "rencana" && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit("rencana"); }} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nama_ibu_pernyataan" placeholder="Nama Ibu" value={formRencana.nama_ibu_pernyataan} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="alamat_ibu_pernyataan" placeholder="Alamat" value={formRencana.alamat_ibu_pernyataan} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="perkiraan_bulan_persalinan" placeholder="Bulan" value={formRencana.perkiraan_bulan_persalinan} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="perkiraan_tahun_persalinan" placeholder="Tahun" value={formRencana.perkiraan_tahun_persalinan} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="fasyankes_1_nama_tenaga" placeholder="Penolong 1" value={formRencana.fasyankes_1_nama_tenaga} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="fasyankes_1_nama_fasilitas" placeholder="Fasyankes 1" value={formRencana.fasyankes_1_nama_fasilitas} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="fasyankes_2_nama_tenaga" placeholder="Penolong 2" value={formRencana.fasyankes_2_nama_tenaga} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="fasyankes_2_nama_fasilitas" placeholder="Fasyankes 2" value={formRencana.fasyankes_2_nama_fasilitas} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <select name="sumber_dana_persalinan" value={formRencana.sumber_dana_persalinan} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2">
                <option>JKN/BPJS</option><option>Jamkesda</option><option>Asuransi Swasta</option><option>Biaya sendiri</option>
              </select>
              <input name="kendaraan_1_nama" placeholder="Kendaraan" value={formRencana.kendaraan_1_nama} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="kendaraan_1_hp" placeholder="HP Kendaraan" value={formRencana.kendaraan_1_hp} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="metode_kontrasepsi_pilihan" placeholder="Kontrasepsi" value={formRencana.metode_kontrasepsi_pilihan} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
              <input name="donor_golongan_darah" placeholder="Gol. Darah Donor" value={formRencana.donor_golongan_darah} onChange={(e) => handleChange(e, setFormRencana)} className="border rounded px-3 py-2" />
            </div>
            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={18} /> Simpan Rencana Persalinan</button>
          </form>
        )}

        {/* Riwayat Proses Melahirkan Tab */}
        {activeTab === "riwayat" && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit("riwayat"); }} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="g_gravida" placeholder="G" value={formRiwayat.g_gravida} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
              <input name="p_partus" placeholder="P" value={formRiwayat.p_partus} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
              <input name="a_abortus" placeholder="A" value={formRiwayat.a_abortus} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
              <input name="hari_melahirkan" placeholder="Hari" value={formRiwayat.hari_melahirkan} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
              <input type="date" name="tanggal_melahirkan" value={formRiwayat.tanggal_melahirkan} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
              <input type="time" name="pukul_melahirkan" value={formRiwayat.pukul_melahirkan} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
              <label className="flex items-center gap-2"><input type="checkbox" name="cara_melahirkan_spontan" checked={formRiwayat.cara_melahirkan_spontan} onChange={(e) => handleChange(e, setFormRiwayat)} /> Spontan</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="cara_melahirkan_sungsang" checked={formRiwayat.cara_melahirkan_sungsang} onChange={(e) => handleChange(e, setFormRiwayat)} /> Sungsang</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="tindakan_ekstraksi_vakum" checked={formRiwayat.tindakan_ekstraksi_vakum} onChange={(e) => handleChange(e, setFormRiwayat)} /> Vakum</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="tindakan_ekstraksi_forsep" checked={formRiwayat.tindakan_ekstraksi_forsep} onChange={(e) => handleChange(e, setFormRiwayat)} /> Forsep</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="tindakan_sc" checked={formRiwayat.tindakan_sc} onChange={(e) => handleChange(e, setFormRiwayat)} /> SC</label>
              <input name="taksiran_melahirkan" placeholder="Taksiran" value={formRiwayat.taksiran_melahirkan} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
              <input name="fasyankes_tempat_melahirkan" placeholder="Fasyankes" value={formRiwayat.fasyankes_tempat_melahirkan} onChange={(e) => handleChange(e, setFormRiwayat)} className="border rounded px-3 py-2" />
            </div>
            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={18} /> Simpan Riwayat</button>
          </form>
        )}

        {/* Ringkasan Pelayanan Persalinan Tab */}
        {activeTab === "ringkasan" && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit("ringkasan"); }} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="date" name="tanggal_melahirkan" value={formRingkasan.tanggal_melahirkan} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input type="time" name="pukul_melahirkan" value={formRingkasan.pukul_melahirkan} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input name="umur_kehamilan_minggu" placeholder="Umur kehamilan (minggu)" value={formRingkasan.umur_kehamilan_minggu} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input name="penolong_proses_melahirkan" placeholder="Penolong" value={formRingkasan.penolong_proses_melahirkan} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input name="cara_melahirkan" placeholder="Cara melahirkan" value={formRingkasan.cara_melahirkan} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <select name="keadaan_ibu" value={formRingkasan.keadaan_ibu} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2"><option>Sehat</option><option>Sakit</option></select>
              <input name="kb_pasca_melahirkan" placeholder="KB" value={formRingkasan.kb_pasca_melahirkan} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input name="bayi_anak_ke" placeholder="Anak ke-" value={formRingkasan.bayi_anak_ke} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input name="bayi_berat_lahir_gram" placeholder="Berat lahir (gram)" value={formRingkasan.bayi_berat_lahir_gram} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input name="bayi_panjang_badan_cm" placeholder="Panjang (cm)" value={formRingkasan.bayi_panjang_badan_cm} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <input name="bayi_lingkar_kepala_cm" placeholder="Lingkar kepala (cm)" value={formRingkasan.bayi_lingkar_kepala_cm} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2" />
              <select name="bayi_jenis_kelamin" value={formRingkasan.bayi_jenis_kelamin} onChange={(e) => handleChange(e, setFormRingkasan)} className="border rounded px-3 py-2"><option>Laki-laki</option><option>Perempuan</option></select>
              <label className="flex items-center gap-2"><input type="checkbox" name="kondisi_bayi_segera_menangis" checked={formRingkasan.kondisi_bayi_segera_menangis} onChange={(e) => handleChange(e, setFormRingkasan)} /> Segera menangis</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_imd_1_jam_pertama" checked={formRingkasan.asuhan_imd_1_jam_pertama} onChange={(e) => handleChange(e, setFormRingkasan)} /> IMD</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_suntikan_vitamin_k1" checked={formRingkasan.asuhan_suntikan_vitamin_k1} onChange={(e) => handleChange(e, setFormRingkasan)} /> Vitamin K1</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_salep_mata_antibiotika" checked={formRingkasan.asuhan_salep_mata_antibiotika} onChange={(e) => handleChange(e, setFormRingkasan)} /> Salep mata</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="asuhan_imunisasi_hb0" checked={formRingkasan.asuhan_imunisasi_hb0} onChange={(e) => handleChange(e, setFormRingkasan)} /> HB0</label>
            </div>
            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={18} /> Simpan Ringkasan</button>
          </form>
        )}

        {/* Keterangan Lahir Tab */}
        {activeTab === "keterangan" && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit("keterangan"); }} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nomor_surat" placeholder="Nomor Surat" value={formKeterangan.nomor_surat} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="hari_lahir" placeholder="Hari" value={formKeterangan.hari_lahir} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input type="date" name="tanggal_lahir" value={formKeterangan.tanggal_lahir} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input type="time" name="pukul_lahir" value={formKeterangan.pukul_lahir} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <select name="jenis_kelamin" value={formKeterangan.jenis_kelamin} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2"><option>Laki-laki</option><option>Perempuan</option></select>
              <input name="jenis_kelahiran" placeholder="Jenis kelahiran" value={formKeterangan.jenis_kelahiran} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="anak_ke" placeholder="Anak ke-" value={formKeterangan.anak_ke} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="berat_lahir_gram" placeholder="Berat (gram)" value={formKeterangan.berat_lahir_gram} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="panjang_badan_cm" placeholder="Panjang (cm)" value={formKeterangan.panjang_badan_cm} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="lingkar_kepala_cm" placeholder="Lingkar kepala (cm)" value={formKeterangan.lingkar_kepala_cm} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="lokasi_persalinan" placeholder="Lokasi persalinan" value={formKeterangan.lokasi_persalinan} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="nama_bayi_diberi_nama" placeholder="Nama Bayi" value={formKeterangan.nama_bayi_diberi_nama} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="nama_ibu" placeholder="Nama Ibu" value={formKeterangan.nama_ibu} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
              <input name="nama_ayah" placeholder="Nama Ayah" value={formKeterangan.nama_ayah} onChange={(e) => handleChange(e, setFormKeterangan)} className="border rounded px-3 py-2" />
            </div>
            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FileText size={18} /> Cetak & Simpan Keterangan Lahir</button>
          </form>
        )}
      </div>
    </MainLayout>
  );
}