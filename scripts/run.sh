#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

PORT="${DEPLOY_RUN_PORT:-5000}"

# Clean up any existing process on this port (never touch 9000)
fuser -k "${PORT}/tcp" 2>/dev/null || true
sleep 1

echo "Starting server on port ${PORT}..."
exec npx serve public -l "$PORT" --cors