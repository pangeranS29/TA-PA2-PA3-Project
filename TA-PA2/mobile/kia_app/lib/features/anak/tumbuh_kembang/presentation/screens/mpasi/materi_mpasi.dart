import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/data/models/anak_detail_model.dart';

class MateriMpasiScreen extends StatefulWidget {
  final AnakDetailModel anakData;
  final int usiaChild;

  const MateriMpasiScreen({
    super.key,
    required this.anakData,
    required this.usiaChild,
  });

  @override
  State<MateriMpasiScreen> createState() => _MateriMpasiScreenState();
}

class _MateriMpasiScreenState extends State<MateriMpasiScreen> {
  bool _expandedPerkembangan = false;
  bool _expandedYangHarusDilakukan = false;
  bool _expandedNutrisi = false;
  bool _expandedTekstur = false;
  bool _expandedFrekuensi = false;
  bool _expandedMakananDihindari = false;
  bool _expandedTipsSusahMakan = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildIntroCard(),
                  const SizedBox(height: 24),
                  _buildPerkembanganSection(),
                  const SizedBox(height: 24),
                  _buildYangHarusDilakukanSection(),
                  const SizedBox(height: 24),
                  _buildNutrisiSection(),
                  const SizedBox(height: 24),
                  _buildTeksturMakananSection(),
                  const SizedBox(height: 24),
                  _buildFrekuensiMakanSection(),
                  const SizedBox(height: 24),
                  _buildLanjutkanAsiCard(),
                  const SizedBox(height: 24),
                  _buildMakananDihindariSection(),
                  const SizedBox(height: 24),
                  _buildTipsSusahMakanSection(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.white,
      foregroundColor: Colors.black,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back),
        onPressed: () => Navigator.pop(context),
      ),
      title: const Text(
        'Materi MPASI',
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
      ),
      centerTitle: false,
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.all(20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFF185FA5),
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Untuk:',
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xFF5E6E8D),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  widget.anakData.namaAnak,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Usia: ${widget.usiaChild} Bulan',
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF5E6E8D),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIntroCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1976D2),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'MPASI 6-12 Bulan',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Di usia 6-12 bulan bayi berkembang semakin pesat secara fisik dan mental, sehingga membutuhkan gizi lengkap terutama yang kaya protein hewani.',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.white10,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.child_care,
                  size: 48,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPerkembanganSection() {
    return _buildExpandableCard(
      icon: Icons.trending_up,
      iconColor: Colors.green,
      title: 'Yang Akan Dialami',
      subtitle: 'Perkembangan bayi usia 6-12 bulan',
      isExpanded: _expandedPerkembangan,
      onTap: () => setState(() => _expandedPerkembangan = !_expandedPerkembangan),
      children: [
        _buildBulletPoint('Bayi mendapatkan pengalaman makan pertama kalinya dan beradaptasi dengan berbagai tekstur makanan sesuai usia'),
        _buildBulletPoint('Bayi mulai tumbuh gigi disertai diare dan demam'),
        _buildBulletPoint('Bayi mulai berbalik dari posisi telentang ke telungkup atau tengkurap dan menjaga kepala tetap tegak'),
        _buildBulletPoint('Meraih benda di sekitarnya, menirukan bunyi, dan tersenyum melihat hal-hal yang menarik'),
        _buildBulletPoint('Bayi menjelajah lingkungannya dengan merangkak di usia 8-9 bulan'),
      ],
    );
  }

  Widget _buildYangHarusDilakukanSection() {
    return _buildExpandableCard(
      icon: Icons.check_circle_outline,
      iconColor: Colors.blue,
      title: 'Yang Harus Dilakukan',
      subtitle: 'Panduan perawatan bayi 6-12 bulan',
      isExpanded: _expandedYangHarusDilakukan,
      onTap: () => setState(() => _expandedYangHarusDilakukan = !_expandedYangHarusDilakukan),
      children: [
        _buildBulletPoint('Berikan MPASI yang kaya protein hewani'),
        _buildBulletPoint('Latih bayi menyenangi suasana makan dan ibu perlu peka terhadap respons bayi'),
        _buildBulletPoint('Berikan ASI hingga usia 2 tahun atau lebih'),
        _buildBulletPoint('Cek perkembangan bayi tiap bulan di Posyandu atau fasilitas pelayanan kesehatan'),
        _buildBulletPoint('Pastikan bayi mendapat vitamin A kapsul biru 1 kali setahun untuk daya tahan tubuhnya'),
        _buildBulletPoint('Dapatkan Pemeriksaan Kesehatan Anak Terintegrasi (PKAT) di usia 6-7 bulan'),
        _buildBulletPoint('Dapatkan imunisasi dasar lengkap sesuai usia'),
        _buildBulletPoint('Ajari bayi makan sendiri dengan sendok dan minum sendiri dengan gelas'),
        _buildBulletPoint('Ajari bayi duduk, memegang benda kecil dengan 2 jari, serta berdiri dan berjalan dengan berpegangan'),
        _buildBulletPoint('Ajak bayi main Cilukba dan bicara sesering mungkin'),
        _buildBulletPoint('Cek kesehatan bayi dan kenali tanda bahaya. Segera ke fasilitas kesehatan jika bayi sakit atau mengalami tanda bahaya'),
      ],
    );
  }

  Widget _buildNutrisiSection() {
    return _buildExpandableCard(
      icon: Icons.restaurant_menu,
      iconColor: Colors.orange,
      title: 'Nutrisi Penting',
      subtitle: 'Sumber gizi lengkap untuk bayi',
      isExpanded: _expandedNutrisi,
      onTap: () => setState(() => _expandedNutrisi = !_expandedNutrisi),
      children: [
        const Text(
          'Di usia 6 hingga 12 bulan, makanan yang diberikan pada bayi harus mengandung sumber gizi lengkap, yang dibutuhkan untuk tumbuh kembang terbaik.',
          style: TextStyle(
            fontSize: 13,
            color: Colors.black87,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Perkenalkan makanan satu per satu sambil memperhatikan apakah anak memiliki alergi terhadap makanan tertentu. Pastikan cara memasak makanan direbus atau dikukus, serta hindari makanan yang digoreng, mengandung bahan pengawat dan tinggi gula dan garam.',
          style: TextStyle(
            fontSize: 13,
            color: Colors.black87,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 16),
        _buildNutrisiGrid(),
      ],
    );
  }

  Widget _buildNutrisiGrid() {
    final nutrisiItems = [
      'Air Susu Ibu (ASI)',
      'Makanan Pokok',
      'Daging-dagingan',
      'Susu Hewani & Produk Turunannya',
      'Telur',
      'Kacang-kacangan',
      'Buah & Sayuran Kaya Vitamin A',
      'Buah & Sayuran Lainnya',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Kelompok Makanan yang Dianjurkan:',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        ...nutrisiItems.map((item) => _buildNutrisiItem(item)).toList(),
      ],
    );
  }

  Widget _buildNutrisiItem(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Container(
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                color: Color(0xFF1976D2),
                shape: BoxShape.circle,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                color: Colors.black87,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeksturMakananSection() {
    return _buildExpandableCard(
      icon: Icons.texture,
      iconColor: Colors.teal,
      title: 'Tekstur Makanan',
      subtitle: 'Sesuai tahap perkembangan',
      isExpanded: _expandedTekstur,
      onTap: () => setState(() => _expandedTekstur = !_expandedTekstur),
      children: [
        const Text(
          'Ibu bisa memulai dengan makanan bertekstur lunak dan lembut, seperti bubur pisang campur apel dan pir, bubur sup daging kacang merah atau puding kentang ayam dan telur.',
          style: TextStyle(
            fontSize: 13,
            color: Colors.black87,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 12),
        const Text(
          'Kemudian, lanjutkan dengan makanan yang bertekstur lebih kasar tapi tetap lembut di usia 9-11 bulan, seperti sup daging cincang, nasi tim ikan kembung telur puyuh, dan tim bubur manado daging dan udang.',
          style: TextStyle(
            fontSize: 13,
            color: Colors.black87,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 16),
        _buildTeksturStages(),
      ],
    );
  }

  Widget _buildTeksturStages() {
    final stages = [
      {'usia': '6-8 Bulan', 'tekstur': 'DISARING', 'deskripsi': 'Makanan dibuat dengan disaring. Tekstur makanan lumat dan kental. Kebutuhan cairan: 800 ml/hari (±3 gelas belimbing).'},
      {'usia': '9-11 Bulan', 'tekstur': 'DICINCANG', 'deskripsi': 'Bahan makanan sama dengan untuk orang dewasa. Tekstur makanan dicincang. Perhatikan respons anak saat makan.'},
      {'usia': '12-23 Bulan', 'tekstur': 'MASAK BIASA', 'deskripsi': 'Bahan makanan sama dengan untuk orang dewasa. Tekstur makanan yang diiris-iris. Perhatikan respons anak saat makan. Kebutuhan cairan: 1.300 ml/hari (±5 gelas belimbing).'},
    ];

    return Column(
      children: stages.map((stage) => Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1976D2).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    stage['usia'] as String,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1976D2),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  stage['tekstur'] as String,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              stage['deskripsi'] as String,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
                height: 1.4,
              ),
            ),
          ],
        ),
      )).toList(),
    );
  }

  Widget _buildFrekuensiMakanSection() {
    return _buildExpandableCard(
      icon: Icons.schedule,
      iconColor: Colors.brown,
      title: 'Frekuensi Makan',
      subtitle: 'Jadwal makan sesuai usia',
      isExpanded: _expandedFrekuensi,
      onTap: () => setState(() => _expandedFrekuensi = !_expandedFrekuensi),
      children: [
        _buildFrekuensiCard(
          usia: '6-8 Bulan',
          porsi: '2-3 sdm bertahap hingga 1/2 mangkok (125 ml)',
          frekuensi: '2-3 kali makanan utama dan 1-2 kali makanan selingan',
          energi: '200 kkal per hari',
        ),
        const SizedBox(height: 12),
        _buildFrekuensiCard(
          usia: '9-11 Bulan',
          porsi: '1/2 - 3/4 mangkok (125-200 ml)',
          frekuensi: '3-4 kali makanan utama dan 1-2 kali makanan selingan',
          energi: '300 kkal per hari',
        ),
        const SizedBox(height: 12),
        _buildFrekuensiCard(
          usia: '12-23 Bulan',
          porsi: '3/4 - 1 mangkok (200-250 ml)',
          frekuensi: '3-4 kali makanan utama dan 1-2 kali makanan selingan',
          energi: '550 kkal per hari',
        ),
      ],
    );
  }

  Widget _buildFrekuensiCard({
    required String usia,
    required String porsi,
    required String frekuensi,
    required String energi,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF1976D2).withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              usia,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1976D2),
              ),
            ),
          ),
          const SizedBox(height: 12),
          _buildInfoRow('Porsi', porsi),
          const SizedBox(height: 8),
          _buildInfoRow('Frekuensi', frekuensi),
          const SizedBox(height: 8),
          _buildInfoRow('Energi', energi),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            '$label:',
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.grey,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.black87,
              height: 1.4,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLanjutkanAsiCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1976D2),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.sentiment_satisfied,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Lanjutkan ASI',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Tetap berikan ASI secara eksklusif sampai usia 2 tahun untuk daya tahan tubuh maksimal.',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.white70,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMakananDihindariSection() {
    return _buildExpandableCard(
      icon: Icons.warning_rounded,
      iconColor: Colors.red,
      title: 'Makanan yang Dihindari',
      subtitle: 'Hindari sampai anak berusia 1 tahun',
      isExpanded: _expandedMakananDihindari,
      onTap: () => setState(() => _expandedMakananDihindari = !_expandedMakananDihindari),
      children: [
        _buildBulletPoint('Madu dan produk lebah'),
        _buildBulletPoint('Makanan yang mengandung garam dan gula'),
        _buildBulletPoint('Makanan dengan potensi alergi tinggi'),
        _buildBulletPoint('Makanan yang sulit dicerna'),
      ],
    );
  }

  Widget _buildTipsSusahMakanSection() {
    return _buildExpandableCard(
      icon: Icons.lightbulb_outline,
      iconColor: Colors.blue,
      title: 'Tips Anak Susah Makan',
      subtitle: 'Panduan mengatasi kesulitan makan',
      isExpanded: _expandedTipsSusahMakan,
      onTap: () => setState(() => _expandedTipsSusahMakan = !_expandedTipsSusahMakan),
      children: [
        _buildBulletPoint('Ciptakan suasana positif saat makan'),
        _buildBulletPoint('Jangan memaksa anak untuk menghabiskan makanan'),
        _buildBulletPoint('Tawarkan berbagai pilihan rasa dan tekstur'),
        _buildBulletPoint('Ajari anak makan dengan sabar dan konsisten'),
        _buildBulletPoint('Libatkan anak dalam proses persiapan makanan'),
      ],
    );
  }

  Widget _buildExpandableCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required bool isExpanded,
    required VoidCallback onTap,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: iconColor.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        icon,
                        color: iconColor,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            subtitle,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      isExpanded ? Icons.expand_less : Icons.expand_more,
                      color: Colors.grey,
                    ),
                  ],
                ),
                if (isExpanded) ...[
                  const SizedBox(height: 16),
                  ...children,
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '• ',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 13,
                color: Colors.black87,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
