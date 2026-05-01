#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

curl -fsS -X GET "${BASE_URL}/accounts" \
  -H "Content-Type: application/json"
echo
