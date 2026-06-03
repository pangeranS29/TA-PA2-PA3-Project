import 'dart:convert';

import 'package:flutter/material.dart'; // Ditambahkan untuk debugPrint jika diperlukan
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

  Future<List<ImunisasiModel>> getJadwalImunisasi() async {
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
          return ImunisasiModel.fromJson(itemMap);
        }).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  Future<List<ImunisasiModel>> getJadwalImunisasiByAnakId(
    int anakId,
  ) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}/ibu/jadwal-imunisasi/anak/$anakId',
    );

    try {
      final response = await _client.get(
        uri,
        headers: _headers,
      );

      if (response.statusCode == 404) {
        return [];
      }

      final body = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode < 200 || response.statusCode >= 300) {
        final msg = body['message'];
        final errorText = (msg is List)
            ? msg.join(', ')
            : (msg ?? 'Gagal mengambil jadwal imunisasi anak');
        throw Exception(errorText);
      }

      final data = body['data'];

      if (data is List) {
        return data.map((item) {
          final Map<String, dynamic> itemMap =
              Map<String, dynamic>.from(item as Map);
          return ImunisasiModel.fromJson(itemMap);
        }).toList();
      }

      return [];
    } catch (e) {
      debugPrint("Error di ImunisasiService (getJadwalImunisasiByAnakId): $e");
      rethrow;
    }
  }

  Future<ImunisasiDetailModel> getJadwalImunisasiById(int id) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}/ibu/jadwal-imunisasi/$id',
    );

    try {
      final response = await _client.get(
        uri,
        headers: _headers,
      );

      if (response.statusCode == 404) {
        throw Exception('Data jadwal tidak ditemukan');
      }

      final body = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode < 200 || response.statusCode >= 300) {
        final msg = body['message'];
        final errorText = (msg is List)
            ? msg.join(', ')
            : (msg ?? 'Gagal mengambil detail jadwal');
        throw Exception(errorText);
      }

      // ✅ FIX UTAMA DI SINI
      return ImunisasiDetailModel.fromJson(body);
    } catch (e) {
      debugPrint("Error getJadwalImunisasiById: $e");
      rethrow;
    }
  }

<<<<<<< HEAD
  Future<void> updateTanggalEstimasi(
    int id,
    String tanggal,
  ) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}/ibu/jadwal-imunisasi/$id/tanggal-estimasi',
=======
  Future<void> requestPerubahanJadwal(
    int jadwalId,
    String tanggalBaru,
    String alasan,
  ) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}/ibu/jadwal-imunisasi/$jadwalId/request-perubahan',
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    );

    try {
      final body = jsonEncode({
<<<<<<< HEAD
        "tanggal_estimasi": tanggal, // format: YYYY-MM-DD
      });

      final response = await _client.put(
=======
        "tanggal_baru": tanggalBaru,
        "alasan": alasan,
      });

      final response = await _client.post(
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
        uri,
        headers: _headers,
        body: body,
      );

      final decoded = jsonDecode(response.body);

      if (response.statusCode < 200 || response.statusCode >= 300) {
        final msg = decoded['message'];
        final errorText =
<<<<<<< HEAD
            (msg is List) ? msg.join(', ') : (msg ?? 'Gagal update jadwal');
=======
            (msg is List) ? msg.join(', ') : (msg ?? 'Gagal mengirim request');
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c

        throw Exception(errorText);
      }
    } catch (e) {
<<<<<<< HEAD
      debugPrint("Error updateTanggalEstimasi: $e");
=======
      debugPrint("Error requestPerubahanJadwal: $e");
      rethrow;
    }
  }

  Future<void> setJadwalSelesai(int jadwalId) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}/ibu/jadwal-imunisasi/$jadwalId/selesai',
    );

    try {
      final response = await _client.put(
        uri,
        headers: _headers,
      );

      final body = jsonDecode(response.body);

      if (response.statusCode < 200 || response.statusCode >= 300) {
        final msg = body['message'];
        final errorText = (msg is List)
            ? msg.join(', ')
            : (msg ?? 'Gagal menyelesaikan jadwal');

        throw Exception(errorText);
      }
    } catch (e) {
      debugPrint("Error setJadwalSelesai: $e");
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
      rethrow;
    }
  }

  void dispose() {
    _client.close();
  }
}
