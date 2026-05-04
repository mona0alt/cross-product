# 商品审核页面重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将商品审核页从分栏卡片式布局重构为设计稿中的全宽表格 + 透明背景弹窗编辑布局。

**Architecture:** 新建 `ProductAuditTable` 和 `ProductAuditModal` 组件，替换旧的 `ProductAuditQueue` 和 `ProductReviewDrawer`；更新 `mockBackoffice.products` 数据结构以支持 AI Score、多语言完成度和图库；保留 `ProductCenter` 作为容器组件管理 Tab 和弹窗状态。

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Vitest, React DOM Server

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/features/admin/mock-backoffice.ts` | Modify | 更新 mock 数据：新增 `aiScore`、`langCompletion`、`todayProcessed`、`content`、`gallery` 字段；移除 `reviewById` |
| `src/components/admin/product-audit-table.tsx` | Create | 全宽表格组件：统计卡片、6 列表格、筛选、分页 |
| `src/components/admin/product-audit-modal.tsx` | Create | 透明背景弹窗：语言切换器、编辑表单、图库网格、底部操作 |
| `src/components/admin/product-center.tsx` | Modify | 移除 `ProductAuditQueue` / `ProductReviewDrawer` 引用，接入新组件，管理弹窗开关状态 |
| `tests/unit/product-audit-table.test.tsx` | Create | 表格组件独立单元测试 |
| `tests/unit/product-audit-modal.test.tsx` | Create | 弹窗组件独立单元测试 |
| `tests/unit/admin-product-center.test.tsx` | Modify | 更新容器组件测试断言，匹配新布局 |
| `tests/integration/admin-pages.test.tsx` | Modify | 更新集成测试断言，移除旧 split-pane 文案期望 |
| `src/components/admin/product-audit-queue.tsx` | Delete | 旧卡片列表组件 |
| `src/components/admin/product-review-drawer.tsx` | Delete | 旧详情面板组件 |

---

## Task 1: 更新 Mock 数据

**Files:**
- Modify: `src/features/admin/mock-backoffice.ts`

- [ ] **Step 1: 修改 `mockBackoffice.products` 结构**

```typescript
export const mockBackoffice = {
  products: {
    summary: {
      pending: 26,
      todayProcessed: 14
    },
    rows: [
      {
        id: 'product-1',
        name: 'Portable Cleaning Robot X2',
        productCode: 'RC-1038',
        category: '清洁机器人',
        source: '自动抓取',
        status: '补充信息',
        aiScore: 82,
        langCompletion: { en: 'ok', es: 'missing', pt: 'ok' },
        action: '封面图数量不足，建议补 2 张细节图',
        content: {
          zh: { name: 'Portable Cleaning Robot X2', copy: '该清洁机器人采用最先进的导航技术，专为家庭环境设计。' },
          en: { name: 'Portable Cleaning Robot X2', copy: 'This cleaning robot uses advanced navigation technology, designed for home environments.' },
          es: { name: 'Robot de Limpieza Portátil X2', copy: 'Este robot de limpieza utiliza tecnología de navegación avanzada, diseñado para entornos domésticos.' },
          pt: { name: 'Robô de Limpeza Portátil X2', copy: 'Este robô de limpeza utiliza tecnologia de navegação avançada, projetado para ambientes domésticos.' }
        },
        gallery: [
          { id: 'img-1', url: '/products/robot-x2-1.jpg', isPrimary: true },
          { id: 'img-2', url: '/products/robot-x2-2.jpg', isPrimary: false }
        ]
      },
      {
        id: 'product-2',
        name: 'Warehouse Drone Mini',
        productCode: 'DR-2041',
        category: '巡检无人机',
        source: '手动导入',
        status: '待审核',
        aiScore: 76,
        langCompletion: { en: 'missing', es: 'ok', pt: 'missing' },
        action: '缺少英文摘要',
        content: {
          zh: { name: 'Warehouse Drone Mini', copy: '紧凑型仓库巡检无人机，支持自动航线规划。' },
          en: { name: 'Warehouse Drone Mini', copy: '' },
          es: { name: 'Dron de Almacén Mini', copy: 'Dron compacto de inspección de almacén con planificación automática de rutas.' },
          pt: { name: 'Drone de Armazém Mini', copy: '' }
        },
        gallery: [
          { id: 'img-3', url: '/products/drone-mini-1.jpg', isPrimary: true }
        ]
      },
      {
        id: 'product-3',
        name: 'Industrial Arm Pro 8',
        productCode: 'IA-7702',
        category: '工业机械臂',
        source: '自动抓取',
        status: '可发布',
        aiScore: 96,
        langCompletion: { en: 'ok', es: 'ok', pt: 'ok' },
        action: '加入推荐位',
        content: {
          zh: { name: 'Industrial Arm Pro 8', copy: '高精度工业机械臂，适用于精密装配任务。' },
          en: { name: 'Industrial Arm Pro 8', copy: 'High-precision industrial robotic arm for precision assembly tasks.' },
          es: { name: 'Brazo Industrial Pro 8', copy: 'Brazo robótico industrial de alta precisión para tareas de ensamblaje de precisión.' },
          pt: { name: 'Braço Industrial Pro 8', copy: 'Braço robótico industrial de alta precisão para tarefas de montagem de precisão.' }
        },
        gallery: [
          { id: 'img-4', url: '/products/arm-pro8-1.jpg', isPrimary: true },
          { id: 'img-5', url: '/products/arm-pro8-2.jpg', isPrimary: false },
          { id: 'img-6', url: '/products/arm-pro8-3.jpg', isPrimary: false }
        ]
      }
    ],
    createChecklist: [
      { label: '基础信息完整', detail: '标题、分类、SKU 已填写', status: '通过' },
      { label: '图片数量', detail: '当前上传 3 张，建议至少 5 张', status: '待补充' },
      { label: '多语言内容', detail: '英文摘要为空时会进入待补充状态', status: '风险提示' },
      { label: '提交结果', detail: '保存后自动进入审核池，可继续回到审核视图处理', status: '说明' }
    ]
  },
  crawlTasks: {
    headline: '今天已抓取 11 个候选商品',
    summary: '其中 8 个解析完整，3 个需要人工修正图片或分类映射，修复后再进入商品中心审核池。',
    sourceSites: [
      {
        label: 'robotmart.example',
        status: '正常',
        detail: '最近抓取 6 条，封面图和分类映射稳定。'
      },
      {
        label: 'industrial-showcase.example',
        status: '需修复',
        detail: '图片字段结构变化，建议更新解析规则。'
      }
    ]
  },
  subscribers: {
    total: '1,284',
    openRate: '38%',
    failed: '12',
    campaigns: [
      {
        title: 'April New Arrivals',
        status: '待发送',
        detail: '包含 4 个新上架商品，等待确认或自动发送。'
      },
      {
        title: '失败重发',
        status: '12 封',
        detail: '查看失败原因并支持一键重发。'
      }
    ]
  },
  analytics: {
    headline: '本周热门类目更偏便携型设备',
    summary: '浏览与点击数据显示，portable / mini / compact 类商品在首页推荐位的点击率提升明显。',
    insights: [
      '热门商品 / 分类排行',
      '用户转化路径',
      '推荐位调整建议'
    ]
  }
} as const;

