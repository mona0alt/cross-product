'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MailOpen,
  Trash2,
  X
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
type DisplayStatus = 'unread' | 'read';
type MessageFilter = 'all' | 'unread';
type MessageTableCopy = {
  listTitle: string;
  total: string;
  unread: string;
  read: string;
  all: string;
  filterUnread: string;
  viewAllLabel: string;
  filterUnreadLabel: string;
  columns: {
    customer: string;
    content: string;
    time: string;
    status: string;
    actions: string;
  };
  empty: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  openLabel: string;
  deleteLabel: string;
  detailTitle: string;
  closeDetail: string;
  sender: string;
  email: string;
  receivedAt: string;
  messageContent: string;
  deleteCurrent: string;
  justNow: string;
  hoursAgo: string;
  daysAgo: string;
};

const defaultMessageTableCopy: MessageTableCopy = {
  listTitle: '留言清单',
  total: '总留言',
  unread: '未读',
  read: '已读',
  all: '全部',
  filterUnread: '未读',
  viewAllLabel: '查看全部邮件',
  filterUnreadLabel: '筛选未读邮件',
  columns: {
    customer: '客户',
    content: '留言内容',
    time: '时间',
    status: '状态',
    actions: '操作'
  },
  empty: '暂无符合条件的邮件。',
  pagination: '每页 {pageSize} 条 · 当前显示 {visible} 条 · 第 {page} / {totalPages} 页',
  previousPage: '上一页',
  nextPage: '下一页',
  openLabel: '查看邮件详情：{name}',
  deleteLabel: '删除邮件：{name}',
  detailTitle: '邮件详情',
  closeDetail: '关闭邮件详情',
  sender: '发件人',
  email: '邮箱',
  receivedAt: '接收时间',
  messageContent: '邮件内容',
  deleteCurrent: '删除当前邮件',
  justNow: '刚刚',
  hoursAgo: '{count} 小时前',
  daysAgo: '{count} 天前'
};

function formatCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function normalizeMessageStatus(status: string): DisplayStatus {
  return ['new', 'unread', '未读', '待处理'].includes(status) ? 'unread' : 'read';
}

async function requestMarkMessageRead(id: string) {
  await fetch(`/api/admin/messages/${id}/process`, {
    method: 'POST'
  });
}

