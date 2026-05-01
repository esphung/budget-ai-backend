#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

ID="${1:?Usage: update_category.sh <id> <name> [color] [icon] [ownerId]}"
NAME="${2:?Usage: update_category.sh <id> <name> [color] [icon] [ownerId]}"
COLOR="${3:-null}"
ICON="${4:-null}"
OWNER_ID="${5:-}"

if [ "$COLOR" = "null" ]; then
  COLOR_JSON="null"
else
  COLOR_JSON="\"$COLOR\""
fi

if [ "$ICON" = "null" ]; then
  ICON_JSON="null"
else
  ICON_JSON="\"$ICON\""
fi

if [ -n "$OWNER_ID" ]; then
  OWNER_JSON=",\"ownerId\":\"${OWNER_ID}\""
else
  OWNER_JSON=""
fi

curl -fsS -X PUT "${BASE_URL}/categories/${ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"color\":${COLOR_JSON},\"icon\":${ICON_JSON}${OWNER_JSON}}"
echo
