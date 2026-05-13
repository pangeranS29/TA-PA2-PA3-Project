import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/kader/widgets/dashboard_bottom_nav.dart';

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
        body = const Center(child: Text("Profil Kader"));
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
              _infoRow("Vaksin", "MR / Campak"),
              _infoRow("Status", "Terlambat"),
              _infoRow("Durasi", "3 Hari"),
            ]),
            const SizedBox(height: 16),
            _sectionTitle("Tanggal Batas"),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.red.shade100),
              ),
              child: Row(
                children: const [
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
            ),
            const SizedBox(height: 16),
            _sectionTitle("Informasi Orang Tua"),
            _infoCard([
              _infoRow("Nama Ibu", "Ibu Siti Aminah"),
              _infoRow("No HP", "0812-xxxx-xxxx"),
            ]),
            const SizedBox(height: 16),
            _sectionTitle("Aksi Pengguna"),
            _actionCard(),
          ],
        ),
      ),
    );
  }

  /// ================= PROFILE =================
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
                  "Siti Aminah",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  "Anak Posyandu Melati",
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

  /// ================= WARNING =================
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
              "Imunisasi MR/Campak terlambat 3 hari dari jadwal",
              style: TextStyle(color: Colors.orange.shade900),
            ),
          ),
        ],
      ),
    );
  }

  /// ================= ACTION CARD =================
  Widget _actionCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// Saran sistem
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.blue.shade100),
            ),
            child: const Row(
              children: [
                Icon(Icons.lightbulb_outline, color: Colors.blue),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    "Saran sistem: Kunjungi keluarga ini untuk tindak lanjut imunisasi yang tertunda.",
                    style: TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          _visitButton(),

          const SizedBox(height: 12),

          /// Kontak ibu
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.green.shade100),
            ),
            child: Row(
              children: [
                const Icon(Icons.phone, color: Colors.green),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    "Kontak Ibu: 0812-xxxx-xxxx",
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.call, color: Colors.green),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// ================= VISIT BUTTON (FIXED) =================
  Widget _visitButton() {
    return Container(
      width: double.infinity,
      height: 52,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0EA5E9), Color(0xFF38BDF8)],
        ),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.25),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: () {},
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.directions_walk, color: Colors.white),
              SizedBox(width: 10),
              Text(
                "Kunjungi Keluarga",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// ================= HELPERS =================
  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
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

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(
              child: Text(label, style: const TextStyle(color: Colors.grey))),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
