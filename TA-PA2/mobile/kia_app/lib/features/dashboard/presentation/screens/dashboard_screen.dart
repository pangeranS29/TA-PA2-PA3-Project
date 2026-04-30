import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/core/theme/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/anak/imunisasi/presentation/screens/imunisasi_screen.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/tumbuh_kembang_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/models/kehamilan_aktif_model.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/services/kehamilan_api_service.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/absensi_kelas_ibu_hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/nifas/presentation/screens/nifas_screen.dart';

import '../widgets/dashboard_bottom_nav.dart';
import '../widgets/dashboard_header.dart';
import '../widgets/dashboard_menu_card.dart';
import '../widgets/dashboard_phase_selector.dart';
import '../widgets/dashboard_quick_menu.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String selectedPhase = "Hamil";
  int _selectedNavIndex = 0;

  final _kehamilanService = KehamilanApiService();
  bool _loadingKehamilan = false;
  KehamilanAktifModel? _kehamilanAktif;

  @override
  void initState() {
    super.initState();
    _loadKehamilanAktif();
  }

  Future<void> _loadKehamilanAktif() async {
    try {
      final kehamilan = await _kehamilanService.getKehamilanAktif();
      if (!mounted) return;
      setState(() => _kehamilanAktif = kehamilan);
    } catch (_) {
      // Dashboard tetap tampil walaupun data kehamilan belum ada
    }
  }

  Future<void> _openHamilJourney() async {
    if (_loadingKehamilan) return;
    setState(() => _loadingKehamilan = true);
    try {
      await _kehamilanService.getKehamilanAktif();
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const HamilScreen()),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      if (mounted) setState(() => _loadingKehamilan = false);
    }
  }

  String _trimesterLabel(int week) {
    if (week <= 12) return 'Trimester 1';
    if (week <= 27) return 'Trimester 2';
    return 'Trimester 3';
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '-';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des',
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  void _showSnackbar(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  void _navigateTo(Widget screen) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
  }

  // ─── BODY UTAMA ───────────────────────────────────────────────────────────

  Widget _buildHomeBody() {
    return SingleChildScrollView(
      child: Column(
        children: [
          const DashboardHeader(),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 24),
                DashboardPhaseSelector(
                  selectedPhase: selectedPhase,
                  onPhaseSelected: (phase) {
                    // Fase Nifas & Menyusui → navigate, bukan embed
                    if (phase == 'Nifas') {
                      _navigateTo(const NifasScreen());
                      return;
                    }
                    if (phase == 'Menyusui') {
                      _showSnackbar('Fitur Menyusui segera hadir!');
                      return;
                    }
                    setState(() => selectedPhase = phase);
                  },
                ),
                const SizedBox(height: 32),
                if (selectedPhase == "Hamil") _buildHamilContent(),
                if (selectedPhase == "Tumbuh") _buildTumbuhContent(),
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
      body = const Center(child: Text("Catatan"));
    } else if (_selectedNavIndex == 2) {
      body = const ImunisasiScreen();
    } else if (_selectedNavIndex == 3) {
      body = const Center(child: Text("Edukasi"));
    } else {
      body = const Center(child: Text("Profil"));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: body,
      bottomNavigationBar: DashboardBottomNav(
        currentIndex: _selectedNavIndex,
        onTap: (index) {
          // Tab Imunisasi (index 2) → navigate supaya Scaffold tidak konflik
          if (index == 2) {
            _navigateTo(const ImunisasiScreen());
            return;
          }
          setState(() => _selectedNavIndex = index);
        },
      ),
    );
  }

  // ─── KONTEN HAMIL ─────────────────────────────────────────────────────────

  Widget _buildHamilContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Progress kehamilan
        InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: _openHamilJourney,
          child: DashboardInfoCard(
            child: Builder(
              builder: (_) {
                final week = _kehamilanAktif?.ukKehamilanSaatIni ?? 0;
                final progress =
                    week > 0 ? (week / 40).clamp(0.0, 1.0) : 0.0;
                final trimester = week > 0 ? _trimesterLabel(week) : '-';
                final hpl = _formatDate(_kehamilanAktif?.taksiranPersalinan);

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          week > 0
                              ? 'Kehamilan $week Minggu'
                              : 'Kehamilan Aktif',
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        if (_loadingKehamilan)
                          const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        else
                          const Icon(Icons.chevron_right, color: Colors.grey),
                      ],
                    ),
                    Text(
                      '$trimester • HPL: $hpl',
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    LinearProgressIndicator(
                      value: progress,
                      backgroundColor: Colors.blue.shade50,
                      color: TrimesterTheme.t1Primary,
                      minHeight: 8,
                    ),
                    const SizedBox(height: 8),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Minggu 1",
                            style:
                                TextStyle(fontSize: 10, color: Colors.grey)),
                        Text("Minggu 40",
                            style:
                                TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                  ],
                );
              },
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Insight buah
        DashboardInfoCard(
          child: Row(
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Sebesar Buah Jagung",
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(
                      "Panjang janin sekitar 30 cm dengan berat sekitar 600 gram.",
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                  ],
                ),
              ),
              Image.network(
                'https://cdn-icons-png.flaticon.com/512/1141/1141771.png',
                width: 40,
                errorBuilder: (_, __, ___) =>
                    const Icon(Icons.eco, size: 40, color: Colors.green),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // Menu Hamil
        const Text(
          "Menu Hamil",
          style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black87),
        ),
        const SizedBox(height: 16),
        DashboardMenuCard(
          title: "Kehamilan Trimester 1–3",
          subtitle: "Pantau perkembangan kehamilan",
          icon: Icons.favorite_outline,
          iconColor: Colors.pink,
          onTap: _openHamilJourney,
        ),
        DashboardMenuCard(
          title: "Persalinan",
          subtitle: "Persiapan & proses persalinan",
          icon: Icons.child_care_outlined,
          iconColor: Colors.blue,
          onTap: () => _showSnackbar('Fitur Persalinan segera hadir!'),
        ),
        const SizedBox(height: 32),

        // Menu Cepat
        const Text(
          "MENU CEPAT",
          style: TextStyle(
              fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
        ),
        const SizedBox(height: 16),
        DashboardQuickMenu(
          items: [
            {
              'label': 'Grafik BB Ibu',
              'icon': Icons.show_chart,
              'color': Colors.blue,
              'onTap': () => _showSnackbar('Grafik BB Ibu belum tersedia'),
            },
            {
              'label': 'Grafik DJJ & TFU',
              'icon': Icons.monitor_heart_outlined,
              'color': Colors.purple,
              'onTap': () =>
                  _showSnackbar('Grafik DJJ & TFU belum tersedia'),
            },
            {
              'label': 'Absensi Kelas',
              'icon': Icons.event_available_outlined,
              'color': Colors.green,
              'onTap': () =>
                  _navigateTo(const AbsensiKelasIbuHamilScreen()),
            },
            {
              'label': 'Catatan',
              'icon': Icons.assignment_outlined,
              'color': Colors.indigo,
              'onTap': () => _showSnackbar('Catatan belum tersedia'),
            },
          ],
        ),
        const SizedBox(height: 32),

        _buildRujukanCard(),
        const SizedBox(height: 40),
      ],
    );
  }

  // ─── KONTEN TUMBUH ────────────────────────────────────────────────────────

  Widget _buildTumbuhContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Tambah profil anak → navigate ke TumbuhKembangScreen
        GestureDetector(
          onTap: () => _navigateTo(const TumbuhKembangScreen()),
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
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Tambah Profil Anak",
                        style: TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      SizedBox(height: 4),
                      Text(
                        "Mulai pantau tumbuh kembang si kecil",
                        style:
                            TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(
                      color: Colors.blue, shape: BoxShape.circle),
                  child:
                      const Icon(Icons.add, size: 16, color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),

        const Text(
          "Menu Cepat",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        const SizedBox(height: 12),

        DashboardTumbuhQuickMenu(
          items: [
            {
              'label': 'Pertumbuhan',
              'icon': Icons.scale,
              'color': Colors.orange,
              'onTap': () => _navigateTo(const TumbuhKembangScreen()),
            },
            {
              'label': 'Imunisasi',
              'icon': Icons.shield,
              'color': Colors.green,
              'onTap': () => _navigateTo(const ImunisasiScreen()),
            },
            {
              'label': 'MPASI',
              'icon': Icons.restaurant_menu,
              'color': Colors.blue,
              'onTap': () => _showSnackbar('MPASI belum tersedia'),
            },
            {
              'label': 'Edukasi',
              'icon': Icons.menu_book,
              'color': Colors.orange,
              'onTap': () => _showSnackbar('Edukasi belum tersedia'),
            },
            {
              'label': 'Catatan',
              'icon': Icons.note,
              'color': Colors.red,
              'onTap': () => _showSnackbar('Catatan belum tersedia'),
            },
            {
              'label': 'Bahaya',
              'icon': Icons.warning,
              'color': Colors.deepOrange,
              'onTap': () => _showSnackbar('Tanda bahaya belum tersedia'),
            },
          ],
        ),
        const SizedBox(height: 24),

        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF3E0),
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Row(
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
        const SizedBox(height: 40),
      ],
    );
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────

  Widget _buildRujukanCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.blue.shade100),
      ),
      child: Row(
        children: [
          Icon(Icons.description_outlined, color: Colors.blue.shade700),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Surat Rekomendasi Rujukan",
                  style: TextStyle(
                      fontSize: 12,
                      color: Colors.blue,
                      fontWeight: FontWeight.bold),
                ),
                Text(
                  "Belum ada surat rekomendasi rujukan saat ini",
                  style: TextStyle(fontSize: 11, color: Colors.black54),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.blue),
        ],
      ),
    );
  }
}
