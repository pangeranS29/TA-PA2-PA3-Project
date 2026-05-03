// [MODUL: ANAK - Shared Widget]
// Label judul section — teks kecil abu-abu uppercase berulang di:
// - PemantauanMenuScreen ("LEMBAR PEMANTAUAN")
// - DashboardScreen ("MENU CEPAT")
// - Dan section-section lain di modul anak
//
// CARA PAKAI:
//   const AnakSectionTitle('LEMBAR PEMANTAUAN'),
//   const AnakSectionTitle('MENU CEPAT'),
//
// Dengan spacing bawah kustom:
//   const AnakSectionTitle('RIWAYAT', bottomSpacing: 12),

import 'package:flutter/material.dart';

class AnakSectionTitle extends StatelessWidget {
  final String title;
  final double bottomSpacing;

  const AnakSectionTitle(
    this.title, {
    Key? key,
    this.bottomSpacing = 16,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: bottomSpacing),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}