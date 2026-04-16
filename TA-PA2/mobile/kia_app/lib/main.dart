import 'package:flutter/material.dart';
// Impor Tema Global
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
// Impor Dashboard Nakes agar tidak merah lagi
import 'package:ta_pa2_pa3_project/features/dashboard/screens/nakes_dashboard.dart';
// import 'package:ta_pa2_pa3_project/features/dashboard/screens/ibu_dashboard.dart';


void main() {
  runApp(const KiaApp());
}

class KiaApp extends StatelessWidget {
  const KiaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KIA Apps',
      debugShowCheckedModeBanner: false,
      // Menggunakan tema yang sudah kamu buat di AppTheme
      theme: AppTheme.lightTheme, 
      // Mengarahkan langsung ke Dashboard Nakes untuk testing
      home: const NakesDashboard(), 
    );
  }
}