class AncPemeriksaanModel {
  final int? id;
  final int idKehamilan;
  final String trimester; // '1', '2', atau '3'
  final int kunjunganKe;
  final DateTime tanggalPeriksa;
  
  // Fisik Dasar
  final double? beratBadan;
  final int? tdSistolik;
  final int? tdDiastolik;
  final double? lila; // Lingkar Lengan Atas (Sangat penting di T1)

  // Pertumbuhan Janin (T2 & T3)
  final double? tfu; // Tinggi Fundus Uteri
  final int? djj; // Denyut Jantung Janin
  final String? presentasiJanin; // Kepala, Sungsang, Lintang

  // Laboratorium & Skrining
  final double? hb; // Hemoglobin (Skrining Anemia)
  final String? proteinUrine; // (+/-) Skrining Preeklampsia
  final String? keluhan;

  AncPemeriksaanModel({
    this.id,
    required this.idKehamilan,
    required this.trimester,
    required this.kunjunganKe,
    required this.tanggalPeriksa,
    this.beratBadan,
    this.tdSistolik,
    this.tdDiastolik,
    this.lila,
    this.tfu,
    this.djj,
    this.presentasiJanin,
    this.hb,
    this.proteinUrine,
    this.keluhan,
  });

  factory AncPemeriksaanModel.fromJson(Map<String, dynamic> json) {
    return AncPemeriksaanModel(
      id: json['id'] as int?,
      idKehamilan: json['id_kehamilan'] as int,
      trimester: json['trimester'] as String,
      kunjunganKe: json['kunjungan_ke'] as int,
      tanggalPeriksa: DateTime.parse(json['tanggal_periksa'] as String),
      beratBadan: (json['berat_badan'] as num?)?.toDouble(),
      tdSistolik: json['td_sistolik'] as int?,
      tdDiastolik: json['td_diastolik'] as int?,
      lila: (json['lila'] as num?)?.toDouble(),
      tfu: (json['tfu'] as num?)?.toDouble(),
      djj: json['djj'] as int?,
      presentasiJanin: json['presentasi_janin'] as String?,
      hb: (json['hb'] as num?)?.toDouble(),
      proteinUrine: json['protein_urine'] as String?,
      keluhan: json['keluhan'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'id_kehamilan': idKehamilan,
      'trimester': trimester,
      'kunjungan_ke': kunjunganKe,
      'tanggal_periksa': tanggalPeriksa.toIso8601String(),
      'berat_badan': beratBadan,
      'td_sistolik': tdSistolik,
      'td_diastolik': tdDiastolik,
      'lila': lila,
      'tfu': tfu,
      'djj': djj,
      'presentasi_janin': presentasiJanin,
      'hb': hb,
      'protein_urine': proteinUrine,
      'keluhan': keluhan,
    };
  }
}   