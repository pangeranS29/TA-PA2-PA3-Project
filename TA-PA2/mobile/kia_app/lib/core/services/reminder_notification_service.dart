import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

class ReminderNotificationService {
  ReminderNotificationService._();

  static final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  static const int _vitaminAReminderId = 7001;
  static const int _dewormingReminderId = 7002;

  static const AndroidNotificationDetails _androidDetails =
      AndroidNotificationDetails(
    'kia_reminder_channel',
    'Pengingat Suplemen Anak',
    channelDescription:
        'Notifikasi pengingat vitamin A dan obat cacing untuk anak',
    importance: Importance.max,
    priority: Priority.high,
  );

  static const DarwinNotificationDetails _darwinDetails =
      DarwinNotificationDetails();

  static Future<void> initialize() async {
    const initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const initializationSettingsDarwin = DarwinInitializationSettings();

    const initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsDarwin,
    );

    await _notificationsPlugin.initialize(initializationSettings);

    tz.initializeTimeZones();
    await _setLocalTimezone();

    final androidPlatform =
        _notificationsPlugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();
    await androidPlatform?.requestNotificationsPermission();
    await androidPlatform?.requestExactAlarmsPermission();

    final iosPlatform =
        _notificationsPlugin.resolvePlatformSpecificImplementation<
            IOSFlutterLocalNotificationsPlugin>();
    await iosPlatform?.requestPermissions(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  static Future<void> _setLocalTimezone() async {
    try {
      final String timezoneName = await FlutterTimezone.getLocalTimezone();
      tz.setLocalLocation(tz.getLocation(timezoneName));
    } catch (_) {
      tz.setLocalLocation(tz.getLocation('UTC'));
    }
  }

  static Future<void> scheduleReminder({
    required int id,
    required String title,
    required String body,
    required DateTime scheduleDate,
  }) async {
    final DateTime adjustedDate = scheduleDate.isBefore(DateTime.now())
        ? DateTime.now().add(const Duration(minutes: 1))
        : scheduleDate;

    const notificationDetails = NotificationDetails(
      android: _androidDetails,
      iOS: _darwinDetails,
    );

    await _notificationsPlugin.zonedSchedule(
      id,
      title,
      body,
      tz.TZDateTime.from(adjustedDate, tz.local),
      notificationDetails,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
    );
  }

  static Future<void> scheduleTumbuhReminders() async {
    await _notificationsPlugin.cancel(_vitaminAReminderId);
    await _notificationsPlugin.cancel(_dewormingReminderId);

    const notificationDetails = NotificationDetails(
      android: _androidDetails,
      iOS: _darwinDetails,
    );

    await _notificationsPlugin.show(
      _vitaminAReminderId,
      'Pengingat Vitamin A',
      'Ingat, vitamin A diberikan setiap bulan untuk anak.',
      notificationDetails,
    );

    await _notificationsPlugin.show(
      _dewormingReminderId,
      'Pengingat Obat Cacing',
      'Ingat, obat cacing diberikan setiap 6 bulan sekali.',
      notificationDetails,
    );
  }

  static Future<void> cancelReminder(int id) async {
    await _notificationsPlugin.cancel(id);
  }

  static Future<void> cancelTumbuhReminders() async {
    await _notificationsPlugin.cancel(_vitaminAReminderId);
    await _notificationsPlugin.cancel(_dewormingReminderId);
  }
}
