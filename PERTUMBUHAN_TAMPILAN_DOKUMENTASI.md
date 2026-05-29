# Dokumentasi - Tampilan Pertumbuhan dan Status Gizi Anak

Panduan lengkap untuk implementasi tampilan pertumbuhan dengan grafik interaktif dan status gizi yang lebih jelas di React Web dan Flutter Mobile.

---

## 📊 React Web (PA3/web/react-kia)

### Fitur Baru

#### 1. **Komponen Status Gizi Interaktif** (`GrowthStatusCard.jsx`)
- Menampilkan status gizi dengan visualisasi warna yang konsisten
- Indicator visual Z-Score dengan skala -3 hingga 3
- Deskripsi status yang informatif

**Warna Indikator:**
- 🟢 Hijau: Gizi Baik / Normal
- 🟡 Kuning: Gizi Kurang / Risiko
- 🔴 Merah: Gizi Buruk / Sangat Kurang

#### 2. **Grafik Pertumbuhan Dinamis** (`GrowthChart.jsx`)
- Dua tipe tampilan: Grafik Garis dan Grafik Batang
- Referensi garis median (standar) untuk perbandingan
- Tooltip interaktif saat hover
- Animasi transisi smooth saat berganti tab

#### 3. **Ringkasan Status Gizi** (`GrowthSummary`)
- Quick view status gizi terkini
- Informasi anak (nama, usia)
- Perbandingan tiga metrik utama (BB/U, TB/U, BB/TB)

### Komponen Utama

#### `GrowthStatusCard`
```jsx
<GrowthStatusCard 
  status="Normal"
  label="Berat Badan / Usia (BB/U)"
  zScore={0.5}
  description="Menunjukkan status berat badan anak dibandingkan dengan standar usia"
/>
```

**Props:**
- `status` (string): Status gizi (misal: "Normal", "Gizi Baik", "Gizi Kurang")
- `label` (string): Judul komponen
- `zScore` (number): Nilai Z-Score
- `description` (string, optional): Penjelasan detail

#### `GrowthChart`
```jsx
<GrowthChart 
  data={chartData}
  activeChart="bb"
  chartConfig={chartConfig}
  onChartChange={setActiveChart}
/>
```

**Props:**
- `data` (array): Data riwayat pengukuran
- `activeChart` (string): Chart yang sedang aktif ('bb', 'tb', 'lila', 'lk')
- `chartConfig` (object): Konfigurasi warna dan label untuk setiap chart
- `onChartChange` (function): Callback saat berganti chart

#### `GrowthSummary`
```jsx
<GrowthSummary 
  lastStatus={lastStatus}
  lastData={lastData}
  anak={anak}
/>
```

**Props:**
- `lastStatus` (object): Status gizi terakhir {statusBBU, statusTBU, statusBBTB}
- `lastData` (object): Data pengukuran terakhir
- `anak` (object): Informasi anak

### Struktur Tampilan

```
┌─────────────────────────────────────────┐
│  HEADER: Manajemen Pertumbuhan          │
├─────────────────────────────────────────┤
│  GRAFIK INTERAKTIF (2/3 lebar)          │  RINGKASAN STATUS (1/3 lebar)
│  - Tab BB/TB/LILA/LK                    │  - Quick view 3 metrik
│  - Grafik Garis / Batang                │  - Pengukuran terakhir
│  - Referensi median                     │
├─────────────────────────────────────────┤
│  STATUS GIZI DETAIL (3 kolom)           │
│  ┌─────────┬─────────┬─────────┐       │
│  │ BB/U    │ TB/U    │ BB/TB   │       │
│  │ + Z-Bar │ + Z-Bar │ + Z-Bar │       │
│  └─────────┴─────────┴─────────┘       │
├─────────────────────────────────────────┤
│  TABEL RIWAYAT PENGUKURAN               │
│  - Tanggal, BB, TB, LILA, LK            │
│  - Status gizi untuk setiap record      │
│  - Tombol edit/hapus                    │
└─────────────────────────────────────────┘
```

### Implementasi

