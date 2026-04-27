import 'package:ta_pa2_pa3_project/features/hamil/data/datasources/proses_melahirkan_api_service.dart';
import 'package:ta_pa2_pa3_project/features/hamil/data/models/proses_melahirkan_model.dart';

class ProsesMelahirkanRepository {
  final ProsesMelahirkanApiService _apiService;

  ProsesMelahirkanRepository({ProsesMelahirkanApiService? apiService})
      : _apiService = apiService ?? ProsesMelahirkanApiService();

  Future<ProsesMelahirkanModel> getMine() => _apiService.getMine();

  void dispose() => _apiService.dispose();
}
