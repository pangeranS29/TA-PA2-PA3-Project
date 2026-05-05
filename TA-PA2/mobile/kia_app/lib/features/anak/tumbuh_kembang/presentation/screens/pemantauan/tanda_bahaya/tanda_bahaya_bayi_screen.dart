// lib/screens/pemantauan/tanda_bahaya/tanda_bahaya_bayi_screen.dart
import 'package:flutter/material.dart';

class TandaBahayaBayiScreen extends StatelessWidget {
  const TandaBahayaBayiScreen({Key? key}) : super(key: key);

  final List<Map<String, dynamic>> _tandaBahaya = const [
    {
      'title': 'Tidak bisa menyusu',
      'icon': Icons.no_meals,
      'level': 'Berat',
      'desc': 'Bayi tidak bisa menyusu atau minum sama sekali',
    },
    {
      'title': 'Sering muntah',
      'icon': Icons.sick,
      'level': 'Berat',
      'desc': 'Muntah terus-menerus setelah menyusu',
    },
    {
      'title': 'Kejang',
      'icon': Icons.bolt,
      'level': 'Berat',
      'desc': 'Bayi mengalami kejang atau gerakan tidak terkontrol',
    },
    {
      'title': 'Lesu atau tidak bergerak',
      'icon': Icons.bedtime,
      'level': 'Berat',
      'desc': 'Bayi sangat lemah, tidak merespon rangsangan',
    },
    {
      'title': 'Suhu tubuh tinggi (≥37.5°C)',
      'icon': Icons.thermostat,
      'level': 'Berat',
      'desc': 'Demam yang tidak kunjung turun',
    },
    {
      'title': 'Suhu tubuh rendah (<35.5°C)',
      'icon': Icons.ac_unit,
      'level': 'Berat',
      'desc': 'Bayi terasa dingin, suhu tubuh di bawah normal',
    },
    {
      'title': 'Nafas cepat (≥60x/menit)',
      'icon': 'lungs',
      'level': 'Berat',
      'desc': 'Pernapasan terlihat cepat dan berat',
    },
    {
      'title': 'Tarikan dinding dada',
      'icon': 'chest',
      'level': 'Berat',
      'desc': 'Dinding dada tertarik ke dalam saat bernapas',
    },
    {
      'title': 'Bercak putih pada mata',
      'icon': Icons.visibility_off,
      'level': 'Berat',
      'desc': 'Tanda bahaya penyakit mata pada bayi baru lahir',
    },
    {
      'title': 'Umbilikal merah atau ber nanah',
      'icon': Icons.healing,
      'level': 'Sedang',
      'desc': 'Tali pusat terinfeksi',
    },
    {
      'title': 'Kulit kuning pada 24 jam pertama',
      'icon': Icons.face_retouching_natural,
      'level': 'Berat',
      'desc': 'Ikterus berat yang memerlukan penanganan segera',
    },
    {
      'title': 'Diare berulang',
      'icon': Icons.wc,
      'level': 'Sedang',
      'desc': 'BAB lebih dari 3x sehari dengan konsistensi cair',
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
                color: Color(0xFFFEE2E2),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.emergency,
                size: 48,
                color: Color(0xFFDC2626),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'PERLU KE PUSKESMAS SEGERA!',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: Color(0xFFDC2626),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            const Text(
              'Jika bayi menunjukkan salah satu tanda bahaya di atas, segera bawa ke puskesmas atau fasilitas kesehatan terdekat. Tanda bahaya pada bayi 0-28 hari memerlukan penanganan medis segera.',
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
                  backgroundColor: const Color(0xFFDC2626),
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
          'Tanda Bahaya Bayi',
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
              color: Color(0xFFFEE2E2),
            ),
            child: Row(
              children: [
                const Icon(Icons.warning_amber, color: Color(0xFFDC2626)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Umur Bayi: 0 - 28 Hari',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF991B1B),
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Segera bawa ke puskesmas jika ditemukan tanda-tanda berikut',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFFDC2626),
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
                          ? const Color(0xFFFECACA)
                          : const Color(0xFFFED7AA),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: isBerat
                              ? const Color(0xFFFEE2E2)
                              : const Color(0xFFFFEDD5),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.warning_amber_outlined,
                          color: Color(0xFFDC2626),
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
                              ? const Color(0xFFDC2626)
                              : const Color(0xFFEA580C),
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
                  backgroundColor: const Color(0xFFDC2626),
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