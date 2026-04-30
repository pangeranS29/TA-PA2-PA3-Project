import 'package:flutter/foundation.dart';

class ApiConstants {
  ApiConstants._();

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

  static const String authLogin = '/auth/login';
  static const String authMe = '/auth/me';
  static const String kehamilanAktif = '/modul-ibu/kehamilan-aktif';
  static const String pemeriksaanKehamilan = '/modul-ibu/pemeriksaan-kehamilan/me';
  static const String pemeriksaanDokterTrimester1 = '/modul-ibu/pemeriksaan-dokter-trimester-1/me';
  static const String pemeriksaanDokterTrimester3 = '/modul-ibu/pemeriksaan-dokter-trimester-3/me';
  static const String skriningPreeklampsia = '/modul-ibu/skrining-preeklampsia/me';
  static const String evaluasiKesehatanIbu = '/modul-ibu/evaluasi-kesehatan-ibu/me';
  static const String absensiKelasIbuHamil = '/modul-ibu/absensi-kelas-ibu-hamil/me';
  static const String saveAbsensiKelasIbuHamil = '/modul-ibu/absensi-kelas-ibu-hamil';
  static const String logTTDMMS = '/modul-ibu/log-ttd-mms/me';
  static const String saveLogTTDMMS = '/modul-ibu/log-ttd-mms';
}