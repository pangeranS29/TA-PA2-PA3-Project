import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/services/pertumbuhan_api_service.dart';
import 'package:ta_pa2_pa3_project/features/anak/anak/data/models/anak_search_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/master_standar_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/pertumbuhan_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/repositories/pertumbuhan_repository.dart';
import 'package:ta_pa2_pa3_project/features/anak/anak/presentation/widgets/index.dart';
import 'input_catatan_pertumbuhan_screen.dart';
import 'package:ta_pa2_pa3_project/features/anak/pemantauan/presentation/screens/perawatan/perawatan_screen_integrated.dart';

class DetailPertumbuhanScreen extends StatefulWidget {
  final AnakSearchModel anak;
  

  const DetailPertumbuhanScreen({
    Key? key,
    required this.anak,
  }) : super(key: key);

  @override
  State<DetailPertumbuhanScreen> createState() =>
      _DetailPertumbuhanScreenState();
}

class _DetailPertumbuhanScreenState extends State<DetailPertumbuhanScreen>
  with SingleTickerProviderStateMixin {
  static const _tabs = ['BB/U', 'TB/U', 'BB/TB', 'IMT/U', 'LK/U'];

  static const _primary = Color(0xFF1A73E8);
  static const _accent = Color(0xFF34A853);
  static const _warning = Color(0xFFF9AB00);
  static const _danger = Color(0xFFD93025);
  static const _surface = Color(0xFFFFFFFF);
  static const _bg = Color(0xFFF1F3F8);
  static const _border = Color(0xFFE0E7F0);
  static const _textMain = Color(0xFF1C2B4A);
  static const _textSub = Color(0xFF6B7C93);

  late final TabController _tabController;
  int? _selectedVisitIndex;

  String _hitungUmur(String tanggalLahir) {
    try {
      final birthDate = DateTime.parse(tanggalLahir);
      final now = DateTime.now();

      int bulan =
          (now.year - birthDate.year) * 12 + (now.month - birthDate.month);

      return "$bulan bulan";
    } catch (e) {
      return "-";
    }
  }

  late PertumbuhanRepository _repository;

  List<PertumbuhanModel> _riwayatPertumbuhan = [];
  List<MasterStandarModel> _masterStandarBBU = [];
  List<MasterStandarModel> _masterStandarTBU = [];
  List<MasterStandarModel> _masterStandarBBTB = [];
  List<MasterStandarModel> _masterStandarIMTU = [];
  List<MasterStandarModel> _masterStandarLKU = [];

  bool _isLoading = true;
  String? _errorMessage;

  String _selectedTab = 'BB/U'; // Default tab

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _tabController.addListener(() {
      if (_tabController.indexIsChanging) return;
      final next = _tabs[_tabController.index];
      if (next != _selectedTab) {
        setState(() {
          _selectedTab = next;
          _selectedVisitIndex = null;
        });
      }
    });
    _repository = PertumbuhanRepository(apiService: PertumbuhanApiService());
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final riwayat =
          await _repository.getRiwayatPertumbuhanByAnakId(widget.anak.id);

      // Mengurutkan riwayat berdasarkan tanggal ukur agar grafik selalu linear maju
      riwayat.sort((a, b) => a.tglUkur.compareTo(b.tglUkur));

      final masterBBU = await _repository.getMasterStandar(
          parameter: 'bb_u', jenisKelamin: widget.anak.jenisKelamin);
      final masterTBU = await _repository.getMasterStandar(
          parameter: 'tb_u', jenisKelamin: widget.anak.jenisKelamin);
      final masterBBTB = await _repository.getMasterStandar(
          parameter: 'bb_tb', jenisKelamin: widget.anak.jenisKelamin);
      final masterIMTU = await _repository.getMasterStandar(
          parameter: 'imt_u', jenisKelamin: widget.anak.jenisKelamin);
      final masterLKU = await _repository.getMasterStandar(
          parameter: 'lk_u', jenisKelamin: widget.anak.jenisKelamin);

      if (mounted) {
        setState(() {
          _riwayatPertumbuhan = riwayat;
          _masterStandarBBU = masterBBU;
          _masterStandarTBU = masterTBU;
          _masterStandarBBTB = masterBBTB;
          _masterStandarIMTU = masterIMTU;
          _masterStandarLKU = masterLKU;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  List<PertumbuhanModel> _getDataForTab() => _riwayatPertumbuhan;

  List<MasterStandarModel> _getMasterForTab([String? tab]) {
    final t = tab ?? _selectedTab;
    switch (t) {
      case 'TB/U':
        return _masterStandarTBU;
      case 'BB/TB':
        return _masterStandarBBTB;
      case 'IMT/U':
        return _masterStandarIMTU;
      case 'LK/U':
        return _masterStandarLKU;
      case 'BB/U':
      default:
        return _masterStandarBBU;
    }
  }

  double _getZScoreForTab(PertumbuhanModel data, [String? tab]) {
    final t = tab ?? _selectedTab;
    switch (t) {
      case 'TB/U':
        return data.zScoreTBU;
      case 'BB/TB':
        return data.zScoreBBTB;
      case 'IMT/U':
        return data.zScoreIMTU;
      case 'LK/U':
        return data.zScoreLKU;
      case 'BB/U':
      default:
        return data.zScoreBBU;
    }
  }

  String _getStatusForTab(PertumbuhanModel data, [String? tab]) {
    final t = tab ?? _selectedTab;
    switch (t) {
      case 'TB/U':
        return data.statusTBU;
      case 'BB/TB':
        return data.statusBBTB;
      case 'IMT/U':
        return data.statusIMTU;
      case 'LK/U':
        return data.statusLKU;
      case 'BB/U':
      default:
        return data.statusBBU;
    }
  }

  String _getXAxisLabel([String? tab]) {
    final t = tab ?? _selectedTab;
    return t == 'BB/TB' ? 'Tinggi Badan (cm)' : 'Usia (bulan)';
  }

  String _getYAxisLabelFull([String? tab]) {
    final t = tab ?? _selectedTab;
    switch (t) {
      case 'TB/U':
        return 'Tinggi Badan (cm)';
      case 'IMT/U':
        return 'Indeks Massa Tubuh (kg/m²)';
      case 'LK/U':
        return 'Lingkar Kepala (cm)';
      case 'BB/U':
      case 'BB/TB':
      default:
        return 'Berat Badan (kg)';
    }
  }

  @override
  Widget build(BuildContext context) {
    // Pengganti WillPopScope menjadi PopScope
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        if (didPop) return;
        Navigator.pop(context, _riwayatPertumbuhan.isNotEmpty);
      },
      child: Scaffold(
        backgroundColor: _bg,
        appBar: AppBar(
          backgroundColor: _primary,
          foregroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () =>
                Navigator.pop(context, _riwayatPertumbuhan.isNotEmpty),
          ),
          title: const Text(
            'Pertumbuhan Anak',
            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17),
          ),
          bottom: TabBar(
            controller: _tabController,
            isScrollable: true,
            indicatorColor: Colors.white,
            indicatorWeight: 3,
            labelStyle:
                const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
            unselectedLabelStyle:
                const TextStyle(fontWeight: FontWeight.w400, fontSize: 13),
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
          ),
        ),
        body: _isLoading
            ? const Center(
                child:
                    CircularProgressIndicator(color: _primary, strokeWidth: 3),
              )
            : _errorMessage != null
                ? _buildErrorState()
                : TabBarView(
                    controller: _tabController,
                    children: _tabs.map((t) => _buildTabContent(t)).toList(),
                  ),
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: _textSub),
            const SizedBox(height: 16),
            const Text(
              'Gagal memuat data',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: _textMain),
            ),
            const SizedBox(height: 8),
            Text(
              _errorMessage!,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: _textSub),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _loadData,
              style: ElevatedButton.styleFrom(
                backgroundColor: _primary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              child: const Text('Coba Lagi',
                  style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  String _fmtDate(String value) {
    if (value.isEmpty) return '-';
    final d = DateTime.tryParse(value);
    if (d == null) return value;
    const m = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agt',
      'Sep',
      'Okt',
      'Nov',
      'Des'
    ];
    return '${d.day} ${m[d.month - 1]} ${d.year}';
  }

  _StatusGroup _groupOfStatus(String status) {
    final s = status.toLowerCase().trim();
    if (s.isEmpty || s == '-') return _StatusGroup.unknown;
    if (s.contains('normal') || s.contains('baik')) return _StatusGroup.normal;
    if (s.contains('lebih') || s.contains('obes') || s.contains('gemuk')) {
      return _StatusGroup.above;
    }
    if (s.contains('kurang') ||
        s.contains('buruk') ||
        s.contains('stunting') ||
        s.contains('pendek') ||
        s.contains('wasting')) {
      return _StatusGroup.below;
    }
    return _StatusGroup.unknown;
  }

  Color _statusColor(String status) {
    switch (_groupOfStatus(status)) {
      case _StatusGroup.normal:
        return _accent;
      case _StatusGroup.below:
        return _warning;
      case _StatusGroup.above:
        return _danger;
      case _StatusGroup.unknown:
        return _textSub;
    }
  }

  String _chartTitle(String tab) {
    switch (tab) {
      case 'TB/U':
        return 'Grafik Tinggi Badan (TB/U)';
      case 'BB/TB':
        return 'Grafik BB menurut TB (BB/TB)';
      case 'IMT/U':
        return 'Grafik IMT menurut Usia (IMT/U)';
      case 'LK/U':
        return 'Grafik Lingkar Kepala (LK/U)';
      case 'BB/U':
      default:
        return 'Grafik Berat Badan (BB/U)';
    }
  }

  IconData _tabIcon(String tab) {
    switch (tab) {
      case 'TB/U':
        return Icons.height_rounded;
      case 'BB/TB':
        return Icons.compare_arrows_rounded;
      case 'IMT/U':
        return Icons.monitor_weight_rounded;
      case 'LK/U':
        return Icons.face_rounded;
      case 'BB/U':
      default:
        return Icons.monitor_weight_rounded;
    }
  }

  ({String value, String unit}) _latestValue(PertumbuhanModel data, String tab) {
    switch (tab) {
      case 'TB/U':
        return (value: data.tinggiBadan.toStringAsFixed(1), unit: 'cm');
      case 'IMT/U':
        return (value: data.imt.toStringAsFixed(1), unit: 'kg/m²');
      case 'LK/U':
        return (value: data.lingkarKepala.toStringAsFixed(1), unit: 'cm');
      case 'BB/U':
      case 'BB/TB':
      default:
        return (value: data.beratBadan.toStringAsFixed(1), unit: 'kg');
    }
  }

  Widget _buildTabContent(String tab) {
    final latest =
        _riwayatPertumbuhan.isNotEmpty ? _riwayatPertumbuhan.last : null;
    final master = _getMasterForTab(tab);

    final statuses = _riwayatPertumbuhan
        .map((e) => _getStatusForTab(e, tab))
        .map(_groupOfStatus)
        .toList();
    final total = statuses.length;
    final normal = statuses.where((g) => g == _StatusGroup.normal).length;
    final below = statuses.where((g) => g == _StatusGroup.below).length;
    final above = statuses.where((g) => g == _StatusGroup.above).length;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ChildInfoBanner(anak: widget.anak),
          const SizedBox(height: 14),
          if (latest == null) ...[
            const _EmptyState(
              icon: Icons.show_chart_rounded,
              title: 'Belum ada data pertumbuhan',
              message:
                  'Grafik akan muncul setelah ada catatan pengukuran anak.',
            ),
          ] else ...[
            _LatestBanner(
              icon: _tabIcon(tab),
              title: 'Pengukuran Terakhir',
              value: _latestValue(latest, tab).value,
              unit: _latestValue(latest, tab).unit,
              statusText: _getStatusForTab(latest, tab),
              statusColor: _statusColor,
              rightInfo: 'Usia ${latest.usiaUkurBulan} bln',
              subInfo: _fmtDate(latest.tglUkur),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                _StatChip(value: total, label: 'Total', color: _primary),
                const SizedBox(width: 8),
                _StatChip(value: normal, label: 'Normal', color: _accent),
                const SizedBox(width: 8),
                _StatChip(
                  value: below,
                  label: 'Di bawah',
                  color: below > 0 ? _warning : _textSub,
                ),
                const SizedBox(width: 8),
                _StatChip(
                  value: above,
                  label: 'Di atas',
                  color: above > 0 ? _danger : _textSub,
                ),
              ],
            ),
            const SizedBox(height: 14),
            _SectionCard(
              title: _chartTitle(tab),
              subtitle: 'Zona biru = rentang normal (-2 SD s/d +2 SD)',
              child: SizedBox(
                height: 300,
                child: GrowthChartWidget(
                  riwayatPertumbuhan: _getDataForTab(),
                  masterStandar: master,
                  yAxisLabel: _getYAxisLabelFull(tab),
                  selectedTab: tab,
                  xAxisLabel: _getXAxisLabel(tab),
                ),
              ),
            ),
            if (master.isEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8.0, bottom: 6.0),
                child: Row(
                  children: const [
                    Icon(Icons.info_outline, size: 16, color: Color(0xFF6B7C93)),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Data standar WHO belum tersedia — hanya data anak yang ditampilkan.',
                        style: TextStyle(fontSize: 12, color: Color(0xFF6B7C93)),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 10),
            _LegendBox(items: const [
              _LegendItem(color: _primary, label: 'Data Anak', solid: true),
              _LegendItem(color: _accent, label: 'Median', solid: false),
              _LegendItem(color: Color(0xFF90CAF9), label: 'Batas ±2 SD', solid: false),
              _LegendItem(color: _danger, label: 'Batas ±3 SD', solid: false),
            ]),
            const SizedBox(height: 14),
            ZScoreCardWidget(
              zScore: _getZScoreForTab(latest, tab),
              statusText: _getStatusForTab(latest, tab),
              categoryLabel: tab,
            ),
            if (latest.catatanNakes.trim().isNotEmpty) ...[
              const SizedBox(height: 14),
              _NoteCard(text: latest.catatanNakes),
            ],
          ],

          const SizedBox(height: 16),
          _buildSectionHeader(
            'Riwayat Pengukuran',
            '${_riwayatPertumbuhan.length} catatan',
          ),
          const SizedBox(height: 10),
          if (_riwayatPertumbuhan.isEmpty)
            const _EmptyState(
              icon: Icons.history_rounded,
              title: 'Belum ada riwayat',
              message: 'Tambahkan data pertumbuhan untuk mulai memantau.',
            )
          else
            ..._riwayatPertumbuhan.reversed.toList().asMap().entries.map((e) {
              final i = e.key;
              final p = e.value;
              final status = _getStatusForTab(p, tab);
              return _PertumbuhanVisitCard(
                point: p,
                index: i,
                isSelected: _selectedVisitIndex == i,
                tab: tab,
                statusText: status,
                statusColor: _statusColor,
                formatDate: _fmtDate,
                zScore: _getZScoreForTab(p, tab),
                onTap: () => setState(() {
                  _selectedVisitIndex = _selectedVisitIndex == i ? null : i;
                }),
              );
            }),

          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: FilledButton.icon(
              onPressed: () async {
                final updated = await Navigator.push<bool?>(
                  context,
                  MaterialPageRoute(
                    builder: (context) => InputCatatanPertumbuhanScreen(
                      anak: widget.anak,
                      repository: _repository,
                    ),
                  ),
                );
                if (updated ?? false) await _loadData();
              },
              style: FilledButton.styleFrom(
                backgroundColor: _primary,
                shape:
                    RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              icon: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 14),
              ),
              label: const Text(
                'Tambah data pertumbuhan',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: FilledButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PerawatanScreenIntegrated(
                      anakId: widget.anak.id,
                      anakName: widget.anak.namaAnak,
                    ),
                  ),
                );
              },
              style: FilledButton.styleFrom(
                backgroundColor: _warning,
                shape:
                    RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              icon: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(Icons.check_circle,
                    color: Colors.white, size: 14),
              ),
              label: const Text(
                'Lihat perawatan & milestone',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, String badge) {
    return Row(
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w800,
            color: _textMain,
          ),
        ),
        const Spacer(),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
          decoration: BoxDecoration(
            color: _primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            badge,
            style: const TextStyle(
              fontSize: 11,
              color: _primary,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ],
    );
  }
}

