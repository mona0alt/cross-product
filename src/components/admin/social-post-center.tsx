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
  imageUrl: '封面图',
  targetUrl: '跳转 URL',
  create: '新建卡片',
  edit: '编辑',
  save: '保存',
  cancel: '取消',
  delete: '删除',
  deleteConfirmTitle: '删除社媒卡片',
  deleteConfirmDescription: '删除后前台将不再展示该卡片，此操作不可撤销。',
  confirmDelete: '确认删除',
  createSuccess: '社媒卡片已创建。',
  updateSuccess: '社媒卡片已保存。',
  deleteSuccess: '社媒卡片已删除。',
  saveError: '保存失败，请检查填写内容后重试。',
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
          role={notice.tone === 'error' ? 'alert' : 'status'}
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
                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.imageUrl}
                        alt={labels.title}
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
              <p
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
              >
                {formError}
              </p>
            ) : null}
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
              scope="social"
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
          {post.targetUrl}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-admin-border bg-admin-elevated px-5 py-4">
          <button
            type="button"
            autoFocus
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
