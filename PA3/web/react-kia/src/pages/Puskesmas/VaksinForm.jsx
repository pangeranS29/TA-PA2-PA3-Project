import React from "react";
import { Save, X } from "lucide-react";

const fieldClass = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm";

export default function VaksinForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  saving,
  submitLabel,
  showCancel,
  disabled,
}) {
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Jenis Vaksin</label>
        <input
          className={fieldClass}
          placeholder="Contoh: Dasar"
          value={form.jenis_vaksin}
          disabled={disabled}
          onChange={(e) => updateField("jenis_vaksin", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Kepanjangan</label>
        <input
          className={fieldClass}
          placeholder="Contoh: Hepatitis B"
          value={form.kepanjangan}
          disabled={disabled}
          onChange={(e) => updateField("kepanjangan", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Ditujukan Kepada</label>
        <input
          className={fieldClass}
          placeholder="Contoh: Bayi 0-11 bln"
          value={form.ditujukan_kepada}
          disabled={disabled}
          onChange={(e) => updateField("ditujukan_kepada", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Waktu Pemberian</label>
        <input
          className={fieldClass}
          placeholder="Contoh: Saat lahir"
          value={form.waktu_pemberian}
          disabled={disabled}
          onChange={(e) => updateField("waktu_pemberian", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Deskripsi</label>
        <textarea
          className={`${fieldClass} min-h-[90px]`}
          placeholder="Ringkasan manfaat atau tujuan vaksin"
          value={form.deskripsi}
          disabled={disabled}
          onChange={(e) => updateField("deskripsi", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Efek Samping</label>
        <textarea
          className={`${fieldClass} min-h-[90px]`}
          placeholder="Contoh: Demam ringan, nyeri di area suntik"
          value={form.efek_samping}
          disabled={disabled}
          onChange={(e) => updateField("efek_samping", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={saving || disabled}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          <Save size={16} />
          {submitLabel}
        </button>
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <X size={16} />
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
