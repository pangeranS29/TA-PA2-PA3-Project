// src/pages/Ibu/EvaluasiKesehatanIbu.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { getKehamilanByIbuId } from "../../services/kehamilan";
import { getEvaluasiByKehamilanId, createEvaluasi, updateEvaluasi, getRiwayatKehamilanByEvaluasiId, createRiwayatKehamilan } from "../../services/evaluasiKesehatan";
import { Plus, Edit, Save, ArrowLeft, Eye, CheckCircle, Home, EyeOff } from "lucide-react";
import { getCurrentUser, isDokterUser } from "../../services/auth";

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
  const [isActive, setIsActive] = useState(true); // ✅ state untuk status aktif

  // Hak edit: hanya dokter dan kehamilan aktif (bukan NON-AKTIF)
  const canEdit = isDokter && isActive;

  // State form (sama seperti sebelumnya)
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

  // Breadcrumb
  // const Breadcrumb = () => {
  //   if (!kehamilan) return null;
  //   return (
  //     <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
  //       <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
  //         <Home size={14} /> Beranda
  //       </Link>
  //       <span>/</span>
  //       <Link to="/data-ibu" className="hover:text-indigo-600">Data Ibu</Link>
  //       <span>/</span>
  //       <Link to={`/data-ibu/${ibuId}?kehamilan_id=${kehamilan.id}`} className="hover:text-indigo-600">
  //         Detail Ibu
  //       </Link>
  //       <span>/</span>
  //       <span className="text-gray-700 font-medium">Evaluasi Kesehatan Ibu</span>
  //     </div>
  //   );
  // };

  // Ambil nama user yang login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.nama) {
      setForm(prev => ({ ...prev, nama_dokter: storedUser.nama }));
    }
  }, []);

  // Fetch data kehamilan, evaluasi, dan riwayat
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
          targetKehamilan = kehamilanList.find(k => k.id == kehamilanId);
          if (!targetKehamilan) {
            alert(`Kehamilan dengan ID ${kehamilanId} tidak ditemukan.`);
            navigate(`/data-ibu/${ibuId}`);
            return;
          }
        } else {
          targetKehamilan = kehamilanList[0];
        }
        setKehamilan(targetKehamilan);

        // ✅ Tentukan status aktif (NON-AKTIF = tidak aktif)
        const status = targetKehamilan.status_kehamilan || "";
        const aktif = status !== "NON-AKTIF";
        setIsActive(aktif);

        const evalData = await getEvaluasiByKehamilanId(targetKehamilan.id);
        if (evalData && evalData.length > 0) {
          const e = evalData[0];
  //           console.log("🔍 Objek evaluasi dari server:", e);
  // console.log("🔑 Kunci-kunci yang tersedia:", Object.keys(e));
          setEvaluasi(e);
          setForm({
            nama_dokter: e.nama_dokter || "",
            tanggal_periksa: e.tanggal_periksa ? e.tanggal_periksa.split("T")[0] : new Date().toISOString().split("T")[0],
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
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    if (ibuId) fetchData();
  }, [ibuId, kehamilanId, navigate]);

  // Validasi form (sama)
  const validateForm = () => {
    const newErrors = {};
    if (!form.tanggal_periksa) newErrors.tanggal_periksa = "Tanggal periksa wajib diisi";
    if (form.tb_cm && (isNaN(parseFloat(form.tb_cm)) || parseFloat(form.tb_cm) <= 0)) newErrors.tb_cm = "TB harus angka > 0";
    if (form.bb_kg && (isNaN(parseFloat(form.bb_kg)) || parseFloat(form.bb_kg) <= 0)) newErrors.bb_kg = "BB harus angka > 0";
    if (form.lila_cm && (isNaN(parseFloat(form.lila_cm)) || parseFloat(form.lila_cm) <= 0)) newErrors.lila_cm = "LILA harus angka > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
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

    // Ambil riwayat, tapi jangan sampai menggagalkan notifikasi sukses

    alert("Evaluasi kesehatan ibu berhasil disimpan");
  } catch (err) {
    alert("Gagal menyimpan evaluasi");
    console.error(err);
  } finally {
    setSaving(false);
  }
};

  const handleAddRiwayat = async () => {
    if (!canEdit) {
      alert("Tidak dapat menambah riwayat karena kehamilan sudah selesai (NON-AKTIF).");
      return;
    }
    if (!evaluasi) {
      alert("Simpan evaluasi terlebih dahulu");
      return;
    }
    if (!formRiwayat.tahun || !formRiwayat.proses_melahirkan) {
      alert("Tahun dan Proses Melahirkan wajib diisi");
      return;
    }
    try {
      const payload = {
        id_evaluasi: evaluasi.id,
        no_urut: parseInt(formRiwayat.no_urut) || 1,
        tahun: parseInt(formRiwayat.tahun) || 0,
        bb_gram: parseInt(formRiwayat.bb_gram) || 0,
        proses_melahirkan: formRiwayat.proses_melahirkan,
        penolong_proses_melahirkan: formRiwayat.penolong_proses_melahirkan,
        masalah: formRiwayat.masalah,
      };
      const created = await createRiwayatKehamilan(payload);
      setRiwayatList([...riwayatList, created]);
      setFormRiwayat({ no_urut: riwayatList.length + 2, tahun: "", bb_gram: "", proses_melahirkan: "", penolong_proses_melahirkan: "", masalah: "" });
      alert("Riwayat kehamilan lalu berhasil ditambahkan");
    } catch (err) {
      alert("Gagal menambahkan riwayat");
      console.error(err);
    }
  };

  const renderCheckValue = (value) => {
    return value ? 
      <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle size={14} /> Ya</span> : 
      <span className="text-gray-400">Tidak</span>;
  };

  // EvaluationView (sama seperti sebelumnya, hanya tambahan banner non-aktif jika perlu)
  const EvaluationView = () => {
    if (!evaluasi) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-gray-500 mb-4">Belum ada data evaluasi kesehatan untuk kehamilan ini.</div>
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus size={18} /> Buat Evaluasi Baru
            </button>
          )}
          {!canEdit && !isActive && (
            <p className="text-gray-400 text-sm mt-2">Kehamilan sudah selesai (NON-AKTIF), tidak dapat menambahkan data baru.</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header informasi umum */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><span className="font-semibold">Nama Dokter:</span> {form.nama_dokter || "-"}</div>
            <div><span className="font-semibold">Tanggal Periksa:</span> {form.tanggal_periksa || "-"}</div>
            <div><span className="font-semibold">Fasilitas Kesehatan:</span> {form.fasilitas_kesehatan || "-"}</div>
          </div>
        </div>

        {/* Kondisi Kesehatan Ibu */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Kondisi Kesehatan Ibu</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><span className="font-semibold">TB:</span> {form.tb_cm ? `${form.tb_cm} cm` : "-"}</div>
            <div><span className="font-semibold">BB:</span> {form.bb_kg ? `${form.bb_kg} kg` : "-"}</div>
            <div><span className="font-semibold">IMT Kategori:</span> {form.imt_kategori || "-"}</div>
            <div><span className="font-semibold">LiLA:</span> {form.lila_cm ? `${form.lila_cm} cm` : "-"}</div>
          </div>
        </div>

        {/* Status Imunisasi TT */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Status Imunisasi TT</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[1,2,3,4,5].map(n => (
              <div key={n} className="flex items-center gap-2">
                <span className="w-12">TT {n}:</span> {renderCheckValue(form[`status_tt_${n}`])}
              </div>
            ))}
          </div>
          <div className="mt-3"><span className="font-semibold">Imunisasi Lainnya (Covid-19, dll):</span> {form.imunisasi_lainnya_covid19 || "-"}</div>
        </div>

        {/* Pemeriksaan Khusus (Inspeksi) */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Pemeriksaan Khusus (Inspeksi)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["porsio", "uretra", "vagina", "vulva", "fluksus", "fluor"].map(item => (
              <div key={item}>
                <span className="font-semibold capitalize">{item}:</span> {form[`inspeksi_${item}`] || "-"}
              </div>
            ))}
          </div>
        </div>

        {/* Riwayat Kesehatan Ibu */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Riwayat Kesehatan Ibu</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              "riwayat_alergi", "riwayat_asma", "riwayat_autoimun", "riwayat_diabetes",
              "riwayat_hepatitis_b", "riwayat_hipertensi", "riwayat_jantung", "riwayat_jiwa",
              "riwayat_sifilis", "riwayat_tb"
            ].map(key => (
              <div key={key} className="w-40 flex items-center gap-2">
                <span className="capitalize">{key.replace("riwayat_", "")}:</span> {renderCheckValue(form[key])}
              </div>
            ))}
          </div>
          <div className="mt-2"><span className="font-semibold">Lainnya:</span> {form.riwayat_kesehatan_lainnya || "-"}</div>
        </div>

        {/* Riwayat Perilaku Berisiko */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Riwayat Perilaku Berisiko (1 bulan sebelum hamil)</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              "perilaku_aktivitas_fisik_kurang", "perilaku_alkohol", "perilaku_kosmetik_berbahaya",
              "perilaku_merokok", "perilaku_obat_teratogenik", "perilaku_pola_makan_berisiko"
            ].map(key => (
              <div key={key} className="w-56 flex items-center gap-2">
                <span className="capitalize">{key.replace("perilaku_", "").replace(/_/g, " ")}:</span> {renderCheckValue(form[key])}
              </div>
            ))}
          </div>
          <div className="mt-2"><span className="font-semibold">Lainnya:</span> {form.perilaku_lainnya || "-"}</div>
        </div>

        {/* Riwayat Penyakit Keluarga */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Riwayat Penyakit Keluarga</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              "keluarga_alergi", "keluarga_asma", "keluarga_autoimun", "keluarga_diabetes",
              "keluarga_hepatitis_b", "keluarga_hipertensi", "keluarga_jantung", "keluarga_jiwa",
              "keluarga_sifilis", "keluarga_tb"
            ].map(key => (
              <div key={key} className="w-40 flex items-center gap-2">
                <span className="capitalize">{key.replace("keluarga_", "")}:</span> {renderCheckValue(form[key])}
              </div>
            ))}
          </div>
          <div className="mt-2"><span className="font-semibold">Lainnya:</span> {form.keluarga_lainnya || "-"}</div>
        </div>

        {/* Riwayat Kehamilan dan Proses Melahirkan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-indigo-900 border-b pb-2 mb-4">Riwayat Kehamilan dan Proses Melahirkan</h3>
          {riwayatList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr><th className="px-4 py-2">No</th><th>Tahun</th><th>BB (gram)</th><th>Proses Melahirkan</th><th>Penolong</th><th>Masalah</th></tr>
                </thead>
                <tbody>
                  {riwayatList.map((r, idx) => (
                    <tr key={r.id_riwayat || idx}>
                      <td className="px-4 py-2">{r.no_urut}</td>
                      <td className="px-4 py-2">{r.tahun}</td>
                      <td className="px-4 py-2">{r.bb_gram}</td>
                      <td className="px-4 py-2">{r.proses_melahirkan}</td>
                      <td className="px-4 py-2">{r.penolong_proses_melahirkan}</td>
                      <td className="px-4 py-2">{r.masalah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Belum ada riwayat kehamilan lalu.</p>
          )}
          {canEdit && evaluasi && (
            <div className="mt-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  const tahun = prompt("Masukkan tahun:");
                  const proses = prompt("Proses melahirkan:");
                  if (tahun && proses) {
                    setFormRiwayat({
                      no_urut: riwayatList.length + 1,
                      tahun: tahun,
                      bb_gram: "",
                      proses_melahirkan: proses,
                      penolong_proses_melahirkan: "",
                      masalah: "",
                    });
                    handleAddRiwayat();
                  }
                }}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Tambah Riwayat
              </button>
            </div>
          )}
        </div>

        {canEdit && evaluasi && (
          <div className="flex justify-end">
            <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <Edit size={18} /> Edit Evaluasi
            </button>
          </div>
        )}
      </div>
    );
  };

  // Form input (EvaluationForm) – sama seperti sebelumnya, tidak diubah
 const EvaluationForm = () => (
  <form onSubmit={handleSubmitEvaluasi} className="space-y-6">
    {/* Bagian 1: Data Pemeriksaan */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="font-semibold text-lg text-indigo-800 mb-4 flex items-center gap-2">
        📋 Data Pemeriksaan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Dokter</label>
          <input name="nama_dokter" value={form.nama_dokter} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2 bg-gray-50" readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tanggal Periksa <span className="text-red-500">*</span>
          </label>
          <input type="date" name="tanggal_periksa" value={form.tanggal_periksa} onChange={handleChangeWithIMT} className={`w-full border rounded-lg px-3 py-2 ${errors.tanggal_periksa ? 'border-red-500' : ''}`} />
          {errors.tanggal_periksa && <p className="text-red-500 text-xs mt-1">{errors.tanggal_periksa}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fasilitas Kesehatan</label>
          <input name="fasilitas_kesehatan" value={form.fasilitas_kesehatan} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2" placeholder="Puskesmas / Rumah Sakit" />
        </div>
      </div>
    </div>

    {/* Bagian 2: Antropometri */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="font-semibold text-lg text-indigo-800 mb-4 flex items-center gap-2">
        📏 Antropometri
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">TB (cm)</label>
          <input type="number" step="0.1" name="tb_cm" value={form.tb_cm} onChange={handleChangeWithIMT} className={`w-full border rounded-lg px-3 py-2 ${errors.tb_cm ? 'border-red-500' : ''}`} placeholder="Contoh: 160" />
          {errors.tb_cm && <p className="text-red-500 text-xs mt-1">{errors.tb_cm}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">BB (kg)</label>
          <input type="number" step="0.1" name="bb_kg" value={form.bb_kg} onChange={handleChangeWithIMT} className={`w-full border rounded-lg px-3 py-2 ${errors.bb_kg ? 'border-red-500' : ''}`} placeholder="Contoh: 55.5" />
          {errors.bb_kg && <p className="text-red-500 text-xs mt-1">{errors.bb_kg}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            IMT Kategori
            <span className="text-gray-400 text-xs ml-1" title="Terisi otomatis dari TB & BB, bisa diubah manual">ⓘ</span>
          </label>
          <select name="imt_kategori" value={form.imt_kategori} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2">
            <option value="">-- Pilih --</option>
            <option>Kurus</option><option>Normal</option><option>Gemuk</option><option>Obesitas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LILA (cm)</label>
          <input type="number" step="0.1" name="lila_cm" value={form.lila_cm} onChange={handleChangeWithIMT} className={`w-full border rounded-lg px-3 py-2 ${errors.lila_cm ? 'border-red-500' : ''}`} placeholder="Minimal 23.5 cm" />
          {errors.lila_cm && <p className="text-red-500 text-xs mt-1">{errors.lila_cm}</p>}
        </div>
      </div>
    </div>

    {/* Bagian 3: Status Imunisasi TT */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="font-semibold text-lg text-indigo-800 mb-4 flex items-center gap-2">
        💉 Status Imunisasi TT
      </h3>
      <div className="flex flex-wrap gap-4 mb-3">
        {[1, 2, 3, 4, 5].map(n => (
          <label key={n} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
            <input type="checkbox" name={`status_tt_${n}`} checked={form[`status_tt_${n}`]} onChange={handleChangeWithIMT} />
            <span>TT {n}</span>
          </label>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Imunisasi Lainnya (Covid-19, dll)</label>
        <input name="imunisasi_lainnya_covid19" value={form.imunisasi_lainnya_covid19} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2" placeholder="Contoh: Vaksin Covid-19 dosis 1" />
      </div>
    </div>

    {/* Bagian 4: Riwayat Kesehatan Ibu, Perilaku, Keluarga */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-6">
      {/* Riwayat Kesehatan Ibu */}
      <div>
        <h4 className="font-semibold text-md text-indigo-700 mb-2">🩺 Riwayat Kesehatan Ibu</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {["alergi","asma","autoimun","diabetes","hepatitis_b","hipertensi","jantung","jiwa","sifilis","tb"].map(item => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" name={`riwayat_${item}`} checked={form[`riwayat_${item}`]} onChange={handleChangeWithIMT} />
              <span className="capitalize">{item.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        <input name="riwayat_kesehatan_lainnya" placeholder="Lainnya (sebutkan)" value={form.riwayat_kesehatan_lainnya} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2 mt-2" />
      </div>

      {/* Perilaku Berisiko */}
      <div>
        <h4 className="font-semibold text-md text-indigo-700 mb-2">⚠️ Perilaku Berisiko (1 bulan sebelum hamil)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {["aktivitas_fisik_kurang","alkohol","kosmetik_berbahaya","merokok","obat_teratogenik","pola_makan_berisiko"].map(item => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" name={`perilaku_${item}`} checked={form[`perilaku_${item}`]} onChange={handleChangeWithIMT} />
              <span className="capitalize">{item.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        <input name="perilaku_lainnya" placeholder="Lainnya" value={form.perilaku_lainnya} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2 mt-2" />
      </div>

      {/* Riwayat Keluarga */}
      <div>
        <h4 className="font-semibold text-md text-indigo-700 mb-2">👨‍👩‍👧‍👦 Riwayat Penyakit Keluarga</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {["alergi","asma","autoimun","diabetes","hepatitis_b","hipertensi","jantung","jiwa","sifilis","tb"].map(item => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" name={`keluarga_${item}`} checked={form[`keluarga_${item}`]} onChange={handleChangeWithIMT} />
              <span className="capitalize">{item.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
        <input name="keluarga_lainnya" placeholder="Lainnya" value={form.keluarga_lainnya} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2 mt-2" />
      </div>
    </div>

    {/* Bagian 5: Inspeksi Medis */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="font-semibold text-lg text-indigo-800 mb-4 flex items-center gap-2">
        🔍 Pemeriksaan Inspeksi
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {["porsio","uretra","vagina","vulva","fluksus","fluor"].map(item => (
          <div key={item}>
            <label className="block capitalize font-medium text-sm mb-1">{item}</label>
            <select name={`inspeksi_${item}`} value={form[`inspeksi_${item}`]} onChange={handleChangeWithIMT} className="w-full border rounded-lg px-3 py-2">
              <option value="">-- Pilih --</option>
              <option>Normal</option><option>Abnormal</option>
            </select>
          </div>
        ))}
      </div>
    </div>

    {/* Bagian 6: Riwayat Kehamilan Lalu (dengan tampilan lebih baik) */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="font-semibold text-lg text-indigo-800 mb-4 flex items-center gap-2">
        📜 Riwayat Kehamilan & Persalinan Sebelumnya
      </h3>
      
      {/* Tabel data riwayat */}
      {riwayatList.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 border-b">No</th>
                <th className="px-3 py-2 border-b">Tahun</th>
                <th className="px-3 py-2 border-b">BB (gram)</th>
                <th className="px-3 py-2 border-b">Proses Melahirkan</th>
                <th className="px-3 py-2 border-b">Penolong</th>
                <th className="px-3 py-2 border-b">Masalah</th>
              </tr>
            </thead>
            <tbody>
              {riwayatList.map((r, idx) => (
                <tr key={r.id_riwayat || idx} className="border-b">
                  <td className="px-3 py-2 text-center">{r.no_urut}</td>
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
      )}

      {/* Form tambah riwayat dengan tata letak lebih rapi */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm font-medium mb-3 text-gray-700">➕ Tambah Riwayat Baru</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input type="number" placeholder="No Urut" value={formRiwayat.no_urut} onChange={(e) => setFormRiwayat({...formRiwayat, no_urut: e.target.value})} className="border rounded-lg px-3 py-2" />
          <input type="number" placeholder="Tahun *" value={formRiwayat.tahun} onChange={(e) => setFormRiwayat({...formRiwayat, tahun: e.target.value})} className="border rounded-lg px-3 py-2" />
          <input type="number" placeholder="BB (gram)" value={formRiwayat.bb_gram} onChange={(e) => setFormRiwayat({...formRiwayat, bb_gram: e.target.value})} className="border rounded-lg px-3 py-2" />
          <input placeholder="Proses melahirkan *" value={formRiwayat.proses_melahirkan} onChange={(e) => setFormRiwayat({...formRiwayat, proses_melahirkan: e.target.value})} className="border rounded-lg px-3 py-2" />
          <input placeholder="Penolong" value={formRiwayat.penolong_proses_melahirkan} onChange={(e) => setFormRiwayat({...formRiwayat, penolong_proses_melahirkan: e.target.value})} className="border rounded-lg px-3 py-2" />
          <input placeholder="Masalah" value={formRiwayat.masalah} onChange={(e) => setFormRiwayat({...formRiwayat, masalah: e.target.value})} className="border rounded-lg px-3 py-2 sm:col-span-2" />
        </div>
        <button type="button" onClick={handleAddRiwayat} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Plus size={16}/> Tambahkan Riwayat
        </button>
      </div>
    </div>

    {/* Tombol aksi */}
    <div className="flex justify-end gap-4 pt-4">
      <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
      <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
        <Save size={18}/> {saving ? "Menyimpan..." : "Simpan Evaluasi"}
      </button>
    </div>
  </form>
);

  if (loading) return <MainLayout><div className="p-6">Memuat...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl">
        {/* <Breadcrumb /> */}

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluasi Kesehatan Ibu</h1>
            {/* {kehamilan && !isActive && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <EyeOff size={14} /> Kehamilan sudah selesai (NON-AKTIF) – data hanya dapat dilihat.
              </p>
            )} */}
          </div>
        </div>

        {!isActive && (
          <div className="bg-gray-100 border-l-4 border-gray-500 rounded-lg p-3 mb-6 text-gray-700 text-sm flex items-center gap-2">
            <EyeOff size={16} /> Kehamilan ini sudah selesai (NON-AKTIF). Anda tidak dapat membuat, mengedit, atau menambahkan data. Hanya mode baca.
          </div>
        )}

        {!canEdit && isActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-blue-700 text-sm flex items-center gap-2">
            <Eye size={16} /> Anda dalam mode baca (Bidan). Data hanya dapat dilihat, tidak dapat diubah.
          </div>
        )}

        {isEditing ? <EvaluationForm /> : <EvaluationView />}
      </div>
    </MainLayout>
  );
}