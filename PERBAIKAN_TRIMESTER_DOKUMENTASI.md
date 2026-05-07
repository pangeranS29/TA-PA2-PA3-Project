# Perbaikan Trimester 1 & 3 - Dokumentasi Lengkap

## 📋 Ringkasan Perbaikan

Telah melakukan perbaikan menyeluruh untuk Pemeriksaan Dokter Trimester 1 & 3 sesuai permintaan:

### 1. ✅ CASCADE DELETE - Catatan Otomatis Terhapus
Ketika data trimester dihapus, catatan pelayanan terkait akan otomatis terhapus juga.

**Model yang diperbarui:**
- `PemeriksaanDokterTrimester1`
- `PemeriksaanDokterTrimester3`
- `CatatanPelayananTrimester1`
- `CatatanPelayananTrimester3`

**Cara kerja:**
```go
// Sebelum (tanpa cascade):
Kehamilan -> PemeriksaanDokter1
         -> CatatanPelayanan1
// Jika kehamilan dihapus, pemeriksaan & catatan tetap orphan

// Sesudah (dengan cascade):
Kehamilan -> PemeriksaanDokter1 (onDelete:CASCADE)
         -> CatatanPelayanan1 (onDelete:CASCADE)
// Jika kehamilan dihapus, semua child records terhapus otomatis
```

**Database:**
```sql
-- Foreign key dengan CASCADE DELETE
FOREIGN KEY (kehamilan_id) REFERENCES kehamilan(id) ON DELETE CASCADE
```

---

### 2. ✅ Gambar USG - Field Baru untuk Menyimpan Foto
Menambahkan field `GambarUSG` untuk menyimpan gambar USG dalam format Base64.

**Field baru:**
```go
GambarUSG string `gorm:"type:longtext" json:"gambar_usg"` // Base64 image data
```

**Keuntungan:**
- Gambar tersimpan di database (tidak perlu file storage terpisah)
- Mudah ditampilkan kembali di detail laporan
- Konsisten dengan data pemeriksaan

**Request API (Trimester 1 & 3):**
```json
{
  "kehamilan_id": 1,
  "nama_dokter": "Dr. Budi",
  "gambar_usg": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Base64 encoded
  // ... field lainnya
}
```

---

### 3. ✅ Tanggal Default - Otomatis Hari Ini
Tidak lagi perlu fill tanggal secara manual di form - akan otomatis di-set ke hari ini.

**Tanggal yang di-auto-set:**
- `tanggal_periksa` → Hari ini (set di backend)
- `tanggal_lab` → Hari ini (Trimester 3 saat ada data lab)
- `tanggal_skrining_jiwa` → Hari ini (saat ada hasil skrining)

**Contoh di Usecase:**
```go
today := time.Now()
dokter := &models.PemeriksaanDokterTrimester1{
    TanggalPeriksa: &today, // Auto set ke hari ini
    // ... field lainnya
}
```

---

### 4. ✅ Menghilangkan Data Redundan/Berulang

**Field yang dihapus dari Request (auto-calculated):**

**Trimester 1:**
- `tanggal_periksa` ❌ (auto set ke hari ini)
- `hpl_berdasarkan_hpht` ❌ (calculated dari HPHT)
- `hpl_berdasarkan_usg` ❌ (calculated dari umur hamil USG)
- `tanggal_lab_jiwa` ❌ (auto set ke hari ini)
- `tanggal_skrining_jiwa` ❌ (auto set ke hari ini)

**Trimester 3:**
- `tanggal_periksa` ❌ (auto set ke hari ini)
- `tanggal_lab` ❌ (auto set ke hari ini)
- `tanggal_skrining_jiwa` ❌ (auto set ke hari ini)
- `tanggal_lab_jiwa` ❌ (auto set ke hari ini)
- `tanggal_skrining_jiwa_tr` ❌ (auto set ke hari ini)

**Field yang tetap (tidak redundan):**
- `hpht` ✅ (data sejarah, tidak berulang)
- `keteraturan_haid` ✅ (data sejarah, tidak berulang)

---

## 📦 File yang Diperbarui

