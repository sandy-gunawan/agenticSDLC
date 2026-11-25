# ADR 0002 — Mata uang asal dan total rupiah

**Status: draf untuk Bima, belum disetujui.** Sumber: [epik S15](https://github.com/sandy-gunawan/agenticSDLC/issues/16). Baseline hanya memakai IDR.

## Keputusan yang diusulkan

Simpan tiga hal secara terpisah: jumlah asli dalam satuan terkecil, kode mata uang (`IDR`, `USD`, `SGD`), dan total IDR saat pengajuan. Simpan pengenal kurs yang dipakai. Untuk latihan, pakai satu tabel kurs fiktif berversi dan beri label **ilustrasi** di form; tidak ada panggilan ke layanan eksternal. Gunakan aritmetika bilangan bulat dan bulatkan setengah ke atas sekali, ke rupiah terdekat.

Manager, Finance, dan laporan tetap memakai total IDR yang disimpan, bukan menghitung ulang dengan kurs baru. Untuk data lama, isi mata uang `IDR` dan pertahankan jumlah. Otorisasi, pemeriksaan duplikasi keputusan, serta pencatatan `claim_events` tetap dalam alur transaksi.

## Alternatif dan alasannya

- **Konversi saat laporan:** lebih sedikit kolom, tetapi total berubah saat kurs berganti dan dapat mengubah ambang approval setelah keputusan diambil.
- **Kurs live:** lebih realistis, tetapi butuh jaringan, sumber kurs yang disetujui, serta keputusan tentang data lama. Di luar scope lab.

## Tugas setelah persetujuan

1. Buat migration SQLite dan service konversi. Uji klaim IDR lama, USD/SGD, mata uang tidak dikenal, pembulatan, batas jumlah, dan penanganan retry.
2. Tambah pilihan mata uang dan tampilkan estimasi berlabel ilustrasi di UI. Total final harus berasal dari API. Uji tiga pilihan dengan Playwright.
3. Tambah test approval tepat `1.000.000` IDR hasil konversi; cross-check hasil laporan per bulan. Jaga `main`: selesaikan P5 di tugasnya agar kedua check CI dapat lulus.
4. Perbarui `docs/api.md`, jalankan check, dan minta review performa, keamanan, serta kepatuhan. Tech Lead yang boleh merge di repo turunan.
