# Storefront MK-Inspired Reskin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将全部 storefront 前台页面重构为接近 `mk.cl` 当前公开站点的零售门户展示效果，同时保持现有多语言、查询、筛选和表单功能可用。

**Architecture:** 在不改动数据模型与服务端查询边界的前提下，先建立统一的 storefront 主题、头部和楼层壳子，再分别重构首页、列表/分类页、详情页和其余前台落地页。实现上复用现有 App Router 页面与 `features/catalog` 查询，主要调整 `src/components/storefront` 组件结构、页面布局和多语言文案。

**Tech Stack:** Next.js App Router, React 19, TypeScript, next-intl, Tailwind CSS, Vitest

---

## 0. 前置约束

- 当前已确认的设计规格文件为 `docs/superpowers/specs/2026-04-30-storefront-mk-inspired-reskin-design.md`，实现时以该文档为准。
- 本计划不改动后台管理页、Prisma schema、`src/features/catalog/*` 的核心查询返回结构。
- 本计划默认先补或调整测试，再进行对应 UI 重构。
- 当前仓库已有 `.superpowers/` 预览目录，业务实现不要把该目录加入提交。

## 1. 目标文件结构与职责边界

- `src/app/globals.css`
  - 定义 storefront 主题变量、基础排版、全局背景和共享零售风格 token
- `src/app/[locale]/layout.tsx`
  - 组装全局 storefront 外壳，向头部/页脚传递新增文案
- `messages/zh-CN.json`
  - 新增中文 storefront 工具条、快捷入口、CTA、结果摘要等文案
- `messages/en.json`
  - 与中文同步的英文 storefront 文案
- `messages/es.json`
  - 与中文同步的西语 storefront 文案
- `messages/pt.json`
  - 与中文同步的葡语 storefront 文案
- `src/components/storefront/header.tsx`
  - 重构为三层式零售头部，含工具条、主导航、快捷入口区与移动端导航
- `src/components/storefront/footer.tsx`
  - 重构为多区块零售页脚
- `src/components/storefront/banner-carousel.tsx`
  - 升级为 Hero 右侧焦点展示区
- `src/components/storefront/category-nav.tsx`
  - 改为首页快捷分类入口条
- `src/components/storefront/category-icon-grid.tsx`
  - 改为标准零售分类楼层卡片
- `src/components/storefront/product-card.tsx`
  - 改为零售门户商品卡，统一图片、价格、分类、CTA 节奏
- `src/components/storefront/product-gallery.tsx`
  - 改为更稳定的详情页图库
- `src/components/storefront/recommended-products.tsx`
  - 改为带楼层壳子的商品矩阵
- `src/components/storefront/contact-form.tsx`
  - 检查是否需要为新版容器补类名钩子；保留提交行为
- `src/components/storefront/subscribe-form.tsx`
  - 检查是否需要为新版容器补类名钩子；保留提交行为
- `src/components/storefront/section-shell.tsx`
  - 新增，统一楼层标题、副标题、操作链接和外层间距
- `src/components/storefront/top-strip.tsx`
  - 新增，顶部工具条
- `src/components/storefront/hero-showcase.tsx`
  - 新增，首页左文案右 Banner 的焦点区
- `src/components/storefront/quick-links-row.tsx`
  - 新增，首页与全局使用的高密度快捷入口
- `src/components/storefront/filter-sidebar.tsx`
  - 新增，商品列表/分类页左侧筛选栏
- `src/components/storefront/results-toolbar.tsx`
  - 新增，商品列表/分类页标题、摘要、排序占位区
- `src/components/storefront/promo-cta.tsx`
  - 新增，联系/订阅/portal 可复用的大 CTA 区
- `src/app/[locale]/page.tsx`
  - 首页楼层重组
- `src/app/[locale]/products/page.tsx`
  - 商品列表页改为侧栏+结果区结构
- `src/app/[locale]/categories/[slug]/page.tsx`
  - 分类页与商品列表页共享同一结构
- `src/app/[locale]/products/[slug]/page.tsx`
  - 详情页改为图库+信息卡+相关商品楼层
- `src/app/[locale]/contact/page.tsx`
  - 改为 storefront 活动落地页结构
- `src/app/[locale]/subscribe/page.tsx`
  - 改为 storefront 活动落地页结构
- `src/app/[locale]/portal/page.tsx`
  - 改为 storefront 活动落地页结构
