import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/data/models/anak_detail_model.dart';

class ResepMpasiScreen extends StatefulWidget {
  final AnakDetailModel anakData;
  final int usiaChild;

  const ResepMpasiScreen({
    super.key,
    required this.anakData,
    required this.usiaChild,
  });

  @override
  State<ResepMpasiScreen> createState() => _ResepMpasiScreenState();
}

class _ResepMpasiScreenState extends State<ResepMpasiScreen> {
  late String selectedCategory;
  String searchQuery = '';
  final List<String> categories = ['Semua', '6-8 Bulan', '9-11 Bulan', '12+ Bulan'];

  // Model untuk Resep
  List<ResepModel> get resepList => _getResepByUsia();

  @override
  void initState() {
    super.initState();
    selectedCategory = _defaultCategoryForUsia();
  }

  String _defaultCategoryForUsia() {
    final age = widget.usiaChild;
    if (age <= 8) {
      return '6-8 Bulan';
    }
    if (age <= 11) {
      return '9-11 Bulan';
    }
    return '12+ Bulan';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildCategoryFilter(),
                  const SizedBox(height: 20),
                  _buildResepList(),
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
        'Resep Harian',
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

  Widget _buildCategoryFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSearchField(),
        const SizedBox(height: 18),
        const Text(
          'Pilih usia resep sesuai kebutuhan',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Dari resep keluarga matang hingga bahan mentah, semua sesuai panduan KIA.',
          style: TextStyle(
            fontSize: 12,
            color: Colors.black54,
            height: 1.4,
          ),
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: categories.map((category) {
              final isSelected = selectedCategory == category;
              return Padding(
                padding: const EdgeInsets.only(right: 10),
                child: ChoiceChip(
                  label: Text(
                    category,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.black87,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: const Color(0xFF185FA5),
                  backgroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                    side: BorderSide(
                      color: isSelected ? const Color(0xFF185FA5) : Colors.grey.shade300,
                    ),
                  ),
                  onSelected: (value) {
                    setState(() {
                      selectedCategory = category;
                    });
                  },
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildSearchField() {
    return TextField(
      onChanged: (value) {
        setState(() {
          searchQuery = value;
        });
      },
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        filled: true,
        fillColor: Colors.white,
        prefixIcon: const Icon(Icons.search, color: Color(0xFF5E6E8D)),
        hintText: 'Cari resep sehat untuk anak',
        hintStyle: const TextStyle(color: Color(0xFF8A95A6)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFF185FA5)),
        ),
      ),
    );
  }

  Widget _buildResepList() {
    final filteredResep = _getFilteredResep();

    if (filteredResep.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 40),
          child: Column(
            children: [
              Icon(
                Icons.restaurant_menu,
                size: 48,
                color: Colors.grey.shade300,
              ),
              const SizedBox(height: 16),
              Text(
                'Belum ada resep untuk kategori ini',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: filteredResep.length,
      separatorBuilder: (context, index) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        return _buildResepCard(filteredResep[index]);
      },
    );
  }

  List<ResepModel> _getFilteredResep() {
    var results = selectedCategory == 'Semua'
        ? resepList
        : resepList.where((r) => r.kelompokUsia.contains(selectedCategory)).toList();

    if (searchQuery.isNotEmpty) {
      results = results
          .where((r) => r.nama.toLowerCase().contains(searchQuery.toLowerCase()))
          .toList();
    }

    return results;
  }

  Widget _buildResepCard(ResepModel resep) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          _showResepDetailModal(resep);
        },
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 62,
                height: 62,
                decoration: BoxDecoration(
                  color: _getCategoryColor(resep.kategori).withOpacity(0.14),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  _getCategoryIcon(resep.kategori),
                  color: _getCategoryColor(resep.kategori),
                  size: 30,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      resep.nama,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.child_care, size: 14, color: Colors.grey.shade600),
                        const SizedBox(width: 6),
                        Text(
                          'Usia ${resep.kelompokUsia.first}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade700,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(Icons.schedule, size: 14, color: Colors.grey.shade600),
                        const SizedBox(width: 6),
                        Text(
                          'Durasi ${resep.waktuMasak} Menit',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade700,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF185FA5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                ),
                onPressed: () => _showResepDetailModal(resep),
                child: const Text(
                  'Detail',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showResepDetailModal(ResepModel resep) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(24),
              topRight: Radius.circular(24),
            ),
          ),
          child: SingleChildScrollView(
            controller: scrollController,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade300,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        resep.nama,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          _buildInfoChip(Icons.schedule, '${resep.waktuMasak} min'),
                          const SizedBox(width: 8),
                          _buildInfoChip(Icons.people, resep.porsi),
                        ],
                      ),
                      const SizedBox(height: 20),
                      _buildSectionTitle('Bahan-bahan'),
                      const SizedBox(height: 12),
                      ...resep.bahan.map((b) => _buildBahanItem(b)).toList(),
                      const SizedBox(height: 20),
                      _buildSectionTitle('Cara Membuat'),
                      const SizedBox(height: 12),
                      ...resep.caraMembuat.asMap().entries.map((entry) {
                        return _buildStepItem(entry.key + 1, entry.value);
                      }).toList(),
                      const SizedBox(height: 20),
                      _buildSectionTitle('Manfaat'),
                      const SizedBox(height: 12),
                      ...resep.manfaat.map((m) => _buildManfaatItem(m)).toList(),
                      const SizedBox(height: 20),
                      _buildSectionTitle('Tips'),
                      const SizedBox(height: 12),
                      ...resep.tips.map((t) => _buildTipsItem(t)).toList(),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF1976D2).withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: const Color(0xFF1976D2)),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Color(0xFF1976D2),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBahanItem(String bahan) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: Color(0xFF1976D2),
                shape: BoxShape.circle,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              bahan,
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

