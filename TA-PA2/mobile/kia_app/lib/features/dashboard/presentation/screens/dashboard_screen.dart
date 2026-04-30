import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/journey_screen.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/pilih_anak_screen.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/presentation/screens/input_profil_anak_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/kehamilan_api_service.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/presentation/screens/edukasi_explore_screen.dart';
import 'package:ta_pa2_pa3_project/features/nifas/presentation/screens/nifas_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/catatan_pelayanan_menu_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/rujukan_list_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/kehamilan_aktif_model.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/absensi_kelas_ibu_hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/pemantauan_ibu_hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/log_ttd_mms_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/persiapan_melahirkan_screen.dart';
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String selectedPhase = "Hamil";
  int _selectedNavIndex = 0;
  String _username = "Bunda";

  final _kehamilanService = KehamilanApiService();
  bool _loadingKehamilan = false;
  KehamilanAktifModel? _kehamilanAktif;

  @override
  void initState() {
    super.initState();
    _loadUsername();
    _loadKehamilanAktif();
  }

  Future<void> _loadUsername() async {
    final prefs = await SharedPreferences.getInstance();
    if (!mounted) return;
    setState(() {
      _username = prefs.getString('username') ?? 'Bunda';
    });
  }

  Future<void> _loadKehamilanAktif() async {
    try {
      final kehamilan = await _kehamilanService.getKehamilanAktif();
      if (!mounted) return;
      setState(() {
        _kehamilanAktif = kehamilan;
      });
    } catch (_) {}
  }

  Future<void> _openHamilJourney() async {
    if (_loadingKehamilan) return;

    setState(() {
      _loadingKehamilan = true;
    });

    try {
      final kehamilan = await _kehamilanService.getKehamilanAktif();
      if (!mounted) return;

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => JourneyScreen(kehamilan: kehamilan),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      if (mounted) {
        setState(() {
          _loadingKehamilan = false;
        });
      }
    }
  }

  String _trimesterLabel(int week) {
    if (week <= 12) return 'Trimester 1';
    if (week <= 27) return 'Trimester 2';
    return 'Trimester 3';
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '-';
    final months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
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
                if (selectedPhase == "Nifas") const NifasScreen(),
                if (selectedPhase == "Tumbuh") _buildTumbuhContent(),
                if (selectedPhase != "Hamil" && selectedPhase != "Nifas" && selectedPhase != "Tumbuh") _buildPlaceholderContent(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    Widget body;

    if (_selectedNavIndex == 0) {
      body = _buildHomeBody();
    } else if (_selectedNavIndex == 1) {
      body = const AbsensiKelasIbuHamilScreen();
    } else if (_selectedNavIndex == 2) {
      body = const EdukasiExploreScreen();
    } else {
      body = const Center(child: Text("Profil"));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: body,
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF3B82F6)],
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
              Text("Halo, $_username!", style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Row(
                children: [
                  Icon(Icons.calendar_today, color: Colors.white70, size: 14),
                  SizedBox(width: 4),
                  Text("Trimester 2 • Bebas keluhan berat", style: TextStyle(color: Colors.white, fontSize: 12)),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: InkWell(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Belum ada notifikasi')),
                );
              },
              child: const Icon(Icons.notifications_none, color: Colors.white, size: 26),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPhaseSelector() {
    final List<Map<String, dynamic>> phases = [
      {'label': 'Hamil', 'icon': Icons.favorite_border},
      {'label': 'Nifas', 'icon': Icons.person_outline},
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
            final bool isActive = selectedPhase == p['label'];
            return GestureDetector(
              onTap: () {
                setState(() {
                  selectedPhase = p['label'] as String;
                });
              },
              child: Column(
                children: [
                  Container(
                    width: 82,
                    height: 70,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: isActive ? Border.all(color: const Color(0xFF2563EB), width: 2) : null,
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                    ),
                    child: Icon(p['icon'] as IconData, color: isActive ? const Color(0xFF2563EB) : Colors.grey, size: 28),
                  ),
                  const SizedBox(height: 8),
                  Text(p['label'] as String, style: TextStyle(fontSize: 12, color: isActive ? const Color(0xFF2563EB) : Colors.grey, fontWeight: isActive ? FontWeight.bold : FontWeight.normal)),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildHamilContent() {
    final week = _kehamilanAktif?.ukKehamilanSaatIni ?? 20;
    final progress = week > 0 ? (week / 40).clamp(0.0, 1.0) : 0.0;
    final trimester = _trimesterLabel(week);
    final hpl = _formatDate(_kehamilanAktif?.taksiranPersalinan);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: _openHamilJourney,
          child: _buildInfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Kehamilan $week Minggu', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const Icon(Icons.chevron_right, color: Colors.grey),
                  ],
                ),
                Text('$trimester • HPL: $hpl', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 16),
                LinearProgressIndicator(
                  value: progress,
                  backgroundColor: Colors.blue.shade50,
                  color: const Color(0xFF2563EB),
                  minHeight: 8,
                ),
                const SizedBox(height: 8),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Minggu 1', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    Text('Minggu 40', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        _buildInfoCard(
          child: Row(
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Sebesar Buah Jagung', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text('Panjang janin sekitar 30 cm dengan berat sekitar 600 gram.', style: TextStyle(fontSize: 12, color: Colors.black54)),
                  ],
                ),
              ),
              Image.network('https://cdn-icons-png.flaticon.com/512/1141/1141771.png', width: 40),
            ],
          ),
        ),
        const SizedBox(height: 32),
        const Text('MENU CEPAT', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 16),
        _buildQuickMenu(),
        const SizedBox(height: 32),
        const Text('Menu Hamil', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
        const SizedBox(height: 16),
        _buildMenuCard(title: 'Kehamilan Trimester 1–3', subtitle: 'Pantau perkembangan kehamilan', icon: Icons.favorite_outline, iconColor: Colors.pink, onTap: _openHamilJourney),
_buildMenuCard(
  title: 'Persiapan Melahirkan',
  subtitle: 'Checklist persiapan sebelum melahirkan',
  icon: Icons.child_care_outlined,
  iconColor: Colors.blue,
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const PersiapanMelahirkanScreen(),
      ),
    );
  },
),
        const SizedBox(height: 32),
        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildMenuCard({required String title, required String subtitle, required IconData icon, required Color iconColor, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
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
                  decoration: BoxDecoration(color: iconColor.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
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

  Widget _buildQuickMenu() {
    final List<Map<String, dynamic>> menus = [
      {'label': 'Grafik BB Ibu', 'icon': Icons.show_chart, 'color': Colors.blue},
      {'label': 'Grafik DJJ & TFU', 'icon': Icons.monitor_heart_outlined, 'color': Colors.purple},
      {'label': 'Catatan', 'icon': Icons.assignment_outlined, 'color': Colors.indigo},
      {'label': 'Log Minum TTD/MMS', 'icon': Icons.medication_outlined, 'color': Colors.red},
      {'label': 'Rujukan', 'icon': Icons.description_outlined, 'color': Colors.orange},
      {'label': 'Pemantauan Ibu Hamil', 'icon': Icons.health_and_safety_outlined, 'color': Colors.teal},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.0,
      ),
      itemCount: menus.length,
      itemBuilder: (context, i) {
        return InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: () {
            final label = menus[i]['label'];
            
            if (label == 'Rujukan') {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const RujukanListScreen()));
              return;
            }
            if (label == 'Pemantauan Ibu Hamil') {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const PemantauanIbuHamilScreen()));
              return;
            }
            if (label == 'Catatan') {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const CatatanPelayananMenuScreen()));
              return;
            }

            if (label == 'Log Minum TTD/MMS') {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const LogTTDMMSScreen()));
              return;
            }

ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$label belum tersedia')));
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$label belum tersedia')));
          },
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(menus[i]['icon'] as IconData, color: menus[i]['color'] as Color, size: 22),
                const SizedBox(height: 6),
                Text(menus[i]['label'] as String, textAlign: TextAlign.center, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        );
      },
    );
  }

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

  Widget _buildDangerAlert() {
    return const SizedBox();
  }

  Widget _buildPlaceholderContent() {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(40),
        child: Text('Konten fase ini segera hadir!'),
      ),
    );
  }

  Widget _buildTumbuhContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => InputProfilAnakScreen()));
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue.shade200),
              borderRadius: BorderRadius.circular(16),
              color: Colors.blue.shade50,
            ),
            child: Row(
              children: [
                const Icon(Icons.person_add, color: Colors.blue, size: 28),
                const SizedBox(width: 12),
                const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Request Tambah Profil Anak', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)), SizedBox(height: 4), Text('Mulai pantau tumbuh kembang si kecil', style: TextStyle(fontSize: 12, color: Colors.black54))])),
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(color: Colors.blue, shape: BoxShape.circle),
                  child: const Icon(Icons.add, size: 16, color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        const Text('Menu Cepat', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        GridView.count(
          shrinkWrap: true,
          crossAxisCount: 3,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          children: [
            _menuItem(Icons.scale, 'Pertumbuhan', Colors.orange, () {Navigator.push(context, MaterialPageRoute(builder: (_) => const PilihAnakScreen()));}),
            _menuItem(Icons.shield, 'Imunisasi', Colors.green, () {Navigator.push(context, MaterialPageRoute(builder: (_) => const PilihAnakScreen(tujuan: 'imunisasi')));}),
            _menuItem(Icons.favorite, 'Periksa', Colors.red, () {}),
            _menuItem(Icons.menu_book, 'Edukasi', Colors.orange, () {Navigator.push(context, MaterialPageRoute(builder: (_) => const EdukasiExploreScreen()));}),
            _menuItem(Icons.note, 'Catatan', Colors.red, () {}),
            _menuItem(Icons.warning, 'Bahaya', Colors.orange, () {}),
          ],
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: const Color(0xFFFFF3E0), borderRadius: BorderRadius.circular(16)),
          child: const Row(children: [Icon(Icons.warning_amber_rounded, color: Colors.orange), SizedBox(width: 10), Expanded(child: Text('Kenali Tanda Bahaya — Segera ke faskes jika ada gejala ini', style: TextStyle(fontSize: 12))), Icon(Icons.chevron_right)]),
        ),
        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildPemantauanIbuHamilCard() {
    return const SizedBox();
  }

  Widget _menuItem(IconData icon, String title, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6)],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 6),
            Text(title, style: const TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: const Color(0xFF2563EB),
      unselectedItemColor: Colors.grey,
      currentIndex: _selectedNavIndex,
      onTap: (index) {
        setState(() {
          _selectedNavIndex = index;
        });
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: 'Beranda'),
        BottomNavigationBarItem(icon: Icon(Icons.event_available_outlined), label: 'Absensi'),
        BottomNavigationBarItem(icon: Icon(Icons.book_outlined), label: 'Edukasi'),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profil'),
      ],
    );
  }
}
