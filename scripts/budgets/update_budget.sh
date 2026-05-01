#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

ID="${1:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId]}"
NAME="${2:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId]}"
AMOUNT="${3:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId]}"
PERIOD_START="${4:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId]}"
PERIOD_END="${5:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId]}"
CATEGORY_ID="${6:-null}"

if [ "$CATEGORY_ID" = "null" ]; then
  CATEGORY_JSON="null"
else
  CATEGORY_JSON="\"$CATEGORY_ID\""
fi

curl -fsS -X PUT "${BASE_URL}/budgets/${ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"amount\":${AMOUNT},\"periodStart\":\"${PERIOD_START}\",\"periodEnd\":\"${PERIOD_END}\",\"categoryId\":${CATEGORY_JSON}}"
echo
