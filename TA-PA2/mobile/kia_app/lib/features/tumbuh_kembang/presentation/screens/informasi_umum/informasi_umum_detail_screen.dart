import 'package:flutter/material.dart';

class InformasiUmumDetailScreen extends StatefulWidget {
  final String type;
  final String ageText;
  final String durationText;
  final String title;
  final String heroTag;
  final bool isVideo;
  final Color topBgColor;
  final Color typeColor;
  final Color typeBgColor;

  const InformasiUmumDetailScreen({
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
  State<InformasiUmumDetailScreen> createState() => _InformasiUmumDetailScreenState();
}

class _InformasiUmumDetailScreenState extends State<InformasiUmumDetailScreen> {
  final Map<String, bool> _questionnaireAnswers = {};
  static const String _kesehatanSectionKey = 'kesehatan_lingkungan';
  static const String _keselamatanSectionKey = 'keselamatan_lingkungan';

  bool get _isProtectionArticle =>
      widget.title == 'Melihat Informasi Umum Perlindungan Anak';

  int _checkedAnswersCountBySection(String sectionKey) {
    return _questionnaireAnswers.entries
        .where((entry) => entry.key.startsWith('$sectionKey-') && entry.value)
        .length;
  }

  void _handleSaveAndSubmitSection({
    required String sectionTitle,
    required String sectionKey,
  }) {
    final int checkedCount = _checkedAnswersCountBySection(sectionKey);

    if (checkedCount == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Pilih minimal satu jawaban pada $sectionTitle sebelum kirim.',
          ),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: Text('Simpan dan Kirim $sectionTitle'),
          content: Text(
            'Simpan dan kirim $checkedCount jawaban yang sudah dicentang?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: const Text('Batal'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.of(dialogContext).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      '$sectionTitle berhasil disimpan dan dikirim.',
                    ),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              child: const Text('Simpan dan Kirim'),
            ),
          ],
        );
      },
    );
  }

  _InformasiUmumArticle _buildArticleByTitle(String title) {
    switch (title) {
      case 'Melihat Informasi Umum Cuci Tangan Pakai Sabun':
        return const _InformasiUmumArticle(
          ringkasan:
              'Kuman penyakit sangat mudah ditularkan melalui tangan. Tangan yang terlihat bersih belum tentu bebas kuman, sehingga cuci tangan pakai sabun dengan air mengalir perlu dibiasakan setiap hari.',
          tutorialLangkah: [
            'Basahi seluruh tangan dengan air bersih mengalir.',
            'Gosok sabun secara merata ke telapak, punggung tangan, dan sela-sela jari.',
            'Bersihkan bagian bawah kuku dan ujung jari dengan saksama.',
            'Posisikan telapak kanan di atas punggung tangan kiri dan sebaliknya, lalu gosok merata.',
            'Bilas tangan dengan air bersih mengalir dan keringkan dengan handuk/tisu atau diangin-anginkan.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Kapan Saja Harus Mencuci Tangan',
              poin: [
                'Setelah buang air.',
                'Sebelum memegang dan menyusui bayi.',
                'Setelah menceboki bayi atau anak.',
                'Sebelum makan dan menyuapi anak.',
                'Sebelum memegang makanan dan setelah makan.',
                'Setelah bersin atau batuk.',
                'Setiap kali tangan kotor: mengetik, memegang uang, hewan, dan berkebun.',
              ],
            ),
            _ArticleSection(
              judul: 'Pentingnya Mencuci Tangan Dengan Air Bersih Dan Sabun',
              poin: [
                'Kuman penyakit sangat mudah ditularkan melalui tangan dan dapat masuk ke tubuh saat makan.',
                'Tangan kadang terlihat bersih secara kasat mata namun tetap mengandung kuman.',
                'Sabun membersihkan kotoran dan merontokkan kuman. Tanpa sabun, kotoran dan kuman bisa tertinggal di tangan.',
              ],
            ),
            _ArticleSection(
              judul: 'Cara Cuci Tangan Yang Benar',
              poin: [
                'Biasakan cuci tangan pakai sabun dengan air mengalir.',
                'Basahi seluruh tangan dengan air bersih mengalir.',
                'Gosok sabun secara merata pada telapak dan punggung tangan.',
                'Bersihkan sela-sela jari dan bagian bawah kuku.',
                'Bilas tangan dengan air bersih mengalir hingga tidak ada sisa sabun.',
                'Keringkan dengan handuk/tisu bersih atau diangin-anginkan.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Cuci tangan pakai sabun adalah langkah sederhana untuk mencegah penyakit.',
            'Lakukan pada waktu penting dan setiap tangan terasa/terlihat kotor.',
            'Pastikan membersihkan seluruh bagian tangan sampai kuku.',
          ],
        );
      case 'Melihat Informasi Umum Perawatan Gigi Anak':
        return const _InformasiUmumArticle(
          ringkasan:
              'Perawatan gigi anak perlu dimulai sejak dini. Kebiasaan seperti minum susu botol saat tidur, sering ngemil manis, tidak menyikat gigi sebelum tidur, dan mengemut makanan meningkatkan risiko gigi berlubang.',
          tutorialLangkah: [
            'Usia 0-4 bulan: gendong/pangku anak dengan satu tangan saat membersihkan mulut.',
            'Bersihkan gusi anak perlahan dengan kain/lap basah yang dilingkarkan pada jari telunjuk ibu.',
            'Usia 6-12 bulan: bersihkan gusi setelah diberi makan menggunakan kain/lap basah.',
            'Saat gigi susu mulai muncul, bersihkan dengan sikat gigi berbulu halus.',
            'Gunakan pasta gigi sangat tipis pada permukaan bulu sikat bila diperlukan sesuai anjuran usia.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Faktor Risiko Gigi Berlubang',
              poin: [
                'Meminum susu botol saat tidur malam.',
                'Mengemil makanan manis di antara waktu makan.',
                'Tidak menyikat gigi sebelum tidur.',
                'Mengemut makanan.',
              ],
            ),
            _ArticleSection(
              judul: 'Cara Membersihkan Gigi Anak Usia 0-4 Bulan',
              poin: [
                'Gendong atau pangku anak dengan satu tangan.',
                'Bersihkan gusi anak perlahan menggunakan kain/lap basah yang dilingkarkan pada jari telunjuk ibu.',
              ],
            ),
            _ArticleSection(
              judul: 'Cara Membersihkan Gigi Anak Usia 6-12 Bulan',
              poin: [
                'Bersihkan gusi anak setelah diberi makan menggunakan kain/lap basah.',
                'Bila gigi susu mulai muncul, bersihkan gigi dengan sikat gigi anak berbulu halus tanpa pasta gigi atau pasta gigi selapis tipis.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Kebersihan mulut anak dimulai sebelum gigi tumbuh penuh.',
            'Hindari kebiasaan yang meningkatkan risiko gigi berlubang.',
            'Periksa gigi secara berkala agar masalah ditemukan lebih awal.',
          ],
        );
      case 'Melihat Informasi Umum Perawatan Anak Sakit':
        return const _InformasiUmumArticle(
          ringkasan:
              'Saat anak sakit, orang tua perlu tetap tenang dan memastikan kebutuhan gizi anak terpenuhi. Daya tahan tubuh anak melemah saat sakit sehingga memerlukan asupan gizi lebih banyak dan lebih sering.',
          tutorialLangkah: [
            'Beri asupan gizi lebih banyak, misalnya menambah porsi ASI atau makanan/minuman.',
            'Beri asupan gizi lebih sering, tambahkan frekuensi makan 1-2 kali dari biasanya dengan porsi kecil.',
            'Pantau gejala utama seperti demam, batuk, diare, luka, muntah, dan nafsu makan anak.',
            'Tetap berikan cairan cukup untuk mencegah dehidrasi.',
            'Segera ke fasilitas pelayanan kesehatan bila muncul tanda bahaya.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Demam',
              poin: [
                'Jika masih menyusu, berikan ASI lebih sering.',
                'Beri minum lebih sering dan lebih banyak.',
                'Jangan diselimuti atau diberi baju tebal.',
                'Kompres dengan air biasa/air hangat, jangan dengan air dingin.',
                'Jika demam tinggi, beri obat penurun panas sesuai dosis.',
                'Segera ke fasilitas kesehatan jika demam disertai kejang, tidak turun dalam 2 hari, atau disertai bintik merah/perdarahan.',
              ],
            ),
            _ArticleSection(
              judul: 'Luka dan Koreng',
              poin: [
                'Luka: cuci bersih luka dengan air bersih mengalir.',
                'Koreng: periksakan ke puskesmas.',
                'Segera ke fasilitas kesehatan jika luka bernanah atau berbau.',
              ],
            ),
            _ArticleSection(
              judul: 'Batuk',
              poin: [
                'Berikan ASI lebih sering.',
                'Beri minum air matang lebih banyak.',
                'Usia di atas 1 tahun bisa diberikan madu/kecap manis dengan air jeruk nipis sebagai pelega tenggorokan.',
                'Jauhkan dari asap rokok, asap dapur, asap sampah, polusi kendaraan, dan debu.',
                'Segera ke fasilitas kesehatan jika batuk tidak sembuh dalam 2 hari, anak sesak napas, atau disertai demam.',
              ],
            ),
            _ArticleSection(
              judul: 'Diare/Mencret',
              poin: [
                'Jika anak masih menyusu, terus berikan ASI sesering mungkin.',
                'Berikan oralit 1/2-1 gelas setiap kali buang air besar. Jika tidak ada, berikan air matang/kuah sayur bening/air tajin.',
                'Pemberian zinc 10 hari berturut-turut: usia <6 bulan 1/2 tablet, usia 6 bulan-5 tahun 1 tablet.',
                'Tetap beri MP-ASI atau makan seperti biasa.',
                'Jangan beri obat apapun kecuali dari petugas kesehatan.',
                'Segera ke fasilitas kesehatan jika timbul demam, ada darah dalam tinja, diare makin parah, muntah terus, anak sangat haus, atau tidak mau makan/minum.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Saat anak sakit, tetap utamakan cairan, nutrisi, dan pemantauan gejala.',
            'Jangan memberi obat sembarangan tanpa arahan petugas kesehatan.',
            'Bawa ke fasilitas kesehatan segera jika ada tanda bahaya.',
          ],
        );
      case 'Melihat Informasi Umum Anak dengan Disabilitas':
        return const _InformasiUmumArticle(
          ringkasan:
              'Anak dengan disabilitas rentan terhadap masalah kesehatan dan kekerasan. Keluarga perlu memberi perlindungan, pemenuhan gizi, pendampingan kebersihan diri, serta pemantauan tumbuh kembang secara teratur.',
          tutorialLangkah: [
            'Bangun penguatan mental keluarga untuk menerima kondisi anak dengan penuh kasih.',
            'Lindungi anak dan berikan rasa aman melalui dukungan, semangat, serta motivasi.',
            'Latih kemandirian anak secara bertahap dalam aktivitas sehari-hari.',
            'Sediakan makanan bergizi seimbang dan periksakan kesehatan anak secara rutin.',
            'Kontrol teratur untuk terapi, pemantauan status gizi, perkembangan, dan imunisasi di puskesmas terdekat.',
            'Pada anak dengan hambatan bicara/bahasa, latih pelafalan huruf, suku kata, kata, kalimat, dan kemampuan mendengar.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Dukungan Keluarga Sehari-hari',
              poin: [
                'Menerima kondisi anak dengan segala kebutuhannya.',
                'Melindungi anak dari kekerasan dan perlakuan tidak aman.',
                'Membantu pemenuhan gizi, kebersihan perorangan, dan aktivitas harian.',
                'Memantau tumbuh kembang dan status kesehatan secara teratur.',
                'Melengkapi imunisasi serta kontrol terapi sesuai kebutuhan anak.',
              ],
            ),
            _ArticleSection(
              judul: 'Komunitas Pendukung Anak Dengan Disabilitas',
              poin: [
                'Forum Komunikasi Keluarga Anak Dengan Kecacatan (FKKADK).',
                'Persatuan Orang Tua Anak Dengan Down Syndrome (POTADS).',
                'Ikatan Sindrome Down Indonesia (ISDI).',
                'Komunitas Peduli Tuna Daksa (KOPETUNDA).',
                'Persatuan Tuna Netra Indonesia (PERTUNI).',
                'Himpunan Wanita Disabilitas Indonesia (HWDI).',
                'Gerakan untuk Kesejahteraan Tuna Rungu Indonesia (GERKATIN).',
                'Federasi Kesejahteraan Penyandang Cacat Tubuh Indonesia (FKPCTI).',
                'Yayasan Autis Indonesia (YAI), YPAC, dan Yayasan Sayap Ibu.',
                'Jika jauh dari komunitas, libatkan keluarga di Posyandu, PAUD, PKK, RBM, Polindes/Poskesdes, dan Puskesmas terdekat.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Anak dengan disabilitas berhak atas perlindungan, kesehatan, gizi, dan pendidikan.',
            'Dukungan keluarga yang konsisten sangat menentukan perkembangan anak.',
            'Manfaatkan jejaring komunitas dan layanan kesehatan terdekat untuk pendampingan jangka panjang.',
          ],
        );
      case 'Melihat Informasi Umum Perlindungan Anak':
        return const _InformasiUmumArticle(
          ringkasan:
              'Lindungi anak dari kekerasan fisik, psikis, seksual, dan penelantaran. Orang tua perlu membangun komunikasi, memahami hak anak, dan mengenali tanda-tanda kekerasan sejak dini.',
          tutorialLangkah: [
            'Bangun komunikasi rutin: dengarkan cerita anak dengan penuh perhatian.',
            'Ajarkan anak bahwa bagian pribadi (kelamin, paha, dada, pantat, kaki) tidak boleh disentuh orang lain.',
            'Kelola stres keluarga dan pastikan keberadaan anak selalu diketahui.',
            'Pastikan pengasuh anak dapat dipercaya.',
            'Segera cari bantuan jika ada dugaan kekerasan atau penelantaran.',
          ],
          bagian: [
            _ArticleSection(
              judul: 'Contoh Bentuk Kekerasan Pada Anak',
              poin: [
                'Mencubit, memukul (kekerasan fisik).',
                'Mengejek, mengancam (kekerasan psikis).',
                'Perbuatan cabul atau mempertontonkan aktivitas seksual pada anak (kekerasan seksual).',
                'Tidak memenuhi kebutuhan gizi, kesehatan, dan pendidikan (penelantaran).',
              ],
            ),
            _ArticleSection(
              judul: 'Bangun Komunikasi Dengan Anak',
              poin: [
                'Dengarkan cerita anak dengan penuh perhatian.',
                'Orang tua belajar melihat dari sudut pandang anak tanpa cepat mengkritik.',
                'Hargai pendapat dan selera anak walau berbeda dengan orang tua.',
                'Jika anak bercerita hal berbahaya, bantu anak menyusun cara menghindarinya.',
              ],
            ),
            _ArticleSection(
              judul: 'Perhatikan Tanda Kekerasan Pada Anak',
              poin: [
                'Memar atau luka yang tidak dapat dijelaskan.',
                'Gangguan makan dan tidur.',
                'Perubahan perilaku mendadak.',
                'Adanya infeksi menular seksual.',
              ],
            ),
          ],
          yangPerluDiingat: [
            'Banyak pelaku kekerasan fisik dan kejahatan seksual adalah orang yang dikenal anak.',
            'Lindungi anak dengan komunikasi terbuka, pengawasan, dan pengasuhan tanpa kekerasan.',
            'Segera minta bantuan tenaga kesehatan/otoritas terkait bila ada tanda kekerasan.',
          ],
        );
      default:
        return const _InformasiUmumArticle(
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
    final _InformasiUmumArticle article = _buildArticleByTitle(widget.title);

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
          if (article.tutorialLangkah.isNotEmpty) ...[
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
            ...article.tutorialLangkah.asMap().entries.map(
              (entry) => _TutorialStepCard(
                index: entry.key + 1,
                text: entry.value,
              ),
            ),
          ],
          if (_isProtectionArticle) ...[
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Text(
                'Kuisioner Kesehatan Lingkungan (Diisi Oleh Keluarga)',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 8, 20, 0),
              child: Text(
                'Baca dan pahami hal-hal di bawah ini. Jika ada yang tidak dimengerti, tanyakan pada kader.',
                style: TextStyle(
                  fontSize: 13,
                  color: Color(0xFF475569),
                  height: 1.45,
                ),
              ),
            ),
            _QuestionnaireCard(
              sectionKey: _kesehatanSectionKey,
              title: 'Sarana Sanitasi',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Di mana ibu dan keluarga buang air besar? (pilih salah satu)',
                  options: [
                    'Sembarangan (kebun, sungai, dan sejenisnya).',
                    'Jamban milik sendiri.',
                  ],
                ),
                _QuestionnaireQuestion(
                  prompt:
                      'Jika jamban milik sendiri, bagian bawah/bak penampung tinja berupa apa?',
                  options: [
                    'Tangki septik yang disedot 3-5 tahun terakhir atau disalurkan ke sistem pengolahan.',
                    'Cubluk/lubang tanah.',
                    'Dibuang langsung ke drainase/kolam/sawah/sungai/danau/laut/pantai/tanah lapang/kebun.',
                  ],
                ),
                _QuestionnaireQuestion(
                  prompt: 'Bagaimana bentuk kloset jambannya?',
                  options: [
                    'Kloset leher angsa/lainnya yang mencegah binatang pembawa penyakit masuk.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            _QuestionnaireCard(
              sectionKey: _kesehatanSectionKey,
              title: 'Cuci Tangan Pakai Sabun',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Seperti apa sarana cuci tangan di rumah ibu?',
                  options: [
                    'Memiliki sarana/tempat cuci tangan.',
                    'Memiliki air mengalir.',
                    'Memiliki sabun.',
                  ],
                ),
                _QuestionnaireQuestion(
                  prompt: 'Apakah ibu melakukan cuci tangan pakai sabun?',
                  options: [
                    'Ya, rutin dilakukan.',
                    'Belum rutin dilakukan.',
                  ],
                ),
                _QuestionnaireQuestion(
                  prompt: 'Apakah ibu mengetahui waktu-waktu kritis cuci tangan pakai sabun?',
                  options: [
                    'Sebelum makan.',
                    'Sebelum mengolah dan menghidangkan makanan.',
                    'Sebelum menyusui anak dan sebelum memberi makan bayi/balita.',
                    'Setelah buang air besar/kecil.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            _QuestionnaireCard(
              sectionKey: _kesehatanSectionKey,
              title: 'Pengelolaan Makanan dan Air Minum',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Apa sumber air minum di rumah ibu?',
                  options: [
                    'Pipa.',
                    'Kran umum.',
                    'Sumur bor/pompa/sumur gali terlindungi.',
                    'Mata air terlindungi.',
                    'Sungai/mata air tidak terlindungi.',
                    'Danau/kolam/sumur gali tidak terlindungi.',
                    'Air hujan.',
                    'Waduk.',
                    'Kolam.',
                    'Irigasi.',
                  ],
                ),
                _QuestionnaireQuestion(
                  prompt: 'Bagaimana ibu mengelola air minum di rumah tangga?',
                  options: [
                    'Melalui proses pengolahan (misalnya direbus).',
                    'Jika air keruh dilakukan pengolahan (pengendapan/penyaringan).',
                    'Disimpan dalam wadah tertutup rapat, kuat, dan diambil dengan cara aman.',
                  ],
                ),
                _QuestionnaireQuestion(
                  prompt: 'Bagaimana ibu mengelola makanan di dalam keluarga?',
                  options: [
                    'Makanan tertutup baik dengan penutup bersih.',
                    'Makanan tidak berdekatan dengan bahan berbahaya/beracun.',
                    'Menjaga kebersihan, memisahkan mentah-matang, memasak sampai matang, tidak membiarkan makanan matang >4 jam, serta memakai air aman.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            _QuestionnaireCard(
              sectionKey: _kesehatanSectionKey,
              title: 'Pengelolaan Sampah',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Bagaimana ibu mengelola sampah?',
                  options: [
                    'Tidak ada sampah berserakan di lingkungan sekitar rumah.',
                    'Ada tempat sampah tertutup, kuat, dan mudah dibersihkan.',
                    'Telah melakukan pemilahan sampah.',
                    'Sampah tidak dibakar.',
                    'Sampah tidak dibuang ke sungai/kebun/saluran drainase/tempat terbuka.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            _QuestionnaireCard(
              sectionKey: _kesehatanSectionKey,
              title: 'Pengelolaan Limbah Cair (air bekas cuci baju, piring, mandi)',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Bagaimana ibu mengelola limbah cair di rumah?',
                  options: [
                    'Tidak terlihat genangan air di sekitar rumah.',
                    'Ada saluran pembuangan limbah cair rumah tangga (non kakus) yang kedap dan tertutup.',
                    'Terhubung dengan sumur resapan dan/atau sistem pengolahan limbah.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
              child: FilledButton.icon(
                onPressed: () => _handleSaveAndSubmitSection(
                  sectionTitle: 'Kuisioner Kesehatan Lingkungan',
                  sectionKey: _kesehatanSectionKey,
                ),
                icon: const Icon(Icons.save_as_outlined),
                label: const Text('Simpan dan Kirim'),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 22, 20, 0),
              child: Text(
                'Kuisioner Keselamatan Lingkungan (Diisi Oleh Keluarga)',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 8, 20, 0),
              child: Text(
                'Baca dan pahami hal-hal di bawah ini. Jika ada yang tidak dimengerti, tanyakan pada kader.',
                style: TextStyle(
                  fontSize: 13,
                  color: Color(0xFF475569),
                  height: 1.45,
                ),
              ),
            ),
            _QuestionnaireCard(
              sectionKey: _keselamatanSectionKey,
              title: 'Hindarkan Anak dari Risiko Jatuh',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Checklist keselamatan di rumah:',
                  options: [
                    'TV, meja, lemari, dan rak yang bisa dipanjat bayi diikat/menempel di dinding.',
                    'Sudut tajam perabot diberi bantalan.',
                    'Tidak menggunakan baby walker.',
                    'Jendela minimal 1 meter dari lantai untuk mencegah bayi memanjat.',
                    'Gerbang/pagar rumah rutin diperiksa.',
                    'Bayi tidak ditinggal sendirian di tempat tinggi.',
                    'Tangga dan balkon dipasang pagar, jarak antar pagar <= 9 cm.',
                    'Tempat tidur anak dipasang pengaman agar anak tidak jatuh.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            _QuestionnaireCard(
              sectionKey: _keselamatanSectionKey,
              title: 'Hindarkan Anak dari Luka Bakar dan Bahaya Listrik',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Checklist keselamatan listrik dan panas:',
                  options: [
                    'Anak dijauhkan dari kabel listrik dan panci panas.',
                    'Soket listrik dipasang jauh dari jangkauan anak atau diberi penutup.',
                    'Tidak memegang barang panas saat memegang/memangku bayi.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            _QuestionnaireCard(
              sectionKey: _keselamatanSectionKey,
              title: 'Mencegah Bayi Kekurangan Napas',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Checklist pencegahan tersedak/tercekik:',
                  options: [
                    'Tidak memberi makanan keras dan sulit dikunyah.',
                    'Anak tidak bermain dengan benda berisiko terjerat/tercekik (tali panjang, kantong plastik, mainan kecil, dll).',
                    'Tidak menidurkan bayi telungkup tanpa pengawasan.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            _QuestionnaireCard(
              sectionKey: _keselamatanSectionKey,
              title: 'Hindarkan Anak dari Bahaya Tenggelam',
              questions: [
                _QuestionnaireQuestion(
                  prompt: 'Checklist pencegahan tenggelam:',
                  options: [
                    'Anak tidak dibiarkan sendiri di bak mandi atau ember.',
                    'Ada pembatas aman agar anak tidak leluasa menjangkau sumber air sendiri.',
                    'Anak tidak bermain di tepi kolam renang tanpa pengawasan.',
                    'Anak usia 1 tahun 6 bulan mulai diajari bahaya air.',
                    'Anak usia 2 tahun diajari melayang saat jatuh di air dan berenang jarak pendek.',
                    'Anak usia 6 tahun diajari keterampilan berenang untuk bertahan di air.',
                  ],
                ),
              ],
              answers: _questionnaireAnswers,
              onChanged: (key, value) {
                setState(() {
                  _questionnaireAnswers[key] = value;
                });
              },
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
              child: FilledButton.icon(
                onPressed: () => _handleSaveAndSubmitSection(
                  sectionTitle: 'Kuisioner Keselamatan Lingkungan',
                  sectionKey: _keselamatanSectionKey,
                ),
                icon: const Icon(Icons.save_as_outlined),
                label: const Text('Simpan dan Kirim'),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
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

  const _TutorialStepCard({
    required this.index,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 10, 20, 0),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 26,
            height: 26,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: const Color(0xFFDBEAFE),
              shape: BoxShape.circle,
            ),
            child: Text(
              '$index',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1D4ED8),
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

class _InformasiUmumArticle {
  final String ringkasan;
  final List<String> tutorialLangkah;
  final List<_ArticleSection> bagian;
  final List<String> yangPerluDiingat;

  const _InformasiUmumArticle({
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

class _QuestionnaireCard extends StatelessWidget {
  final String sectionKey;
  final String title;
  final List<_QuestionnaireQuestion> questions;
  final Map<String, bool> answers;
  final void Function(String key, bool value) onChanged;

  const _QuestionnaireCard({
    required this.sectionKey,
    required this.title,
    required this.questions,
    required this.answers,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E293B),
            ),
          ),
          const SizedBox(height: 10),
          ...questions.asMap().entries.map((entry) {
            final int qIndex = entry.key;
            final _QuestionnaireQuestion question = entry.value;

            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${qIndex + 1}. ${question.prompt}',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF334155),
                      height: 1.45,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...question.options.asMap().entries.map((optionEntry) {
                    final int optIndex = optionEntry.key;
                    final String optionText = optionEntry.value;
                    final String key = '$sectionKey-$title-$qIndex-$optIndex';
                    final bool checked = answers[key] ?? false;

                    return InkWell(
                      onTap: () => onChanged(key, !checked),
                      borderRadius: BorderRadius.circular(8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          vertical: 6,
                          horizontal: 2,
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              checked
                                  ? Icons.check_box
                                  : Icons.check_box_outline_blank,
                              size: 19,
                              color: checked
                                  ? const Color(0xFF2563EB)
                                  : const Color(0xFF94A3B8),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                optionText,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: Color(0xFF334155),
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _QuestionnaireQuestion {
  final String prompt;
  final List<String> options;

  const _QuestionnaireQuestion({
    required this.prompt,
    required this.options,
  });
}

