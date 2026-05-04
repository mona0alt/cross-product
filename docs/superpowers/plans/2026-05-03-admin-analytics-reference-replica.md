# Admin Analytics Reference Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `admin/analytics` so its structure, copy, and visual hierarchy closely match `docs/superpowers/stitch_lumina_ai_image_studio 2 copy/ai/code.html`.

**Architecture:** Keep the App Router page entry thin and move the full page replica into `src/components/admin/analytics-insights-board.tsx`. Lock the new structure with focused SSR unit assertions plus one integration assertion set that checks the route-level output uses the reference-copy instead of the old analytics demo copy.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest

---

## File Structure

- Modify: `src/app/admin/(protected)/analytics/page.tsx`
- Modify: `src/components/admin/analytics-insights-board.tsx`
- Modify: `tests/unit/admin-workflow-boards.test.tsx`
- Modify: `tests/integration/admin-pages.test.ts`

---

### Task 1: Lock the analytics replica with a failing unit test

**Files:**
- Modify: `tests/unit/admin-workflow-boards.test.tsx`
- Test: `tests/unit/admin-workflow-boards.test.tsx`

- [ ] **Step 1: Write the failing unit test**

Replace the analytics test block in `tests/unit/admin-workflow-boards.test.tsx` with:

```tsx
  it('renders the reference-style analytics dashboard replica', () => {
    const html = renderToStaticMarkup(<AnalyticsInsightsBoard />);

    expect(html).toContain('企业级 AI 数据分析概览');
    expect(html).toContain('2023年10月01日 - 2023年10月31日');
    expect(html).toContain('总营收 (Total Revenue)');
    expect(html).toContain('转化率 (Conversion Rate)');
    expect(html).toContain('跳出率 (Bounce Rate)');
    expect(html).toContain('活跃用户 (Active Users)');
    expect(html).toContain('用户转化漏斗 (Sankey 分析)');
    expect(html).toContain('详细报表');
    expect(html).toContain('AI 智能洞察');
    expect(html).not.toContain('本周热门类目更偏便携型设备');
  });
```

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `npm test -- tests/unit/admin-workflow-boards.test.tsx`

Expected: FAIL because `AnalyticsInsightsBoard` currently requires a `data` prop and still renders the old analytics copy such as `本周热门类目更偏便携型设备`.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/unit/admin-workflow-boards.test.tsx
git commit -m "test: lock analytics reference replica copy"
```

---

### Task 2: Rebuild the analytics board to match the reference page

**Files:**
- Modify: `src/components/admin/analytics-insights-board.tsx`
- Modify: `src/app/admin/(protected)/analytics/page.tsx`
- Test: `tests/unit/admin-workflow-boards.test.tsx`

- [ ] **Step 1: Write the minimal analytics replica implementation**

Replace `src/components/admin/analytics-insights-board.tsx` with:

```tsx
import React from 'react';
import {
  CalendarDays,
  ChevronDown,
  Download,
  DoorOpen,
  Group,
  Lightbulb,
  MoveRight,
  Percent,
  TrendingUp,
  Wallet
} from 'lucide-react';

const metrics = [
  {
    title: '总营收 (Total Revenue)',
    value: '¥4,280,000',
    delta: '12.5%',
    deltaTone: 'emerald',
    note: '已完成本月目标的 72%',
    icon: Wallet,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    dotClassName: 'bg-emerald-500'
  },
  {
    title: '转化率 (Conversion Rate)',
    value: '3.48%',
    delta: '2.1%',
    deltaTone: 'emerald',
    note: '行业基准值为 2.8%',
    icon: Percent,
    iconClassName: 'bg-blue-50 text-blue-600',
    dotClassName: 'bg-blue-400'
  },
  {
    title: '跳出率 (Bounce Rate)',
    value: '24.12%',
    delta: '0.4%',
    deltaTone: 'red',
    note: '异常警告：移动端波动',
    icon: DoorOpen,
    iconClassName: 'bg-red-50 text-red-600',
    dotClassName: 'bg-red-400'
  },
  {
    title: '活跃用户 (Active Users)',
    value: '12,842',
    delta: '8.3%',
    deltaTone: 'emerald',
    note: '当前实时在线: 421',
    icon: Group,
    iconClassName: 'bg-slate-50 text-slate-600',
    dotClassName: 'bg-slate-800'
  }
] as const;

const funnelSteps = [
  { label: '网站总访问量', users: '128,421 用户', share: '100%', width: '100%' },
  { label: '产品列表/搜索', users: '82,189 用户', share: '64%', width: '82%' },
  { label: '加入购物车', users: '28,252 用户', share: '22%', width: '56%' },
  { label: '成功支付完成', users: '4,366 用户', share: '3.4%', width: '28%' }
] as const;

const insightCards = [
  {
    title: 'AI 趋势结论',
    body: '高意向用户主要集中在工作日 10:00 - 12:00 与 20:00 - 22:00，建议将高价值产品推荐位与触达动作集中投放在这两个时段。'
  },
  {
    title: '转化异常提醒',
    body: '移动端从“产品详情”到“加入购物车”的转化存在波动，建议优先检查详情页首屏素材加载与 CTA 文案一致性。'
  },
  {
    title: '选品优化建议',
    body: '便携型与轻量型设备近 7 日点击热度持续上升，建议增加首页推荐权重，并同步扩展邮件活动入口。'
  }
] as const;

function deltaClasses(tone: 'emerald' | 'red') {
  return tone === 'red'
    ? 'bg-red-100 text-red-700'
    : 'bg-emerald-100 text-emerald-700';
}

