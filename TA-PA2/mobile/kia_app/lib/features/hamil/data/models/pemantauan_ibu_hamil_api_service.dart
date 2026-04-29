import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/pemantauan_ibu_hamil_model.dart';

class PemantauanIbuHamilApiService {
  final http.Client _client;

  PemantauanIbuHamilApiService({http.Client? client})
      : _client = client ?? http.Client();

  Map<String, String> get _headers {
    final token = AuthSession.token;

    if (token == null || token.isEmpty) {
      throw Exception('Token tidak ditemukan. Silakan login ulang.');
    }

    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }

  Future<List<PemantauanIbuHamilModel>> getMine() async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}${ApiConstants.pemantauanIbuHamil}',
    );

    final response = await _client.get(uri, headers: _headers);
    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 404) {
      return [];
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(body['message'] ?? 'Gagal mengambil pemantauan ibu hamil');
    }

    final data = body['data'];

    if (data is List) {
      return data
          .map(
            (item) => PemantauanIbuHamilModel.fromJson(
              Map<String, dynamic>.from(item),
            ),
          )
          .toList();
    }

    return [];
  }

  Future<PemantauanIbuHamilModel> save(
    PemantauanIbuHamilModel data,
  ) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}${ApiConstants.savePemantauanIbuHamil}',
    );

    final response = await _client.post(
      uri,
      headers: _headers,
      body: jsonEncode(data.toJson()),
    );

    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(body['message'] ?? 'Gagal menyimpan pemantauan ibu hamil');
    }

    return PemantauanIbuHamilModel.fromJson(
      Map<String, dynamic>.from(body['data']),
    );
  }

  void dispose() {
    _client.close();
  }
}