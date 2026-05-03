import 'package:flutter/material.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/services/log_ttd_mms_api_service.dart';
import 'package:ta_pa2_pa3_project/features/ibu/hamil/data/models/log_ttd_mms_model.dart';

class LogTTDMMSScreen extends StatefulWidget {
  const LogTTDMMSScreen({super.key});

  @override
  State<LogTTDMMSScreen> createState() => _LogTTDMMSScreenState();
}

class _LogTTDMMSScreenState extends State<LogTTDMMSScreen> {
  static const int _totalBulan = 10;
  static const int _totalHari = 31;

  final _apiService = LogTTDMMSApiService();

  final Set<String> _checkedDays = {};
  bool _isLoading = false;
  bool _isSaving = false;
  int _selectedBulan = 1;

  String _key(int bulan, int hari) => '$bulan-$hari';

  @override
  void initState() {
    super.initState();
    _loadLog();
  }

  @override
  void dispose() {
    _apiService.dispose();
    super.dispose();
  }

  Future<void> _loadLog() async {
    setState(() => _isLoading = true);

    try {
      final logs = await _apiService.getMine();

      _checkedDays.clear();

      for (final item in logs) {
        if (item.sudahDiminum) {
          _checkedDays.add(_key(item.bulanKe, item.hariKe));
        }
      }
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _toggleDay(int hari) async {
    if (_isSaving) return;

    final key = _key(_selectedBulan, hari);
    final newValue = !_checkedDays.contains(key);

    setState(() {
      _isSaving = true;

      if (newValue) {
        _checkedDays.add(key);
      } else {
        _checkedDays.remove(key);
      }
    });

    try {
      await _apiService.save(
        LogTTDMMSModel(
          bulanKe: _selectedBulan,
          hariKe: hari,
          sudahDiminum: newValue,
        ),
      );
    } catch (e) {
      setState(() {
        if (newValue) {
          _checkedDays.remove(key);
        } else {
          _checkedDays.add(key);
        }
      });

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  int get _checkedThisMonth {
    int count = 0;

    for (int hari = 1; hari <= _totalHari; hari++) {
      if (_checkedDays.contains(_key(_selectedBulan, hari))) {
        count++;
      }
    }

    return count;
  }

  int get _checkedTotal => _checkedDays.length;

  double get _monthProgress => _checkedThisMonth / _totalHari;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FC),
      appBar: AppBar(
        title: const Text('Log TTD/MMS'),
        backgroundColor: const Color(0xFF2F80ED),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadLog,
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  _buildHeaderCard(),
                  const SizedBox(height: 16),
                  _buildMonthSelector(),
                  const SizedBox(height: 16),
                  _buildCalendarCard(),
                  const SizedBox(height: 20),
                  _buildInfoCard(),
                ],
              ),
            ),
    );
  }

  Widget _buildHeaderCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xFF2F80ED),
            Color(0xFF56CCF2),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2F80ED).withOpacity(0.22),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.medication_liquid_outlined, color: Colors.white),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Tablet Tambah Darah / MMS',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Centang setiap hari setelah ibu meminum TTD/MMS.',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 13,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              _buildStatPill(
                label: 'Bulan $_selectedBulan',
                value: '$_checkedThisMonth/$_totalHari hari',
              ),
              const SizedBox(width: 10),
              _buildStatPill(
                label: 'Total',
                value: '$_checkedTotal hari',
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: _monthProgress,
              backgroundColor: Colors.white24,
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatPill({
    required String label,
    required String value,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.16),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white24),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(color: Colors.white70, fontSize: 11),
            ),
            const SizedBox(height: 3),
            Text(
              value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthSelector() {
    return SizedBox(
      height: 46,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _totalBulan,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final bulan = index + 1;
          final selected = bulan == _selectedBulan;

          return InkWell(
            borderRadius: BorderRadius.circular(999),
            onTap: () {
              setState(() => _selectedBulan = bulan);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: selected ? const Color(0xFF2F80ED) : Colors.white,
                borderRadius: BorderRadius.circular(999),
                border: Border.all(
                  color: selected
                      ? const Color(0xFF2F80ED)
                      : const Color(0xFFD7DEE9),
                ),
              ),
              child: Text(
                'Bulan $bulan',
                style: TextStyle(
                  color: selected ? Colors.white : const Color(0xFF172033),
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildCalendarCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFE5ECF6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.035),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Checklist Harian',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF172033),
                  ),
                ),
              ),
              if (_isSaving)
                const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Bulan ke-$_selectedBulan kehamilan',
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF7B8798),
            ),
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _totalHari,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
              childAspectRatio: 1,
            ),
            itemBuilder: (context, index) {
              final hari = index + 1;
              final checked = _checkedDays.contains(_key(_selectedBulan, hari));

              return InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () => _toggleDay(hari),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 160),
                  decoration: BoxDecoration(
                    color: checked
                        ? const Color(0xFF2F80ED)
                        : const Color(0xFFF6F8FC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: checked
                          ? const Color(0xFF2F80ED)
                          : const Color(0xFFD7DEE9),
                    ),
                  ),
                  child: Center(
                    child: checked
                        ? const Icon(
                            Icons.check,
                            color: Colors.white,
                            size: 18,
                          )
                        : Text(
                            '$hari',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF172033),
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E7),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFFE1A6)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.info_outline,
            color: Color(0xFFE0A300),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              'Checklist ini membantu memantau kepatuhan minum TTD/MMS selama masa kehamilan.',
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF6B5A2A),
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
