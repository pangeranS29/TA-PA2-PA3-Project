import 'package:flutter/material.dart';
import 'catatan_detail_screen.dart';

class CatatanKesehataanGigiScreen extends StatefulWidget {
  const CatatanKesehataanGigiScreen({super.key});

  @override
  State<CatatanKesehataanGigiScreen> createState() =>
      _CatatanKesehataanGigiScreenState();
}

class _CatatanKesehataanGigiScreenState
    extends State<CatatanKesehataanGigiScreen> {
  bool isLoading = false;

  // Sample data for UI - Updated with KIA 2024 dental screening standards
  List<Map<String, dynamic>> catatanList = [
    {
      'date': '10 Jan 2026',
      'bulanke': 6,
      'kategoriUmur': '3-6 Bulan',
      'jumlahGigi': 0,
      'gigiBerlubang': 0,
      'statusPlak': 'Tidak ada',
      'kondisi': 'Sehat',
      'resikoGigiBerlubang': 'Rendah',
      'tindakan': 'Pemeriksaan rutin',
      'catatan': 'Belum ada gigi yang tumbuh. Oral hygiene baik.',
      'rekomendasi': 'Lanjutkan perawatan oral, edukasi pemberian makan',
      'status': 'normal'
    },
    {
      'date': '15 Apr 2026',
      'bulanke': 9,
      'kategoriUmur': '6-12 Bulan',
      'jumlahGigi': 4,
      'gigiBerlubang': 0,
      'statusPlak': 'Minimal',
      'kondisi': 'Sehat',
      'resikoGigiBerlubang': 'Rendah',
      'tindakan': 'Pemeriksaan berkala',
      'catatan': '4 gigi susu sudah tumbuh (2 atas, 2 bawah). Gigi bersih, tidak ada karies.',
      'rekomendasi': 'Mulai pembersihan gigi dengan kain lembab, kontrol 6 bulan lagi',
      'status': 'normal'
    },
    {
      'date': '10 Jun 2026',
      'bulanke': 12,
      'kategoriUmur': '6-12 Bulan',
      'jumlahGigi': 8,
      'gigiBerlubang': 0,
      'statusPlak': 'Ada (minor)',
      'kondisi': 'Plak ringan',
      'resikoGigiBerlubang': 'Sedang',
      'tindakan': 'Edukasi & tindakan preventif',
      'catatan': '8 gigi sudah tumbuh. Plak ringan terlihat pada permukaan awal. Anak sering dikasih minuman manis.',
      'rekomendasi': 'Kurangi minuman/makanan manis, mulai sikat gigi 2x sehari, kontrol 3 bulan',
      'status': 'attention'
    },
    {
      'date': '10 Aug 2026',
      'bulanke': 14,
      'kategoriUmur': '1-2 Tahun',
      'jumlahGigi': 12,
      'gigiBerlubang': 1,
      'statusPlak': 'Ada',
      'kondisi': 'Karies D1 (email)',
      'resikoGigiBerlubang': 'Tinggi',
      'tindakan': 'Edukasi intensif & fluoride topical',
      'catatan': '12 gigi sudah tumbuh. Ditemukan karies pada gigi molar ke-1. Plak sedang. Kebiasaan minum susu sebelum tidur.',
      'rekomendasi': 'Aplikasi fluoride topical, edukasi diet anak, sikat gigi 2x dengan bantuan orang tua, kontrol 1 bulan',
      'status': 'attention'
    },
  ];

  Color _statusColor(String status) {
    switch (status) {
      case 'normal':
        return Colors.green;
      case 'attention':
        return Colors.orange;
      case 'late':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'attention':
        return 'Perlu perhatian';
      case 'late':
        return 'Terlambat';
      default:
        return '-';
    }
  }

  Widget _buildDentalStatusTag(String label, String value, String type) {
    Color bgColor;
    Color textColor;

    // Tag untuk dental parameters
    if (type == 'gigi_berlubang' && int.tryParse(value) != null && int.parse(value) == 0) {
      bgColor = const Color(0xFFD4EDDA);
      textColor = const Color(0xFF155724);
    } else if (type == 'status_plak' && (value.toLowerCase().contains('tidak') || value.toLowerCase().contains('minimal'))) {
      bgColor = const Color(0xFFD4EDDA);
      textColor = const Color(0xFF155724);
    } else if (type == 'risiko' && value.toLowerCase().contains('rendah')) {
      bgColor = const Color(0xFFD4EDDA);
      textColor = const Color(0xFF155724);
    } else if (type == 'risiko' && value.toLowerCase().contains('sedang')) {
      bgColor = const Color(0xFFFFF3CD);
      textColor = const Color(0xFF856404);
    } else if (type == 'risiko' && value.toLowerCase().contains('tinggi')) {
      bgColor = const Color(0xFFF8D7DA);
      textColor = const Color(0xFF721C24);
    } else if (type == 'status_plak' && value.toLowerCase().contains('ada')) {
      bgColor = const Color(0xFFFFF3CD);
      textColor = const Color(0xFF856404);
    } else {
      bgColor = const Color(0xFFE2E3E5);
      textColor = const Color(0xFF383D41);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 11, color: textColor, fontWeight: FontWeight.w500),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Kesehatan Gigi',
              style: TextStyle(
                color: Color(0xFF172033),
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Pantau kesehatan gigi dan mulut anak',
              style: TextStyle(
                color: Color(0xFF7B8798),
                fontSize: 13,
              ),
            ),
          ],
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF172033)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Reminder
          Container(
            width: double.infinity,
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                const Icon(Icons.notifications_active, color: Color(0xFFD32F2F)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Kontrol gigi: 6 bulan lagi', style: TextStyle(fontWeight: FontWeight.w600)),
                      SizedBox(height: 4),
                      Text('Imunisasi berikutnya: 20 Mei 2026', style: TextStyle(color: Color(0xFF7B8798))),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: catatanList.length + 1,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      if (index == catatanList.length) {
                        return ElevatedButton.icon(
                          onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tambah catatan belum tersedia'))),
                          icon: const Icon(Icons.add),
                          label: const Text('Tambah Catatan'),
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFD32F2F)),
                        );
                      }

                      final item = catatanList[index];
                      return Card(
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          title: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(item['date'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Usia: ${item['bulanke']} bulan (${item['kategoriUmur']})',
                                    style: const TextStyle(fontSize: 12, color: Color(0xFF7B8798)),
                                  ),
                                ],
                              ),
                              Chip(
                                label: Text(_statusLabel(item['status'] ?? '-')),
                                backgroundColor: _statusColor(item['status'] ?? '').withOpacity(0.12),
                                labelStyle: TextStyle(color: _statusColor(item['status'] ?? '')),
                              ),
                            ],
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 8),
                              Text(
                                'Kondisi: ${item['kondisi'] ?? ''}',
                                style: const TextStyle(fontWeight: FontWeight.w500),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Gigi: ${item['jumlahGigi'] ?? 0} | Berlubang: ${item['gigiBerlubang'] ?? 0}',
                                style: const TextStyle(color: Color(0xFF7B8798), fontSize: 12),
                              ),
                              const SizedBox(height: 6),
                              // Dental parameters tags
                              Wrap(
                                spacing: 8,
                                children: [
                                  _buildDentalStatusTag(
                                    'Plak: ${item['statusPlak']}',
                                    item['statusPlak'] ?? '',
                                    'status_plak',
                                  ),
                                  _buildDentalStatusTag(
                                    'Risiko: ${item['resikoGigiBerlubang']}',
                                    item['resikoGigiBerlubang'] ?? '',
                                    'risiko',
                                  ),
                                ],
                              ),
                            ],
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                          isThreeLine: true,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => CatatanDetailScreen(data: item, title: 'Detail Kesehatan Gigi')),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tambah catatan belum tersedia'))),
        icon: const Icon(Icons.add),
        label: const Text('Tambah Catatan'),
        backgroundColor: const Color(0xFFD32F2F),
      ),
    );
  }
}
