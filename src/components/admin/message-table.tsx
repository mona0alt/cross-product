'use client';

import React from 'react';
import { Mail, MailOpen, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

type MessageRow = {
  id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
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
  const pendingCount = messages.filter((m) => m.status === '待处理').length;
  const resolvedCount = messages.filter((m) => m.status === '已处理').length;

  return (
    <section className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* Message list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-admin-text-primary">
            留言清单
          </h3>
          <span className="text-xs text-admin-text-muted">
            共 {messages.length} 条
          </span>
        </div>

        <div className="grid gap-3">
          {messages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              index={index}
            />
          ))}
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
      className={`flex items-center justify-between rounded-xl border border-admin-border bg-admin-surface px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-l-[3px] ${accent}`}
    >
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-admin-text-muted">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-admin-text-primary">
          {value}
        </p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-admin-elevated text-admin-text-muted">
        {icon}
      </div>
    </div>
  );
}

function MessageCard({
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
    <article
      className="group relative flex items-start gap-4 overflow-hidden rounded-xl border border-admin-border bg-admin-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      style={{
        animation: `fadeSlideIn 0.4s ease-out both`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Left status bar */}
      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${accentColor}`}
      />

      {/* Avatar */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white shadow-inner ${getAvatarColor(message.name)}`}
      >
        {getInitials(message.name)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-admin-text-primary">
            {message.name}
          </span>
          <span className="text-xs text-admin-text-muted">
            {message.email}
          </span>
        </div>

        <p className="mt-1.5 text-[13px] leading-relaxed text-admin-text-secondary line-clamp-2">
          {message.content}
        </p>

        <div className="mt-2.5 flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-admin-text-muted">
            <Clock className="h-3 w-3" />
            {formatDate(message.createdAt)}
          </span>

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

          <span className="ml-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {isPending ? (
              <Mail className="h-4 w-4 text-amber-500" />
            ) : (
              <MailOpen className="h-4 w-4 text-emerald-600" />
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