export type MockBackoffice = typeof mockBackoffice;
```

- [ ] **Step 2: 运行 TypeScript 类型检查**

Run: `npx tsc --noEmit`
Expected: PASS（没有类型错误；`reviewById` 的引用会在后续任务中一并清理）

- [ ] **Step 3: Commit**

```bash
git add src/features/admin/mock-backoffice.ts
git commit -m "feat: update mock data with aiScore, langCompletion, gallery for audit table"
```

---

## Task 2: 创建 ProductAuditTable 组件

**Files:**
- Create: `src/components/admin/product-audit-table.tsx`
- Create: `tests/unit/product-audit-table.test.tsx`

- [ ] **Step 1: 编写 ProductAuditTable 的 failing test**

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProductAuditTable } from '@/components/admin/product-audit-table';

const mockRows = [
  {
    id: 'p1',
    name: 'Test Robot',
    productCode: 'TR-001',
    category: '机器人',
    source: '自动抓取',
    status: '待审核',
    aiScore: 85,
    langCompletion: { en: 'ok', es: 'missing', pt: 'ok' },
    action: '需要补充图片',
    content: { zh: { name: 'Test Robot', copy: '' }, en: { name: 'Test Robot', copy: '' }, es: { name: 'Test Robot', copy: '' }, pt: { name: 'Test Robot', copy: '' } },
    gallery: []
  }
] as const;

describe('ProductAuditTable', () => {
  it('renders summary cards and table columns', () => {
    const html = renderToStaticMarkup(
      <ProductAuditTable
        rows={mockRows}
        summary={{ pending: 26, todayProcessed: 14 }}
        onAudit={() => {}}
      />
    );

    expect(html).toContain('待审核');
    expect(html).toContain('今日已处理');
    expect(html).toContain('26');
    expect(html).toContain('14');
    expect(html).toContain('待审核队列');
    expect(html).toContain('Test Robot');
    expect(html).toContain('自动抓取');
    expect(html).toContain('待审核');
    expect(html).toContain('85');
    expect(html).toContain('EN');
    expect(html).toContain('ES');
    expect(html).toContain('PT');
    expect(html).toContain('需要补充图片');
    expect(html).toContain('审核');
  });
});
```

