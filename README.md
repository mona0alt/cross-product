# Cross

基于 Next.js App Router、Prisma 和 PostgreSQL 的多语言商品展示与单管理员后台一期项目。

## 环境要求

- Node.js `20.x` 或以上
- PostgreSQL
- `npm`

## 安装依赖

```bash
npm install
```

## 环境变量

复制 `.env.example` 为本地环境文件并填写实际值：

```bash
cp .env.example .env
```

关键变量：

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `WHATSAPP_NUMBER`

默认管理员信息来自 `.env` 中的 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD`。

## Prisma 命令

生成客户端：

```bash
npm run prisma:generate
```

执行种子数据：

```bash
npm run prisma:seed
```

如果你需要先同步数据库结构，请先执行你自己的 Prisma migration / db push 流程。

## 启动开发环境

```bash
npm run dev
```

默认前台地址：

- `http://localhost:3000/`

后台登录页：

- `http://localhost:3000/admin/login`

## 测试与构建

单元 / 集成测试：

```bash
npm run test
```

端到端测试：

```bash
npm run test:e2e
```

生产构建：

```bash
npm run build
```
