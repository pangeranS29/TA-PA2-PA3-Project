import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/services/pemeriksaan_dokter_api_service.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/models/pemeriksaan_dokter_model.dart';

class PemeriksaanDokterScreen extends StatefulWidget {
  final int trimester;

  const PemeriksaanDokterScreen({
    super.key,
    required this.trimester,
  });

  @override
  State<PemeriksaanDokterScreen> createState() => _PemeriksaanDokterScreenState();
}

class _PemeriksaanDokterScreenState extends State<PemeriksaanDokterScreen> {
  final _service = PemeriksaanDokterApiService();
  late Future<dynamic> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.trimester == 1
        ? _service.getTrimester1Mine()
        : _service.getTrimester3Mine();
  }

  @override
  void dispose() {
    _service.dispose();
    super.dispose();
  }

  String get _title =>
      widget.trimester == 1 ? 'Pemeriksaan Dokter Trimester I' : 'Pemeriksaan Dokter Trimester III';

  String _safe(String value) => value.trim().isEmpty ? '-' : value;

  String _date(String? value) {
    if (value == null || value.isEmpty) return '-';
    final date = DateTime.tryParse(value);
    if (date == null) return '-';

    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  String _num(num? value, String unit) {
    if (value == null) return '-';
    return '$value $unit';
  }

  String _weekDay(int? week, int? day) {
    if (week == null && day == null) return '-';
    if (day == null || day == 0) return '${week ?? 0} minggu';
    return '${week ?? 0} minggu $day hari';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FC),
      appBar: AppBar(
        title: Text(_title),
        backgroundColor: const Color(0xFF2F80ED),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: FutureBuilder<dynamic>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return _EmptyState(
              title: 'Data belum tersedia',
              message: snapshot.error.toString().replaceFirst('Exception: ', ''),
            );
          }

          final data = snapshot.data;
          if (data == null) {
            return const _EmptyState(
              title: 'Data belum tersedia',
              message: 'Belum ada data pemeriksaan dokter.',
            );
          }

          if (widget.trimester == 1) {
            return _buildTrimester1(data as PemeriksaanDokterTrimester1Model);
          }

          return _buildTrimester3(data as PemeriksaanDokterTrimester3Model);
        },
      ),
    );
  }

  Widget _buildTrimester1(PemeriksaanDokterTrimester1Model data) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _SummaryCard(
          title: 'Trimester I',
          subtitle: _safe(data.namaDokter),
          date: _date(data.tanggalPeriksa),
          icon: Icons.medical_information_outlined,
        ),
        const SizedBox(height: 14),
        _InfoCard(
          title: 'Anamnesa',
          icon: Icons.assignment_outlined,
          children: [
            _InfoRow('Konsep anamnesa', _safe(data.konsepAnamnesaPemeriksaan)),
            _InfoRow('HPHT', _date(data.hpht)),
            _InfoRow('Keteraturan haid', _safe(data.keteraturanHaid)),
            _InfoRow('Umur hamil HPHT', _num(data.umurHamilHphtMinggu, 'minggu')),
            _InfoRow('HPL berdasarkan HPHT', _date(data.hplBerdasarkanHpht)),
            _InfoRow('Umur hamil USG', _num(data.umurHamilUsgMinggu, 'minggu')),
            _InfoRow('HPL berdasarkan USG', _date(data.hplBerdasarkanUsg)),
          ],
        ),
        _InfoCard(
          title: 'Pemeriksaan Fisik',
          icon: Icons.monitor_heart_outlined,
          children: [
            _InfoRow('Konjungtiva', _safe(data.fisikKonjungtiva)),
            _InfoRow('Sklera', _safe(data.fisikSklera)),
            _InfoRow('Kulit', _safe(data.fisikKulit)),
            _InfoRow('Leher', _safe(data.fisikLeher)),
            _InfoRow('Gigi dan mulut', _safe(data.fisikGigiMulut)),
            _InfoRow('THT', _safe(data.fisikTht)),
            _InfoRow('Dada jantung', _safe(data.fisikDadaJantung)),
            _InfoRow('Dada paru', _safe(data.fisikDadaParu)),
            _InfoRow('Perut', _safe(data.fisikPerut)),
            _InfoRow('Tungkai', _safe(data.fisikTungkai)),
          ],
        ),
        _InfoCard(
          title: 'Hasil USG',
          icon: Icons.image_search_outlined,
          children: [
            _InfoRow('Jumlah GS', _safe(data.usgJumlahGs)),
            _InfoRow('Diameter GS', _num(data.usgDiameterGsCm, 'cm')),
            _InfoRow('Usia GS', _weekDay(data.usgDiameterGsMinggu, data.usgDiameterGsHari)),
            _InfoRow('Jumlah bayi', _safe(data.usgJumlahBayi)),
            _InfoRow('CRL', _num(data.usgCrlCm, 'cm')),
            _InfoRow('Usia CRL', _weekDay(data.usgCrlMinggu, data.usgCrlHari)),
            _InfoRow('Letak produk kehamilan', _safe(data.usgLetakProdukKehamilan)),
            _InfoRow('Pulsasi jantung', _safe(data.usgPulsasiJantung)),
            _InfoRow('Kecurigaan abnormal', _safe(data.usgKecurigaanTemuanAbnormal)),
            _InfoRow('Keterangan abnormal', _safe(data.usgKeteranganTemuanAbnormal)),
          ],
        ),
      ],
    );
  }

  Widget _buildTrimester3(PemeriksaanDokterTrimester3Model data) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _SummaryCard(
          title: 'Trimester III',
          subtitle: _safe(data.namaDokter),
          date: _date(data.tanggalPeriksa),
          icon: Icons.medical_services_outlined,
        ),
        const SizedBox(height: 14),
        _InfoCard(
          title: 'Pemeriksaan Umum',
          icon: Icons.assignment_outlined,
          children: [
            _InfoRow('Konsep anamnesa', _safe(data.konsepAnamnesaPemeriksaan)),
            _InfoRow('USG trimester 3 dilakukan', _safe(data.usgTrimester3Dilakukan)),
            _InfoRow('UK berdasarkan USG T1', _num(data.ukBerdasarkanUsgTrimester1Minggu, 'minggu')),
            _InfoRow('UK berdasarkan HPHT', _num(data.ukBerdasarkanHphtMinggu, 'minggu')),
            _InfoRow('UK berdasarkan biometri USG T3', _num(data.ukBerdasarkanBiometriUsgTrimester3Minggu, 'minggu')),
            _InfoRow('Selisih UK ≥ 3 minggu', _safe(data.selisihUk3MingguAtauLebih)),
          ],
        ),
        _InfoCard(
          title: 'Pemeriksaan Fisik',
          icon: Icons.monitor_heart_outlined,
          children: [
            _InfoRow('Konjungtiva', _safe(data.fisikKonjungtiva)),
            _InfoRow('Sklera', _safe(data.fisikSklera)),
            _InfoRow('Kulit', _safe(data.fisikKulit)),
            _InfoRow('Leher', _safe(data.fisikLeher)),
            _InfoRow('Gigi dan mulut', _safe(data.fisikGigiMulut)),
            _InfoRow('THT', _safe(data.fisikTht)),
            _InfoRow('Dada jantung', _safe(data.fisikDadaJantung)),
            _InfoRow('Dada paru', _safe(data.fisikDadaParu)),
            _InfoRow('Perut', _safe(data.fisikPerut)),
            _InfoRow('Tungkai', _safe(data.fisikTungkai)),
          ],
        ),
        _InfoCard(
          title: 'Kondisi Bayi dan Plasenta',
          icon: Icons.child_care_outlined,
          children: [
            _InfoRow('Jumlah bayi', _safe(data.usgJumlahBayi)),
            _InfoRow('Letak bayi', _safe(data.usgLetakBayi)),
            _InfoRow('Presentasi bayi', _safe(data.usgPresentasiBayi)),
            _InfoRow('Keadaan bayi', _safe(data.usgKeadaanBayi)),
            _InfoRow('DJJ', data.usgDjjNilai == null ? '-' : '${data.usgDjjNilai} bpm'),
            _InfoRow('Status DJJ', _safe(data.usgDjjStatus)),
            _InfoRow('Lokasi plasenta', _safe(data.usgLokasiPlasenta)),
            _InfoRow('Cairan ketuban SDP', _num(data.usgCairanKetubanSdpCm, 'cm')),
            _InfoRow('Status cairan ketuban', _safe(data.usgCairanKetubanStatus)),
          ],
        ),
        _InfoCard(
          title: 'Biometri',
          icon: Icons.straighten_outlined,
          children: [
            _InfoRow('BPD', _num(data.biometriBpdCm, 'cm')),
            _InfoRow('BPD usia', _num(data.biometriBpdMinggu, 'minggu')),
            _InfoRow('HC', _num(data.biometriHcCm, 'cm')),
            _InfoRow('HC usia', _num(data.biometriHcMinggu, 'minggu')),
            _InfoRow('AC', _num(data.biometriAcCm, 'cm')),
            _InfoRow('AC usia', _num(data.biometriAcMinggu, 'minggu')),
            _InfoRow('FL', _num(data.biometriFlCm, 'cm')),
            _InfoRow('FL usia', _num(data.biometriFlMinggu, 'minggu')),
            _InfoRow('EFW/TBJ', _num(data.biometriEfwTbjGram, 'gram')),
            _InfoRow('EFW/TBJ usia', _num(data.biometriEfwTbjMinggu, 'minggu')),
          ],
        ),
        _InfoCard(
          title: 'Temuan Abnormal',
          icon: Icons.warning_amber_rounded,
          children: [
            _InfoRow('Kecurigaan abnormal', _safe(data.usgKecurigaanTemuanAbnormal)),
            _InfoRow('Keterangan', _safe(data.usgKeteranganTemuanAbnormal)),
          ],
        ),
      ],
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String date;
  final IconData icon;

  const _SummaryCard({
    required this.title,
    required this.subtitle,
    required this.date,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final safeSubtitle = subtitle.trim().isEmpty ? 'Dokter belum tercatat' : subtitle;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF2F80ED),
        borderRadius: BorderRadius.circular(22),
      ),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.18),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 30),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  safeSubtitle,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  date,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
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
        border: Border.all(color: const Color(0xFFE5ECF6)),
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
                child: Icon(icon, color: const Color(0xFF2F80ED), size: 21),
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
                Icons.medical_services_outlined,
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