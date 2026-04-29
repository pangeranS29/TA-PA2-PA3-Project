# 🚀 PANDUAN IMPLEMENTASI PERBAIKAN - TAMBAH DATA IBU BARU

## ⚡ RINGKASAN CEPAT

Masalah yang diperbaiki:
1. ❌ React warning: "Each child in a list should have a unique key prop"
2. ❌ Error 500 saat simpan data ibu (duplicate key error)

Solusi:
1. ✅ Tambah key props di React component
2. ✅ Hapus unique constraint di database
3. ✅ Improve error handling backend

---

## 📦 FILE YANG HARUS DIUPDATE (5 file)

### Urutan Implementasi:

1. ✅ **Database** - SQL Migration
2. ✅ **Backend Model** - ibu.go  
3. ✅ **Backend Controller** - ibu_controller.go
4. ✅ **Frontend Component** - IbuCreate.jsx
5. ✅ **Restart Services**

---

## 🔧 IMPLEMENTASI STEP-BY-STEP

### LANGKAH 1: BACKUP DATABASE (PENTING!)

**Gunakan Supabase:**
1. Buka https://supabase.com
2. Login ke project
3. Sidebar > Settings > Backups
4. Klik "Create Backup"
5. Tunggu selesai (backup akan auto-saved)

**Atau gunakan CLI:**
```bash
pg_dump -U your_username -h db.xxxx.supabase.co -d postgres > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

### LANGKAH 2: JALANKAN SQL MIGRATION

**Via Supabase SQL Editor:**
1. Buka Supabase Dashboard
2. Click SQL Editor (sidebar)
3. Click "New Query"
4. Copy-paste semua kode dari bawah
5. Click "Run" (tombol biru kanan atas)
6. Tunggu sampai selesai (harus ada pesan "Success")

```sql
-- Migration: Fix Ibu table unique constraint
-- Purpose: Remove unique constraint on penduduk_id to allow multiple pregnancies
-- Safe to run multiple times

BEGIN;

-- Drop unique index if exists
DROP INDEX IF EXISTS ux_ibu_penduduk_id CASCADE;

-- Drop unique constraint if exists (alternative method)
ALTER TABLE IF EXISTS ibu DROP CONSTRAINT IF EXISTS uq_ibu_penduduk_id CASCADE;

