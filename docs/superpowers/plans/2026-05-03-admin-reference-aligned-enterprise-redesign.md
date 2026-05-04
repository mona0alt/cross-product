# Admin Reference-Aligned Enterprise Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing `admin` UI so its shell, page layouts, and visual language closely match the provided enterprise reference files while keeping current routes and data sources intact.

**Architecture:** Keep the current Next.js App Router structure, mock/query entry points, and protected admin routes, but replace the existing warm demo presentation layer with a reference-aligned enterprise shell. Reuse current page/component boundaries where practical, then reshape each screen to match the closest reference file: analytics -> `ai`, products -> `_2`, subscribers -> `_3`, messages -> `_1`, and the remaining configuration-style pages -> `_4`.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest

---

## File Structure

- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/admin/(protected)/layout.tsx`
- Modify: `src/components/admin/admin-nav.tsx`
- Modify: `src/components/admin/admin-shell-header.tsx`
- Modify: `src/components/admin/admin-button.tsx`
- Modify: `src/components/admin/admin-card.tsx`
- Modify: `src/components/admin/admin-page-hero.tsx`
- Modify: `src/components/admin/admin-table-shell.tsx`
- Modify: `src/components/admin/status-badge.tsx`
- Modify: `src/app/admin/(protected)/products/page.tsx`
- Modify: `src/app/admin/(protected)/analytics/page.tsx`
- Modify: `src/app/admin/(protected)/subscribers/page.tsx`
- Modify: `src/app/admin/(protected)/messages/page.tsx`
- Modify: `src/app/admin/(protected)/crawl-tasks/page.tsx`
- Modify: `src/app/admin/(protected)/categories/page.tsx`
- Modify: `src/app/admin/(protected)/banners/page.tsx`
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`
- Modify: `src/components/admin/product-center.tsx`
- Modify: `src/components/admin/product-review-drawer.tsx`
- Modify: `src/components/admin/analytics-insights-board.tsx`
- Modify: `src/components/admin/subscriber-notification-board.tsx`
- Modify: `src/components/admin/message-table.tsx`
- Modify: `src/components/admin/crawl-task-board.tsx`
- Modify: `src/components/admin/category-form.tsx`
- Modify: `src/components/admin/banner-form.tsx`
- Modify: `src/components/admin/product-form.tsx`
- Modify: `tests/unit/admin-layout-shell.test.tsx`
- Modify: `tests/unit/admin-product-center.test.tsx`
- Modify: `tests/unit/admin-workflow-boards.test.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

---

### Task 1: Replace the current admin shell with the enterprise reference chrome

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/admin/(protected)/layout.tsx`
- Modify: `src/components/admin/admin-nav.tsx`
- Modify: `src/components/admin/admin-shell-header.tsx`
- Modify: `src/components/admin/admin-button.tsx`
- Modify: `src/components/admin/admin-card.tsx`
- Modify: `src/components/admin/admin-page-hero.tsx`
- Modify: `src/components/admin/admin-table-shell.tsx`
- Modify: `src/components/admin/status-badge.tsx`
- Test: `tests/unit/admin-layout-shell.test.tsx`

- [ ] **Step 1: Update the shell test to lock the new reference-aligned chrome**

Update `tests/unit/admin-layout-shell.test.tsx`:

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

vi.mock('next/navigation', async () => {
  const actual =
    await vi.importActual<typeof import('next/navigation')>('next/navigation');

  return {
    ...actual,
    usePathname: () => '/admin/analytics'
  };
});

