#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"
curl -fsS "${BASE_URL}/budgets"
echo
