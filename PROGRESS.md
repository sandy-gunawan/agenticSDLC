# Status pelaksanaan

| Phase | Status | Bukti / pekerjaan tersisa |
|---|---|---|
| 0 | Lokal | Target personal `sandy-gunawan/agenticSDLC` public, kosong, dan akses tulis terverifikasi. Push pertama menunggu baseline siap. |
| 1 | Lokal terverifikasi | Node 20: lint, 23 unit/API test, dan tiga alur Playwright lulus; workflow CI disiapkan. |
| 2 | Belum | Baseline latihan P1–P15. |
| 3 | Belum | Issue, aturan bisnis, dan skrip seed. |
| 4 | Belum | Custom instructions, agent, skill, dan hook. |
| 5 | Belum | Agentic Workflows dan uji GitHub. |
| 6 | Belum | Tooling demo, screenshot, metrics, dan reset. |
| 7 | Belum | Baseline, branch dan pengaturan GitHub, varian bare. |
| 8 | Belum | Dry-run dan bukti. |
| 9 | Belum | Situs offline dan GitHub Pages. |

## Keputusan

- `sandy-gunawan/agenticSDLC` adalah repo full. Hanya inisialisasi `main` yang kosong. Jangan mengubah visibilitas, merge PR, atau force-push `main`.
- App hanya untuk latihan lokal dengan data fiktif. Jangan publikasikan server atau memakai data dan kredensial sebenarnya untuk skenario.
- UI aplikasi dan situs memakai CSS lokal agar demo tidak bergantung CDN. SQLite memakai query berparameter; laporan keamanan contoh tidak bisa dijalankan sebagai kode.