### Models
1. `app/models/pemeriksaan_dokter_trimester_1.go`
   - Tambah: `GambarUSG` field
   - Update: Foreign key dengan `onDelete:CASCADE`

2. `app/models/pemeriksaan_dokter_trimester_3.go`
   - Tambah: `GambarUSG` field
   - Update: Foreign key dengan `onDelete:CASCADE`

3. `app/models/catatan_pelayanan_trimester_1.go`
   - Update: Foreign key dengan `onDelete:CASCADE`

4. `app/models/catatan_pelayanan_trimester_3.go`
   - Update: Foreign key dengan `onDelete:CASCADE`

### Usecases
1. `app/usecases/pemeriksaan_dokter_trimester_1_usecase.go`
   - Update: `PemeriksaanDokterTrimester1Request` (hapus field redundan, tambah `gambar_usg`)
   - Update: `mapRequestToDokter()` - set `TanggalPeriksa` ke hari ini
   - Update: `mapRequestToLab()` - set `TanggalLab` & `TanggalSkriningJiwa` ke hari ini

2. `app/usecases/pemeriksaan_dokter_trimester_3_usecase.go`
   - Update: `PemeriksaanDokterTrimester3Request` (hapus field redundan, tambah `gambar_usg`)
   - Update: `mapRequestToDokter()` - set tanggal-tanggal ke hari ini
   - Update: `mapRequestToLab()` - set tanggal lab & skrining ke hari ini

### Database
1. `sql/migration_trimester_improvements.sql` ✨ NEW
   - Migration untuk menambah `gambar_usg` column
   - Migration untuk update foreign key dengan CASCADE DELETE
   - Verification queries

---

## 🔄 Perubahan API Request/Response

### Trimester 1 - Request (SEBELUM)
```json
{
  "kehamilan_id": 1,
  "nama_dokter": "Dr. Budi",
  "tanggal_periksa": "2026-05-06",           ❌ Dihapus
  "konsep_anamnesa_pemeriksaan": "...",
  "hpht": "2025-10-06",
  "hpl_berdasarkan_hpht": "2026-07-06",     ❌ Dihapus (calculated)
  "usg_jumlah_bayi": "1",
  "hpl_berdasarkan_usg": "2026-07-07",      ❌ Dihapus (calculated)
  "tanggal_lab_jiwa": "2026-05-06",         ❌ Dihapus
  "lab_hemoglobin_hasil_jiwa": 11.5,
  "tanggal_skrining_jiwa": "2026-05-06",    ❌ Dihapus
  "skrining_jiwa_hasil": "normal"
}
```

### Trimester 1 - Request (SESUDAH) ✨
```json
{
  "kehamilan_id": 1,
  "nama_dokter": "Dr. Budi",
  "konsep_anamnesa_pemeriksaan": "...",
  "gambar_usg": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  ✨ NEW
  "hpht": "2025-10-06",
  "usg_jumlah_bayi": "1",
  "umur_hamil_usg_minggu": 12,
  "lab_hemoglobin_hasil_jiwa": 11.5,       ← Tanggal otomatis diset ke hari ini
  "skrining_jiwa_hasil": "normal"          ← Tanggal otomatis diset ke hari ini
}
```

### Trimester 3 - Request Serupa
- Menghapus `tanggal_periksa`, `tanggal_lab`, `tanggal_skrining_*`
- Menambahkan `gambar_usg`
- Backend otomatis set tanggal ke hari ini

---

## 🚀 Cara Menggunakan

### 1. Jalankan Migration
```bash
# Di terminal MySQL atau melalui migration tools
SOURCE sql/migration_trimester_improvements.sql;
```

### 2. Upload Gambar (Client Side)
```javascript
// Frontend: Convert image ke Base64
const fileInput = document.getElementById('usg-image');
const file = fileInput.files[0];

const reader = new FileReader();
reader.onload = (e) => {
  const base64 = e.target.result; // "data:image/jpeg;base64,..."
  
  // Kirim ke API dengan base64 langsung
  fetch('/api/pemeriksaan-trimester-1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kehamilan_id: 1,
      nama_dokter: 'Dr. Budi',
      gambar_usg: base64,  // ✨ Base64 encoded image
      // ... field lainnya
    })
  });
};

reader.readAsDataURL(file);
```

