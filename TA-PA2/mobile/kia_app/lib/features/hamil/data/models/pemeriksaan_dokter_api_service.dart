import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/pemeriksaan_dokter_model.dart';

class PemeriksaanDokterApiService {
  final http.Client _client;

  PemeriksaanDokterApiService({http.Client? client})
      : _client = client ?? http.Client();

  Future<PemeriksaanDokterTrimester1Model> getTrimester1Mine() async {
    final data = await _get(ApiConstants.pemeriksaanDokterTrimester1);
    return PemeriksaanDokterTrimester1Model.fromJson(data);
  }

  Future<PemeriksaanDokterTrimester3Model> getTrimester3Mine() async {
    final data = await _get(ApiConstants.pemeriksaanDokterTrimester3);
    return PemeriksaanDokterTrimester3Model.fromJson(data);
  }

  Future<Map<String, dynamic>> _get(String path) async {
    final token = AuthSession.token;

    if (token == null || token.isEmpty) {
      throw Exception('Token tidak ditemukan. Silakan login ulang.');
    }

    final uri = Uri.parse('${ApiConstants.baseUrl}$path');

    final response = await _client.get(
      uri,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 404) {
      throw Exception(body['message'] ?? 'Data pemeriksaan dokter belum tersedia');
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(
        'Gagal mengambil data pemeriksaan dokter (${response.statusCode})',
      );
    }

    return body['data'] as Map<String, dynamic>;
  }

  void dispose() {
    _client.close();
  }
}