# Admin Demo UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the admin demo shell, page hero areas, core workflow screens, and supporting form/table pages so the backend prototype reads as one polished product during static customer review.

**Architecture:** Keep the existing admin information architecture and mock data, but introduce a small set of shared presentation primitives for page hero blocks and table shells. Then refactor the protected admin layout and each page-specific component to consume those primitives, finishing with focused SSR tests that lock in the new hierarchy and copy.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest

---

## File Structure

- Modify: `src/app/admin/(protected)/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/admin/admin-shell-header.tsx`
- Modify: `src/components/admin/admin-nav.tsx`
- Modify: `src/components/admin/admin-section-header.tsx`
- Modify: `src/components/admin/admin-card.tsx`
- Create: `src/components/admin/admin-page-hero.tsx`
- Create: `src/components/admin/admin-table-shell.tsx`
- Modify: `src/components/admin/product-center.tsx`
- Modify: `src/components/admin/crawl-task-board.tsx`
- Modify: `src/components/admin/subscriber-notification-board.tsx`
- Modify: `src/components/admin/analytics-insights-board.tsx`
- Modify: `src/components/admin/product-review-drawer.tsx`
- Modify: `src/components/admin/category-form.tsx`
- Modify: `src/components/admin/banner-form.tsx`
- Modify: `src/components/admin/message-table.tsx`
- Modify: `src/components/admin/subscriber-table.tsx`
- Modify: `src/components/admin/product-form.tsx`
- Modify: `src/app/admin/(protected)/products/page.tsx`
- Modify: `src/app/admin/(protected)/crawl-tasks/page.tsx`
- Modify: `src/app/admin/(protected)/subscribers/page.tsx`
- Modify: `src/app/admin/(protected)/analytics/page.tsx`
- Modify: `src/app/admin/(protected)/categories/page.tsx`
- Modify: `src/app/admin/(protected)/banners/page.tsx`
- Modify: `src/app/admin/(protected)/messages/page.tsx`
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`
- Modify: `tests/unit/admin-layout-shell.test.tsx`
- Modify: `tests/unit/admin-product-center.test.tsx`
- Create: `tests/unit/admin-workflow-boards.test.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

---

### Task 1: Build the shared admin shell and page hero primitives

**Files:**
- Create: `src/components/admin/admin-page-hero.tsx`
- Create: `src/components/admin/admin-table-shell.tsx`
- Modify: `src/app/admin/(protected)/layout.tsx`
- Modify: `src/components/admin/admin-shell-header.tsx`
- Modify: `src/components/admin/admin-nav.tsx`
- Modify: `src/components/admin/admin-section-header.tsx`
- Modify: `src/components/admin/admin-card.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/unit/admin-layout-shell.test.tsx`

- [ ] **Step 1: Write the failing shell test**

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/auth')>('@/lib/auth');

  return {
    ...actual,
    requireAdminSession
  };
});

