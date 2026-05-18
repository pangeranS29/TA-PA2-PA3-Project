// import 'package:flutter/material.dart';
// import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/services/evaluasi_kesehatan_ibu_api_service.dart';
// import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/models/evaluasi_kesehatan_ibu_model.dart';
// import 'package:ta_pa2_pa3_project/core/constants/app_colors.dart';

// class HasilEvaluasiKesehatanScreen extends StatefulWidget {
//   const HasilEvaluasiKesehatanScreen({super.key});

//   @override
//   State<HasilEvaluasiKesehatanScreen> createState() =>
//       _HasilEvaluasiKesehatanScreenState();
// }

// class _HasilEvaluasiKesehatanScreenState
//     extends State<HasilEvaluasiKesehatanScreen> {
//   final _service = EvaluasiKesehatanIbuApiService();
//   late Future<EvaluasiKesehatanIbuModel> _future;

//   @override
//   void initState() {
//     super.initState();
//     _future = _service.getMine();
//   }

//   @override
//   void dispose() {
//     _service.dispose();
//     super.dispose();
//   }

//   String _formatDate(String? value) {
//     if (value == null || value.isEmpty) return '-';
//     final date = DateTime.tryParse(value);
//     if (date == null) return '-';

//     final months = [
//       'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
//       'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
//     ];

//     return '${date.day} ${months[date.month - 1]} ${date.year}';
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color(0xFFF6F8FC),
//       appBar: AppBar(
//         title: const Text("Hasil Evaluasi Kesehatan"),
//         backgroundColor: AppColors.primary,
//         foregroundColor: Colors.white,
//         elevation: 0,
//       ),
//       body: FutureBuilder<EvaluasiKesehatanIbuModel>(
//         future: _future,
//         builder: (context, snapshot) {
//           if (snapshot.connectionState == ConnectionState.waiting) {
//             return const Center(child: CircularProgressIndicator());
//           }

//           if (snapshot.hasError) {
//             return _EmptyState(
//               title: "Data evaluasi belum tersedia",
//               message: snapshot.error.toString().replaceFirst('Exception: ', ''),
//             );
//           }

//           final data = snapshot.data;
//           if (data == null) {
//             return const _EmptyState(
//               title: "Data evaluasi belum tersedia",
//               message: "Silakan lakukan pemeriksaan ke tenaga kesehatan.",
//             );
//           }

//           return ListView(
//             padding: const EdgeInsets.all(20),
//             children: [
//               _HeaderCard(data: data, formatDate: _formatDate),
//               const SizedBox(height: 16),

//               _InfoCard(
//                 title: "Antropometri",
//                 icon: Icons.monitor_weight_outlined,
//                 children: [
//                   _InfoRow("Tinggi badan", "${data.tbCm ?? '-'} cm"),
//                   _InfoRow("Berat badan", "${data.bbKg ?? '-'} kg"),
//                   _InfoRow("IMT", data.imtKategori),
//                   _InfoRow("LILA", "${data.lilaCm ?? '-'} cm"),
//                 ],
//               ),

//               _InfoCard(
//                 title: "Imunisasi TT",
//                 icon: Icons.verified_user_outlined,
//                 children: [
//                   _InfoRow("Status TT", data.statusTTText),
//                   if (data.imunisasiLainnyaCovid19.isNotEmpty)
//                     _InfoRow("Imunisasi lainnya", data.imunisasiLainnyaCovid19),
//                 ],
//               ),

//               _InfoCard(
//                 title: "Riwayat Kesehatan",
//                 icon: Icons.medical_information_outlined,
//                 children: [
//                   _InfoRow("Riwayat", data.riwayatKesehatanText),
//                 ],
//               ),

//               _InfoCard(
//                 title: "Perilaku Berisiko",
//                 icon: Icons.warning_amber_rounded,
//                 children: [
//                   _InfoRow("Perilaku", data.perilakuBerisikoText),
//                 ],
//               ),

//               _InfoCard(
//                 title: "Riwayat Keluarga",
//                 icon: Icons.family_restroom_outlined,
//                 children: [
//                   _InfoRow("Riwayat", data.riwayatKeluargaText),
//                 ],
//               ),

