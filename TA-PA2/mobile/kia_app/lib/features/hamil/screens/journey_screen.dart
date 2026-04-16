import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/data/models/anc_model.dart';
import 'package:ta_pa2_pa3_project/data/repositories/anc_repository.dart';
import 'package:ta_pa2_pa3_project/features/hamil/screens/anc_detail_screen.dart';
// Impor Form Input Nakes agar error di Navigator hilang
import 'package:ta_pa2_pa3_project/features/nakes/screens/anc_form_t1_screen.dart';

class JourneyScreen extends StatelessWidget {
  final bool isNakes; // Parameter untuk membedakan Role

  const JourneyScreen({
    super.key, 
    this.isNakes = false, // Default: Mode Ibu
  });

  // Warna sesuai Trimester
  Color _getTriColor(int tri) {
    if (tri == 1) return Colors.blue;
    if (tri == 2) return Colors.purple;
    return Colors.teal;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.slate100,
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: FutureBuilder<List<AncPemeriksaanModel>>(
              // Memanggil data riwayat dari repositori kamu
              future: AncRepository().getHistoryPemeriksaan(1), 
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                final history = snapshot.data ?? [];

                return ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                  children: [
                    Text(
                      isNakes ? "INPUT DATA PEMERIKSAAN" : "RIWAYAT PEMERIKSAAN",
                      style: const TextStyle(
                        fontSize: 12, 
                        fontWeight: FontWeight.w800, 
                        color: AppTheme.slate400, 
                        letterSpacing: 1
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildTrimesterCard(context, 1, "Trimester I", "Minggu 1 - 12", _findData(history, "1")),
                    _buildConnector(),
                    _buildTrimesterCard(context, 2, "Trimester II", "Minggu 13 - 27", _findData(history, "2")),
                    _buildConnector(),
                    _buildTrimesterCard(context, 3, "Trimester III", "Minggu 28 - 40", _findData(history, "3")),
                    const SizedBox(height: 40),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      width: double.infinity,
      decoration: BoxDecoration(
        color: isNakes ? AppTheme.primary500 : AppTheme.slate900,
        borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
            padding: EdgeInsets.zero,
            alignment: Alignment.centerLeft,
          ),
          const SizedBox(height: 16),
          Text(isNakes ? "Petugas Medis" : "Ibu Hamil", style: const TextStyle(color: Colors.white70, fontSize: 14)),
          const Text("Ibu Riyanthi", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildTrimesterCard(BuildContext context, int tri, String title, String weeks, AncPemeriksaanModel? data) {
    final bool isCompleted = data != null;
    final Color color = _getTriColor(tri);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [AppTheme.shadowMd],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            if (isNakes) {
              // Jika Nakes, masuk ke FORM
              Navigator.push(context, MaterialPageRoute(builder: (c) => const AncFormT1Screen()));
            } else {
              // Jika Ibu, masuk ke DETAIL
              Navigator.push(context, MaterialPageRoute(builder: (c) => AncDetailScreen(trimesterTitle: title, data: data)));
            }
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    color: isCompleted ? color.withValues(alpha: 0.1) : AppTheme.slate50,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(
                    isCompleted ? Icons.check_circle : (isNakes ? Icons.add_circle_outline : Icons.lock_outline),
                    color: isCompleted ? color : AppTheme.slate400,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text(isCompleted ? "Data sudah tercatat" : (isNakes ? "Klik untuk input" : weeks), style: const TextStyle(fontSize: 12, color: AppTheme.slate400)),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right, color: AppTheme.slate200),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildConnector() {
    return Container(height: 20, width: 2, color: AppTheme.slate200, margin: const EdgeInsets.only(left: 47));
  }

  AncPemeriksaanModel? _findData(List<AncPemeriksaanModel> list, String tri) {
    try { return list.firstWhere((e) => e.trimester == tri); } catch (e) { return null; }
  }
}