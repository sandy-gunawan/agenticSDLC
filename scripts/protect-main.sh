#!/usr/bin/env bash
set -euo pipefail
repo=${1:-}
[[ $# == 2 && $repo =~ ^[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+$ && $2 == --apply ]] ||
  { echo "Penggunaan: bash scripts/protect-main.sh OWNER/REPO --apply" >&2; exit 2; }

gh api --method PUT "repos/$repo/branches/main/protection" --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["test (Asia/Jakarta)", "test (America/Los_Angeles)"] },
  "enforce_admins": true,
  "required_pull_request_reviews": { "dismiss_stale_reviews": true, "required_approving_review_count": 1 },
  "restrictions": null,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
