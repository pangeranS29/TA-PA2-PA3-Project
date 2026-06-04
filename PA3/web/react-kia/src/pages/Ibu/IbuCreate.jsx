// src/pages/Ibu/IbuCreate.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { createIbu, getIbuByPendudukId } from "../../services/ibu";
import { createKehamilan } from "../../services/kehamilan";
import { getKependudukanList } from "../../services/kependudukan";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Baby,
  Users,
  Info,
} from "lucide-react";

export default function IbuCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pendudukList, setPendudukList] = useState([]);
  const [step, setStep] = useState(1);
  const [createdIbu, setCreatedIbu] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [checkingIbu, setCheckingIbu] = useState(false);
  const [ibuExists, setIbuExists] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Form data ibu (muncul jika belum terdaftar)
  const [formIbu, setFormIbu] = useState({
    id_kependudukan: "",
    id_suami: "",
    gravida: "",
    paritas: "",
    abortus: "",
  });

  // Form kehamilan
  const [formKehamilan, setFormKehamilan] = useState({
    hpht: "",
    taksiran_persalinan: "",
    jarak_kehamilan_sebelumnya: "",
    bb_awal: "",
    tb: "",
  });

  // Fetch penduduk
  useEffect(() => {
    const fetchPenduduk = async () => {
      try {
        const data = await getKependudukanList();
        if (Array.isArray(data)) {
          setPendudukList(data);
        } else {
          setPendudukList([]);
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Gagal mengambil data penduduk.");
      }
    };
    fetchPenduduk();
  }, []);

  const ibuList = useMemo(() => {
    return pendudukList.filter(
      (item) => item.jenis_kelamin === "Perempuan" || item.jenis_kelamin === "P"
    );
  }, [pendudukList]);

  const suamiList = useMemo(() => {
    return pendudukList.filter(
      (item) => item.jenis_kelamin === "Laki-laki" || item.jenis_kelamin === "L"
    );
  }, [pendudukList]);

  // Cek apakah penduduk sudah terdaftar sebagai ibu
  const checkIbuExists = async (pendudukId) => {
    if (!pendudukId) {
      setCreatedIbu(null);
      setIbuExists(false);
      return;
    }

    setCheckingIbu(true);
    setErrorMessage("");
    try {
      const data = await getIbuByPendudukId(pendudukId);
      if (data && data.id_ibu) {
        setCreatedIbu(data);
        setIbuExists(true);
        setStep(2); // langsung ke form kehamilan
      } else {
        setCreatedIbu(null);
        setIbuExists(false);
      }
    } catch (err) {
      console.error(err);
      setCreatedIbu(null);
      setIbuExists(false);
    } finally {
      setCheckingIbu(false);
    }
  };

  // Ketika pilihan penduduk berubah
  useEffect(() => {
    if (formIbu.id_kependudukan) {
      checkIbuExists(formIbu.id_kependudukan);
    } else {
      setCreatedIbu(null);
      setIbuExists(false);
    }
    setErrorMessage("");
  }, [formIbu.id_kependudukan]);

  // Handle perubahan form ibu
  const handleChangeIbu = (e) => {
    const { name, value } = e.target;
    setFormIbu((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  // Handle perubahan form kehamilan
  const handleChangeKehamilan = (e) => {
    const { name, value } = e.target;
    setFormKehamilan((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Auto HPL
  useEffect(() => {
    if (formKehamilan.hpht) {
      const hpht = new Date(formKehamilan.hpht);
      const hpl = new Date(hpht);
      hpl.setDate(hpl.getDate() + 7);
      hpl.setMonth(hpl.getMonth() + 9);
      setFormKehamilan((prev) => ({
        ...prev,
        taksiran_persalinan: hpl.toISOString().split("T")[0],
      }));
    }
  }, [formKehamilan.hpht]);

  // Submit data ibu (untuk kasus belum terdaftar)
  const handleSubmitIbu = async (e) => {
    e.preventDefault();
    if (!formIbu.id_kependudukan) {
      setErrorMessage("Silakan pilih data penduduk terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const ibu = await createIbu({
        id_kependudukan: Number(formIbu.id_kependudukan),
        id_suami: formIbu.id_suami ? Number(formIbu.id_suami) : null,
        gravida: Number(formIbu.gravida) || 0,
        paritas: Number(formIbu.paritas) || 0,
        abortus: Number(formIbu.abortus) || 0,
      });
      setCreatedIbu(ibu);
      setStep(2); // lanjut ke form kehamilan
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Gagal menambahkan data ibu";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Submit kehamilan
  const handleSubmitKehamilan = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formKehamilan.hpht) {
      newErrors.hpht = "Silakan pilih tanggal HPHT terlebih dahulu";
    } else if (formKehamilan.hpht > today) {
      newErrors.hpht = "Tanggal HPHT tidak boleh melebihi hari ini";
    }
    if (!formKehamilan.bb_awal) {
      newErrors.bb_awal = "Berat badan wajib diisi";
    } else if (parseFloat(formKehamilan.bb_awal) <= 0) {
      newErrors.bb_awal = "Berat badan harus lebih dari 0 kg";
    }
    if (!formKehamilan.tb) {
      newErrors.tb = "Tinggi badan wajib diisi";
    } else if (parseFloat(formKehamilan.tb) <= 0) {
      newErrors.tb = "Tinggi badan harus lebih dari 0 cm";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!createdIbu) {
      setErrorMessage("Data ibu belum tersedia. Silakan ulangi proses.");
      return;
    }

    setLoading(true);
    try {
      const ibuId = createdIbu.id_ibu || createdIbu.id;
      await createKehamilan({
        ibu_id: Number(ibuId),
        hpht: formKehamilan.hpht,
        taksiran_persalinan: formKehamilan.taksiran_persalinan,
        jarak_kehamilan_sebelumnya: parseInt(formKehamilan.jarak_kehamilan_sebelumnya) || 0,
        bb_awal: parseFloat(formKehamilan.bb_awal),
        tb: parseFloat(formKehamilan.tb),
      });
      setStep(3);
      setTimeout(() => {
        navigate(`/data-ibu/${ibuId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Gagal menyimpan data kehamilan";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Data Ibu", icon: Users },
    { num: 2, label: "Data Kehamilan", icon: Baby },
    { num: 3, label: "Selesai", icon: CheckCircle2 },
  ];

  return (
    <MainLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Tambah Data Ibu Baru</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDone ? "bg-green-500 text-white" : isActive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isDone ? <CheckCircle2 size={22} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? "text-indigo-600" : isDone ? "text-green-600" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-3 ${step > s.num ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {errorMessage}
          </div>
        )}

        {/* STEP 1 - Pilih penduduk & form data ibu (jika belum terdaftar) */}
        {step === 1 && (
          <form onSubmit={handleSubmitIbu}>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Pilih Penduduk Perempuan</h3>
              <select
                name="id_kependudukan"
                value={formIbu.id_kependudukan}
                onChange={handleChangeIbu}
                className="w-full border rounded-xl p-3"
                required
              >
                <option value="">-- Pilih Data Penduduk --</option>
                {ibuList.map((kk) => {
                  const idPenduduk = kk.id_kependudukan ?? kk.id;
                  return (
                    <option key={idPenduduk} value={String(idPenduduk)}>
                      {kk.nama_lengkap} — NIK: {kk.nik}
                    </option>
                  );
                })}
              </select>
              {checkingIbu && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin" /> Mengecek data ibu...
                </div>
              )}

              {/* Jika ibu sudah terdaftar, info langsung lanjut */}
              {ibuExists && !checkingIbu && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-blue-700">
                  <Info size={18} />
                  <span>Ibu sudah terdaftar. Silakan lanjut ke data kehamilan.</span>
                </div>
              )}

              {/* Form data ibu (muncul hanya jika ibu belum terdaftar dan penduduk dipilih) */}
              {!ibuExists && !checkingIbu && formIbu.id_kependudukan && (
                <>
                  <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                    <p><strong>Nama:</strong> {ibuList.find(kk => String(kk.id_kependudukan ?? kk.id) === formIbu.id_kependudukan)?.nama_lengkap}</p>
                    <p><strong>NIK:</strong> {ibuList.find(kk => String(kk.id_kependudukan ?? kk.id) === formIbu.id_kependudukan)?.nik}</p>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Suami (Opsional)</label>
                    <select name="id_suami" value={formIbu.id_suami} onChange={handleChangeIbu} className="w-full border rounded-xl p-3">
                      <option value="">-- Tidak ada suami / pilih --</option>
                      {suamiList.map((suami) => {
                        const idPenduduk = suami.id_kependudukan ?? suami.id;
                        return (
                          <option key={idPenduduk} value={String(idPenduduk)}>
                            {suami.nama_lengkap} — NIK: {suami.nik}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gravida</label>
                      <input type="number" name="gravida" min="0" value={formIbu.gravida} onChange={handleChangeIbu} className="w-full border rounded-xl p-3 mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Paritas</label>
                      <input type="number" name="paritas" min="0" value={formIbu.paritas} onChange={handleChangeIbu} className="w-full border rounded-xl p-3 mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Abortus</label>
                      <input type="number" name="abortus" min="0" value={formIbu.abortus} onChange={handleChangeIbu} className="w-full border rounded-xl p-3 mt-1" />
                    </div>
                  </div>
                </>
              )}

              {!formIbu.id_kependudukan && (
                <p className="text-gray-400 text-sm mt-2">Silakan pilih penduduk terlebih dahulu</p>
              )}
            </div>

            {/* Tombol submit: muncul jika ibu belum terdaftar */}
            {!ibuExists && formIbu.id_kependudukan && !checkingIbu && (
              <div className="flex justify-end mt-6">
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                  {loading ? "Menyimpan..." : "Simpan & Lanjut"}
                </button>
              </div>
            )}

            {/* Jika ibu sudah terdaftar, beri tombol untuk lanjut manual */}
            {ibuExists && !checkingIbu && (
              <div className="flex justify-end mt-6">
                <button type="button" onClick={() => setStep(2)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2">
                  Lanjut ke Data Kehamilan <ArrowRight size={18} />
                </button>
              </div>
            )}
          </form>
        )}

        {/* STEP 2 - Form Kehamilan (sama seperti sebelumnya) */}
        {step === 2 && (
          <form onSubmit={handleSubmitKehamilan}>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Data Kehamilan</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">HPHT</label>
                <input type="date" name="hpht" value={formKehamilan.hpht} onChange={handleChangeKehamilan} max={today} className="w-full border rounded-xl p-3" required />
                {errors.hpht && <p className="text-red-500 text-sm mt-1">{errors.hpht}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Taksiran Persalinan (HPL)</label>
                <input type="date" value={formKehamilan.taksiran_persalinan} disabled className="w-full border rounded-xl p-3 bg-gray-50" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Jarak Kehamilan Sebelumnya (bulan)</label>
                <input type="number" name="jarak_kehamilan_sebelumnya" min="0" value={formKehamilan.jarak_kehamilan_sebelumnya} onChange={handleChangeKehamilan} className="w-full border rounded-xl p-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan Awal (kg)</label>
                  <input type="number" name="bb_awal" step="0.1" value={formKehamilan.bb_awal} onChange={handleChangeKehamilan} className="w-full border rounded-xl p-3" required />
                  {errors.bb_awal && <p className="text-red-500 text-sm mt-1">{errors.bb_awal}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
                  <input type="number" name="tb" step="0.1" value={formKehamilan.tb} onChange={handleChangeKehamilan} className="w-full border rounded-xl p-3" required />
                  {errors.tb && <p className="text-red-500 text-sm mt-1">{errors.tb}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={() => setStep(1)} className="px-6 py-2 border rounded-xl hover:bg-gray-50">Kembali</button>
              <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                {loading ? "Menyimpan..." : "Selesai"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Data Berhasil Disimpan!</h3>
            <p className="text-gray-600">Mengalihkan ke halaman detail ibu...</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}