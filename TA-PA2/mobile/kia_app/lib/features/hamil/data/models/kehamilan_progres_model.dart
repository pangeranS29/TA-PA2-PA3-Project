enum TrimesterStatus { locked, active, completed }

class PregnancyProgress {
  final int currentWeek;
  final TrimesterStatus t1Status;
  final TrimesterStatus t2Status;
  final TrimesterStatus t3Status;

  PregnancyProgress({
    required this.currentWeek,
    this.t1Status = TrimesterStatus.active, // T1 mulai aktif secara default
    this.t2Status = TrimesterStatus.locked,
    this.t3Status = TrimesterStatus.locked,
  });
}