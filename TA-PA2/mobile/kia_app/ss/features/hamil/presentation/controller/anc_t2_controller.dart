import 'package:flutter/material.dart';

class AncT2Controller {
  // --- 1. IDENTITAS KUNJUNGAN & TANGGAL ---
  final tanggalPeriksa = TextEditingController();
  final tanggalKembali = TextEditingController();
  final tempatPeriksa = TextEditingController();
  final namaDokter = TextEditingController();

  // --- 2. PEMERIKSAAN FISIK ---
  final beratBadan = TextEditingController();
  final lila = TextEditingController();
  final tdSistolik = TextEditingController();
  final tdDiastolik = TextEditingController();
  final tinggiFundus = TextEditingController();

  // --- 3. DATA JANIN (Dukungan Kembar) ---
  bool isKembar = false;

  // Janin 1
  String letakJanin1 = 'Vertex';
  final djj1 = TextEditingController();
  String hasilDjj1 = 'Normal';
  final keteranganJanin1 = TextEditingController();

  // Janin 2 (Digunakan jika isKembar = true)
  String letakJanin2 = 'Vertex';
  final djj2 = TextEditingController();
  String hasilDjj2 = 'Normal';
  final keteranganJanin2 = TextEditingController();

  // --- 4. LABORATORIUM ---
  final hemoglobin = TextEditingController();
  final tesGulaDarah = TextEditingController();
  final gdPuasa = TextEditingController();
  final gd2JamPP = TextEditingController();
  String proteinUrin = 'Negatif';
  String urinReduksi = 'Negatif';

  // --- 5. USG TRIMESTER 2 (Biometri) ---
  final bpd = TextEditingController(); // Diameter Kepala
  final hc = TextEditingController();  // Lingkar Kepala
  final ac = TextEditingController();  // Lingkar Perut
  final fl = TextEditingController();  // Panjang Tulang Paha
  final efw = TextEditingController(); // Taksiran Berat Janin (gram)

  // --- 6. SKRINING PREEKLAMPSIA ---
  // Skor Tinggi (4 poin)
  bool riwayatPreeklampsia = false;
  bool kehamilanMultiple = false; // Seharusnya otomatis 'true' jika isKembar = true
  bool diabetes = false;

  // Skor Sedang (1 poin)
  bool nullipara = false;
  bool usiaDiatas35 = false;
  bool mapDiatas90 = false;

  /// Hitung Total Skor Preeklampsia otomatis
  int get totalSkor {
    int skor = 0;
    if (riwayatPreeklampsia) skor += 4;
    // Jika isKembar aktif, poin kehamilan multiple otomatis +4
    if (isKembar || kehamilanMultiple) skor += 4; 
    if (diabetes) skor += 4;
    if (nullipara) skor += 1;
    if (usiaDiatas35) skor += 1;
    if (mapDiatas90) skor += 1;
    return skor;
  }

  String get interpretasi {
    if (totalSkor >= 4) return "Risiko Tinggi";
    if (totalSkor >= 1) return "Risiko Sedang";
    return "Risiko Rendah";
  }

  /// Membersihkan memori saat controller tidak digunakan
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
    gdPuasa.dispose();
    gd2JamPP.dispose();
    bpd.dispose();
    hc.dispose();
    ac.dispose();
    fl.dispose();
    efw.dispose();
  }
}