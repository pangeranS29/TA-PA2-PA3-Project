import 'package:flutter/foundation.dart';

class MentalHealthController extends ChangeNotifier {
  // --- 1. DAILY MOOD CHECK ---
  String selectedMood = ""; 
  DateTime? lastCheckIn; 

  // --- 2. QUESTIONNAIRE STATE (S2) ---
  int currentQuestionIndex = 0; // Untuk melacak posisi pertanyaan di S2
  Map<int, int> answers = {};

  final List<Map<String, dynamic>> questions = [
    // DIMENSI STRES (Max 20)
    {"text": "Seberapa sering Anda merasa tidak mampu mengendalikan hal penting?", "dimension": "Stres", "maxScore": 4},
    {"text": "Apakah Anda merasa kewalahan dengan peran sebagai ibu hamil?", "dimension": "Stres", "maxScore": 4},
    {"text": "Saya merasa stres dengan perubahan fisik selama kehamilan.", "dimension": "Stres", "maxScore": 4},
    {"text": "Saya khawatir tentang kesehatan bayi saya.", "dimension": "Stres", "maxScore": 4},
    {"text": "Tanggung jawab kehamilan membuat saya merasa tertekan.", "dimension": "Stres", "maxScore": 4},
    
    // DIMENSI KECEMASAN (Max 21)
    {"text": "Saya merasa cemas atau khawatir tanpa alasan yang jelas.", "dimension": "Cemas", "maxScore": 3},
    {"text": "Saya mengalami kekhawatiran tentang proses persalinan.", "dimension": "Cemas", "maxScore": 3},
    {"text": "Saya merasa gugup atau tidak tenang dalam situasi sosial.", "dimension": "Cemas", "maxScore": 3},
    {"text": "Saya khawatir tidak siap menjadi ibu.", "dimension": "Cemas", "maxScore": 3},
    {"text": "Detak jantung saya sering cepat tanpa alasan.", "dimension": "Cemas", "maxScore": 3},
    {"text": "Saya mudah merasa panik atau takut.", "dimension": "Cemas", "maxScore": 3},
    {"text": "Saya merasa cemas tentang kesejahteraan finansial keluarga.", "dimension": "Cemas", "maxScore": 3},

    // DIMENSI DEPRESI (Max 27)
    {"text": "Saya merasa sedih atau kehilangan minat menetap.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya merasa putus asa tentang masa depan.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya kehilangan motivasi untuk aktivitas sehari-hari.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya merasa tidak berharga atau rendah diri.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya mengalami kesulitan tidur atau tidur berlebihan.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya merasa lelah sepanjang waktu.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya sulit berkonsentrasi atau membuat keputusan.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya merasa terisolasi atau sendirian.", "dimension": "Depresi", "maxScore": 3},
    {"text": "Saya memiliki pikiran negatif tentang kehamilan saya.", "dimension": "Depresi", "maxScore": 3},
  ];

  // --- 3. LOGIKA PENGHITUNGAN SKOR & PERSENTASE ---
  
  int get totalScore => answers.values.fold(0, (sum, score) => sum + score);

  int getScoreByDimension(String dimension) {
    int score = 0;
    for (int i = 0; i < questions.length; i++) {
      if (questions[i]['dimension'] == dimension && answers.containsKey(i)) {
        score += answers[i]!;
      }
    }
    return score;
  }

  double getPercentageByDimension(String dimension) {
    int currentScore = getScoreByDimension(dimension);
    int maxPossibleScore = 0;
    for (var q in questions) {
      if (q['dimension'] == dimension) {
        maxPossibleScore += q['maxScore'] as int;
      }
    }
    return maxPossibleScore == 0 ? 0.0 : currentScore / maxPossibleScore;
  }

  String get overallInterpretation {
    if (totalScore >= 35) return "Perlu Perhatian"; 
    if (totalScore >= 15) return "Pantau Berkala";
    return "Kondisi Baik";
  }

  // --- 4. RIWAYAT PEMERIKSAAN (S1) ---
  final List<Map<String, dynamic>> history = [
    {"date": "3 Apr", "stres": 13, "cemas": 7, "depresi": 3, "status": "Sedang"},
    {"date": "20 Mar", "stres": 10, "cemas": 5, "depresi": 2, "status": "Ringan"},
    {"date": "6 Mar", "stres": 8, "cemas": 4, "depresi": 2, "status": "Baik"},
  ];

  // --- 5. FUNGSI MANAJEMEN ---
  
  void setMood(String mood) {
    selectedMood = mood;
    lastCheckIn = DateTime.now();
    notifyListeners(); // Memberitahu UI bahwa mood berubah
  }

  void setAnswer(int questionIndex, int score) {
    answers[questionIndex] = score;
    notifyListeners(); // Memberitahu UI bahwa jawaban bertambah
  }

  void nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      notifyListeners();
    }
  }

  void prevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      notifyListeners();
    }
  }

  bool isAllAnswered() => answers.length == questions.length;

  void resetTest() {
    answers.clear();
    currentQuestionIndex = 0;
    selectedMood = "";
    notifyListeners();
  }

  @override
  void dispose() {
    answers.clear();
    super.dispose();
  }
}