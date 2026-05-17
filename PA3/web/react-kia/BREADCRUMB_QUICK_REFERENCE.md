# Breadcrumb Navigation - Quick Reference

## 📍 Lokasi Files

| File | Lokasi | Fungsi |
|------|--------|--------|
| **Breadcrumb Component** | `src/components/Breadcrumb.jsx` | Main breadcrumb logic |
| **MainLayout** | `src/components/Layout/MainLayout.jsx` | Integration point |
| **Documentation** | `BREADCRUMB_GUIDE.md` | Complete guide |
| **Implementation** | `BREADCRUMB_IMPLEMENTATION.md` | Implementation details |

## 🚀 Mulai Cepat

### Tambah Route Baru

```jsx
// 1. Di App.jsx
<Route path="/data-anak/pertumbuhan/:id" element={<PertumbuhanIndex />} />

// 2. Di Breadcrumb.jsx
const breadcrumbLabels = {
  // ... existing labels
  pertumbuhan: "Pertumbuhan",  // ← Tambah di sini
};
```

**Selesai!** Breadcrumb otomatis bekerja.

## 🔄 Bagaimana Breadcrumb Bekerja

```
/data-anak/pertumbuhan/123
          ↓
Step 1: Split path → [data-anak, pertumbuhan, 123]
Step 2: Filter IDs  → [data-anak, pertumbuhan]
Step 3: Map labels  → [Data Anak, Pertumbuhan]
Step 4: Display     → Home > Data Anak > Pertumbuhan
```

## 📋 Label Categories

```javascript
// Dashboard & Main
dashboard, admin, dokter

// Data Management
data-ibu, data-anak, kependudukan, daftar-anak

// Ibu Services
skrining-preeklampsia, pemeriksaan-fisik, grafik-evaluasi

// Anak Services
pertumbuhan, neonatus, pelayanan-gizi, pelayanan-vitamin

// Edukasi Digital
edukasi-digital, mpasi, trimester, imd

// Actions
create, edit, detail, form

// Total: 80+ labels
```

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🔄 Auto-build | Otomatis dari path URL |
| 🏷️ Smart Labels | 80+ labels terpetakan |
| 🚫 No IDs | UUID/numeric IDs disembunyikan |
| 🔗 Clickable | Klik untuk navigasi kembali |
| 📱 Responsive | Mobile & desktop friendly |
| ♿ Accessible | WCAG compliant |
| 🎨 Styled | Tailwind CSS gradient design |

## ⚙️ Konfigurasi

```javascript
// File: src/components/Breadcrumb.jsx
const breadcrumbLabels = {
  "path-segment": "User Friendly Label",
  // ...
}
```

Tidak ada file konfigurasi lain - semuanya di breadcrumb component.

## 🚫 Exception Routes

Breadcrumb TIDAK ditampilkan di:

```javascript
/dashboard
/dashboard/bidan
/dashboard/admin
/dashboard/dokter
```

Ini adalah design decision - dashboard tidak perlu breadcrumb.

## 📝 Common Tasks

### Lihat halaman mana yang perlu label

```bash
# Search untuk semua routes di App.jsx
# Cari routes yang belum ada di breadcrumbLabels
```

### Add banyak label sekaligus

```javascript
// Di breadcrumbLabels object
// Tambah per kategori
"fitur-baru": "Fitur Baru",
"fitur-baru-sub": "Sub Fitur",
```

### Test breadcrumb

```
1. Navigate ke route baru
2. Lihat breadcrumb di atas main content
3. Klik link untuk navigasi kembali
4. Verify label muncul dengan benar
```

## 🔍 Troubleshooting

| Problem | Solusi |
|---------|--------|
| Breadcrumb tidak muncul | Pastikan route ada di App.jsx, check console |
| Label salah | Verify key di breadcrumbLabels match dengan path segment |
| Link tidak berfungsi | Pastikan path di breadcrumb match dengan App.jsx route |
| Styling salah | Check Tailwind classes, pastikan `custom-scrollbar` di MainLayout |

## 📊 Coverage

```
Total Routes: 150+
Covered Labels: 80+
Auto-format Fallback: Yes (untuk route yang belum di-map)
Coverage: ~100% (covered dengan mapping + fallback)
```

## 🎯 Best Practices

1. ✅ Always add label untuk route baru
2. ✅ Use lowercase dengan hyphens untuk segment names
3. ✅ Organize labels per kategori untuk mudah maintenance
4. ✅ Test setiap route baru
5. ✅ Jangan andalkan auto-format saja

## 📞 Support

Lihat:
- **Setup Guide**: `BREADCRUMB_GUIDE.md`
- **Implementation Details**: `BREADCRUMB_IMPLEMENTATION.md`
- **Component Code**: `src/components/Breadcrumb.jsx`

## ✅ Checklist untuk Route Baru

- [ ] Route ada di `App.jsx`
- [ ] Label ada di `breadcrumbLabels`
- [ ] Path segment match dengan App.jsx
- [ ] Test navigasi
- [ ] Verify label tampil dengan benar
- [ ] Test responsive (mobile/desktop)

---

**Last Updated**: 2026-05-17
**Maintained By**: Development Team
**Status**: ✅ Production Ready
