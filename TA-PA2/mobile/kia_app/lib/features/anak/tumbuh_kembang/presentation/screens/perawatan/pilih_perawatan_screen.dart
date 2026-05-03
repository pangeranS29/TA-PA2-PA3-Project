// [MODUL: ANAK]
// Screen pilih kategori perawatan: Bayi, Anak Bayi, Anak.
// Refactor: header diganti AnakGradientHeader, card menu diganti AnakMenuCard.
// Logika navigasi tidak berubah.

import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/widgets/index.dart';

import 'perawatan_bayi_screen.dart';
import 'perawatan_anak_bayi_screen.dart';
import 'perawatan_anak_screen.dart';

class PilihPerawatanScreen extends StatelessWidget {
  const PilihPerawatanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header gradasi — pakai AnakGradientHeader
          AnakGradientHeader(
            title: 'Perawatan Anak',
            subtitle: 'Pilih kategori perawatan',
            onBack: () => Navigator.pop(context),
          ),

          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),

                  // Label section
                  const AnakSectionTitle('KATEGORI PERAWATAN'),

                  // Menu cards — pakai AnakMenuCard
                  AnakMenuCard(
                    title: 'Bayi',
                    subtitle: 'Panduan perawatan bayi usia 0 – 12 bulan',
                    icon: Icons.child_care,
                    iconColor: const Color(0xFF2563EB),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PerawatanBayiScreen()),
                    ),
                  ),

                  AnakMenuCard(
                    title: 'Anak Bayi',
                    subtitle: 'Panduan perawatan anak usia 1 tahun hingga 2 tahun',
                    icon: Icons.family_restroom,
                    iconColor: const Color(0xFF16A34A),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PerawatanAnakBayiScreen()),
                    ),
                  ),

                  AnakMenuCard(
                    title: 'Anak',
                    subtitle: 'Panduan perawatan anak usia 2 tahun hingga 6 tahun',
                    icon: Icons.boy,
                    iconColor: const Color(0xFFD97706),
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PerawatanAnakScreen()),
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
}