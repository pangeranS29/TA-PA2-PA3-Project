class ApiConstants {
  ApiConstants._();

  // Ganti jika backend dijalankan di host lain.
  // Android emulator: 10.0.2.2, iOS simulator: 127.0.0.1
  static const String baseUrl = 'http://127.0.0.1:8080';

  static const String pertumbuhan = '/pertumbuhan';
  static String riwayatPertumbuhanByAnakId(int anakId) => '/pertumbuhan/$anakId';

  static const String authLogin = '/auth/login';
  static const String authMe = '/auth/me';
}
