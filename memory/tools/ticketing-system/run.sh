#!/usr/bin/env bash
# TES LLC Ticketing System — Quick Start
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "⚡ TES LLC MSP Ticketing System"
echo "================================"

# Install deps if venv missing
if [ ! -d ".venv" ]; then
  echo "📦 Setting up virtual environment..."
  python3 -m venv .venv
  .venv/bin/pip install -q -r requirements.txt
  echo "✅ Dependencies installed."
fi

echo "🚀 Starting on http://127.0.0.1:5000"
.venv/bin/python app.py
