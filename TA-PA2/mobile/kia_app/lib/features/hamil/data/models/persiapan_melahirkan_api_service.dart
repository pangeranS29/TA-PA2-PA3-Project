import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'persiapan_melahirkan_model.dart';

class PersiapanMelahirkanApiService {
  final String baseUrl = "http://localhost:8080/modul-ibu/persiapan-melahirkan";

  Future<PersiapanMelahirkanModel?> getMine() async {
    final token = AuthSession.token;

    final response = await http.get(
      Uri.parse("$baseUrl/me"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      final body = jsonDecode(response.body);
      if (body["data"] == null) return null;
      return PersiapanMelahirkanModel.fromJson(body["data"]);
    }

    return null;
  }

  Future<void> save(PersiapanMelahirkanModel model) async {
    final token = AuthSession.token;

    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode(model.toJson()),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception("Gagal menyimpan persiapan melahirkan");
    }
  }
}