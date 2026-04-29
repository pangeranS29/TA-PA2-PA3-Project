import 'package:flutter/material.dart';
import 'catatan_pelayanan_t1_screen.dart';
import 'catatan_pelayanan_t2_screen.dart';
import 'catatan_pelayanan_t3_screen.dart';

class CatatanPelayananMenuScreen extends StatelessWidget {
  const CatatanPelayananMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text("Catatan Pelayanan"),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Pilih Trimester",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            _card(
              context,
              title: "Catatan Pelayanan Trimester 1",
              subtitle: "Lihat catatan pemeriksaan trimester 1",
              icon: Icons.looks_one_outlined,
              color: Colors.blue,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const CatatanPelayananT1Screen(),
                  ),
                );
              },
            ),

            _card(
              context,
              title: "Catatan Pelayanan Trimester 2",
              subtitle: "Lihat catatan pemeriksaan trimester 2",
              icon: Icons.looks_two_outlined,
              color: Colors.indigo,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const CatatanPelayananT2Screen(),
                  ),
                );
              },
            ),

            _card(
              context,
              title: "Catatan Pelayanan Trimester 3",
              subtitle: "Lihat catatan pemeriksaan trimester 3",
              icon: Icons.looks_3_outlined,
              color: Colors.purple,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const CatatanPelayananT3Screen(),
                  ),
                );
              },
            ),

            const SizedBox(height: 20),

            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: Colors.blue),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      "Catatan pelayanan berisi hasil pemeriksaan oleh tenaga kesehatan selama masa kehamilan.",
                      style: TextStyle(fontSize: 12),
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

  Widget _card(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(18),
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.12),
          child: Icon(icon, color: color),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}