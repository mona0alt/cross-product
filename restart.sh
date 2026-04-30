#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Killing process on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "Building..."
npm run build

echo "Starting server on 0.0.0.0:3000..."
HOSTNAME=0.0.0.0 PORT=3000 npm start
