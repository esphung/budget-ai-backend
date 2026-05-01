#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

ID="${1:?Usage: update_category.sh <id> <name> [color] [icon]}"
NAME="${2:?Usage: update_category.sh <id> <name> [color] [icon]}"
COLOR="${3:-null}"
ICON="${4:-null}"

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

curl -fsS -X PUT "${BASE_URL}/categories/${ID}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"color\":${COLOR_JSON},\"icon\":${ICON_JSON}}"
echo
