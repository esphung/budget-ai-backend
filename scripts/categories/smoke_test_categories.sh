#!/bin/bash
set -e
BASE_URL="${BASE_URL:-http://localhost:3001}"

NAME="${1:-Groceries}"
COLOR="${2:-#00aa00}"
ICON="${3:-🛒}"

echo "==> Clearing existing categories..."
curl -fsS -X DELETE "${BASE_URL}/categories/all"
echo

echo "==> Creating category: ${NAME}..."
curl -fsS -X POST "${BASE_URL}/categories" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"color\":\"${COLOR}\",\"icon\":\"${ICON}\"}"
echo

echo "==> Listing all categories..."
CATEGORIES=$(curl -fsS "${BASE_URL}/categories")
echo "$CATEGORIES"

CATEGORY_ID=$(echo "$CATEGORIES" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo
echo "==> Updating category: ${CATEGORY_ID}..."
curl -fsS -X PUT "${BASE_URL}/categories/${CATEGORY_ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME} (updated)\",\"color\":\"${COLOR}\"}"
echo

echo "==> Deleting category: ${CATEGORY_ID}..."
curl -fsS -X DELETE "${BASE_URL}/categories/${CATEGORY_ID}"
echo

echo "==> Smoke test complete."

# Example usage:
# ./smoke_test_categories.sh "Groceries" "#00aa00" "🛒"