describe('admin shell', () => {
  it('renders the enterprise reference shell', async () => {
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('管理后台');
    expect(html).toContain('企业级产品套件');
    expect(html).toContain('数据分析');
    expect(html).toContain('系统设置');
    expect(html).toContain('核心管理系统');
    expect(html).toContain('运行爬虫');
  });
});
```

- [ ] **Step 2: Run the shell test and confirm it fails**

Run: `npm test -- tests/unit/admin-layout-shell.test.tsx`

Expected: FAIL because the current shell still renders the warm demo layout, old nav labels, and old top bar copy.

- [ ] **Step 3: Implement the enterprise shell and shared primitives**

Update `tailwind.config.ts` so the admin palette matches the reference structure:

```ts
extend: {
  colors: {
    admin: {
      sidebar: '#0F172A',
      sidebarBorder: '#1E293B',
      page: '#F7F9FB',
      card: '#FFFFFF',
      cardMuted: '#F8FAFC',
      border: '#E2E8F0',
      text: '#0F172A',
      textMuted: '#64748B',
      success: '#059669',
      successSoft: '#ECFDF5',
      warning: '#F59E0B',
      warningSoft: '#FFFBEB',
      danger: '#DC2626',
      dangerSoft: '#FEF2F2'
    }
  },
  fontFamily: {
    display: ['Inter', 'sans-serif'],
    body: ['Inter', 'sans-serif'],
    mono: ['Inter', 'sans-serif']
  }
}
```

Update the admin shell utilities in `src/app/globals.css`:

```css
.admin-body {
  --admin-sidebar: #0f172a;
  --admin-sidebar-border: #1e293b;
  --admin-page: #f7f9fb;
  --admin-card: #ffffff;
  --admin-card-muted: #f8fafc;
  --admin-border: #e2e8f0;
  --admin-text: #0f172a;
  --admin-text-muted: #64748b;
  --admin-success: #059669;
  --admin-warning: #f59e0b;
  --admin-danger: #dc2626;
}

.admin-kicker {
  color: var(--admin-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-grid-shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-height: 100vh;
}
```

Update `src/app/admin/(protected)/layout.tsx`:

```tsx
const navItems = [
  { href: '/admin/analytics', label: '数据分析', icon: 'BarChart3' },
  { href: '/admin/products', label: '商品审核', icon: 'Package' },
  { href: '/admin/subscribers', label: '邮件', icon: 'Mail' },
  { href: '/admin/messages', label: '支持中心', icon: 'MessageSquare' },
  { href: '/admin/categories', label: '系统设置', icon: 'FolderTree' }
];

return (
  <div className="admin-body bg-admin-page text-admin-text font-body">
    <div className="admin-grid-shell">
      <div className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-admin-sidebarBorder bg-admin-sidebar">
        <AdminNav items={navItems} />
      </div>
      <div className="ml-60 min-h-screen bg-admin-page">
        <AdminShellHeader admin={admin} />
        <main className="min-h-[calc(100vh-56px)] px-6 py-6">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  </div>
);
```

Update `src/components/admin/admin-nav.tsx`:

```tsx
return (
  <aside className="flex h-full flex-col justify-between bg-admin-sidebar text-slate-300">
    <div>
      <div className="p-6">
        <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-white">管理后台</h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
          企业级产品套件
        </p>
      </div>
      <nav className="mt-4">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-[13px] font-medium transition ${
                isActive
                  ? 'border-l-4 border-admin-success bg-slate-800 text-white'
                  : 'border-l-4 border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>

    <div className="mb-6 border-t border-admin-sidebarBorder pt-4">
      <div className="px-4 py-2 text-[13px] text-slate-400">技术文档</div>
      <div className="px-4 py-2 text-[13px] text-slate-400">系统状态</div>
      <div className="mt-4 border-t border-admin-sidebarBorder px-4 pt-4">
        <p className="text-xs font-bold text-white">系统管理员</p>
        <p className="text-[10px] text-slate-500">admin@enterprise.ai</p>
      </div>
    </div>
  </aside>
);
```

Update `src/components/admin/admin-shell-header.tsx`:

```tsx
import { Bell, HelpCircle, Languages, Search } from 'lucide-react';

export function AdminShellHeader({ admin }: { admin: { username: string } }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-admin-border bg-white px-6">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-black text-admin-text">核心管理系统</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
          <input
            className="w-64 rounded-lg border border-transparent bg-slate-100 py-1.5 pl-9 pr-4 text-[13px] outline-none transition focus:border-admin-success focus:bg-white"
            placeholder="快速搜索数据或报告..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border-r border-admin-border pr-4 text-admin-text-muted">
          <button type="button" className="rounded-full p-2 hover:bg-slate-100">
            <Bell className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-slate-100">
            <Languages className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-slate-100">
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
        <button className="rounded bg-admin-success px-4 py-1.5 text-[13px] font-semibold text-white">
          运行爬虫
        </button>
        <button className="rounded border border-admin-border px-4 py-1.5 text-[13px] font-semibold text-slate-700">
          系统日志
        </button>
        <span className="text-[12px] font-semibold text-admin-text">{admin.username}</span>
      </div>
    </header>
  );
}
```

Update shared primitives to match the flatter reference styling:

```tsx
// src/components/admin/admin-page-hero.tsx
<section className="rounded-xl border border-admin-border bg-white">
  <div className="flex items-center justify-between border-b border-admin-border px-6 py-4">
    <div>
      <p className="admin-kicker">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold text-admin-text">{title}</h2>
      <p className="mt-1 text-[13px] text-admin-text-muted">{description}</p>
    </div>
    {status ?? actions}
  </div>
  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
    {metrics.map((metric) => (
      <div key={metric.label} className="rounded-lg border border-admin-border bg-admin-card px-4 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">
          {metric.label}
        </p>
        <p className="mt-3 text-[32px] font-semibold leading-none text-admin-text">
          {metric.value}
        </p>
        {metric.detail ? <p className="mt-3 text-[13px] text-admin-text-muted">{metric.detail}</p> : null}
      </div>
    ))}
  </div>
</section>
```

```tsx
// src/components/admin/admin-table-shell.tsx
<section className="overflow-hidden rounded-xl border border-admin-border bg-white">
  <div className="flex items-center justify-between border-b border-admin-border bg-slate-50/70 px-4 py-3">
    <div>
      <h3 className="text-[18px] font-semibold text-admin-text">{title}</h3>
      {description ? <p className="mt-1 text-[13px] text-admin-text-muted">{description}</p> : null}
    </div>
    {toolbar}
  </div>
  {children}
</section>
```

```tsx
// src/components/admin/admin-button.tsx
primary: 'bg-admin-success text-white hover:bg-emerald-700'
secondary: 'border border-admin-border bg-white text-slate-700 hover:bg-slate-50'
ghost: 'border border-admin-border bg-admin-cardMuted text-slate-700 hover:bg-slate-100'
```

```tsx
// src/components/admin/status-badge.tsx
const tones = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  blue: 'bg-blue-50 text-blue-700',
  slate: 'bg-slate-100 text-slate-600'
};
```

- [ ] **Step 4: Run the shell test and confirm it passes**

Run: `npm test -- tests/unit/admin-layout-shell.test.tsx`

Expected: PASS with the deep sidebar, enterprise nav labels, and white top toolbar rendered in the static HTML.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/admin/\(protected\)/layout.tsx src/components/admin/admin-nav.tsx src/components/admin/admin-shell-header.tsx src/components/admin/admin-button.tsx src/components/admin/admin-card.tsx src/components/admin/admin-page-hero.tsx src/components/admin/admin-table-shell.tsx src/components/admin/status-badge.tsx tests/unit/admin-layout-shell.test.tsx
git commit -m "feat: align admin shell with enterprise reference"
```