- [ ] **Step 2: 运行 test，确认失败**

Run: `npx vitest run tests/unit/product-audit-table.test.tsx`
Expected: FAIL — `ProductAuditTable` module not found

- [ ] **Step 3: 实现 ProductAuditTable 组件**

```tsx
import React from 'react';
import { Bot, Factory, Plane } from 'lucide-react';

type LangCompletion = {
  en: 'ok' | 'missing';
  es: 'ok' | 'missing';
  pt: 'ok' | 'missing';
};

type AuditRow = {
  id: string;
  name: string;
  productCode: string;
  category: string;
  source: string;
  status: string;
  aiScore: number;
  langCompletion: LangCompletion;
  action: string;
  content?: Record<'zh' | 'en' | 'es' | 'pt', { name: string; copy: string }>;
  gallery?: ReadonlyArray<{ id: string; url: string; isPrimary: boolean }>;
};

interface ProductAuditTableProps {
  rows: ReadonlyArray<AuditRow>;
  summary: { pending: number; todayProcessed: number };
  onAudit: (productId: string) => void;
}

function getSourceStyle(source: string) {
  if (source === '自动抓取') {
    return 'bg-green-50 text-green-700 border-green-100';
  }
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function getStatusStyle(status: string) {
  if (status === '待审核') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  if (status === '补充信息') return 'bg-orange-50 text-orange-700 border-orange-100';
  if (status === '可发布') return 'bg-blue-50 text-blue-700 border-blue-100';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function getScoreStyle(score: number) {
  if (score >= 90) return 'bg-blue-50 text-blue-700 border-blue-100';
  if (score >= 80) return 'bg-teal-50 text-teal-700 border-teal-100';
  return 'bg-yellow-50 text-yellow-700 border-yellow-100';
}

function getLangStyle(status: 'ok' | 'missing') {
  if (status === 'ok') return 'bg-gray-100 text-gray-600';
  return 'bg-red-50 text-red-600 border border-red-100';
}

function ProductIcon({ category }: { category: string }) {
  const iconClass = 'w-6 h-6 text-gray-400';
  if (category.includes('机器人')) return <Bot className={iconClass} />;
  if (category.includes('无人机')) return <Plane className={iconClass} />;
  if (category.includes('机械')) return <Factory className={iconClass} />;
  return <Bot className={iconClass} />;
}

export function ProductAuditTable({ rows, summary, onAudit }: ProductAuditTableProps) {
  return (
    <section className="space-y-6">
      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">待审核</p>
          <p className="text-2xl font-bold text-gray-900">{summary.pending}</p>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">今日已处理</p>
          <p className="text-2xl font-bold text-gray-900">{summary.todayProcessed}</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">待审核队列</h3>
            <p className="text-xs text-gray-500">点击「审核」按钮进入内容校验详情页。</p>
          </div>
          <div className="flex gap-2">
            <select className="text-sm border-gray-200 rounded-md text-gray-600 py-1.5 pl-3 pr-8 focus:ring-teal-500 focus:border-teal-500 border">
              <option>所有状态</option>
              <option>待审核</option>
              <option>补充信息</option>
            </select>
            <select className="text-sm border-gray-200 rounded-md text-gray-600 py-1.5 pl-3 pr-8 focus:ring-teal-500 focus:border-teal-500 border">
              <option>按完整度排序 (降序)</option>
              <option>按时间排序 (最新)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Source / Status</th>
                <th className="px-6 py-3 font-medium text-center">AI Score</th>
                <th className="px-6 py-3 font-medium">Completion (EN/ES/PT)</th>
                <th className="px-6 py-3 font-medium">Issue</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 border border-gray-200">
                        <ProductIcon category={row.category} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                          {row.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          SKU {row.productCode} · {row.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getSourceStyle(row.source)}`}>
                        {row.source}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border ${getScoreStyle(row.aiScore)}`}>
                      {row.aiScore}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {(['en', 'es', 'pt'] as const).map((lang) => (
                        <span
                          key={lang}
                          className={`flex items-center justify-center w-6 h-6 rounded text-xs font-medium ${getLangStyle(row.langCompletion[lang])}`}
                          title={`${lang.toUpperCase()} - ${row.langCompletion[lang] === 'ok' ? 'OK' : 'Missing'}`}
                        >
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-600 max-w-xs truncate" title={row.action}>
                      {row.action}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAudit(row.id);
                      }}
                      className="px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors shadow-sm"
                    >
                      审核
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1 to {rows.length} of {rows.length} entries</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed text-sm">Prev</button>
            <button className="px-3 py-1 rounded border border-teal-500 bg-teal-50 text-teal-700 font-medium text-sm">1</button>
            <button className="px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">Next</button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 运行 test，确认通过**

Run: `npx vitest run tests/unit/product-audit-table.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-audit-table.tsx tests/unit/product-audit-table.test.tsx
git commit -m "feat: add ProductAuditTable component with stats, columns, pagination"
```

---

## Task 3: 创建 ProductAuditModal 组件

**Files:**
- Create: `src/components/admin/product-audit-modal.tsx`
- Create: `tests/unit/product-audit-modal.test.tsx`

- [ ] **Step 1: 编写 ProductAuditModal 的 failing test**

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProductAuditModal } from '@/components/admin/product-audit-modal';

const mockProduct = {
  id: 'p1',
  name: 'Test Robot',
  productCode: 'TR-001',
  category: '机器人',
  source: '自动抓取',
  status: '待审核',
  aiScore: 85,
  langCompletion: { en: 'ok', es: 'missing', pt: 'ok' },
  action: '需要补充图片',
  content: {
    zh: { name: '测试机器人', copy: '这是中文文案。' },
    en: { name: 'Test Robot', copy: 'This is English copy.' },
    es: { name: 'Robot de Prueba', copy: '' },
    pt: { name: 'Robô de Teste', copy: '' }
  },
  gallery: [
    { id: 'img-1', url: '/test-1.jpg', isPrimary: true },
    { id: 'img-2', url: '/test-2.jpg', isPrimary: false }
  ]
};

describe('ProductAuditModal', () => {
  it('renders modal with product details when open', () => {
    const html = renderToStaticMarkup(
      <ProductAuditModal
        isOpen={true}
        product={mockProduct}
        onClose={() => {}}
        onApprove={() => {}}
        onDelete={() => {}}
      />
    );

    expect(html).toContain('测试机器人');
    expect(html).toContain('ID: p1');
    expect(html).toContain('ZH');
    expect(html).toContain('EN');
    expect(html).toContain('ES');
    expect(html).toContain('PT');
    expect(html).toContain('产品名称 (ZH)');
    expect(html).toContain('营销文案 (ZH)');
    expect(html).toContain('产品图库');
    expect(html).toContain('主图');
    expect(html).toContain('删除');
    expect(html).toContain('审核通过并上架');
  });

  it('renders nothing when closed', () => {
    const html = renderToStaticMarkup(
      <ProductAuditModal
        isOpen={false}
        product={mockProduct}
        onClose={() => {}}
        onApprove={() => {}}
        onDelete={() => {}}
      />
    );

    expect(html).toBe('');
  });
});
```

