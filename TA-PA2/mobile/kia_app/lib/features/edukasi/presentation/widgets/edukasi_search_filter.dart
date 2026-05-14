import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/core/constants/app_colors.dart';

class EdukasiSearchFilter extends StatelessWidget {

  final String selectedCategory;

  final Function(String) onCategorySelected;
  final Function(String) onSearchChanged;

  final List<String> categories;

  const EdukasiSearchFilter({
    super.key,
    required this.selectedCategory,
    required this.onCategorySelected,
    required this.categories,
    required this.onSearchChanged,
  });

  @override
  Widget build(BuildContext context) {

    return Column(
      children: [

        Container(
          height: 48,

          decoration: BoxDecoration(
            color: Colors.white,

            borderRadius:
                BorderRadius.circular(30),

            border: Border.all(
              color: Colors.grey.shade200,
            ),
          ),

          child: Row(
            children: [

              const SizedBox(width: 14),

              Icon(
                Icons.search,
                color: Colors.grey.shade500,
                size: 20,
              ),

              const SizedBox(width: 10),

              Expanded(
                child: TextField(
                  onChanged: onSearchChanged,
                  decoration: InputDecoration(
                    hintText:
                        'Cari edukasi disini...',

                    hintStyle: TextStyle(
                      color: Colors.grey.shade500,
                      fontSize: 13,
                    ),

                    border: InputBorder.none,

                    isCollapsed: true,
                  ),
                ),
              ),

              Container(
                margin: const EdgeInsets.only(
                  right: 10,
                ),

                padding: const EdgeInsets.all(6),

                decoration: BoxDecoration(
                  color: Colors.grey.shade100,

                  shape: BoxShape.circle,
                ),

                child: Icon(
                  Icons.tune,
                  size: 18,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        SingleChildScrollView(
          scrollDirection: Axis.horizontal,

          child: Row(
            children: categories.map((category) {

              final bool isSelected =
                  selectedCategory == category;

              return GestureDetector(
                onTap: () {
                  onCategorySelected(category);
                },

                child: AnimatedContainer(
                  duration: const Duration(
                    milliseconds: 200,
                  ),

                  margin:
                      const EdgeInsets.only(
                    right: 10,
                  ),

                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 9,
                  ),

                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary
                        : Colors.white,

                    borderRadius:
                        BorderRadius.circular(
                      30,
                    ),

                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : Colors.grey.shade300,
                    ),
                  ),

                  child: Text(
                    category,

                    style: TextStyle(
                      fontSize: 12,

                      fontWeight:
                          FontWeight.w600,

                      color: isSelected
                          ? Colors.white
                          : Colors.black87,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}