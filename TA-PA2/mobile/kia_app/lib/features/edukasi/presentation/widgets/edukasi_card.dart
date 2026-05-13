import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/constants/app_colors.dart';

class EdukasiCard extends StatelessWidget {
  final String title;
  final String duration;
  final String category;
  final VoidCallback onTap;

  const EdukasiCard({
    super.key,
    required this.title,
    required this.duration,
    required this.category,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isVideo = category == 'VIDEO';

    return GestureDetector(
      onTap: onTap,

      child: Container(
        margin: const EdgeInsets.only(bottom: 16),

        decoration: BoxDecoration(
          color: Colors.white,

          borderRadius: BorderRadius.circular(18),

          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),

        child: Column(
          children: [

            Container(
              height: 120,

              decoration: BoxDecoration(
                color: isVideo
                    ? const Color(0xFFDDEEFF)
                    : const Color(0xFFFFE9B3),

                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(18),
                ),
              ),

              child: Center(
                child: Icon(
                  isVideo
                      ? Icons.play_circle
                      : Icons.menu_book,

                  size: 50,

                  color: AppColors.primary,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(14),

              child: Row(
                children: [

                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),

                    decoration: BoxDecoration(
                      color: AppColors.primary,

                      borderRadius:
                          BorderRadius.circular(20),
                    ),

                    child: Text(
                      category,

                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),

                  const Spacer(),

                  Row(
                    children: [

                      const Icon(
                        Icons.access_time,
                        size: 15,
                        color: Colors.grey,
                      ),

                      const SizedBox(width: 4),

                      Text(
                        duration,

                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.only(
                left: 14,
                right: 14,
                bottom: 16,
              ),

              child: Align(
                alignment: Alignment.centerLeft,

                child: Text(
                  title,

                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}