# Status pelaksanaan

| Phase | Status | Bukti / pekerjaan tersisa |
|---|---|---|
| 0 | Selesai | Push ke branch `workshop/clean-baseline` pada repo personal public berhasil; histori repo private tidak dipublikasikan. |
| 1 | Lokal terverifikasi | Node 20: lint, 23 unit/API test, dan tiga alur Playwright lulus pada baseline bersih. [Runner GitHub belum mulai](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45552784379). |
| 2 | Selesai lokal | Commit `seed(P1)`–`seed(P15)`. P10 dan P14 memakai fixture aman; P9 tidak mencatat PII. Jakarta lulus; LA hanya gagal di test P5 sesuai rencana. |
| 3 | Terbit | 16 issue dan aturan bisnis; S07 dibagi dua. S13 sengaja tanpa label. |
| 4 | Lokal | Custom instructions, tujuh agent, skill endpoint, hook lintas platform, dan setup Copilot. Dropdown cloud perlu sesi GitHub. |
| 5 | Compile lulus | Tiga Agentic Workflows dikompilasi tanpa warning dengan gh-aw 1.2.2. Run AI belum diverifikasi; opt-in `WORKSHOP_AI_ENABLED` dan secret milik pemilik. |
| 6 | Lokal terverifikasi | `npm run shots -- S04` menghasilkan before/after dari worktree terpisah. Demo, metrics, reset lokal, dan task VS Code tersedia. |
| 7 | Sebagian terverifikasi | Tag `v0-baseline` dan branch demo disiapkan. Template full dan [bare](https://github.com/sandy-gunawan/expense-app-bare) sudah aktif. Konfigurasi CodeQL diterima; [run setup gagal sebelum scan](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45554378322). |
| 8 | Sebagian terverifikasi | [Bukti before/after](docs/BEFORE-AFTER.md) memuat tangkapan aplikasi, issue S04, serta coverage nyata S08 (75% → 100% baris, satu test gagal sesuai target). Belum ada hasil autofix, sync docs, atau capstone cloud. |
| 9 | Lokal terverifikasi | 22 halaman offline, 15 skenario, 13 diagram Mermaid/SVG, dan 6 panel chart. Tes file lokal 320/390/768/1440 px, keyboard, filter, slider, timeline, dan tanpa JS lulus. Lighthouse accessibility 100 pada landing, S04, dan capstone, tanpa kegagalan kontras pada audit tersebut. Pages perlu runner GitHub. |
| 10 | Manual | [Cara setup organisasi](docs/ORG-SETUP.md); tenant Jira/Teams dan dashboard enterprise belum diverifikasi. |

## Keputusan

- `sandy-gunawan/agenticSDLC` adalah repo full. Hanya inisialisasi `main` yang kosong. Jangan mengubah visibilitas, merge PR, atau force-push `main`.
- App hanya untuk latihan lokal dengan data fiktif. Jangan publikasikan server atau memakai data dan kredensial sebenarnya untuk skenario.
- UI aplikasi dan situs memakai CSS lokal agar demo tidak bergantung CDN. SQLite memakai query berparameter; laporan keamanan contoh tidak bisa dijalankan sebagai kode.
- Pembanding S04 berupa branch aplikasi bersih, bukan komit Copilot. Billing, alert, review agent, dan CI remote hanya diakui bila ada bukti GitHub.
- `npm audit` melaporkan 0 advisory saat verifikasi pada 25 November 2026; bukan jaminan keamanan. Skrip reset tidak melakukan force-push.
