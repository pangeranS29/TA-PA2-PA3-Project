// [MODUL: ANAK - Shared Widget]
// Header gradasi biru yang dipakai berulang di screen-screen modul anak:
// - ImunisasiScreen, PemantauanMenuScreen, LembarPemantauanScreen, dll.
//
// CARA PAKAI:
//   AnakGradientHeader(
//     title: 'Imunisasi',
//     subtitle: 'Nama Anak',       // opsional — nama anak / keterangan
//     onBack: () => Navigator.pop(context),
//     actions: [IconButton(...)],  // opsional — tombol kanan header
//   )

import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';

class AnakGradientHeader extends StatelessWidget {
  /// Judul utama header (contoh: 'Imunisasi', 'Pemantauan Anak')
  final String title;

  /// Subtitle kecil di bawah judul — biasanya nama anak atau keterangan singkat
  final String? subtitle;

  /// Callback tombol back — jika null, tombol back tidak ditampilkan
  final VoidCallback? onBack;

  /// Widget tambahan di sisi kanan header (opsional)
  final List<Widget>? actions;

  /// Warna gradasi — default pakai TrimesterTheme.t1Gradient (biru)
  final List<Color>? gradientColors;

  const AnakGradientHeader({
    Key? key,
    required this.title,
    this.subtitle,
    this.onBack,
    this.actions,
    this.gradientColors,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final colors = gradientColors ?? TrimesterTheme.t1Gradient;

    return Container(
      padding: const EdgeInsets.only(top: 52, left: 20, right: 20, bottom: 28),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: colors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: Row(
        children: [
          // Tombol back
          if (onBack != null)
            GestureDetector(
              onTap: onBack,
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.chevron_left,
                  color: Colors.white,
                  size: 22,
                ),
              ),
            ),
          if (onBack != null) const SizedBox(width: 12),

          // Judul + subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                if (subtitle != null && subtitle!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    subtitle!,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ],
            ),
          ),

          // Aksi kanan (opsional)
          if (actions != null) ...actions!,
        ],
      ),
    );
  }
}