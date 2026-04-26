// src/pages/Ibu/IbuCreate.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { createIbu } from "../../services/ibu";
import { createKehamilan } from "../../services/kehamilan";
import { getKependudukanList } from "../../services/kependudukan";
import { Save, ArrowLeft, ArrowRight, Loader2, CheckCircle2, Baby, Users, ClipboardList } from "lucide-react";

export default function IbuCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [kkList, setKkList] = useState([]);
  const [step, setStep] = useState(1);
  const [createdIbu, setCreatedIbu] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formIbu, setFormIbu] = useState({
    id_kependudukan: "",
    status_kehamilan: "TRIMESTER 1",
  });

  const [formKehamilan, setFormKehamilan] = useState({
    gravida: "", paritas: "", abortus: "", hpht: "",
    taksiran_persalinan: "", uk_kehamilan_saat_ini: "",
    jarak_kehamilan_sebelumnya: "", status_kehamilan: "TRIMESTER 1",
  });

  useEffect(() => {
    const fetchKK = async () => {
      try {
        const data = await getKependudukanList();
        if (Array.isArray(data)) setKkList(data);
        else setKkList([]);
      } catch (err) {
        console.error(err);
        setErrorMessage("Gagal mengambil data penduduk.");
      }
    };
    fetchKK();
  }, []);

  useEffect(() => {
    if (formKehamilan.hpht) {
      const hpht = new Date(formKehamilan.hpht);
      const hpl = new Date(hpht);
      hpl.setDate(hpl.getDate() + 7);
      hpl.setMonth(hpl.getMonth() + 9);
      setFormKehamilan(prev => ({ ...prev, taksiran_persalinan: hpl.toISOString().split("T")[0] }));
    }
  }, [formKehamilan.hpht]);

  const handleChangeIbu = (e) => {
    const { name, value } = e.target;
    setFormIbu(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleChangeKehamilan = (e) => {
    setFormKehamilan(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    if (!formIbu.id_kependudukan) {
      setErrorMessage("Silakan pilih data penduduk terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      const idKependudukan = Number(formIbu.id_kependudukan);
      if (isNaN(idKependudukan) || idKependudukan <= 0) {
        throw new Error("ID Penduduk tidak valid");
      }
      const ibu = await createIbu({
        id_kependudukan: idKependudukan,
        status_kehamilan: formIbu.status_kehamilan,
      });
      setCreatedIbu(ibu);
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Gagal menambahkan data ibu";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    if (!createdIbu) {
      setErrorMessage("Data ibu belum dibuat.");
      return;
    }
    setLoading(true);
    try {
      const ibuId = createdIbu.id_ibu || createdIbu.id;
      await createKehamilan({
        ibu_id: Number(ibuId),
        gravida: parseInt(formKehamilan.gravida) || 0,
        paritas: parseInt(formKehamilan.paritas) || 0,
        abortus: parseInt(formKehamilan.abortus) || 0,
        hpht: formKehamilan.hpht || "",
        taksiran_persalinan: formKehamilan.taksiran_persalinan || "",
        uk_kehamilan_saat_ini: parseInt(formKehamilan.uk_kehamilan_saat_ini) || 0,
        jarak_kehamilan_sebelumnya: parseInt(formKehamilan.jarak_kehamilan_sebelumnya) || 0,
        status_kehamilan: formKehamilan.status_kehamilan,
      });
      setStep(3);
      setTimeout(() => navigate(`/data-ibu/${ibuId}`), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Gagal menyimpan data kehamilan";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipKehamilan = () => {
    const ibuId = createdIbu?.id_ibu || createdIbu?.id;
    if (ibuId) navigate(`/data-ibu/${ibuId}`);
    else navigate("/data-ibu");
  };

  const steps = [
    { num: 1, label: "Data Ibu", icon: Users },
    { num: 2, label: "Data Kehamilan", icon: Baby },
    { num: 3, label: "Selesai", icon: CheckCircle2 },
  ];

  const selectedPenduduk = useMemo(() => {
    if (!formIbu.id_kependudukan) return null;
    return kkList.find(kk => String(kk.id_kependudukan ?? kk.id) === String(formIbu.id_kependudukan));
  }, [formIbu.id_kependudukan, kkList]);

  return (
    <MainLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
          <div><h1 className="text-2xl font-bold">Tambah Data Ibu Baru</h1></div>
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDone ? "bg-green-500 text-white" : isActive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {isDone ? <CheckCircle2 size={22} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? "text-indigo-600" : isDone ? "text-green-600" : "text-gray-400"}`}>{s.label}</span>
                </div>
                {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-3 ${step > s.num ? "bg-green-400" : "bg-gray-200"}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {errorMessage && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{errorMessage}</div>}

        {step === 1 && (
          <form onSubmit={handleSubmitStep1}>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Pilih Data Penduduk</h3>
              <select name="id_kependudukan" value={formIbu.id_kependudukan} onChange={handleChangeIbu} className="w-full border rounded-xl p-3" required>
                <option value="">-- Pilih Data Penduduk --</option>
                {kkList.map(kk => {
                  const idPenduduk = kk.id_kependudukan ?? kk.id;
                  return (
                    <option key={idPenduduk} value={String(idPenduduk)}>
                      {kk.nama_lengkap} — NIK: {kk.nik} — KK: {kk.no_kk}
                    </option>
                  );
                })}
              </select>
              {selectedPenduduk && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <p><strong>Nama:</strong> {selectedPenduduk.nama_lengkap}</p>
                  <p><strong>NIK:</strong> {selectedPenduduk.nik}</p>
                </div>
              )}
              <div className="mt-4">
                <label>Status Kehamilan</label>
                <select name="status_kehamilan" value={formIbu.status_kehamilan} onChange={handleChangeIbu} className="w-full border rounded-xl p-3 mt-1">
                  <option>TRIMESTER 1</option><option>TRIMESTER 2</option><option>TRIMESTER 3</option><option>NIFAS</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />} {loading ? "Menyimpan..." : "Simpan & Lanjut"}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmitStep2}>
            {/* Sama seperti sebelumnya – tidak perlu diubah detailnya */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold">Data Kehamilan</h3>
              <div className="grid grid-cols-3 gap-4">
                <input name="gravida" placeholder="Gravida" value={formKehamilan.gravida} onChange={handleChangeKehamilan} className="border rounded p-2" />
                <input name="paritas" placeholder="Paritas" value={formKehamilan.paritas} onChange={handleChangeKehamilan} className="border rounded p-2" />
                <input name="abortus" placeholder="Abortus" value={formKehamilan.abortus} onChange={handleChangeKehamilan} className="border rounded p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="hpht" value={formKehamilan.hpht} onChange={handleChangeKehamilan} className="border rounded p-2" />
                <input type="date" name="taksiran_persalinan" value={formKehamilan.taksiran_persalinan} readOnly className="border rounded p-2 bg-gray-100" />
                <input name="uk_kehamilan_saat_ini" placeholder="Usia Kehamilan (minggu)" value={formKehamilan.uk_kehamilan_saat_ini} onChange={handleChangeKehamilan} className="border rounded p-2" />
                <input name="jarak_kehamilan_sebelumnya" placeholder="Jarak (bulan)" value={formKehamilan.jarak_kehamilan_sebelumnya} onChange={handleChangeKehamilan} className="border rounded p-2" />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={handleSkipKehamilan} className="text-gray-500">Lewati, isi nanti</button>
              <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Save />} {loading ? "Menyimpan..." : "Simpan Data Kehamilan"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold">Data Berhasil Disimpan!</h2>
            <p className="text-gray-500">Mengalihkan ke halaman detail...</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}