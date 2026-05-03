import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/catatan_pelayanan_t1_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/catatan_pelayanan_t2_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/catatan_pelayanan_t3_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/widgets/index.dart';

class CatatanPelayananMenuScreen extends StatelessWidget {
  const CatatanPelayananMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: IbuGradientHeader(
        title: 'Catatan Pelayanan',
        subtitle: 'Riwayat pemeriksaan kehamilan',
      ),
      body: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const IbuSectionTitle(
              title: 'Pilih Trimester',
              subtitle: 'Lihat catatan pelayanan berdasarkan trimester',
            ),
            IbuMenuCard(
              icon: Icons.looks_one_outlined,
              title: 'Catatan Pelayanan Trimester 1',
              subtitle: 'Lihat catatan pemeriksaan trimester 1',
              iconColor: const Color(0xFF2F80ED),
              iconBgColor: const Color(0xFFEAF4FF),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => CatatanPelayananT1Screen()),
              ),
            ),
            IbuMenuCard(
              icon: Icons.looks_two_outlined,
              title: 'Catatan Pelayanan Trimester 2',
              subtitle: 'Lihat catatan pemeriksaan trimester 2',
              iconColor: const Color(0xFF3949AB),
              iconBgColor: const Color(0xFFE8EAF6),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => CatatanPelayananT2Screen()),
              ),
            ),
            IbuMenuCard(
              icon: Icons.looks_3_outlined,
              title: 'Catatan Pelayanan Trimester 3',
              subtitle: 'Lihat catatan pemeriksaan trimester 3',
              iconColor: const Color(0xFF7B1FA2),
              iconBgColor: const Color(0xFFF3E5F5),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => CatatanPelayananT3Screen()),
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFEAF4FF),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: Color(0xFF2F80ED)),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Catatan pelayanan berisi hasil pemeriksaan oleh tenaga kesehatan selama masa kehamilan.',
                      style: TextStyle(fontSize: 12, color: Color(0xFF4A5568)),
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
}