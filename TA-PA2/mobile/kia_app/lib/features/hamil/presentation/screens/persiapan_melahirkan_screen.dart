import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/persiapan_melahirkan_api_service.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/persiapan_melahirkan_model.dart';

class PersiapanMelahirkanScreen extends StatefulWidget {
  const PersiapanMelahirkanScreen({super.key});

  @override
  State<PersiapanMelahirkanScreen> createState() => _PersiapanMelahirkanScreenState();
}

class _PersiapanMelahirkanScreenState extends State<PersiapanMelahirkanScreen> {
  final _api = PersiapanMelahirkanApiService();

  bool perkiraanPersalinan = false;
  bool pendampingPersalinan = false;
  bool danaPersalinan = false;
  bool statusJKN = false;
  bool faskesPersalinan = false;
  bool pendonorDarah = false;
  bool transportasi = false;
  bool metodeKB = false;
  bool programP4K = false;
  bool dokumenPenting = false;

  bool _loading = false;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _showTopMessage(String text, {bool success = true}) {
    final overlay = Overlay.of(context);

    final entry = OverlayEntry(
      builder: (context) => Positioned(
        top: 70,
        left: 20,
        right: 20,
        child: Material(
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            decoration: BoxDecoration(
              color: success ? const Color(0xFF2563EB) : Colors.red,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              children: [
                Icon(
                  success ? Icons.check_circle_outline : Icons.error_outline,
                  color: Colors.white,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    text,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    overlay.insert(entry);

    Future.delayed(const Duration(seconds: 2), () {
      entry.remove();
    });
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);

    try {
      final data = await _api.getMine();

      if (data != null) {
        setState(() {
          perkiraanPersalinan = data.perkiraanPersalinan;
          pendampingPersalinan = data.pendampingPersalinan;
          danaPersalinan = data.danaPersalinan;
          statusJKN = data.statusJKN;
          faskesPersalinan = data.faskesPersalinan;
          pendonorDarah = data.pendonorDarah;
          transportasi = data.transportasi;
          metodeKB = data.metodeKB;
          programP4K = data.programP4K;
          dokumenPenting = data.dokumenPenting;
        });
      }
    } catch (e) {
      if (!mounted) return;
      _showTopMessage(e.toString(), success: false);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _save() async {
    setState(() => _saving = true);

    try {
      await _api.save(
        PersiapanMelahirkanModel(
          perkiraanPersalinan: perkiraanPersalinan,
          pendampingPersalinan: pendampingPersalinan,
          danaPersalinan: danaPersalinan,
          statusJKN: statusJKN,
          faskesPersalinan: faskesPersalinan,
          pendonorDarah: pendonorDarah,
          transportasi: transportasi,
          metodeKB: metodeKB,
          programP4K: programP4K,
          dokumenPenting: dokumenPenting,
        ),
      );

      if (!mounted) return;

      _showTopMessage("Persiapan melahirkan berhasil disimpan");

      Future.delayed(const Duration(milliseconds: 700), () {
        if (mounted) Navigator.pop(context);
      });
    } catch (e) {
      if (!mounted) return;
      _showTopMessage(e.toString(), success: false);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  int get _jumlahSiap => [
        perkiraanPersalinan,
        pendampingPersalinan,
        danaPersalinan,
        statusJKN,
        faskesPersalinan,
        pendonorDarah,
        transportasi,
        metodeKB,
        programP4K,
        dokumenPenting,
      ].where((e) => e).length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8FF),
      appBar: AppBar(
        title: const Text("Persiapan Melahirkan"),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _headerCard(),
                const SizedBox(height: 16),
                _checkCard(),
                const SizedBox(height: 20),
                SizedBox(
                  height: 52,
                  child: ElevatedButton.icon(
                    onPressed: _saving ? null : _save,
                    icon: _saving
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.save_outlined),
                    label: Text(
                      _saving ? "Menyimpan..." : "Simpan Persiapan",
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                )
              ],
            ),
    );
  }

  Widget _headerCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFBFDBFE)),
      ),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: const Color(0xFFDBEAFE),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.pregnant_woman, color: Color(0xFF2563EB)),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Checklist Kesiapan Persalinan",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 4),
                Text(
                  "$_jumlahSiap dari 10 persiapan telah siap",
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF2563EB),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _checkCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          _buildSwitch("Mengetahui perkiraan persalinan", perkiraanPersalinan, (v) => setState(() => perkiraanPersalinan = v)),
          _buildSwitch("Pendamping persalinan sudah siap", pendampingPersalinan, (v) => setState(() => pendampingPersalinan = v)),
          _buildSwitch("Dana persalinan tersedia", danaPersalinan, (v) => setState(() => danaPersalinan = v)),
          _buildSwitch("Status JKN aktif", statusJKN, (v) => setState(() => statusJKN = v)),
          _buildSwitch("Faskes tempat melahirkan dipilih", faskesPersalinan, (v) => setState(() => faskesPersalinan = v)),
          _buildSwitch("Pendonor darah tersedia", pendonorDarah, (v) => setState(() => pendonorDarah = v)),
          _buildSwitch("Transportasi menuju faskes tersedia", transportasi, (v) => setState(() => transportasi = v)),
          _buildSwitch("Metode KB pasca persalinan dipikirkan", metodeKB, (v) => setState(() => metodeKB = v)),
          _buildSwitch("Program P4K telah dipasang", programP4K, (v) => setState(() => programP4K = v)),
          _buildSwitch("Dokumen penting telah lengkap", dokumenPenting, (v) => setState(() => dokumenPenting = v)),
        ],
      ),
    );
  }

  Widget _buildSwitch(String title, bool value, ValueChanged<bool> onChanged) {
    return InkWell(
      onTap: _saving ? null : () => onChanged(!value),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: value ? const Color(0xFFEFF6FF) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: value ? const Color(0xFF2563EB) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 25,
              height: 25,
              decoration: BoxDecoration(
                color: value ? const Color(0xFF2563EB) : Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: value ? const Color(0xFF2563EB) : const Color(0xFFCBD5E1),
                ),
              ),
              child: value ? const Icon(Icons.check, size: 17, color: Colors.white) : null,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            )
          ],
        ),
      ),
    );
  }
}