- `tests/integration/storefront-routes.test.ts`
  - 扩展现有 storefront 路由断言，覆盖新楼层与关键文案
- `tests/unit/storefront-shell.test.tsx`
  - 新增，验证共享 storefront 组件输出关键结构
- `tests/unit/storefront-catalog-layout.test.tsx`
  - 新增，验证筛选侧栏与商品卡关键信息

## 2. 实施任务

### Task 1: 建立 storefront 主题变量与共享楼层壳子

**Files:**
- Modify: `src/app/globals.css`
- Modify: `messages/zh-CN.json`
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `messages/pt.json`
- Create: `src/components/storefront/section-shell.tsx`
- Create: `src/components/storefront/promo-cta.tsx`
- Test: `tests/unit/storefront-shell.test.tsx`

- [ ] **Step 1: 写共享 storefront 组件失败测试**

`tests/unit/storefront-shell.test.tsx`：

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SectionShell } from '@/components/storefront/section-shell';
import { PromoCta } from '@/components/storefront/promo-cta';

describe('storefront shared shells', () => {
  it('renders a section heading, eyebrow, and action link', () => {
    const html = renderToStaticMarkup(
      <SectionShell title="Featured" eyebrow="Floor" actionLabel="See all" actionHref="/en/products">
        <div>content</div>
      </SectionShell>
    );

    expect(html).toContain('Featured');
    expect(html).toContain('See all');
  });

  it('renders promo cta links', () => {
    const html = renderToStaticMarkup(
      <PromoCta
        title="Need help?"
        description="Talk to us"
        primary={{ href: '/en/contact', label: 'Contact' }}
        secondary={{ href: '/en/subscribe', label: 'Subscribe' }}
      />
    );

    expect(html).toContain('Need help?');
    expect(html).toContain('Subscribe');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run tests/unit/storefront-shell.test.tsx`
Expected: FAIL，提示 `section-shell` 或 `promo-cta` 模块不存在

- [ ] **Step 3: 写最小共享组件与主题变量**

`src/components/storefront/section-shell.tsx` 最小结构：

```tsx
import Link from 'next/link';
import type { ReactNode } from 'react';

export function SectionShell({ title, eyebrow, actionLabel, actionHref, children }: Props) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          {eyebrow ? <p className="storefront-eyebrow">{eyebrow}</p> : null}
          <h2 className="storefront-section-title">{title}</h2>
        </div>
        {actionLabel && actionHref ? <Link href={actionHref}>{actionLabel}</Link> : null}
      </div>
      {children}
    </section>
  );
}
```

`src/app/globals.css` 至少新增：

```css
:root {
  --store-bg: #f3f5f7;
  --store-surface: #ffffff;
  --store-surface-muted: #eef2f6;
  --store-border: #d7dee7;
  --store-text: #0f172a;
  --store-text-muted: #526072;
  --store-accent: #111827;
  --store-accent-soft: #1f2937;
  --store-shadow: 0 24px 60px -36px rgba(15, 23, 42, 0.32);
}
```

- [ ] **Step 4: 扩展 storefront 文案键**

四个 `messages/*.json` 至少补充：

```json
"utilityBar": {
  "support": "Support",
  "service": "Customer Service"
},
"home": {
  "primaryCta": "Browse Products",
  "secondaryCta": "Contact Us"
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npm test -- --run tests/unit/storefront-shell.test.tsx`
Expected: PASS

- [ ] **Step 6: 提交共享 storefront 壳子**

Run: `git add src/app/globals.css messages/zh-CN.json messages/en.json messages/es.json messages/pt.json src/components/storefront/section-shell.tsx src/components/storefront/promo-cta.tsx tests/unit/storefront-shell.test.tsx`

Run: `git commit -m "feat: add storefront theme shells"`
Expected: 提交成功

### Task 2: 重构 layout、header 和 footer 为零售门户骨架

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/components/storefront/header.tsx`
- Modify: `src/components/storefront/footer.tsx`
- Create: `src/components/storefront/top-strip.tsx`
- Create: `src/components/storefront/quick-links-row.tsx`
- Modify: `tests/integration/storefront-routes.test.ts`

- [ ] **Step 1: 先写失败测试，固定新的头部/页脚结构**

在 `tests/integration/storefront-routes.test.ts` 的首页用例中增加断言：

```ts
expect(html).toContain('Portal');
expect(html).toContain('WhatsApp');
expect(html).toContain('Support');
expect(html).toContain('Electronics');
```

- [ ] **Step 2: 运行 storefront 路由测试确认失败**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: FAIL，缺少新的工具条或快捷入口文案

- [ ] **Step 3: 实现三层头部与多区块页脚**

`src/components/storefront/header.tsx` 目标结构：

```tsx
<header>
  <TopStrip ... />
  <div className="storefront-main-header">...</div>
  <QuickLinksRow ... />
</header>
```

头部必须包含：

- 支持型工具条文案
- 品牌区
- 主搜索框
- 首页 / 商品 / 留言 / 订阅导航
- Portal 和 WhatsApp 入口
- 移动端可折叠导航按钮

`src/components/storefront/footer.tsx` 至少改为：

- 品牌说明列
- 常用导航列
- 联系动作列
- 版权底栏

- [ ] **Step 4: 在 locale layout 接入新增文案**

`src/app/[locale]/layout.tsx` 需要把新增 copy 传给 `StorefrontHeader` 与 `StorefrontFooter`，同时调整 `main` 的最大宽度与页边距，使首页与内页能容纳更高密度布局。

- [ ] **Step 5: 运行 storefront 路由测试确认通过**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: PASS

- [ ] **Step 6: 提交全局 storefront 骨架**

Run: `git add src/app/[locale]/layout.tsx src/components/storefront/header.tsx src/components/storefront/footer.tsx src/components/storefront/top-strip.tsx src/components/storefront/quick-links-row.tsx tests/integration/storefront-routes.test.ts`

Run: `git commit -m "feat: rebuild storefront shell layout"`
Expected: 提交成功

### Task 3: 重构首页为零售楼层式展示

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/storefront/banner-carousel.tsx`
- Modify: `src/components/storefront/category-nav.tsx`
- Modify: `src/components/storefront/category-icon-grid.tsx`
- Modify: `src/components/storefront/recommended-products.tsx`
- Create: `src/components/storefront/hero-showcase.tsx`
- Modify: `tests/integration/storefront-routes.test.ts`

- [ ] **Step 1: 扩展首页失败测试**

在首页用例中增加断言：

```ts
expect(html).toContain('Browse Products');
expect(html).toContain('Featured');
expect(html).toContain('Electronics');
```

如果使用已本地化文案，替换为对应实际消息值，但必须覆盖：

- 首页主 CTA
- 分类楼层标题
- 推荐商品楼层标题

- [ ] **Step 2: 运行首页测试确认失败**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: FAIL，首页尚未输出新的楼层结构

- [ ] **Step 3: 写最小首页 Hero 与楼层组装**

`src/components/storefront/hero-showcase.tsx` 最小结构：

```tsx
export function HeroShowcase({ locale, copy, banners }: Props) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
      <div>{/* eyebrow, title, description, CTA, service tags */}</div>
      <BannerCarousel banners={banners} />
    </section>
  );
}
```

`src/app/[locale]/page.tsx` 改为：

- `HeroShowcase`
- `CategoryNav` 快捷入口
- `CategoryIconGrid` 分类楼层
- `RecommendedProducts` 推荐楼层
- `PromoCta` 联系/订阅 CTA

- [ ] **Step 4: 升级 Banner、分类导航和推荐区样式**

要求：

- `banner-carousel` 的主图高度更稳定，支持焦点卡片式外壳
- `category-nav` 改为高密度胶囊入口
- `category-icon-grid` 改为统一高度分类卡
- `recommended-products` 通过 `SectionShell` 输出统一楼层标题

- [ ] **Step 5: 运行 storefront 路由测试确认通过**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: PASS

- [ ] **Step 6: 提交首页重构**

Run: `git add src/app/[locale]/page.tsx src/components/storefront/banner-carousel.tsx src/components/storefront/category-nav.tsx src/components/storefront/category-icon-grid.tsx src/components/storefront/recommended-products.tsx src/components/storefront/hero-showcase.tsx tests/integration/storefront-routes.test.ts`

Run: `git commit -m "feat: redesign storefront homepage"`
Expected: 提交成功

### Task 4: 重构商品卡、列表页与分类页为门户浏览布局

**Files:**
- Modify: `src/app/[locale]/products/page.tsx`
- Modify: `src/app/[locale]/categories/[slug]/page.tsx`
- Modify: `src/components/storefront/product-card.tsx`
- Create: `src/components/storefront/filter-sidebar.tsx`
- Create: `src/components/storefront/results-toolbar.tsx`
- Create: `tests/unit/storefront-catalog-layout.test.tsx`
- Modify: `tests/integration/storefront-routes.test.ts`

- [ ] **Step 1: 写列表布局失败测试**

`tests/unit/storefront-catalog-layout.test.tsx`：

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCard } from '@/components/storefront/product-card';

describe('storefront catalog layout', () => {
  it('renders product price, category, and detail link', () => {
    const html = renderToStaticMarkup(
      <ProductCard
        locale="en"
        ctaLabel="View details"
        product={{
          id: 'p1',
          slug: 'item',
          productCode: 'SKU-1',
          coverImageUrl: '/item.jpg',
          priceUsd: 499,
          isRecommended: true,
          name: 'Item',
          intro: 'Intro',
          detail: 'Detail',
          images: ['/item.jpg'],
          category: { slug: 'chairs', name: 'Chairs' }
        }}
      />
    );

    expect(html).toContain('SKU-1');
    expect(html).toContain('Chairs');
    expect(html).toContain('View details');
  });
});
```

