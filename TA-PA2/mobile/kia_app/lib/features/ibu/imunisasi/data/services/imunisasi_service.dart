import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/ibu/imunisasi/data/models/imunisasi_model.dart';

class ImunisasiService {
  final http.Client _client;

  ImunisasiService({
    http.Client? client,
  }) : _client = client ?? http.Client();

  Map<String, String> get _headers {
    final token = AuthSession.token;

    if (token == null || token.isEmpty) {
      throw Exception(
        'Token tidak ditemukan. Silakan login ulang.',
      );
    }

    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }

  Future<List<ImunisasiModel>>
  getJadwalImunisasi() async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}/ibu/jadwal-imunisasi',
    );

    final response = await _client.get(
      uri,
      headers: _headers,
    );

    final body =
        jsonDecode(response.body)
            as Map<String, dynamic>;

    if (response.statusCode == 404) {
      return [];
    }

    if (response.statusCode < 200 ||
        response.statusCode >= 300) {
      throw Exception(
        body['message'] ??
            'Gagal mengambil jadwal imunisasi',
      );
    }

    final data = body['data'];

    if (data is List) {
      return data
          .map(
            (item) =>
                ImunisasiModel.fromJson(
              Map<String, dynamic>.from(
                item,
              ),
            ),
          )
          .toList();
    }

    return [];
  }

  void dispose() {
    _client.close();
  }
}