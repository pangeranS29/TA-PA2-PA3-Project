import 'package:flutter/material.dart';
<<<<<<< HEAD
=======
import 'package:ta_pa2_pa3_project/database/local_database.dart';
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
import 'app.dart';
import 'core/services/auth_session.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:intl/date_symbol_data_local.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting(
    'id_ID',
    null,
  );
  await AuthSession.initialize();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
<<<<<<< HEAD
=======
  await LocalDatabase.instance.database;
  await LocalDatabase.instance.cekDaftarTabel();
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
  runApp(const KiaApp());
}
