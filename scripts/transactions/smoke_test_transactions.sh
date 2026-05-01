#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"
AMOUNT="${1:-100}"
UPDATED_AMOUNT="${2:-150}"
MERCHANT="Smoke Test Merchant $(date +%s)"
UPDATED_MERCHANT="${MERCHANT} Updated"
DATE_NOW="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
TRANSACTION_ID=""

cleanup() {
  if [[ -n "${TRANSACTION_ID}" ]]; then
    curl -fsS -X DELETE "${BASE_URL}/transactions/${TRANSACTION_ID}" \
      -H "Content-Type: application/json" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

echo "[1/6] Creating transaction..."
CREATE_RESPONSE="$(curl -fsS -X POST "${BASE_URL}/transactions" \
  -H "Content-Type: application/json" \
  -d "{\"amount\":${AMOUNT},\"merchant\":\"${MERCHANT}\",\"category\":\"test\",\"transactionType\":\"expense\",\"date\":\"${DATE_NOW}\",\"source\":\"manual\",\"createdAt\":\"${DATE_NOW}\"}")"
echo "${CREATE_RESPONSE}"

echo "[2/6] Fetching transactions and resolving created transaction id..."
TRANSACTIONS_JSON="$(curl -fsS -X GET "${BASE_URL}/transactions")"
TRANSACTION_ID="$(printf '%s' "${TRANSACTIONS_JSON}" | node -e "
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  const merchant = process.argv[1];
  const transactions = JSON.parse(raw || '[]');
  const found = transactions.find((t) => t.merchant === merchant);
  if (!found?.id) process.exit(2);
  process.stdout.write(found.id);
});
" "${MERCHANT}")"

if [[ -z "${TRANSACTION_ID}" ]]; then
  echo "Failed to resolve created transaction id"
  exit 1
fi

echo "Resolved transaction id: ${TRANSACTION_ID}"

echo "[3/6] Updating transaction..."
UPDATE_RESPONSE="$(curl -fsS -X PUT "${BASE_URL}/transactions/${TRANSACTION_ID}" \
  -H "Content-Type: application/json" \
  -d "{\"amount\":${UPDATED_AMOUNT},\"merchant\":\"${UPDATED_MERCHANT}\",\"date\":\"${DATE_NOW}\"}")"
echo "${UPDATE_RESPONSE}"

echo "[4/6] Verifying updated transaction exists..."
UPDATED_ID="$(curl -fsS -X GET "${BASE_URL}/transactions" | node -e "
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  const id = process.argv[1];
  const expectedMerchant = process.argv[2];
  const expectedAmount = Number(process.argv[3]);
  const transactions = JSON.parse(raw || '[]');
  const found = transactions.find((t) => t.id === id && t.merchant === expectedMerchant && Number(t.amount) === expectedAmount);
  if (!found?.id) process.exit(2);
  process.stdout.write(found.id);
});
" "${TRANSACTION_ID}" "${UPDATED_MERCHANT}" "${UPDATED_AMOUNT}")"

if [[ -z "${UPDATED_ID}" ]]; then
  echo "Failed to verify transaction update"
  exit 1
fi

echo "[5/6] Deleting transaction..."
DELETE_RESPONSE="$(curl -fsS -X DELETE "${BASE_URL}/transactions/${TRANSACTION_ID}" \
  -H "Content-Type: application/json")"
echo "${DELETE_RESPONSE}"
TRANSACTION_ID=""

echo "[6/6] Confirming transaction no longer exists..."
EXISTS_AFTER_DELETE="$(curl -fsS -X GET "${BASE_URL}/transactions" | node -e "
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  const id = process.argv[1];
  const transactions = JSON.parse(raw || '[]');
  const found = transactions.some((t) => t.id === id);
  process.stdout.write(found ? 'yes' : 'no');
});
" "${UPDATED_ID}")"

if [[ "${EXISTS_AFTER_DELETE}" != "no" ]]; then
  echo "Transaction still exists after delete"
  exit 1
fi

echo "Transactions smoke test passed"

# Example usage:
# ./smoke_test_transactions.sh 100 150
