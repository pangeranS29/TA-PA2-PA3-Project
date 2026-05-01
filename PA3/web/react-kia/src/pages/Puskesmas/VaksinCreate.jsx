import React, { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/Puskesmas/MainLayout";
import { createVaksin } from "../../services/vaksin";
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
  if (status === 403) return "Anda tidak memiliki akses untuk menambah vaksin.";
  if (status === 404) return "Endpoint vaksin tidak ditemukan. Pastikan backend berjalan.";
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

export default function VaksinCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetNotice = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetNotice();

    const payload = normalizePayload(form);
    if (!payload.jenis_vaksin || !payload.kepanjangan || !payload.deskripsi || !payload.efek_samping) {
      setErrorMessage("Jenis vaksin, kepanjangan, deskripsi, dan efek samping wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await createVaksin(payload);
      navigate("/vaksin", {
        state: {
          notice: "Data vaksin berhasil ditambahkan",
        },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Gagal menyimpan data vaksin"));
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
              <h1 className="text-xl font-semibold text-slate-900 mt-2">Tambah Data Vaksin KIA Cerdas</h1>
              <p className="text-xs text-slate-500 mt-1">Catat detail vaksin untuk mendukung layanan imunisasi ibu dan anak.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-indigo-700 text-xs font-semibold">
              <Plus size={16} />
              Form Tambah Vaksin
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <VaksinForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/vaksin")}
            saving={saving}
            submitLabel="Simpan Vaksin"
            showCancel
          />
        </div>
      </div>
    </MainLayout>
  );
}
