class AncPemeriksaanModel {
  final int? id;
  final int idKehamilan;
  final String trimester; // Enum: '1', '2', '3'
  final int kunjunganKe;
  final DateTime tanggalPeriksa;
  final double? beratBadan;
  final int? tdSistolik;
  final int? tdDiastolik;

  AncPemeriksaanModel({
    this.id,
    required this.idKehamilan,
    required this.trimester,
    required this.kunjunganKe,
    required this.tanggalPeriksa,
    this.beratBadan,
    this.tdSistolik,
    this.tdDiastolik,
  });

  /// Mapping ke JSON untuk integrasi API Backend
  Map<String, dynamic> toJson() {
    return {
      'id_kehamilan': idKehamilan,
      'trimester': trimester,
      'kunjungan_ke': kunjunganKe,
      'tanggal_periksa': tanggalPeriksa.toIso8601String(),
      'berat_badan': beratBadan,
      'td_sistolik': tdSistolik,
      'td_diastolik': tdDiastolik,
    };
  }
}