# Analisis Pemetaan Skema Database Terhadap Fitur Sistem

Berikut adalah hasil analisis mendalam dan valid berdasarkan skema database (DDL) yang Anda berikan serta pengecekan silang terhadap struktur migrasi di repositori. Kami telah memetakan tabel-tabel secara spesifik sesuai dengan fungsi dan relasinya ke masing-masing fitur.

---

## 1. Fitur Data Ibu Hamil

Fitur ini menggunakan gabungan antara tabel relasional tetap (*hardcoded tables*) untuk data utama, dan sistem form dinamis untuk pengisian spesifik.

*   **Data Induk Ibu Hamil**: `ibu`, `kehamilan`
*   **Evaluasi Kesehatan**: `evaluasi_kesehatan_ibu`
*   **Skrining Preeklampsia & Skrining DMG**: 
    *   *Analisis:* Tidak terdapat tabel fisik spesifik bernama *skrining_preeklampsia* atau *skrining_dmg*. Kedua form skrining klinis ini dibangun menggunakan mesin **Formulir Dinamis**.
    *   Tabel yang digunakan: `pemeriksaans` (penyimpan jawaban) bersumber dari tabel master `form_versis`, `form_pertanyaans`, dan menghasilkan kesimpulan melalui `form_aturan_risikos`.
*   **Input ANC Rutin**: `pemeriksaan_kehamilan` (berisi skor risiko, TD, USG, TFU, konseling, lab rutin).
*   **Trimester 1**: `pemeriksaan_dokter_trimester_1`
*   **Trimester 3**: `pemeriksaan_dokter_trimester_3`
*   **Rencana Persalinan**:
    *   Menggunakan bagian terintegrasi di dalam tabel `pemeriksaan_dokter_trimester_3` (kolom: `rencana_proses_melahirkan`, `kesimpulan_rekomendasi_tempat_melahirkan`, serta rencana kontrasepsi), serta dapat diperluas menggunakan sistem `pemeriksaans` dinamis.
*   **Riwayat Melahirkan & Pelayanan Nifas**:
    *   *Analisis:* Seperti skrining klinis, rekam medis pasca-persalinan (nifas) tidak dialokasikan di tabel *hardcoded*. Ini diimplementasikan via tabel kuesioner dinamis yaitu `pemeriksaans`, `form_versis`, `form_pertanyaans`. *(Terdapat tabel referensi edukasi: `edukasi_nifas`, namun ini untuk media KIE, bukan rekam medis).*
*   **Buat / Lihat Rujukan & Daftar Semua Rujukan**:
    *   Tabel: `rujukan` (Mencatat asal sumber rujukan seperti *preeklampsia, anc, dm_gestasional* melalui indeks dan relasi sistem).

---

## 2. Fitur Pencatatan Kesehatan

Fitur ini melayani siklus hidup lengkap mulai dari bayi hingga lansia, dan membutuhkan banyak tabel spesifik terutama di usia anak.

### A. Anak & Balita (0 - 9 Tahun)
*(Catatan: Masa pertumbuhan/balita dan usia 5-9 tahun dilebur menggunakan logika umur pada sistem ini).*
*   **Entitas Utama**: `anak`, `pemeriksaan_anak`
*   **Tumbuh Kembang Fisik**: `pertumbuhan_Anak`, `catatan_pertumbuhan`, `prediksi_stunting` (Machine Learning engine), `pengukuran_lila`, `deteksi_dini_penyimpangan`.
*   **Pelayanan Berkelanjutan (Kunjungan)**: `kunjungan_anak`, `catatan_pelayanan`, `kunjungan_gizi`, `kunjungan_vitamin`, `detail_pelayanan_vitamin`, `kunjungan_imunisasi`, `kehadiran_imunisasi`, `detail_pelayanan_imunisasi`, `status_kunjungan`.
*   **Layanan Khusus**: `Neonatus`, `detail_pelayanan_neonatus`, `periksa_gigi`, `Pelayanan_Asi`, `mp_asi`, `perawatan`.
*   **Referensi Master (Ruleset) untuk Anak**: `Kategori_umur`, `rentang_usia`, `periode_kunjungan`, `jenis_pelayanan`, `jenis_pelayanan_kategori`, `aturan_pelayanans`, `kategori_tanda_bahaya`, `kategori_tanda_sakit`, `skrining_pemantauan`, `pemantauan_indikator`, `kategori_lingkungan`, `indikator_lingkungan`, `lembar_lingkungan`, `detail_lingkungan`.

