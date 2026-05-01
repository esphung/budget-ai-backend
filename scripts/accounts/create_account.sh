#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <name> <accountType> [currency]"
  echo "Example: $0 \"Primary Checking\" checking USD"
  exit 1
fi

NAME="$1"
ACCOUNT_TYPE="$2"
CURRENCY="${3:-USD}"
OWNER_ID="${4:-}"
BASE_URL="${BASE_URL:-http://localhost:3001}"

if [ -n "$OWNER_ID" ]; then
  OWNER_JSON=",\"ownerId\":\"${OWNER_ID}\""
else
  OWNER_JSON=""
fi

curl -fsS -X POST "${BASE_URL}/accounts" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"accountType\":\"${ACCOUNT_TYPE}\",\"currency\":\"${CURRENCY}\"${OWNER_JSON}}"
echo

# Example usage:
# ./create_account.sh "Primary Checking" checking USD
