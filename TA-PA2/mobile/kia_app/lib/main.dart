import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/dashboard_screen.dart';

void main() {
  runApp(SehatiApp());
}

class SehatiApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KIA Apps',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        // Pastikan font atau tema konsisten dengan Style Guide
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: DashboardScreen(), 
    );
  }
}