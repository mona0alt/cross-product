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
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold text-admin-text-primary">客户支持与消息配置</h2>
          <p className="mt-1 text-[13px] text-admin-text-secondary">
            管理客户查询、回复模版及即时通讯工具集成
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded border border-admin-border bg-white px-4 py-2 text-[13px] text-admin-text-secondary">
            导出记录
          </button>
          <button className="rounded bg-admin-accent px-4 py-2 text-[13px] text-white">
            发起会话
          </button>
        </div>
      </div>

      <div className="col-span-12 space-y-6 lg:col-span-8">
        <AdminTableShell title="待处理收件箱" description="按参考稿渲染消息列表。">
          <div className="overflow-hidden rounded-b-xl">
            <table className="min-w-full divide-y divide-admin-border text-sm">
              <thead className="bg-admin-elevated text-admin-text-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">联系人</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">邮箱</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">消息摘要</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border bg-admin-surface">
                {messages.map((message) => (
                  <tr key={message.id} className="transition-colors hover:bg-admin-elevated">
                    <td className="px-4 py-3 font-medium text-admin-text-primary">{message.name}</td>
                    <td className="px-4 py-3 text-admin-text-secondary">{message.email}</td>
                    <td className="max-w-[260px] px-4 py-3 text-admin-text-secondary truncate">
                      {message.content.slice(0, 60)}
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

        <AdminTableShell title="回复界面" description="保留当前内容摘要，改成参考稿回复面板。">
          <div className="space-y-4 p-4">
            <textarea
              className="min-h-[160px] w-full rounded border border-admin-border bg-white p-3 text-[13px] text-admin-text-primary"
              defaultValue={messages[0] ? `Hi ${messages[0].name},\n\n关于您的询盘，我们将在 24 小时内提供报价。` : ''}
            />
            <div className="flex justify-end gap-3">
              <button className="rounded border border-admin-border px-4 py-2 text-[13px] text-admin-text-secondary">
                保存草稿
              </button>
              <button className="rounded bg-admin-accent px-4 py-2 text-[13px] text-white">
                发送回复
              </button>
            </div>
          </div>
        </AdminTableShell>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <AdminTableShell title="系统活动日志" description="保留静态演示日志区。">
          <div className="grid gap-3 p-4 text-[13px] text-admin-text-secondary">
            <p>管理员 回复了 {messages[0]?.name ?? '新消息'} 的询盘</p>
            <p>系统 触发自动回复模版同步</p>
            <p>系统 连接 WhatsApp API</p>
          </div>
        </AdminTableShell>
      </div>
    </section>
  );
}
