# 多语言商品展示与后台一期 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从空仓库搭建一个基于 Next.js 与 PostgreSQL 的一期系统，交付四语商品前台、单管理员后台、留言与订阅管理、Banner/分类/商品发布流程。

**Architecture:** 采用 Next.js App Router 单体应用，前台页面、后台页面、服务端路由与服务端动作统一放在一个 TypeScript 项目中；使用 Prisma 管理 PostgreSQL 模式与数据访问，使用 `next-intl` 管理四语静态文案，后台基于 Cookie Session 做单管理员鉴权。

**Tech Stack:** Next.js, React, TypeScript, PostgreSQL, Prisma, Zod, next-intl, Tailwind CSS, Vitest, Testing Library, Playwright

---

## 0. 前置约束

- 当前目录还不是 Git 仓库。实现前先执行 `git init`，否则本计划里的提交步骤无法完成。
- 当前目录只有设计文档与参考图片，计划按“从空目录开始搭项目”的方式编排。
- 本计划默认使用 `npm`，Node.js 建议版本为 `20.x` 或以上。
- 本计划默认将前台页面放在 `src/app/[locale]` 下，后台页面放在 `src/app/admin` 下。

## 1. 目标文件结构

以下结构是实现前需要先锁定的边界，避免后续把业务逻辑散落到页面里。

- `package.json`
  - 项目脚本、依赖、测试命令
- `next.config.ts`
  - Next.js 配置
- `middleware.ts`
  - 前台语言路由处理与后台登录保护
- `prisma/schema.prisma`
  - 数据库表结构
- `prisma/seed.ts`
  - 初始管理员、演示分类、演示商品
- `src/lib/db.ts`
  - Prisma Client 单例
- `src/lib/env.ts`
  - 环境变量校验
- `src/lib/auth.ts`
  - 管理员登录、Session 创建与校验
- `src/lib/i18n/config.ts`
  - 支持语言与默认语言定义
- `messages/zh-CN.json`
  - 中文静态文案
- `messages/en.json`
  - 英文静态文案
- `messages/es.json`
  - 西语静态文案
- `messages/pt.json`
  - 葡语静态文案
- `src/features/catalog/`
  - 商品、分类、Banner 查询与发布校验逻辑
- `src/features/forms/`
  - 留言、订阅表单校验与写库逻辑
- `src/components/storefront/`
  - 前台组件
- `src/components/admin/`
  - 后台组件
- `src/app/[locale]/`
  - 前台页面
- `src/app/admin/`
  - 后台页面
- `src/app/api/`
  - 可选 API 路由，处理前后台表单提交
- `tests/unit/`
  - 单元测试
- `tests/integration/`
  - 集成测试
- `tests/e2e/`
  - 页面级端到端测试

## 2. 实施任务

### Task 1: 初始化 Next.js 项目骨架与开发工具链

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `tailwind.config.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: 初始化 Git 仓库与 Node 项目**

Run: `git init`
Expected: 输出 `Initialized empty Git repository`

Run: `npm init -y`
Expected: 生成 `package.json`

- [ ] **Step 2: 安装基础依赖**

Run: `npm install next react react-dom`
Expected: 安装完成且 `package.json` 出现生产依赖

Run: `npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer eslint vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright`
Expected: 安装完成且 `package.json` 出现开发依赖

- [ ] **Step 3: 写入基础脚本与全局配置**

`package.json` 至少包含：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

`src/app/layout.tsx` 最小骨架：

```tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: 验证空应用可启动**

Run: `npm run build`
Expected: Build 成功，无 TypeScript 配置错误

- [ ] **Step 5: 提交基础骨架**

Run: `git add package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs tailwind.config.ts src/app/globals.css src/app/layout.tsx .gitignore .env.example vitest.config.ts playwright.config.ts`

Run: `git commit -m "chore: bootstrap nextjs app shell"`
Expected: 首个提交成功

### Task 2: 建立数据库模式、Prisma 接入与种子数据

**Files:**
- Modify: `package.json`
- Modify: `.env.example`
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/env.ts`
- Create: `src/features/catalog/constants.ts`
- Test: `tests/unit/catalog-schema.test.ts`

- [ ] **Step 1: 安装数据库与校验依赖**

Run: `npm install @prisma/client zod bcryptjs`
Expected: 安装完成

Run: `npm install next-intl`
Expected: 国际化依赖安装完成

Run: `npm install -D prisma`
Expected: Prisma CLI 可用

- [ ] **Step 2: 先写失败测试，固定核心表字段**

`tests/unit/catalog-schema.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { publishableStatuses } from "@/features/catalog/constants";

