#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <id> <name> <accountType> [currency]"
  echo "Example: $0 acct_123 \"Updated Checking\" checking USD"
  exit 1
fi

ACCOUNT_ID="$1"
NAME="$2"
ACCOUNT_TYPE="$3"
CURRENCY="${4:-USD}"
OWNER_ID="${5:-}"
BASE_URL="${BASE_URL:-http://localhost:3001}"

if [ -n "$OWNER_ID" ]; then
  OWNER_JSON=",\"ownerId\":\"${OWNER_ID}\""
else
  OWNER_JSON=""
fi

curl -fsS -X PUT "${BASE_URL}/accounts/${ACCOUNT_ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"accountType\":\"${ACCOUNT_TYPE}\",\"currency\":\"${CURRENCY}\"${OWNER_JSON}}"
echo
