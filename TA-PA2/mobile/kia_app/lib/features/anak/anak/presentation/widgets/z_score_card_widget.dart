// z_score_card_widget.dart :
import 'package:flutter/material.dart';

class _C {
  static const primary = Color(0xFF1A73E8);
  static const accent = Color(0xFF34A853);
  static const warning = Color(0xFFF9AB00);
  static const danger = Color(0xFFD93025);
  static const surface = Color(0xFFFFFFFF);
  static const border = Color(0xFFE0E7F0);
  static const textMain = Color(0xFF1C2B4A);
  static const textSub = Color(0xFF6B7C93);
}

class ZScoreCardWidget extends StatelessWidget {
  final double zScore;
  final String statusText;
  final String categoryLabel; // Contoh: "BB/U", "TB/U"

  const ZScoreCardWidget({
    Key? key,
    required this.zScore,
    required this.statusText,
    required this.categoryLabel,
  }) : super(key: key);

  String _fmtZ(double v) {
    if (v.isNaN) return '-';
    return v.toStringAsFixed(2);
  }

  _ZScoreInfo _getInfo() {
    // Normal WHO biasanya -2 SD s/d +2 SD.
    if (zScore.isNaN) {
      return _ZScoreInfo(
        color: _C.textSub,
        label: 'Belum dihitung',
        desc: 'Z-Score belum tersedia untuk pengukuran ini.',
      );
    }
    if (zScore < -3) {
      return _ZScoreInfo(
        color: _C.danger,
        label: 'Sangat di bawah normal',
        desc: 'Perlu evaluasi dan tindak lanjut oleh tenaga kesehatan.',
      );
    }
    if (zScore < -2) {
      return _ZScoreInfo(
        color: _C.warning,
        label: 'Di bawah normal',
        desc: 'Pantau pertumbuhan dan perbaiki asupan gizi.',
      );
    }
    if (zScore <= 2) {
      return _ZScoreInfo(
        color: _C.accent,
        label: 'Normal',
        desc: 'Pertumbuhan berada dalam rentang normal.',
      );
    }
    if (zScore <= 3) {
      return _ZScoreInfo(
        color: _C.warning,
        label: 'Di atas normal',
        desc: 'Perhatikan pola makan dan aktivitas sesuai anjuran.',
      );
    }
    return _ZScoreInfo(
      color: _C.danger,
      label: 'Sangat di atas normal',
      desc: 'Perlu evaluasi dan tindak lanjut oleh tenaga kesehatan.',
    );
  }

  @override
  Widget build(BuildContext context) {
    final info = _getInfo();

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _C.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _C.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.info_outline_rounded, size: 16, color: _C.primary),
              SizedBox(width: 6),
              Text(
                'Panduan Status Gizi',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: _C.textMain,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: Text(
                  '$categoryLabel • Z-Score ${_fmtZ(zScore)}',
                  style: const TextStyle(fontSize: 11, color: _C.textSub),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: info.color.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  info.label,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: info.color,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildRow(
            color: _C.accent,
            icon: Icons.check_circle_rounded,
            label: 'Normal',
            value: '-2 SD s/d +2 SD',
            desc: 'Pertumbuhan berada dalam rentang normal',
          ),
          const SizedBox(height: 8),
          _buildRow(
            color: _C.warning,
            icon: Icons.keyboard_arrow_down_rounded,
            label: 'Di bawah normal',
            value: '< -2 SD',
            desc: 'Perlu evaluasi asupan dan pemantauan',
          ),
          const SizedBox(height: 8),
          _buildRow(
            color: _C.danger,
            icon: Icons.keyboard_arrow_up_rounded,
            label: 'Di atas normal',
            value: '> +2 SD',
            desc: 'Perlu perhatian pada pola makan dan aktivitas',
          ),
          const SizedBox(height: 12),
          if (statusText.trim().isNotEmpty && statusText.trim() != '-') ...[
            const Divider(height: 1, color: _C.border),
            const SizedBox(height: 10),
            Text(
              'Status dari sistem: $statusText',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: _C.textMain,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              info.desc,
              style: const TextStyle(fontSize: 11, color: _C.textSub, height: 1.35),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildRow({
    required Color color,
    required IconData icon,
    required String label,
    required String value,
    required String desc,
  }) {
    return Row(
      children: [
        Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: color,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    value,
                    style: const TextStyle(fontSize: 11, color: _C.textSub),
                  ),
                ],
              ),
              Text(
                desc,
                style: const TextStyle(fontSize: 10, color: _C.textSub),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ZScoreInfo {
  final Color color;
  final String label;
  final String desc;

  _ZScoreInfo({
    required this.color,
    required this.label,
    required this.desc,
  });
}
