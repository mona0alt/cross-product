#!/bin/bash
set -e

cd "$(dirname "$0")"

PORT=3000

# Ensure logs directory exists
mkdir -p logs

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Restarting server with PM2..."
if pm2 describe cross >/dev/null 2>&1; then
  pm2 restart ecosystem.config.js
else
  pm2 start ecosystem.config.js
fi

pm2 save >/dev/null 2>&1 || true

echo "Server restarted on 0.0.0.0:${PORT}"
