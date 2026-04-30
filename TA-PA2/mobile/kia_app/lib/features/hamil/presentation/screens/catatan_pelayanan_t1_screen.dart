import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/kehamilan_api_service.dart';
import 'catatan_pelayanan_t1_detail_screen.dart';

class CatatanPelayananT1Screen extends StatefulWidget {
  const CatatanPelayananT1Screen({super.key});

  @override
  State<CatatanPelayananT1Screen> createState() => _CatatanPelayananT1ScreenState();
}

class _CatatanPelayananT1ScreenState extends State<CatatanPelayananT1Screen> {
  final _kehamilanService = KehamilanApiService();

  bool isLoading = true;
  List<dynamic> catatan = [];

  @override
  void initState() {
    super.initState();
    _loadCatatan();
  }

  Future<void> _loadCatatan() async {
    try {
      final token = AuthSession.token;
      if (token == null || token.isEmpty) throw Exception("Token tidak ditemukan");

      final kehamilan = await _kehamilanService.getKehamilanAktif();

      final response = await http.get(
        Uri.parse("http://localhost:8080/modul-ibu/catatan-pelayanan-t1?kehamilan_id=${kehamilan.id}"),
        headers: {"Authorization": "Bearer $token"},
      );

      final body = jsonDecode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        setState(() {
          catatan = body['data'] ?? [];
          isLoading = false;
        });
      } else {
        throw Exception(body['message'] ?? 'Gagal mengambil data');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  String _dateText(dynamic value) {
    if (value == null || value.toString().isEmpty) return '-';
    return value.toString().split('T').first;
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
                : catatan.isEmpty
                    ? const Center(child: Text("Belum ada catatan pelayanan trimester 1"))
                    : ListView.builder(
                        padding: const EdgeInsets.all(20),
                        itemCount: catatan.length,
                        itemBuilder: (context, index) {
                          final item = catatan[index];
                          return InkWell(
                            borderRadius: BorderRadius.circular(22),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => CatatanPelayananT1DetailScreen(data: item),
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
                                    child: const Icon(Icons.medical_information_outlined, color: Color(0xFF2563EB)),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Catatan Bidan ANC ${index + 1}',
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          'Tanggal periksa: ${_dateText(item['tanggal_periksa_stamp_paraf'])}',
                                          style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                                        ),
                                        const SizedBox(height: 4),
                                        const Text(
                                          'Ketuk untuk melihat detail pemeriksaan',
                                          style: TextStyle(fontSize: 11, color: Color(0xFF2563EB)),
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
              decoration: BoxDecoration(color: Colors.white.withOpacity(0.18), shape: BoxShape.circle),
              child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Catatan Pelayanan Trimester 1', style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold)),
                SizedBox(height: 4),
                Text('Riwayat hasil pemeriksaan bidan', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
