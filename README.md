# Cross

基于 Next.js App Router、Prisma 和 PostgreSQL 的多语言商品展示与单管理员后台一期项目。

## 前台说明

当前 storefront 已重构为更偏零售门户的前台结构，覆盖以下页面：

- 多语言首页：`/[locale]`
- 商品列表页：`/[locale]/products`
- 分类页：`/[locale]/categories/[slug]`
- 商品详情页：`/[locale]/products/[slug]`
- 联系页：`/[locale]/contact`
- 订阅页：`/[locale]/subscribe`
- Portal 页：`/[locale]/portal`

前台视觉方向为浅底高对比、楼层式陈列、强分类入口与零售型商品卡，参考家居零售站的展示逻辑，但不包含第三方品牌素材复制。

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

默认会重定向到：

- `http://localhost:3000/en`

后台登录页：

- `http://localhost:3000/admin/login`

## 测试与构建

单元 / 集成测试：

```bash
npm run test
```

当前 storefront 相关测试覆盖：

- 根路由默认语言重定向
- storefront 共享壳子组件
- 全局头部 / 页脚骨架
- 列表页筛选与结果工具栏
- 详情页图库结构
- 前台首页、列表页、详情页、联系页、订阅页、portal 页渲染

端到端测试：

```bash
npm run test:e2e
```

生产构建：

```bash
npm run build
```