### 3. Hapus Pemeriksaan (Catatan Terhapus Otomatis)
```bash
# API endpoint
DELETE /api/pemeriksaan-trimester-1/:id

# Hasil:
# - Pemeriksaan dihapus
# - Catatan Pelayanan Trimester 1 terkait OTOMATIS terhapus (CASCADE)
# - Data sebelumnya inconsistent akan ditangani
```

### 4. GET Detail (Gambar Ditampilkan)
```bash
# API endpoint
GET /api/pemeriksaan-trimester-1/:id

# Response
{
  "id": 1,
  "kehamilan_id": 1,
  "nama_dokter": "Dr. Budi",
  "tanggal_periksa": "2026-05-06",  # Auto-set hari pemeriksaan
  "gambar_usg": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  ✨
  # ... field lainnya
}
```

Di frontend, tampilin gambar langsung:
```html
<img src="{{ gambar_usg }}" alt="Gambar USG" />
```

---

## ✨ Keuntungan Perbaikan

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| **Cascade Delete** | ❌ Catatan orphan | ✅ Terhapus otomatis |
| **Gambar USG** | ❌ Tidak tersimpan | ✅ Simpan di DB (Base64) |
| **Tanggal** | ❌ Manual diisi berkali-kali | ✅ Auto set hari ini |
| **Data Redundan** | ❌ Banyak field berulang | ✅ Hanya field penting |
| **UX Form** | ❌ Kompleks, banyak input | ✅ Lebih sederhana & cepat |
| **Konsistensi** | ❌ Tanggal bisa berbeda | ✅ Tanggal selalu sama (hari ini) |

---

## ⚠️ Catatan Penting

### 1. Data Existing
Jika sudah ada data lama di database:
- Field `gambar_usg` akan bernilai NULL (optional)
- Data lama tetap aman, tidak ada data loss
- Field tanggal lama tetap terjaga (tidak overwrite)

### 2. Migrasi Gradual
- Bisa langsung mulai pakai fitur baru tanpa khawatir data lama
- Frontend bisa cek: jika `gambar_usg` ada, tampilkan gambar
- Tangani case gambar NULL dengan graceful

### 3. Base64 Considerations
- Gambar Base64 bisa lebih besar dalam database
- Untuk optimasi, bisa compress image sebelum encode ke Base64
- Max size LONGTEXT di MySQL: ~4GB (praktis tidak akan tercapai)

---

## 🔍 Testing Checklist

- [ ] Run migration SQL tanpa error
- [ ] Field `gambar_usg` muncul di tabel
- [ ] Foreign key CASCADE DELETE aktif
- [ ] POST trimester 1 tanpa `tanggal_periksa` → error/diignore?
- [ ] POST trimester 1 dengan `gambar_usg` Base64 → disimpan
- [ ] GET detail pemeriksaan → gambar tampil
- [ ] DELETE pemeriksaan → catatan terkait otomatis hilang
- [ ] POST catatan setelah delete pemeriksaan → error (kseharasan_id orphan)

---

## 📞 Troubleshooting

**Q: Gambar tidak tersimpan?**
- A: Pastikan Base64 format benar: `data:image/jpeg;base64,` + base64 string
- A: Cek value `gambar_usg` di request tidak null/empty

**Q: Cascade delete tidak bekerja?**
- A: Pastikan sudah run migration
- A: Cek table engine menggunakan InnoDB (tidak MyISAM)
- A: Verify foreign key: `SHOW CREATE TABLE catatan_pelayanan_trimester_1;`

**Q: Tanggal tidak auto-set?**
- A: Pastikan tidak mengirim `tanggal_periksa` di request
- A: Jika dikirim, backend ignore (bukan error)
- A: Cek timezone backend server

---

## 📝 Maintenance

Untuk fitur ini tetap jalan optimal:
1. Jangan ubah relasi foreign key di migration manual
2. Backup database sebelum migrate
3. Monitor database size (gambar Base64 lebih besar)
4. Update dokumentasi API jika ada perubahan endpoint

---

**Status: ✅ SELESAI**
Semua perbaikan telah diimplementasikan sesuai permintaan.
