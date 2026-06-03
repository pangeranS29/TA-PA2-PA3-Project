import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/master_standar_model.dart';
import 'package:ta_pa2_pa3_project/features/anak/pertumbuhan/data/models/pertumbuhan_model.dart';

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

<<<<<<< HEAD
=======
  double _roundDownToStep(double value, double step) {
    return (value / step).floor() * step;
  }

  double _roundUpToStep(double value, double step) {
    return (value / step).ceil() * step;
  }

  Color _statusColor(String status) {
    final lower = status.toLowerCase();
    if (lower.contains('baik') || lower.contains('normal')) {
      return const Color(0xFF10B981);
    }
    if (lower.contains('kurang') ||
        lower.contains('risiko') ||
        lower.contains('pendek')) {
      return const Color(0xFFF59E0B);
    }
    if (lower.contains('buruk') ||
        lower.contains('sangat') ||
        lower.contains('stunting') ||
        lower.contains('obesitas')) {
      return const Color(0xFFEF4444);
    }
    return const Color(0xFF2563EB);
  }

>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
  /// Helper: Mengurutkan riwayat agar sinkron dengan index di grafik
  List<PertumbuhanModel> get _sortedRiwayat {
    final sorted = List<PertumbuhanModel>.from(riwayatPertumbuhan);
    sorted.sort((a, b) {
<<<<<<< HEAD
      double aX = selectedTab == 'BB/TB' ? a.tinggiBadan : a.usiaUkurBulan.toDouble();
      double bX = selectedTab == 'BB/TB' ? b.tinggiBadan : b.usiaUkurBulan.toDouble();
=======
      double aX =
          selectedTab == 'BB/TB' ? a.tinggiBadan : a.usiaUkurBulan.toDouble();
      double bX =
          selectedTab == 'BB/TB' ? b.tinggiBadan : b.usiaUkurBulan.toDouble();
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
      return aX.compareTo(bX);
    });
    return sorted;
  }

  /// Ekstrak data anak ke bentuk titik (FlSpot)
  List<FlSpot> _getChildDataLine() {
    final sorted = _sortedRiwayat;
    if (sorted.isEmpty) return [];

    return sorted.map((r) {
<<<<<<< HEAD
      double xValue = selectedTab == 'BB/TB' ? r.tinggiBadan : r.usiaUkurBulan.toDouble();
      double yValue;

      switch (selectedTab) {
        case 'TB/U': yValue = r.tinggiBadan; break;
        case 'IMT/U': yValue = r.imt; break;
        case 'LK/U': yValue = r.lingkarKepala; break;
        case 'BB/U':
        case 'BB/TB':
        default: yValue = r.beratBadan; break;
=======
      double xValue =
          selectedTab == 'BB/TB' ? r.tinggiBadan : r.usiaUkurBulan.toDouble();
      double yValue;

      switch (selectedTab) {
        case 'TB/U':
          yValue = r.tinggiBadan;
          break;
        case 'IMT/U':
          yValue = r.imt;
          break;
        case 'LK/U':
          yValue = r.lingkarKepala;
          break;
        case 'BB/U':
        case 'BB/TB':
        default:
          yValue = r.beratBadan;
          break;
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
      }
      return FlSpot(xValue, yValue);
    }).toList();
  }

  /// Helper untuk mengambil nilai Z-Score
  double _getZScoreForTab(PertumbuhanModel data) {
    switch (selectedTab) {
<<<<<<< HEAD
      case 'TB/U': return data.zScoreTBU;
      case 'BB/TB': return data.zScoreBBTB;
      case 'IMT/U': return data.zScoreIMTU;
      case 'LK/U': return data.zScoreLKU;
      case 'BB/U':
      default: return data.zScoreBBU;
=======
      case 'TB/U':
        return data.zScoreTBU;
      case 'BB/TB':
        return data.zScoreBBTB;
      case 'IMT/U':
        return data.zScoreIMTU;
      case 'LK/U':
        return data.zScoreLKU;
      case 'BB/U':
      default:
        return data.zScoreBBU;
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    }
  }

  /// Helper untuk garis standar WHO
  List<FlSpot> _getLine(double Function(MasterStandarModel) selector) {
    if (masterStandar.isEmpty) return [];
<<<<<<< HEAD
    return masterStandar.map((m) => FlSpot(m.nilaiSumbuX, selector(m))).toList();
=======
    return masterStandar
        .map((m) => FlSpot(m.nilaiSumbuX, selector(m)))
        .toList();
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
  }

  /// Menentukan batas maksimal/minimal grafik agar pas di layar
  Map<String, dynamic> _getAxisRanges() {
<<<<<<< HEAD
    double minX = selectedTab == 'BB/TB' ? 45.0 : 0.0;
    double maxX = selectedTab == 'BB/TB' ? 120.0 : (masterStandar.isNotEmpty ? masterStandar.last.nilaiSumbuX : 60.0);
    double minY = double.infinity;
    double maxY = 0;

=======
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    final childData = _getChildDataLine();
    final allSpots = [
      ..._getLine((m) => m.sd3Neg),
      ..._getLine((m) => m.sd3Pos),
<<<<<<< HEAD
      ...childData
    ];

    if (allSpots.isEmpty) return {'minX': 0.0, 'maxX': 60.0, 'minY': 0.0, 'maxY': 20.0};
=======
      ...childData,
    ];

    if (allSpots.isEmpty) {
      return {'minX': 0.0, 'maxX': 60.0, 'minY': 0.0, 'maxY': 20.0};
    }

    final xStep = selectedTab == 'BB/TB' ? 5.0 : 6.0;
    final yStep = selectedTab == 'BB/TB' ? 0.5 : 1.0;

    final rawMinX =
        selectedTab == 'BB/TB' ? 45.0 : masterStandar.first.nilaiSumbuX;
    final rawMaxX =
        selectedTab == 'BB/TB' ? 120.0 : masterStandar.last.nilaiSumbuX;

    double minY = allSpots.first.y;
    double maxY = allSpots.first.y;
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c

    for (final spot in allSpots) {
      if (spot.y < minY) minY = spot.y;
      if (spot.y > maxY) maxY = spot.y;
    }

    return {
<<<<<<< HEAD
      'minX': minX,
      'maxX': maxX,
      'minY': (minY - 2).clamp(0.0, double.infinity),
      'maxY': maxY + 2
=======
      'minX': _roundDownToStep(rawMinX, xStep),
      'maxX': _roundUpToStep(rawMaxX, xStep),
      'minY':
          _roundDownToStep((minY - yStep).clamp(0.0, double.infinity), yStep),
      'maxY': _roundUpToStep(maxY + yStep, yStep),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
    };
  }

  @override
  Widget build(BuildContext context) {
    final childData = _getChildDataLine();
    final sortedRiwayat = _sortedRiwayat;
    final ranges = _getAxisRanges();

    // Setup Bar/Garis
    final barData = [
<<<<<<< HEAD
      LineChartBarData(spots: _getLine((m) => m.sd3Neg), color: Colors.black54, barWidth: 1.5, isCurved: true, dashArray: [5, 5], dotData: const FlDotData(show: false)),
      LineChartBarData(spots: _getLine((m) => m.sd3Pos), color: Colors.black54, barWidth: 1.5, isCurved: true, dashArray: [5, 5], dotData: const FlDotData(show: false)),
      LineChartBarData(spots: _getLine((m) => m.sd2Neg), color: Colors.red.withOpacity(0.6), barWidth: 1.5, isCurved: true, dashArray: [4, 4], dotData: const FlDotData(show: false)),
      LineChartBarData(spots: _getLine((m) => m.sd2Pos), color: Colors.red.withOpacity(0.6), barWidth: 1.5, isCurved: true, dashArray: [4, 4], dotData: const FlDotData(show: false)),
      LineChartBarData(spots: _getLine((m) => m.median), color: const Color(0xFF22C55E), barWidth: 2, isCurved: true, dotData: const FlDotData(show: false)),
      
=======
      LineChartBarData(
          spots: _getLine((m) => m.sd3Neg),
          color: Colors.black54,
          barWidth: 1.5,
          isCurved: true,
          dashArray: [5, 5],
          dotData: const FlDotData(show: false)),
      LineChartBarData(
          spots: _getLine((m) => m.sd3Pos),
          color: Colors.black54,
          barWidth: 1.5,
          isCurved: true,
          dashArray: [5, 5],
          dotData: const FlDotData(show: false)),
      LineChartBarData(
          spots: _getLine((m) => m.sd2Neg),
          color: Colors.red.withOpacity(0.6),
          barWidth: 1.5,
          isCurved: true,
          dashArray: [4, 4],
          dotData: const FlDotData(show: false)),
      LineChartBarData(
          spots: _getLine((m) => m.sd2Pos),
          color: Colors.red.withOpacity(0.6),
          barWidth: 1.5,
          isCurved: true,
          dashArray: [4, 4],
          dotData: const FlDotData(show: false)),
      LineChartBarData(
          spots: _getLine((m) => m.median),
          color: const Color(0xFF22C55E),
          barWidth: 2,
          isCurved: true,
          dotData: const FlDotData(show: false)),

>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
      // Index 5: Data Anak (Garis Biru)
      if (childData.isNotEmpty)
        LineChartBarData(
          spots: childData,
          color: const Color(0xFF2563EB),
<<<<<<< HEAD
          barWidth: 2.5,
          isCurved: false, // Dibikin lurus seperti Gambar 1
          dotData: FlDotData(
            show: true,
            getDotPainter: (spot, percent, barData, index) => FlDotCirclePainter(
              radius: 4, color: const Color(0xFF2563EB), strokeWidth: 2, strokeColor: Colors.white,
=======
          barWidth: 3,
          isCurved: true,
          belowBarData: BarAreaData(
            show: true,
            color: const Color(0xFF2563EB).withOpacity(0.08),
          ),
          dotData: FlDotData(
            show: true,
            getDotPainter: (spot, percent, barData, index) =>
                FlDotCirclePainter(
              radius: 4.5,
              color: _statusColor(sortedRiwayat[index].statusBBU),
              strokeWidth: 2,
              strokeColor: Colors.white,
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
            ),
          ),
        ),
    ];

    // Ambil index keberapa garis anak berada
    final int childBarIndex = barData.length - 1;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
<<<<<<< HEAD
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
=======
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 6),
          )
        ],
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
<<<<<<< HEAD
          const Text('Grafik Pertumbuhan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87)),
          const SizedBox(height: 16),
          AspectRatio(
            aspectRatio: 1.5,
            child: masterStandar.isEmpty 
              ? Center(child: Text("Data standar $selectedTab belum tersedia", style: const TextStyle(color: Colors.grey)))
              : LineChart(
                  LineChartData(
                    gridData: FlGridData(
                      show: true,
                      drawVerticalLine: true,
                      getDrawingHorizontalLine: (value) => FlLine(color: Colors.grey.withOpacity(0.2), strokeWidth: 0.5),
                      getDrawingVerticalLine: (value) => FlLine(color: Colors.grey.withOpacity(0.2), strokeWidth: 0.5),
                    ),
                    titlesData: FlTitlesData(
                      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          reservedSize: 30,
                          getTitlesWidget: (value, meta) => Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(value.toInt().toString(), style: const TextStyle(fontSize: 10, color: Colors.grey)),
                          ),
                        ),
                      ),
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          reservedSize: 40,
                          getTitlesWidget: (value, meta) => Text(value.toStringAsFixed(1), style: const TextStyle(fontSize: 10, color: Colors.grey)),
                        ),
                      ),
                    ),
                    borderData: FlBorderData(
                      show: true,
                      border: Border(left: BorderSide(color: Colors.grey.shade300), bottom: BorderSide(color: Colors.grey.shade300)),
                    ),
                    minX: ranges['minX'], maxX: ranges['maxX'], minY: ranges['minY'], maxY: ranges['maxY'],
                    
                    // KONFIGURASI TOOLTIP (Teks melayang)
                    lineTouchData: LineTouchData(
                      enabled: false, // Matikan interaksi sentuh agar tidak muncul titik aneh pada garis standar (Gambar 2)
                      touchTooltipData: LineTouchTooltipData(
                        getTooltipColor: (_) => Colors.transparent, // Background tembus pandang (Seperti gambar 1)
                        tooltipPadding: const EdgeInsets.only(bottom: 2),
                        tooltipMargin: 4,
                        getTooltipItems: (touchedSpots) {
                          return touchedSpots.map((spot) {
                            // Ambil ZScore dari data asli
                            final dataAsli = sortedRiwayat[spot.spotIndex];
                            final zScore = _getZScoreForTab(dataAsli);
                            
                            // Format: Nilai Aktual \n Z-Score
                            return LineTooltipItem(
                              '${spot.y.toStringAsFixed(2)}\n(Z: ${zScore.toStringAsFixed(2)})',
                              const TextStyle(
                                color: Color(0xFF2563EB), // Warna biru sama seperti garis data anak
                                fontWeight: FontWeight.bold, 
                                fontSize: 11,
                                height: 1.2,
                              ),
                            );
                          }).toList();
                        },
                      ),
                    ),
                    // TAMPILKAN TEKS SECARA PERMANEN (Tidak perlu disentuh)
                    showingTooltipIndicators: childData.isNotEmpty 
                      ? childData.asMap().entries.map((entry) {
                          return ShowingTooltipIndicators([
                            LineBarSpot(barData[childBarIndex], childBarIndex, entry.value),
                          ]);
                        }).toList()
                      : [],
                    lineBarsData: barData,
                  ),
                ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 16,
            runSpacing: 8,
            children: [
              _buildLegendItem('Median', Colors.green, false),
              _buildLegendItem('Data Anak', const Color(0xFF2563EB), false),
              _buildLegendItem('±2 SD', Colors.red, true),
=======
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF1D4ED8).withOpacity(0.10),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.show_chart, color: Color(0xFF1D4ED8)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Grafik Pertumbuhan',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'KMS / WHO • $selectedTab',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          AspectRatio(
            aspectRatio: 1.15,
            child: masterStandar.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.insert_chart_outlined,
                            size: 40, color: Colors.grey.shade300),
                        const SizedBox(height: 8),
                        Text(
                          "Data standar $selectedTab belum tersedia",
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  )
                : LineChart(
                    LineChartData(
                      gridData: FlGridData(
                        show: true,
                        drawVerticalLine: true,
                        horizontalInterval: selectedTab == 'BB/TB' ? 0.5 : 1.0,
                        verticalInterval: selectedTab == 'BB/TB' ? 10.0 : 6.0,
                        getDrawingHorizontalLine: (value) => FlLine(
                          color: Colors.grey.withOpacity(0.16),
                          strokeWidth: 0.7,
                        ),
                        getDrawingVerticalLine: (value) => FlLine(
                          color: Colors.grey.withOpacity(0.12),
                          strokeWidth: 0.7,
                        ),
                      ),
                      titlesData: FlTitlesData(
                        rightTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: false)),
                        topTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: false)),
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            reservedSize: 30,
                            interval: selectedTab == 'BB/TB' ? 10.0 : 6.0,
                            getTitlesWidget: (value, meta) => Padding(
                              padding: const EdgeInsets.only(top: 8.0),
                              child: Text(
                                _formatBottomTitle(value),
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Colors.grey.shade600,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ),
                        leftTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            reservedSize: 40,
                            interval: selectedTab == 'BB/TB' ? 1.0 : 2.0,
                            getTitlesWidget: (value, meta) => Text(
                              value.toStringAsFixed(1),
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey.shade600,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ),
                      borderData: FlBorderData(
                        show: true,
                        border: Border(
                          left: BorderSide(color: Colors.grey.shade300),
                          bottom: BorderSide(color: Colors.grey.shade300),
                        ),
                      ),
                      minX: ranges['minX'],
                      maxX: ranges['maxX'],
                      minY: ranges['minY'],
                      maxY: ranges['maxY'],
                      lineTouchData: LineTouchData(
                        enabled: false,
                      ),
                      showingTooltipIndicators: const [],
                      lineBarsData: barData,
                    ),
                  ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 10,
            runSpacing: 8,
            children: [
              _buildLegendItem('Median', const Color(0xFF22C55E), false),
              _buildLegendItem('Data Anak', const Color(0xFF2563EB), false),
              _buildLegendItem('±2 SD', const Color(0xFFEF4444), true),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
              _buildLegendItem('±3 SD', Colors.black54, true),
            ],
          ),
          const SizedBox(height: 12),
<<<<<<< HEAD
          Text('Sumbu X: $xAxisLabel | Sumbu Y: $yAxisLabel', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
=======
          Text(
            'X: $xAxisLabel • Y: $yAxisLabel',
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w500,
            ),
          ),
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
        ],
      ),
    );
  }

<<<<<<< HEAD
  Widget _buildLegendItem(String label, Color color, bool isDashed) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 16, height: 3, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2))),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}
=======
  String _formatBottomTitle(double value) {
    if (selectedTab == 'BB/TB') {
      final rounded = value.round();
      if (rounded % 10 != 0 &&
          rounded != value.floor() &&
          rounded != value.ceil()) {
        return '';
      }
      return rounded.toString();
    }

    final rounded = value.round();
    if (rounded % 6 != 0) {
      return '';
    }
    return rounded.toString();
  }

  Widget _buildLegendItem(String label, Color color, bool isDashed) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 16,
            height: 3,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 6),
          Text(label,
              style: const TextStyle(fontSize: 12, color: Colors.black87)),
        ],
      ),
    );
  }
}
>>>>>>> 20e7bfab6fe8b17a1beeeb616d37b604ca56545c