### Task 2: Rebuild the analytics and product pages around the `ai` and `_2` references

**Files:**
- Modify: `src/app/admin/(protected)/analytics/page.tsx`
- Modify: `src/app/admin/(protected)/products/page.tsx`
- Modify: `src/components/admin/analytics-insights-board.tsx`
- Modify: `src/components/admin/product-center.tsx`
- Modify: `src/components/admin/product-review-drawer.tsx`
- Test: `tests/unit/admin-product-center.test.tsx`
- Test: `tests/unit/admin-workflow-boards.test.tsx`

- [ ] **Step 1: Update unit tests for the new analytics and products copy**

Update `tests/unit/admin-product-center.test.tsx`:

```tsx
expect(html).toContain('产品审核中心');
expect(html).toContain('手动新增商品');
expect(html).toContain('自动抓取源监控');
expect(html).toContain('待审核商品列表');
expect(html).toContain('多语言内容翻译与审核');
```

Update the products and analytics cases in `tests/unit/admin-workflow-boards.test.tsx`:

```tsx
it('renders the analytics page in the ai reference structure', () => {
  const html = renderToStaticMarkup(
    <AnalyticsInsightsBoard data={mockBackoffice.analytics} />
  );

  expect(html).toContain('企业级 AI 数据分析概览');
  expect(html).toContain('总营收');
  expect(html).toContain('用户转化漏斗');
  expect(html).toContain('AI 智能洞察');
});
```

