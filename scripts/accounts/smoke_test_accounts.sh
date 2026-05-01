#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL="${BASE_URL:-http://localhost:3001}"
export BASE_URL

ACCOUNT_TYPE="${1:-checking}"
CURRENCY="${2:-USD}"
ACCOUNT_NAME="Smoke Test Account $(date +%s)"
UPDATED_ACCOUNT_NAME="${ACCOUNT_NAME} Updated"
ACCOUNT_ID=""

cleanup() {
  if [[ -n "${ACCOUNT_ID}" ]]; then
    "${SCRIPT_DIR}/delete_account.sh" "${ACCOUNT_ID}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT

echo "[1/6] Creating account..."
"${SCRIPT_DIR}/create_account.sh" "${ACCOUNT_NAME}" "${ACCOUNT_TYPE}" "${CURRENCY}"

echo "[2/6] Fetching accounts and resolving created account id..."
ACCOUNTS_JSON="$("${SCRIPT_DIR}/get_all_accounts.sh")"
ACCOUNT_ID="$(printf '%s' "${ACCOUNTS_JSON}" | node -e "
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  const name = process.argv[1];
  const accounts = JSON.parse(raw || '[]');
  const found = accounts.find((a) => a.name === name);
  if (!found?.id) process.exit(2);
  process.stdout.write(found.id);
});
" "${ACCOUNT_NAME}")"

if [[ -z "${ACCOUNT_ID}" ]]; then
  echo "Failed to resolve created account id"
  exit 1
fi

echo "Resolved account id: ${ACCOUNT_ID}"

echo "[3/6] Updating account..."
"${SCRIPT_DIR}/update_account.sh" "${ACCOUNT_ID}" "${UPDATED_ACCOUNT_NAME}" "${ACCOUNT_TYPE}" "${CURRENCY}"

echo "[4/6] Verifying updated account exists..."
UPDATED_ID="$("${SCRIPT_DIR}/get_all_accounts.sh" | node -e "
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  const id = process.argv[1];
  const expectedName = process.argv[2];
  const accounts = JSON.parse(raw || '[]');
  const found = accounts.find((a) => a.id === id && a.name === expectedName);
  if (!found?.id) process.exit(2);
  process.stdout.write(found.id);
});
" "${ACCOUNT_ID}" "${UPDATED_ACCOUNT_NAME}")"

if [[ -z "${UPDATED_ID}" ]]; then
  echo "Failed to verify account update"
  exit 1
fi

echo "[5/6] Deleting account..."
"${SCRIPT_DIR}/delete_account.sh" "${ACCOUNT_ID}"
ACCOUNT_ID=""

echo "[6/6] Confirming account no longer exists..."
EXISTS_AFTER_DELETE="$("${SCRIPT_DIR}/get_all_accounts.sh" | node -e "
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  const id = process.argv[1];
  const accounts = JSON.parse(raw || '[]');
  const found = accounts.some((a) => a.id === id);
  process.stdout.write(found ? 'yes' : 'no');
});
" "${UPDATED_ID}")"

if [[ "${EXISTS_AFTER_DELETE}" != "no" ]]; then
  echo "Account still exists after delete"
  exit 1
fi

echo "Accounts smoke test passed"

# Example usage:
# ./smoke_test_accounts.sh checking USD
