import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/services/evaluasi_kesehatan_ibu_api_service.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/models/evaluasi_kesehatan_ibu_model.dart';

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
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FC),
      appBar: AppBar(
        title: const Text("Hasil Evaluasi Kesehatan"),
        backgroundColor: const Color(0xFF2F80ED),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: FutureBuilder<EvaluasiKesehatanIbuModel>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return _EmptyState(
              title: "Data evaluasi belum tersedia",
              message: snapshot.error.toString().replaceFirst('Exception: ', ''),
            );
          }

          final data = snapshot.data;
          if (data == null) {
            return const _EmptyState(
              title: "Data evaluasi belum tersedia",
              message: "Silakan lakukan pemeriksaan ke tenaga kesehatan.",
            );
          }

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _HeaderCard(data: data, formatDate: _formatDate),
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
                    _InfoRow("Imunisasi lainnya", data.imunisasiLainnyaCovid19),
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
        color: const Color(0xFF2F80ED),
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
              style: const TextStyle(color: Colors.white70, fontSize: 12),
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
        border: Border.all(color: const Color(0xFFE5ECF6)),
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