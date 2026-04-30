class PersiapanMelahirkanModel {
  final bool perkiraanPersalinan;
  final bool pendampingPersalinan;
  final bool danaPersalinan;
  final bool statusJKN;
  final bool faskesPersalinan;
  final bool pendonorDarah;
  final bool transportasi;
  final bool metodeKB;
  final bool programP4K;
  final bool dokumenPenting;

  PersiapanMelahirkanModel({
    required this.perkiraanPersalinan,
    required this.pendampingPersalinan,
    required this.danaPersalinan,
    required this.statusJKN,
    required this.faskesPersalinan,
    required this.pendonorDarah,
    required this.transportasi,
    required this.metodeKB,
    required this.programP4K,
    required this.dokumenPenting,
  });

  factory PersiapanMelahirkanModel.fromJson(Map<String, dynamic> json) {
    return PersiapanMelahirkanModel(
      perkiraanPersalinan: json['perkiraan_persalinan'] ?? false,
      pendampingPersalinan: json['pendamping_persalinan'] ?? false,
      danaPersalinan: json['dana_persalinan'] ?? false,
      statusJKN: json['status_jkn'] ?? false,
      faskesPersalinan: json['faskes_persalinan'] ?? false,
      pendonorDarah: json['pendonor_darah'] ?? false,
      transportasi: json['transportasi'] ?? false,
      metodeKB: json['metode_kb'] ?? false,
      programP4K: json['program_p4k'] ?? false,
      dokumenPenting: json['dokumen_penting'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "perkiraan_persalinan": perkiraanPersalinan,
      "pendamping_persalinan": pendampingPersalinan,
      "dana_persalinan": danaPersalinan,
      "status_jkn": statusJKN,
      "faskes_persalinan": faskesPersalinan,
      "pendonor_darah": pendonorDarah,
      "transportasi": transportasi,
      "metode_kb": metodeKB,
      "program_p4k": programP4K,
      "dokumen_penting": dokumenPenting,
    };
  }
}