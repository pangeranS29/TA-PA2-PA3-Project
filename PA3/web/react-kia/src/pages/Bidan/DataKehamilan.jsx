import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const dummyKehamilan = [
  { id: 1, ibu_id: 1, ibu_nama: "Ny. Sari", hpht: "2025-07-15", taksiran_lahir: "2026-04-15", uk_saat_ini: "28 minggu", gravida: 2, paritas: 1, status: "Aktif", catatan: "Pemeriksaan rutin normal" },
  { id: 2, ibu_id: 2, ibu_nama: "Ny. Dewi", hpht: "2025-08-10", taksiran_lahir: "2026-05-10", uk_saat_ini: "24 minggu", gravida: 1, paritas: 0, status: "Aktif", catatan: "Tekanan darah normal" },
  { id: 3, ibu_id: 3, ibu_nama: "Ny. Fitri", hpht: "2025-06-20", taksiran_lahir: "2026-03-20", uk_saat_ini: "36 minggu", gravida: 3, paritas: 2, status: "Aktif", catatan: "Sudah masuk fase persiapan persalinan" },
];

const dummyAnak = [
  { id: 1, kehamilan_id: 1, nama: "Aisyah Putri", tgl_lahir: "2023-10-15", jk: "P", bb_lahir: "3.2 kg", tb_lahir: "50 cm" },
  { id: 2, kehamilan_id: 2, nama: "Rizky Ardianto", tgl_lahir: "2023-12-05", jk: "L", bb_lahir: "3.4 kg", tb_lahir: "52 cm" },
  { id: 3, kehamilan_id: 3, nama: "Nayla Azzahra", tgl_lahir: "2023-08-20", jk: "P", bb_lahir: "3.1 kg", tb_lahir: "50 cm" },
];

const AVATAR_COLORS = ["#14a89e","#f59e0b","#f43f5e","#818cf8","#10b981","#0ea5e9"];

const initials = (n) => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

/* ─── COMPONENT ───────────────────────────────────────────────────────────── */
export default function DataKehamilan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ibuIdFilter = searchParams.get('ibu_id');

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const PER_PAGE = 5;

  // Filter kehamilan berdasarkan ibu_id jika ada
  const filtered = ibuIdFilter 
    ? dummyKehamilan.filter(k => k.ibu_id == ibuIdFilter)
    : dummyKehamilan;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const openCreate = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (k) => { setEditData(k); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditData(null); };

  const statAktif = dummyKehamilan.filter(k => k.status === "Aktif").length;
  const total = dummyKehamilan.length;

  return (
    <MainLayout>
      <div className="p-6 max-w-full">
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/bidan/profil-ibu")}
              className="text-teal-600 hover:text-teal-800 font-semibold mb-2 flex items-center gap-2"
            >
              ← Kembali ke Profil Ibu
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Data Kehamilan</h1>
            <p className="text-gray-600 mt-1">Kelola catatan kehamilan dan perkembangan kesehatan ibu.</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-gradient-to-r from-teal-500 to-teal-400 hover:shadow-lg text-white px-6 py-3 rounded-3xl font-semibold transition flex items-center gap-2"
          >
            ➕ Tambah Kehamilan
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">🤰</div>
            <div className="text-3xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Total Data Kehamilan</div>
            <div className="text-xs text-gray-500 mt-2">Tercatat dalam sistem</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">⏳</div>
            <div className="text-3xl font-bold text-green-600">{statAktif}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Kehamilan Aktif</div>
            <div className="text-xs text-gray-500 mt-2">Sedang dipantau</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-3">👶</div>
            <div className="text-3xl font-bold text-gray-900">{dummyAnak.length}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Riwayat Anak Lahir</div>
            <div className="text-xs text-gray-500 mt-2">Dari kehamilan sebelumnya</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 gap-6">
          {/* MAIN TABLE */}
          <div>
            {/* TABLE CARD */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Daftar Data Kehamilan</h2>
                <p className="text-sm text-gray-600">{filtered.length} data ditemukan</p>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                {paginated.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="text-5xl mb-3 opacity-60">🔍</div>
                    <p className="text-lg font-semibold text-gray-700">Tidak ada data ditemukan</p>
                    <p className="text-gray-600 mt-1">Tambahkan data kehamilan baru dengan tombol di atas</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Nama Ibu</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">HPHT / Taksiran Lahir</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">UK Saat Ini</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Gravida / Paritas</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((k, i) => (
                        <tr key={k.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                style={{background: AVATAR_COLORS[i % AVATAR_COLORS.length]}}
                              >
                                {initials(k.ibu_nama)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{k.ibu_nama}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{k.hpht}</p>
                            <p className="text-xs text-gray-600">Taksiran: {k.taksiran_lahir}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{k.uk_saat_ini}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">G:{k.gravida} P:{k.paritas}</p>
                            <p className="text-xs text-gray-600">Gravida/Paritas</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              k.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-current"></span>
                              {k.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigate(`/bidan/profil-anak?kehamilan_id=${k.id}`)}
                                className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 flex items-center justify-center transition"
                                title="Lihat Anak"
                              >
                                👶
                              </button>
                              <button
                                onClick={() => openEdit(k)}
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
                    Menampilkan {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} dari {filtered.length} kehamilan
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

            {/* RIWAYAT ANAK */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Riwayat Anak yang Lahir</h2>
                <p className="text-sm text-gray-600">Catatan anak dari kehamilan sebelumnya</p>
              </div>

              <div className="overflow-x-auto">
                {dummyAnak.length === 0 ? (
                  <div className="text-center py-8 px-6">
                    <p className="text-sm text-gray-600">Belum ada riwayat anak lahir</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Nama Anak</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Tanggal Lahir</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Jenis Kelamin</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">BB / TB Lahir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyAnak.map((a, i) => (
                        <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                style={{background: AVATAR_COLORS[i % AVATAR_COLORS.length]}}
                              >
                                {initials(a.nama)}
                              </div>
                              <p className="font-semibold text-gray-900">{a.nama}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{a.tgl_lahir}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {a.jk === "P" ? "👧 Perempuan" : "👦 Laki-laki"}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{a.bb_lahir}</p>
                            <p className="text-xs text-gray-600">{a.tb_lahir}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
              <div className="sticky top-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <h3 className="text-xl font-bold text-gray-900">{editData ? "Edit Data Kehamilan" : "Tambah Data Kehamilan"}</h3>
                <button onClick={closeModal} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Nama Ibu</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.ibu_id||""}
                    >
                      <option value="">-- Pilih Ibu --</option>
                      <option value="1">Ny. Sari</option>
                      <option value="2">Ny. Dewi</option>
                      <option value="3">Ny. Fitri</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">HPHT</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.hpht}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Taksiran Lahir</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.taksiran_lahir}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Gravida</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.gravida||""}
                      placeholder="Contoh: 2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Paritas</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.paritas||""}
                      placeholder="Contoh: 1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.status||""}
                    >
                      <option value="">-- Pilih Status --</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Catatan Khusus</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
                      defaultValue={editData?.catatan||""}
                      placeholder="Masukkan catatan tentang kehamilan"
                      rows="3"
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
                  {editData ? "Simpan Perubahan" : "Tambah Data"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
