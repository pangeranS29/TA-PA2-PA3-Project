import 'package:flutter/material.dart';

/// Enum untuk melacak status progres tiap Trimester
enum TrimesterStatus { locked, active, completed }

class TrimesterTheme {
  static const Color background = Color(0xFFF8FAFC);
  
  // Trimester 1 - Blue
  static const List<Color> t1Gradient = [Color(0xFF2196F3), Color(0xFF1976D2)];
  static const Color t1Primary = Color(0xFF2196F3);

  // Trimester 2 - Purple
  static const List<Color> t2Gradient = [Color(0xFF9575CD), Color(0xFF7E57C2)];
  static const Color t2Primary = Color(0xFF7E57C2);

  // Trimester 3 - Teal
  static const List<Color> t3Gradient = [Color(0xFF4DB6AC), Color(0xFF009688)];
  static const Color t3Primary = Color(0xFF009688);

  /// Metode untuk mendapatkan warna utama (Primary) berdasarkan nomor trimester
  static Color getThemeColor(int trimester) {
    if (trimester == 1) return t1Primary;
    if (trimester == 2) return t2Primary;
    return t3Primary;
  }

  /// Metode untuk mendapatkan gradasi warna berdasarkan nomor trimester
  static List<Color> getGradient(int trimester) {
    if (trimester == 1) return t1Gradient;
    if (trimester == 2) return t2Gradient;
    return t3Gradient;
  }
}

class MentalHealthTheme {
  static const Color primaryPurple = Color(0xFF7C4DFF);
  static const Color stressOrange = Color(0xFFE67E22);
  static const Color anxietyIndigo = Color(0xFF3F51B5);
  static const Color depressionPurple = Color(0xFF9B59B6);
  static const Color goodGreen = Color(0xFF2ECC71);
}