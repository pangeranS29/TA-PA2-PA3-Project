import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/themes/app_theme.dart';
// import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/anc_form_t1_screen.dart';
// import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/anc_form_t2_screen.dart';
// import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/anc_form_t3_screen.dart';

// NEW M
import 'package:ta_pa2_pa3_project/features/hamil/data/models/kehamilan_aktif_model.dart';
import 'hasil_evaluasi_kesehatan_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/trimester_menu_screen.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/proses_melahirkan_screens.dart';
import 'package:ta_pa2_pa3_project/features/hamil/presentation/screens/absensi_kelas_ibu_hamil_screen.dart';

// class JourneyScreen extends StatefulWidget {
//   @override
//   _JourneyScreenState createState() => _JourneyScreenState();
// }

// NEW M
class JourneyScreen extends StatefulWidget {
  final KehamilanAktifModel kehamilan;

  const JourneyScreen({
    super.key,
    required this.kehamilan,
  });

  @override
  _JourneyScreenState createState() => _JourneyScreenState();
}

class _JourneyScreenState extends State<JourneyScreen> {
  // --- VARIABEL DINAMIS ---
  // int currentWeek = 24; // Usia kehamilan saat ini
  late int currentWeek; // NEW M
  @override
  void initState() {
    super.initState();
    currentWeek = widget.kehamilan.ukKehamilanSaatIni;
  }

  final int totalWeeks = 40;
  
  // Status Trimester yang sudah selesai (0: Belum ada, 1: T1 Selesai, 2: T2 Selesai)
  int completedTrimester = 0; 

  // --- LOGIKA PERHITUNGAN OTOMATIS ---
  String get currentTrimesterLabel {
    if (currentWeek <= 12) return "Trimester I";
    if (currentWeek <= 27) return "Trimester II";
    return "Trimester III";
  }

  double get progressValue => currentWeek / totalWeeks;

