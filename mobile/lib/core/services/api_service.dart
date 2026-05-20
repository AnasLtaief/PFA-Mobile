import 'package:dio/dio.dart';
import 'storage_service.dart';

class ApiService {
  final StorageService _storageService;
  late final Dio _dio;

  // For Android emulator, use 10.0.2.2. For physical devices or iOS, use localhost/IP address
  static const String _defaultBaseUrl = 'http://10.0.2.2:5000/api';

  ApiService(this._storageService) {
    _dio = Dio(
      BaseOptions(
        baseUrl: const String.fromEnvironment('API_URL', defaultValue: _defaultBaseUrl),
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = _storageService.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          // If Unauthorized and refresh token exists, try refreshing token
          if (error.response?.statusCode == 401 && error.requestOptions.path != '/auth/login' && error.requestOptions.path != '/auth/refresh-token') {
            final refreshToken = _storageService.getRefreshToken();
            if (refreshToken != null) {
              try {
                // Request new access token using the refresh token (sent in Cookie or body/headers depending on config)
                // Express uses cookie refresh token or standard. Let's send in custom headers as well or query parameter if express cookies are restricted in mobile environments
                final response = await _dio.post(
                  '/auth/refresh-token',
                  options: Options(
                    headers: {
                      'Cookie': 'refreshToken=$refreshToken', // Express reads from cookies
                    },
                  ),
                );

                if (response.statusCode == 200 && response.data != null) {
                  final data = response.data['data'];
                  final newAccessToken = data['accessToken'] as String;

                  // Save new access token
                  await _storageService.saveAccessToken(newAccessToken);

                  // Retry the original request
                  final originalRequestOpts = error.requestOptions;
                  originalRequestOpts.headers['Authorization'] = 'Bearer $newAccessToken';

                  final retryResponse = await _dio.fetch(originalRequestOpts);
                  return handler.resolve(retryResponse);
                }
              } catch (refreshError) {
                // Refresh failed: clear auth and let app handle redirection
                await _storageService.clearAuth();
              }
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  Dio get client => _dio;

  // GET Request
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.get(path, queryParameters: queryParameters, options: options);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // POST Request
  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.post(path, data: data, queryParameters: queryParameters, options: options);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // PATCH Request
  Future<Response> patch(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.patch(path, data: data, queryParameters: queryParameters, options: options);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // DELETE Request
  Future<Response> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      return await _dio.delete(path, data: data, queryParameters: queryParameters, options: options);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // File Upload
  Future<Response> uploadFile(
    String path,
    FormData formData, {
    Options? options,
  }) async {
    try {
      return await _dio.post(
        path,
        data: formData,
        options: options ?? Options(headers: {'Content-Type': 'multipart/form-data'}),
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  ApiException _handleError(DioException error) {
    final response = error.response;
    final message = response?.data?['message'] ?? 'An error occurred. Please try again.';
    final details = response?.data?['details'];

    return ApiException(
      message: message,
      statusCode: response?.statusCode,
      details: details,
    );
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic details;

  ApiException({required this.message, this.statusCode, this.details});

  @override
  String toString() => message;
}
