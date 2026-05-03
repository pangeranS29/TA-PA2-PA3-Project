import 'package:flutter/material.dart';

class AncT3Controller {
  // --- 1. IDENTITAS KUNJUNGAN ---
  final tanggalPeriksa = TextEditingController();
  final tanggalKembali = TextEditingController();
  final tempatPeriksa = TextEditingController();
  final namaDokter = TextEditingController();

  // --- 2. PEMERIKSAAN FISIK & JANIN (Twin Support) ---
  final beratBadan = TextEditingController();
  final lila = TextEditingController();
  final tdSistolik = TextEditingController();
  final tdDiastolik = TextEditingController();
  final tinggiFundus = TextEditingController();

  bool isKembar = false;

  // Janin 1
  String letakJanin1 = 'Vertex';
  final djj1 = TextEditingController();
  String hasilDjj1 = 'Normal';
  final keteranganJanin1 = TextEditingController();

  // Janin 2 (digunakan jika isKembar = true)
  String letakJanin2 = 'Vertex';
  final djj2 = TextEditingController();
  String hasilDjj2 = 'Normal';
  final keteranganJanin2 = TextEditingController();

  // --- 3. LABORATORIUM T3 ---
  final hemoglobin = TextEditingController();
  final tesGulaDarah = TextEditingController();
  String proteinUrin = 'Negatif';
  String urinReduksi = 'Negatif';

  // --- 4. USG TRIMESTER III (Persiapan Lahir) ---
  String keadaanBayi = 'Hidup';
  String lokasiPlasenta = 'Fundus';
  final sdpKetuban = TextEditingController();
  String hasilKetuban = 'Cukup';

  // Biometri Janin T3
  final bpd = TextEditingController();
  final hc = TextEditingController();
  final ac = TextEditingController();
  final fl = TextEditingController();
  final efw = TextEditingController();

  // --- 5. RENCANA PERSALINAN ---
  String rencanaMelahirkan = 'Normal';
  final konsultasiLanjut = TextEditingController();

  // --- 6. PREEKLAMPSIA UPDATE T3 ---
  bool proteinuriaBaru = false;
  bool bengkakWajah = false;

  // --- 7. TATA LAKSANA & KESIMPULAN ---
  final tataLaksana = TextEditingController();
  final kesimpulan = TextEditingController();

  /// Bersihkan memori semua controller
  void dispose() {
    tanggalPeriksa.dispose();
    tanggalKembali.dispose();
    tempatPeriksa.dispose();
    namaDokter.dispose();
    beratBadan.dispose();
    lila.dispose();
    tdSistolik.dispose();
    tdDiastolik.dispose();
    tinggiFundus.dispose();
    djj1.dispose();
    keteranganJanin1.dispose();
    djj2.dispose();
    keteranganJanin2.dispose();
    hemoglobin.dispose();
    tesGulaDarah.dispose();
    sdpKetuban.dispose();
    bpd.dispose();
    hc.dispose();
    ac.dispose();
    fl.dispose();
    efw.dispose();
    konsultasiLanjut.dispose();
    tataLaksana.dispose();
    kesimpulan.dispose();
  }
}