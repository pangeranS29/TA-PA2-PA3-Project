// lib/database/local_database.dart

import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class LocalDatabase {
  // Singleton pattern agar koneksi database hanya diinisialisasi satu kali
  static final LocalDatabase instance = LocalDatabase._init();
  static Database? _database;

  LocalDatabase._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('sobat_imun_local.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
      onConfigure: _onConfigure,
    );
  }

  // Wajib untuk mengaktifkan validasi Foreign Key di SQLite
  Future _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON');
  }

  Future _createDB(Database db, int version) async {
    // ------------------------------------------------------------
    // 1. TABEL ROLES (Master Statis)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE roles (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TEXT,
        updated_at TEXT,
        is_deleted TEXT
      )
    ''');

    // Seed Data Roles
    await db.execute(
        "INSERT INTO roles VALUES (1, 'Kader', NULL, NULL, NULL, NULL)");
    await db.execute(
        "INSERT INTO roles VALUES (2, 'Bidan', NULL, NULL, NULL, NULL)");
    await db
        .execute("INSERT INTO roles VALUES (3, 'Ibu', NULL, NULL, NULL, NULL)");
    await db.execute(
        "INSERT INTO roles VALUES (13, 'Admin', NULL, '2026-05-29T06:48:24.191Z', '2026-05-29T06:48:24.191Z', NULL)");
    await db.execute(
        "INSERT INTO roles VALUES (16, 'Dokter', NULL, '2026-05-29T07:06:50.083Z', '2026-05-29T07:06:50.083Z', NULL)");
    await db.execute(
        "INSERT INTO roles VALUES (17, 'Tenaga-kesehatan', NULL, '2026-05-29T07:06:50.083Z', '2026-05-29T07:06:50.083Z', NULL)");
    await db.execute(
        "INSERT INTO roles VALUES (18, 'Superadmin', NULL, '2026-05-29T07:06:50.083Z', '2026-05-29T07:06:50.083Z', NULL)");
    await db.execute(
        "INSERT INTO roles VALUES (19, 'Admin_desa', NULL, '2026-05-29T07:06:50.083Z', '2026-05-29T07:06:50.083Z', NULL)");

    // ------------------------------------------------------------
    // 2. TABEL DESA (Master Statis/Dinamis)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE desa (
        id INTEGER PRIMARY KEY,
        nama_desa TEXT,
        kecamatan TEXT,
        kabupaten TEXT,
        provinsi TEXT,
        kode_desa TEXT UNIQUE,
        is_active INTEGER NOT NULL DEFAULT 1,
        keterangan TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        deleted_at TEXT,
        is_synced INTEGER DEFAULT 1
      )
    ''');

    // Seed Data Desa
    await db.execute(
        "INSERT INTO desa VALUES (1, 'Sitoluama', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-29T06:48:24.191Z', '2026-05-29T06:48:24.191Z', NULL, 1)");
    await db.execute(
        "INSERT INTO desa VALUES (2, 'Hutabulu Mejan', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-29T06:48:24.191Z', '2026-05-29T06:48:24.191Z', NULL, 1)");
    await db.execute(
        "INSERT INTO desa VALUES (3, 'Desa Sawoo', 'Porsea', 'Toba', 'Sumatera Utara', '22381', 1, '', '2026-05-29T11:36:32.290Z', '2026-05-29T11:36:38.918Z', NULL, 1)");

    // ------------------------------------------------------------
    // 3. TABEL DUSUN (Master Berelasi ke Desa)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE dusun (
        id INTEGER PRIMARY KEY,
        nama_dusun TEXT,
        desa_id INTEGER,
        is_synced INTEGER DEFAULT 1,
        FOREIGN KEY (desa_id) REFERENCES desa (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Dusun
    await db.execute("INSERT INTO dusun VALUES (1, 'Lumban Hariara', 1, 1)");
    await db.execute("INSERT INTO dusun VALUES (2, 'Gompar Simurung', 1, 1)");
    await db
        .execute("INSERT INTO dusun VALUES (3, 'Silalahi / Hutahaean', 1, 1)");
    await db.execute("INSERT INTO dusun VALUES (4, 'Pubalubis', 1, 1)");
    await db.execute("INSERT INTO dusun VALUES (5, 'Patujulu', 1, 1)");
    await db.execute("INSERT INTO dusun VALUES (6, 'Panalasa', 1, 1)");
    await db.execute("INSERT INTO dusun VALUES (7, 'Putumanda', 1, 1)");
    await db.execute("INSERT INTO dusun VALUES (8, 'Hutabulu', 2, 1)");
    await db.execute("INSERT INTO dusun VALUES (9, 'Hutagurgur', 2, 1)");
    await db.execute("INSERT INTO dusun VALUES (10, 'Mejan', 2, 1)");

    // ------------------------------------------------------------
    // 4. TABEL KARTU KELUARGA (Dinamis Operasional)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE kartu_keluarga (
        id INTEGER PRIMARY KEY,
        no_kk TEXT NOT NULL UNIQUE,
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        tanggal_terbit TEXT,
        is_synced INTEGER DEFAULT 1
      )
    ''');

    // Seed Data Kartu Keluarga
    await db.execute(
        "INSERT INTO kartu_keluarga VALUES (1, '3201010101010001', NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO kartu_keluarga VALUES (2, '3201010101010002', NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO kartu_keluarga VALUES (3, '3201010101010003', NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO kartu_keluarga VALUES (4, '3201010101010004', NULL, NULL, NULL, NULL, 1)");

    // ------------------------------------------------------------
    // 5. TABEL PENDUDUK (Dinamis Operasional - Berelasi ke KK & Dusun)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE penduduk (
        id INTEGER PRIMARY KEY,
        kartu_keluarga_id INTEGER,
        nik TEXT UNIQUE,
        nama_lengkap TEXT NOT NULL,
        jenis_kelamin TEXT,
        tanggal_lahir TEXT,
        tempat_lahir TEXT,
        golongan_darah TEXT,
        agama TEXT,
        status_perkawinan TEXT,
        pendidikan_terakhir TEXT,
        pekerjaan TEXT,
        baca_huruf TEXT,
        kedudukan_keluarga TEXT,
        kecamatan TEXT,
        tanggal_penambahan TEXT,
        asal_penduduk TEXT,
        tanggal_pengurangan TEXT,
        tujuan_pindah TEXT,
        tempat_meninggal TEXT,
        keterangan TEXT,
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        telepon TEXT,
        dusun_id INTEGER,
        dusun TEXT,
        desa TEXT,
        is_synced INTEGER DEFAULT 1,
        FOREIGN KEY (dusun_id) REFERENCES dusun (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (kartu_keluarga_id) REFERENCES kartu_keluarga (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Penduduk
    await db.execute(
        "INSERT INTO penduduk VALUES (6, 1, '1207010101800001', 'Mangapul Sitorus', 'Laki-laki', '1980-01-01T00:00:00Z', 'Balige', 'O', 'Kristen', 'Kawin', 'SMA', 'Petani', 'Bisa', 'Kepala Keluarga', 'Medan Baru', '2026-01-01T00:00:00Z', 'Balige', NULL, NULL, NULL, 'Data aktif', '2026-05-20T07:17:20Z', '2026-05-20T07:17:20Z', NULL, NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (7, 1, '1207015202850002', 'Tiurma br Simanjuntak', 'Perempuan', '1985-02-12T00:00:00Z', 'Tarutung', 'A', 'Kristen', 'Kawin', 'SMA', 'Ibu Rumah Tangga', 'Bisa', 'Istri', 'Medan Baru', '2026-01-01T00:00:00Z', 'Tarutung', NULL, NULL, NULL, 'Data aktif', '2026-05-20T07:17:20Z', '2026-05-20T07:17:20Z', NULL, NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (8, 1, '1207011503100003', 'Ronaldo Sitorus', 'Laki-laki', '2010-03-15T00:00:00Z', 'Medan', 'B', 'Kristen', 'Belum Kawin', 'SMP', 'Pelajar', 'Bisa', 'Anak', 'Medan Baru', '2026-01-01T00:00:00Z', 'Medan', NULL, NULL, NULL, 'Data aktif', '2026-05-20T07:17:20Z', '2026-05-20T07:17:20Z', NULL, NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (9, 1, '1207012008150004', 'Jesika br Sitorus', 'Perempuan', '2015-08-20T00:00:00Z', 'Medan', 'O', 'Kristen', 'Belum Kawin', 'SD', 'Pelajar', 'Bisa', 'Anak', 'Medan Baru', '2026-01-01T00:00:00Z', 'Medan', NULL, NULL, NULL, 'Data aktif', '2026-05-20T07:17:20Z', '2026-05-20T07:17:20Z', NULL, NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (10, 2, '1207010111750005', 'Hotman Hutapea', 'Laki-laki', '1975-11-01T00:00:00Z', 'Samosir', 'AB', 'Kristen', 'Kawin', 'S1', 'Guru', 'Bisa', 'Kepala Keluarga', 'Medan Johor', '2026-01-01T00:00:00Z', 'Samosir', NULL, NULL, NULL, 'Data aktif', '2026-05-20T07:17:20Z', '2026-05-20T07:17:20Z', NULL, NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (11, 2, '1207011002800006', 'Marlina br Nainggolan', 'Perempuan', '1980-02-10T00:00:00Z', 'Samosir', 'A', 'Kristen', 'Kawin', 'S1', 'Guru', 'Bisa', 'Istri', 'Medan Johor', '2026-01-01T00:00:00Z', 'Samosir', NULL, NULL, NULL, 'Data aktif', '2026-05-20T07:17:20Z', '2026-05-20T07:17:20Z', NULL, NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (1, NULL, '120809123123123', 'Josep', 'Laki-laki', '1998-07-16T00:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-17T16:33:41Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '+6281234567005', 10, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (2, 1, '3201010101010001', 'Siti', 'Perempuan', '1995-03-12T00:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Istri', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '081234567001', 8, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (3, 3, '3201010101010003', 'Dewi', 'Perempuan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Istri', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '081234567003', 8, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (12, 3, '12312312455646', 'Enriko Hutajulu', 'Laki-laki', NULL, NULL, NULL, NULL, 'Kawin', NULL, NULL, NULL, 'Kepala Keluarga', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '081234567006', 8, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (4, 3, NULL, 'Ani', 'Perempuan', '2026-04-09T00:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO penduduk VALUES (5, 3, NULL, 'Rina', 'Perempuan', '2026-05-11T00:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, NULL, NULL, 1)");

    // ------------------------------------------------------------
    // 6. TABEL VAKSIN (Master Statis Medis)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE vaksin (
        id INTEGER PRIMARY KEY,
        nama TEXT,
        deskripsi TEXT,
        efek_samping TEXT
      )
    ''');

    // Seed Data Vaksin
    await db.execute(
        "INSERT INTO vaksin VALUES (1, 'Hepatitis B', 'Mencegah penularan virus Hepatitis B dari ibu atau lingkungan.', 'Nyeri, kemerahan, atau bengkak ringan pada area suntikan.')");
    await db.execute(
        "INSERT INTO vaksin VALUES (2, 'Bacillus Calmette-Guérin (BCG)', 'Mencegah penyakit tuberkulosis (TBC) berat, seperti meningitis TBC, terutama pada bayi.', 'Munculnya benjolan merah kecil, bisul, atau luka bernanah (ulserasi) di tempat suntikan, biasanya 2-12 minggu setelah divaksin.')");
    await db.execute(
        "INSERT INTO vaksin VALUES (3, ' Polio Tetes', 'Membentuk antibodi dan memberikan perlindungan terhadap virus polio.', 'Demam ringan, rewel, nafsu makan menurun, serta gangguan pencernaan ringan seperti mual, muntah, atau diare.')");
    await db.execute(
        "INSERT INTO vaksin VALUES (4, 'DPT-HB-Hib', 'Imunisasi kombinasi wajib untuk mencegah 6 penyakit serius pada anak: difteri, pertusis (batuk rejan), tetanus, hepatitis B, pneumonia, dan meningitis', 'Nyeri, bengkak, atau kemerahan di area suntikan dan demam ringan hingga tinggi')");
    await db.execute(
        "INSERT INTO vaksin VALUES (5, 'IPV', 'Melindungi anak dari polio tipe 1, 2, dan 3 tanpa risiko menyebabkan penyakit', 'Nyeri, kemerahan, atau bengkak di lokasi suntikan, serta kemungkinan demam ringan')");
    await db.execute(
        "INSERT INTO vaksin VALUES (6, 'MR (Campak Rubella)', 'Imunisasi wajib untuk melindungi anak dari penyakit campak dan rubella (campak Jerman) menggunakan virus yang dilemahkan', 'Demam ringan, nyeri di lokasi suntikan, atau ruam, yang biasanya muncul 5–14 hari setelah vaksinasi')");

    // ------------------------------------------------------------
    // 7. TABEL DOSIS VAKSIN (Master Statis Berelasi ke Vaksin)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE dosis_vaksin (
        id INTEGER PRIMARY KEY,
        nama_dosis TEXT,
        jumlah_dosis TEXT,
        id_vaksin INTEGER,
        FOREIGN KEY (id_vaksin) REFERENCES vaksin (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Dosis Vaksin
    await db.execute("INSERT INTO dosis_vaksin VALUES (1, 'HB-0', '1', 1)");
    await db.execute("INSERT INTO dosis_vaksin VALUES (2, 'BCG', '1', 2)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (3, 'Polio OPV-1', '1', 3)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (4, 'DPT-HB-Hib-1', '1', 4)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (5, 'Polio OPV-2', '1', 3)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (6, 'DPT-HB-Hib-2', '1', 4)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (7, 'Polio OPV-3', '1', 3)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (8, 'DPT-HB-Hib-3', '1', 4)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (9, 'Polio OPV-4', '1', 3)");
    await db.execute("INSERT INTO dosis_vaksin VALUES (10, 'IPV', '1', 5)");
    await db.execute(
        "INSERT INTO dosis_vaksin VALUES (11, 'MR (Campak-Rubella)', '1', 6)");
    await db.execute(
        "INSERT INTO dosis_vaksin VALUES (12, 'DPT-HB-Hib Booster', '1', 4)");
    await db
        .execute("INSERT INTO dosis_vaksin VALUES (13, 'MR Booster', '1', 6)");

    // ------------------------------------------------------------
    // 8. TABEL ATURAN VAKSIN ANAK (Rule-Based Engine - Berelasi ke Dosis)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE aturan_vaksin_anak (
        id INTEGER PRIMARY KEY,
        id_dosis_vaksin INTEGER,
        min_usia_hari INTEGER,
        max_usia_hari INTEGER,
        id_dosis_sebelum INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        deleted_at TEXT,
        FOREIGN KEY (id_dosis_vaksin) REFERENCES dosis_vaksin (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (id_dosis_sebelum) REFERENCES dosis_vaksin (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Aturan Vaksin
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (1, 1, 0, 7, NULL, '2026-05-12T04:02:39Z', '2026-05-12T04:02:54.722Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (2, 2, 30, 60, NULL, '2026-05-12T04:03:31.547Z', '2026-05-12T04:03:31.547Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (3, 3, 30, 60, NULL, '2026-05-12T04:03:50.749Z', '2026-05-12T04:03:50.749Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (4, 4, 60, 90, NULL, '2026-05-12T13:32:43.569Z', '2026-05-12T13:32:43.569Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (5, 5, 60, 90, 3, '2026-05-12T13:33:09.516Z', '2026-05-12T13:33:09.516Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (6, 6, 90, 120, 4, '2026-05-12T13:33:35.234Z', '2026-05-12T13:33:35.234Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (7, 7, 90, 120, 5, '2026-05-12T13:33:57.448Z', '2026-05-12T13:33:57.448Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (8, 8, 120, 150, 6, '2026-05-12T13:34:57.643Z', '2026-05-12T13:34:57.643Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (9, 9, 120, 150, 7, '2026-05-12T13:35:23.820Z', '2026-05-12T13:35:23.820Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (11, 10, 270, 365, NULL, '2026-05-12T13:36:21.020Z', '2026-05-12T13:36:21.020Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (12, 12, 540, 600, 8, '2026-05-12T13:36:47.138Z', '2026-05-12T13:36:47.138Z', NULL)");
    await db.execute(
        "INSERT INTO aturan_vaksin_anak VALUES (13, 13, 540, 600, 11, '2026-05-12T13:37:26.015Z', '2026-05-12T13:37:26.015Z', NULL)");

    // ------------------------------------------------------------
    // 9. TABEL IBU (Rekam Medis - Berelasi ke Penduduk)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE ibu (
        id INTEGER PRIMARY KEY,
        penduduk_id INTEGER NOT NULL,
        suami_id INTEGER,
        gravida INTEGER,
        paritas INTEGER,
        abortus INTEGER,
        created_at TEXT,
        updated_at TEXT,
        is_deleted TEXT,
        is_synced INTEGER DEFAULT 1,
        FOREIGN KEY (penduduk_id) REFERENCES penduduk (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (suami_id) REFERENCES penduduk (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Ibu
    await db.execute(
        "INSERT INTO ibu VALUES (1, 3, 12, NULL, NULL, NULL, NULL, NULL, NULL, 1)");

    // ------------------------------------------------------------
    // 10. TABEL KEHAMILAN (Rekam Medis - Berelasi ke Ibu)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE kehamilan (
        id INTEGER PRIMARY KEY,
        ibu_id INTEGER NOT NULL,
        hpht TEXT,
        taksiran_persalinan TEXT,
        uk_kehamilan_saat_ini INTEGER,
        jarak_kehamilan_sebelumnya INTEGER,
        status_kehamilan TEXT,
        bb_awal REAL,
        tb REAL,
        imt_awal REAL,
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        is_synced INTEGER DEFAULT 1,
        FOREIGN KEY (ibu_id) REFERENCES ibu (id) ON DELETE CASCADE ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Kehamilan
    await db.execute(
        "INSERT INTO kehamilan VALUES (1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO kehamilan VALUES (2, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1)");

    // ------------------------------------------------------------
    // 11. TABEL ANAK (Rekam Medis - Berelasi ke Kehamilan & Penduduk)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE anak (
        id INTEGER PRIMARY KEY,
        kehamilan_id INTEGER NOT NULL,
        penduduk_id INTEGER NOT NULL,
        berat_lahir_kg REAL,
        tinggi_lahir_cm REAL,
        anak_ke INTEGER,
        lingkar_kepala_cm REAL,
        created_at TEXT,
        updated_at TEXT,
        deleted_at TEXT,
        tanggal_lahir TEXT,
        nama_ibu TEXT,
        nama_ayah TEXT,
        ibu_id INTEGER,
        is_synced INTEGER DEFAULT 1,
        FOREIGN KEY (penduduk_id) REFERENCES penduduk (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        FOREIGN KEY (kehamilan_id) REFERENCES kehamilan (id) ON DELETE CASCADE ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Anak
    await db.execute(
        "INSERT INTO anak VALUES (2, 2, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-11T14:50:46Z', NULL, NULL, NULL, 1)");
    await db.execute(
        "INSERT INTO anak VALUES (1, 1, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-09T13:47:20Z', NULL, NULL, NULL, 1)");

    // ------------------------------------------------------------
    // 12. TABEL STATUS JADWAL (Master Statis)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE status_jadwal (
        id INTEGER PRIMARY KEY,
        nama_status TEXT
      )
    ''');

    // Seed Data Status Jadwal
    await db.execute("INSERT INTO status_jadwal VALUES (1, 'Mendekati')");
    await db.execute("INSERT INTO status_jadwal VALUES (2, 'Jatuh Tempo')");
    await db.execute("INSERT INTO status_jadwal VALUES (3, 'Terlewat')");
    await db.execute("INSERT INTO status_jadwal VALUES (4, 'Terlambat')");
    await db.execute("INSERT INTO status_jadwal VALUES (5, 'Krisis')");
    await db.execute("INSERT INTO status_jadwal VALUES (6, 'Selesai')");

    // ------------------------------------------------------------
    // 13. TABEL JADWAL IMUNISASI ANAK (Dinamis - Berelasi Banyak)
    // ------------------------------------------------------------
    await db.execute('''
      CREATE TABLE jadwal_imunisasi_anak (
        id INTEGER PRIMARY KEY,
        id_dosis_vaksin INTEGER,
        tanggal_estimasi TEXT,
        id_anak INTEGER,
        id_status_jadwal INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        deleted_at TEXT,
        is_sent_h7 INTEGER DEFAULT 0,
        is_sent_h3 INTEGER DEFAULT 0,
        is_sent_h INTEGER DEFAULT 0,
        is_synced INTEGER DEFAULT 1,
        FOREIGN KEY (id_anak) REFERENCES anak (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (id_dosis_vaksin) REFERENCES dosis_vaksin (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (id_status_jadwal) REFERENCES status_jadwal (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    ''');

    // Seed Data Jadwal Imunisasi
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (2, 2, '2026-06-04', 2, 1, '2026-05-12T13:52:59.853Z', '2026-05-31T09:16:35.780Z', NULL, 0, 1, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (3, 3, '2026-05-11', 2, 6, '2026-05-12T13:53:00.328Z', '2026-06-02T01:10:37.654Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (1, 1, '2026-04-11', 2, 6, '2026-05-12T13:52:59.383Z', '2026-05-31T09:16:26.540Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (4, 4, '2026-06-10', 2, 1, '2026-05-12T13:53:00.773Z', '2026-05-31T09:16:26.977Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (5, 5, '2026-06-10', 2, 1, '2026-05-12T13:53:01.224Z', '2026-05-31T09:16:27.388Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (6, 6, '2026-07-10', 2, 1, '2026-05-12T13:53:01.703Z', '2026-05-31T09:16:27.814Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (7, 7, '2026-07-10', 2, 1, '2026-05-12T13:53:02.194Z', '2026-05-31T09:16:28.219Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (8, 8, '2026-08-09', 2, 1, '2026-05-12T13:53:02.663Z', '2026-05-31T09:16:28.639Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (9, 9, '2026-08-09', 2, 1, '2026-05-12T13:53:03.136Z', '2026-05-31T09:16:29.079Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (10, 10, '2027-01-06', 2, 1, '2026-05-12T13:53:03.602Z', '2026-05-31T09:16:29.488Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (11, 12, '2027-10-03', 2, 1, '2026-05-12T13:53:04.057Z', '2026-05-31T09:16:29.910Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (12, 13, '2027-10-03', 2, 1, '2026-05-12T13:53:04.525Z', '2026-05-31T09:16:30.327Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (13, 1, '2026-01-09', 1, 6, '2026-05-12T13:53:05.005Z', '2026-05-31T09:16:30.733Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (14, 2, '2026-02-08', 1, 6, '2026-05-12T13:53:05.463Z', '2026-05-31T09:16:31.149Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (15, 3, '2026-02-08', 1, 6, '2026-05-12T13:53:05.944Z', '2026-05-31T09:16:31.587Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (16, 4, '2026-03-10', 1, 6, '2026-05-12T13:53:06.407Z', '2026-05-31T09:16:32.009Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (17, 5, '2026-03-10', 1, 6, '2026-05-12T13:53:06.896Z', '2026-05-31T09:16:35.358Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (18, 6, '2026-04-09', 1, 5, '2026-05-12T13:53:07.355Z', '2026-05-31T09:16:32.437Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (19, 7, '2026-04-09', 1, 6, '2026-05-12T13:53:07.814Z', '2026-05-31T09:16:32.848Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (20, 8, '2026-05-09', 1, 5, '2026-05-12T13:53:08.287Z', '2026-05-31T09:16:33.258Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (21, 9, '2026-05-09', 1, 3, '2026-05-12T13:53:08.756Z', '2026-05-31T09:16:33.658Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (22, 10, '2026-10-06', 1, 1, '2026-05-12T13:53:09.249Z', '2026-05-31T09:16:34.080Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (23, 12, '2027-07-03', 1, 1, '2026-05-12T13:53:09.696Z', '2026-05-31T09:16:34.508Z', NULL, 0, 0, 0, 1)");
    await db.execute(
        "INSERT INTO jadwal_imunisasi_anak VALUES (24, 13, '2027-07-03', 1, 1, '2026-05-12T13:53:10.166Z', '2026-05-31T09:16:34.927Z', NULL, 0, 0, 0, 1)");

    // ------------------------------------------------------------
    // INDEX MANUAL UNTUK OPTIMASI QUERY (Optional tapi disarankan)
    // ------------------------------------------------------------
    await db.execute(
        'CREATE INDEX idx_penduduk_kk ON penduduk (kartu_keluarga_id)');
    await db.execute('CREATE INDEX idx_anak_kehamilan ON anak (kehamilan_id)');
    await db.execute(
        'CREATE INDEX idx_jadwal_anak ON jadwal_imunisasi_anak (id_anak)');

    print(
        "Seluruh 13 tabel, relasi, dan seed data Sobat Imun sukses dikonfigurasi!");
  }

  Future<void> cekDaftarTabel() async {
    final db = await instance.database;
    final List<Map<String, dynamic>> hasil = await db.rawQuery(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'android_%';");

    print("=========================================");
    print("🚀 STATUS DATABASE LOCAL: BERHASIL NYALA!");
    print("=========================================");
    for (var row in hasil) {
      print("➔ Menemukan Tabel: ${row['name']}");
    }
    print("=========================================");
  }

  Future close() async {
    final db = await instance.database;
    db.close();
  }
}
