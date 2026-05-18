'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search, Trash2, X } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { AdminTableShell } from './admin-table-shell';

export type SubscriberRow = {
  id: string;
  email: string;
  status: string;
  createdAt: Date | string;
};

const PAGE_SIZE = 8;
const SUBSCRIBER_TABLE_GRID_COLUMNS =
  'grid-cols-[minmax(176px,0.82fr)_minmax(96px,0.32fr)_minmax(136px,0.44fr)_minmax(124px,0.4fr)_64px]';
const SUBSCRIBER_TABLE_GRID_COLUMNS_LG =
  'lg:grid-cols-[minmax(176px,0.82fr)_minmax(96px,0.32fr)_minmax(136px,0.44fr)_minmax(124px,0.4fr)_64px]';

export type SubscriberTableCopy = {
  subscriberList: string;
  searchPlaceholder: string;
  searchLabel: string;
  addSubscriber: string;
  openAddDialog: string;
  addDescription: string;
  closeAddDialog: string;
  emailLabel: string;
  emailPlaceholder: string;
  cancel: string;
  saving: string;
  saveSubscriber: string;
  columns: {
    email: string;
    status: string;
    createdAt: string;
    preference: string;
    actions: string;
  };
  active: string;
  inactive: string;
  preferenceValue: string;
  deleteLabel: string;
  deleting: string;
  delete: string;
  empty: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  invalidEmail: string;
  duplicateEmail: string;
  saveError: string;
};

const defaultSubscriberTableCopy: SubscriberTableCopy = {
  subscriberList: '订阅者列表',
  searchPlaceholder: '搜索邮箱...',
  searchLabel: '搜索订阅邮箱',
  addSubscriber: '新增订阅者',
  openAddDialog: '打开新增订阅者弹窗',
  addDescription: '输入邮箱后会以活跃状态加入当前订阅者列表。',
  closeAddDialog: '关闭新增订阅者弹窗',
  emailLabel: '订阅邮箱',
  emailPlaceholder: '输入订阅者邮箱',
  cancel: '取消',
  saving: '保存中...',
  saveSubscriber: '保存订阅者',
  columns: {
    email: '邮箱',
    status: '状态',
    createdAt: '订阅时间',
    preference: '触达偏好',
    actions: '操作'
  },
  active: '活跃',
  inactive: '已停用',
  preferenceValue: '新品 / 简报',
  deleteLabel: '删除订阅者 {email}',
  deleting: '删除中',
  delete: '删除',
  empty: '没有匹配的订阅者。',
  pagination: '每页 {pageSize} 位 · 当前显示 {visible} 位 · 第 {page} / {totalPages} 页',
  previousPage: '上一页',
  nextPage: '下一页',
  invalidEmail: '请输入有效的邮箱地址。',
  duplicateEmail: '该邮箱已在订阅者列表中。',
  saveError: '订阅者保存失败，请稍后重试。'
};

function formatCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function SubscriberTable({
  subscribers,
  framed = false,
  copy = defaultSubscriberTableCopy
}: {
  subscribers: SubscriberRow[];
  framed?: boolean;
  copy?: SubscriberTableCopy;
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [subscriberRows, setSubscriberRows] = useState(() => subscribers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [addMessage, setAddMessage] = useState('');
  const [pendingSubscriberId, setPendingSubscriberId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSubscribers = useMemo(
    () =>
      normalizedQuery
        ? subscriberRows.filter((subscriber) =>
            subscriber.email.toLowerCase().includes(normalizedQuery)
          )
        : subscriberRows,
    [normalizedQuery, subscriberRows]
  );
  const totalPages = Math.max(1, Math.ceil(filteredSubscribers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function openAddDialog() {
    setNewEmail('');
    setAddMessage('');
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
    setNewEmail('');
    setAddMessage('');
  }

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setPage(1);
  }

  async function handleAddSubscriber(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAddMessage(copy.invalidEmail);
      return;
    }

    if (subscriberRows.some((subscriber) => subscriber.email.toLowerCase() === email)) {
      setAddMessage(copy.duplicateEmail);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('CREATE_SUBSCRIBER_FAILED');
      }

      const payload = (await response.json()) as {
        subscriber: SubscriberRow;
      };

      setSubscriberRows((currentRows) => [payload.subscriber, ...currentRows]);
      setNewEmail('');
      setQuery('');
      setPage(1);
      setAddMessage('');
      setIsAddDialogOpen(false);
    } catch {
      setAddMessage(copy.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSubscriber(subscriberId: string) {
    setPendingSubscriberId(subscriberId);

    try {
      const response = await fetch(`/api/admin/subscribers/${subscriberId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('DELETE_SUBSCRIBER_FAILED');
      }

      setSubscriberRows((currentRows) =>
        currentRows.filter((subscriber) => subscriber.id !== subscriberId)
      );
    } finally {
      setPendingSubscriberId('');
    }
  }

  const searchToolbar = (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder={copy.searchPlaceholder}
        aria-label={copy.searchLabel}
        className="h-9 w-full rounded-lg border border-admin-border bg-white px-3 pl-9 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20 md:w-60"
      />
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-text-muted"
        aria-hidden="true"
      />
    </div>
  );

  const addSubscriberButton = (
    <button
      type="button"
      onClick={openAddDialog}
      aria-label={copy.openAddDialog}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-admin-text-primary px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      {copy.addSubscriber}
    </button>
  );

  const tableToolbar = (
    <>
      {searchToolbar}
      {addSubscriberButton}
    </>
  );

  const addSubscriberDialog = isAddDialogOpen ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6"
      role="presentation"
    >
      <form
        onSubmit={handleAddSubscriber}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-subscriber-title"
        className="w-full max-w-md rounded-2xl border border-admin-border bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-admin-border px-5 py-4">
          <div>
            <h4
              id="add-subscriber-title"
              className="text-base font-semibold text-admin-text-primary"
            >
              {copy.addSubscriber}
            </h4>
            <p className="mt-1 text-xs leading-5 text-admin-text-secondary">
              {copy.addDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={closeAddDialog}
            aria-label={copy.closeAddDialog}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-admin-border text-admin-text-secondary transition-colors hover:bg-admin-elevated"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3 px-5 py-5">
          <label
            htmlFor="add-subscriber-email"
            className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
          >
            {copy.emailLabel}
          </label>
          <input
            id="add-subscriber-email"
            type="email"
            value={newEmail}
            onChange={(event) => {
              setNewEmail(event.target.value);
              setAddMessage('');
            }}
            placeholder={copy.emailPlaceholder}
            className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          />
          {addMessage ? (
            <p className="text-xs leading-5 text-admin-text-secondary">
              {addMessage}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-admin-border px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeAddDialog}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-admin-border px-5 py-2.5 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated"
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-admin-text-primary px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isSaving ? copy.saving : copy.saveSubscriber}
          </button>
        </div>
      </form>
    </div>
  ) : null;

  const content = (
    <div className={`flex h-full min-h-0 flex-col ${framed ? 'p-4' : 'gap-4 p-4'}`}>
      {!framed ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-base font-semibold text-admin-text-primary">
              {copy.subscriberList}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {tableToolbar}
          </div>
        </div>
      ) : null}

      <div
        data-testid="subscriber-list-card"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div
          className={`hidden shrink-0 ${SUBSCRIBER_TABLE_GRID_COLUMNS} items-center gap-3 border border-admin-border bg-admin-elevated px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:grid`}
        >
          <span>{copy.columns.email}</span>
          <span className="text-center">{copy.columns.status}</span>
          <span>{copy.columns.createdAt}</span>
          <span>{copy.columns.preference}</span>
          <span className="text-center">{copy.columns.actions}</span>
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-admin-border overflow-y-auto border-x border-admin-border bg-white">
          {visibleSubscribers.map((subscriber) => (
            <li
              key={subscriber.id}
              className={`grid min-h-[54px] gap-3 px-3 py-3 transition-colors hover:bg-admin-elevated ${SUBSCRIBER_TABLE_GRID_COLUMNS_LG} lg:items-center`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-admin-elevated text-[11px] font-semibold text-admin-text-muted">
                  {subscriber.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-admin-text-primary">
                    {subscriber.email}
                  </p>
                  <p className="mt-1 text-[11px] text-admin-text-muted">
                    ID {subscriber.id}
                  </p>
                </div>
              </div>

              <div className="lg:flex lg:justify-center">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
                  {copy.columns.status}
                </p>
                <StatusBadge
                  label={subscriber.status === 'active' ? copy.active : copy.inactive}
                  tone={subscriber.status === 'active' ? 'green' : 'slate'}
                />
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
                  {copy.columns.createdAt}
                </p>
                <p className="text-xs text-admin-text-secondary">
                  {formatDate(subscriber.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
                  {copy.columns.preference}
                </p>
                <p className="text-xs text-admin-text-secondary">
                  {copy.preferenceValue}
                </p>
              </div>

              <div className="flex justify-start lg:justify-center">
                <button
                  type="button"
                  onClick={() => handleDeleteSubscriber(subscriber.id)}
                  disabled={pendingSubscriberId === subscriber.id}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-admin-text-muted transition-colors hover:bg-red-50 hover:text-admin-danger disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent"
                  aria-label={formatCopy(copy.deleteLabel, { email: subscriber.email })}
                  title={pendingSubscriberId === subscriber.id ? copy.deleting : copy.delete}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {visibleSubscribers.length === 0 ? (
          <div className="m-4 rounded-2xl border border-dashed border-admin-border bg-admin-elevated px-6 py-10 text-center text-sm text-admin-text-secondary">
            {copy.empty}
          </div>
        ) : null}

        <div
          data-testid="subscriber-list-pagination"
          className="flex flex-col gap-3 rounded-b-2xl border border-admin-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={copy.previousPage}
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-admin-border px-3 text-xs font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.previousPage}
            </button>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-admin-text-primary text-xs font-semibold text-white">
              {currentPage}
            </span>
            <button
              type="button"
              aria-label={copy.nextPage}
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-admin-border px-3 text-xs font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated disabled:cursor-not-allowed disabled:opacity-45"
            >
              {copy.nextPage}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="text-xs text-admin-text-secondary">
            {formatCopy(copy.pagination, {
              pageSize: PAGE_SIZE,
              visible: visibleSubscribers.length,
              page: currentPage,
              totalPages
            })}
          </p>
        </div>
      </div>
    </div>
  );

  if (!framed) {
    return (
      <>
        {content}
        {addSubscriberDialog}
      </>
    );
  }

  return (
    <>
      <AdminTableShell
        title={copy.subscriberList}
        kicker={null}
        compact
        fullHeight
        toolbar={tableToolbar}
      >
        {content}
      </AdminTableShell>
      {addSubscriberDialog}
    </>
  );
}