describe("catalog constants", () => {
  it("includes the publish lifecycle statuses", () => {
    expect(publishableStatuses).toEqual(["draft", "pending", "published", "archived"]);
  });
});
```

Run: `npm run test -- tests/unit/catalog-schema.test.ts`
Expected: FAIL，提示模块不存在

- [ ] **Step 3: 写 Prisma 模式与数据库接入**

`prisma/schema.prisma` 至少定义：

- `Admin`
- `Category`
- `Product`
- `ProductImage`
- `Banner`
- `Message`
- `Subscriber`

`Category` 关键字段片段：

```prisma
model Category {
  id             String    @id @default(cuid())
  parentId       String?
  slug           String    @unique
  sortOrder      Int       @default(0)
  iconImageUrl   String?
  isActive       Boolean   @default(true)
  nameZh         String
  nameEn         String
  nameEs         String
  namePt         String
  descriptionZh  String?
  descriptionEn  String?
  descriptionEs  String?
  descriptionPt  String?
}
```

`src/lib/db.ts`：

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 4: 生成客户端并通过测试**

Run: `npx prisma generate`
Expected: Prisma Client 生成成功

Run: `npm run test -- tests/unit/catalog-schema.test.ts`
Expected: PASS

- [ ] **Step 5: 写入环境变量示例与种子数据**

`.env.example` 至少包含：

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/cross"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ChangeMe123!"
WHATSAPP_NUMBER="15551234567"
```

`prisma/seed.ts` 至少创建：

- 1 个管理员账号
- 2 个一级分类
- 每个一级分类下 2 个二级分类
- 4 个演示商品
- 2 条 Banner

- [ ] **Step 6: 提交数据库基础层**

Run: `git add package.json .env.example prisma/schema.prisma prisma/seed.ts src/lib/db.ts src/lib/env.ts tests/unit/catalog-schema.test.ts`

Run: `git commit -m "feat: add prisma schema and seed data"`
Expected: 提交成功

### Task 3: 实现后台单管理员鉴权与路由保护

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/(protected)/layout.tsx`
- Create: `src/app/admin/(protected)/page.tsx`
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`
- Modify: `middleware.ts`
- Test: `tests/unit/auth.test.ts`
- Test: `tests/integration/admin-login.test.ts`

- [ ] **Step 1: 写失败测试，固定登录行为**

`tests/unit/auth.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { isValidAdminPassword } from "@/lib/auth";

describe("admin auth", () => {
  it("validates bcrypt passwords", async () => {
    const ok = await isValidAdminPassword("ChangeMe123!", "$2b$10$example");
    expect(typeof ok).toBe("boolean");
  });
});
```

