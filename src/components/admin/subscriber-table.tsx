import React from 'react';

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
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 bg-slate-900/70 text-sm text-slate-200">
        <thead className="bg-slate-950/70 text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">邮箱</th>
            <th className="px-4 py-3 text-left">状态</th>
            <th className="px-4 py-3 text-left">订阅时间</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id}>
              <td className="px-4 py-3">{subscriber.email}</td>
              <td className="px-4 py-3">{subscriber.status}</td>
              <td className="px-4 py-3">
                {subscriber.createdAt.toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