export function AnalyticsInsightsBoard() {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-slate-900">
            企业级 AI 数据分析概览
          </h2>
          <p className="mt-1 text-[14px] text-slate-500">
            实时监控全球业务绩效与 AI 智能决策建议
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
            <span>2023年10月01日 - 2023年10月31日</span>
            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
          </div>
          <button
            type="button"
            className="rounded border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-emerald-600"
            aria-label="下载分析报表"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg p-2 ${metric.iconClassName}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={`flex items-center rounded-full px-2 py-1 text-[10px] font-bold ${deltaClasses(metric.deltaTone)}`}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {metric.delta}
                </div>
              </div>
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                {metric.title}
              </span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {metric.value}
                </span>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-medium text-slate-400">
                <span className={`mr-2 h-2 w-2 rounded-full ${metric.dotClassName}`} />
                {metric.note}
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 space-y-8 lg:col-span-8">
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-[18px] font-semibold text-slate-900">
                用户转化漏斗 (Sankey 分析)
              </h3>
              <button
                type="button"
                className="rounded px-2 py-1 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                详细报表
              </button>
            </div>
            <div className="space-y-6 p-8">
              {funnelSteps.map((step, index) => (
                <div key={step.label} className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800">{step.label}</span>
                      <span className="ml-2 text-xs text-slate-400">{step.users}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{step.share}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="flex h-3 items-center justify-end rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-500 pr-2"
                      style={{ width: step.width }}
                    >
                      {index < funnelSteps.length - 1 ? (
                        <MoveRight className="h-3 w-3 text-white/80" />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <aside className="col-span-12 lg:col-span-4">
          <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[18px] font-semibold text-slate-900">AI 智能洞察</h3>
              <p className="mt-1 text-[13px] text-slate-500">
                基于近 30 天行为数据生成的重点结论与优化建议
              </p>
            </div>
            <div className="space-y-4 p-6">
              {insightCards.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
```

Update `src/app/admin/(protected)/analytics/page.tsx` to remove the old mock-data dependency and render the replica component directly:

```tsx
import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';

export default function AdminAnalyticsPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Analytics"
        title="数据分析"
        description="实时监控全球业务绩效与 AI 智能决策建议。"
      />
      <AnalyticsInsightsBoard />
    </section>
  );
}
```

- [ ] **Step 2: Run the unit test to verify it passes**

Run: `npm test -- tests/unit/admin-workflow-boards.test.tsx`

Expected: PASS with the analytics test confirming the new reference-copy titles, KPI labels, and AI insight panel.

- [ ] **Step 3: Commit the board replica**

```bash
git add src/components/admin/analytics-insights-board.tsx src/app/admin/\(protected\)/analytics/page.tsx
git commit -m "feat: replicate admin analytics reference page"
```

---

### Task 3: Lock the route-level rendering with integration assertions

**Files:**
- Modify: `tests/integration/admin-pages.test.ts`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Write the failing integration assertions**

Replace the analytics assertions in `tests/integration/admin-pages.test.ts` with:

```ts
    expect(analyticsHtml).toContain('企业级 AI 数据分析概览');
    expect(analyticsHtml).toContain('2023年10月01日 - 2023年10月31日');
    expect(analyticsHtml).toContain('总营收 (Total Revenue)');
    expect(analyticsHtml).toContain('用户转化漏斗 (Sankey 分析)');
    expect(analyticsHtml).toContain('AI 智能洞察');
    expect(analyticsHtml).not.toContain('本周热门类目更偏便携型设备');
```

- [ ] **Step 2: Run the integration test to verify it fails before the implementation commit is replayed**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: If executed before Task 2 lands, FAIL on the new analytics strings. If executed after Task 2, skip directly to Step 3 because the route should already render the new replica.

- [ ] **Step 3: Run the integration test after Task 2 and confirm green**

Run: `npm test -- tests/integration/admin-pages.test.ts`

Expected: PASS with the analytics route output containing the reference-copy strings and no longer containing the old headline.

- [ ] **Step 4: Commit the integration lock**

```bash
git add tests/integration/admin-pages.test.ts
git commit -m "test: verify analytics route replica output"
```

---

### Task 4: Final verification and diagnostics

**Files:**
- Modify: none
- Test: `tests/unit/admin-workflow-boards.test.tsx`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Run the focused verification suite**

Run: `npm test -- tests/unit/admin-workflow-boards.test.tsx tests/integration/admin-pages.test.ts`

Expected: PASS with both files green and no analytics-related assertion regressions.

- [ ] **Step 2: Run editor diagnostics for touched files**

Check diagnostics for:

```text
src/components/admin/analytics-insights-board.tsx
src/app/admin/(protected)/analytics/page.tsx
tests/unit/admin-workflow-boards.test.tsx
tests/integration/admin-pages.test.ts
```

Expected: no new TypeScript or lint diagnostics.

- [ ] **Step 3: Commit the verification checkpoint**

```bash
git add docs/superpowers/plans/2026-05-03-admin-analytics-reference-replica.md
git commit -m "docs: add admin analytics replica plan"
```

---

## Self-Review

- Spec coverage: the plan covers the reference-copy title/header row, KPI cards, main funnel card, right-side AI insight area, and route-level verification.
- Placeholder scan: no `TODO`, `TBD`, or vague “handle later” items remain.
- Type consistency: the plan standardizes `AnalyticsInsightsBoard` to a no-prop component and updates both unit and route usage to match.
