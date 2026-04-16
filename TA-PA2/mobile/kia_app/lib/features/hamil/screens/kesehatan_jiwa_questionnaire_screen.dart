import 'package:flutter/material.dart';
// Import tema sekarang digunakan untuk Primary Purple dan warna dimensi
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'kesehatan_jiwa_result_screen.dart';

class KesehatanJiwaQuestionnaireScreen extends StatefulWidget {
  @override
  _KesehatanJiwaQuestionnaireScreenState createState() => _KesehatanJiwaQuestionnaireScreenState();
}

class _KesehatanJiwaQuestionnaireScreenState extends State<KesehatanJiwaQuestionnaireScreen> {
  int currentStep = 3; // Contoh: Pertanyaan ke-4
  int? selectedValue;

  // Logika warna label berdasarkan dimensi pertanyaan
  Color _getDimensionColor(String dimension) {
    switch (dimension) {
      case 'Stres': return MentalHealthTheme.stressOrange;
      case 'Cemas': return MentalHealthTheme.anxietyIndigo;
      case 'Depresi': return MentalHealthTheme.depressionPurple;
      default: return MentalHealthTheme.primaryPurple;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Data dummy untuk simulasi
    String currentDimension = "Stres";
    Color themeColor = _getDimensionColor(currentDimension);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Self-Check Kondisi Mental", 
          style: TextStyle(color: Colors.black, fontSize: 16, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white, 
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black), 
          onPressed: () => Navigator.pop(context)
        ),
      ),
      body: Column(
        children: [
          // --- PROGRESS BAR & CHIP DIMENSI ---
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("Pertanyaan 4 dari 15", 
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    Chip(
                      label: Text(currentDimension, 
                        style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold)), 
                      backgroundColor: themeColor,
                      padding: EdgeInsets.zero,
                      visualDensity: VisualDensity.compact,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Menggunakan Primary Purple dari tema
                LinearProgressIndicator(
                  value: 0.26, 
                  color: MentalHealthTheme.primaryPurple, 
                  backgroundColor: Colors.grey.shade100, 
                  minHeight: 8, 
                  borderRadius: BorderRadius.circular(10)
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // --- AREA PERTANYAAN ---
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Seberapa sering Anda merasa tidak mampu mengendalikan hal-hal penting dalam hidup?", 
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.4, color: Colors.black87)
                  ),
                  const SizedBox(height: 48),
                  
                  // --- MODEL SCALE 0-4 ---
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: List.generate(5, (index) => _buildNumberCircle(index)),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text("Tidak pernah", style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500)),
                      Text("Sangat Sering", style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500)),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // --- TOMBOL NAVIGASI BAWAH ---
          _buildNavigationButtons(),
        ],
      ),
    );
  }

  // Helper Widget untuk Lingkaran Skor
  Widget _buildNumberCircle(int n) {
    bool isSelected = selectedValue == n;
    return GestureDetector(
      onTap: () => setState(() => selectedValue = n),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 54, height: 54,
        decoration: BoxDecoration(
          color: isSelected ? MentalHealthTheme.primaryPurple : Colors.white,
          shape: BoxShape.circle,
          border: Border.all(
            color: isSelected ? MentalHealthTheme.primaryPurple : Colors.grey.shade300, 
            width: 2
          ),
          boxShadow: isSelected ? [
            BoxShadow(color: MentalHealthTheme.primaryPurple.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4))
          ] : null,
        ),
        child: Center(
          child: Text("$n", 
            style: TextStyle(
              fontSize: 20, 
              fontWeight: FontWeight.bold, 
              color: isSelected ? Colors.white : Colors.black54
            )
          )
        ),
      ),
    );
  }

  Widget _buildNavigationButtons() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))]
      ),
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: currentStep > 0 ? () {} : null, 
              child: const Text("Sebelumnya", style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: MentalHealthTheme.primaryPurple,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              onPressed: selectedValue != null 
                ? () => Navigator.push(context, MaterialPageRoute(builder: (c) => KesehatanJiwaResultScreen()))
                : null, // Tombol mati jika belum pilih skor
              child: const Text("Berikutnya", 
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}