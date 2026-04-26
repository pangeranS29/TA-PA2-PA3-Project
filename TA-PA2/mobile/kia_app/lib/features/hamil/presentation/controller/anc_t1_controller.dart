import 'package:flutter/material.dart';

class AncT1Controller {
  // --- 1. IDENTITAS KUNJUNGAN ---
  final tanggalPeriksa = TextEditingController();
  final tanggalKembali = TextEditingController();
  final tempatPeriksa = TextEditingController();
  final namaDokter = TextEditingController();

  // --- 2. PEMERIKSAAN FISIK ---
  final beratBadan = TextEditingController();
  final lila = TextEditingController();
  final tdSistolik = TextEditingController();
  final tdDiastolik = TextEditingController();
  final tinggiFundus = TextEditingController(); // Biasanya "Belum teraba" di T1
  final djj = TextEditingController();         // Biasanya "Cek via USG" di T1
  String hasilDjj = "Belum Diperiksa"; 

  // --- 3. LAB & SKRINING AWAL ---
  final hemoglobin = TextEditingController();
  final tesGulaDarah = TextEditingController();
  String proteinUrin = "Negatif";
  String urinReduksi = "Negatif";

  // --- 4. USG TRIMESTER I ---
  String jumlahGS = "Tunggal";
  final diameterGS = TextEditingController();
  final crl = TextEditingController();
  
  // Usia Otomatis USG
  final gsMinggu = TextEditingController();
  final gsHari = TextEditingController();
  final crlMinggu = TextEditingController();
  final crlHari = TextEditingController();

  String pulsasiJantung = "Tampak";
  String kecurigaanAbnormal = "Tidak";

  /// Fungsi untuk membersihkan memori
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
    djj.dispose();
    hemoglobin.dispose();
    tesGulaDarah.dispose();
    diameterGS.dispose();
    crl.dispose();
    gsMinggu.dispose();
    gsHari.dispose();
    crlMinggu.dispose();
    crlHari.dispose();
  }

  /// Mapping data ke format Map untuk Database PostgreSQL
  Map<String, dynamic> collectDataForDatabase(int idKehamilan) {
    return {
      'id_kehamilan': idKehamilan,
      'trimester': '1',
      'tanggal_periksa': tanggalPeriksa.text,
      'tempat_periksa': tempatPeriksa.text,
      'nama_tenaga_kesehatan': namaDokter.text,
      'berat_badan': double.tryParse(beratBadan.text),
      'lila': double.tryParse(lila.text),
      'sistolik': int.tryParse(tdSistolik.text),
      'diastolik': int.tryParse(tdDiastolik.text),
      'hemoglobin': double.tryParse(hemoglobin.text),
      'protein_urin': proteinUrin,
      'urin_reduksi': urinReduksi,
      'diameter_gs': double.tryParse(diameterGS.text),
      'crl': double.tryParse(crl.text),
      'pulsasi_jantung': pulsasiJantung,
      'kecurigaan_abnormal': kecurigaanAbnormal,
    };
  }
}