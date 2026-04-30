import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";

// ========== STRUKTUR TABEL BULAN DARI BUKU KIA ==========
const COLS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "18", "23", "23-59"];
const NUM_COLS = COLS.length;

// ========== MASTER DATA IMUNISASI DENGAN JADWAL BULAN ==========
const vaccineData = [
  {
    id: 1,
    name: "Hepatitis B (<24 Jam)",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 0,
    cells: ["white", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray"],
  },
  {
    id: 2,
    name: "BCG",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 1,
    cells: ["white", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "gray", "gray", "gray", "gray"],
  },
  {
    id: 3,
    name: "Polio Tetes 1",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 2,
    cells: ["white", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 4,
    name: "DPT-HB-Hib 1",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 2,
    cells: ["gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 5,
    name: "Polio Tetes 2",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 2,
    cells: ["gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 6,
    name: "Rotavirus (RV)1*",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 2,
    cells: ["gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray"],
  },
  {
    id: 7,
    name: "PCV 1",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 2,
    cells: ["gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 8,
    name: "DPT-HB-Hib 2",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 3,
    cells: ["gray", "gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 9,
    name: "Polio Tetes 3",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 3,
    cells: ["gray", "gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 10,
    name: "Rotavirus (RV)2",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 3,
    cells: ["gray", "gray", "gray", "white", "yellow", "yellow", "yellow", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray"],
  },
  {
    id: 11,
    name: "PCV 2",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 3,
    cells: ["gray", "gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 12,
    name: "DPT-HB-Hib 3",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 4,
    cells: ["gray", "gray", "gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 13,
    name: "Polio Tetes 4",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 4,
    cells: ["gray", "gray", "gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 14,
    name: "Polio Suntik (IPV) 1",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 4,
    cells: ["gray", "gray", "gray", "gray", "white", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 15,
    name: "Rotavirus (RV) 3",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 4,
    cells: ["gray", "gray", "gray", "gray", "white", "yellow", "yellow", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray"],
  },
  {
    id: 16,
    name: "Campak -Rubella (MR)",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 12,
    cells: ["gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "white", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 17,
    name: "Polio Suntik (IPV) 2*",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 9,
    cells: ["gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "white", "yellow", "yellow", "pink", "pink", "pink", "pink"],
  },
  {
    id: 18,
    name: "*JapaneseEncephalitis (JE)",
    no_batch: "",
    kategori: "dasar",
    usia_bulan: 9,
    cells: ["gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "white", "pink", "pink", "pink", "pink", "pink"],
  },
  {
    id: 19,
    name: "PCV3",
    no_batch: "",
    kategori: "lanjutan",
    usia_bulan: 9,
    cells: ["gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "white", "yellow", "yellow", "pink"],
  },
  {
    id: 20,
    name: "DPT-HB-Hib Lanjutan",
    no_batch: "",
    kategori: "lanjutan",
    usia_bulan: 18,
    cells: ["gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "white", "yellow", "pink"],
  },
  {
    id: 21,
    name: "Campak Rubella(MR) Lanjutan",
    no_batch: "",
    kategori: "lanjutan",
    usia_bulan: 18,
    cells: ["gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "white", "yellow", "pink"],
  },
];

// ========== MASTER DATA ANAK ==========
const ANAK_LIST = [
  { id: 1, nama: "Ahmad Rizki", tanggal_lahir: "2023-10-15", jenis_kelamin: "L", berat_lahir: 3200 },
  { id: 2, nama: "Siti Nurhaliza", tanggal_lahir: "2024-01-20", jenis_kelamin: "P", berat_lahir: 3100 },
  { id: 3, nama: "Muhammad Fahri", tanggal_lahir: "2023-12-05", jenis_kelamin: "L", berat_lahir: 3400 },
];

// ========== DATA IMUNISASI HARDCODE ==========
const IMUNISASI_DATA_INIT = {
  1: [
    { id: "imun_1", jenis_imunisasi_id: 1, col_idx: 0, tanggal: "2023-10-15", no_batch: "A21-001", paraf_petugas: "NP" },
    { id: "imun_2", jenis_imunisasi_id: 2, col_idx: 1, tanggal: "2023-11-15", no_batch: "B22-002", paraf_petugas: "SW" },
  ],
  2: [
    { id: "imun_3", jenis_imunisasi_id: 1, col_idx: 0, tanggal: "2024-01-20", no_batch: "A21-003", paraf_petugas: "NP" },
  ],
  3: [],
};

// Initialize vaccineData dengan no_batch dari imunisasi yang sudah ada
(() => {
  Object.values(IMUNISASI_DATA_INIT).forEach(imunList => {
    imunList.forEach(imun => {
      const vax = vaccineData.find(v => v.id === imun.jenis_imunisasi_id);
      if (vax && !vax.no_batch) {
        vax.no_batch = imun.no_batch;
      }
    });
  });
})();

// ========== WARNA DAN STYLING ==========
const CELL_COLORS = {
  white: "#ffffff",
  yellow: "#f5d87a",
  pink: "#f4b8b8",
  gray: "#c8c8c8",
};

const LEGEND = [
  { color: "#ffffff", border: "1px solid #aaa", label: "Usia Tepat Pemberian Imunisasi" },
  { color: "#f5d87a", border: "1px solid #c9a800", label: "Usia yang masih diperbolehkan untuk melengkapi imunisasi" },
  { color: "#f4b8b8", border: "1px solid #c07070", label: "Usia Pemberian Imunisasi yang belum lengkap (Kejar)" },
  { color: "#c8c8c8", border: "1px solid #999", label: "Usia yang tidak diperbolehkan" },
];

const borderStyle = "1px solid #a8b4c0";

const thBase = {
  border: borderStyle,
  padding: "3px 2px",
  fontWeight: "bold",
  fontSize: 10,
  textAlign: "center",
  color: "#111",
  verticalAlign: "middle",
  lineHeight: 1.2,
};

const colWidths = COLS.map(c => {
  if (c === "23-59") return 52;
  if (["10", "11", "12", "18", "23"].includes(c)) return 30;
  return 26;
});

// ========== HELPER FUNCTIONS ==========

const hitungUsiaBulan = (tglLahir) => {
  const lahir = new Date(tglLahir);
  const hariIni = new Date();
  let bulan = (hariIni.getFullYear() - lahir.getFullYear()) * 12;
  bulan += hariIni.getMonth() - lahir.getMonth();
  return Math.floor(bulan);
};

const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const date = new Date(tanggal);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

// ========== COMPONENT ==========
export default function ImunisasiTable() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anakIdFromUrl = searchParams.get('anak');

  // Find anak dari URL param atau default ke ANAK_LIST[0]
  const initialAnak = anakIdFromUrl 
    ? ANAK_LIST.find(a => a.id == anakIdFromUrl) || ANAK_LIST[0]
    : ANAK_LIST[0];

  const [anakTerpilih, setAnakTerpilih] = useState(initialAnak);
  const [showModalInput, setShowModalInput] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [imunisasiList, setImunisasiList] = useState(IMUNISASI_DATA_INIT);
  const [cells, setCells] = useState(() =>
    vaccineData.map(() => Array(NUM_COLS).fill(""))
  );

  // Form input modal
  const [formData, setFormData] = useState({
    col_idx: "",
    tanggal: "",
    no_batch: "",
    paraf_petugas: "",
  });

  // Update cells dari imunisasi yang sudah ada
  React.useEffect(() => {
    const imunisasiAnakSekarang = imunisasiList[anakTerpilih.id] || [];
    const newCells = vaccineData.map(() => Array(NUM_COLS).fill(""));

    imunisasiAnakSekarang.forEach(imun => {
      const vaxIdx = vaccineData.findIndex(v => v.id === imun.jenis_imunisasi_id);
      if (vaxIdx !== -1 && imun.col_idx !== undefined) {
        newCells[vaxIdx][imun.col_idx] = imun.paraf_petugas;
      }
    });

    setCells(newCells);
  }, [anakTerpilih, imunisasiList]);

  // Buka modal input
  const handleOpenModal = (vaccine, colIdx) => {
    const existingImun = (imunisasiList[anakTerpilih.id] || []).find(
      i => i.jenis_imunisasi_id === vaccine.id && i.col_idx === colIdx
    );

    setSelectedVaccine(vaccine);
    setFormData({
      col_idx: colIdx,
      tanggal: existingImun?.tanggal || "",
      no_batch: existingImun?.no_batch || "",
      paraf_petugas: existingImun?.paraf_petugas || "",
    });
    setShowModalInput(true);
  };

  // Simpan imunisasi
  const handleSaveImunisasi = () => {
    if (!formData.tanggal || !formData.no_batch || !formData.paraf_petugas) {
      alert("Semua field harus diisi!");
      return;
    }

    const existingIdx = (imunisasiList[anakTerpilih.id] || []).findIndex(
      i => i.jenis_imunisasi_id === selectedVaccine.id && i.col_idx === formData.col_idx
    );

    let newList = [...(imunisasiList[anakTerpilih.id] || [])];

    if (existingIdx !== -1) {
      // Update existing
      newList[existingIdx] = {
        ...newList[existingIdx],
        tanggal: formData.tanggal,
        no_batch: formData.no_batch,
        paraf_petugas: formData.paraf_petugas,
      };
    } else {
      // Add new
      newList.push({
        id: `imun_${Date.now()}`,
        jenis_imunisasi_id: selectedVaccine.id,
        col_idx: formData.col_idx,
        tanggal: formData.tanggal,
        no_batch: formData.no_batch,
        paraf_petugas: formData.paraf_petugas,
      });
    }

    // Update no_batch di vaccineData juga
    const vaccineIdx = vaccineData.findIndex(v => v.id === selectedVaccine.id);
    if (vaccineIdx !== -1) {
      vaccineData[vaccineIdx].no_batch = formData.no_batch;
    }

    setImunisasiList(prev => ({
      ...prev,
      [anakTerpilih.id]: newList,
    }));

    setShowModalInput(false);
    alert("Imunisasi berhasil disimpan!");
  };

  const usiaBulanSekarang = hitungUsiaBulan(anakTerpilih.tanggal_lahir);

  // Hitung statistik imunisasi
  const totalVaksin = vaccineData.length;
  const sudahDiberikan = (imunisasiList[anakTerpilih.id] || []).length;
  const persentaseLengkap = totalVaksin > 0 ? Math.round((sudahDiberikan / totalVaksin) * 100) : 0;

  return (
    <MainLayout>
      <div className="p-6">
        <div className="space-y-6">
          
          {/* ===== PAGE HEADER ===== */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => navigate("/bidan/profil-anak")}
                className="text-teal-600 hover:text-teal-800 font-semibold mb-2 flex items-center gap-2"
              >
                ← Kembali ke Profil Anak
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Pencatatan Imunisasi</h1>
              <p className="text-gray-600 mt-1">Catat pelayanan imunisasi sesuai Buku KIA</p>
            </div>
          </div>

          {/* ===== RECAP SECTION ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">💉</div>
              <div className="text-3xl font-bold text-gray-900">{sudahDiberikan}</div>
              <div className="text-sm text-gray-600 font-semibold mt-1">Imunisasi Diberikan</div>
              <div className="text-xs text-gray-500 mt-2">Dari {totalVaksin} total vaksin</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">📊</div>
              <div className="text-3xl font-bold text-teal-600">{persentaseLengkap}%</div>
              <div className="text-sm text-gray-600 font-semibold mt-1">Kelengkapan Imunisasi</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-teal-500 h-2 rounded-full transition-all" style={{width: `${persentaseLengkap}%`}}></div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">⏳</div>
              <div className="text-3xl font-bold text-orange-600">{totalVaksin - sudahDiberikan}</div>
              <div className="text-sm text-gray-600 font-semibold mt-1">Belum Diberikan</div>
              <div className="text-xs text-gray-500 mt-2">Perlu tindak lanjut</div>
            </div>
          </div>
          
          {/* ===== SECTION 1: PILIH ANAK ===== */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <h3 className="text-white font-semibold text-lg">Pilih Anak</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ANAK_LIST.map((anak) => (
                  <button
                    key={anak.id}
                    onClick={() => setAnakTerpilih(anak)}
                    className={`p-4 rounded-lg border-2 transition ${
                      anakTerpilih.id === anak.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{anak.nama}</p>
                      <p className="text-sm text-gray-600">
                        {anak.jenis_kelamin === "L" ? "👦 Laki-laki" : "👧 Perempuan"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Lahir: {formatTanggal(anak.tanggal_lahir)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SECTION 2: INFO ANAK ===== */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow text-white p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Nama Anak</p>
                <p className="font-semibold text-lg">{anakTerpilih.nama}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Tanggal Lahir</p>
                <p className="font-semibold text-lg">{formatTanggal(anakTerpilih.tanggal_lahir)}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Usia</p>
                <p className="font-semibold text-lg">{usiaBulanSekarang} bulan</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Total Imunisasi</p>
                <p className="font-semibold text-lg">{(imunisasiList[anakTerpilih.id] || []).length}</p>
              </div>
            </div>
          </div>

          {/* ===== SECTION 3: TABEL BUKU KIA ===== */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <h3 className="text-white font-semibold text-lg">Pelayanan Imunisasi (Format Buku KIA)</h3>
            </div>

            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 10 }}>
              <div style={{ overflowX: "auto", border: borderStyle }}>
                <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: 128 }} />
                    {COLS.map((c, i) => <col key={i} style={{ width: colWidths[i] }} />)}
                  </colgroup>

                  <thead>
                    {/* Header row 1 */}
                    <tr style={{ background: "#d6e4f7" }}>
                      <th rowSpan={2} style={{ ...thBase, textAlign: "left", paddingLeft: 6, background: "#d6e4f7" }}>Umur</th>
                      <th colSpan={NUM_COLS} style={{ ...thBase, background: "#d6e4f7" }}>Bulan</th>
                    </tr>

                    {/* Header row 2: month numbers */}
                    <tr style={{ background: "#e4eef8" }}>
                      {COLS.map((c, i) => (
                        <th key={i} style={{ ...thBase, background: "#e4eef8", fontWeight: "normal", fontSize: 10 }}>{c}</th>
                      ))}
                    </tr>

                    {/* Header row 3 */}
                    <tr style={{ background: "#eef3f9" }}>
                      <th style={{ ...thBase, textAlign: "left", paddingLeft: 6, background: "#eef3f9" }}>Jenis Vaksin</th>
                      <th colSpan={NUM_COLS} style={{ ...thBase, background: "#eef3f9", fontWeight: "normal", fontSize: 10 }}>
                        Tanggal Pemberian dan Paraf Petugas
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {vaccineData.map((vax, vi) => (
                      <tr key={vi}>
                        {/* Vaccine name + Batch */}
                        <td style={{
                          border: borderStyle,
                          padding: "3px 4px 3px 6px",
                          verticalAlign: "top",
                          background: "#fff",
                          lineHeight: 1.2,
                        }}>
                          <div style={{ fontWeight: "bold", fontSize: 10, color: "#111", marginBottom: 2 }}>
                            {vax.name}
                          </div>
                          {vax.no_batch && (
                            <div style={{ fontSize: 8, color: "#666" }}>
                              No. Batch: {vax.no_batch}
                            </div>
                          )}
                        </td>

                        {/* Month cells */}
                        {vax.cells.map((type, ci) => {
                          const bg = CELL_COLORS[type];
                          const editable = type !== "gray";
                          return (
                            <td key={ci} style={{
                              border: borderStyle,
                              padding: 0,
                              background: bg,
                              verticalAlign: "top",
                              height: 32,
                              cursor: editable ? "pointer" : "default",
                            }}>
                              {editable && (
                                <button
                                  onClick={() => handleOpenModal(vax, ci)}
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    height: "100%",
                                    minHeight: 32,
                                    border: "none",
                                    background: "transparent",
                                    outline: "none",
                                    fontSize: 8,
                                    textAlign: "center",
                                    padding: "2px 0",
                                    boxSizing: "border-box",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    color: "#222",
                                  }}
                                >
                                  {cells[vi][ci]}
                                </button>
                              )}
                            </td>
                          );
                        })}


                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4, padding: "0 8px 8px" }}>
                {LEGEND.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{
                      width: 22,
                      height: 13,
                      flexShrink: 0,
                      background: item.color,
                      border: item.border,
                    }} />
                    <span style={{ fontSize: 9.5, color: "#222" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== SECTION 4: RIWAYAT IMUNISASI ===== */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <h3 className="text-white font-semibold text-lg">Riwayat Imunisasi</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vaksin</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No. Batch</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Paraf</th>
                  </tr>
                </thead>
                <tbody>
                  {(imunisasiList[anakTerpilih.id] || []).length > 0 ? (
                    (imunisasiList[anakTerpilih.id] || []).map((imun, idx) => {
                      const vax = vaccineData.find(v => v.id === imun.jenis_imunisasi_id);
                      return (
                        <tr key={imun.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{vax?.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatTanggal(imun.tanggal)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{imun.no_batch}</td>
                          <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{imun.paraf_petugas}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                        Belum ada data imunisasi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL INPUT ===== */}
      {showModalInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-white font-semibold text-lg">Catat Imunisasi</h2>
              <p className="text-blue-100 text-sm mt-1">{selectedVaccine?.name}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Anak:</span> {anakTerpilih.nama}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Usia:</span> {usiaBulanSekarang} bulan
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Bulan ke:</span> {COLS[formData.col_idx]}
                </p>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Pemberian</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* No. Batch */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Batch Vaksin</label>
                <input
                  type="text"
                  value={formData.no_batch}
                  onChange={(e) => setFormData({ ...formData, no_batch: e.target.value })}
                  placeholder="cth: A21-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Paraf */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paraf Petugas</label>
                <input
                  type="text"
                  value={formData.paraf_petugas}
                  onChange={(e) => setFormData({ ...formData, paraf_petugas: e.target.value.toUpperCase() })}
                  placeholder="cth: NP / SW"
                  maxLength="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Paraf inisial petugas kesehatan (maks 3 karakter)</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowModalInput(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveImunisasi}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
