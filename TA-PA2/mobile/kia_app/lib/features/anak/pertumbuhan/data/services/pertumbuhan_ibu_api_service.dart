import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/pertumbuhan_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/master_standar_model.dart';

// ─── Model untuk respons chart dari endpoint /ibu/pertumbuhan/chart/:anak_id ──
class PertumbuhanChartResponse {
  final List<PertumbuhanChartPoint> riwayat;
  final List<MasterStandarModel> standarBBU;
  final List<MasterStandarModel> standarTBU;

  const PertumbuhanChartResponse({
    required this.riwayat,
    required this.standarBBU,
    required this.standarTBU,
  });

  factory PertumbuhanChartResponse.fromJson(Map<String, dynamic> json) {
    List<T> parseList<T>(
      dynamic raw,
      T Function(Map<String, dynamic>) fromJson,
    ) {
      if (raw is List) {
        return raw.whereType<Map<String, dynamic>>().map(fromJson).toList();
      }
      return [];
    }

    return PertumbuhanChartResponse(
      riwayat: parseList(json['riwayat'], PertumbuhanChartPoint.fromJson),
      standarBBU:
          parseList(json['standar_bb_u'], MasterStandarModel.fromJson),
      standarTBU:
          parseList(json['standar_tb_u'], MasterStandarModel.fromJson),
    );
  }
}

class PertumbuhanChartPoint {
  final int usiaUkurBulan;
  final double beratBadan;
  final double tinggiBadan;
  final String tglUkur;

  const PertumbuhanChartPoint({
    required this.usiaUkurBulan,
    required this.beratBadan,
    required this.tinggiBadan,
    required this.tglUkur,
  });

  factory PertumbuhanChartPoint.fromJson(Map<String, dynamic> json) {
    double toDouble(dynamic v) {
      if (v == null) return 0;
      if (v is num) return v.toDouble();
      return double.tryParse(v.toString()) ?? 0;
    }

    int toInt(dynamic v) {
      if (v == null) return 0;
      if (v is num) return v.toInt();
      return int.tryParse(v.toString()) ?? 0;
    }

    return PertumbuhanChartPoint(
      usiaUkurBulan: toInt(json['usia_ukur_bulan']),
      beratBadan: toDouble(json['berat_badan']),
      tinggiBadan: toDouble(json['tinggi_badan']),
      tglUkur: (json['tgl_ukur'] ?? '').toString(),
    );
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────
class PertumbuhanIbuApiService {
  final http.Client _client;

  PertumbuhanIbuApiService({http.Client? client})
      : _client = client ?? http.Client();

  Map<String, String> _headers() {
    final token = AuthSession.token;
    return {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  String _extractError(String body, int statusCode) {
    try {
      final decoded = jsonDecode(body) as Map<String, dynamic>;
      final msg = decoded['message'];
      if (msg is List && msg.isNotEmpty) return msg.join(', ');
      if (msg is String && msg.trim().isNotEmpty) return msg;
    } catch (_) {}
    return 'Request gagal ($statusCode)';
  }

  /// GET /ibu/pertumbuhan/chart/:anak_id
  /// Mengembalikan riwayat titik-titik grafik + data standar WHO (BB/U & TB/U)
  Future<PertumbuhanChartResponse> getChart(int anakId) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}${ApiConstants.ibuPertumbuhanChart(anakId)}',
    );
    final response = await _client.get(uri, headers: _headers());
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractError(response.body, response.statusCode));
    }
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final data = decoded['data'];
    if (data is Map<String, dynamic>) {
      return PertumbuhanChartResponse.fromJson(data);
    }
    return PertumbuhanChartResponse(riwayat: [], standarBBU: [], standarTBU: []);
  }

  /// GET /ibu/pertumbuhan/riwayat/:anak_id
  /// Mengembalikan riwayat lengkap pertumbuhan + status gizi
  Future<List<PertumbuhanModel>> getRiwayat(int anakId) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}${ApiConstants.ibuRiwayatPertumbuhan(anakId)}',
    );
    final response = await _client.get(uri, headers: _headers());
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractError(response.body, response.statusCode));
    }
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final raw = decoded['data'];
    if (raw is List) {
      return raw
          .whereType<Map<String, dynamic>>()
          .map(PertumbuhanModel.fromJson)
          .toList();
    }
    return [];
  }

  /// GET /ibu/pertumbuhan/detail/:id
  Future<PertumbuhanModel?> getDetail(int id) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}${ApiConstants.ibuDetailPertumbuhan(id)}',
    );
    final response = await _client.get(uri, headers: _headers());
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractError(response.body, response.statusCode));
    }
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final raw = decoded['data'];
    if (raw is Map<String, dynamic>) {
      return PertumbuhanModel.fromJson(raw);
    }
    return null;
  }

  void dispose() => _client.close();
}
