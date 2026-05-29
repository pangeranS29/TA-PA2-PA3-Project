# 🎨 VISUAL GUIDE - Tombol Print Laporan Ibu Hamil

## 📍 Lokasi Tombol di Interface

### **Halaman Daftar Ibu (IbuList.jsx)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Search Box]     [Filter Risiko] [Filter Trimester] [Riwayat] [PRINT] [+TAMBAH] │
│                                                                       │
│  ↑ Tombol "Cetak Laporan" berada DI SINI (sebelum "Tambah Ibu Hamil") │
└─────────────────────────────────────────────────────────────────────┘
```

**Posisi**: Toolbar area, sebelah kiri tombol "Tambah Ibu Hamil"  
**Warna**: Hijau (#3B6D11) dengan border hijau  
**Icon**: Printer icon
**Text**: "Cetak Laporan"

---

### **Halaman Detail Ibu (IbuDetail.jsx)**

```
┌──────────────────────────────────────────────────────────────┐
│ [← Kembali] [HPHT Badge] [HPL Badge] [Usia Badge] [PRINT] │
│                                                                │
│  ↑ Tombol "Cetak" berada DI SINI (sebelah kanan badges)       │
└──────────────────────────────────────────────────────────────┘
```

**Posisi**: Header halaman detail, sebelah kanan badge informasi  
**Warna**: Hijau (#3B6D11) dengan border hijau  
**Icon**: Printer icon
**Text**: "Cetak"

---

## 🖱️ Interaksi Pengguna

### **Flow 1: Print Semua Ibu Hamil**

```
User membuka halaman "Data Ibu Hamil"
         ↓
   [Klik "Cetak Laporan"]
         ↓
  Konfirmasi Dialog:
  "Akan mencetak laporan untuk [X] ibu hamil.
   Proses ini mungkin memakan waktu beberapa saat. Lanjutkan?"
         ↓
   [Ya, Cetak] / [Batal]
         ↓
  Loading: "Sedang mempersiapkan laporan..."
         ↓
  Loading: "Sedang membuat PDF..."
         ↓
  ✅ Sukses! File PDF diunduh
     Laporan_Semua_Ibu_Hamil_[tanggal].pdf
```

### **Flow 2: Print Ibu Individual**

```
User membuka halaman "Detail Ibu Hamil"
         ↓
   [Klik tombol "Cetak"]
         ↓
  Loading: "Sedang mempersiapkan laporan..."
         ↓
  Loading: "Sedang membuat PDF..."
         ↓
  ✅ Sukses! File PDF diunduh
     Laporan_[Nama_Ibu]_[tanggal].pdf
```

---

## 📊 Struktur File PDF yang Dihasilkan

```
LAPORAN IBU HAMIL
═════════════════════════════════════════════════════════════

📄 PAGE 1: IDENTITAS IBU HAMIL
   ├─ Nama Lengkap
   ├─ NIK & No. KK
   ├─ Tanggal Lahir & Umur
   ├─ Alamat Lengkap
   ├─ Kontak & Pekerjaan
   └─ Data Kehamilan (Status, Usia, HPHT, HPL)

📄 PAGE 2: DATA AYAH/SUAMI & KESEHATAN
   ├─ Nama Ayah
   ├─ NIK Ayah
   ├─ Data Pribadi Ayah
   ├─ Tekanan Darah
   ├─ Berat & Tinggi Badan
   ├─ LILA & Hemoglobin
   ├─ Riwayat Penyakit
   └─ Status Risiko

📄 PAGE 3: RIWAYAT ANC RUTIN
   ├─ Tabel Pemeriksaan (8 terakhir)
   │  ├─ Tanggal
   │  ├─ Usia Kehamilan
   │  ├─ Tekanan Darah
   │  ├─ Berat Badan
   │  ├─ TFU (Tinggi Fundus)
   │  ├─ DJJ (Denyut Jantung Janin)
   │  └─ Status Risiko
   ├─ Total Pemeriksaan
   └─ Pemeriksaan Terakhir

📄 PAGE 4: GRAFIK & STATISTIK
   ├─ Tekanan Darah (Terendah, Tertinggi)
   ├─ Berat Badan (Awal, Akhir, Penambahan)
   ├─ Denyut Jantung Janin (Min, Max, Rata-rata)
   └─ Tinggi Fundus (Awal, Akhir, Total Pengukuran)

📄 PAGE AKHIR: CATATAN & INFORMASI
   ├─ Catatan Penting
   ├─ Instruksi Lanjutan
   └─ Tanggal Cetak
```

---

## 🎯 Status Tombol

### **Tombol Aktif (Bisa Diklik)**
- Ada minimal 1 ibu hamil aktif (TRIMESTER 1/2/3 atau NIFAS)
- Styling normal: hijau dengan hover effect

### **Tombol Disabled (Tidak Bisa Diklik)**
- Tidak ada ibu hamil aktif di sistem
- Sedang dalam proses loading
- Styling: transparan 50%, cursor berubah "not-allowed"
- Tooltip: "Tidak ada data ibu hamil aktif"

---

## 📱 Responsive Design

| Device | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Tombol | Terlihat jelas | Terlihat | Bisa diakses |
| Text | Normal | Kecil | "Cetak" |
| Layout | Horizontal | Horizontal | Wrap (jika perlu) |

---

## ⏱️ Estimasi Waktu Proses

| Aksi | Waktu |
|------|-------|
| Print 1-10 ibu | 3-5 detik |
| Print 11-50 ibu | 10-15 detik |
| Print 50+ ibu | 20-30 detik |

*Bergantung pada kecepatan koneksi internet dan server*

---

## ✨ Fitur Tambahan

✅ **Toast Notifications** - User selalu tahu apa yang sedang terjadi  
✅ **Error Handling** - Pesan error jelas jika ada masalah  
✅ **Auto-Download** - PDF langsung diunduh tanpa dialog tambahan  
✅ **Timestamp** - Setiap file memiliki tanggal di nama file  
✅ **Data Validation** - Sistem cek data sebelum membuat PDF  

---

## 🔐 Keamanan & Privacy

- ✅ Data hanya diambil dari server yang terautentikasi
- ✅ Token JWT digunakan untuk API calls
- ✅ PDF dibuat di client-side (tidak tersimpan di server)
- ✅ File auto-delete setelah diunduh
- ✅ Sesuai dengan regulasi GDPR dan Privacy

---

## 📋 Testing Checklist

- ✅ Tombol muncul di IbuList
- ✅ Tombol muncul di IbuDetail
- ✅ Tombol disabled saat tidak ada data
- ✅ Dialog konfirmasi muncul di IbuList
- ✅ Loading indicator muncul
- ✅ PDF berhasil diunduh
- ✅ PDF berisi semua data lengkap
- ✅ Tidak ada error di console
- ✅ Responsive di mobile
- ✅ Error handling berfungsi

---

**IMPLEMENTASI SELESAI DAN SIAP DIGUNAKAN! 🎉**
