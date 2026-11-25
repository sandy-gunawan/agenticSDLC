# Konvensi Expense Claim App

- Kode dan komentar dalam bahasa Inggris; UI, error, dan dokumen untuk manusia dalam bahasa Indonesia.
- Gunakan ES modules, camelCase, JS tanpa build step. Route memvalidasi dan memanggil service; SQL berparameter tetap di `src/db.js`.
- Pakai `InputError` dengan `{code,message}` dan status HTTP yang tepat. `auditLog` hanya memuat metadata (tanpa nama, email, isi request, atau kredensial).
- Server demo hanya bind ke loopback. `x-demo-user` adalah pemilih fixture, bukan login produksi. Jangan longgarkan batas akses.
- Tambahkan test di `tests/unit/`; kontrol jam, uji batas, dan catat hasil sebenarnya. Perbarui `docs/api.md` bila kontrak berubah.
- Gunakan branch dan draft PR. Manusia review dan merge. Jangan membuat perubahan di luar issue.