//               _InfoCard(
//                 title: "Inspeksi",
//                 icon: Icons.assignment_outlined,
//                 children: [
//                   _InfoRow("Porsio", data.inspeksiPorsio),
//                   _InfoRow("Uretra", data.inspeksiUretra),
//                   _InfoRow("Vagina", data.inspeksiVagina),
//                   _InfoRow("Vulva", data.inspeksiVulva),
//                   _InfoRow("Fluksus", data.inspeksiFluksus),
//                   _InfoRow("Fluor", data.inspeksiFluor),
//                 ],
//               ),
//             ],
//           );
//         },
//       ),
//     );
//   }
// }

// class _HeaderCard extends StatelessWidget {
//   final EvaluasiKesehatanIbuModel data;
//   final String Function(String?) formatDate;

//   const _HeaderCard({
//     required this.data,
//     required this.formatDate,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.all(18),
//       decoration: BoxDecoration(
//         color: AppColors.primary,
//         borderRadius: BorderRadius.circular(22),
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           const Text(
//             "Evaluasi Kesehatan Ibu",
//             style: TextStyle(
//               color: Colors.white,
//               fontSize: 18,
//               fontWeight: FontWeight.w800,
//             ),
//           ),
//           const SizedBox(height: 14),
//           _HeaderRow("Tanggal Periksa", formatDate(data.tanggalPeriksa)),
//           _HeaderRow("Dokter", data.namaDokter),
//           _HeaderRow("Fasilitas", data.fasilitasKesehatan),
//         ],
//       ),
//     );
//   }
// }

// class _HeaderRow extends StatelessWidget {
//   final String label;
//   final String value;

//   const _HeaderRow(this.label, this.value);

//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//       padding: const EdgeInsets.only(top: 7),
//       child: Row(
//         children: [
//           SizedBox(
//             width: 120,
//             child: Text(
//               label,
//               style: const TextStyle(color: Colors.white70, fontSize: 12),
//             ),
//           ),
//           Expanded(
//             child: Text(
//               value.isEmpty ? '-' : value,
//               style: const TextStyle(
//                 color: Colors.white,
//                 fontSize: 13,
//                 fontWeight: FontWeight.w700,
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// class _InfoCard extends StatelessWidget {
//   final String title;
//   final IconData icon;
//   final List<Widget> children;

//   const _InfoCard({
//     required this.title,
//     required this.icon,
//     required this.children,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 14),
//       padding: const EdgeInsets.all(16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(18),
//         border: Border.all(color: const Color(0xFFE5ECF6)),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withOpacity(0.03),
//             blurRadius: 10,
//             offset: const Offset(0, 4),
//           ),
//         ],
//       ),
//       child: Column(
//         children: [
//           Row(
//             children: [
//               Container(
//                 width: 38,
//                 height: 38,
//                 decoration: BoxDecoration(
//                   color: const Color(0xFFEAF4FF),
//                   borderRadius: BorderRadius.circular(12),
//                 ),
//                 child: Icon(icon, color: AppColors.primary, size: 21),
//               ),
//               const SizedBox(width: 12),
//               Expanded(
//                 child: Text(
//                   title,
//                   style: const TextStyle(
//                     fontSize: 15,
//                     fontWeight: FontWeight.w800,
//                     color: Color(0xFF172033),
//                   ),
//                 ),
//               ),
//             ],
//           ),
//           const SizedBox(height: 12),
//           ...children,
//         ],
//       ),
//     );
//   }
// }

// class _InfoRow extends StatelessWidget {
//   final String label;
//   final String value;

//   const _InfoRow(this.label, this.value);

//   @override
//   Widget build(BuildContext context) {
//     final safeValue = value.trim().isEmpty ? '-' : value;

//     return Padding(
//       padding: const EdgeInsets.symmetric(vertical: 6),
//       child: Row(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Expanded(
//             child: Text(
//               label,
//               style: const TextStyle(
//                 color: Color(0xFF7B8798),
//                 fontSize: 13,
//               ),
//             ),
//           ),
//           const SizedBox(width: 12),
//           Expanded(
//             child: Text(
//               safeValue,
//               textAlign: TextAlign.right,
//               style: const TextStyle(
//                 color: Color(0xFF172033),
//                 fontSize: 13,
//                 fontWeight: FontWeight.w700,
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// class _EmptyState extends StatelessWidget {
//   final String title;
//   final String message;

//   const _EmptyState({
//     required this.title,
//     required this.message,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Center(
//       child: Padding(
//         padding: const EdgeInsets.all(24),
//         child: Container(
//           width: double.infinity,
//           padding: const EdgeInsets.all(28),
//           decoration: BoxDecoration(
//             color: Colors.white,
//             borderRadius: BorderRadius.circular(22),
//           ),
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               const Icon(
//                 Icons.assignment_outlined,
//                 size: 60,
//                 color: Color(0xFF2F80ED),
//               ),
//               const SizedBox(height: 16),
//               Text(
//                 title,
//                 textAlign: TextAlign.center,
//                 style: const TextStyle(
//                   fontSize: 18,
//                   fontWeight: FontWeight.w800,
//                   color: Color(0xFF172033),
//                 ),
//               ),
//               const SizedBox(height: 8),
//               Text(
//                 message,
//                 textAlign: TextAlign.center,
//                 style: const TextStyle(
//                   fontSize: 13,
//                   color: Color(0xFF7B8798),
//                   height: 1.4,
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:ta_pa2_pa3_project/core/constants/app_colors.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/models/evaluasi_kesehatan_ibu_model.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/services/evaluasi_kesehatan_ibu_api_service.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/screens/rujukan_list_screen.dart';

class HasilEvaluasiKesehatanScreen extends StatefulWidget {
  const HasilEvaluasiKesehatanScreen({super.key});

  @override
  State<HasilEvaluasiKesehatanScreen> createState() =>
      _HasilEvaluasiKesehatanScreenState();
}

class _HasilEvaluasiKesehatanScreenState
    extends State<HasilEvaluasiKesehatanScreen> {
  final _service = EvaluasiKesehatanIbuApiService();
  late Future<EvaluasiKesehatanIbuModel> _future;

  static const String _nomorBidan = '6281234567890';

  @override
  void initState() {
    super.initState();
    _future = _service.getMine();
  }

  @override
  void dispose() {
    _service.dispose();
    super.dispose();
  }

  String _formatDate(String? value) {
    if (value == null || value.isEmpty) return '-';

    final date = DateTime.tryParse(value);
    if (date == null) return '-';

    final months = [
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
      'Des',
    ];

    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  void _lihatRekomendasi() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const RujukanListScreen(),
      ),
    );
  }

  Future<void> _konfirmasiHubungiBidan(_RiskResult risiko) async {
    final lanjut = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text(
            "Hubungi Bidan?",
            style: TextStyle(
              fontWeight: FontWeight.w800,
            ),
          ),
          content: Text(
            "Ibu akan diarahkan untuk menghubungi bidan melalui WhatsApp.\n\n"
            "Status saat ini: ${risiko.title}\n"
            "Saran tindakan: ${risiko.priorityLabel}\n"
            "Waktu pemeriksaan: ${risiko.checkTime}\n\n"
            "Lanjutkan?",
            style: const TextStyle(
              fontSize: 14,
              height: 1.45,
            ),
          ),
          actionsPadding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text("Batal"),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text("Lanjutkan"),
            ),
          ],
        );
      },
    );

    if (lanjut == true && mounted) {
      await _hubungiBidan(risiko);
    }
  }

  Future<void> _hubungiBidan(_RiskResult risiko) async {
    final pesan = Uri.encodeComponent(
      "Assalamu'alaikum Bidan, saya ingin konsultasi hasil skrining kehamilan.\n\n"
      "Status Risiko: ${risiko.title}\n"
      "Saran Tindakan: ${risiko.priorityLabel}\n"
      "Waktu Pemeriksaan: ${risiko.checkTime}\n\n"
      "Faktor Risiko:\n"
      "${risiko.reasons.map((item) => "- $item").join("\n")}\n\n"
      "Mohon arahannya, Bidan.",
    );

    final whatsappUrl = Uri.parse(
      "https://wa.me/$_nomorBidan?text=$pesan",
    );

    final phoneUrl = Uri.parse(
      "tel:$_nomorBidan",
    );

    try {
      final whatsappOpened = await launchUrl(
        whatsappUrl,
        mode: LaunchMode.externalApplication,
      );

      if (!whatsappOpened) {
        await _bukaTelepon(phoneUrl);
      }
    } catch (_) {
      await _bukaTelepon(phoneUrl);
    }
  }

  Future<void> _bukaTelepon(Uri phoneUrl) async {
    try {
      final phoneOpened = await launchUrl(
        phoneUrl,
        mode: LaunchMode.externalApplication,
      );

      if (!phoneOpened && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Tidak dapat membuka WhatsApp atau panggilan telepon.",
            ),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Gagal menghubungi bidan. Periksa aplikasi WhatsApp atau kontak telepon.",
            ),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  _RiskResult _hitungRisiko(EvaluasiKesehatanIbuModel data) {
    int skor = 0;
    final List<String> alasan = [];

    final imt = data.imtKategori.toLowerCase();
    if (imt.contains('kurus') ||
        imt.contains('gemuk') ||
        imt.contains('obesitas') ||
        imt.contains('tidak normal')) {
      skor += 2;
      alasan.add('Kategori IMT tidak normal');
    }

    final lila = data.lilaCm;
    if (lila != null && lila < 23.5) {
      skor += 3;
      alasan.add('LILA kurang dari 23,5 cm');
    }

    final riwayatKesehatan = data.riwayatKesehatanText.toLowerCase().trim();
    if (riwayatKesehatan.isNotEmpty &&
        riwayatKesehatan != '-' &&
        riwayatKesehatan != 'tidak ada' &&
        riwayatKesehatan != 'normal') {
      skor += 3;
      alasan.add('Memiliki riwayat kesehatan tertentu');
    }

    final perilakuBerisiko = data.perilakuBerisikoText.toLowerCase().trim();
    if (perilakuBerisiko.isNotEmpty &&
        perilakuBerisiko != '-' &&
        perilakuBerisiko != 'tidak ada' &&
        perilakuBerisiko != 'normal') {
      skor += 2;
      alasan.add('Terdapat perilaku berisiko');
    }

    final riwayatKeluarga = data.riwayatKeluargaText.toLowerCase().trim();
    if (riwayatKeluarga.isNotEmpty &&
        riwayatKeluarga != '-' &&
        riwayatKeluarga != 'tidak ada' &&
        riwayatKeluarga != 'normal') {
      skor += 2;
      alasan.add('Memiliki riwayat penyakit keluarga');
    }

    final inspeksiGabungan = [
      data.inspeksiPorsio,
      data.inspeksiUretra,
      data.inspeksiVagina,
      data.inspeksiVulva,
      data.inspeksiFluksus,
      data.inspeksiFluor,
    ].join(' ').toLowerCase();

    if (inspeksiGabungan.contains('tidak normal') ||
        inspeksiGabungan.contains('abnormal') ||
        inspeksiGabungan.contains('infeksi') ||
        inspeksiGabungan.contains('kelainan') ||
        inspeksiGabungan.contains('nyeri') ||
        inspeksiGabungan.contains('keputihan') ||
        inspeksiGabungan.contains('berbau') ||
        inspeksiGabungan.contains('luka')) {
      skor += 3;
      alasan.add('Ditemukan indikasi tidak normal pada hasil inspeksi');
    }

    if (skor >= 7) {
      return _RiskResult(
        title: 'Risiko Tinggi',
        statusLabel: 'Perlu Pemeriksaan Lanjutan',
        actionTitle: 'Segera hubungi bidan',
        actionMessage:
            'Berdasarkan hasil ini, ibu disarankan segera menghubungi bidan atau datang ke fasilitas kesehatan terdekat.',
        closingMessage:
            'Jangan menunda pemeriksaan. Hasil ini menunjukkan ada faktor risiko yang perlu ditangani oleh tenaga kesehatan.',
        priorityLabel: 'Segera Periksa',
        checkTime: 'Periksa hari ini atau maksimal dalam 1–3 hari.',
        description:
            'Kondisi ibu perlu segera diperiksa. Silakan konsultasi dengan bidan atau fasilitas kesehatan terdekat.',
        color: const Color(0xFFE53935),
        backgroundColor: const Color(0xFFFFEBEE),
        icon: Icons.error_outline,
        reasons: alasan,
      );
    } else if (skor >= 3) {
      return _RiskResult(
        title: 'Risiko Sedang',
        statusLabel: 'Perlu Dipantau',
        actionTitle: 'Konsultasikan hasil ke bidan',
        actionMessage:
            'Berdasarkan hasil ini, ibu disarankan berkonsultasi dengan bidan agar kondisi dapat dipantau lebih lanjut.',
        closingMessage:
            'Tetap lakukan pemeriksaan rutin dan ikuti arahan bidan untuk mencegah risiko menjadi lebih serius.',
        priorityLabel: 'Konsultasi Bidan',
        checkTime: 'Periksa dalam 1 minggu atau lebih cepat jika ada keluhan.',
        description:
            'Ada beberapa hal yang perlu diperhatikan. Lakukan pemeriksaan rutin dan ikuti saran tenaga kesehatan.',
        color: const Color(0xFFFFA000),
        backgroundColor: const Color(0xFFFFF8E1),
        icon: Icons.warning_amber_rounded,
        reasons: alasan,
      );
    } else {
      return _RiskResult(
        title: 'Risiko Rendah',
        statusLabel: 'Kondisi Cukup Baik',
        actionTitle: 'Tetap pantau kondisi ibu',
        actionMessage:
            'Berdasarkan hasil ini, ibu disarankan tetap melakukan pemeriksaan kehamilan secara rutin.',
        closingMessage:
            'Jika muncul keluhan seperti pusing berat, bengkak, nyeri kepala, atau pandangan kabur, segera hubungi bidan.',
        priorityLabel: 'Pantau Mandiri',
        checkTime: 'Ikuti jadwal pemeriksaan kehamilan berikutnya.',
        description:
            'Kondisi ibu terlihat cukup baik berdasarkan data evaluasi. Tetap lakukan pemeriksaan kehamilan secara rutin.',
        color: const Color(0xFF2E7D32),
        backgroundColor: const Color(0xFFE8F5E9),
        icon: Icons.check_circle_outline,
        reasons: alasan.isEmpty
            ? ['Tidak ada faktor risiko yang menonjol']
            : alasan,
      );
    }
  }

  Widget _buildBottomAction(EvaluasiKesehatanIbuModel? data) {
    if (data == null) {
      return const SizedBox.shrink();
    }

    final risiko = _hitungRisiko(data);

    return SafeArea(
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _lihatRekomendasi,
                icon: const Icon(Icons.description_outlined),
                label: const Text(
                  "Rekomendasi",
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.primary,
                  side: BorderSide(
                    color: AppColors.primary.withOpacity(0.4),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () => _konfirmasiHubungiBidan(risiko),
                icon: const Icon(Icons.phone_in_talk_outlined),
                label: const Text(
                  "Hubungi Bidan",
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
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
    return FutureBuilder<EvaluasiKesehatanIbuModel>(
      future: _future,
      builder: (context, snapshot) {
        final data = snapshot.data;
        final risiko = data == null ? null : _hitungRisiko(data);

        return Scaffold(
          backgroundColor: const Color(0xFFF6F8FC),
          appBar: AppBar(
            title: const Text("Hasil Evaluasi Kesehatan"),
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 0,
          ),
          body: Builder(
            builder: (context) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasError) {
                return _EmptyState(
                  title: "Data evaluasi belum tersedia",
                  message:
                      snapshot.error.toString().replaceFirst('Exception: ', ''),
                );
              }

              if (data == null || risiko == null) {
                return const _EmptyState(
                  title: "Data evaluasi belum tersedia",
                  message: "Silakan lakukan pemeriksaan ke tenaga kesehatan.",
                );
              }

              return ListView(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
                children: [
                  _HeaderCard(data: data, formatDate: _formatDate),
                  const SizedBox(height: 16),

                  _ActionSummaryCard(result: risiko),
                  const SizedBox(height: 16),

                  _RiskCard(result: risiko),
                  const SizedBox(height: 16),

                  _ClosingFeedbackCard(result: risiko),
                  const SizedBox(height: 16),

                  _InfoCard(
                    title: "Antropometri",
                    icon: Icons.monitor_weight_outlined,
                    children: [
                      _InfoRow("Tinggi badan", "${data.tbCm ?? '-'} cm"),
                      _InfoRow("Berat badan", "${data.bbKg ?? '-'} kg"),
                      _InfoRow("IMT", data.imtKategori),
                      _InfoRow("LILA", "${data.lilaCm ?? '-'} cm"),
                    ],
                  ),

                  _InfoCard(
                    title: "Imunisasi TT",
                    icon: Icons.verified_user_outlined,
                    children: [
                      _InfoRow("Status TT", data.statusTTText),
                      if (data.imunisasiLainnyaCovid19.isNotEmpty)
                        _InfoRow(
                          "Imunisasi lainnya",
                          data.imunisasiLainnyaCovid19,
                        ),
                    ],
                  ),

                  _InfoCard(
                    title: "Riwayat Kesehatan",
                    icon: Icons.medical_information_outlined,
                    children: [
                      _InfoRow("Riwayat", data.riwayatKesehatanText),
                    ],
                  ),

                  _InfoCard(
                    title: "Perilaku Berisiko",
                    icon: Icons.warning_amber_rounded,
                    children: [
                      _InfoRow("Perilaku", data.perilakuBerisikoText),
                    ],
                  ),

                  _InfoCard(
                    title: "Riwayat Keluarga",
                    icon: Icons.family_restroom_outlined,
                    children: [
                      _InfoRow("Riwayat", data.riwayatKeluargaText),
                    ],
                  ),

                  _InfoCard(
                    title: "Inspeksi",
                    icon: Icons.assignment_outlined,
                    children: [
                      _InfoRow("Porsio", data.inspeksiPorsio),
                      _InfoRow("Uretra", data.inspeksiUretra),
                      _InfoRow("Vagina", data.inspeksiVagina),
                      _InfoRow("Vulva", data.inspeksiVulva),
                      _InfoRow("Fluksus", data.inspeksiFluksus),
                      _InfoRow("Fluor", data.inspeksiFluor),
                    ],
                  ),
                ],
              );
            },
          ),
          bottomNavigationBar: _buildBottomAction(data),
        );
      },
    );
  }
}

class _RiskResult {
  final String title;
  final String statusLabel;
  final String actionTitle;
  final String actionMessage;
  final String closingMessage;
  final String priorityLabel;
  final String checkTime;
  final String description;
  final Color color;
  final Color backgroundColor;
  final IconData icon;
  final List<String> reasons;

  const _RiskResult({
    required this.title,
    required this.statusLabel,
    required this.actionTitle,
    required this.actionMessage,
    required this.closingMessage,
    required this.priorityLabel,
    required this.checkTime,
    required this.description,
    required this.color,
    required this.backgroundColor,
    required this.icon,
    required this.reasons,
  });
}

class _ActionSummaryCard extends StatelessWidget {
  final _RiskResult result;

  const _ActionSummaryCard({
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: result.backgroundColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: result.color.withOpacity(0.25),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: result.color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              Icons.touch_app_outlined,
              color: result.color,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  result.actionTitle,
                  style: TextStyle(
                    fontSize: 16,
                    color: result.color,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  result.actionMessage,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF4B5563),
                    height: 1.45,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 10),
                _SmallInfoBadge(
                  icon: Icons.schedule_outlined,
                  label: result.checkTime,
                  color: result.color,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RiskCard extends StatelessWidget {
  final _RiskResult result;

  const _RiskCard({
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    final mainReason = result.reasons.isNotEmpty ? result.reasons.first : null;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: result.color.withOpacity(0.35),
          width: 1.3,
        ),
        boxShadow: [
          BoxShadow(
            color: result.color.withOpacity(0.10),
            blurRadius: 16,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: result.backgroundColor,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: result.color.withOpacity(0.25),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: result.color.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(
                    result.icon,
                    color: result.color,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Status Risiko",
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF7B8798),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        result.title,
                        style: TextStyle(
                          fontSize: 20,
                          color: result.color,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _SmallInfoBadge(
                icon: result.icon,
                label: result.statusLabel,
                color: result.color,
              ),
              _SmallInfoBadge(
                icon: Icons.flag_outlined,
                label: result.priorityLabel,
                color: result.color,
              ),
            ],
          ),

          const SizedBox(height: 14),

          Text(
            result.description,
            style: const TextStyle(
              fontSize: 13,
              color: Color(0xFF4B5563),
              height: 1.45,
              fontWeight: FontWeight.w500,
            ),
          ),

          const SizedBox(height: 16),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFFE5ECF6),
              ),
            ),
            child: const Text(
              "Faktor-faktor ini ditemukan pada dirimu. Hubungi bidan untuk penanganan lebih lanjut.",
              style: TextStyle(
                fontSize: 13,
                color: Color(0xFF172033),
                height: 1.45,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),

          const SizedBox(height: 14),

          const Text(
            "Dasar penilaian:",
            style: TextStyle(
              fontSize: 13,
              color: Color(0xFF172033),
              fontWeight: FontWeight.w800,
            ),
          ),

          const SizedBox(height: 8),

          if (mainReason != null)
            Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: result.color.withOpacity(0.08),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: result.color.withOpacity(0.25),
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.priority_high_rounded,
                    size: 18,
                    color: result.color,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "$mainReason — Perlu perhatian khusus",
                      style: TextStyle(
                        fontSize: 12.5,
                        color: result.color,
                        height: 1.35,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
            ),

          ...result.reasons.skip(1).map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        Icons.circle,
                        size: 7,
                        color: result.color,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          item,
                          style: const TextStyle(
                            fontSize: 12.5,
                            color: Color(0xFF4B5563),
                            height: 1.35,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
        ],
      ),
    );
  }
}

class _ClosingFeedbackCard extends StatelessWidget {
  final _RiskResult result;

  const _ClosingFeedbackCard({
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFEAF4FF),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: AppColors.primary.withOpacity(0.18),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.info_outline,
            color: AppColors.primary,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              result.closingMessage,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF4B5563),
                height: 1.45,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SmallInfoBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _SmallInfoBadge({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 8,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.10),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: color.withOpacity(0.30),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: color,
          ),
          const SizedBox(width: 6),
          Flexible(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12.5,
                color: color,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeaderCard extends StatelessWidget {
  final EvaluasiKesehatanIbuModel data;
  final String Function(String?) formatDate;

  const _HeaderCard({
    required this.data,
    required this.formatDate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Evaluasi Kesehatan Ibu",
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 14),
          _HeaderRow("Tanggal Periksa", formatDate(data.tanggalPeriksa)),
          _HeaderRow("Dokter", data.namaDokter),
          _HeaderRow("Fasilitas", data.fasilitasKesehatan),
        ],
      ),
    );
  }
}

class _HeaderRow extends StatelessWidget {
  final String label;
  final String value;

  const _HeaderRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 7),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 12,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value.isEmpty ? '-' : value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Widget> children;

  const _InfoCard({
    required this.title,
    required this.icon,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: const Color(0xFFE5ECF6),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF4FF),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: AppColors.primary,
                  size: 21,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF172033),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    final safeValue = value.trim().isEmpty ? '-' : value;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                color: Color(0xFF7B8798),
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              safeValue,
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: Color(0xFF172033),
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String title;
  final String message;

  const _EmptyState({
    required this.title,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.assignment_outlined,
                size: 60,
                color: Color(0xFF2F80ED),
              ),
              const SizedBox(height: 16),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF172033),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF7B8798),
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}