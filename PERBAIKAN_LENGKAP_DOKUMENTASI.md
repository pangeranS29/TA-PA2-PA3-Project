# DOKUMENTASI PERBAIKAN SYSTEM - TAMBAH DATA IBU BARU

**Tanggal:** 27 April 2026
**Status:** Sudah diperbaiki dan siap diimplementasikan
**Versi:** 1.0

---

## 📋 RINGKASAN MASALAH

### Masalah 1: React Warning - Missing Key Props
**Gejala:** 
```
Each child in a list should have a unique "key" prop.
Check the render method of `select`. It was passed a child from IbuCreate.
```

**Root Cause:** 
- Element `<option>` di dalam `<select>` tidak memiliki `key` prop yang stabil
- Ketika state berubah, React tidak bisa mengidentifikasi element mana yang berubah

**Solusi:**
- Menambahkan `key` prop yang unik dan stabil pada setiap `<option>`
- Menggunakan format: `key={`${prefix}-${id}`}`
- Contoh: `key={`kk-${kk.id_kependudukan}`}`

---

### Masalah 2: 500 Internal Server Error saat Simpan
**Gejala:**
```
POST http://localhost:8080/tenaga-kesehatan/ibu 500 (Internal Server Error)
```

**Root Cause:**
1. **Database Constraint Violation**: Model `Ibu` memiliki `uniqueIndex` pada kolom `IDKependudukan`
   - Ini mencegah satu penduduk memiliki lebih dari satu record ibu
   - Padahal satu orang bisa hamil berkali-kali (kehamilan berbeda tahun)
   
2. **Error Handling Tidak Jelas**: Backend tidak memberikan pesan error yang informatif

**Solusi:**
- Menghapus `uniqueIndex` dari field `IDKependudukan` di model Ibu
- Menggantinya dengan regular `index` untuk performa query
- Menambahkan SQL migration untuk fix database yang sudah ada
- Meningkatkan error handling di controller

---

## 🛠️ DAFTAR PERUBAHAN FILE

### A. FRONTEND (React)

#### File: `PA3/web/react-kia/src/pages/Ibu/IbuCreate.jsx`

**Perubahan:**
1. ✅ Import `useCallback` dari React untuk optimasi
2. ✅ Tambah state `validationErrors` untuk validasi form
3. ✅ Update `useEffect` untuk fetch data dengan error handling lebih baik
4. ✅ Ganti `handleChangeIbu` dan `handleChangeKehamilan` menggunakan `useCallback`
5. ✅ Tambahkan validasi lengkap di `handleSubmitStep1`
6. ✅ Tambahkan console.log untuk debugging
7. ✅ Tambahkan key props yang stabil pada semua list items
8. ✅ Tambahkan error display UI dengan styling
9. ✅ Tambahkan conditional rendering untuk empty data

**Line perubahan penting:**
- Line 1-9: Import yang ditambah
- Line 18: Tambah validationErrors state
- Line 44-49: Fetch KK dengan error handling
- Line 69-79: UseCallback untuk handleChangeIbu
- Line 81-87: UseCallback untuk handleChangeKehamilan
- Line 89-148: handleSubmitStep1 dengan validasi lengkap
- Line 150-208: handleSubmitStep2 dengan error handling
- Line 235-239: Key props untuk option elements (PENTING!)
- Line 243-261: Option elements dengan key props
- Line 310-328: Error message display dengan styling

---

### B. BACKEND (Go)

#### File 1: `backend/monolith/go-template-main/app/models/ibu.go`

**Perubahan:**
- Baris 6: Hapus `uniqueIndex` dari `IDKependudukan`
- Baris 6: Ganti dengan `index:idx_ibu_penduduk` untuk regular index

**Before:**
```go
IDKependudukan  int32         `gorm:"column:penduduk_id;not null;uniqueIndex" json:"id_kependudukan"`
```

