import 'package:flutter/material.dart';

import 'edukasi_trimester_kategori_screen.dart';

class EdukasiTrimesterScreen
    extends StatelessWidget {
  const EdukasiTrimesterScreen({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF4F7FB),

      appBar: AppBar(
        backgroundColor:
            const Color(0xFF1F5EA8),

        title: const Text(
          'Edukasi Trimester',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),

        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
      ),

      body: Padding(
        padding: const EdgeInsets.all(20),

        child: Column(
          children: [
            _buildTrimesterCard(
              context,
              title:
                  'Trimester 1',
              subtitle:
                  'Pelajari edukasi awal kehamilan',
              trimester: 'TM1',
              icon:
                  Icons.looks_one_rounded,
            ),

            const SizedBox(height: 20),

            _buildTrimesterCard(
              context,
              title:
                  'Trimester 2',
              subtitle:
                  'Pelajari perkembangan trimester kedua',
              trimester: 'TM2',
              icon:
                  Icons.looks_two_rounded,
            ),

            const SizedBox(height: 20),

            _buildTrimesterCard(
              context,
              title:
                  'Trimester 3',
              subtitle:
                  'Persiapan persalinan dan akhir kehamilan',
              trimester: 'TM3',
              icon:
                  Icons.looks_3_rounded,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrimesterCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String trimester,
    required IconData icon,
  }) {
    return InkWell(
      borderRadius:
          BorderRadius.circular(24),

      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) =>
                EdukasiTrimesterKategoriScreen(
              trimester: trimester,
              title: title,
            ),
          ),
        );
      },

      child: Container(
        width: double.infinity,

        padding: const EdgeInsets.all(24),

        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius:
              BorderRadius.circular(24),

          boxShadow: [
            BoxShadow(
              color:
                  Colors.black.withOpacity(
                0.05,
              ),

              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),

        child: Row(
          children: [
            Container(
              width: 70,
              height: 70,

              decoration: BoxDecoration(
                color:
                    const Color(0xFF1F5EA8)
                        .withOpacity(0.1),

                shape: BoxShape.circle,
              ),

              child: Icon(
                icon,
                size: 36,
                color:
                    const Color(0xFF1F5EA8),
              ),
            ),

            const SizedBox(width: 20),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment
                        .start,

                children: [
                  Text(
                    title,
                    style:
                        const TextStyle(
                      fontSize: 22,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    subtitle,
                    style:
                        const TextStyle(
                      fontSize: 15,
                      color:
                          Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}