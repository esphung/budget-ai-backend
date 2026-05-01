#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <id>"
  echo "Example: $0 acct_123"
  exit 1
fi

ACCOUNT_ID="$1"
BASE_URL="${BASE_URL:-http://localhost:3001}"

curl -fsS -X DELETE "${BASE_URL}/accounts/${ACCOUNT_ID}" \
  -H "Content-Type: application/json"
echo
