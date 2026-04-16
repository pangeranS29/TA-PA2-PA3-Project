import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
// Impor storage service kamu di sini untuk mengambil token JWT
// import 'package:ta_pa2_pa3_project/core/services/storage_service.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();
  factory DioClient() => _instance;

  late Dio _dio;

  // KONFIGURASI BASE URL
  // Gunakan 10.0.2.2 untuk emulator Android agar bisa akses localhost laptop
  static const String baseUrl = "http://10.0.2.2:8080/api/v1"; 

  DioClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        responseType: ResponseType.json,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // --- INTERCEPTOR LOGGING & AUTH ---
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // 1. OTOMATISASI JWT TOKEN
          // Karena backend kamu menggunakan jwt_middleware, 
          // setiap request wajib membawa token di header.
          
          /* final token = await StorageService().getToken();
          if (token != null) {
            options.headers["Authorization"] = "Bearer $token";
          } 
          */
          
          if (kDebugMode) {
            print("🌐 [REQUEST] ${options.method} => ${options.path}");
            print("📦 [DATA] ${options.data}");
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          if (kDebugMode) {
            print("✅ [RESPONSE] ${response.statusCode} <= ${response.requestOptions.path}");
          }
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          // 2. ERROR HANDLING TERPUSAT
          if (kDebugMode) {
            print("❌ [ERROR] ${e.response?.statusCode} !! ${e.message}");
          }
          
          // Tangani jika Token Kadaluarsa (401)
          if (e.response?.statusCode == 401) {
             // Logika Logout atau Refresh Token di sini
          }
          
          return handler.next(e);
        },
      ),
    );
  }

  Dio get dio => _dio;
}
