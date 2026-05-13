import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/master_standar_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/pertumbuhan_model.dart';

class _C {
  static const primary = Color(0xFF1A73E8);
  static const accent = Color(0xFF34A853);
  static const warning = Color(0xFFF9AB00);
  static const danger = Color(0xFFD93025);
  static const border = Color(0xFFE0E7F0);
  static const textSub = Color(0xFF6B7C93);
  static const zone = Color(0xFFE3F2FD); // zona normal (±2 SD)
  static const zoneEdge = Color(0xFF90CAF9);
}

class GrowthChartWidget extends StatelessWidget {
  final List<PertumbuhanModel> riwayatPertumbuhan;
  final List<MasterStandarModel> masterStandar;
  final String yAxisLabel;
  final String selectedTab;
  final String xAxisLabel;

  const GrowthChartWidget({
    Key? key,
    required this.riwayatPertumbuhan,
    required this.masterStandar,
    required this.yAxisLabel,
    required this.selectedTab,
    required this.xAxisLabel,
  }) : super(key: key);

  /// Helper: Mengurutkan riwayat agar sinkron dengan index di grafik
  List<PertumbuhanModel> get _sortedRiwayat {
    final sorted = List<PertumbuhanModel>.from(riwayatPertumbuhan);
    sorted.sort((a, b) {
      double aX = selectedTab == 'BB/TB' ? a.tinggiBadan : a.usiaUkurBulan.toDouble();
      double bX = selectedTab == 'BB/TB' ? b.tinggiBadan : b.usiaUkurBulan.toDouble();
      return aX.compareTo(bX);
    });
    return sorted;
  }

  /// Ekstrak data anak ke bentuk titik (FlSpot)
  List<FlSpot> _getChildDataLine() {
    final sorted = _sortedRiwayat;
    if (sorted.isEmpty) return [];

    return sorted.map((r) {
      double xValue = selectedTab == 'BB/TB' ? r.tinggiBadan : r.usiaUkurBulan.toDouble();
      double yValue;

      switch (selectedTab) {
        case 'TB/U': yValue = r.tinggiBadan; break;
        case 'IMT/U': yValue = r.imt; break;
        case 'LK/U': yValue = r.lingkarKepala; break;
        case 'BB/U':
        case 'BB/TB':
        default: yValue = r.beratBadan; break;
      }
      return FlSpot(xValue, yValue);
    }).toList();
  }

  /// Helper untuk mengambil nilai Z-Score
  double _getZScoreForTab(PertumbuhanModel data) {
    switch (selectedTab) {
      case 'TB/U': return data.zScoreTBU;
      case 'BB/TB': return data.zScoreBBTB;
      case 'IMT/U': return data.zScoreIMTU;
      case 'LK/U': return data.zScoreLKU;
      case 'BB/U':
      default: return data.zScoreBBU;
    }
  }

  Color _dotStrokeFromZ(double z) {
    final az = z.abs();
    if (az <= 2) return _C.accent;
    if (az <= 3) return _C.warning;
    return _C.danger;
  }

  /// Helper untuk garis standar WHO
  List<FlSpot> _getLine(double Function(MasterStandarModel) selector) {
    if (masterStandar.isEmpty) return [];
    return masterStandar.map((m) => FlSpot(m.nilaiSumbuX, selector(m))).toList();
  }

  /// Menentukan batas maksimal/minimal grafik agar pas di layar
  Map<String, dynamic> _getAxisRanges() {
    const xBufferMonth = 2.0;
    const xBufferCm = 5.0;
    final childData = _getChildDataLine();

    double minX;
    double maxX;
    if (selectedTab == 'BB/TB') {
      minX = 45.0;
      final masterMax = masterStandar.isNotEmpty ? masterStandar.last.nilaiSumbuX : 120.0;
      final lastX = childData.isNotEmpty ? childData.last.x : minX;
      maxX = (lastX + xBufferCm) > masterMax ? (lastX + xBufferCm) : masterMax;
      if (maxX < 120.0) maxX = 120.0;
    } else {
      minX = 0.0;
      final masterMax = masterStandar.isNotEmpty ? masterStandar.last.nilaiSumbuX : 60.0;
      final lastX = childData.isNotEmpty ? childData.last.x : 0.0;
      maxX = (lastX + xBufferMonth) > masterMax ? (lastX + xBufferMonth) : masterMax;
      if (maxX < 24.0) maxX = 24.0;
    }

    double minY = double.infinity;
    double maxY = -double.infinity;
    final allSpots = [
      ..._getLine((m) => m.sd3Neg),
      ..._getLine((m) => m.sd3Pos),
      ...childData,
    ];

    if (allSpots.isEmpty) {
      return {'minX': minX, 'maxX': maxX, 'minY': 0.0, 'maxY': 20.0};
    }

    for (final spot in allSpots) {
      if (spot.y < minY) minY = spot.y;
      if (spot.y > maxY) maxY = spot.y;
    }

    final pad = (maxY - minY) <= 5 ? 1.5 : 2.5;
    return {
      'minX': minX,
      'maxX': maxX,
      'minY': (minY - pad).clamp(0.0, double.infinity),
      'maxY': maxY + pad,
    };
  }

