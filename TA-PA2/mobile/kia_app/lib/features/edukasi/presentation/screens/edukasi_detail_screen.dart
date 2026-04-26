import 'package:flutter/material.dart';

class EdukasiDetailScreen extends StatefulWidget {
  final String type;
  final String ageText;
  final String durationText;
  final String title;
  final String heroTag;
  final bool isVideo;
  final Color topBgColor;
  final Color typeColor;
  final Color typeBgColor;

  const EdukasiDetailScreen({
    Key? key,
    required this.type,
    required this.ageText,
    required this.durationText,
    required this.title,
    required this.heroTag,
    required this.isVideo,
    required this.topBgColor,
    required this.typeColor,
    required this.typeBgColor,
  }) : super(key: key);

  @override
  State<EdukasiDetailScreen> createState() => _EdukasiDetailScreenState();
}

class _EdukasiDetailScreenState extends State<EdukasiDetailScreen> {
  int _currentStep = 0;

  _EdukasiArticle _buildArticleByTitle(String title) {
    switch (title) {
      case 'Menjaga Kesehatan Mental Orang Tua dalam Pengasuhan Anak':
        return const _EdukasiArticle(
          ringkasan:
              'Buku KIA menekankan bahwa pengasuhan yang baik dimulai dari orang tua yang sehat fisik dan mental. Saat orang tua mampu mengelola stres, anak lebih mudah merasa aman, dekat, dan berkembang optimal.',
          tutorialLangkah: [
            'Kenali sinyal lelah: mudah marah, sulit fokus, atau sering cemas.',
            'Tarik napas dalam 3-5 kali dan ambil jeda 10 menit sebelum merespons anak.',
            'Bagi tugas pengasuhan dengan pasangan/keluarga agar beban tidak menumpuk.',
            'Sisihkan waktu harian untuk tidur cukup, makan teratur, dan aktivitas yang menenangkan.',
            'Jika gejala emosi berat menetap lebih dari 2 minggu, konsultasi ke puskesmas atau psikolog.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Langkah menjaga kesehatan mental',
              poin: [
                'Kenali tanda stres: mudah marah, sulit tidur, sering cemas, atau merasa putus asa.',
                'Bagi peran pengasuhan agar satu orang tidak menanggung semua beban.',
                'Tetapkan harapan yang realistis: anak belajar bertahap, tidak harus selalu sempurna.',
                'Tetap lakukan aktivitas yang membuat orang tua merasa senang dan berdaya.',
              ],
            ),
            _ArticleSection(
              judul: 'Kapan perlu mencari bantuan',
              poin: [
                'Sedih atau cemas berat lebih dari 2 minggu.',
                'Sulit menjalani aktivitas sehari-hari karena tekanan emosi.',
                'Muncul keinginan menyakiti diri sendiri atau orang lain.',
                'Segera konsultasi ke puskesmas, psikolog, atau tenaga kesehatan terdekat.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Orang tua yang tenang lebih mudah membangun kedekatan aman dengan anak.',
            'Meminta bantuan bukan tanda gagal, tetapi bagian dari pengasuhan sehat.',
            'Segera cari pertolongan profesional bila keluhan emosi berat menetap.',
          ],
        );
      case 'Informasi Umum Cuci Tangan Pakai Sabun':
        return const _EdukasiArticle(
          ringkasan:
              'Menurut pesan kesehatan ibu dan anak, cuci tangan pakai sabun adalah cara sederhana mencegah diare, cacingan, dan infeksi saluran napas. Kebiasaan ini perlu dicontohkan orang tua setiap hari.',
          tutorialLangkah: [
            'Basahi tangan dengan air mengalir, lalu beri sabun secukupnya.',
            'Gosok telapak dan punggung tangan secara merata.',
            'Bersihkan sela-sela jari, ujung jari, kuku, dan ibu jari selama minimal 20 detik.',
            'Bilas hingga bersih dengan air mengalir lalu keringkan dengan kain bersih/tisu.',
            'Ulangi pada 5 waktu penting: sebelum makan, sebelum menyiapkan makanan, setelah BAB/BAK, setelah ganti popok, setelah memegang benda kotor.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Langkah cuci tangan yang benar',
              poin: [
                'Basahi tangan dengan air mengalir, lalu gunakan sabun.',
                'Gosok telapak, punggung tangan, sela jari, ujung jari, kuku, dan ibu jari.',
                'Lakukan minimal 20 detik agar kuman terangkat.',
                'Bilas dengan air mengalir lalu keringkan dengan kain bersih/tisu.',
              ],
            ),
            _ArticleSection(
              judul: 'Tips membiasakan anak',
              poin: [
                'Buat lagu singkat 20 detik saat anak mencuci tangan.',
                'Sediakan sabun di tempat yang mudah dijangkau anak.',
                'Orang tua memberi contoh sebelum meminta anak melakukannya.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Cuci tangan pakai sabun adalah cara murah dan efektif mencegah infeksi.',
            'Lakukan minimal 20 detik dengan membersihkan seluruh bagian tangan.',
            'Biasakan cuci tangan pada waktu penting setiap hari.',
          ],
        );
      case 'Informasi Umum Perawatan Gigi Anak':
        return const _EdukasiArticle(
          ringkasan:
              'Perawatan gigi anak dimulai sejak gigi pertama tumbuh. Buku KIA menekankan kebersihan mulut, pembatasan gula, dan pemeriksaan gigi berkala agar anak terhindar dari gigi berlubang dan nyeri.',
          tutorialLangkah: [
            'Sikat gigi anak 2 kali sehari: sesudah sarapan dan sebelum tidur.',
            'Gunakan pasta gigi berfluor sesuai usia (butir beras untuk <3 tahun, kacang polong untuk 3-6 tahun).',
            'Dampingi anak saat menyikat gigi agar tekniknya benar dan menyeluruh.',
            'Batasi makanan/minuman manis lengket, terutama di malam hari.',
            'Jadwalkan pemeriksaan gigi rutin setiap 6 bulan di fasilitas kesehatan.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Panduan sesuai usia',
              poin: [
                'Usia <3 tahun: pasta gigi berfluor seukuran butir beras.',
                'Usia 3-6 tahun: pasta gigi berfluor seukuran kacang polong.',
                'Orang tua tetap mendampingi sikat gigi sampai anak terampil.',
                'Periksa gigi ke fasilitas kesehatan setiap 6 bulan.',
              ],
            ),
            _ArticleSection(
              judul: 'Waspadai tanda masalah gigi',
              poin: [
                'Anak mengeluh ngilu saat makan/minum.',
                'Terlihat bercak coklat/hitam pada gigi.',
                'Gusi bengkak atau mudah berdarah.',
                'Segera periksa bila keluhan tidak membaik.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Kebiasaan sikat gigi yang benar harus dimulai sejak dini.',
            'Gunakan pasta gigi berfluor sesuai usia dan tetap dampingi anak.',
            'Kontrol gigi tiap 6 bulan membantu mencegah masalah yang lebih berat.',
          ],
        );
      case 'Informasi Umum Perawatan Anak Sakit':
        return const _EdukasiArticle(
          ringkasan:
              'Saat anak sakit, perawatan rumah berfokus pada cairan, nutrisi, istirahat, dan pemantauan tanda bahaya. Buku KIA menekankan agar orang tua tidak menunda mencari pertolongan bila gejala berat muncul.',
          tutorialLangkah: [
            'Pastikan anak cukup istirahat dan tetap minum/ASI lebih sering untuk mencegah dehidrasi.',
            'Berikan makanan lunak bergizi dalam porsi kecil tetapi sering.',
            'Pantau suhu tubuh, napas, muntah, diare, dan aktivitas anak setiap beberapa jam.',
            'Berikan obat hanya sesuai anjuran tenaga kesehatan, jangan memberi antibiotik sembarangan.',
            'Segera ke fasilitas kesehatan bila muncul tanda bahaya seperti sesak, kejang, tidak mau minum, atau sangat lemas.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Perawatan dasar di rumah',
              poin: [
                'Pastikan anak cukup istirahat dan lingkungan tetap nyaman.',
                'Bersihkan hidung bila pilek, pakaikan pakaian tipis saat demam.',
                'Catat gejala dan waktu munculnya untuk memudahkan evaluasi tenaga kesehatan.',
                'Hindari memberi antibiotik tanpa resep.',
              ],
            ),
            _ArticleSection(
              judul: 'Tanda bahaya, segera ke fasilitas kesehatan',
              poin: [
                'Anak tidak mau minum, muntah terus, atau tampak sangat lemas.',
                'Napas cepat/sesak, tarikan dinding dada, atau bibir kebiruan.',
                'Kejang, penurunan kesadaran, atau demam tinggi menetap.',
                'Diare dengan mata cekung, sangat haus, atau kencing berkurang.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Utamakan cairan, nutrisi, istirahat, dan pemantauan gejala secara berkala.',
            'Jangan memberikan antibiotik tanpa resep tenaga kesehatan.',
            'Kenali tanda bahaya dan segera ke fasilitas kesehatan bila muncul.',
          ],
        );
      default:
        return const _EdukasiArticle(
          ringkasan:
              'Konten ini membantu orang tua memahami stimulasi dan perawatan anak sesuai tahap usia. Lakukan secara rutin dengan suasana menyenangkan agar hasilnya optimal.',
          tutorialLangkah: [
            'Siapkan kegiatan sederhana yang sesuai usia anak.',
            'Praktikkan selama 10-15 menit dengan suasana menyenangkan.',
            'Amati respons anak lalu sesuaikan cara pendampingan.',
            'Ulangi secara konsisten 3-4 kali per minggu.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Langkah Praktik',
              poin: [
                'Siapkan ruang yang aman dan nyaman untuk anak bereksplorasi.',
                'Lakukan aktivitas selama 10-15 menit dan sesuaikan dengan respons anak.',
                'Ulangi 3-4 kali seminggu sambil menjaga suasana menyenangkan.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Lakukan stimulasi/perawatan sesuai usia anak secara konsisten.',
            'Perhatikan respons anak untuk menyesuaikan pendekatan pengasuhan.',
            'Bila ada tanda bahaya atau kekhawatiran, konsultasikan ke tenaga kesehatan.',
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final _EdukasiArticle article = _buildArticleByTitle(widget.title);
    final int totalSteps = article.tutorialLangkah.length;
    final int currentStep = totalSteps == 0
        ? 0
        : _currentStep.clamp(0, totalSteps - 1);
    final bool isLastStep = totalSteps == 0 ? true : currentStep == totalSteps - 1;
    final double progress = totalSteps == 0 ? 0 : (currentStep + 1) / totalSteps;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Color(0xFF1E293B),
            size: 20,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Detail Konten',
          style: TextStyle(
            color: Color(0xFF1E293B),
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          Hero(
            tag: widget.heroTag,
            child: Container(
              margin: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              height: 220,
              decoration: BoxDecoration(
                color: widget.topBgColor,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Stack(
                children: [
                  Center(
                    child: widget.isVideo
                        ? Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black12,
                                  blurRadius: 8,
                                  offset: Offset(0, 3),
                                )
                              ],
                            ),
                            child: const Icon(
                              Icons.play_circle_outline,
                              color: Color(0xFF3B82F6),
                              size: 56,
                            ),
                          )
                        : const Icon(
                            Icons.menu_book_rounded,
                            color: Color(0xFFE2C499),
                            size: 84,
                          ),
                  ),
                  Positioned(
                    top: 14,
                    left: 14,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        widget.ageText,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 14,
                    right: 14,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF64748B),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        widget.durationText,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: widget.typeBgColor,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                widget.type,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: widget.typeColor,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
            child: Text(
              widget.title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                height: 1.3,
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 14, 20, 0),
            child: Text(
              'Ringkasan',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(20, 8, 20, 0),
            child: Text(
              article.ringkasan,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF334155),
                height: 1.6,
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 18, 20, 0),
            child: Text(
              'Tutorial Edukasi',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.fromLTRB(20, 10, 20, 0),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Langkah ${currentStep + 1} dari $totalSteps',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 9,
                    backgroundColor: const Color(0xFFE2E8F0),
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      Color(0xFF2563EB),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: totalSteps == 0
                        ? null
                        : () {
                            setState(() {
                              if (isLastStep) {
                                _currentStep = 0;
                              } else {
                                _currentStep = currentStep + 1;
                              }
                            });
                          },
                    icon: Icon(
                      isLastStep ? Icons.refresh : Icons.arrow_forward_rounded,
                      size: 18,
                    ),
                    label: Text(
                      isLastStep
                          ? 'Mulai Ulang dari Langkah 1'
                          : 'Lanjut ke Langkah Berikutnya',
                    ),
                    style: ElevatedButton.styleFrom(
                      elevation: 0,
                      backgroundColor: const Color(0xFF2563EB),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          ...article.tutorialLangkah.asMap().entries.map(
            (entry) => _TutorialStepCard(
              index: entry.key + 1,
              text: entry.value,
              isActive: entry.key == currentStep,
              isPassed: entry.key < currentStep,
            ),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 16, 20, 0),
            child: Text(
              'Materi Inti',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
          ...article.bagian.map(
            (section) => _ExpandableSection(section: section),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 18, 20, 0),
            child: Text(
              'Yang Perlu Diingat',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.fromLTRB(20, 10, 20, 0),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF0F9FF),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFBFDBFE)),
            ),
            child: Column(
              children: article.yangPerluDiingat
                  .map(
                    (item) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.only(top: 2),
                            child: Icon(
                              Icons.lightbulb_outline,
                              size: 16,
                              color: Color(0xFF1D4ED8),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              item,
                              style: const TextStyle(
                                fontSize: 13.5,
                                color: Color(0xFF1E3A8A),
                                height: 1.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _TutorialStepCard extends StatelessWidget {
  final int index;
  final String text;
  final bool isActive;
  final bool isPassed;

  const _TutorialStepCard({
    required this.index,
    required this.text,
    required this.isActive,
    required this.isPassed,
  });

  @override
  Widget build(BuildContext context) {
    final Color borderColor = isActive
        ? const Color(0xFF93C5FD)
        : isPassed
            ? const Color(0xFFBFDBFE)
            : Colors.grey.shade200;

    return Container(
      margin: const EdgeInsets.fromLTRB(20, 10, 20, 0),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isActive ? const Color(0xFFEFF6FF) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 26,
            height: 26,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: isActive
                  ? const Color(0xFF2563EB)
                  : const Color(0xFFDBEAFE),
              shape: BoxShape.circle,
            ),
            child: Text(
              '$index',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isActive ? Colors.white : const Color(0xFF1D4ED8),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF334155),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ExpandableSection extends StatelessWidget {
  final _ArticleSection section;

  const _ExpandableSection({required this.section});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 10, 20, 0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
        childrenPadding: const EdgeInsets.fromLTRB(14, 0, 14, 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        collapsedShape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        iconColor: const Color(0xFF1E293B),
        collapsedIconColor: const Color(0xFF1E293B),
        title: Text(
          section.judul,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Color(0xFF1E293B),
          ),
        ),
        children: section.poin
            .map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(top: 7),
                      child: Icon(
                        Icons.circle,
                        size: 7,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        item,
                        style: const TextStyle(
                          fontSize: 13.5,
                          color: Color(0xFF334155),
                          height: 1.55,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}

class _EdukasiArticle {
  final String ringkasan;
  final List<String> tutorialLangkah;
  final List<_ArticleSection> bagian;
  final List<String> yangPerluDiingat;

  const _EdukasiArticle({
    required this.ringkasan,
    required this.tutorialLangkah,
    required this.bagian,
    required this.yangPerluDiingat,
  });
}

class _ArticleSection {
  final String judul;
  final List<String> poin;

  const _ArticleSection({required this.judul, required this.poin});
}
