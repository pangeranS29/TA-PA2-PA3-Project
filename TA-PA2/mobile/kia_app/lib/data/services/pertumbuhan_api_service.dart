import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/utils/auth_session.dart';
import 'package:ta_pa2_pa3_project/data/models/pertumbuhan_model.dart';

class PertumbuhanApiService {
  final http.Client _client;

  PertumbuhanApiService({http.Client? client}) : _client = client ?? http.Client();

  Map<String, String> _headers() {
    final token = AuthSession.token;
    return {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<PertumbuhanModel>> getRiwayatPertumbuhanByAnakId(int anakId) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}${ApiConstants.riwayatPertumbuhanByAnakId(anakId)}');
    final response = await _client.get(uri, headers: _headers());

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Gagal memuat riwayat pertumbuhan (${response.statusCode})');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final dynamic rawData = decoded['data'];

    if (rawData is List) {
      return rawData
          .whereType<Map<String, dynamic>>()
          .map(PertumbuhanModel.fromJson)
          .toList();
    }

    if (rawData is Map<String, dynamic>) {
      final dynamic items = rawData['items'] ?? rawData['riwayat'] ?? rawData['catatan'];
      if (items is List) {
        return items
            .whereType<Map<String, dynamic>>()
            .map(PertumbuhanModel.fromJson)
            .toList();
      }
    }

    return [];
  }

  Future<void> createCatatanPertumbuhan(CreatePertumbuhanRequest payload) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}${ApiConstants.pertumbuhan}');
    final response = await _client.post(
      uri,
      headers: _headers(),
      body: jsonEncode(payload.toJson()),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Gagal menambah catatan pertumbuhan (${response.statusCode})');
    }
  }

  void dispose() {
    _client.close();
  }
}
