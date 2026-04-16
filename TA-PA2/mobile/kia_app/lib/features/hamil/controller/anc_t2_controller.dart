import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/data/models/anc_model.dart';
import 'package:ta_pa2_pa3_project/data/repositories/anc_repository.dart';

class AncT2Controller extends ChangeNotifier {
  final AncRepository _repository = AncRepository();
  bool _isLoading = false;

  // Getter untuk status loading agar UI bisa menampilkan spinner
  bool get isLoading => _isLoading;

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

  // --- 3. DATA JANIN ---
  bool _isKembar = false;
  bool get isKembar => _isKembar;
  set isKembar(bool value) {
    _isKembar = value;
    notifyListeners(); // UI akan update otomatis jika checkbox kembar diklik
  }

  String letakJanin1 = 'Vertex';
  final djj1 = TextEditingController();
  String hasilDjj1 = 'Normal';
  final keteranganJanin1 = TextEditingController();

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
  final bpd = TextEditingController();
  final hc = TextEditingController();
  final ac = TextEditingController();
  final fl = TextEditingController();
  final efw = TextEditingController();

  // --- 6. SKRINING PREEKLAMPSIA ---
  bool _riwayatPreeklampsia = false;
  bool get riwayatPreeklampsia => _riwayatPreeklampsia;
  set riwayatPreeklampsia(bool val) { _riwayatPreeklampsia = val; notifyListeners(); }

  bool _diabetes = false;
  bool get diabetes => _diabetes;
  set diabetes(bool val) { _diabetes = val; notifyListeners(); }

  bool _nullipara = false;
  bool get nullipara => _nullipara;
  set nullipara(bool val) { _nullipara = val; notifyListeners(); }

  bool _usiaDiatas35 = false;
  bool get usiaDiatas35 => _usiaDiatas35;
  set usiaDiatas35(bool val) { _usiaDiatas35 = val; notifyListeners(); }

  bool _mapDiatas90 = false;
  bool get mapDiatas90 => _mapDiatas90;
  set mapDiatas90(bool val) { _mapDiatas90 = val; notifyListeners(); }

  int get totalSkor {
    int skor = 0;
    if (_riwayatPreeklampsia) skor += 4;
    if (_isKembar) skor += 4; 
    if (_diabetes) skor += 4;
    if (_nullipara) skor += 1;
    if (_usiaDiatas35) skor += 1;
    if (_mapDiatas90) skor += 1;
    return skor;
  }

  String get interpretasi {
    if (totalSkor >= 4) return "Risiko Tinggi";
    if (totalSkor >= 1) return "Risiko Sedang";
    return "Risiko Rendah";
  }

  // --- 7. LOGIKA SIMPAN DATA (SINKRONISASI API) ---
  Future<void> submitData(int idKehamilan, BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Mapping dari TextEditingController ke Model
      final data = AncPemeriksaanModel(
        idKehamilan: idKehamilan,
        trimester: '2',
        kunjunganKe: 2, 
        tanggalPeriksa: DateTime.tryParse(tanggalPeriksa.text) ?? DateTime.now(),
        beratBadan: double.tryParse(beratBadan.text),
        tdSistolik: int.tryParse(tdSistolik.text),
        tdDiastolik: int.tryParse(tdDiastolik.text),
        lila: double.tryParse(lila.text),
        tfu: double.tryParse(tinggiFundus.text),
        djj: int.tryParse(djj1.text),
        hb: double.tryParse(hemoglobin.text),
        proteinUrine: proteinUrin,
        keluhan: "Hasil Skrining: $interpretasi. Janin Kembar: $_isKembar",
      );

      final success = await _repository.submitPemeriksaan(data);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Data Trimester 2 berhasil disinkronkan!")),
        );
        Navigator.pop(context);
      } else {
        throw Exception("Gagal menyimpan ke server");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Terjadi kesalahan: $e"), backgroundColor: Colors.red),
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    // Tetap pertahankan dispose untuk mencegah memory leak
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
    super.dispose();
  }
}