# 🎨 Visual Guide - Tampilan Pertumbuhan & Status Gizi

## 📱 React Web - Visual Layout

### Halaman Utama - Desktop View
```
┌────────────────────────────────────────────────────────────────────┐
│ ← Kembali ke Dashboard                   [+ Input Pengukuran]     │
│ Manajemen Pertumbuhan                                              │
│ Anak: Budi Santoso                                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────┐  ┌──────────────────┐  │
│  │  📈 Grafik Pertumbuhan              │  │ 📊 Ringkasan     │  │
│  │                                    │  │ Status Gizi      │  │
│  │  [BB] [TB] [LILA] [LK]            │  │                  │  │
│  │                                    │  │ 👶 Budi Santoso │  │
│  │  ┌────────────────────────────────┐│  │    12 bulan      │  │
│  │  │                                  ││  │ ─────────────── │  │
│  │  │  Grafik Garis                   ││  │ Berat/Usia      │  │
│  │  │  ●─────●────●─────●────●        ││  │ Normal          │  │
│  │  │                                  ││  │ Tinggi/Usia     │  │
│  │  │  [📊Grafik Garis] [📊Batang]   ││  │ Normal          │  │
│  │  └────────────────────────────────┘│  │ Berat/Tinggi    │  │
│  │                                    │  │ Gizi Baik       │  │
│  │  Legend: ■ BB  ■ TB  ■ LILA ■ LK  │  └──────────────────┘  │
│  │                                    │                         │
│  │  ┌──────────────────────────────────┐  ┌──────────────────┐  │
│  │  │ ⚖️ Pengukuran Terakhir          │  │ Tanggal: ...   │  │
│  │  ├──────────────────────────────────┤  │ Usia: 12 bln   │  │
│  │  │ ┌──────┬──────┐                  │  │ BB: 10.5 kg    │  │
│  │  │ │ 10.5 │ 75.2 │                  │  │ TB: 75.2 cm    │  │
│  │  │ │ kg   │ cm   │                  │  │                 │  │
│  │  │ └──────┴──────┘                  │  │                 │  │
│  │  │ ┌──────┬──────┐                  │  │                 │  │
│  │  │ │ 15.8 │ 46.2 │                  │  │                 │  │
│  │  │ │ cm   │ cm   │                  │  │                 │  │
│  │  │ └──────┴──────┘                  │  └──────────────────┘  │
│  │  └──────────────────────────────────┘                        │
│  └──────────────────────────────────────┘                        │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │ 🟢 Berat Badan/Usia │  │ 🟢 Tinggi Badan/Usia│              │
│  │                     │  │                      │              │
│  │ Normal              │  │ Normal               │              │
│  │                     │  │                      │              │
│  │ Z-Score            │  │ Z-Score              │              │
│  │ 0.50               │  │ -0.20                │              │
│  │                     │  │                      │              │
│  │ ─3  ─2   0   2   3  │  │ ─3  ─2   0   2   3   │              │
│  │      ●              │  │          ●           │              │
│  │                     │  │                      │              │
│  │ Menunjukkan status  │  │ Menunjukkan          │              │
│  │ berat badan...      │  │ pertumbuhan tinggi...│              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                    │
│  ┌──────────────────────┐                                         │
│  │ 🟢 Berat/Tinggi Badan│                                        │
│  │                     │                                         │
│  │ Gizi Baik           │                                         │
│  │                     │                                         │
│  │ Z-Score            │                                         │
│  │ 0.80               │                                         │
│  │                     │                                         │
│  │ ─3  ─2   0   2   3  │                                         │
│  │        ●            │                                         │
│  │                     │                                         │
│  │ Menunjukkan proporsi│                                         │
│  │ berat badan terhadap│                                         │
│  │ tinggi badan        │                                         │
│  └──────────────────────┘                                         │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Riwayat Pengukuran                                                │
│ ┌────┬──────────┬──────┬──────┬───────┬────┬───────────────────┬─┐
│ │Usia│Tanggal   │BB(kg)│TB(cm)│LILA(cm)│LK(cm)│Status Gizi    │∴││
│ ├────┼──────────┼──────┼──────┼───────┼────┼───────────────────┼─┤
│ │12  │2026-05-19│10.5  │75.2  │15.8   │46.2│🟢Normal 🟢Normal│✏┐
│ │    │          │      │      │       │    │🟢Baik           │✗│
│ ├────┼──────────┼──────┼──────┼───────┼────┼───────────────────┼─┤
│ │11  │2026-04-15│10.2  │74.8  │15.5   │45.9│🟢Normal 🟢Normal│✏┐
│ │    │          │      │      │       │    │🟢Baik           │✗│
│ ├────┼──────────┼──────┼──────┼───────┼────┼───────────────────┼─┤
│ │10  │2026-03-10│9.8   │74.1  │15.2   │45.6│🟡Kurang 🟢Normal│✏┐
│ │    │          │      │      │       │    │🟢Baik           │✗│
│ └────┴──────────┴──────┴──────┴───────┴────┴───────────────────┴─┘
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Color Legend

```
Status Color Indicators:
🟢 Hijau      → Normal / Gizi Baik          ✅ Status Optimal
🟡 Kuning     → Kurang / Risiko             ⚠️  Perlu Perhatian
🔴 Merah      → Buruk / Sangat Kurang       🚨 Butuh Intervensi
🔵 Biru       → Default / Not Classified    ℹ️  Status Lain
```

### Mobile View (Responsive)

```
┌─────────────────────┐
│ ← Kembali           │
│ Manajemen           │
│ Pertumbuhan         │
│ Budi Santoso        │
├─────────────────────┤
│ [📈 Grafik]         │
│ [BB] [TB] [LILA]    │
│ [LK]                │
│                     │
│ ┌─────────────────┐ │
│ │ Grafik Garis    │ │
│ │ ●─────●────●    │ │
│ │                 │ │
│ │ [📊] [📊]      │ │
│ └─────────────────┘ │
│                     │
├─────────────────────┤
│ 📊 Ringkasan        │
│ ─────────────────── │
│ 👶 Budi Santoso    │
│    12 bulan         │
│                     │
│ Berat/Usia         │
│ 🟢 Normal          │
│                     │
│ Tinggi/Usia        │
│ 🟢 Normal          │
│                     │
│ Berat/Tinggi      │
│ 🟢 Gizi Baik      │
├─────────────────────┤
│ ⚖️ Pengukuran      │
│ BB: 10.5 kg        │
│ TB: 75.2 cm        │
│ LILA: 15.8 cm      │
│ LK: 46.2 cm        │
├─────────────────────┤
│ Status Gizi Detail  │
│ ┌─────────────────┐ │
│ │ 🟢 Normal       │ │
│ │ BB/U            │ │
│ │ Z: 0.50         │ │
│ │ ─────●─────     │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 🟢 Normal       │ │
│ │ TB/U            │ │
│ │ Z: -0.20        │ │
│ │ ───●───────     │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 🟢 Baik         │ │
│ │ BB/TB           │ │
│ │ Z: 0.80         │ │
│ │ ────●───────    │ │
│ └─────────────────┘ │
├─────────────────────┤
│ Riwayat (4 Terakhir)│
│ ───────────────────│
│ Usia 12 • 2026-05  │
│ 🟢 Normal ...      │
│ ───────────────────│
│ Usia 11 • 2026-04  │
│ 🟢 Normal ...      │
├─────────────────────┤
│ [+ Input Pengukuran]│
│ [📋 Lihat Details]  │
└─────────────────────┘
```

---

## 📱 Flutter Mobile - Visual Layout

### Full Screen View

```
┌──────────────────────────────┐
│ ← Budi Santoso               │
│   12 bulan • Laki-laki       │
├──────────────────────────────┤
│ [BB/U] [TB/U] [BB/TB] [...]  │
├──────────────────────────────┤
│                              │
│ ╔══════════════════════════╗ │
│ ║ 📊 RINGKASAN STATUS GIZI ║ │
│ ║                          ║ │
│ ║ 👶 Budi Santoso         ║ │
│ ║    12 bulan              ║ │
│ ║ ────────────────────────║ │
│ ║ Berat/Usia (BB/U)       ║ │
│ ║ 🟢 Normal                ║ │
│ ║ Tinggi/Usia (TB/U)      ║ │
│ ║ 🟢 Normal                ║ │
│ ║ Berat/Tinggi (BB/TB)    ║ │
│ ║ 🟢 Gizi Baik             ║ │
│ ╚══════════════════════════╝ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🟢 Berat Badan / Usia   │ │
│ │                         │ │
│ │ Normal              ✓   │ │
│ │                         │ │
│ │ Z-Score            ✓   │ │
│ │ 0.50               ✓   │ │
│ │                         │ │
│ │ ▓▓▓▓▓▓●▓▓▓▓▓▓        │ │
│ │ -3  -2  0  2  3        │ │
│ │                         │ │
│ │ Menunjukkan status      │ │
│ │ berat badan anak        │ │
│ │ dibandingkan dengan     │ │
│ │ standar usia.           │ │
│ └──────────────────────────┘ │
│                              │
│ ⚖️ Pengukuran Terakhir       │
│ ┌────────┬────────────────┐ │
│ │ BB     │ 10.5           │ │
│ │ kg     │                │ │
│ ├────────┼────────────────┤ │
│ │ TB     │ 75.2           │ │
│ │ cm     │                │ │
│ ├────────┼────────────────┤ │
│ │ LK     │ 46.2           │ │
│ │ cm     │                │ │
│ ├────────┼────────────────┤ │
│ │ IMT    │ 18.6           │ │
│ │ kg/m²  │                │ │
│ └────────┴────────────────┘ │
│                              │
│ 📈 Grafik Pertumbuhan        │
│ ┌──────────────────────────┐ │
│ │ Line Chart               │ │
│ │ ●─────●────●─────●       │ │
│ │                          │ │
│ │ Bulan: 9 10 11 12       │ │
│ └──────────────────────────┘ │
│                              │
│ Riwayat (4 Terakhir)         │
│ ───────────────────────────  │
│ Usia 12 • 2026-05-19 •       │
│ 🟢 Normal 🟢 Normal 🟢 Baik  │
│ ───────────────────────────  │
│ Usia 11 • 2026-04-15 •       │
│ 🟢 Normal 🟢 Normal 🟢 Baik  │
│ ───────────────────────────  │
│ Usia 10 • 2026-03-10 •       │
│ 🟡 Kurang 🟢 Normal 🟢 Baik  │
│ ───────────────────────────  │
│                              │
│ ┌──────────────────────────┐ │
│ │ + Tambah Data Pertumbuhan│ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ 📋 Lihat Perawatan ...   │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Component Breakdown

