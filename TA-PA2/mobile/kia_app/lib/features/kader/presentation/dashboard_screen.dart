import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/kader/screens/imunisasi_anak.dart';
import 'package:ta_pa2_pa3_project/features/kader/screens/profil_screen.dart';
import 'package:ta_pa2_pa3_project/features/kader/widgets/dashboard_bottom_nav.dart';
import 'package:ta_pa2_pa3_project/features/kader/widgets/dashboard_header.dart';

class DashboardKaderScreen extends StatefulWidget {
  const DashboardKaderScreen({super.key});

  @override
  State<DashboardKaderScreen> createState() => _DashboardKaderScreenState();
}

class _DashboardKaderScreenState extends State<DashboardKaderScreen> {
  int _selectedNavIndex = 0;

  final List<String> allowedRoles = ['kader'];

  bool get isAllowed {
    final role = AuthSession.role?.trim().toLowerCase();
    return allowedRoles.contains(role);
  }

  @override
  Widget build(BuildContext context) {
    if (!isAllowed) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.lock_outline, size: 72, color: Colors.red.shade300),
                const SizedBox(height: 20),
                const Text(
                  'Akses Ditolak',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Halaman ini hanya dapat diakses oleh kader.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey.shade600),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Kembali'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    Widget body;

    switch (_selectedNavIndex) {
      case 0:
        body = _buildHomeBody();
        break;
      case 1:
        body = const Center(child: Text('Data Kader'));
        break;
      case 2:
        body = const ProfilScreen();
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
          /// HEADER (BALIK LAGI)
          const DashboardHeader(),

          const SizedBox(height: 10),

          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Tugas Hari Ini',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),

                _buildTaskInfoCard(
                  title: 'Posyandu Melati',
                  subtitle: 'Pencatatan aktivitas kader',
                  time: '08:30',
                  icon: Icons.local_hospital_outlined,
                  color: Colors.teal,
                ),

                const SizedBox(height: 24),

                /// =========================
                /// PERINGATAN JADWAL (ACTION)
                /// =========================
                const Text(
                  'Peringatan Jadwal',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),

                const SizedBox(height: 10),

                _buildEscalationCard(
                  title: 'Tindak Lanjut: Randi',
                  desc: 'Ada jadwal kunjungan yang perlu dilakukan segera.',
                  level: 'Sedang',
                  icon: Icons.warning_amber_rounded,
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

                /// =========================
                /// RINGKASAN
                /// =========================
                const Text(
                  'Ringkasan Desa',
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
                      _buildSummaryItem('Anak', '45', Colors.blue),
                      _buildSummaryItem('Perlu Tindak', '3', Colors.red),
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

  /// =========================
  /// INFO CARD (NON CLICKABLE)
  /// =========================
  Widget _buildTaskInfoCard({
    required String title,
    required String subtitle,
    required String time,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(subtitle,
                    style:
                        TextStyle(fontSize: 13, color: Colors.grey.shade600)),
              ],
            ),
          ),
          Text(
            time,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  /// =========================
  /// ESCALATION CARD (CLICKABLE)
  /// =========================
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
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: statusColor.withOpacity(0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: statusColor.withOpacity(0.3),
          ),
        ),
        child: Row(
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
                    style: const TextStyle(fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.touch_app, size: 14, color: statusColor),
                      const SizedBox(width: 4),
                      Text(
                        'Tap untuk lihat detail',
                        style: TextStyle(
                          fontSize: 11,
                          color: statusColor,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, size: 14, color: statusColor),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
              fontSize: 20, fontWeight: FontWeight.bold, color: color),
        ),
        Text(label,
            style: const TextStyle(fontSize: 12, color: Colors.black54)),
      ],
    );
  }
}
