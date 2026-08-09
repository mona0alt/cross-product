# 社媒卡片配置页改版(SocialPostCenter)实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把管理后台社媒卡片配置页从「Hero + 新建表单 + 行内编辑表格」三段式改造为参考商品管理(ProductCenter)视觉语言的轻量单面板工作台:工具栏 + 只读表格 + 右侧抽屉编辑 + 删除确认模态。

**Architecture:** 新建 client component `SocialPostCenter` 替换 `SocialPostForm`;数据流沿用现有 server actions(`createSocialPostFromForm` / `updateSocialPostFromForm` / `deleteSocialPost`),客户端 `useTransition` 提交 + `router.refresh()`;`page.tsx` 薄壳仅换组件名。

**Tech Stack:** Next.js 15 (App Router, server actions), React 19, Tailwind(admin-* 语义 token), lucide-react, Vitest (renderToStaticMarkup 组件测试)。

**Spec:** `docs/superpowers/specs/2026-08-09-social-post-center-redesign-design.md`

**注意:** 计划中的 `git commit` 步骤需先获得用户确认再执行(环境规则)。

---

## 关键既有事实(执行者无需再查)

- server actions 在 `src/features/admin/social-post-actions.ts`,签名:
  - `createSocialPostFromForm(formData: FormData)` — 校验失败 throw `Error('MISSING_imageUrl' | 'MISSING_targetUrl' | 'INVALID_platform')`
  - `updateSocialPostFromForm(id: string, formData: FormData)`
  - `deleteSocialPost(id: string)`
  - 三个 action 成功后都会 `revalidatePath('/')` 和 `revalidatePath('/admin/social-posts')`
- 平台注册表 `src/features/catalog/social-platforms.ts` 已导出 `getSocialPlatformLabel(platform: string)`,**直接复用,不要新写**。
- `AdminImageUploadInput`(`src/components/admin/admin-image-upload-input.tsx`,client component)可用 props:`name`、`label`、`uploadLabel`、`defaultValue`、`placeholder`、`scope="social"`、`allowManualEntry`、`showPreview`。
- lucide-react 已在依赖中;ProductCenter 使用 `Share2`/`CirclePlus`/`Pencil`/`Trash2`/`X`/`AlertTriangle` 同款图标。
- 组件测试约定:Vitest + `react-dom/server` 的 `renderToStaticMarkup`,mock `next/navigation` 的 `useRouter`(参考 `tests/unit/admin-product-center.test.tsx`)。
- 测试命令:`npx vitest run tests/unit/<file>`;全量:`npm test`;lint:`npm run lint`。
- 四个语言文件 `messages/{zh-CN,en,es,pt}.json` 中 `Admin.socialPosts` 块均位于第 170–182 行,现有 key:`title, description, formTitle, platform, imageUrl, targetUrl, create, list, listDescription, save, delete`。

---

### Task 1: 补充 i18n 文案

**Files:**
- Modify: `messages/zh-CN.json:170-182`(`Admin.socialPosts` 块)
- Modify: `messages/en.json:170-182`
- Modify: `messages/es.json:170-182`
- Modify: `messages/pt.json:170-182`

- [ ] **Step 1: zh-CN — 在 `"save": "保存",` 之后、`"delete": "删除"` 行替换为如下内容**

将 `messages/zh-CN.json` 中 `Admin.socialPosts` 块的末尾两行:

```json
      "save": "保存",
      "delete": "删除"
```

替换为:

```json
      "save": "保存",
      "delete": "删除",
      "edit": "编辑",
      "cancel": "取消",
      "editTitle": "编辑社媒卡片",
      "deleteConfirmTitle": "删除社媒卡片",
      "deleteConfirmDescription": "删除后前台将不再展示该卡片,此操作不可撤销。",
      "confirmDelete": "确认删除",
      "createSuccess": "社媒卡片已创建。",
      "updateSuccess": "社媒卡片已保存。",
      "deleteSuccess": "社媒卡片已删除。",
      "saveError": "保存失败,请检查填写内容后重试。",
      "emptyTitle": "还没有社媒卡片",
      "emptyDescription": "点击右上角「新建卡片」添加第一张。"
```

- [ ] **Step 2: en — 同样位置追加**

`messages/en.json` 中 `"save": "Save",\n      "delete": "Delete"` 替换为:

