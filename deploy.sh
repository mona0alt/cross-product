#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="cross"
NGINX_CONF_NAME="cross"
SKIP_DATABASE_SETUP="${SKIP_DATABASE_SETUP:-0}"

cd "$SCRIPT_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  echo "[ERROR] $*" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 1. 前置检查
log "检查必要依赖..."
REQUIRED_COMMANDS=(node npm nginx pm2 curl)
if [ "$SKIP_DATABASE_SETUP" != "1" ]; then
  REQUIRED_COMMANDS+=(psql)
fi

for cmd in "${REQUIRED_COMMANDS[@]}"; do
  if ! command_exists "$cmd"; then
    error "缺少命令: $cmd，请先安装"
  fi
done

NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_NODE="20.19.0"
if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]; then
  error "Node.js 版本过低: $NODE_VERSION，需要 >= $REQUIRED_NODE"
fi
log "依赖检查通过"

# 2. 环境变量
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    log "复制 .env.example 到 .env"
    cp .env.example .env
  else
    error "缺少 .env 和 .env.example 文件"
  fi
fi

# 3. 数据库初始化
if [ "$SKIP_DATABASE_SETUP" = "1" ]; then
  log "跳过数据库初始化和 Prisma schema 同步"
else
  # 解析数据库连接信息
  DATABASE_URL=$(grep -E '^DATABASE_URL=' .env | cut -d'"' -f2 | cut -d"'" -f2)
  if [ -z "$DATABASE_URL" ]; then
    error "无法从 .env 解析 DATABASE_URL"
  fi

  # 提取数据库名
  db_user=$(echo "$DATABASE_URL" | sed -n 's|postgresql://\([^:]*\):.*|\1|p')
  db_pass=$(echo "$DATABASE_URL" | sed -n 's|postgresql://[^:]*:\([^@]*\)@.*|\1|p')
  db_host=$(echo "$DATABASE_URL" | sed -n 's|postgresql://[^@]*@\([^:]*\):.*|\1|p')
  db_port=$(echo "$DATABASE_URL" | sed -n 's|postgresql://[^@]*@[^:]*:\([^/]*\)/.*|\1|p')
  db_name=$(echo "$DATABASE_URL" | sed -n 's|postgresql://[^/]*/\([^?]*\).*|\1|p')

  # 设置默认值
  : "${db_user:=postgres}"
  : "${db_pass:=postgres}"
  : "${db_host:=localhost}"
  : "${db_port:=5432}"
  : "${db_name:=cross}"

  export PGPASSWORD="$db_pass"

  log "初始化数据库..."
  if ! pg_isready -h "$db_host" -p "$db_port" >/dev/null 2>&1; then
    error "PostgreSQL 未运行或无法连接 ($db_host:$db_port)"
  fi

  # 设置 postgres 用户密码（如果通过 peer/trust 连接）
  if [ "$db_user" = "postgres" ]; then
    if sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$db_pass';" >/dev/null 2>&1; then
      log "已设置 postgres 用户密码"
    fi
  fi

  # 创建数据库（如果不存在）
  if ! psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" -c '\q' >/dev/null 2>&1; then
    log "创建数据库: $db_name"
    psql -h "$db_host" -p "$db_port" -U "$db_user" -d postgres -c "CREATE DATABASE \"$db_name\";" >/dev/null 2>&1 || true
  fi
  log "数据库就绪"
fi

# 4. 安装依赖
log "安装 npm 依赖..."
npm ci

# 5. Prisma
log "Prisma generate..."
npx prisma generate

if [ "$SKIP_DATABASE_SETUP" = "1" ]; then
  log "跳过 Prisma migrate/db push/seed"
else
  log "Prisma 同步数据库 schema..."
  if [ -d prisma/migrations ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
    npx prisma migrate deploy
  else
    npx prisma db push --accept-data-loss
  fi

  if [ "${RUN_PRISMA_SEED:-0}" = "1" ]; then
    log "Prisma seed..."
    npx prisma db seed
  else
    log "跳过 Prisma seed（设置 RUN_PRISMA_SEED=1 可执行）"
  fi
fi

# 6. 构建
log "构建 Next.js..."
npm run build

# 7. PM2
log "配置 PM2..."
mkdir -p logs

if pm2 describe "$PROJECT_NAME" >/dev/null 2>&1; then
  log "重启 PM2 应用: $PROJECT_NAME"
  pm2 restart ecosystem.config.js
else
  log "启动 PM2 应用: $PROJECT_NAME"
  pm2 start ecosystem.config.js
fi

pm2 save >/dev/null 2>&1 || true

# 8. Nginx
log "配置 Nginx..."
NGINX_SITE="/etc/nginx/sites-available/$NGINX_CONF_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$NGINX_CONF_NAME"

sudo tee "$NGINX_SITE" >/dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /show/ {
        alias $SCRIPT_DIR/public/show/;
    }
}
EOF

sudo ln -sf "$NGINX_SITE" "$NGINX_ENABLED"
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t || error "Nginx 配置测试失败"
sudo nginx -s reload || sudo systemctl reload nginx || true

# 9. 修复 /show/ 静态文件权限
if [ "$(dirname "$SCRIPT_DIR")" = "/home/ubuntu" ] || [[ "$SCRIPT_DIR" == /home/ubuntu/* ]]; then
  if [ "$(stat -c '%a' /home/ubuntu)" = "750" ] || [ "$(stat -c '%a' /home/ubuntu)" = "700" ]; then
    log "修复 /home/ubuntu 目录权限（供 Nginx 访问 /show/）..."
    chmod o+x /home/ubuntu
  fi
fi

# 10. 验证
log "验证服务..."
sleep 2
LOCAL_IP=$(hostname -I | awk '{print $1}')
HTTP_CODE=$(curl -L -s -o /dev/null -w "%{http_code}" "http://$LOCAL_IP/" || echo "000")
SHOW_CODE=$(curl -L -s -o /dev/null -w "%{http_code}" "http://$LOCAL_IP/show/robot_window_cleaner.png" || echo "000")

log "================================"
log "首页状态: $HTTP_CODE"
log "静态文件状态: $SHOW_CODE"
log "访问地址: http://$LOCAL_IP"
log "================================"

if [ "$HTTP_CODE" = "200" ] && [ "$SHOW_CODE" = "200" ]; then
  log "部署完成！"
else
  error "验证失败，请检查日志"
fi
