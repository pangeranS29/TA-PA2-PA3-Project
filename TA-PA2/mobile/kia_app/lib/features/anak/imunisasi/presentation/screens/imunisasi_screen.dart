import 'package:flutter/material.dart';

class ImunisasiScreen extends StatelessWidget {
  const ImunisasiScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Imunisasi')),
      body: const Center(child: Text('Imunisasi Screen')),
    );
  }
}