```
GrowthSummaryWidget:
┌─────────────────────────────┐
│ Gradient Background (Blue)  │
│ ──────────────────────────  │
│ Ringkasan Status Gizi       │
│ 👶 Info Anak               │
│ ──────────────────────────  │
│ 📊 3 Status Summary        │
└─────────────────────────────┘

GrowthStatusCard:
┌─────────────────────────────┐
│ 🟢 Baik / Normal     ✓      │
│ Status Label             │
│ Status Text              │
│ Z-Score: 0.50           │
│ ────────────────────    │
│ ╭─────────────────────╮ │
│ │ Zone Visualization │ │
│ │ -3 -2  0  2  3     │ │
│ │   ●                │ │
│ ╰─────────────────────╯ │
│ Description Text        │
└─────────────────────────────┘

MiniStatCard:
┌──────────────┐
│ BB           │ Label
│              │
│ 10.5 kg      │ Value + Unit
└──────────────┘
```

---

## 🎬 User Interactions

### React - Tab Switching
```
User clicks "TB" tab
    ↓
setActiveChart("tb")
    ↓
GrowthChart re-renders with new data
    ↓
Line/Bar chart animates (300ms)
    ↓
Tooltip updates to show TB values
    ↓
Display new measurements
```

### React - Chart Type Toggle
```
User clicks "📊 Batang" button
    ↓
setChartType("bar")
    ↓
ResponsiveContainer re-renders
    ↓
LineChart → ComposedChart (Line + Bar)
    ↓
Animation transition
```

