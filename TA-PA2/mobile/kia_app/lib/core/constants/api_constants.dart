import 'package:flutter/foundation.dart';

class ApiConstants {
  ApiConstants._();

  // Ganti jika backend dijalankan di host lain.
  // Android emulator: 10.0.2.2, iOS simulator / desktop: 127.0.0.1
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8080';
    }

    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return 'http://10.0.2.2:8080';
      default:
        return 'http://127.0.0.1:8080';
    }
  }

  static const String pertumbuhan = '/pertumbuhan';
  static String riwayatPertumbuhanByAnakId(int anakId) =>
      '/pertumbuhan/$anakId';
  static const String masterStandar = '/master-standar';
  static const String anakSearch = '/anak/search';
  static String anakById(int anakId) => '/anak/$anakId';
  static const String informasiUmum = '/informasi-umum';
  static String informasiUmumById(int id) => '/informasi-umum/$id';

  static const String authLogin = '/auth/login';
  static const String authMe = '/auth/me';

  static const String ibuAnak = '/ibu/anak';
  static const String ibuLembarPemantauan = '/ibu/lembar-pemantauan';
}
