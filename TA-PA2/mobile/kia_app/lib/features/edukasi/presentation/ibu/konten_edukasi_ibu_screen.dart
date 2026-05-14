import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/constants/app_colors.dart';

import 'edukasi_asi_screen.dart';
import 'edukasi_imd_screen.dart';
import 'edukasi_mental_screen.dart';
import 'edukasi_nifas_screen.dart';
import 'edukasi_tanda_melahirkan_screen.dart';
import 'edukasi_trimester_screen.dart';

import '../widgets/edukasi_search_filter.dart';

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

  @override
  Widget build(BuildContext context) {

    final List<Map<String, dynamic>> edukasiIbu = [

      {
        'title': 'Edukasi Trimester',
        'duration': '5 Menit',
        'category': 'Panduan',
        'screen': const EdukasiTrimesterScreen(),
      },

      {
        'title': 'Inisiasi Menyusu Dini',
        'duration': '3 Menit',
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
        'duration': '4 Menit',
        'category': 'Artikel',
        'screen':
            const EdukasiKesehatanMentalScreen(),
      },

      {
        'title': 'Edukasi Masa Nifas',
        'duration': '5 Menit',
        'category': 'Panduan',
        'screen': const EdukasiNifasScreen(),
      },

      {
        'title': 'Tanda-Tanda Melahirkan',
        'duration': '4 Menit',
        'category': 'Artikel',
        'screen':
            const EdukasiTandaMelahirkanScreen(),
      },
    ];

    final filteredData = edukasiIbu.where((item) {

      final matchesCategory =
          selectedCategory == 'Semua'
              ? true
              : item['category'] ==
                  selectedCategory;

      final matchesSearch =
          item['title']
              .toString()
              .toLowerCase()
              .contains(
                searchQuery.toLowerCase(),
              );

      return matchesCategory &&
          matchesSearch;

    }).toList();

    return Scaffold(
      backgroundColor: const Color(
        0xFFF5F7FB,
      ),

      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,

        title: const Text(
          'Edukasi Ibu',

          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.bold,
          ),
        ),

        centerTitle: true,

        iconTheme: const IconThemeData(
          color: Colors.black87,
        ),
      ),

      body: Padding(
        padding: const EdgeInsets.all(16),

        child: Column(
          children: [

            EdukasiSearchFilter(
              selectedCategory:
                  selectedCategory,

              categories: const [
                'Semua',
                'Panduan',
                'Artikel',
              ],

              onCategorySelected: (value) {
                setState(() {
                  selectedCategory = value;
                });
              },

              onSearchChanged: (value) {
                setState(() {
                  searchQuery = value;
                });
              },
            ),

            const SizedBox(height: 20),

            Expanded(
              child: filteredData.isEmpty

                  ? Center(
                      child: Column(
                        mainAxisAlignment:
                            MainAxisAlignment.center,

                        children: [

                          Icon(
                            Icons.search_off_rounded,
                            size: 70,
                            color:
                                Colors.grey.shade400,
                          ),

                          const SizedBox(height: 14),

                          const Text(
                            'Edukasi tidak ditemukan',

                            style: TextStyle(
                              fontSize: 16,
                              fontWeight:
                                  FontWeight.w600,
                            ),
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'Coba gunakan kata kunci lain',

                            style: TextStyle(
                              fontSize: 13,
                              color: Colors
                                  .grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    )

                  : ListView.builder(
                      itemCount:
                          filteredData.length,

                      itemBuilder:
                          (context, index) {

                        final item =
                            filteredData[index];

                        final bool isArtikel =
                            item['category'] ==
                                'Artikel';

                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,

                              MaterialPageRoute(
                                builder: (_) =>
                                    item['screen'],
                              ),
                            );
                          },

                          child: Container(
                            margin:
                                const EdgeInsets.only(
                              bottom: 16,
                            ),

                            decoration:
                                BoxDecoration(
                              color: Colors.white,

                              borderRadius:
                                  BorderRadius
                                      .circular(
                                18,
                              ),

                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black
                                      .withValues(
                                    alpha: 0.04,
                                  ),

                                  blurRadius: 8,

                                  offset:
                                      const Offset(
                                    0,
                                    4,
                                  ),
                                ),
                              ],
                            ),

                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment
                                      .start,

                              children: [

                                Container(
                                  height: 120,

                                  decoration:
                                      const BoxDecoration(
                                    color: Color(
                                      0xFFFFE9B3,
                                    ),

                                    borderRadius:
                                        BorderRadius
                                            .vertical(
                                      top:
                                          Radius.circular(
                                        18,
                                      ),
                                    ),
                                  ),

                                  child: Center(
                                    child: Container(
                                      padding:
                                          const EdgeInsets
                                              .all(
                                        12,
                                      ),

                                      decoration:
                                          BoxDecoration(
                                        color: Colors
                                            .white,

                                        shape:
                                            BoxShape
                                                .circle,

                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors
                                                .black
                                                .withValues(
                                              alpha:
                                                  0.08,
                                            ),

                                            blurRadius:
                                                8,
                                          ),
                                        ],
                                      ),

                                      child: Icon(
                                        isArtikel
                                            ? Icons
                                                .article_rounded
                                            : Icons
                                                .health_and_safety_rounded,

                                        size: 32,

                                        color:
                                            AppColors
                                                .primary,
                                      ),
                                    ),
                                  ),
                                ),

                                Padding(
                                  padding:
                                      const EdgeInsets
                                          .all(
                                    14,
                                  ),

                                  child: Row(
                                    children: [

                                      Container(
                                        padding:
                                            const EdgeInsets
                                                .symmetric(
                                          horizontal:
                                              10,
                                          vertical: 4,
                                        ),

                                        decoration:
                                            BoxDecoration(
                                          color:
                                              AppColors
                                                  .primary,

                                          borderRadius:
                                              BorderRadius
                                                  .circular(
                                            20,
                                          ),
                                        ),

                                        child: Text(
                                          item[
                                              'category'],

                                          style:
                                              const TextStyle(
                                            color: Colors
                                                .white,

                                            fontSize:
                                                11,

                                            fontWeight:
                                                FontWeight
                                                    .bold,
                                          ),
                                        ),
                                      ),

                                      const Spacer(),

                                      Row(
                                        children: [

                                          const Icon(
                                            Icons
                                                .access_time,
                                            size: 15,
                                            color: Colors
                                                .grey,
                                          ),

                                          const SizedBox(
                                            width: 4,
                                          ),

                                          Text(
                                            item[
                                                'duration'],

                                            style:
                                                const TextStyle(
                                              fontSize:
                                                  12,
                                              color: Colors
                                                  .grey,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),

                                Padding(
                                  padding:
                                      const EdgeInsets
                                          .only(
                                    left: 14,
                                    right: 14,
                                    bottom: 16,
                                  ),

                                  child: Text(
                                    item['title'],

                                    style:
                                        const TextStyle(
                                      fontSize: 15,

                                      fontWeight:
                                          FontWeight
                                              .w600,

                                      height: 1.4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}