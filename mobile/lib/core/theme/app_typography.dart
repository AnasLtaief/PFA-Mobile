import 'package:flutter/material.dart';

class AppTypography {
  static const String displayFont = 'Syne';
  static const String bodyFont = 'PlusJakartaSans';

  // Display Styles (Syne)
  static TextStyle get h1 => const TextStyle(
        fontFamily: displayFont,
        fontWeight: FontWeight.bold,
        fontSize: 32,
        height: 1.2,
      );

  static TextStyle get h2 => const TextStyle(
        fontFamily: displayFont,
        fontWeight: FontWeight.bold,
        fontSize: 24,
        height: 1.25,
      );

  static TextStyle get h3 => const TextStyle(
        fontFamily: displayFont,
        fontWeight: FontWeight.bold,
        fontSize: 20,
        height: 1.3,
      );

  // Body Styles (Plus Jakarta Sans)
  static TextStyle get bodyLarge => const TextStyle(
        fontFamily: bodyFont,
        fontWeight: FontWeight.normal,
        fontSize: 16,
        height: 1.5,
      );

  static TextStyle get bodyMedium => const TextStyle(
        fontFamily: bodyFont,
        fontWeight: FontWeight.normal,
        fontSize: 14,
        height: 1.45,
      );

  static TextStyle get bodySmall => const TextStyle(
        fontFamily: bodyFont,
        fontWeight: FontWeight.normal,
        fontSize: 12,
        height: 1.4,
      );

  static TextStyle get labelLarge => const TextStyle(
        fontFamily: bodyFont,
        fontWeight: FontWeight.w600,
        fontSize: 14,
        letterSpacing: 0.1,
      );

  static TextStyle get labelMedium => const TextStyle(
        fontFamily: bodyFont,
        fontWeight: FontWeight.w500,
        fontSize: 12,
        letterSpacing: 0.5,
      );
}
