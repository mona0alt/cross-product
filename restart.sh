#!/bin/bash
set -e

cd "$(dirname "$0")"

PORT=3000

echo "Killing process on port ${PORT}..."
PIDS=$(lsof -ti:${PORT} 2>/dev/null || true)
if [ -n "$PIDS" ]; then
  echo "$PIDS" | xargs kill -9 2>/dev/null || true
  for _ in 1 2 3 4 5; do
    sleep 1
    [ -z "$(lsof -ti:${PORT} 2>/dev/null || true)" ] && break
  done
fi

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Starting server on 0.0.0.0:${PORT}..."
HOSTNAME=0.0.0.0 PORT=${PORT} npm start
