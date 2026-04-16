import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'kesehatan_jiwa_questionnaire_screen.dart';
import 'kesehatan_jiwa_result_screen.dart';

class KesehatanJiwaHubScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFF), // Background lebih lembut
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildSimpleHeader(context),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  _buildMoodGlassCard(), // Card mood dengan soft shadow
                  const SizedBox(height: 28),
                  _buildLastExamBanner(context),
                  const SizedBox(height: 32),
                  const Text(
                    "ANALISIS EMOSI TERKINI", 
                    style: TextStyle(
                      fontSize: 12, 
                      fontWeight: FontWeight.w800, 
                      color: Colors.grey,
                      letterSpacing: 1.2
                    )
                  ),
                  const SizedBox(height: 16),
                  
                  // Kategori Emosi dengan Style Baru
                  _buildEnhancedCategoryCard(
                    title: "Stres",
                    status: "Sedang 13/20",
                    color: MentalHealthTheme.stressOrange,
                    progress: 0.65,
                    labelStatus: "Pantau",
                    icon: Icons.wb_sunny_outlined,
                  ),
                  _buildEnhancedCategoryCard(
                    title: "Kecemasan",
                    status: "Ringan 7/21",
                    color: MentalHealthTheme.anxietyIndigo,
                    progress: 0.33,
                    labelStatus: "Terkendali",
                    icon: Icons.air_outlined,
                  ),
                  _buildEnhancedCategoryCard(
                    title: "Depresi",
                    status: "Baik 3/27",
                    color: MentalHealthTheme.goodGreen,
                    progress: 0.11,
                    labelStatus: "Aman",
                    icon: Icons.sentiment_satisfied_alt_outlined,
                  ),
                  
                  const SizedBox(height: 40),
                  _buildPremiumStartButton(context),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 1. Header dengan Kurva & Gradien Halus
  // 1. Header yang Lebih Simpel & Clean
  Widget _buildSimpleHeader(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 60, left: 16, right: 16, bottom: 24),
      decoration: const BoxDecoration(
        color: Color(0xFF2E5BFF), // Solid Blue sesuai identitas SEHATI
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text("Ibu Riyanthi · 24 Minggu", 
                      style: TextStyle(color: Colors.white70, fontSize: 12)),
                    Text("Kesehatan Jiwa", 
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const CircleAvatar(
                radius: 18,
                backgroundColor: Colors.white24,
                child: Icon(Icons.notifications_none, color: Colors.white, size: 20),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 2. Card Pemilihan Mood (Glassmorphism Style)
  Widget _buildMoodGlassCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          const Text("Bagaimana perasaanmu hari ini?", 
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.black87)),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _moodIconItem("Sangat Baik", "😊"),
              _moodIconItem("Baik", "🙂"),
              _moodIconItem("Biasa", "😐"),
              _moodIconItem("Kurang", "🙁"),
              _moodIconItem("Buruk", "😢"),
            ],
          )
        ],
      ),
    );
  }

  Widget _moodIconItem(String label, String emoji) {
    return Column(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: const Color(0xFFF3F6FF),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Center(child: Text(emoji, style: const TextStyle(fontSize: 22))),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.w600)),
      ],
    );
  }

  // 3. Banner Riwayat Minimalis
  Widget _buildLastExamBanner(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (c) => KesehatanJiwaResultScreen())),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFF2E5BFF).withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF2E5BFF).withOpacity(0.1)),
        ),
        child: Row(
          children: [
            const Icon(Icons.history, size: 18, color: Color(0xFF2E5BFF)),
            const SizedBox(width: 12),
            const Text("Pemeriksaan Terakhir", style: TextStyle(fontSize: 11, color: Colors.black54, fontWeight: FontWeight.bold)),
            const Spacer(),
            const Text("3 April", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
            const Icon(Icons.chevron_right, size: 18, color: Color(0xFF2E5BFF)),
          ],
        ),
      ),
    );
  }

  // 4. Card Emosi yang Diperkaya (Depth Style)
  Widget _buildEnhancedCategoryCard({
    required String title, required String status, required Color color, 
    required double progress, required String labelStatus, required IconData icon
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                      child: Text(labelStatus, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 9)),
                    )
                  ],
                ),
                const SizedBox(height: 10),
                LinearProgressIndicator(
                  value: progress, 
                  color: color, 
                  backgroundColor: color.withOpacity(0.05),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(10),
                ),
                const SizedBox(height: 8),
                Text("Kondisi: $status", style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 5. Tombol Utama dengan Gradien & Shadow
  Widget _buildPremiumStartButton(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Color(0xFF2E5BFF), Color(0xFF0039F4)],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2E5BFF).withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        ),
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (c) => KesehatanJiwaQuestionnaireScreen()));
        },
        child: const Text(
          "Mulai Self-Check Sekarang", 
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)
        ),
      ),
    );
  }
}