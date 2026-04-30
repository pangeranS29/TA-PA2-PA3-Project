import 'package:flutter/material.dart';

class RujukanDetailScreen extends StatelessWidget {
  final Map<String, dynamic> data;

  const RujukanDetailScreen({
    super.key,
    required this.data,
  });

  String val(dynamic v) {
    if (v == null || v.toString().isEmpty) return "-";
    return v.toString();
  }

  String dateVal(dynamic v) {
    if (v == null || v.toString().isEmpty) return "-";
    return v.toString().split("T").first;
  }

  Widget infoCard({
    required IconData icon,
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10),
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
              Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 18),
          ...children,
        ],
      ),
    );
  }

  Widget item(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
          const SizedBox(height: 5),
          Text(value, style: const TextStyle(fontSize: 13, height: 1.5, color: Colors.black87)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8FF),
      appBar: AppBar(
        title: const Text("Detail Surat Rujukan"),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Column(
          children: [
            infoCard(
              icon: Icons.local_hospital_outlined,
              title: "Informasi Rujukan",
              children: [
                item("Resume pemeriksaan / tatalaksana", val(data["rujukan_resume_pemeriksaan_tatalaksana"])),
                item("Diagnosis akhir", val(data["rujukan_diagnosis_akhir"])),
                item("Alasan dirujuk ke FKRTL", val(data["rujukan_alasan_dirujuk_ke_fkrtl"])),
              ],
            ),
            infoCard(
              icon: Icons.assignment_return_outlined,
              title: "Rujukan Balik",
              children: [
                item("Tanggal rujukan balik", dateVal(data["rujukan_balik_tanggal"])),
                item("Diagnosis akhir rujukan balik", val(data["rujukan_balik_diagnosis_akhir"])),
                item("Resume pemeriksaan / tatalaksana balik", val(data["rujukan_balik_resume_pemeriksaan_tatalaksana"])),
              ],
            ),
            infoCard(
              icon: Icons.child_friendly_outlined,
              title: "Anjuran Persalinan",
              children: [
                item("Rekomendasi tempat melahirkan", val(data["anjuran_rekomendasi_tempat_melahirkan"])),
              ],
            ),
          ],
        ),
      ),
    );
  }
}