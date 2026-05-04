import React from 'react';
import { AdminTableShell } from './admin-table-shell';

type SubscriberNotificationData = {
  total: string;
  openRate: string;
  failed: string;
  campaigns: ReadonlyArray<{
    title: string;
    status: string;
    detail: string;
  }>;
};

export function SubscriberNotificationBoard({
  data
}: {
  data: SubscriberNotificationData;
}) {
  return (
    <AdminTableShell
      title="自动化发送规则"
      description="配置邮件触发条件与发送频率，确保推送策略精准高效。"
    >
      <div className="grid gap-5 p-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
            触发条件
          </label>
          <select className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20">
            <option>产品上新时触发</option>
            <option>库存补货时触发</option>
            <option>手动触发</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
            发送频率上限
          </label>
          <select className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20">
            <option>最多每天 1 封</option>
            <option>最多每周 1 封</option>
            <option>无限制</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
            邮件模板预览
          </label>
          <textarea
            className="min-h-[120px] w-full resize-none rounded-xl border border-admin-border bg-white px-4 py-3 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
            defaultValue={data.campaigns.map((campaign) => `${campaign.title}：${campaign.detail}`).join('\n')}
          />
        </div>

        <div className="flex justify-end gap-3 md:col-span-2">
          <button className="rounded-xl border border-admin-border px-5 py-2.5 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated">
            取消
          </button>
          <button className="rounded-xl bg-admin-text-primary px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black">
            保存规则
          </button>
        </div>
      </div>
    </AdminTableShell>
  );
}
