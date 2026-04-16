import 'package:flutter/material.dart';

/// Enum untuk melacak status progres tiap Trimester
enum TrimesterStatus { locked, active, completed }

class AppTheme {
  // --- 1. COLORS PALETTE (Card 9) ---
  static const Color primary500 = Color(0xFF3B82F6);
  static const Color primary50  = Color(0xFFEFF6FF);
  
  static const Color success500 = Color(0xFF22C55E);
  static const Color success50  = Color(0xFFF0FDF4);
  
  static const Color danger500  = Color(0xFFEF4444);
  static const Color danger50   = Color(0xFFFEF2F2);
  
  static const Color warning500 = Color(0xFFF59E0B);
  static const Color warning50  = Color(0xFFFFFBEB);

  static const Color slate50    = Color(0xFFF8FAFC);
  static const Color slate100   = Color(0xFFF1F5F9);
  static const Color slate200   = Color(0xFFE2E8F0);
  static const Color slate400   = Color(0xFF94A3B8);
  static const Color slate900   = Color(0xFF0F172A);
  static const Color white      = Colors.white;

  // --- 2. RADIUS TOKENS (Card 10) ---
  // Kita gunakan penamaan Style Guide (rounded) 
  // DAN alias (radius) agar kodenya tidak error
  static const double roundedSM   = 6.0;
  static const double roundedMD   = 8.0;
  static const double roundedLG   = 12.0;
  static const double roundedXL   = 16.0;
  static const double rounded2XL  = 20.0;
  static const double roundedFull = 999.0;

  // ALIAS (Agar AncDetailScreen tidak error)
  static const double radiusL     = 12.0;
  static const double radiusXL    = 16.0;
  static const double radius2XL   = 20.0;

  // --- 3. SHADOW TOKENS (Card 10) ---
  static const BoxShadow shadowSm = BoxShadow(
    color: Color(0x14000000), blurRadius: 4, offset: Offset(0, 1),
  );
  static const BoxShadow shadowMd = BoxShadow(
    color: Color(0x1A000000), blurRadius: 12, offset: Offset(0, 4),
  );

  // --- 4. GRADIENTS ---
  static const LinearGradient blueGradient = LinearGradient(
    colors: [Color(0xFF60A5FA), Color(0xFF2563EB)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // --- 5. LIGHT THEME CONFIGURATION ---
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primary500,
      scaffoldBackgroundColor: slate100,
      fontFamily: 'Inter',

      appBarTheme: const AppBarTheme(
        backgroundColor: white,
        foregroundColor: slate900,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w700, color: slate900,
        ),
      ),
      
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(roundedLG),
          borderSide: const BorderSide(color: slate200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(roundedLG),
          borderSide: const BorderSide(color: primary500, width: 2),
        ),
      ),
    );
  }
}

/// Trimester Theme - Menyediakan helper getThemeColor untuk UI
class TrimesterTheme {
  static const Color t1Primary = Color(0xFF3B82F6);
  static const Color t2Primary = Color(0xFF7C3AED);
  static const Color t3Primary = Color(0xFF0D9488);

  static Color getThemeColor(int trimester) {
    if (trimester == 1) return t1Primary;
    if (trimester == 2) return t2Primary;
    return t3Primary;
  }
}