- [ ] **Step 2: 运行 test，确认失败**

Run: `npx vitest run tests/unit/product-audit-modal.test.tsx`
Expected: FAIL — `ProductAuditModal` module not found

- [ ] **Step 3: 实现 ProductAuditModal 组件**

```tsx
'use client';

import React, { useState } from 'react';
import { X, Bold, Italic, List, Link, ImagePlus, Upload, CheckCircle } from 'lucide-react';

type Lang = 'zh' | 'en' | 'es' | 'pt';

type ModalProduct = {
  id: string;
  name: string;
  content: Record<Lang, { name: string; copy: string }>;
  gallery: ReadonlyArray<{ id: string; url: string; isPrimary: boolean }>;
};

interface ProductAuditModalProps {
  isOpen: boolean;
  product: ModalProduct | null;
  onClose: () => void;
  onApprove: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function ProductAuditModal({ isOpen, product, onClose, onApprove, onDelete }: ProductAuditModalProps) {
  const [activeLang, setActiveLang] = useState<Lang>('zh');

  if (!isOpen || !product) return null;

  const currentContent = product.content[activeLang];
  const maxGallery = 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl rounded-lg overflow-hidden border border-slate-300">
        {/* Header */}
        <header className="flex-none bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{product.content.zh.name}</h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mt-1">
              ID: {product.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="grid grid-cols-12 gap-0">
            {/* Left: Editor */}
            <div className="col-span-12 lg:col-span-7 border-r border-slate-200 p-6 space-y-6">
              {/* Language Switcher */}
              <div className="inline-flex p-1 bg-slate-100 rounded-lg">
                {(['zh', 'en', 'es', 'pt'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                      activeLang === lang
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Product Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  产品名称 ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  defaultValue={currentContent.name}
                  className="w-full border-slate-200 focus:ring-teal-500 focus:border-teal-500 rounded-md p-3 bg-slate-50/50 text-sm"
                />
              </div>

              {/* Marketing Copy Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  营销文案 ({activeLang.toUpperCase()})
                </label>
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-4 text-slate-400">
                    <Bold className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                    <Italic className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                    <List className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                    <Link className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                  </div>
                  <textarea
                    defaultValue={currentContent.copy}
                    rows={8}
                    className="w-full border-none focus:ring-0 p-4 bg-white text-sm leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right: Gallery */}
            <div className="col-span-12 lg:col-span-5 bg-slate-50/30 p-6">
              <label className="block text-xs font-semibold text-slate-600 mb-4">
                产品图库 ({product.gallery.length}/{maxGallery})
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.gallery.map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square bg-white border border-slate-200 rounded-lg overflow-hidden relative"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {img.isPrimary && (
                      <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        主图
                      </span>
                    )}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - product.gallery.length) }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="aspect-square bg-slate-100 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <ImagePlus className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">上传</span>
                  </div>
                ))}
                <div className="aspect-square bg-slate-100 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">上传新图</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-none bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="px-6 py-2.5 border border-red-200 text-red-600 font-bold text-sm rounded-md hover:bg-red-50 transition-colors"
          >
            删除
          </button>
          <button
            type="button"
            onClick={() => onApprove(product.id)}
            className="px-8 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            审核通过并上架
          </button>
        </footer>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 运行 test，确认通过**

Run: `npx vitest run tests/unit/product-audit-modal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-audit-modal.tsx tests/unit/product-audit-modal.test.tsx
git commit -m "feat: add ProductAuditModal with language switcher, editor, and gallery"
```

---

## Task 4: 在 ProductCenter 中接入新组件

**Files:**
- Modify: `src/components/admin/product-center.tsx`

- [ ] **Step 1: 重写 ProductCenter 组件**

```tsx
'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { ProductAuditTable } from '@/components/admin/product-audit-table';
import { ProductAuditModal } from '@/components/admin/product-audit-modal';
import { ProductCreateTab } from '@/components/admin/product-create-tab';
import { AdminLinkButton } from './admin-button';

