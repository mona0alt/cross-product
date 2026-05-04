# 商品审核页面重构设计

## 概述

将现有商品审核页的分栏卡片式布局（左侧队列 + 右侧详情面板）重构为设计稿中的**全宽表格 + 透明背景弹窗编辑**布局。

保留现有 admin shell（侧边栏 + 顶部 Header），仅替换内容区域。

设计参考：
- `docs/superpowers/stitch_smart_multi_language_product_system/product_audit_list_view/code.html`（列表视图）
- `docs/superpowers/stitch_smart_multi_language_product_system/code.html`（弹窗编辑界面）

## 页面布局与结构

内容区拆成三层：

1. **子导航 Tab**：「商品审核 / 手动新增」圆角胶囊按钮组
   - 当前项：`bg-gray-900 text-white rounded-full`
   - 非当前项：`bg-white text-gray-600 border border-gray-200 rounded-full`

2. **统计卡片**：仅保留 2 张
   - 待审核（`pending`）
   - 今日已处理（`todayProcessed`）
   - 样式：白底、圆角 `rounded-xl`、 subtle shadow、无边框标题 + 大号数字

3. **全宽表格容器**：`bg-white rounded-xl shadow-sm border border-gray-100`
   - 头部：左侧标题「待审核队列」+ 描述 + 右侧两个筛选下拉框
   - 主体：6 列表格
   - 底部：分页器

## ProductAuditTable 组件

### 列定义

| 列 | 内容 | 样式 |
|---|---|---|
| **Product** | 48×48 灰色占位图标（`bg-gray-100 rounded-md border`）+ 商品名称（hover `text-teal-700`）+ `SKU {code} · {category}` | 左对齐 |
| **Source / Status** | 上下堆叠的两枚小 badge | 左对齐 |
| **AI Score** | 圆形徽章，`w-10 h-10 rounded-full` | 居中 |
| **Completion** | EN / ES / PT 三个小方标，`w-6 h-6 rounded text-xs` | 左对齐 |
| **Issue** | `text-xs text-gray-600 max-w-xs truncate` | 左对齐 |
| **Action** | 「审核」或「复核」按钮 | 右对齐 |

### Badge 配色

- 自动抓取：`bg-green-50 text-green-700 border-green-100`
- 手动导入：`bg-gray-100 text-gray-600 border-gray-200`
- 待审核：`bg-yellow-50 text-yellow-700 border-yellow-100`
- 补充信息：`bg-orange-50 text-orange-700 border-orange-100`
- 可发布：`bg-blue-50 text-blue-700 border-blue-100`

### AI Score 配色

- ≥90：`bg-blue-50 text-blue-700 border-blue-100`
- ≥80：`bg-teal-50 text-teal-700 border-teal-100`
- <80：`bg-yellow-50 text-yellow-700 border-yellow-100`

### 语言完成度

- 完整：`bg-gray-100 text-gray-600`
- 缺失：`bg-red-50 text-red-600 border-red-100`

### 交互

- 行 hover：`hover:bg-gray-50 transition-colors`
- 点击「审核」：阻止事件冒泡，触发 `onAudit(productId)`
- 筛选：所有状态 / 待审核 / 补充信息
- 排序：按完整度降序 / 按时间最新
- 分页：Prev / 页码 / Next，当前页 `border-teal-500 bg-teal-50 text-teal-700`

## ProductAuditModal 组件

### 遮罩层

- `fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12`
- 背景：`absolute inset-0 bg-slate-900/60 backdrop-blur-sm`

### 弹窗容器

- `relative bg-white w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl rounded-lg overflow-hidden border border-slate-300`

### Header

- `bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center`
- 左侧：商品名称（`text-h1 font-h1 text-slate-900`）+ ID（`text-data-label uppercase tracking-widest text-slate-500`）
- 右侧：关闭按钮（`text-slate-400 hover:text-slate-900`）

### Body（双栏网格）

- 外层：`grid grid-cols-12 gap-0 h-full`
- 左侧编辑区（`col-span-12 lg:col-span-7 border-r border-slate-200 p-6 space-y-6`）
  - **语言切换器**：`inline-flex p-1 bg-slate-100 rounded-lg`
    - 当前语言：`bg-white text-slate-900 shadow-sm rounded`
    - 其他语言：`text-slate-500 hover:text-slate-900`
    - 顺序：ZH → EN → ES → PT
  - **产品名称输入框**：`w-full border-slate-200 focus:ring-teal-500 rounded p-3 bg-slate-50/50`
  - **营销文案编辑器**：带工具栏（B / I / 列表 / 链接）的富文本区域
    - 工具栏：`bg-slate-50 border-b border-slate-200 p-2 flex gap-4`
    - 文本域：`border-none focus:ring-0 p-4 bg-white leading-relaxed`
  - **AI 建议提示框**（设计稿中仅预留注释位，实现时可作为空占位或根据 `action` 字段展示提示）