### B. Remaja (10 - 18 Tahun)
*   **Tabel Rekam Medis**: `pemeriksaan_remaja`

### C. Dewasa (19 - 59 Tahun)
*   **Tabel Rekam Medis**: `pemeriksaan_dewasa` (memiliki metrik spesifik seperti *gula_darah, kolesterol, penyakit_kronis*).

### D. Lansia (≥60 Tahun)
*   **Tabel Rekam Medis**: `pemeriksaan_lansia` (ditambah metrik demensia/kerentanan seperti *status_kemandirian, riwayat_jatuh*).

---

## 3. Fitur Laporan

Laporan tidak membutuhkan tabel penyimpanan "*Write*" (karena sifatnya agregasi atau membaca dari data yang sudah ada), melainkan melakukan kueri kompleks (JOIN/Aggregation) menggunakan tabel-tabel dari fitur 1 dan 2 beserta metadata kependudukan. Semua laporan membutuhkan:

*   **Laporan Tumbuh Kembang / Posyandu**: Agregasi dari tabel `catatan_pertumbuhan`, `pemeriksaan_anak`, `prediksi_stunting`, `kunjungan_imunisasi`, digabungkan dengan data teritori dari `posyandu`, `desa`.
*   **Laporan Kesehatan Ibu**: Agregasi dari `kehamilan`, `pemeriksaan_kehamilan`, `pemeriksaans` (form kuesioner dinamis), `evaluasi_kesehatan_ibu`.
*   **Laporan Penyakit Tidak Menular (Remaja/Dewasa/Lansia)**: Kueri ke `pemeriksaan_remaja`, `pemeriksaan_dewasa`, dan `pemeriksaan_lansia`.
*   **Laporan Kinerja**: Kueri agregasi dari aktivitas akun/petugas (`bidan`, `kader_posyandu`).

---

## 4. Tabel Penghubung / Base Tables (Wajib Ada)

Tanpa tabel-tabel di bawah ini, fitur pada poin 1, 2, dan 3 **TIDAK AKAN** berfungsi karena mereka adalah infrastruktur inti yang menyediakan otorisasi, master data pasien, entitas wilayah, dan fleksibilitas formulir.

*   **Identitas & Kependudukan (Master Pasien)**: 
    *   `penduduk` *(Sumber inti / Single Source of Truth semua identitas, diikat via `penduduk_id` di hampir semua tabel pemeriksaan).*
    *   `kartu_keluarga`
    *   `desa`
*   **Akses, Otorisasi & Tenaga Medis**:
    *   `roles`
    *   `pengguna` *(Berisi data autentikasi login).*
    *   `puskesmas`, `posyandu`
    *   `bidan`, `kader`, `kader_posyandu`
*   **Sistem Notifikasi Mobile**:
    *   `perangkat` (Tabel penyimpan token notifikasi seperti Firebase FCM untuk mem-broadcast pengingat jadwal, rujukan, atau status imunisasi).
*   **Mesin Formulir Dinamis (Core Form Engine)**:
    *   Diperlukan untuk semua isian skrining atau pendataan yang bentuknya kuesioner interaktif.
    *   `form_versis` (Template utama formulir)
    *   `form_pertanyaans` (Struktur field/inputan)
    *   `form_aturan_risikos` (Logika deteksi otomatis risiko)
    *   `pemeriksaans` (Tabel transaksi penyimpan jawaban format JSONB dari seluruh skrining/pelayanan nifas/preeklampsia).