enum _StatusGroup { normal, below, above, unknown }

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String message;

  const _EmptyState({
    required this.icon,
    required this.title,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: DetailPertumbuhanScreenStateTokens.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: DetailPertumbuhanScreenStateTokens.border),
      ),
      child: Column(
        children: [
          Icon(icon, size: 44, color: DetailPertumbuhanScreenStateTokens.textSub),
          const SizedBox(height: 10),
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: DetailPertumbuhanScreenStateTokens.textMain,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 6),
          Text(
            message,
            style: const TextStyle(fontSize: 12, color: DetailPertumbuhanScreenStateTokens.textSub, height: 1.35),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// Tokens wrapper untuk dipakai di widget bawah tanpa mengulang konstanta.
// (Dibuat sebagai class agar konstanta bisa diakses dari widget stateless di bawah file.)
class DetailPertumbuhanScreenStateTokens {
  static const primary = Color(0xFF1A73E8);
  static const accent = Color(0xFF34A853);
  static const warning = Color(0xFFF9AB00);
  static const danger = Color(0xFFD93025);
  static const surface = Color(0xFFFFFFFF);
  static const bg = Color(0xFFF1F3F8);
  static const border = Color(0xFFE0E7F0);
  static const textMain = Color(0xFF1C2B4A);
  static const textSub = Color(0xFF6B7C93);
}

class _StatChip extends StatelessWidget {
  final int value;
  final String label;
  final Color color;

  const _StatChip({
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.25)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value.toString(),
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                color: color,
                height: 1,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: DetailPertumbuhanScreenStateTokens.textSub,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final Widget child;

  const _SectionCard({
    required this.title,
    required this.subtitle,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: DetailPertumbuhanScreenStateTokens.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: DetailPertumbuhanScreenStateTokens.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: DetailPertumbuhanScreenStateTokens.textMain,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 11,
              color: DetailPertumbuhanScreenStateTokens.textSub,
            ),
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _LegendItem {
  final Color color;
  final String label;
  final bool solid;

  const _LegendItem({
    required this.color,
    required this.label,
    required this.solid,
  });
}

class _LegendBox extends StatelessWidget {
  final List<_LegendItem> items;

  const _LegendBox({required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: DetailPertumbuhanScreenStateTokens.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: DetailPertumbuhanScreenStateTokens.border),
      ),
      child: Wrap(
        spacing: 16,
        runSpacing: 6,
        children: items
            .map(
              (item) => Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  item.solid
                      ? Container(
                          width: 18,
                          height: 3,
                          decoration: BoxDecoration(
                            color: item.color,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        )
                      : CustomPaint(
                          size: const Size(18, 3),
                          painter: _DashedPainter(item.color),
                        ),
                  const SizedBox(width: 6),
                  Text(
                    item.label,
                    style: const TextStyle(
                      fontSize: 11,
                      color: DetailPertumbuhanScreenStateTokens.textMain,
                    ),
                  ),
                ],
              ),
            )
            .toList(),
      ),
    );
  }
}

class _DashedPainter extends CustomPainter {
  final Color color;
  const _DashedPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    const dashWidth = 4.0;
    const dashSpace = 3.0;
    final paint = Paint()
      ..color = color
      ..strokeWidth = size.height
      ..strokeCap = StrokeCap.round;

    double startX = 0;
    while (startX < size.width) {
      canvas.drawLine(
        Offset(startX, size.height / 2),
        Offset((startX + dashWidth).clamp(0, size.width), size.height / 2),
        paint,
      );
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _LatestBanner extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String unit;
  final String statusText;
  final Color Function(String) statusColor;
  final String rightInfo;
  final String subInfo;

  const _LatestBanner({
    required this.icon,
    required this.title,
    required this.value,
    required this.unit,
    required this.statusText,
    required this.statusColor,
    required this.rightInfo,
    required this.subInfo,
  });

  @override
  Widget build(BuildContext context) {
    final sc = statusColor(statusText);

    final bg = sc == DetailPertumbuhanScreenStateTokens.textSub
      ? DetailPertumbuhanScreenStateTokens.surface
      : sc.withOpacity(0.10);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: sc.withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: sc.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: sc.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: sc, size: 30),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 11,
                    color: DetailPertumbuhanScreenStateTokens.textSub,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      value,
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        color: sc,
                        height: 1.0,
                        letterSpacing: -1,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 5),
                      child: Text(
                        unit,
                        style: const TextStyle(
                          fontSize: 13,
                          color: DetailPertumbuhanScreenStateTokens.textSub,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  subInfo,
                  style: const TextStyle(
                      fontSize: 11, color: DetailPertumbuhanScreenStateTokens.textSub),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: sc,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  statusText,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                rightInfo,
                style: const TextStyle(
                  fontSize: 11,
                  color: DetailPertumbuhanScreenStateTokens.textSub,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _NoteCard extends StatelessWidget {
  final String text;
  const _NoteCard({required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: DetailPertumbuhanScreenStateTokens.primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: DetailPertumbuhanScreenStateTokens.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline_rounded,
              size: 18, color: DetailPertumbuhanScreenStateTokens.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Catatan dari Tenaga Kesehatan',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: DetailPertumbuhanScreenStateTokens.textMain,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  text,
                  style: const TextStyle(
                    fontSize: 12,
                    color: DetailPertumbuhanScreenStateTokens.textSub,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PertumbuhanVisitCard extends StatelessWidget {
  final PertumbuhanModel point;
  final int index;
  final bool isSelected;
  final String tab;
  final String statusText;
  final Color Function(String) statusColor;
  final String Function(String) formatDate;
  final double zScore;
  final VoidCallback onTap;

  const _PertumbuhanVisitCard({
    required this.point,
    required this.index,
    required this.isSelected,
    required this.tab,
    required this.statusText,
    required this.statusColor,
    required this.formatDate,
    required this.zScore,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final sc = statusColor(statusText);
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        decoration: BoxDecoration(
          color: DetailPertumbuhanScreenStateTokens.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected
                ? sc.withOpacity(0.6)
                : DetailPertumbuhanScreenStateTokens.border,
            width: isSelected ? 1.5 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: isSelected
                  ? sc.withOpacity(0.1)
                  : const Color(0x0A000000),
              blurRadius: isSelected ? 12 : 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 10),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: DetailPertumbuhanScreenStateTokens.primary
                          .withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '${index + 1}',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: DetailPertumbuhanScreenStateTokens.primary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Usia ${point.usiaUkurBulan} bulan',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: DetailPertumbuhanScreenStateTokens.textMain,
                          ),
                        ),
                        Text(
                          formatDate(point.tglUkur),
                          style: const TextStyle(
                            fontSize: 12,
                            color: DetailPertumbuhanScreenStateTokens.textSub,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: sc.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      statusText,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: sc,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 0),
              child: Row(
                children: [
                  _DataPill(
                    icon: Icons.monitor_weight_rounded,
                    label: 'BB',
                    value: '${point.beratBadan.toStringAsFixed(1)} kg',
                    color: DetailPertumbuhanScreenStateTokens.primary,
                  ),
                  const SizedBox(width: 8),
                  _DataPill(
                    icon: Icons.height_rounded,
                    label: 'TB',
                    value: '${point.tinggiBadan.toStringAsFixed(1)} cm',
                    color: DetailPertumbuhanScreenStateTokens.accent,
                  ),
                  const SizedBox(width: 8),
                  _DataPill(
                    icon: Icons.circle_outlined,
                    label: 'LK',
                    value: '${point.lingkarKepala.toStringAsFixed(1)} cm',
                    color: DetailPertumbuhanScreenStateTokens.warning,
                  ),
                ],
              ),
            ),
            AnimatedCrossFade(
              duration: const Duration(milliseconds: 200),
              crossFadeState:
                  isSelected ? CrossFadeState.showSecond : CrossFadeState.showFirst,
              firstChild: const SizedBox.shrink(),
              secondChild: Padding(
                padding: const EdgeInsets.fromLTRB(14, 10, 14, 0),
                child: Column(
                  children: [
                    const Divider(
                        height: 1,
                        color: DetailPertumbuhanScreenStateTokens.border),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: _DetailRow(
                            label: 'IMT',
                            value: point.imt.toStringAsFixed(1),
                          ),
                        ),
                        Expanded(
                          child: _DetailRow(
                            label: 'Z-Score ($tab)',
                            value: zScore.toStringAsFixed(2),
                          ),
                        ),
                        Expanded(
                          child: _DetailRow(
                            label: 'KMS',
                            value: point.statusKMSInfo.isNotEmpty
                                ? point.statusKMSInfo
                                : '-',
                          ),
                        ),
                      ],
                    ),
                    if (point.catatanNakes.trim().isNotEmpty) ...[
                      const SizedBox(height: 10),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Catatan: ${point.catatanNakes}',
                          style: const TextStyle(
                            fontSize: 11,
                            color: DetailPertumbuhanScreenStateTokens.textSub,
                            height: 1.35,
                          ),
                        ),
                      ),
                    ],
                    const SizedBox(height: 10),
                  ],
                ),
              ),
            ),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 6),
              decoration: BoxDecoration(
                color: DetailPertumbuhanScreenStateTokens.bg,
                borderRadius:
                    const BorderRadius.vertical(bottom: Radius.circular(13)),
              ),
              child: Center(
                child: Icon(
                  isSelected
                      ? Icons.keyboard_arrow_up_rounded
                      : Icons.keyboard_arrow_down_rounded,
                  size: 18,
                  color: DetailPertumbuhanScreenStateTokens.textSub,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DataPill extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _DataPill({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 14, color: color),
                const SizedBox(width: 6),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: color,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              value,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: DetailPertumbuhanScreenStateTokens.textMain,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            color: DetailPertumbuhanScreenStateTokens.textSub,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w900,
            color: DetailPertumbuhanScreenStateTokens.textMain,
          ),
        ),
      ],
    );
  }
}
