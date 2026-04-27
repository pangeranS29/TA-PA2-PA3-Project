import 'package:flutter/material.dart';
import '../../../../core/themes/app_theme.dart';
import '../widgets/edukasi_card.dart';
import 'edukasi_detail_screen.dart';

class EdukasiExploreScreen extends StatefulWidget {
  const EdukasiExploreScreen({Key? key}) : super(key: key);

  @override
  State<EdukasiExploreScreen> createState() => _EdukasiExploreScreenState();
}

class _EdukasiExploreScreenState extends State<EdukasiExploreScreen> {
  String _category = 'ibu'; // 'ibu' or 'anak'
  String _sub = 'Kehamilan Trimester 1';
  final Color _primary = TrimesterTheme.t1Primary;

  final List<String> ibuSubs = [
    'Kehamilan Trimester 1',
    'Kehamilan Trimester 2',
    'Kehamilan Trimester 3',
    'Kesehatan Jiwa Ibu Hamil',
    'Inisiasi Menyusu Dini',
    'Setelah Melahirkan',
    'Menyusui dan ASI',
  ];

  // Mock data keyed by subcategory (simple)
  final Map<String, List<Map<String,String>>> mock = {
    'Kehamilan Trimester 1': [
      {'title':'Pengenalan Trimester 1','excerpt':'Apa yang perlu diketahui di trimester pertama.'},
      {'title':'Nutrisi Awal Kehamilan','excerpt':'Nutrisi dan suplemen dasar.'},
    ],
    'Kehamilan Trimester 2': [
      {'title':'Nutrisi pada Trimester 2','excerpt':'Asupan zat besi, protein, dan sayur.'},
      {'title':'Aktivitas Fisik Aman','excerpt':'Latihan ringan yang dianjurkan.'},
      {'title':'Tanda Bahaya Trimester 2','excerpt':'Tanda bahaya yang mungkin muncul di trimester kedua.'},
    ],
    'Kehamilan Trimester 3': [
      {'title':'Persiapan Persalinan','excerpt':'Tanda-tanda dan persiapan.'},
      {'title':'Tanda Bahaya Trimester 3','excerpt':'Gejala yang mengindikasikan risiko pada trimester akhir.'},
    ],
    'Kesehatan Jiwa Ibu Hamil': [
      {'title':'Mengenali Gangguan Mood','excerpt':'Cara deteksi dini dan rujukan.'},
    ],
    'Inisiasi Menyusu Dini': [
      {'title':'IMD: Manfaat dan Teknik','excerpt':'Langkah-langkah praktis IMD.'},
    ],
    'Setelah Melahirkan': [
      {'title':'Pemulihan Pasca Persalinan','excerpt':'Perawatan diri dan bayi.'},
      {'title':'Tanda Bahaya Persalinan / Nifas','excerpt':'Tanda bahaya persalinan dan nifas yang memerlukan tindakan cepat.'},
    ],
    'Menyusui dan ASI': [
      {'title':'Teknik Menyusui Efektif','excerpt':'Posisi dan frekuensi menyusui.'},
    ],
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TrimesterTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text('Edukasi', style: TextStyle(color: Color(0xFF1E293B), fontWeight: FontWeight.w700)),
        iconTheme: const IconThemeData(color: Color(0xFF1E293B)),
        bottom: const PreferredSize(preferredSize: Size.fromHeight(1), child: Divider(height: 1, thickness: 1)),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Segmented category selector (Ibu / Anak)
            Row(
              children: [
                _categoryButton('ibu', 'Ibu'),
                const SizedBox(width: 12),
                _categoryButton('anak', 'Anak'),
              ],
            ),
            const SizedBox(height: 14),

            // If Ibu show subcategory scroller & list
            if (_category == 'ibu') ...[
              SizedBox(
                height: 44,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: ibuSubs.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 10),
                  itemBuilder: (context, idx) {
                    final s = ibuSubs[idx];
                    final selected = s == _sub;
                    return GestureDetector(
                      onTap: () => setState(() => _sub = s),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: selected ? Colors.white : Colors.white,
                          borderRadius: BorderRadius.circular(22),
                          border: Border.all(color: selected ? _primary : Colors.grey.shade300, width: selected ? 2 : 1),
                          boxShadow: selected ? [BoxShadow(color: _primary.withOpacity(0.06), blurRadius: 8, offset: const Offset(0,2))] : null,
                        ),
                        child: Center(
                          child: Text(s, style: TextStyle(
                            fontSize: 13,
                            fontWeight: selected ? FontWeight.w700 : FontWeight.w600,
                            color: selected ? _primary : const Color(0xFF374151),
                          )),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 12),

              // List label
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Text(_sub, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),

              // Cards list (mock)
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
                  child: ListView.separated(
                    itemCount: mock[_sub]?.length ?? 0,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, idx) {
                      final item = mock[_sub]![idx];
                      return EdukasiCard(
                        title: item['title']!,
                        excerpt: item['excerpt']!,
                        tag: _sub,
                        primaryColor: _primary,
                        onTap: () {
                          final String title = item['title']!;
                          final String type = 'ARTIKEL';
                          final String ageText = 'Ibu Hamil';
                          final String durationText = '5 Menit Baca';
                          final bool isVideo = false;
                          final String heroTag = 'edukasi-article-${title.toLowerCase().replaceAll(' ', '-') }';
                          final Color topBgColor = _primary.withOpacity(0.12);
                          final Color typeColor = _primary;
                          final Color typeBgColor = _primary.withOpacity(0.12);

                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => EdukasiDetailScreen(
                                type: type,
                                ageText: ageText,
                                durationText: durationText,
                                title: title,
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
              ),
            ] else ...[
              // Anak: placeholder UI only (no data)
              const SizedBox(height: 6),
              Expanded(
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.child_care, size: 56, color: _primary.withOpacity(0.9)),
                      const SizedBox(height: 16),
                      Text('Konten Edukasi untuk Anak', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      Text('UI placeholder — belum ada konten. Tim backend akan menambahkan data nanti.', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade600)),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _categoryButton(String key, String label) {
    final bool active = _category == key;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _category = key),
        child: Container(
          height: 40,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: active ? _primary : Colors.grey.shade300, width: active ? 2 : 1),
          ),
          child: Center(child: Text(label, style: TextStyle(color: active ? _primary : const Color(0xFF6B7280), fontWeight: active ? FontWeight.w700 : FontWeight.w600))),
        ),
      ),
    );
  }
}