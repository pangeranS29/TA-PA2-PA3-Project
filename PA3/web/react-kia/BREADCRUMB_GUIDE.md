# Panduan Navigasi Breadcrumb

## Overview
Sistem breadcrumb navigation otomatis mengikuti path URL dan menampilkan navigasi hierarki halaman. Komponen ini terletak di `src/components/Breadcrumb.jsx` dan sudah terintegrasi dengan `MainLayout`.

## Fitur Utama

✅ **Otomatis**: Breadcrumb secara otomatis terbentuk dari path URL
✅ **Smart ID Handling**: Mengabaikan UUID/numeric IDs dari breadcrumb untuk tampilan lebih rapi
✅ **Responsive**: Desain responsif yang bekerja di semua ukuran layar
✅ **Accessible**: Menggunakan semantic HTML dan ARIA attributes
✅ **Clickable Navigation**: Dapat klik untuk navigasi ke halaman sebelumnya
✅ **Customizable Labels**: Label dapat dikustomisasi melalui mapping

## Cara Kerja

### 1. Path Parsing
Breadcrumb mengubah path URL menjadi segments:
```
/data-anak/pertumbuhan/123e4567-e89b-12d3-a456-426614174000
                    ↓
[data-anak, pertumbuhan, 123e4567-e89b-12d3-a456-426614174000]
```

### 2. ID Detection
IDs (UUID dan numeric) secara otomatis diabaikan:
```
Segments: [data-anak, pertumbuhan, 123e4567-e89b-12d3-a456-426614174000]
                                   ↑ Ini adalah ID, diabaikan
Breadcrumb: Home > Data Anak > Pertumbuhan
```

### 3. Label Mapping
Setiap segment di-map ke label user-friendly:
```
Mapping: {
  "data-anak": "Data Anak",
  "pertumbuhan": "Pertumbuhan",
}
```

### 4. Display Logic
- Halaman terakhir: **tidak clickable** (current page)
- Halaman sebelumnya: **clickable** untuk navigasi kembali
- Home icon: Selalu ada untuk kembali ke dashboard

## Struktur Breadcrumb Labels

Labels diorganisir per kategori:

### Dashboard & Main
```javascript
dashboard: "Dashboard",
admin: "Admin",
dokter: "Dokter",
```

### Data Management
```javascript
"data-ibu": "Data Ibu",
"data-anak": "Data Anak",
kependudukan: "Kependudukan",
```

### Ibu - Skrining & Pemeriksaan
```javascript
"skrining-preeklampsia": "Skrining Preeklampsia",
"pemeriksaan-fisik": "Pemeriksaan Fisik",
```

### Anak - Pelayanan
```javascript
pertumbuhan: "Pertumbuhan",
neonatus: "Kesehatan Neonatus",
"pelayanan-gizi": "Pelayanan Gizi",
"pelayanan-vitamin": "Pelayanan Vitamin",
```

### Edukasi Digital
```javascript
"edukasi-digital": "Edukasi Digital",
mpasi: "MPASI",
"mpasi-aturan-porsi": "Aturan Porsi MPASI",
```

### Actions
```javascript
create: "Tambah Baru",
edit: "Edit",
detail: "Detail",
form: "Form",
```

## Menambah Route Baru

### Langkah 1: Tambah Route di App.jsx
```jsx
<Route path="/data-anak/pertumbuhan/:id" element={<PertumbuhanIndex />} />
```

### Langkah 2: Tambah Label di Breadcrumb.jsx
```javascript
const breadcrumbLabels = {
  // ... existing labels
  
  // Anak - Pertumbuhan & Kesehatan
  pertumbuhan: "Pertumbuhan",  // ← Tambah di sini
};
```

### Langkah 3: Test
Navigasi ke route tersebut dan verifikasi breadcrumb menampilkan label yang benar.

## Contoh Penggunaan

### Contoh 1: Data Ibu - Skrining
```
Path: /data-ibu/123/skrining-preeklampsia
      ↓
Breadcrumb: Home > Data Ibu > Skrining Preeklampsia
```

### Contoh 2: Data Anak - Pertumbuhan
```
Path: /data-anak/pertumbuhan/456
      ↓
Breadcrumb: Home > Data Anak > Pertumbuhan
             (ID 456 diabaikan)
```

### Contoh 3: Edukasi Digital - MPASI
```
Path: /edukasi-digital/mpasi/create
      ↓
Breadcrumb: Home > Edukasi Digital > MPASI > Tambah Baru
```

## Halaman yang TIDAK Menampilkan Breadcrumb

Breadcrumb sengaja tidak ditampilkan di halaman:
- `/dashboard`
- `/dashboard/bidan`
- `/dashboard/admin`
- `/dashboard/dokter`

Ini karena breadcrumb tidak perlu di halaman utama dashboard.

## Styling & Customization

### Warna
```javascript
// Home link
className="text-indigo-600 hover:text-indigo-700"

// Middle links
className="text-indigo-600 hover:text-indigo-700"

// Current page
className="text-gray-700"
```

### Background
```javascript
className="bg-gradient-to-r from-gray-50 to-white"
```

### Responsive
```javascript
// Hide text on small screens, show icon only
<span className="hidden sm:inline">{item.label}</span>
<span className="sm:hidden">Home</span>
```

## Helper Functions

### formatLabel()
Mengubah segment dengan hyphens menjadi Title Case:
```javascript
formatLabel("data-anak")
// Output: "Data Anak"

formatLabel("pertumbuhan")
// Output: "Pertumbuhan"
```

Fungsi ini otomatis digunakan jika label tidak ada di mapping.

## Best Practices

1. **Selalu tambahkan label ke mapping** - Jangan andalkan auto-formatting
2. **Gunakan slug yang konsisten** - Lowercase dengan hyphens
3. **Kelompokkan label per kategori** - Untuk maintainability
4. **Test setiap route baru** - Verifikasi breadcrumb tampil dengan benar
5. **Hindari ID di breadcrumb** - IDs ditangani otomatis

## Troubleshooting

### Breadcrumb tidak muncul
- Pastikan route ada di `App.jsx`
- Pastikan path tidak ada di daftar halaman exception
- Check console untuk error

### Label salah ditampilkan
- Verifikasi label ada di `breadcrumbLabels` mapping
- Pastikan key match dengan path segment
- Perhatikan capitalization (case-sensitive)

### Link tidak berfungsi
- Pastikan route sudah didefinisikan di `App.jsx`
- Verifikasi component tidak ada error

## Maintenance

### Ketika menambah feature baru:
1. ✅ Tambah route di `App.jsx`
2. ✅ Tambah label di `Breadcrumb.jsx`
3. ✅ Test navigasi
4. ✅ Update dokumentasi ini jika perlu

### Ketika refactor route:
1. ✅ Update path di `App.jsx`
2. ✅ Update label key di `Breadcrumb.jsx`
3. ✅ Update semua Link yang merujuk ke route lama

## Kontak & Support

Untuk pertanyaan tentang breadcrumb navigation, lihat:
- Component: `src/components/Breadcrumb.jsx`
- Layout: `src/components/Layout/MainLayout.jsx`
- Router: `src/App.jsx`

---

**Last Updated**: 2026-05-17
**Status**: ✅ Production Ready