```json
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "cancel": "Cancel",
      "editTitle": "Edit Social Post",
      "deleteConfirmTitle": "Delete Social Post",
      "deleteConfirmDescription": "The card will no longer appear on the storefront. This cannot be undone.",
      "confirmDelete": "Delete",
      "createSuccess": "Social post created.",
      "updateSuccess": "Social post saved.",
      "deleteSuccess": "Social post deleted.",
      "saveError": "Save failed. Check the fields and try again.",
      "emptyTitle": "No social posts yet",
      "emptyDescription": "Click \"Create Post\" in the top right to add the first one."
```

- [ ] **Step 3: es — 同样位置追加**

`messages/es.json` 中 `"save": "Guardar",\n      "delete": "Eliminar"` 替换为:

```json
      "save": "Guardar",
      "delete": "Eliminar",
      "edit": "Editar",
      "cancel": "Cancelar",
      "editTitle": "Editar tarjeta social",
      "deleteConfirmTitle": "Eliminar tarjeta social",
      "deleteConfirmDescription": "La tarjeta dejará de mostrarse en la tienda. Esta acción no se puede deshacer.",
      "confirmDelete": "Eliminar",
      "createSuccess": "Tarjeta social creada.",
      "updateSuccess": "Tarjeta social guardada.",
      "deleteSuccess": "Tarjeta social eliminada.",
      "saveError": "Error al guardar. Revisa los campos e inténtalo de nuevo.",
      "emptyTitle": "Aún no hay tarjetas sociales",
      "emptyDescription": "Haz clic en «Crear tarjeta» para añadir la primera."
```

- [ ] **Step 4: pt — 同样位置追加**

`messages/pt.json` 中 `"save": "Salvar",\n      "delete": "Excluir"` 替换为:

```json
      "save": "Salvar",
      "delete": "Excluir",
      "edit": "Editar",
      "cancel": "Cancelar",
      "editTitle": "Editar cartão social",
      "deleteConfirmTitle": "Excluir cartão social",
      "deleteConfirmDescription": "O cartão deixará de aparecer na loja. Esta ação não pode ser desfeita.",
      "confirmDelete": "Excluir",
      "createSuccess": "Cartão social criado.",
      "updateSuccess": "Cartão social salvo.",
      "deleteSuccess": "Cartão social excluído.",
      "saveError": "Falha ao salvar. Verifique os campos e tente novamente.",
      "emptyTitle": "Ainda não há cartões sociais",
      "emptyDescription": "Clique em «Criar cartão» para adicionar o primeiro."
```

- [ ] **Step 5: 校验四个 JSON 文件格式合法**

Run:

```bash
for f in zh-CN en es pt; do node -e "JSON.parse(require('fs').readFileSync('messages/$f.json','utf8')); console.log('$f OK')"; done
```

Expected: 四行 `zh-CN OK` / `en OK` / `es OK` / `pt OK`。

- [ ] **Step 6: Commit(先征得用户确认)**

```bash
git add messages/zh-CN.json messages/en.json messages/es.json messages/pt.json
git commit -m "feat(admin): add social post center i18n copy"
```

---

### Task 2: SocialPostCenter 组件(TDD)

**Files:**
- Test: `tests/unit/admin-social-post-center.test.tsx`
- Create: `src/components/admin/social-post-center.tsx`

- [ ] **Step 1: 写失败测试**

创建 `tests/unit/admin-social-post-center.test.tsx`:

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() })
}));

vi.mock('@/features/admin/social-post-actions', () => ({
  createSocialPostFromForm: vi.fn(),
  updateSocialPostFromForm: vi.fn(),
  deleteSocialPost: vi.fn()
}));

import { SocialPostCenter } from '@/components/admin/social-post-center';

const posts = [
  {
    id: 'post-1',
    platform: 'instagram',
    imageUrl: '/uploads/social/2026/08/cover.jpg',
    targetUrl: 'https://www.instagram.com/fbgm_decomaterial'
  }
];

describe('SocialPostCenter', () => {
  it('renders the workbench header with title, count badge and create button', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={posts} />);

    expect(html).toContain('社媒卡片');
    expect(html).toContain('新建卡片');
  });

  it('renders a read-only row per post with platform label, url, edit and delete buttons', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={posts} />);

    expect(html).toContain('Instagram');
    expect(html).toContain('https://www.instagram.com/fbgm_decomaterial');
    expect(html).toContain('/uploads/social/2026/08/cover.jpg');
    expect(html).toContain('aria-label="编辑"');
    expect(html).toContain('aria-label="删除"');
  });

  it('does not render inline editing inputs or the drawer by default', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={posts} />);

    expect(html).not.toContain('role="dialog"');
    expect(html).not.toContain('name="targetUrl"');
  });

  it('renders an empty state when there are no posts', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={[]} />);

    expect(html).toContain('还没有社媒卡片');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/unit/admin-social-post-center.test.tsx`
Expected: FAIL — 模块 `@/components/admin/social-post-center` 不存在。

- [ ] **Step 3: 实现组件**

创建 `src/components/admin/social-post-center.tsx`:

```tsx
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CirclePlus,
  Pencil,
  Share2,
  Trash2,
  X
} from 'lucide-react';

