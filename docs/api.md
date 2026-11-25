# Expense Claim API

Hanya untuk `127.0.0.1`. Kirim `x-demo-user` dengan ID fixture `1–6`: karyawan (1–2), manager (3–4), Finance (5–6). Ini pemilih peran demo, bukan autentikasi produksi. `POST` memakai JSON.

| Method dan path | Request | Response |
|---|---|---|
| `GET /health` | Tanpa akun | `200 { status }` |
| `GET /session` | ID akun | `200 { user, today }`; hari memakai UTC |
| `GET /claims` | ID akun | `200 { claims }`; daftar sesuai peran dan tim |
| `GET /claims/:id` | ID klaim | `200 { claim }`; 404 bila tidak ada atau di luar tim/akun |
| `POST /claims` | `title`, `amount` (rupiah bulat), `category`, `claimDate` (`YYYY-MM-DD`); opsional `attachment` (nama file), `notes` | `201 { claim }`; hanya karyawan |
| `GET /approvals` | Manager atau Finance | `200 { claims }`; antrian sesuai tahap |
| `POST /approvals/:id` | `{ "decision": "approve" }` atau `"reject"` | `200 { claim }`; 409 bila sudah final |
| `GET /reports?month=YYYY-MM` | Finance; bulan opsional | `200 { month, rows }`; setiap baris berisi `category`, `department`, `claimCount`, `total` |

Error berbentuk `{ "code": "...", "message": "..." }`. Contoh: `400 CLAIM_DATE_FUTURE`, `401 DEMO_USER_REQUIRED`, `403 FINANCE_REQUIRED`. Query laporan memakai parameter SQLite. Nama lampiran tidak dibaca dari disk.
