import 'package:flutter/material.dart';
import 'pola_asuh_screen.dart';   // Pastikan file ini ada
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/perawatan/pilih_perawatan_screen.dart';
import 'pedoman/pedoman_ibu_bayi_screen.dart'; 

class EdukasiScreen extends StatelessWidget {
  const EdukasiScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Edukasi Anak',
          style: TextStyle(
            color: Color(0xFF1E293B),
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios,
              color: Color(0xFF1E293B), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Image Section
            Stack(
              children: [
                Container(
                  height: 200,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage('assets/images/hero_edukasi.png'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.35),
                      ],
                    ),
                  ),
                ),
                const Positioned(
                  bottom: 24,
                  left: 20,
                  right: 20,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Belajar Bersama Si Kecil',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'Panduan lengkap tumbuh kembang anak',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Menu Cards
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  // ================== PEDOMAN IBU & BAYI (BARU) ==================
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PedomanIbuBayiScreen(), // SESUAIKAN NAMA CLASS
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: _menuCard(
                      icon: Icons.menu_book_outlined,
                      title: 'Pedoman Ibu & Bayi',
                      subtitle: 'Panduan kesehatan ibu & bayi',
                      color: const Color(0xFFF0F9FF),
                      iconBgColor: const Color(0xFFE0F2FE),
                      iconColor: const Color(0xFF2563EB),
                    ),
                  ),

                  const SizedBox(height: 12),
                  // ================== POLA ASUH (BISA DIKLIK) ==================
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PolaAsuhScreen(),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: _menuCard(
                      icon: Icons.device_hub,
                      title: 'Pola Asuh',
                      subtitle: 'Metode pengasuhan positif',
                      color: const Color(0xFFF0F9FF),
                      iconBgColor: const Color(0xFFE0F2FE),
                      iconColor: const Color(0xFF0EA5E9),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Perawatan (BISA DIKLIK)
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PilihPerawatanScreen(),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: _menuCard(
                      icon: Icons.medical_services_outlined,
                      title: 'Perawatan',
                      subtitle: 'Kesehatan & nutrisi harian',
                      color: const Color(0xFFF0F9FF),
                      iconBgColor: const Color(0xFFE0F2FE),
                      iconColor: const Color(0xFF3B82F6),
                    ),
                  ),

                  // Informasi Umum (TIDAK BISA DIKLIK)
                  _menuCard(
                    icon: Icons.info_outline,
                    title: 'Informasi Umum',
                    subtitle: 'Artikel & tips terpercaya',
                    color: const Color(0xFFF0F9FF),
                    iconBgColor: const Color(0xFFE0F2FE),
                    iconColor: const Color(0xFF06B6D4),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Tips Hari Ini
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFDBEAFE),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Row(
                      children: [
                        Icon(Icons.lightbulb_outline,
                            color: Color(0xFF2563EB), size: 24),
                        SizedBox(width: 8),
                        Text(
                          'Tips Hari Ini',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E40AF),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    Text(
                      'Pastikan si Kecil mendapatkan waktu istirahat yang cukup untuk mendukung pertumbuhan otaknya secara optimal.',
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.5,
                        color: Color(0xFF1E3A8A),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // Menu Card Widget (hanya tampilan)
  Widget _menuCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required Color iconBgColor,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 26),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.chevron_right,
            color: Color(0xFF94A3B8),
            size: 28,
          ),
        ],
      ),
    );
  }
}