**After:**
```go
IDKependudukan  int32         `gorm:"column:penduduk_id;not null;index:idx_ibu_penduduk" json:"id_kependudukan"`
```

---

#### File 2: `backend/monolith/go-template-main/app/controllers/ibu_controller.go`

**Perubahan:**
1. ✅ Tambahkan import `fmt`
2. ✅ Tambahkan validasi input di Create method
3. ✅ Tambahkan console logging untuk debugging
4. ✅ Improve error messages di semua response
5. ✅ Add `Message` field ke semua response untuk konsistensi
6. ✅ Tambahkan deskripsi method sebagai dokumentasi

**Bagian Create method yang diubah:**
- Tambah validasi: `id_kependudukan` harus > 0
- Tambah validasi: `status_kehamilan` tidak boleh kosong
- Tambah logging: `fmt.Println` untuk debug
- Improve error response dengan pesan yang lebih jelas
- Tambah `Message` field di response

**Line perubahan penting:**
- Line 1-6: Import dan dokumentasi
- Line 34-53: Validasi input
- Line 55-56: Logging untuk debugging
- Line 58-66: Error handling dengan logging
- Line 70: Response dengan Message field

---

#### File 3: `backend/monolith/go-template-main/sql/fix_ibu_unique_constraint.sql` (FILE BARU)

**Tujuan:** Fix database yang sudah ada dan mencegah error duplicate key

**Isi:**
- Drop unique index jika ada: `DROP INDEX IF EXISTS ux_ibu_penduduk_id CASCADE`
- Drop unique constraint jika ada (metode alternative)
- Create regular index untuk performa: `CREATE INDEX idx_ibu_penduduk_id ON ibu(penduduk_id)`
- Create additional indexes untuk sering-dicari fields
- Create composite index: `idx_ibu_penduduk_created`
- Create index untuk soft delete: `idx_ibu_is_deleted`
- Add trigger untuk auto update timestamp

---

## 📝 LANGKAH IMPLEMENTASI LENGKAP

### STEP 1: Backup Database (WAJIB DILAKUKAN)
```bash
# Untuk PostgreSQL
pg_dump -U username -h localhost database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Atau gunakan UI Supabase jika menggunakan Supabase
# Dashboard -> Database -> Backups -> Create backup
```

### STEP 2: Execute SQL Migration di Database
```bash
# Via psql CLI:
psql -U username -h localhost -d database_name -f sql/fix_ibu_unique_constraint.sql

# Atau via Supabase SQL Editor:
# 1. Login ke Supabase Dashboard
# 2. Buka SQL Editor
# 3. Copy-paste isi file fix_ibu_unique_constraint.sql
# 4. Klik "Run"
```

### STEP 3: Update Model Ibu (Backend)
1. Buka file: `backend/monolith/go-template-main/app/models/ibu.go`
2. Ubah line 6 dari `uniqueIndex` menjadi `index:idx_ibu_penduduk`
3. Save file

### STEP 4: Update Controller Ibu (Backend)
1. Buka file: `backend/monolith/go-template-main/app/controllers/ibu_controller.go`
2. Replace seluruh isi file dengan versi yang sudah diperbaiki
3. Pastikan ada:
   - Import `"fmt"`
   - Validasi input di Create method
   - Console logging
   - Error messages yang jelas
4. Save file

### STEP 5: Restart Backend Service
```bash
# Jika menggunakan air
air

# Atau jika build manual:
cd backend/monolith/go-template-main
go mod tidy
go run cmd/main.go
```

### STEP 6: Update Frontend Component
1. Buka file: `PA3/web/react-kia/src/pages/Ibu/IbuCreate.jsx`
2. Option A (Recommended): Copy dari file IbuCreate.jsx yang sudah diperbaiki
   - File: `IbuCreate.jsx.FIXED`
   - Replace seluruh isi file

3. Option B: Merge manual
   - Catat semua perubahan di atas
   - Apply satu per satu

4. Save file

