# Product Review Page Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the admin product review page into a tabbed workflow that separates `商品审核` and `手动新增`, with the audit tab following a clear `队列 -> 详情 -> 动作` flow.

**Architecture:** Convert `ProductCenter` into a lightweight client-side orchestrator that owns the active tab and selected product state, then split the old flat layout into focused subcomponents for the audit and create tasks. Keep the page on the same route, reuse the existing admin design system, and evolve the mock data so the selected queue item can drive the right-side detail panel.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Vitest

---

## File Structure

### Modify

- `src/components/admin/product-center.tsx`
  Purpose: become the page-level client orchestrator that renders the main tabs and delegates to audit/create subviews.
- `src/components/admin/product-review-drawer.tsx`
  Purpose: replace the old drawer-style markup with a fixed detail panel component that can render different products by id.
- `src/features/admin/mock-backoffice.ts`
  Purpose: reshape product mock data so each queue item maps to its own review detail, queue note, and create checklist content.
- `tests/unit/admin-product-center.test.tsx`
  Purpose: verify the new page states for default audit, alternate selected item, and create tab rendering.

### Create

- `src/components/admin/product-audit-queue.tsx`
  Purpose: render filters, summary cards, queue list, and selected row styling.
- `src/components/admin/product-create-tab.tsx`
  Purpose: render the create workflow layout with grouped form inputs and submission checklist.

## Task 1: Reshape Product Data For The New Workflow

**Files:**
- Modify: `src/features/admin/mock-backoffice.ts`
- Test: `tests/unit/admin-product-center.test.tsx`

- [ ] **Step 1: Write the failing test for per-product detail rendering**

Add a second assertion block to `tests/unit/admin-product-center.test.tsx` so the test suite expects product-specific details instead of one static review card.

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders the audit tab by default', () => {
    const html = renderToStaticMarkup(<ProductCenter data={mockBackoffice.products} />);

    expect(html).toContain('商品审核');
    expect(html).toContain('手动新增');
    expect(html).toContain('待审核队列');
    expect(html).toContain('当前审核详情');
  });

  it('renders the selected product detail when an alternate default id is provided', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        data={mockBackoffice.products}
        defaultSelectedProductId="product-1"
      />
    );

    expect(html).toContain('Portable Cleaning Robot X2');
    expect(html).toContain('封面图数量不足');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
