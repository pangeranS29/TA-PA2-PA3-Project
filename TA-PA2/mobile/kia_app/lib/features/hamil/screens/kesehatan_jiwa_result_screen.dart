import 'package:flutter/material.dart';
// Menggunakan tema agar warna konsisten dan import terpakai
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'kesehatan_jiwa_edukasi_screen.dart';
import 'kesehatan_jiwa_rujukan_screen.dart';

class KesehatanJiwaResultScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(context), // Header Biru dengan info tanggal
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _buildMainResultCard(), // Kartu Skor Utama 57/100
                  const SizedBox(height: 24),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text("HASIL PER DIMENSI", 
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  ),
                  const SizedBox(height: 12),
                  
                  // Detail Dimensi dengan Slider Indikator
                  _buildDimensionCard(
                    title: "Stres", 
                    subtitle: "Skor 13 / 20 · 5 pertanyaan", 
                    status: "Sedang", 
                    color: MentalHealthTheme.stressOrange, 
                    value: 13, 
                    max: 20,
                    bulletPoints: ["Sering merasa tidak mampu mengendalikan situasi", "Kewalahan lebih dari separuh waktu"],
                  ),
                  _buildDimensionCard(
                    title: "Kecemasan", 
                    subtitle: "Skor 7 / 21 · 7 pertanyaan", 
                    status: "Ringan", 
                    color: MentalHealthTheme.anxietyIndigo, 
                    value: 7, 
                    max: 21,
                    bulletPoints: ["Khawatir tentang proses persalinan sesekali"],
                  ),
                  _buildDimensionCard(
                    title: "Depresi", 
                    subtitle: "Skor 3 / 27 · 9 pertanyaan", 
                    status: "Baik", 
                    color: MentalHealthTheme.goodGreen, 
                    value: 3, 
                    max: 27,
                    bulletPoints: ["Tidak ada tanda depresi yang signifikan"],
                  ),
                  
                  const SizedBox(height: 32),
                  _buildActionButtons(context), // Tombol Aksi
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- HEADER DENGAN GRADIENT & INFO ---
  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 16, right: 16, bottom: 30),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF2E5BFF), Color(0xFF4C71FF)],
          begin: Alignment.topLeft, end: Alignment.bottomRight),
        borderRadius: BorderRadius.only(bottomLeft: Radius.circular(32), bottomRight: Radius.circular(32)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20), 
                onPressed: () => Navigator.pop(context)
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text("10 April 2026 · 15 pertanyaan", style: TextStyle(color: Colors.white70, fontSize: 11)),
                    Text("Hasil Self-Check", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const CircleAvatar(backgroundColor: Colors.white24, child: Icon(Icons.share, color: Colors.white, size: 18)),
            ],
          ),
          const SizedBox(height: 16),
          // Chip Indikator Tersimpan
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(20)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.check_circle, color: Colors.white, size: 14),
                SizedBox(width: 6),
                Text("Tersimpan di riwayat kesehatan", style: TextStyle(color: Colors.white, fontSize: 10)),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildMainResultCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white, 
        // Menggunakan const di depan BorderRadius agar efisien
        borderRadius: const BorderRadius.all(Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04), 
            blurRadius: 10, 
            offset: const Offset(0, 4)
          )
        ],
      ),
      child: Row(
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 85, height: 85, 
                child: CircularProgressIndicator(
                  value: 0.57, 
                  strokeWidth: 8, 
                  color: MentalHealthTheme.stressOrange, 
                  backgroundColor: Colors.grey.shade100,
                  // SOLUSI: Gunakan strokeCap untuk membuat ujung melengkung
                  strokeCap: StrokeCap.round, 
                )
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Text("57", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  Text("/ 100", style: TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              ),
            ],
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text("Perlu Perhatian", 
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                SizedBox(height: 4),
                Text(
                  "Stres sedang terdeteksi. Coba teknik coping dan diskusikan dengan bidan Anda.", 
                  style: TextStyle(color: Colors.black54, fontSize: 12, height: 1.4)
                ),
                SizedBox(height: 8),
                Text("Diperiksa: 10 Apr 2026", 
                  style: TextStyle(color: Colors.grey, fontSize: 10)),
              ],
            ),
          )
        ],
      ),
    );
  }

  // --- KARTU DIMENSI DENGAN SLIDER ---
  Widget _buildDimensionCard({
    required String title, required String subtitle, required String status, 
    required Color color, required double value, required double max,
    required List<String> bulletPoints
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        children: [
          // Header Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.05),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.psychology, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    children: [
                      Icon(Icons.warning_amber_rounded, color: color, size: 12),
                      const SizedBox(width: 4),
                      Text(status, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 10)),
                    ],
                  ),
                )
              ],
            ),
          ),
          // Content Card (Slider & Bullets)
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("Rendah", style: TextStyle(fontSize: 10, color: Colors.grey)),
                    Text("Sedang", style: TextStyle(fontSize: 10, color: Colors.grey)),
                    Text("Tinggi", style: TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 8),
                // Custom Slider Look
                Stack(
                  alignment: Alignment.centerLeft,
                  children: [
                    Container(height: 6, width: double.infinity, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(10))),
                    FractionallySizedBox(
                      widthFactor: value / max,
                      child: Container(height: 6, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(10))),
                    ),
                    // Pointer Indikator
                    Padding(
                      padding: EdgeInsets.only(left: (value / max * 250)), // Penyesuaian kasar posisi
                      child: Container(
                        width: 14, height: 14,
                        decoration: BoxDecoration(color: color, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text("${value.toInt()} ▲", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: color)),
                const Divider(height: 24),
                // Bullet points temuan
                ...bulletPoints.map((text) => Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("• ", style: TextStyle(color: color, fontWeight: FontWeight.bold)),
                      Expanded(child: Text(text, style: const TextStyle(fontSize: 11, color: Colors.black87))),
                    ],
                  ),
                )).toList(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- TOMBOL AKSI BAWAH ---
  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              flex: 2,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2E5BFF), 
                  minimumSize: const Size(double.infinity, 54), 
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                icon: const Icon(Icons.shield_outlined, color: Colors.white),
                label: const Text("Tips Coping", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (c) => KesehatanJiwaEdukasiScreen())),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey.shade100, 
                  minimumSize: const Size(double.infinity, 54), 
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                onPressed: () => Navigator.pop(context), 
                child: const Text("Ulangi", style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        TextButton.icon(
          icon: const Icon(Icons.subdirectory_arrow_right, size: 18, color: MentalHealthTheme.primaryPurple),
          label: const Text("Lihat Rekomendasi Rujukan", 
            style: TextStyle(fontWeight: FontWeight.bold, color: MentalHealthTheme.primaryPurple)),
          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (c) => KesehatanJiwaRujukanScreen())),
        ),
      ],
    );
  }
}