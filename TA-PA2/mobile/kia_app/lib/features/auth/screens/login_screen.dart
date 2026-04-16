import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/screens/ibu_dashboard.dart';
import 'package:ta_pa2_pa3_project/features/dashboard/screens/nakes_dashboard.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  void _handleLogin() async {
    setState(() => _isLoading = true);

    // --- SIMULASI LOGIKA BACKEND ---
    // Nantinya di sini kamu memanggil AuthRepository
    await Future.delayed(const Duration(seconds: 2)); 

    String email = _emailController.text;

    // Contoh logika sederhana: 
    // Jika email mengandung 'nakes', masuk ke dashboard nakes
    if (email.contains("nakes")) {
      _navigateToDashboard("nakes");
    } else {
      _navigateToDashboard("ibu");
    }
  }

  void _navigateToDashboard(String role) {
    Widget destination = (role == "nakes") ? const NakesDashboard() : const IbuDashboard();
    
    // pushReplacement digunakan agar user tidak bisa kembali ke Login setelah masuk
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => destination),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.white,
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Selamat Datang di SEHATI", 
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.slate900)),
            const Text("Silakan masuk untuk melanjutkan", 
              style: TextStyle(color: AppTheme.slate400)),
            const SizedBox(height: 32),
            
            // Input Email
            const Text("Email / NIK", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            const SizedBox(height: 8),
            TextField(controller: _emailController, decoration: const InputDecoration(hintText: "Masukkan email anda")),
            
            const SizedBox(height: 16),
            
            // Input Password
            const Text("Password", style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            const SizedBox(height: 8),
            TextField(controller: _passwordController, obscureText: true, decoration: const InputDecoration(hintText: "********")),
            
            const SizedBox(height: 32),
            
            // Tombol Login
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _handleLogin,
                child: _isLoading 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text("Masuk"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}