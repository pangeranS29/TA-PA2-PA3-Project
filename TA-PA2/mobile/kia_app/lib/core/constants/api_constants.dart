class ApiConstants {
  ApiConstants._();

  // Ganti jika backend dijalankan di host lain.
  // Android emulator: 10.0.2.2, iOS simulator: 127.0.0.1
  static const String baseUrl = 'http://127.0.0.1:8080';
  // static const String baseUrl = 'http://10.0.2.2:8080';

  static const String pertumbuhan = '/pertumbuhan';
  static String riwayatPertumbuhanByAnakId(int anakId) =>
      '/pertumbuhan/$anakId';
  static const String masterStandar = '/master-standar';
  static const String anakSearch = '/anak/search';
  static String anakById(int anakId) => '/anak/$anakId';

  static const String authLogin = '/auth/login';
  static const String authMe = '/auth/me';

  // Data Ibu
  static const String kehamilanAktif = '/modul-ibu/kehamilan-aktif';

  // Evaluasi Kehamilan
  static const String evaluasiKesehatanIbu = '/modul-ibu/evaluasi-kesehatan-ibu/me';

  // Pemeriksaan Kehamilan
  static const String pemeriksaanKehamilan = '/modul-ibu/pemeriksaan-kehamilan/me';

  // Skrining Preeklampsia
  static const String skriningPreeklampsia = '/modul-ibu/skrining-preeklampsia/me';

  // Proses Melahirkan
  static const String prosesMelahirkan = '/modul-ibu/proses-melahirkan/me';

  // Pemeriksaan Dokter Trim 1 & 3
  static const String pemeriksaanDokterTrimester1 = '/modul-ibu/pemeriksaan-dokter-trimester-1/me';
  static const String pemeriksaanDokterTrimester3 = '/modul-ibu/pemeriksaan-dokter-trimester-3/me';
}
