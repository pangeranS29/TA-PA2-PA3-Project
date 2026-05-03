// [MODUL: ANAK - Shared Widget]
// Loading, error, dan empty state yang dipakai berulang di:
// - PilihAnakScreen, InformasiUmumScreen, DetailPertumbuhanScreen,
//   CariAnakScreen, HalamanUtamaMpasiScreen, dan screen-screen lain.
//
// Tiga widget terpisah agar fleksibel dipakai sesuai kebutuhan:
//   1. AnakLoadingView   — spinner saat data sedang dimuat
//   2. AnakErrorView     — tampilan error dengan tombol retry
//   3. AnakEmptyView     — tampilan kosong (belum ada data)
//
// CARA PAKAI:
//
//   // Loading
//   if (isLoading) return const AnakLoadingView();
//
//   // Error
//   if (hasError) return AnakErrorView(
//     message: errorMessage,
//     onRetry: _loadData,
//   );
//
//   // Empty
//   if (list.isEmpty) return const AnakEmptyView(
//     message: 'Belum ada data pertumbuhan',
//   );
//
//   // Atau pakai di FutureBuilder:
//   if (snapshot.connectionState == ConnectionState.waiting)
//     return const AnakLoadingView();
//   if (snapshot.hasError)
//     return AnakErrorView(message: snapshot.error.toString(), onRetry: _reload);

import 'package:flutter/material.dart';

// ─────────────────────────────────────────────
// 1. Loading State
// ─────────────────────────────────────────────
class AnakLoadingView extends StatelessWidget {
  final String? message;

  const AnakLoadingView({Key? key, this.message}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(
              color: Color(0xFF2196F3),
            ),
            if (message != null) ...[
              const SizedBox(height: 16),
              Text(
                message!,
                style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                textAlign: TextAlign.center,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// 2. Error State
// ─────────────────────────────────────────────
class AnakErrorView extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;
  final String retryLabel;

  const AnakErrorView({
    Key? key,
    required this.message,
    this.onRetry,
    this.retryLabel = 'Coba Lagi',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.error_outline, size: 40, color: Colors.red.shade400),
            ),
            const SizedBox(height: 16),
            const Text(
              'Terjadi Kesalahan',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 20),
              FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh, size: 18),
                label: Text(retryLabel),
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFF2196F3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// 3. Empty State
// ─────────────────────────────────────────────
class AnakEmptyView extends StatelessWidget {
  final String message;
  final IconData icon;
  final VoidCallback? onAction;
  final String? actionLabel;

  const AnakEmptyView({
    Key? key,
    required this.message,
    this.icon = Icons.inbox_outlined,
    this.onAction,
    this.actionLabel,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 40, color: Colors.blue.shade300),
            ),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
            if (onAction != null && actionLabel != null) ...[
              const SizedBox(height: 20),
              OutlinedButton(
                onPressed: onAction,
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF2196F3)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(actionLabel!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}