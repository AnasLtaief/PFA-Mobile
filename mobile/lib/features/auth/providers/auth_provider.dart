import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/providers.dart';
import '../models/user_model.dart';

class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? errorMessage;
  final bool require2FA;
  final String? tempEmail; // For 2FA or registration flow
  final bool emailVerified;

  AuthState({
    this.user,
    this.isLoading = false,
    this.errorMessage,
    this.require2FA = false,
    this.tempEmail,
    this.emailVerified = false,
  });

  AuthState copyWith({
    UserModel? user,
    bool? isLoading,
    String? errorMessage,
    bool? require2FA,
    String? tempEmail,
    bool? emailVerified,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage, // Reset error if not explicitly passed
      require2FA: require2FA ?? this.require2FA,
      tempEmail: tempEmail ?? this.tempEmail,
      emailVerified: emailVerified ?? this.emailVerified,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthNotifier(this._ref) : super(AuthState()) {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final storage = _ref.read(storageServiceProvider);
    final userMap = storage.getUserProfile();
    final token = storage.getAccessToken();

    if (userMap != null && token != null) {
      final user = UserModel.fromJson(Map<String, dynamic>.from(userMap));
      state = AuthState(user: user);
      // Connect sockets
      _ref.read(socketServiceProvider).connect();
    }
  }

  Future<bool> register({
    required String fullName,
    required String email,
    required String phone,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true);
    try {
      final api = _ref.read(apiServiceProvider);
      final response = await api.post('/auth/register', data: {
        'fullName': fullName,
        'email': email,
        'phone': phone,
        'password': password,
      });

      final responseData = response.data['data'];
      final userJson = responseData['user'];
      final accessToken = responseData['accessToken'];

      // Note: Refresh token is set in HTTP cookie on web/native by Express,
      // but in mobile we can extract it or express-cookie holds it.
      // If we got access token, let's write to storage.
      final storage = _ref.read(storageServiceProvider);
      await storage.saveAccessToken(accessToken);
      final user = UserModel.fromJson(userJson);
      await storage.saveUserProfile(user.toJson());

      state = AuthState(user: user);
      _ref.read(socketServiceProvider).connect();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> login({
    required String email,
    required String password,
    String? twoFAToken,
  }) async {
    state = state.copyWith(isLoading: true);
    try {
      final api = _ref.read(apiServiceProvider);
      final response = await api.post('/auth/login', data: {
        'email': email,
        'password': password,
        if (twoFAToken != null) 'twoFAToken': twoFAToken,
      });

      final data = response.data['data'];

      // Check if 2FA is required
      if (data != null && data['require2FA'] == true) {
        state = state.copyWith(
          require2FA: true,
          tempEmail: email,
          isLoading: false,
        );
        return false;
      }

      final userJson = data['user'];
      final accessToken = data['accessToken'];

      final storage = _ref.read(storageServiceProvider);
      await storage.saveAccessToken(accessToken);
      
      // Save refresh token if backend returns it in body fallback (in some mobile setups)
      if (data['refreshToken'] != null) {
        await storage.saveRefreshToken(data['refreshToken']);
      }

      final user = UserModel.fromJson(userJson);
      await storage.saveUserProfile(user.toJson());

      state = AuthState(user: user);
      _ref.read(socketServiceProvider).connect();
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> verifyEmail(String token) async {
    state = state.copyWith(isLoading: true);
    try {
      final api = _ref.read(apiServiceProvider);
      await api.post('/auth/verify-email', data: {'token': token});

      if (state.user != null) {
        final updatedUser = state.user!.copyWith(isVerified: true);
        await _ref.read(storageServiceProvider).saveUserProfile(updatedUser.toJson());
        state = state.copyWith(user: updatedUser, emailVerified: true);
      } else {
        state = state.copyWith(emailVerified: true);
      }
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<Map<String, dynamic>?> setup2FA() async {
    state = state.copyWith(isLoading: true);
    try {
      final api = _ref.read(apiServiceProvider);
      final response = await api.post('/auth/2fa/setup');
      state = state.copyWith(isLoading: false);
      return response.data['data'];
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return null;
    }
  }

  Future<List<String>?> verify2FA(String token) async {
    state = state.copyWith(isLoading: true);
    try {
      final api = _ref.read(apiServiceProvider);
      final response = await api.post('/auth/2fa/verify', data: {'token': token});
      final data = response.data['data'];
      final backupCodes = List<String>.from(data['backupCodes'] ?? []);

      if (state.user != null) {
        final updatedUser = state.user!.copyWith(twoFAEnabled: true);
        await _ref.read(storageServiceProvider).saveUserProfile(updatedUser.toJson());
        state = state.copyWith(user: updatedUser);
      }

      return backupCodes;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return null;
    }
  }

  Future<bool> disable2FA(String token) async {
    state = state.copyWith(isLoading: true);
    try {
      final api = _ref.read(apiServiceProvider);
      await api.post('/auth/2fa/disable', data: {'token': token});

      if (state.user != null) {
        final updatedUser = state.user!.copyWith(twoFAEnabled: false);
        await _ref.read(storageServiceProvider).saveUserProfile(updatedUser.toJson());
        state = state.copyWith(user: updatedUser);
      }
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> setupProfile({
    required String bio,
    required String university,
    required String wilaya,
    required String emergencyPhone,
    required String emergencyName,
    String? avatarUrl,
  }) async {
    state = state.copyWith(isLoading: true);
    try {
      final api = _ref.read(apiServiceProvider);
      final response = await api.patch('/users/me', data: {
        'bio': bio,
        'university': university,
        'wilaya': wilaya,
        'emergencyContact': {
          'name': emergencyName,
          'phone': emergencyPhone,
        },
        if (avatarUrl != null) 'avatarUrl': avatarUrl,
      });

      final userJson = response.data['data'];
      final user = UserModel.fromJson(userJson);
      await _ref.read(storageServiceProvider).saveUserProfile(user.toJson());

      state = state.copyWith(user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> forgotPassword(String email) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final api = _ref.read(apiServiceProvider);
      await api.post('/auth/forgot-password', data: {'email': email});
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString(), isLoading: false);
      return false;
    }
  }

  Future<void> logout() async {
    try {
      final api = _ref.read(apiServiceProvider);
      await api.post('/auth/logout');
    } catch (_) {}

    _ref.read(socketServiceProvider).disconnect();
    await _ref.read(storageServiceProvider).clearAuth();
    state = AuthState();
  }

  void clearError() {
    state = state.copyWith(errorMessage: null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});
