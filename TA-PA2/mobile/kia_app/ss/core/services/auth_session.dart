import 'package:shared_preferences/shared_preferences.dart';

class AuthSession {
  AuthSession._();

  static const String _tokenKey = 'auth_access_token';
  static const String _nameKey = 'auth_user_name';
  static const String _roleKey = 'auth_user_role';

  static String? token;
  static String? userName;
  static String? role;

  static bool get isLoggedIn => token != null && token!.isNotEmpty;

  static Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    token = prefs.getString(_tokenKey);
    userName = prefs.getString(_nameKey);
    role = prefs.getString(_roleKey);
  }

  static Future<void> save({
    required String accessToken,
    String? name,
    String? userRole,
  }) async {
    token = accessToken;
    userName = name;
    role = userRole;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, accessToken);
    if (name != null) {
      await prefs.setString(_nameKey, name);
    }
    if (userRole != null) {
      await prefs.setString(_roleKey, userRole);
    }
  }

  static Future<void> clear() async {
    token = null;
    userName = null;
    role = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_nameKey);
    await prefs.remove(_roleKey);
  }
}