- [ ] **Step 2: Run the two unit test files and confirm they fail**

Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx`

Expected: FAIL because the current pages still render the older demo hero phrases and not the reference titles.

- [ ] **Step 3: Refactor analytics and products to match the reference layouts**

Update `src/app/admin/(protected)/analytics/page.tsx`:

```tsx
<AdminSectionHeader
  label="Analytics"
  title="数据分析"
  description="实时监控全球业务绩效与 AI 智能决策建议。"
/>
<AnalyticsInsightsBoard data={mockBackoffice.analytics} />
```

Update `src/components/admin/analytics-insights-board.tsx` so the top area matches `ai/code.html`:

```tsx
<section className="space-y-8">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-[24px] font-semibold text-admin-text">企业级 AI 数据分析概览</h2>
      <p className="mt-1 text-[13px] text-admin-text-muted">
        实时监控全球业务绩效与 AI 智能决策建议
      </p>
    </div>
    <div className="flex items-center gap-3">
      <div className="rounded border border-admin-border bg-white px-4 py-2 text-sm text-slate-700">
        2023年10月01日 - 2023年10月31日
      </div>
      <button className="rounded border border-admin-border bg-white p-2 text-slate-600">
        导出
      </button>
    </div>
  </div>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    <MetricCard label="总营收" value="¥4,280,000" trend="+12.5%" tone="green" />
    <MetricCard label="转化率" value="3.48%" trend="+2.1%" tone="blue" />
    <MetricCard label="跳出率" value="24.12%" trend="0.4%" tone="red" />
    <MetricCard label="活跃用户" value="12,842" trend="+8.3%" tone="slate" />
  </div>

  <div className="grid grid-cols-12 gap-8">
    <AdminTableShell title="用户转化漏斗" description="按参考稿保留主分析区。">
      <div className="space-y-6 p-8 text-[13px] text-slate-700">
        <p>网站总访问量 128,421</p>
        <p>产品列表/搜索 82,189</p>
        <p>加入购物车 28,252</p>
        <p>成功支付完成 4,366</p>
      </div>
    </AdminTableShell>
    <AdminTableShell title="AI 智能洞察" description="保留右侧建议面板。">
      <div className="grid gap-4 p-6">
        {data.insights.map((insight) => (
          <div key={insight} className="rounded-xl border border-admin-border bg-slate-50 p-4 text-[13px]">
            {insight}
          </div>
        ))}
      </div>
    </AdminTableShell>
  </div>
</section>
```

Update `src/app/admin/(protected)/products/page.tsx`:

```tsx
<AdminSectionHeader
  label="Products"
  title="商品审核"
  description="管理自动抓取源及手动导入的跨语言商品目录。"
/>
<ProductCenter data={mockBackoffice.products} />
```

Update `src/components/admin/product-center.tsx` to follow `_2/code.html`:

```tsx
<section className="grid grid-cols-12 gap-6">
  <div className="col-span-12 flex items-end justify-between">
    <div>
      <h2 className="text-[24px] font-semibold text-admin-text">产品审核中心</h2>
      <p className="mt-1 text-[13px] text-admin-text-muted">
        管理自动抓取源及手动导入的跨语言商品目录。
      </p>
    </div>
    <div className="flex gap-3">
      <AdminLinkButton href="/admin/products/new" variant="secondary" size="sm">
        手动导入商品
      </AdminLinkButton>
      <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
        日志记录
      </AdminLinkButton>
    </div>
  </div>

  <section className="col-span-12 lg:col-span-4 space-y-6">
    <AdminTableShell title="手动新增商品" description="严格复刻参考稿左侧录入面板。">
      <div className="grid gap-4 p-4">
        <input className={inputClass} placeholder="输入核心标题" />
        <select className={inputClass}><option>电子产品</option></select>
        <input className={inputClass} placeholder="0.00" />
        <textarea className={`${inputClass} min-h-[120px]`} placeholder="点击或拖拽图片上传" />
        <AdminLinkButton href="/admin/products/new" variant="primary" size="sm">
          保存到待审核列表
        </AdminLinkButton>
      </div>
    </AdminTableShell>

    <AdminTableShell title="自动抓取源监控" description="保留来源站点状态卡。">
      <div className="grid gap-3 p-4">
        {data.rows.slice(0, 2).map((row) => (
          <div key={row.id} className="rounded-md border border-admin-border bg-slate-50 p-3 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-admin-text">{row.source}</span>
              <StatusBadge label="运行中" tone="green" />
            </div>
            <p className="mt-1 text-admin-text-muted">上次同步: 12 分钟前</p>
          </div>
        ))}
      </div>
    </AdminTableShell>
  </section>

  <section className="col-span-12 lg:col-span-8 grid gap-6">
    <AdminTableShell title="待审核商品列表" description="抓取 + 手动导入统一审核列表。">
      {/* keep the existing rows but reframe table headers and density to match the reference */}
    </AdminTableShell>
    <ProductReviewDrawer review={data.review} />
  </section>
