#!/bin/bash
BASE_URL="${BASE_URL:-http://localhost:3001}"

NAME="${1:?Usage: create_category.sh <name> [color] [icon]}"
COLOR="${2:-null}"
ICON="${3:-null}"

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

curl -fsS -X POST "${BASE_URL}/categories" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${NAME}\",\"color\":${COLOR_JSON},\"icon\":${ICON_JSON}}"
echo
