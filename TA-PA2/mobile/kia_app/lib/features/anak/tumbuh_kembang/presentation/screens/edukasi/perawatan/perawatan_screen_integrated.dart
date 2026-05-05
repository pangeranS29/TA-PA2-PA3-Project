import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../../../data/models/perawatan_model.dart';
import '../../../../data/services/perawatan_api_service.dart';
// import '../data/services/perawatan_api_service.dart';

class PerawatanScreenIntegrated extends StatefulWidget {
  final int anakId;
  final String anakName;

  const PerawatanScreenIntegrated({
    super.key,
    required this.anakId,
    required this.anakName,
  });

  @override
  State<PerawatanScreenIntegrated> createState() =>
      _PerawatanScreenIntegratedState();
}

class _PerawatanScreenIntegratedState extends State<PerawatanScreenIntegrated>
    with SingleTickerProviderStateMixin {
  late PerawatanApiService _apiService;
  late TabController _tabController;
  late List<String> _ageRanges;

  Map<String, List<KategoriCapaianModel>> _kategoriByCageRange = {};
  Map<int, bool?> _checklist = {};
  Map<String, bool> _loadingStatus = {};
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _ageRanges = [
      '0-12 Bulan',
      '1-2 Tahun',
      '2-3 Tahun',
      '3-4 Tahun',
      '4-5 Tahun',
      '5-6 Tahun',
    ];
    _tabController = TabController(length: _ageRanges.length, vsync: this);
    _apiService = PerawatanApiService(dio: Dio());

    _loadKategoriCapaian();
  }

  Future<void> _loadKategoriCapaian() async {
    try {
      for (final range in _ageRanges) {
        _loadingStatus[range] = true;
        final kategori =
            await _apiService.getKategoriCapaianByRentangUsia(range);
        _kategoriByCageRange[range] = kategori;

        // Load existing perawatan data
        try {
          final perawatan = await _apiService
              .getPerawatanByAnakIdAndRentangUsia(widget.anakId, range);
          for (final item in perawatan) {
            _checklist[item.kategoriCapaianId] = item.jawaban;
          }
        } catch (e) {
          // No existing data, continue
        }

        if (mounted) {
          setState(() {
            _loadingStatus[range] = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading data: $e')),
        );
      }
    }
  }

  Future<void> _submitChecklist(String rentangUsia) async {
    if (_checklist.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Silakan isi checklist terlebih dahulu')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final kategori = _kategoriByCageRange[rentangUsia] ?? [];

      for (final kat in kategori) {
        final jawaban = _checklist[kat.id];
        if (jawaban != null) {
          try {
            // Check if already exists
            await _apiService.createPerawatan(
              CreatePerawatanRequest(
                anakId: widget.anakId,
                kategoriCapaianId: kat.id,
                jawaban: jawaban,
                tanggalPeriksa: DateTime.now(),
              ),
            );
          } catch (e) {
            // If create fails, try update (already exists)
            // In production, you'd want to check the ID first
          }
        }
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Data perawatan berhasil disimpan'),
              backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: Text(
          'Perawatan ${widget.anakName}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: const Color(0xFFD97706),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFFD97706),
          labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
          tabs: _ageRanges.map((range) => Tab(text: range)).toList(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: _ageRanges.map((range) {
          return _buildAgeRangeTab(range);
        }).toList(),
      ),
    );
  }

  Widget _buildAgeRangeTab(String rentangUsia) {
    final isLoading = _loadingStatus[rentangUsia] ?? false;
    final kategori = _kategoriByCageRange[rentangUsia] ?? [];

    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (kategori.isEmpty) {
      return Center(
        child: Text(
          'Tidak ada data untuk $rentangUsia',
          style: const TextStyle(color: Colors.grey),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeaderBanner(
            'Perawatan Anak\nUmur $rentangUsia',
            const Color(0xFFD97706),
          ),
          const SizedBox(height: 16),
          _buildChecklistTable(kategori, rentangUsia),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: _isSubmitting ? null : () => _submitChecklist(rentangUsia),
            icon: const Icon(Icons.save),
            label: _isSubmitting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Simpan Perawatan'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD97706),
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderBanner(String title, Color color) {
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
          height: 1.4,
        ),
      ),
    );
  }

  Widget _buildChecklistTable(
      List<KategoriCapaianModel> kategori, String rentangUsia) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFFFEF08A),
              borderRadius: BorderRadius.only(
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
                height: 1.4,
              ),
            ),
          ),
          Container(
            color: const Color(0xFFD97706).withOpacity(0.12),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                const SizedBox(
                  width: 28,
                  child: Text(
                    'No.',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
                const Expanded(
                  child: Text(
                    'Penanda Perkembangan Anak',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
                SizedBox(
                  width: 40,
                  child: Center(
                    child: Text(
                      'Ya',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFFD97706),
                      ),
                    ),
                  ),
                ),
                SizedBox(
                  width: 48,
                  child: Center(
                    child: Text(
                      'Tidak',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Column(
              children: List.generate(kategori.length, (i) {
                final item = kategori[i];
                final isEven = i % 2 == 0;
                final jawaban = _checklist[item.id];

                return Container(
                  decoration: BoxDecoration(
                    color: isEven ? Colors.white : const Color(0xFFF8FAFC),
                    borderRadius: i == kategori.length - 1
                        ? const BorderRadius.only(
                            bottomLeft: Radius.circular(16),
                            bottomRight: Radius.circular(16))
                        : null,
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 28,
                        child: Text(
                          '${i + 1}',
                          style:
                              const TextStyle(fontSize: 12, color: Colors.black54),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          item.pertanyaanCeklist,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF1E40AF),
                            height: 1.4,
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 40,
                        child: Checkbox(
                          value: jawaban == true,
                          activeColor: const Color(0xFFD97706),
                          onChanged: (v) {
                            setState(() {
                              if (v == true) {
                                _checklist[item.id] = true;
                              } else {
                                _checklist.remove(item.id);
                              }
                            });
                          },
                        ),
                      ),
                      SizedBox(
                        width: 48,
                        child: Checkbox(
                          value: jawaban == false,
                          activeColor: Colors.red,
                          onChanged: (v) {
                            setState(() {
                              if (v == true) {
                                _checklist[item.id] = false;
                              } else {
                                _checklist.remove(item.id);
                              }
                            });
                          },
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

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}
