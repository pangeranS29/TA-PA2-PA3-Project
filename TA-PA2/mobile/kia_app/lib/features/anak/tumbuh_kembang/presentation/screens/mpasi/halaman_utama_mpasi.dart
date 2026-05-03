import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/data/models/anak_detail_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/mpasi/materi_mpasi.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/mpasi/porsi_mpasi.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/screens/mpasi/resep_mpasi.dart';

class HalamanUtamaMpasiScreen extends StatefulWidget {
  final Map<String, dynamic> anak;

  const HalamanUtamaMpasiScreen({
    super.key,
    required this.anak,
  });

  @override
  State<HalamanUtamaMpasiScreen> createState() =>
      _HalamanUtamaMpasiScreenState();
}

class _HalamanUtamaMpasiScreenState extends State<HalamanUtamaMpasiScreen> {
  late AnakDetailModel anakData;
  bool isLoading = true;
  bool hasError = false;
  String errorMessage = '';

  @override
  void initState() {
    super.initState();
    _initializeAnakData();
  }

  Future<void> _initializeAnakData() async {
    try {
      // TODO: Integrasikan dengan API untuk fetch data anak detail menggunakan widget.anak
      // Untuk sekarang, menggunakan dummy data berdasarkan widget.anak
      await Future.delayed(const Duration(milliseconds: 500));

      setState(() {
        anakData = AnakDetailModel(
          id: 1,
          noKartuKeluarga: 1234567890,
          namaAnak: widget.anak['nama'] ?? 'Anak',
          jenisKelamin: 'Laki-laki',
          tanggalLahir: '2025-09-27',
          beratLahir: 3.5,
          tinggiLahir: 50.0,
          ibu: IbuModel(namaIbu: 'Ibu Contoh'),
        );
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        hasError = true;
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('MPASI Anak'),
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (hasError) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('MPASI Anak'),
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
        body: Center(
          child: Text('Error: $errorMessage'),
        ),
      );
    }

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
                  const SizedBox(height: 32),
                  _buildMenuUtama(),
                  const SizedBox(height: 24),
                  _buildKandunganGiziSection(),
                  const SizedBox(height: 24),
                  _buildTanyaAhliCard(),
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
        'MPASI Anak',
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
                  anakData.namaAnak,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Usia: ${_calculateAge()} Bulan',
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
                      'MPASI sesuai usia anak',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Dapatkan panduan nutrisi tepat untuk tumbuh kembang optimal.',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
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

  Widget _buildMenuUtama() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Menu Utama',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 16),
        _buildMenuCard(
          icon: Icons.book_outlined,
          title: 'Materi MPASI',
          subtitle: 'Panduan & Edukasi',
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => MateriMpasiScreen(
                  anakData: anakData,
                  usiaChild: _calculateAge(),
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildMenuCard(
          icon: Icons.schedule,
          title: 'Porsi & Jadwal',
          subtitle: 'Atur waktu makan',
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => PorsiMpasiScreen(
                  anakData: anakData,
                  usiaChild: _calculateAge(),
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 12),
        _buildMenuCard(
          icon: Icons.restaurant_menu,
          title: 'Resep Harian',
          subtitle: 'Menu sehat bergizi',
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ResepMpasiScreen(
                  anakData: anakData,
                  usiaChild: _calculateAge(),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildMenuCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFF1976D2).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: const Color(0xFF1976D2),
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
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
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: Colors.grey,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKandunganGiziSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Kandungan Gizi',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 16),
        _buildGiziCard(
          label: 'Protein',
          value: '15g',
          color: Colors.green,
        ),
        const SizedBox(height: 12),
        _buildGiziCard(
          label: 'Karbohidrat',
          value: '45g',
          color: Colors.orange,
        ),
        const SizedBox(height: 12),
        _buildGiziCard(
          label: 'Lemak',
          value: '10g',
          color: Colors.pink,
        ),
      ],
    );
  }

  Widget _buildGiziCard({
    required String label,
    required String value,
    required Color color,
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
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(Icons.apple, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTanyaAhliCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F4FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF1976D2).withOpacity(0.2),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFF1976D2).withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.chat_outlined,
              color: Color(0xFF1976D2),
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Tanya Ahli',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Konsultasi dengan dokter',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.arrow_forward_ios,
            size: 16,
            color: Colors.grey,
          ),
        ],
      ),
    );
  }

  /// Hitung usia anak dalam bulan berdasarkan tanggal lahir
  int _calculateAge() {
    final birthDate = DateTime.parse(anakData.tanggalLahir);
    final today = DateTime.now();
    int months = today.month - birthDate.month;
    int years = today.year - birthDate.year;

    if (today.day < birthDate.day) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return (years * 12) + months;
  }
}
