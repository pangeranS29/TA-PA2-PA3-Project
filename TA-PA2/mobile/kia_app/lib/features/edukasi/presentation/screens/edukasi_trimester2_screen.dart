import 'package:flutter/material.dart';
import 'edukasi_detail_screen.dart';
import '../../../../core/themes/app_theme.dart';

class _MockEdukasi {
  final String id;
  final String title;
  final String excerpt;
  const _MockEdukasi({required this.id, required this.title, required this.excerpt});
}

const List<_MockEdukasi> _mockList = [
  _MockEdukasi(id: '1', title: 'Persiapan Nutrisi pada Trimester II', excerpt: 'Panduan nutrisi dan suplementasi yang direkomendasikan.'),
  _MockEdukasi(id: '2', title: 'Olahraga Aman Saat Hamil', excerpt: 'Jenis olahraga ringan yang aman untuk trimester kedua.'),
  _MockEdukasi(id: '3', title: 'Tanda-Tanda Bahaya yang Perlu Diwaspadai', excerpt: 'Kapan harus segera berkonsultasi ke fasilitas kesehatan.'),
];

class EdukasiTrimester2Screen extends StatelessWidget {
  const EdukasiTrimester2Screen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Color primary = TrimesterTheme.getThemeColor(2);
    final List<Color> gradient = TrimesterTheme.getGradient(2);

    return Scaffold(
      backgroundColor: TrimesterTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text('Konten Edukasi', style: TextStyle(color: Color(0xFF1E293B), fontWeight: FontWeight.w700)),
        iconTheme: const IconThemeData(color: Color(0xFF1E293B)),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, thickness: 1),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Trimester I placeholder
              _buildTrimesterSection(
                label: 'Trimester I',
                trimester: 1,
                child: _buildPlaceholder('Konten Trimester I akan hadir di kemudian hari.'),
              ),
              const SizedBox(height: 18),

              // Trimester II content
              _buildTrimesterSection(
                label: 'Trimester II',
                trimester: 2,
                child: Column(
                  children: [
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(colors: gradient, begin: Alignment.topLeft, end: Alignment.bottomRight),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.auto_stories, size: 36, color: Colors.white),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text('Edukasi Trimester II', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
                                SizedBox(height: 6),
                                Text('Informasi penting dan rekomendasi (minggu ke-13 sampai ke-27).', style: TextStyle(color: Colors.white70, fontSize: 13)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    Container(
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.all(12),
                      child: ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _mockList.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, idx) {
                          final item = _mockList[idx];
                          return _EdukasiCard(
                            title: item.title,
                            excerpt: item.excerpt,
                            primaryColor: primary,
                            onTap: () {
                              final String type = 'ARTIKEL';
                              final String ageText = 'Ibu Hamil';
                              final String durationText = '5 Menit Baca';
                              final bool isVideo = false;
                              final String heroTag = 'edukasi-${type.toLowerCase()}-${item.title.toLowerCase().replaceAll(' ', '-')}';
                              final Color topBgColor = isVideo ? const Color(0xFFE6EFFF) : const Color(0xFFFFF0D4);
                              final Color typeColor = isVideo ? const Color(0xFF3B82F6) : const Color(0xFFFF5C00);
                              final Color typeBgColor = isVideo ? const Color(0xFFE6EFFF) : const Color(0xFFFFF0D4);

                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => EdukasiDetailScreen(
                                    type: type,
                                    ageText: ageText,
                                    durationText: durationText,
                                    title: item.title,
                                    heroTag: heroTag,
                                    isVideo: isVideo,
                                    topBgColor: topBgColor,
                                    typeColor: typeColor,
                                    typeBgColor: typeBgColor,
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Trimester III placeholder
              _buildTrimesterSection(
                label: 'Trimester III',
                trimester: 3,
                child: _buildPlaceholder('Konten Trimester III akan hadir di kemudian hari.'),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTrimesterSection({required String label, required int trimester, required Widget child}) {
    final Color accent = TrimesterTheme.getThemeColor(trimester);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(width: 8, height: 8, decoration: BoxDecoration(color: accent, borderRadius: BorderRadius.circular(4))),
            const SizedBox(width: 8),
            Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1E293B))),
          ],
        ),
        const SizedBox(height: 10),
        child,
      ],
    );
  }

  Widget _buildPlaceholder(String text) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Text(text, style: TextStyle(color: Colors.grey.shade600)),
    );
  }
}

class _EdukasiCard extends StatelessWidget {
  final String title;
  final String excerpt;
  final VoidCallback onTap;
  final Color primaryColor;

  const _EdukasiCard({
    Key? key,
    required this.title,
    required this.excerpt,
    required this.onTap,
    required this.primaryColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      elevation: 0,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // Icon / Thumbnail
              Container(
                width: 62,
                height: 62,
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.menu_book, color: primaryColor, size: 34),
              ),
              const SizedBox(width: 12),

              // Texts
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 6),
                    Text(excerpt, style: const TextStyle(fontSize: 13, color: Colors.grey)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: primaryColor.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text('Trimester II', style: TextStyle(color: primaryColor, fontSize: 12, fontWeight: FontWeight.w600)),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.grey),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}