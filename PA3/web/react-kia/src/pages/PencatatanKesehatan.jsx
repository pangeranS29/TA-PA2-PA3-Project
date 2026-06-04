import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { getPendudukByKategori } from "../services/dashboardService";
import api from "../services/api";

export default function PencatatanKesehatan() {
  const { kategori } = useParams();
  const navigate = useNavigate();
  const [pendudukList, setPendudukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tanggal_pemeriksaan: new Date().toISOString().slice(0, 10),
    berat_badan: "",
    tinggi_badan: "",
    tekanan_darah: "",
    gula_darah: "",
    kolesterol: "",
    status_gizi: "",
    kategori_risiko: "Normal",
    catatan_khusus: "",
    penyakit_kronis: "",
    status_kemandirian: "Mandiri",
  });

  const kategoriMap = {
    anak: { label: "Anak (0-12 tahun)", endpoint: "anak" },
    remaja: { label: "Remaja (13-18 tahun)", endpoint: "remaja" },
    dewasa: { label: "Dewasa (19-59 tahun)", endpoint: "dewasa" },
    lansia: { label: "Lansia (≥60 tahun)", endpoint: "lansia" },
  };
  const current = kategoriMap[kategori];

  useEffect(() => {
    if (!current) {
      navigate("/pencatatan-kesehatan/anak");
      return;
    }
    const fetchPenduduk = async () => {
      setLoading(true);
      try {
        const data = await getPendudukByKategori(kategori);
        setPendudukList(data || []);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data penduduk");
        setPendudukList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPenduduk();
  }, [kategori, navigate, current]);

  const openModal = (p) => {
    setSelected(p);
    setShowModal(true);
    setForm({
      tanggal_pemeriksaan: new Date().toISOString().slice(0, 10),
      berat_badan: "",
      tinggi_badan: "",
      tekanan_darah: "",
      gula_darah: "",
      kolesterol: "",
      status_gizi: "",
      kategori_risiko: "Normal",
      catatan_khusus: "",
      penyakit_kronis: "",
      status_kemandirian: "Mandiri",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    let endpoint = "";
    if (kategori === "anak") endpoint = "/pemeriksaan-anak";
    else if (kategori === "remaja") endpoint = "/pemeriksaan-remaja";
    else if (kategori === "dewasa") endpoint = "/pemeriksaan-dewasa";
    else endpoint = "/pemeriksaan-lansia";

    const payload = {
      penduduk_id: selected.id,
      tanggal_pemeriksaan: form.tanggal_pemeriksaan,
      berat_badan: form.berat_badan ? parseFloat(form.berat_badan) : null,
      tinggi_badan: form.tinggi_badan ? parseFloat(form.tinggi_badan) : null,
      tekanan_darah: form.tekanan_darah || null,
      gula_darah: form.gula_darah ? parseFloat(form.gula_darah) : null,
      kolesterol: form.kolesterol ? parseFloat(form.kolesterol) : null,
      status_gizi: form.status_gizi || null,
      kategori_risiko: form.kategori_risiko,
      catatan_khusus: form.catatan_khusus || null,
      penyakit_kronis: form.penyakit_kronis || null,
      status_kemandirian: form.status_kemandirian,
    };

    try {
      await api.post(`/tenaga-kesehatan${endpoint}`, payload);
      alert("Data berhasil disimpan");
      closeModal();
      const data = await getPendudukByKategori(kategori);
      setPendudukList(data || []);
    } catch (err) {
      alert("Gagal menyimpan: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const showGulaDarah = ["remaja", "dewasa", "lansia"].includes(kategori);
  const showKolesterol = ["dewasa", "lansia"].includes(kategori);
  const showPenyakitKronis = kategori === "lansia";
  const showKemandirian = kategori === "lansia";

  if (!current) return null;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Pencatatan Kesehatan - {current.label}</h1>
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">← Kembali</button>
        </div>
        {loading ? (
          <div className="text-center py-8">Memuat data penduduk...</div>
        ) : pendudukList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Tidak ada penduduk dalam kategori ini.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendudukList.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{p.nama_lengkap}</div>
                  <div className="text-sm text-gray-600">NIK: {p.nik || '-'}</div>
                  <div className="text-sm text-gray-500">{p.dusun || '-'} · {p.usia} tahun</div>
                </div>
                <button
                  onClick={() => openModal(p)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Catat
                </button>
              </div>
            ))}
          </div>
        )}
        {showModal && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Form Pencatatan</h2>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p><strong>Nama:</strong> {selected.nama_lengkap}</p>
                  <p><strong>NIK:</strong> {selected.nik || '-'}</p>
                  <p><strong>Usia:</strong> {selected.usia} tahun</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium">Tanggal Pemeriksaan</label>
                    <input type="date" name="tanggal_pemeriksaan" value={form.tanggal_pemeriksaan} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label>Berat Badan (kg)</label><input type="number" step="0.1" name="berat_badan" value={form.berat_badan} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
                    <div><label>Tinggi Badan (cm)</label><input type="number" step="0.1" name="tinggi_badan" value={form.tinggi_badan} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
                  </div>
                  <div><label>Tekanan Darah (mmHg)</label><input type="text" name="tekanan_darah" value={form.tekanan_darah} onChange={handleChange} placeholder="120/80" className="w-full border rounded px-3 py-2" /></div>
                  {showGulaDarah && <div><label>Gula Darah (mg/dL)</label><input type="number" step="0.1" name="gula_darah" value={form.gula_darah} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>}
                  {showKolesterol && <div><label>Kolesterol (mg/dL)</label><input type="number" step="0.1" name="kolesterol" value={form.kolesterol} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>}
                  <div><label>Status Gizi</label><input type="text" name="status_gizi" value={form.status_gizi} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
                  <div><label>Kategori Risiko</label><select name="kategori_risiko" value={form.kategori_risiko} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>Normal</option><option>Sedang</option><option>Tinggi</option></select></div>
                  <div><label>Catatan Khusus</label><textarea name="catatan_khusus" value={form.catatan_khusus} onChange={handleChange} rows="2" className="w-full border rounded px-3 py-2" /></div>
                  {showPenyakitKronis && <div><label>Penyakit Kronis</label><input type="text" name="penyakit_kronis" value={form.penyakit_kronis} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>}
                  {showKemandirian && <div><label>Status Kemandirian</label><select name="status_kemandirian" value={form.status_kemandirian} onChange={handleChange} className="w-full border rounded px-3 py-2"><option>Mandiri</option><option>Bantuan</option><option>Tergantung</option></select></div>}
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg">Batal</button>
                    <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">{submitting ? "Menyimpan..." : "Simpan"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}