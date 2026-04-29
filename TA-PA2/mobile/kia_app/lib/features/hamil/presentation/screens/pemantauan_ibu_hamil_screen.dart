import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/pemantauan_ibu_hamil_api_service.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/pemantauan_ibu_hamil_model.dart';

class PemantauanIbuHamilScreen extends StatefulWidget {
  const PemantauanIbuHamilScreen({super.key});

  @override
  State<PemantauanIbuHamilScreen> createState() =>
      _PemantauanIbuHamilScreenState();
}

class _PemantauanIbuHamilScreenState extends State<PemantauanIbuHamilScreen> {
  final _api = PemantauanIbuHamilApiService();

  int mingguKehamilan = 12;

  bool demamLebih2Hari = false;
  bool sakitKepala = false;
  bool cemasBerlebih = false;
  bool resikoTB = false;
  bool gerakanBayiKurang = false;
  bool nyeriPerut = false;
  bool cairanJalanLahir = false;
  bool masalahKemaluan = false;
  bool diareBerulang = false;

  bool _loading = false;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _api.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);

    try {
      final list = await _api.getMine();

      PemantauanIbuHamilModel? data;

      for (final item in list) {
        if (item.mingguKehamilan == mingguKehamilan) {
          data = item;
          break;
        }
      }

      if (data != null) {
        setState(() {
          demamLebih2Hari = data!.demamLebih2Hari;
          sakitKepala = data.sakitKepala;
          cemasBerlebih = data.cemasBerlebih;
          resikoTB = data.resikoTB;
          gerakanBayiKurang = data.gerakanBayiKurang;
          nyeriPerut = data.nyeriPerut;
          cairanJalanLahir = data.cairanJalanLahir;
          masalahKemaluan = data.masalahKemaluan;
          diareBerulang = data.diareBerulang;
        });
      }
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _save() async {
    setState(() => _saving = true);

    try {
      await _api.save(
        PemantauanIbuHamilModel(
          mingguKehamilan: mingguKehamilan,
          demamLebih2Hari: demamLebih2Hari,
          sakitKepala: sakitKepala,
          cemasBerlebih: cemasBerlebih,
          resikoTB: resikoTB,
          gerakanBayiKurang: gerakanBayiKurang,
          nyeriPerut: nyeriPerut,
          cairanJalanLahir: cairanJalanLahir,
          masalahKemaluan: masalahKemaluan,
          diareBerulang: diareBerulang,
        ),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pemantauan berhasil disimpan'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  int get _jumlahKeluhan {
    return [
      demamLebih2Hari,
      sakitKepala,
      cemasBerlebih,
      resikoTB,
      gerakanBayiKurang,
      nyeriPerut,
      cairanJalanLahir,
      masalahKemaluan,
      diareBerulang,
    ].where((value) => value).length;
  }

  bool get _adaKeluhan => _jumlahKeluhan > 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FC),
      appBar: AppBar(
        title: const Text('Pemantauan Ibu Hamil'),
        backgroundColor: const Color(0xFFF97316),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _buildHeaderCard(),
                const SizedBox(height: 16),
                _buildWeekCard(),
                const SizedBox(height: 16),
                _buildChecklistCard(),
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
                      _saving ? 'Menyimpan...' : 'Simpan Pemantauan',
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF97316),
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: Colors.grey,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildHeaderCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: _adaKeluhan ? const Color(0xFFFFF1F2) : const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _adaKeluhan ? const Color(0xFFFDA4AF) : const Color(0xFFFFD7A8),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.035),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: _adaKeluhan
                  ? const Color(0xFFFFE4E6)
                  : const Color(0xFFFFEDD5),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              _adaKeluhan
                  ? Icons.warning_amber_rounded
                  : Icons.health_and_safety_outlined,
              color: _adaKeluhan
                  ? const Color(0xFFE11D48)
                  : const Color(0xFFF97316),
              size: 30,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Pemantauan Mingguan',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF172033),
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  _adaKeluhan
                      ? 'Ada $_jumlahKeluhan keluhan yang perlu diperhatikan'
                      : 'Tidak ada keluhan yang dicatat',
                  style: TextStyle(
                    fontSize: 12,
                    color: _adaKeluhan
                        ? const Color(0xFFE11D48)
                        : const Color(0xFF7B8798),
                    fontWeight: _adaKeluhan ? FontWeight.w700 : FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeekCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5ECF6)),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.calendar_month_outlined,
            color: Color(0xFFF97316),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'Minggu Kehamilan',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Color(0xFF172033),
              ),
            ),
          ),
          DropdownButton<int>(
            value: mingguKehamilan,
            underline: const SizedBox(),
            borderRadius: BorderRadius.circular(14),
            items: List.generate(39, (index) {
              final week = index + 4;
              return DropdownMenuItem<int>(
                value: week,
                child: Text('Minggu $week'),
              );
            }),
            onChanged: _saving
                ? null
                : (value) {
                    if (value == null) return;

                    setState(() {
                      mingguKehamilan = value;
                      demamLebih2Hari = false;
                      sakitKepala = false;
                      cemasBerlebih = false;
                      resikoTB = false;
                      gerakanBayiKurang = false;
                      nyeriPerut = false;
                      cairanJalanLahir = false;
                      masalahKemaluan = false;
                      diareBerulang = false;
                    });

                    _loadData();
                  },
          ),
        ],
      ),
    );
  }

  Widget _buildChecklistCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE5ECF6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.035),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Tanda Bahaya / Keluhan',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Color(0xFF172033),
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Centang jika ibu mengalami salah satu kondisi berikut.',
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF7B8798),
              ),
            ),
          ),
          const SizedBox(height: 12),
          _buildSwitch(
            title: 'Demam lebih dari 2 hari',
            subtitle: 'Suhu tubuh tinggi atau tidak membaik',
            value: demamLebih2Hari,
            onChanged: (v) => setState(() => demamLebih2Hari = v),
          ),
          _buildSwitch(
            title: 'Sakit kepala',
            subtitle: 'Sakit kepala berat atau menetap',
            value: sakitKepala,
            onChanged: (v) => setState(() => sakitKepala = v),
          ),
          _buildSwitch(
            title: 'Cemas berlebih',
            subtitle: 'Merasa sangat gelisah atau khawatir',
            value: cemasBerlebih,
            onChanged: (v) => setState(() => cemasBerlebih = v),
          ),
          _buildSwitch(
            title: 'Risiko TB',
            subtitle: 'Batuk lama, kontak TB, atau gejala mengarah TB',
            value: resikoTB,
            onChanged: (v) => setState(() => resikoTB = v),
          ),
          _buildSwitch(
            title: 'Gerakan bayi berkurang',
            subtitle: 'Gerakan janin terasa lebih sedikit dari biasanya',
            value: gerakanBayiKurang,
            onChanged: (v) => setState(() => gerakanBayiKurang = v),
          ),
          _buildSwitch(
            title: 'Nyeri perut',
            subtitle: 'Nyeri hebat atau tidak biasa',
            value: nyeriPerut,
            onChanged: (v) => setState(() => nyeriPerut = v),
          ),
          _buildSwitch(
            title: 'Keluar cairan dari jalan lahir',
            subtitle: 'Air, lendir, atau cairan tidak biasa',
            value: cairanJalanLahir,
            onChanged: (v) => setState(() => cairanJalanLahir = v),
          ),
          _buildSwitch(
            title: 'Masalah pada kemaluan',
            subtitle: 'Nyeri, gatal, luka, atau keluhan lain',
            value: masalahKemaluan,
            onChanged: (v) => setState(() => masalahKemaluan = v),
          ),
          _buildSwitch(
            title: 'Diare berulang',
            subtitle: 'Diare sering atau tidak membaik',
            value: diareBerulang,
            onChanged: (v) => setState(() => diareBerulang = v),
          ),
        ],
      ),
    );
  }

  Widget _buildSwitch({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: _saving ? null : () => onChanged(!value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: value ? const Color(0xFFFFF7ED) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: value ? const Color(0xFFF97316) : const Color(0xFFE5ECF6),
            width: value ? 1.4 : 1,
          ),
        ),
        child: Row(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              width: 26,
              height: 26,
              decoration: BoxDecoration(
                color: value ? const Color(0xFFF97316) : Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: value ? const Color(0xFFF97316) : const Color(0xFFCBD5E1),
                  width: 1.5,
                ),
              ),
              child: value
                  ? const Icon(
                      Icons.check,
                      size: 18,
                      color: Colors.white,
                    )
                  : null,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF172033),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 11.5,
                      color: Color(0xFF7B8798),
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}