同时在 `tests/integration/storefront-routes.test.ts` 的列表页用例增加：

```ts
expect(html).toContain('recommended');
expect(html).toContain('Star River Pro Phone');
```

- [ ] **Step 2: 运行单元与集成测试确认失败**

Run: `npm test -- --run tests/unit/storefront-catalog-layout.test.tsx tests/integration/storefront-routes.test.ts`
Expected: FAIL，新的布局组件尚不存在或旧结构不匹配

- [ ] **Step 3: 实现筛选侧栏与结果工具栏**

`src/components/storefront/filter-sidebar.tsx` 至少输出：

- 搜索框
- 一级分类下拉
- 二级分类下拉
- 推荐筛选 checkbox
- 提交按钮

`src/components/storefront/results-toolbar.tsx` 至少输出：

- 标题
- 简介
- 当前筛选摘要
- 排序占位

- [ ] **Step 4: 重写产品页和分类页布局**

`src/app/[locale]/products/page.tsx` 与 `src/app/[locale]/categories/[slug]/page.tsx` 改为桌面两栏结构：

```tsx
<div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
  <FilterSidebar ... />
  <div className="space-y-6">
    <ResultsToolbar ... />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {/* ProductCard */}
    </div>
  </div>
</div>
```

`product-card.tsx` 要强化：

