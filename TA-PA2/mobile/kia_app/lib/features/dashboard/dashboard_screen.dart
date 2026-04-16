import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/hamil/screens/journey_screen.dart';
// Integrasi Fitur Kesehatan Jiwa
import 'package:ta_pa2_pa3_project/features/hamil/screens/kesehatan_jiwa_hub_screen.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String selectedPhase = "Hamil";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9), 
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  _buildPhaseSelector(),
                  const SizedBox(height: 32),
                  // Menampilkan konten berdasarkan fase
                  if (selectedPhase == "Hamil") _buildHamilContent(),
                  if (selectedPhase != "Hamil") _buildPlaceholderContent(),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  // --- 1. HEADER DENGAN GRADIENT ---
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: TrimesterTheme.t1Gradient, // Warna biru dari app_theme
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text("Selamat Pagi ✨", style: TextStyle(color: Colors.white70, fontSize: 16)),
              Text("Halo, Polaroid!", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              Text("Trimester 2 • Bebas keluhan berat", style: TextStyle(color: Colors.white, fontSize: 12)),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), shape: BoxShape.circle),
            child: const Icon(Icons.notifications_none, color: Colors.white),
          )
        ],
      ),
    );
  }

  // --- 2. PHASE SELECTOR (TAB NAVIGASI) ---
  Widget _buildPhaseSelector() {
    final List<Map<String, dynamic>> phases = [
      {'label': 'Hamil', 'icon': Icons.favorite_border},
      {'label': 'Nifas', 'icon': Icons.person_outline},
      {'label': 'Menyusui', 'icon': Icons.child_care},
      {'label': 'Tumbuh', 'icon': Icons.emoji_emotions_outlined},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("TAHAP SAAT INI", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: phases.map((p) {
            bool isActive = selectedPhase == p['label'];
            return GestureDetector(
              onTap: () => setState(() => selectedPhase = p['label']),
              child: Column(
                children: [
                  Container(
                    width: 65, height: 65,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: isActive ? Border.all(color: TrimesterTheme.t1Primary, width: 2) : null,
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                    ),
                    child: Icon(p['icon'], color: isActive ? TrimesterTheme.t1Primary : Colors.grey, size: 28),
                  ),
                  const SizedBox(height: 8),
                  Text(p['label'], style: TextStyle(fontSize: 12, color: isActive ? TrimesterTheme.t1Primary : Colors.grey, fontWeight: isActive ? FontWeight.bold : FontWeight.normal)),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // --- 3. KONTEN KHUSUS HAMIL ---
  Widget _buildHamilContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // A. Progress Kehamilan
        _buildInfoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Kehamilan 24 Minggu", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const Text("HPL: 15 Agt 2026", style: TextStyle(color: Colors.grey, fontSize: 12)),
              const SizedBox(height: 16),
              LinearProgressIndicator(value: 0.6, backgroundColor: Colors.blue.shade50, color: TrimesterTheme.t1Primary, minHeight: 8, borderRadius: BorderRadius.circular(10)),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // B. Insight Buah
        _buildInfoCard(
          child: Row(
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Sebesar Buah Jagung", style: TextStyle(fontWeight: FontWeight.bold)),
                    Text("Panjang janin sekitar 30 cm.", style: TextStyle(fontSize: 12, color: Colors.black54)),
                  ],
                ),
              ),
              Image.network('https://cdn-icons-png.flaticon.com/512/1141/1141771.png', width: 40),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // C. MENU UTAMA
        const Text("Menu Hamil", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
        const SizedBox(height: 16),
        _buildMenuCard(
          title: "Kehamilan Trimester 1–3",
          subtitle: "Pantau perkembangan kehamilan",
          icon: Icons.favorite_outline,
          iconColor: Colors.pink,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (c) => JourneyScreen())),
        ),
        _buildMenuCard(
          title: "Kesehatan Jiwa Ibu Hamil",
          subtitle: "Kesehatan mental selama hamil",
          icon: Icons.psychology_outlined,
          iconColor: Colors.purple,
          // Navigasi ke Hub Kesehatan Jiwa (S1)
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (c) => KesehatanJiwaHubScreen())),
        ),
        _buildMenuCard(
          title: "Persalinan",
          subtitle: "Persiapan & proses persalinan",
          icon: Icons.child_care_outlined,
          iconColor: Colors.blue,
          onTap: () {},
        ),
        const SizedBox(height: 32),

        // D. MENU CEPAT (GRID)
        const Text("MENU CEPAT", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 16),
        _buildQuickMenu(),
        const SizedBox(height: 32),

        // E. Tanda Bahaya
        _buildDangerAlert(),
        const SizedBox(height: 40),
      ],
    );
  }

  // --- HELPER WIDGETS ---
  Widget _buildMenuCard({required String title, required String subtitle, required IconData icon, required Color iconColor, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))]),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: iconColor.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
          child: Icon(icon, color: iconColor, size: 28),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        onTap: onTap,
      ),
    );
  }

  Widget _buildQuickMenu() {
    final List<Map<String, dynamic>> menus = [
      {'label': 'BB Ibu', 'icon': Icons.scale, 'color': Colors.blue},
      {'label': 'Periksa', 'icon': Icons.medical_services, 'color': Colors.pink},
      {'label': 'Nutrisi', 'icon': Icons.apple, 'color': Colors.green},
    ];
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 3,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: menus.map((m) => Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(m['icon'], color: m['color']), const SizedBox(height: 8), Text(m['label'], style: const TextStyle(fontSize: 12))]),
      )).toList(),
    );
  }

  Widget _buildInfoCard({required Widget child}) {
    return Container(width: double.infinity, padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]), child: child);
  }

  Widget _buildDangerAlert() {
    return Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: const Color(0xFFFFF1F2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.red.shade100)), child: Row(children: const [Icon(Icons.warning_amber_rounded, color: Colors.red), SizedBox(width: 12), Expanded(child: Text("Pahami Tanda Bahaya Kehamilan", style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12))), Icon(Icons.chevron_right, color: Colors.red)]));
  }

  Widget _buildPlaceholderContent() => const Center(child: Padding(padding: EdgeInsets.all(40), child: Text("Fase ini akan segera hadir ✨")));

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: TrimesterTheme.t1Primary,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: "Beranda"),
        BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: "Catatan"),
        BottomNavigationBarItem(icon: Icon(Icons.security_outlined), label: "Imunisasi"),
        BottomNavigationBarItem(icon: Icon(Icons.book_outlined), label: "Edukasi"),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: "Profil"),
      ],
    );
  }
}