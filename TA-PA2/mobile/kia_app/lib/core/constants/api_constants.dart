class ApiConstants {
  ApiConstants._();

  // Ganti jika backend dijalankan di host lain.
  // Android emulator: 10.0.2.2, iOS simulator: 127.0.0.1
  static const String baseUrl = 'http://127.0.0.1:8080';

  static const String pertumbuhan = '/pertumbuhan';
  static String riwayatPertumbuhanByAnakId(int anakId) =>
      '/pertumbuhan/$anakId';
  static const String masterStandar = '/master-standar';
  static const String anakSearch = '/anak/search';
  static String anakById(int anakId) => '/anak/$anakId';

  static const String authLogin = '/auth/login';
  static const String authMe = '/auth/me';

  static const String ibuAnak = '/ibu/anak';
  static const String ibuLembarPemantauan = '/ibu/lembar-pemantauan';
  static const String ibuLembarPemantauanRentangUsia =
      '/ibu/lembar-pemantauan/rentang-usia';
  static const String ibuLembarPemantauanKategori =
      '/ibu/lembar-pemantauan/kategori-tanda-sakit';
}
