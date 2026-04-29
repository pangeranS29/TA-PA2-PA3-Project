import 'package:flutter/material.dart';

class PerawatanBayiScreen extends StatelessWidget {
  const PerawatanBayiScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 5,
      child: Scaffold(
        backgroundColor: const Color(0xFFF1F5F9),
        appBar: AppBar(
          title: const Text('Perawatan Bayi',
              style: TextStyle(fontWeight: FontWeight.bold)),
          backgroundColor: Colors.white,
          foregroundColor: Colors.black87,
          elevation: 0,
          bottom: const TabBar(
            isScrollable: true,
            labelColor: Color(0xFF2563EB),
            unselectedLabelColor: Colors.grey,
            indicatorColor: Color(0xFF2563EB),
            labelStyle: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
            tabs: [
              Tab(text: '0–28 Hari'),
              Tab(text: '29 Hr – 3 Bln'),
              Tab(text: '3–6 Bulan'),
              Tab(text: '6–9 Bulan'),
              Tab(text: '9–12 Bulan'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _Tab028Hari(),
            _Tab29Hari3Bulan(),
            _Tab36Bulan(),
            _Tab69Bulan(),
            _Tab912Bulan(),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// SHARED WIDGETS
// ─────────────────────────────────────────────

class _SectionTitle extends StatelessWidget {
  final String text;
  final Color color;
  const _SectionTitle(this.text, {this.color = const Color(0xFF1E3A5F)});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(text,
          style: TextStyle(
              fontSize: 15, fontWeight: FontWeight.bold, color: color)),
    );
  }
}

class _BulletItem extends StatelessWidget {
  final String text;
  final bool isSubBullet;
  const _BulletItem(this.text, {this.isSubBullet = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: isSubBullet ? 20 : 0, bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 5),
            child: Container(
              width: isSubBullet ? 4 : 6,
              height: isSubBullet ? 4 : 6,
              decoration: BoxDecoration(
                  color: isSubBullet
                      ? Colors.black38
                      : const Color(0xFF2563EB),
                  shape: BoxShape.circle),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
              child: Text(text,
                  style: TextStyle(
                      fontSize: 13,
                      color: isSubBullet ? Colors.black54 : Colors.black87,
                      height: 1.5))),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final Widget child;
  const _InfoCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2)),
        ],
      ),
      child: child,
    );
  }
}

// ─────────────────────────────────────────────
// PENANDA TABLE WIDGET
// ─────────────────────────────────────────────
class _PenandaTable extends StatefulWidget {
  final List<String> items;
  final Color accentColor;
  const _PenandaTable({required this.items, required this.accentColor});

  @override
  State<_PenandaTable> createState() => _PenandaTableState();
}

class _PenandaTableState extends State<_PenandaTable> {
  late List<bool?> _ya;
  late List<bool?> _tidak;

