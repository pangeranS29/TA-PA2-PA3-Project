import 'package:flutter/material.dart';
import 'edukasi_detail_screen.dart';

class EdukasiScreen extends StatefulWidget {
  const EdukasiScreen({Key? key}) : super(key: key);

  @override
  State<EdukasiScreen> createState() => _EdukasiScreenState();
}

class _EdukasiScreenState extends State<EdukasiScreen>
    with SingleTickerProviderStateMixin {
  String _selectedFilter = 'Semua';
  late final AnimationController _listAnimationController;

  final List<Map<String, dynamic>> _allContent = [
    {
      'type': 'ARTIKEL',
      'ageText': 'Orang Tua',
      'durationText': '6 Menit Baca',
      'title': 'Menjaga Kesehatan Mental Orang Tua dalam Pengasuhan Anak',
    },
    {
      'type': 'ARTIKEL',
      'ageText': 'Semua Umur',
      'durationText': '4 Menit Baca',
      'title': 'Informasi Umum Cuci Tangan Pakai Sabun',
    },
    {
      'type': 'ARTIKEL',
      'ageText': '0-18 Tahun',
      'durationText': '5 Menit Baca',
      'title': 'Informasi Umum Perawatan Gigi Anak',
    },
    {
      'type': 'ARTIKEL',
      'ageText': 'Semua Umur',
      'durationText': '7 Menit Baca',
      'title': 'Informasi Umum Perawatan Anak Sakit',
    },
    {
      'type': 'VIDEO',
      'ageText': '6-9 Bulan',
      'durationText': '5 Menit',
      'title': 'Stimulasi Merangkak Anak',
    },
    {
      'type': 'ARTIKEL',
      'ageText': '6 Bulan',
      'durationText': '3 Menit Baca',
      'title': 'Mengenalkan Makanan Pendamping ASI',
    },
    {
      'type': 'VIDEO',
      'ageText': '12-18 Bulan',
      'durationText': '8 Menit',
      'title': 'Bermain Sambil Belajar Berbicara',
    },
    {
      'type': 'ARTIKEL',
      'ageText': 'Semua Umur',
      'durationText': '5 Menit Baca',
      'title': 'Tips Mengatasi Anak Susah Makan',
    },
  ];

  @override
  void initState() {
    super.initState();
    _listAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..forward();
  }

  @override
  void dispose() {
    _listAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> filteredContent = _allContent;
    if (_selectedFilter != 'Semua') {
      filteredContent = _allContent
          .where((item) => item['type'] == _selectedFilter.toUpperCase())
          .toList();
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Color(0xFF1E293B),
            size: 20,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Konten Edukasi',
          style: TextStyle(
            color: Color(0xFF1E293B),
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(
            color: Colors.grey.shade200,
            height: 1.0,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.search, color: Color(0xFF94A3B8), size: 20),
                    SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Cari stimulasi atau tips...',
                          hintStyle: TextStyle(
                            color: Color(0xFF94A3B8),
                            fontSize: 13,
                          ),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                    Icon(
                      Icons.filter_alt_outlined,
                      color: Color(0xFF94A3B8),
                      size: 20,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterChip('Semua'),
                    _buildFilterChip('Video'),
                    _buildFilterChip('Artikel'),
                    _buildFilterChip('Resep'),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'Rekomendasi Edukasi KIA',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 16),
              if (filteredContent.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24.0),
                    child: Text(
                      'Tidak ada konten ditemukan.',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ),
                )
              else
                ...filteredContent.asMap().entries.map(
                      (entry) => _buildStaggeredListItem(
                        index: entry.key,
                        totalCount: filteredContent.length,
                        child: _buildContentCard(
                          type: entry.value['type'],
                          ageText: entry.value['ageText'],
                          durationText: entry.value['durationText'],
                          title: entry.value['title'],
                        ),
                      ),
                    ),
              const SizedBox(height: 20),
            ],
          ),
        ),
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
          color: isActive ? const Color(0xFF3B82F6) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? const Color(0xFF3B82F6) : Colors.grey.shade300,
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

  Widget _buildContentCard({
    required String type,
    required String ageText,
    required String durationText,
    required String title,
  }) {
    final bool isVideo = type == 'VIDEO';
    final String heroTag = _buildHeroTag(type, title);
    final Color topBgColor =
        isVideo ? const Color(0xFFE6EFFF) : const Color(0xFFFFF0D4);
    final Color typeColor =
        isVideo ? const Color(0xFF3B82F6) : const Color(0xFFFF5C00);
    final Color typeBgColor =
        isVideo ? const Color(0xFFE6EFFF) : const Color(0xFFFFF0D4);

    return AnimatedContentCard(
      type: type,
      ageText: ageText,
      durationText: durationText,
      title: title,
      topBgColor: topBgColor,
      typeColor: typeColor,
      typeBgColor: typeBgColor,
      heroTag: heroTag,
      isVideo: isVideo,
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => EdukasiDetailScreen(
              type: type,
              ageText: ageText,
              durationText: durationText,
              title: title,
              heroTag: heroTag,
              isVideo: isVideo,
              topBgColor: topBgColor,
              typeColor: typeColor,
              typeBgColor: typeBgColor,
            ),
          ),
        );
      },
    );
  }

  Widget _buildStaggeredListItem({
    required int index,
    required int totalCount,
    required Widget child,
  }) {
    final int safeCount = totalCount <= 0 ? 1 : totalCount;
    final double start = (index * 0.08).clamp(0.0, 0.8);
    final double end =
        (start + (0.35 / safeCount) + 0.25).clamp(start + 0.1, 1.0);

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
            offset: Offset(0, (1 - value) * 20),
            child: itemChild,
          ),
        );
      },
    );
  }

  String _buildHeroTag(String type, String title) {
    return 'edukasi-${type.toLowerCase()}-${title.toLowerCase().replaceAll(' ', '-')}';
  }
}

