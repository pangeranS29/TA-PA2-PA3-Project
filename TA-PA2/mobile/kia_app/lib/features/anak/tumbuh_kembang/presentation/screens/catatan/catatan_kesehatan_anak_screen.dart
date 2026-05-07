import 'package:flutter/material.dart';
import 'catatan_detail_screen.dart';

class CatatanKesehataanAnakScreen extends StatefulWidget {
  const CatatanKesehataanAnakScreen({super.key});

  @override
  State<CatatanKesehataanAnakScreen> createState() =>
      _CatatanKesehataanAnakScreenState();
}

class _CatatanKesehataanAnakScreenState
    extends State<CatatanKesehataanAnakScreen> {
  bool isLoading = false;

  // Sample data to demonstrate UI (replace with API data later)
  // Data now includes KIA 2024 standards: age categories, growth indicators, screening
  List<Map<String, dynamic>> catatanList = [
    {
      'date': '12 Jan 2026',
      'kategoriUmur': '0-28 Hari (Neonatus)',
      'periode': 'Kunjungan ke-1',
      'jenis': 'Imunisasi DPT',
      'tempat': 'Puskesmas',
      'tenaga': 'Bidan',
      'bb': '3.5 kg',
      'tb': '50 cm',
      'lk': '34 cm',
      'bbU_status': 'Normal',
      'tbU_status': 'Normal',
      'imtU_status': 'Normal',
      'bbTb_status': 'Normal',
      'lkU_status': 'Normal',
      'kpsp': 'Normal',
      'mchat': 'Normal',
      'catatan': 'Anak sehat, tidak ada keluhan. Perkembangan sesuai umur.',
      'rekomendasi': 'Kontrol ulang 2 minggu (usia 2 minggu)',
      'status': 'normal'
    },
    {
      'date': '03 Feb 2026',
      'kategoriUmur': '1-3 Bulan (Bayi)',
      'periode': 'Kunjungan ke-2',
      'jenis': 'Pemeriksaan Rutin & Vaksin',
      'tempat': 'Posyandu',
      'tenaga': 'Bidan',
      'bb': '5.2 kg',
      'tb': '57 cm',
      'lk': '38 cm',
      'bbU_status': 'Normal',
      'tbU_status': 'Normal',
      'imtU_status': 'Normal',
      'bbTb_status': 'Normal',
      'lkU_status': 'Normal',
      'kpsp': 'Normal',
      'mchat': 'Normal',
      'catatan': 'Perkembangan baik, reaksi mata mengikuti gerakan, bersuara.',
      'rekomendasi': 'Lanjutkan vaksinasi sesuai jadwal, kontrol 1 bulan lagi',
      'status': 'normal'
    },
    {
      'date': '15 Mar 2026',
      'kategoriUmur': '3-6 Bulan (Bayi)',
      'periode': 'Kunjungan ke-3',
      'jenis': 'Pemeriksaan Lanjutan',
      'tempat': 'Puskesmas',
      'tenaga': 'Dokter',
      'bb': '6.8 kg',
      'tb': '63 cm',
      'lk': '40 cm',
      'bbU_status': 'Normal',
      'tbU_status': 'Perhatian',
      'imtU_status': 'Normal',
      'bbTb_status': 'Normal',
      'lkU_status': 'Normal',
      'kpsp': 'Normal',
      'mchat': 'Normal',
      'catatan': 'Pertumbuhan TB sedikit melambat, pemberian ASI ditingkatkan.',
      'rekomendasi': 'Monitoring TB setiap bulan, edukasi pemberian MPASI persiapan',
      'status': 'attention'
    },
  ];

  @override
  void initState() {
    super.initState();
    // In real app, fetch data here. We show sample data for UI.
  }

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

  Widget _buildStatusTag(String label, String status) {
    Color bgColor;
    Color textColor;

    if (status.toLowerCase() == 'normal') {
      bgColor = const Color(0xFFD4EDDA);
      textColor = const Color(0xFF155724);
    } else if (status.toLowerCase().contains('perhatian') || status.toLowerCase().contains('penuh perhatian')) {
      bgColor = const Color(0xFFFFF3CD);
      textColor = const Color(0xFF856404);
    } else if (status.toLowerCase().contains('berat')) {
      bgColor = const Color(0xFFF8D7DA);
      textColor = const Color(0xFF721C24);
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
              'Catatan Kesehatan Anak',
              style: TextStyle(
                color: Color(0xFF172033),
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Aisyah (2 Tahun)',
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
          // Reminder banner
          Container(
            width: double.infinity,
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                const Icon(Icons.notifications_active, color: Color(0xFF2F80ED)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Imunisasi berikutnya: 20 Mei 2026', style: TextStyle(fontWeight: FontWeight.w600)),
                      SizedBox(height: 4),
                      Text('Kontrol gigi: 6 bulan lagi', style: TextStyle(color: Color(0xFF7B8798))),
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
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2F80ED)),
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
                                    item['kategoriUmur'] ?? '',
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
                              Text(item['jenis'] ?? '', style: const TextStyle(fontWeight: FontWeight.w500)),
                              const SizedBox(height: 4),
                              Text(item['tempat'] ?? '', style: const TextStyle(color: Color(0xFF7B8798), fontSize: 12)),
                              const SizedBox(height: 6),
                              // Growth indicators summary
                              Wrap(
                                spacing: 8,
                                children: [
                                  if (item['bbU_status'] != null)
                                    _buildStatusTag('BB-U: ${item['bbU_status']}', item['bbU_status']),
                                  if (item['tbU_status'] != null)
                                    _buildStatusTag('TB-U: ${item['tbU_status']}', item['tbU_status']),
                                  if (item['kpsp'] != null)
                                    _buildStatusTag('KPSP: ${item['kpsp']}', item['kpsp']),
                                ],
                              ),
                            ],
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                          isThreeLine: true,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => CatatanDetailScreen(data: item, title: 'Detail Catatan')),
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
        backgroundColor: const Color(0xFF2F80ED),
      ),
    );
  }
}
