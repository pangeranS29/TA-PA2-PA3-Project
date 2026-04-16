import 'package:ta_pa2_pa3_project/data/models/anc_model.dart';
import 'package:ta_pa2_pa3_project/core/network/api_client.dart';

class AncRepository {
  // Menggunakan ApiClient yang baru saja kita buat
  final ApiClient _client = ApiClient();

  /// --- 1. FUNGSI KIRIM DATA (POST) ---
  Future<bool> submitPemeriksaan(AncPemeriksaanModel data) async {
    try {
      final response = await _client.post(
        '/anc/pemeriksaan', 
        data: data.toJson(),
      );
      // Status 201 (Created) atau 200 (OK)
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  /// --- 2. FUNGSI AMBIL DATA (GET) ---
  /// Tambahkan fungsi ini agar error di Screen hilang
  Future<List<AncPemeriksaanModel>> getHistoryPemeriksaan(int idKehamilan) async {
    try {
      // Mengambil data dari endpoint history dengan parameter id_kehamilan
      final response = await _client.get(
        '/anc/history',
        queryParameters: {'id_kehamilan': idKehamilan},
      );

      if (response.statusCode == 200) {
        // Ambil list dari field 'data' yang dikirim oleh backend Go
        final List<dynamic> listData = response.data['data'];
        
        // Map JSON menjadi List of Models
        return listData.map((e) => AncPemeriksaanModel.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      // Jika error, kembalikan list kosong agar UI tidak crash
      return [];
    }
  }
}