# Integration Charter - Struktur Proyek

Dokumen ini menjelaskan secara komprehensif mengenai struktur direktori utama dari repositori proyek ini agar memudahkan dalam proses integrasi dan pengembangan tim.

## 📱 /mobile (Flutter)
Direktori ini berisi kode sumber untuk aplikasi mobile yang dibangun menggunakan framework Flutter. Arsitektur aplikasi umumnya menggunakan struktur berbasis fitur (*feature-driven*) dengan pemisahan yang jelas antara konfigurasi inti (*core*) dan fitur spesifik.
* **`lib/core/`**: Berisi konfigurasi dasar yang bersifat global dan *reusable* (dapat digunakan di banyak tempat). Meliputi:
  * `constants/`: Konstanta seperti `api_constants.dart`.
  * `utils/` & `helpers/`: Fungsi utilitas bantuan.
  * Konfigurasi tema, routing global, dan *network service*.
* **`lib/features/`**: Berisi modul-modul fitur aplikasi secara spesifik (misalnya: `anak`, `ibu`, `auth`, dll). Setiap fitur umumnya dibagi lagi menjadi:
  * `data/`: Berisi *models*, pemanggilan API (*data sources*), dan implementasi *repository*.
  * `domain/`: Berisi entitas bisnis dan *usecases*.
  * `presentation/`: Berisi tampilan antarmuka (UI/UX) seperti *screens*, *widgets* khusus, dan *state management*.
* **`assets/`**: Direktori untuk menyimpan aset statis seperti gambar, logo, atau ikon aplikasi.
* **`pubspec.yaml`**: File manifest untuk mengatur dependensi (*package*), versi aplikasi, dan konfigurasi aset Flutter.

---

## ⚙️ /backend (Golang)
Direktori ini memuat seluruh sistem *backend* berupa RESTful API yang dikembangkan menggunakan bahasa pemrograman Golang. Menerapkan arsitektur *Clean Architecture* / MVC untuk menjaga kode tetap rapi dan terukur.
* **`app/controllers/`**: Bertugas menerima *HTTP Request* dari *client*, memvalidasi *input*, dan mengembalikan *HTTP Response* (JSON).
* **`app/usecases/`**: Merupakan tempat untuk *Business Logic* (Logika Bisnis). Controller akan memanggil *usecase* untuk memproses data sesuai aturan bisnis sistem.
* **`app/repositories/`**: Lapisan yang berhubungan langsung dengan basis data (*database*). Menangani query SQL atau ORM untuk fungsi-fungsi CRUD.
* **`app/models/`**: Mendefinisikan struktur data (struct) Golang yang merepresentasikan tabel di dalam basis data maupun struktur *request/response* API.
* **`app/routes/`**: Tempat mendaftarkan dan mengelompokkan berbagai *endpoint* API.
* **`app/middlewares/`**: Logika penengah (seperti autentikasi, pengecekan *role*, logging, dll) yang berjalan sebelum *request* mencapai controller.
* **`app/utils/` & `app/helpers/`**: Kumpulan fungsi utilitas umum.
* **`go.mod` & `go.sum`**: Berkas untuk manajemen *package/dependency* pada proyek Golang.

---

## 🗄️ /database
Direktori ini diperuntukkan bagi segala hal yang berhubungan dengan basis data proyek.
* **Skrip SQL**: Berisi skema database (DDL) untuk mendefinisikan pembuatan tabel, relasi, *trigger*, dan struktur database lainnya.
* **Migrations**: Menyimpan skrip migrasi untuk melacak perubahan atau pembaruan skema database (versi kontrol skema).
* **Seeders & Dumps**: Berisi skrip *seeder* untuk mengisi *database* dengan data awal (*dummy data*) yang diperlukan saat *development*, serta berkas cadangan (*dump file*).

---

## 📄 /docs
Direktori sentral untuk dokumentasi teknis dan non-teknis agar seluruh anggota tim dapat memahami cara kerja proyek secara menyeluruh.
* **Dokumentasi Arsitektur & Aturan**: Memuat dokumen pedoman seperti `integration-charter.md`, arsitektur sistem, dll.
* **Dokumentasi API**: Rangkuman spesifikasi API (Markdown atau Postman Collections) untuk memudahkan *frontend* dalam melakukan integrasi.
* **Panduan Penggunaan (*Guides*)**: Menyimpan file panduan instalasi/setup (*Quick Start*), *deployment*, catatan rilis (*Changelog*), hingga rangkuman perbaikan dan analisis *error*.
