import 'package:flutter/material.dart';
import '../../data/models/bbl_model.dart';
import '../../data/services/bbl_api_service.dart';

// ── Palette sesuai tema aplikasi ──
const _kPrimary    = Color(0xFF185FA5);
const _kPrimaryBg  = Color(0xFFE8F1FB);

class InputBblScreen extends StatefulWidget {
  final String namaAnak;
  final String usiaTeks;
  final String? anakId;

  const InputBblScreen({
    Key? key,
    required this.namaAnak,
    required this.usiaTeks,
    this.anakId,
  }) : super(key: key);

  @override
  State<InputBblScreen> createState() => _InputBblScreenState();
}

class _BblCheckItem {
  final String label;
  bool value;
  bool locked;
  DateTime? tanggalSubmit;

  _BblCheckItem({
    required this.label,
    required this.value,
    required this.locked,
    this.tanggalSubmit,
  });
}

class _InputBblScreenState extends State<InputBblScreen> {
  late List<_BblCheckItem> _checkItems;
  final _formKey = GlobalKey<FormState>();
  final _beratController = TextEditingController();
  final _panjangController = TextEditingController();
  final _lingkarKepalController = TextEditingController();
  final _tanggalLahirController = TextEditingController();

  DateTime? _selectedDate;

  bool _isLoading = false;
  late BblApiService _apiService;

  // Checkbox pemeriksaan kesehatan
  bool _check0_6jam = false;
  bool _check6_48jam = false;
  bool _checkHari3_7 = false;
  bool _checkHari8_28 = false;

  // Lock status (tidak bisa di-uncheck jika sudah true dari DB)
  bool _locked0_6jam = false;
  bool _locked6_48jam = false;
  bool _lockedHari3_7 = false;
  bool _lockedHari8_28 = false;

  // Skrining
  bool _imunisasiHB0 = false;
  bool _skriningHipotiroid = false;
  bool _skriningPJB = false;



  @override
  void initState() {
    _checkItems = [
      _BblCheckItem(label: '0–6 jam', value: false, locked: false, tanggalSubmit: null),
      _BblCheckItem(label: '6–48 jam', value: false, locked: false, tanggalSubmit: null),
      _BblCheckItem(label: 'Hari 3–7', value: false, locked: false, tanggalSubmit: null),
      _BblCheckItem(label: 'Hari 8–28', value: false, locked: false, tanggalSubmit: null),
    ];
    super.initState();
    _apiService = BblApiService();
    _loadData();
  }

