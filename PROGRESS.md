# Status pelaksanaan

| Phase | Status | Bukti / pekerjaan tersisa |
|---|---|---|
| 0 | Selesai | Push ke branch `workshop/clean-baseline` pada repo personal public berhasil; histori repo private tidak dipublikasikan. |
| 1 | Lokal terverifikasi | Node 20: lint, 23 unit/API test, dan tiga alur Playwright lulus pada baseline bersih. [Runner GitHub belum mulai](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45552784379). |
| 2 | Selesai lokal | Commit `seed(P1)`–`seed(P15)`. P10 dan P14 memakai fixture aman; P9 tidak mencatat PII. Jakarta lulus; LA hanya gagal di test P5 sesuai rencana. |
| 3 | Terbit | 16 issue dan aturan bisnis; S07 dibagi dua. S13 sengaja tanpa label. |
| 4 | Lokal | Custom instructions, tujuh agent, skill endpoint, hook lintas platform, dan setup Copilot. Dropdown cloud perlu sesi GitHub. |
| 5 | Belum | Agentic Workflows dan uji GitHub. |
| 6 | Belum | Tooling demo, screenshot, metrics, dan reset. |
| 7 | Belum | Baseline, branch dan pengaturan GitHub, varian bare. |
| 8 | Belum | Dry-run dan bukti. |
| 9 | Belum | Situs offline dan GitHub Pages. |

## Keputusan

- `sandy-gunawan/agenticSDLC` adalah repo full. Hanya inisialisasi `main` yang kosong. Jangan mengubah visibilitas, merge PR, atau force-push `main`.
- App hanya untuk latihan lokal dengan data fiktif. Jangan publikasikan server atau memakai data dan kredensial sebenarnya untuk skenario.
- UI aplikasi dan situs memakai CSS lokal agar demo tidak bergantung CDN. SQLite memakai query berparameter; laporan keamanan contoh tidak bisa dijalankan sebagai kode.
