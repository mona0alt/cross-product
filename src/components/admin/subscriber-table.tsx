'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, Plus, Search } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { AdminTableShell } from './admin-table-shell';

export type SubscriberRow = {
  id: string;
  email: string;
  status: string;
  createdAt: Date | string;
};

const PAGE_SIZE = 8;

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function SubscriberTable({
  subscribers,
  framed = true
}: {
  subscribers: SubscriberRow[];
  framed?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [subscriberRows, setSubscriberRows] = useState(() => subscribers);
  const [newEmail, setNewEmail] = useState('');
  const [addMessage, setAddMessage] = useState('');
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

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setPage(1);
  }

  function handleAddSubscriber(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAddMessage('请输入有效的邮箱地址。');
      return;
    }

    if (subscriberRows.some((subscriber) => subscriber.email.toLowerCase() === email)) {
      setAddMessage('该邮箱已在订阅者列表中。');
      return;
    }

    setSubscriberRows((currentRows) => [
      {
        id: `manual-${Date.now()}`,
        email,
        status: 'active',
        createdAt: new Date()
      },
      ...currentRows
    ]);
    setNewEmail('');
    setQuery('');
    setPage(1);
    setAddMessage('订阅者已添加到当前列表。');
  }

  const searchToolbar = (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="搜索邮箱..."
        aria-label="搜索订阅邮箱"
        className="w-full rounded-xl border border-admin-border bg-white px-4 py-2 pl-9 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20 md:w-64"
      />
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-text-muted"
        aria-hidden="true"
      />
    </div>
  );

  const content = (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-5">
      {!framed ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-base font-semibold text-admin-text-primary">
              订阅者列表
            </h4>
            <p className="mt-1 text-xs leading-5 text-admin-text-secondary">
              列表展示订阅者资料，每页 {PAGE_SIZE} 位，共 {subscriberRows.length} 位订阅者。
            </p>
          </div>
          {searchToolbar}
        </div>
      ) : null}

      <form
        onSubmit={handleAddSubscriber}
        className="rounded-2xl border border-admin-border bg-admin-elevated px-4 py-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <label
              htmlFor="manual-subscriber-email"
              className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
            >
              手动添加订阅者
            </label>
            <p className="mt-1 text-xs leading-5 text-admin-text-secondary">
              输入邮箱后会以活跃状态加入当前订阅者列表。
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              id="manual-subscriber-email"
              type="email"
              value={newEmail}
              onChange={(event) => {
                setNewEmail(event.target.value);
                setAddMessage('');
              }}
              placeholder="输入订阅者邮箱"
              className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20 sm:w-72"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-admin-text-primary px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              新增订阅者
            </button>
          </div>
        </div>
        {addMessage ? (
          <p className="mt-3 text-xs leading-5 text-admin-text-secondary">
            {addMessage}
          </p>
        ) : null}
      </form>

      <div
        data-testid="subscriber-list-card"
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-admin-border bg-white"
      >
        <div className="hidden shrink-0 grid-cols-[minmax(240px,1.4fr)_120px_180px_160px_120px] border-b border-admin-border bg-admin-elevated px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:grid">
          <span>邮箱</span>
          <span>状态</span>
          <span>订阅时间</span>
          <span>触达偏好</span>
          <span className="text-right">操作</span>
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-admin-border overflow-y-auto [scrollbar-gutter:stable]">
          {visibleSubscribers.map((subscriber) => (
            <li
              key={subscriber.id}
              className="grid min-h-[68px] gap-3 px-4 py-3.5 transition-colors hover:bg-admin-elevated lg:grid-cols-[minmax(240px,1.4fr)_120px_180px_160px_120px] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-admin-elevated text-[12px] font-semibold text-admin-text-muted">
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

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
                  状态
                </p>
                <StatusBadge
                  label={subscriber.status === 'active' ? '活跃' : '已停用'}
                  tone={subscriber.status === 'active' ? 'green' : 'slate'}
                />
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
                  订阅时间
                </p>
                <p className="text-xs text-admin-text-secondary">
                  {formatDate(subscriber.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
                  触达偏好
                </p>
                <p className="text-xs text-admin-text-secondary">
                  新品 / 简报
                </p>
              </div>

              <div className="flex justify-start lg:justify-end">
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-admin-border px-3 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-white"
                  aria-label={`查看订阅者 ${subscriber.email}`}
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  查看
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {visibleSubscribers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border bg-admin-elevated px-6 py-10 text-center text-sm text-admin-text-secondary">
          没有匹配的订阅者。
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-admin-border pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-admin-text-secondary">
          每页 {PAGE_SIZE} 位 · 当前显示 {visibleSubscribers.length} 位 · 第 {currentPage} / {totalPages} 页
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="上一页"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-admin-border px-4 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            上一页
          </button>
          <button
            type="button"
            aria-label="下一页"
            disabled={currentPage === totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-admin-border px-4 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated disabled:cursor-not-allowed disabled:opacity-45"
          >
            下一页
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!framed) {
    return content;
  }

  return (
    <AdminTableShell
      title="订阅者列表"
      description={`列表展示订阅者资料，每页 ${PAGE_SIZE} 位，共 ${subscribers.length} 位订阅者。`}
      toolbar={searchToolbar}
    >
      {content}
    </AdminTableShell>
  );
}
