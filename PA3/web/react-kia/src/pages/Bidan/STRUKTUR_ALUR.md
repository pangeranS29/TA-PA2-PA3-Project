// ========================================
// STRUKTUR ALUR FITUR IMUNISASI KIA
// ========================================

/*
📋 ALUR LENGKAP FITUR PELAYANAN IMUNISASI LENGKAP (BUKU KIA):

1. DASHBOARD BIDAN/KADER
   ├─ File: BidanDashboard.jsx
   ├─ Route: /bidan/dashboard
   └─ Fungsi: 
      • Menu utama dengan 4 pilihan menu
      • Statistik dashboard (Total Ibu, Total Anak, Imunisasi Hari Ini)
      • Navigasi ke semua fitur

2. KELOLA PROFIL IBU
   ├─ File: KelolaProfIlIbu.jsx
   ├─ Route: /bidan/profil-ibu
   └─ Fungsi:
      • Search penduduk perempuan dari database
      • Tambah ibu baru
      • Pilih ibu untuk lanjut ke Data Kehamilan
      • Data: nama, umur, alamat, no_hp, status_kehamilan

3. DATA KEHAMILAN
   ├─ File: DataKehamilan.jsx
   ├─ Route: /bidan/kehamilan
   └─ Fungsi:
      • Pilih ibu dari list
      • Lihat data kehamilan: usia kehamilan, trimester, perkiraan lahir
      • Edit data kehamilan: HPHT, BB awal, BB sekarang, tekanan darah, catatan
      • Hitung otomatis usia kehamilan dan perkiraan lahir
      • Lanjut ke Profil Anak

4. KELOLA PROFIL ANAK
   ├─ File: KelolaProfIlAnak.jsx
   ├─ Route: /bidan/profil-anak?ibu_id=X
   └─ Fungsi:
      • Pilih ibu
      • Lihat daftar anak dari ibu terpilih
      • Tambah anak baru (nama, tgl lahir, JK, berat lahir, panjang lahir)
      • Hitung usia anak otomatis
      • Pilih anak untuk buka halaman Imunisasi

5. HALAMAN IMUNISASI (SUDAH ADA)
   ├─ File: ImunisasiTable.jsx
   ├─ Route: /bidan/imunisasi?anak_id=X&ibu_id=Y
   └─ Fungsi:
      • Tampil tabel Buku KIA (Format standar hal.124)
      • Kolom: Nama Vaksin + No. Batch, Kolom umur (0-59 bulan)
      • Input per vaksin: Tanggal, No. Batch, Paraf Petugas
      • Warna sel: White=tepat, Yellow=masih boleh, Pink=kejar, Gray=tidak boleh
      • Simpan data ke imunisasi_bayi (anak_id, vaksin_id, tanggal, batch, paraf)
      • Modal input untuk setiap sel vaksin


DATABASE SCHEMA YANG DIBUTUHKAN:
================================

1. Tabel: penduduk
   - id, nama, umur, alamat, no_hp, jenis_kelamin, status_kehamilan

2. Tabel: kehamilan
   - id, ibu_id, usia_kehamilan_minggu, tanggal_hpht, tanggal_perkiraan_lahir, 
     trimester, berat_badan_awal, berat_badan_sekarang, tekanan_darah, 
     catatan_pemeriksaan, keluhan

3. Tabel: anak
   - id, ibu_id, nama, tanggal_lahir, jenis_kelamin, berat_lahir, panjang_lahir

4. Tabel: master_vaksin
   - id, nama, kategori (dasar/lanjutan), usia_bulan_jadwal

5. Tabel: imunisasi_bayi
   - id, anak_id, master_vaksin_id, tanggal_pemberian, no_batch, 
     petugas_pengguna_id, paraf_petugas, bulan_pemberian (col_idx)

6. Tabel: pengguna
   - id, nama, role (Bidan/Kader/Ibu), no_hp, alamat


FITUR YANG SUDAH DIIMPLEMENTASI:
=================================
✅ BidanDashboard.jsx - Dashboard menu utama
✅ KelolaProfIlIbu.jsx - Manage profil ibu + search
✅ DataKehamilan.jsx - Input & monitor kehamilan
✅ KelolaProfIlAnak.jsx - Manage profil anak
✅ ImunisasiTable.jsx - Tabel Buku KIA + input imunisasi


NEXT STEPS:
===========
1. Setup routing di src/routes atau App.jsx
2. Connect ke backend API (saat ini masih hardcoded)
3. Setup database tables
4. Tambah validasi dan error handling
5. Tambah edit/delete functionality untuk data


ROUTING YANG DIPERLUKAN:
========================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BidanDashboard from './pages/Bidan/BidanDashboard';
import KelolaProfIlIbu from './pages/Bidan/KelolaProfIlIbu';
import DataKehamilan from './pages/Bidan/DataKehamilan';
import KelolaProfIlAnak from './pages/Bidan/KelolaProfIlAnak';
import ImunisasiTable from './pages/Bidan/ImunisasiTable';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/bidan/dashboard" element={<BidanDashboard />} />
        <Route path="/bidan/profil-ibu" element={<KelolaProfIlIbu />} />
        <Route path="/bidan/kehamilan" element={<DataKehamilan />} />
        <Route path="/bidan/profil-anak" element={<KelolaProfIlAnak />} />
        <Route path="/bidan/imunisasi" element={<ImunisasiTable />} />
      </Routes>
    </BrowserRouter>
  );
}


ALUR PENGGUNA:
==============
Bidan/Kader membuka aplikasi
    ↓
Login → Dashboard Bidan/Kader
    ↓
Menu: Kelola Profil Ibu → Search & Pilih Ibu
    ↓
Data Kehamilan → Lihat/Edit data kehamilan ibu
    ↓
Profil Anak → Lihat/Tambah anak dari ibu
    ↓
Pilih Anak → Buka Halaman Imunisasi (Buku KIA)
    ↓
Input Imunisasi → Isi tanggal, batch, paraf untuk setiap vaksin
    ↓
Simpan → Data tersimpan, Rekap Imunisasi Lengkap
*/
