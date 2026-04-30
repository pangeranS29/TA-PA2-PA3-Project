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
  });

  factory KehamilanAktifModel.fromJson(Map<String, dynamic> json) {
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
    );
  }
}