import {
  createSocialPostFromForm,
  deleteSocialPost,
  updateSocialPostFromForm
} from '@/features/admin/social-post-actions';
import { getSocialPlatformLabel, socialPlatforms } from '@/features/catalog/social-platforms';
import { AdminImageUploadInput } from './admin-image-upload-input';

type SocialPostItem = {
  id: string;
  platform: string;
  imageUrl: string;
  targetUrl: string;
};

type SocialPostCenterCopy = {
  title: string;
  formTitle: string;
  editTitle: string;
  platform: string;
  imageUrl: string;
  targetUrl: string;
  create: string;
  edit: string;
  save: string;
  cancel: string;
  delete: string;
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  confirmDelete: string;
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  saveError: string;
  emptyTitle: string;
  emptyDescription: string;
};

const defaultCopy: SocialPostCenterCopy = {
  title: '社媒卡片',
  formTitle: '新建社媒卡片',
  editTitle: '编辑社媒卡片',
  platform: '平台',
  imageUrl: '封面图',
  targetUrl: '跳转 URL',
  create: '新建卡片',
  edit: '编辑',
  save: '保存',
  cancel: '取消',
  delete: '删除',
  deleteConfirmTitle: '删除社媒卡片',
  deleteConfirmDescription: '删除后前台将不再展示该卡片,此操作不可撤销。',
  confirmDelete: '确认删除',
  createSuccess: '社媒卡片已创建。',
  updateSuccess: '社媒卡片已保存。',
  deleteSuccess: '社媒卡片已删除。',
  saveError: '保存失败,请检查填写内容后重试。',
  emptyTitle: '还没有社媒卡片',
  emptyDescription: '点击右上角「新建卡片」添加第一张。'
};

const NOTICE_AUTO_DISMISS_MS = 4000;

type DrawerState = { mode: 'create' } | { mode: 'edit'; post: SocialPostItem };

type Notice = {
  tone: 'success' | 'error';
  message: string;
};

const inputClass =
  'h-9 w-full rounded-lg border border-admin-border bg-admin-elevated px-3 text-xs text-admin-text-primary outline-none transition focus:border-admin-accent focus:bg-white focus:ring-2 focus:ring-emerald-500/10';

