import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:math' as math;
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/tumbuh_kembang/data/models/pemantauan_model.dart';

class LembarPemantauanScreen extends StatefulWidget {
  final Map<String, dynamic>? anak;

  const LembarPemantauanScreen({Key? key, this.anak}) : super(key: key);

  @override
  State<LembarPemantauanScreen> createState() => _LembarPemantauanScreenState();
}

class _LembarPemantauanScreenState extends State<LembarPemantauanScreen>
    with TickerProviderStateMixin {
  // ── State ──
  AgeGroup _selectedAgeGroup = AgeGroup.newborn0to28days;
  int _selectedPeriod = 1;
  late Map<String, bool> _currentChecks;
  late List<DangerSignCategory> _categories;

  /// Riwayat: period → PemantauanEntry
  final Map<int, PemantauanEntry> _history = {};

  // ── Animasi ──
  late AnimationController _pulseCtrl;
  late AnimationController _slideCtrl;
  late Animation<double> _slideAnim;

  // ──────────────────────────────────────────────
  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    )..repeat(reverse: true);
    _slideCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 320),
    );
    _slideAnim =
        CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic);
    _initForAgeGroup();
    _slideCtrl.forward();
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    _slideCtrl.dispose();
    super.dispose();
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  void _initForAgeGroup() {
    _categories = KIADangerSigns.getCategoriesForGroup(_selectedAgeGroup);
    _loadChecksForPeriod(_selectedPeriod);
  }

  void _loadChecksForPeriod(int period) {
    if (_history.containsKey(period)) {
      _currentChecks = Map.from(_history[period]!.checkedItems);
    } else {
      _currentChecks = {
        for (var cat in _categories)
          for (var item in cat.items) item.id: false,
      };
    }
    _syncCategoryItems();
  }

  void _syncCategoryItems() {
    for (var cat in _categories) {
      for (var item in cat.items) {
        item.isChecked = _currentChecks[item.id] ?? false;
      }
    }
  }

  void _saveCurrentPeriod() {
    _history[_selectedPeriod] = PemantauanEntry(
      periodNumber: _selectedPeriod,
      savedAt: DateTime.now(),
      checkedItems: Map.from(_currentChecks),
    );
  }

  int get _totalChecked => _currentChecks.values.where((v) => v).length;
  bool get _hasDangerSigns => _totalChecked > 0;

  Color get _primaryColor {
    switch (_selectedAgeGroup) {
      case AgeGroup.newborn0to28days:
      case AgeGroup.infant29daysto3months:
        return TrimesterTheme.t1Primary;
      case AgeGroup.infant3to6months:
      case AgeGroup.infant6to12months:
        return TrimesterTheme.t2Primary;
      default:
        return TrimesterTheme.t3Primary;
    }
  }

  List<Color> get _gradient {
    switch (_selectedAgeGroup) {
      case AgeGroup.newborn0to28days:
      case AgeGroup.infant29daysto3months:
        return TrimesterTheme.t1Gradient;
      case AgeGroup.infant3to6months:
      case AgeGroup.infant6to12months:
        return TrimesterTheme.t2Gradient;
      default:
        return TrimesterTheme.t3Gradient;
    }
  }

  // ──────────────────────────────────────────────
  // Build
  // ──────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TrimesterTheme.background,
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverToBoxAdapter(
            child: FadeTransition(
              opacity: _slideAnim,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildAgeGroupSelector(),
                    const SizedBox(height: 16),
                    _buildPeriodCard(),
                    const SizedBox(height: 12),
                    if (_hasDangerSigns) ...[
                      _buildAlertBanner(),
                      const SizedBox(height: 12),
                    ],
                    ..._categories.map(_buildCategoryCard),
                    if (_history.isNotEmpty) ...[
                      _buildHistorySection(),
                      const SizedBox(height: 16),
                    ],
                    _buildSaveButton(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ──────────────────────────────────────────────
  // SLIVER APP BAR
  // ──────────────────────────────────────────────

  SliverAppBar _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 210,
      pinned: true,
      backgroundColor: _primaryColor,
      systemOverlayStyle: SystemUiOverlayStyle.light,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
        onPressed: () => Navigator.of(context).pop(),
      ),
      flexibleSpace: FlexibleSpaceBar(
        background: _buildHeroHeader(),
      ),
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(0),
        child: Container(
          height: 22,
          decoration: BoxDecoration(
            color: TrimesterTheme.background,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
          ),
        ),
      ),
    );
  }

  Widget _buildHeroHeader() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: _gradient,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -35,
            top: -25,
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.07),
              ),
            ),
          ),
          Positioned(
            left: -15,
            bottom: 30,
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.05),
              ),
            ),
          ),
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 44),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(
                          Icons.health_and_safety_rounded,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Lembar Pemantauan',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 19,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (widget.anak != null)
                              Text(
                                'Untuk: ${widget.anak!['nama'] ?? 'Anak terpilih'}',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.88),
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            Text(
                              'Skrining Tanda Bahaya • ${_selectedAgeGroup.label}',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.85),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      _heroChip(
                        Icons.calendar_today_rounded,
                        '${_selectedAgeGroup.periodLabel}$_selectedPeriod',
                      ),
                      const SizedBox(width: 8),
                      _heroChip(
                        Icons.checklist_rounded,
                        '$_totalChecked Tanda',
                        danger: _hasDangerSigns,
                      ),
                      const SizedBox(width: 8),
                      _heroChip(
                        Icons.history_rounded,
                        '${_history.length} Entri',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _heroChip(IconData icon, String label, {bool danger = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color:
            danger ? const Color(0xFFFFEBEE) : Colors.white.withOpacity(0.18),
        borderRadius: BorderRadius.circular(20),
        border: danger ? Border.all(color: const Color(0xFFEF5350)) : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon,
              size: 12, color: danger ? const Color(0xFFEF5350) : Colors.white),
          const SizedBox(width: 5),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: danger ? const Color(0xFFEF5350) : Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  // ──────────────────────────────────────────────
  // AGE GROUP SELECTOR
  // ──────────────────────────────────────────────

  Widget _buildAgeGroupSelector() {
    final groups = AgeGroup.values;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Kelompok Usia',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1A1A2E),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 84,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: groups.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, i) {
              final group = groups[i];
              final isSelected = _selectedAgeGroup == group;

              Color groupColor;
              if (i < 2) {
                groupColor = TrimesterTheme.t1Primary;
              } else if (i < 4) {
                groupColor = TrimesterTheme.t2Primary;
              } else {
                groupColor = TrimesterTheme.t3Primary;
              }

              return GestureDetector(
                onTap: () {
                  HapticFeedback.selectionClick();
                  setState(() {
                    _saveCurrentPeriod();
                    _selectedAgeGroup = group;
                    _selectedPeriod = 1;
                    _history.clear();
                    _initForAgeGroup();
                  });
                  _slideCtrl
                    ..reset()
                    ..forward();
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 68,
                  decoration: BoxDecoration(
                    color: isSelected ? groupColor : Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(
                      color: isSelected ? groupColor : const Color(0xFFE8ECF0),
                      width: isSelected ? 2 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isSelected
                            ? groupColor.withOpacity(0.28)
                            : Colors.black.withOpacity(0.04),
                        blurRadius: isSelected ? 12 : 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        group.icon,
                        color: isSelected ? Colors.white : groupColor,
                        size: 21,
                      ),
                      const SizedBox(height: 5),
                      Text(
                        group.shortLabel,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w700,
                          color: isSelected
                              ? Colors.white
                              : const Color(0xFF555570),
                          height: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ──────────────────────────────────────────────
  // PERIOD CARD
  // ──────────────────────────────────────────────

  Widget _buildPeriodCard() {
    final maxPeriods = _selectedAgeGroup.maxPeriods;
    final periodLabel = _selectedAgeGroup.periodLabel;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$periodLabel$_selectedPeriod',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: _primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          DropdownButtonFormField<int>(
            value: _selectedPeriod,
            isExpanded: true,
            decoration: InputDecoration(
              labelText: 'Pilih ${periodLabel.toLowerCase()}',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
              ),
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            ),
            items: List.generate(maxPeriods, (index) {
              final period = index + 1;
              return DropdownMenuItem<int>(
                value: period,
                child: Text('$periodLabel$period'),
              );
            }),
            onChanged: (value) {
              if (value == null || value == _selectedPeriod) return;
              HapticFeedback.selectionClick();
              setState(() {
                _saveCurrentPeriod();
                _selectedPeriod = value;
                _loadChecksForPeriod(_selectedPeriod);
              });
            },
          ),
          const SizedBox(height: 10),
          _buildProgressBars(maxPeriods),
          const SizedBox(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${periodLabel}1',
                  style:
                      const TextStyle(fontSize: 9.5, color: Color(0xFF9E9EB8))),
              Text('$periodLabel$maxPeriods',
                  style:
                      const TextStyle(fontSize: 9.5, color: Color(0xFF9E9EB8))),
            ],
          ),
        ],
      ),
    );
  }

  void _prevPeriod() {
    HapticFeedback.selectionClick();
    setState(() {
      _saveCurrentPeriod();
      _selectedPeriod--;
      _loadChecksForPeriod(_selectedPeriod);
    });
  }

  void _nextPeriod() {
    HapticFeedback.selectionClick();
    setState(() {
      _saveCurrentPeriod();
      _selectedPeriod++;
      _loadChecksForPeriod(_selectedPeriod);
    });
  }

  Widget _navBtn(IconData icon, VoidCallback? onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: onTap != null
              ? _primaryColor.withOpacity(0.1)
              : const Color(0xFFF0F0F5),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(
          icon,
          color: onTap != null ? _primaryColor : const Color(0xFFCCCCDD),
          size: 22,
        ),
      ),
    );
  }

  Widget _buildProgressBars(int maxPeriods) {
    final displayMax = math.min(maxPeriods, 28);
    return SizedBox(
      height: 28,
      child: Row(
        children: List.generate(displayMax, (i) {
          final period = i + 1;
          final entry = _history[period];
          final isSelected = _selectedPeriod == period;

          Color barColor;
          if (isSelected) {
            barColor = _primaryColor;
          } else if (entry != null && !entry.isAman) {
            barColor = const Color(0xFFEF5350);
          } else if (entry != null && entry.isAman) {
            barColor = const Color(0xFF81C784);
          } else {
            barColor = const Color(0xFFEEEEF5);
          }

          return Expanded(
            child: GestureDetector(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() {
                  _saveCurrentPeriod();
                  _selectedPeriod = period;
                  _loadChecksForPeriod(period);
                });
              },
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 1.5),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  height: isSelected ? 28 : 16,
                  decoration: BoxDecoration(
                    color: barColor,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: isSelected
                      ? Center(
                          child: Text(
                            '$period',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 7.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        )
                      : null,
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  // ──────────────────────────────────────────────
  // ALERT BANNER
  // ──────────────────────────────────────────────

  Widget _buildAlertBanner() {
    return AnimatedBuilder(
      animation: _pulseCtrl,
      builder: (context, child) => Container(
        padding: const EdgeInsets.all(13),
        decoration: BoxDecoration(
          color: const Color(0xFFFFEBEE),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
            color: Color.lerp(const Color(0xFFEF5350), const Color(0xFFFF8A80),
                _pulseCtrl.value)!,
            width: 1.5,
          ),
        ),
        child: child,
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(7),
            decoration: BoxDecoration(
              color: const Color(0xFFEF5350).withOpacity(0.14),
              borderRadius: BorderRadius.circular(9),
            ),
            child: const Icon(Icons.warning_rounded,
                color: Color(0xFFEF5350), size: 20),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$_totalChecked Tanda Bahaya Terdeteksi!',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: Color(0xFFB71C1C),
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  'Segera periksa ke bidan / dokter / perawat terdekat.',
                  style: TextStyle(
                      fontSize: 11, color: Color(0xFFC62828), height: 1.4),
                ),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded,
              size: 13, color: Color(0xFFEF5350)),
        ],
      ),
    );
  }

  // ──────────────────────────────────────────────
  // CATEGORY CARD
  // ──────────────────────────────────────────────

  Widget _buildCategoryCard(DangerSignCategory category) {
    final checkedInCat =
        category.items.where((i) => _currentChecks[i.id] == true).length;

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            // Header kategori
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
              decoration: BoxDecoration(
                color: category.color.withOpacity(0.08),
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(18)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: category.color.withOpacity(0.14),
                      borderRadius: BorderRadius.circular(9),
                    ),
                    child: Icon(category.categoryIcon,
                        color: category.color, size: 16),
                  ),
                  const SizedBox(width: 9),
                  Expanded(
                    child: Text(
                      category.title,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: category.color,
                      ),
                    ),
                  ),
                  if (checkedInCat > 0)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF5350),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$checkedInCat',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            // Item tanda bahaya
            ...category.items.asMap().entries.map((entry) {
              final isLast = entry.key == category.items.length - 1;
              return _buildSignTile(entry.value, isLast, category.color);
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildSignTile(DangerSignItem item, bool isLast, Color categoryColor) {
    final isChecked = _currentChecks[item.id] ?? false;

    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        setState(() {
          _currentChecks[item.id] = !isChecked;
          item.isChecked = _currentChecks[item.id]!;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        decoration: BoxDecoration(
          color: isChecked ? const Color(0xFFFFEBEE) : Colors.transparent,
          borderRadius: isLast
              ? const BorderRadius.vertical(bottom: Radius.circular(18))
              : BorderRadius.zero,
          border: Border(
            left: BorderSide(
              color: isChecked ? const Color(0xFFEF5350) : Colors.transparent,
              width: 3,
            ),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Checkbox
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                width: 22,
                height: 22,
                margin: const EdgeInsets.only(top: 1),
                decoration: BoxDecoration(
                  color: isChecked ? const Color(0xFFEF5350) : Colors.white,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: isChecked
                        ? const Color(0xFFEF5350)
                        : const Color(0xFFD0D0E0),
                    width: 1.8,
                  ),
                ),
                child: isChecked
                    ? const Icon(Icons.check_rounded,
                        color: Colors.white, size: 14)
                    : null,
              ),
              const SizedBox(width: 10),
              // Ikon
              Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: isChecked
                      ? const Color(0xFFFFCDD2)
                      : categoryColor.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(7),
                ),
                child: Icon(
                  item.icon,
                  size: 14,
                  color: isChecked ? const Color(0xFFEF5350) : categoryColor,
                ),
              ),
              const SizedBox(width: 9),
              // Teks
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.label,
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.bold,
                        color: isChecked
                            ? const Color(0xFFB71C1C)
                            : const Color(0xFF2A2A3E),
                        height: 1.3,
                      ),
                    ),
                    if (item.description != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        item.description!,
                        style: TextStyle(
                          fontSize: 10.5,
                          color: isChecked
                              ? const Color(0xFFC62828).withOpacity(0.65)
                              : const Color(0xFF888899),
                          height: 1.4,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ──────────────────────────────────────────────
  // HISTORY SECTION
  // ──────────────────────────────────────────────

  Widget _buildHistorySection() {
    final entries = _history.entries.toList()
      ..sort((a, b) => a.key.compareTo(b.key));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.history_rounded, size: 15, color: _primaryColor),
            const SizedBox(width: 6),
            const Text(
              'Riwayat Pemantauan',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1A1A2E),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            children: entries.asMap().entries.map((mapEntry) {
              final idx = mapEntry.key;
              final entry = mapEntry.value.value;
              final isLast = idx == entries.length - 1;

              return GestureDetector(
                onTap: () {
                  setState(() {
                    _saveCurrentPeriod();
                    _selectedPeriod = entry.periodNumber;
                    _loadChecksForPeriod(entry.periodNumber);
                  });
                },
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                  decoration: BoxDecoration(
                    border: !isLast
                        ? const Border(
                            bottom:
                                BorderSide(color: Color(0xFFF0F0F5), width: 1))
                        : null,
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: entry.isAman
                              ? const Color(0xFFE8F5E9)
                              : const Color(0xFFFFEBEE),
                          borderRadius: BorderRadius.circular(9),
                        ),
                        child: Center(
                          child: Text(
                            '${entry.periodNumber}',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: entry.isAman
                                  ? const Color(0xFF43A047)
                                  : const Color(0xFFEF5350),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          '${_selectedAgeGroup.periodLabel}${entry.periodNumber}',
                          style: const TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF2A2A3E),
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 9, vertical: 4),
                        decoration: BoxDecoration(
                          color: entry.isAman
                              ? const Color(0xFF43A047)
                              : const Color(0xFFEF5350),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          entry.isAman
                              ? 'Aman ✓'
                              : '${entry.dangerCount} Tanda!',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  // ──────────────────────────────────────────────
  // SAVE BUTTON
  // ──────────────────────────────────────────────

  Widget _buildSaveButton() {
    return GestureDetector(
      onTap: () {
        HapticFeedback.mediumImpact();
        setState(() => _saveCurrentPeriod());

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle_rounded,
                    color: Colors.white, size: 17),
                const SizedBox(width: 9),
                Expanded(
                  child: Text(
                    _hasDangerSigns
                        ? '${_selectedAgeGroup.periodLabel}$_selectedPeriod disimpan — $_totalChecked tanda bahaya terdeteksi!'
                        : '${_selectedAgeGroup.periodLabel}$_selectedPeriod disimpan — tidak ada tanda bahaya.',
                    style: const TextStyle(fontSize: 12.5),
                  ),
                ),
              ],
            ),
            backgroundColor: _hasDangerSigns
                ? const Color(0xFFEF5350)
                : const Color(0xFF43A047),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 3),
          ),
        );
      },
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: _gradient,
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: _primaryColor.withOpacity(0.32),
              blurRadius: 14,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.save_rounded, color: Colors.white, size: 19),
            const SizedBox(width: 9),
            Text(
              'Simpan ${_selectedAgeGroup.periodLabel}$_selectedPeriod',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14.5,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
