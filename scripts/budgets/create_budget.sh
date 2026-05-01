#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

NAME="${1:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId]}"
AMOUNT="${2:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId]}"
PERIOD_START="${3:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId]}"
PERIOD_END="${4:?Usage: create_budget.sh <name> <amount> <periodStart> <periodEnd> [categoryId]}"
CATEGORY_ID="${5:-null}"

if [ "$CATEGORY_ID" = "null" ]; then
  CATEGORY_JSON="null"
else
  CATEGORY_JSON="\"$CATEGORY_ID\""
fi

curl -fsS -X POST "${BASE_URL}/budgets" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"amount\":${AMOUNT},\"periodStart\":\"${PERIOD_START}\",\"periodEnd\":\"${PERIOD_END}\",\"categoryId\":${CATEGORY_JSON}}"
echo

# Example usage:
# ./create_budget.sh "Monthly Groceries" 500 "2026-04-01" "2026-04-30" null