```

Expected: FAIL because `ProductCenter` does not yet accept `defaultSelectedProductId`, and the current markup still renders the old flat sections.

- [ ] **Step 3: Reshape the mock data with review-by-id details**

Update `src/features/admin/mock-backoffice.ts` so the data model can drive queue rows, detail content, and create checklist content without hardcoding one static `review` object.

```ts
export const mockBackoffice = {
  products: {
    summary: {
      total: 286,
      pending: 26,
      incomingToday: 18,
      needsInfo: 9,
      publishable: 2
    },
    rows: [
      {
        id: 'product-1',
        name: 'Portable Cleaning Robot X2',
        productCode: 'RC-1038',
        category: '清洁机器人',
        source: '自动抓取',
        status: '补充信息',
        completeness: '82%',
        action: '封面图数量不足，建议补 2 张细节图'
      },
      {
        id: 'product-2',
        name: 'Warehouse Drone Mini',
        productCode: 'DR-2041',
        category: '巡检无人机',
        source: '手动导入',
        status: '待审核',
        completeness: '76%',
        action: '建议先补英文摘要，再执行上架审核'
      },
      {
        id: 'product-3',
        name: 'Industrial Arm Pro 8',
        productCode: 'IA-7702',
        category: '工业机械臂',
        source: '自动抓取',
        status: '可发布',
        completeness: '96%',
        action: '内容完整，可直接复核后上架'
      }
    ],
    reviewById: {
      'product-1': {
        title: 'Portable Cleaning Robot X2',
        source: '自动抓取',
        status: '补充信息',
        completeness: '82%',
        category: '清洁机器人',
        price: '$299.00',
        inventory: '120 件库存',
        checks: [
          { label: '标题', value: '完整' },
          { label: '图片', value: '3 / 5' },
          { label: '英文摘要', value: '完整' },
          { label: '重复风险', value: '低' }
        ],
        advice: '封面图数量不足，建议补 2 张细节图后再进入复核。'
      },
      'product-2': {
        title: 'Warehouse Drone Mini',
        source: '手动导入',
        status: '待审核',
        completeness: '76%',
        category: '巡检无人机',
        price: '$599.00',
        inventory: '100 件库存',
        checks: [
          { label: '标题', value: '完整' },
          { label: '图片', value: '3 / 5' },
          { label: '英文摘要', value: '缺失' },
          { label: '重复风险', value: '低' }
        ],
        advice: '当前商品与已发布商品无明显重复，但缺少英文摘要，不建议直接上架。'
      },
      'product-3': {
        title: 'Industrial Arm Pro 8',
        source: '自动抓取',
        status: '可发布',
        completeness: '96%',
        category: '工业机械臂',
        price: '$899.00',
        inventory: '48 件库存',
        checks: [
          { label: '标题', value: '完整' },
          { label: '图片', value: '5 / 5' },
          { label: '英文摘要', value: '完整' },
          { label: '重复风险', value: '低' }
        ],
        advice: '内容完整，可直接复核后上架。'
      }
    },
    createChecklist: [
      { label: '基础信息完整', detail: '标题、分类、SKU 已填写', status: '通过' },
      { label: '图片数量', detail: '当前上传 3 张，建议至少 5 张', status: '待补充' },
      { label: '多语言内容', detail: '英文摘要为空时会进入待补充状态', status: '风险提示' },
      { label: '提交结果', detail: '保存后自动进入待审核队列', status: '说明' }
    ]
  }
} as const;
```

- [ ] **Step 4: Run the test to verify the data shape still fails only on UI expectations**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
```

Expected: FAIL because the UI still renders the old sections, but TypeScript now accepts the richer mock data shape.

- [ ] **Step 5: Commit**

```bash
git add src/features/admin/mock-backoffice.ts tests/unit/admin-product-center.test.tsx
git commit -m "test: define product review workflow data"
```

## Task 2: Build The New Audit Tab And Detail Flow

**Files:**
- Create: `src/components/admin/product-audit-queue.tsx`
- Modify: `src/components/admin/product-review-drawer.tsx`
- Modify: `src/components/admin/product-center.tsx`
- Test: `tests/unit/admin-product-center.test.tsx`

- [ ] **Step 1: Extend the failing test to expect the new audit structure**

Update the first test in `tests/unit/admin-product-center.test.tsx` so it asserts the new section names instead of the old flat layout names.

```tsx
it('renders the audit workflow by default', () => {
  const html = renderToStaticMarkup(<ProductCenter data={mockBackoffice.products} />);

  expect(html).toContain('商品审核');
  expect(html).toContain('手动新增');
  expect(html).toContain('待审核队列');
  expect(html).toContain('当前审核详情');
  expect(html).toContain('审核通过并上架');
  expect(html).not.toContain('手动新增商品');
  expect(html).not.toContain('自动抓取源监控');
});
```

- [ ] **Step 2: Run the test to verify it fails against the old layout**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
```

Expected: FAIL because the page still contains `手动新增商品` and `自动抓取源监控`.

- [ ] **Step 3: Create the audit queue component**

Create `src/components/admin/product-audit-queue.tsx` as a focused presentational component.

```tsx
import React from 'react';

import { StatusBadge } from '@/components/admin/status-badge';

type ProductAuditQueueProps = {
  rows: ReadonlyArray<{
    id: string;
    name: string;
    productCode: string;
    category: string;
    source: string;
    status: string;
    completeness: string;
    action: string;
  }>;
  summary: {
    pending: number;
    needsInfo: number;
    publishable: number;
  };
  selectedProductId: string;
};

function getTone(label: string) {
  if (label === '自动抓取') return 'blue';
  if (label === '手动导入') return 'slate';
  if (label === '可发布') return 'green';
  return 'amber';
}

