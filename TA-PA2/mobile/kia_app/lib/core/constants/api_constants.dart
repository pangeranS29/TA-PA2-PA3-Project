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

  // MODUL IBU  ==================================================
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
    // Pemantauan Ibu Hamil               
  static const String pemantauanIbuHamil = '/modul-ibu/pemantauan-ibu-hamil/me';
  static const String savePemantauanIbuHamil = '/modul-ibu/pemantauan-ibu-hamil';
  static const String prosesMelahirkan = '/modul-ibu/proses-melahirkan/me';
    // Pemantauan Ibu Nifas
  static const String checklistPemantauanIbuNifas = '/modul-ibu/checklist-pemantauan-ibu-nifas';
  // static const String checklistPemantauanIbuNifasFilledDays = '/modul-ibu/checklist-pemantauan-ibu-nifas/filled-days';
  // static const String checklistNifasFilledDays = '/modul-ibu/checklist-pemantauan-nifas/filled-days';
  // static const String saveChecklistNifas = '/modul-ibu/checklist-pemantauan-nifas';
  static const String checklistNifasFilledDays = '/modul-ibu/checklist-pemantauan-ibu-nifas/filled-days';
  static const String checklistNifasSave = '/modul-ibu/checklist-pemantauan-ibu-nifas';
  static const String checklistNifasMe = '/modul-ibu/checklist-pemantauan-ibu-nifas/me';

  /*
   *
   * 
   * 
   * 
   * 
   * 
  */


  // MODUL ANAK ==================================================
    // Modul Anak - Data Ibu & Anak
    // Tumbuh Kembang
  static const String ibuAnak = '/ibu/anak';
  static const String ibuLembarPemantauan = '/ibu/lembar-pemantauan';
  static const String ibuLembarPemantauanRentangUsia =
      '/ibu/lembar-pemantauan/rentang-usia';
  static const String ibuLembarPemantauanKategori =
      '/ibu/lembar-pemantauan/kategori-tanda-sakit';      
      // Pencarian
  static const String anakSearch = '/anak/search';
  static String anakById(int anakId) => '/anak/$anakId';
      // Pertumbuhan dan Standar
  static const String pertumbuhan = '/pertumbuhan';
  static String riwayatPertumbuhanByAnakId(int anakId) => '/pertumbuhan/$anakId';
      // Informasi Umum
  static const String masterStandar = '/master-standar';
  static const String informasiUmum = '/informasi-umum';
  static String informasiUmumById(int id) => '/informasi-umum/$id';
}
