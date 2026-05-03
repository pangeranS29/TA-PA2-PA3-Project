import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/pemeriksaan_kehamilan_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/skrining_preeklampsia_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/pemeriksaan_dokter_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/widgets/index.dart';

class TrimesterMenuScreen extends StatelessWidget {
  final int trimester;

  const TrimesterMenuScreen({
    super.key,
    required this.trimester,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FC),
      appBar: IbuGradientHeader(
        title: 'Trimester $trimester',
        subtitle: _subtitleForTrimester(),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          IbuMenuCard(
            icon: Icons.pregnant_woman_outlined,
            title: 'Pemeriksaan Kehamilan',
            subtitle: 'Lihat hasil pemeriksaan ANC trimester $trimester',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PemeriksaanKehamilanScreen(trimester: trimester),
              ),
            ),
          ),

          if (trimester == 1)
            IbuMenuCard(
              icon: Icons.medical_information_outlined,
              title: 'Pemeriksaan Dokter Trimester I',
              subtitle: 'Lihat hasil pemeriksaan dokter trimester I',
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PemeriksaanDokterScreen(trimester: 1),
                ),
              ),
            ),

          if (trimester == 2)
            IbuMenuCard(
              icon: Icons.health_and_safety_outlined,
              title: 'Skrining Preeklampsia',
              subtitle: 'Lihat hasil skrining preeklampsia',
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const SkriningPreeklampsiaScreen(),
                ),
              ),
            ),

          if (trimester == 3)
            IbuMenuCard(
              icon: Icons.medical_services_outlined,
              title: 'Pemeriksaan Dokter Trimester III',
              subtitle: 'Lihat hasil pemeriksaan dokter trimester III',
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PemeriksaanDokterScreen(trimester: 3),
                ),
              ),
            ),
        ],
      ),
    );
  }

  String _subtitleForTrimester() {
    if (trimester == 1) return 'Minggu 1 – 12';
    if (trimester == 2) return 'Minggu 13 – 27';
    return 'Minggu 28 – 40';
  }
}