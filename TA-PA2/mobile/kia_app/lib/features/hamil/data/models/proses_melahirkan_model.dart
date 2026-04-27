class ProsesMelahirkanModel {
  final String? id;
  final RingkasanPelayananMelahirkanModel ringkasan;
  final RiwayatProsesMelahirkanModel riwayat;
  final KeteranganLahirModel keteranganLahir;

  const ProsesMelahirkanModel({
    this.id,
    required this.ringkasan,
    required this.riwayat,
    required this.keteranganLahir,
  });

  factory ProsesMelahirkanModel.empty() => ProsesMelahirkanModel(
        ringkasan: RingkasanPelayananMelahirkanModel.empty(),
        riwayat: RiwayatProsesMelahirkanModel.empty(),
        keteranganLahir: KeteranganLahirModel.empty(),
      );

  factory ProsesMelahirkanModel.fromJson(Map<String, dynamic> json) {
    return ProsesMelahirkanModel(
      id: _readString(json, ['id', '_id', 'uuid']),
      ringkasan: RingkasanPelayananMelahirkanModel.fromJson(_readMap(json, [
        'ringkasan',
        'ringkasan_pelayanan',
        'ringkasanPelayanan',
      ], fallback: json)),
      riwayat: RiwayatProsesMelahirkanModel.fromJson(_readMap(json, [
        'riwayat',
        'riwayat_proses_melahirkan',
        'riwayatProsesMelahirkan',
      ], fallback: json)),
      keteranganLahir: KeteranganLahirModel.fromJson(_readMap(json, [
        'keterangan_lahir',
        'keteranganLahir',
        'keterangan',
      ], fallback: json)),
    );
  }
}

class RingkasanPelayananMelahirkanModel {
  final String tanggalMelahirkan;
  final String pukul;
  final String umurKehamilan;
  final String penolongProsesMelahirkan;
  final String caraMelahirkan;
  final String keadaanIbu;
  final String kbPascaMelahirkan;
  final String keteranganTambahan;
  final String anakKe;
  final String beratLahir;
  final String panjangBadan;
  final String lingkarKepala;
  final String jenisKelamin;
  final List<String> kondisiBayiSaatLahir;
  final List<String> asuhanBayiBaruLahir;

  const RingkasanPelayananMelahirkanModel({
    required this.tanggalMelahirkan,
    required this.pukul,
    required this.umurKehamilan,
    required this.penolongProsesMelahirkan,
    required this.caraMelahirkan,
    required this.keadaanIbu,
    required this.kbPascaMelahirkan,
    required this.keteranganTambahan,
    required this.anakKe,
    required this.beratLahir,
    required this.panjangBadan,
    required this.lingkarKepala,
    required this.jenisKelamin,
    required this.kondisiBayiSaatLahir,
    required this.asuhanBayiBaruLahir,
  });

  factory RingkasanPelayananMelahirkanModel.empty() => const RingkasanPelayananMelahirkanModel(
        tanggalMelahirkan: '', pukul: '', umurKehamilan: '', penolongProsesMelahirkan: '', caraMelahirkan: '', keadaanIbu: '', kbPascaMelahirkan: '', keteranganTambahan: '', anakKe: '', beratLahir: '', panjangBadan: '', lingkarKepala: '', jenisKelamin: '', kondisiBayiSaatLahir: [], asuhanBayiBaruLahir: [],
      );

  factory RingkasanPelayananMelahirkanModel.fromJson(Map<String, dynamic> json) => RingkasanPelayananMelahirkanModel(
        tanggalMelahirkan: _readString(json, ['tanggal_melahirkan', 'tanggalMelahirkan', 'tanggal_lahir']),
        pukul: _readString(json, ['pukul', 'jam_lahir', 'jamLahir']),
        umurKehamilan: _readString(json, ['umur_kehamilan', 'umurKehamilan']),
        penolongProsesMelahirkan: _readString(json, ['penolong_proses_melahirkan', 'penolongProsesMelahirkan', 'penolong_kelahiran']),
        caraMelahirkan: _readString(json, ['cara_melahirkan', 'caraMelahirkan']),
        keadaanIbu: _readString(json, ['keadaan_ibu', 'keadaanIbu']),
        kbPascaMelahirkan: _readString(json, ['kb_pasca_melahirkan', 'kbPascaMelahirkan']),
        keteranganTambahan: _readString(json, ['keterangan_tambahan', 'keteranganTambahan']),
        anakKe: _readString(json, ['anak_ke', 'anakKe']),
        beratLahir: _readString(json, ['berat_lahir', 'beratLahir']),
        panjangBadan: _readString(json, ['panjang_badan', 'panjangBadan']),
        lingkarKepala: _readString(json, ['lingkar_kepala', 'lingkarKepala']),
        jenisKelamin: _readString(json, ['jenis_kelamin', 'jenisKelamin']),
        kondisiBayiSaatLahir: _readStringList(json, ['kondisi_bayi_saat_lahir', 'kondisiBayiSaatLahir']),
        asuhanBayiBaruLahir: _readStringList(json, ['asuhan_bayi_baru_lahir', 'asuhanBayiBaruLahir']),
      );
}

