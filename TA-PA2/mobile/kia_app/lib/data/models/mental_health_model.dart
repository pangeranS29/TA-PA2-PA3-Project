class MentalHealthModel {
  final String? id;
  final DateTime date;
  final int totalScore;
  final int stressScore;
  final int anxietyScore;
  final int depressionScore;
  final String status; // Misal: "Perlu Perhatian", "Baik"
  final Map<int, int> rawAnswers; // Menyimpan detail jawaban per pertanyaan

  MentalHealthModel({
    this.id,
    required this.date,
    required this.totalScore,
    required this.stressScore,
    required this.anxietyScore,
    required this.depressionScore,
    required this.status,
    required this.rawAnswers,
  });

  // Konversi dari JSON (Saat mengambil data dari database)
  factory MentalHealthModel.fromJson(Map<String, dynamic> json) {
    return MentalHealthModel(
      id: json['id'],
      date: DateTime.parse(json['date']),
      totalScore: json['total_score'],
      stressScore: json['stress_score'],
      anxietyScore: json['anxiety_score'],
      depressionScore: json['depression_score'],
      status: json['status'],
      rawAnswers: Map<int, int>.from(json['raw_answers']),
    );
  }

  // Konversi ke JSON (Saat menyimpan data ke database)
  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'total_score': totalScore,
      'stress_score': stressScore,
      'anxiety_score': anxietyScore,
      'depression_score': depressionScore,
      'status': status,
      'raw_answers': rawAnswers,
    };
  }
}