- 图片外壳
- 价格标签
- 分类元信息
- 更接近零售卡的底部 CTA

- [ ] **Step 5: 运行相关测试确认通过**

Run: `npm test -- --run tests/unit/storefront-catalog-layout.test.tsx tests/integration/storefront-routes.test.ts`
Expected: PASS

- [ ] **Step 6: 提交目录浏览重构**

Run: `git add src/app/[locale]/products/page.tsx src/app/[locale]/categories/[slug]/page.tsx src/components/storefront/product-card.tsx src/components/storefront/filter-sidebar.tsx src/components/storefront/results-toolbar.tsx tests/unit/storefront-catalog-layout.test.tsx tests/integration/storefront-routes.test.ts`

Run: `git commit -m "feat: redesign storefront catalog pages"`
Expected: 提交成功

### Task 5: 重构商品详情页与图库展示

**Files:**
- Modify: `src/app/[locale]/products/[slug]/page.tsx`
- Modify: `src/components/storefront/product-gallery.tsx`
- Modify: `src/components/storefront/recommended-products.tsx`
- Modify: `tests/integration/storefront-routes.test.ts`

- [ ] **Step 1: 扩展详情页失败测试**

在详情页用例中增加断言：

```ts
expect(html).toContain('P-1001');
expect(html).toContain('WhatsApp');
expect(html).toContain('Full detail');
```

- [ ] **Step 2: 运行 storefront 路由测试确认失败**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: FAIL，详情页新版信息卡和推荐楼层未就位

- [ ] **Step 3: 实现详情页新版结构**

`src/app/[locale]/products/[slug]/page.tsx` 至少变为：

```tsx
<div className="space-y-10">
  <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
    <ProductGallery images={...} />
    <aside className="storefront-buy-panel">{/* category, name, code, price, detail, CTA */}</aside>
  </section>
  <RecommendedProducts ... />
</div>
```

`product-gallery.tsx` 需要：

- 主图容器固定比例
- 缩略图选中态清晰
- 小屏保持可用

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: PASS

- [ ] **Step 5: 提交详情页重构**

