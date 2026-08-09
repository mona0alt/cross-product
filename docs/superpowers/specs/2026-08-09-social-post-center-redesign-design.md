# 社媒卡片配置页改版设计(参考商品管理工作台)

日期:2026-08-09
状态:已获用户批准

## 背景与问题

管理后台「社媒卡片」配置页(`src/app/admin/(protected)/social-posts/page.tsx`)目前是「AdminPageHero + 新建表单卡 + 行内编辑表格」三段竖排布局,与商品管理页(`ProductCenter` 工作台)的视觉语言和交互模式差异很大,显得零散。

目标:参考商品管理的设计,把社媒卡片配置整合为紧凑的单面板工作台,但保持轻量——数据量小(通常个位数卡片),不引入商品管理的重型机制。

## 范围

### 做

- 新建 `src/components/admin/social-post-center.tsx`(client component,`'use client'`),替代 `src/components/admin/social-post-form.tsx`。
- 单面板工作台布局:
  - **工具栏 header**:lucide 图标(如 `Share2`)+ 标题「社媒卡片」+ 已配置数量 badge;右侧 accent 色「新建卡片」按钮。样式对齐 `ProductCenter` header(`rounded-xl`、`border-admin-border`、`h-9` 控件、`text-xs`)。
  - **只读表格列表**:列为 平台 / 封面缩略图 / 跳转 URL(截断显示)/ 操作(编辑铅笔、删除垃圾桶图标按钮)。行内不再放表单控件。
  - **右侧滑出抽屉**:新建/编辑共用,遮罩 + 固定右侧抽屉(宽约 420px,`role="dialog"`),字段为平台 select、跳转 URL input、`AdminImageUploadInput`(scope="social",allowManualEntry)。模式参照 `ProductEditorDrawer`。
  - **删除确认模态**:居中 `role="alertdialog"`,简化版,参照 `ProductDeleteConfirmDialog`。
  - **notice 条**:操作成功/失败提示,4 秒自动消失,样式参照 product-center 的通知条。
- 数据流:沿用现有 server actions(`src/features/admin/social-post-actions.ts` 的 `createSocialPostFromForm` / `updateSocialPostFromForm` / `deleteSocialPost`),不改动。客户端用 `useTransition` 提交,成功后 `router.refresh()`。
- `page.tsx` 保持薄壳 server component,仅将渲染组件换成 `SocialPostCenter`。
- i18n:沿用 `copy` prop + `defaultCopy` 兜底约定;新增少量文案 key(编辑、取消、删除确认等),带默认值。

### 不做

- 不做固定视口高度 `h-[calc(100vh-104px)]`(内容少,自然高度即可)。
- 不做搜索/筛选/导出 CSV/批量操作(卡片数量太少)。
- 不做客户端 fetch 筛选、乐观更新(server action + `router.refresh()` 足够)。
- 不动前台展示逻辑、数据库 schema、server actions 实现。

## 组件设计

### `SocialPostCenter`(新,client component)

Props:

```ts
type SocialPostItem = { id: string; platform: string; imageUrl: string; targetUrl: string };

{
  posts: SocialPostItem[];
  copy?: Partial<SocialPostCenterCopy>;
  uploadLabel?: string;
}
```

内部状态:

- `drawerState: { mode: 'create' } | { mode: 'edit'; post: SocialPostItem } | null` — 控制抽屉开关与内容。
- `pendingDelete: SocialPostItem | null` — 控制删除确认模态。
- `notice: { type: 'success' | 'error'; message: string } | null` — 4 秒自动清除。
- `isPending`(来自 `useTransition`)— 禁用提交按钮。

子结构(同文件内函数组件):

- `SocialPostDrawer`:新建/编辑抽屉,`<form action={...}>` 包 server action,提交成功后关闭抽屉 + `router.refresh()` + 显示 notice。
- `DeleteConfirmDialog`:确认后执行 `deleteSocialPost`。

### 布局示意

```
┌────────────────────────────────────────────────────┐
│ [Share2] 社媒卡片 (n 张)            [+ 新建卡片]   │  header
├────────────────────────────────────────────────────┤
│ 平台 │ 封面     │ 跳转 URL          │ 操作         │  只读表格
│ X   │ [缩略图] │ https://…         │ ✏️ 🗑         │
└────────────────────────────────────────────────────┘
                                  ┌─────────────┐
                                  │ 编辑/新建抽屉│  遮罩 + 右侧滑出
                                  │ 平台 select │
                                  │ 跳转 URL    │
                                  │ 封面上传    │
                                  │ [保存][取消]│
                                  └─────────────┘
```

### 删除的旧代码

- `src/components/admin/social-post-form.tsx` 整个删除(若无其他引用)。
- 随之去掉 AdminPageHero、指标卡、行内编辑的 `form` 属性 hack。

## 错误处理

- server action 抛错时在 notice 条显示错误文案,抽屉保持打开,表单内容不丢。
- 删除失败同样走 notice 条。

## 文案/i18n

沿用 `messages/*.json` 中 `Admin.socialPosts` 现有 key;新增 key(如 `edit`、`cancel`、`deleteConfirmTitle`、`deleteConfirmDescription`、`createSuccess`、`updateSuccess`、`deleteSuccess`)在各语言文件中补充,组件内 `defaultCopy` 提供中文兜底。

## 验证

- 手动验证:新建、编辑(改平台/URL/封面)、删除、删除取消、错误提示。
- 若项目已有针对 admin 组件的测试约定,补一个基础渲染/交互测试;否则以手动验证为准。
- `npm run lint` / 构建通过。