- 右侧图库区（`col-span-12 lg:col-span-5 bg-slate-50/30 p-6`）
  - 标题：`产品图库 ({current}/{max})`
  - 网格：`grid grid-cols-2 gap-3`
  - 已有图片：`aspect-square bg-white border border-slate-200 rounded-lg overflow-hidden relative`
    - 主图标记：`absolute top-2 right-2 bg-teal-600 text-white font-badge text-badge px-1.5 py-0.5 rounded`
  - 空位占位：`aspect-square bg-slate-100 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400`
  - 上传按钮：`hover:bg-slate-200 transition-colors cursor-pointer`

### Footer

- `flex-none bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between`
- 左侧：「删除」按钮（`border-error text-error hover:bg-error/5`）
- 右侧：「审核通过并上架」按钮（`bg-teal-600 text-white hover:bg-teal-700` + `check_circle` icon）

### 状态管理

- 弹窗显隐由 `ProductCenter` 通过 `isOpen` + `onClose` 控制
- 表单内部状态（当前语言、输入内容）由 `ProductAuditModal` 自行 `useState` 管理
- 关闭弹窗不自动持久化；仅「审核通过并上架」和「删除」触发父级回调

## 数据模型变更

### `mockBackoffice.products` 结构更新

```ts
summary: {
  pending: number;        // 待审核
  todayProcessed: number; // 今日已处理（替换原有的 incomingToday / needsInfo / publishable 展示）
}

rows: {
  id: string;
  name: string;
  productCode: string;
  category: string;
  source: string;         // '自动抓取' | '手动导入'
  status: string;         // '待审核' | '补充信息' | '可发布'
  aiScore: number;        // 新增
  langCompletion: {       // 新增
    en: 'ok' | 'missing';
    es: 'ok' | 'missing';
    pt: 'ok' | 'missing';
  };
  action: string;         // issue 描述
}
```

### `reviewById` 废弃

原有的 `reviewById` 和右侧详情面板逻辑整体移除。弹窗所需数据直接从对应行数据扩展（多语言内容、图库数组）。

### 旧组件清理

- `ProductAuditQueue` → 删除，替换为 `ProductAuditTable`
- `ProductReviewDrawer` → 删除，替换为 `ProductAuditModal`

## 组件接口

```ts
// ProductCenter 接收的数据结构（精简后）
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
    langCompletion: { en: 'ok' | 'missing'; es: 'ok' | 'missing'; pt: 'ok' | 'missing' };
    action: string;
    // 弹窗展开时需要补充的完整字段
    content?: Record<'zh' | 'en' | 'es' | 'pt', { name: string; copy: string }>;
    gallery?: ReadonlyArray<{ id: string; url: string; isPrimary: boolean }>;
  }>;
  createChecklist: ReadonlyArray<{ label: string; detail: string; status: string }>;
};

// ProductAuditTable
interface ProductAuditTableProps {
  rows: ProductCenterData['rows'];
  summary: ProductCenterData['summary'];
  onAudit: (productId: string) => void;
}

// ProductAuditModal
interface ProductAuditModalProps {
  isOpen: boolean;
  product: ProductCenterData['rows'][number] | null;
  onClose: () => void;
  onApprove: (productId: string) => void;
  onDelete: (productId: string) => void;
}
```

## 测试策略

### 单元测试（`tests/unit/admin-product-center.test.tsx`）

- 验证默认渲染：包含「商品审核」「手动新增」Tab、2 张统计卡片、表格标题「待审核队列」
- 验证表格内容：商品名称、Source/Status badge、AI Score 圆形数字、EN/ES/PT 小方标、Issue 文本、「审核」按钮
- 验证手动新增 Tab：切换到 create tab 时不显示表格，显示创建表单
- 验证弹窗交互：点击「审核」后弹窗渲染（包含语言切换器、产品名称输入框、图库网格、「审核通过并上架」按钮）；点击关闭按钮后弹窗消失

### 集成测试（`tests/integration/admin-pages.test.tsx`）

- 更新 products page 断言：
  - 移除旧 split-pane 文案：「当前审核详情」「审核通过并上架」
  - 新增期望：「待审核队列」「自动抓取」「手动导入」「审核」
- 保留「产品审核中心」（页面级标题由 `AdminSectionHeader` 提供）

### 快照/渲染测试

- 使用 `renderToStaticMarkup` 验证静态输出包含关键结构和文案
- 弹窗因依赖 `isOpen` 状态，通过模拟点击触发后验证渲染输出
