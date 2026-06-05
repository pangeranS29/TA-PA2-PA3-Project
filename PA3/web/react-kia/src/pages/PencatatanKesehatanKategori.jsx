import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import api from "../services/api";
import { getActiveForm, savePemeriksaan, getRiwayatPemeriksaan } from "../services/pemeriksaan";
import { 
  Plus, Search, Eye, ArrowLeft,
  User, AlertCircle, CheckCircle,
  Heart, Droplet, Thermometer, Activity, RefreshCw, Loader2
} from 'lucide-react';

const categories = {
  anak: { name: "Anak", emoji: "👶", color: "blue", range: "6-12 tahun", bgGradient: "from-blue-500 to-blue-600" },
  remaja: { name: "Remaja", emoji: "🧒", color: "green", range: "13-18 tahun", bgGradient: "from-green-500 to-green-600" },
  dewasa: { name: "Dewasa", emoji: "👨", color: "purple", range: "19-59 tahun", bgGradient: "from-purple-500 to-purple-600" },
  lansia: { name: "Lansia", emoji: "👴", color: "orange", range: "≥60 tahun", bgGradient: "from-orange-500 to-orange-600" }
};

export default function PencatatanKesehatanKategori() {
  const { kategori = "anak" } = useParams();
  const navigate = useNavigate();
  const cat = categories[kategori] || categories.anak;

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [modal, setModal] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [allHistories, setAllHistories] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [dynamicFormData, setDynamicFormData] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [activeFormVersion, setActiveFormVersion] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // State untuk modal hasil pemeriksaan
  const [resultModal, setResultModal] = useState(false);
  const [resultData, setResultData] = useState({ kategori_risiko: "", rekomendasi: "" });

  // Fetch daftar pasien dari backend
  const fetchDataFromAPI = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tenaga-kesehatan/pencatatan/${kategori}`);
      let dataPenduduk = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        dataPenduduk = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        dataPenduduk = response.data;
      }
      const formatted = dataPenduduk.map(p => ({
        id: p.id_kependudukan,
        nama_lengkap: p.nama_lengkap,
        nik: p.nik,
        usia: p.umur_sekarang,
        dusun: p.dusun,
        kategori_risiko: p.pemeriksaan_terakhir?.kategori_risiko || "Belum Diperiksa",
        dapat_ditambahkan: p.dapat_ditambahkan,
        pemeriksaan_terakhir: p.pemeriksaan_terakhir ? {
          tanggal: p.pemeriksaan_terakhir.tanggal_pemeriksaan,
          tekanan_darah: p.pemeriksaan_terakhir.tekanan_darah,
          gula_darah: p.pemeriksaan_terakhir.gula_darah,
          suhu: p.pemeriksaan_terakhir.suhu,
          berat_badan: p.pemeriksaan_terakhir.berat_badan,
          tinggi_badan: p.pemeriksaan_terakhir.tinggi_badan,
          imt: p.pemeriksaan_terakhir.imt,
          status_gizi: p.pemeriksaan_terakhir.status_gizi,
          kategori_risiko: p.pemeriksaan_terakhir.kategori_risiko,
          status_pemantauan: p.pemeriksaan_terakhir.status_pemantauan,
          riwayat_penyakit: p.pemeriksaan_terakhir.riwayat_penyakit,
          catatan_khusus: p.pemeriksaan_terakhir.catatan_khusus
        } : null
      }));
      setPatients(formatted);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch riwayat pemeriksaan
  const fetchHistories = async (patientId) => {
    setLoadingHistory(true);
    try {
      const response = await getRiwayatPemeriksaan(patientId, kategori);
      return response || [];
    } catch (err) {
      console.error(err);
      alert("Gagal memuat riwayat pemeriksaan");
      return [];
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleShowHistory = async (patient) => {
    setSelectedPatient(patient);
    const histories = await fetchHistories(patient.id);
    setAllHistories(histories);
    setModal("history");
  };

  // Buka modal pemeriksaan dengan form dinamis
  const openCheckupModal = async (patient) => {
    setSelectedPatient(patient);
    setLoadingForm(true);
    try {
      const activeForm = await getActiveForm(kategori);
      setActiveFormVersion(activeForm.versi);
      const questions = activeForm.pertanyaan || [];
      setDynamicQuestions(questions);
      const initial = {};
      questions.forEach(q => {
        if (q.tipe === "boolean") {
          initial[q.key] = undefined;
        } else if (q.tipe === "angka") {
          initial[q.key] = undefined;
        } else {
          initial[q.key] = "";
        }
      });
      setDynamicFormData(initial);
      setModal("checkup");
    } catch (err) {
      console.error(err);
      alert("Gagal memuat form pemeriksaan. Pastikan superadmin sudah mengaktifkan versi form untuk kategori ini.");
    } finally {
      setLoadingForm(false);
    }
  };

  // Handler perubahan nilai dengan konversi tipe
  const handleDynamicChange = (key, value, tipe) => {
    let finalValue = value;
    if (tipe === "angka") {
      finalValue = value === "" ? undefined : Number(value);
    } else if (tipe === "boolean") {
      finalValue = value;
    }
    setDynamicFormData(prev => ({ ...prev, [key]: finalValue }));
  };

  // Validasi semua field wajib
  const isAllFieldsFilled = () => {
    for (let q of dynamicQuestions) {
      if (q.wajib) {
        const val = dynamicFormData[q.key];
        if (val === undefined || val === null || val === "") return false;
        if (q.tipe === "boolean" && typeof val !== "boolean") return false;
        if (q.tipe === "angka" && isNaN(val)) return false;
      }
    }
    return true;
  };

  // Simpan pemeriksaan
  const handleSaveDynamicCheckup = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    if (!isAllFieldsFilled()) {
      alert("Harap isi SEMUA pertanyaan yang bertanda * sebelum menyimpan.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        penduduk_id: selectedPatient.id,
        kelompok: kategori,
        tanggal: new Date().toISOString().split('T')[0],
        data: dynamicFormData
      };
      const response = await savePemeriksaan(payload);
      // Simpan hasil dan tampilkan modal
      setResultData({
        kategori_risiko: response.kategori_risiko || "Normal",
        rekomendasi: response.rekomendasi || "Tidak ada rekomendasi"
      });
      setResultModal(true);
      setModal(null); // tutup modal pemeriksaan
      fetchDataFromAPI(); // refresh daftar pasien
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal menyimpan pemeriksaan");
    } finally {
      setSubmitting(false);
    }
  };

  // Render input field berdasarkan tipe
  const renderDynamicField = (q) => {
    const value = dynamicFormData[q.key];
    switch (q.tipe) {
      case "angka":
        return (
          <input
            type="number"
            step="any"
            value={value === undefined ? "" : value}
            onChange={(e) => handleDynamicChange(q.key, e.target.value, q.tipe)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required={q.wajib}
          />
        );
      case "teks":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleDynamicChange(q.key, e.target.value, q.tipe)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required={q.wajib}
          />
        );
      case "boolean":
        return (
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name={q.key}
                checked={value === true}
                onChange={() => handleDynamicChange(q.key, true, q.tipe)}
                className="mr-1"
                required={q.wajib}
              /> Ya
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name={q.key}
                checked={value === false}
                onChange={() => handleDynamicChange(q.key, false, q.tipe)}
                className="mr-1"
                required={q.wajib}
              /> Tidak
            </label>
          </div>
        );
      case "pilihan":
        let options = q.opsi || [];
        if (options.length > 0 && typeof options[0] === 'object') {
          options = options.map(opt => opt.label);
        }
        return (
          <select
            value={value || ""}
            onChange={(e) => handleDynamicChange(q.key, e.target.value, q.tipe)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required={q.wajib}
          >
            <option value="">Pilih...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case "tanggal":
        return (
          <input
            type="date"
            value={value || ""}
            onChange={(e) => handleDynamicChange(q.key, e.target.value, q.tipe)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required={q.wajib}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleDynamicChange(q.key, e.target.value, q.tipe)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required={q.wajib}
          />
        );
    }
  };

  // Filter pasien berdasarkan search
  const filteredPatients = patients.filter(p =>
    p.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    (p.nik || "").includes(search)
  );

  // Helper status kesehatan (sesuai dengan kategori risiko dari backend: Tinggi, Sedang, Normal)
  const getHealthStatus = (patient) => {
    const risiko = patient.kategori_risiko;
    if (risiko === "Normal") return { text: "Normal", color: "bg-green-100 text-green-800", icon: CheckCircle };
    if (risiko === "Sedang") return { text: "Risiko Sedang", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle };
    if (risiko === "Tinggi") return { text: "Risiko Tinggi", color: "bg-red-100 text-red-800", icon: AlertCircle };
    return { text: "Belum Diperiksa", color: "bg-gray-100 text-gray-600", icon: AlertCircle };
  };

  // Statistik risiko
  const getStatsByRisiko = () => {
    const normal = patients.filter(p => p.kategori_risiko === "Normal").length;
    const sedang = patients.filter(p => p.kategori_risiko === "Sedang").length;
    const tinggi = patients.filter(p => p.kategori_risiko === "Tinggi").length;
    const belum = patients.filter(p => !p.kategori_risiko || p.kategori_risiko === "Belum Diperiksa").length;
    return { normal, sedang, tinggi, belum, total: patients.length };
  };
  const stats = getStatsByRisiko();

  const getColorClass = (color, type) => {
    const colors = {
      blue: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-200", light: "bg-blue-50" },
      green: { bg: "bg-green-600", text: "text-green-600", border: "border-green-200", light: "bg-green-50" },
      purple: { bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-200", light: "bg-purple-50" },
      orange: { bg: "bg-orange-600", text: "text-orange-600", border: "border-orange-200", light: "bg-orange-50" }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, [kategori]);

  if (loading) return <MainLayout><div className="p-6 text-center">Memuat data...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-200 rounded-lg">
                <ArrowLeft size={20} />
              </button>
              <div className={`p-3 rounded-xl ${getColorClass(cat.color, "light")}`}>
                <span className="text-2xl">{cat.emoji}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Daftar {cat.name}</h1>
                <p className="text-gray-500 text-sm">Rentang usia: {cat.range}</p>
              </div>
            </div>
            <button onClick={() => { setRefreshing(true); fetchDataFromAPI(); }} disabled={refreshing} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600">
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Cari nama atau NIK..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Pasien</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-2xl font-bold text-green-600">{stats.normal}</p>
              <p className="text-sm text-gray-500">Risiko Normal</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <p className="text-2xl font-bold text-yellow-600">{stats.sedang}</p>
              <p className="text-sm text-gray-500">Risiko Sedang</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-red-500">
              <p className="text-2xl font-bold text-red-600">{stats.tinggi}</p>
              <p className="text-sm text-gray-500">Risiko Tinggi</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
              <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
              <button onClick={fetchDataFromAPI} className="mt-2 text-red-600 underline">Coba lagi</button>
            </div>
          )}

          {/* Daftar Pasien */}
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <User size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">Belum ada data pasien untuk kategori {cat.name}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map(patient => {
                const status = getHealthStatus(patient);
                const StatusIcon = status.icon;
                const latest = patient.pemeriksaan_terakhir;
                const dapatDitambahkan = patient.dapat_ditambahkan;
                return (
                  <div key={patient.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className={`bg-gradient-to-r ${cat.bgGradient} p-4 text-white`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{patient.nama_lengkap}</h3>
                          <p className="text-sm opacity-90">{patient.usia} tahun</p>
                          {patient.dusun && <p className="text-xs opacity-75 mt-1">📍 {patient.dusun}</p>}
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color} bg-white`}>
                          <StatusIcon size={12} /> {status.text}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      {patient.nik && <div className="flex items-center gap-1 text-sm text-gray-600 mb-1"><span className="font-medium">NIK:</span> {patient.nik}</div>}
                      <div className="mb-3 p-2 rounded-lg text-center text-sm font-medium"
                        style={{
                          backgroundColor: patient.kategori_risiko === "Tinggi" ? "#fee2e2" :
                                          patient.kategori_risiko === "Sedang" ? "#fef3c7" :
                                          patient.kategori_risiko === "Normal" ? "#dcfce7" : "#f3f4f6",
                          color: patient.kategori_risiko === "Tinggi" ? "#dc2626" :
                                 patient.kategori_risiko === "Sedang" ? "#d97706" :
                                 patient.kategori_risiko === "Normal" ? "#16a34a" : "#6b7280"
                        }}>
                        {patient.kategori_risiko === "Tinggi" && "⚠️ "}
                        {patient.kategori_risiko === "Sedang" && "⚡ "}
                        {patient.kategori_risiko === "Normal" && "✅ "}
                        Status Risiko: {patient.kategori_risiko || "Belum Diperiksa"}
                      </div>
                      {latest ? (
                        <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4">
                          <div className="flex items-center gap-1 text-gray-500 mb-2">
                            📅 Pemeriksaan Terakhir: {new Date(latest.tanggal).toLocaleDateString("id-ID")}
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            {latest.tekanan_darah && <div><Heart size={12} className="inline text-red-500" /> {latest.tekanan_darah}</div>}
                            {latest.gula_darah && <div><Droplet size={12} className="inline text-blue-500" /> {latest.gula_darah} mg/dL</div>}
                            {latest.suhu && <div><Thermometer size={12} className="inline text-orange-500" /> {latest.suhu}°C</div>}
                            {latest.berat_badan && latest.tinggi_badan && <div><Activity size={12} className="inline text-green-600" /> BB: {latest.berat_badan} kg / TB: {latest.tinggi_badan} cm</div>}
                            {latest.imt && <div>📊 IMT: {latest.imt.toFixed(1)}</div>}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 p-3 rounded-lg text-center text-sm text-yellow-700 mb-4">
                          <AlertCircle size={14} className="inline mr-1" /> Belum ada pemeriksaan
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => handleShowHistory(patient)} className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg text-sm hover:bg-blue-200 flex items-center justify-center gap-1">
                          <Eye size={14} /> Riwayat
                        </button>
                        {dapatDitambahkan ? (
                          <button onClick={() => openCheckupModal(patient)} className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm hover:bg-green-200 flex items-center justify-center gap-1">
                            <Plus size={14} /> Periksa
                          </button>
                        ) : (
                          <button disabled className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm cursor-not-allowed">
                            <Plus size={14} /> Tidak Aktif
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal Riwayat */}
          {modal === "history" && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                  <div><h2 className="text-xl font-bold">Riwayat Pemeriksaan</h2><p className="text-gray-500 text-sm">{selectedPatient.nama_lengkap} • {cat.name}</p></div>
                  <button onClick={() => setModal(null)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button>
                </div>
                <div className="p-5">
                  {loadingHistory ? (
                    <div className="text-center py-8"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /><p className="mt-2">Memuat riwayat...</p></div>
                  ) : allHistories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Belum ada riwayat pemeriksaan</div>
                  ) : (
                    <div className="space-y-4">
                      {allHistories.map((exam, idx) => (
                        <div key={exam.id || idx} className="border rounded-lg p-3 hover:bg-gray-50">
                          <div className="font-medium">
                            {new Date(exam.tanggal_pemeriksaan).toLocaleDateString("id-ID", {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            {exam.tekanan_darah && <div>💓 TD: {exam.tekanan_darah}</div>}
                            {exam.gula_darah && <div>🍬 GDS: {exam.gula_darah} mg/dL</div>}
                            {exam.kolesterol && <div>🩸 Kolesterol: {exam.kolesterol} mg/dL</div>}
                            {exam.berat_badan && exam.tinggi_badan && <div>⚖️ BB: {exam.berat_badan} kg / TB: {exam.tinggi_badan} cm</div>}
                            {exam.imt && <div>📊 IMT: {typeof exam.imt === 'number' ? exam.imt.toFixed(1) : exam.imt}</div>}
                            {exam.kategori_risiko && <div>⚠️ Risiko: {exam.kategori_risiko}</div>}
                            {exam.rekomendasi && <div>💡 Rekomendasi: {exam.rekomendasi}</div>}
                          </div>
                          {exam.riwayat_penyakit && <div className="text-sm mt-2"><span className="font-medium">Riwayat:</span> {exam.riwayat_penyakit}</div>}
                          {exam.catatan_khusus && <div className="text-sm mt-1"><span className="font-medium">Catatan:</span> {exam.catatan_khusus}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Pemeriksaan Dinamis */}
          {modal === "checkup" && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Pemeriksaan {cat.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedPatient.nama_lengkap}</p>
                    {activeFormVersion && <p className="text-xs text-gray-400">Menggunakan form: {activeFormVersion.nama} (Tahun {activeFormVersion.tahun})</p>}
                  </div>
                  <button onClick={() => setModal(null)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button>
                </div>
                {loadingForm ? (
                  <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /><p className="mt-2">Memuat form...</p></div>
                ) : (
                  <form onSubmit={handleSaveDynamicCheckup} className="p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pemeriksaan *</label>
                      <input type="date" value={new Date().toISOString().split('T')[0]} className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100" disabled required />
                    </div>
                    {dynamicQuestions.map(q => (
                      <div key={q.id} className="flex flex-col gap-1">
                        <label className="font-medium text-gray-800">
                          {q.label} {q.satuan && `(${q.satuan})`} {q.wajib && <span className="text-red-500">*</span>}
                        </label>
                        {renderDynamicField(q)}
                      </div>
                    ))}
                    <div className="flex gap-3 pt-3">
                      <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                        {submitting ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
                      </button>
                      <button type="button" onClick={() => setModal(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Modal Hasil Pemeriksaan (Tingkat Risiko & Rekomendasi) */}
          {resultModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl
                    ${resultData.kategori_risiko === "Tinggi" ? "bg-red-100 text-red-600" :
                      resultData.kategori_risiko === "Sedang" ? "bg-yellow-100 text-yellow-600" :
                      resultData.kategori_risiko === "Normal" ? "bg-green-100 text-green-600" :
                      "bg-gray-100 text-gray-600"}`}>
                    {resultData.kategori_risiko === "Tinggi" ? "⚠️" :
                     resultData.kategori_risiko === "Sedang" ? "⚡" :
                     resultData.kategori_risiko === "Normal" ? "✅" : "ℹ️"}
                  </div>
                  <h3 className="text-xl font-bold mt-4">Pemeriksaan Selesai</h3>
                  <div className="mt-4 p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600">Tingkat Risiko</p>
                    <p className={`text-2xl font-bold
                      ${resultData.kategori_risiko === "Tinggi" ? "text-red-600" :
                        resultData.kategori_risiko === "Sedang" ? "text-yellow-600" :
                        resultData.kategori_risiko === "Normal" ? "text-green-600" :
                        "text-gray-600"}`}>
                      {resultData.kategori_risiko}
                    </p>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-blue-50">
                    <p className="text-sm text-gray-600">Rekomendasi</p>
                    <p className="text-md font-medium text-blue-800">{resultData.rekomendasi}</p>
                  </div>
                  <button
                    onClick={() => setResultModal(false)}
                    className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}