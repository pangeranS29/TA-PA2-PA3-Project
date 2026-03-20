# Panduan Git Tim TA-PA2-PA3 

## 1) Persiapan Awal (Sekali Saja)

- Install Git: https://git-scm.com/downloads
- Cek Git sudah terpasang:

    git --version

- Set identitas Git (wajib, sekali saja):

    git config --global user.name "Nama Kamu"
    git config --global user.email "emailkamu@example.com"

- Cek konfigurasi:

    git config --global --list

## 2) Clone Repository ke Lokal

- Buka terminal di folder tempat kamu ingin menyimpan project.
- Jalankan:

    git clone https://github.com/pangeranS29/TA-PA2-PA3-Project.git

- Masuk ke folder project:

    cd TA-PA2-PA3-Project

- Cek remote:

    git remote -v

Jika benar, harus terlihat URL repository GitHub tim.

## 3) Branch Utama Tim

Gunakan struktur branch berikut:

- main: branch produksi/stabil.
- develop: branch gabungan semua fitur yang sudah siap integrasi.
- feature/*: branch kerja harian per fitur.
- hotfix/*: branch perbaikan cepat untuk bug penting.

Saran alur:
- Jangan langsung kerja di main.
- Semua anggota mulai dari develop, lalu buat feature branch masing-masing.

## 4) Standar Penamaan Branch Tim

Format branch yang disarankan:

    feature/{tim}-{nama-fitur}-{nama}

Keterangan:
- tim: pa2 atau pa3
- nama-fitur: singkat, lowercase, pisah dengan tanda minus
- nama:  pembuat branch

Contoh:
- feature/pa2-auth-login-pangeran
- feature/pa2-ui-dashboard-pangeran
- feature/pa2-api-jadwal-pangeran
- feature/pa3-payment-gateway-pangeran
- feature/pa3-mobile-onboarding-pangeran
- hotfix/pa2-fix-null-pointer-pangeran

## 5) Mapping Jenis Pekerjaan ke Prefix Branch

Gunakan prefix supaya langsung kebaca jenis kerjaannya:

- feature/: untuk fitur baru
- fix/: untuk perbaikan bug biasa
- hotfix/: bug kritikal yang perlu cepat
- chore/: tugas teknis non-fitur (rename folder, update konfigurasi)
- docs/: update dokumentasi

Contoh:
- fix/pa2-validasi-form-login-an
- chore/pa3-update-env-dev-rf
- docs/pa2-panduan-api-ps

## 6) Langkah Kerja Harian Anggota Tim

### A. Selalu update branch develop dulu

    git checkout develop
    git pull origin develop

### B. Buat branch baru dari develop

    git checkout -b feature/pa2-auth-login-ps

### C. Kerjakan fitur

- Edit file sesuai tugas.
- Cek status perubahan:

    git status

### D. Tambahkan file ke staging

    git add .

### E. Commit dengan pesan yang jelas

Format commit yang disarankan:

    <tipe>(<scope>): <ringkasan>

Tipe yang dipakai:
- feat: fitur baru
- fix: perbaikan bug
- docs: dokumentasi
- refactor: perapihan struktur tanpa ubah perilaku
- chore: pekerjaan teknis
- test: tambah/ubah testing

Contoh commit:
- feat(pa2-auth): tambah endpoint login
- fix(pa2-auth): perbaiki validasi password kosong
- docs(pa2): tambah panduan struktur folder

Contoh perintah:

    git commit -m "feat(pa2-auth): tambah endpoint login"

### F. Push branch ke GitHub

    git push -u origin feature/pa2-auth-login-ps


## 9) Sinkronisasi Jika Develop Bergerak

Jika branch kamu tertinggal dari develop:

    git checkout develop
    git pull origin develop
    git checkout feature/pa2-auth-login-ps
    git merge develop

Jika ada konflik:
- Edit file konflik.
- Simpan.
- Lanjutkan:

    git add .
    git commit -m "chore: resolve merge conflict develop"

- Push lagi:

    git push

## 10) Checklist Sebelum Push

- Sudah di branch yang benar (bukan main).
- Nama branch sesuai format tim.
- Perubahan hanya yang terkait task.
- Aplikasi bisa jalan lokal.
- Commit message jelas.

Cek cepat:

    git branch
    git status
    git log --oneline -5

## 11) Contoh Alur Lengkap dari Nol

    git clone https://github.com/pangeranS29/TA-PA2-PA3-Project.git
    cd TA-PA2-PA3-Project
    git checkout develop
    git pull origin develop
    git checkout -b feature/pa2-auth-login-pangeran
    git add .
    git commit -m "feat(pa2-auth): tambah endpoint login"
    git push -u origin feature/pa2-auth-login-pangeran

Lalu lanjut buat PR dari branch itu ke develop Jangan di Merge.

## 12) Saran Pembagian Tim PA2 dan PA3

Agar rapi, setiap anggota punya pola branch tetap:

- Tim PA2:
  - feature/pa2-<fitur>-<nama>
  - fix/pa2-<perbaikan>-<nama>
- Tim PA3:
  - feature/pa3-<fitur>-<nama>
  - fix/pa3-<perbaikan>-<nama>



