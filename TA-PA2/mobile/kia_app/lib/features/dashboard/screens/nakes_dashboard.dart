import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/hamil/screens/journey_screen.dart'; 

class NakesDashboard extends StatelessWidget {
  const NakesDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.slate100,
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              children: [
                _buildSearchField(),
                const SizedBox(height: 28),
                const Text(
                  "TINDAKAN CEPAT", 
                  style: TextStyle(
                    fontSize: 12, 
                    fontWeight: FontWeight.w800, 
                    color: AppTheme.slate400, 
                    letterSpacing: 0.5
                  )
                ),
                const SizedBox(height: 12),
                
                // --- UPDATE: Navigasi ke Journey dengan Mode Nakes ---
                _buildActionCard(
                  "Input Pemeriksaan ANC", 
                  "Skrining Trimester I-III", 
                  Icons.add_moderator, 
                  Colors.blue,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        // Sinyal 'true' dikirim agar JourneyScreen membuka FORM
                        builder: (context) => const JourneyScreen(isNakes: true), 
                      ),
                    );
                  },
                ),
                
                _buildActionCard(
                  "Daftar Ibu Hamil", 
                  "Kelola data & rekam medis", 
                  Icons.people_alt_outlined, 
                  Colors.teal,
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Fitur Daftar Ibu Hamil segera hadir")),
                    );
                  },
                ),
                
                const SizedBox(height: 28),
                const Text(
                  "PASIEN PERLU PERHATIAN", 
                  style: TextStyle(
                    fontSize: 12, 
                    fontWeight: FontWeight.w800, 
                    color: AppTheme.slate400, 
                    letterSpacing: 0.5
                  )
                ),
                const SizedBox(height: 12),
                _buildAlertItem("Ibu Sarah", "Belum Skrining Trimester 2"),
                _buildAlertItem("Ibu Maria", "Catatan: Risiko Tinggi (HB Rendah)"),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      width: double.infinity,
      decoration: const BoxDecoration(
        color: AppTheme.primary500,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30), 
          bottomRight: Radius.circular(30)
        ),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Selamat Bekerja ✨", style: TextStyle(color: Colors.white70, fontSize: 14, fontFamily: 'Inter')),
          Text("Bidan Polaroid", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, fontFamily: 'Inter')),
          SizedBox(height: 6),
          Text("Puskesmas Balige • Sesi Aktif", style: TextStyle(color: Colors.white60, fontSize: 12, fontFamily: 'Inter')),
        ],
      ),
    );
  }

  Widget _buildSearchField() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(AppTheme.radiusXL),
        boxShadow: const [AppTheme.shadowSm]
      ),
      child: const TextField(
        decoration: InputDecoration(
          hintText: "Cari Nama Pasien / NIK...",
          hintStyle: TextStyle(color: AppTheme.slate400),
          prefixIcon: Icon(Icons.search, size: 20, color: AppTheme.slate400),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    );
  }

  Widget _buildActionCard(String title, String sub, IconData icon, Color color, {VoidCallback? onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(20), 
        boxShadow: const [AppTheme.shadowMd]
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1), 
            borderRadius: BorderRadius.circular(12)
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppTheme.slate900)),
        subtitle: Text(sub, style: const TextStyle(fontSize: 11, color: AppTheme.slate400)),
        trailing: const Icon(Icons.chevron_right, size: 18, color: AppTheme.slate200),
        onTap: onTap,
      ),
    );
  }

  Widget _buildAlertItem(String name, String status) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(AppTheme.radiusXL),
        border: Border.all(color: AppTheme.slate200)
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(color: AppTheme.danger50, shape: BoxShape.circle),
            child: const Icon(Icons.notification_important_outlined, color: AppTheme.danger500, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start, 
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppTheme.slate900)),
                const SizedBox(height: 2),
                Text(status, style: const TextStyle(color: AppTheme.danger500, fontSize: 11, fontWeight: FontWeight.w500)),
              ]
            ),
          ),
          const Icon(Icons.arrow_forward_ios, size: 12, color: AppTheme.slate200),
        ],
      ),
    );
  }
}