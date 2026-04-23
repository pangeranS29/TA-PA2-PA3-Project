import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';

class AuthApiService {
  final http.Client _client;

  AuthApiService({http.Client? client}) : _client = client ?? http.Client();

  Future<void> login({
    required String identifier,
    required String password,
  }) async {
    final uri = Uri.parse('${ApiConstants.baseUrl}${ApiConstants.authLogin}');

    final response = await _client.post(
      uri,
      headers: const {'Content-Type': 'application/json'},
      body: jsonEncode({'nomor_telepon': identifier, 'kata_sandi': password}),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(
        'Login gagal (${response.statusCode}). Periksa kredensial Anda.',
      );
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;
    // final data = (body['data'] ?? {}) as Map<String, dynamic>;
    final data = (body['data'] ?? body) as Map<String, dynamic>;

    // final token = (data['access_token'] ?? '').toString();
    final token = (data['token'] ?? '').toString();
    final role = (data['role'] ?? '').toString();
    final wajibGanti = data["wajib_ganti_kata_sandi"] ?? false;
    
    if (token.isEmpty) {
      throw Exception('Token tidak ditemukan di response login.');
    }

    // await AuthSession.save(
    //   accessToken: token,
    //   name: data['name']?.toString(),
    //   userRole: data['role']?.toString(),
    // );

    await AuthSession.save(
      accessToken: token,
      name: "User KIA", 
      userRole: role,
    );
  }

  Future<void> logout() async {
    await AuthSession.clear();
  }

  void dispose() {
    _client.close();
  }
}
