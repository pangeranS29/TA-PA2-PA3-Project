import React, { memo } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * DynamicInput - Khusus untuk form kehamilan & ANC
 * Tampilan lebih bersahabat, label lebih besar, unit jelas.
 */
const DynamicInput = memo(({ item, value, onChange, onToggle, required = false }) => {
  if (!item) return null;

  // Deteksi nilai checkbox (boolean / string "1" / angka 1)
  const isChecked = [true, "true", 1, "1", "on", "yes"].includes(value);

  // Unit yang relevan untuk kehamilan
  const getUnit = (nama) => {
    const n = nama.toLowerCase();
    if (n.includes('berat') || n.includes('bb')) return 'kg';  // biasanya kg untuk BB ibu
    if (n.includes('tinggi') || n.includes('tb')) return 'cm';
    if (n.includes('fundus') || n.includes('tfu')) return 'cm';
    if (n.includes('suhu')) return '°C';
    if (n.includes('tekanan') || n.includes('darah')) return 'mmHg';
    if (n.includes('usia kehamilan') || n.includes('gestasi') || n.includes('minggu')) return 'minggu';
    return '';
  };

  // Style label yang lebih enak dibaca
  const labelStyle = "text-xs font-semibold text-gray-700 mb-1 block";
  const inputBaseClass = "w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:outline-none transition text-sm text-gray-800 bg-white";
  
  // --- INPUT NUMBER (angka) ---
  if (item.tipe_input === 'number') {
    return (
      <div className="mb-3">
        <label className={labelStyle}>
          {item.nama}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            className={inputBaseClass}
            placeholder="0"
            value={value ?? ''}
            onChange={(e) => onChange(item.jenis_pelayanan_id, e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            {getUnit(item.nama)}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">Masukkan angka saja</p>
      </div>
    );
  }

  // --- CHECKBOX (dengan tema kehamilan: pink saat aktif) ---
  if (item.tipe_input === 'checkbox') {
    return (
      <button
        type="button"
        onClick={() => onToggle(item.jenis_pelayanan_id)}
        className={`flex items-center gap-3 py-2 px-3 border rounded-lg transition-all w-full mb-2 ${
          isChecked
            ? 'border-pink-400 bg-pink-50 text-pink-700 shadow-sm'
            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
          isChecked ? 'bg-pink-500 border-pink-500' : 'border-gray-400 bg-white'
        }`}>
          {isChecked && <Check size={12} strokeWidth={3} className="text-white" />}
        </div>
        <span className="text-sm font-medium">{item.nama}</span>
      </button>
    );
  }

  // --- TEXTAREA (untuk anamnesa, catatan) ---
  if (item.tipe_input === 'text') {
    return (
      <div className="mb-3">
        <label className={labelStyle}>{item.nama}</label>
        <textarea
          className={`${inputBaseClass} min-h-[90px] resize-y`}
          placeholder="Contoh: keluhan, riwayat penyakit, catatan khusus..."
          value={value || ''}
          onChange={(e) => onChange(item.jenis_pelayanan_id, e.target.value)}
        />
      </div>
    );
  }

  // --- SELECT (dropdown) untuk pilihan seperti Gravida, Para, dll ---
  if (item.tipe_input === 'select' && item.options?.length) {
    return (
      <div className="mb-3">
        <label className={labelStyle}>
          {item.nama}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <select
            value={value ?? ''}
            onChange={(e) => onChange(item.jenis_pelayanan_id, e.target.value)}
            className={`${inputBaseClass} appearance-none pr-8`}
          >
            <option value="">Pilih {item.nama}</option>
            {item.options.map((opt, idx) => (
              <option key={idx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>
    );
  }

  // --- DATE (tanggal periksa, HPHT, dll) ---
  if (item.tipe_input === 'date') {
    return (
      <div className="mb-3">
        <label className={labelStyle}>{item.nama}</label>
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(item.jenis_pelayanan_id, e.target.value)}
          className={inputBaseClass}
        />
      </div>
    );
  }

  // --- RADIO (misal: jenis persalinan, status imunisasi) ---
  if (item.tipe_input === 'radio' && item.options?.length) {
    return (
      <div className="mb-3">
        <label className={labelStyle}>{item.nama}</label>
        <div className="flex flex-wrap gap-4 mt-1">
          {item.options.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={item.jenis_pelayanan_id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(item.jenis_pelayanan_id, opt.value)}
                className="w-4 h-4 text-pink-500 focus:ring-pink-300"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
});

DynamicInput.displayName = 'DynamicInput';
export default DynamicInput;