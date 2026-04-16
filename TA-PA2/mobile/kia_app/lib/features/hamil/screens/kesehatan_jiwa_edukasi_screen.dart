import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';

class KesehatanJiwaEdukasiScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Edukasi & Coping", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(icon: const Icon(Icons.arrow_back_ios, color: Colors.black), onPressed: () => Navigator.pop(context)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("TEKNIK CEPAT · 5 MENIT", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildQuickTip("Nafas 4-7-8", Icons.air, MentalHealthTheme.stressOrange), //
                const SizedBox(width: 12),
                _buildQuickTip("Grounding", Icons.info_outline, Colors.blue), //
              ],
            ),
            const SizedBox(height: 32),
            _buildMainArticle("Relaksasi Otot Progresif", "Latihan merilekskan otot secara bertahap untuk menurunkan hormon stres cortisol.", MentalHealthTheme.stressOrange), //
            const SizedBox(height: 16),
            _buildMainArticle("Journaling: Luapkan Khawatir", "Menulis kekhawatiran terbukti mengurangi beban pikiran ibu.", MentalHealthTheme.anxietyIndigo), //
          ],
        ),
      ),
    );
  }

  Widget _buildQuickTip(String title, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: color.withOpacity(0.05), borderRadius: BorderRadius.circular(16), border: Border.all(color: color.withOpacity(0.1))),
        child: Column(
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildMainArticle(String title, String desc, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: color.withOpacity(0.05), borderRadius: BorderRadius.circular(24)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(backgroundColor: color, radius: 20, child: const Icon(Icons.book, color: Colors.white, size: 20)),
          const SizedBox(height: 16),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Text(desc, style: const TextStyle(color: Colors.black54, fontSize: 12)),
          const SizedBox(height: 12),
          Text("Baca selengkapnya →", style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
        ],
      ),
    );
  }
}