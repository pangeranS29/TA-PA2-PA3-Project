// [MODUL: ANAK]
// Screen untuk memilih profil anak sebelum masuk ke fitur tertentu.
// Menggunakan shared widgets: AnakLoadingView, AnakErrorView, AnakEmptyView.
// List item menggunakan _AnakItemCard lokal karena IbuAnakModel
// berbeda field dengan AnakSearchModel (yang dipakai ChildListCard).

import 'package:flutter/material.dart';

import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/data/services/ibu_api_service.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/data/models/ibu_anak_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/widgets/index.dart';

import 'imunisasi/imunisasi_screen.dart';
import 'mpasi/halaman_utama_mpasi.dart';
import 'pertumbuhan/detail_pertumbuhan_dummy_screen.dart';
import 'edukasi/edukasi_screen.dart';
import 'skrining/skrining_bahaya.dart';

/// [tujuan] menentukan halaman tujuan setelah anak dipilih.
/// Nilai: 'pertumbuhan' (default), 'imunisasi', 'bahaya', 'edukasi', 'mpasi'
class PilihAnakScreen extends StatefulWidget {
  final String tujuan;

  const PilihAnakScreen({
    super.key,
    this.tujuan = 'pertumbuhan',
  });

  @override
  State<PilihAnakScreen> createState() => _PilihAnakScreenState();
}

class _PilihAnakScreenState extends State<PilihAnakScreen> {
  final IbuApiService _service = IbuApiService();
  late Future<List<IbuAnakModel>> _anakFuture;

  @override
  void initState() {
    super.initState();
    _anakFuture = _service.getAnakSaya();
  }

  @override
  void dispose() {
    _service.dispose();
    super.dispose();
  }

  void _navigateTo(BuildContext context, Map<String, dynamic> anakMap) {
    switch (widget.tujuan) {
      case 'imunisasi':
        Navigator.push(context,
            MaterialPageRoute(builder: (_) => ImunisasiScreen(anak: anakMap)));
        break;
      case 'bahaya':
        Navigator.push(context,
            MaterialPageRoute(builder: (_) => SkriningBahayaScreen(anak: anakMap)));
        break;
      case 'edukasi':
        Navigator.push(context,
            MaterialPageRoute(builder: (_) => EdukasiScreen()));
        break;
      case 'mpasi':
        Navigator.push(context,
            MaterialPageRoute(builder: (_) => HalamanUtamaMpasiScreen(anak: anakMap)));
        break;
      default: // 'pertumbuhan'
        Navigator.push(context,
            MaterialPageRoute(builder: (_) => DetailPertumbuhanScreenDummy(anak: anakMap)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text('Pilih Profil Anak'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: FutureBuilder<List<IbuAnakModel>>(
        future: _anakFuture,
        builder: (context, snapshot) {
          // Loading
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const AnakLoadingView(message: 'Memuat daftar anak...');
          }

          // Error
          if (snapshot.hasError) {
            return AnakErrorView(
              message: snapshot.error.toString(),
              onRetry: () => setState(() => _anakFuture = _service.getAnakSaya()),
            );
          }

          final anakList = snapshot.data ?? const <IbuAnakModel>[];

          // Empty
          if (anakList.isEmpty) {
            return const AnakEmptyView(
              message: 'Belum ada data anak yang terhubung ke akun ini.',
              icon: Icons.child_care,
            );
          }

          // List
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: anakList.length,
            itemBuilder: (context, index) {
              final anak = anakList[index];
              return _AnakItemCard(
                anak: anak,
                onTap: () => _navigateTo(context, anak.toChildMap()),
              );
            },
          );
        },
      ),
    );
  }
}

// Card item anak (lokal) - desain konsisten dengan ChildListCard
// tapi menggunakan field IbuAnakModel bukan AnakSearchModel
class _AnakItemCard extends StatelessWidget {
  final IbuAnakModel anak;
  final VoidCallback onTap;

  const _AnakItemCard({required this.anak, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isMale = anak.jenisKelamin.toLowerCase().contains('laki');
    final avatarColor = isMale ? const Color(0xFF2563EB) : const Color(0xFFEC4899);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(color: avatarColor, shape: BoxShape.circle),
                  child: Center(
                    child: Text(
                      anak.nama.isNotEmpty ? anak.nama[0].toUpperCase() : '?',
                      style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(anak.nama,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
                      const SizedBox(height: 4),
                      Text(
                        anak.usiaTeks.isNotEmpty ? 'Usia: ${anak.usiaTeks}' : 'Siap untuk pemantauan anak',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right, color: Colors.grey.shade400),
              ],
            ),
          ),
        ),
      ),
    );
  }
}