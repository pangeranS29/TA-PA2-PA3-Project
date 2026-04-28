import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/kehamilan_api_service.dart';

class ChecklistPemantauanIbuNifasScreen extends StatefulWidget {
  final List<int> filledDays;

  const ChecklistPemantauanIbuNifasScreen({
    super.key,
    this.filledDays = const [],
  });
  
  @override
  State<ChecklistPemantauanIbuNifasScreen> createState() =>
      _ChecklistPemantauanIbuNifasScreenState();
}

class _ChecklistPemantauanIbuNifasScreenState
    extends State<ChecklistPemantauanIbuNifasScreen> {
  final _kehamilanService = KehamilanApiService();

  int? selectedHariNifas;
  bool isLoading = false;

  // NIFAS A
  bool pemeriksaanNifas = false;
  bool konsumsiVitaminA = false;
  bool pemenuhanGizi = false;
  bool demamLebih38 = false;
  bool sakitKepala = false;
  bool pandanganKabur = false;
  bool nyeriUluHati = false;
  bool masalahKesehatanJiwa = false;

  // NIFAS B
  bool jantungBerdebar = false;
  bool cairanJalanLahir = false;
  bool napasPendek = false;
  bool payudaraBermasalah = false;
  bool gangguanBak = false;
  bool kelaminBermasalah = false;
  bool darahNifasBerbau = false;
  bool pendarahanBerat = false;
  bool keputihan = false;

  Future<void> submitChecklist() async {
    if (isLoading) return;

    if (selectedHariNifas == null) {
      _showError("Pilih hari nifas terlebih dahulu");
      return;
    }

    if (widget.filledDays.contains(selectedHariNifas)) {
        _showError("Hari nifas ke-$selectedHariNifas sudah diisi. Checklist hanya bisa diisi sekali sehari.");
    return;
    }

    setState(() => isLoading = true);

    try {
      final token = AuthSession.token;

      if (token == null || token.isEmpty) {
        _showError("Token tidak ditemukan, silakan login ulang");
        return;
      }

      final kehamilan = await _kehamilanService.getKehamilanAktif();
      final kehamilanId = kehamilan.id;

      final response = await http.post(
        Uri.parse(
          "http://localhost:8080/modul-ibu/checklist-pemantauan-ibu-nifas",
        ),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({
          "kehamilan_id": kehamilanId,
          "hari_nifas": selectedHariNifas,

          "pemeriksaan_nifas": pemeriksaanNifas,
          "konsumsi_vitamin_a": konsumsiVitaminA,
          "pemenuhan_gizi": pemenuhanGizi,
          "demam_lebih_38": demamLebih38,
          "sakit_kepala": sakitKepala,
          "pandangan_kabur": pandanganKabur,
          "nyeri_ulu_hati": nyeriUluHati,
          "masalah_kesehatan_jiwa": masalahKesehatanJiwa,

          "jantung_berdebar": jantungBerdebar,
          "cairan_jalan_lahir": cairanJalanLahir,
          "napas_pendek": napasPendek,
          "payudara_bermasalah": payudaraBermasalah,
          "gangguan_bak": gangguanBak,
          "kelamin_bermasalah": kelaminBermasalah,
          "darah_nifas_berbau": darahNifasBerbau,
          "pendarahan_berat": pendarahanBerat,
          "keputihan": keputihan,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (!mounted) return;

        await _showSuccessDialog(
          data["message"]?.toString() ??
              "Checklist pemantauan ibu nifas berhasil disimpan",
        );

        if (!mounted) return;
        Navigator.pop(context, true);
      } else {
        _showError(data["message"]?.toString() ?? "Gagal menyimpan checklist");
      }
    } catch (e) {
      _showError("Terjadi kesalahan: $e");
    } finally {
      if (mounted) {
        setState(() => isLoading = false);
      }
    }
  }

  void _resetChecklist() {
    pemeriksaanNifas = false;
    konsumsiVitaminA = false;
    pemenuhanGizi = false;
    demamLebih38 = false;
    sakitKepala = false;
    pandanganKabur = false;
    nyeriUluHati = false;
    masalahKesehatanJiwa = false;

    jantungBerdebar = false;
    cairanJalanLahir = false;
    napasPendek = false;
    payudaraBermasalah = false;
    gangguanBak = false;
    kelaminBermasalah = false;
    darahNifasBerbau = false;
    pendarahanBerat = false;
    keputihan = false;
  }

  void _showError(String message) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red.shade600,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<void> _showSuccessDialog(String message) {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
          ),
          title: Row(
            children: [
              CircleAvatar(
                backgroundColor: Colors.blue.shade50,
                child: Icon(Icons.check_rounded, color: Colors.blue.shade700),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  "Berhasil Disimpan",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          content: Text(
            "Checklist hari nifas ke-${selectedHariNifas ?? '-'} berhasil disimpan.",
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                "Kembali ke Nifas",
                style: TextStyle(
                  color: Colors.blue.shade700,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  int get _dangerCount {
    return [
      demamLebih38,
      sakitKepala,
      pandanganKabur,
      nyeriUluHati,
      masalahKesehatanJiwa,
      jantungBerdebar,
      cairanJalanLahir,
      napasPendek,
      payudaraBermasalah,
      gangguanBak,
      kelaminBermasalah,
      darahNifasBerbau,
      pendarahanBerat,
      keputihan,
    ].where((value) => value).length;
  }

  Widget _headerCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue.shade800, Colors.blue.shade400],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.18),
            blurRadius: 14,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.health_and_safety_outlined,
              color: Colors.white, size: 34),
          const SizedBox(height: 14),
          const Text(
            "Checklist Harian Masa Nifas",
            style: TextStyle(
              color: Colors.white,
              fontSize: 21,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            selectedHariNifas == null
                ? "Pilih hari nifas terlebih dahulu, lalu isi checklist pemantauan."
                : "Hari nifas ke-$selectedHariNifas. Isi checklist sesuai kondisi hari ini.",
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 13,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

Widget _daySelector() {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(22),
      border: Border.all(color: Colors.blue.shade50),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.035),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Pilih Hari Nifas",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.blue.shade900,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          "Ibu hanya dapat mengisi checklist satu kali setiap hari selama 42 hari masa nifas.",
          style: TextStyle(fontSize: 12, color: Colors.black54),
        ),
        const SizedBox(height: 14),
        DropdownButtonFormField<int>(
          isExpanded: true,
          value: selectedHariNifas,
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.blue.shade50,
            hintText: "Pilih hari nifas",
            prefixIcon: Icon(
              Icons.calendar_month_outlined,
              color: Colors.blue.shade700,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
          ),
          items: List.generate(42, (index) {
            final day = index + 1;
            final isFilled = widget.filledDays.contains(day);

            return DropdownMenuItem<int>(
              value: day,
              enabled: !isFilled,
              child: Text(
                isFilled
                    ? "Hari nifas ke-$day - Sudah diisi"
                    : "Hari nifas ke-$day",
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: isFilled ? Colors.grey : Colors.black87,
                ),
              ),
            );
          }),
          onChanged: isLoading
              ? null
              : (value) {
                  if (value == null) return;

                  if (widget.filledDays.contains(value)) {
                    _showError(
                      "Hari nifas ke-$value sudah diisi. Checklist hanya bisa diisi sekali sehari.",
                    );
                    return;
                  }

                  setState(() {
                    selectedHariNifas = value;
                    _resetChecklist();
                  });
                },
        ),
      ],
    ),
  );
}

  Widget _sectionTitle(String title, String subtitle) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 18, bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.blue.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.blue.shade800,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(fontSize: 12, color: Colors.blue.shade700),
          ),
        ],
      ),
    );
  }

  Widget _checkItem({
    required String title,
    required bool value,
    required ValueChanged<bool?> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: value ? Colors.blue.shade200 : Colors.grey.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.035),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: CheckboxListTile(
        value: value,
        onChanged: isLoading ? null : onChanged,
        activeColor: Colors.blue.shade700,
        checkboxShape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(5),
        ),
        title: Text(
          title,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        controlAffinity: ListTileControlAffinity.leading,
      ),
    );
  }

  Widget _dangerNotice() {
    if (_dangerCount == 0) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.only(top: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Row(
        children: [
          Icon(Icons.warning_amber_rounded, color: Colors.orange.shade700),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              "$_dangerCount tanda atau keluhan tercentang. Jika berat atau memburuk, segera hubungi tenaga kesehatan.",
              style: TextStyle(
                fontSize: 12,
                color: Colors.orange.shade900,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _emptyChecklistHint() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.blue.shade50),
      ),
      child: Column(
        children: [
          Icon(Icons.touch_app_outlined, color: Colors.blue.shade600, size: 36),
          const SizedBox(height: 10),
          Text(
            "Pilih hari nifas terlebih dahulu",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.blue.shade900,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            "Setelah hari dipilih, checklist Nifas A dan Nifas B akan tampil.",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: Colors.black54),
          ),
        ],
      ),
    );
  }

  Widget _checklistForm() {
    return Column(
      children: [
        _dangerNotice(),
        _sectionTitle(
          "Nifas A",
          "Perawatan dasar dan gejala awal yang perlu dipantau.",
        ),
        _checkItem(
          title: "Pemeriksaan nifas",
          value: pemeriksaanNifas,
          onChanged: (v) => setState(() => pemeriksaanNifas = v ?? false),
        ),
        _checkItem(
          title: "Konsumsi vitamin A",
          value: konsumsiVitaminA,
          onChanged: (v) => setState(() => konsumsiVitaminA = v ?? false),
        ),
        _checkItem(
          title: "Pemenuhan gizi sesuai kebutuhan",
          value: pemenuhanGizi,
          onChanged: (v) => setState(() => pemenuhanGizi = v ?? false),
        ),
        _checkItem(
          title: "Demam > 38°C",
          value: demamLebih38,
          onChanged: (v) => setState(() => demamLebih38 = v ?? false),
        ),
        _checkItem(
          title: "Sakit kepala",
          value: sakitKepala,
          onChanged: (v) => setState(() => sakitKepala = v ?? false),
        ),
        _checkItem(
          title: "Pandangan kabur",
          value: pandanganKabur,
          onChanged: (v) => setState(() => pandanganKabur = v ?? false),
        ),
        _checkItem(
          title: "Nyeri ulu hati",
          value: nyeriUluHati,
          onChanged: (v) => setState(() => nyeriUluHati = v ?? false),
        ),
        _checkItem(
          title: "Masalah kesehatan jiwa",
          value: masalahKesehatanJiwa,
          onChanged: (v) =>
              setState(() => masalahKesehatanJiwa = v ?? false),
        ),
        _sectionTitle(
          "Nifas B",
          "Keluhan lanjutan yang perlu diperhatikan selama masa nifas.",
        ),
        _checkItem(
          title: "Jantung berdebar",
          value: jantungBerdebar,
          onChanged: (v) => setState(() => jantungBerdebar = v ?? false),
        ),
        _checkItem(
          title: "Keluar cairan dari jalan lahir",
          value: cairanJalanLahir,
          onChanged: (v) => setState(() => cairanJalanLahir = v ?? false),
        ),
        _checkItem(
          title: "Napas pendek / terengah-engah",
          value: napasPendek,
          onChanged: (v) => setState(() => napasPendek = v ?? false),
        ),
        _checkItem(
          title: "Payudara bengkak / bermasalah",
          value: payudaraBermasalah,
          onChanged: (v) =>
              setState(() => payudaraBermasalah = v ?? false),
        ),
        _checkItem(
          title: "Gangguan BAK",
          value: gangguanBak,
          onChanged: (v) => setState(() => gangguanBak = v ?? false),
        ),
        _checkItem(
          title: "Area kelamin bengkak / nyeri / luka",
          value: kelaminBermasalah,
          onChanged: (v) =>
              setState(() => kelaminBermasalah = v ?? false),
        ),
        _checkItem(
          title: "Darah nifas berbau",
          value: darahNifasBerbau,
          onChanged: (v) => setState(() => darahNifasBerbau = v ?? false),
        ),
        _checkItem(
          title: "Pendarahan berat",
          value: pendarahanBerat,
          onChanged: (v) => setState(() => pendarahanBerat = v ?? false),
        ),
        _checkItem(
          title: "Keputihan",
          value: keputihan,
          onChanged: (v) => setState(() => keputihan = v ?? false),
        ),
        const SizedBox(height: 22),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton.icon(
            onPressed: isLoading ? null : submitChecklist,
            icon: isLoading
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Icon(Icons.save_outlined),
            label: Text(isLoading ? "Menyimpan..." : "Simpan Checklist"),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue.shade700,
              foregroundColor: Colors.white,
              disabledBackgroundColor: Colors.blue.shade200,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              textStyle: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.blue.shade700,
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text("Pemantauan Ibu Nifas"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 28),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _headerCard(),
            const SizedBox(height: 16),
            _daySelector(),
            selectedHariNifas == null
                ? _emptyChecklistHint()
                : _checklistForm(),
          ],
        ),
      ),
    );
  }
}