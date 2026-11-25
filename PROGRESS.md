# Status pelaksanaan

| Phase | Status | Bukti / pekerjaan tersisa |
|---|---|---|
| 0 | Selesai | Push ke branch `workshop/clean-baseline` pada repo personal public berhasil; histori repo private tidak dipublikasikan. |
| 1 | Lokal terverifikasi | Node 20: lint, 23 unit/API test, dan tiga alur Playwright lulus pada baseline bersih. [Runner GitHub belum mulai](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45552784379). |
| 2 | Selesai lokal | Commit `seed(P1)`–`seed(P15)`. P10 dan P14 memakai fixture aman; P9 tidak mencatat PII. Jakarta lulus; LA hanya gagal di test P5 sesuai rencana. |
| 3 | Terbit | 16 issue dan aturan bisnis; S07 dibagi dua. S13 sengaja tanpa label. |
| 4 | Terbit, sebagian terverifikasi | Custom instructions, tujuh agent, skill endpoint, hook lintas platform, dan setup Copilot ada di `main`. Tes hook lokal lulus; dropdown cloud belum diperiksa. |
| 5 | Compile lulus | Tiga Agentic Workflows dikompilasi tanpa warning dengan gh-aw 1.2.2. Run AI belum diverifikasi; opt-in `WORKSHOP_AI_ENABLED` dan secret milik pemilik. |
| 6 | Lokal terverifikasi | `npm run shots -- S04` menghasilkan before/after dari worktree terpisah. Demo, metrics, reset lokal, dan task VS Code tersedia. |
| 7 | Sebagian terverifikasi | Tag dan branch demo terbit; template full dan [bare](https://github.com/sandy-gunawan/expense-app-bare) aktif. `main` membutuhkan 1 approval, dua check CI, dan hasil CodeQL, tanpa force-push. [Setup CodeQL gagal sebelum scan](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45554378322). |
| 8 | Sebagian terverifikasi | [Bukti before/after](docs/BEFORE-AFTER.md): S04 [draft Copilot](https://github.com/sandy-gunawan/agenticSDLC/pull/18) terbuka tanpa perubahan karena runner tidak mulai; S08 [draft test](https://github.com/sandy-gunawan/agenticSDLC/pull/19) dan [issue bug](https://github.com/sandy-gunawan/agenticSDLC/issues/20); S09 [draft stok](https://github.com/sandy-gunawan/agenticSDLC/pull/17), belum ada review substantif. S15 menunggu review ADR. |
| 9 | Terbit di repo, Pages tertahan | 22 halaman offline, 15 skenario, 13 diagram Mermaid/SVG, dan 6 panel chart. Tes 320/390/768/1440 px dan kontrol keyboard lulus. Lighthouse accessibility 100 pada landing, S04, dan capstone. [Job deploy Pages tidak mulai](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45554794512). |
| 10 | Manual | [Cara setup organisasi](docs/ORG-SETUP.md); tenant Jira/Teams dan dashboard enterprise belum diverifikasi. |

## Keputusan

- `sandy-gunawan/agenticSDLC` adalah repo full. Hanya inisialisasi `main` yang kosong. Jangan mengubah visibilitas, merge PR, atau force-push `main`.
- App hanya untuk latihan lokal dengan data fiktif. Jangan publikasikan server atau memakai data dan kredensial sebenarnya untuk skenario.
- UI aplikasi dan situs memakai CSS lokal agar demo tidak bergantung CDN. SQLite memakai query berparameter; laporan keamanan contoh tidak bisa dijalankan sebagai kode.
- Pembanding S04 berupa branch aplikasi bersih, bukan komit Copilot. Billing, alert, review agent, dan CI remote hanya diakui bila ada bukti GitHub.
- `npm audit` melaporkan 0 advisory saat verifikasi pada 25 November 2026; bukan jaminan keamanan. Skrip reset tidak melakukan force-push.

## Pekerjaan yang masih membutuhkan pemilik

1. Pulihkan akses runner GitHub Actions, lalu jalankan ulang CI, CodeQL, Pages dan S04. Verifikasi aksesnya di tab **Actions** sebelum mencoba dry-run ulang.
2. Bila siap menjalankan gh-aw, pemilik membuat `COPILOT_GITHUB_TOKEN` di pengaturan repo dan mengaktifkan `WORKSHOP_AI_ENABLED=true` hanya saat sesi. Keduanya belum dikonfigurasi.
3. Tinjau [draf ADR multi-currency](docs/adr/0002-multi-currency.md). Capstone tidak terverifikasi sampai manusia menyetujui desain, CI dan review lulus, dan Tech Lead memilih merge di repo turunan.