File sudah diupdate di: [PA3/web/react-kia/src/pages/Pertumbuhan/index.jsx](../../../PA3/web/react-kia/src/pages/Pertumbuhan/index.jsx)

**Komponen tambahan:**
1. [GrowthStatusCard.jsx](../../../PA3/web/react-kia/src/pages/Pertumbuhan/components/GrowthStatusCard.jsx)
2. [GrowthChart.jsx](../../../PA3/web/react-kia/src/pages/Pertumbuhan/components/GrowthChart.jsx)

---

## 📱 Flutter Mobile (TA-PA2/mobile/kia_app)

### Widget Baru

#### 1. **GrowthStatusCard**
Widget untuk menampilkan status gizi dengan visual Z-Score bar dan deskripsi

```dart
GrowthStatusCard(
  status: "Normal",
  label: "Berat Badan / Usia (BB/U)",
  zScore: 0.5,
  description: "Menunjukkan status berat badan anak dibandingkan dengan standar usia",
)
```

#### 2. **GrowthSummaryWidget**
Widget ringkasan status gizi dengan desain card gradient

```dart
GrowthSummaryWidget(
  statusBBU: "Normal",
  statusTBU: "Normal",
  statusBBTB: "Gizi Baik",
  childName: "Budi Santoso",
  childAge: "12 bulan",
)
```

#### 3. **MiniStatCard**
Widget untuk menampilkan single stat measurement

```dart
MiniStatCard(
  label: "BB",
  value: "10.5",
  unit: "kg",
  color: Color(0xFF2563EB),
)
```

### Fitur Utama

**Z-Score Visualization:**
- Bar visual dengan 5 zone: -3, -2, 0, 2, 3
- Indikator dinamis sesuai nilai Z-Score
- Warna berubah berdasarkan status

**Status Color Mapping:**
```
Hijau (#10b981)    → Baik / Normal
Kuning (#f59e0b)   → Kurang / Risiko
Merah  (#ef4444)   → Buruk / Sangat Kurang
Biru   (#3b82f6)   → Default
```

### Implementasi

File widget: [growth_status_widget.dart](../../../TA-PA2/mobile/kia_app/lib/features/anak/pertumbuhan/presentation/widgets/growth_status_widget.dart)

**Integrasi ke DetailPertumbuhanScreen:**

Tambahkan import:
```dart
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/presentation/widgets/growth_status_widget.dart';
```

Gunakan di widget build:
```dart
// Di section status gizi
GrowthStatusCard(
  status: _getStatusForTab(latest),
  label: _selectedTab,
  zScore: _getZScoreForTab(latest),
  description: _getStatusDescription(_getStatusForTab(latest)),
)

// Di section ringkasan
GrowthSummaryWidget(
  statusBBU: latest.statusBBU,
  statusTBU: latest.statusTBU,
  statusBBTB: latest.statusBBTB,
  childName: widget.anak.namaAnak,
  childAge: _hitungUmur(widget.anak.tanggalLahir),
)
```

### Struktur Tampilan Flutter

```
┌─────────────────────────────────┐
│ HEADER: Nama Anak (X bulan)     │
├─────────────────────────────────┤
│ TAB BUTTONS: BB/U TB/U BB/TB    │
├─────────────────────────────────┤
│ RINGKASAN STATUS (Gradient Blue)│
│ - Nama & Usia Anak              │
│ - 3 Status Summary              │
├─────────────────────────────────┤
│ PENGUKURAN TERAKHIR             │
│ - Nilai & Tanggal               │
├─────────────────────────────────┤
│ GRAFIK PERTUMBUHAN              │
│ - Line Chart dengan animasi     │
├─────────────────────────────────┤
│ STATUS GIZI DETAIL              │
│ - Z-Score Card                  │
│ - Indicator visual              │
├─────────────────────────────────┤
│ RIWAYAT PENGUKURAN (4 Terbaru)  │
│ - List dengan status badge      │
├─────────────────────────────────┤
│ BUTTONS                         │
│ - Tambah Data Pertumbuhan       │
│ - Lihat Perawatan & Milestone   │
└─────────────────────────────────┘
```

---

## 🎨 Design System

### Warna Status Gizi

