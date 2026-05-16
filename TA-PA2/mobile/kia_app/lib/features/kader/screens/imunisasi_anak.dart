import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/kader/widgets/dashboard_bottom_nav.dart';
import 'package:ta_pa2_pa3_project/features/kader/screens/profil_screen.dart';

class AnakImunisasiDetailScreen extends StatefulWidget {
  const AnakImunisasiDetailScreen({super.key});

  @override
  State<AnakImunisasiDetailScreen> createState() =>
      _AnakImunisasiDetailScreenState();
}

class _AnakImunisasiDetailScreenState extends State<AnakImunisasiDetailScreen> {
  int _selectedNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    Widget body;

    switch (_selectedNavIndex) {
      case 0:
        body = _buildDetailBody();
        break;
      case 1:
        body = const Center(child: Text("Data Imunisasi"));
        break;
      case 2:
        body = const ProfilScreen();
        break;
      default:
        body = _buildDetailBody();
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

  /// ================= DETAIL BODY =================
  Widget _buildDetailBody() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _profileCard(),
            const SizedBox(height: 16),
            _warningCard(),
            const SizedBox(height: 16),
            _sectionTitle("Detail Imunisasi"),
            _infoCard([
              _infoRow("Vaksin", "MR (Campak Rubella)"),
              _infoRow("Status", "Terlambat"),
              _infoRow("Durasi", "3 Hari"),
            ]),
            const SizedBox(height: 16),
            _sectionTitle("Tanggal Batas"),
            _deadlineCard(),
            const SizedBox(height: 16),
            _sectionTitle("Informasi Orang Tua"),
            _infoCard([
              _infoRow("Nama Ibu", "Ibu Randi"),
              _infoRow(
                "No HP",
                "0812-3456-7890",
                onTap: () {
                  // TODO: open dialer
                },
              ),
            ]),
            const SizedBox(height: 16),
            _sectionTitle("Kunjungan"),
            _visitActionCard(),
          ],
        ),
      ),
    );
  }

  // ================= PROFILE =================
  Widget _profileCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF0EA5E9), Color(0xFF38BDF8)],
        ),
        borderRadius: BorderRadius.all(Radius.circular(20)),
      ),
      child: const Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: Colors.white,
            child: Icon(Icons.child_care, color: Colors.blue),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Randi",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Anak Posyandu Sawo",
                  style: TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ),
          Icon(Icons.warning_amber_rounded, color: Colors.white),
        ],
      ),
    );
  }

  // ================= WARNING =================
  Widget _warningCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber_rounded, color: Colors.orange),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              "Imunisasi MR (Campak Rubllea) terlambat 3 hari dari jadwal",
              style: TextStyle(color: Colors.orange.shade900),
            ),
          ),
        ],
      ),
    );
  }

  // ================= DEADLINE =================
  Widget _deadlineCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.red.shade100),
      ),
      child: const Row(
        children: [
          Icon(Icons.event_busy, color: Colors.red),
          SizedBox(width: 10),
          Text(
            "10 Mei 2026",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.red,
            ),
          ),
        ],
      ),
    );
  }

  Widget _visitActionCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// ================= HEADER =================
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.task_alt,
                  color: Colors.blue,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              const Text(
                "Aksi Kunjungan",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          const Text(
            "Pilih tindakan untuk mengelola kunjungan keluarga ini",
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey,
            ),
          ),

          const SizedBox(height: 16),

          /// ================= BUTTON 1 =================
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                _showConfirmDialog();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF22C55E),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle_outline, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    "Tandai Dikunjungi",
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 12),

          /// ================= BUTTON 2 =================
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton(
              onPressed: () {
                _showScheduleDialog();
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF0EA5E9)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.calendar_month, color: Color(0xFF0EA5E9)),
                  SizedBox(width: 8),
                  Text(
                    "Jadwalkan Kunjungan",
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0EA5E9),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showConfirmDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Row(
            children: const [
              Icon(Icons.verified, color: Colors.green),
              SizedBox(width: 10),
              Text("Konfirmasi"),
            ],
          ),
          content: const Text(
            "Apakah Anda yakin ingin menandai kunjungan ini sebagai selesai?",
            style: TextStyle(height: 1.4),
          ),
          actionsPadding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 8,
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.only(
                left: 12,
                right: 12,
                bottom: 8,
              ),
              child: Row(
                children: [
                  /// ================= CANCEL =================
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.grey),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        "Batal",
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  ),

                  const SizedBox(width: 12),

                  /// ================= CONFIRM =================
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Kunjungan berhasil ditandai"),
                            backgroundColor: Colors.green,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        elevation: 2,
                        shadowColor: Colors.greenAccent,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        "Ya, Tandai",
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  void _showScheduleDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Row(
            children: const [
              Icon(Icons.calendar_month, color: Colors.blue),
              SizedBox(width: 10),
              Text("Jadwalkan Kunjungan"),
            ],
          ),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Kunjungan akan di jadwalkan 7 hari dari hari ini.",
                style: TextStyle(height: 1.4),
              ),
              SizedBox(height: 10),
              Text(
                "Apakah Anda ingin melanjutkan?",
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          actionsPadding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 8,
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  /// ================= CANCEL =================
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.grey),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        "Batal",
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  ),

                  const SizedBox(width: 12),

                  /// ================= CONFIRM =================
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              "Kunjungan dijadwalkan 7 hari dari hari ini",
                            ),
                            backgroundColor: Colors.blue,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        "Jadwalkan",
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  // ================= HELPERS =================
  Widget _sectionTitle(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _infoCard(List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(children: children),
    );
  }

  Widget _infoRow(
    String label,
    String value, {
    VoidCallback? onTap,
  }) {
    final isClickable = onTap != null;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Row(
          children: [
            Expanded(
              child: Text(
                label,
                style: const TextStyle(color: Colors.grey),
              ),
            ),
            Row(
              children: [
                Text(
                  value,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: isClickable ? Colors.blue : Colors.black,
                  ),
                ),
                if (isClickable) ...[
                  const SizedBox(width: 6),
                  const Icon(Icons.phone, size: 16, color: Colors.blue),
                ]
              ],
            ),
          ],
        ),
      ),
    );
  }
}
