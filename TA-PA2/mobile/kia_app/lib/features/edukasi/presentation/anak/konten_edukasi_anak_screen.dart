import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/constants/app_colors.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/data/models/edukasi_anak_item.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/data/models/informasi_umum_model.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/data/models/edukasi_pola_asuh_model.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/data/models/edukasi_perawatan_anak_model.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/data/services/informasi_umum_api_service.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/data/services/edukasi_pola_asuh_api_service.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/data/services/edukasi_perawatan_anak_api_service.dart';
import 'package:ta_pa2_pa3_project/features/edukasi/presentation/anak/detail_konten_edukasi_anak_screen.dart';
import '../widgets/edukasi_search_filter.dart';

class KontenEdukasiAnakScreen extends StatefulWidget {
  const KontenEdukasiAnakScreen({super.key});

  @override
  State<KontenEdukasiAnakScreen> createState() =>
      _KontenEdukasiAnakScreenState();
}

class _KontenEdukasiAnakScreenState extends State<KontenEdukasiAnakScreen> {
  final InformasiUmumApiService _infoUmumService = InformasiUmumApiService();
  final EdukasiPolaAsuhApiService _polaAsuhService =
      EdukasiPolaAsuhApiService();
  final EdukasiPerawatanAnakApiService _perawatanService =
      EdukasiPerawatanAnakApiService();

  String selectedCategory = 'Semua';
  String searchQuery = '';

  bool _isLoading = true;
  String? _errorMessage;
  List<EdukasiAnakItem> _allItems = [];

  @override
  void initState() {
    super.initState();
    _loadAllData();
  }

  @override
  void dispose() {
    _infoUmumService.dispose();
    _polaAsuhService.dispose();
    _perawatanService.dispose();
    super.dispose();
  }

  Future<void> _loadAllData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final results = await Future.wait([
        _infoUmumService.listInformasiUmum(),
        _polaAsuhService.listPolaAsuh(),
        _perawatanService.listPerawatanAnak(),
      ]);

      final informasiUmumList = results[0] as List<InformasiUmumModel>;
      final polaAsuhList = results[1] as List<EdukasiPolaAsuhModel>;
      final perawatanList = results[2] as List<EdukasiPerawatanAnakModel>;

      final items = <EdukasiAnakItem>[];

      // Map Informasi Umum items
      for (final item in informasiUmumList) {
        items.add(EdukasiAnakItem(
          id: item.id,
          judul: item.judul,
          kategori: 'Informasi Umum',
          tipe: item.tipe.isNotEmpty ? item.tipe : 'ARTIKEL',
          ringkasan: item.ringkasan,
          konten: item.konten,
          yangPerluDiingat: item.yangPerluDiingat,
          umurTarget: item.umurTarget,
          durasiBaca: item.durasiBaca,
          thumbnailUrl: item.thumbnailUrl,
        ));
      }

      // Map Pola Asuh items
      for (final item in polaAsuhList) {
        items.add(EdukasiAnakItem(
          id: item.id,
          judul: item.judul,
          kategori: 'Pola Asuh',
          tipe: 'ARTIKEL',
          konten: item.isi,
          thumbnailUrl: item.gambarUrl,
        ));
      }

      // Map Perawatan Anak items → displayed under 'Pedoman' filter
      for (final item in perawatanList) {
        items.add(EdukasiAnakItem(
          id: item.id,
          judul: item.judul,
          kategori: 'Pedoman',
          tipe: 'ARTIKEL',
          konten: item.isiKonten,
          thumbnailUrl: item.gambarUrl,
        ));
      }

      setState(() {
        _allItems = items;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  List<EdukasiAnakItem> get _filteredItems {
    return _allItems.where((item) {
      final matchesCategory = selectedCategory == 'Semua' ||
          item.kategori == selectedCategory;

      final matchesSearch = searchQuery.isEmpty ||
          item.judul.toLowerCase().contains(searchQuery.toLowerCase()) ||
          item.ringkasan.toLowerCase().contains(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1E293B)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Edukasi',
          style: TextStyle(
            color: Color(0xFF1E293B),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: false,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: Colors.grey.shade200, height: 1.0),
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Color(0xFF185FA5),
              ),
            )
          : _errorMessage != null
              ? _buildErrorState()
              : RefreshIndicator(
                  onRefresh: _loadAllData,
                  color: AppColors.primary,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        EdukasiSearchFilter(
                          selectedCategory: selectedCategory,
                          categories: const [
                            'Semua',
                            'Pedoman',
                            'Pola Asuh',
                            'Informasi Umum',
                          ],
                          onCategorySelected: (value) {
                            setState(() {
                              selectedCategory = value;
                            });
                          },
                          onSearchChanged: (value) {
                            setState(() {
                              searchQuery = value;
                            });
                          },
                        ),
                        const SizedBox(height: 16),
                        Expanded(
                          child: _filteredItems.isEmpty
                              ? _buildEmptyState()
                              : ListView.builder(
                                  physics:
                                      const AlwaysScrollableScrollPhysics(),
                                  itemCount: _filteredItems.length,
                                  itemBuilder: (context, index) {
                                    final item = _filteredItems[index];
                                    return _EdukasiCard(
                                      item: item,
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) =>
                                                DetailKontenEdukasiAnakScreen(
                                                    item: item),
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
                ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFFEE2E2),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.error_outline_rounded,
                size: 48,
                color: Color(0xFFDC2626),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Gagal memuat data edukasi',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _errorMessage ?? '',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF64748B),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _loadAllData,
              icon: const Icon(Icons.refresh, size: 18),
              label: const Text('Coba Lagi'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.menu_book_rounded,
            size: 56,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'Edukasi tidak ditemukan',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Coba ubah filter atau kata kunci pencarian',
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }
}

class _EdukasiCard extends StatelessWidget {
  final EdukasiAnakItem item;
  final VoidCallback onTap;

  const _EdukasiCard({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top section with icon
            Container(
              height: 120,
              decoration: BoxDecoration(
                color: const Color(0xFFDDEEFF),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(18),
                ),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.08),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                      child: Icon(
                        item.isVideo
                            ? Icons.play_arrow_rounded
                            : Icons.menu_book_rounded,
                        size: 32,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                  // Badge ARTIKEL / VIDEO at top left
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        item.displayTipe,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Bottom section with title
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.judul,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      height: 1.4,
                      color: Color(0xFF1E293B),
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}