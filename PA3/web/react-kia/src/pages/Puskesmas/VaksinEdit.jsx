import React, { useEffect, useState } from "react";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/Puskesmas/MainLayout";
import { getVaksinById, updateVaksin } from "../../services/vaksin";
import VaksinForm from "./VaksinForm";

const emptyForm = {
  jenis_vaksin: "",
  kepanjangan: "",
  ditujukan_kepada: "",
  waktu_pemberian: "",
  deskripsi: "",
  efek_samping: "",
};

const getErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  if (status === 401) return "Sesi login habis. Silakan login ulang.";
  if (status === 403) return "Anda tidak memiliki akses untuk mengubah vaksin.";
  if (status === 404) return "Data vaksin tidak ditemukan.";
  const message = error?.response?.data?.message;
  if (Array.isArray(message) && message[0]) return message[0];
  if (typeof message === "string") return message;
  return fallback;
};

const normalizePayload = (values) => {
  const trim = (value) => (value || "").trim();
  return {
    jenis_vaksin: trim(values.jenis_vaksin),
    kepanjangan: trim(values.kepanjangan),
    ditujukan_kepada: trim(values.ditujukan_kepada),
    waktu_pemberian: trim(values.waktu_pemberian),
    deskripsi: trim(values.deskripsi),
    efek_samping: trim(values.efek_samping),
  };
};

export default function VaksinEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNonaktif, setIsNonaktif] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const data = await getVaksinById(id);
        setIsNonaktif((data.status || "aktif").toString().trim().toLowerCase() === "nonaktif");
        setForm({
          jenis_vaksin: data.jenis_vaksin || "",
          kepanjangan: data.kepanjangan || "",
          ditujukan_kepada: data.ditujukan_kepada || "",
          waktu_pemberian: data.waktu_pemberian || "",
          deskripsi: data.deskripsi || "",
          efek_samping: data.efek_samping || "",
        });
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Gagal memuat data vaksin"));
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isNonaktif) {
      setErrorMessage("Vaksin nonaktif tidak dapat diubah. Aktifkan terlebih dahulu.");
      return;
    }
    const payload = normalizePayload(form);
    if (!payload.jenis_vaksin || !payload.kepanjangan || !payload.deskripsi || !payload.efek_samping) {
      setErrorMessage("Jenis vaksin, kepanjangan, deskripsi, dan efek samping wajib diisi");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    try {
      await updateVaksin(id, payload);
      navigate("/vaksin", {
        state: { notice: "Data vaksin berhasil diperbarui" },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Gagal memperbarui data vaksin"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate("/vaksin")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft size={18} />
                Kembali ke daftar vaksin
              </button>
              <h1 className="text-xl font-semibold text-slate-900 mt-2">Edit Data Vaksin</h1>
              <p className="text-xs text-slate-500 mt-1">Perbarui informasi vaksin yang tersimpan.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-amber-700 text-xs font-semibold">
              <Save size={16} />
              Form Edit Vaksin
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="text-sm text-slate-500">Memuat data...</div>
          ) : (
            <VaksinForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/vaksin")}
              saving={saving}
              submitLabel="Simpan Perubahan"
              showCancel
              disabled={isNonaktif}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
