import 'dart:convert';

import 'package:flutter/material.dart'; // Ditambahkan untuk debugPrint jika diperlukan
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/anak/imunisasi/data/models/ringkasan_imunisasi_model.dart';

class RingkasanImunisasiService {
  final http.Client _client;

  RingkasanImunisasiService({
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

  Future<List<RingkasanImunisasiModel>> getRingkasanImunisasi() async {
    final uri = Uri.parse('${ApiConstants.baseUrl}/ibu/jadwal-imunisasi');
    try {
      final response = await _client.get(uri, headers: _headers);

      if (response.statusCode == 404) return [];

      final body = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode < 200 || response.statusCode >= 300) {
        final msg = body['message'];
        final errorText = (msg is List) ? msg.join(', ') : (msg ?? 'Gagal');
        throw Exception(errorText);
      }

      final data = body['data'];
      if (data is List) {
        return data.map((item) {
          final Map<String, dynamic> itemMap =
              Map<String, dynamic>.from(item as Map);
          return RingkasanImunisasiModel.fromJson(itemMap);
        }).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  Future<List<RingkasanImunisasiModel>> getRingkasanImunisasiByAnakId(
    int anakId,
  ) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}/ibu/jadwal-imunisasi/anak/$anakId',
    );

    final response = await _client.get(uri, headers: _headers);

    final body = jsonDecode(response.body);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      final msg = body['message'];
      throw Exception(msg.toString());
    }

    final data = body['data'];

    if (data == null || data is! List) {
      return [];
    }

    return data.map<RingkasanImunisasiModel>((item) {
      return RingkasanImunisasiModel.fromJson(
        Map<String, dynamic>.from(item),
      );
    }).toList();
  }

  void dispose() {
    _client.close();
  }
}
