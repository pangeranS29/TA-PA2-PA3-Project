class BblModel {
  final int id;
  final int anakId;
  final bool jam06;
  final bool jam648;
  final bool hari37;
  final bool hari828;

  BblModel({
    required this.id,
    required this.anakId,
    required this.jam06,
    required this.jam648,
    required this.hari37,
    required this.hari828,
  });

  factory BblModel.fromJson(Map<String, dynamic> json) {
    return BblModel(
      id: (json['id'] ?? 0) as int,
      anakId: (json['anak_id'] ?? 0) as int,
      jam06: json['jam_0_6'] == true,
      jam648: json['jam_6_48'] == true,
      hari37: json['hari_3_7'] == true,
      hari828: json['hari_8_28'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'jam_0_6': jam06,
      'jam_6_48': jam648,
      'hari_3_7': hari37,
      'hari_8_28': hari828,
    };
  }
}
