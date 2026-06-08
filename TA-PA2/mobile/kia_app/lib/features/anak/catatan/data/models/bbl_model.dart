class BblModel {
  final int id;
  final int anakId;
  final bool jam06;
  final DateTime? tanggalSubmitJam06;
  final bool jam648;
  final DateTime? tanggalSubmitJam648;
  final bool hari37;
  final DateTime? tanggalSubmitHari37;
  final bool hari828;
  final DateTime? tanggalSubmitHari828;

  BblModel({
    required this.id,
    required this.anakId,
    required this.jam06,
    this.tanggalSubmitJam06,
    required this.jam648,
    this.tanggalSubmitJam648,
    required this.hari37,
    this.tanggalSubmitHari37,
    required this.hari828,
    this.tanggalSubmitHari828,
  });

  factory BblModel.fromJson(Map<String, dynamic> json) {
    return BblModel(
      id: (json['id'] ?? 0) as int,
      anakId: (json['anak_id'] ?? 0) as int,
      jam06: json['jam_0_6'] == true,
      tanggalSubmitJam06: json['tanggal_submit_jam_0_6'] != null
          ? DateTime.parse(json['tanggal_submit_jam_0_6'] as String)
          : null,
      jam648: json['jam_6_48'] == true,
      tanggalSubmitJam648: json['tanggal_submit_jam_6_48'] != null
          ? DateTime.parse(json['tanggal_submit_jam_6_48'] as String)
          : null,
      hari37: json['hari_3_7'] == true,
      tanggalSubmitHari37: json['tanggal_submit_hari_3_7'] != null
          ? DateTime.parse(json['tanggal_submit_hari_3_7'] as String)
          : null,
      hari828: json['hari_8_28'] == true,
      tanggalSubmitHari828: json['tanggal_submit_hari_8_28'] != null
          ? DateTime.parse(json['tanggal_submit_hari_8_28'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'jam_0_6': jam06,
      'tanggal_submit_jam_0_6': tanggalSubmitJam06?.toIso8601String(),
      'jam_6_48': jam648,
      'tanggal_submit_jam_6_48': tanggalSubmitJam648?.toIso8601String(),
      'hari_3_7': hari37,
      'tanggal_submit_hari_3_7': tanggalSubmitHari37?.toIso8601String(),
      'hari_8_28': hari828,
      'tanggal_submit_hari_8_28': tanggalSubmitHari828?.toIso8601String(),
    };
  }
}
