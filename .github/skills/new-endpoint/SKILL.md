---
name: new-endpoint
description: Buat endpoint HTTP Expense Claim dengan kontrak, validasi, service, test, dan dokumentasi yang konsisten.
---
# Endpoint baru

1. Tulis kontrak method, path, akses, response, dan error di `docs/api.md`.
2. Gunakan `InputError` dan helper `src/services/validation.js`. Validasi isi dan akses terhadap resource.
3. Simpan query berparameter di `src/db.js`. Service menangani aturan bisnis.
4. Route meneruskan input yang sudah tervalidasi. Catat hanya metadata melalui `auditLog`.
5. Uji akses, input salah, dan keberhasilan; jalankan `npm test`.

Contoh minimal ada di `templates/route.js`, `templates/service.js`, dan `templates/test.js`; sesuaikan nama dan kontrak sebelum digunakan.
