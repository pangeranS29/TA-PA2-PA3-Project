import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const dummyIbu = [
  { id: 1, nama: "Ny. Sari", nik: "1275010101220001", tgl_lahir: "1990-05-15", usia: "34 th", jk: "P", posyandu: "Posyandu Mawar I", bb_awal: "55 kg", tb: "160 cm", imt: "21.5", status_kehamilan: "Aktif", ortu: "Suami: Ari Pratama" },
  { id: 2, nama: "Ny. Dewi", nik: "1275010101230002", tgl_lahir: "1992-03-10", usia: "32 th", jk: "P", posyandu: "Posyandu Mawar II", bb_awal: "62 kg", tb: "158 cm", imt: "24.8", status_kehamilan: "Aktif", ortu: "Suami: Budi Santoso" },
  { id: 3, nama: "Ny. Fitri", nik: "1275010101210003", tgl_lahir: "1988-06-20", usia: "36 th", jk: "P", posyandu: "Posyandu Melati I", bb_awal: "58 kg", tb: "162 cm", imt: "22.1", status_kehamilan: "Aktif", ortu: "Suami: Cahyo Wijaya" },
  { id: 4, nama: "Ny. Ani", nik: "1275010101230004", tgl_lahir: "1993-01-05", usia: "31 th", jk: "P", posyandu: "Posyandu Melati II", bb_awal: "60 kg", tb: "159 cm", imt: "23.7", status_kehamilan: "Aktif", ortu: "Suami: Dedi Setiawan" },
  { id: 5, nama: "Ny. Ratna", nik: "1275010101220005", tgl_lahir: "1991-09-12", usia: "33 th", jk: "P", posyandu: "Posyandu Mawar I", bb_awal: "57 kg", tb: "161 cm", imt: "21.9", status_kehamilan: "Aktif", ortu: "Suami: Eka Putra" },
  { id: 6, nama: "Ny. Linda", nik: "1275010101240006", tgl_lahir: "1994-02-18", usia: "30 th", jk: "P", posyandu: "Posyandu Mawar II", bb_awal: "59 kg", tb: "160 cm", imt: "23.0", status_kehamilan: "Aktif", ortu: "Suami: Fajar Riyanto" },
];

const AVATAR_COLORS = ["#14a89e","#f59e0b","#f43f5e","#818cf8","#10b981","#0ea5e9"];

const initials = (n) => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const getStatusClass = (s) => s==="Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";

/* ─── COMPONENT ───────────────────────────────────────────────────────────── */
export default function KelolaProfIlIbu() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterPosyandu, setFilterPosyandu] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const posyanduList = [...new Set(dummyIbu.map(a => a.posyandu))];

  const filtered = dummyIbu.filter(a => {
    const q = search.toLowerCase();
    return (
      (a.nama.toLowerCase().includes(q) || a.nik.includes(q)) &&
      (filterStatus === "Semua" || a.status_kehamilan === filterStatus) &&
      (!filterPosyandu || a.posyandu === filterPosyandu)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const openCreate = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (a) => { setEditData(a); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditData(null); };

  const statAktif = dummyIbu.filter(a => a.status_kehamilan === "Aktif").length;
  const total = dummyIbu.length;

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
            <h1 className="text-4xl font-bold text-gray-900">Kelola Profil Ibu</h1>
            <p className="text-gray-600 mt-1">Pantau data kehamilan dan kesehatan ibu di wilayah desa Anda.</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-gradient-to-r from-teal-500 to-teal-400 hover:shadow-lg text-white px-6 py-3 rounded-3xl font-semibold transition flex items-center gap-2"
          >
            ➕ Tambah Ibu
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">👩</div>
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Total Ibu</div>
            <div className="text-xs text-gray-500 mt-2">Terdaftar di Posyandu</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => navigate('/bidan/kehamilan')}>
            <div className="text-3xl mb-3">🤰</div>
            <div className="text-3xl font-bold text-gray-900">{statAktif}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Kehamilan Aktif</div>
            <div className="flex items-center gap-2 mt-3 text-teal-600 font-semibold text-xs">
              Lihat data →
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">📊</div>
            <div className="text-3xl font-bold text-gray-900">{posyanduList.length}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Posyandu Aktif</div>
            <div className="text-xs text-gray-500 mt-2">Melayani ibu hamil</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 gap-6">
          {/* MAIN TABLE */}
          <div>
            {/* TABLE CARD */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Daftar Profil Ibu Hamil</h2>
                <p className="text-sm text-gray-600">{filtered.length} data ditemukan</p>
              </div>

              {/* FILTER BAR */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  placeholder="Cari nama atau NIK..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-400 flex-1 min-w-48"
                />
                {["Semua","Aktif"].map(f => (
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
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Nama Ibu</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Usia / NIK</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Posyandu</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">BB / TB / IMT</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
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
                            <p className="text-xs text-gray-600">📅 {a.tgl_lahir}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{a.posyandu}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{a.bb_awal}</p>
                            <p className="text-xs text-gray-600">{a.tb} • IMT: {a.imt}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(a.status_kehamilan)}`}>
                              <span className="w-2 h-2 rounded-full bg-current"></span>
                              {a.status_kehamilan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/bidan/kehamilan?ibu_id=${a.id}`)}
                                className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 flex items-center justify-center transition"
                                title="Lihat Kehamilan"
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
                    Menampilkan {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} dari {filtered.length} ibu
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
          </div>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
              <div className="sticky top-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <h3 className="text-xl font-bold text-gray-900">{editData ? "Edit Profil Ibu" : "Tambah Ibu Baru"}</h3>
                <button onClick={closeModal} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Nama Lengkap</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.nama}
                      placeholder="Masukkan nama lengkap ibu"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">NIK</label>
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
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Berat Badan (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?parseFloat(editData.bb_awal):""}
                      placeholder="Contoh: 55"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?parseInt(editData.tb):""}
                      placeholder="Contoh: 160"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Status Kehamilan</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.status_kehamilan||""}
                    >
                      <option value="">-- Pilih Status --</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Nama Suami / Pendamping</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.ortu}
                      placeholder="Nama suami atau pendamping"
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
                  {editData ? "Simpan Perubahan" : "Tambah Ibu"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
