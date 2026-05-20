import 'package:flutter/material.dart';

class AppColors {
  // Dark Theme Colors
  static const Color darkBackground = Color(0xFF0A0A0F); // #0A0A0F
  static const Color darkSurface = Color(0xFF13131A); // #13131A
  static const Color primary = Color(0xFF6C63FF); // #6C63FF (electric violet)
  static const Color accent = Color(0xFF00D4AA); // #00D4AA (mint green)
  static const Color emergency = Color(0xFFFF6B35); // #FF6B35 (orange-red)

  static const Color darkTextPrimary = Color(0xFFF0F0F5); // #F0F0F5
  static const Color darkTextSecondary = Color(0xFF8A8A9E); // #8A8A9E

  // Light Theme Colors (Theme supports light, but default is dark)
  static const Color lightBackground = Color(0xFFF5F5FA);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightTextPrimary = Color(0xFF1C1C24);
  static const Color lightTextSecondary = Color(0xFF62627A);

  // Status & Utility Colors
  static const Color success = Color(0xFF00D4AA);
  static const Color warning = Color(0xFFFFB03A);
  static const Color info = Color(0xFF4392F1);
}
