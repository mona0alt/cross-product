import React from 'react';
import { StatusBadge } from './status-badge';
import { AdminTableShell } from './admin-table-shell';

type MessageRow = {
  id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  createdAt: Date;
};

export function MessageTable({ messages }: { messages: MessageRow[] }) {
  return (
    <AdminTableShell
      title="客户沟通与线索概览"
      description="保留姓名、邮箱、摘要和状态，作为后台客服沟通的静态演示页。"
    >
      <div className="overflow-hidden rounded-b-[24px]">
        <table className="min-w-full divide-y divide-admin-border text-sm">
          <thead className="bg-admin-elevated text-admin-text-muted">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">姓名</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">邮箱</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">内容摘要</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">时间</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border bg-admin-surface">
            {messages.map((message) => (
              <tr key={message.id} className="transition-colors hover:bg-admin-elevated">
                <td className="px-4 py-3 font-medium text-admin-text-primary">{message.name}</td>
                <td className="px-4 py-3 text-admin-text-secondary">{message.email}</td>
                <td className="max-w-[240px] px-4 py-3 text-admin-text-secondary truncate">
                  {message.content.slice(0, 60)}
                </td>
                <td className="px-4 py-3 font-mono text-admin-text-secondary">
                  {message.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={message.status}
                    tone={message.status === '已处理' ? 'green' : 'amber'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminTableShell>
  );
}
