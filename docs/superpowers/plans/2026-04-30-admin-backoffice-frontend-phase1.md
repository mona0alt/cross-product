# Admin Backoffice Frontend Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved admin backoffice frontend prototype in the existing Next.js admin area with mock data, including the new workbench home, unified product center, crawl tasks, subscriber notifications, and AI insights pages.

**Architecture:** Keep the current App Router admin routes and replace the minimal placeholder UI with a mock-driven presentation layer. Centralize prototype-only admin mock data and small presentational components so the new pages share badges, cards, and review states without changing Prisma schema or implementing real mutations.

**Tech Stack:** Next.js App Router, React Server Components, Tailwind CSS, TypeScript, Vitest, Playwright

---

## Scope Guard

This plan only covers frontend prototype work for the admin area.

Explicitly in scope:

- Admin layout and navigation refresh
- Mock-driven dashboard cards, tables, charts, and review panels
- Product center list and manual-create form redesign
- Crawl task, subscriber notification, and AI insight pages
- Regression coverage for admin rendering and core navigation

Explicitly out of scope:

- Prisma schema changes
- Real create/edit/publish mutations
- Real crawler integrations
- Real email sending
- Real analytics ingestion

## File Structure

### Existing files to modify

- `src/app/admin/(protected)/layout.tsx`
  - Replace the bare header wrapper with a real admin shell, left nav, top summary, and content container.
- `src/app/admin/(protected)/page.tsx`
  - Replace the placeholder dashboard copy with the new workbench homepage.
- `src/app/admin/(protected)/products/page.tsx`
  - Replace the current raw table with the unified product center view.
- `src/app/admin/(protected)/products/new/page.tsx`
  - Retitle and restyle the manual create page around “submit for review”.
- `src/app/admin/(protected)/products/[id]/page.tsx`
  - Keep edit support but align the page with the new product review experience.
- `src/app/admin/(protected)/subscribers/page.tsx`
  - Evolve from a simple table page into the combined subscriber/notification overview.
- `tests/integration/admin-pages.test.ts`
  - Update expected content for the redesigned admin routes.
- `tests/e2e/admin.spec.ts`
  - Update the admin smoke flow to assert the new navigation and product-create framing.

### Existing files that may be modified or replaced

- `src/components/admin/product-form.tsx`
  - Restructure into a richer prototype form with grouped sections, review hints, and action footer.
- `src/components/admin/subscriber-table.tsx`
  - Either upgrade it into a richer subscriber/notification block or replace usage with new focused components.

### New files to create

- `src/features/admin/mock-backoffice.ts`
  - Single source of mock dashboard, product review, crawler, notification, and analytics data.
- `src/components/admin/admin-nav.tsx`
  - Left-side navigation with active section styling.
- `src/components/admin/admin-shell-header.tsx`
  - Top shell header with current admin identity and logout button.
- `src/components/admin/dashboard-workbench.tsx`
  - Dashboard page body.
- `src/components/admin/product-center.tsx`
  - Unified product center table, toolbar, and summary.
- `src/components/admin/product-review-drawer.tsx`
  - Static review-side panel for product completeness and actions.
- `src/components/admin/status-badge.tsx`
  - Shared badge component for sources, states, and task health.
- `src/components/admin/crawl-task-board.tsx`
  - Crawl sources, batch health, and parsing quality cards.
- `src/components/admin/subscriber-notification-board.tsx`
  - Combined subscriber KPIs, campaigns, and failure queue.
- `src/components/admin/analytics-insights-board.tsx`
  - Ranked insights, simple charts, and AI recommendation blocks.
- `tests/unit/admin-layout-shell.test.tsx`
  - Rendering test for the new admin shell/navigation.
- `tests/unit/admin-dashboard-workbench.test.tsx`
  - Rendering test for the dashboard content.
- `tests/unit/admin-product-center.test.tsx`
  - Rendering test for source labels, review states, and product actions.

## Task 1: Create the Mock Data Backbone

**Files:**
- Create: `src/features/admin/mock-backoffice.ts`
- Test: `tests/unit/admin-dashboard-workbench.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { DashboardWorkbench } from '@/components/admin/dashboard-workbench';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('DashboardWorkbench', () => {
  it('renders the workbench hero and todo counts', () => {
    const html = renderToStaticMarkup(
      <DashboardWorkbench data={mockBackoffice.dashboard} />
    );

    expect(html).toContain('先处理待审核商品');
    expect(html).toContain('待审核商品');
    expect(html).toContain('今日新增候选商品');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/admin-dashboard-workbench.test.tsx`

