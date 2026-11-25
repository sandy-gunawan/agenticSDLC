# Before / After workshop

Bukti lokal S02, S04, dan S06 membandingkan baseline latihan dengan branch aplikasi bersih, bukan PR Copilot. S04 setelah menunjukkan penolakan tanggal masa depan; baseline belum mempunyai input tanggal. Bukti S08 berasal dari laporan Vitest V8 di baseline dan `demo/s08-qa-observation`; test di batas satu juta gagal sesuai target.

| Skenario | Before | After | Bukti langkah |
|---|---|---|---|
| [S01 — Custom instructions](https://github.com/sandy-gunawan/agenticSDLC/issues/1) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S02 — Agent Mode lintas file](https://github.com/sandy-gunawan/agenticSDLC/issues/2) | [S02-before.png](screenshots/S02-before.png) | [S02-after.png](screenshots/S02-after.png) | Belum di-capture |
| [S03 — Skill new-endpoint](https://github.com/sandy-gunawan/agenticSDLC/issues/3) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S04 — Issue → Copilot → draft PR](https://github.com/sandy-gunawan/agenticSDLC/issues/4) | [S04-before.png](screenshots/S04-before.png) | [S04-after.png](screenshots/S04-after.png) | [S04-01-issue.png](screenshots/S04-01-issue.png), [S04-04-pr-summary.png](screenshots/S04-04-pr-summary.png) |
| [S05 — Pulihkan CI merah](https://github.com/sandy-gunawan/agenticSDLC/issues/5) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S06 — Delegasi dari Jira atau Teams](https://github.com/sandy-gunawan/agenticSDLC/issues/6) | [S06-before.png](screenshots/S06-before.png) | [S06-after.png](screenshots/S06-after.png) | Belum di-capture |
| [S07 — Modernisasi CSV bertahap](https://github.com/sandy-gunawan/agenticSDLC/issues/7) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S08 — Virtual QA](https://github.com/sandy-gunawan/agenticSDLC/issues/9) | [S08-before.png](screenshots/S08-before.png) | [S08-after.png](screenshots/S08-after.png) | [S08-02-bug-issue.png](screenshots/S08-02-bug-issue.png) |
| [S09 — Virtual Review Board](https://github.com/sandy-gunawan/agenticSDLC/issues/10) | [S09-before.png](screenshots/S09-before.png) | Belum di-capture | Belum di-capture |
| [S10 — CodeQL dan mitigasi](https://github.com/sandy-gunawan/agenticSDLC/issues/11) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S11 — Virtual Architect](https://github.com/sandy-gunawan/agenticSDLC/issues/12) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S12 — Docs sync](https://github.com/sandy-gunawan/agenticSDLC/issues/13) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S13 — Issue triage dan CI fault analysis](https://github.com/sandy-gunawan/agenticSDLC/issues/14) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S14 — Guardrails, audit, dan biaya](https://github.com/sandy-gunawan/agenticSDLC/issues/15) | Belum di-capture | Belum di-capture | Belum di-capture |
| [S15 — Capstone multi-currency](https://github.com/sandy-gunawan/agenticSDLC/issues/16) | [S15-before.png](screenshots/S15-before.png) | Belum di-capture | Belum di-capture |

## Artefak GitHub yang diverifikasi

- S04: [Draft Copilot (belum ada perubahan)](https://github.com/sandy-gunawan/agenticSDLC/pull/18)
- S04: [Run coding agent berhenti sebelum kerja](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45554824363)
- S08: [Draft PR test lokal](https://github.com/sandy-gunawan/agenticSDLC/pull/19)
- S08: [Issue bug yang ditemukan](https://github.com/sandy-gunawan/agenticSDLC/issues/20)
- S09: [Draft stok review](https://github.com/sandy-gunawan/agenticSDLC/pull/17)
- S10: [Run setup CodeQL; belum memindai](https://github.com/sandy-gunawan/agenticSDLC/actions/runs/45554378322)

Draft, judul issue, dan run yang tidak mulai bukan bukti perbaikan. Daftar gambar yang masih kurang ada di [`screenshots/_missing.json`](screenshots/_missing.json).
