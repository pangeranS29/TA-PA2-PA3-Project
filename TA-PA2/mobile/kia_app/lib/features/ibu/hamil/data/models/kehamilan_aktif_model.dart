// class KehamilanAktifModel {
//   final int id;
//   final int ibuId;
//   final int gravida;
//   final int paritas;
//   final int abortus;
//   final DateTime? hpht;
//   final DateTime? taksiranPersalinan;
//   final int ukKehamilanSaatIni;
//   final int jarakKehamilanSebelumnya;
//   final String statusKehamilan;
//   final double bbAwal;
//   final double tb;
//   final double imtAwal;

//   KehamilanAktifModel({
//     required this.id,
//     required this.ibuId,
//     required this.gravida,
//     required this.paritas,
//     required this.abortus,
//     this.hpht,
//     this.taksiranPersalinan,
//     required this.ukKehamilanSaatIni,
//     required this.jarakKehamilanSebelumnya,
//     required this.statusKehamilan,
//     required this.bbAwal,
//     required this.tb,
//     required this.imtAwal,
//   });

//   factory KehamilanAktifModel.fromJson(Map<String, dynamic> json) {
//     return KehamilanAktifModel(
//       id: json['id'] ?? 0,
//       ibuId: json['ibu_id'] ?? 0,
//       gravida: json['gravida'] ?? 0,
//       paritas: json['paritas'] ?? 0,
//       abortus: json['abortus'] ?? 0,
//       hpht: json['hpht'] != null ? DateTime.tryParse(json['hpht']) : null,
//       taksiranPersalinan: json['taksiran_persalinan'] != null
//           ? DateTime.tryParse(json['taksiran_persalinan'])
//           : null,
//       ukKehamilanSaatIni: json['uk_kehamilan_saat_ini'] ?? 0,
//       jarakKehamilanSebelumnya: json['jarak_kehamilan_sebelumnya'] ?? 0,
//       statusKehamilan: json['status_kehamilan'] ?? '',
//       bbAwal: (json['bb_awal'] as num?)?.toDouble() ?? 0.0,
//       tb: (json['tb'] as num?)?.toDouble() ?? 0.0,
//       imtAwal: (json['imt_awal'] as num?)?.toDouble() ?? 0.0,
//     );
//   }
// }

class KehamilanAktifModel {
  final int id;
  final int ibuId;
  final int gravida;
  final int paritas;
  final int abortus;
  final DateTime? hpht;
  final DateTime? taksiranPersalinan;
  final int ukKehamilanSaatIni;
  final int jarakKehamilanSebelumnya;
  final String statusKehamilan;
  final double bbAwal;
  final double tb;
  final double imtAwal;

  KehamilanAktifModel({
    required this.id,
    required this.ibuId,
    required this.gravida,
    required this.paritas,
    required this.abortus,
    this.hpht,
    this.taksiranPersalinan,
    required this.ukKehamilanSaatIni,
    required this.jarakKehamilanSebelumnya,
    required this.statusKehamilan,
    this.bbAwal = 0.0,
    this.tb = 0.0,
    this.imtAwal = 0.0,
  });

  factory KehamilanAktifModel.fromJson(Map<String, dynamic> json) {
    double toDouble(dynamic v) {
      if (v == null) return 0.0;
      if (v is num) return v.toDouble();
      return double.tryParse(v.toString()) ?? 0.0;
    }

    return KehamilanAktifModel(
      id: json['id'] ?? 0,
      ibuId: json['ibu_id'] ?? 0,
      gravida: json['gravida'] ?? 0,
      paritas: json['paritas'] ?? 0,
      abortus: json['abortus'] ?? 0,
      hpht: json['hpht'] != null ? DateTime.tryParse(json['hpht']) : null,
      taksiranPersalinan: json['taksiran_persalinan'] != null
          ? DateTime.tryParse(json['taksiran_persalinan'])
          : null,
      ukKehamilanSaatIni: json['uk_kehamilan_saat_ini'] ?? 0,
      jarakKehamilanSebelumnya: json['jarak_kehamilan_sebelumnya'] ?? 0,
      statusKehamilan: json['status_kehamilan'] ?? '',
      bbAwal: toDouble(json['bb_awal']),
      tb: toDouble(json['tb']),
      imtAwal: toDouble(json['imt_awal']),
    );
  }
}