import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/data/models/anc_model.dart';

class AncDetailScreen extends StatelessWidget {
  final String trimesterTitle;
  final AncPemeriksaanModel? data;

  const AncDetailScreen({super.key, required this.trimesterTitle, this.data});

  // Warna Aksen Utama: Biru (sesuai nuansa Home Screen Ibu)
  final Color accentColor = AppTheme.primary500;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.slate100,
      body: Column(
        children: [
          _buildCustomHeader(context),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: data != null 
                  ? _buildDetailView() 
                  : _buildLockedView(),
            ),
          ),
        ],
      ),
    );
  }

  // --- HEADER: Style Home Screen (Rounded Blue) ---
  Widget _buildCustomHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 32),
      width: double.infinity,
      decoration: BoxDecoration(
        color: accentColor, // Biru Utama
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
        boxShadow: [AppTheme.shadowMd],
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
          Text(
            "Detail Pemeriksaan",
            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 14),
          ),
          Text(
            trimesterTitle,
            style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // INFO TANGGAL
        if (data?.tanggalPeriksa != null)
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 16),
            child: Row(
              children: [
                const Icon(Icons.calendar_today_outlined, size: 14, color: AppTheme.slate400),
                const SizedBox(width: 8),
                Text(
                  "Pemeriksaan: ${data!.tanggalPeriksa.toString().split(' ')[0]}",
                  style: const TextStyle(fontSize: 12, color: AppTheme.slate400, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),

        // SEKSI 1: FISIK IBU (Menggunakan Ikon Baru)
        _buildSection("Kondisi Fisik Ibu", Icons.health_and_safety_outlined, [
          _row("Berat Badan", "${data?.beratBadan ?? '-'} kg"),
          _row("Tekanan Darah", "${data?.tdSistolik ?? '-'}/${data?.tdDiastolik ?? '-'} mmHg"),
          _row("Lingkar Lengan (LiLA)", "${data?.lila ?? '-'} cm"),
        ]),
        
        const SizedBox(height: 16),

        // SEKSI 2: KONDISI JANIN
        _buildSection("Hasil Skrining Janin", Icons.child_care_outlined, [
          _row("Tinggi Fundus (TFU)", "${data?.tfu ?? '-'} cm"),
          _row("Detak Jantung (DJJ)", "${data?.djj ?? '-'} bpm"),
          _row("Kadar Hb", "${data?.hb ?? '-'} g/dL"),
          if (data?.proteinUrine != null) _row("Protein Urin", data!.proteinUrine!),
        ]),
        
        const SizedBox(height: 24),

        // SEKSI 3: CATATAN
        const Padding(
          padding: EdgeInsets.only(left: 4, bottom: 12),
          child: Text(
            "CATATAN TENAGA KESEHATAN", 
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.slate400, letterSpacing: 1),
          ),
        ),
        _buildNoteBox(),
        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildSection(String title, IconData icon, List<Widget> items) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20), // rounded2XL
        boxShadow: const [AppTheme.shadowMd],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Ikon dalam lingkaran kecil Biru
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: accentColor.withOpacity(0.1), shape: BoxShape.circle),
                child: Icon(icon, color: accentColor, size: 18),
              ),
              const SizedBox(width: 12),
              Text(
                title, 
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.slate900),
              ),
            ],
          ),
          const Divider(height: 32, color: AppTheme.slate100),
          ...items,
        ],
      ),
    );
  }

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppTheme.slate400, fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: AppTheme.slate900)),
        ],
      ),
    );
  }

  Widget _buildNoteBox() {
    final String catatan = (data?.keluhan == null || data!.keluhan!.isEmpty) 
        ? "Tidak ada catatan tambahan. Kondisi terpantau normal." 
        : data!.keluhan!;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.primary50,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: accentColor.withOpacity(0.1)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.assignment_turned_in_outlined, size: 20, color: accentColor),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              catatan,
              style: const TextStyle(fontSize: 13, color: AppTheme.primary500, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLockedView() {
    return Center(
      child: Column(
        children: [
          const SizedBox(height: 60),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.primary50,
              shape: BoxShape.circle,
              border: Border.all(color: accentColor.withOpacity(0.1)),
            ),
            child: Icon(Icons.lock_outline_rounded, size: 48, color: accentColor),
          ),
          const SizedBox(height: 24),
          const Text("Belum Ada Data", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.slate900)),
          const SizedBox(height: 12),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              "Hasil pemeriksaan untuk periode trimester ini belum diinput oleh Bidan.",
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.slate400, fontSize: 13, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }
}