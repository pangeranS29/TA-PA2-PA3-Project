import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/constants/app_colors.dart';
// --- IMPORT NAVIGASI ---
import 'package:ta_pa2_pa3_project/features/dashboard/presentation/screens/dashboard_screen.dart'; 
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/absensi_kelas_ibu_hamil_screen.dart';

// --- IMPORT HALAMAN EDUKASI ---
import 'edukasi_asi_screen.dart';
import 'edukasi_imd_screen.dart';
import 'edukasi_mental_screen.dart';
import 'edukasi_nifas_screen.dart';
import 'edukasi_tanda_melahirkan_screen.dart';
import 'edukasi_trimester_screen.dart';

// --- IMPORT WIDGET MODULAR (LEGO) ---
import '../widgets/edukasi_search_filter.dart';
import '../widgets/edukasi_card.dart'; // <--- Ini cetakan yang kita gunakan

class KontenEdukasiIbuScreen extends StatefulWidget {
  const KontenEdukasiIbuScreen({super.key});

  @override
  State<KontenEdukasiIbuScreen> createState() =>
      _KontenEdukasiIbuScreenState();
}

class _KontenEdukasiIbuScreenState
    extends State<KontenEdukasiIbuScreen> {

  String selectedCategory = 'Semua';
  String searchQuery = '';
  int _currentIndex = 2; // Posisi Tab Edukasi

  @override
  Widget build(BuildContext context) {

    // --- DATA TETAP SAMA (LOGIKA AMAN) ---
    final List<Map<String, dynamic>> edukasiIbu = [
      {
        'title': 'Edukasi Trimester',
        'duration': '5 Menit',
        'category': 'Panduan',
        'screen': const EdukasiTrimesterScreen(),
      },
      {
        'title': 'Inisiasi Menyusu Dini',
        'duration': '3 Menit Baca',
        'category': 'Artikel',
        'screen': const EdukasiIMDScreen(),
      },
      {
        'title': 'Edukasi Menyusui ASI',
        'duration': '6 Menit',
        'category': 'Panduan',
        'screen': const EdukasiASIScreen(),
      },
      {
        'title': 'Kesehatan Mental Ibu',
        'duration': '4 Menit Baca',
        'category': 'Artikel',
        'screen': const EdukasiKesehatanMentalScreen(),
      },
      {
        'title': 'Edukasi Masa Nifas',
        'duration': '5 Menit',
        'category': 'Panduan',
        'screen': const EdukasiNifasScreen(),
      },
      {
        'title': 'Tanda-Tanda Melahirkan',
        'duration': '4 Menit Baca',
        'category': 'Artikel',
        'screen': const EdukasiTandaMelahirkanScreen(),
      },
    ];

    // --- LOGIKA FILTER TETAP SAMA (LOGIKA AMAN) ---
    final filteredData = edukasiIbu.where((item) {
      final matchesCategory = selectedCategory == 'Semua'
          ? true
          : item['category'] == selectedCategory;

      final matchesSearch = item['title']
          .toString()
          .toLowerCase()
          .contains(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA), 
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Column(
          children: const [
            Text(
              'Edukasi',
              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              'Sumber Buku KIA',
              style: TextStyle(color: Colors.grey, fontWeight: FontWeight.normal, fontSize: 12),
            ),
          ],
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),

      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Widget Pencarian & Filter
            EdukasiSearchFilter(
              selectedCategory: selectedCategory,
              categories: const ['Semua', 'Panduan', 'Artikel'],
              onCategorySelected: (value) {
                setState(() { selectedCategory = value; });
              },
              onSearchChanged: (value) {
                setState(() { searchQuery = value; });
              },
            ),
            const SizedBox(height: 20),
            const Text(
              'Rekomendasi untuk ibu hamil dan nifas',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF212529)),
            ),
            const SizedBox(height: 16),

            // Bagian List Edukasi
            Expanded(
              child: filteredData.isEmpty
                  ? const Center(child: Text('Edukasi tidak ditemukan'))
                  : ListView.builder(
                      itemCount: filteredData.length,
                      itemBuilder: (context, index) {
                        final item = filteredData[index];
                        
                        // --- MENGGUNAKAN WIDGET MODULAR (RINGKAS & RAPI) ---
                        return EdukasiCard(
                          title: item['title'],
                          duration: item['duration'],
                          category: item['category'],
                          onTap: () {
                            Navigator.push(
                              context, 
                              MaterialPageRoute(builder: (_) => item['screen'])
                            );
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),

      // --- NAVBAR TETAP TERHUBUNG ---
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        currentIndex: _currentIndex,
        selectedItemColor: AppColors.primary, 
        unselectedItemColor: Colors.grey,
        showUnselectedLabels: true,
        selectedLabelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
        unselectedLabelStyle: const TextStyle(fontSize: 12),
        onTap: (index) {
          if (index == _currentIndex) return;
          setState(() { _currentIndex = index; });

          if (index == 0) {
            Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const DashboardScreen()));
          } else if (index == 1) {
            Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AbsensiKelasIbuHamilScreen()));
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Beranda'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), activeIcon: Icon(Icons.assignment), label: 'Absensi'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book_outlined), activeIcon: Icon(Icons.menu_book), label: 'Edukasi'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profil'),
        ],
      ),
    );
  }
}