  @override
  void initState() {
    super.initState();
    _ya = List<bool?>.filled(widget.items.length, null);
    _tidak = List<bool?>.filled(widget.items.length, null);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner kuning
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF08A),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: const Text(
              'Beri tanda ✓ (centang) pada kolom Ya/Tidak. Jika anak belum bisa melakukan salah satu dari hal berikut ini, segera bawa ke Puskesmas.',
              style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF713F12),
                  height: 1.4),
            ),
          ),
          // Table header
          Container(
            color: widget.accentColor.withOpacity(0.12),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                const SizedBox(
                    width: 28,
                    child: Text('No.',
                        style: TextStyle(
                            fontSize: 12, fontWeight: FontWeight.bold))),
                const Expanded(
                    child: Text('Penanda Perkembangan Anak',
                        style: TextStyle(
                            fontSize: 12, fontWeight: FontWeight.bold))),
                SizedBox(
                    width: 40,
                    child: Center(
                        child: Text('Ya',
                            style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: widget.accentColor)))),
                SizedBox(
                    width: 48,
                    child: Center(
                        child: Text('Tidak',
                            style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.red)))),
              ],
            ),
          ),
          // Table rows
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Column(
              children: List.generate(widget.items.length, (i) {
                final isEven = i % 2 == 0;
                return Container(
                  decoration: BoxDecoration(
                    color: isEven ? Colors.white : const Color(0xFFF8FAFC),
                    borderRadius: i == widget.items.length - 1
                        ? const BorderRadius.only(
                            bottomLeft: Radius.circular(16),
                            bottomRight: Radius.circular(16))
                        : null,
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                          width: 28,
                          child: Text('${i + 1}',
                              style: const TextStyle(
                                  fontSize: 12, color: Colors.black54))),
                      Expanded(
                          child: Text(widget.items[i],
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF1E40AF),
                                  height: 1.4))),
                      SizedBox(
                        width: 40,
                        child: Checkbox(
                          value: _ya[i] == true,
                          activeColor: widget.accentColor,
                          onChanged: (v) => setState(() {
                            _ya[i] = v == true ? true : null;
                            if (v == true) _tidak[i] = null;
                          }),
                        ),
                      ),
                      SizedBox(
                        width: 48,
                        child: Checkbox(
                          value: _tidak[i] == true,
                          activeColor: Colors.red,
                          onChanged: (v) => setState(() {
                            _tidak[i] = v == true ? true : null;
                            if (v == true) _ya[i] = null;
                          }),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// SHARED HEADER BANNER BUILDER
// ─────────────────────────────────────────────
Widget _headerBanner(String title, Color color) {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: color.withOpacity(0.08),
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: color.withOpacity(0.3)),
    ),
    child: Text(
      title,
      style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: color,
          height: 1.4),
    ),
  );
}