  Future<void> _loadData() async {
    if (widget.anakId == null) return;
    final anakId = int.tryParse(widget.anakId!);
    if (anakId == null) return;

    setState(() => _isLoading = true);
    try {
      final bbl = await _apiService.getByAnakId(anakId);
      if (bbl != null) {
        setState(() {
          _checkItems[0].value = bbl.jam06;
          _checkItems[0].locked = bbl.jam06;
          _checkItems[0].tanggalSubmit = bbl.tanggalSubmitJam06;

          _checkItems[1].value = bbl.jam648;
          _checkItems[1].locked = bbl.jam648;
          _checkItems[1].tanggalSubmit = bbl.tanggalSubmitJam648;

          _checkItems[2].value = bbl.hari37;
          _checkItems[2].locked = bbl.hari37;
          _checkItems[2].tanggalSubmit = bbl.tanggalSubmitHari37;

          _checkItems[3].value = bbl.hari828;
          _checkItems[3].locked = bbl.hari828;
          _checkItems[3].tanggalSubmit = bbl.tanggalSubmitHari828;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal memuat data BBL: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _apiService.dispose();
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
              primary: _kPrimary,
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

  Future<void> _simpan() async {
    if (widget.anakId == null) return;
    final anakId = int.tryParse(widget.anakId!);
    if (anakId == null) return;

    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      try {
        final model = BblModel(
          id: 0,
          anakId: anakId,
          jam06: _checkItems[0].value,
          tanggalSubmitJam06: _checkItems[0].tanggalSubmit,
          jam648: _checkItems[1].value,
          tanggalSubmitJam648: _checkItems[1].tanggalSubmit,
          hari37: _checkItems[2].value,
          tanggalSubmitHari37: _checkItems[2].tanggalSubmit,
          hari828: _checkItems[3].value,
          tanggalSubmitHari828: _checkItems[3].tanggalSubmit,
        );
        
        await _apiService.upsert(anakId, model);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Data BBL berhasil disimpan!'),
              backgroundColor: _kPrimary,
            ),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Gagal menyimpan data BBL: $e'), backgroundColor: Colors.red),
          );
        }
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Color(0xFF172033),
            size: 20,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Berat Badan Lahir (BBL)',
          style: TextStyle(
            color: Color(0xFF172033),
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // // ─── Header ilustrasi / banner ───────────────────────────────
              // _BannerBBL(),

              // const SizedBox(height: 20),

              // // ─── Seksi: Data Lahir ────────────────────────────────────────
              // _SectionTitle(title: 'Data Lahir', color: const Color(0xFF7C3AED)),
              // const SizedBox(height: 12),
              // _buildCard(
              //   children: [
              //     _buildDateField(
              //       label: 'Tanggal Lahir',
              //       controller: _tanggalLahirController,
              //       onTap: _pickDate,
              //     ),
              //     const SizedBox(height: 12),
              //     _buildTextField(
              //       controller: _beratController,
              //       label: 'Berat Badan Lahir (gram)',
              //       hint: 'cth: 3200',
              //       keyboardType: TextInputType.number,
              //       validator: (v) {
              //         if (v == null || v.isEmpty) return 'Wajib diisi';
              //         final n = double.tryParse(v);
              //         if (n == null || n <= 0) return 'Masukkan angka yang valid';
              //         return null;
              //       },
              //     ),
              //     const SizedBox(height: 12),
              //     _buildTextField(
              //       controller: _panjangController,
              //       label: 'Panjang Badan Lahir (cm)',
              //       hint: 'cth: 50',
              //       keyboardType: TextInputType.number,
              //       validator: (v) {
              //         if (v == null || v.isEmpty) return 'Wajib diisi';
              //         return null;
              //       },
              //     ),
              //     const SizedBox(height: 12),
              //     _buildTextField(
              //       controller: _lingkarKepalController,
              //       label: 'Lingkar Kepala (cm)',
              //       hint: 'cth: 34',
              //       keyboardType: TextInputType.number,
              //       validator: (v) {
              //         if (v == null || v.isEmpty) return 'Wajib diisi';
              //         return null;
              //       },
              //     ),
              //   ],
              // ),

              // const SizedBox(height: 20),

              // // ─── Seksi: Imunisasi & Skrining ─────────────────────────────
              // _SectionTitle(
              //     title: 'Imunisasi & Skrining', color: const Color(0xFFD97706)),
              // const SizedBox(height: 12),
              // _buildCard(
              //   children: [
              //     _buildCheckTile(
              //       value: _imunisasiHB0,
              //       label: 'Imunisasi Hepatitis B (HB0)',
              //       subtitle: 'Sebelum 24 jam setelah lahir',
              //       color: const Color(0xFFD97706),
              //       onChanged: (v) => setState(() => _imunisasiHB0 = v!),
              //     ),
              //     const Divider(height: 1),
              //     _buildCheckTile(
              //       value: _skriningHipotiroid,
              //       label: 'Skrining Hipotiroid Kongenital (SHK)',
              //       subtitle: '48–72 jam setelah lahir',
              //       color: const Color(0xFFD97706),
              //       onChanged: (v) => setState(() => _skriningHipotiroid = v!),
              //     ),
              //     const Divider(height: 1),
              //     _buildCheckTile(
              //       value: _skriningPJB,
              //       label: 'Skrining Penyakit Jantung Bawaan (PJB) Kritis',
              //       subtitle: '24–48 jam setelah lahir',
              //       color: const Color(0xFFD97706),
              //       onChanged: (v) => setState(() => _skriningPJB = v!),
              //     ),
              //   ],
              // ),


              // ─── Card Profil Anak ─────────────────────────────
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: const BoxDecoration(
                        color: Color(0xFFD7ECFF),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.person_outline,
                        color: Color(0xFF185FA5),
                        size: 34,
                      ),
                    ),

                    const SizedBox(width: 16),

                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.namaAnak,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1E293B),
                            ),
                          ),

                          const SizedBox(height: 8),

                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD7ECFF),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              'Usia: ${widget.usiaTeks}',
                              style: const TextStyle(
                                color: Color(0xFF185FA5),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              const SizedBox(height: 20),

              const SizedBox(height: 20),

              // ─── Seksi: Pemeriksaan Kesehatan ─────────────────────────────
              _SectionTitle(
              title: 'Pemeriksaan Kesehatan di Puskesmas',
              color: _kPrimary,
            ),
            const SizedBox(height: 4),
              const Text(
                'Beri tanda ✓ jika si kecil sudah mendapat pemeriksaan oleh tenaga kesehatan:',
                style: TextStyle(fontSize: 12, color: Colors.black54),
              ),
              const SizedBox(height: 12),
              _buildCard(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xFFE5E7EB)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        
                        // HEADER TABLE (ABSENSI STYLE)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          decoration: const BoxDecoration(
                            color: Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(12),
                              topRight: Radius.circular(12),
                            ),
                          ),
                          child: const Row(
                            children: [
                              SizedBox(width: 40, child: Text('No')),
                              Expanded(flex: 3, child: Text('Rentang Usia')),
                              Expanded(flex: 4, child: Text('Tanggal Submit')),
                              SizedBox(width: 90, child: Center(child: Text('Checklist Ibu'))),
                              SizedBox(width: 110, child: Center(child: Text('Verifikasi Kader'))),
                            ],
                          ),
                        ),

                        const Divider(height: 1),

                        // BODY TABLE (1 ROW DATA)
                        Column(
                          children: List.generate(_checkItems.length, (index) {
                            final item = _checkItems[index];

                            return Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              child: Row(
                                children: [

                                  // NO
                                  SizedBox(
                                    width: 40,
                                    child: Text('${index + 1}', style: const TextStyle(fontSize: 13)),
                                  ),

                                  // RENTANG USIA
                                  Expanded(
                                    flex: 3,
                                    child: Text(item.label, style: const TextStyle(fontSize: 13)),
                                  ),

                                  // TANGGAL SUBMIT (AUTO)
                                  Expanded(
                                    flex: 4,
                                    child: Text(
                                      item.value 
                                          ? (item.tanggalSubmit != null 
                                              ? '${item.tanggalSubmit!.day.toString().padLeft(2, '0')}/${item.tanggalSubmit!.month.toString().padLeft(2, '0')}/${item.tanggalSubmit!.year}' 
                                              : '-') 
                                          : '-',
                                      style: const TextStyle(fontSize: 13),
                                    ),
                                  ),

                                  // CHECKLIST IBU (checkbox dinamis)
                                  SizedBox(
                                    width: 90,
                                    child: Center(
                                      child: Checkbox(
                                        value: item.value,
                                        onChanged: item.locked
                                            ? null
                                            : (val) {
                                                setState(() {
                                                  item.value = val ?? false;
                                                  if (val == true) {
                                                    item.tanggalSubmit ??= DateTime.now();
                                                  } else {
                                                    item.tanggalSubmit = null;
                                                  }
                                                });
                                              },
                                      ),
                                    ),
                                  ),

                                  // VERIFIKASI KADER (placeholder dulu)
                                  SizedBox(
                                    width: 110,
                                    child: Center(
                                      child: Icon(
                                        Icons.hourglass_empty,
                                        size: 18,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
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
                  onPressed: _isLoading ? null : _simpan,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _kPrimary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 2,
                  ),
                  icon: _isLoading 
                      ? const SizedBox.shrink() 
                      : const Icon(Icons.save_alt_rounded),
                  label: _isLoading
                      ? const SizedBox(
                          width: 20, height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text(
                          'Simpan Data BBL',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
        fillColor: _kPrimaryBg,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFBFDBFE)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFBFDBFE)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              const BorderSide(color: _kPrimary, width: 1.5),
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
            const Icon(Icons.calendar_today, size: 18, color: _kPrimary),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFBFDBFE)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xFFBFDBFE)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide:
              const BorderSide(color: _kPrimary, width: 1.5),
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
    required ValueChanged<bool?>? onChanged,
  }) {
    return Column(
      children: [
        Checkbox(
          value: value,
          onChanged: onChanged,
          activeColor: _kPrimary,
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
                    color: Color(0xFFDBEAFE),
                    fontSize: 13,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Catat data kesehatan si kecil\nsejak pertama lahir.',
                  style: TextStyle(
                    color: Color(0xFFDBEAFE),
                    fontSize: 11,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.child_care, size: 60, color: Color(0xFFDBEAFE)),
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