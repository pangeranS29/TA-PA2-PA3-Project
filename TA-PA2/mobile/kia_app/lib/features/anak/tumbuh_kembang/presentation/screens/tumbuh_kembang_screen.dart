import 'package:flutter/material.dart';

class TumbuhKembangScreen extends StatelessWidget {
  const TumbuhKembangScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tumbuh Kembang')),
      body: const Center(child: Text('Timbuh Kembang Screen')),
    );
  }
}