describe('admin shell', () => {
  it('renders the upgraded admin shell structure', async () => {
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('Demo Preview');
    expect(html).toContain('适合客户静态确认的后台原型');
    expect(html).toContain('工作台总览');
    expect(html).toContain('Cross Admin Demo');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/admin-layout-shell.test.tsx`

Expected: FAIL because the current shell does not render `Demo Preview`, `适合客户静态确认的后台原型`, `工作台总览`, or `Cross Admin Demo`.

- [ ] **Step 3: Implement the shared shell primitives and shell polish**

Create `src/components/admin/admin-page-hero.tsx`:

```tsx
import React from 'react';

type HeroMetric = {
  label: string;
  value: string;
  detail?: string;
};

export function AdminPageHero({
  eyebrow,
  title,
  description,
  metrics,
  actions,
  status
}: {
  eyebrow: string;
  title: string;
  description: string;
  metrics: HeroMetric[];
  actions?: React.ReactNode;
  status?: React.ReactNode;
}) {
  return (
    <section className="admin-hero-grid rounded-[28px] border border-admin-border bg-admin-surface px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:px-8">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="admin-kicker">{eyebrow}</p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-admin-text-primary font-display">
                {title}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-admin-text-secondary">
                {description}
              </p>
            </div>
            {status ? <div className="shrink-0">{status}</div> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-admin-border bg-admin-elevated/70 px-4 py-4"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-admin-text-primary font-mono">
              {metric.value}
            </p>
            {metric.detail ? (
              <p className="mt-2 text-xs leading-6 text-admin-text-secondary">
                {metric.detail}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/admin/admin-table-shell.tsx`:

```tsx
import React from 'react';

export function AdminTableShell({
  title,
  description,
  toolbar,
  children
}: {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 border-b border-admin-border px-6 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="admin-kicker">Data View</p>
          <h3 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-admin-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
        {toolbar ? <div className="flex flex-wrap gap-2">{toolbar}</div> : null}
      </div>
      <div className="px-0 py-0">{children}</div>
    </section>
  );
}
```

Update `src/components/admin/admin-shell-header.tsx`:

```tsx
import React from 'react';
import { LogOut, Sparkles, User } from 'lucide-react';

export function AdminShellHeader({
  admin
}: {
  admin: {
    username: string;
  };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-admin-border bg-[color:rgba(245,243,239,0.82)] px-8 py-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="admin-kicker">Demo Preview</p>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-admin-text-primary font-display">
              商品工作流优先的后台
            </h2>
            <p className="mt-1 text-sm text-admin-text-secondary">
              适合客户静态确认的后台原型，聚焦抓取、审核、通知与分析闭环。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-admin-border bg-admin-surface px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-admin-accent/12">
              <User className="h-4 w-4 text-admin-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-admin-text-primary">{admin.username}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
                <Sparkles className="h-3 w-3" />
                Single Admin
              </p>
            </div>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-admin-border bg-admin-surface px-4 py-3 text-sm font-medium text-admin-text-secondary transition hover:border-admin-border-strong hover:text-admin-text-primary"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              退出
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
```

Update `src/components/admin/admin-nav.tsx`:

```tsx
// inside the component body
<aside className="flex h-full flex-col px-4 py-6">
  <div className="rounded-[24px] border border-admin-border bg-admin-elevated/60 px-4 py-4">
    <p className="admin-kicker">Cross Platform</p>
    <h1 className="mt-2 text-xl font-semibold tracking-tight text-admin-text-primary font-display">
      后台管理
    </h1>
    <p className="mt-2 text-sm leading-6 text-admin-text-secondary">
      工作台总览、商品审核和运营通知在同一套演示后台中统一呈现。
    </p>
  </div>

  <nav className="mt-6 flex-1 space-y-1.5">
    {/* existing mapped items; keep logic but use rounded-2xl, stronger active ring */}
  </nav>

  <div className="mt-auto rounded-[20px] border border-admin-border bg-admin-surface px-4 py-4">
    <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
      Cross Admin Demo
    </p>
    <p className="mt-2 text-sm leading-6 text-admin-text-secondary">
      v0.1.0 · Static review build
    </p>
  </div>
</aside>
```

Update `src/app/admin/(protected)/layout.tsx`:

```tsx
return (
  <div className="admin-body min-h-screen bg-admin-bg text-admin-text-primary font-body">
    <div className="fixed left-0 top-0 z-40 h-screen w-[272px] border-r border-admin-border bg-[linear-gradient(180deg,#fbfaf7_0%,#f4f1ec_100%)]">
      <AdminNav items={navItems} />
    </div>
    <div className="ml-[272px] min-h-screen">
      <AdminShellHeader admin={admin} />
      <main className="px-8 py-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
          {children}
        </div>
      </main>
    </div>
  </div>
);
```

Update `src/components/admin/admin-section-header.tsx`:

```tsx
export function AdminSectionHeader({ label, title, description, action }: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-admin-border bg-admin-surface px-6 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)] xl:flex-row xl:items-end xl:justify-between">
      <div>
        {label ? <p className="admin-kicker">{label}</p> : null}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-admin-text-primary font-display">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-admin-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
```

Update `src/components/admin/admin-card.tsx`:

```tsx
return (
  <div
    className={`rounded-[24px] border border-admin-border bg-admin-surface p-6 opacity-0 shadow-[0_16px_48px_rgba(15,23,42,0.05)] animate-fade-in-up ${delayClass} ${hoverClass} ${className}`}
  >
    {children}
  </div>
);
```

Update `src/app/globals.css` with shared admin utility classes:

```css
.admin-kicker {
  margin: 0;
  color: var(--admin-text-muted);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.admin-hero-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 1280px) {
  .admin-hero-grid {
    grid-template-columns: minmax(0, 1.2fr) minmax(420px, 0.8fr);
    align-items: start;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/admin-layout-shell.test.tsx`

Expected: PASS with the new shell copy rendered in the static markup.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/(protected)/layout.tsx src/components/admin/admin-shell-header.tsx src/components/admin/admin-nav.tsx src/components/admin/admin-section-header.tsx src/components/admin/admin-card.tsx src/components/admin/admin-page-hero.tsx src/components/admin/admin-table-shell.tsx src/app/globals.css tests/unit/admin-layout-shell.test.tsx
git commit -m "feat: unify admin shell and page hero primitives"
```

### Task 2: Refactor the four core workflow screens around the new hero and shell

**Files:**
- Modify: `src/app/admin/(protected)/products/page.tsx`
- Modify: `src/app/admin/(protected)/crawl-tasks/page.tsx`
- Modify: `src/app/admin/(protected)/subscribers/page.tsx`
- Modify: `src/app/admin/(protected)/analytics/page.tsx`
- Modify: `src/components/admin/product-center.tsx`
- Modify: `src/components/admin/crawl-task-board.tsx`
- Modify: `src/components/admin/subscriber-notification-board.tsx`
- Modify: `src/components/admin/analytics-insights-board.tsx`
- Modify: `src/components/admin/product-review-drawer.tsx`
- Modify: `tests/unit/admin-product-center.test.tsx`
- Create: `tests/unit/admin-workflow-boards.test.tsx`

- [ ] **Step 1: Write the failing workflow board tests**

Create `tests/unit/admin-workflow-boards.test.tsx`:

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('admin workflow boards', () => {
  it('renders the upgraded crawl hero summary', () => {
    const html = renderToStaticMarkup(
      <CrawlTaskBoard data={mockBackoffice.crawlTasks} />
    );

    expect(html).toContain('候选商品入口页');
    expect(html).toContain('今日抓取摘要');
    expect(html).toContain('来源站点健康状态');
  });

  it('renders the upgraded subscriber summary', () => {
    const html = renderToStaticMarkup(
      <SubscriberNotificationBoard data={mockBackoffice.subscribers} />
    );

    expect(html).toContain('订阅规模');
    expect(html).toContain('待发送活动');
    expect(html).toContain('通知活动与失败队列');
  });

  it('renders the upgraded analytics hero and insight sections', () => {
    const html = renderToStaticMarkup(
      <AnalyticsInsightsBoard data={mockBackoffice.analytics} />
    );

    expect(html).toContain('本周经营结论');
    expect(html).toContain('推荐位与选品建议');
    expect(html).toContain('高跳出页面');
  });
});
```

Update `tests/unit/admin-product-center.test.tsx`:

```tsx
it('renders the upgraded product hero and review workspace', () => {
  const html = renderToStaticMarkup(
    <ProductCenter data={mockBackoffice.products} />
  );

  expect(html).toContain('统一商品池');
  expect(html).toContain('总商品规模');
  expect(html).toContain('审核工作区');
  expect(html).toContain('发起抓取');
  expect(html).toContain('新建商品');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx`

Expected: FAIL because the existing components do not yet render the new hero phrases or section labels.

- [ ] **Step 3: Implement the core workflow screen refactor**

Update `src/components/admin/product-center.tsx` to use `AdminPageHero` and `AdminTableShell`:

```tsx
import { Globe, Plus, Filter } from 'lucide-react';

import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';

// inside ProductCenter return
<section className="grid gap-6 2xl:grid-cols-[1.55fr_0.9fr]">
  <div className="space-y-6">
    <AdminPageHero
      eyebrow="Product Center"
      title="统一商品池"
      description="自动抓取与手动导入商品在同一工作流中汇总，先补齐内容，再进入统一审核与发布节奏。"
      metrics={[
        { label: '总商品规模', value: String(data.summary.total), detail: '包含自动抓取与手动导入来源' },
        { label: '待审核', value: String(data.summary.pending), detail: '优先处理字段完整度较高的候选商品' },
        { label: '今日新增候选', value: String(data.summary.incomingToday), detail: '抓取和人工导入商品统一入池' },
        { label: '审核焦点', value: data.review.completeness, detail: '当前抽屉聚焦商品完整度' }
      ]}
      actions={
        <>
          <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
            <Globe className="h-3.5 w-3.5" />
            发起抓取
          </AdminLinkButton>
          <AdminLinkButton href="/admin/products/new" variant="primary" size="sm">
            <Plus className="h-3.5 w-3.5" />
            新建商品
          </AdminLinkButton>
        </>
      }
    />

    <AdminTableShell
      title="审核工作区"
      description="先按来源和状态筛选，再进入商品表格与右侧审核建议。"
      toolbar={
        <>
          {['全部来源', '自动抓取', '手动导入', '待审核', '可发布', '已发布'].map((filter) => (
            <span key={filter} className="inline-flex items-center gap-1.5 rounded-full border border-admin-border bg-admin-elevated px-3 py-1.5 text-xs font-medium text-admin-text-secondary">
              {filter !== '全部来源' ? <Filter className="h-3 w-3" /> : null}
              {filter}
            </span>
          ))}
        </>
      }
    >
      {/* existing table content */}
    </AdminTableShell>
  </div>

  <ProductReviewDrawer review={data.review} />
</section>
```

Update `src/components/admin/product-review-drawer.tsx`:

```tsx
<AdminCard delay={3} className="h-fit sticky top-28">
  <p className="admin-kicker">Review Panel</p>
  <h3 className="mt-2 text-2xl font-semibold text-admin-text-primary font-display">
    {review.title}
  </h3>
  <p className="mt-2 text-sm leading-7 text-admin-text-secondary">
    审核建议集中呈现标题、图片、摘要完整度和下一步动作，作为商品中心右侧的固定工作区。
  </p>
  {/* existing badges and checks */}
</AdminCard>
```

Update `src/components/admin/crawl-task-board.tsx`:

```tsx
import { AdminPageHero } from './admin-page-hero';

<section className="space-y-6">
  <AdminPageHero
    eyebrow="Crawler"
    title="候选商品入口页"
    description="抓取任务只负责把候选商品送入审核池，不直接承担最终发布动作，便于用户理解来源配置和解析质量。"
    metrics={[
      { label: '今日抓取摘要', value: '11', detail: data.headline },
      { label: '来源站点健康状态', value: `${data.sourceSites.filter((site) => site.status === '正常').length} 正常`, detail: '其余来源需人工修复解析规则' },
      { label: '入审核池说明', value: '统一入池', detail: data.summary },
      { label: '异常修复', value: '3 项', detail: '图片字段或分类映射待修正' }
    ]}
  />
  {/* existing source site cards */}
</section>
```

Update `src/components/admin/subscriber-notification-board.tsx`:

```tsx
import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';

<section className="space-y-6">
  <AdminPageHero
    eyebrow="Subscribers"
    title="订阅规模与通知节奏"
    description="把新品发布后的通知规模、待发送活动和失败重发集中在首屏，方便客户理解通知闭环。"
    metrics={[
      { label: '订阅规模', value: data.total, detail: '前台订阅邮箱统一汇总' },
      { label: '邮件打开率', value: data.openRate, detail: '演示口径，不代表真实发送数据' },
      { label: '待发送活动', value: '1', detail: '待确认或自动发送的新品活动' },
      { label: '失败重发', value: data.failed, detail: '保留失败队列入口感' }
    ]}
  />

  <AdminTableShell
    title="通知活动与失败队列"
    description="活动列表、失败重发和订阅用户入口在同一视觉模块中统一呈现。"
  >
    <div className="grid gap-4 p-6 xl:grid-cols-2">
      {/* existing mapped campaign cards */}
    </div>
  </AdminTableShell>
</section>
```

Update `src/components/admin/analytics-insights-board.tsx`:

```tsx
import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';

<section className="space-y-6">
  <AdminPageHero
    eyebrow="AI Insights"
    title="本周经营结论"
    description="用图表型信息分区和短文本建议表达分析价值，重点是帮助客户理解哪些结论会反过来影响下一轮选品与推荐位。"
    metrics={[
      { label: '本周结论', value: '便携设备更热', detail: data.headline },
      { label: '热门分类', value: '3 组', detail: '用演示洞察表达优先类目' },
      { label: '高跳出页面', value: '2 页', detail: '保留页面优化入口感' },
      { label: '推荐建议', value: '已生成', detail: '适合作为客户确认的 AI 输出样例' }
    ]}
    status={<StatusBadge label="已生成" tone="green" />}
  />

  <div className="grid gap-6 xl:grid-cols-2">
    <AdminTableShell title="用户转化路径" description="展示从首页推荐位到商品详情的静态路径概念。">
      <div className="space-y-3 p-6 text-sm text-admin-text-secondary">
        <p>首页推荐位 -> 商品列表 -> 商品详情 -> 留言 / 订阅</p>
        <p>用于帮助客户确认后续是否需要更真实的漏斗统计。</p>
      </div>
    </AdminTableShell>

    <AdminTableShell title="推荐位与选品建议" description="把热门商品、分类和运营建议收在同一视觉模块。">
      <div className="grid gap-4 p-6">
        {data.insights.map((insight) => (
          <div key={insight} className="rounded-2xl border border-admin-border bg-admin-elevated p-4">
            {insight}
          </div>
        ))}
        <div className="rounded-2xl border border-dashed border-admin-border-strong bg-admin-surface px-4 py-4 text-sm text-admin-text-secondary">
          高跳出页面：分类页与详情页的内容节奏需要在真实阶段继续验证。
        </div>
      </div>
    </AdminTableShell>
  </div>
</section>
```

Update page entry descriptions, for example `src/app/admin/(protected)/products/page.tsx`:

```tsx
export default function AdminProductsPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Products"
        title="商品中心"
        description="把自动抓取和手动导入商品收进同一个审核工作区，优先用于客户确认后台主流程。"
      />
      <ProductCenter data={mockBackoffice.products} />
    </section>
  );
}
```

Apply the same page-level description pattern to crawl, subscribers, and analytics pages.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx`

Expected: PASS with the new hero copy rendered across the four core workflow screens.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/(protected)/products/page.tsx src/app/admin/(protected)/crawl-tasks/page.tsx src/app/admin/(protected)/subscribers/page.tsx src/app/admin/(protected)/analytics/page.tsx src/components/admin/product-center.tsx src/components/admin/crawl-task-board.tsx src/components/admin/subscriber-notification-board.tsx src/components/admin/analytics-insights-board.tsx src/components/admin/product-review-drawer.tsx tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx
git commit -m "feat: polish admin workflow demo pages"
```

### Task 3: Unify the supporting list and table pages

**Files:**
- Modify: `src/app/admin/(protected)/categories/page.tsx`
- Modify: `src/app/admin/(protected)/banners/page.tsx`
- Modify: `src/app/admin/(protected)/messages/page.tsx`
- Modify: `src/app/admin/(protected)/subscribers/page.tsx`
- Modify: `src/components/admin/category-form.tsx`
- Modify: `src/components/admin/banner-form.tsx`
- Modify: `src/components/admin/message-table.tsx`
- Modify: `src/components/admin/subscriber-table.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Write the failing integration expectations**

Update `tests/integration/admin-pages.test.ts` by extending the existing page assertions:

```ts
expect(messagesHtml).toContain('客户留言');
expect(messagesHtml).toContain('客户沟通与线索概览');
expect(subscribersHtml).toContain('订阅规模与通知节奏');
expect(crawlHtml).toContain('候选商品入口页');
expect(analyticsHtml).toContain('本周经营结论');
```

Add banner and category page checks:

```ts
const CategoriesPage =
  (await import('@/app/admin/(protected)/categories/page')).default;
const BannersPage =
  (await import('@/app/admin/(protected)/banners/page')).default;

const categoriesHtml = renderToStaticMarkup(await CategoriesPage());
const bannersHtml = renderToStaticMarkup(await BannersPage());

expect(categoriesHtml).toContain('分类结构与映射');
expect(categoriesHtml).toContain('分类录入区');
expect(bannersHtml).toContain('首页展示素材');
expect(bannersHtml).toContain('Banner 列表');
```

- [ ] **Step 2: Run the integration test to verify it fails**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: FAIL because the current page titles and supporting management copy do not match the new unified structure.

- [ ] **Step 3: Implement the supporting pages with shared shells**

Update `src/components/admin/category-form.tsx`:

```tsx
import { AdminPageHero } from './admin-page-hero';

<form className="space-y-6">
  <AdminPageHero
    eyebrow="Category Management"
    title="分类结构与映射"
    description="用轻首屏解释分类录入、图标管理和多语言映射，保持配置页与核心工作流页风格一致。"
    metrics={[
      { label: '分类录入区', value: '多语言', detail: '支持中文、英文、西语、葡语字段' },
      { label: '图标素材', value: 'URL', detail: '保留分类图标管理入口感' },
      { label: '层级关系', value: '父子级', detail: '通过父级选择表达层级关系' },
      { label: '排序字段', value: '可控', detail: '支持后续展示顺序调整' }
    ]}
  />
  {/* existing form card, keep fields but tighten grouping and footer */}
</form>
```

Update `src/components/admin/banner-form.tsx`:

```tsx
import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';

<div className="space-y-6">
  <AdminPageHero
    eyebrow="Banner Management"
    title="首页展示素材"
    description="统一管理首页 Banner 的图片、目标类型和启用状态，帮助客户理解展示位配置能力。"
    metrics={[
      { label: '已配置 Banner', value: String(banners.length), detail: '按排序顺序管理首页素材' },
      { label: '目标类型', value: '分类 / 商品 / 外链', detail: '支持静态确认跳转类型' },
      { label: '启用状态', value: '可见', detail: '通过状态标签表达前台展示状态' },
      { label: '内容位置', value: '首页', detail: '聚焦首屏与活动横幅素材' }
    ]}
  />

  <AdminCard delay={1}>{/* existing create form */}</AdminCard>

  <AdminTableShell title="Banner 列表" description="以统一表格容器展示现有 Banner 配置。">
    {/* existing table */}
  </AdminTableShell>
</div>
```

Update `src/components/admin/message-table.tsx` and `src/components/admin/subscriber-table.tsx` to wrap each table in `AdminTableShell`, keeping the table markup but adding descriptive titles and using rounded table containers:

```tsx
<AdminTableShell
  title="客户沟通与线索概览"
  description="保留姓名、邮箱、摘要和状态，作为后台客服沟通的静态演示页。"
>
  <div className="overflow-hidden rounded-b-[24px]">
    <table className="min-w-full divide-y divide-admin-border text-sm">
      {/* existing table */}
    </table>
  </div>
</AdminTableShell>
```

Update page headers:

```tsx
<AdminSectionHeader
  label="Messages"
  title="客户留言"
  description="统一查看客户留言、邮箱和处理状态，让后台辅助页面也保持完整的页头结构。"
/>
```

Use the same pattern for category and banner pages:

```tsx
<AdminSectionHeader
  label="Categories"
  title="分类管理"
  description="维护分类结构、图标和多语言映射，配合前台分类浏览与商品归档。"
/>
```

```tsx
<AdminSectionHeader
  label="Banners"
  title="Banner 管理"
  description="维护首页展示素材、跳转目标和启用状态，作为前台首屏内容的后台配置入口。"
/>
```

- [ ] **Step 4: Run the integration test to verify it passes**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: PASS with the refined supporting-page headings and shared shell copy.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/(protected)/categories/page.tsx src/app/admin/(protected)/banners/page.tsx src/app/admin/(protected)/messages/page.tsx src/app/admin/(protected)/subscribers/page.tsx src/components/admin/category-form.tsx src/components/admin/banner-form.tsx src/components/admin/message-table.tsx src/components/admin/subscriber-table.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: unify admin supporting pages"
```

### Task 4: Polish the create/edit product forms and run the final verification pass

**Files:**
- Modify: `src/components/admin/product-form.tsx`
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Extend the form-page test expectations**

Update the existing `renders the manual product creation page with review framing` test in `tests/integration/admin-pages.test.ts`:

```ts
expect(html).toContain('创建后进入审核');
expect(html).toContain('基础信息');
expect(html).toContain('图片素材');
expect(html).toContain('提交审核前预览');
```

Add an edit-page smoke assertion:

```ts
productFindUnique.mockResolvedValue({
  id: 'product-1',
  categoryId: 'cat-1',
  productCode: 'P-1001',
  slug: 'product-1',
  priceUsd: { toString: () => '199' },
  coverImageUrl: '/cover.jpg',
  status: 'draft',
  isRecommended: false,
  nameZh: '示例商品',
  nameEn: 'Sample Product',
  nameEs: 'Producto',
  namePt: 'Produto',
  introZh: '简介',
  introEn: 'Intro',
  introEs: 'Intro',
  introPt: 'Intro',
  detailZh: '详情',
  detailEn: 'Detail',
  detailEs: 'Detalle',
  detailPt: 'Detalhe',
  images: []
});

const EditProductPage =
  (await import('@/app/admin/(protected)/products/[id]/page')).default;
const editHtml = renderToStaticMarkup(
  await EditProductPage({
    params: Promise.resolve({ id: 'product-1' })
  })
);

expect(editHtml).toContain('编辑并重新审核商品');
expect(editHtml).toContain('保存并重新审核');
```

- [ ] **Step 2: Run the integration test to verify it fails**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: FAIL because the form page structure and copy have not yet been upgraded.

- [ ] **Step 3: Implement the polished form layout**

Update `src/components/admin/product-form.tsx` to tighten spacing, section framing, and footer hierarchy while keeping the existing fields:

```tsx
const sectionTitleClass = 'text-xl font-semibold text-admin-text-primary font-display';

return (
  <form className="space-y-6">
    <AdminCard delay={1}>
      <p className="admin-kicker">Manual Import</p>
      <h2 className="mt-2 text-2xl font-semibold text-admin-text-primary font-display">
        {mode === 'create' ? '创建后进入审核' : '编辑后重新进入审核'}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-admin-text-secondary">
        手动录入商品也遵循统一审核规则。页面视觉重点放在信息完整度和提交流程，而不是直接发布。
      </p>
    </AdminCard>

    <AdminCard delay={2}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="admin-kicker">Basic Info</p>
          <h3 className={sectionTitleClass}>基础信息</h3>
        </div>
        <span className="rounded-full border border-admin-border bg-admin-elevated px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-text-secondary">
          来源：手动导入
        </span>
      </div>
      {/* existing basic fields */}
    </AdminCard>

    {/* keep localized content, media, and review notes cards; use the same kicker/title rhythm */}

    <div className="flex flex-col gap-3 rounded-[24px] border border-admin-border bg-admin-surface p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
      <AdminButton type="button" variant="ghost">
        保存草稿
      </AdminButton>
      <div className="flex flex-wrap gap-2">
        <AdminButton type="button" variant="secondary">
          提交审核前预览
        </AdminButton>
        <AdminButton type="button" variant="primary">
          {mode === 'create' ? '提交审核' : '保存并重新审核'}
        </AdminButton>
      </div>
    </div>
  </form>
);
```

Update the new/edit pages with clearer descriptions:

```tsx
<AdminSectionHeader
  label="Products"
  title="手动新建商品"
  description="用统一表单节奏展示商品基础信息、多语言内容和图片素材，强调创建后仍需进入审核链路。"
/>
```

```tsx
<AdminSectionHeader
  label="Products"
  title="编辑并重新审核商品"
  description="修改现有商品后重新进入审核确认，让演示流程保持与自动抓取商品一致。"
/>
```

- [ ] **Step 4: Run final tests and diagnostics**

Run:

```bash
npm test -- tests/unit/admin-layout-shell.test.tsx tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx tests/integration/admin-pages.test.ts
```

Expected: PASS across all touched admin layout and page tests.

Then run:

```bash
npm run lint
```

Expected: Exit code `0`.

Then run diagnostics for changed files in the editor and fix any obvious issues before finishing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-form.tsx src/app/admin/(protected)/products/new/page.tsx src/app/admin/(protected)/products/[id]/page.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: polish admin form pages for demo review"
```

---

## Self-Review

### Spec Coverage

- Shell unification, page header alignment, and main container consistency are covered in Task 1.
- Strong hero treatment for product center, crawl tasks, subscribers, and analytics is covered in Task 2.
- Light hero treatment and shared table shells for categories, banners, messages, and subscribers are covered in Task 3.
- Form-page polish for create/edit product flows is covered in Task 4.

### Placeholder Scan

- No `TBD`, `TODO`, or deferred implementation markers remain in the plan.
- Every task includes exact files, code snippets, commands, and expected outcomes.

### Type Consistency

- Shared presentation primitives are introduced once in Task 1 and reused consistently in later tasks as `AdminPageHero` and `AdminTableShell`.
- Existing component names and page file paths match the current codebase structure.

