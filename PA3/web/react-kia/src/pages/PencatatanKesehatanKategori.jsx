import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import api from "../services/api";
import { 
  Plus, Search, Edit, Trash2, Eye, ArrowLeft,
  User, AlertCircle, CheckCircle, MapPin, Calendar as CalIcon,
  Heart, Droplet, Thermometer, Activity, RefreshCw
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
  const [modal, setModal] = useState(null); // "history" atau "checkup"
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State untuk riwayat
  const [allHistories, setAllHistories] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // State untuk form pemeriksaan
  const [checkupForm, setCheckupForm] = useState({});

  // Fetch data dari backend
  const fetchDataFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/tenaga-kesehatan/pencatatan/${kategori}`);
      console.log("API Response:", response.data);
      
      let dataPenduduk = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        dataPenduduk = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        dataPenduduk = response.data;
      } else {
        dataPenduduk = [];
      }

      const formattedPatients = dataPenduduk.map(p => ({
        id: p.id_kependudukan,
        nama_lengkap: p.nama_lengkap,
        nik: p.nik,
        usia: p.umur_sekarang,
        dusun: p.dusun,
        alamat: p.dusun,
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

      setPatients(formattedPatients);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message || "Gagal memuat data");
      setPatients([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch semua riwayat untuk penduduk tertentu
  const fetchAllHistories = async (patientId) => {
    setLoadingHistory(true);
    try {
      const response = await api.get(`/tenaga-kesehatan/pemeriksaan-riwayat`, {
        params: { kategori, penduduk_id: patientId }
      });
      // Response: { kategori, penduduk_id, data: [...] }
      return response.data.data || [];
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
      alert("Gagal memuat riwayat pemeriksaan");
      return [];
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleShowHistory = async (patient) => {
    setSelectedPatient(patient);
    const histories = await fetchAllHistories(patient.id);
    setAllHistories(histories);
    setModal("history");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDataFromAPI();
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, [kategori]);

  const filteredPatients = patients.filter(p =>
    p.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    (p.nik || "").includes(search)
  );

  const getHealthStatus = (patient) => {
    const risiko = patient.kategori_risiko;
    if (risiko === "Normal") return { text: "Normal", color: "bg-green-100 text-green-800", icon: CheckCircle };
    if (risiko === "Sedang") return { text: "Perlu Perhatian", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle };
    if (risiko === "Tinggi") return { text: "Berisiko Tinggi", color: "bg-red-100 text-red-800", icon: AlertCircle };
    return { text: "Belum Diperiksa", color: "bg-gray-100 text-gray-600", icon: AlertCircle };
  };

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

  // ----- Pemeriksaan -----
  const openCheckupModal = (patient) => {
    setSelectedPatient(patient);
    const today = new Date().toISOString().split('T')[0];
    if (kategori === 'anak') {
      setCheckupForm({
        tanggal_pemeriksaan: today,
        berat_badan: '',
        tinggi_badan: '',
        status_gizi: '',
        kategori_risiko: '',
        status_pemantauan: '',
        riwayat_penyakit: '',
        catatan_khusus: ''
      });
    } else if (kategori === 'remaja') {
      setCheckupForm({
        tanggal_pemeriksaan: today,
        berat_badan: '',
        tinggi_badan: '',
        tekanan_darah: '',
        kategori_risiko: '',
        status_pemantauan: '',
        riwayat_penyakit: '',
        catatan_khusus: ''
      });
    } else if (kategori === 'dewasa') {
      setCheckupForm({
        tanggal_pemeriksaan: today,
        berat_badan: '',
        tinggi_badan: '',
        tekanan_darah: '',
        gula_darah: '',
        kolesterol: '',
        kategori_risiko: '',
        status_pemantauan: '',
        riwayat_penyakit: '',
        penyakit_kronis: '',
        catatan_khusus: ''
      });
    } else if (kategori === 'lansia') {
      setCheckupForm({
        tanggal_pemeriksaan: today,
        berat_badan: '',
        tinggi_badan: '',
        tekanan_darah: '',
        gula_darah: '',
        kategori_risiko: '',
        status_pemantauan: '',
        penyakit_kronis: '',
        status_kemandirian: '',
        riwayat_jatuh: false,
        catatan_khusus: ''
      });
    }
    setModal("checkup");
  };

  const handleSaveCheckup = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setSubmitting(true);
    try {
      const payload = {
        penduduk_id: selectedPatient.id,
        ...checkupForm
      };
      if (payload.berat_badan) payload.berat_badan = parseFloat(payload.berat_badan);
      if (payload.tinggi_badan) payload.tinggi_badan = parseFloat(payload.tinggi_badan);
      if (payload.gula_darah) payload.gula_darah = parseFloat(payload.gula_darah);
      if (payload.kolesterol) payload.kolesterol = parseFloat(payload.kolesterol);
      if (payload.riwayat_jatuh !== undefined) payload.riwayat_jatuh = Boolean(payload.riwayat_jatuh);
      
      let endpoint = '';
      if (kategori === 'anak') endpoint = '/tenaga-kesehatan/pemeriksaan-anak';
      else if (kategori === 'remaja') endpoint = '/tenaga-kesehatan/pemeriksaan-remaja';
      else if (kategori === 'dewasa') endpoint = '/tenaga-kesehatan/pemeriksaan-dewasa';
      else if (kategori === 'lansia') endpoint = '/tenaga-kesehatan/pemeriksaan-lansia';
      
      await api.post(endpoint, payload);
      alert('Pemeriksaan berhasil disimpan!');
      setModal(null);
      fetchDataFromAPI();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Gagal menyimpan pemeriksaan');
    } finally {
      setSubmitting(false);
    }
  };

  // Render form dinamis berdasarkan kategori (sama seperti sebelumnya)
  const renderCheckupForm = () => {
    const commonField = (label, name, type = "text", required = false) => (
      <div key={name}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label>
        <input
          type={type}
          value={checkupForm[name] || ''}
          onChange={(e) => setCheckupForm({...checkupForm, [name]: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required={required}
        />
      </div>
    );

    const commonNumberField = (label, name, step = "0.1") => (
      <div key={name}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type="number"
          step={step}
          value={checkupForm[name] || ''}
          onChange={(e) => setCheckupForm({...checkupForm, [name]: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );

    const textareaField = (label, name, rows = 2) => (
      <div key={name}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea rows={rows} value={checkupForm[name] || ''} onChange={e => setCheckupForm({...checkupForm, [name]: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
      </div>
    );

    if (kategori === 'anak') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            {commonNumberField("Berat Badan (kg)", "berat_badan")}
            {commonNumberField("Tinggi Badan (cm)", "tinggi_badan")}
          </div>
          {commonField("Status Gizi", "status_gizi")}
          {commonField("Kategori Risiko", "kategori_risiko")}
          {commonField("Status Pemantauan", "status_pemantauan")}
          {textareaField("Riwayat Penyakit", "riwayat_penyakit")}
          {textareaField("Catatan Khusus", "catatan_khusus")}
        </>
      );
    }
    else if (kategori === 'remaja') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            {commonNumberField("Berat Badan (kg)", "berat_badan")}
            {commonNumberField("Tinggi Badan (cm)", "tinggi_badan")}
          </div>
          {commonField("Tekanan Darah", "tekanan_darah")}
          {commonField("Kategori Risiko", "kategori_risiko")}
          {commonField("Status Pemantauan", "status_pemantauan")}
          {textareaField("Riwayat Penyakit", "riwayat_penyakit")}
          {textareaField("Catatan Khusus", "catatan_khusus")}
        </>
      );
    }
    else if (kategori === 'dewasa') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            {commonNumberField("Berat Badan (kg)", "berat_badan")}
            {commonNumberField("Tinggi Badan (cm)", "tinggi_badan")}
          </div>
          {commonField("Tekanan Darah", "tekanan_darah")}
          {commonNumberField("Gula Darah (mg/dL)", "gula_darah")}
          {commonNumberField("Kolesterol (mg/dL)", "kolesterol")}
          {commonField("Kategori Risiko", "kategori_risiko")}
          {commonField("Status Pemantauan", "status_pemantauan")}
          {textareaField("Riwayat Penyakit", "riwayat_penyakit")}
          {commonField("Penyakit Kronis", "penyakit_kronis")}
          {textareaField("Catatan Khusus", "catatan_khusus")}
        </>
      );
    }
    else if (kategori === 'lansia') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            {commonNumberField("Berat Badan (kg)", "berat_badan")}
            {commonNumberField("Tinggi Badan (cm)", "tinggi_badan")}
          </div>
          {commonField("Tekanan Darah", "tekanan_darah")}
          {commonNumberField("Gula Darah (mg/dL)", "gula_darah")}
          {commonField("Kategori Risiko", "kategori_risiko")}
          {commonField("Status Pemantauan", "status_pemantauan")}
          {commonField("Penyakit Kronis", "penyakit_kronis")}
          {commonField("Status Kemandirian", "status_kemandirian")}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checkupForm.riwayat_jatuh || false}
              onChange={(e) => setCheckupForm({...checkupForm, riwayat_jatuh: e.target.checked})}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium text-gray-700">Riwayat Jatuh</label>
          </div>
          {textareaField("Catatan Khusus", "catatan_khusus")}
        </>
      );
    }
    return null;
  };

  const handleNotImplemented = () => {
    alert("Fitur ini belum terintegrasi dengan backend.");
  };

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
            <div className="flex gap-2">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600"
              >
                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              {/* Tombol Tambah Pasien dikomentari karena belum ada */}
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau NIK..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
            />
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

          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data {cat.name}...</p>
            </div>
          ) : (
            <>
              {filteredPatients.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <User size={48} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">Belum ada data pasien untuk kategori {cat.name}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => {
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
                          {patient.nik && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                              <span className="font-medium">NIK:</span> {patient.nik}
                            </div>
                          )}
                          
                          <div className="mb-3 p-2 rounded-lg text-center text-sm font-medium"
                            style={{
                              backgroundColor: patient.kategori_risiko === "Tinggi" ? "#fee2e2" : 
                                              patient.kategori_risiko === "Sedang" ? "#fef3c7" : 
                                              patient.kategori_risiko === "Normal" ? "#dcfce7" : "#f3f4f6",
                              color: patient.kategori_risiko === "Tinggi" ? "#dc2626" : 
                                     patient.kategori_risiko === "Sedang" ? "#d97706" : 
                                     patient.kategori_risiko === "Normal" ? "#16a34a" : "#6b7280"
                            }}
                          >
                            {patient.kategori_risiko === "Tinggi" && "⚠️ "}
                            {patient.kategori_risiko === "Sedang" && "⚡ "}
                            {patient.kategori_risiko === "Normal" && "✅ "}
                            Status Risiko: {patient.kategori_risiko || "Belum Diperiksa"}
                          </div>

                          {latest ? (
                            <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4">
                              <div className="flex items-center gap-1 text-gray-500 mb-2">
                                <CalIcon size={12} />
                                <span>Pemeriksaan Terakhir: {new Date(latest.tanggal).toLocaleDateString("id-ID")}</span>
                              </div>
                              <div className="flex gap-3 flex-wrap">
                                {latest.tekanan_darah && <div className="flex items-center gap-1"><Heart size={12} className="text-red-500" /> {latest.tekanan_darah}</div>}
                                {latest.gula_darah && <div className="flex items-center gap-1"><Droplet size={12} className="text-blue-500" /> {latest.gula_darah} mg/dL</div>}
                                {latest.suhu && <div className="flex items-center gap-1"><Thermometer size={12} className="text-orange-500" /> {latest.suhu}°C</div>}
                                {latest.berat_badan && latest.tinggi_badan && <div className="flex items-center gap-1"><Activity size={12} className="text-green-600" /> BB: {latest.berat_badan} kg / TB: {latest.tinggi_badan} cm</div>}
                                {latest.imt && <div>📊 IMT: {latest.imt.toFixed(1)}</div>}
                              </div>
                              {latest.riwayat_penyakit && <div className="mt-2 text-gray-500 text-xs"><span className="font-medium">Riwayat:</span> {latest.riwayat_penyakit.substring(0, 50)}...</div>}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 p-3 rounded-lg text-center text-sm text-yellow-700 mb-4">
                              <AlertCircle size={14} className="inline mr-1" /> Belum ada pemeriksaan
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleShowHistory(patient)}
                              className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg text-sm hover:bg-blue-200 flex items-center justify-center gap-1"
                            >
                              <Eye size={14} /> Riwayat
                            </button>
                            {dapatDitambahkan ? (
                              <button 
                                onClick={() => openCheckupModal(patient)}
                                className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm hover:bg-green-200 flex items-center justify-center gap-1"
                              >
                                <Plus size={14} /> Periksa
                              </button>
                            ) : (
                              <button disabled className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm flex items-center justify-center gap-1 cursor-not-allowed" title="Umur sudah melebihi batas kategori">
                                <Plus size={14} /> Tidak Aktif
                              </button>
                            )}
                            {/* <button onClick={handleNotImplemented} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                            <button onClick={handleNotImplemented} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Modal Riwayat Pemeriksaan (semua riwayat) */}
          {modal === "history" && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Riwayat Pemeriksaan</h2>
                    <p className="text-gray-500 text-sm">{selectedPatient.nama_lengkap} • {cat.name}</p>
                  </div>
                  <button onClick={() => setModal(null)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button>
                </div>
                <div className="p-5">
                  {loadingHistory ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Memuat riwayat...</p>
                    </div>
                  ) : allHistories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity size={48} className="mx-auto mb-3 text-gray-400" />
                      <p>Belum ada riwayat pemeriksaan untuk {selectedPatient.nama_lengkap}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allHistories.map((exam, idx) => (
                        <div key={exam.id || idx} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                          <div className="font-medium text-gray-900">
                            {new Date(exam.tanggal_pemeriksaan).toLocaleDateString("id-ID", { 
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            {exam.tekanan_darah && <div>💓 TD: {exam.tekanan_darah}</div>}
                            {exam.gula_darah && <div>🍬 GDS: {exam.gula_darah} mg/dL</div>}
                            {exam.kolesterol && <div>🩸 Kolesterol: {exam.kolesterol} mg/dL</div>}
                            {exam.suhu && <div>🌡️ Suhu: {exam.suhu}°C</div>}
                            {exam.berat_badan && exam.tinggi_badan && 
                              <div>⚖️ BB: {exam.berat_badan} kg / TB: {exam.tinggi_badan} cm</div>}
                            {exam.imt && <div>📊 IMT: {typeof exam.imt === 'number' ? exam.imt.toFixed(1) : exam.imt}</div>}
                            {exam.status_gizi && <div>🍽️ Status Gizi: {exam.status_gizi}</div>}
                            {exam.kategori_risiko && <div>⚠️ Risiko: {exam.kategori_risiko}</div>}
                            {exam.status_pemantauan && <div>📋 Pemantauan: {exam.status_pemantauan}</div>}
                          </div>
                          {exam.riwayat_penyakit && (
                            <div className="text-sm mt-2">
                              <span className="font-medium">Riwayat Penyakit:</span> {exam.riwayat_penyakit}
                            </div>
                          )}
                          {exam.catatan_khusus && (
                            <div className="text-sm mt-1">
                              <span className="font-medium">Catatan:</span> {exam.catatan_khusus}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Pemeriksaan (tetap sama) */}
          {modal === "checkup" && selectedPatient && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Pemeriksaan {cat.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedPatient.nama_lengkap}</p>
                  </div>
                  <button onClick={() => setModal(null)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSaveCheckup} className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pemeriksaan *</label>
                    <input type="date" value={checkupForm.tanggal_pemeriksaan || ''} onChange={e => setCheckupForm({...checkupForm, tanggal_pemeriksaan: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" required />
                  </div>
                  {renderCheckupForm()}
                  <div className="flex gap-3 pt-3">
                    <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      {submitting ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}