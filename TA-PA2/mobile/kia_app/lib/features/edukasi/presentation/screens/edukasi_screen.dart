import 'package:flutter/material.dart';

class EdukasiScreen extends StatefulWidget {
  const EdukasiScreen({Key? key}) : super(key: key);

  @override
  State<EdukasiScreen> createState() => _EdukasiScreenState();
}

class _EdukasiScreenState extends State<EdukasiScreen>
    with SingleTickerProviderStateMixin {
  String _selectedFilter = 'Semua';
  late final AnimationController _listAnimationController;

  final List<Map<String, dynamic>> _edukasiContent = [
    {
      'type': 'VIDEO',
      'durationText': '3 Menit Tonton',
      'title': 'Latihan Motorik Halus Untuk Balita',
      'subtitle': 'Aktivitas sederhana menggunakan benda di rumah.',
    },
    {
      'type': 'ARTIKEL',
      'durationText': '4 Menit Baca',
      'title': 'Stimulasi Bahasa Sejak Usia Dini',
      'subtitle': 'Tips membangun kebiasaan komunikasi yang positif.',
    },
    {
      'type': 'VIDEO',
      'durationText': '5 Menit Tonton',
      'title': 'Rutinitas Tidur Anak Yang Sehat',
      'subtitle': 'Langkah praktis agar anak tidur lebih teratur.',
    },
  ];

  List<String> get _activeFilters => ['Semua', 'Video', 'Artikel'];

  @override
  void initState() {
    super.initState();
    _listAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 650),
    )..forward();
  }

  @override
  void dispose() {
    _listAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> filteredContent = _edukasiContent;
    if (_selectedFilter != 'Semua') {
      filteredContent = _edukasiContent
          .where((item) => item['type'] == _selectedFilter.toUpperCase())
          .toList();
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: true,
        title: const Text(
          'Edukasi',
          style: TextStyle(
            color: Color(0xFF1E293B),
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildEdukasiBanner(),
              const SizedBox(height: 16),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _activeFilters
                      .map((label) => _buildFilterChip(label))
                      .toList(),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Konten Edukasi Cepat',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 14),
              if (filteredContent.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24.0),
                    child: Text(
                      'Konten edukasi belum tersedia untuk filter ini.',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ),
                )
              else
                ...filteredContent.asMap().entries.map(
                      (entry) => _buildStaggeredListItem(
                        index: entry.key,
                        totalCount: filteredContent.length,
                        child: _buildContentCard(entry.value),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEdukasiBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(14),
      ),
      child: const Row(
        children: [
          Icon(Icons.flash_on, color: Color(0xFFEA580C), size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'Kumpulan edukasi ringkas dan praktis untuk aktivitas harian ibu dan anak.',
              style: TextStyle(
                color: Color(0xFFEA580C),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    final bool isActive = _selectedFilter == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = label;
        });
        _listAnimationController.forward(from: 0);
      },
      child: Container(
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFFEA580C) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? const Color(0xFFEA580C) : Colors.grey.shade300,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? Colors.white : const Color(0xFF64748B),
            fontSize: 13,
            fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildContentCard(Map<String, dynamic> item) {
    final bool isVideo = item['type'] == 'VIDEO';

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color:
                  isVideo ? const Color(0xFFEFF6FF) : const Color(0xFFFFF7ED),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isVideo ? Icons.play_circle_outline : Icons.menu_book_rounded,
              color:
                  isVideo ? const Color(0xFF2563EB) : const Color(0xFFEA580C),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['title'] as String,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  item['subtitle'] as String,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF64748B),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  item['durationText'] as String,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Color(0xFF94A3B8),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStaggeredListItem({
    required int index,
    required int totalCount,
    required Widget child,
  }) {
    final int safeCount = totalCount <= 0 ? 1 : totalCount;
    final double start = (index * 0.09).clamp(0.0, 0.8);
    final double end =
        (start + (0.35 / safeCount) + 0.22).clamp(start + 0.1, 1.0);

    final Animation<double> animation = CurvedAnimation(
      parent: _listAnimationController,
      curve: Interval(start, end, curve: Curves.easeOutCubic),
    );

    return AnimatedBuilder(
      animation: animation,
      child: child,
      builder: (context, itemChild) {
        final double value = animation.value;
        return Opacity(
          opacity: value,
          child: Transform.translate(
            offset: Offset(0, (1 - value) * 18),
            child: itemChild,
          ),
        );
      },
    );
  }
}