-- Create regular index
CREATE INDEX IF NOT EXISTS idx_ibu_penduduk_id ON ibu(penduduk_id);
CREATE INDEX IF NOT EXISTS idx_ibu_status_kehamilan ON ibu(status_kehamilan);
CREATE INDEX IF NOT EXISTS idx_ibu_penduduk_created ON ibu(penduduk_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ibu_is_deleted ON ibu(is_deleted);

-- Add trigger untuk auto update timestamp
CREATE OR REPLACE FUNCTION set_ibu_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ibu_set_updated_at ON ibu;

CREATE TRIGGER trg_ibu_set_updated_at
BEFORE UPDATE ON ibu
FOR EACH ROW
EXECUTE FUNCTION set_ibu_updated_at();

COMMIT;
```

---

### LANGKAH 3: UPDATE BACKEND MODEL

**File: `backend/monolith/go-template-main/app/models/ibu.go`**

Buka file tersebut dan ganti **HANYA BARIS 6** dari:

```go
IDKependudukan  int32         `gorm:"column:penduduk_id;not null;uniqueIndex" json:"id_kependudukan"`
```

Menjadi:

```go
IDKependudukan  int32         `gorm:"column:penduduk_id;not null;index:idx_ibu_penduduk" json:"id_kependudukan"`
```

✅ Selesai, save file.

---

### LANGKAH 4: UPDATE BACKEND CONTROLLER

**File: `backend/monolith/go-template-main/app/controllers/ibu_controller.go`**

**OPSI A - Copy seluruh file baru (RECOMMENDED):**
1. Buka file `BACKEND_FILES_READY/ibu_controller.go`
2. Copy seluruh isinya
3. Buka `backend/monolith/go-template-main/app/controllers/ibu_controller.go`
4. Paste (replace seluruh isi)
5. Save

**OPSI B - Manual edit:**
Jika ingin merge manual, perubahan utama:

**Tambahkan import:**
```go
import (
	"fmt"
	...
)
```

**Ubah Create method dengan:**
- Tambah validasi: `if req.IDKependudukan == 0 {}`
- Tambah validasi: `if req.StatusKehamilan == "" {}`
- Tambah logging: `fmt.Printf("[IBU_CONTROLLER] Creating Ibu...)`
- Ubah error messages menjadi lebih jelas

---

### LANGKAH 5: UPDATE FRONTEND COMPONENT

**File: `PA3/web/react-kia/src/pages/Ibu/IbuCreate.jsx`**

**OPSI A - Copy file baru (EASIEST):**
1. Buka file: `IbuCreate.jsx.FIXED` 
2. Copy seluruh isinya
3. Buka: `PA3/web/react-kia/src/pages/Ibu/IbuCreate.jsx`
4. Paste (replace seluruh isi)
5. Save

**OPSI B - Manual edits:**

**Perubahan 1 - Import:**
```jsx
// Tambah: useCallback
import React, { useState, useEffect, useCallback } from "react";
```

**Perubahan 2 - Tambah state:**
```jsx
const [validationErrors, setValidationErrors] = useState({});
```

**Perubahan 3 - Key props pada options (PENTING!):**
```jsx
{kkList.map((kk) => (
  <option key={`kk-${kk.id_kependudukan}`} value={String(kk.id_kependudukan)}>
    {kk.nama_lengkap} — NIK: {kk.nik} — KK: {kk.no_kk}
  </option>
))}
```

**Perubahan 4 - Status kehamilan options dengan key:**
```jsx
<option key="trimester-1" value="TRIMESTER 1">TRIMESTER 1</option>
<option key="trimester-2" value="TRIMESTER 2">TRIMESTER 2</option>
<option key="trimester-3" value="TRIMESTER 3">TRIMESTER 3</option>
<option key="nifas" value="NIFAS">NIFAS</option>
```

**Perubahan 5 - Handler dengan useCallback & validasi:**
```jsx
const handleChangeIbu = useCallback((e) => {
  const { name, value } = e.target;
  setFormIbu((prev) => ({ ...prev, [name]: value }));
  setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  if (errorMessage) setErrorMessage("");
}, [errorMessage]);
```

**Perubahan 6 - Add logging di handleSubmitStep1:**
```jsx
console.log("Submitting payload:", payload);
const ibu = await createIbu(payload);
console.log("Response from createIbu:", ibu);
```

---

### LANGKAH 6: RESTART SERVICES

**Backend:**
```bash
# Jika menggunakan air (development mode)
# Terminal sudah harus running air, cukup save file dan akan auto-reload

# Atau restart manual:
# 1. Ctrl+C di terminal backend
# 2. cd backend/monolith/go-template-main
# 3. air
# Tunggu sampai ada pesan "✅ Building..."
```

**Frontend:**
```bash
# Jika sudah ada dev server
# File akan auto-reload setelah save

# Atau restart manual:
# 1. Ctrl+C di terminal frontend
# 2. cd PA3/web/react-kia
# 3. npm run dev
# Tunggu sampai ada pesan "ready in XXXms"
```

---

## ✅ VERIFIKASI PERBAIKAN

Setelah semua implementasi, test dengan:

### Test 1: Tidak ada React Warning
```
1. Buka browser
2. Buka URL: http://localhost:5173/data-ibu/create
3. Buka Developer Tools (F12 > Console)
4. Cari text: "Each child in a list should have a unique"
5. Seharusnya TIDAK ADA ❌ (jika ada, reload halaman)
```

### Test 2: Bisa Simpan Data Ibu Baru
```
1. Pilih penduduk dari dropdown
2. Pilih status kehamilan
3. Klik "Simpan & Lanjut"
4. Seharusnya BERHASIL tanpa error 500 ✅
5. Akan lanjut ke step 2 (Data Kehamilan)
```

### Test 3: Bisa Simpan Kehamilan
```
1. Isi data kehamilan (opsional)
2. Klik "Simpan Data Kehamilan" 
3. Seharusnya BERHASIL dan redirect ke detail ✅
```

### Test 4: Bisa Add Kehamilan Penduduk Sama
```
1. Kembali ke create page
2. Pilih PENDUDUK YANG SAMA seperti sebelumnya
3. Pilih status kehamilan BERBEDA (misal: TRIMESTER 2)
4. Klik "Simpan & Lanjut"
5. Seharusnya BERHASIL tanpa error 500 ✅
```

---

## 🐛 TROUBLESHOOTING

### Error: "Gagal menyimpan data ibu"

**Solusi:**
1. Pastikan SQL migration sudah dijalankan di database
2. Cek database apakah unique index sudah dihapus:
   ```sql
   SELECT indexname FROM pg_indexes WHERE tablename = 'ibu';
   -- Seharusnya TIDAK ada: ux_ibu_penduduk_id
   ```
3. Cek browser console (F12) untuk error detail
4. Cek backend logs di terminal

### Error: "Unauthorized"

**Solusi:**
1. Pastikan sudah login
2. Cek di browser localStorage apakah token ada
3. Refresh halaman

### React Warning tetap ada

**Solusi:**
1. Hard refresh browser: Ctrl+Shift+R (Windows) atau Cmd+Shift+R (Mac)
2. Clear browser cache
3. Pastikan file IbuCreate.jsx sudah benar (key props ada)

---

## 📁 STRUKTUR FILE YANG SUDAH DIPERBAIKI

```
Project Root
├── PERBAIKAN_LENGKAP_DOKUMENTASI.md (Dokumentasi detail)
├── PANDUAN_IMPLEMENTASI_SINGKAT.md (File ini)
├── BACKEND_FILES_READY/
│   ├── ibu.go (Model yang diperbaiki)
│   └── ibu_controller.go (Controller yang diperbaiki)
├── backend/
│   └── monolith/go-template-main/
│       ├── app/
│       │   ├── models/ibu.go (EDIT: hapus uniqueIndex)
│       │   └── controllers/ibu_controller.go (EDIT: GANTI SELURUH)
│       └── sql/
│           └── fix_ibu_unique_constraint.sql (BARU: Jalankan di DB)
└── PA3/web/react-kia/
    ├── src/pages/Ibu/
    │   ├── IbuCreate.jsx (EDIT: GANTI SELURUH)
    │   └── IbuCreate.jsx.FIXED (File referensi sudah diperbaiki)
```

---

## 📞 QUICK REFERENCE

| Issue | Solusi |
|-------|--------|
| React Warning key | Tambah `key={`id-${id}`}` pada setiap option |
| Error 500 duplicate key | Hapus `uniqueIndex`, jalankan SQL migration |
| Error Unauthorized | Login dulu, pastikan token ada |
| Data tidak tersimpan | Cek backend logs dan browser console |
| UI tidak update | Hard refresh: Ctrl+Shift+R |

---

## 🎉 SELESAI!

Setelah mengikuti semua langkah di atas, sistem seharusnya sudah berfungsi sempurna tanpa error.

**Status:** ✅ Siap Produksi

Jika masih ada masalah, buka file `PERBAIKAN_LENGKAP_DOKUMENTASI.md` untuk penjelasan lebih detail.
