import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/data/models/anc_model.dart';
import 'package:ta_pa2_pa3_project/data/repositories/anc_repository.dart';

class AncT1Controller extends ChangeNotifier {
  final AncRepository _repository = AncRepository();
  bool _isLoading = false;
  bool get isLoading => _isLoading;

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

  // --- 3. LAB & SKRINING AWAL ---
  final hemoglobin = TextEditingController();
  final tesGulaDarah = TextEditingController();
  
  String _proteinUrin = "Negatif";
  String get proteinUrin => _proteinUrin;
  set proteinUrin(String val) { _proteinUrin = val; notifyListeners(); }

  String _urinReduksi = "Negatif";
  String get urinReduksi => _urinReduksi;
  set urinReduksi(String val) { _urinReduksi = val; notifyListeners(); }

  // --- 4. USG TRIMESTER I (Variabel Spesifik T1) ---
  String _jumlahGS = "Tunggal";
  String get jumlahGS => _jumlahGS;
  set jumlahGS(String val) { _jumlahGS = val; notifyListeners(); }

  final diameterGS = TextEditingController();
  final crl = TextEditingController();
  
  String _pulsasiJantung = "Tampak";
  String get pulsasiJantung => _pulsasiJantung;
  set pulsasiJantung(String val) { _pulsasiJantung = val; notifyListeners(); }

  String _kecurigaanAbnormal = "Tidak";
  String get kecurigaanAbnormal => _kecurigaanAbnormal;
  set kecurigaanAbnormal(String val) { _kecurigaanAbnormal = val; notifyListeners(); }

  // --- LOGIKA SIMPAN DATA (SINKRONISASI API) ---
  Future<void> submitDataT1(int idKehamilan, BuildContext context) async {
    if (tanggalPeriksa.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Pilih tanggal periksa!")));
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      // Mapping ke AncPemeriksaanModel
      final data = AncPemeriksaanModel(
        idKehamilan: idKehamilan,
        trimester: '1',
        kunjunganKe: 1,
        tanggalPeriksa: DateTime.tryParse(tanggalPeriksa.text) ?? DateTime.now(),
        beratBadan: double.tryParse(beratBadan.text),
        lila: double.tryParse(lila.text),
        tdSistolik: int.tryParse(tdSistolik.text),
        tdDiastolik: int.tryParse(tdDiastolik.text),
        hb: double.tryParse(hemoglobin.text),
        proteinUrine: _proteinUrin,
        // Data USG & Lab Tambahan kita masukkan ke field keluhan agar fleksibel di Backend
        keluhan: "GS: $diameterGS mm ($_jumlahGS), CRL: $crl mm, Pulsasi: $_pulsasiJantung, Abnormal: $_kecurigaanAbnormal",
      );

      final success = await _repository.submitPemeriksaan(data);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Data Trimester 1 Berhasil Disimpan"), backgroundColor: Colors.green),
        );
        Navigator.pop(context);
      } else {
        throw Exception("Gagal menyimpan ke server");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Terjadi Kesalahan: $e"), backgroundColor: Colors.red),
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    tanggalPeriksa.dispose();
    tanggalKembali.dispose();
    tempatPeriksa.dispose();
    namaDokter.dispose();
    beratBadan.dispose();
    lila.dispose();
    tdSistolik.dispose();
    tdDiastolik.dispose();
    hemoglobin.dispose();
    tesGulaDarah.dispose();
    diameterGS.dispose();
    crl.dispose();
    super.dispose();
  }
}