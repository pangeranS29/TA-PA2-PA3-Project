import 'package:dio/dio.dart';
import 'package:ta_pa2_pa3_project/core/network/dio_client.dart';

class ApiClient {
  final Dio _dio = DioClient().dio;

  /// Fungsi Generic untuk GET Request
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      final response = await _dio.get(path, queryParameters: queryParameters);
      return response;
    } on DioException {
      rethrow;
    }
  }

  /// Fungsi Generic untuk POST Request
  Future<Response> post(String path, {dynamic data}) async {
    try {
      final response = await _dio.post(path, data: data);
      return response;
    } on DioException {
      rethrow;
    }
  }

  /// Fungsi Generic untuk DELETE Request
  Future<Response> delete(String path) async {
    try {
      final response = await _dio.delete(path);
      return response;
    } on DioException {
      rethrow;
    }
  }
}