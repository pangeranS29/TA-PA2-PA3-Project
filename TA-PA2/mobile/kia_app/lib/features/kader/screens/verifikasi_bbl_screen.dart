import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:ta_pa2_pa3_project/features/kader/services/bbl_kader_api_service.dart';
import 'package:ta_pa2_pa3_project/features/anak/catatan/data/models/bbl_model.dart';
import 'package:ta_pa2_pa3_project/core/services/auth_session.dart';

class VerifikasiBblScreen extends StatefulWidget {
  const VerifikasiBblScreen({super.key});

  @override
  State<VerifikasiBblScreen> createState() => _VerifikasiBblScreenState();
}

class _VerifikasiBblScreenState extends State<VerifikasiBblScreen> {
  final BblKaderApiService _apiService = BblKaderApiService();
  List<BblModel> _bblList = [];
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  @override
  void dispose() {
    _apiService.dispose();
    super.dispose();
  }

  Future<void> _fetchData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final data = await _apiService.getAllBbl();
      setState(() {
        _bblList = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _verify(BblModel item) async {
    // Sebagai fallback jika Kader ID tidak bisa di ekstrak, berikan default value 1 (karena kita bypass di backend)
    int kaderId = 1; 

    try {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );

      await _apiService.verifyBbl(item.anakId, kaderId);
      
      if (!mounted) return;
      Navigator.pop(context); // close loading

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Berhasil memverifikasi data BBL'),
          backgroundColor: Colors.green,
        ),
      );
      
      _fetchData();
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context); // close loading
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Gagal verifikasi: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text('Verifikasi Berat Badan Lahir', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 1,
        centerTitle: false,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage.isNotEmpty
              ? Center(child: Text(_errorMessage, style: const TextStyle(color: Colors.red)))
              : _bblList.isEmpty
                  ? const Center(child: Text('Belum ada data BBL yang diajukan.'))
                  : RefreshIndicator(
                      onRefresh: _fetchData,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _bblList.length,
                        itemBuilder: (context, index) {
                          final item = _bblList[index];
                          final isVerified = item.isVerified;

                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: BorderSide(color: Colors.grey.shade300)
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          item.namaAnak != null && item.namaAnak!.isNotEmpty 
                                            ? item.namaAnak! 
                                            : 'Anak (Data tidak lengkap)',
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: isVerified ? Colors.green.shade50 : Colors.orange.shade50,
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: isVerified ? Colors.green.shade200 : Colors.orange.shade200)
                                        ),
                                        child: Text(
                                          isVerified ? 'Terverifikasi' : 'Menunggu Verifikasi',
                                          style: TextStyle(
                                            color: isVerified ? Colors.green.shade800 : Colors.orange.shade800,
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.grey.shade50,
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: Colors.grey.shade200),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('Checklist Tersimpan: ${item.checklist.where((c) => c.statusPemeriksaan).length} dari ${item.checklist.length}', style: TextStyle(fontSize: 13, color: Colors.grey.shade700)),
                                        if (isVerified) ...[
                                          const SizedBox(height: 8),
                                          const Divider(height: 1),
                                          const SizedBox(height: 8),
                                          Text('Diverifikasi oleh: ${item.namaKaderVerifikasi ?? '-'}', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                                          if (item.verifiedAt != null)
                                            Text('Tanggal Verifikasi: ${DateFormat('dd MMM yyyy, HH:mm').format(item.verifiedAt!.toLocal())}', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                                        ],
                                      ],
                                    ),
                                  ),
                                  if (!isVerified) ...[
                                    const SizedBox(height: 16),
                                    SizedBox(
                                      width: double.infinity,
                                      height: 44,
                                      child: ElevatedButton(
                                        onPressed: () => _verify(item),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.teal,
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          elevation: 1,
                                        ),
                                        child: const Text('Verifikasi BBL', style: TextStyle(fontWeight: FontWeight.bold)),
                                      ),
                                    ),
                                  ]
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
