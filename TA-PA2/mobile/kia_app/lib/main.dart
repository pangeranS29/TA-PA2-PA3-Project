import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/presentation/screens/dashboard_screen.dart';
import 'package:ta_pa2_pa3_project/features/auth/presentation/screens/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AuthSession.initialize();
  runApp(const SehatiApp());
}

class SehatiApp extends StatelessWidget {
  const SehatiApp({super.key});

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
      home: AuthSession.isLoggedIn ? DashboardScreen() : const LoginScreen(),
    );
  }
}