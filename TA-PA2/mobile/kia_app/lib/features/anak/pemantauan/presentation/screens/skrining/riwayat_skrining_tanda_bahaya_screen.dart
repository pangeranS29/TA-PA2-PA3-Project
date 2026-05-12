import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/pemantauan/data/models/lembar_pemantauan_dynamic_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/pemantauan/data/services/lembar_pemantauan_api_service.dart';

class RiwayatSkriningTandaBahayaScreen extends StatefulWidget {
  final Map<String, dynamic>? anak;

  const RiwayatSkriningTandaBahayaScreen({super.key, this.anak});

  @override
  State<RiwayatSkriningTandaBahayaScreen> createState() => _RiwayatSkriningTandaBahayaScreenState();
}

class _RiwayatSkriningTandaBahayaScreenState extends State<RiwayatSkriningTandaBahayaScreen> {
  final LembarPemantauanApiService _service = LembarPemantauanApiService();
  bool _loading = true;
  List<LembarPemantauanModel> _records = const [];

  String get _namaAnak => (widget.anak?['nama'] ?? 'Si Kecil').toString();
  String get _usiaAnak => (widget.anak?['usia_teks'] ?? 'Usia tidak diketahui').toString();

  @override
  void initState() {
    super.initState();
    _loadRecords();
  }

  @override
  void dispose() {
    _service.dispose();
    super.dispose();
  }

  Future<void> _loadRecords() async {
    setState(() {
      _loading = true;
    });

    try {
      final anakRaw = widget.anak?['id'];
      final anakId = anakRaw is int
          ? anakRaw
          : int.tryParse((anakRaw ?? '').toString()) ?? 0;

      if (anakId > 0) {
        final records = await _service.getRiwayatPemantauan(anakId);
        records.sort((a, b) => b.tanggalPeriksa.compareTo(a.tanggalPeriksa));
        if (!mounted) return;
        setState(() {
          _records = records;
        });
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal memuat riwayat skrining: $e')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Diterima':
        return Colors.green;
      case 'Ditolak':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }

  String _periodeLabel(LembarPemantauanModel record) {
    final satuan = record.rentangUsia?.satuanWaktu.toLowerCase().trim() ?? '';
    final periode = record.periodeWaktu;
    if (satuan == 'hari') return 'Hari ke-$periode';
    if (satuan == 'minggu') return 'Minggu ke-$periode';
    if (satuan == 'bulan') return 'Bulan ke-$periode';
    if (satuan == 'tahun') return 'Tahun ke-$periode';
    return 'Periode ke-$periode';
  }

  String _examinerLabel(String value) {
    final cleaned = value.trim();
    return cleaned.isEmpty ? '-' : cleaned;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        centerTitle: false,
        iconTheme: const IconThemeData(color: Colors.black),
        title: const Text(
          'Riwayat Skrining',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: _loadRecords,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _records.isEmpty
                ? ListView(
                    padding: const EdgeInsets.all(20),
                    children: [
                      const SizedBox(height: 24),
                      _buildEmptyState(context),
                    ],
                  )
                : ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      _buildHeaderCard(),
                      const SizedBox(height: 16),
                      ..._records.map((record) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _buildRecordCard(record),
                        );
                      }),
                    ],
                  ),
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Color(0xFFFEE2E2),
            ),
            child: const Icon(
              Icons.history_rounded,
              color: Color(0xFFDC2626),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _namaAnak,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _usiaAnak,
                  style: TextStyle(
                    fontSize: 12.5,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '${_records.length} catatan skrining tersimpan',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF475569),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecordCard(LembarPemantauanModel record) {
    final statusColor = _statusColor(record.status);
    final examiner = _examinerLabel(record.namaPemeriksa);
    final detailSelesai = record.detailGejala.where((item) => item.isTerjadi).toList();
    final selectedGejalaList = detailSelesai
        .map((d) => d.kategoriTandaSakit?.gejala ?? 'Gejala tidak diketahui')
        .toList();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      record.rentangUsia?.namaRentang ?? '-',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _periodeLabel(record),
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey.shade700,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  record.status,
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _infoRow(Icons.calendar_today_rounded, 'Tanggal', record.tanggalPeriksa),
          const SizedBox(height: 8),
          _infoRow(Icons.badge_rounded, 'Pemeriksa', examiner),
          const SizedBox(height: 8),
          _infoRow(
            Icons.checklist_rounded,
            'Gejala terpilih',
            '${detailSelesai.length} item',
          ),
          if (selectedGejalaList.isNotEmpty) ...[
            const SizedBox(height: 10),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Gejala yang ditemukan:',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...selectedGejalaList.asMap().entries.map((entry) {
                    final index = entry.key;
                    final gejala = entry.value;
                    return Padding(
                      padding: EdgeInsets.only(bottom: index < selectedGejalaList.length - 1 ? 8 : 0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${index + 1}. ',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Expanded(
                            child: Text(
                              gejala,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF475569),
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],
          const SizedBox(height: 8),
          _infoRow(
            Icons.verified_rounded,
            'Tgl verifikasi',
            record.status == 'Menunggu verifikasi' ? '-' : record.updatedAt,
          ),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: const Color(0xFF64748B)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            '$label: $value',
            style: TextStyle(
              fontSize: 12.5,
              height: 1.35,
              color: Colors.grey.shade700,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Color(0xFFFEE2E2),
            ),
            child: const Icon(
              Icons.history_rounded,
              color: Color(0xFFDC2626),
              size: 32,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Belum ada riwayat skrining',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Hasil skrining yang sudah disimpan akan muncul di sini.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              height: 1.45,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: _loadRecords,
              child: const Text('Muat ulang'),
            ),
          ),
        ],
      ),
    );
  }
}
