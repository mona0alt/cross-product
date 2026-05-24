#!/bin/bash
set -e

cd "$(dirname "$0")"

PORT=3000
PM2_BIN="./node_modules/.bin/pm2"
export PM2_HOME="${PM2_HOME:-$(pwd)/.pm2}"

# Ensure logs directory exists
mkdir -p logs
mkdir -p "${PM2_HOME}"

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Restarting server with PM2..."
if "${PM2_BIN}" describe cross >/dev/null 2>&1; then
  "${PM2_BIN}" restart ecosystem.config.js
else
  "${PM2_BIN}" start ecosystem.config.js
fi

"${PM2_BIN}" save >/dev/null 2>&1 || true

echo "Server restarted on 0.0.0.0:${PORT}"
