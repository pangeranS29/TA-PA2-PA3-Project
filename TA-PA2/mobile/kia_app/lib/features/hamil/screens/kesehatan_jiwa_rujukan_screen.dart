import 'package:flutter/material.dart';

class KesehatanJiwaRujukanScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Rekomendasi Rujukan", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios, color: Colors.black), onPressed: () => Navigator.pop(context)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _buildUrgentWarning(), // Box Peringatan Merah
            const SizedBox(height: 24),
            _buildServiceItem("Bidan / Dokter Kandungan", "Ceritakan kondisi jiwa saat kunjungan ANC rutin", Icons.person, "Tersedia"), //
            _buildServiceItem("Psikolog Klinis RS", "Sesi 45 mnt · Tatap muka / online", Icons.local_hospital, "Rujukan"), //
            _buildServiceItem("Hotline Into The Light", "119 ext 8 · 24 jam · Gratis", Icons.phone_in_talk, "Gratis"), //
            const SizedBox(height: 40),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2E5BFF), minimumSize: const Size(double.infinity, 56), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              onPressed: () {}, 
              child: const Text("Buat Jadwal Konsultasi", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildUrgentWarning() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: const Color(0xFFFFF1F2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.red.shade100)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Colors.red),
              SizedBox(width: 8),
              Text("Segera Hubungi Dokter Jika...", style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),
          const Text("• Ingin menyakiti diri sendiri atau bayi\n• Tidak bisa tidur/makan > 2 minggu\n• Perasaan putus asa yang sangat kuat", style: TextStyle(fontSize: 12, height: 1.5)),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            onPressed: () {},
            icon: const Icon(Icons.call),
            label: const Text("Hubungi Darurat Sekarang"),
          )
        ],
      ),
    );
  }

  Widget _buildServiceItem(String title, String desc, IconData icon, String status) {
    return ListTile(
      leading: CircleAvatar(backgroundColor: Colors.blue.shade50, child: Icon(icon, color: Colors.blue)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
      subtitle: Text(desc, style: const TextStyle(fontSize: 11)),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(10)),
        child: Text(status, style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 10)),
      ),
    );
  }
}