import React from 'react';
import { StatusBadge } from './status-badge';

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
    <div className="overflow-hidden rounded-lg border border-admin-border">
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
              <td className="px-4 py-3 text-admin-text-primary font-medium">{message.name}</td>
              <td className="px-4 py-3 text-admin-text-secondary">{message.email}</td>
              <td className="px-4 py-3 text-admin-text-secondary max-w-[240px] truncate">
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
  );
}