// ─────────────────────────────────────────────
// TAB 1 — 0 – 28 HARI
// ─────────────────────────────────────────────
class _Tab028Hari extends StatelessWidget {
  const _Tab028Hari();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner('Perawatan Bayi\nUmur 0 – 28 Hari', const Color(0xFF2563EB)),
          const SizedBox(height: 4),
          const Text(
            'Setelah ibu membaca dan memahami informasi, tandai hal-hal berikut ini.',
            style: TextStyle(fontSize: 13, color: Colors.black54, height: 1.5),
          ),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Cara Menjaga Bayi Tetap Hangat'),
                _BulletItem('Mandikan bayi dengan air hangat 6 jam setelah lahir dengan syarat kondisi stabil.'),
                _BulletItem('Sebelum tali pusat lepas, mandikan bayi dengan cara dilap.', isSubBullet: true),
                _BulletItem('Setelah tali pusat lepas, bayi dapat dimandikan dengan dimasukkan ke dalam air. Hati-hati agar kepala tidak terendam.', isSubBullet: true),
                _BulletItem('Bersihkan kemaluan bayi dari depan ke belakang dengan kapas yang dibasahi air bersih atau handuk bersih basah.'),
                _BulletItem('Beri pakaian dan selimuti setiap saat.'),
                _BulletItem('Pakaikan topi, kaos kaki, kaos tangan jika dirasakan cuaca dingin.'),
                _BulletItem('Lakukan perawatan metode kanguru jika berat badan bayi < 2500 gram.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Bidan/Perawat/Dokter Menjelaskan'),
                _BulletItem('Perawatan metode kanguru bila bayi berada dalam lingkungan udara sejuk.'),
                _BulletItem('Jika menggunakan kipas angin, usahakan agar arah angin tidak langsung mengenai bayi.', isSubBullet: true),
                _BulletItem('Suhu AC sekitar 25 – 26°C.', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Cara Merawat Tali Pusat'),
                _BulletItem('Cuci tangan dengan sabun dan air mengalir sebelum dan sesudah memegang bayi.'),
                _BulletItem('Jangan memberikan apapun pada tali pusat.'),
                _BulletItem('Rawat tali pusat tetap bersih dan kering.'),
                _BulletItem('Jika kotor/basah, cuci dengan air bersih dan sabun, lalu keringkan.'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// TAB 2 — 29 HARI – 3 BULAN
// ─────────────────────────────────────────────
class _Tab29Hari3Bulan extends StatelessWidget {
  const _Tab29Hari3Bulan();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner('Perawatan Bayi\nUmur 29 Hari – 3 Bulan', const Color(0xFF0891B2)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Layanan Kesehatan'),
                _BulletItem('Bawa bayi anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.', isSubBullet: true),
                _BulletItem('Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.', isSubBullet: true),
                _BulletItem('Imunisasi (lihat halaman 124-125).', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionTitle('Manfaat Imunisasi'),
                _imunisasiRow('BCG', 'Mencegah penyakit TBC.'),
                _imunisasiRow('Polio', 'Mencegah polio yang menyebabkan lumpuh layu pada tungkai dan atau lengan.'),
                _imunisasiRow('DPT-HB-Hib', 'Mencegah penyakit difteri, pertusis (batuk rejan), tetanus, hepatitis B, dan meningitis.'),
                _imunisasiRow('PCV', 'Mencegah penyakit pneumonia akibat bakteri pneumokokus.'),
                _imunisasiRow('RV (Rotavirus)', 'Mencegah diare berat yang menyebabkan dehidrasi dan kematian.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pantau Tumbuh Kembang Bayi Anda'),
                _BulletItem('Dukung tumbuh kembang si kecil sesuai perkembangan anak seusianya dengan melakukan stimulasi dalam suasana aman, nyaman dan menyenangkan.'),
                SizedBox(height: 8),
                _SectionTitle('Stimulasi usia 29 hari – 3 bulan:', color: Color(0xFF0891B2)),
                _BulletItem('Peluk, cium, ayun bayi.'),
                _BulletItem('Senyum, tatap mata, ajak bicara.'),
                _BulletItem('Tirukan ocehan dan mimik bayi.'),
                _BulletItem('Interaksi langsung untuk mengenalkan berbagai suara, bunyi, atau nyanyian.'),
                _BulletItem('Gantung benda berwarna, berbunyi.'),
                _BulletItem('Meraih, meraba, pegang mainan.'),
                _BulletItem('Memasukkan benda ke dalam wadah.'),
                _BulletItem('Gulingkan kanan-kiri, tengkurap-telentang.'),
              ],
            ),
          ),
          _PenandaTable(
            accentColor: const Color(0xFF0891B2),
            items: const [
              'Bayi bisa mengangkat kepala mandiri hingga tegak 90°?',
              'Bayi bisa mempertahankan posisi kepala tetap tegak dan stabil?',
              'Bayi bisa menggenggam mainan kecil atau mainan bertangkai?',
              'Bayi bisa meraih benda yang ada di dalam jangkauannya?',
              'Bayi bisa mengamati tangannya sendiri?',
              'Bayi berusaha memperluas pandangan?',
              'Bayi mengarahkan matanya pada benda-benda kecil?',
              'Bayi mengeluarkan suara gembira bernada tinggi atau memekik?',
              'Bayi tersenyum ketika melihat mainan/gambar yang menarik saat bermain sendiri?',
              'Bayi bisa berbalik dari telungkup ke telentang?',
            ],
          ),
        ],
      ),
    );
  }

  Widget _imunisasiRow(String nama, String manfaat) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 90,
            child: Text(nama,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: Color(0xFF1E3A5F))),
          ),
          Expanded(
              child: Text(manfaat,
                  style: const TextStyle(
                      fontSize: 13, color: Colors.black87, height: 1.4))),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// TAB 3 — 3 – 6 BULAN
