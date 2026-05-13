import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/kader/screens/imunisasi_anak.dart';
import 'package:ta_pa2_pa3_project/features/kader/widgets/dashboard_header.dart';
import 'package:ta_pa2_pa3_project/features/kader/widgets/dashboard_bottom_nav.dart';

class DashboardKaderScreen extends StatefulWidget {
  const DashboardKaderScreen({super.key});

  @override
  State<DashboardKaderScreen> createState() => _DashboardKaderScreenState();
}

class _DashboardKaderScreenState extends State<DashboardKaderScreen> {
  int _selectedNavIndex = 0;

  /// Allowed role untuk halaman ini
  final List<String> allowedRoles = [
    'kader',
  ];

  bool get isAllowed {
    final role = AuthSession.role?.trim().toLowerCase();

    return allowedRoles.contains(role);
  }

  @override
  Widget build(BuildContext context) {
    /// BLOCK AKSES
    if (!isAllowed) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.lock_outline,
                  size: 72,
                  color: Colors.red.shade300,
                ),
                const SizedBox(height: 20),
                const Text(
                  'Akses Ditolak',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Halaman ini hanya dapat diakses oleh kader.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(
                      context,
                    );
                  },
                  child: const Text(
                    'Kembali',
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    Widget body;

// Di dalam build method, pastikan switch sesuai dengan 3 item
    switch (_selectedNavIndex) {
      case 0:
        body = _buildHomeBody(); // Indeks 0: Beranda
        break;
      case 1:
        body =
            const Center(child: Text('Data Imunisasi')); // Indeks 1: Imunisasi
        break;
      case 2:
        body = const Center(child: Text('Profil Kader')); // Indeks 2: Profil
        break;
      default:
        body = _buildHomeBody();
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: body,
      bottomNavigationBar: DashboardBottomNav(
        currentIndex: _selectedNavIndex,
        onTap: (index) {
          setState(() {
            _selectedNavIndex = index;
          });
        },
      ),
    );
  }

  Widget _buildHomeBody() {
    return SingleChildScrollView(
      child: Column(
        children: [
          const DashboardHeader(),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                /// 1. DAFTAR TUGAS HARI INI
                const Text(
                  'Tugas Hari Ini',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                _buildTaskCard(
                  title: 'Posyandu Melati',
                  subtitle: 'Pencatatan imunisasi rutin',
                  time: '08:30',
                  icon: Icons.local_hospital_outlined,
                  color: Colors.teal,
                ),

                const SizedBox(height: 24),

                /// 2. NOTIFIKASI ESKALASI (Fokus: Imunisasi Terlewat)
                const Text(
                  'Peringatan Jadwal',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                _buildEscalationCard(
                  title: 'Imunisasi Terlewat: Siti Aminah',
                  desc: 'Jadwal MR/Campak terlewat selama 3 hari.',
                  level: 'Sedang',
                  icon: Icons.history_toggle_off_rounded,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AnakImunisasiDetailScreen(),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 24),

                /// 3. RINGKASAN DESA (Huta Bulu Mejan)
                const Text(
                  'Ringkasan Desa (Huta Bulu Mejan)',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildSummaryItem('Ibu Hamil', '12', Colors.pink),
                      _buildSummaryItem('Anak Terdaftar', '45', Colors.blue),
                      _buildSummaryItem('Imunisasi Telat', '3', Colors.red),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// WIDGET HELPER UNTUK TUGAS
  Widget _buildTaskCard(
      {required String title,
      required String subtitle,
      required String time,
      required IconData icon,
      required Color color}) {
    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: CircleAvatar(
            backgroundColor: color.withOpacity(0.1),
            child: Icon(icon, color: color)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle),
        trailing: Text(time,
            style: TextStyle(
                color: Colors.grey.shade600, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildEscalationCard({
    required String title,
    required String desc,
    required String level,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    Color statusColor = level == 'Penting' ? Colors.red : Colors.orange;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: statusColor.withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: statusColor.withOpacity(0.2)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: statusColor, size: 28),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: statusColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    desc,
                    style: TextStyle(
                      color: Colors.grey.shade800,
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// WIDGET HELPER UNTUK RINGKASAN
  Widget _buildSummaryItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(value,
            style: TextStyle(
                fontSize: 20, fontWeight: FontWeight.bold, color: color)),
        Text(label,
            style: const TextStyle(fontSize: 12, color: Colors.black54)),
      ],
    );
  }
}
