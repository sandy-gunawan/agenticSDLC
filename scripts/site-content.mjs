export const capstone = [
  ['1', 'Bagi epik menjadi tugas', 'Lina + Planner', 'Pilih issue multi-currency. Pisahkan ADR, aplikasi, test, dan docs.', 'S15-02-breakdown.png'],
  ['2', 'Setujui desain', 'Bima + Architect', 'ADR menetapkan sumber kurs, rounding, approval, dan perilaku retry. Bima menyetujui desain.', 'S15-03-adr.png'],
  ['3', 'Implementasikan di branch', 'Coding agent', 'Agent mengerjakan satu tugas di branch dan membuka draft PR. Belum ada merge.', 'S15-04-pr.png'],
  ['4', 'Periksa CI', 'GitHub Actions', 'Jalankan lint, test dua timezone, dan Playwright. Selidiki kegagalan sebelum lanjut.', 'S15-05-ci.png'],
  ['5', 'Review perubahan', 'Review Board + CodeQL', 'Pisahkan temuan performa, security, dan kepatuhan. Validasi hasil pemindaian.', 'S15-06-reviews.png'],
  ['6', 'Ambil keputusan merge', 'Tech Lead', 'Hanya manusia yang merge di repo turunan setelah approval dan checks terpenuhi.', 'S15-07-merge.png'],
  ['7', 'Sinkronkan docs', 'Docs sync + triage', 'Workflow yang diizinkan membuka draft PR docs. Issue lanjutan bisa ditriase.', 'S15-08-docs.png'],
  ['8', 'Periksa audit', 'Ibu Maya + Yoga', 'Bandingkan metadata audit dan dashboard biaya. Jangan salin isi rahasia.', 'S15-09-audit.png'],
];

export const diagrams = {
  D1: ['Evolusi bantuan AI', [['Completion', 'melengkapi', 'Chat'], ['Chat', 'menjawab sebelum delegasi', 'Coding agent'], ['Coding agent', 'berkolaborasi dengan', 'Tim agent']]],
  D2: ['Siklus SDLC dan titik kontrol', [['Plan · S11', 'memandu', 'Build · S02'], ['Build · S02', 'memicu', 'Test · S08'], ['Test · S08', 'melaporkan ke', 'Review · S09'], ['Review · S09', 'meminta', 'Security · S10'], ['Security · S10', 'memberi bukti untuk', 'Deploy · S15'], ['Deploy · S15', 'menyediakan dasar untuk', 'Operate · S12/13'], ['Operate · S12/13', 'membawa masukan ke', 'Plan · S11']]],
  D3: ['Dari browser ke SQLite dan kembali', [['Browser', 'mengirim POST /claims', 'Express API'], ['Express API', 'memvalidasi dan menyimpan', 'SQLite'], ['SQLite', 'mengembalikan klaim', 'Express API'], ['Express API', 'membalas 201 atau error', 'Browser'], ['GitHub Actions', 'menjalankan test di luar request', 'Express API'], ['CodeQL', 'menganalisis kode tanpa request', 'Express API']]],
  D4: ['Delegasi, artefak, dan keputusan manusia', [['Issue / Jira', 'ditugaskan ke', 'Coding agent'], ['Coding agent', 'membuat', 'Branch dan draft PR'], ['Branch dan draft PR', 'memicu', 'CI dan CodeQL'], ['Branch dan draft PR', 'dibaca oleh', 'Reviewer agents'], ['CI dan CodeQL', 'memberi bukti ke', 'Tech Lead'], ['Reviewer agents', 'memberi saran ke', 'Tech Lead'], ['Tech Lead', 'memilih merge sebelum', 'Docs sync'], ['Hooks', 'mencatat metadata ke', 'Audit']]],
  D5: ['Peta konfigurasi repo', [['Copilot cloud atau IDE', 'membaca', 'Instructions dan AGENTS.md'], ['Custom agents', 'memakai', 'File agents'], ['Pembuat endpoint', 'memanggil', 'Skill new-endpoint'], ['CLI atau cloud agent', 'menjalankan', 'Hooks'], ['GitHub Actions', 'membaca', 'Workflow lock YAML']]],
  D6: ['Perjalanan issue S04', [['Bima', 'menulis kriteria di', 'Issue'], ['Issue', 'ditugaskan ke', 'Copilot'], ['Copilot', 'menjalankan test di', 'Runner'], ['Runner', 'mengembalikan hasil ke', 'Copilot'], ['Copilot', 'membuka', 'Draft PR'], ['Bima', 'meminta revisi di', 'Draft PR'], ['Copilot', 'mendorong revisi ke', 'Draft PR']]],
  D7: ['Tiga review berjalan paralel', [['Draft PR', 'dibaca oleh', 'Security Reviewer'], ['Draft PR', 'dibaca oleh', 'Performance Reviewer'], ['Draft PR', 'dibaca oleh', 'Compliance Reviewer'], ['Security Reviewer', 'menyampaikan temuan ke', 'Bima'], ['Performance Reviewer', 'menyampaikan temuan ke', 'Bima'], ['Compliance Reviewer', 'menyampaikan temuan ke', 'Bima']]],
  D8: ['Jalur defensif bila ada alert nyata', [['CodeQL', 'melaporkan', 'Alert'], ['Dimas', 'memilih alert yang disetujui di', 'Alert'], ['Dimas', 'minta draf mitigasi ke', 'Copilot'], ['Copilot', 'mengajukan mitigasi ke', 'Draft PR'], ['CodeQL', 'memeriksa ulang', 'Draft PR'], ['Dimas', 'memverifikasi status', 'Alert']]],
  D9: ['Setujui desain sebelum implementasi', [['Architect', 'menulis', 'ADR'], ['ADR', 'ditinjau oleh', 'Tech Lead'], ['Tech Lead', 'menyetujui sebelum', 'Implementer'], ['Implementer', 'meminta review dari', 'Security Reviewer']]],
  D10: ['Event memicu output yang dibatasi', [['Push atau jadwal', 'memicu', 'Docs sync'], ['Issue baru', 'memicu', 'Issue triage'], ['Run CI demo gagal', 'memicu', 'CI fault analysis'], ['Docs sync', 'meminta draft PR via', 'Safe outputs'], ['Issue triage', 'meminta label dan komentar via', 'Safe outputs'], ['CI fault analysis', 'meminta ringkasan via', 'Safe outputs']]],
  D11: ['Hook menilai tindakan, platform mengatur izin', [['Tool call', 'masuk ke', 'Hook preToolUse'], ['Hook preToolUse', 'mengizinkan bila aman', 'Tool'], ['Hook preToolUse', 'menolak contoh spesifik', 'Deny'], ['Hook preToolUse', 'mencatat metadata ke', 'Audit log'], ['Izin platform', 'membatasi', 'Tool']]],
  D12: ['Delapan tahap capstone', capstone.slice(0, -1).map((current, i) => [`${current[0]}. ${current[1]}`, 'meneruskan ke', `${capstone[i + 1][0]}. ${capstone[i + 1][1]}`])],
  D13: ['Pilih tempat untuk demo', [['Personal atau organisasi?', 'personal public', 'S01–S15 dengan fallback lokal'], ['Personal atau organisasi?', 'organisasi berizin', 'Tambahkan Jira / Teams dan kebijakan'], ['Organisasi private', 'cek lisensi sebelum', 'Code scanning dan Copilot']]],
};