Run: `git add src/app/[locale]/products/[slug]/page.tsx src/components/storefront/product-gallery.tsx src/components/storefront/recommended-products.tsx tests/integration/storefront-routes.test.ts`

Run: `git commit -m "feat: redesign storefront product detail"`
Expected: 提交成功

### Task 6: 统一联系页、订阅页与 Portal 页视觉结构

**Files:**
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/app/[locale]/subscribe/page.tsx`
- Modify: `src/app/[locale]/portal/page.tsx`
- Modify: `src/components/storefront/contact-form.tsx`
- Modify: `src/components/storefront/subscribe-form.tsx`
- Modify: `tests/integration/storefront-routes.test.ts`

- [ ] **Step 1: 扩展前台落地页失败测试**

在 `tests/integration/storefront-routes.test.ts` 新增或扩展用例，确认：

```ts
expect(contactHtml).toContain('联系');
expect(contactHtml).toContain('发送');
expect(subscribeHtml).toContain('订阅');
expect(portalHtml).toContain('返回商城首页');
```

- [ ] **Step 2: 运行 storefront 路由测试确认失败**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: FAIL，页面尚未输出统一的新版结构或关键 CTA

- [ ] **Step 3: 重写三个落地页布局**

三个页面统一为：

```tsx
<div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
  <section>{/* eyebrow, title, description, helper bullets */}</section>
  <section className="rounded-[...] border ...">{/* form or portal actions */}</section>
</div>
```

必要时给 `contact-form.tsx` / `subscribe-form.tsx` 增加外层 className 接口，但不要改动提交行为。

- [ ] **Step 4: 运行 storefront 路由测试确认通过**

Run: `npm test -- --run tests/integration/storefront-routes.test.ts`
Expected: PASS

- [ ] **Step 5: 提交其余前台页统一**

Run: `git add src/app/[locale]/contact/page.tsx src/app/[locale]/subscribe/page.tsx src/app/[locale]/portal/page.tsx src/components/storefront/contact-form.tsx src/components/storefront/subscribe-form.tsx tests/integration/storefront-routes.test.ts`

Run: `git commit -m "feat: unify storefront support pages"`
Expected: 提交成功

### Task 7: 全量验证与回归整理

**Files:**
- Modify: `.gitignore`
- Modify: `tests/unit/home-page.test.tsx`
- Modify: `README.md`

- [ ] **Step 1: 清理过时测试与本地预览目录忽略规则**

`tests/unit/home-page.test.tsx` 当前仍在断言旧的 skeleton 文案，应改为与当前根路由行为一致的断言，避免长期保留失效测试。

`.gitignore` 增加：

```gitignore
.superpowers/
```

- [ ] **Step 2: 运行完整单元与集成测试**

Run: `npm test`
Expected: 全部 Vitest 用例通过

- [ ] **Step 3: 运行 lint**

Run: `npm run lint`
Expected: 无 ESLint 报错

- [ ] **Step 4: 运行关键 e2e 或至少 build**

Run: `npm run build`
Expected: Next.js build 成功

如本地有可用浏览器环境，再执行：

Run: `npm run test:e2e -- --project=chromium tests/e2e/storefront.spec.ts`
Expected: storefront 关键路径通过

- [ ] **Step 5: 更新 README 中的 storefront 描述**

补充本次前台改造后的页面结构、运行方式和测试命令，避免文档仍停留在旧的 skeleton 表述。

- [ ] **Step 6: 提交验证与文档收尾**

Run: `git add .gitignore tests/unit/home-page.test.tsx README.md`

Run: `git commit -m "chore: finalize storefront reskin verification"`
Expected: 提交成功

## 3. 执行顺序说明

- 必须先完成 Task 1 和 Task 2，再做任何页面级重构，否则样式 token 和全局壳子会反复返工。
- Task 3、Task 4、Task 5、Task 6 可以按顺序执行，不建议并行，因为它们会共享 header/footer/theme/messages 和部分共享组件。
- Task 7 只能在所有页面改造完成后执行。

## 4. 验证标准

- 首页首屏必须呈现零售门户风格的头部、Hero、快捷入口与楼层编排。
- 商品列表页和分类页必须呈现桌面两栏结构，并保留现有筛选能力。
- 商品详情页必须保留价格、商品编码、描述和 WhatsApp CTA。
- 联系页、订阅页、Portal 页必须与 storefront 新视觉统一。
- 四语 messages 文件不能缺失新增键值。
- `npm test`、`npm run lint`、`npm run build` 必须通过。