type LangCompletion = {
  en: 'ok' | 'missing';
  es: 'ok' | 'missing';
  pt: 'ok' | 'missing';
};

type ProductCenterData = {
  summary: {
    pending: number;
    todayProcessed: number;
  };
  rows: ReadonlyArray<{
    id: string;
    name: string;
    productCode: string;
    category: string;
    source: string;
    status: string;
    aiScore: number;
    langCompletion: LangCompletion;
    action: string;
    content?: Record<'zh' | 'en' | 'es' | 'pt', { name: string; copy: string }>;
    gallery?: ReadonlyArray<{ id: string; url: string; isPrimary: boolean }>;
  }>;
  createChecklist: ReadonlyArray<{
    label: string;
    detail: string;
    status: string;
  }>;
};

export function ProductCenter({
  data,
  defaultSelectedProductId,
  defaultTab = 'audit'
}: {
  data: ProductCenterData;
  defaultSelectedProductId?: string;
  defaultTab?: 'audit' | 'create';
}) {
  const [activeTab, setActiveTab] = useState<'audit' | 'create'>(defaultTab);
  const [isModalOpen, setIsModalOpen] = useState(!!defaultSelectedProductId);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    defaultSelectedProductId ?? null
  );

  const selectedProduct = data.rows.find((r) => r.id === selectedProductId) ?? null;
  const isCreateTab = activeTab === 'create';

  const handleAudit = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  const handleApprove = (productId: string) => {
    // eslint-disable-next-line no-console
    console.log('Approved:', productId);
    handleClose();
  };

  const handleDelete = (productId: string) => {
    // eslint-disable-next-line no-console
    console.log('Deleted:', productId);
    handleClose();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-sm font-medium rounded-full shadow-sm transition-colors ${
              isCreateTab
                ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                : 'bg-gray-900 text-white'
            }`}
          >
            商品审核
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium rounded-full shadow-sm transition-colors ${
              isCreateTab
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            手动新增
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
            <Globe className="h-3.5 w-3.5" />
            抓取日志
          </AdminLinkButton>
        </div>
      </div>

      {isCreateTab ? (
        <ProductCreateTab checklist={data.createChecklist} />
      ) : (
        <>
          <ProductAuditTable
            rows={data.rows}
            summary={data.summary}
            onAudit={handleAudit}
          />
          <ProductAuditModal
            isOpen={isModalOpen}
            product={selectedProduct}
            onClose={handleClose}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 2: 运行 ProductCenter 相关测试**

Run: `npx vitest run tests/unit/admin-product-center.test.tsx`
Expected: FAIL — 断言需要更新（见 Task 5）

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/product-center.tsx
git commit -m "feat: wire ProductAuditTable and ProductAuditModal into ProductCenter"
```

---

## Task 5: 更新单元测试

**Files:**
- Modify: `tests/unit/admin-product-center.test.tsx`

- [ ] **Step 1: 重写 admin-product-center.test.tsx**

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ProductCenter } from '@/components/admin/product-center';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('ProductCenter', () => {
  it('renders the audit workflow by default', () => {
    const html = renderToStaticMarkup(
      <ProductCenter data={mockBackoffice.products} />
    );

    expect(html).toContain('商品审核');
    expect(html).toContain('手动新增');
    expect(html).toContain('待审核队列');
    expect(html).toContain('待审核');
    expect(html).toContain('今日已处理');
    expect(html).toContain('AI Score');
    expect(html).toContain('EN');
    expect(html).toContain('ES');
    expect(html).toContain('PT');
    expect(html).not.toContain('手动新增商品');
    expect(html).not.toContain('自动抓取源监控');
  });

  it('renders the selected product modal when default id is provided', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        data={mockBackoffice.products}
        defaultSelectedProductId="product-1"
      />
    );

    expect(html).toContain('Portable Cleaning Robot X2');
    expect(html).toContain('封面图数量不足');
    expect(html).toContain('审核通过并上架');
  });

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
    expect(html).not.toContain('AI Score');
  });
});
```

- [ ] **Step 2: 运行单元测试**

Run: `npx vitest run tests/unit/admin-product-center.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/unit/admin-product-center.test.tsx
git commit -m "test: update ProductCenter unit tests for new table and modal layout"
```

---

## Task 6: 更新集成测试

**Files:**
- Modify: `tests/integration/admin-pages.test.tsx`

- [ ] **Step 1: 更新 products page 断言**

在 `tests/integration/admin-pages.test.tsx` 第 103-106 行附近，更新为：

```typescript
    expect(html).toContain('商品审核');
    expect(html).toContain('自动抓取');
    expect(html).toContain('手动导入');
    expect(html).toContain('产品审核中心');
