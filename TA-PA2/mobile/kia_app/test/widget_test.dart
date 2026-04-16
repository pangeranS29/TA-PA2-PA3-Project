import 'package:flutter_test/flutter_test.dart';
import 'package:ta_pa2_pa3_project/main.dart';

void main() {
  testWidgets('Dashboard Journey Kehamilan smoke test', (WidgetTester tester) async {
    // 1. Build aplikasi SehatiApp dan trigger frame pertama.
    await tester.pumpWidget(SehatiApp());

    // 2. Verifikasi bahwa halaman utama menampilkan header "Journey Kehamilan".
    expect(find.text('Journey Kehamilan'), findsOneWidget);
    
    // 3. Verifikasi bahwa sapaan "Halo, Ibu Sehat! " muncul di dashboard.
    expect(find.text('Halo, Ibu Sehat!'), findsOneWidget);

    // 4. Verifikasi bahwa Trimester I dalam status Aktif/Selesai (bukan terkunci).
    // Kita mencari teks 'Trimester I' yang ada di dalam Journey Card.
    expect(find.text('Trimester I'), findsOneWidget);

    // 5. Test Interaksi: Coba tap kartu Trimester I.
    await tester.tap(find.text('Trimester I'));
    await tester.pumpAndSettle(); // Tunggu hingga animasi transisi halaman selesai.

    // 6. Verifikasi apakah aplikasi berhasil pindah ke halaman Form ANC Trimester I.
    // Kita cek apakah judul AppBar di halaman baru adalah 'Trimester I — ANC K1'.
    expect(find.text('Trimester I — ANC K1'), findsOneWidget);
  });
}