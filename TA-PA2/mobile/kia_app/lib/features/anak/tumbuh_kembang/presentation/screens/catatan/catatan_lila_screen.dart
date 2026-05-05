import 'package:flutter/material.dart';

class CatatanLilaScreen extends StatefulWidget {
  const CatatanLilaScreen({super.key});

  @override
  State<CatatanLilaScreen> createState() => _CatatanLilaScreenState();
}

class _CatatanLilaScreenState extends State<CatatanLilaScreen> {
  bool isLoading = false;
  List<dynamic> catatanList = [];

  @override
  void initState() {
    super.initState();
    _loadCatatan();
  }

  Future<void> _loadCatatan() async {
    // TODO: Implementasi API call untuk mengambil data catatan LiLA
    // Untuk sekarang, tampilkan empty state
    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;
    setState(() {
      isLoading = false;
      catatanList = [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Lingkar Lengan Atas (LiLA)',
              style: TextStyle(
                color: Color(0xFF172033),
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Pantau pengukuran LiLA secara berkala',
              style: TextStyle(
                color: Color(0xFF7B8798),
                fontSize: 13,
              ),
            ),
          ],
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF172033)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : catatanList.isEmpty
              ? _buildEmptyState()
              : _buildCatatanList(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Fitur tambah catatan akan segera tersedia'),
            ),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('Tambah Catatan'),
        backgroundColor: const Color(0xFFF57C00),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: const Color(0xFFFFE0B2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.straighten_outlined,
                size: 50,
                color: Color(0xFFF57C00),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Belum Ada Catatan LiLA',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Color(0xFF172033),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Mulai catat pengukuran lingkar lengan atas anak secara berkala untuk memantau status gizi',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Color(0xFF7B8798),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF57C00),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Fitur tambah catatan akan segera tersedia'),
                    ),
                  );
                },
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add),
                    SizedBox(width: 8),
                    Text('Tambah Catatan LiLA'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF8E1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: Color(0xFFF57C00)),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'LiLA (Lingkar Lengan Atas) adalah indikator penting untuk menilai status gizi anak.',
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFFF57C00),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCatatanList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: catatanList.length,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text('Catatan ${index + 1}'),
            subtitle: const Text('Tanggal pengukuran'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
          ),
        );
      },
    );
  }
}
