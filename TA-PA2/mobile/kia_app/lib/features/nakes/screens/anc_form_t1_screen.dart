import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
import 'package:ta_pa2_pa3_project/features/nakes/controller/anc_t1_controller.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/custom_text_field.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/enum_selector.dart';
import 'package:ta_pa2_pa3_project/shared/widgets/confirmation_dialog.dart';

class AncFormT1Screen extends StatefulWidget {
  const AncFormT1Screen({super.key});

  @override
  _AncFormT1ScreenState createState() => _AncFormT1ScreenState();
}

class _AncFormT1ScreenState extends State<AncFormT1Screen> {
  // Controller diinisialisasi sekali di sini
  final AncT1Controller _controller = AncT1Controller();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// Fungsi Pemilih Tanggal (Native Date Picker)
  /// Format diubah ke YYYY-MM-DD agar sinkron dengan DateTime.tryParse di controller
  Future<void> _selectDate(BuildContext context, TextEditingController controller) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2101),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(primary: TrimesterTheme.t1Primary),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        controller.text = "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      });
    }
  }

  /// Fungsi Validasi dan Memanggil Submit di Controller
  void _prosesSimpan(Color color) {
    if (_formKey.currentState!.validate()) {
      showDialog(
        context: context,
        builder: (context) => ConfirmationDialog(
          title: "Simpan Pemeriksaan T1",
          content: "Pastikan data sudah benar. Setelah disimpan, progres akan tercatat dan akses Trimester II akan terbuka.",
          primaryColor: color,
          onConfirm: () {
            // Memanggil fungsi submit dari controller (ID Kehamilan simulasi 1)
            _controller.submitDataT1(1, context);
          },
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color t1Color = TrimesterTheme.t1Primary;

    // Menggunakan ListenableBuilder agar UI reaktif terhadap notifyListeners() di controller
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          appBar: AppBar(
            title: const Text("Trimester I — ANC K1", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            backgroundColor: t1Color,
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
                  _buildTopBanner(t1Color),
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
                              color: t1Color,
                              children: [
                                Row(
                                  children: [
                                    Expanded(child: _buildDateField("Tanggal Periksa *", _controller.tanggalPeriksa)),
                                    const SizedBox(width: 12),
                                    Expanded(child: _buildDateField("Kembali Tanggal", _controller.tanggalKembali)),
                                  ],
                                ),
                                CustomInputField(label: "Tempat Periksa *", controller: _controller.tempatPeriksa),
                                CustomInputField(label: "Nama Dokter / Bidan *", controller: _controller.namaDokter),
                              ],
                            ),

                            // --- 2. PEMERIKSAAN FISIK ---
                            _buildSectionCard(
                              title: "Pemeriksaan Fisik",
                              icon: Icons.monitor_weight_outlined,
                              color: t1Color,
                              children: [
                                Row(
                                  children: [
                                    Expanded(child: CustomInputField(label: "Berat Badan *", controller: _controller.beratBadan, suffix: "kg")),
                                    const SizedBox(width: 12),
                                    Expanded(child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        CustomInputField(label: "LiLA *", controller: _controller.lila, suffix: "cm"),
                                        const Text(" ✓ Normal ≥ 23.5", style: TextStyle(color: Colors.green, fontSize: 11)),
                                      ],
                                    )),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Expanded(child: CustomInputField(label: "TD Sistolik *", controller: _controller.tdSistolik, suffix: "mmHg")),
                                    const SizedBox(width: 12),
                                    Expanded(child: CustomInputField(label: "TD Diastolik *", controller: _controller.tdDiastolik, suffix: "mmHg")),
                                  ],
                                ),
                                const Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(" ✓ Normal : 90/60 - 140/90 mmHg", style: TextStyle(color: Colors.green, fontSize: 11)),
                                ),
                              ],
                            ),

                            // --- 3. LAB & SKRINING AWAL ---
                            _buildSectionCard(
                              title: "Lab & Skrining Awal",
                              icon: Icons.biotech_outlined,
                              color: t1Color,
                              children: [
                                Row(
                                  children: [
                                    Expanded(child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        CustomInputField(label: "Hemoglobin *", controller: _controller.hemoglobin, suffix: "g/dL"),
                                        const Text(" ✓ Normal ≥ 11", style: TextStyle(color: Colors.green, fontSize: 11)),
                                      ],
                                    )),
                                    const SizedBox(width: 12),
                                    Expanded(child: CustomInputField(label: "Tes Gula Darah", controller: _controller.tesGulaDarah, suffix: "mg/dL")),
                                  ],
                                ),
                                EnumSelector(
                                  label: "Protein Urin",
                                  options: const ['Negatif', 'Trace', '+1', '+2', '+3', '+4'],
                                  selectedValue: _controller.proteinUrin,
                                  activeColor: Colors.green,
                                  onChanged: (val) => _controller.proteinUrin = val,
                                ),
                                EnumSelector(
                                  label: "Urin Reduksi",
                                  options: const ['Negatif', '+1', '+2', '+3', '+4'],
                                  selectedValue: _controller.urinReduksi,
                                  activeColor: Colors.green,
                                  onChanged: (val) => _controller.urinReduksi = val,
                                ),
                              ],
                            ),

                            // --- 4. USG TRIMESTER I ---
                            _buildSectionCard(
                              title: "USG Trimester I",
                              icon: Icons.image_search,
                              color: t1Color,
                              children: [
                                _buildInfoBanner("Tujuan USG T1: memastikan lokasi kehamilan, jumlah kantung, dan adanya denyut jantung janin."),
                                const SizedBox(height: 16),
                                EnumSelector(
                                  label: "Jumlah Gestational Sac *",
                                  options: const ['Tunggal', 'Kembar'],
                                  selectedValue: _controller.jumlahGS,
                                  activeColor: t1Color,
                                  onChanged: (val) => _controller.jumlahGS = val,
                                ),
                                Row(
                                  children: [
                                    Expanded(child: CustomInputField(label: "Diameter GS *", controller: _controller.diameterGS, suffix: "mm")),
                                    const SizedBox(width: 12),
                                    Expanded(child: CustomInputField(label: "CRL *", controller: _controller.crl, suffix: "mm")),
                                  ],
                                ),
                                _buildPurpleAgeBox(),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Expanded(
                                      child: EnumSelector(
                                        label: "Pulsasi Jantung *",
                                        options: const ['Tampak', 'Tidak'],
                                        selectedValue: _controller.pulsasiJantung,
                                        activeColor: Colors.green,
                                        onChanged: (val) => _controller.pulsasiJantung = val,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: EnumSelector(
                                        label: "Abnormal?",
                                        options: const ['Tidak', 'Ya'],
                                        selectedValue: _controller.kecurigaanAbnormal,
                                        activeColor: Colors.red,
                                        onChanged: (val) => _controller.kecurigaanAbnormal = val,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),

                            const SizedBox(height: 32),
                            _buildBottomButtons(t1Color),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              // Loading Overlay: Muncul saat controller sedang proses simpan
              if (_controller.isLoading)
                Container(
                  color: Colors.black26,
                  child: const Center(
                    child: CircularProgressIndicator(color: t1Color),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  // --- WIDGET HELPERS --- (Tetap sama namun dioptimalkan pemanggilan controllernya)

  Widget _buildDateField(String label, TextEditingController controller) {
    return TextFormField(
      controller: controller,
      readOnly: true,
      style: const TextStyle(fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        suffixIcon: IconButton(
          icon: const Icon(Icons.calendar_today, color: TrimesterTheme.t1Primary, size: 18),
          onPressed: () => _selectDate(context, controller),
        ),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
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
            style: ElevatedButton.styleFrom(
              backgroundColor: color, 
              padding: const EdgeInsets.symmetric(vertical: 15), 
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))
            ),
            // Tombol disable saat sedang loading
            onPressed: _controller.isLoading ? null : () => _prosesSimpan(color), 
            child: const Text("Simpan", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ),
      ],
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
              Text("Minggu 8 • Sebesar Biji Kopi", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              Text("Jantung berdetak, tangan & kaki mulai terlihat.", style: TextStyle(color: Colors.white70, fontSize: 12)),
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
        _statItem("USIA KEHAMILAN", "8 mgg", "Dari HPHT"),
        _statItem("KUNJUNGAN", "K1 / T1", "Otomatis"),
        _statItem("HPL", "15 Agt 2025", "Naegele"),
      ],
    );
  }

  Widget _statItem(String label, String value, String sub) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.blue.shade100)),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.blue)),
          Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          Text(sub, style: const TextStyle(fontSize: 9, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildInfoBanner(String text) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(10)),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: Colors.blue, size: 20),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 11, color: Colors.blue))),
        ],
      ),
    );
  }

  Widget _buildPurpleAgeBox() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.purple.shade50, borderRadius: BorderRadius.circular(10)),
      child: Column(
        children: [
          const Text("USIA DARI USG (OTOMATIS)", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.purple)),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _ageDetail("Dari GS", "8 mgg 3 hr"),
              Container(width: 1, height: 30, color: Colors.purple.withOpacity(0.2)),
              _ageDetail("Dari CRL", "8 mgg 3 hr"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _ageDetail(String label, String val) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.purple)),
        Text(val, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.purple)),
      ],
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