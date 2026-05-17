import React, { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  createJadwalLayanan,
  getJadwalLayananById,
  updateJadwalLayanan,
} from "../../services/jadwalLayanan";
import { listPosyanduForDropdown } from "../../services/adminTenagaKesehatan";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Stethoscope,
  RefreshCw,
  Save,
  AlertCircle,
} from "lucide-react";

function FormField({ label, icon: Icon, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {Icon && <Icon size={14} className="text-slate-400" />}
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] transition-all";

function normalizeTimeValue(value) {
  if (!value) return "";
  if (typeof value === "string") {
    if (/^\d{2}:\d{2}$/.test(value)) return value;
    const timeInIso = value.match(/T(\d{2}:\d{2})/);
    if (timeInIso?.[1]) return timeInIso[1];
    const timeOnly = value.match(/^(\d{2}:\d{2})(:\d{2})?$/);
    if (timeOnly?.[1]) return timeOnly[1];
  }
  return "";
}

export default function JadwalLayananForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [posyanduOptions, setPosyanduOptions] = useState([]);

  const [form, setForm] = useState({
    posyandu_id: "",
    layanan: "",
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    keterangan: "",
  });

  // Load existing data when editing
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getJadwalLayananById(id);
        if (data) {
          setForm({
            posyandu_id: data.posyandu_id ?? "",
            layanan: data.layanan ?? "",
            tanggal: data.tanggal ? data.tanggal.split("T")[0] : "",
            waktu_mulai: normalizeTimeValue(data.waktu_mulai),
            waktu_selesai: normalizeTimeValue(data.waktu_selesai),
            keterangan: data.keterangan ?? "",
          });
        }
      } catch {
        setError("Gagal memuat data jadwal. Silakan kembali dan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Load posyandu dropdown
  useEffect(() => {
    const loadPosyandu = async () => {
      try {
        const data = await listPosyanduForDropdown({ page: 1, per_page: 100 });
        setPosyanduOptions(Array.isArray(data) ? data : []);
      } catch {
        // ignore — posyandu is optional
      }
    };
    loadPosyandu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      posyandu_id: form.posyandu_id ? Number(form.posyandu_id) : null,
      layanan: form.layanan,
      tanggal: form.tanggal,
      waktu_mulai: form.waktu_mulai || null,
      waktu_selesai: form.waktu_selesai || null,
      keterangan: form.keterangan || null,
    };

    try {
      if (isEdit) {
        await updateJadwalLayanan(id, payload);
      } else {
        await createJadwalLayanan(payload);
      }
      navigate("/jadwal-layanan");
    } catch (err) {
      const apiErr = err?.response?.data;
      if (apiErr?.error === "validation" && Array.isArray(apiErr?.fields)) {
        setError(apiErr.fields.map((f) => `${f.field}: ${f.message}`).join("; "));
      } else {
        setError(apiErr?.error || apiErr?.details || "Gagal menyimpan data jadwal.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-3xl">
        {/* Back + header */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-5 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/jadwal-layanan")}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#185FA5]/10 flex items-center justify-center">
                <Calendar size={20} className="text-[#185FA5]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">
                  {isEdit ? "Edit Jadwal Layanan" : "Tambah Jadwal Layanan"}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {isEdit
                    ? "Perbarui informasi jadwal imunisasi."
                    : "Buat sesi imunisasi baru untuk posyandu."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#185FA5]/20 border-t-[#185FA5] animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Memuat data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nama Layanan */}
              <FormField label="Nama Layanan" icon={Stethoscope}>
                <input
                  name="layanan"
                  value={form.layanan}
                  onChange={handleChange}
                  placeholder="cth. Imunisasi BCG, Polio, DPT-HB-Hib"
                  className={inputClass}
                  required
                />
              </FormField>

              {/* Grid: Posyandu, Tanggal, Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Posyandu"
                  icon={MapPin}
                  hint="Kosongkan jika belum ditentukan"
                >
                  <select
                    name="posyandu_id"
                    value={form.posyandu_id}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">— Pilih posyandu (opsional) —</option>
                    {posyanduOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama || p.name || p.alamat || `Posyandu ${p.id}`}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* kapasitas column removed */}

                <FormField label="Tanggal Pelayanan" icon={Calendar}>
                  <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField
                  label="Waktu Pelayanan"
                  icon={Clock}
                  hint='Pilih rentang waktu: mulai dan selesai (HH:MM)'
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      name="waktu_mulai"
                      value={form.waktu_mulai}
                      onChange={handleChange}
                      className={`${inputClass} max-w-[140px]`}
                      required
                    />
                    <span className="text-sm text-slate-400">—</span>
                    <input
                      type="time"
                      name="waktu_selesai"
                      value={form.waktu_selesai}
                      onChange={handleChange}
                      className={`${inputClass} max-w-[140px]`}
                    />
                  </div>
                </FormField>
              </div>

              {/* Keterangan */}
              <FormField
                label="Keterangan"
                icon={FileText}
                hint="Opsional — catatan tambahan untuk jadwal ini"
              >
                <textarea
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Catatan tambahan, syarat peserta, dsb."
                  className={`${inputClass} resize-none`}
                />
              </FormField>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle
                    size={16}
                    className="text-[#A32D2D] mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-[#A32D2D] leading-relaxed">
                    {String(error)}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#185FA5] hover:bg-[#0e4a84] disabled:bg-[#185FA5]/60 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      {isEdit ? "Update Jadwal" : "Simpan Jadwal"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/jadwal-layanan")}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </MainLayout>
  );
}