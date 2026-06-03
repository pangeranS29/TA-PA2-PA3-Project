import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
<<<<<<< HEAD
=======
import 'package:ta_pa2_pa3_project/features/anak/imunisasi/data/models/ringkasan_imunisasi_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/imunisasi/data/services/ringkasan_imunisasi_service.dart';
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c

class ImunisasiScreen extends StatefulWidget {
  final Map<String, dynamic>? anak;

  const ImunisasiScreen({super.key, this.anak});

  @override
  State<ImunisasiScreen> createState() => _ImunisasiScreenState();
}

class _ImunisasiScreenState extends State<ImunisasiScreen> {
  DateTime _focusedMonth = DateTime(2026, 4);

<<<<<<< HEAD
  final List<int> _selesaiDays = [4, 10];
  final List<int> _dijadwalkanDays = [24];
  final int _todayDay = 17;

  final List<Map<String, dynamic>> _riwayat = [
    {'nama': 'K1 & K2', 'tanggal': '5 Apr 2026', 'status': 'selesai'},
    {'nama': 'TT1 (Tetanus)', 'tanggal': '5 Apr 2026', 'status': 'selesai'},
    {'nama': 'TT2 (Tetanus)', 'tanggal': '1 Apr 2026', 'status': 'selesai'},
    {'nama': 'Hepatitis B', 'tanggal': '28 Apr 2026', 'status': 'menunggu'},
  ];
=======
  bool _isLoading = true;
  RingkasanImunisasiModel? _data;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final anakId = widget.anak?["id"];

      final service = RingkasanImunisasiService();

      final result = await service.getRingkasanImunisasiByAnakId(anakId);

      if (result.isNotEmpty) {
        setState(() {
          _data = result.first;
          _isLoading = false;
        });
      } else {
        setState(() {
          _data = null;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c

  String get _monthLabel {
    const months = [
      '',
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
    return '${months[_focusedMonth.month]} ${_focusedMonth.year}';
  }

  void _prevMonth() {
    setState(() {
      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month - 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month + 1);
    });
  }

  Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
<<<<<<< HEAD
      case 'selesai':
        return const Color(0xFF1B9E5F);
      case 'menunggu':
        return const Color(0xFFF59E0B);
      case 'terlambat':
        return Colors.red;
      default:
        return Colors.grey;
=======
      case 'mendekati':
        return Colors.orange;
      case 'jatuh tempo':
        return Colors.blue;
      case 'terlewat':
        return Colors.red;
      case 'terlambat':
        return Colors.deepOrange;
      case 'krisis':
        return Colors.red;
      default:
        return Colors.green;
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    }
  }

  @override
  Widget build(BuildContext context) {
<<<<<<< HEAD
    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FB),
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
              child: Column(
                children: [
                  _buildStatusCard(),
                  const SizedBox(height: 14),
                  _buildHistory(),
                  const SizedBox(height: 14),
                  _buildQuickAction(),
                ],
              ),
            ),
          ),
        ],
      ),
=======
    final nama = _data?.namaAnak ?? (widget.anak?["nama"] ?? "").toString();

    final selesai = _data?.jumlahSelesai ?? 0;
    final terlewat = _data?.jumlahTerlewat ?? 0;
    final jadwal = _data?.jadwal ?? [];

    final total = jadwal.isEmpty ? 1 : jadwal.length;
    final progress = total == 0 ? 0.0 : selesai / total;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FB),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                _buildHeader(nama),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
                    child: Column(
                      children: [
                        _buildStatusCard(selesai, total, progress),
                        const SizedBox(height: 14),
                        _buildHistory(jadwal),
                      ],
                    ),
                  ),
                ),
              ],
            ),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    );
  }

  // ================= HEADER =================
<<<<<<< HEAD
  Widget _buildHeader() {
    final nama = (widget.anak?["nama"] ?? "").toString();

=======
  Widget _buildHeader(String nama) {
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    return Container(
      padding: const EdgeInsets.only(top: 55, left: 16, right: 16, bottom: 40),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: TrimesterTheme.t1Gradient,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: const Icon(Icons.arrow_back, color: Colors.white),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Ringkasan Imunisasi',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                nama,
<<<<<<< HEAD
                style: const TextStyle(color: Colors.white70, fontSize: 12),
=======
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ================= STATUS CARD =================
<<<<<<< HEAD
  Widget _buildStatusCard() {
=======
  Widget _buildStatusCard(int selesai, int total, double progress) {
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "PROGRESS IMUNISASI",
<<<<<<< HEAD
            style:
                TextStyle(fontSize: 11, color: Colors.grey, letterSpacing: 1),
=======
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey,
              letterSpacing: 1,
            ),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
<<<<<<< HEAD
                "6",
=======
                "$selesai",
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: TrimesterTheme.t1Primary,
                ),
              ),
              const SizedBox(width: 6),
<<<<<<< HEAD
              const Padding(
                padding: EdgeInsets.only(bottom: 6),
                child: Text("/13 selesai"),
=======
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text("/$total selesai"),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
<<<<<<< HEAD
              value: 6 / 24,
=======
              value: progress,
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
              minHeight: 8,
              backgroundColor: const Color(0xFFE5E7EB),
              color: TrimesterTheme.t1Primary,
            ),
          ),
          const SizedBox(height: 10),
<<<<<<< HEAD
          const Text(
            "Status imunisasi anak dipantau secara berkala sesuai jadwal nasional.",
            style: TextStyle(fontSize: 11, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  // ================= QUICK ACTION =================
  Widget _buildQuickAction() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: _cardDecoration(),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.calendar_month),
              label: const Text("Lihat Jadwal"),
              style: ElevatedButton.styleFrom(
                backgroundColor: TrimesterTheme.t1Primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
=======
          // Text(
          //   "Terlewat: $terlewat jadwal imunisasi",
          //   style: const TextStyle(fontSize: 11, color: Colors.grey),
          // ),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
        ],
      ),
    );
  }

  // ================= HISTORY =================
<<<<<<< HEAD
  Widget _buildHistory() {
=======
  Widget _buildHistory(List<JadwalImunisasiModel> jadwal) {
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "RIWAYAT IMUNISASI",
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
<<<<<<< HEAD
          ..._riwayat.map((e) {
            final color = getStatusColor(e['status']);
=======
          ...jadwal.map((e) {
            final color = getStatusColor(e.status);
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF9FAFB),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: color,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
<<<<<<< HEAD
                          e['nama'],
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Text(
                          e['tanggal'],
                          style:
                              const TextStyle(fontSize: 11, color: Colors.grey),
=======
                          e.namaDosis,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          e.tanggalEstimasi
                                  ?.toIso8601String()
                                  .split("T")
                                  .first ??
                              "",
                          style: const TextStyle(
                            fontSize: 11,
                            color: Colors.grey,
                          ),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
                        ),
                      ],
                    ),
                  ),
                  Container(
<<<<<<< HEAD
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
=======
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
<<<<<<< HEAD
                      e['status'],
=======
                      e.status,
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
                      style: TextStyle(fontSize: 11, color: color),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // ================= CARD =================
  BoxDecoration _cardDecoration() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 10,
        )
      ],
    );
  }
}
