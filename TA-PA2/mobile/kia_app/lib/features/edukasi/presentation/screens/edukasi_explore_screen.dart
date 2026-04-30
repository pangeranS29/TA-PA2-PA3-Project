import 'package:flutter/material.dart';
import 'edukasi_detail_screen.dart';

class EdukasiExploreScreen extends StatefulWidget {
  const EdukasiExploreScreen({Key? key}) : super(key: key);

  @override
  State<EdukasiExploreScreen> createState() => _EdukasiExploreScreenState();
}

class _EdukasiExploreScreenState extends State<EdukasiExploreScreen> {
  String _category = 'ibu';
  String _sub = 'Kehamilan Trimester 1';

  final Color _primary = const Color(0xFF2563EB);

  final List<String> ibuSubs = [
    'Kehamilan Trimester 1',
    'Kehamilan Trimester 2',
    'Kehamilan Trimester 3',
    'Kesehatan Jiwa Ibu',
    'Persiapan Persalinan',
    'Masa Nifas',
    'Menyusui & ASI',
  ];

  final List<String> anakSubs = [
    'Bayi 0-6 Bulan',
    'Bayi 6-12 Bulan',
    'Anak 1-3 Tahun',
    'Tumbuh Kembang',
    'Gizi Anak',
  ];

  final Map<String, List<Map<String, String>>> mock = {
    'Kehamilan Trimester 1': [
      {'title': 'Pengenalan Perubahan Awal Kehamilan', 'excerpt': 'Kenali perubahan tubuh ibu pada trimester pertama.'},
      {'title': 'Nutrisi Penting di Awal Kehamilan', 'excerpt': 'Asupan gizi yang wajib dipenuhi untuk janin.'},
    ],
    'Kehamilan Trimester 2': [
      {'title': 'Aktivitas Aman untuk Ibu Hamil', 'excerpt': 'Gerakan ringan dan aktivitas yang dianjurkan.'},
      {'title': 'Tanda Bahaya Trimester Kedua', 'excerpt': 'Gejala yang harus segera dikonsultasikan.'},
    ],
    'Kehamilan Trimester 3': [
      {'title': 'Persiapan Menjelang Persalinan', 'excerpt': 'Hal yang perlu disiapkan sebelum melahirkan.'},
      {'title': 'Pemantauan Gerak Janin', 'excerpt': 'Cara sederhana memantau gerakan bayi.'},
    ],
    'Kesehatan Jiwa Ibu': [
      {'title': 'Menjaga Emosi Selama Hamil', 'excerpt': 'Pentingnya kesehatan mental selama kehamilan.'},
      {'title': 'Mengelola Kecemasan Ibu', 'excerpt': 'Tips sederhana mengurangi rasa cemas.'},
    ],
    'Persiapan Persalinan': [
      {'title': 'Tanda Persalinan Sudah Dekat', 'excerpt': 'Kenali sinyal tubuh sebelum persalinan.'},
      {'title': 'Barang yang Harus Disiapkan', 'excerpt': 'Checklist perlengkapan ibu dan bayi.'},
    ],
    'Masa Nifas': [
      {'title': 'Perawatan Ibu Setelah Melahirkan', 'excerpt': 'Panduan pemulihan selama masa nifas.'},
      {'title': 'Tanda Bahaya Masa Nifas', 'excerpt': 'Kondisi yang perlu penanganan cepat.'},
    ],
    'Menyusui & ASI': [
      {'title': 'Teknik Menyusui yang Nyaman', 'excerpt': 'Posisi dan pelekatan yang benar.'},
      {'title': 'Cara Menjaga Produksi ASI', 'excerpt': 'Tips sederhana agar ASI tetap lancar.'},
    ],
    'Bayi 0-6 Bulan': [
      {'title': 'Perawatan Bayi Baru Lahir', 'excerpt': 'Hal penting yang harus diperhatikan ibu.'},
      {'title': 'ASI Eksklusif untuk Bayi', 'excerpt': 'Manfaat dan jadwal pemberian ASI.'},
    ],
    'Bayi 6-12 Bulan': [
      {'title': 'Memulai MPASI', 'excerpt': 'Waktu tepat dan menu awal MPASI.'},
    ],
    'Anak 1-3 Tahun': [
      {'title': 'Stimulasi Bicara Anak', 'excerpt': 'Cara sederhana melatih komunikasi anak.'},
    ],
    'Tumbuh Kembang': [
      {'title': 'Pantau Berat dan Tinggi Anak', 'excerpt': 'Cara membaca pertumbuhan anak.'},
    ],
    'Gizi Anak': [
      {'title': 'Menu Seimbang untuk Anak', 'excerpt': 'Contoh makanan bergizi setiap hari.'},
    ],
  };