Expected: FAIL because `DashboardWorkbench` and `mock-backoffice.ts` do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const mockBackoffice = {
  dashboard: {
    heroTitle: '先处理待审核商品，再回看通知和数据',
    todoItems: [
      { label: '待审核商品', value: 26 },
      { label: '抓取异常', value: 3 }
    ],
    kpis: [
      { label: '今日新增候选商品', value: '18', detail: '抓取 11 / 手动 7' }
    ]
  },
  products: {
    rows: [
      {
        id: 'product-1',
        name: 'Warehouse Drone Mini',
        productCode: 'DR-2041',
        source: 'manual',
        reviewStatus: 'pending'
      }
    ]
  }
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/admin-dashboard-workbench.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/admin/mock-backoffice.ts tests/unit/admin-dashboard-workbench.test.tsx
git commit -m "feat: add admin mock backoffice data"
```

## Task 2: Replace the Protected Admin Shell

**Files:**
- Modify: `src/app/admin/(protected)/layout.tsx`
- Create: `src/components/admin/admin-nav.tsx`
- Create: `src/components/admin/admin-shell-header.tsx`
- Create: `src/components/admin/status-badge.tsx`
- Test: `tests/unit/admin-layout-shell.test.tsx`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Write the failing tests**

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import AdminProtectedLayout from '@/app/admin/(protected)/layout';

describe('admin shell', () => {
  it('renders the left navigation labels', async () => {
    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('工作台');
    expect(html).toContain('商品中心');
    expect(html).toContain('AI 数据分析');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/admin-layout-shell.test.tsx tests/integration/admin-pages.test.ts`

Expected: FAIL because the current layout only renders a top header and no admin nav labels.

- [ ] **Step 3: Write minimal implementation**

```tsx
const navItems = [
  { href: '/admin', label: '工作台' },
  { href: '/admin/products', label: '商品中心' },
  { href: '/admin/subscribers', label: '订阅与通知' }
];

return (
  <div className="min-h-screen bg-stone-100 text-slate-950">
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-[240px_1fr]">
      <AdminNav items={navItems} />
      <div>
        <AdminShellHeader admin={admin} />
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  </div>
);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/admin-layout-shell.test.tsx tests/integration/admin-pages.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/layout.tsx src/components/admin/admin-nav.tsx src/components/admin/admin-shell-header.tsx src/components/admin/status-badge.tsx tests/unit/admin-layout-shell.test.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: redesign admin shell navigation"
```

## Task 3: Build the Workbench Dashboard

**Files:**
- Modify: `src/app/admin/(protected)/page.tsx`
- Create: `src/components/admin/dashboard-workbench.tsx`
- Modify: `tests/unit/admin-dashboard-workbench.test.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Extend the failing tests**

```tsx
expect(html).toContain('新建商品');
expect(html).toContain('发起抓取');
expect(html).toContain('本周上新节奏');
expect(html).toContain('热门分类');
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/admin-dashboard-workbench.test.tsx tests/integration/admin-pages.test.ts`

Expected: FAIL because the page still renders placeholder dashboard copy.

- [ ] **Step 3: Write minimal implementation**

```tsx
import { DashboardWorkbench } from '@/components/admin/dashboard-workbench';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminDashboardPage() {
  return <DashboardWorkbench data={mockBackoffice.dashboard} />;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/admin-dashboard-workbench.test.tsx tests/integration/admin-pages.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/page.tsx src/components/admin/dashboard-workbench.tsx tests/unit/admin-dashboard-workbench.test.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: add admin workbench dashboard"
```

## Task 4: Rebuild the Product Center and Review Panel

**Files:**
- Modify: `src/app/admin/(protected)/products/page.tsx`
- Create: `src/components/admin/product-center.tsx`
- Create: `src/components/admin/product-review-drawer.tsx`
- Create: `tests/unit/admin-product-center.test.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Write the failing tests**

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders both source labels and review actions', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).toContain('自动抓取');
    expect(html).toContain('手动导入');
    expect(html).toContain('内容完整度');
    expect(html).toContain('发起抓取');
    expect(html).toContain('新建商品');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/integration/admin-pages.test.ts`

Expected: FAIL because the unified product center component does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```tsx
export function ProductCenter({ data }: { data: ProductCenterData }) {
  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p>Products</p>
          <h2>商品中心</h2>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new">新建商品</Link>
          <Link href="/admin/crawl-tasks">发起抓取</Link>
        </div>
      </header>
      <table>
        <tbody>{/* source, review status, completeness */}</tbody>
      </table>
      <ProductReviewDrawer review={data.featuredReview} />
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/integration/admin-pages.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/products/page.tsx src/components/admin/product-center.tsx src/components/admin/product-review-drawer.tsx tests/unit/admin-product-center.test.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: redesign admin product center"
```

## Task 5: Redesign the Manual Product Form and Edit Page

**Files:**
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`
- Modify: `src/components/admin/product-form.tsx`
- Modify: `tests/e2e/admin.spec.ts`
- Modify: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Tighten the failing tests**

```ts
await expect(page.getByRole('heading', { name: '手动新建商品' })).toBeVisible();
await expect(page.getByText('提交审核')).toBeVisible();
await expect(page.getByText('审核提示')).toBeVisible();
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/integration/admin-pages.test.ts && npm run test:e2e -- admin.spec.ts`

Expected: FAIL because the current page says `新建商品草稿` and does not render the new action framing.

- [ ] **Step 3: Write minimal implementation**

```tsx
<section className="space-y-6">
  <div>
    <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Products</p>
    <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
      手动新建商品
    </h2>
    <p className="text-sm text-slate-600">创建后默认进入待审核，不直接发布。</p>
  </div>
  <ProductForm mode="create" categories={flattenCategories(categories)} />
</section>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/integration/admin-pages.test.ts && npm run test:e2e -- admin.spec.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/products/new/page.tsx src/app/admin/\(protected\)/products/\[id\]/page.tsx src/components/admin/product-form.tsx tests/integration/admin-pages.test.ts tests/e2e/admin.spec.ts
git commit -m "feat: redesign admin product form flow"
```

## Task 6: Add Crawl Tasks and Upgrade Subscriber Notifications

**Files:**
- Create: `src/app/admin/(protected)/crawl-tasks/page.tsx`
- Create: `src/components/admin/crawl-task-board.tsx`
- Modify: `src/app/admin/(protected)/subscribers/page.tsx`
- Create: `src/components/admin/subscriber-notification-board.tsx`
- Modify: `src/components/admin/subscriber-table.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Write the failing tests**

```tsx
const CrawlTasksPage =
  (await import('@/app/admin/(protected)/crawl-tasks/page')).default;
const crawlHtml = renderToStaticMarkup(await CrawlTasksPage());

expect(crawlHtml).toContain('抓取任务看板');
expect(crawlHtml).toContain('来源站点');
expect(subscribersHtml).toContain('邮件通知');
expect(subscribersHtml).toContain('失败重发');
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: FAIL because the route and richer subscriber view do not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
export default function AdminCrawlTasksPage() {
  return <CrawlTaskBoard data={mockBackoffice.crawlTasks} />;
}

export default function AdminSubscribersPage() {
  return <SubscriberNotificationBoard data={mockBackoffice.subscribers} />;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/crawl-tasks/page.tsx src/components/admin/crawl-task-board.tsx src/app/admin/\(protected\)/subscribers/page.tsx src/components/admin/subscriber-notification-board.tsx src/components/admin/subscriber-table.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: add admin crawl and notification views"
```

## Task 7: Add the AI Insights Page and Final Admin Regression Sweep

**Files:**
- Create: `src/app/admin/(protected)/analytics/page.tsx`
- Create: `src/components/admin/analytics-insights-board.tsx`
- Modify: `tests/integration/admin-pages.test.ts`
- Modify: `tests/e2e/admin.spec.ts`

- [ ] **Step 1: Write the failing tests**

```tsx
const AnalyticsPage =
  (await import('@/app/admin/(protected)/analytics/page')).default;
const analyticsHtml = renderToStaticMarkup(await AnalyticsPage());

expect(analyticsHtml).toContain('AI 经营分析台');
expect(analyticsHtml).toContain('热门商品');
expect(analyticsHtml).toContain('用户转化路径');
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: FAIL because the route and board component do not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
export default function AdminAnalyticsPage() {
  return <AnalyticsInsightsBoard data={mockBackoffice.analytics} />;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/integration/admin-pages.test.ts && npm run test:e2e -- admin.spec.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/analytics/page.tsx src/components/admin/analytics-insights-board.tsx tests/integration/admin-pages.test.ts tests/e2e/admin.spec.ts
git commit -m "feat: add admin analytics insights page"
```

## Task 8: Final Verification and Cleanup

**Files:**
- Modify: `README.md` (only if admin route notes need updating)
- Verify: `src/app/admin/(protected)/**`
- Verify: `src/components/admin/**`
- Verify: `tests/unit/admin-*.test.tsx`
- Verify: `tests/integration/admin-pages.test.ts`
- Verify: `tests/e2e/admin.spec.ts`

- [ ] **Step 1: Run the focused admin test suite**

Run: `npm test -- tests/unit/admin-layout-shell.test.tsx tests/unit/admin-dashboard-workbench.test.tsx tests/unit/admin-product-center.test.tsx tests/integration/admin-pages.test.ts`

Expected: PASS

- [ ] **Step 2: Run the admin e2e smoke test**

Run: `npm run test:e2e -- admin.spec.ts`

Expected: PASS

- [ ] **Step 3: Run lint for the touched files**

Run: `npm run lint`

Expected: PASS with zero warnings.

- [ ] **Step 4: Update docs only if needed**

```md
- 后台新增工作台、抓取任务、AI 分析等前端原型页面
```

- [ ] **Step 5: Commit**

```bash
git add README.md src/app/admin src/components/admin tests
git commit -m "chore: verify admin backoffice frontend prototype"
```
