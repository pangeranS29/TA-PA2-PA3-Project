import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/core/widgets/custom_text_field.dart';
import 'package:ta_pa2_pa3_project/core/widgets/enum_selector.dart';
import 'package:ta_pa2_pa3_project/core/widgets/confirmation_dialog.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/presentation/controllers/anc_t2_controller.dart';

class AncFormT2Screen extends StatefulWidget {
  const AncFormT2Screen({super.key});

  @override
  State<AncFormT2Screen> createState() => _AncFormT2ScreenState();
}

class _AncFormT2ScreenState extends State<AncFormT2Screen> {
  final AncT2Controller _controller = AncT2Controller();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _selectDate(
      BuildContext context, TextEditingController controller) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2101),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: TrimesterTheme.t2Primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() => controller.text = '${picked.day}/${picked.month}/${picked.year}');
    }
  }

  void _prosesSimpanT2(Color color) {
    if (_formKey.currentState!.validate()) {
      showDialog(
        context: context,
        builder: (context) => ConfirmationDialog(
          title: 'Simpan Pemeriksaan T2',
          content: 'Pastikan data sudah benar. Setelah disimpan, progres Trimester II akan tercatat.',
          primaryColor: color,
          onConfirm: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Data Trimester II Berhasil Disimpan!')),
            );
            Navigator.pop(context, true);
          },
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color t2Color = TrimesterTheme.t2Primary;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Trimester II — ANC K3',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: t2Color,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(children: [
        _buildTopBanner(t2Color),
        Expanded(
          child: Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(children: [
                _buildStatsRow(),
                const SizedBox(height: 20),

                // 1. IDENTITAS KUNJUNGAN
                _buildSectionCard(
                  title: 'Identitas Kunjungan',
                  icon: Icons.calendar_month,
                  color: t2Color,
                  children: [
                    Row(children: [
                      Expanded(child: _buildDateField('Tanggal Periksa *', _controller.tanggalPeriksa)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildDateField('Kembali Tanggal', _controller.tanggalKembali)),
                    ]),
                    CustomInputField(label: 'Tempat Periksa *', controller: _controller.tempatPeriksa),
                    CustomInputField(label: 'Nama Dokter / Bidan *', controller: _controller.namaDokter),
                  ],
                ),

                // 2. PEMERIKSAAN FISIK & KEMBAR
                _buildSectionCard(
                  title: 'Pemeriksaan Fisik',
                  icon: Icons.monitor_weight_outlined,
                  color: t2Color,
                  children: [
                    Row(children: [
                      Expanded(child: CustomInputField(label: 'Berat Badan *', controller: _controller.beratBadan, suffix: 'kg')),
                      const SizedBox(width: 12),
                      Expanded(child: CustomInputField(label: 'LiLA *', controller: _controller.lila, suffix: 'cm')),
                    ]),
                    Row(children: [
                      Expanded(child: CustomInputField(label: 'TD Sistolik *', controller: _controller.tdSistolik, suffix: 'mmHg')),
                      const SizedBox(width: 12),
                      Expanded(child: CustomInputField(label: 'TD Diastolik *', controller: _controller.tdDiastolik, suffix: 'mmHg')),
                    ]),
                    CustomInputField(label: 'Tinggi Fundus *', controller: _controller.tinggiFundus, suffix: 'cm'),
                    const Divider(height: 32),
                    SwitchListTile(
                      title: const Text('Kehamilan Kembar (Gemelli)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      value: _controller.isKembar,
                      activeColor: t2Color,
                      contentPadding: EdgeInsets.zero,
                      onChanged: (val) => setState(() => _controller.isKembar = val),
                    ),
                    _buildFetalSection(
                      label: _controller.isKembar ? 'DATA JANIN 1' : 'DATA JANIN',
                      color: t2Color,
                      letakJanin: _controller.letakJanin1,
                      djjCtrl: _controller.djj1,
                      hasilDjj: _controller.hasilDjj1,
                      ketCtrl: _controller.keteranganJanin1,
                      onLetakChanged: (val) => setState(() => _controller.letakJanin1 = val),
                      onHasilChanged: (val) => setState(() => _controller.hasilDjj1 = val),
                    ),
                    if (_controller.isKembar) ...[
                      const SizedBox(height: 16),
                      _buildFetalSection(
                        label: 'DATA JANIN 2',
                        color: Colors.blue.shade700,
                        letakJanin: _controller.letakJanin2,
                        djjCtrl: _controller.djj2,
                        hasilDjj: _controller.hasilDjj2,
                        ketCtrl: _controller.keteranganJanin2,
                        onLetakChanged: (val) => setState(() => _controller.letakJanin2 = val),
                        onHasilChanged: (val) => setState(() => _controller.hasilDjj2 = val),
                      ),
                    ],
                  ],
                ),

                // 3. LABORATORIUM
                _buildSectionCard(
                  title: 'Laboratorium',
                  icon: Icons.biotech_outlined,
                  color: t2Color,
                  children: [
                    Row(children: [
                      Expanded(child: CustomInputField(label: 'Hemoglobin *', controller: _controller.hemoglobin, suffix: 'g/dL')),
                      const SizedBox(width: 12),
                      Expanded(child: CustomInputField(label: 'Tes Gula Darah', controller: _controller.tesGulaDarah, suffix: 'mg/dL')),
                    ]),
                    Row(children: [
                      Expanded(child: CustomInputField(label: 'GD Puasa *', controller: _controller.gdPuasa, suffix: 'mg/dL')),
                      const SizedBox(width: 12),
                      Expanded(child: CustomInputField(label: 'GD 2 Jam PP *', controller: _controller.gd2JamPP, suffix: 'mg/dL')),
                    ]),
                    EnumSelector(
                      label: 'Protein Urin',
                      options: const ['Negatif', 'Trace', '+1', '+2', '+3'],
                      selectedValue: _controller.proteinUrin,
                      activeColor: Colors.green,
                      onChanged: (val) => setState(() => _controller.proteinUrin = val),
                    ),
                  ],
                ),

                // 4. USG BIOMETRI
                _buildSectionCard(
                  title: 'USG Trimester II - Biometri',
                  icon: Icons.analytics_outlined,
                  color: t2Color,
                  children: [
                    _buildInfoBanner('USG T2 menilai perkembangan organ dan ukuran janin. Dilakukan minggu 18–24.'),
                    const SizedBox(height: 16),
                    _buildBiometriRow('BPD (cm)', _controller.bpd, 'Usia BPD', '24 mgg'),
                    _buildBiometriRow('HC (cm)', _controller.hc, 'Usia HC', '23 mgg'),
                    _buildBiometriRow('AC (cm)', _controller.ac, 'Usia AC', '24 mgg'),
                    _buildBiometriRow('FL (cm)', _controller.fl, 'Usia FL', '24 mgg'),
                    _buildEfwBox(),
                  ],
                ),

                // 5. SKRINING PREEKLAMPSIA
                _buildSectionCard(
                  title: 'Skrining Preeklampsia',
                  icon: Icons.warning_amber_rounded,
                  color: Colors.orange.shade800,
                  children: [
                    _buildRiskHeader('RISIKO TINGGI (SKOR 4)', Colors.red),
                    _buildCheckItem('Riwayat preeklampsia sebelumnya', _controller.riwayatPreeklampsia, (val) => setState(() => _controller.riwayatPreeklampsia = val!), '+4'),
                    _buildCheckItem('Kehamilan multiple (kembar)', _controller.isKembar || _controller.kehamilanMultiple, (val) => setState(() => _controller.kehamilanMultiple = val!), '+4'),
                    const SizedBox(height: 12),
                    _buildRiskHeader('RISIKO SEDANG (SKOR 1)', Colors.orange.shade900),
                    _buildCheckItem('Nullipara', _controller.nullipara, (val) => setState(() => _controller.nullipara = val!), '+1'),
                    _buildCheckItem('Usia ibu ≥ 35 tahun', _controller.usiaDiatas35, (val) => setState(() => _controller.usiaDiatas35 = val!), '+1'),
                    _buildCheckItem('MAP > 90 mmHg', _controller.mapDiatas90, (val) => setState(() => _controller.mapDiatas90 = val!), '+1'),
                    const SizedBox(height: 20),
                    _buildScoreCircle(),
                  ],
                ),

                const SizedBox(height: 32),
                _buildBottomButtons(t2Color),
                const SizedBox(height: 20),
              ]),
            ),
          ),
        ),
      ]),
    );
  }

  // ─── Widget Helpers ────────────────────────────────────────────────────────

  Widget _buildDateField(String label, TextEditingController controller) {
    return TextFormField(
      controller: controller,
      readOnly: true,
      style: const TextStyle(fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        suffixIcon: IconButton(
          icon: const Icon(Icons.calendar_today, color: TrimesterTheme.t2Primary, size: 18),
          onPressed: () => _selectDate(context, controller),
        ),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildFetalSection({
    required String label, required Color color,
    required String letakJanin, required TextEditingController djjCtrl,
    required String hasilDjj, required TextEditingController ketCtrl,
    required Function(String) onLetakChanged,
    required Function(String) onHasilChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      margin: const EdgeInsets.only(top: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 11)),
        const SizedBox(height: 12),
        EnumSelector(label: 'Letak Janin *', options: const ['Vertex', 'Sungsang', 'Lintang', 'Belum Diketahui'], selectedValue: letakJanin, activeColor: color, onChanged: onLetakChanged),
        CustomInputField(label: 'DJJ (Denyut Jantung Janin)', controller: djjCtrl, suffix: 'x/mnt'),
        EnumSelector(label: 'Hasil DJJ *', options: const ['Normal', 'Tidak Normal', 'Belum Diperiksa'], selectedValue: hasilDjj, activeColor: Colors.green, onChanged: onHasilChanged),
        CustomInputField(label: 'Keterangan Letak Janin (Opsional)', controller: ketCtrl),
      ]),
    );
  }

  Widget _buildTopBanner(Color color) {
    return Container(padding: const EdgeInsets.all(20), color: color, child: Row(children: [
      const CircleAvatar(radius: 25, backgroundColor: Colors.white24, child: Icon(Icons.child_care, color: Colors.white)),
      const SizedBox(width: 16),
      const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Minggu 24 • Sebesar Jagung', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        Text('Janin aktif menendang. Panjang ±30 cm.', style: TextStyle(color: Colors.white70, fontSize: 12)),
      ]),
    ]));
  }

  Widget _buildStatsRow() {
    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      _statItem('USIA KEHAMILAN', '24 mgg', 'Dari HPHT'),
      _statItem('KUNJUNGAN', 'K3 / T2', 'Otomatis'),
      _statItem('KEMBALI', '22 Mei \'26', 'Otomatis'),
    ]);
  }

  Widget _statItem(String label, String value, String sub) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.purple.shade100)),
      child: Column(children: [
        Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.purple)),
        Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        Text(sub, style: const TextStyle(fontSize: 9, color: Colors.grey)),
      ]),
    );
  }

  Widget _buildBiometriRow(String label, TextEditingController ctrl, String subLabel, String subVal) {
    return Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [
      Expanded(child: CustomInputField(label: label, controller: ctrl, suffix: 'cm')),
      const SizedBox(width: 12),
      Expanded(child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: Colors.purple.shade50, borderRadius: BorderRadius.circular(8)),
        child: Column(children: [
          Text(subLabel, style: const TextStyle(fontSize: 9, color: Colors.purple)),
          Text(subVal, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.purple)),
        ]),
      )),
    ]));
  }

  Widget _buildEfwBox() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(12)),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('EFW / TAKSIRAN BERAT JANIN', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.blue)),
          Text('630 gram', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blue)),
          Text('Usia EFW · 24 mgg', style: TextStyle(fontSize: 10, color: Colors.blue)),
        ]),
        const Text('Normal', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.green)),
      ]),
    );
  }

  Widget _buildScoreCircle() {
    return Center(child: Container(
      width: 100, height: 100,
      decoration: BoxDecoration(color: Colors.orange.shade900, shape: BoxShape.circle),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Text('TOTAL SKOR', style: TextStyle(color: Colors.white, fontSize: 10)),
        Text('${_controller.totalSkor}', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
        Text(_controller.interpretasi, style: const TextStyle(color: Colors.white70, fontSize: 8)),
      ]),
    ));
  }

  Widget _buildRiskHeader(String text, Color color) {
    return Padding(padding: const EdgeInsets.symmetric(vertical: 8), child: Text(text, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color)));
  }

  Widget _buildCheckItem(String title, bool value, Function(bool?) onChanged, String points) {
    return CheckboxListTile(
      title: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Expanded(child: Text(title, style: const TextStyle(fontSize: 13))),
        Text(points, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green)),
      ]),
      value: value,
      onChanged: onChanged,
      controlAffinity: ListTileControlAffinity.leading,
      contentPadding: EdgeInsets.zero,
    );
  }

  Widget _buildInfoBanner(String text) {
    return Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(10)), child: Row(children: [
      const Icon(Icons.info_outline, color: Colors.blue, size: 20),
      const SizedBox(width: 10),
      Expanded(child: Text(text, style: const TextStyle(fontSize: 11, color: Colors.blue))),
    ]));
  }

  Widget _buildSectionCard({required String title, required IconData icon, required Color color, required List<Widget> children}) {
    return Card(margin: const EdgeInsets.only(bottom: 20), elevation: 2, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)), child: Column(children: [
      Container(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12), decoration: BoxDecoration(color: color, borderRadius: const BorderRadius.vertical(top: Radius.circular(15))), child: Row(children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(width: 10),
        Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ])),
      Padding(padding: const EdgeInsets.all(16), child: Column(children: children)),
    ]));
  }

  Widget _buildBottomButtons(Color color) {
    return Row(children: [
      Expanded(child: OutlinedButton(
        style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 15), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
        onPressed: () => Navigator.pop(context),
        child: const Text('Batal'),
      )),
      const SizedBox(width: 16),
      Expanded(child: ElevatedButton(
        style: ElevatedButton.styleFrom(backgroundColor: color, padding: const EdgeInsets.symmetric(vertical: 15), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
        onPressed: () => _prosesSimpanT2(color),
        child: const Text('Simpan', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      )),
    ]);
  }
}