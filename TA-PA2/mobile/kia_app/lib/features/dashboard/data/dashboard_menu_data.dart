import 'package:flutter/material.dart';
import 'dashboard_menu_item.dart';

class DashboardMenuData {
  static List<Map<String, dynamic>> hamilMenuItems = [
    {
      'title': 'Kehamilan Trimester 1–3',
      'subtitle': 'Pantau perkembangan kehamilan',
      'icon': Icons.favorite_outline,
      'color': Colors.pink,
    },
    {
      'title': 'Persalinan',
      'subtitle': 'Persiapan & proses persalinan',
      'icon': Icons.child_care_outlined,
      'color': Colors.blue,
    },
  ];

  static List<Map<String, dynamic>> hamilQuickMenuItems = [
    {
      'label': 'Grafik BB Ibu',
      'icon': Icons.show_chart,
      'color': Colors.blue,
      'key': 'bb_ibu',
    },
    {
      'label': 'Grafik DJJ & TFU',
      'icon': Icons.monitor_heart_outlined,
      'color': Colors.purple,
      'key': 'djj_tfu',
    },
    {
      'label': 'Absensi Kelas',
      'icon': Icons.event_available_outlined,
      'color': Colors.green,
      'key': 'absensi',
    },
    {
      'label': 'Catatan',
      'icon': Icons.assignment_outlined,
      'color': Colors.indigo,
      'key': 'catatan',
    },
  ];

  static List<Map<String, dynamic>> tumbuhQuickMenuItems = [
    {
      'label': 'Pertumbuhan',
      'icon': Icons.scale,
      'color': Colors.orange,
      'key': 'pertumbuhan',
    },
    {
      'label': 'Imunisasi',
      'icon': Icons.shield,
      'color': Colors.green,
      'key': 'imunisasi',
    },
    {
      'label': 'MPASI',
      'icon': Icons.restaurant_menu,
      'color': Colors.blue,
      'key': 'mpasi',
    },
    {
      'label': 'Edukasi',
      'icon': Icons.menu_book,
      'color': Colors.orange,
      'key': 'edukasi',
    },
    {
      'label': 'Catatan',
      'icon': Icons.note,
      'color': Colors.red,
      'key': 'catatan',
    },
    {
      'label': 'Bahaya',
      'icon': Icons.warning,
      'color': Colors.orange,
      'key': 'bahaya',
    },
  ];

  static List<Map<String, dynamic>> phases = [
    {'label': 'Hamil', 'icon': Icons.favorite_border},
    {'label': 'Nifas', 'icon': Icons.person_outline},
    {'label': 'Menyusui', 'icon': Icons.child_care},
    {'label': 'Tumbuh', 'icon': Icons.emoji_emotions_outlined},
  ];
}
