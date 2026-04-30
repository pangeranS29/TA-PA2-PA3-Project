import 'package:flutter/material.dart';

class CatatanPelayananT1DetailScreen extends StatelessWidget {
  final Map<String, dynamic> data;

  const CatatanPelayananT1DetailScreen({super.key, required this.data});

  String val(dynamic v) {
    if (v == null || v.toString().isEmpty) return '-';
    return v.toString();
  }

  String dateVal(dynamic v) {
    if (v == null || v.toString().isEmpty) return '-';
    return v.toString().split('T').first;
  }

  Widget infoCard({
    required IconData icon,
    required String title,
    required Widget child,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: const Color(0xFF2563EB)),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          child,
        ],
      ),
    );
  }

  Widget rowItem(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 13,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 13,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8FF),
      appBar: AppBar(
        title: const Text("Detail Catatan Bidan"),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Column(
          children: [
            infoCard(
              icon: Icons.calendar_today_outlined,
              title: "Informasi Kunjungan",
              child: Column(
                children: [
                  rowItem("Tanggal pemeriksaan", dateVal(data['tanggal_periksa_stamp_paraf'])),
                  const SizedBox(height: 14),
                  rowItem("Kontrol kembali", dateVal(data['tanggal_kembali'])),
                ],
              ),
            ),
            infoCard(
              icon: Icons.edit_note_outlined,
              title: "Catatan Pemeriksaan Bidan",
              child: Text(
                val(data['keluhan_pemeriksaan_tindakan_saran']),
                style: const TextStyle(
                  fontSize: 13,
                  height: 1.7,
                  color: Colors.black87,
                ),
              ),
            ),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.blue.shade100),
              ),
              child: const Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.info_outline, color: Color(0xFF2563EB)),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      "Catatan ini merupakan hasil observasi, pemeriksaan, tindakan, dan saran yang dicatat oleh bidan pada kunjungan trimester pertama.",
                      style: TextStyle(
                        fontSize: 12,
                        height: 1.5,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}