export function SocialPostCenter({
  posts,
  copy,
  uploadLabel = '上传图片'
}: {
  posts: SocialPostItem[];
  copy?: Partial<SocialPostCenterCopy>;
  uploadLabel?: string;
}) {
  const router = useRouter();
  const labels = { ...defaultCopy, ...copy };
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SocialPostItem | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = setTimeout(() => setNotice(null), NOTICE_AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [notice]);

  const handleDeleteConfirm = () => {
    if (!pendingDelete) {
      return;
    }

    startDeleteTransition(async () => {
      try {
        await deleteSocialPost(pendingDelete.id);
        setPendingDelete(null);
        setNotice({ tone: 'success', message: labels.deleteSuccess });
        router.refresh();
      } catch {
        setNotice({ tone: 'error', message: labels.saveError });
      }
    });
  };

  return (
    <section className="relative flex flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-bg text-sm shadow-sm">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-admin-border bg-white px-4 py-3 lg:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-admin-accent">
            <Share2 className="h-4 w-4" />
          </div>
          <h2 className="shrink-0 text-base font-semibold text-admin-text-primary">
            {labels.title}
          </h2>
          <span className="rounded-full border border-admin-border bg-admin-elevated px-2 py-0.5 text-xs font-medium text-admin-text-muted">
            {posts.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDrawerState({ mode: 'create' })}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-admin-accent px-3 text-xs font-semibold text-white transition hover:bg-admin-accent-hover focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
        >
          <CirclePlus className="h-4 w-4" />
          {labels.create}
        </button>
      </header>

      {notice ? (
        <div
          role="status"
          className={`mx-4 mt-3 rounded-lg border px-3 py-2 text-xs lg:mx-5 ${
            notice.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <div className="bg-white">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-admin-text-primary">{labels.emptyTitle}</p>
            <p className="text-xs text-admin-text-muted">{labels.emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-admin-border text-sm">
              <thead className="bg-admin-elevated text-admin-text-muted">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider">
                    {labels.platform}
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider">
                    {labels.imageUrl}
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider">
                    {labels.targetUrl}
                  </th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider">
                    {labels.edit}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border bg-white">
                {posts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-admin-elevated/60">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-admin-text-primary">
                      {getSocialPlatformLabel(post.platform)}
                    </td>
                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.imageUrl}
                        alt={getSocialPlatformLabel(post.platform)}
                        className="h-10 w-16 rounded-lg border border-admin-border object-cover"
                      />
                    </td>
                    <td className="max-w-[320px] truncate px-4 py-3 text-admin-text-secondary">
                      <a
                        href={post.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition hover:text-admin-accent hover:underline"
                      >
                        {post.targetUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label={labels.edit}
                          title={labels.edit}
                          onClick={() => setDrawerState({ mode: 'edit', post })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-admin-text-muted transition hover:bg-admin-elevated hover:text-admin-text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={labels.delete}
                          title={labels.delete}
                          onClick={() => setPendingDelete(post)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-admin-text-muted transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {drawerState ? (
        <SocialPostDrawer
          drawerState={drawerState}
          copy={labels}
          uploadLabel={uploadLabel}
          onClose={() => setDrawerState(null)}
          onSaved={(message) => setNotice({ tone: 'success', message })}
        />
      ) : null}

      {pendingDelete ? (
        <SocialPostDeleteDialog
          post={pendingDelete}
          copy={labels}
          isPending={isDeleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </section>
  );
}

function SocialPostDrawer({
  drawerState,
  copy,
  uploadLabel,
  onClose,
  onSaved
}: {
  drawerState: DrawerState;
  copy: SocialPostCenterCopy;
  uploadLabel: string;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const router = useRouter();
  const isCreate = drawerState.mode === 'create';
  const post = drawerState.mode === 'edit' ? drawerState.post : null;
  const [formError, setFormError] = useState('');
  const [isSaving, startSaveTransition] = useTransition();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFormError('');

    startSaveTransition(async () => {
      try {
        if (post) {
          await updateSocialPostFromForm(post.id, formData);
        } else {
          await createSocialPostFromForm(formData);
        }

        router.refresh();
        onSaved(isCreate ? copy.createSuccess : copy.updateSuccess);
        onClose();
      } catch {
        setFormError(copy.saveError);
      }
    });
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-slate-900/20"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="social-post-drawer-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]"
      >
        <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
          <h3 id="social-post-drawer-title" className="text-base font-bold text-admin-text-primary">
            {isCreate ? copy.formTitle : copy.editTitle}
          </h3>
          <button
            type="button"
            aria-label={copy.cancel}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-admin-text-muted transition hover:bg-white hover:text-admin-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {formError ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {formError}
              </p>
            ) : null}
            <div>
              <label
                htmlFor="social-post-platform"
                className="mb-1.5 block text-xs font-semibold text-admin-text-secondary"
              >
                {copy.platform}
              </label>
              <select
                id="social-post-platform"
                name="platform"
                defaultValue={post?.platform ?? socialPlatforms[0].key}
                className={inputClass}
              >
                {socialPlatforms.map((platform) => (
                  <option key={platform.key} value={platform.key}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="social-post-target-url"
                className="mb-1.5 block text-xs font-semibold text-admin-text-secondary"
              >
                {copy.targetUrl}
              </label>
              <input
                id="social-post-target-url"
                name="targetUrl"
                type="url"
                defaultValue={post?.targetUrl ?? ''}
                placeholder="https://..."
                required
                className={inputClass}
              />
            </div>
            <AdminImageUploadInput
              name="imageUrl"
              label={copy.imageUrl}
              uploadLabel={uploadLabel}
              defaultValue={post?.imageUrl ?? ''}
              placeholder="https://..."
              scope="social"
              allowManualEntry
              showPreview
            />
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-admin-border bg-admin-elevated px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-lg border border-admin-border bg-white px-3 text-xs font-semibold text-admin-text-secondary transition hover:bg-admin-elevated"
            >
              {copy.cancel}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-9 items-center rounded-lg bg-admin-accent px-3 text-xs font-semibold text-white transition hover:bg-admin-accent-hover disabled:opacity-60"
            >
              {copy.save}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

function SocialPostDeleteDialog({
  post,
  copy,
  isPending,
  onCancel,
  onConfirm
}: {
  post: SocialPostItem;
  copy: SocialPostCenterCopy;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onCancel]);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="social-post-delete-title"
      aria-describedby="social-post-delete-description"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 py-6"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-admin-border bg-white text-left shadow-2xl ring-1 ring-black/5">
        <div className="flex gap-3 border-b border-admin-border bg-admin-elevated px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3
              id="social-post-delete-title"
              className="text-base font-bold text-admin-text-primary"
            >
              {copy.deleteConfirmTitle}
            </h3>
            <p
              id="social-post-delete-description"
              className="mt-1 text-xs text-admin-text-muted"
            >
              {copy.deleteConfirmDescription}
            </p>
          </div>
        </div>
        <div className="px-5 py-4 text-sm text-admin-text-secondary">
          {getSocialPlatformLabel(post.platform)} · {post.targetUrl}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-admin-border bg-admin-elevated px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center rounded-lg border border-admin-border bg-white px-3 text-xs font-semibold text-admin-text-secondary transition hover:bg-admin-elevated"
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex h-9 items-center rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {copy.confirmDelete}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/unit/admin-social-post-center.test.tsx`
Expected: PASS(4 个用例全过)。

- [ ] **Step 5: Commit(先征得用户确认)**

```bash
git add tests/unit/admin-social-post-center.test.tsx src/components/admin/social-post-center.tsx
git commit -m "feat(admin): add SocialPostCenter workbench component"
```

---

### Task 3: 接入页面并移除旧组件

**Files:**
- Modify: `src/app/admin/(protected)/social-posts/page.tsx`
- Delete: `src/components/admin/social-post-form.tsx`

- [ ] **Step 1: 确认旧组件没有其他引用**

Run: `grep -rn "social-post-form\|SocialPostForm" src tests`
Expected: 仅 `src/components/admin/social-post-form.tsx` 自身和 `src/app/admin/(protected)/social-posts/page.tsx`。若出现其他引用,先改为引用 `SocialPostCenter` 再继续。

- [ ] **Step 2: 改写 page.tsx**

将 `src/app/admin/(protected)/social-posts/page.tsx` 整个替换为:

```tsx
import React from 'react';

import { SocialPostCenter } from '@/components/admin/social-post-center';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminSocialPostsPage() {
  const [posts, { Admin }] = await Promise.all([
    db.socialPost.findMany({
      orderBy: { createdAt: 'asc' }
    }),
    getAdminDictionary()
  ]);

  return (
    <section className="animate-fade-in-up">
      <SocialPostCenter posts={posts} copy={Admin.socialPosts} />
    </section>
  );
}
```

- [ ] **Step 3: 删除旧组件文件**

```bash
rm src/components/admin/social-post-form.tsx
```

- [ ] **Step 4: 全量验证**

Run: `npm test && npm run lint`
Expected: 测试全过;lint 无错误无警告(`--max-warnings=0`)。

注意:`tests/integration/admin-pages.test.ts` 等集成测试可能断言旧页面文案(如「新建社媒卡片」「卡片列表」)。若有失败,把断言更新为新文案:标题「社媒卡片」仍在;「新建卡片」按钮文案仍在;「卡片列表」/`listDescription` 已移除,改为断言表格列头「平台」「封面图」「跳转 URL」。

- [ ] **Step 5: 手动验证(开发服务器)**

```bash
npm run dev
```

打开 `/admin/social-posts`,验证:新建卡片(抽屉)→ 列表出现、notice 提示;编辑某张卡片改 URL → 保存后刷新生效;删除 → 确认模态 → 列表移除;Esc / 点遮罩可关闭抽屉与模态。

- [ ] **Step 6: Commit(先征得用户确认)**

```bash
git add -A src/app/admin/\(protected\)/social-posts src/components/admin tests
git commit -m "feat(admin): replace social post form with SocialPostCenter workbench"
```

---

## 自审记录

- Spec 覆盖:工具栏/只读表格/抽屉/删除模态/notice 条/i18n/沿用 server actions/删除旧组件 — 均有对应 Task。spec 中「不做固定视口高度」已在组件实现中体现(无 `h-[calc(100vh-104px)]`)。
- 占位符:无 TBD/TODO;所有代码步骤均含完整代码。
- 类型一致:`SocialPostCenterCopy` 的 key 与 Task 1 新增的 i18n key 一一对应(`edit, cancel, editTitle, deleteConfirmTitle, deleteConfirmDescription, confirmDelete, createSuccess, updateSuccess, deleteSuccess, saveError, emptyTitle, emptyDescription` + 复用既有 `title, formTitle, platform, imageUrl, targetUrl, create, save, delete`);`DrawerState`/`Notice`/`handleDeleteConfirm` 等命名前后一致;复用 `getSocialPlatformLabel`(已存在于 `social-platforms.ts`)。