  @override
  Widget build(BuildContext context) {
    final List<String> currentSubs = _category == 'ibu' ? ibuSubs : anakSubs;

    if (!currentSubs.contains(_sub)) {
      _sub = currentSubs.first;
    }

    final List<Map<String, String>> content = mock[_sub] ?? [];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F8FF),
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(18, 18, 18, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildCategorySelector(),
                  const SizedBox(height: 18),
                  _buildSubCategory(currentSubs),
                  const SizedBox(height: 22),
                  Text(
                    _sub,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF172033),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Expanded(
                    child: ListView.builder(
                      itemCount: content.length,
                      itemBuilder: (context, index) {
                        final item = content[index];
                        return _contentCard(
                          title: item['title']!,
                          excerpt: item['excerpt']!,
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 55, left: 20, right: 20, bottom: 28),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF3B82F6)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
      ),
      child: Row(
        children: [
          InkWell(
            onTap: () => Navigator.pop(context),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Colors.white24,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Edukasi Kesehatan",
                  style: TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Text(
                  "Informasi kesehatan ibu dan anak",
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategorySelector() {
    return Row(
      children: [
        _segmentButton('ibu', 'Edukasi Ibu'),
        const SizedBox(width: 10),
        _segmentButton('anak', 'Edukasi Anak'),
      ],
    );
  }

  Widget _segmentButton(String key, String label) {
    final active = _category == key;

    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _category = key;
            _sub = key == 'ibu' ? ibuSubs.first : anakSubs.first;
          });
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          height: 44,
          decoration: BoxDecoration(
            color: active ? _primary : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: active ? _primary : const Color(0xFFD9E2F2)),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: active ? Colors.white : const Color(0xFF64748B),
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSubCategory(List<String> subs) {
    return SizedBox(
      height: 42,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: subs.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (context, index) {
          final item = subs[index];
          final active = _sub == item;

          return InkWell(
            onTap: () {
              setState(() {
                _sub = item;
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: active ? const Color(0xFFEFF6FF) : Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(
                  color: active ? _primary : const Color(0xFFDCE6F5),
                ),
              ),
              child: Center(
                child: Text(
                  item,
                  style: TextStyle(
                    fontSize: 12,
                    color: active ? _primary : const Color(0xFF64748B),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _contentCard({
    required String title,
    required String excerpt,
  }) {
    final heroTag = title.toLowerCase().replaceAll(' ', '-');

    return InkWell(
      borderRadius: BorderRadius.circular(22),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => EdukasiDetailScreen(
              type: 'ARTIKEL',
              ageText: _category == 'ibu' ? 'Ibu' : 'Anak',
              durationText: '5 Menit Baca',
              title: title,
              heroTag: heroTag,
              isVideo: false,
              topBgColor: const Color(0xFFEFF6FF),
              typeColor: _primary,
              typeBgColor: const Color(0xFFEFF6FF),
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.035),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(Icons.menu_book_rounded, color: Color(0xFF2563EB)),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      "ARTIKEL",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF2563EB),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 14,
                      color: Color(0xFF172033),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    excerpt,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF7B8798),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.chevron_right, color: Colors.grey),
          ],
        ),
      ),
    );
  }
}