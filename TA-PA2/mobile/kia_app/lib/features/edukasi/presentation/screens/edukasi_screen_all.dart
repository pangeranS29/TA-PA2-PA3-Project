import 'package:flutter/material.dart';

import 'edukasi_imd_screen.dart';
import 'edukasi_mental_screen.dart';
import 'edukasi_asi_screen.dart';
import 'edukasi_nifas_screen.dart';
import 'edukasi_tanda_melahirkan_screen.dart';

class EdukasiScreenAll extends StatelessWidget {
  const EdukasiScreenAll({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> edukasiIbu = [
      {
        'title': 'Inisiasi Menyusu Dini (IMD)',
        'icon': Icons.child_care,
        'screen': const EdukasiIMDScreen(),
      },
      {
        'title': 'Edukasi Menyusui ASI',
        'icon': Icons.pregnant_woman,
        'screen': const EdukasiASIScreen(),
      },
      {
        'title': 'Kesehatan Mental Ibu',
        'icon': Icons.psychology,
        'screen': const EdukasiKesehatanMentalScreen(),
      },
      {
        'title': 'Edukasi Masa Nifas',
        'icon': Icons.favorite,
        'screen': const EdukasiNifasScreen(),
      },
      {
        'title': 'Tanda-Tanda Melahirkan',
        'icon': Icons.medical_information,
        'screen': const EdukasiTandaMelahirkanScreen(),
      },
    ];

    final List<Map<String, dynamic>> edukasiAnak = [
      {
        'title': 'ASI Eksklusif',
        'icon': Icons.child_friendly,
        'screen': const Placeholder(),
      },
      {
        'title': 'Imunisasi Anak',
        'icon': Icons.vaccines,
        'screen': const Placeholder(),
      },
      {
        'title': 'MPASI',
        'icon': Icons.restaurant,
        'screen': const Placeholder(),
      },
      {
        'title': 'Tumbuh Kembang Anak',
        'icon': Icons.monitor_weight,
        'screen': const Placeholder(),
      },
    ];

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: const Color(0xFFF1F5F9),

        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,

          title: const Text(
            'Edukasi',
            style: TextStyle(
              color: Colors.black87,
              fontWeight: FontWeight.bold,
            ),
          ),

          centerTitle: true,

          iconTheme: const IconThemeData(
            color: Colors.black87,
          ),

          bottom: const TabBar(
            indicatorColor: Colors.blue,

            labelColor: Colors.blue,
            unselectedLabelColor: Colors.grey,

            tabs: [
              Tab(
                text: 'Ibu',
                icon: Icon(Icons.pregnant_woman),
              ),
              Tab(
                text: 'Anak',
                icon: Icon(Icons.child_care),
              ),
            ],
          ),
        ),

        body: TabBarView(
          children: [
            _buildEdukasiList(edukasiIbu),
            _buildEdukasiList(edukasiAnak),
          ],
        ),
      ),
    );
  }

  Widget _buildEdukasiList(List<Map<String, dynamic>> data) {
    return Padding(
      padding: const EdgeInsets.all(16),

      child: ListView.builder(
        itemCount: data.length,

        itemBuilder: (context, index) {
          final item = data[index];

          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => item['screen'],
                ),
              );
            },

            child: Container(
              margin: const EdgeInsets.only(bottom: 16),

              padding: const EdgeInsets.all(18),

              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),

                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),

              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(14),

                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(16),
                    ),

                    child: Icon(
                      item['icon'],
                      size: 28,
                      color: Colors.blue,
                    ),
                  ),

                  const SizedBox(width: 16),

                  Expanded(
                    child: Text(
                      item['title'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),

                  const Icon(
                    Icons.arrow_forward_ios,
                    size: 18,
                    color: Colors.grey,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}