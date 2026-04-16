import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/data/models/anc_model.dart';
import 'package:ta_pa2_pa3_project/data/repositories/anc_repository.dart';

class AncT3Controller extends ChangeNotifier {
  final AncRepository _repository = AncRepository();
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  // --- 1. IDENTITAS KUNJUNGAN & TANGGAL ---
  final tanggalPeriksa = TextEditingController();
  final tanggalKembali = TextEditingController();
  final tempatPeriksa = TextEditingController();
  final namaDokter = TextEditingController();

  // --- 2. PEMERIKSAAN FISIK & JANIN ---
  final beratBadan = TextEditingController();
  final lila = TextEditingController();
  final tdSistolik = TextEditingController();
  final tdDiastolik = TextEditingController();
  final tinggiFundus = TextEditingController();

  bool _isKembar = false;
  bool get isKembar => _isKembar;
  set isKembar(bool val) { _isKembar = val; notifyListeners(); }

  String letakJanin1 = 'Vertex';
  final djj1 = TextEditingController();
  
  // --- 3. LABORATORIUM T3 ---
  final hemoglobin = TextEditingController();
  final tesGulaDarah = TextEditingController();
  String proteinUrin = 'Negatif';

  // --- 4. USG TRIMESTER 3 (Reaktif) ---
  String _keadaanBayi = "Hidup";
  String get keadaanBayi => _keadaanBayi;
  set keadaanBayi(String val) { _keadaanBayi = val; notifyListeners(); }

  String _lokasiPlasenta = "Fundus";
  String get lokasiPlasenta => _lokasiPlasenta;
  set lokasiPlasenta(String val) { _lokasiPlasenta = val; notifyListeners(); }

  final sdpKetuban = TextEditingController();
  final efw = TextEditingController(); // Taksiran Berat Janin

  // --- 5. RENCANA PERSALINAN ---
  String _rencanaMelahirkan = "Normal";
  String get rencanaMelahirkan => _rencanaMelahirkan;
  set rencanaMelahirkan(String val) { _rencanaMelahirkan = val; notifyListeners(); }

  // --- 6. PREEKLAMPSIA & KESIMPULAN ---
  bool bengkakWajah = false;
  final kesimpulan = TextEditingController();

  void toggleBengkak() {
    bengkakWajah = !bengkakWajah;
    notifyListeners();
  }

  // --- 7. LOGIKA SIMPAN DATA KE API ---
  Future<void> submitDataT3(int idKehamilan, BuildContext context) async {
    if (tanggalPeriksa.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Tanggal harus diisi!")));
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final data = AncPemeriksaanModel(
        idKehamilan: idKehamilan,
        trimester: '3',
        kunjunganKe: 3,
        tanggalPeriksa: DateTime.tryParse(tanggalPeriksa.text) ?? DateTime.now(),
        beratBadan: double.tryParse(beratBadan.text),
        tdSistolik: int.tryParse(tdSistolik.text),
        tdDiastolik: int.tryParse(tdDiastolik.text),
        tfu: double.tryParse(tinggiFundus.text),
        djj: int.tryParse(djj1.text),
        hb: double.tryParse(hemoglobin.text),
        presentasiJanin: letakJanin1,
        // Kita simpan detail USG dan rencana persalinan di field keluhan
        keluhan: "Rencana: $_rencanaMelahirkan, Plasenta: $_lokasiPlasenta, EFW: ${efw.text}g, Bengkak: $bengkakWajah. ${kesimpulan.text}",
      );

      final success = await _repository.submitPemeriksaan(data);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Data Trimester 3 Berhasil Disimpan"), backgroundColor: Colors.green),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Gagal Simpan: $e"), backgroundColor: Colors.red),
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
    tinggiFundus.dispose();
    djj1.dispose();
    hemoglobin.dispose();
    tesGulaDarah.dispose();
    sdpKetuban.dispose();
    efw.dispose();
    kesimpulan.dispose();
    super.dispose();
  }
}