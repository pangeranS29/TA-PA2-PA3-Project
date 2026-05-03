// [MODUL: ANAK]
// Menu pemantauan anak — pintu masuk ke Skrining Bahaya, Milestone, Cek Warna Tinja.
// Refactor: header diganti AnakGradientHeader, menu card diganti AnakMenuCard,
// label section diganti AnakSectionTitle. Logika navigasi dan data tidak berubah.

import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/tumbuh_kembang/presentation/widgets/index.dart';

class PemantauanMenuScreen extends StatefulWidget {
  final Map<String, dynamic>? anak;

  const PemantauanMenuScreen({Key? key, this.anak}) : super(key: key);

  @override
  State<PemantauanMenuScreen> createState() => _PemantauanMenuScreenState();
}

class _PemantauanMenuScreenState extends State<PemantauanMenuScreen> {
  String get namaAnak => widget.anak?['nama'] ?? 'Si Kecil';
  String get usiaAnak => widget.anak?['usia_teks'] ?? 'Usia tidak diketahui';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header gradasi — pakai AnakGradientHeader
            AnakGradientHeader(
              title: 'Pemantauan Anak',
              subtitle: 'Pantau tumbuh kembang dengan rutin',
              onBack: () => Navigator.pop(context),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 24),

                  // Kartu info anak
                  _buildAgeInfoCard(),
                  const SizedBox(height: 32),

                  // Label section — pakai AnakSectionTitle
                  const AnakSectionTitle('LEMBAR PEMANTAUAN'),

                  // Menu-menu — pakai AnakMenuCard
                  AnakMenuCard(
                    title: 'Skrining Tanda Bahaya',
                    subtitle: 'Deteksi dini tanda-tanda bahaya pada anak',
                    icon: Icons.assignment_turned_in_outlined,
                    iconColor: const Color(0xFF2196F3),
                    onTap: () {
                      // TODO: Navigasi ke Form Skrining Tanda Bahaya
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Fitur Skrining Tanda Bahaya akan segera hadir')),
                      );
                    },
                  ),

                  AnakMenuCard(
                    title: 'Milestone Perkembangan',
                    subtitle: 'Penanda kemampuan sesuai usia',
                    icon: Icons.emoji_events_outlined,
                    iconColor: const Color(0xFFF59E0B),
                    onTap: () {
                      // TODO: Navigasi ke Form Milestone Ya/Tidak
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Fitur Milestone akan segera hadir')),
                      );
                    },
                  ),

                  AnakMenuCard(
                    title: 'Cek Warna Tinja',
                    subtitle: 'Deteksi kesehatan pencernaan anak',
                    icon: Icons.color_lens_outlined,
                    iconColor: const Color(0xFF8B5CF6),
                    onTap: () {
                      // TODO: Navigasi ke Form Warna Tinja
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Fitur Cek Warna Tinja akan segera hadir')),
                      );
                    },
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Kartu info anak (nama + usia) — tetap lokal karena spesifik ke screen ini
  Widget _buildAgeInfoCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: const Color(0xFF2196F3).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.child_care, color: Color(0xFF2196F3), size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(namaAnak,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0F2FE),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'Usia: $usiaAnak',
                    style: const TextStyle(
                        fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF0284C7)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}