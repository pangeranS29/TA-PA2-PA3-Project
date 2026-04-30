import 'package:flutter/material.dart';

class DashboardQuickMenu extends StatelessWidget {
  final List<Map<String, dynamic>> items;
  final int crossAxisCount;
  final double childAspectRatio;

  const DashboardQuickMenu({
    super.key,
    required this.items,
    this.crossAxisCount = 2,
    this.childAspectRatio = 2.0,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        childAspectRatio: childAspectRatio,
      ),
      itemCount: items.length,
      itemBuilder: (context, i) {
        final item = items[i];
        return InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: item['onTap'] as VoidCallback? ?? () {},
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 6,
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  item['icon'] as IconData,
                  color: item['color'] as Color,
                  size: 24,
                ),
                const SizedBox(height: 6),
                Text(
                  item['label'] as String,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

/// Grid menu untuk konten Tumbuh (3 kolom, ikon + teks)
class DashboardTumbuhQuickMenu extends StatelessWidget {
  final List<Map<String, dynamic>> items;

  const DashboardTumbuhQuickMenu({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      crossAxisCount: 3,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      children: items.map((item) {
        return InkWell(
          onTap: item['onTap'] as VoidCallback? ?? () {},
          borderRadius: BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 6,
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(item['icon'] as IconData,
                    color: item['color'] as Color),
                const SizedBox(height: 6),
                Text(
                  item['label'] as String,
                  style: const TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
