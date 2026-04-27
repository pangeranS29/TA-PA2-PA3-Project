import 'package:flutter/material.dart';

class PerawatanAnakScreen extends StatelessWidget {
  const PerawatanAnakScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        backgroundColor: const Color(0xFFF1F5F9),
        appBar: AppBar(
          title: const Text('Perawatan Anak',
              style: TextStyle(fontWeight: FontWeight.bold)),
          backgroundColor: Colors.white,
          foregroundColor: Colors.black87,
          elevation: 0,
          bottom: const TabBar(
            isScrollable: true,
            labelColor: Color(0xFFD97706),
            unselectedLabelColor: Colors.grey,
            indicatorColor: Color(0xFFD97706),
            labelStyle: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
            tabs: [
              Tab(text: '2–3 Tahun'),
              Tab(text: '3–4 Tahun'),
              Tab(text: '4–5 Tahun'),
              Tab(text: '5–6 Tahun'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _Tab23Tahun(),
            _Tab34Tahun(),
            _Tab45Tahun(),
            _Tab56Tahun(),
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
                      : const Color(0xFFD97706),
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
// TAB 1 — 2 – 3 TAHUN
// ─────────────────────────────────────────────
class _Tab23Tahun extends StatelessWidget {
  const _Tab23Tahun();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner(
              'Perawatan Anak\nUmur 2 – 3 Tahun', const Color(0xFFD97706)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pelayanan Kesehatan'),
                _BulletItem(
                    'Bawa anak anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.',
                    isSubBullet: true),
                _BulletItem(
                    'Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.',
                    isSubBullet: true),
                _BulletItem(
                    'Kapsul Vitamin A (Februari atau Agustus).',
                    isSubBullet: true),
                _BulletItem('Obat cacing.', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Perawatan Gigi'),
                _BulletItem(
                    'Lanjutkan perawatan gigi dengan mengingatkan anak menyikat gigi setelah makan dan sebelum tidur.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionTitle('Pantau Tumbuh Kembang Anak Anda'),
                const _BulletItem(
                    'Dukung tumbuh kembang si kecil sesuai perkembangan anak seusianya dengan melakukan stimulasi dalam suasana aman, nyaman dan menyenangkan.'),
                const SizedBox(height: 8),
                const _SectionTitle('Stimulasi usia 2–3 tahun:',
                    color: Color(0xFFD97706)),
                const _BulletItem('Sebutkan nama benda, sifat, guna benda.'),
                const _BulletItem('Bacakan cerita, tanya jawab.'),
                const _BulletItem(
                    'Anak diminta bercerita pengalaman menonton TV didampingi maksimal 1 jam, menyanyi.'),
                const SizedBox(height: 8),
                const _SectionTitle('Aktivitas Stimulasi:',
                    color: Color(0xFFD97706)),
                const _BulletItem('Cuci tangan, cebok, berpakaian, rapikan mainan.'),
                const _BulletItem('Makan dengan sendok garpu.'),
                const _BulletItem(
                    'Menyusun balok, memasang puzzle, menggambar, menempel.'),
                const _BulletItem('Mengelompokkan benda sejenis.'),
                const _BulletItem('Mencocokkan gambar dan benda.'),
                const _BulletItem('Menghitung.'),
                const _BulletItem(
                    'Berlari, melompat, memanjat, merayap.'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// TAB 2 — 3 – 4 TAHUN
// ─────────────────────────────────────────────
class _Tab34Tahun extends StatelessWidget {
  const _Tab34Tahun();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner(
              'Perawatan Anak\nUmur 3 – 4 Tahun', const Color(0xFF7C3AED)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pelayanan Kesehatan'),
                _BulletItem(
                    'Bawa anak anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.',
                    isSubBullet: true),
                _BulletItem(
                    'Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.',
                    isSubBullet: true),
                _BulletItem(
                    'Kapsul Vitamin A (Februari atau Agustus).',
                    isSubBullet: true),
                _BulletItem('Obat cacing.', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Perawatan Gigi'),
                _BulletItem(
                    'Lanjutkan perawatan gigi dengan mengingatkan anak menyikat gigi setelah makan dan sebelum tidur.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionTitle('Pantau Tumbuh Kembang Anak Anda'),
                const _BulletItem(
                    'Dukung tumbuh kembang si kecil sesuai perkembangan anak seusianya dengan melakukan stimulasi dalam suasana aman, nyaman dan menyenangkan.'),
                const SizedBox(height: 8),
                const _SectionTitle('Stimulasi usia 3–4 tahun:',
                    color: Color(0xFF7C3AED)),
                const _BulletItem('Menyebutkan nama benda, sifat, guna benda.'),
                const _BulletItem('Bacakan cerita, tanya jawab.'),
                const _BulletItem('Anak diminta bercerita pengalaman.'),
                const _BulletItem('Menonton TV didampingi, menyanyi.'),
                const SizedBox(height: 8),
                const _SectionTitle('Aktivitas Stimulasi:',
                    color: Color(0xFF7C3AED)),
                const _BulletItem('Cuci tangan, cebok, berpakaian, rapikan mainan.'),
                const _BulletItem('Makan dengan sendok garpu.'),
                const _BulletItem(
                    'Menyusun balok, memasang puzzle, menggambar, menempel.'),
                const _BulletItem('Mengelompokkan benda sejenis.'),
                const _BulletItem('Mencocokkan gambar dan benda.'),
                const _BulletItem('Menghitung.'),
                const _BulletItem('Melempar, menangkap.'),
                const _BulletItem(
                    'Berlari, melompat, memanjat, merayap.'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// TAB 3 — 4 – 5 TAHUN
// ─────────────────────────────────────────────
class _Tab45Tahun extends StatelessWidget {
  const _Tab45Tahun();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner(
              'Perawatan Anak\nUmur 4 – 5 Tahun', const Color(0xFFDC2626)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pelayanan Kesehatan'),
                _BulletItem(
                    'Bawa anak anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.',
                    isSubBullet: true),
                _BulletItem(
                    'Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.',
                    isSubBullet: true),
                _BulletItem(
                    'Kapsul Vitamin A (Februari atau Agustus).',
                    isSubBullet: true),
                _BulletItem('Obat cacing.', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Perawatan Gigi'),
                _BulletItem(
                    'Lanjutkan perawatan gigi dengan mengingatkan anak menyikat gigi setelah makan dan sebelum tidur.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionTitle('Pantau Tumbuh Kembang Anak Anda'),
                const _BulletItem(
                    'Dukung tumbuh kembang si kecil sesuai perkembangan anak seusianya dengan melakukan stimulasi dalam suasana aman, nyaman dan menyenangkan.'),
                const SizedBox(height: 8),
                const _SectionTitle('Stimulasi usia 4–5 tahun:',
                    color: Color(0xFFDC2626)),
                const _BulletItem(
                    'Bermain peran, anak diminta bercerita pengalaman.'),
                const _BulletItem('Menggambar orang, mengenal huruf.'),
                const _BulletItem('Main bola, lompat tali.'),
                const _BulletItem(
                    'Latih untuk dapat mengikuti aturan permainan.'),
                const _BulletItem('Kenalkan nama-nama hari.'),
                const _BulletItem('Menyebut angka berurutan.'),
                const _BulletItem(
                    'Mengajak anak sikat gigi bersama dan melatih sikat gigi sendiri.'),
                const _BulletItem('Melatih memakai pakaian sendiri.'),
                const _BulletItem('Menguatkan kepercayaan diri anak.'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────
// TAB 4 — 5 – 6 TAHUN
// ─────────────────────────────────────────────
class _Tab56Tahun extends StatelessWidget {
  const _Tab56Tahun();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _headerBanner(
              'Perawatan Anak\nUmur 5 – 6 Tahun', const Color(0xFF0891B2)),
          const SizedBox(height: 16),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Pelayanan Kesehatan'),
                _BulletItem(
                    'Bawa anak anda setiap bulan ke Posyandu/Puskesmas/Fasilitas Kesehatan untuk mendapat pelayanan:'),
                _BulletItem('Pemantauan pertumbuhan dan perkembangan.',
                    isSubBullet: true),
                _BulletItem(
                    'Ibu/Ayah/Keluarga mengikuti kelas Ibu Balita.',
                    isSubBullet: true),
                _BulletItem('Obat cacing.', isSubBullet: true),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                _SectionTitle('Perawatan Gigi'),
                _BulletItem(
                    'Lanjutkan perawatan gigi anak dengan: gigi susu sudah tumbuh semua: 20 buah, mulai tumbuh 2 gigi geraham tetap, rahang bawah pertama kiri dan kanan.'),
                _BulletItem(
                    'Periksa gigi anak secara rutin setiap 3-6 bulan sekali ke dokter gigi atau perawat gigi di Puskesmas atau fasilitas kesehatan lainnya.'),
              ],
            ),
          ),
          _InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionTitle('Pantau Tumbuh Kembang Anak Anda'),
                const _BulletItem(
                    'Dukung tumbuh kembang si kecil sesuai perkembangan anak seusianya dengan melakukan stimulasi dalam suasana aman, nyaman dan menyenangkan.'),
                const SizedBox(height: 8),
                const _SectionTitle('Stimulasi usia 5–6 tahun:',
                    color: Color(0xFF0891B2)),
                const _BulletItem('Mengenal nama, fungsi benda-benda.'),
                const _BulletItem(
                    'Bacakan buku, tanya jawab, bercerita.'),
                const _BulletItem(
                    'Menonton TV didampingi maksimal 1 jam, menyanyi.'),
                const _BulletItem(
                    'Cuci tangan, cebok, berpakaian, rapikan mainan.'),
                const _BulletItem('Melempar, menangkap, berlari, melompat.'),
                const SizedBox(height: 8),
                const _SectionTitle('Aktivitas Stimulasi:',
                    color: Color(0xFF0891B2)),
                const _BulletItem('Makan dengan sendok garpu, masak-masakan.'),
                const _BulletItem('Menggunting, menempel, menjahit.'),
                const _BulletItem(
                    'Menyusun balok, memasang puzzle, menggambar, mewarnai, menulis nama.'),
                const _BulletItem(
                    'Mengingat, menghafal, mengerti aturan dan urutan.'),
                const _BulletItem(
                    'Membandingkan besar kecil, banyak sedikit.'),
                const _BulletItem(
                    'Menghitung, konsep satu dan setengah.'),
                const _BulletItem(
                    'Mengenal angka, huruf, simbol, jam, hari dan tanggal.'),
                const _BulletItem(
                    'Memanjat, merayap, sepeda roda 3, ayunan.'),
                const _BulletItem(
                    'Bermain berjualan, bertukang, dan mengukur.'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}