class RiwayatProsesMelahirkanModel {
  final String gravida, para, abortus, hari, tanggal, pukul;
  final List<String> caraMelahirkan, tindakan, penolongKelahiran;
  final String taksiranMelahirkan, fasyankes, rujukan, inisiasiMenyusuDini;
  const RiwayatProsesMelahirkanModel({required this.gravida, required this.para, required this.abortus, required this.hari, required this.tanggal, required this.pukul, required this.caraMelahirkan, required this.tindakan, required this.penolongKelahiran, required this.taksiranMelahirkan, required this.fasyankes, required this.rujukan, required this.inisiasiMenyusuDini});
  factory RiwayatProsesMelahirkanModel.empty() => const RiwayatProsesMelahirkanModel(gravida: '', para: '', abortus: '', hari: '', tanggal: '', pukul: '', caraMelahirkan: [], tindakan: [], penolongKelahiran: [], taksiranMelahirkan: '', fasyankes: '', rujukan: '', inisiasiMenyusuDini: '');
  factory RiwayatProsesMelahirkanModel.fromJson(Map<String, dynamic> json) => RiwayatProsesMelahirkanModel(
    gravida: _readString(json, ['g', 'gravida']), para: _readString(json, ['p', 'para']), abortus: _readString(json, ['a', 'abortus']), hari: _readString(json, ['hari', 'pada_hari']), tanggal: _readString(json, ['tanggal', 'tanggal_melahirkan']), pukul: _readString(json, ['pukul']),
    caraMelahirkan: _readStringList(json, ['cara_melahirkan', 'caraMelahirkan']), tindakan: _readStringList(json, ['tindakan', 'dengan_tindakan']), penolongKelahiran: _readStringList(json, ['penolong_kelahiran', 'penolongKelahiran']),
    taksiranMelahirkan: _readString(json, ['taksiran_melahirkan', 'taksiranMelahirkan']), fasyankes: _readString(json, ['fasyankes']), rujukan: _readString(json, ['rujukan']), inisiasiMenyusuDini: _readString(json, ['inisiasi_menyusu_dini', 'inisiasiMenyusuDini']),
  );
}

class KeteranganLahirModel {
  final String nomor, hari, tanggal, pukul, jenisKelamin, jenisKelahiran, anakKe, beratLahir, panjangBadan, lingkarKepala, tempatLahir, alamatTempatLahir, namaIbu, umurIbu, nikIbu, namaAyah, nikAyah, pekerjaan, alamat, rtRw, kecamatan, kabKota, saksi1, saksi2, penolongKelahiran;
  const KeteranganLahirModel({required this.nomor, required this.hari, required this.tanggal, required this.pukul, required this.jenisKelamin, required this.jenisKelahiran, required this.anakKe, required this.beratLahir, required this.panjangBadan, required this.lingkarKepala, required this.tempatLahir, required this.alamatTempatLahir, required this.namaIbu, required this.umurIbu, required this.nikIbu, required this.namaAyah, required this.nikAyah, required this.pekerjaan, required this.alamat, required this.rtRw, required this.kecamatan, required this.kabKota, required this.saksi1, required this.saksi2, required this.penolongKelahiran});
  factory KeteranganLahirModel.empty() => const KeteranganLahirModel(nomor: '', hari: '', tanggal: '', pukul: '', jenisKelamin: '', jenisKelahiran: '', anakKe: '', beratLahir: '', panjangBadan: '', lingkarKepala: '', tempatLahir: '', alamatTempatLahir: '', namaIbu: '', umurIbu: '', nikIbu: '', namaAyah: '', nikAyah: '', pekerjaan: '', alamat: '', rtRw: '', kecamatan: '', kabKota: '', saksi1: '', saksi2: '', penolongKelahiran: '');
  factory KeteranganLahirModel.fromJson(Map<String, dynamic> json) => KeteranganLahirModel(
    nomor: _readString(json, ['nomor', 'no_surat']), hari: _readString(json, ['hari', 'pada_hari']), tanggal: _readString(json, ['tanggal']), pukul: _readString(json, ['pukul']), jenisKelamin: _readString(json, ['jenis_kelamin', 'jenisKelamin']), jenisKelahiran: _readString(json, ['jenis_kelahiran', 'jenisKelahiran']), anakKe: _readString(json, ['anak_ke', 'anakKe']), beratLahir: _readString(json, ['berat_lahir', 'beratLahir']), panjangBadan: _readString(json, ['panjang_badan', 'panjangBadan']), lingkarKepala: _readString(json, ['lingkar_kepala', 'lingkarKepala']), tempatLahir: _readString(json, ['tempat_lahir', 'tempatLahir']), alamatTempatLahir: _readString(json, ['alamat_tempat_lahir', 'alamatTempatLahir']), namaIbu: _readString(json, ['nama_ibu', 'namaIbu']), umurIbu: _readString(json, ['umur_ibu', 'umurIbu']), nikIbu: _readString(json, ['nik_ibu', 'nikIbu']), namaAyah: _readString(json, ['nama_ayah', 'namaAyah']), nikAyah: _readString(json, ['nik_ayah', 'nikAyah']), pekerjaan: _readString(json, ['pekerjaan']), alamat: _readString(json, ['alamat']), rtRw: _readString(json, ['rt_rw', 'rtRw']), kecamatan: _readString(json, ['kecamatan']), kabKota: _readString(json, ['kab_kota', 'kabKota']), saksi1: _readString(json, ['saksi_1', 'saksi1']), saksi2: _readString(json, ['saksi_2', 'saksi2']), penolongKelahiran: _readString(json, ['penolong_kelahiran', 'penolongKelahiran']),
  );
}

Map<String, dynamic> _readMap(Map<String, dynamic> json, List<String> keys, {Map<String, dynamic>? fallback}) {
  for (final key in keys) {
    final value = json[key];
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return Map<String, dynamic>.from(value);
  }
  return fallback ?? <String, dynamic>{};
}

String _readString(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value == null) continue;
    if (value is String) return value;
    return value.toString();
  }
  return '';
}

List<String> _readStringList(Map<String, dynamic> json, List<String> keys) {
  for (final key in keys) {
    final value = json[key];
    if (value is List) return value.where((e) => e != null).map((e) => e.toString()).toList();
    if (value is String && value.trim().isNotEmpty) return value.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList();
  }
  return const [];
}
