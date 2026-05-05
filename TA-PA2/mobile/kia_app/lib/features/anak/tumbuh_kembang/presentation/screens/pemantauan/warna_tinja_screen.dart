import 'package:flutter/material.dart';

class WarnaTinjaScreen extends StatefulWidget {
  const WarnaTinjaScreen({Key? key}) : super(key: key);

  @override
  State<WarnaTinjaScreen> createState() => _WarnaTinjaScreenState();
}

class _WarnaTinjaScreenState extends State<WarnaTinjaScreen> {
  final Map<String, String?> _inputWarna = {
    '2 Minggu': null,
    '1 Bulan': null,
    '2-4 Bulan': null,
  };

  void _simpan() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Data warna tinja berhasil disimpan!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cek Warna Tinja', style: TextStyle(color: Colors.black87)),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.orange.shade200),
              ),
              child: const Text(
                'Periksa warna tinja bayi setiap hari hingga 4 bulan. Jika warna pucat mendekati nomor 1-3 (kuning pucat/putih), segera bawa ke dokter karena risiko Atresia Bilier.', // Mengacu pada buku KIA
                style: TextStyle(color: Colors.deepOrange, fontSize: 13),
              ),
            ),
            const SizedBox(height: 24),
            ..._inputWarna.keys.map((periode) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: DropdownButtonFormField<String>(
                  decoration: InputDecoration(
                    labelText: 'Usia $periode',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  items: List.generate(6, (index) => (index + 1).toString())
                      .map((val) => DropdownMenuItem(value: val, child: Text('Warna Nomor $val')))
                      .toList(),
                  onChanged: (val) => setState(() => _inputWarna[periode] = val),
                ),
              );
            }).toList(),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _simpan,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEA580C),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Simpan Data', style: TextStyle(fontSize: 16, color: Colors.white)),
              ),
            )
          ],
        ),
      ),
    );
  }
}