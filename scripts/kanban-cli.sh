#!/bin/bash
# Kanban Board Integration Script
# Usage: ./kanban-cli.sh <action> <board> <task-title> [description]

KANBAN_URL="http://192.168.4.57:3000"
USERNAME="Axiom"
PASSWORD="techelectrical2026"

# Login and get token
TOKEN=$(curl -s -X POST "$KANBAN_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to login to kanban"
  exit 1
fi

case "$1" in
  list-boards)
    curl -s "$KANBAN_URL/api/boards" -H "Authorization: Bearer $TOKEN" | jq '.'
    ;;
  list-tasks)
    BOARD_ID=$(curl -s "$KANBAN_URL/api/boards" -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.name=="'"$2"'") | .id')
    if [ -n "$BOARD_ID" ]; then
      curl -s "$KANBAN_URL/api/boards/$BOARD_ID" -H "Authorization: Bearer $TOKEN" | jq '.columns[].tasks[]'
    fi
    ;;
  create-task)
    BOARD_ID=$(curl -s "$KANBAN_URL/api/boards" -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.name=="'"$2"'") | .id')
    COL_ID=$(curl -s "$KANBAN_URL/api/boards/$BOARD_ID" -H "Authorization: Bearer $TOKEN" | jq -r '.columns[0].id')
    curl -s -X POST "$KANBAN_URL/api/tasks" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"title\":\"$3\",\"description\":\"${4:-}\",\"column_id\":$COL_ID,\"priority\":\"medium\",\"tags\":[\"agent\"]}" | jq '.'
    ;;
  move-task)
    curl -s -X PUT "$KANBAN_URL/api/tasks/$2/move" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"column_id\":$3,\"position\":0}" | jq '.'
    ;;
  *)
    echo "Usage: $0 {list-boards|list-tasks|create-task|move-task} [args...]"
    ;;
esac
