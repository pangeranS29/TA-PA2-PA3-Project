import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/data/models/pertumbuhan_model.dart';
import 'package:ta_pa2_pa3_project/data/services/pertumbuhan_api_service.dart';

class TumbuhKembangScreen extends StatefulWidget {
  const TumbuhKembangScreen({super.key});

  @override
  State<TumbuhKembangScreen> createState() => _TumbuhKembangScreenState();
}

class _TumbuhKembangScreenState extends State<TumbuhKembangScreen> {
  final PertumbuhanApiService _service = PertumbuhanApiService();

  final TextEditingController _anakIdController = TextEditingController(text: '1');
  final TextEditingController _tglController = TextEditingController();
  final TextEditingController _bbController = TextEditingController();
  final TextEditingController _tbController = TextEditingController();
  final TextEditingController _lkController = TextEditingController();
  final TextEditingController _catatanController = TextEditingController();

  bool _isLoading = false;
  bool _isPosting = false;
  String? _errorMessage;
  List<PertumbuhanModel> _riwayat = const [];

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _tglController.text =
        '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
    _loadRiwayat();
  }

  @override
  void dispose() {
    _service.dispose();
    _anakIdController.dispose();
    _tglController.dispose();
    _bbController.dispose();
    _tbController.dispose();
    _lkController.dispose();
    _catatanController.dispose();
    super.dispose();
  }

  Future<void> _loadRiwayat() async {
    final anakId = int.tryParse(_anakIdController.text.trim());
    if (anakId == null || anakId <= 0) {
      setState(() {
        _errorMessage = 'Anak ID harus angka lebih dari 0.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = await _service.getRiwayatPertumbuhanByAnakId(anakId);
      if (!mounted) return;
      setState(() {
        _riwayat = data;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _submitCatatan() async {
    final anakId = int.tryParse(_anakIdController.text.trim());
    final bb = double.tryParse(_bbController.text.trim());
    final tb = double.tryParse(_tbController.text.trim());
    final lk = _lkController.text.trim().isEmpty
        ? null
        : double.tryParse(_lkController.text.trim());

    if (anakId == null || anakId <= 0 || bb == null || tb == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Isi Anak ID, berat badan, dan tinggi badan dengan benar.')),
      );
      return;
    }

    setState(() {
      _isPosting = true;
    });

    try {
      await _service.createCatatanPertumbuhan(
        CreatePertumbuhanRequest(
          anakId: anakId,
          tglUkur: _tglController.text.trim(),
          beratBadan: bb,
          tinggiBadan: tb,
          lingkarKepala: lk,
          catatanNakes: _catatanController.text.trim(),
        ),
      );

      if (!mounted) return;
      _bbController.clear();
      _tbController.clear();
      _lkController.clear();
      _catatanController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Catatan pertumbuhan berhasil ditambahkan.')),
      );
      await _loadRiwayat();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isPosting = false;
        });
      }
    }
  }

  Color _statusColor(String value) {
    final lower = value.toLowerCase();
    if (lower.contains('baik') || lower.contains('normal') || lower.contains('naik')) {
      return Colors.green;
    }
    if (lower.contains('kurang') || lower.contains('pendek') || lower.contains('tidak')) {
      return Colors.orange;
    }
    return Colors.red;
  }

  @override
  Widget build(BuildContext context) {
    final latest = _riwayat.isNotEmpty ? _riwayat.first : null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tumbuh Kembang Anak'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadRiwayat,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _menuCard(
              title: 'Ambil Riwayat Pertumbuhan',
              subtitle: 'Sesuai endpoint GET /pertumbuhan/:anak_id',
              icon: Icons.list_alt_outlined,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _anakIdController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Anak ID',
                        border: OutlineInputBorder(),
                        isDense: true,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  FilledButton(
                    onPressed: _isLoading ? null : _loadRiwayat,
                    child: _isLoading
                        ? const SizedBox(
                            width: 14,
                            height: 14,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Load'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            _menuCard(
              title: 'Input Catatan Pertumbuhan',
              subtitle: 'Sesuai endpoint POST /pertumbuhan',
              icon: Icons.edit_note_outlined,
              child: Column(
                children: [
                  TextField(
                    controller: _tglController,
                    decoration: const InputDecoration(
                      labelText: 'Tanggal Ukur (YYYY-MM-DD)',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _bbController,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          decoration: const InputDecoration(
                            labelText: 'Berat (kg)',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: TextField(
                          controller: _tbController,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          decoration: const InputDecoration(
                            labelText: 'Tinggi (cm)',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _lkController,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    decoration: const InputDecoration(
                      labelText: 'Lingkar Kepala (opsional)',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _catatanController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      labelText: 'Catatan Nakes (opsional)',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: _isPosting ? null : _submitCatatan,
                      icon: _isPosting
                          ? const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.save_outlined),
                      label: const Text('Simpan Catatan'),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            _menuCard(
              title: 'Grafik Berat/Tinggi',
              subtitle: 'Ringkas dari data riwayat terbaru',
              icon: Icons.show_chart,
              child: SizedBox(
                height: 180,
                child: _riwayat.length < 2
                    ? const Center(child: Text('Minimal 2 data riwayat untuk menampilkan grafik.'))
                    : CustomPaint(
                        painter: _GrowthChartPainter(items: _riwayat.reversed.take(8).toList()),
                      ),
              ),
            ),
            const SizedBox(height: 14),
            _menuCard(
              title: 'Status Tumbuh Kembang Terakhir',
              subtitle: 'Status antropometri dari backend',
              icon: Icons.health_and_safety_outlined,
              child: latest == null
                  ? const Text('Belum ada data status.')
                  : Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _statusChip('BB/U', latest.statusBBU),
                        _statusChip('TB/U', latest.statusTBU),
                        _statusChip('IMT/U', latest.statusIMTU),
                        _statusChip('BB/TB', latest.statusBBTB),
                        _statusChip('LK/U', latest.statusLKU),
                        _statusChip('KMS Naik', latest.statusKMSNaik),
                        _statusChip('KMS BGM', latest.statusKMSBGM),
                      ],
                    ),
            ),
            if (_errorMessage != null) ...[
              const SizedBox(height: 12),
              Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            ],
            const SizedBox(height: 10),
            const Text('Riwayat Pertumbuhan', style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            ..._riwayat.map(
              (e) => Card(
                child: ListTile(
                  title: Text('Tanggal ${e.tglUkur} • Usia ${e.usiaUkurBulan} bln'),
                  subtitle: Text('BB ${e.beratBadan.toStringAsFixed(1)} kg • TB ${e.tinggiBadan.toStringAsFixed(1)} cm'),
                  trailing: Text(e.statusBBU),
                ),
              ),
            ),
            if (_riwayat.isEmpty && !_isLoading)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Text('Data riwayat belum ada.'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _statusChip(String label, String value) {
    final color = _statusColor(value);
    return Chip(
      backgroundColor: color.withValues(alpha: 0.15),
      side: BorderSide(color: color),
      label: Text('$label: $value'),
    );
  }

  Widget _menuCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF1976D2)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}

class _GrowthChartPainter extends CustomPainter {
  final List<PertumbuhanModel> items;

  _GrowthChartPainter({required this.items});

  @override
  void paint(Canvas canvas, Size size) {
    final axisPaint = Paint()
      ..color = Colors.grey.shade400
      ..strokeWidth = 1;
    canvas.drawLine(Offset(0, size.height), Offset(size.width, size.height), axisPaint);

    if (items.length < 2) return;

    final values = [
      ...items.map((e) => e.beratBadan),
      ...items.map((e) => e.tinggiBadan),
    ];

    final minV = values.reduce((a, b) => a < b ? a : b);
    final maxV = values.reduce((a, b) => a > b ? a : b);
    final range = (maxV - minV).abs() < 0.1 ? 1.0 : (maxV - minV);

    Offset mapPoint(int index, double v) {
      final xStep = size.width / (items.length - 1);
      final x = xStep * index;
      final y = size.height - ((v - minV) / range) * (size.height - 6);
      return Offset(x, y);
    }

    final bbPath = Path();
    final tbPath = Path();

    for (var i = 0; i < items.length; i++) {
      final bb = mapPoint(i, items[i].beratBadan);
      final tb = mapPoint(i, items[i].tinggiBadan);
      if (i == 0) {
        bbPath.moveTo(bb.dx, bb.dy);
        tbPath.moveTo(tb.dx, tb.dy);
      } else {
        bbPath.lineTo(bb.dx, bb.dy);
        tbPath.lineTo(tb.dx, tb.dy);
      }
    }

    canvas.drawPath(
      bbPath,
      Paint()
        ..color = Colors.teal
        ..strokeWidth = 2
        ..style = PaintingStyle.stroke,
    );

    canvas.drawPath(
      tbPath,
      Paint()
        ..color = Colors.deepOrange
        ..strokeWidth = 2
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(covariant _GrowthChartPainter oldDelegate) {
    return oldDelegate.items != items;
  }
}