### Flutter - Tab Change
```
User taps "TB/U" tab
    ↓
setState(() => _selectedTab = 'TB/U')
    ↓
All widgets rebuild with new data:
  - GrowthSummaryWidget
  - GrowthStatusCard
  - GrowthChartWidget
  - MiniStatCard
```

---

## 🎨 Design System - Colors

### Status Colors
```
Status Baik / Normal:
  Background: #10b981 (Emerald)
  Text: #047857
  Light BG: rgba(16, 185, 129, 0.1)
  Border: rgba(16, 185, 129, 0.3)

Status Kurang / Risiko:
  Background: #f59e0b (Amber)
  Text: #d97706
  Light BG: rgba(245, 158, 11, 0.1)
  Border: rgba(245, 158, 11, 0.3)

Status Buruk / Sangat Kurang:
  Background: #ef4444 (Red)
  Text: #dc2626
  Light BG: rgba(239, 68, 68, 0.1)
  Border: rgba(239, 68, 68, 0.3)

Default:
  Background: #3b82f6 (Blue)
  Text: #1e40af
  Light BG: rgba(59, 130, 246, 0.1)
  Border: rgba(59, 130, 246, 0.3)
```

### Z-Score Bar Zones
```
Zone 1 (< -3):     🔴 Red (#ef4444)      - Sangat Buruk
Zone 2 (-3 to -2): 🟠 Orange/Amber      - Kurang/Risiko
Zone 3 (-2 to 0):  🟡 Amber (#f59e0b)   - Borderline
Zone 4 (0 to 2):   🟢 Green (#10b981)   - Baik
Zone 5 (2 to 3):   🟡 Amber (#f59e0b)   - Borderline
Zone 6 (> 3):      🔴 Red (#ef4444)      - Sangat Buruk
```

---

## 📊 Data Examples

### Chart Data
```javascript
[
  { bulan: "10bln", bb: 9.8, tb: 74.1, lila: 15.2, lk: 45.6 },
  { bulan: "11bln", bb: 10.2, tb: 74.8, lila: 15.5, lk: 45.9 },
  { bulan: "12bln", bb: 10.5, tb: 75.2, lila: 15.8, lk: 46.2 },
]
```

### Status Response
```json
{
  "statusBBU": "Normal",
  "statusTBU": "Normal",
  "statusBBTB": "Gizi Baik",
  "zScoreBBU": 0.50,
  "zScoreTBU": -0.20,
  "zScoreBBTB": 0.80
}
```

---

## ✨ Animation Details

### React Animations
- **Chart Tab Switch**: 300ms smooth transition
- **Chart Type Toggle**: Instant swap with animation
- **Z-Score Bar**: Smooth color fade
- **Modal Appear**: 200ms fade-in

### Flutter Animations
- **Tab Switch**: 300ms AnimatedSwitcher
- **Card Appear**: Implicit animation
- **Z-Score Bar**: Smooth fill animation

---

Generated: 19 May 2026  
Version: 1.0.0
