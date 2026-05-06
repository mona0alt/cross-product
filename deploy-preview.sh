#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTE_HOST="43.143.236.37"
REMOTE_USER="ubuntu"
REMOTE_DIR="/home/ubuntu/project/cross/cross"
PROJECT_NAME="cross"

cd "$SCRIPT_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  echo "[ERROR] $*" >&2
  exit 1
}

# 1. 前置检查
log "检查本地依赖..."
if ! command -v rsync &>/dev/null; then
  error "本地缺少 rsync，请先安装"
fi

log "检查远程连通性..."
if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" 'echo ok' &>/dev/null; then
  error "无法连接到 ${REMOTE_USER}@${REMOTE_HOST}"
fi

# 2. 同步代码到远程
log "同步代码到 ${REMOTE_HOST}:${REMOTE_DIR}..."
rsync -avz \
  --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='logs' \
  --exclude='test-results' \
  --exclude='*.log' \
  --exclude='.claude' \
  --exclude='.env' \
  "${SCRIPT_DIR}/" \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

# 3. 远程部署
log "在远程执行部署..."
ssh -t "${REMOTE_USER}@${REMOTE_HOST}" bash -lc "
set -e
cd '${REMOTE_DIR}'

# 如果远程没有 .env，从 .env.example 复制
if [ ! -f .env ] && [ -f .env.example ]; then
  echo '创建 .env 从 .env.example'
  cp .env.example .env
fi

# 确保 logs 目录存在
mkdir -p logs

echo '安装依赖...'
npm install

echo '构建...'
npm run build

echo 'PM2 重启...'
if pm2 describe '${PROJECT_NAME}' >/dev/null 2>&1; then
  pm2 restart ecosystem.config.js
else
  pm2 start ecosystem.config.js
fi

pm2 save >/dev/null 2>&1 || true
echo '部署完成'
"

log "预览环境部署完成: http://${REMOTE_HOST}"
