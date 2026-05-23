import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/absensi/data/datasources/absensi_kelas_ibu_balita_api_service.dart';
import 'package:ta_pa2_pa3_project/features/absensi/data/models/absensi_kelas_ibu_balita_model.dart';

class AbsensiKelasIbuBalitaScreen extends StatefulWidget {
  const AbsensiKelasIbuBalitaScreen({super.key});

  @override
  State<AbsensiKelasIbuBalitaScreen> createState() =>
      _AbsensiKelasIbuBalitaScreenState();
}

class _AbsensiKelasIbuBalitaScreenState
    extends State<AbsensiKelasIbuBalitaScreen> {
  final _apiService = AbsensiKelasIbuBalitaApiService();

  List<AbsensiKelasIbuBalitaModel> _absensiList = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadAbsensi();
  }

  @override
  void dispose() {
    _apiService.dispose();
    super.dispose();
  }

  Future<void> _loadAbsensi() async {
    setState(() => _isLoading = true);
    try {
      final list = await _apiService.getMine();
      setState(() => _absensiList = list);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), behavior: SnackBarBehavior.floating),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  int get _totalHadir => _absensiList.length;
  int get _tervalidasi =>
      _absensiList.where((a) => a.namaKader.isNotEmpty).length;

  void _showTambahAbsensi() {
    DateTime? selectedDate;
    final dateController = TextEditingController();
    bool isSaving = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Isi Absensi Baru',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1A1A2E),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(ctx),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Pilih Tanggal Hadir
                  const Text(
                    'Pilih Tanggal Hadir',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF374151),
                    ),
                  ),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: () async {
                      final now = DateTime.now();
                      final picked = await showDatePicker(
                        context: ctx,
                        initialDate: selectedDate ?? now,
                        firstDate: DateTime(now.year - 2),
                        lastDate: now,
                        cancelText: 'Batal',
                        confirmText: 'Pilih',
                      );
                      if (picked != null) {
                        setModalState(() {
                          selectedDate = picked;
                          dateController.text =
                              '${picked.month.toString().padLeft(2, '0')}/${picked.day.toString().padLeft(2, '0')}/${picked.year}';
                        });
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFFD1D5DB)),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              dateController.text.isEmpty
                                  ? 'MM/DD/YYYY'
                                  : dateController.text,
                              style: TextStyle(
                                fontSize: 14,
                                color: dateController.text.isEmpty
                                    ? const Color(0xFF9CA3AF)
                                    : const Color(0xFF1A1A2E),
                              ),
                            ),
                          ),
                          const Icon(Icons.calendar_today_outlined,
                              size: 20, color: Color(0xFF6B7280)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Info box
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFBFDBFE)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.info_outline, size: 18, color: Color(0xFF3B82F6)),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Data kehadiran yang Anda kirimkan akan diverifikasi secara berkala oleh petugas kesehatan puskesmas setempat untuk validasi riwayat kesehatan.',
                            style: TextStyle(
                              fontSize: 12,
                              color: Color(0xFF1D4ED8),
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Kirim button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      onPressed: isSaving || selectedDate == null
                          ? null
                          : () async {
                              setModalState(() => isSaving = true);
                              try {
                                final newItem = await _apiService.save(
                                  AbsensiKelasIbuBalitaModel(
                                    pertemuanKe: _absensiList.length + 1,
                                    tanggal:
                                        '${selectedDate!.year}-${selectedDate!.month.toString().padLeft(2, '0')}-${selectedDate!.day.toString().padLeft(2, '0')}',
                                    namaKader: '',
                                    tanggalParaf: '',
                                  ),
                                );
                                if (!mounted) return;
                                Navigator.pop(ctx);
                                setState(() => _absensiList.add(newItem));
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Absensi berhasil dikirim'),
                                    behavior: SnackBarBehavior.floating,
                                  ),
                                );
                              } catch (e) {
                                setModalState(() => isSaving = false);
                                if (!mounted) return;
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(e.toString()),
                                    behavior: SnackBarBehavior.floating,
                                  ),
                                );
                              }
                            },
                      icon: isSaving
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2, color: Colors.white),
                            )
                          : const Icon(Icons.send_rounded, size: 18),
                      label: Text(
                        isSaving ? 'Mengirim...' : 'Kirim Absensi',
                        style: const TextStyle(
                            fontWeight: FontWeight.w700, fontSize: 15),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1A5FA8),
                        foregroundColor: Colors.white,
                        disabledBackgroundColor: Colors.grey.shade300,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  String _formatTanggal(String raw) {
    if (raw.isEmpty) return '-';
    try {
      final dt = DateTime.parse(raw);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      return '${dt.day} ${months[dt.month - 1]} ${dt.year}';
    } catch (_) {
      return raw;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Absensi Kelas Ibu Balita',
          style: TextStyle(
            color: Color(0xFF1E293B),
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1E293B)),
          onPressed: () => Navigator.pop(context),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: const Color(0xFFE5E7EB), height: 1),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAbsensi,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Info banner
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFBFDBFE)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.info_outline, size: 18, color: Color(0xFF3B82F6)),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Diisi oleh ibu pada setiap pertemuan. Kader memverifikasi kehadiran dengan paraf pada kolom yang tersedia.',
                            style: TextStyle(
                              fontSize: 12,
                              color: Color(0xFF1D4ED8),
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Log Kehadiran
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.fromLTRB(16, 14, 16, 10),
                          child: Text(
                            'LOG KEHADIRAN',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF6B7280),
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        // Summary row
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
                          child: Row(
                            children: [
                              Expanded(
                                child: _SummaryBox(
                                  label: 'Total hadir',
                                  value: '$_totalHadir kali',
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _SummaryBox(
                                  label: 'Kehadiran Tervalidasi',
                                  value: '$_tervalidasi kali',
                                ),
                              ),
                            ],
                          ),
                        ),

                        if (_absensiList.isNotEmpty) ...[
                          const Divider(height: 1),
                          // Table header
                          Container(
                            color: const Color(0xFFF8FAFC),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 10),
                            child: const Row(
                              children: [
                                SizedBox(
                                  width: 28,
                                  child: Text('No',
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF6B7280))),
                                ),
                                Expanded(
                                  flex: 3,
                                  child: Text('Tanggal',
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF6B7280))),
                                ),
                                Expanded(
                                  flex: 3,
                                  child: Text('Nama Kader',
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF6B7280))),
                                ),
                                SizedBox(
                                  width: 40,
                                  child: Text('Paraf',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF6B7280))),
                                ),
                              ],
                            ),
                          ),
                          const Divider(height: 1),
                          // Table rows
                          ...List.generate(_absensiList.length, (i) {
                            final item = _absensiList[i];
                            final isLast = i == _absensiList.length - 1;
                            return Column(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                  child: Row(
                                    children: [
                                      SizedBox(
                                        width: 28,
                                        child: Text('${i + 1}',
                                            style: const TextStyle(
                                                fontSize: 13,
                                                color: Color(0xFF374151))),
                                      ),
                                      Expanded(
                                        flex: 3,
                                        child: Text(
                                          _formatTanggal(item.tanggal),
                                          style: const TextStyle(
                                              fontSize: 13,
                                              color: Color(0xFF374151)),
                                        ),
                                      ),
                                      Expanded(
                                        flex: 3,
                                        child: Text(
                                          item.namaKader.isNotEmpty
                                              ? item.namaKader
                                              : '-',
                                          style: const TextStyle(
                                              fontSize: 13,
                                              color: Color(0xFF374151)),
                                        ),
                                      ),
                                      SizedBox(
                                        width: 40,
                                        child: Center(
                                          child: item.namaKader.isNotEmpty
                                              ? const Icon(Icons.check,
                                                  size: 18,
                                                  color: Color(0xFF10B981))
                                              : const Text('-',
                                                  style: TextStyle(
                                                      color:
                                                          Color(0xFF9CA3AF))),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                if (!isLast) const Divider(height: 1),
                              ],
                            );
                          }),
                        ] else ...[
                          const Padding(
                            padding: EdgeInsets.fromLTRB(16, 0, 16, 20),
                            child: Center(
                              child: Text(
                                'Belum ada data kehadiran',
                                style: TextStyle(
                                    fontSize: 13, color: Color(0xFF9CA3AF)),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Tambah Absensi button
                  SizedBox(
                    height: 50,
                    child: ElevatedButton.icon(
                      onPressed: _showTambahAbsensi,
                      icon: const Icon(Icons.add_rounded),
                      label: const Text(
                        'Tambah Absensi',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1A5FA8),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

class _SummaryBox extends StatelessWidget {
  final String label;
  final String value;

  const _SummaryBox({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label,
              style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280))),
          const SizedBox(height: 4),
          Text(value,
              style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1A1A2E))),
        ],
      ),
    );
  }
}