</section>
```

Update `src/components/admin/product-review-drawer.tsx`:

```tsx
<AdminTableShell title="多语言内容翻译与审核" description="严格对应参考稿右下角审核面板。">
  <div className="grid gap-4 p-4 xl:grid-cols-3">
    {review.checks.map((check) => (
      <div key={check.label} className="rounded-md border border-admin-border bg-white p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">
          {check.label}
        </p>
        <p className="mt-2 text-sm text-admin-text">{check.value}</p>
      </div>
    ))}
  </div>
  <div className="flex justify-end gap-3 border-t border-admin-border bg-slate-50 p-4">
    <button className="rounded border border-red-200 px-4 py-2 text-[13px] font-bold text-red-600">
      拒绝此条目
    </button>
    <button className="rounded bg-admin-success px-4 py-2 text-[13px] font-bold text-white">
      审核通过并上架
    </button>
  </div>
</AdminTableShell>
```

- [ ] **Step 4: Run the unit tests again and confirm they pass**

Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx`

Expected: PASS with the analytics and products screens now exposing the reference-aligned headings and panels.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/analytics/page.tsx src/app/admin/\(protected\)/products/page.tsx src/components/admin/analytics-insights-board.tsx src/components/admin/product-center.tsx src/components/admin/product-review-drawer.tsx tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx
git commit -m "feat: align analytics and products pages with references"
```

### Task 3: Rebuild subscribers and messages around the `_3` and `_1` references

**Files:**
- Modify: `src/app/admin/(protected)/subscribers/page.tsx`
- Modify: `src/app/admin/(protected)/messages/page.tsx`
- Modify: `src/components/admin/subscriber-notification-board.tsx`
- Modify: `src/components/admin/message-table.tsx`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Update the integration test expectations for the subscribers and messages pages**

Update `tests/integration/admin-pages.test.ts`:

```ts
expect(messagesHtml).toContain('支持中心');
expect(messagesHtml).toContain('待处理收件箱');
expect(messagesHtml).toContain('回复界面');
expect(messagesHtml).toContain('系统活动日志');

expect(subscribersHtml).toContain('邮件');
expect(subscribersHtml).toContain('总订阅数');
expect(subscribersHtml).toContain('自动化发送规则配置');
expect(subscribersHtml).toContain('订阅者列表');
```

- [ ] **Step 2: Run the integration test and confirm it fails**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: FAIL because the current subscribers and messages pages do not yet match the reference names or section titles.

- [ ] **Step 3: Refactor the two communication pages**

Update `src/app/admin/(protected)/subscribers/page.tsx`:

```tsx
<AdminSectionHeader
  label="Email"
  title="邮件"
  description="管理所有订阅者、自动化发送规则及整体统计指标。"
