#!/bin/bash
set -e
BASE_URL="${BASE_URL:-http://localhost:3001}"

NAME="${1:-Monthly Groceries}"
AMOUNT="${2:-500}"
UPDATED_AMOUNT="${3:-600}"
PERIOD_START="2026-04-01"
PERIOD_END="2026-04-30"

echo "==> Clearing existing budgets..."
curl -fsS -X DELETE "${BASE_URL}/budgets/all"
echo

echo "==> Creating budget: ${NAME} (amount: ${AMOUNT})..."
curl -fsS -X POST "${BASE_URL}/budgets" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"amount\":${AMOUNT},\"periodStart\":\"${PERIOD_START}\",\"periodEnd\":\"${PERIOD_END}\",\"categoryId\":null}"
echo

echo "==> Listing all budgets..."
BUDGETS=$(curl -fsS "${BASE_URL}/budgets")
echo "$BUDGETS"

BUDGET_ID=$(echo "$BUDGETS" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo
echo "==> Updating budget: ${BUDGET_ID} (amount: ${UPDATED_AMOUNT})..."
curl -fsS -X PUT "${BASE_URL}/budgets/${BUDGET_ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"amount\":${UPDATED_AMOUNT},\"periodStart\":\"${PERIOD_START}\",\"periodEnd\":\"${PERIOD_END}\",\"categoryId\":null}"
echo

echo "==> Deleting budget: ${BUDGET_ID}..."
curl -fsS -X DELETE "${BASE_URL}/budgets/${BUDGET_ID}"
echo

echo "==> Smoke test complete."

# Example usage:
# ./smoke_test_budgets.sh "Monthly Groceries" 500 600
