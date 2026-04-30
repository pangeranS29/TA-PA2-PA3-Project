import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/kehamilan_api_service.dart';
import 'rujukan_detail_screen.dart';

class RujukanListScreen extends StatefulWidget {
  const RujukanListScreen({super.key});

  @override
  State<RujukanListScreen> createState() => _RujukanListScreenState();
}

class _RujukanListScreenState extends State<RujukanListScreen> {
  final _kehamilanService = KehamilanApiService();

  bool isLoading = true;
  List<dynamic> rujukanList = [];

  @override
  void initState() {
    super.initState();
    _loadRujukan();
  }

  Future<void> _loadRujukan() async {
    try {
      final token = AuthSession.token;
      if (token == null || token.isEmpty) throw Exception("Token tidak ditemukan");

      final kehamilan = await _kehamilanService.getKehamilanAktif();

      final response = await http.get(
        Uri.parse("http://localhost:8080/modul-ibu/rujukan?kehamilan_id=${kehamilan.id}"),
        headers: {"Authorization": "Bearer $token"},
      );

      final body = jsonDecode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        setState(() {
          rujukanList = body["data"] ?? [];
          isLoading = false;
        });
      } else {
        throw Exception(body["message"]?.toString() ?? "Gagal mengambil data rujukan");
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  String _dateText(dynamic value) {
    if (value == null || value.toString().isEmpty) return "-";
    return value.toString().split("T").first;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8FF),
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : rujukanList.isEmpty
                    ? const Center(child: Text("Belum ada surat rekomendasi rujukan"))
                    : ListView.builder(
                        padding: const EdgeInsets.all(20),
                        itemCount: rujukanList.length,
                        itemBuilder: (context, index) {
                          final item = rujukanList[index];

                          return InkWell(
                            borderRadius: BorderRadius.circular(22),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => RujukanDetailScreen(data: item),
                                ),
                              );
                            },
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              padding: const EdgeInsets.all(18),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(22),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.04),
                                    blurRadius: 10,
                                    offset: const Offset(0, 5),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 52,
                                    height: 52,
                                    decoration: BoxDecoration(
                                      color: Colors.blue.shade50,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: const Icon(Icons.description_outlined, color: Color(0xFF2563EB)),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Surat Rujukan ${index + 1}',
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          item["rujukan_diagnosis_akhir"]?.toString().isNotEmpty == true
                                              ? item["rujukan_diagnosis_akhir"]
                                              : "Rujukan Kehamilan",
                                          style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          'Tanggal balik: ${_dateText(item["rujukan_balik_tanggal"])}',
                                          style: const TextStyle(fontSize: 11, color: Color(0xFF2563EB)),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Icon(Icons.chevron_right, color: Colors.grey),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 55, left: 20, right: 20, bottom: 28),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF3B82F6)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
      ),
      child: Row(
        children: [
          InkWell(
            onTap: () => Navigator.pop(context),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(color: Colors.white24, shape: BoxShape.circle),
              child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Surat Rekomendasi Rujukan",
                  style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Text(
                  "Riwayat surat rujukan dari tenaga kesehatan",
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}