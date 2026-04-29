import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/core/services/reminder_notification_service.dart';
import 'package:ta_pa2_pa3_project/features/auth/presentation/screens/login_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/journey_screen.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/anak/pilih_anak_screen.dart';
// import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/tumbuh_kembang_screen.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/anak/input_profil_anak_screen.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/skrining/skrining_bahaya.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/mpasi/halaman_utama_mpasi.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/edukasi/edukasi_screen.dart';
import 'package:ta_pa2_pa3_project/features/perawatan_bayi/presentation/screens/pilih_perawatan_screen.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String selectedPhase = "Hamil";
  int _selectedNavIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _showStartupReminderIfNeeded();
    });
  }

  Future<void> _showStartupReminderIfNeeded() async {
    if (!AuthSession.isLoggedIn || AuthSession.isReminderShown) {
      return;
    }

    await ReminderNotificationService.scheduleTumbuhReminders();
    if (!mounted) return;

    await _showTumbuhReminderPopup();
    await AuthSession.markReminderShown();
  }

  Future<void> _showTumbuhReminderPopup() async {
    await showDialog<void>(
      context: context,
      barrierDismissible: true,
      builder: (dialogContext) {
        return Dialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
            ),
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFDE68A), Color(0xFFF59E0B)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.notifications_active, color: Colors.white),
                      SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Pengingat Suplemen Anak',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Agar tumbuh kembang optimal, pastikan jadwal suplemen anak tidak terlewat.',
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(0xFF475569),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 14),
                _buildReminderItem(
                  icon: Icons.medication,
                  iconColor: const Color(0xFFF59E0B),
                  title: 'Vitamin A',
                  detail:
                      'Berikan vitamin A setiap bulan sesuai kebutuhan anak.',
                ),
                const SizedBox(height: 10),
                _buildReminderItem(
                  icon: Icons.health_and_safety,
                  iconColor: const Color(0xFF16A34A),
                  title: 'Obat Cacing',
                  detail: 'Berikan obat cacing setiap 6 bulan sekali.',
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.of(dialogContext).pop(),
                        style: OutlinedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Nanti'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: FilledButton(
                        onPressed: () => Navigator.of(dialogContext).pop(),
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Siap, Ingatkan Saya'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildReminderItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String detail,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  detail,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF475569),
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _onPhaseSelected(String phase) async {
    setState(() => selectedPhase = phase);
  }

  Widget _buildHomeBody() {
    return SingleChildScrollView(
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
                if (selectedPhase == "Hamil") _buildHamilContent(),
                if (selectedPhase == "Tumbuh") _buildTumbuhContent(),
                if (selectedPhase != "Hamil" && selectedPhase != "Tumbuh")
                  _buildPlaceholderContent(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: _selectedNavIndex == 0
          ? _buildHomeBody()
          : _selectedNavIndex == 1
              ? const Center(child: Text("Catatan"))
              : _selectedNavIndex == 2
                  ? const PilihAnakScreen(tujuan: "imunisasi")
                  : const Center(child: Text("Profil")),
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
              const Text("Selamat Pagi ✨",
                  style: TextStyle(color: Colors.white70, fontSize: 16)),
              const Text("Halo, Polaroid!",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Row(
                children: const [
                  Icon(Icons.calendar_today, color: Colors.white70, size: 14),
                  SizedBox(width: 4),
                  Text("Trimester 2 • Bebas keluhan berat",
                      style: TextStyle(color: Colors.white, fontSize: 12)),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2), shape: BoxShape.circle),
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
        const Text("TAHAP SAAT INI",
            style: TextStyle(
                fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: phases.map((p) {
            bool isActive = selectedPhase == p['label'];
            return GestureDetector(
              onTap: () => _onPhaseSelected(p['label']),
              child: Column(
                children: [
                  Container(
                    width: 65,
                    height: 65,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: isActive
                          ? Border.all(
                              color: TrimesterTheme.t1Primary, width: 2)
                          : null,
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10)
                      ],
                    ),
                    child: Icon(p['icon'],
                        color:
                            isActive ? TrimesterTheme.t1Primary : Colors.grey,
                        size: 28),
                  ),
                  const SizedBox(height: 8),
                  Text(p['label'],
                      style: TextStyle(
                          fontSize: 12,
                          color:
                              isActive ? TrimesterTheme.t1Primary : Colors.grey,
                          fontWeight:
                              isActive ? FontWeight.bold : FontWeight.normal)),
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
                  Text("Kehamilan 24 Minggu",
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Icon(Icons.chevron_right, color: Colors.grey),
                ],
              ),
              const Text("Trimester 2 • HPL: 15 Agt 2026",
                  style: TextStyle(color: Colors.grey, fontSize: 12)),
              const SizedBox(height: 16),
              LinearProgressIndicator(
                  value: 0.6,
                  backgroundColor: Colors.blue.shade50,
                  color: TrimesterTheme.t1Primary,
                  minHeight: 8),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text("Minggu 1",
                      style: TextStyle(fontSize: 10, color: Colors.grey)),
                  Text("Minggu 40",
                      style: TextStyle(fontSize: 10, color: Colors.grey)),
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
                    Text("Sebesar Buah Jagung",
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(
                        "Panjang janin sekitar 30 cm dengan berat sekitar 600 gram.",
                        style: TextStyle(fontSize: 12, color: Colors.black54)),
                  ],
                ),
              ),
              Image.network(
                  'https://cdn-icons-png.flaticon.com/512/1141/1141771.png',
                  width: 40),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // C. MENU HAMIL - LIST MODE
        const Text("Menu Hamil",
            style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87)),
        const SizedBox(height: 16),
        _buildMenuCard(
          title: "Kehamilan Trimester 1–3",
          subtitle: "Pantau perkembangan kehamilan",
          icon: Icons.favorite_outline,
          iconColor: Colors.pink,
          onTap: () => Navigator.push(context,
              MaterialPageRoute(builder: (context) => JourneyScreen())),
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
        const Text("MENU CEPAT",
            style: TextStyle(
                fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
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
        borderRadius:
            BorderRadius.circular(24), // Mengikuti rounded-2xl pada model
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4)),
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
                  width: 56,
                  height: 56,
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
                      Text(title,
                          style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87)),
                      const SizedBox(height: 4),
                      Text(subtitle,
                          style: TextStyle(
                              fontSize: 13, color: Colors.grey.shade600)),
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
      {
        'label': 'Perawatan',
        'icon': Icons.health_and_safety,
        'color': Colors.pink
      },
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
            if (menus[i]['label'] == 'Perawatan') {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (c) => const PilihPerawatanScreen()));
            }
            if (menus[i]['label'] == 'Edukasi') {
              Navigator.push(context,
                  MaterialPageRoute(builder: (c) => const EdukasiScreen()));
            }
          },
          child: Container(
            decoration: BoxDecoration(
                color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(menus[i]['icon'], color: menus[i]['color']),
                const SizedBox(height: 8),
                Text(menus[i]['label'],
                    style: const TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w500)),
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
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)
        ],
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
                Text("Tanda Bahaya Kehamilan",
                    style: TextStyle(
                        fontSize: 12,
                        color: Colors.red,
                        fontWeight: FontWeight.bold)),
                Text("Pahami gejala yang perlu diwaspadai",
                    style: TextStyle(fontSize: 11, color: Colors.black54)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.red),
        ],
      ),
    );
  }

  Widget _buildPlaceholderContent() => const Center(
      child: Padding(
          padding: EdgeInsets.all(40),
          child: Text("Konten fase ini segera hadir!")));

  Widget _buildTumbuhContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 🔹 MENU CEPAT
        Text(
          "Menu Cepat",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),

        GridView.count(
          shrinkWrap: true,
          crossAxisCount: 3,
          physics: NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          children: [
            // 🔸 TIMBANG
            _menuItem(Icons.scale, "Pertumbuhan", Colors.orange, () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PilihAnakScreen(),
                ),
              );
            }),

            // 🔸 IMUNISASI
            _menuItem(Icons.shield, "Imunisasi", Colors.green, () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PilihAnakScreen(tujuan: "imunisasi"),
                ),
              );
            }),

            // 🔸 MPASI
            _menuItem(Icons.restaurant_menu, "MPASI", Colors.blue, () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PilihAnakScreen(tujuan: "mpasi"),
                ),
              );
            }),

            // 🔸 PERAWATAN
            _menuItem(Icons.health_and_safety, "Perawatan", Colors.red, () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PilihPerawatanScreen(),
                ),
              );
            }),

            // 🔸 EDUKASI
            _menuItem(Icons.menu_book, "Edukasi", Colors.orange, () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const EdukasiScreen(),
                ),
              );
            }),

            // 🔸 CATATAN
            _menuItem(Icons.note, "Catatan", Colors.red, () {
              // TODO: halaman catatan
            }),

            // 🔸 BAHAYA
            _menuItem(Icons.warning, "Bahaya", Colors.orange, () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PilihAnakScreen(tujuan: "bahaya"),
                ),
              );
            }),
          ],
        ),

        SizedBox(height: 24),

        // 🔹 WARNING BOX
        Container(
          padding: EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Color(0xFFFFF3E0),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Colors.orange),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  "Kenali Tanda Bahaya — Segera ke faskes jika ada gejala ini",
                  style: TextStyle(fontSize: 12),
                ),
              ),
              Icon(Icons.chevron_right),
            ],
          ),
        ),

        SizedBox(height: 40),
      ],
    );
  }

  Widget _menuItem(
    IconData icon,
    String title,
    Color color,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 6,
            )
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color),
            SizedBox(height: 6),
            Text(title, style: TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: TrimesterTheme.t1Primary,
      unselectedItemColor: Colors.grey,
      currentIndex: _selectedNavIndex,
      onTap: (index) => setState(() => _selectedNavIndex = index),
      items: const [
        BottomNavigationBarItem(
            icon: Icon(Icons.home_filled), label: "Beranda"),
        BottomNavigationBarItem(
            icon: Icon(Icons.assignment_outlined), label: "Catatan"),
        BottomNavigationBarItem(
            icon: Icon(Icons.security_outlined), label: "Imunisasi"),
        BottomNavigationBarItem(
            icon: Icon(Icons.person_outline), label: "Profil"),
      ],
    );
  }
}