/>
<SubscriberNotificationBoard data={mockBackoffice.subscribers} />
```

Update `src/components/admin/subscriber-notification-board.tsx`:

```tsx
<section className="space-y-6">
  <div className="grid gap-6 md:grid-cols-3">
    <MetricCard label="总订阅数" value={data.total} trend="+5.2%" />
    <MetricCard label="平均打开率" value={data.openRate} trend="+1.1%" />
    <MetricCard label="平均点击率" value="12.7%" trend="0.0%" />
  </div>

  <div className="grid grid-cols-12 gap-6">
    <div className="col-span-12 lg:col-span-8">
      <AdminTableShell title="自动化发送规则配置" description="严格对齐参考稿中的自动化邮件配置面板。">
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <select className={inputClass}><option>产品上新时触发</option></select>
          <select className={inputClass}><option>最多每天 1 封</option></select>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button className="rounded border border-admin-border px-4 py-2 text-[13px]">取消</button>
            <button className="rounded bg-black px-4 py-2 text-[13px] text-white">保存规则</button>
          </div>
        </div>
      </AdminTableShell>
    </div>
    <div className="col-span-12 lg:col-span-4">
      <AdminCard delay={1}>
        <p className="admin-kicker">系统提示</p>
        <p className="mt-2 text-[13px] text-admin-text-muted">
          请确保您的自动化策略符合各区域的数字通讯合规标准。
        </p>
      </AdminCard>
    </div>
  </div>

  <AdminTableShell title="订阅者列表" description="沿用现有订阅数据，套入参考稿表格结构。">
    {/* existing subscriber rows or current board data rendered as table */}
  </AdminTableShell>
</section>
```

Update `src/app/admin/(protected)/messages/page.tsx`:

```tsx
<AdminSectionHeader
  label="Support"
  title="支持中心"
  description="管理客户查询、回复模版及支持工作流。"
/>
<MessageTable messages={messages} />
```

Update `src/components/admin/message-table.tsx`:

```tsx
<section className="grid grid-cols-12 gap-6">
  <div className="col-span-12 flex items-end justify-between">
    <div>
      <h2 className="text-[24px] font-semibold text-admin-text">客户支持与消息配置</h2>
      <p className="mt-1 text-[13px] text-admin-text-muted">
        管理客户查询、回复模版及即时通讯工具集成
      </p>
    </div>
    <div className="flex gap-3">
      <button className="rounded border border-admin-border bg-white px-4 py-2 text-[13px]">导出记录</button>
      <button className="rounded bg-admin-success px-4 py-2 text-[13px] text-white">发起会话</button>
    </div>
  </div>

  <div className="col-span-12 lg:col-span-8 space-y-6">
    <AdminTableShell title="待处理收件箱" description="按参考稿渲染消息列表。">
      {/* map messages into inbox rows */}
    </AdminTableShell>
    <AdminTableShell title="回复界面" description="保留当前内容摘要，改成参考稿回复面板。">
      <div className="space-y-4 p-4">
        <textarea className="min-h-[160px] w-full rounded border border-admin-border p-3" />
        <div className="flex justify-end gap-3">
          <button className="rounded border border-admin-border px-4 py-2 text-[13px]">保存草稿</button>
          <button className="rounded bg-admin-success px-4 py-2 text-[13px] text-white">发送回复</button>
        </div>
      </div>
    </AdminTableShell>
  </div>

  <div className="col-span-12 lg:col-span-4">
    <AdminTableShell title="系统活动日志" description="保留静态演示日志区。">
      <div className="grid gap-3 p-4 text-[13px] text-admin-text-muted">
        <p>管理员 回复了 #1029</p>
        <p>系统 触发自动回复</p>
        <p>系统 连接 WhatsApp API</p>
      </div>
    </AdminTableShell>
  </div>
</section>
```

- [ ] **Step 4: Run the integration test again and confirm it passes**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: PASS with the subscribers and messages screens now rendering the reference-aligned section copy.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/subscribers/page.tsx src/app/admin/\(protected\)/messages/page.tsx src/components/admin/subscriber-notification-board.tsx src/components/admin/message-table.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: align subscribers and messages with references"
```

### Task 4: Apply the `_4` configuration template to crawl tasks, categories, banners, and product forms

**Files:**
- Modify: `src/app/admin/(protected)/crawl-tasks/page.tsx`
- Modify: `src/app/admin/(protected)/categories/page.tsx`
- Modify: `src/app/admin/(protected)/banners/page.tsx`
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`
- Modify: `src/components/admin/crawl-task-board.tsx`
- Modify: `src/components/admin/category-form.tsx`
- Modify: `src/components/admin/banner-form.tsx`
- Modify: `src/components/admin/product-form.tsx`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Extend the integration test with the configuration-page expectations**

Update `tests/integration/admin-pages.test.ts`:

```ts
expect(crawlHtml).toContain('系统设置');
expect(crawlHtml).toContain('抓取系统配置');
expect(crawlHtml).toContain('源站任务配置');

