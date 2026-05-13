'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MailOpen
} from 'lucide-react';

type MessageRow = {
  id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  createdAt: Date | string;
};

const PAGE_SIZE = 5;

function formatDate(date: Date | string) {
  const value = new Date(date);
  const now = new Date();
  const diff = now.getTime() - value.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return value.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-slate-800',
    'bg-emerald-700',
    'bg-amber-700',
    'bg-sky-700',
    'bg-rose-700',
    'bg-violet-700',
    'bg-teal-700',
    'bg-orange-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function MessageTable({ messages }: { messages: MessageRow[] }) {
  const [page, setPage] = useState(1);
  const pendingCount = messages.filter((m) => m.status === '待处理').length;
  const resolvedCount = messages.filter((m) => m.status === '已处理').length;
  const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleMessages = useMemo(
    () =>
      messages.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [currentPage, messages]
  );

  return (
    <section
      data-testid="support-center-layout"
      className="flex min-h-[calc(100vh-104px)] flex-col"
    >
      <div
        data-testid="support-center-panel"
        className="flex min-h-[calc(100vh-104px)] flex-1 flex-col gap-4 rounded-[20px] border border-admin-border bg-admin-surface p-4 shadow-[0_16px_48px_rgba(15,23,42,0.05)]"
      >
        <div>
          <div>
            <p className="admin-kicker">Inbox</p>
            <h3 className="mt-1 text-lg font-semibold text-admin-text-primary">
              留言清单
            </h3>
            <p className="mt-1 text-xs leading-5 text-admin-text-secondary">
              列表分页展示客户留言，每页 {PAGE_SIZE} 条。
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatCard
              label="总留言"
              value={messages.length}
              icon={<Mail className="h-4 w-4" />}
              accent="border-l-slate-800"
            />
            <StatCard
              label="待处理"
              value={pendingCount}
              icon={<AlertCircle className="h-4 w-4" />}
              accent="border-l-amber-500"
            />
            <StatCard
              label="已处理"
              value={resolvedCount}
              icon={<CheckCircle2 className="h-4 w-4" />}
              accent="border-l-emerald-600"
            />
          </div>
        </div>

        <div
          data-testid="message-list-scroll"
          className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-admin-border bg-white"
        >
          <div className="hidden grid-cols-[minmax(220px,0.9fr)_minmax(300px,1.5fr)_140px_130px] border-b border-admin-border bg-admin-elevated px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:grid">
            <span>客户</span>
            <span>留言内容</span>
            <span>时间</span>
            <span>状态</span>
          </div>
          <ul className="divide-y divide-admin-border">
            {visibleMessages.map((message, index) => (
              <MessageListRow
                key={message.id}
                message={message}
                index={index}
              />
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-admin-border pt-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-admin-text-secondary">
            每页 {PAGE_SIZE} 条 · 当前显示 {visibleMessages.length} 条 · 第 {currentPage} / {totalPages} 页
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
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-admin-border bg-admin-surface px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-l-[3px] ${accent}`}
    >
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-admin-text-muted">
          {label}
        </p>
        <p className="mt-1 text-xl font-bold tabular-nums text-admin-text-primary">
          {value}
        </p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-elevated text-admin-text-muted">
        {icon}
      </div>
    </div>
  );
}

function MessageListRow({
  message,
  index,
}: {
  message: MessageRow;
  index: number;
}) {
  const isPending = message.status === '待处理';
  const accentColor = isPending ? 'bg-amber-500' : 'bg-emerald-600';
  const StatusIcon = isPending ? AlertCircle : CheckCircle2;

  return (
    <li
      className="group relative grid gap-3 bg-admin-surface px-4 py-4 transition-colors duration-300 hover:bg-admin-elevated lg:min-h-[88px] lg:grid-cols-[minmax(220px,0.9fr)_minmax(300px,1.5fr)_140px_130px] lg:items-center"
      style={{
        animation: `fadeSlideIn 0.4s ease-out both`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${accentColor}`}
      />

      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white shadow-inner ${getAvatarColor(message.name)}`}
        >
          {getInitials(message.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-admin-text-primary">
            {message.name}
          </p>
          <p className="mt-1 truncate text-xs text-admin-text-muted">
            {message.email}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
          留言内容
        </p>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-admin-text-secondary">
          {message.content}
        </p>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
          时间
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] text-admin-text-muted">
          <Clock className="h-3 w-3" />
          {formatDate(message.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
            状态
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isPending
              ? 'bg-amber-50 text-amber-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <StatusIcon className="h-3 w-3" />
          {message.status}
        </span>
        </div>

        <span className="ml-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {isPending ? (
            <Mail className="h-4 w-4 text-amber-500" />
          ) : (
            <MailOpen className="h-4 w-4 text-emerald-600" />
          )}
        </span>
      </div>
    </li>
  );
}
