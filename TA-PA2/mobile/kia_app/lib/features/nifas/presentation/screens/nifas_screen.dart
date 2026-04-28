import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';

import 'checklist_pemantauan_ibu_nifas_screen.dart';

class NifasScreen extends StatefulWidget {
  const NifasScreen({super.key});

  @override
  State<NifasScreen> createState() => _NifasScreenState();
}

class _NifasScreenState extends State<NifasScreen> {
  bool isLoading = true;
  List<int> filledDays = [];

  @override
  void initState() {
    super.initState();
    _loadFilledDays();
  }

  Future<void> _loadFilledDays() async {
    setState(() => isLoading = true);

    try {
      final token = AuthSession.token;

      if (token == null || token.isEmpty) {
        setState(() {
          filledDays = [];
          isLoading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse(
          "http://localhost:8080/modul-ibu/checklist-pemantauan-ibu-nifas/filled-days",
        ),
        headers: {
          "Authorization": "Bearer $token",
        },
      );

      final body = jsonDecode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = body["data"] as List<dynamic>? ?? [];

        setState(() {
          filledDays = data.map((e) => int.parse(e.toString())).toList();
          isLoading = false;
        });
      } else {
        setState(() => isLoading = false);
      }
    } catch (_) {
      setState(() => isLoading = false);
    }
  }

  Future<void> _openChecklist() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChecklistPemantauanIbuNifasScreen(
          filledDays: filledDays,
        ),
      ),
    );

    if (result == true) {
      _loadFilledDays();
    }
  }

  @override
  Widget build(BuildContext context) {
    final progress = filledDays.length / 42;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Menu Nifas",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),

        _summaryCard(progress),

        const SizedBox(height: 16),

        _menuCard(
          title: "Checklist Pemantauan Ibu Nifas",
          subtitle: "Isi checklist Nifas A dan B satu kali setiap hari",
          icon: Icons.checklist_rounded,
          color: Colors.blue,
          onTap: _openChecklist,
        ),

        const SizedBox(height: 18),

        const Text(
          "Riwayat Pengisian",
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),

        _filledDaysView(),
      ],
    );
  }

  Widget _summaryCard(double progress) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade700, Colors.blue.shade400],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.15),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Pemantauan Masa Nifas",
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            "Checklist diisi sekali sehari selama 42 hari masa nifas.",
            style: TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.white.withOpacity(0.25),
            color: Colors.white,
            minHeight: 8,
            borderRadius: BorderRadius.circular(20),
          ),
          const SizedBox(height: 8),
          Text(
            "${filledDays.length}/42 hari sudah diisi",
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _filledDaysView() {
    if (isLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (filledDays.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: const Text(
          "Belum ada checklist yang diisi.",
          style: TextStyle(color: Colors.black54, fontSize: 13),
        ),
      );
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: filledDays.map((day) {
        return Chip(
          avatar: Icon(Icons.check_circle, color: Colors.blue.shade700, size: 18),
          label: Text("Hari ke-$day"),
          backgroundColor: Colors.blue.shade50,
          side: BorderSide(color: Colors.blue.shade100),
        );
      }).toList(),
    );
  }

  Widget _menuCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(20),
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.12),
          child: Icon(icon, color: color),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}