  Widget _buildStepItem(int step, String instruction) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 30,
            height: 30,
            decoration: const BoxDecoration(
              color: Color(0xFF1976D2),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                step.toString(),
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                instruction,
                style: const TextStyle(
                  fontSize: 13,
                  color: Colors.black87,
                  height: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildManfaatItem(String manfaat) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Icon(
              Icons.check_circle,
              size: 18,
              color: Colors.green.shade600,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              manfaat,
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

  Widget _buildTipsItem(String tips) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Icon(
              Icons.lightbulb,
              size: 18,
              color: Colors.amber.shade600,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              tips,
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

  Color _getCategoryColor(String kategori) {
    switch (kategori) {
      case 'Makanan Keluarga':
        return const Color(0xFF1976D2);
      case 'Bahan Mentah':
        return const Color(0xFF2E7D32);
      case 'Buah-buahan':
        return Colors.red.shade600;
      case 'Sayuran':
        return Colors.green.shade600;
      case 'Protein':
        return Colors.orange.shade600;
      case 'Karbohidrat':
        return Colors.amber.shade700;
      default:
        return const Color(0xFF1976D2);
    }
  }

  IconData _getCategoryIcon(String kategori) {
    switch (kategori) {
      case 'Makanan Keluarga':
        return Icons.family_restroom;
      case 'Bahan Mentah':
        return Icons.food_bank;
      case 'Buah-buahan':
        return Icons.apple;
      case 'Sayuran':
        return Icons.grass;
      case 'Protein':
        return Icons.egg;
      case 'Karbohidrat':
        return Icons.grain;
      default:
        return Icons.restaurant;
    }
  }

  List<ResepModel> _getResepByUsia() {
    return [
      // 6-8 Bulan
      ResepModel(
        nama: 'Puree Apel Manis',
        kategori: 'Buah-buahan',
        kelompokUsia: ['6-8 Bulan'],
        waktuMasak: 15,
        porsi: '1 porsi (100g)',
        bahan: [
          '2 buah apel merah matang',
          'Air matang sedikit',
          'Minyak zaitun 1 tsp (opsional)',
        ],
        caraMembuat: [
          'Cuci apel dengan air mengalir hingga bersih',
          'Kupas dan hilangkan biji apel',
          'Potong-potong kecil',
          'Blender dengan sedikit air matang hingga halus',
          'Saring jika diperlukan untuk hasil yang lebih lembut',
          'Sajikan dalam suhu ruangan',
        ],
        manfaat: [
          'Kaya akan vitamin C untuk meningkatkan imunitas',
          'Kandungan serat membantu pencernaan',
          'Apel merah mengandung antosianin yang baik untuk kesehatan mata',
          'Mudah dicerna untuk bayi 6-8 bulan',
        ],
        tips: [
          'Gunakan apel yang sudah matang dan manis',
          'Bisa disimpan di kulkas hingga 48 jam dalam wadah tertutup',
          'Jangan tambahkan garam atau gula tambahan',
          'Mulai dengan porsi kecil untuk memantau reaksi alergi',
        ],
      ),
      ResepModel(
        nama: 'Puree Labu Kuning',
        kategori: 'Sayuran',
        kelompokUsia: ['6-8 Bulan'],
        waktuMasak: 20,
        porsi: '1 porsi (100g)',
        bahan: [
          '200g labu kuning segar',
          'Air matang untuk memasak',
          'Minyak zaitun ½ tsp (opsional)',
        ],
        caraMembuat: [
          'Cuci labu kuning dan kupas kulitnya',
          'Hilangkan biji dan seratnya',
          'Potong-potong kecil (ukuran sekitar 2x2 cm)',
          'Kukus atau rebus labu hingga empuk (15-20 menit)',
          'Blender dengan sedikit air rebusan labu hingga halus',
          'Tambahkan minyak zaitun jika diperlukan',
        ],
        manfaat: [
          'Kaya akan beta-karoten yang baik untuk perkembangan mata',
          'Meningkatkan sistem imun bayi',
          'Mudah dicerna dan cocok untuk MPASI pertama',
          'Kandungan vitamin A tinggi untuk pertumbuhan sel',
        ],
        tips: [
          'Pilih labu kuning yang berwarna cerah dan tidak busuk',
          'Labu kuning bisa disimpan hingga 1 minggu di kulkas',
          'Puree bisa disimpan di freezer hingga 3 bulan dalam ice cube tray',
          'Hati-hati saat mengupas karena labu kuning keras',
        ],
      ),
      ResepModel(
        nama: 'Bubur Beras Putih',
        kategori: 'Karbohidrat',
        kelompokUsia: ['6-8 Bulan'],
        waktuMasak: 45,
        porsi: '1 porsi (150g)',
        bahan: [
          '50g beras putih (1/4 cup)',
          '300ml air matang',
          'Sedikit garam (opsional, hanya ¼ sdt)',
        ],
        caraMembuat: [
          'Cuci beras dengan air dingin beberapa kali hingga air terlihat jernih',
          'Masukkan beras ke dalam panci',
          'Tuangkan air matang',
          'Masak dengan api kecil hingga rata-rata 40-45 menit',
          'Aduk sesekali agar tidak lengket di dasar',
          'Bubur sudah jadi saat beras sudah lembut dan air terabsorpsi',
          'Blender atau tumbuk hingga halus sesuai kesiapan bayi',
        ],
        manfaat: [
          'Sumber energi utama untuk pertumbuhan bayi',
          'Mudah dicerna oleh sistem pencernaan bayi',
          'Tidak mengandung gluten sehingga aman',
          'Beras putih relatif jarang menyebabkan alergi',
        ],
        tips: [
          'Menggunakan rice cooker akan membuat lebih mudah',
          'Jangan tambahkan garam atau gula berlebihan',
          'Bisa ditambahkan puree buah atau sayuran',
          'Simpan sisa bubur di kulkas maksimal 24 jam',
        ],
      ),

      // 9-11 Bulan
      ResepModel(
        nama: 'Ubi Jalar Panggang dengan Ayam',
        kategori: 'Protein',
        kelompokUsia: ['9-11 Bulan'],
        waktuMasak: 35,
        porsi: '1 porsi (150g)',
        bahan: [
          '150g ubi jalar',
          '50g ayam fillet',
          'Minyak zaitun 1 tsp',
          'Air matang sedikit',
        ],
        caraMembuat: [
          'Cuci ubi jalar hingga bersih',
          'Panggang atau kukus ubi jalar hingga empuk (25-30 menit)',
          'Dinginkan dan kupas kulit ubi jalar',
          'Potong-potong ayam fillet',
          'Kukus ayam dalam panci terpisah dengan sedikit air selama 15 menit',
          'Potong ayam menjadi bagian yang kecil',
          'Campur ubi jalar dengan ayam yang sudah dimasak',
          'Tumbuk kasar atau sesuai kesiapan bayi',
        ],
        manfaat: [
          'Ubi jalar kaya akan beta-karoten untuk kesehatan mata',
          'Ayam adalah sumber protein berkualitas tinggi',
          'Kombinasi ini memberikan energi dan protein seimbang',
          'Membantu perkembangan otot dan tulang bayi',
        ],
        tips: [
          'Pilih ayam organik jika memungkinkan',
          'Potong ayam sangat kecil untuk mencegah tersedak',
          'Bisa disimpan di kulkas hingga 24 jam',
          'Jangan tambahkan garam berlebihan',
        ],
      ),
      ResepModel(
        nama: 'Nasi Lembut dengan Ikan Salmon',
        kategori: 'Karbohidrat',
        kelompokUsia: ['9-11 Bulan'],
        waktuMasak: 50,
        porsi: '1 porsi (150g)',
        bahan: [
          '100g beras putih',
          '50g ikan salmon segar',
          '300ml air matang',
          'Minyak zaitun 1 tsp',
        ],
        caraMembuat: [
          'Cuci beras hingga air bening',
          'Masak beras dengan 300ml air hingga lembut dan lalu tumbuk kasar',
          'Siapkan ikan salmon dengan membuang tulang dan kulitnya',
          'Kukus salmon dengan sedikit air matang selama 10-15 menit',
          'Hancurkan salmon dengan hati-hati',
          'Campur nasi lembut dengan salmon yang sudah dimasak',
          'Aduk rata dan tambahkan minyak zaitun',
        ],
        manfaat: [
          'Ikan salmon kaya omega-3 untuk perkembangan otak bayi',
          'Protein tinggi untuk pertumbuhan otot',
          'Salmon mudah dicerna oleh bayi',
          'Kombinasi dengan nasi memberikan energi lengkap',
        ],
        tips: [
          'Pastikan salmon benar-benar segar atau bekunya dicairkan dengan baik',
          'Buang semua tulang halus sebelum memberikan ke bayi',
          'Bisa disimpan maksimal 24 jam di kulkas',
          'Jangan menggoreng salmon untuk bayi segini umur',
        ],
      ),

      // 12+ Bulan
      ResepModel(
        nama: 'Lumpia Bayam Mini',
        kategori: 'Sayuran',
        kelompokUsia: ['12+ Bulan'],
        waktuMasak: 25,
        porsi: '2-3 lumpia',
        bahan: [
          '150g bayam segar',
          '50g tahu yang sudah dikukus',
          '25g wortel parut halus',
          '2 lembar kulit lumpia',
          'Minyak zaitun 1 tsp untuk mengoleskan',
        ],
        caraMembuat: [
          'Cuci bayam dan buang batangnya',
          'Kukus bayam selama 5 menit hingga empuk',
          'Peras bayam untuk menghilangkan airnya',
          'Haluskan tahu yang sudah dikukus',
          'Campur bayam, tahu, dan wortel parut',
          'Letakkan adonan di kulit lumpia',
          'Gulung dan lem dengan air putih',
          'Oles permukaan dengan minyak zaitun',
          'Panggang di oven 180°C selama 15 menit hingga kecoklatan',
        ],
        manfaat: [
          'Bayam kaya zat besi untuk mencegah anemia',
          'Tahu adalah sumber protein nabati yang baik',
          'Sayuran variasi untuk memperkenalkan rasa berbeda',
          'Tekstur lumpia cocok untuk bayi yang sudah mulai mengunyah',
        ],
        tips: [
          'Potong lumpia menjadi ukuran bite-size untuk bayi',
          'Bisa dipanggang, dikukus, atau digoreng dengan minyak sedikit',
          'Simpan di kulkas hingga 48 jam atau freeze hingga 1 bulan',
          'Hati-hati dengan kulit lumpia agar tidak tersedak',
        ],
      ),
      ResepModel(
        nama: 'Nasi Goreng Lembut Bayi',
        kategori: 'Karbohidrat',
        kelompokUsia: ['12+ Bulan'],
        waktuMasak: 20,
        porsi: '1 porsi (150g)',
        bahan: [
          '150g nasi putih yang sudah dingin',
          '2 butir telur puyuh (atau 1 telur ayam)',
          '30g ayam cincang halus',
          '30g wortel parut halus',
          '1 sdm kacang polong matang',
          'Minyak zaitun 2 tsp',
          '¼ sdt garam (opsional)',
        ],
        caraMembuat: [
          'Panaskan minyak zaitun dalam wajan anti lengket',
          'Tuang telur dan aduk hingga matang, angkat',
          'Masukkan ayam cincang dan masak hingga matang',
          'Masukkan wortel parut dan kacang polong',
          'Aduk rata dan masak selama 2-3 menit',
          'Masukkan nasi dingin dan pecah-pecahkan',
          'Aduk rata sambil memasak hingga hangat',
          'Masukkan telur yang sudah dimasak dan aduk rata',
          'Cek kematangan dan tekstur sesuai kemampuan bayi',
        ],
        manfaat: [
          'Kombinasi lengkap protein, karbohidrat, dan vitamin',
          'Telur memberikan kolesterol baik untuk otak',
          'Variasi sayuran mengajarkan rasa yang berbeda-beda',
          'Makanan yang lebih kompleks untuk bayi yang siap makan keluarga',
        ],
        tips: [
          'Gunakan nasi yang sudah dingin untuk hasil lebih baik',
          'Jangan membuat nasi terlalu kering untuk bayi',
          'Tambahkan sedikit kaldu bayi untuk kelembaban',
          'Bisa disimpan di kulkas 24 jam atau freeze 1 bulan',
        ],
      ),
      ResepModel(
        nama: 'Sup Ayam Sayuran Lembut',
        kategori: 'Protein',
        kelompokUsia: ['12+ Bulan'],
        waktuMasak: 40,
        porsi: '1 porsi (200ml)',
        bahan: [
          '100g dada ayam',
          '50g kentang kecil',
          '30g wortel kecil',
          '20g brokoli',
          '300ml kaldu ayam atau air matang',
          'Minyak zaitun 1 tsp',
          'Garam ¼ sdt (opsional)',
        ],
        caraMembuat: [
          'Potong ayam menjadi potongan kecil',
          'Kupas dan potong kentang, wortel menjadi kubus kecil',
          'Potong brokoli menjadi kuntum kecil',
          'Panaskan minyak zaitun, masukkan ayam sampai setengah matang',
          'Tuangkan kaldu atau air',
          'Masukkan kentang dan wortel, masak 15 menit',
          'Masukkan brokoli, masak 10 menit lagi',
          'Semua bahan harus empuk',
          'Cek rasa, tambahkan garam sedikit jika diperlukan',
        ],
        manfaat: [
          'Kaldu kaya kolagen baik untuk kesehatan tulang',
          'Ayam dan sayuran memberikan nutrisi lengkap',
          'Sup mudah dicerna dan menenangkan untuk bayi',
          'Variasi sayuran membangun kebiasaan makan sehat',
        ],
        tips: [
          'Bisa menggunakan kaldu homemade atau yang sudah tersedia',
          'Jangan tambahkan garam berlebihan',
          'Semua potongan harus lembut dan mudah dihancurkan',
          'Simpan di kulkas hingga 48 jam atau freeze hingga 1 bulan',
        ],
      ),
    ];
  }
}

// Model untuk Resep
class ResepModel {
  final String nama;
  final String kategori;
  final List<String> kelompokUsia;
  final int waktuMasak;
  final String porsi;
  final List<String> bahan;
  final List<String> caraMembuat;
  final List<String> manfaat;
  final List<String> tips;

  ResepModel({
    required this.nama,
    required this.kategori,
    required this.kelompokUsia,
    required this.waktuMasak,
    required this.porsi,
    required this.bahan,
    required this.caraMembuat,
    required this.manfaat,
    required this.tips,
  });
}
