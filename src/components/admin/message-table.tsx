import React from 'react';

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
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 bg-slate-900/70 text-sm text-slate-200">
        <thead className="bg-slate-950/70 text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">姓名</th>
            <th className="px-4 py-3 text-left">邮箱</th>
            <th className="px-4 py-3 text-left">内容摘要</th>
            <th className="px-4 py-3 text-left">时间</th>
            <th className="px-4 py-3 text-left">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {messages.map((message) => (
            <tr key={message.id}>
              <td className="px-4 py-3">{message.name}</td>
              <td className="px-4 py-3">{message.email}</td>
              <td className="px-4 py-3">{message.content.slice(0, 60)}</td>
              <td className="px-4 py-3">
                {message.createdAt.toISOString().slice(0, 10)}
              </td>
              <td className="px-4 py-3">{message.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
