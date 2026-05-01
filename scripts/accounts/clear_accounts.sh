#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

curl -fsS -X DELETE "${BASE_URL}/accounts/all" \
  -H "Content-Type: application/json"
echo