| Status | Warna | Hex | Makna |
|--------|-------|-----|-------|
| Baik / Normal | Hijau | #10b981 | Status pertumbuhan optimal |
| Kurang / Risiko | Kuning | #f59e0b | Perlu perhatian dan intervensi |
| Buruk / Sangat Kurang | Merah | #ef4444 | Kondisi kritis, butuh tindakan segera |
| Default | Biru | #3b82f6 | Status lain / tidak terklasifikasi |

### Typography

**React:**
- Heading 1: 3xl, font-extrabold
- Heading 2: base, font-extrabold
- Body: xs-sm, font-bold
- Label: 10px-11px, font-black, tracking-widest

**Flutter:**
- Title: 16px, bold
- Subtitle: 14px, w600
- Label: 11px-12px, w600
- Value: 18px, bold

### Spacing

**React:** Tailwind (Uniform: 6, 12, 16, 20, 24px)
**Flutter:** Flutter standard (8px increments)

---

## 📈 Data Structure

### Chart Data Format
```json
{
  "bulan": "12bln",
  "bb": 10.5,
  "tb": 75.2,
  "lila": 15.8,
  "lk": 46.2
}
```

### Status Response Format
```json
{
  "statusBBU": "Normal",
  "statusTBU": "Normal",
  "statusBBTB": "Gizi Baik",
  "zScoreBBU": 0.5,
  "zScoreTBU": -0.2,
  "zScoreBBTB": 0.8
}
```

---

## 🔄 API Integration

### Backend Endpoints Used

1. **GET `/api/riwayat-pertumbuhan/{anakId}`**
   - Returns: Array of PertumbuhanModel
   - Fields: beratBadan, tinggiBadan, lingkarKepala, statusBBU, statusTBU, statusBBTB, z_score_bb_u, z_score_tb_u, z_score_bb_tb

2. **POST `/api/riwayat-pertumbuhan`**
   - Input: CreatePertumbuhanRequest
   - Fields: anakId, tglUkur, beratBadan, tinggiBadan, lingkarKepala (optional)

3. **PUT `/api/riwayat-pertumbuhan/{id}`**
   - Update existing measurement

4. **DELETE `/api/riwayat-pertumbuhan/{id}`**
   - Remove measurement

---

## ✅ Checklist Implementasi

### React
- [x] Komponen GrowthStatusCard dibuat
- [x] Komponen GrowthChart dibuat
- [x] Komponen GrowthSummary dibuat
- [x] Integrasi di halaman Pertumbuhan
- [x] Z-Score visualization ditambahkan
- [ ] Testing di berbagai ukuran layar
- [ ] Optimisasi performa grafik dengan data besar

### Flutter
- [x] Widget GrowthStatusCard dibuat
- [x] Widget GrowthSummaryWidget dibuat
- [x] Widget MiniStatCard dibuat
- [ ] Integrasi ke DetailPertumbuhanScreen
- [ ] GrowthChartWidget update dengan referensi standar
- [ ] Testing responsiveness
- [ ] Testing dengan berbagai data

---

## 🚀 Fitur Masa Depan

1. **Prediksi Pertumbuhan**
   - Estimasi pertumbuhan 3-6 bulan ke depan
   - Trendline dan alert preventif

2. **Perbandingan Standar WHO**
   - Integrasi kurva pertumbuhan WHO
   - Visual alignment dengan standar internasional

3. **Laporan Printable**
   - Export ke PDF
   - Grafik dan status untuk dokumentasi

4. **Notifikasi Kesehatan**
   - Alert otomatis jika ada anomali
   - Rekomendasi tindak lanjut

5. **Integrasi dengan KMS**
   - Sinkronisasi data KMS
   - Status gizi berdasarkan KMS tracking

---

## 📝 Notes

- Nilai Z-Score di-fetch dari backend yang sudah melakukan perhitungan
- Status gizi diinterpretasikan berdasarkan Z-Score dan standar WHO
- Grafik menampilkan riwayat pengukuran minimal 1 data untuk render
- Responsive design untuk semua ukuran layar

---

Generated: 2026-05-19
Version: 1.0
