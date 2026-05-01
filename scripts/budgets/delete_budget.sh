#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

ID="${1:?Usage: delete_budget.sh <id>}"

curl -fsS -X DELETE "${BASE_URL}/budgets/${ID}"
echo
