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

function AutomationRulesContent({
  data
}: {
  data: SubscriberNotificationData;
}) {
  return (
    <div className="grid min-h-0 flex-1 gap-5 p-6 lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)]">
      <div className="grid content-start gap-5 md:grid-cols-2 lg:grid-cols-1">
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

        <div className="flex justify-end gap-3 md:col-span-2 lg:col-span-1">
          <button className="min-h-11 rounded-xl border border-admin-border px-5 py-2.5 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated">
            取消
          </button>
          <button className="min-h-11 rounded-xl bg-admin-text-primary px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black">
            保存规则
          </button>
        </div>
      </div>

      <div className="min-h-[460px] rounded-2xl border border-admin-border bg-admin-elevated p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
          当前队列
        </p>
        <div className="mt-3 space-y-3">
          {data.campaigns.map((campaign) => (
            <div
              key={campaign.title}
              className="rounded-xl border border-admin-border bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-admin-text-primary">
                  {campaign.title}
                </p>
                <span className="rounded-md border border-admin-accent/20 bg-admin-accent/10 px-2 py-0.5 text-[10px] font-semibold text-admin-accent">
                  {campaign.status}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-admin-text-secondary">
                {campaign.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SubscriberAutomationRules({
  data
}: {
  data: SubscriberNotificationData;
}) {
  return <AutomationRulesContent data={data} />;
}

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
      <AutomationRulesContent data={data} />
    </AdminTableShell>
  );
}
