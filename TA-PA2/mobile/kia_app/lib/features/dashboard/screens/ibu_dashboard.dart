import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/hamil/screens/journey_screen.dart';

class IbuDashboard extends StatefulWidget {
  const IbuDashboard({super.key});

  @override
  State<IbuDashboard> createState() => _IbuDashboardState();
}

class _IbuDashboardState extends State<IbuDashboard> {
  String selectedPhase = "Hamil";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.slate100,
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  _buildPhaseSelector(),
                  const SizedBox(height: 32),
                  
                  // Konten berdasarkan pilihan fase
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

  // --- HEADER: Style Guide Card 11 (Gradient) ---
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF60A5FA), Color(0xFF2563EB)], // Blue Gradient
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Selamat Pagi ✨", style: TextStyle(color: Colors.white70, fontSize: 14, fontFamily: 'Inter')),
              Text("Halo, Polaroid!", style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, fontFamily: 'Inter')),
              SizedBox(height: 8),
              Text("Status: Trimester 2 • Monitoring Rutin", style: TextStyle(color: Colors.white, fontSize: 12, fontFamily: 'Inter')),
            ],
          ),
          Icon(Icons.notifications_none, color: Colors.white),
        ],
      ),
    );
  }

  // --- PHASE SELECTOR: Style Guide Card 10 (Radius 20) ---
  Widget _buildPhaseSelector() {
    final List<Map<String, dynamic>> phases = [
      {'label': 'Hamil', 'icon': Icons.favorite_border},
      {'label': 'Nifas', 'icon': Icons.person_outline},
      {'label': 'Menyusui', 'icon': Icons.child_care},
      {'label': 'Tumbuh', 'icon': Icons.emoji_emotions_outlined},
    ];

    return Row(
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
                  borderRadius: BorderRadius.circular(AppTheme.rounded2XL),
                  border: isActive ? Border.all(color: AppTheme.primary500, width: 2) : null,
                  boxShadow: const [AppTheme.shadowMd],
                ),
                child: Icon(p['icon'], color: isActive ? AppTheme.primary500 : AppTheme.slate400, size: 28),
              ),
              const SizedBox(height: 8),
              Text(p['label'], style: TextStyle(fontSize: 12, color: isActive ? AppTheme.primary500 : AppTheme.slate400, fontWeight: isActive ? FontWeight.w700 : FontWeight.normal)),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildHamilContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Card Progress (Style Guide Card 2)
        _buildInfoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Perjalanan Kehamilan Anda", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 12),
              LinearProgressIndicator(value: 0.6, backgroundColor: AppTheme.primary50, color: AppTheme.primary500, minHeight: 8, borderRadius: BorderRadius.circular(10)),
              const SizedBox(height: 8),
              const Text("Minggu ke-24 • HPL: 15 Agt 2026", style: TextStyle(color: AppTheme.slate400, fontSize: 12)),
            ],
          ),
        ),
        const SizedBox(height: 24),
        const Text("HASIL PEMERIKSAAN", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.slate400)),
        const SizedBox(height: 12),
        
        // Menu Navigasi ke Riwayat Medis
        _buildMenuCard(
          title: "Riwayat Trimester I–III",
          subtitle: "Lihat hasil skrining dari bidan/dokter",
          icon: Icons.assignment_turned_in_outlined,
          iconColor: Colors.blue,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (c) => const JourneyScreen())),
        ),
        _buildMenuCard(
          title: "Grafik Berat Badan",
          subtitle: "Pantau kenaikan berat badan ideal",
          icon: Icons.show_chart,
          iconColor: Colors.green,
          onTap: () {},
        ),
        const SizedBox(height: 24),
        _buildQuickMenu(),
        const SizedBox(height: 24),
        _buildDangerAlert(),
        const SizedBox(height: 32),
      ],
    );
  }

  // --- HELPERS (Style Guide Consistent) ---
  Widget _buildMenuCard({required String title, required String subtitle, required IconData icon, required Color iconColor, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(AppTheme.rounded2XL), boxShadow: const [AppTheme.shadowMd]),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(backgroundColor: iconColor.withOpacity(0.1), child: Icon(icon, color: iconColor, size: 20)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 11, color: AppTheme.slate400)),
        trailing: const Icon(Icons.chevron_right, color: AppTheme.slate200),
        onTap: onTap,
      ),
    );
  }

  Widget _buildQuickMenu() {
    final List<Map<String, dynamic>> menus = [
      {'label': 'Nutrisi', 'icon': Icons.apple, 'color': Colors.orange},
      {'label': 'Jadwal', 'icon': Icons.event_note, 'color': Colors.pink},
      {'label': 'Edukasi', 'icon': Icons.menu_book, 'color': Colors.blue},
    ];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: menus.map((m) => Container(
        width: MediaQuery.of(context).size.width * 0.28,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: const [AppTheme.shadowMd]),
        child: Column(children: [Icon(m['icon'], color: m['color']), const SizedBox(height: 8), Text(m['label'], style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600))]),
      )).toList(),
    );
  }

  Widget _buildInfoCard({required Widget child}) => Container(width: double.infinity, padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [AppTheme.shadowMd]), child: child);

  Widget _buildDangerAlert() => Container(padding: EdgeInsets.all(16), decoration: BoxDecoration(color: Color(0xFFFFF1F2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.red.shade100)), child: Row(children: [Icon(Icons.warning_amber_rounded, color: Colors.red, size: 20), SizedBox(width: 12), Expanded(child: Text("Waspada Tanda Bahaya Kehamilan", style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12))), Icon(Icons.chevron_right, color: Colors.red, size: 20)]));

  Widget _buildPlaceholderContent() => const Center(child: Padding(padding: EdgeInsets.all(40), child: Text("Data fase ini belum tersedia ✨", style: TextStyle(color: AppTheme.slate400))));

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: AppTheme.primary500,
      unselectedItemColor: AppTheme.slate400,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: "Beranda"),
        BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: "Riwayat"),
        BottomNavigationBarItem(icon: Icon(Icons.book_outlined), label: "Edukasi"),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: "Profil"),
      ],
    );
  }
}