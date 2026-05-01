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
BASE_URL="${BASE_URL:-http://localhost:3001}"

curl -fsS -X POST "${BASE_URL}/accounts" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"accountType\":\"${ACCOUNT_TYPE}\",\"currency\":\"${CURRENCY}\"}"
echo

# Example usage:
# ./create_account.sh "Primary Checking" checking USD
