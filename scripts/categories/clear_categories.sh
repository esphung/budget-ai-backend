#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"
curl -fsS -X DELETE "${BASE_URL}/categories/all"
echo
