import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const dummyAnak = [
  { id: 1, nama: "Aisyah Putri", nik: "1275014501220001", tgl_lahir: "2022-01-15", usia: "2 th 3 bl", jk: "P", posyandu: "Posyandu Mawar I",   bb: "9.2 kg", tb: "78 cm", status_gizi: "Normal", imunisasi: "Lengkap",        ortu: "Ny. Sari" },
  { id: 2, nama: "Rizky Ardianto", nik: "1275014501230002", tgl_lahir: "2023-03-10", usia: "1 th 1 bl", jk: "L", posyandu: "Posyandu Mawar II",  bb: "7.1 kg", tb: "68 cm", status_gizi: "Kurang", imunisasi: "Belum Lengkap",  ortu: "Ny. Dewi" },
  { id: 3, nama: "Nayla Azzahra", nik: "1275014501210003", tgl_lahir: "2021-06-20", usia: "2 th 9 bl", jk: "P", posyandu: "Posyandu Melati I",  bb: "10.8 kg",tb: "85 cm", status_gizi: "Normal", imunisasi: "Lengkap",        ortu: "Ny. Fitri" },
  { id: 4, nama: "Budi Santoso",   nik: "1275014501230004", tgl_lahir: "2023-01-05", usia: "1 th 3 bl", jk: "L", posyandu: "Posyandu Melati II", bb: "5.8 kg", tb: "60 cm", status_gizi: "Buruk",  imunisasi: "Belum Lengkap",  ortu: "Ny. Ani" },
  { id: 5, nama: "Salwa Ramadhani",nik: "1275014501220005", tgl_lahir: "2022-09-12", usia: "1 th 7 bl", jk: "P", posyandu: "Posyandu Mawar I",   bb: "8.5 kg", tb: "74 cm", status_gizi: "Normal", imunisasi: "Lengkap",        ortu: "Ny. Ratna" },
  { id: 6, nama: "Daffa Pratama",  nik: "1275014501240006", tgl_lahir: "2024-02-18", usia: "2 bl",      jk: "L", posyandu: "Posyandu Mawar II",  bb: "4.3 kg", tb: "53 cm", status_gizi: "Normal", imunisasi: "Belum Lengkap",  ortu: "Ny. Linda" },
];

const ALERTS = [
  { id: 1, nama: "Budi Santoso (1 th 3 bl)",   desc: "Berat badan tidak naik 2 bulan berturut-turut. Rujuk ke puskesmas segera.", level: "red",   icon: "⚠️" },
  { id: 2, nama: "Rizky Ardianto (1 th 1 bl)", desc: "Imunisasi DPT-HB-Hib terlambat lebih dari 2 minggu dari jadwal.",           level: "amber", icon: "💉" },
  { id: 3, nama: "5 Balita",                   desc: "Jadwal timbang bulan ini belum dikonfirmasi hadir.",                          level: "sky",   icon: "⚖️" },
];

const JADWAL = [
  { tgl: "15", bln: "JUN", title: "Posyandu Mawar I",          time: "08.00 – 12.00 WIB" },
  { tgl: "16", bln: "JUN", title: "Posyandu Melati II",         time: "08.30 – 12.00 WIB" },
  { tgl: "20", bln: "JUN", title: "Kunjungan Rumah (3 Anak)",  time: "Dusun II & III" },
];

const AVATAR_COLORS = ["#14a89e","#f59e0b","#f43f5e","#818cf8","#10b981","#0ea5e9"];

const initials = (n) => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const getStatusClass = (s) => s==="Normal" ? "bg-green-100 text-green-700" : s==="Kurang" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";

