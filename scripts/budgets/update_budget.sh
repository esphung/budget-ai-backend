#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

ID="${1:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
NAME="${2:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
AMOUNT="${3:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
PERIOD_START="${4:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
PERIOD_END="${5:?Usage: update_budget.sh <id> <name> <amount> <periodStart> <periodEnd> [categoryId] [ownerId]}"
CATEGORY_ID="${6:-null}"
OWNER_ID="${7:-}"

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

curl -fsS -X PUT "${BASE_URL}/budgets/${ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"amount\":${AMOUNT},\"periodStart\":\"${PERIOD_START}\",\"periodEnd\":\"${PERIOD_END}\",\"categoryId\":${CATEGORY_JSON}${OWNER_JSON}}"
echo