// ─────────────────────────────────────────────
class _Tab36Bulan extends StatelessWidget {
  const _Tab36Bulan();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner('Perawatan Bayi\nUmur 3 – 6 Bulan', const Color(0xFF7C3AED)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Layanan Kesehatan'),
                _BulletItem('Bawa bayi anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.', isSubBullet: true),
                _BulletItem('Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.', isSubBullet: true),
                _BulletItem('Imunisasi (lihat halaman 124-125).', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Perawatan Gigi'),
                _BulletItem('Cara membersihkan gigi bayi: Gendong atau pangku anak dengan satu tangan.'),
                _BulletItem('Bersihkan gusi anak secara perlahan dengan kain atau lap basah yang dilingkarkan pada jari telunjuk ibu.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pantau Tumbuh Kembang Bayi Anda'),
                _BulletItem('Stimulasi bayi pada rentang usia 3–6 bulan dengan:'),
                _BulletItem('Peluk, cium, pandang mata, senyum, bicara.', isSubBullet: true),
                SizedBox(height: 8),
                _SectionTitle('Aktivitas Stimulasi:', color: Color(0xFF7C3AED)),
                _BulletItem('Mencari sumber suara.'),
                _BulletItem('Cilukba, lihat cermin.'),
                _BulletItem('Tunjuk dan sebut nama gambar.'),
                _BulletItem('Bacakan dongeng.'),
                _BulletItem('Pegang mainan dengan 2 tangan.'),
                _BulletItem('Sembunyikan dan cari mainan.'),
                _BulletItem('Memasukkan benda ke dalam wadah.'),
                _BulletItem('Mainan yang mengapung di air.'),
                _BulletItem('Memukul-mukul.'),
                _BulletItem('Duduk, merangkak, berdiri berpegangan.'),
              ],
            ),
          ),
          _PenandaTable(
            accentColor: const Color(0xFF7C3AED),
            items: const [
              'Bayi bisa berbalik dari telungkup ke telentang?',
              'Bayi bisa mengangkat kepala secara mandiri hingga tegak 90 °?',
              'Bayi bisa mempertahankan posisi kepala tetap tegak dan stabil?',
              'Bayi bisa menggenggam mainan kecil atau mainan bertangkai?',
              'Bayi bisa meraih benda yang ada dalam jangkauannya?',
              'Bayi bisa mengamati tangannya sendiri?',
              'Bayi berusaha memperluas pandangan?',
              'Bayi mengarahkan matanya pada benda-benda kecil?',
              'Bayi mengeluarkan suara gembira bernada tinggi atau memekik?',
              'Bayi tersenyum ketika melihat mainan/gambar yang menarik saat bermain sendiri?',
            ],
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// TAB 4 — 6 – 9 BULAN
// ─────────────────────────────────────────────
class _Tab69Bulan extends StatelessWidget {
  const _Tab69Bulan();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner('Perawatan Bayi\nUmur 6 – 9 Bulan', const Color(0xFF059669)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Layanan Kesehatan'),
                _BulletItem('Bawa bayi anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.', isSubBullet: true),
                _BulletItem('Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.', isSubBullet: true),
                _BulletItem('Kapsul Vitamin A (bulan Februari atau Agustus).', isSubBullet: true),
                _BulletItem('Imunisasi (lihat halaman 124-125).', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Manfaat Imunisasi'),
                _BulletItem('Campak-Rubella mencegah penularan penyakit yang dapat mengakibatkan masalah radang paru, radang otak dan kebutaan.'),
                SizedBox(height: 8),
                _SectionTitle('Manfaat Vitamin A'),
                _BulletItem('Vitamin A untuk meningkatkan kesehatan mata dan pertumbuhan anak.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Perawatan Gigi'),
                _BulletItem('Perhatikan tumbuhnya 4 gigi seri rahang atas dan rahang bawah.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pantau Tumbuh Kembang Bayi Anda'),
                _SectionTitle('Stimulasi usia 6–9 bulan:', color: Color(0xFF059669)),
                _BulletItem('Peluk, senyum, bicara, panggil namanya.'),
                _BulletItem('Bersalaman, tepuk tangan, melambai ke orang lain.'),
                _BulletItem('Kenalkan/tunjuk nama orang (papa/mama).'),
                _BulletItem('Cilukba, lihat cermin.'),
                _BulletItem('Tunjuk dan sebut nama gambar.'),
                _BulletItem('Bacakan dongeng.'),
                _BulletItem('Pegang mainan dengan 2 tangan.'),
                _BulletItem('Masukkan benda kecil ke dalam wadah.'),
                _BulletItem('Sembunyikan dan cari mainan.'),
                _BulletItem('Mainan yang mengapung di air.'),
                _BulletItem('Memukul-mukul.'),
                _BulletItem('Duduk, merangkak, berdiri berpegangan.'),
              ],
            ),
          ),
          _PenandaTable(
            accentColor: const Color(0xFF059669),
            items: const [
              'Bayi bisa duduk secara mandiri?',
              'Bayi belajar berdiri, kedua kakinya menyangga sebagian berat badan?',
              'Bayi bisa merangkak meraih mainan atau mendekati seseorang?',
              'Bayi bisa memindahkan benda dari satu tangan ke tangan lainnya?',
              'Bayi bisa memungut 2 benda, kedua tangan pegang 2 benda pada saat bersamaan?',
              'Bayi bisa memungut benda sebesar kacang dari cara meraup?',
              'Bayi bersuara tanpa arti, mamama, bababa, dadada, tatata?',
              'Bayi mencari mainan/benda yang dijatuhkan?',
              'Bayi bermain tepuk tangan/Cilukba?',
              'Bayi bergembira dengan melempar benda?',
              'Bayi bergembira dengan melempar benda?',
            ],
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// TAB 5 — 9 – 12 BULAN
// ─────────────────────────────────────────────
class _Tab912Bulan extends StatelessWidget {
  const _Tab912Bulan();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner('Perawatan Bayi\nUmur 9 – 12 Bulan', const Color(0xFFDC2626)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Layanan Kesehatan'),
                _BulletItem('Bawa bayi anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.', isSubBullet: true),
                _BulletItem('Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.', isSubBullet: true),
                _BulletItem('Kapsul Vitamin A (bulan Februari atau Agustus).', isSubBullet: true),
                _BulletItem('Imunisasi (lihat halaman 124-125).', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Manfaat Imunisasi'),
                _BulletItem('JE: Mencegah anak dari penyakit radang otak.'),
                SizedBox(height: 8),
                _SectionTitle('Perawatan Gigi'),
                _BulletItem('Lanjutkan perawatan gigi. Pada usia 9 bulan biasanya sudah ada gigi seri 8 buah, gigi geraham 4 buah.'),
                _BulletItem('Bersihkan gigi anak menggunakan kasa yang diberi air hangat dengan sedikit pasta gigi anak.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pantau Tumbuh Kembang Bayi Anda'),
                _SectionTitle('Stimulasi usia 9–12 bulan:', color: Color(0xFFDC2626)),
                _BulletItem('Berbicara dengan boneka.'),
                _BulletItem('Menunjuk dan mengucapkan orang/benda/organ tubuh yang sudah dikenal.'),
                _BulletItem('Bacakan dongeng pada saat mengenalkan dan menyuruh menunjuk.'),
                _BulletItem('Pegang mainan dengan 2 tangan.'),
                _BulletItem('Memasukkan benda kecil ke dalam wadah.'),
                _BulletItem('Menyusun balok.'),
                _BulletItem('Sembunyikan dan cari mainan.'),
                _BulletItem('Memegang pensil dan mencoret-coret kertas.'),
                _BulletItem('Duduk, merangkak, berdiri berpegangan.'),
                _BulletItem('Berjalan mundur, jinjit.'),
              ],
            ),
          ),
          _PenandaTable(
            accentColor: const Color(0xFFDC2626),
            items: const [
              'Bayi bisa mengangkat badannya ke posisi berdiri?',
              'Bayi belajar berdiri selama 30 detik atau berpegangan di kursi?',
              'Bayi dapat berjalan dengan dituntun?',
              'Bayi mengulurkan lengan/badan untuk meraih mainan yang diinginkan?',
              'Bayi bisa menggenggam erat pensil?',
              'Bayi bisa memasukkan benda ke mulut?',
              'Bayi mengulang menirukan bunyi yang didengar?',
              'Bayi menyebut 2-3 suku kata yang sama tanpa arti?',
              'Bayi mengeksplorasi sekitar, ingin tahu, ingin menyentuh apa saja?',
              'Bayi bereaksi terhadap suara yang perlahan atau bisikan?',
              'Bayi senang diajak bermain Cilukba?',
              'Bayi mengenal anggota keluarga, takut pada orang yang belum dikenal?',
            ],
          ),
        ],
      ),
    );
  }
}