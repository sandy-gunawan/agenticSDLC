# Workshop Agentic SDLC di GitHub

Expense Claim App adalah aplikasi latihan untuk PT Nusantara Finansial (fiktif). Karyawan mengajukan klaim, manager memeriksa, dan Finance melihat laporan. Workshop memakai alur ini untuk berlatih dari issue hingga draft PR, dengan review dan keputusan merge tetap di tangan manusia.

Repo publik: [`sandy-gunawan/agenticSDLC`](https://github.com/sandy-gunawan/agenticSDLC). Fitur yang perlu lisensi atau kebijakan organisasi dicatat terpisah dari demo lokal.

## Jalankan lokal

```shell
npm ci
npm run dev
```

Buka <http://127.0.0.1:3000>. Pilih akun latihan fiktif di setiap halaman. Server hanya menerima akses lokal dan tidak memakai login sungguhan. Untuk mengikuti workshop secara persis gunakan Node.js `20.20.2`; Node 20 sudah berakhir masa dukungannya, jadi bukan pilihan produksi.

```shell
npm run lint
npm test
npx playwright install chromium
npm run e2e
```

## Rencana dan status

- [Mulai di sini](agentic-sdlc-workshop-docs/START-HERE.md) · [Konteks bisnis](agentic-sdlc-workshop-docs/CONTEXT.md) · [Rencana teknis](agentic-sdlc-workshop-docs/PLAN.md)
- [Template](agentic-sdlc-workshop-docs/TEMPLATES.md) · [Runbook presenter](agentic-sdlc-workshop-docs/RUNBOOK.md) · [Spesifikasi situs](agentic-sdlc-workshop-docs/DOCS-SPEC.md)
- [Status pelaksanaan](PROGRESS.md)
