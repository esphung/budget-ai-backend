#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

NAME="${1:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
AMOUNT="${2:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
PERIOD_START="${3:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
PERIOD_END="${4:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
CATEGORY_ID="${5:-null}"
OWNER_ID="${6:-}"

if [ "$CATEGORY_ID" = "null" ]; then
  CATEGORY_JSON="null"
else
  CATEGORY_JSON="\"$CATEGORY_ID\""
fi

if [ -n "$OWNER_ID" ]; then
  OWNER_JSON=",\"ownerId\":\"${OWNER_ID}\""
else
  OWNER_JSON=""
fi

curl -fsS -X POST "${BASE_URL}/budgets" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"amount\":${AMOUNT},\"periodStart\":\"${PERIOD_START}\",\"periodEnd\":\"${PERIOD_END}\",\"categoryId\":${CATEGORY_JSON}${OWNER_JSON}}"
echo

# Example usage:
# ./create_budget.sh "Monthly Groceries" 500 "2026-04-01" "2026-04-30" null