  String _formatDate(DateTime? date) {
    if (date == null) return '-';
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TrimesterTheme.background,
      appBar: AppBar(
        // title: Column(
        //   crossAxisAlignment: CrossAxisAlignment.start,
        //   children: const [
        //     Text("Pemeriksaan Kehamilan", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white)),
        //     Text("Ibu Riyanthi · G2P1A0", style: TextStyle(fontSize: 12, color: Colors.white70)),
        //   ],
        // ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Pemeriksaan Kehamilan",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.white,
              ),
            ),
            Text(
              "G${widget.kehamilan.gravida}P${widget.kehamilan.paritas}A${widget.kehamilan.abortus}",
              style: const TextStyle(fontSize: 12, color: Colors.white70),
            ),
          ],
        ),
        backgroundColor: TrimesterTheme.t1Primary,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context), 
        ),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_none, color: Colors.white), onPressed: () {}),
        ],
      ),
      // PERUBAHAN UTAMA: Gunakan ListView sebagai root agar semua elemen bisa di-scroll
      body: ListView(
        padding: EdgeInsets.zero, // Agar header biru menempel ke AppBar
        children: [
          _buildStatusHeader(), 
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              children: [
                InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const HasilEvaluasiKesehatanScreen(),
                      ),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 24),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: const Color(0xFFB7DBFF),
                        width: 1.2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 12,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: const BoxDecoration(
                            color: Color(0xFFEAF4FF),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.assignment_outlined,
                            color: Color(0xFF2F80ED),
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Evaluasi Kesehatan Ibu",
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              SizedBox(height: 6),
                              Text(
                                "Lihat hasil evaluasi awal kehamilan",
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.purple,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right),
                      ],
                    ),
                  ),
                ),


                _buildBirthFeatureCard(
                  icon: Icons.summarize_outlined,
                  iconColor: const Color(0xFFE0A300),
                  iconBackground: const Color(0xFFFFF5D6),
                  title: "Ringkasan Pelayanan Proses Melahirkan",
                  subtitle: "Lihat ringkasan ibu bersalin, nifas, dan bayi saat lahir",
                  borderColor: const Color(0xFFFFE3A3),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const RingkasanPelayananProsesMelahirkanScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 14),

                _buildBirthFeatureCard(
                  icon: Icons.fact_check_outlined,
                  iconColor: const Color(0xFFE0A300),
                  iconBackground: const Color(0xFFFFF5D6),
                  title: "Absensi Kelas Ibu Hamil",
                  subtitle: "Isi tanggal hadir sampai 9 sesi dan paraf kader",
                  borderColor: const Color(0xFFFFE3A3),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AbsensiKelasIbuHamilScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 14),

                _buildBirthFeatureCard(
                  icon: Icons.history_edu_outlined,
                  iconColor: const Color(0xFF8B5CF6),
                  iconBackground: const Color(0xFFF3E8FF),
                  title: "Riwayat Proses Melahirkan",
                  subtitle: "Lihat cara melahirkan, tindakan, penolong, dan catatan pemeriksaan",
                  borderColor: const Color(0xFFE9D5FF),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const RiwayatProsesMelahirkanScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 14),
                _buildBirthFeatureCard(
                  icon: Icons.child_friendly_outlined,
                  iconColor: const Color(0xFF10B981),
                  iconBackground: const Color(0xFFDFFBF0),
                  title: "Keterangan Lahir",
                  subtitle: "Lihat keterangan lahir bayi, data orang tua, dan tanda tangan",
                  borderColor: const Color(0xFFC7F2E0),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const KeteranganLahirScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 24),

                // _buildJourneyStep(
                //   trimester: 1,
                //   title: "Trimester I · ${completedTrimester >= 1 ? 'Selesai' : 'Sedang Berjalan'}",
                //   desc: "Ukuran Plum · ±5 cm",
                //   weeks: "Minggu 1-12",
                //   status: completedTrimester >= 1 ? TrimesterStatus.completed : TrimesterStatus.active,
                // ),
                // _buildJourneyStep(
                //   trimester: 2,
                //   title: "Trimester II · ${completedTrimester >= 2 ? 'Selesai' : (completedTrimester >= 1 ? 'Sedang Berjalan' : 'Terkunci')}",
                //   desc: "Ukuran Pepaya · ±30 cm",
                //   weeks: "Minggu 13-27",
                //   status: completedTrimester >= 2 ? TrimesterStatus.completed : 
                //           (completedTrimester == 1 ? TrimesterStatus.active : TrimesterStatus.locked),
                // ),
                // _buildJourneyStep(
                //   trimester: 3,
                //   title: "Trimester III",
                //   desc: "Ukuran Semangka · ±48 cm",
                //   weeks: "Minggu 28-40",
                //   status: completedTrimester >= 3 ? TrimesterStatus.completed :
                //           (completedTrimester == 2 ? TrimesterStatus.active : TrimesterStatus.locked),
                // ),

                _buildJourneyStep(
                  trimester: 1,
                  title: "Trimester I",
                  desc: "Ukuran Plum · ±5 cm",
                  weeks: "Minggu 1-12",
                  status: TrimesterStatus.active,
                ),
                _buildJourneyStep(
                  trimester: 2,
                  title: "Trimester II",
                  desc: "Ukuran Pepaya · ±30 cm",
                  weeks: "Minggu 13-27",
                  status: TrimesterStatus.active,
                ),
                _buildJourneyStep(
                  trimester: 3,
                  title: "Trimester III",
                  desc: "Ukuran Semangka · ±48 cm",
                  weeks: "Minggu 28-40",
                  status: TrimesterStatus.active,
                ),

              ],
            ),
          ),
          const SizedBox(height: 40), // Ruang tambahan di bawah agar tidak mentok
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }


  Widget _buildBirthFeatureCard({
    required IconData icon,
    required Color iconColor,
    required Color iconBackground,
    required String title,
    required String subtitle,
    required Color borderColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(18),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor, width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: iconBackground,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 28),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade700,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }

  // --- WIDGET HELPER: HEADER DINAMIS ---
  Widget _buildStatusHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 30, left: 24, right: 24, top: 10),
      decoration: const BoxDecoration(
        color: TrimesterTheme.t1Primary,
        borderRadius: BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("USIA KEHAMILAN SAAT INI", style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(20)),
                      child: Text(currentTrimesterLabel, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    )
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text("$currentWeek", style: const TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.bold)),
                    const SizedBox(width: 8),
                    const Text("Minggu", style: TextStyle(color: Colors.white, fontSize: 20)),
                  ],
                ),
                // const Text("HPL: 15 Agustus 2025 • HPHT: 22 Oktober 2024", style: TextStyle(color: Colors.white70, fontSize: 11)),
                Text(
                  "HPL: ${_formatDate(widget.kehamilan.taksiranPersalinan)} • HPHT: ${_formatDate(widget.kehamilan.hpht)}",
                  style: const TextStyle(color: Colors.white70, fontSize: 11),
                ),
                const SizedBox(height: 15),
                LinearProgressIndicator(
                  value: progressValue,
                  backgroundColor: Colors.white24,
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(10),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("Mgg 1", style: TextStyle(color: Colors.white60, fontSize: 10)),
                    const Text("Mgg 12", style: TextStyle(color: Colors.white60, fontSize: 10)),
                    Text("Mgg $currentWeek ◀", style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    const Text("Mgg 40", style: TextStyle(color: Colors.white60, fontSize: 10)),
                  ],
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- WIDGET HELPER: JOURNEY CARD ---
  Widget _buildJourneyStep({
    required int trimester, 
    required String title, 
    required String desc, 
    required String weeks,
    required TrimesterStatus status,
  }) {
    bool isLocked = status == TrimesterStatus.locked;
    Color mainColor = TrimesterTheme.getThemeColor(trimester);

    return IntrinsicHeight(
      child: Row(
        children: [
          // Timeline logic
          Column(
            children: [
              Container(
                width: 24, height: 24,
                decoration: BoxDecoration(
                  color: isLocked ? Colors.grey.shade300 : Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: isLocked ? Colors.transparent : mainColor, width: 2),
                ),
                child: Center(
                  child: Icon(
                    isLocked ? Icons.lock : (status == TrimesterStatus.completed ? Icons.check : Icons.radio_button_checked),
                    size: 14, color: isLocked ? Colors.white : mainColor,
                  ),
                ),
              ),
              Expanded(child: Container(width: 2, color: Colors.grey.shade300)),
            ],
          ),
          const SizedBox(width: 16),
          // Content
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(bottom: 24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: isLocked ? null : Border.all(color: mainColor.withOpacity(0.3), width: 1.5),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(20),
                  // onTap: isLocked ? null : () async {
                  //   Widget target = trimester == 1 ? AncFormT1Screen() : (trimester == 2 ? AncFormT2Screen() : AncFormT3Screen());
                  //   final res = await Navigator.push(context, MaterialPageRoute(builder: (c) => target));
                  //   if (res == true && completedTrimester < trimester) {
                  //     setState(() => completedTrimester = trimester);
                  //   }
                  // },
                  onTap: isLocked ? null : () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (c) => TrimesterMenuScreen(trimester: trimester),
                      ),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        Container(
                          width: 50, height: 50,
                          decoration: BoxDecoration(
                            color: isLocked ? Colors.grey.shade100 : mainColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isLocked ? Icons.lock_outline : (status == TrimesterStatus.completed ? Icons.verified_user : Icons.favorite),
                            color: isLocked ? Colors.grey : mainColor, size: 26,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: isLocked ? Colors.grey : Colors.black87)),
                              const SizedBox(height: 4),
                              Text(desc, style: TextStyle(color: isLocked ? Colors.grey : Colors.purple, fontSize: 13, fontWeight: FontWeight.w500)),
                              const SizedBox(height: 8),
                              Text(weeks, style: const TextStyle(color: Colors.grey, fontSize: 11)),
                            ],
                          ),
                        ),
                        if (!isLocked) const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: TrimesterTheme.t1Primary,
      unselectedItemColor: Colors.grey,
      currentIndex: 0,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: "Beranda"),
        BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), label: "Catatan"),
        BottomNavigationBarItem(icon: Icon(Icons.security_outlined), label: "Imunisasi"),
        BottomNavigationBarItem(icon: Icon(Icons.book_outlined), label: "Edukasi"),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: "Profil"),
      ],
    );
  }
}