async function requestDeleteMessage(id: string) {
  const response = await fetch(`/api/admin/messages/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('DELETE_MESSAGE_FAILED');
  }
}

function formatDate(date: Date | string, copy: MessageTableCopy) {
  const value = new Date(date);
  const now = new Date();
  const diff = now.getTime() - value.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return copy.justNow;
  if (hours < 24) return formatCopy(copy.hoursAgo, { count: hours });
  const days = Math.floor(hours / 24);
  if (days < 7) return formatCopy(copy.daysAgo, { count: days });
  return value.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function formatFullDate(date: Date | string) {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
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

export function MessageTable({
  messages,
  initialSelectedMessageId,
  initialFilter = 'all',
  copy = defaultMessageTableCopy,
}: {
  messages: MessageRow[];
  initialSelectedMessageId?: string;
  initialFilter?: MessageFilter;
  copy?: MessageTableCopy;
}) {
  const [page, setPage] = useState(1);
  const [messageList, setMessageList] = useState<MessageRow[]>(messages);
  const [filter, setFilter] = useState<MessageFilter>(initialFilter);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    initialSelectedMessageId ?? null
  );
  const [readMessageIds, setReadMessageIds] = useState<Set<string>>(new Set());
  const getDisplayStatus = useCallback(
    (message: MessageRow) =>
      readMessageIds.has(message.id) ? 'read' : normalizeMessageStatus(message.status),
    [readMessageIds]
  );
  const unreadCount = messageList.filter((message) => getDisplayStatus(message) === 'unread').length;
  const readCount = messageList.length - unreadCount;
  const filteredMessages = useMemo(
    () =>
      filter === 'unread'
        ? messageList.filter((message) => getDisplayStatus(message) === 'unread')
        : messageList,
    [filter, getDisplayStatus, messageList]
  );
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const selectedMessage = messageList.find((message) => message.id === selectedMessageId) ?? null;
  const visibleMessages = useMemo(
    () =>
      filteredMessages.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [currentPage, filteredMessages]
  );
  const changeFilter = (nextFilter: MessageFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };
  const openMessage = (message: MessageRow) => {
    setSelectedMessageId(message.id);

    if (getDisplayStatus(message) === 'unread') {
      setReadMessageIds((ids) => new Set(ids).add(message.id));
      void requestMarkMessageRead(message.id);
    }
  };
  const deleteMessage = async (messageId: string) => {
    await requestDeleteMessage(messageId);
    setMessageList((items) => items.filter((message) => message.id !== messageId));
    setSelectedMessageId((currentId) => (currentId === messageId ? null : currentId));
    setReadMessageIds((ids) => {
      const nextIds = new Set(ids);
      nextIds.delete(messageId);

      return nextIds;
    });
  };

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
            <h3 className="mt-1 text-lg font-semibold text-admin-text-primary">
              {copy.listTitle}
            </h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatCard
              label={copy.total}
              value={messageList.length}
              icon={<Mail className="h-4 w-4" />}
              accent="border-l-slate-800"
            />
            <StatCard
              label={copy.unread}
              value={unreadCount}
              icon={<Mail className="h-4 w-4" />}
              accent="border-l-amber-500"
            />
            <StatCard
              label={copy.read}
              value={readCount}
              icon={<MailOpen className="h-4 w-4" />}
              accent="border-l-emerald-600"
            />
          </div>
        </div>

        <div
          data-testid="message-filter-toolbar"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            aria-label={copy.viewAllLabel}
            aria-pressed={filter === 'all'}
            onClick={() => changeFilter('all')}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-[13px] font-medium transition-colors ${
              filter === 'all'
                ? 'border-admin-text-primary bg-admin-text-primary text-white'
                : 'border-admin-border text-admin-text-secondary hover:bg-admin-elevated'
            }`}
          >
            <MailOpen className="h-4 w-4" aria-hidden="true" />
            {copy.all}
          </button>
          <button
            type="button"
            aria-label={copy.filterUnreadLabel}
            aria-pressed={filter === 'unread'}
            onClick={() => changeFilter('unread')}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-[13px] font-medium transition-colors ${
              filter === 'unread'
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-admin-border text-admin-text-secondary hover:bg-admin-elevated'
            }`}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {copy.filterUnread}
          </button>
        </div>

        <div
          data-testid="message-list-scroll"
          className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-admin-border bg-white"
        >
          <div className="hidden grid-cols-[minmax(220px,0.9fr)_minmax(300px,1.5fr)_140px_130px_72px] border-b border-admin-border bg-admin-elevated px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:grid">
            <span>{copy.columns.customer}</span>
            <span>{copy.columns.content}</span>
            <span>{copy.columns.time}</span>
            <span>{copy.columns.status}</span>
            <span>{copy.columns.actions}</span>
          </div>
          {visibleMessages.length > 0 ? (
            <ul className="divide-y divide-admin-border">
              {visibleMessages.map((message, index) => (
                <MessageListRow
                  key={message.id}
                  message={message}
                  status={getDisplayStatus(message)}
                  index={index}
                  onOpen={() => openMessage(message)}
                  onDelete={() => void deleteMessage(message.id)}
                  copy={copy}
                />
              ))}
            </ul>
          ) : (
            <div className="flex min-h-[180px] items-center justify-center px-4 text-sm text-admin-text-muted">
              {copy.empty}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-admin-border pt-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-admin-text-secondary">
            {formatCopy(copy.pagination, {
              pageSize: PAGE_SIZE,
              visible: visibleMessages.length,
              page: currentPage,
              totalPages
            })}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={copy.previousPage}
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-admin-border px-4 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {copy.previousPage}
            </button>
            <button
              type="button"
              aria-label={copy.nextPage}
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-admin-border px-4 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated disabled:cursor-not-allowed disabled:opacity-45"
            >
              {copy.nextPage}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {selectedMessage ? (
        <MessageDetailDialog
          message={selectedMessage}
          status={getDisplayStatus(selectedMessage)}
          onClose={() => setSelectedMessageId(null)}
          onDelete={() => void deleteMessage(selectedMessage.id)}
          copy={copy}
        />
      ) : null}
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
  status,
  index,
  onOpen,
  onDelete,
  copy,
}: {
  message: MessageRow;
  status: DisplayStatus;
  index: number;
  onOpen: () => void;
  onDelete: () => void;
  copy: MessageTableCopy;
}) {
  const isUnread = status === 'unread';
  const accentColor = isUnread ? 'bg-amber-500' : 'bg-emerald-600';
  const StatusIcon = isUnread ? AlertCircle : CheckCircle2;
  const statusLabel = isUnread ? copy.unread : copy.read;

  return (
    <li
      style={{
        animation: `fadeSlideIn 0.4s ease-out both`,
        animationDelay: `${index * 60}ms`,
      }}
      className="group relative bg-admin-surface transition-colors duration-300 hover:bg-admin-elevated"
    >
      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${accentColor}`}
      />

      <div className="grid gap-3 px-4 py-4 lg:min-h-[88px] lg:grid-cols-[minmax(220px,0.9fr)_minmax(300px,1.5fr)_140px_130px_72px] lg:items-center">
        <button
          type="button"
          aria-label={formatCopy(copy.openLabel, { name: message.name })}
          aria-haspopup="dialog"
          onClick={onOpen}
          className="grid min-w-0 gap-3 text-left lg:col-span-4 lg:grid-cols-[minmax(220px,0.9fr)_minmax(300px,1.5fr)_140px_130px] lg:items-center"
        >
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
              {copy.columns.content}
            </p>
            <p className="line-clamp-2 text-[13px] leading-relaxed text-admin-text-secondary">
              {message.content}
            </p>
          </div>

          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
              {copy.columns.time}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-admin-text-muted">
              <Clock className="h-3 w-3" />
              {formatDate(message.createdAt, copy)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:hidden">
                {copy.columns.status}
              </p>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                isUnread
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <StatusIcon className="h-3 w-3" />
              {statusLabel}
            </span>
            </div>

            <span className="ml-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {isUnread ? (
                <Mail className="h-4 w-4 text-amber-500" />
              ) : (
                <MailOpen className="h-4 w-4 text-emerald-600" />
              )}
            </span>
          </div>
        </button>

        <button
          type="button"
          aria-label={formatCopy(copy.deleteLabel, { name: message.name })}
          onClick={onDelete}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 text-rose-600 transition-colors hover:bg-rose-50 lg:justify-self-end"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function MessageDetailDialog({
  message,
  status,
  onClose,
  onDelete,
  copy,
}: {
  message: MessageRow;
  status: DisplayStatus;
  onClose: () => void;
  onDelete: () => void;
  copy: MessageTableCopy;
}) {
  const statusLabel = status === 'unread' ? copy.unread : copy.read;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-detail-title"
        className="w-full max-w-2xl rounded-2xl border border-admin-border bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-admin-border px-5 py-4">
          <div className="min-w-0">
            <h3 id="message-detail-title" className="mt-1 text-lg font-semibold text-admin-text-primary">
              {copy.detailTitle}
            </h3>
          </div>
          <button
            type="button"
            aria-label={copy.closeDetail}
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-admin-border text-admin-text-muted transition-colors hover:bg-admin-elevated hover:text-admin-text-primary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailField label={copy.sender} value={message.name} />
            <DetailField label={copy.email} value={message.email} />
            <DetailField label={copy.receivedAt} value={formatFullDate(message.createdAt)} />
            <DetailField label={copy.columns.status} value={statusLabel} />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
              {copy.messageContent}
            </p>
            <p className="mt-2 whitespace-pre-wrap rounded-xl border border-admin-border bg-admin-elevated px-4 py-3 text-sm leading-7 text-admin-text-secondary">
              {message.content}
            </p>
          </div>

          <div className="flex justify-end border-t border-admin-border pt-4">
            <button
              type="button"
              aria-label={copy.deleteCurrent}
              onClick={onDelete}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rose-100 px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {copy.deleteCurrent}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-admin-border bg-admin-surface px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-admin-text-primary">
        {value}
      </p>
    </div>
  );
}
