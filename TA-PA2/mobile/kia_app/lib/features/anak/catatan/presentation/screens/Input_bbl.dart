import 'package:flutter/material.dart';

class InputBblScreen extends StatefulWidget {
  final String namaAnak;
  final String? anakId;

  const InputBblScreen({
    Key? key,
    required this.namaAnak,
    this.anakId,
  }) : super(key: key);

  @override
  State<InputBblScreen> createState() => _InputBblScreenState();
}

class _InputBblScreenState extends State<InputBblScreen> {
  final _formKey = GlobalKey<FormState>();
  final _beratController = TextEditingController();
  final _panjangController = TextEditingController();
  final _lingkarKepalController = TextEditingController();
  final _tanggalLahirController = TextEditingController();

  DateTime? _selectedDate;

  // Checkbox pemeriksaan kesehatan
  bool _check0_6jam = false;
  bool _check6_48jam = false;
  bool _checkHari3_7 = false;
  bool _checkHari8_28 = false;

  // Imunisasi & skrining
  bool _imunisasiHB0 = false;
  bool _skriningHipotiroid = false;
  bool _skriningPJB = false;

  @override
  void dispose() {
    _beratController.dispose();
    _panjangController.dispose();
    _lingkarKepalController.dispose();
    _tanggalLahirController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: DateTime(now.year - 1),
      lastDate: now,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF7C3AED),
              onPrimary: Colors.white,
              surface: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
        _tanggalLahirController.text =
            '${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}';
      });
    }
  }

  void _simpan() {
    if (_formKey.currentState!.validate()) {
      // TODO: simpan ke database / BLoC
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Data BBL berhasil disimpan!'),
          backgroundColor: Color(0xFF7C3AED),
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F3FF),
      appBar: AppBar(
        title: Text(
          'Input BBL – ${widget.namaAnak}',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFF7C3AED),
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── Header ilustrasi / banner ───────────────────────────────
              _BannerBBL(),

              const SizedBox(height: 20),

              // ─── Seksi: Data Lahir ────────────────────────────────────────
              _SectionTitle(title: 'Data Lahir', color: const Color(0xFF7C3AED)),
              const SizedBox(height: 12),
              _buildCard(
                children: [
                  _buildDateField(
                    label: 'Tanggal Lahir',
                    controller: _tanggalLahirController,
                    onTap: _pickDate,
                  ),
                  const SizedBox(height: 12),
                  _buildTextField(
                    controller: _beratController,
                    label: 'Berat Badan Lahir (gram)',
                    hint: 'cth: 3200',
                    keyboardType: TextInputType.number,
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Wajib diisi';
                      final n = double.tryParse(v);
                      if (n == null || n <= 0) return 'Masukkan angka yang valid';
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  _buildTextField(
                    controller: _panjangController,
                    label: 'Panjang Badan Lahir (cm)',
                    hint: 'cth: 50',
                    keyboardType: TextInputType.number,
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Wajib diisi';
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  _buildTextField(
                    controller: _lingkarKepalController,
                    label: 'Lingkar Kepala (cm)',
                    hint: 'cth: 34',
                    keyboardType: TextInputType.number,
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Wajib diisi';
                      return null;
                    },
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // ─── Seksi: Imunisasi & Skrining ─────────────────────────────
              _SectionTitle(
                  title: 'Imunisasi & Skrining', color: const Color(0xFFD97706)),
              const SizedBox(height: 12),
              _buildCard(
                children: [
                  _buildCheckTile(
                    value: _imunisasiHB0,
                    label: 'Imunisasi Hepatitis B (HB0)',
                    subtitle: 'Sebelum 24 jam setelah lahir',
                    color: const Color(0xFFD97706),
                    onChanged: (v) => setState(() => _imunisasiHB0 = v!),
                  ),
                  const Divider(height: 1),
                  _buildCheckTile(
                    value: _skriningHipotiroid,
                    label: 'Skrining Hipotiroid Kongenital (SHK)',
                    subtitle: '48–72 jam setelah lahir',
                    color: const Color(0xFFD97706),
                    onChanged: (v) => setState(() => _skriningHipotiroid = v!),
                  ),
                  const Divider(height: 1),
                  _buildCheckTile(
                    value: _skriningPJB,
                    label: 'Skrining Penyakit Jantung Bawaan (PJB) Kritis',
                    subtitle: '24–48 jam setelah lahir',
                    color: const Color(0xFFD97706),
                    onChanged: (v) => setState(() => _skriningPJB = v!),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // ─── Seksi: Pemeriksaan Kesehatan ─────────────────────────────
              _SectionTitle(
                  title: 'Pemeriksaan Kesehatan di Puskesmas',
                  color: const Color(0xFF059669)),
              const SizedBox(height: 4),
              const Text(
                'Beri tanda ✓ jika si kecil sudah mendapat pemeriksaan oleh tenaga kesehatan:',
                style: TextStyle(fontSize: 12, color: Colors.black54),
              ),
              const SizedBox(height: 12),
              _buildCard(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: _buildCheckBox(
                          value: _check0_6jam,
                          label: '0–6 jam\nsetelah lahir',
                          onChanged: (v) => setState(() => _check0_6jam = v!),
                        ),
                      ),
                      Expanded(
                        child: _buildCheckBox(
                          value: _check6_48jam,
                          label: '6–48 jam\nsetelah lahir',
                          onChanged: (v) => setState(() => _check6_48jam = v!),
                        ),
                      ),
                      Expanded(
                        child: _buildCheckBox(
                          value: _checkHari3_7,
                          label: 'Hari 3–7\nsetelah lahir',
                          onChanged: (v) => setState(() => _checkHari3_7 = v!),
                        ),
                      ),
                      Expanded(
                        child: _buildCheckBox(
                          value: _checkHari8_28,
                          label: 'Hari 8–28\nsetelah lahir',
                          onChanged: (v) => setState(() => _checkHari8_28 = v!),
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // ─── Info card ────────────────────────────────────────────────
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFBBF24)),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.info_outline,
                        size: 18, color: Color(0xFFD97706)),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Tanyakan kepada bidan/dokter/perawat untuk penjelasan lebih lanjut terkait perawatan bayi baru lahir.',
                        style:
                            TextStyle(fontSize: 12, color: Color(0xFF92400E)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // ─── Tombol Simpan ────────────────────────────────────────────
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: _simpan,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7C3AED),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 2,
                  ),
                  icon: const Icon(Icons.save_alt_rounded),
                  label: const Text(
                    'Simpan Data BBL',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  // ─────────────────────────── Helper widgets ────────────────────────────────

  Widget _buildCard({required List<Widget> children}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    String? hint,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        filled: true,
        fillColor: const Color(0xFFF9F7FF),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFDDD6FE)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFDDD6FE)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              const BorderSide(color: Color(0xFF7C3AED), width: 1.5),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        labelStyle: const TextStyle(fontSize: 13),
      ),
    );
  }

  Widget _buildDateField({
    required String label,
    required TextEditingController controller,
    required VoidCallback onTap,
  }) {
    return TextFormField(
      controller: controller,
      readOnly: true,
      onTap: onTap,
      validator: (v) =>
          (v == null || v.isEmpty) ? 'Pilih tanggal lahir' : null,
      decoration: InputDecoration(
        labelText: label,
        hintText: 'dd/mm/yyyy',
        filled: true,
        fillColor: const Color(0xFFF9F7FF),
        suffixIcon:
            const Icon(Icons.calendar_today, size: 18, color: Color(0xFF7C3AED)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFDDD6FE)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFDDD6FE)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              const BorderSide(color: Color(0xFF7C3AED), width: 1.5),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        labelStyle: const TextStyle(fontSize: 13),
      ),
    );
  }

  Widget _buildCheckTile({
    required bool value,
    required String label,
    required String subtitle,
    required Color color,
    required ValueChanged<bool?> onChanged,
  }) {
    return CheckboxListTile(
      value: value,
      onChanged: onChanged,
      activeColor: color,
      title: Text(label,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle,
          style: const TextStyle(fontSize: 11, color: Colors.black54)),
      controlAffinity: ListTileControlAffinity.leading,
      contentPadding: EdgeInsets.zero,
      dense: true,
    );
  }

  Widget _buildCheckBox({
    required bool value,
    required String label,
    required ValueChanged<bool?> onChanged,
  }) {
    return Column(
      children: [
        Checkbox(
          value: value,
          onChanged: onChanged,
          activeColor: const Color(0xFF059669),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        ),
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 10, color: Colors.black87),
        ),
        const SizedBox(height: 4),
      ],
    );
  }
}

// ─────────────────────────── Sub-widgets ──────────────────────────────────────

class _BannerBBL extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF7C3AED), Color(0xFFA78BFA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Bayi Baru Lahir',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  '(0 – 28 hari)',
                  style: TextStyle(
                    color: Color(0xFFEDE9FE),
                    fontSize: 13,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Catat data kesehatan si kecil\nsejak pertama lahir.',
                  style: TextStyle(
                    color: Color(0xFFEDE9FE),
                    fontSize: 11,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.child_care, size: 60, color: Color(0xFFEDE9FE)),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final Color color;

  const _SectionTitle({required this.title, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 18,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}