import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/presentation/widgets/dashboard_header.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/presentation/widgets/dashboard_bottom_nav.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/presentation/widgets/dashboard_menu_card.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/presentation/widgets/dashboard_phase_selector.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/presentation/widgets/dashboard_quick_menu.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/data/dashboard_menu_data.dart';
// MODUL IBU
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/perjalanan_hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/services/kehamilan_api_service.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/models/kehamilan_aktif_model.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/absensi_kelas_ibu_hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/rujukan_list_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/pemantauan_ibu_hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/edukasi_explore_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/catatan_pelayanan_menu_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/nifas/presentation/screens/nifas_screen.dart';
// MODUL ANAK
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/anak/pilih_anak_screen.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/anak/input_profil_anak_screen.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/anak/cari_anak_screen.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/edukasi/edukasi_screen.dart';
// import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/skrining/skrining_bahaya.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String _selectedPhase = 'Hamil';
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
    } catch (_) {}
  }

  Future<void> _openHamilJourney() async {
    if (_loadingKehamilan) return;
    setState(() => _loadingKehamilan = true);
    try {
      final kehamilan = await _kehamilanService.getKehamilanAktif();
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => JourneyScreen(
            currentWeek: kehamilan.ukKehamilanSaatIni,
            gravida: kehamilan.gravida,
            paritas: kehamilan.paritas,
            abortus: kehamilan.abortus,
            hplText: kehamilan.taksiranPersalinan != null
                ? '${kehamilan.taksiranPersalinan!.day} / ${kehamilan.taksiranPersalinan!.month} / ${kehamilan.taksiranPersalinan!.year}'
                : '-',
            hphtText: kehamilan.hpht != null
                ? '${kehamilan.hpht!.day} / ${kehamilan.hpht!.month} / ${kehamilan.hpht!.year}'
                : '-',
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
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
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    Widget body;
    if (_selectedNavIndex == 0) {
      body = _buildHomeBody();
    } else if (_selectedNavIndex == 1) {
      // body = const Center(child: Text('Catatan - segera hadir'));
      body = const CatatanPelayananMenuScreen();
    } else if (_selectedNavIndex == 2) {
      body = const PilihAnakScreen(tujuan: 'imunisasi');
    } else if (_selectedNavIndex == 3) {
      body = const EdukasiExploreScreen();
    } else {
      body = const Center(child: Text('Profil'));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: body,
      bottomNavigationBar: DashboardBottomNav(
        currentIndex: _selectedNavIndex,
        onTap: (i) => setState(() => _selectedNavIndex = i),
      ),
    );
  }

  Widget _buildNifasShortcut() {
    return DashboardMenuCard(
      title: 'Nifas',
      subtitle: 'Pantau masa nifas pasca persalinan',
      icon: Icons.person_outline,
      iconColor: Colors.teal,
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const NifasScreen()),
      ),
    );
  }

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
                // [WIDGET: DashboardPhaseSelector]
                DashboardPhaseSelector(
                  selectedPhase: _selectedPhase,
                  onPhaseSelected: (phase) => setState(() => _selectedPhase = phase),
                ),
                const SizedBox(height: 32),
                if (_selectedPhase == 'Hamil') _buildHamilContent(),
                if (_selectedPhase == 'Nifas') _buildNifasShortcut(),
                if (_selectedPhase == 'Tumbuh') _buildTumbuhContent(),
                if (_selectedPhase != 'Hamil' &&
                    _selectedPhase != 'Nifas' &&
                    _selectedPhase != 'Tumbuh')
                  _buildPlaceholderContent(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────
  // [MODUL: IBU - Hamil] Konten tab Hamil
  // ─────────────────────────────────────────────
  Widget _buildHamilContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Progress kehamilan — klik navigasi ke JourneyScreen
        InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: _openHamilJourney,
          child: DashboardInfoCard(
            child: Builder(builder: (_) {
              final week = _kehamilanAktif?.ukKehamilanSaatIni ?? 0;
              final progress = week > 0 ? (week / 40).clamp(0.0, 1.0) : 0.0;
              final trimester = week > 0 ? _trimesterLabel(week) : '-';
              final hpl = _formatDate(_kehamilanAktif?.taksiranPersalinan);
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        week > 0 ? 'Kehamilan $week Minggu' : 'Kehamilan Aktif',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const Icon(Icons.chevron_right, color: Colors.grey),
                    ],
                  ),
                  Text('$trimester • HPL: $hpl',
                      style: const TextStyle(color: Colors.grey, fontSize: 12)),
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
                      Text('Minggu 1', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      Text('Minggu 40', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    ],
                  ),
                ],
              );
            }),
          ),
        ),
        const SizedBox(height: 16),

        // [MODUL: IBU] Card Pemantauan Ibu Hamil
        _buildPemantauanIbuHamilCard(),
        const SizedBox(height: 16),

        // Info insight janin
        DashboardInfoCard(
          child: Row(
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Sebesar Buah Jagung',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(
                      'Panjang janin sekitar 30 cm dengan berat sekitar 600 gram.',
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                    ),
                  ],
                ),
              ),
              Image.network(
                'https://cdn-icons-png.flaticon.com/512/1141/1141771.png',
                width: 40,
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),

        const Text('Menu Hamil',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
        const SizedBox(height: 16),

        DashboardMenuCard(
          title: 'Kehamilan Trimester 1–3',
          subtitle: 'Pantau perkembangan kehamilan',
          icon: Icons.favorite_outline,
          iconColor: Colors.pink,
          onTap: _openHamilJourney,
        ),
        DashboardMenuCard(
          title: 'Persalinan',
          subtitle: 'Persiapan & proses persalinan',
          icon: Icons.child_care_outlined,
          iconColor: Colors.blue,
          onTap: () {},
        ),
        const SizedBox(height: 32),

        const Text('MENU CEPAT',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 16),

        // [WIDGET: DashboardQuickMenu] — Menu cepat modul ibu
        DashboardQuickMenu(
          items: DashboardMenuData.hamilQuickMenuItems.map((item) {
            return {
              ...item,
              'onTap': () {
                if (item['key'] == 'absensi') {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (_) => const AbsensiKelasIbuHamilScreen()));
                  return;
                }
                ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('${item['label']} belum tersedia')));
              },
            };
          }).toList(),
        ),
        const SizedBox(height: 32),

        // [MODUL: IBU] Surat rujukan
        _buildDangerAlert(),
        const SizedBox(height: 40),
      ],
    );
  }

  // ─────────────────────────────────────────────
  // [MODUL: ANAK - Tumbuh Kembang] Konten tab Tumbuh
  // ─────────────────────────────────────────────
  Widget _buildTumbuhContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [

        // Tombol cari anak — untuk petugas/bidan cari by nama/NIK/no KK
        GestureDetector(
          onTap: () => Navigator.push(
              context, MaterialPageRoute(builder: (_) => const CariAnakScreen())),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.green.shade200),
              borderRadius: BorderRadius.circular(16),
              color: Colors.green.shade50,
            ),
            child: const Row(
              children: [
                Icon(Icons.search, color: Colors.green, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Cari Data Anak',
                          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                      SizedBox(height: 4),
                      Text('Cari by nama, nama ibu, atau no. KK',
                          style: TextStyle(fontSize: 12, color: Colors.black54)),
                    ],
                  ),
                ),
                CircleAvatar(
                  radius: 14,
                  backgroundColor: Colors.green,
                  child: Icon(Icons.arrow_forward, size: 16, color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Tombol request tambah profil anak
        GestureDetector(
          onTap: () => Navigator.push(
              context, MaterialPageRoute(builder: (_) => InputProfilAnakScreen())),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.blue.shade200),
              borderRadius: BorderRadius.circular(16),
              color: Colors.blue.shade50,
            ),
            child: const Row(
              children: [
                Icon(Icons.person_add, color: Colors.blue, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Request Tambah Profil Anak',
                          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                      SizedBox(height: 4),
                      Text('Mulai pantau tumbuh kembang si kecil',
                          style: TextStyle(fontSize: 12, color: Colors.black54)),
                    ],
                  ),
                ),
                CircleAvatar(
                  radius: 14,
                  backgroundColor: Colors.blue,
                  child: Icon(Icons.add, size: 16, color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),

        const Text('Menu Cepat', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),

        // [WIDGET: DashboardTumbuhQuickMenu] — 6 menu cepat modul anak
        DashboardTumbuhQuickMenu(
          items: DashboardMenuData.tumbuhQuickMenuItems.map((item) {
            return {
              ...item,
              'onTap': () {
                switch (item['key']) {
                  case 'pertumbuhan':
                    // [MODUL: ANAK] Pilih anak → DetailPertumbuhanScreen
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const PilihAnakScreen()));
                    break;
                  case 'imunisasi':
                    // [MODUL: ANAK] Pilih anak → ImunisasiScreen
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const PilihAnakScreen(tujuan: 'imunisasi')));
                    break;
                  case 'mpasi':
                    // [MODUL: ANAK] Pilih anak → HalamanUtamaMpasiScreen
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const PilihAnakScreen(tujuan: 'mpasi')));
                    break;
                  case 'edukasi':
                    // [MODUL: ANAK] Langsung ke EdukasiScreen (tidak butuh pilih anak)
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const EdukasiScreen()));
                    break;
                  case 'bahaya':
                    // [MODUL: ANAK] Pilih anak → SkriningBahayaScreen
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const PilihAnakScreen(tujuan: 'bahaya')));
                    break;
                  case 'catatan':
                    // TODO: Catatan tumbuh kembang — belum tersedia
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Catatan belum tersedia')));
                    break;
                  default:
                    ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('${item['label']} belum tersedia')));
                }
              },
            };
          }).toList(),
        ),
        const SizedBox(height: 24),

        // [MODUL: ANAK] Banner tanda bahaya — klik langsung ke SkriningBahayaScreen
        GestureDetector(
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const PilihAnakScreen(tujuan: 'bahaya')),
          ),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
                color: const Color(0xFFFFF3E0),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.orange.shade200)),
            child: const Row(
              children: [
                Icon(Icons.warning_amber_rounded, color: Colors.orange),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Kenali Tanda Bahaya — Segera ke faskes jika ada gejala ini',
                    style: TextStyle(fontSize: 12),
                  ),
                ),
                Icon(Icons.chevron_right, color: Colors.orange),
              ],
            ),
          ),
        ),
        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildPlaceholderContent() {
    return const Center(
      child: Padding(padding: EdgeInsets.all(40), child: Text('Konten fase ini segera hadir!')),
    );
  }

  // ─────────────────────────────────────────────
  // [MODUL: IBU - Hamil] Card Pemantauan Ibu Hamil
  // ─────────────────────────────────────────────
  Widget _buildPemantauanIbuHamilCard() {
    return InkWell(
      borderRadius: BorderRadius.circular(20),
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const PemantauanIbuHamilScreen()),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFFFF7ED),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFFFD7A8)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFFFFEDD5),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(
                Icons.health_and_safety_outlined,
                color: Color(0xFFF97316),
                size: 28,
              ),
            ),
            const SizedBox(width: 14),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Pemantauan Ibu Hamil',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF172033))),
                  SizedBox(height: 5),
                  Text('Catat tanda bahaya dan keluhan minggu ini',
                      style: TextStyle(fontSize: 12, color: Color(0xFF7B8798))),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Color(0xFFF97316)),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────
  // [MODUL: IBU - Hamil] Banner surat rujukan
  // ─────────────────────────────────────────────
  Widget _buildDangerAlert() {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const RujukanListScreen()),
      ),
      child: Container(
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
                  Text('Surat Rekomendasi Rujukan',
                      style: TextStyle(
                          fontSize: 12,
                          color: Colors.blue,
                          fontWeight: FontWeight.bold)),
                  Text('Belum ada surat rekomendasi rujukan saat ini',
                      style: TextStyle(fontSize: 11, color: Colors.black54)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.blue),
          ],
        ),
      ),
    );
  }
}