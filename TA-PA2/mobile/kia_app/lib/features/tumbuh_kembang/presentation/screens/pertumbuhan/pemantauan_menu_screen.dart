import 'package:flutter/material.dart';

class PemantauanMenuScreen extends StatefulWidget {
  final Map<String, dynamic>? anak;

  const PemantauanMenuScreen({
    Key? key,
    this.anak,
  }) : super(key: key);

  @override
  State<PemantauanMenuScreen> createState() => _PemantauanMenuScreenState();
}

class _PemantauanMenuScreenState extends State<PemantauanMenuScreen> {
  String get namaAnak => widget.anak?['nama'] ?? 'Si Kecil';
  String get usiaAnak => widget.anak?['usia_teks'] ?? 'Usia tidak diketahui';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),
                  _buildAgeInfoCard(),
                  const SizedBox(height: 32),
                  const Text(
                    "LEMBAR PEMANTAUAN",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildMonitoringList(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- 1. HEADER GRADASI ---
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF2196F3), Color(0xFF1976D2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: Row(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Pemantauan Anak",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Pantau tumbuh kembang dengan rutin",
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- 2. KARTU INFORMASI USIA ---
  Widget _buildAgeInfoCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: const Color(0xFF2196F3).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.child_care,
                color: Color(0xFF2196F3), size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  namaAnak,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0F2FE),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    "Usia: $usiaAnak",
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0284C7),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- 3. DAFTAR LEMBAR PEMANTAUAN ---
  Widget _buildMonitoringList() {
    return Column(
      children: [
        _buildMenuCard(
          title: "Skrining Tanda Bahaya",
          subtitle: "Deteksi dini tanda-tanda bahaya pada anak",
          icon: Icons.assignment_turned_in_outlined,
          iconColor: const Color(0xFF2196F3),
          onTap: () {
            // TODO: Navigasi ke Form Skrining Tanda Bahaya
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Fitur Skrining Tanda Bahaya akan segera hadir'),
              ),
            );
          },
        ),
        _buildMenuCard(
          title: "Milestone Perkembangan",
          subtitle: "Penanda kemampuan sesuai usia",
          icon: Icons.emoji_events_outlined,
          iconColor: const Color(0xFFF59E0B),
          onTap: () {
            // TODO: Navigasi ke Form Milestone Ya/Tidak
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Fitur Milestone akan segera hadir'),
              ),
            );
          },
        ),
        _buildMenuCard(
          title: "Cek Warna Tinja",
          subtitle: "Deteksi kesehatan pencernaan anak",
          icon: Icons.color_lens_outlined,
          iconColor: const Color(0xFF8B5CF6),
          onTap: () {
            // TODO: Navigasi ke Form Warna Tinja
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Fitur Cek Warna Tinja akan segera hadir'),
              ),
            );
          },
        ),
      ],
    );
  }

  // --- HELPER: KARTU MENU ---
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
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
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
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade600,
                        ),
                      ),
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
}
