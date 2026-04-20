// src/pages/Ibu/IbuEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getIbuById, updateIbu } from "../../services/ibu";
import { getKehamilanByIbuId, updateKehamilan } from "../../services/kehamilan";
import { AlertCircle, Save } from "lucide-react";

export default function IbuEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ibu, setIbu] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [form, setForm] = useState({
    nama_lengkap: "",
    nik: "",
    no_jkn: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    golongan_darah: "",
    pendidikan: "",
    pekerjaan: "",
    alamat: "",
    telepon: "",
    hpht: "",
    gravida: "",
    paritas: "",
    abortus: "",
    puskesmas: "",
    rs_rujukan: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const ibuData = await getIbuById(id);
        setIbu(ibuData);
        const kehamilanData = await getKehamilanByIbuId(id);
        const aktif = kehamilanData.length > 0 ? kehamilanData[0] : null;
        setKehamilan(aktif);
        const kd = ibuData.kependudukan || {};
        setForm({
          nama_lengkap: kd.nama_lengkap || "",
          nik: kd.nik || "",
          no_jkn: "0001234567890",
          tempat_lahir: kd.tempat_lahir || "",
          tanggal_lahir: kd.tanggal_lahir ? new Date(kd.tanggal_lahir).toISOString().split("T")[0] : "",
          golongan_darah: kd.golongan_darah || "",
          pendidikan: kd.pendidikan_terakhir || "",
          pekerjaan: kd.pekerjaan || "",
          alamat: kd.alamat || "",
          telepon: ibuData.telepon || "",
          hpht: aktif?.hpht ? new Date(aktif.hpht).toISOString().split("T")[0] : "",
          gravida: aktif?.gravida?.toString() || "",
          paritas: aktif?.paritas?.toString() || "",
          abortus: aktif?.abortus?.toString() || "",
          puskesmas: "Puskesmas Jatiasih",
          rs_rujukan: "RSUD dr. Chasbullah Abdulmadjid",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update ibu (kependudukan)
      const ibuPayload = {
        id_kependudukan: ibu.id_kependudukan,
        nama_ibu: form.nama_lengkap,
        nik: form.nik,
        usia: ibu.usia,
        dusun: ibu.dusun,
        status_kehamilan: ibu.status_kehamilan,
        telepon: form.telepon,
        alamat: form.alamat,
      };
      await updateIbu(id, ibuPayload);
      // Update kehamilan
      if (kehamilan) {
        await updateKehamilan(kehamilan.id, {
          hpht: form.hpht,
          gravida: parseInt(form.gravida) || 0,
          paritas: parseInt(form.paritas) || 0,
          abortus: parseInt(form.abortus) || 0,
        });
      }
      alert("Profil berhasil diperbarui");
      navigate(`/data-ibu/${id}`);
    } catch (err) {
      alert("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  if (!ibu) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Edit Profil Lengkap</h1>
        <p className="text-gray-500 mb-6">Perbarui manajemen data fundamental pasien secara akurat.</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Nama Lengkap</label><input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required /></div>
            <div><label className="block text-sm font-medium mb-1">NIK</label><input name="nik" value={form.nik} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required /></div>
            <div><label className="block text-sm font-medium mb-1">No. JKN/BPJS</label><input name="no_jkn" value={form.no_jkn} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Tempat Lahir</label><input name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Tanggal Lahir</label><input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Golongan Darah</label><input name="golongan_darah" value={form.golongan_darah} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Pendidikan Terakhir</label><input name="pendidikan" value={form.pendidikan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Pekerjaan</label><input name="pekerjaan" value={form.pekerjaan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Alamat</label><textarea name="alamat" value={form.alamat} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows="2" /></div>
            <div><label className="block text-sm font-medium mb-1">Nomor Telepon</label><input name="telepon" value={form.telepon} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">HPHT</label><input type="date" name="hpht" value={form.hpht} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Gravida (G)</label><input name="gravida" value={form.gravida} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Paritas (P)</label><input name="paritas" value={form.paritas} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Abortus (A)</label><input name="abortus" value={form.abortus} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Puskesmas Primer</label><input name="puskesmas" value={form.puskesmas} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">RS Rujukan Utama</label><input name="rs_rujukan" value={form.rs_rujukan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg">Batal</button>
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={18} /> {loading ? "Menyimpan..." : "Simpan Perubahan Profil"}</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}