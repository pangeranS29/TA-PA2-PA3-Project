import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/imunisasi/presentation/screens/imunisasi_screen.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/tumbuh_kembang_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/hamil_screen.dart';
import 'package:ta_pa2_pa3_project/features/ibu/nifas/presentation/screens/nifas_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard KIA'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _menu(context, 'Hamil', const HamilScreen()),
            _menu(context, 'Nifas', const NifasScreen()),
            _menu(context, 'Tumbuh Kembang', const TumbuhKembangScreen()),
            _menu(context, 'Imunisasi', const ImunisasiScreen()),
          ],
        ),
      ),
    );
  }

  Widget _menu(BuildContext context, String title, Widget screen) {
    return Card(
      child: ListTile(
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => screen),
          );
        },
      ),
    );
  }
}