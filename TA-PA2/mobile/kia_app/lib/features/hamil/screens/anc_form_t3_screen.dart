import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/hamil/controller/anc_t3_controller.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/custom_text_field.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/enum_selector.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/confirmation_dialog.dart';

class AncFormT3Screen extends StatefulWidget {
  @override
  _AncFormT3ScreenState createState() => _AncFormT3ScreenState();
}

class _AncFormT3ScreenState extends State<AncFormT3Screen> {
  final AncT3Controller _controller = AncT3Controller();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// Fungsi Pemilih Tanggal dengan Ikon (Native Date Picker)
  Future<void> _selectDate(BuildContext context, TextEditingController controller) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2101),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(primary: TrimesterTheme.t3Primary),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        controller.text = "${picked.day}/${picked.month}/${picked.year}";
      });
    }
  }

  /// Fungsi Validasi dan Konfirmasi Simpan
  void _prosesSimpanT3(Color color) {
    if (_formKey.currentState!.validate()) {
      showDialog(
        context: context,
        builder: (context) => ConfirmationDialog(
          title: "Simpan Pemeriksaan T3",
          content: "Pastikan data persiapan persalinan dan kondisi janin sudah benar. Data ini akan menjadi dasar untuk proses persalinan.",
          primaryColor: color,
          onConfirm: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Data Trimester III Berhasil Disimpan!")),
            );
            Navigator.pop(context, true); 
          },
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color t3Color = TrimesterTheme.t3Primary;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text("Trimester III — ANC K5", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: t3Color,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white), 
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          _buildTopBanner(t3Color),
          Expanded(
            child: Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildStatsRow(),
                    const SizedBox(height: 20),

                    // --- 1. IDENTITAS KUNJUNGAN ---
                    _buildSectionCard(
                      title: "Identitas Kunjungan",
                      icon: Icons.calendar_month,
                      color: t3Color,
                      children: [
                        Row(
                          children: [
                            Expanded(child: _buildDateField("Tanggal Periksa *", _controller.tanggalPeriksa)),
                            const SizedBox(width: 12),
                            Expanded(child: _buildDateField("Kembali", _controller.tanggalKembali)),
                          ],
                        ),
                        CustomInputField(label: "Tempat Periksa *", controller: _controller.tempatPeriksa),
                        CustomInputField(label: "Nama Dokter / Bidan *", controller: _controller.namaDokter),
                      ],
                    ),

                    // --- 2. PEMERIKSAAN FISIK & JANIN (Twin Support) ---
                    _buildSectionCard(
                      title: "Pemeriksaan Fisik",
                      icon: Icons.monitor_weight_outlined,
                      color: t3Color,
                      children: [
                        Row(
                          children: [
                            Expanded(child: CustomInputField(label: "Berat Badan *", controller: _controller.beratBadan, suffix: "kg")),
                            const SizedBox(width: 12),
                            Expanded(child: CustomInputField(label: "LiLA *", controller: _controller.lila, suffix: "cm")),
                          ],
                        ),
                        Row(
                          children: [
                            Expanded(child: CustomInputField(label: "TD Sistolik *", controller: _controller.tdSistolik, suffix: "mmHg")),
                            const SizedBox(width: 12),
                            Expanded(child: CustomInputField(label: "TD Diastolik *", controller: _controller.tdDiastolik, suffix: "mmHg")),
                          ],
                        ),
                        CustomInputField(label: "Tinggi Fundus *", controller: _controller.tinggiFundus, suffix: "cm"),
                        
                        const Divider(height: 32),
                        
                        SwitchListTile(
                          title: const Text("Kehamilan Kembar (Gemelli)", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                          value: _controller.isKembar,
                          activeColor: t3Color,
                          contentPadding: EdgeInsets.zero,
                          onChanged: (val) => setState(() => _controller.isKembar = val),
                        ),

                        // DATA JANIN 1
                        _buildFetalSection(
                          label: _controller.isKembar ? "DATA JANIN 1" : "DATA JANIN",
                          color: t3Color,
                          letakJanin: _controller.letakJanin1,
                          djjCtrl: _controller.djj1,
                          hasilDjj: _controller.hasilDjj1,
                          ketCtrl: _controller.keteranganJanin1,
                          onLetakChanged: (val) => setState(() => _controller.letakJanin1 = val),
                          onHasilChanged: (val) => setState(() => _controller.hasilDjj1 = val),
                        ),

                        // DATA JANIN 2 (Muncul jika Kembar)
                        if (_controller.isKembar) ...[
                          const SizedBox(height: 16),
                          _buildFetalSection(
                            label: "DATA JANIN 2",
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

                    // --- 3. LABORATORIUM ---
                    _buildSectionCard(
                      title: "Laboratorium",
                      icon: Icons.biotech_outlined,
                      color: t3Color,
                      children: [
                        Row(
                          children: [
                            Expanded(child: CustomInputField(label: "Hemoglobin *", controller: _controller.hemoglobin, suffix: "g/dL")),
                            const SizedBox(width: 12),
                            Expanded(child: CustomInputField(label: "Tes Gula Darah", controller: _controller.tesGulaDarah, suffix: "mg/dL")),
                          ],
                        ),
                        EnumSelector(
                          label: "Protein Urin",
                          options: const ['Negatif', 'Trace', '+1', '+2', '+3'],
                          selectedValue: _controller.proteinUrin,
                          activeColor: Colors.green,
                          onChanged: (val) => setState(() => _controller.proteinUrin = val),
                        ),
                        EnumSelector(
                          label: "Urin Reduksi",
                          options: const ['Negatif', '+1', '+2'],
                          selectedValue: _controller.urinReduksi,
                          activeColor: Colors.green,
                          onChanged: (val) => setState(() => _controller.urinReduksi = val),
                        ),
                      ],
                    ),

                    // --- 4. USG TRIMESTER III ---
                    _buildSectionCard(
                      title: "USG Trimester III",
                      icon: Icons.analytics_outlined,
                      color: t3Color,
                      children: [
                        _buildInfoBanner("USG T3 menilai kesiapan persalinan: posisi janin, plasenta, ketuban, dan berat janin final."),
                        const SizedBox(height: 16),
                        EnumSelector(
                          label: "Keadaan Bayi *",
                          options: const ['Hidup', 'Meninggal'],
                          selectedValue: _controller.keadaanBayi,
                          activeColor: t3Color,
                          onChanged: (val) => setState(() => _controller.keadaanBayi = val),
                        ),
                        EnumSelector(
                          label: "Lokasi Plasenta *",
                          options: const ['Fundus', 'Corpus', 'Letak Rendah', 'Previa'],
                          selectedValue: _controller.lokasiPlasenta,
                          activeColor: t3Color,
                          onChanged: (val) => setState(() => _controller.lokasiPlasenta = val),
                        ),
                        Row(
                          children: [
                            Expanded(child: CustomInputField(label: "Cairan Ketuban SDP *", controller: _controller.sdpKetuban, suffix: "cm")),
                            const SizedBox(width: 12),
                            Expanded(child: CustomInputField(label: "Hasil Cairan", controller: TextEditingController(text: "Cukup"), suffix: "✨")),
                          ],
                        ),
                        const Divider(height: 32),
                        _buildBiometriRow("BPD (cm)", _controller.bpd, "Usia BPD", "36 mgg"),
                        _buildBiometriRow("HC (cm)", _controller.hc, "Usia HC", "36 mgg"),
                        _buildBiometriRow("AC (cm)", _controller.ac, "Usia AC", "36 mgg"),
                        _buildBiometriRow("FL (cm)", _controller.fl, "Usia FL", "36 mgg"),
                        _buildEfwBoxT3(),
                        const SizedBox(height: 16),
                        EnumSelector(
                          label: "Rencana Proses Melahirkan *",
                          options: const ['Normal', 'Pervaginam Berbantu', 'Sectio Caesaria'],
                          selectedValue: _controller.rencanaMelahirkan,
                          activeColor: t3Color,
                          onChanged: (val) => setState(() => _controller.rencanaMelahirkan = val),
                        ),
                      ],
                    ),

                    // --- 5. PREEKLAMPSIA UPDATE T3 ---
                    _buildSectionCard(
                      title: "Preeklampsia — Perbarui T3",
                      icon: Icons.warning_amber_rounded,
                      color: Colors.orange.shade800,
                      children: [
                        _buildReviewBox("Skor dari Trimester II: 5 poin (Risiko Sedang)"),
                        const SizedBox(height: 12),
                        _buildCheckItem("Proteinuria baru muncul", _controller.proteinuriaBaru, (val) => setState(() => _controller.proteinuriaBaru = val!), "+1"),
                        _buildCheckItem("Bengkak wajah / tangan", _controller.bengkakWajah, (val) => setState(() => _controller.bengkakWajah = val!), "+1"),
                        const SizedBox(height: 16),
                        _buildScoreCircleT3(),
                      ],
                    ),

                    // --- 6. TATA LAKSANA & KESIMPULAN ---
                    _buildSectionCard(
                      title: "Tata Laksana & Kesimpulan",
                      icon: Icons.assignment_turned_in,
                      color: t3Color,
                      children: [
                        CustomInputField(label: "Tata Laksana Kasus", controller: _controller.tataLaksana, keyboardType: TextInputType.multiline),
                        CustomInputField(label: "Kesimpulan", controller: _controller.kesimpulan, keyboardType: TextInputType.multiline),
                      ],
                    ),

                    const SizedBox(height: 32),
                    _buildBottomButtons(t3Color),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- WIDGET HELPER: DATE PICKER IKON ---
  Widget _buildDateField(String label, TextEditingController controller) {
    return TextFormField(
      controller: controller,
      readOnly: true,
      style: const TextStyle(fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        suffixIcon: IconButton(
          icon: const Icon(Icons.calendar_today, color: TrimesterTheme.t3Primary, size: 18),
          onPressed: () => _selectDate(context, controller),
        ),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  // --- WIDGET HELPER: DATA JANIN TERPISAH ---
  Widget _buildFetalSection({
    required String label,
    required Color color,
    required String letakJanin,
    required TextEditingController djjCtrl,
    required String hasilDjj,
    required TextEditingController ketCtrl,
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 11)),
          const SizedBox(height: 12),
          EnumSelector(
            label: "Letak Janin *",
            options: const ['Vertex', 'Sungsang', 'Lintang', 'Belum Diketahui'],
            selectedValue: letakJanin,
            activeColor: color,
            onChanged: onLetakChanged,
          ),
          CustomInputField(label: "DJJ (Denyut Jantung Janin)", controller: djjCtrl, suffix: "x/mnt"),
          EnumSelector(
            label: "Hasil DJJ *",
            options: const ['Normal', 'Tidak Normal', 'Belum Diperiksa'],
            selectedValue: hasilDjj,
            activeColor: Colors.green,
            onChanged: onHasilChanged,
          ),
          CustomInputField(label: "Keterangan Letak Janin (Opsional)", controller: ketCtrl),
        ],
      ),
    );
  }

  // --- MODEL TOMBOL SESUAI PERMINTAANMU ---
  Widget _buildBottomButtons(Color color) {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton(
            style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 15), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            onPressed: () => Navigator.pop(context),
            child: const Text("Batal"),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: color, padding: const EdgeInsets.symmetric(vertical: 15), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            onPressed: () => _prosesSimpanT3(color), 
            child: const Text("Simpan", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ),
      ],
    );
  }

  // --- WIDGET HELPERS LAINNYA ---
  Widget _buildTopBanner(Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      color: color,
      child: Row(
        children: [
          const CircleAvatar(radius: 25, backgroundColor: Colors.white24, child: Icon(Icons.child_care, color: Colors.white)),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text("Minggu 36 • Sebesar Semangka", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              Text("Kepala janin turun ke panggul. Siap lahir.", style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _statItem("USIA KEHAMILAN", "36 mgg", "Dari HPHT"),
        _statItem("KUNJUNGAN", "K5 / T3", "Otomatis"),
        _statItem("HPL", "15 Agt '25", "Otomatis"),
      ],
    );
  }

  Widget _statItem(String label, String value, String sub) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.teal.shade100)),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.teal)),
          Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          Text(sub, style: const TextStyle(fontSize: 9, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildBiometriRow(String label, TextEditingController ctrl, String subLabel, String subVal) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Expanded(child: CustomInputField(label: label, controller: ctrl, suffix: "cm")),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(color: Colors.teal.shade50, borderRadius: BorderRadius.circular(8)),
              child: Column(
                children: [
                  Text(subLabel, style: const TextStyle(fontSize: 9, color: Colors.teal)),
                  Text(subVal, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.teal)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEfwBoxT3() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.teal.shade50, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.teal.shade100)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text("EFW / TAKSIRAN BERAT JANIN", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.teal)),
              Text("2.850 gram", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.teal)),
              Text("Usia EFW · 36 mgg", style: TextStyle(fontSize: 10, color: Colors.teal)),
            ],
          ),
          const Text("Normal", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.green)),
        ],
      ),
    );
  }

  Widget _buildReviewBox(String text) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.orange.shade50, borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.orange.shade200)),
      child: Row(
        children: [
          const Icon(Icons.history, color: Colors.orange, size: 18),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: TextStyle(fontSize: 11, color: Colors.orange.shade900))),
        ],
      ),
    );
  }

  Widget _buildScoreCircleT3() {
    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(color: Colors.orange.shade900, borderRadius: BorderRadius.circular(30)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Column(
              children: const [
                Text("SKOR TOTAL T3", style: TextStyle(color: Colors.white70, fontSize: 8)),
                Text("5", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(width: 16),
            const Text("Risiko Sedang", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildCheckItem(String title, bool value, Function(bool?) onChanged, String points) {
    return CheckboxListTile(
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(title, style: const TextStyle(fontSize: 13))),
          Text(points, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.orange.shade900)),
        ],
      ),
      value: value,
      onChanged: onChanged,
      controlAffinity: ListTileControlAffinity.leading,
      contentPadding: EdgeInsets.zero,
    );
  }

  Widget _buildInfoBanner(String text) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.teal.shade50, borderRadius: BorderRadius.circular(10)),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: Colors.teal, size: 20),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 11, color: Colors.teal))),
        ],
      ),
    );
  }

  Widget _buildSectionCard({required String title, required IconData icon, required Color color, required List<Widget> children}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 20),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(color: color, borderRadius: const BorderRadius.vertical(top: Radius.circular(15))),
            child: Row(
              children: [
                Icon(icon, color: Colors.white, size: 20),
                const SizedBox(width: 10),
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Padding(padding: const EdgeInsets.all(16), child: Column(children: children)),
        ],
      ),
    );
  }
}