import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/auth/presentation/screens/login_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/journey_screen.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/tumbuh_kembang_screen.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String selectedPhase = "Hamil";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9), // Background abu-abu sangat muda
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
                  // Menampilkan konten berdasarkan fase yang dipilih
                  if (selectedPhase == "Hamil") _buildHamilContent(),
                  if (selectedPhase == "Tumbuh") _buildTumbuhContent(),
                  if (selectedPhase != "Hamil" && selectedPhase != "Tumbuh")
                    _buildPlaceholderContent(),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  // --- 1. HEADER BIRU GRADASI ---
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: TrimesterTheme.t1Gradient,
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
            children: [
              const Text("Selamat Pagi ✨", style: TextStyle(color: Colors.white70, fontSize: 16)),
              const Text("Halo, Polaroid!", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Row(
                children: const [
                  Icon(Icons.calendar_today, color: Colors.white70, size: 14),
                  SizedBox(width: 4),
                  Text("Trimester 2 • Bebas keluhan berat", style: TextStyle(color: Colors.white, fontSize: 12)),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), shape: BoxShape.circle),
            child: PopupMenuButton<String>(
              padding: EdgeInsets.zero,
              icon: const Icon(Icons.notifications_none, color: Colors.white),
              onSelected: (value) async {
                if (value == 'logout') {
                  await AuthSession.clear();
                  if (!mounted) return;
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                    (route) => false,
                  );
                }
              },
              itemBuilder: (context) => const [
                PopupMenuItem<String>(
                  value: 'logout',
                  child: Text('Logout'),
                ),
              ],
            ),
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
                  Text(
                    p['label'],
                    style: TextStyle(
                      fontSize: 12, 
                      color: isActive ? TrimesterTheme.t1Primary : Colors.grey, 
                      fontWeight: isActive ? FontWeight.bold : FontWeight.normal
                    )
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // --- 3. KONTEN KHUSUS HAMIL (INTEGRASI LENGKAP) ---
  Widget _buildHamilContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // A. PROGRESS KEHAMILAN
        _buildInfoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text("Kehamilan 24 Minggu", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Icon(Icons.chevron_right, color: Colors.grey),
                ],
              ),
              const Text("Trimester 2 • HPL: 15 Agt 2026", style: TextStyle(color: Colors.grey, fontSize: 12)),
              const SizedBox(height: 16),
              LinearProgressIndicator(value: 0.6, backgroundColor: Colors.blue.shade50, color: TrimesterTheme.t1Primary, minHeight: 8),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text("Minggu 1", style: TextStyle(fontSize: 10, color: Colors.grey)),
                  Text("Minggu 40", style: TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // B. INSIGHT BUAH
        _buildInfoCard(
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text("Sebesar Buah Jagung", style: TextStyle(fontWeight: FontWeight.bold)),
                    Text("Panjang janin sekitar 30 cm dengan berat sekitar 600 gram.", style: TextStyle(fontSize: 12, color: Colors.black54)),
                  ],
                ),
              ),
              Image.network('https://cdn-icons-png.flaticon.com/512/1141/1141771.png', width: 40),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // C. MENU HAMIL - LIST MODE
        const Text("Menu Hamil", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
        const SizedBox(height: 16),
        _buildMenuCard(
          title: "Kehamilan Trimester 1–3",
          subtitle: "Pantau perkembangan kehamilan",
          icon: Icons.favorite_outline,
          iconColor: Colors.pink,
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => JourneyScreen())),
        ),
        _buildMenuCard(
          title: "Kesehatan Jiwa Ibu Hamil",
          subtitle: "Kesehatan mental selama hamil",
          icon: Icons.psychology_outlined,
          iconColor: Colors.purple,
          onTap: () {},
        ),
        _buildMenuCard(
          title: "Persalinan",
          subtitle: "Persiapan & proses persalinan",
          icon: Icons.child_care_outlined,
          iconColor: Colors.blue,
          onTap: () {},
        ),
        const SizedBox(height: 32),

        // D. MENU CEPAT - GRID MODE
        const Text("MENU CEPAT", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 16),
        _buildQuickMenu(),
        const SizedBox(height: 32),

        // E. TANDA BAHAYA
        _buildDangerAlert(),
        const SizedBox(height: 40),
      ],
    );
  }

  // --- HELPER: KARTU MENU LIST (GAYA image_e8cb9d.png) ---
  Widget _buildMenuCard({
    required String title, 
    required String subtitle, 
    required IconData icon, 
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24), // Mengikuti rounded-2xl pada model
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(icon, color: iconColor, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
                      const SizedBox(height: 4),
                      Text(subtitle, style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right, color: Colors.grey.shade400),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // --- HELPER: GRID MENU CEPAT ---
  Widget _buildQuickMenu() {
    final List<Map<String, dynamic>> menus = [
      {'label': 'BB Ibu', 'icon': Icons.scale, 'color': Colors.blue},
      {'label': 'Periksa', 'icon': Icons.medical_services, 'color': Colors.pink},
      {'label': 'Nutrisi', 'icon': Icons.apple, 'color': Colors.green},
      {'label': 'Edukasi', 'icon': Icons.book, 'color': Colors.orange},
      {'label': 'Catatan', 'icon': Icons.assignment, 'color': Colors.indigo},
      {'label': 'Keluhan', 'icon': Icons.coronavirus, 'color': Colors.red},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3, 
        mainAxisSpacing: 16, 
        crossAxisSpacing: 16,
      ),
      itemCount: menus.length,
      itemBuilder: (context, i) {
        return InkWell(
          onTap: () {
            if (menus[i]['label'] == 'Periksa') {
              Navigator.push(context, MaterialPageRoute(builder: (c) => JourneyScreen()));
            }
          },
          child: Container(
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(menus[i]['icon'], color: menus[i]['color']),
                const SizedBox(height: 8),
                Text(menus[i]['label'], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        );
      },
    );
  }

  // --- HELPER: WIDGET REUSABLE (PROGRESS & BUAH) ---
  Widget _buildInfoCard({required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(20), 
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: child,
    );
  }

  // --- HELPER: ALERT TANDA BAHAYA ---
  Widget _buildDangerAlert() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF1F2), 
        borderRadius: BorderRadius.circular(16), 
        border: Border.all(color: Colors.red.shade100),
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber_rounded, color: Colors.red),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text("Tanda Bahaya Kehamilan", style: TextStyle(fontSize: 12, color: Colors.red, fontWeight: FontWeight.bold)),
                Text("Pahami gejala yang perlu diwaspadai", style: TextStyle(fontSize: 11, color: Colors.black54)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.red),
        ],
      ),
    );
  }

  Widget _buildPlaceholderContent() => const Center(child: Padding(padding: EdgeInsets.all(40), child: Text("Konten fase ini segera hadir!")));

  Widget _buildTumbuhContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Menu Tumbuh Kembang",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
        ),
        const SizedBox(height: 16),
        _buildMenuCard(
          title: "Pemantauan Pertumbuhan Anak",
          subtitle: "Input data, lihat grafik, dan status tumbuh anak",
          icon: Icons.monitor_heart_outlined,
          iconColor: Colors.teal,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const TumbuhKembangScreen()),
          ),
        ),
        _buildMenuCard(
          title: "Riwayat & Status Gizi",
          subtitle: "Integrasi endpoint backend /pertumbuhan/:anak_id",
          icon: Icons.query_stats,
          iconColor: Colors.indigo,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const TumbuhKembangScreen()),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: TrimesterTheme.t1Primary,
      unselectedItemColor: Colors.grey,
      currentIndex: 0,
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