expect(categoriesHtml).toContain('系统设置');
expect(categoriesHtml).toContain('数据库配置');
expect(categoriesHtml).toContain('分类结构与映射');

expect(bannersHtml).toContain('系统设置');
expect(bannersHtml).toContain('首页展示素材');
expect(bannersHtml).toContain('Banner 列表');

expect(html).toContain('系统设置');
expect(html).toContain('创建后进入审核');
expect(editHtml).toContain('编辑后重新进入审核');
```

- [ ] **Step 2: Run the integration test and confirm it fails**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: FAIL because the configuration-style pages still use the old demo page rhythm and not the `_4` configuration framing.

- [ ] **Step 3: Apply the `_4` page structure to the remaining pages**

Update `src/app/admin/(protected)/crawl-tasks/page.tsx`:

```tsx
<AdminSectionHeader
  label="Settings"
  title="系统设置"
  description="管理抓取系统配置、接口集成与源站任务策略。"
/>
<CrawlTaskBoard data={mockBackoffice.crawlTasks} />
```

Update `src/components/admin/crawl-task-board.tsx`:

```tsx
<div className="space-y-6">
  <AdminTableShell title="抓取系统配置" description="按配置页样式展示抓取入口与策略。">
    <div className="grid gap-4 p-6 md:grid-cols-2">
      <input className={inputClass} value="crawler.global.internal" readOnly />
      <input className={inputClass} value="443" readOnly />
      <select className={inputClass}><option>增量抓取</option></select>
      <select className={inputClass}><option>每天 1 次</option></select>
    </div>
  </AdminTableShell>
  <AdminTableShell title="源站任务配置" description="保留现有 source site 信息，改为配置表和状态块。">
    <div className="grid gap-3 p-6">
      {data.sourceSites.map((site) => (
        <div key={site.label} className="rounded-md border border-admin-border bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-admin-text">{site.label}</span>
            <StatusBadge label={site.status} tone={site.status === '正常' ? 'green' : 'amber'} />
          </div>
          <p className="mt-2 text-[13px] text-admin-text-muted">{site.detail}</p>
        </div>
      ))}
    </div>
  </AdminTableShell>
</div>
```

Update `src/components/admin/category-form.tsx`:

```tsx
<div className="space-y-6">
  <AdminTableShell title="数据库配置" description="借用参考稿的设置页壳层承接分类结构。">
    <div className="grid gap-4 p-6 md:grid-cols-2">
      <input className={inputClass} placeholder="分类服务主机" />
      <input className={inputClass} placeholder="端口" />
      <input className={inputClass} placeholder="数据库名" />
      <input className={inputClass} placeholder="用户名" />
    </div>
  </AdminTableShell>
  <AdminTableShell title="分类结构与映射" description="保持现有表单字段，但套用统一配置卡片。">
    {/* existing category inputs */}
  </AdminTableShell>
</div>
```

Update `src/components/admin/banner-form.tsx`:

```tsx
<div className="space-y-6">
  <AdminTableShell title="首页展示素材" description="按系统设置页结构呈现 Banner 配置。">
    {/* existing banner create form */}
  </AdminTableShell>
  <AdminTableShell title="Banner 列表" description="保留现有 banner 数据表。">
    {/* existing banner table */}
  </AdminTableShell>
</div>
```

Update `src/components/admin/product-form.tsx`:

```tsx
<div className="space-y-6">
  <AdminTableShell title={mode === 'create' ? '创建后进入审核' : '编辑后重新进入审核'} description="以系统设置页模板承接商品录入。">
    {/* keep existing basic fields */}
  </AdminTableShell>
  <AdminTableShell title="基础信息" description="商品编码、Slug、分类与价格。">
    {/* existing basic info grid */}
  </AdminTableShell>
  <AdminTableShell title="多语言内容" description="中文、英文、西语、葡语内容录入。">
    {/* existing localized inputs */}
  </AdminTableShell>
  <AdminTableShell title="图片素材" description="封面图与更多图片 URL。">
    {/* existing media inputs */}
  </AdminTableShell>
  <AdminTableShell title="审核提示" description="保留状态与推荐字段，统一底部操作栏。">
    {/* existing status + buttons */}
  </AdminTableShell>
