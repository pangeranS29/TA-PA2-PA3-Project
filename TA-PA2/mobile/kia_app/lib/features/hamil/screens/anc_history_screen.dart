import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/data/repositories/anc_repository.dart';
import 'package:ta_pa2_pa3_project/data/models/anc_model.dart';

class AncHistoryScreen extends StatelessWidget {
  final int idKehamilan;

  const AncHistoryScreen({super.key, required this.idKehamilan});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Riwayat Pemeriksaan", 
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF2E5BFF), // Biru SEHATI
        elevation: 0,
      ),
      body: FutureBuilder<List<AncPemeriksaanModel>>(
        // Memanggil fungsi yang sudah kita buat di repository
        future: AncRepository().getHistoryPemeriksaan(idKehamilan),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (snapshot.hasError) {
            return Center(child: Text("Terjadi kesalahan: ${snapshot.error}"));
          }

          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return _buildEmptyState();
          }

          final historyList = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: historyList.length,
            itemBuilder: (context, index) {
              final data = historyList[index];
              return _buildHistoryCard(data);
            },
          );
        },
      ),
    );
  }

  // Widget untuk tampilan list riwayat
  Widget _buildHistoryCard(AncPemeriksaanModel data) {
    return Card(
      elevation: 3,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFF2E5BFF).withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.description, color: Color(0xFF2E5BFF)),
        ),
        title: Text("Trimester ${data.trimester}", 
            style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text("Tanggal: ${data.tanggalPeriksa.toString().split(' ')[0]}"),
            Text("Kunjungan ke-${data.kunjunganKe}"),
          ],
        ),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        onTap: () {
          // Navigasi ke Detail Riwayat (Next Step)
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.history_toggle_off, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text("Belum ada riwayat pemeriksaan", 
            style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}