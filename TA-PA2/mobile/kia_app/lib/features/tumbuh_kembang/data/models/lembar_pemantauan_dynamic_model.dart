class RentangUsiaModel {
  final int id;
  final String namaRentang;
  final String satuanWaktu;

  const RentangUsiaModel({
    required this.id,
    required this.namaRentang,
    required this.satuanWaktu,
  });

  factory RentangUsiaModel.fromJson(Map<String, dynamic> json) {
    return RentangUsiaModel(
      id: (json['id'] as num?)?.toInt() ?? 0,
      namaRentang: (json['nama_rentang'] ?? '').toString(),
      satuanWaktu: (json['satuan_waktu'] ?? '').toString(),
    );
  }
}

class KategoriTandaSakitModel {
  final int id;
  final int rentangUsiaId;
  final String gejala;
  final String deskripsi;

  const KategoriTandaSakitModel({
    required this.id,
    required this.rentangUsiaId,
    required this.gejala,
    required this.deskripsi,
  });

  factory KategoriTandaSakitModel.fromJson(Map<String, dynamic> json) {
    return KategoriTandaSakitModel(
      id: (json['id'] as num?)?.toInt() ?? 0,
      rentangUsiaId: (json['rentang_usia_id'] as num?)?.toInt() ?? 0,
      gejala: (json['gejala'] ?? '').toString(),
      deskripsi: (json['deskripsi'] ?? '').toString(),
    );
  }
}