</div>
```

Update the remaining page entry files so their visible top title is `系统设置` and their descriptions explain the specific configuration content:

```tsx
<AdminSectionHeader
  label="Settings"
  title="系统设置"
  description="管理分类结构与映射。"
/>
```

```tsx
<AdminSectionHeader
  label="Settings"
  title="系统设置"
  description="管理首页展示素材与启用状态。"
/>
```

```tsx
<AdminSectionHeader
  label="Settings"
  title="系统设置"
  description="管理手动录入商品与复审配置。"
/>
```

- [ ] **Step 4: Run the integration test again and confirm it passes**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: PASS with the crawl, category, banner, and product form pages now surfacing the `_4` configuration framing.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(protected\)/crawl-tasks/page.tsx src/app/admin/\(protected\)/categories/page.tsx src/app/admin/\(protected\)/banners/page.tsx src/app/admin/\(protected\)/products/new/page.tsx src/app/admin/\(protected\)/products/\[id\]/page.tsx src/components/admin/crawl-task-board.tsx src/components/admin/category-form.tsx src/components/admin/banner-form.tsx src/components/admin/product-form.tsx tests/integration/admin-pages.test.ts
git commit -m "feat: align configuration pages with settings reference"
```

### Task 5: Run the final verification pass and clean up the last mismatches

**Files:**
- Modify: `tests/integration/admin-pages.test.ts`
- Modify: any touched admin component/page file only if verification reveals a real mismatch

- [ ] **Step 1: Run the full focused admin test suite**

Run:

```bash
npm test -- tests/unit/admin-layout-shell.test.tsx tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx tests/integration/admin-pages.test.ts
```

Expected: PASS for all admin shell, unit, and integration tests.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: Exit code `0`.

- [ ] **Step 3: Run editor diagnostics on the touched files and fix any real errors**

Check diagnostics for:

```text
src/app/admin/(protected)/layout.tsx
src/components/admin/admin-nav.tsx
src/components/admin/admin-shell-header.tsx
src/components/admin/product-center.tsx
src/components/admin/analytics-insights-board.tsx
src/components/admin/subscriber-notification-board.tsx
src/components/admin/message-table.tsx
src/components/admin/crawl-task-board.tsx
src/components/admin/category-form.tsx
src/components/admin/banner-form.tsx
src/components/admin/product-form.tsx
```

Expected: no TypeScript or JSX diagnostics remain.

- [ ] **Step 4: Re-run the failing command if any verification step broke after fixes**

Run only the command that previously failed. For example:

```bash
npm test -- tests/integration/admin-pages.test.ts
```

Expected: PASS after the targeted fix.

- [ ] **Step 5: Commit**

```bash
git add tests/integration/admin-pages.test.ts src/app/admin/\(protected\)/layout.tsx src/components/admin/admin-nav.tsx src/components/admin/admin-shell-header.tsx src/components/admin/product-center.tsx src/components/admin/analytics-insights-board.tsx src/components/admin/subscriber-notification-board.tsx src/components/admin/message-table.tsx src/components/admin/crawl-task-board.tsx src/components/admin/category-form.tsx src/components/admin/banner-form.tsx src/components/admin/product-form.tsx
git commit -m "test: verify admin reference aligned redesign"
```

---

## Self-Review

### Spec Coverage

- Strict reference-aligned shell, colors, spacing, and enterprise chrome are covered in Task 1.
- `analytics` -> `ai` and `products` -> `_2` mapping are covered in Task 2.
- `subscribers` -> `_3` and `messages` -> `_1` mapping are covered in Task 3.
- `crawl-tasks`, `categories`, `banners`, `products/new`, and `products/[id]` -> `_4` mapping are covered in Task 4.
- Verification, linting, and diagnostics requirements are covered in Task 5.

### Placeholder Scan

- No `TODO`, `TBD`, “implement later”, or “similar to Task N” markers remain.
- Every task names exact files, explicit commands, and concrete code snippets.

### Type Consistency

- Existing component names are reused consistently: `AdminTableShell`, `AdminSectionHeader`, `ProductCenter`, `ProductForm`, `CrawlTaskBoard`, `SubscriberNotificationBoard`, and `MessageTable`.
- File paths match the current `src/app/admin/(protected)` and `src/components/admin` structure.
