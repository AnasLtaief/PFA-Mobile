import 'package:hive_flutter/hive_flutter.dart';

class StorageService {
  static const String authBoxName = 'auth_box';
  static const String settingsBoxName = 'settings_box';

  static const String tokenKey = 'accessToken';
  static const String refreshKey = 'refreshToken';
  static const String userKey = 'userProfile';
  static const String themeKey = 'themeMode';

  late Box _authBox;
  late Box _settingsBox;

  Future<void> init() async {
    await Hive.initFlutter();
    _authBox = await Hive.openBox(authBoxName);
    _settingsBox = await Hive.openBox(settingsBoxName);
  }

  // Token management
  String? getAccessToken() => _authBox.get(tokenKey) as String?;
  Future<void> saveAccessToken(String token) async => await _authBox.put(tokenKey, token);

  String? getRefreshToken() => _authBox.get(refreshKey) as String?;
  Future<void> saveRefreshToken(String token) async => await _authBox.put(refreshKey, token);

  Future<void> clearAuth() async {
    await _authBox.delete(tokenKey);
    await _authBox.delete(refreshKey);
    await _authBox.delete(userKey);
  }

  // User details management
  Map<dynamic, dynamic>? getUserProfile() {
    final raw = _authBox.get(userKey);
    if (raw == null) return null;
    return Map<dynamic, dynamic>.from(raw as Map);
  }

  Future<void> saveUserProfile(Map<String, dynamic> userMap) async {
    await _authBox.put(userKey, userMap);
  }

  // Theme settings
  String getThemeMode() => _settingsBox.get(themeKey, defaultValue: 'dark') as String;
  Future<void> saveThemeMode(String mode) async => await _settingsBox.put(themeKey, mode);
}