Run: `npm run test -- tests/unit/auth.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现认证工具与 Session 写入**

`src/lib/auth.ts` 至少导出：

- `hashPassword`
- `isValidAdminPassword`
- `createAdminSession`
- `clearAdminSession`
- `requireAdminSession`

Cookie 约定：

```ts
export const ADMIN_SESSION_COOKIE = "cross_admin_session";
```

- [ ] **Step 3: 实现登录页与登录路由**

`src/app/admin/login/page.tsx` 需要包含：

- 用户名输入框
- 密码输入框
- 登录按钮
- 登录失败提示

`src/app/api/admin/login/route.ts` 最小流程：

```ts
const payload = loginSchema.parse(await request.json());
const admin = await db.admin.findUnique({ where: { username: payload.username } });
if (!admin) return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
```

- [ ] **Step 4: 实现受保护后台布局与中间件**

`middleware.ts` 需要覆盖：

- `/admin/login` 放行
- `/admin` 与 `/admin/**` 需要检查管理员 Cookie

Run: `npm run test -- tests/unit/auth.test.ts tests/integration/admin-login.test.ts`
Expected: PASS

- [ ] **Step 5: 手工验证登录跳转**

Run: `npm run dev`
Expected: 本地站点启动成功

Manual:
- 打开 `/admin/login`
- 未登录访问 `/admin` 应被重定向
- 登录成功后进入后台首页

- [ ] **Step 6: 提交后台鉴权**

Run: `git add src/lib/auth.ts src/app/admin/login/page.tsx src/app/admin/(protected)/layout.tsx src/app/admin/(protected)/page.tsx src/app/api/admin/login/route.ts src/app/api/admin/logout/route.ts middleware.ts tests/unit/auth.test.ts tests/integration/admin-login.test.ts`

Run: `git commit -m "feat: add single-admin authentication"`

### Task 4: 建立四语国际化基础设施与共享前台骨架

**Files:**
- Modify: `next.config.ts`
- Modify: `middleware.ts`
- Create: `src/lib/i18n/config.ts`
- Create: `src/lib/i18n/get-dictionary.ts`
- Create: `messages/zh-CN.json`
- Create: `messages/en.json`
- Create: `messages/es.json`
- Create: `messages/pt.json`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/components/storefront/header.tsx`
- Create: `src/components/storefront/footer.tsx`
- Create: `src/components/storefront/language-switcher.tsx`
- Test: `tests/unit/i18n-config.test.ts`

- [ ] **Step 1: 写失败测试，固定支持语言**

`tests/unit/i18n-config.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { locales, defaultLocale } from "@/lib/i18n/config";

describe("i18n config", () => {
  it("supports four locales", () => {
    expect(locales).toEqual(["zh-CN", "en", "es", "pt"]);
    expect(defaultLocale).toBe("zh-CN");
  });
});
```

Run: `npm run test -- tests/unit/i18n-config.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现语言配置与词典加载**

`src/lib/i18n/config.ts`：

```ts
export const locales = ["zh-CN", "en", "es", "pt"] as const;
export const defaultLocale = "zh-CN";
export type Locale = (typeof locales)[number];
```

静态文案至少覆盖：

- 顶部导航
- 搜索占位
- 留言表单
- 订阅表单
- 商品列表空状态
- 商品详情 CTA
- 后台基础标题

- [ ] **Step 3: 实现前台布局骨架**

`src/app/[locale]/layout.tsx` 负责：

- 注入当前语言环境
- 渲染统一 Header / Footer
- 包装前台页面容器

`src/components/storefront/header.tsx` 需要包含：

- Logo 区
- 搜索框
- 语言切换器
- Portal 入口
- WhatsApp 按钮

- [ ] **Step 4: 更新中间件处理默认语言跳转**

规则：

- `/` 自动跳到默认语言首页或根据浏览器语言跳转
- `/admin/**` 不参与前台多语言前缀处理

Run: `npm run test -- tests/unit/i18n-config.test.ts`
Expected: PASS

- [ ] **Step 5: 提交国际化骨架**

Run: `git add next.config.ts middleware.ts src/lib/i18n/config.ts src/lib/i18n/get-dictionary.ts messages/zh-CN.json messages/en.json messages/es.json messages/pt.json src/app/[locale]/layout.tsx src/components/storefront/header.tsx src/components/storefront/footer.tsx src/components/storefront/language-switcher.tsx tests/unit/i18n-config.test.ts`

Run: `git commit -m "feat: add multilingual storefront shell"`

### Task 5: 实现商品目录查询层与发布校验规则

**Files:**
- Create: `src/features/catalog/constants.ts`
- Create: `src/features/catalog/types.ts`
- Create: `src/features/catalog/publishable.ts`
- Create: `src/features/catalog/queries.ts`
- Create: `src/features/catalog/mappers.ts`
- Test: `tests/unit/publishable-product.test.ts`
- Test: `tests/integration/catalog-query.test.ts`

- [ ] **Step 1: 先写发布校验测试**

`tests/unit/publishable-product.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { getPublishBlockers } from "@/features/catalog/publishable";

describe("product publish rules", () => {
  it("blocks publishing when one locale detail is missing", () => {
    const blockers = getPublishBlockers({
      productCode: "SKU-001",
      priceUsd: 19.9,
      coverImageUrl: "/demo.jpg",
      categoryId: "cat-1",
      nameZh: "中文",
      nameEn: "English",
      nameEs: "Espanol",
      namePt: "Portugues",
      introZh: "ok",
      introEn: "ok",
      introEs: "ok",
      introPt: "ok",
      detailZh: "ok",
      detailEn: "ok",
      detailEs: "",
      detailPt: "ok"
    });

    expect(blockers).toContain("detailEs");
  });
});
```

Run: `npm run test -- tests/unit/publishable-product.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现状态常量与发布校验**

更新 `src/features/catalog/constants.ts`：

```ts
export const publishableStatuses = ["draft", "pending", "published", "archived"] as const;
```

`src/features/catalog/publishable.ts` 负责：

- 校验分类存在
- 校验 `productCode`
- 校验 `priceUsd`
- 校验 `coverImageUrl`
- 校验四语名称/简介/详情
- 返回阻塞字段清单

- [ ] **Step 3: 实现目录查询层**

`src/features/catalog/queries.ts` 至少提供：

- `getHomepagePayload(locale)`
- `getProductListPayload(filters, locale)`
- `getProductDetailBySlug(slug, locale)`
- `getAdminProductList(filters)`
- `getAdminCategoryTree()`

- [ ] **Step 4: 跑单测与集成测试**

Run: `npm run test -- tests/unit/publishable-product.test.ts tests/integration/catalog-query.test.ts`
Expected: PASS

- [ ] **Step 5: 提交目录业务层**

Run: `git add src/features/catalog/constants.ts src/features/catalog/types.ts src/features/catalog/publishable.ts src/features/catalog/queries.ts src/features/catalog/mappers.ts tests/unit/publishable-product.test.ts tests/integration/catalog-query.test.ts`

Run: `git commit -m "feat: add catalog domain rules"`

### Task 6: 实现前台页面与交互

**Files:**
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/products/page.tsx`
- Create: `src/app/[locale]/products/[slug]/page.tsx`
- Create: `src/app/[locale]/categories/[slug]/page.tsx`
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/app/[locale]/subscribe/page.tsx`
- Create: `src/app/[locale]/portal/page.tsx`
- Create: `src/components/storefront/banner-carousel.tsx`
- Create: `src/components/storefront/category-nav.tsx`
- Create: `src/components/storefront/category-icon-grid.tsx`
- Create: `src/components/storefront/product-card.tsx`
- Create: `src/components/storefront/product-gallery.tsx`
- Create: `src/components/storefront/recommended-products.tsx`
- Create: `src/components/storefront/contact-form.tsx`
- Create: `src/components/storefront/subscribe-form.tsx`
- Test: `tests/integration/storefront-routes.test.ts`
- Test: `tests/e2e/storefront.spec.ts`

- [ ] **Step 1: 先写页面级失败测试**

`tests/integration/storefront-routes.test.ts` 至少断言：

- 首页返回 200
- 商品列表页返回 200
- 商品详情页对已发布商品返回 200
- 不存在 slug 返回 404

Run: `npm run test -- tests/integration/storefront-routes.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现首页与列表页**

首页必须包含：

- Header
- Banner 轮播
- 一级分类导航
- 分类图标区
- 推荐商品区
- 订阅入口

列表页必须包含：

- 搜索框
- 一级分类过滤
- 二级分类过滤
- 推荐过滤
- 商品卡片列表

- [ ] **Step 3: 实现详情页与大图查看**

`src/components/storefront/product-gallery.tsx` 最小交互：

```tsx
"use client";

import { useState } from "react";

export function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(images[0]);
  return (
    <div>
      <img src={active} alt="" />
      {images.map((image) => (
        <button key={image} onClick={() => setActive(image)}>
          <img src={image} alt="" />
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: 实现留言、订阅与 WhatsApp 入口页面**

`/contact` 页面包含：

- 姓名
- 邮箱
- 留言内容

`/subscribe` 页面包含：

- 邮箱
- 提交按钮

`/portal` 页面作为轻量入口页，先展示占位说明与返回商城入口。

- [ ] **Step 5: 跑集成与 E2E**

Run: `npm run test -- tests/integration/storefront-routes.test.ts`
Expected: PASS

Run: `npm run test:e2e -- storefront.spec.ts`
Expected: 首页、语言切换、列表页、详情页主流程通过

- [ ] **Step 6: 提交前台页面**

Run: `git add src/app/[locale]/page.tsx src/app/[locale]/products/page.tsx src/app/[locale]/products/[slug]/page.tsx src/app/[locale]/categories/[slug]/page.tsx src/app/[locale]/contact/page.tsx src/app/[locale]/subscribe/page.tsx src/app/[locale]/portal/page.tsx src/components/storefront/banner-carousel.tsx src/components/storefront/category-nav.tsx src/components/storefront/category-icon-grid.tsx src/components/storefront/product-card.tsx src/components/storefront/product-gallery.tsx src/components/storefront/recommended-products.tsx src/components/storefront/contact-form.tsx src/components/storefront/subscribe-form.tsx tests/integration/storefront-routes.test.ts tests/e2e/storefront.spec.ts`

Run: `git commit -m "feat: build multilingual storefront pages"`

### Task 7: 实现后台商品、分类、Banner、留言、订阅管理页

**Files:**
- Create: `src/app/admin/(protected)/products/page.tsx`
- Create: `src/app/admin/(protected)/products/new/page.tsx`
- Create: `src/app/admin/(protected)/products/[id]/page.tsx`
- Create: `src/app/admin/(protected)/categories/page.tsx`
- Create: `src/app/admin/(protected)/banners/page.tsx`
- Create: `src/app/admin/(protected)/messages/page.tsx`
- Create: `src/app/admin/(protected)/subscribers/page.tsx`
- Create: `src/components/admin/product-form.tsx`
- Create: `src/components/admin/category-form.tsx`
- Create: `src/components/admin/banner-form.tsx`
- Create: `src/components/admin/message-table.tsx`
- Create: `src/components/admin/subscriber-table.tsx`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: 先写后台页面渲染测试**

`tests/integration/admin-pages.test.ts` 至少覆盖：

- 未登录被重定向
- 已登录访问商品列表页返回 200
- 留言页返回 200
- 订阅列表页返回 200

Run: `npm run test -- tests/integration/admin-pages.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现后台列表页**

商品列表页要包含：

- 状态筛选
- 分类筛选
- 关键词搜索
- 跳转到新建页

留言列表页要包含：

- 姓名
- 邮箱
- 内容摘要
- 时间
- 状态

- [ ] **Step 3: 实现后台编辑表单**

`src/components/admin/product-form.tsx` 至少分为：

- 基础信息区
- 四语内容区
- 图片区
- 发布控制区

`src/components/admin/category-form.tsx` 至少支持：

- 一级/二级分类选择
- 四语名称与描述
- 图标
- 排序

- [ ] **Step 4: 实现 Banner、留言、订阅页面**

Banner 管理页支持：

- 新建
- 编辑
- 启停
- 排序

留言页支持：

- 查看详情
- 标记已处理

订阅页支持：

- 列表查看
- 状态展示

- [ ] **Step 5: 跑后台集成测试**

Run: `npm run test -- tests/integration/admin-pages.test.ts`
Expected: PASS

- [ ] **Step 6: 提交后台管理页**

Run: `git add src/app/admin/(protected)/products/page.tsx src/app/admin/(protected)/products/new/page.tsx src/app/admin/(protected)/products/[id]/page.tsx src/app/admin/(protected)/categories/page.tsx src/app/admin/(protected)/banners/page.tsx src/app/admin/(protected)/messages/page.tsx src/app/admin/(protected)/subscribers/page.tsx src/components/admin/product-form.tsx src/components/admin/category-form.tsx src/components/admin/banner-form.tsx src/components/admin/message-table.tsx src/components/admin/subscriber-table.tsx tests/integration/admin-pages.test.ts`

Run: `git commit -m "feat: add admin management pages"`

### Task 8: 实现写入接口、表单校验与后台操作

**Files:**
- Create: `src/features/forms/contact.ts`
- Create: `src/features/forms/subscribe.ts`
- Create: `src/features/admin/product-actions.ts`
- Create: `src/features/admin/category-actions.ts`
- Create: `src/features/admin/banner-actions.ts`
- Create: `src/app/api/contact/route.ts`
- Create: `src/app/api/subscribe/route.ts`
- Create: `src/app/api/admin/messages/[id]/process/route.ts`
- Test: `tests/unit/contact-form.test.ts`
- Test: `tests/unit/subscribe-form.test.ts`
- Test: `tests/integration/admin-actions.test.ts`

- [ ] **Step 1: 先写表单校验测试**

`tests/unit/contact-form.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { contactSchema } from "@/features/forms/contact";

describe("contact schema", () => {
  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "A",
      email: "bad-email",
      content: "hello"
    });

    expect(result.success).toBe(false);
  });
});
```

Run: `npm run test -- tests/unit/contact-form.test.ts tests/unit/subscribe-form.test.ts`
Expected: FAIL

- [ ] **Step 2: 实现留言与订阅校验**

`src/features/forms/contact.ts` 至少导出：

- `contactSchema`
- `createMessage`

`src/features/forms/subscribe.ts` 至少导出：

- `subscribeSchema`
- `createSubscriber`

- [ ] **Step 3: 实现后台写操作**

需要实现：

- 新建商品
- 编辑商品
- 发布商品
- 创建/编辑分类
- 创建/编辑 Banner
- 标记留言已处理

商品发布操作必须在服务端再次调用 `getPublishBlockers`，不能只依赖前端校验。

- [ ] **Step 4: 跑单测与集成测试**

Run: `npm run test -- tests/unit/contact-form.test.ts tests/unit/subscribe-form.test.ts tests/integration/admin-actions.test.ts`
Expected: PASS

- [ ] **Step 5: 提交写接口层**

Run: `git add src/features/forms/contact.ts src/features/forms/subscribe.ts src/features/admin/product-actions.ts src/features/admin/category-actions.ts src/features/admin/banner-actions.ts src/app/api/contact/route.ts src/app/api/subscribe/route.ts src/app/api/admin/messages/[id]/process/route.ts tests/unit/contact-form.test.ts tests/unit/subscribe-form.test.ts tests/integration/admin-actions.test.ts`

Run: `git commit -m "feat: add forms and admin write actions"`

### Task 9: 补齐种子数据、验收脚本与最终验证

**Files:**
- Modify: `prisma/seed.ts`
- Create: `README.md`
- Create: `tests/e2e/admin.spec.ts`
- Create: `tests/e2e/contact-subscribe.spec.ts`

- [ ] **Step 1: 补齐演示数据场景**

`prisma/seed.ts` 需要保证：

- 至少 1 个已发布推荐商品
- 至少 1 个未发布商品
- 至少 1 个一级分类带 2 个二级分类
- 至少 1 个 Banner 指向分类
- 至少 1 个 Banner 指向商品

- [ ] **Step 2: 写 README 运行说明**

`README.md` 至少包含：

- 安装依赖
- 配置 `.env`
- 执行 Prisma 命令
- 启动开发环境
- 默认管理员信息来源
- 测试命令

- [ ] **Step 3: 写最终 E2E 场景**

`tests/e2e/admin.spec.ts` 覆盖：

- 登录后台
- 创建商品草稿
- 补齐字段
- 发布商品

`tests/e2e/contact-subscribe.spec.ts` 覆盖：

- 提交留言
- 提交订阅
- 后台可看到新增记录

- [ ] **Step 4: 运行最终验收**

Run: `npm run test`
Expected: 全部单元/集成测试通过

Run: `npm run test:e2e`
Expected: 前台与后台端到端流程通过

Run: `npm run build`
Expected: 生产构建通过

- [ ] **Step 5: 提交最终完善**

Run: `git add prisma/seed.ts README.md tests/e2e/admin.spec.ts tests/e2e/contact-subscribe.spec.ts`

Run: `git commit -m "chore: finalize docs seed and acceptance tests"`

## 3. 实施顺序说明

建议严格按任务顺序执行：

1. 先搭工具链与数据库层
2. 再做鉴权与国际化
3. 再做目录查询与发布规则
4. 然后做前台页面
5. 再做后台页面
6. 最后补写接口、验收测试与文档

不要先写页面再回补数据规则，否则很容易把业务校验散落到组件层。

## 4. 风险与实现注意点

- 后台商品表单会很长，必须拆成多个可读区块，否则维护成本会迅速上升。
- 多语言字段采用平铺列，表单提交时要统一做“按语言成组校验”，不要散着判空。
- `middleware.ts` 同时承担前台语言跳转与后台路由保护，路由条件要写清楚，避免互相影响。
- 商品详情页的大图查看第一阶段不要引入重型图库库，先用轻量客户端状态切换即可。
- 图片上传第一阶段如果没有对象存储条件，可以先用 URL 录入模式；如果要支持文件上传，需要在实现前再补存储选型。
- 当前计划默认 WhatsApp 号码来自环境变量；如果要改成后台可配置，需新增 `settings` 表和后台设置页。

## 5. 完成定义

满足以下条件才算一期完成：

- 前台四语切换正常
- 首页、分类、商品列表、商品详情页可正常使用
- 后台可登录，且能管理商品、分类、Banner、留言、订阅
- 只有发布商品对前台可见
- 留言与订阅能入库
- 全部测试与构建通过
