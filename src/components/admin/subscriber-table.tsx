import React from 'react';
import { StatusBadge } from './status-badge';
import { AdminTableShell } from './admin-table-shell';

type SubscriberRow = {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function SubscriberTable({
  subscribers
}: {
  subscribers: SubscriberRow[];
}) {
  return (
    <AdminTableShell
      title="订阅者列表"
      description={`共 ${subscribers.length} 位订阅者，实时同步前台订阅数据。`}
      toolbar={
        <div className="relative">
          <input
            type="text"
            placeholder="搜索邮箱..."
            className="w-full rounded-xl border border-admin-border bg-white px-4 py-2 pl-9 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20 md:w-64"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      }
    >
      <div className="overflow-hidden rounded-b-[24px]">
        <table className="min-w-full divide-y divide-admin-border text-sm">
          <thead className="bg-admin-elevated text-admin-text-muted">
            <tr>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider">
                邮箱
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider">
                订阅时间
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border bg-admin-surface">
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="group transition-colors hover:bg-admin-elevated"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-admin-elevated text-[11px] font-semibold text-admin-text-muted transition-all group-hover:bg-white group-hover:shadow-sm">
                      {subscriber.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-admin-text-primary">{subscriber.email}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge
                    label={subscriber.status === 'active' ? '活跃' : '已停用'}
                    tone={subscriber.status === 'active' ? 'green' : 'slate'}
                  />
                </td>
                <td className="px-6 py-3.5 text-admin-text-secondary">
                  {formatDate(subscriber.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminTableShell>
  );
}