/* ─── COMPONENT ───────────────────────────────────────────────────────────── */
export default function KelolaProfIlAnak() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterPosyandu, setFilterPosyandu] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const posyanduList = [...new Set(dummyAnak.map(a => a.posyandu))];

  const filtered = dummyAnak.filter(a => {
    const q = search.toLowerCase();
    return (
      (a.nama.toLowerCase().includes(q) || a.nik.includes(q)) &&
      (filterStatus === "Semua" || a.status_gizi === filterStatus) &&
      (!filterPosyandu || a.posyandu === filterPosyandu)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const openCreate = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (a) => { setEditData(a); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditData(null); };

  const statNormal = dummyAnak.filter(a => a.status_gizi === "Normal").length;
  const statKurang = dummyAnak.filter(a => a.status_gizi === "Kurang").length;
  const statBuruk = dummyAnak.filter(a => a.status_gizi === "Buruk").length;
  const statImunBelum = dummyAnak.filter(a => a.imunisasi !== "Lengkap").length;
  const total = dummyAnak.length;

  return (
    <MainLayout>
      <div className="p-6 max-w-full">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/bidan/dashboard")}
              className="text-teal-600 hover:text-teal-800 font-semibold mb-2 flex items-center gap-2"
            >
              ← Kembali ke Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Kelola Profil Anak</h1>
            <p className="text-gray-600 mt-1">Pantau tumbuh kembang dan data kesehatan balita di wilayah desa Anda.</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-gradient-to-r from-teal-500 to-teal-400 hover:shadow-lg text-white px-6 py-3 rounded-3xl font-semibold transition flex items-center gap-2"
          >
            ➕ Tambah Anak
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">👶</div>
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Total Balita</div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                {dummyAnak.filter(a=>a.jk==="P").length} Perempuan
              </span>
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{dummyAnak.filter(a=>a.jk==="L").length} Laki-laki</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => navigate('/bidan/imunisasi')}>
            <div className="text-3xl mb-3">💉</div>
            <div className="text-3xl font-bold text-gray-900">{total-statImunBelum}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Imunisasi Lengkap</div>
            <div className="flex items-center gap-2 mt-3 text-teal-600 font-semibold text-xs">
              Lihat detail →
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">📏</div>
            <div className="text-3xl font-bold text-gray-900">{statNormal}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Gizi Normal</div>
            <div className="text-xs text-gray-500 mt-2">Terpantau dengan baik</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">⚠️</div>
            <div className="text-3xl font-bold text-red-600">{statKurang + statBuruk}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Perlu Perhatian</div>
            <div className="text-xs text-gray-500 mt-2">Kurang: {statKurang} | Buruk: {statBuruk}</div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 gap-6">
          {/* MAIN TABLE */}
          <div>
            {/* TABLE CARD */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Daftar Profil Anak</h2>
                <p className="text-sm text-gray-600">{filtered.length} data ditemukan</p>
              </div>

              {/* FILTER BAR */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-2 items-center">
                {["Semua","Normal","Kurang","Buruk"].map(f => (
                  <button key={f} 
                    onClick={() => { setFilterStatus(f); setPage(1); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                      filterStatus === f
                        ? "bg-teal-500 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-teal-400 hover:text-teal-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <select 
                  value={filterPosyandu}
                  onChange={e => { setFilterPosyandu(e.target.value); setPage(1); }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-400 ml-auto"
                >
                  <option value="">Semua Posyandu</option>
                  {posyanduList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                {paginated.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="text-5xl mb-3 opacity-60">🔍</div>
                    <p className="text-lg font-semibold text-gray-700">Tidak ada data ditemukan</p>
                    <p className="text-gray-600 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Nama Anak</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Usia / JK</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Posyandu</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">BB / TB</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Status Gizi</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Imunisasi</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((a, i) => (
                        <tr key={a.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                style={{background: AVATAR_COLORS[i % AVATAR_COLORS.length]}}
                              >
                                {initials(a.nama)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{a.nama}</p>
                                <p className="text-xs text-gray-600">{a.nik}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{a.usia}</p>
                            <p className="text-xs text-gray-600">{a.jk==="P"?"👧 Perempuan":"👦 Laki-laki"}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{a.posyandu}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{a.bb}</p>
                            <p className="text-xs text-gray-600">{a.tb}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(a.status_gizi)}`}>
                              <span className="w-2 h-2 rounded-full bg-current"></span>
                              {a.status_gizi}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/bidan/imunisasi?anak=${a.id}`)}
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition hover:shadow-md ${
                                a.imunisasi==="Lengkap" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              }`}
                              title="Klik untuk lihat detail imunisasi"
                            >
                              {a.imunisasi}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                               <button
                                onClick={() => navigate(`/bidan/imunisasi?anak=${a.id}`)}
                                className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition"
                                title="Cek Imunisasi"
                              >
                                💉
                              </button>
                              <button
                                onClick={() => navigate(`/data-anak/dashboard/${a.id}`)}
                                className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 flex items-center justify-center transition"
                                title="Detail"
                              >
                                👁️
                              </button>
                             
                              <button
                                onClick={() => openEdit(a)}
                                className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 flex items-center justify-center transition"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                                title="Hapus"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* PAGINATION */}
              {filtered.length > PER_PAGE && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Menampilkan {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} dari {filtered.length} anak
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={()=>setPage(p=>Math.max(1,p-1))}
                      disabled={page===1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      ←
                    </button>
                    {Array.from({length:totalPages},(_,i)=>(
                      <button
                        key={i+1}
                        onClick={()=>setPage(i+1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                          page===i+1
                            ? "bg-teal-500 text-white"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {i+1}
                      </button>
                    ))}
                    <button
                      onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
                      disabled={page===totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* GIZI PROGRESS BARS */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Capaian Status Gizi</h2>
                <p className="text-sm text-gray-600">Distribusi status gizi balita bulan ini</p>
              </div>
              <div className="p-6 space-y-5">
                {[
                  {label:"Gizi Normal",        val: Math.round(statNormal/total*100),           color:"bg-green-500"},
                  {label:"Gizi Kurang",         val: Math.round(statKurang/total*100),           color:"bg-yellow-500"},
                  {label:"Gizi Buruk",          val: Math.round(statBuruk/total*100),            color:"bg-red-500"},
                  {label:"Imunisasi Lengkap",   val: Math.round((total-statImunBelum)/total*100),color:"bg-blue-500"},
                ].map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">{b.label}</span>
                      <span className={`text-sm font-bold ${b.color} text-white px-2 py-1 rounded`}>{b.val}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className={`${b.color} h-full rounded-full transition-all duration-300`} style={{width:`${b.val}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
              <div className="sticky top-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <h3 className="text-xl font-bold text-gray-900">{editData ? "Edit Profil Anak" : "Tambah Anak Baru"}</h3>
                <button onClick={closeModal} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Nama Lengkap</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.nama}
                      placeholder="Masukkan nama lengkap anak"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">NIK Anak</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.nik}
                      placeholder="16 digit NIK"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Tanggal Lahir</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.tgl_lahir}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Jenis Kelamin</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.jk||""}
                    >
                      <option value="">-- Pilih --</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Posyandu</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.posyandu||""}
                    >
                      <option value="">-- Pilih Posyandu --</option>
                      {posyanduList.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Berat Badan (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?parseFloat(editData.bb):""}
                      placeholder="Contoh: 8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?parseInt(editData.tb):""}
                      placeholder="Contoh: 75"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Status Gizi</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.status_gizi||""}
                    >
                      <option value="">-- Pilih Status --</option>
                      <option value="Normal">Normal</option>
                      <option value="Kurang">Kurang</option>
                      <option value="Buruk">Buruk</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Nama Orang Tua / Wali</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.ortu}
                      placeholder="Nama ibu / ayah / wali"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-3xl font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-3xl font-semibold hover:shadow-lg transition"
                >
                  {editData ? "Simpan Perubahan" : "Tambah Anak"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