class AnimatedContentCard extends StatefulWidget {
  final String type;
  final String ageText;
  final String durationText;
  final String title;
  final Color topBgColor;
  final Color typeColor;
  final Color typeBgColor;
  final String heroTag;
  final bool isVideo;
  final VoidCallback onTap;

  const AnimatedContentCard({
    Key? key,
    required this.type,
    required this.ageText,
    required this.durationText,
    required this.title,
    required this.topBgColor,
    required this.typeColor,
    required this.typeBgColor,
    required this.heroTag,
    required this.isVideo,
    required this.onTap,
  }) : super(key: key);

  @override
  State<AnimatedContentCard> createState() => _AnimatedContentCardState();
}

class _AnimatedContentCardState extends State<AnimatedContentCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedScale(
      duration: const Duration(milliseconds: 120),
      scale: _isPressed ? 0.98 : 1,
      curve: Curves.easeOut,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(_isPressed ? 0.01 : 0.03),
              blurRadius: _isPressed ? 6 : 12,
              offset: Offset(0, _isPressed ? 2 : 5),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            splashColor: const Color(0xFF3B82F6).withOpacity(0.12),
            highlightColor: Colors.transparent,
            onTap: widget.onTap,
            onTapDown: (_) => setState(() => _isPressed = true),
            onTapUp: (_) => setState(() => _isPressed = false),
            onTapCancel: () => setState(() => _isPressed = false),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Hero(
                  tag: widget.heroTag,
                  child: Container(
                    height: 140,
                    decoration: BoxDecoration(
                      color: widget.topBgColor,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(16),
                      ),
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: widget.isVideo
                              ? Container(
                                  padding: const EdgeInsets.all(2),
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black12,
                                        blurRadius: 6,
                                        offset: Offset(0, 2),
                                      )
                                    ],
                                  ),
                                  child: const Icon(
                                    Icons.play_circle_outline,
                                    color: Color(0xFF3B82F6),
                                    size: 40,
                                  ),
                                )
                              : const Icon(
                                  Icons.menu_book_rounded,
                                  color: Color(0xFFE2C499),
                                  size: 64,
                                ),
                        ),
                        Positioned(
                          top: 12,
                          left: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.05),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Text(
                              widget.ageText,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E293B),
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 12,
                          right: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF64748B),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              widget.durationText,
                              style: const TextStyle(
                                fontSize: 11,
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
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: widget.typeBgColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          widget.type,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: widget.typeColor,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        widget.title,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1E293B),
                        ),
                      ),
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
}
