#!/usr/bin/env bash
set -euo pipefail
source_ref=${1:-v0-baseline}
target_path=${2:?Tentukan folder tujuan baru yang kosong}
[[ $source_ref =~ ^[[:alnum:]][[:alnum:]/._-]*$ && ! -e $target_path ]] || { echo "Ref atau folder tujuan tidak valid." >&2; exit 2; }
mkdir -- "$target_path"
target_path=$(cd "$target_path" && pwd)
cd "$(dirname "$0")/.."
sha=$(git --no-pager rev-parse --verify --end-of-options "$source_ref^{commit}")
git --no-pager archive "$sha" -- \
  .gitattributes .gitignore .env.example package.json package-lock.json eslint.config.js \
  playwright.config.js vitest.config.js src tests/e2e tests/unit/claims.test.js tests/unit/clock-demo.test.js \
  .github/workflows/ci.yml docs/api.md docs/business-rules.md docs/fixtures issues agentic-sdlc-workshop-docs scripts/seed-issues.sh |
  tar -x -C "$target_path"
cd "$target_path"
node --input-type=module -e '
  import { readFileSync, writeFileSync } from "node:fs";
  for (const file of ["package.json", "package-lock.json"]) {
    const manifest = JSON.parse(readFileSync(file, "utf8"));
    if (file === "package.json") {
      for (const script of Object.keys(manifest.scripts)) {
        if (!["dev", "lint", "test", "coverage", "e2e"].includes(script)) delete manifest.scripts[script];
      }
    }
    writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n");
  }
'
cat > README.md <<'EOF'
# Expense Claim App · varian bare

Varian latihan tanpa aturan, custom agents, skills, hooks, atau Agentic Workflows.
Gunakan **Use this template** untuk membuat repo latihan sendiri.
Mulai dengan `npm ci` lalu `npm run dev`. Buka <http://127.0.0.1:3000>.
Pakai Node `20.20.2` untuk mengikuti lab; data hanya fiktif.

- [Rencana latihan](agentic-sdlc-workshop-docs/START-HERE.md)
- [Aturan bisnis](docs/business-rules.md)
- [Workshop lengkap](https://github.com/sandy-gunawan/agenticSDLC)

Test timezone P5 sengaja gagal di Los Angeles sebelum latihan S05.
EOF
git --no-pager init --initial-branch=main
echo "Varian bare siap di $target_path. Tinjau sebelum commit dan push ke repo terpisah."
