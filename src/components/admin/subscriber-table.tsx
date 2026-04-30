import React from 'react';
import { StatusBadge } from './status-badge';

type SubscriberRow = {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
};

export function SubscriberTable({
  subscribers
}: {
  subscribers: SubscriberRow[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-admin-border">
      <table className="min-w-full divide-y divide-admin-border text-sm">
        <thead className="bg-admin-elevated text-admin-text-muted">
          <tr>
            <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">邮箱</th>
            <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">状态</th>
            <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">订阅时间</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border bg-admin-surface">
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id} className="transition-colors hover:bg-admin-elevated">
              <td className="px-4 py-3 text-admin-text-primary">{subscriber.email}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={subscriber.status}
                  tone={subscriber.status === 'active' ? 'green' : 'slate'}
                />
              </td>
              <td className="px-4 py-3 font-mono text-admin-text-secondary">
                {subscriber.createdAt.toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