export function ProductAuditQueue({
  rows,
  summary,
  selectedProductId
}: ProductAuditQueueProps) {
  return (
    <section className="rounded-[24px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
      <div className="border-b border-admin-border px-6 py-5">
        <h3 className="text-xl font-semibold text-admin-text-primary">待审核队列</h3>
        <p className="mt-2 text-sm text-admin-text-secondary">默认先看队列，再切换右侧详情完成审核。</p>
      </div>
      <div className="grid gap-3 border-b border-admin-border bg-admin-elevated px-6 py-4 md:grid-cols-3">
        <div className="rounded-xl border border-admin-border bg-white p-4 text-sm">待审核 {summary.pending}</div>
        <div className="rounded-xl border border-admin-border bg-white p-4 text-sm">补充信息 {summary.needsInfo}</div>
        <div className="rounded-xl border border-admin-border bg-white p-4 text-sm">可发布 {summary.publishable}</div>
      </div>
      <div className="grid gap-3 p-4">
        {rows.map((row) => (
          <article
            key={row.id}
            className={`rounded-2xl border p-4 ${
              row.id === selectedProductId
                ? 'border-admin-accent/30 bg-admin-accent/5'
                : 'border-admin-border bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-admin-text-primary">{row.name}</p>
                <p className="mt-1 text-xs text-admin-text-muted">
                  SKU {row.productCode} · {row.category}
                </p>
                <p className="mt-2 text-xs text-admin-text-secondary">{row.action}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-semibold text-admin-text-primary">{row.completeness}</span>
                <StatusBadge label={row.status} tone={getTone(row.status) as 'amber' | 'green'} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Refactor the detail panel and orchestrator**

Convert `src/components/admin/product-review-drawer.tsx` into a fixed detail panel and update `src/components/admin/product-center.tsx` to own the default selected product id.

```tsx
// src/components/admin/product-review-drawer.tsx
import React from 'react';

import { StatusBadge } from '@/components/admin/status-badge';
import { AdminTableShell } from './admin-table-shell';

type ProductReviewData = {
  title: string;
  source: string;
  status: string;
  completeness: string;
  category: string;
  price: string;
  inventory: string;
  checks: ReadonlyArray<{ label: string; value: string }>;
  advice: string;
};

export function ProductReviewDrawer({ review }: { review: ProductReviewData }) {
  return (
    <AdminTableShell title="当前审核详情" description="右侧集中展示当前商品的校验结果和审核动作。">
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="rounded-md border border-admin-border bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">商品标题</p>
          <p className="mt-2 text-sm font-semibold text-admin-text-primary">{review.title}</p>
        </div>
        <div className="rounded-md border border-admin-border bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">分类</p>
          <p className="mt-2 text-sm font-semibold text-admin-text-primary">{review.category}</p>
        </div>
        <div className="rounded-md border border-admin-border bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">价格</p>
          <p className="mt-2 text-sm font-semibold text-admin-text-primary">{review.price}</p>
        </div>
        <div className="rounded-md border border-admin-border bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">库存</p>
          <p className="mt-2 text-sm font-semibold text-admin-text-primary">{review.inventory}</p>
        </div>
      </div>
      <div className="grid gap-4 border-t border-admin-border p-4 xl:grid-cols-4">
        {review.checks.map((check) => (
          <div key={check.label} className="rounded-md border border-admin-border bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">{check.label}</p>
            <p className="mt-2 text-sm text-admin-text-primary">{check.value}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-admin-border bg-slate-50 px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge label={review.source} tone="slate" />
          <StatusBadge label={review.status} tone={review.status === '可发布' ? 'green' : 'amber'} />
          <StatusBadge label={`完整度 ${review.completeness}`} tone="green" />
        </div>
        <p className="text-[13px] leading-6 text-admin-text-secondary">{review.advice}</p>
      </div>
      <div className="flex justify-end gap-3 border-t border-admin-border bg-slate-50 p-4">
        <button className="rounded border border-red-200 px-4 py-2 text-[13px] font-bold text-red-600">拒绝此条目</button>
        <button className="rounded border border-amber-200 px-4 py-2 text-[13px] font-bold text-amber-700">退回补充</button>
        <button className="rounded bg-admin-accent px-4 py-2 text-[13px] font-bold text-white">审核通过并上架</button>
      </div>
    </AdminTableShell>
  );
}
```

```tsx
// src/components/admin/product-center.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { Globe } from 'lucide-react';

import { ProductAuditQueue } from '@/components/admin/product-audit-queue';
import { ProductReviewDrawer } from '@/components/admin/product-review-drawer';
import { AdminLinkButton } from './admin-button';

type ProductCenterData = {
  summary: {
    total: number;
    pending: number;
    incomingToday: number;
    needsInfo: number;
    publishable: number;
  };
  rows: ReadonlyArray<{
    id: string;
    name: string;
    productCode: string;
    category: string;
    source: string;
    status: string;
    completeness: string;
    action: string;
  }>;
  reviewById: Record<string, {
    title: string;
    source: string;
    status: string;
    completeness: string;
    category: string;
    price: string;
    inventory: string;
    checks: ReadonlyArray<{ label: string; value: string }>;
    advice: string;
  }>;
  createChecklist: ReadonlyArray<{ label: string; detail: string; status: string }>;
};

export function ProductCenter({
  data,
  defaultSelectedProductId
}: {
  data: ProductCenterData;
  defaultSelectedProductId?: string;
}) {
  const [activeTab] = useState<'audit' | 'create'>('audit');
  const [selectedProductId] = useState(defaultSelectedProductId ?? data.rows[0]?.id ?? '');

  const review = useMemo(
    () => data.reviewById[selectedProductId] ?? data.reviewById[data.rows[0]?.id ?? ''],
    [data.reviewById, data.rows, selectedProductId]
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl border border-admin-border bg-white p-1">
          <button className="rounded-xl bg-admin-text-primary px-4 py-2 text-sm font-semibold text-white">商品审核</button>
          <button className="rounded-xl px-4 py-2 text-sm font-semibold text-admin-text-secondary">手动新增</button>
        </div>
        <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
          <Globe className="h-3.5 w-3.5" />
          抓取日志
        </AdminLinkButton>
      </div>

      {activeTab === 'audit' ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5">
            <ProductAuditQueue
              rows={data.rows}
              summary={{
                pending: data.summary.pending,
                needsInfo: data.summary.needsInfo,
                publishable: data.summary.publishable
              }}
              selectedProductId={selectedProductId}
            />
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ProductReviewDrawer review={review} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 5: Run the targeted test and verify it passes**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
```

Expected: PASS for the default audit layout and alternate selected product rendering.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/product-audit-queue.tsx src/components/admin/product-review-drawer.tsx src/components/admin/product-center.tsx tests/unit/admin-product-center.test.tsx
git commit -m "feat: add tabbed audit workflow shell"
```

## Task 3: Add The Create Tab And Checklist View

**Files:**
- Create: `src/components/admin/product-create-tab.tsx`
- Modify: `src/components/admin/product-center.tsx`
- Test: `tests/unit/admin-product-center.test.tsx`

- [ ] **Step 1: Add a failing test for the create tab state**

Append a new test that renders the component in create mode through a default prop.

```tsx
it('renders the create workflow when the create tab is the default state', () => {
  const html = renderToStaticMarkup(
    <ProductCenter
      data={mockBackoffice.products}
      defaultTab="create"
    />
  );

  expect(html).toContain('手动新增');
  expect(html).toContain('基础信息');
  expect(html).toContain('提交前检查');
  expect(html).toContain('保存到待审核');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
```

Expected: FAIL because `defaultTab` is not yet supported and there is no create-tab markup.

- [ ] **Step 3: Create the create tab component**

Create `src/components/admin/product-create-tab.tsx`.

```tsx
import React from 'react';

import { AdminButton } from '@/components/admin/admin-button';
import { AdminTableShell } from '@/components/admin/admin-table-shell';
import { StatusBadge } from '@/components/admin/status-badge';

type ProductCreateTabProps = {
  checklist: ReadonlyArray<{
    label: string;
    detail: string;
    status: string;
  }>;
};

const inputClass =
  'w-full rounded-lg border border-admin-border bg-white px-4 py-2.5 text-sm text-admin-text-primary outline-none';

export function ProductCreateTab({ checklist }: ProductCreateTabProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <AdminTableShell title="手动新增" description="录入任务与审核任务分开，避免同屏抢焦点。">
          <div className="grid gap-6 p-6">
            <section className="grid gap-4">
              <h4 className="text-lg font-semibold text-admin-text-primary">基础信息</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} placeholder="输入核心标题" />
                <input className={inputClass} placeholder="输入 SKU / 来源标记" />
                <input className={inputClass} placeholder="选择分类" />
                <input className={inputClass} placeholder="来源类型" />
              </div>
            </section>
            <section className="grid gap-4">
              <h4 className="text-lg font-semibold text-admin-text-primary">交易信息</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} placeholder="价格" />
                <input className={inputClass} placeholder="库存" />
                <input className={inputClass} placeholder="币种" />
                <input className={inputClass} placeholder="上架语言" />
              </div>
            </section>
            <section className="grid gap-4">
              <h4 className="text-lg font-semibold text-admin-text-primary">媒体与描述</h4>
              <textarea className={`${inputClass} min-h-[120px] resize-none`} placeholder="点击或拖拽图片上传" />
              <textarea className={`${inputClass} min-h-[120px] resize-none`} placeholder="商品描述 / 多语言内容" />
            </section>
          </div>
          <div className="flex justify-end gap-3 border-t border-admin-border bg-slate-50 p-4">
            <AdminButton type="button" variant="secondary">保存草稿</AdminButton>
            <AdminButton type="button" variant="primary">保存到待审核</AdminButton>
          </div>
        </AdminTableShell>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <AdminTableShell title="提交前检查" description="在提交前明确提示缺项和提交结果。">
          <div className="grid gap-3 p-4">
            {checklist.map((item) => (
              <article key={item.label} className="rounded-xl border border-admin-border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-admin-text-primary">{item.label}</p>
                  <StatusBadge
                    label={item.status}
                    tone={item.status === '通过' ? 'green' : item.status === '说明' ? 'slate' : 'amber'}
                  />
                </div>
                <p className="mt-2 text-xs leading-6 text-admin-text-secondary">{item.detail}</p>
              </article>
            ))}
          </div>
        </AdminTableShell>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update the orchestrator to support `defaultTab`**

Adjust `src/components/admin/product-center.tsx` so the main tabs can render either workflow.

```tsx
import { ProductCreateTab } from '@/components/admin/product-create-tab';

export function ProductCenter({
  data,
  defaultSelectedProductId,
  defaultTab = 'audit'
}: {
  data: ProductCenterData;
  defaultSelectedProductId?: string;
  defaultTab?: 'audit' | 'create';
}) {
  const [activeTab] = useState<'audit' | 'create'>(defaultTab);
  const [selectedProductId] = useState(defaultSelectedProductId ?? data.rows[0]?.id ?? '');

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl border border-admin-border bg-white p-1">
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === 'audit' ? 'bg-admin-text-primary text-white' : 'text-admin-text-secondary'
            }`}
          >
            商品审核
          </button>
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === 'create' ? 'bg-admin-text-primary text-white' : 'text-admin-text-secondary'
            }`}
          >
            手动新增
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div>{/* existing audit layout */}</div>
      ) : (
        <ProductCreateTab checklist={data.createChecklist} />
      )}
    </section>
  );
}
```

- [ ] **Step 5: Run the targeted test and verify it passes**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
```

Expected: PASS for audit-mode and create-mode render cases.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/product-create-tab.tsx src/components/admin/product-center.tsx tests/unit/admin-product-center.test.tsx
git commit -m "feat: add manual create tab to product center"
```

## Task 4: Wire Up Real Tab Switching And Final Polish

**Files:**
- Modify: `src/components/admin/product-center.tsx`
- Modify: `src/components/admin/product-audit-queue.tsx`
- Modify: `tests/unit/admin-product-center.test.tsx`

- [ ] **Step 1: Add the failing test for active tab state injection**

Tighten the create-tab test so the inactive audit content is absent and the active create content is present.

```tsx
it('isolates the create workflow from the audit workflow', () => {
  const html = renderToStaticMarkup(
    <ProductCenter
      data={mockBackoffice.products}
      defaultTab="create"
    />
  );

  expect(html).toContain('提交前检查');
  expect(html).toContain('保存到待审核');
  expect(html).not.toContain('待审核队列');
  expect(html).not.toContain('当前审核详情');
});
```

- [ ] **Step 2: Run the test to verify it fails if both workflows still leak onto the page**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
```

Expected: FAIL if the old flat layout or mixed content still renders.

- [ ] **Step 3: Finish the tab-state wiring**

Update `src/components/admin/product-center.tsx` so the tabs are clickable in the browser while keeping server-render tests deterministic through default props.

```tsx
const [activeTab, setActiveTab] = useState<'audit' | 'create'>(defaultTab);
const [selectedProductId, setSelectedProductId] = useState(defaultSelectedProductId ?? data.rows[0]?.id ?? '');

<button
  type="button"
  onClick={() => setActiveTab('audit')}
  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
    activeTab === 'audit' ? 'bg-admin-text-primary text-white' : 'text-admin-text-secondary'
  }`}
>
  商品审核
</button>
<button
  type="button"
  onClick={() => setActiveTab('create')}
  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
    activeTab === 'create' ? 'bg-admin-text-primary text-white' : 'text-admin-text-secondary'
  }`}
>
  手动新增
</button>

<ProductAuditQueue
  rows={data.rows}
  summary={{
    pending: data.summary.pending,
    needsInfo: data.summary.needsInfo,
    publishable: data.summary.publishable
  }}
  selectedProductId={selectedProductId}
  onSelectProduct={setSelectedProductId}
/>
```

And add the click handler prop in `src/components/admin/product-audit-queue.tsx`:

```tsx
type ProductAuditQueueProps = {
  rows: ReadonlyArray<QueueRow>;
  summary: {
    pending: number;
    needsInfo: number;
    publishable: number;
  };
  selectedProductId: string;
  onSelectProduct?: (productId: string) => void;
};

<button
  type="button"
  onClick={() => onSelectProduct?.(row.id)}
  className={`w-full rounded-2xl border p-4 text-left ${
    row.id === selectedProductId
      ? 'border-admin-accent/30 bg-admin-accent/5'
      : 'border-admin-border bg-white'
  }`}
>
  {/* row content */}
</button>
```

- [ ] **Step 4: Run the full relevant unit tests**

Run:

```bash
npm test -- tests/unit/admin-product-center.test.tsx
npm test -- tests/unit/admin-product-center.test.tsx tests/unit/admin-workflow-boards.test.tsx
```

Expected: PASS. `admin-product-center.test.tsx` validates the new workflow states, and adjacent admin board tests still pass.

- [ ] **Step 5: Run lint on the touched files**

Run:

```bash
npm run lint -- src/components/admin/product-center.tsx src/components/admin/product-audit-queue.tsx src/components/admin/product-create-tab.tsx src/components/admin/product-review-drawer.tsx src/features/admin/mock-backoffice.ts tests/unit/admin-product-center.test.tsx
```

Expected: PASS with no lint errors for the touched files.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/product-center.tsx src/components/admin/product-audit-queue.tsx src/components/admin/product-create-tab.tsx src/components/admin/product-review-drawer.tsx src/features/admin/mock-backoffice.ts tests/unit/admin-product-center.test.tsx
git commit -m "feat: restructure admin product review page"
```

## Self-Review

- Spec coverage: the plan covers the main tabs, audit queue/detail workflow, create workflow separation, data reshaping, and the updated unit tests described in the spec.
- Placeholder scan: there are no `TODO`, `TBD`, or “handle later” steps; each task includes concrete file paths, code snippets, commands, and expected outcomes.
- Type consistency: `defaultTab`, `defaultSelectedProductId`, `reviewById`, and `createChecklist` are used consistently across the planned data shape, orchestrator props, and tests.