export const glossary = [
  ['Coding agent', 'Agent GitHub yang mengerjakan task di lingkungan terpisah dan mengembalikan draft PR.'],
  ['Custom agent', 'Profil spesialis dengan instruksi dan batas tools yang berbeda.'],
  ['Skill', 'Prosedur yang dimuat saat sebuah pekerjaan membutuhkannya.'],
  ['MCP', 'Protokol untuk menghubungkan agent ke layanan atau alat dengan izin yang sesuai.'],
  ['Hook', 'Pemeriksaan yang berjalan pada titik tertentu, misalnya sebelum tool dipakai.'],
  ['gh-aw', 'Compiler Agentic Workflows: Markdown menjadi workflow GitHub Actions.'],
  ['Safe outputs', 'Daftar perubahan GitHub yang boleh diminta agent, dijalankan di job terpisah.'],
  ['AI credit / premium request', 'Satuan penggunaan yang ditampilkan produk dan bergantung pada paket. Jangan disamakan dengan jumlah commit atau test.'],
  ['Branch protection', 'Aturan yang memblokir merge sampai review dan checks terpenuhi.'],
  ['ADR', 'Catatan keputusan arsitektur: pilihan, alternatif, dan akibatnya.'],
];

export const faq = [
  ['Apakah agent boleh merge sendiri?', 'Tidak dalam workshop ini. Tech Lead yang memutuskan setelah review dan checks.'],
  ['Mengapa tidak semua hal dilakukan otomatis?', 'Keputusan bisnis, akses, dan risiko perlu pemilik yang bisa menolak atau meminta revisi.'],
  ['Apa yang bisa dilakukan PM tanpa Jira?', 'Tulis issue GitHub dengan hasil yang diharapkan dan aturan kapan pekerjaan dianggap selesai.'],
  ['Apakah localhost punya autentikasi sungguhan?', 'Tidak. Pemilih akun hanya untuk data fiktif dan server bind ke loopback.'],
  ['Mengapa test LA merah?', 'P5 sengaja mencampur hari lokal dan UTC. S05 memperbaiki test, bukan menyembunyikan kegagalan.'],
  ['Apa bedanya scan selesai dengan alert tertutup?', 'Scan selesai berarti analisis berjalan. Alert tertutup perlu bukti temuan dan perbaikan; S10 tidak membuat keduanya secara artifisial.'],
  ['Apakah hook ini cukup untuk produksi?', 'Tidak. Hook adalah contoh tambahan. Tetap perlu izin minimum, review manusia, sandbox, dan kebijakan repo.'],
  ['Bagaimana membaca biaya?', 'Gunakan dashboard untuk pemakaian dan tarif akun yang berlaku. Angka ilustrasi bukan tagihan.'],
  ['Bagaimana mengulang tanpa mengubah main?', 'Reset hanya membersihkan worktree lokal yang bersih. Buat repo turunan baru untuk capstone yang sudah di-merge manusia.'],
];