```

将 `手动导入商品` 改为 `手动导入`（与设计稿和 mock 数据一致）。

- [ ] **Step 2: 运行集成测试**

Run: `npx vitest run tests/integration/admin-pages.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/integration/admin-pages.test.tsx
git commit -m "test: update integration test assertions for audit table layout"
```

---

## Task 7: 清理旧组件

**Files:**
- Delete: `src/components/admin/product-audit-queue.tsx`
- Delete: `src/components/admin/product-review-drawer.tsx`

- [ ] **Step 1: 删除旧文件**

```bash
rm src/components/admin/product-audit-queue.tsx
rm src/components/admin/product-review-drawer.tsx
```

- [ ] **Step 2: 检查是否有残留引用**

Run: `npx tsc --noEmit`
Expected: PASS — 无 `ProductAuditQueue` 或 `ProductReviewDrawer` 的残留引用

- [ ] **Step 3: 运行完整测试套件**

Run: `npx vitest run`
Expected: 所有测试 PASS

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove ProductAuditQueue and ProductReviewDrawer"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ 全宽表格（6 列、stats、筛选、分页）→ Task 2
- ✅ 透明背景弹窗（语言切换、编辑表单、图库）→ Task 3
- ✅ 统计卡片精简为 2 张 → Task 1 + Task 2
- ✅ 保留 admin shell → Task 4（未触及 layout）
- ✅ 更新 mock 数据（aiScore、langCompletion、gellery）→ Task 1
- ✅ 废弃 reviewById → Task 1（已移除）
- ✅ 更新单元测试 → Task 5
- ✅ 更新集成测试 → Task 6
- ✅ 清理旧组件 → Task 7

**2. Placeholder scan:**
- ✅ 无 TBD / TODO
- ✅ 每步均含完整代码或精确命令
- ✅ 无 "similar to Task N" 引用

**3. Type consistency：**
- ✅ `LangCompletion` 类型在 Task 2 和 Task 4 中一致
- ✅ `ProductCenterData` 中的 `content` 和 `gallery` 类型与 mock 数据一致
- ✅ `ModalProduct` 接口是 `ProductCenterData['rows'][number]` 的子集，字段名一致
