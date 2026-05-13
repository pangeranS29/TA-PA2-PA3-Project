import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/pemantauan/data/services/lembar_pemantauan_api_service.dart';
import 'package:ta_pa2_pa3_project/features/anak/pemantauan/data/models/lembar_pemantauan_dynamic_model.dart';

class LembarPemantauanScreen extends StatefulWidget {
  final Map<String, dynamic>? anak;
  final String? initialRentangNama;

  const LembarPemantauanScreen({
    super.key,
    this.anak,
    this.initialRentangNama,
  });

  @override
  State<LembarPemantauanScreen> createState() => _LembarPemantauanScreenState();
}

class _LembarPemantauanScreenState extends State<LembarPemantauanScreen>
    {
  final LembarPemantauanApiService _service = LembarPemantauanApiService();

  int? _selectedPeriode = 1;
  final TextEditingController _namaPemeriksaController =
      TextEditingController(text: '-');

  bool _loadingRentang = true;
  bool _loadingKategori = false;
  bool _submitting = false;

  List<RentangUsiaModel> _rentangUsia = const [];
  List<KategoriTandaSakitModel> _kategori = const [];
  int? _selectedRentangId;
  RentangUsiaModel? _selectedRentang;
  final Map<int, bool> _checks = {};
  DateTime _tanggalPeriksa = DateTime.now();

  @override
  void initState() {
    super.initState();
    _loadRentangUsia();
  }

  @override
  void dispose() {
    _service.dispose();
    _namaPemeriksaController.dispose();
    super.dispose();
  }

  Future<void> _loadRentangUsia() async {
    setState(() {
      _loadingRentang = true;
    });

    try {
      final rentang = await _service.getRentangUsia();
      
      // Auto-select rentang usia berdasarkan usia anak
      int? selectedId;
      if (rentang.isNotEmpty) {
        final usiaText = widget.anak?['usia_teks']?.toString().toLowerCase() ?? '';
        selectedId = _determineRentangUsiaByAge(usiaText, rentang);
        
        // Jika tidak bisa determine dari usia, coba dari initial nama
        if (selectedId == null) {
          final initialNama = widget.initialRentangNama?.toLowerCase().trim();
          if (initialNama != null && initialNama.isNotEmpty) {
            for (final item in rentang) {
              if (item.namaRentang.toLowerCase().trim() == initialNama) {
                selectedId = item.id;
                break;
              }
            }
          }
        }
        
        // Fallback ke yang pertama
        if (selectedId == null) {
          selectedId = rentang.first.id;
        }
      }

      if (!mounted) return;
      setState(() {
        _rentangUsia = rentang;
        _selectedRentangId = selectedId;
        _selectedRentang = rentang.isNotEmpty
            ? rentang.firstWhere(
                (item) => item.id == selectedId,
                orElse: () => rentang.first,
              )
            : null;
        _selectedPeriode = 1;
        _loadingRentang = false;
      });

      if (selectedId != null) {
        await _loadKategori(selectedId);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loadingRentang = false;
      });
      _showError('Gagal memuat rentang usia: $e');
    }
  }

  /// Determine rentang usia ID berdasarkan usia anak dalam teks
  int? _determineRentangUsiaByAge(String usiaText, List<RentangUsiaModel> rentangList) {
    if (usiaText.isEmpty) return null;
    
    // Parse usia_teks format: "1 Tahun 3 Bulan", "28 Hari", dll
    int years = 0;
    int months = 0;
    int days = 0;
    
    final matches = RegExp(r'(\d+)\s*(tahun|bulan|hari|minggu)').allMatches(usiaText);
    for (final match in matches) {
      final value = int.tryParse(match.group(1) ?? '') ?? 0;
      final unit = (match.group(2) ?? '').toLowerCase();
      
      if (unit.contains('tahun')) {
        years = value;
      } else if (unit.contains('bulan')) {
        months = value;
      } else if (unit.contains('minggu')) {
        // Convert minggu to days
        days = value * 7;
      } else if (unit.contains('hari')) {
        days += value;
      }
    }
    
    // Calculate total days
    final totalDays = (years * 365) + (months * 30) + days;
    
    // Map to rentang usia based on database definition:
    // 0-28 Hari: <= 28 days
    // 29 Hari - 3 Bulan: 29-90 days
    // 3-6 Bulan: 91-180 days
    // 6-12 Bulan: 181-365 days
    // 12-24 Bulan: 366-730 days
    // 2-6 Tahun: 731+ days
    
    int targetRentangId = -1;
    if (totalDays <= 28) {
      targetRentangId = 1; // 0-28 Hari
    } else if (totalDays <= 90) {
      targetRentangId = 2; // 29 Hari - 3 Bulan
    } else if (totalDays <= 180) {
      targetRentangId = 3; // 3-6 Bulan
    } else if (totalDays <= 365) {
      targetRentangId = 4; // 6-12 Bulan
    } else if (totalDays <= 730) {
      targetRentangId = 5; // 12-24 Bulan
    } else {
      targetRentangId = 6; // 2-6 Tahun
    }
    
    // Verify target exists in rentang list
    for (final rentang in rentangList) {
      if (rentang.id == targetRentangId) {
        return targetRentangId;
      }
    }
    
    return null;
  }

  Future<void> _loadKategori(int rentangUsiaId) async {
    setState(() {
      _loadingKategori = true;
      _kategori = const [];
      _checks.clear();
    });

    try {
      final kategori = await _service.getKategoriByRentangUsia(rentangUsiaId);
      if (!mounted) return;
      setState(() {
        _kategori = kategori;
        for (final item in kategori) {
          _checks[item.id] = false;
        }
        _loadingKategori = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loadingKategori = false;
      });
      _showError('Gagal memuat kategori gejala: $e');
    }
  }


  Future<void> _submit() async {
    final anakRaw = widget.anak?['id'];
    final anakId = anakRaw is int
        ? anakRaw
        : int.tryParse((anakRaw ?? '').toString()) ?? 0;
    final rentangUsiaId = _selectedRentangId ?? 0;
    final periode = _selectedPeriode ?? 0;
    final namaPemeriksa = _namaPemeriksaController.text.trim().isEmpty
      ? '-'
      : _namaPemeriksaController.text.trim();

    if (anakId <= 0) {
      _showError('Data anak tidak valid. Silakan pilih ulang anak.');
      return;
    }
    if (rentangUsiaId <= 0) {
      _showError('Rentang usia wajib dipilih.');
      return;
    }
    if (_selectedRentang == null) {
      _showError('Data rentang usia tidak tersedia.');
      return;
    }
    if (periode <= 0) {
      _showError('Periode pemeriksaan harus dipilih.');
      return;
    }
    if (periode > _selectedRentang!.maxPeriode) {
      _showError(
        'Periode pemeriksaan tidak boleh melebihi ${_selectedRentang!.maxPeriode} ${_selectedRentang!.satuanWaktu}.',
      );
      return;
    }
    if (namaPemeriksa.isEmpty) {
      _showError('Nama pemeriksa wajib diisi.');
      return;
    }
    if (_kategori.isEmpty) {
      _showError('Kategori gejala belum tersedia untuk rentang usia ini.');
      return;
    }

    final detailGejala = _kategori
        .map(
          (item) => {
            'kategori_tanda_sakit_id': item.id,
            'is_terjadi': _checks[item.id] ?? false,
          },
        )
        .toList();

    setState(() {
      _submitting = true;
    });

    try {
      await _service.createLembarPemantauan(
        anakId: anakId,
        rentangUsiaId: rentangUsiaId,
        periodeWaktu: periode,
        tanggalPeriksa: _formatDate(_tanggalPeriksa),
        namaPemeriksa: namaPemeriksa,
        detailGejala: detailGejala,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Lembar pemantauan berhasil disimpan.')),
      );

      // Reset form
      setState(() {
        _selectedPeriode = 1;
        _checks.clear();
        _tanggalPeriksa = DateTime.now();
      });
    } catch (e) {
      _showError('Gagal menyimpan lembar pemantauan: $e');
    } finally {
      if (mounted) {
        setState(() {
          _submitting = false;
        });
      }
    }
  }

  String _formatDate(DateTime date) {
    final y = date.year.toString().padLeft(4, '0');
    final m = date.month.toString().padLeft(2, '0');
    final d = date.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text(
          'Lembar Pemantauan',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        shadowColor: Colors.black12,
        centerTitle: false,
        iconTheme: const IconThemeData(
          color: Colors.black,
        ),
      ),
      body: _buildFormTab(),
    );
  }

  Widget _buildFormTab() {
    return _loadingRentang
        ? const Center(child: CircularProgressIndicator())
        : RefreshIndicator(
            onRefresh: _loadRentangUsia,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildAnakInfoCard(),
                const SizedBox(height: 12),
                _buildFormCard(),
                const SizedBox(height: 16),
                _buildGejalaCard(),
                const SizedBox(height: 16),
                SizedBox(
                  height: 48,
                  child: FilledButton(
                    onPressed: _submitting ? null : _submit,
                    child: _submitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Simpan Pemantauan'),
                  ),
                ),
              ],
            ),
          );
  }

  Widget _buildAnakInfoCard() {
  final nama = (widget.anak?['nama'] ?? 'Anak terpilih').toString();
  final usia =
      (widget.anak?['usia_teks'] ?? 'Usia belum tersedia').toString();

  return Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    ),
    child: Row(
      children: [
        // Avatar
        Container(
          width: 50,
          height: 50,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: Color(0xFFE0F2FE),
          ),
          child: const Icon(
            Icons.sentiment_satisfied_alt,
            color: Color(0xFF0284C7),
            size: 28,
          ),
        ),
        const SizedBox(width: 12),

        // Nama + usia
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                nama,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),

              // Badge usia
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFDBEAFE),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  usia,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF1D4ED8),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

  Widget _buildFormCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          DropdownButtonFormField<int>(
            value: _selectedRentangId,
            decoration: const InputDecoration(
              labelText: 'Rentang Usia',
              border: OutlineInputBorder(),
            ),
            items: _rentangUsia
                .map(
                  (item) => DropdownMenuItem<int>(
                    value: item.id,
                    child: Text(item.namaRentang),
                  ),
                )
                .toList(),
            onChanged: (value) {
              if (value == null || value == _selectedRentangId) return;
              final selectedRentang = _rentangUsia.firstWhere(
                (item) => item.id == value,
                orElse: () => _rentangUsia.first,
              );
              setState(() {
                _selectedRentangId = value;
                _selectedRentang = selectedRentang;
                _selectedPeriode = 1;
              });
              _loadKategori(value);
            },
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<int>(
            value: _selectedPeriode,
            decoration: const InputDecoration(
              labelText: 'Periode Pemeriksaan',
              border: OutlineInputBorder(),
            ),
            items: _buildPeriodeOptions()
                .map(
                  (p) => DropdownMenuItem<int>(
                    value: p,
                    child: Text(_buildPeriodeLabel(p)),
                  ),
                )
                .toList(),
            onChanged: (v) {
              if (v == null) return;
              setState(() => _selectedPeriode = v);
            },
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Text(
              'Pemeriksa: -',
              style: const TextStyle(color: Color(0xFF334155)),
            ),
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const Icon(Icons.calendar_today, size: 20, color: Color(0xFF64748B)),
                const SizedBox(width: 8),
                Text(
                  'Tanggal Periksa: ${_formatDate(_tanggalPeriksa)}',
                  style: const TextStyle(color: Color(0xFF334155)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGejalaCard() {
    if (_loadingKategori) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_kategori.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: const Text(
          'Belum ada kategori gejala untuk rentang usia ini.',
          style: TextStyle(color: Color(0xFF64748B)),
        ),
      );
    }

    final checkedCount = _checks.values.where((v) => v).length;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Checklist Gejala ($checkedCount dipilih)',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 8),
          ..._kategori.map(
            (item) => CheckboxListTile(
              value: _checks[item.id] ?? false,
              dense: true,
              contentPadding: EdgeInsets.zero,
              title: Text(item.gejala),
              subtitle: item.deskripsi.isEmpty ? null : Text(item.deskripsi),
              onChanged: (value) {
                setState(() {
                  _checks[item.id] = value ?? false;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  List<int> _buildPeriodeOptions() {
    final maxPeriode = _selectedRentang?.maxPeriode ?? 1;
    return List<int>.generate(maxPeriode, (index) => index + 1);
  }

  String _buildPeriodeLabel(int periode) {
    final satuan = _selectedRentang?.satuanWaktu.trim().toLowerCase() ?? '';
    if (satuan == 'hari') {
      return 'Hari ke-$periode';
    }
    if (satuan == 'minggu') {
      return 'Minggu ke-$periode';
    }
    if (satuan == 'bulan') {
      return 'Bulan ke-$periode';
    }
    if (satuan == 'tahun') {
      return 'Tahun ke-$periode';
    }
    return 'Periode ke-$periode';
  }
}