  @override
  Widget build(BuildContext context) {
    final childData = _getChildDataLine();
    final sortedRiwayat = _sortedRiwayat;
    final ranges = _getAxisRanges();

    // Order penting untuk shading zone (betweenBarsData)
    final barData = <LineChartBarData>[
      // +2 SD (index 0)
      LineChartBarData(
        spots: _getLine((m) => m.sd2Pos),
        color: _C.zoneEdge,
        barWidth: 1.3,
        isCurved: true,
        dashArray: [6, 4],
        dotData: const FlDotData(show: false),
      ),
      // -2 SD (index 1)
      LineChartBarData(
        spots: _getLine((m) => m.sd2Neg),
        color: _C.zoneEdge,
        barWidth: 1.3,
        isCurved: true,
        dashArray: [6, 4],
        dotData: const FlDotData(show: false),
      ),
      // +3 SD (index 2)
      LineChartBarData(
        spots: _getLine((m) => m.sd3Pos),
        color: _C.danger.withOpacity(0.75),
        barWidth: 1.6,
        isCurved: true,
        dashArray: [8, 5],
        dotData: const FlDotData(show: false),
      ),
      // -3 SD (index 3)
      LineChartBarData(
        spots: _getLine((m) => m.sd3Neg),
        color: _C.danger.withOpacity(0.75),
        barWidth: 1.6,
        isCurved: true,
        dashArray: [8, 5],
        dotData: const FlDotData(show: false),
      ),
      // Median (index 4)
      LineChartBarData(
        spots: _getLine((m) => m.median),
        color: _C.accent,
        barWidth: 1.6,
        isCurved: true,
        dashArray: [6, 4],
        dotData: const FlDotData(show: false),
      ),
      // Data Anak (index 5)
      if (childData.isNotEmpty)
        LineChartBarData(
          spots: childData,
          color: _C.primary,
          barWidth: 2.8,
          isCurved: true,
          curveSmoothness: 0.25,
          shadow: const Shadow(
            color: Color(0x331A73E8),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
          dotData: FlDotData(
            show: true,
            getDotPainter: (spot, _, __, ___) {
              final eps = selectedTab == 'BB/TB' ? 0.05 : 0.001;
              final match = sortedRiwayat.firstWhere(
                (r) {
                  final x = selectedTab == 'BB/TB'
                      ? r.tinggiBadan
                      : r.usiaUkurBulan.toDouble();
                  return (x - spot.x).abs() <= eps;
                },
                orElse: () => sortedRiwayat.first,
              );
              final z = _getZScoreForTab(match);
              final stroke = _dotStrokeFromZ(z);
              return FlDotCirclePainter(
                radius: 5.2,
                color: Colors.white,
                strokeWidth: 2.8,
                strokeColor: stroke,
              );
            },
          ),
        ),
    ];

    // Jika masterStandar kosong, kita tetap menggambar data anak saja.
    // _getLine() dan helper lain sudah aman menangani daftar kosong.

    // Interval X sederhana biar label tidak bertumpuk
    final xRange = (ranges['maxX'] as double) - (ranges['minX'] as double);
    final xInterval = selectedTab == 'BB/TB'
        ? (xRange <= 40 ? 5.0 : 10.0)
        : (xRange <= 24 ? 2.0 : xRange <= 60 ? 6.0 : 12.0);

    return LineChart(
      LineChartData(
        minX: ranges['minX'],
        maxX: ranges['maxX'],
        minY: ranges['minY'],
        maxY: ranges['maxY'],
        clipData: const FlClipData.all(),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: true,
          horizontalInterval: 1,
          verticalInterval: xInterval,
          getDrawingHorizontalLine: (_) => FlLine(
            color: _C.border.withOpacity(0.7),
            strokeWidth: 0.8,
          ),
          getDrawingVerticalLine: (_) => FlLine(
            color: _C.border.withOpacity(0.4),
            strokeWidth: 0.8,
          ),
        ),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            axisNameWidget: Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Text(
                yAxisLabel,
                style: const TextStyle(fontSize: 9, color: _C.textSub),
              ),
            ),
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 44,
              getTitlesWidget: (v, _) => Text(
                v.toStringAsFixed(0),
                style: const TextStyle(fontSize: 10, color: _C.textSub),
              ),
            ),
          ),
          bottomTitles: AxisTitles(
            axisNameWidget: Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(
                xAxisLabel,
                style: const TextStyle(fontSize: 9, color: _C.textSub),
              ),
            ),
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 28,
              interval: xInterval,
              getTitlesWidget: (v, _) => Text(
                v.toInt().toString(),
                style: const TextStyle(fontSize: 10, color: _C.textSub),
              ),
            ),
          ),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        borderData: FlBorderData(
          show: true,
          border: const Border(
            left: BorderSide(color: _C.border, width: 1),
            bottom: BorderSide(color: _C.border, width: 1),
          ),
        ),
        betweenBarsData: [
          BetweenBarsData(
            fromIndex: 0,
            toIndex: 1,
            color: _C.zone.withOpacity(0.8),
          ),
        ],
        lineBarsData: barData,
        lineTouchData: LineTouchData(enabled: false),
      ),
      duration: const Duration(milliseconds: 350),
    );
  }
}