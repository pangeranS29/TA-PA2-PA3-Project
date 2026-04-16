import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/hamil/controller/anc_t3_controller.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/custom_text_field.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/enum_selector.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/confirmation_dialog.dart';

class AncFormT3Screen extends StatefulWidget {
  const AncFormT3Screen({super.key});

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

  /// Fungsi Pemilih Tanggal (Native Date Picker)
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
        // Format YYYY-MM-DD untuk sinkronisasi dengan DateTime.tryParse di controller
        controller.text = "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
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
            // Memanggil submitDataT3 dari controller
            _controller.submitDataT3(1, context); 
          },
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color t3Color = TrimesterTheme.t3Primary;

    return ListenableBuilder(
      listenable: _controller,
      builder: (context, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          appBar: AppBar(
            title: const Text("Trimester III — ANC K5", 
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            backgroundColor: t3Color,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.close, color: Colors.white), 
              onPressed: () => Navigator.pop(context),
            ),
          ),
          body: Stack(
            children: [
              Column(
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

                            // --- 2. PEMERIKSAAN FISIK & JANIN ---
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
                                  onChanged: (val) => _controller.isKembar = val,
                                ),

                                _buildFetalSection(
                                  label: _controller.isKembar ? "DATA JANIN 1" : "DATA JANIN",
                                  color: t3Color,
                                  letakJanin: _controller.letakJanin1,
                                  djjCtrl: _controller.djj1,
                                  onLetakChanged: (val) => setState(() => _controller.letakJanin1 = val),
                                ),
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
                              ],
                            ),

                            // --- 4. USG TRIMESTER III ---
                            _buildSectionCard(
                              title: "USG Trimester III",
                              icon: Icons.analytics_outlined,
                              color: t3Color,
                              children: [
                                _buildInfoBanner("USG T3 menilai posisi janin, plasenta, ketuban, dan berat janin final."),
                                const SizedBox(height: 16),
                                EnumSelector(
                                  label: "Keadaan Bayi *",
                                  options: const ['Hidup', 'Meninggal'],
                                  selectedValue: _controller.keadaanBayi,
                                  activeColor: t3Color,
                                  onChanged: (val) => _controller.keadaanBayi = val,
                                ),
                                EnumSelector(
                                  label: "Lokasi Plasenta *",
                                  options: const ['Fundus', 'Corpus', 'Letak Rendah', 'Previa'],
                                  selectedValue: _controller.lokasiPlasenta,
                                  activeColor: t3Color,
                                  onChanged: (val) => _controller.lokasiPlasenta = val,
                                ),
                                CustomInputField(label: "Cairan Ketuban SDP *", controller: _controller.sdpKetuban, suffix: "cm"),
                                
                                const Divider(height: 32),
                                CustomInputField(label: "EFW (Taksiran Berat Janin) *", controller: _controller.efw, suffix: "gram"),
                                
                                const SizedBox(height: 16),
                                EnumSelector(
                                  label: "Rencana Proses Melahirkan *",
                                  options: const ['Normal', 'Pervaginam Berbantu', 'Sectio Caesaria'],
                                  selectedValue: _controller.rencanaMelahirkan,
                                  activeColor: t3Color,
                                  onChanged: (val) => _controller.rencanaMelahirkan = val,
                                ),
                              ],
                            ),

                            // --- 5. SKRINING & KESIMPULAN ---
                            _buildSectionCard(
                              title: "Kesimpulan & Skrining",
                              icon: Icons.assignment_turned_in,
                              color: Colors.orange.shade800,
                              children: [
                                CheckboxListTile(
                                  title: const Text("Bengkak wajah / tangan", style: TextStyle(fontSize: 13)),
                                  value: _controller.bengkakWajah,
                                  onChanged: (val) => _controller.toggleBengkak(),
                                  activeColor: Colors.orange.shade900,
                                  controlAffinity: ListTileControlAffinity.leading,
                                  contentPadding: EdgeInsets.zero,
                                ),
                                const SizedBox(height: 16),
                                CustomInputField(
                                  label: "Kesimpulan Pemeriksaan *", 
                                  controller: _controller.kesimpulan, 
                                  keyboardType: TextInputType.multiline
                                ),
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
              // Indikator Loading
              if (_controller.isLoading)
                Container(
                  color: Colors.black26,
                  child: const Center(child: CircularProgressIndicator(color: t3Color)),
                ),
            ],
          ),
        );
      },
    );
  }

  // --- HELPER WIDGETS (Wajib berada di dalam class State) ---

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

  Widget _buildFetalSection({
    required String label,
    required Color color,
    required String letakJanin,
    required TextEditingController djjCtrl,
    required Function(String) onLetakChanged,
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
          CustomInputField(label: "DJJ (Denyut Jantung)", controller: djjCtrl, suffix: "x/mnt"),
        ],
      ),
    );
  }

  Widget _buildTopBanner(Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      color: color,
      child: const Row(
        children: [
          CircleAvatar(radius: 25, backgroundColor: Colors.white24, child: Icon(Icons.child_care, color: Colors.white)),
          SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
            onPressed: _controller.isLoading ? null : () => _prosesSimpanT3(color), 
            child: const Text("Simpan", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ),
      ],
    );
  }
}