### STEP 7: Restart Frontend Service
```bash
# Terminal akan auto-reload jika sudah ada dev server berjalan
# Jika belum, jalankan:
npm run dev
```

### STEP 8: Testing
1. Buka browser dev console (F12)
2. Navigate ke: http://localhost:5173/data-ibu/create
3. Pilih penduduk yang sama untuk kehamilan kedua
4. Pastikan tidak ada error 500
5. Pastikan tidak ada React warning tentang key

---

## ✅ CHECKLIST VERIFIKASI

Setelah implementasi, pastikan:

- [ ] Database backup sudah dibuat sebelum migration
- [ ] SQL migration sudah dijalankan tanpa error
- [ ] Model Ibu sudah diupdate (index bukan uniqueIndex)
- [ ] Controller Ibu sudah diupdate dengan validasi dan logging
- [ ] Backend sudah di-restart
- [ ] Frontend component sudah diupdate
- [ ] Frontend sudah di-restart
- [ ] React console tidak ada warning "Each child in a list should have a unique key prop"
- [ ] Bisa add data ibu baru tanpa 500 error
- [ ] Bisa add kehamilan dengan penduduk yang sama (test dengan 2 records berbeda tahun)
- [ ] Error messages dari server bisa dilihat di frontend
- [ ] Console logs ada di browser dev console untuk debugging

---

## 🔍 DEBUGGING TIPS

Jika masih ada error setelah implementasi:

### Frontend Console (Browser Dev Tools - F12)
- Lihat tab "Console" untuk error messages
- Lihat tab "Network" untuk response dari API
- Cari keyword "Error", "failed", "500"
- Console logs sudah di-setup untuk menampilkan:
  - `console.log("Submitting payload:", payload)`
  - `console.error("Error in handleSubmitStep1:", err)`

### Backend Logs
- Lihat output di terminal backend
- Cari keyword "Error creating ibu"
- Lihat console.log untuk debug value sebelum create

### Database Check
Untuk verifikasi unik constraint sudah dihapus:
```sql
-- PostgreSQL: List all indexes pada tabel ibu
SELECT indexname FROM pg_indexes WHERE tablename = 'ibu';

-- Pastikan tidak ada index dengan nama: ux_ibu_penduduk_id
-- Seharusnya ada: idx_ibu_penduduk, idx_ibu_status_kehamilan, dll
```

---

## 📊 PERBANDINGAN BEFORE & AFTER

### BEFORE (Error)
```
❌ React Warning: Each child in a list should have a unique "key" prop
❌ POST 500 Error saat add data ibu dengan penduduk yang sudah terdaftar
❌ Error message tidak jelas dari server
❌ Tidak ada validasi input di frontend
```

### AFTER (Fixed)
```
✅ Tidak ada React warning
✅ Bisa add multiple records dengan penduduk yang sama (kehamilan berbeda)
✅ Error message jelas dan informatif
✅ Validasi input di frontend dan backend
✅ Logging untuk debugging
✅ Better UX dengan error display
```

---

## 📞 SUPPORT & QUESTIONS

Jika ada masalah:
1. Cek kembali semua file yang sudah diubah
2. Pastikan backup database sudah ada
3. Verifikasi SQL migration berjalan tanpa error
4. Cek browser console untuk error messages
5. Cek backend logs untuk server-side error
6. Cek network tab untuk response yang diterima

---

## 📄 FILE-FILE YANG PERLU DIUPDATE

```
✅ PA3/web/react-kia/src/pages/Ibu/IbuCreate.jsx
✅ backend/monolith/go-template-main/app/models/ibu.go
✅ backend/monolith/go-template-main/app/controllers/ibu_controller.go
✅ backend/monolith/go-template-main/sql/fix_ibu_unique_constraint.sql (BARU)
```

---

**Status Akhir:** ✅ SIAP DIIMPLEMENTASIKAN - Semua perbaikan sudah dikompilasi lengkap.
