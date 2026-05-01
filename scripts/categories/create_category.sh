#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

NAME="${1:?Usage: create_category.sh <name> [color] [icon] [ownerId]}"
COLOR="${2:-null}"
ICON="${3:-null}"
OWNER_ID="${4:-}"

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

curl -fsS -X POST "${BASE_URL}/categories" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"color\":${COLOR_JSON},\"icon\":${ICON_JSON}${OWNER_JSON}}"
echo
