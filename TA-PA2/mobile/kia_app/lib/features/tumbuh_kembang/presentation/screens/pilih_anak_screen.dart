import 'package:flutter/material.dart';
import 'detail_pertumbuhan_dummy_screen.dart';

class PilihAnakScreen extends StatelessWidget {
  const PilihAnakScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> anakList = [
      {"nama": "Andika Purba", "status": "aktif"},
      {"nama": "Shinta Purba", "status": "aktif"},
      {"nama": "Andrey Purba", "status": "pending"},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text("Pilih Profil Anak"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: anakList.length,
        itemBuilder: (context, index) {
          final anak = anakList[index];
          return _buildItem(context, anak);
        },
      ),
    );
  }

  Widget _buildItem(BuildContext context, Map<String, dynamic> anak) {
    bool isPending = anak["status"] == "pending";

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F1FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.blue.shade200),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: Colors.blue.shade100,
            child: const Icon(Icons.person, color: Colors.blue),
          ),
          const SizedBox(width: 12),

          // TEXT
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  anak["nama"],
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
                const Text(
                  "Mulai pantau tumbuh kembang si kecil",
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),

          // ICON KANAN
          isPending
              ? const Icon(Icons.access_time, color: Colors.orange)
              : InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DetailPertumbuhanScreenDummy(
                          anak: anak,
                        ),
                      ),
                    );
                  },
                  child: const CircleAvatar(
                    radius: 14,
                    backgroundColor: Colors.blue,
                    child: Icon(Icons.arrow_forward, size: 14, color: Colors.white),
                  ),
                ),
        ],
      ),
    );
  }
}