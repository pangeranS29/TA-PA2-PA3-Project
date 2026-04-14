import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddEditIbuModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    hpht: "",
    usia: "",
    dusun: "",
    statusKehamilan: "TRIMESTER 1",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nama: initialData.nama || "",
        nik: initialData.nik || "",
        hpht: initialData.hpht || "",
        usia: initialData.usia || "",
        dusun: initialData.dusun || "",
        statusKehamilan: initialData.statusKehamilan || "TRIMESTER 1",
      });
    } else {
      setForm({ nama: "", nik: "", hpht: "", usia: "", dusun: "", statusKehamilan: "TRIMESTER 1" });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{initialData ? "Edit Ibu" : "Tambah Ibu Baru"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" name="nama" value={form.nama} onChange={handleChange} className="mt-1 w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIK</label>
            <input type="text" name="nik" value={form.nik} onChange={handleChange} className="mt-1 w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HPHT (Hari Pertama Haid Terakhir)</label>
            <input type="date" name="hpht" value={form.hpht} onChange={handleChange} className="mt-1 w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Usia (Tahun)</label>
            <input type="number" name="usia" value={form.usia} onChange={handleChange} className="mt-1 w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dusun</label>
            <select name="dusun" value={form.dusun} onChange={handleChange} className="mt-1 w-full border rounded-lg px-3 py-2">
              <option value="">Pilih Dusun</option>
              <option>DUSUN I</option><option>DUSUN II</option><option>DUSUN III</option><option>DUSUN IV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status Kehamilan</label>
            <select name="statusKehamilan" value={form.statusKehamilan} onChange={handleChange} className="mt-1 w-full border rounded-lg px-3 py-2">
              <option>TRIMESTER 1</option><option>TRIMESTER 2</option><option>TRIMESTER 3</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Batal</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditIbuModal;