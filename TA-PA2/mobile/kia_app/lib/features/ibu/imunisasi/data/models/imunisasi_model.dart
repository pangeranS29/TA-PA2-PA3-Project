class ImunisasiModel {
  final int anakId;
  final String namaAnak;
  final DateTime? tanggalLahir;
  final List<JadwalImunisasiModel> jadwal;
  final int jumlahTerlewat;

  ImunisasiModel({
    required this.anakId,
    required this.namaAnak,
    required this.tanggalLahir,
    required this.jadwal,
    required this.jumlahTerlewat,
  });

  factory ImunisasiModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return ImunisasiModel(
      anakId: json['anak_id'] ?? 0,
      namaAnak: json['nama_anak'] ?? '',
      tanggalLahir: json['tanggal_lahir'] != null
          ? DateTime.parse(
              json['tanggal_lahir'],
            )
          : null,
      jadwal: (json['jadwal'] as List?)
              ?.map(
                (item) => JadwalImunisasiModel.fromJson(
                  Map<String, dynamic>.from(
                    item,
                  ),
                ),
              )
              .toList() ??
          [],
      jumlahTerlewat: (json['jumlah_terlewat'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'anak_id': anakId,
      'nama_anak': namaAnak,
      'tanggal_lahir': tanggalLahir?.toIso8601String(),
      'jadwal': jadwal.map((e) => e.toJson()).toList(),
    };
  }
}

class JadwalImunisasiModel {
  final int jadwalId;
  final String namaDosis;
  final DateTime? tanggalEstimasi;
  final int statusId;
  final String status;

  JadwalImunisasiModel({
    required this.jadwalId,
    required this.namaDosis,
    required this.tanggalEstimasi,
    required this.statusId,
    required this.status,
  });

  factory JadwalImunisasiModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return JadwalImunisasiModel(
      jadwalId: json['jadwal_id'] ?? 0,
      namaDosis: json['nama_dosis'] ?? '',
      tanggalEstimasi: json['tanggal_estimasi'] != null
          ? DateTime.parse(
              json['tanggal_estimasi'],
            )
          : null,
      statusId: json['status_id'] ?? 0,
      status: json['status'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'jadwal_id': jadwalId,
      'nama_dosis': namaDosis,
      'tanggal_estimasi': tanggalEstimasi?.toIso8601String(),
      'status_id': statusId,
      'status': status,
    };
  }
}
