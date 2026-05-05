// lib/screens/pemantauan/tanda_bahaya/tanda_bahaya_balita_screen.dart
import 'package:flutter/material.dart';

class TandaBahayaBalitaScreen extends StatelessWidget {
  const TandaBahayaBalitaScreen({Key? key}) : super(key: key);

  final List<Map<String, dynamic>> _tandaBahaya = const [
    {
      'title': 'Tidak bisa minum atau menyusu',
      'icon': Icons.no_meals,
      'level': 'Berat',
      'desc': 'Anak tidak mau atau tidak bisa minum/menyusu sama sekali',
    },
    {
      'title': 'Sering muntah',
      'icon': Icons.sick,
      'level': 'Berat',
      'desc': 'Muntah terus-menerus, tidak bisa mempertahankan makanan/minuman',
    },
    {
      'title': 'Kejang',
      'icon': Icons.bolt,
      'level': 'Berat',
      'desc': 'Terjadi kejang atau gerakan otot tidak terkontrol',
    },
    {
      'title': 'Lesu atau tidak sadar',
      'icon': Icons.bedtime,
      'level': 'Berat',
      'desc': 'Anak sangat lemah, tidak merespon saat dipanggil',
    },
    {
      'title': 'Diare berat',
      'icon': Icons.wc,
      'level': 'Berat',
      'desc': 'BAB cair lebih dari 3x dalam 24 jam dengan tanda dehidrasi',
    },
    {
      'title': 'Batuk lebih dari 2 minggu',
      'icon': Icons.air,
      'level': 'Sedang',
      'desc': 'Batuk yang tidak sembuh-sembuh, perlu diperiksa TB',
    },
    {
      'title': 'Nafas cepat atau sesak',
      'icon': Icons.air,
      'level': 'Berat',
      'desc': 'Pernapasan terlihat cepat, berat, atau sesak',
    },
    {
      'title': 'Demam tinggi',
      'icon': Icons.thermostat,
      'level': 'Sedang',
      'desc': 'Suhu tubuh tinggi yang tidak kunjung turun',
    },
    {
      'title': 'Bengkak di kedua kaki',
      'icon': Icons.accessibility_new,
      'level': 'Sedang',
      'desc': 'Edema bisa menandakan masalah gizi atau organ',
    },
    {
      'title': 'Berat badan tidak naik',
      'icon': Icons.monitor_weight,
      'level': 'Sedang',
      'desc': 'BB tidak naik atau turun pada 2 kali penimbangan berturut-turut',
    },
    {
      'title': 'Mata cekung',
      'icon': Icons.visibility_off,
      'level': 'Berat',
      'desc': 'Tanda dehidrasi berat, mata terlihat cekung',
    },
    {
      'title': 'Kulit kembali lambat saat dicubit',
      'icon': Icons.touch_app,
      'level': 'Berat',
      'desc': 'Skin turgor menurun, tanda dehidrasi berat',
    },
  ];

  void _showAlertPuskesmas(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Color(0xFFFFEDD5),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.emergency,
                size: 48,
                color: Color(0xFFEA580C),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'PERLU KE PUSKESMAS!',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: Color(0xFFEA580C),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            const Text(
              'Jika balita menunjukkan tanda bahaya, segera bawa ke puskesmas atau fasilitas kesehatan terdekat untuk mendapatkan penanganan yang tepat.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Color(0xFF64748B),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Mengerti',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
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
          'Tanda Bahaya Balita',
          style: TextStyle(
            color: Color(0xFF1E293B),
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios,
              color: Color(0xFF1E293B), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Header Warning
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFFFFEDD5),
            ),
            child: Row(
              children: [
                const Icon(Icons.report_problem, color: Color(0xFFEA580C)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Umur Balita: 29 Hari - 5 Tahun',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF9A3412),
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Waspadai tanda-tanda bahaya berikut pada balita',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFFEA580C),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // List Tanda Bahaya
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: _tandaBahaya.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final tanda = _tandaBahaya[index];
                final isBerat = tanda['level'] == 'Berat';
                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isBerat
                          ? const Color(0xFFFED7AA)
                          : const Color(0xFFFEF3C7),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: isBerat
                              ? const Color(0xFFFFEDD5)
                              : const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.report_problem_outlined,
                          color: Color(0xFFEA580C),
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tanda['title'],
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF1E293B),
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              tanda['desc'],
                              style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: isBerat
                              ? const Color(0xFFEA580C)
                              : const Color(0xFFD97706),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          tanda['level'],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Alert Button
          Container(
            padding: const EdgeInsets.all(20),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _showAlertPuskesmas(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.emergency, color: Colors.white),
                    SizedBox(width: 8),
                    Text(
                      'Perlu Ke Puskesmas',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}