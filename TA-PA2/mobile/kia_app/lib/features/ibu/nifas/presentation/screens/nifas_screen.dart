// lib/features/ibu/nifas/presentation/screens/nifas_screen.dart
// ============================================================
// [MODUL: IBU - Nifas] Halaman utama modul nifas.
// Fix: warna disesuaikan ke TrimesterTheme (biru), bukan teal.
// Fix: return Scaffold agar tidak ada error No Material widget.
// Fix: endpoint menggunakan ApiConstants.checklistNifasFilledDays.
// ============================================================

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/constants/api_constants.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/ibu/nifas/presentation/screens/checklist_pemantauan_ibu_nifas_screen.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_colors.dart';

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
        setState(() { filledDays = []; isLoading = false; });
        return;
      }

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.checklistNifasFilledDays}'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final body = jsonDecode(response.body);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = body['data'] as List<dynamic>? ?? [];
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
        builder: (_) => ChecklistPemantauanIbuNifasScreen(filledDays: filledDays),
      ),
    );
    if (result == true) _loadFilledDays();
  }

  @override
  Widget build(BuildContext context) {
    final progress = filledDays.length / 42;

    return Scaffold(
      backgroundColor: TrimesterTheme.background,
      appBar: AppBar(
        title: const Text(
          'Menu Nifas',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _summaryCard(progress),
            const SizedBox(height: 16),
            _menuCard(
              title: 'Checklist Pemantauan Ibu Nifas',
              subtitle: 'Isi checklist Nifas A dan B satu kali setiap hari',
              icon: Icons.checklist_rounded,
              onTap: _openChecklist,
            ),
            const SizedBox(height: 18),
            const Text(
              'Riwayat Pengisian',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _filledDaysView(),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

Widget _summaryCard(double progress) {
  return Container(
    width: double.infinity,

    padding: const EdgeInsets.all(22),

    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [
          AppColors.primary,
          AppColors.primary.withOpacity(0.82),
        ],

        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),

      borderRadius:
          BorderRadius.circular(28),

      boxShadow: [
        BoxShadow(
          color: AppColors.primary
              .withOpacity(0.22),

          blurRadius: 18,
          offset: const Offset(0, 8),
        ),
      ],
    ),

    child: Column(
      crossAxisAlignment:
          CrossAxisAlignment.start,

      children: [
        Row(
          children: [
            Container(
              width: 58,
              height: 58,

              decoration: BoxDecoration(
                color: Colors.white
                    .withOpacity(0.15),

                borderRadius:
                    BorderRadius.circular(
                  18,
                ),
              ),

              child: const Icon(
                Icons.health_and_safety,
                color: Colors.white,
                size: 30,
              ),
            ),

            const SizedBox(width: 14),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,

                children: [
                  const Text(
                    'Pemantauan Masa Nifas',

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 4),

                  Text(
                    '${filledDays.length}/42 hari telah diisi',

                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 24),

        ClipRRect(
          borderRadius:
              BorderRadius.circular(30),

          child: LinearProgressIndicator(
            value: progress,

            minHeight: 10,

            backgroundColor:
                Colors.white.withOpacity(
              0.18,
            ),

            valueColor:
                const AlwaysStoppedAnimation(
              Colors.white,
            ),
          ),
        ),

        const SizedBox(height: 12),

        Text(
          '${(progress * 100).toInt()}% selesai',

          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
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

      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius:
            BorderRadius.circular(22),

        boxShadow: [
          BoxShadow(
            color: Colors.black
                .withOpacity(0.03),

            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),

      child: const Text(
        'Belum ada checklist yang diisi.',

        style: TextStyle(
          color: Colors.black54,
          fontSize: 13,
        ),
      ),
    );
  }

  return Wrap(
    spacing: 10,
    runSpacing: 10,

    children: filledDays.map(
      (day) {
        return Container(
          padding:
              const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 10,
          ),

          decoration: BoxDecoration(
            color: AppColors.primary
                .withOpacity(0.08),

            borderRadius:
                BorderRadius.circular(16),

            border: Border.all(
              color: AppColors.primary
                  .withOpacity(0.12),
            ),
          ),

          child: Row(
            mainAxisSize:
                MainAxisSize.min,

            children: [
              const Icon(
                Icons.check_circle,
                color: AppColors.primary,
                size: 18,
              ),

              const SizedBox(width: 8),

              Text(
                'Hari ke-$day',

                style: const TextStyle(
                  fontWeight:
                      FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        );
      },
    ).toList(),
  );
}

Widget _menuCard({
  required String title,
  required String subtitle,
  required IconData icon,
  required VoidCallback onTap,
}) {
  return Material(
    color: const Color(0xFFF5F9FF),

    borderRadius:
        BorderRadius.circular(28),

    child: InkWell(
      borderRadius:
          BorderRadius.circular(28),

      onTap: onTap,

      child: Container(
        padding: const EdgeInsets.all(20),

        decoration: BoxDecoration(
          color: const Color(0xFFF5F9FF),
          borderRadius:
              BorderRadius.circular(28),

          border: Border.all(
            color: AppColors.primary
                .withOpacity(0.08),
          ),

          boxShadow: [
            BoxShadow(
              color: AppColors.primary
                .withOpacity(0.10),

              blurRadius: 18,
              spreadRadius: 1,
              offset: const Offset(0, 5),
              
            ),
          ],
        ),

        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,

              decoration: BoxDecoration(
                color: AppColors.primary
                    .withOpacity(0.10),

                borderRadius:
                    BorderRadius.circular(
                  18,
                ),
              ),

              child: Icon(
                icon,
                color: AppColors.primary,
                size: 30,
              ),
            ),

            const SizedBox(width: 18),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,

                children: [
                  Text(
                    title,

                    style: const TextStyle(
                      fontWeight:
                          FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),

                  const SizedBox(height: 6),

                  Text(
                    subtitle,

                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.black54,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),

            Container(
              width: 38,
              height: 38,

              decoration: BoxDecoration(
                color: AppColors.primary
                    .withOpacity(0.16),

                shape: BoxShape.circle,
              ),

              child: const Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
}