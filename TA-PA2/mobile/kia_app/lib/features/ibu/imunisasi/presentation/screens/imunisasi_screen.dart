import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:ta_pa2_pa3_project/features/ibu/imunisasi/data/models/imunisasi_model.dart';
import 'package:ta_pa2_pa3_project/features/ibu/imunisasi/data/services/imunisasi_service.dart';

class ImunisasiScreen extends StatefulWidget {
  const ImunisasiScreen({super.key});

  @override
  State<ImunisasiScreen> createState() => _ImunisasiScreenState();
}

class _ImunisasiScreenState extends State<ImunisasiScreen> {
  final ImunisasiService _service = ImunisasiService();

  Future<List<ImunisasiModel>>? _futureJadwal;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    setState(() {
      _futureJadwal = _service.getJadwalImunisasi();
    });
  }

  String formatTanggal(DateTime? date) {
    if (date == null) return '-';

    return DateFormat(
      'dd MMM yyyy',
      'id_ID',
    ).format(date);
  }

  Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'mendekati':
        return Colors.orange;

      case 'jatuh tempo':
        return Colors.blue;

      case 'terlewat':
        return Colors.red;

      case 'terlambat':
        return Colors.deepOrange;

      case 'krisis':
        return Colors.red.shade900;

      default:
        return Colors.grey;
    }
  }

  @override
  void dispose() {
    _service.dispose();
    super.dispose();
  }

  Widget _buildSectionHeader({
    required String title,
    required Color color,
    required String subtitle,
  }) {
    return Padding(
      padding: const EdgeInsets.only(
        top: 8,
        bottom: 10,
      ),
      child: Row(
        children: [
          Container(
            width: 5,
            height: 40,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(30),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: color,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImunisasiItem(
    BuildContext context,
    dynamic item,
  ) {
    return GestureDetector(
      onTap: () {
        if (item.status.toLowerCase() == 'terlewat') {
          showModalBottomSheet(
            context: context,
            backgroundColor: Colors.transparent,
            builder: (_) {
              return Container(
                padding: const EdgeInsets.fromLTRB(
                  20,
                  18,
                  20,
                  30,
                ),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(
                    top: Radius.circular(28),
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 42,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Container(
                      width: 68,
                      height: 68,
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.vaccines_rounded,
                        color: Colors.blue.shade700,
                        size: 34,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      item.namaDosis,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      formatTanggal(item.tanggalEstimasi),
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 18),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(255, 247, 251, 255),
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: const Text(
                        'Halo Bunda 💛 Jadwal imunisasi ini terlewat. Yuk cek kembali ke bidan atau posyandu agar si kecil tetap terlindungi.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 13,
                          height: 1.5,
                          color: Color(0xFF475569),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);

                          showDialog(
                            context: context,
                            builder: (_) => AlertDialog(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(22),
                              ),
                              contentPadding: const EdgeInsets.fromLTRB(
                                22,
                                24,
                                22,
                                22,
                              ),
                              content: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 58,
                                    height: 58,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFFFF7ED),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.event_repeat_rounded,
                                      color: Color(0xFF2196F3),
                                      size: 30,
                                    ),
                                  ),
                                  const SizedBox(height: 18),
                                  const Text(
                                    'Atur Jadwal Susulan?',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF1E293B),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    'Bunda ingin mengatur ulang '
                                    '${item.namaDosis} '
                                    'menjadi jadwal susulan?',
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(
                                      height: 1.5,
                                      color: Color(0xFF64748B),
                                    ),
                                  ),
                                  const SizedBox(height: 24),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton(
                                          onPressed: () {
                                            Navigator.pop(context);
                                          },
                                          style: OutlinedButton.styleFrom(
                                            minimumSize: const Size(
                                              double.infinity,
                                              52,
                                            ),
                                            side: BorderSide(
                                              color: Colors.grey.shade300,
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(14),
                                            ),
                                          ),
                                          child: const Text(
                                            'Batalkan',
                                            style: TextStyle(
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed: () {
                                            Navigator.pop(context);
                                          },
                                          style: ElevatedButton.styleFrom(
                                            elevation: 0,
                                            minimumSize: const Size(
                                              double.infinity,
                                              52,
                                            ),
                                            backgroundColor:
                                                const Color(0xFF2196F3),
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(14),
                                            ),
                                          ),
                                          child: const Text(
                                            'Ya, Lanjutkan',
                                            style: TextStyle(
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          elevation: 0,
                          backgroundColor: const Color(0xFF2196F3),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            vertical: 14,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(18),
                          ),
                        ),
                        child: const Text(
                          'Atur Jadwal Susulan',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 12,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(
                0.03,
              ),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.namaDosis,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Color(
                        0xFF1E293B,
                      ),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    formatTanggal(
                      item.tanggalEstimasi,
                    ),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: getStatusColor(
                      item.status,
                    ).withOpacity(
                      0.12,
                    ),
                    borderRadius: BorderRadius.circular(
                      20,
                    ),
                  ),
                  child: Text(
                    item.status,
                    style: TextStyle(
                      fontSize: 11,
                      color: getStatusColor(
                        item.status,
                      ),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  Icons.chevron_right_rounded,
                  size: 22,
                  color: Colors.grey.shade400,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Imunisasi',
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
      body: _futureJadwal == null
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : FutureBuilder<List<ImunisasiModel>>(
              future: _futureJadwal,
              builder: (
                context,
                snapshot,
              ) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Text(
                        snapshot.error.toString(),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }

                final data = snapshot.data ?? [];

                if (data.isEmpty) {
                  return const Center(
                    child: Text(
                      'Belum ada jadwal imunisasi',
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    _loadData();
                  },
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(
                          bottom: 14,
                          left: 4,
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.info_outline_rounded,
                              size: 16,
                              color: Colors.grey.shade500,
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                'Tap nama vaksin untuk melihat detail atau mengatur jadwal.',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey.shade600,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      ...List.generate(
                        data.length,
                        (index) {
                          final anak = data[index];

                          final perhatian = anak.jadwal.where((j) {
                            final status = j.status.toLowerCase();

                            return status == 'terlewat' ||
                                status == 'krisis' ||
                                status == 'terlambat';
                          }).toList();

                          final mendekati = anak.jadwal.where((j) {
                            final status = j.status.toLowerCase();

                            return status == 'mendekati' ||
                                status == 'jatuh tempo';
                          }).toList();

                          final lainnya = anak.jadwal.where((j) {
                            return !perhatian.contains(j) &&
                                !mendekati.contains(j);
                          }).toList();

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                margin: const EdgeInsets.only(
                                  bottom: 14,
                                  top: 4,
                                ),
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(
                                    color: Colors.blue.shade100,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 52,
                                      height: 52,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF2196F3),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(
                                        Icons.child_care_rounded,
                                        color: Colors.white,
                                        size: 28,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            anak.namaAnak,
                                            style: const TextStyle(
                                              fontSize: 17,
                                              fontWeight: FontWeight.w700,
                                              color: Color(0xFF1E293B),
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.cake_outlined,
                                                size: 14,
                                                color: Colors.grey.shade600,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                'Lahir ${formatTanggal(anak.tanggalLahir)}',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.grey.shade600,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            'Pantau jadwal vaksin di sini',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey.shade700,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 6),
                              if (perhatian.isNotEmpty) ...[
                                _buildSectionHeader(
                                  title: 'Butuh Perhatian',
                                  color: Colors.red,
                                  subtitle:
                                      '${perhatian.length} imunisasi perlu diperhatikan',
                                ),
                                ...perhatian.map(
                                  (item) => _buildImunisasiItem(
                                    context,
                                    item,
                                  ),
                                ),
                              ],
                              if (mendekati.isNotEmpty) ...[
                                _buildSectionHeader(
                                  title: 'Akan Datang',
                                  color: Colors.orange,
                                  subtitle:
                                      '${mendekati.length} imunisasi mendekati jadwal',
                                ),
                                ...mendekati.map(
                                  (item) => _buildImunisasiItem(
                                    context,
                                    item,
                                  ),
                                ),
                              ],
                              if (lainnya.isNotEmpty) ...[
                                _buildSectionHeader(
                                  title: 'Lainnya',
                                  color: Colors.blueGrey,
                                  subtitle:
                                      '${lainnya.length} imunisasi lainnya',
                                ),
                                ...lainnya.map(
                                  (item) => _buildImunisasiItem(
                                    context,
                                    item,
                                  ),
                                ),
                              ],
                              const SizedBox(height: 20),
                              const SizedBox(
                                height: 20,
                              ),
                            ],
                          );
                        },
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
