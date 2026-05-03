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
    <section className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['总订阅数', data.total, '前台订阅邮箱统一汇总'],
          ['平均打开率', data.openRate, '按参考稿呈现邮件打开表现'],
          ['退信数量', data.failed, '失败与重发队列概览']
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-xl border border-admin-border bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">
              {label}
            </p>
            <p className="mt-4 text-[30px] font-semibold text-admin-text-primary">{value}</p>
            <p className="mt-3 text-[13px] text-admin-text-secondary">{detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <AdminTableShell
            title="自动化发送规则配置"
            description="严格对齐参考稿中的自动化邮件配置面板。"
          >
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <select className="w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary">
                <option>产品上新时触发</option>
              </select>
              <select className="w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary">
                <option>最多每天 1 封</option>
              </select>
              <textarea
                className="min-h-[120px] w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary md:col-span-2"
                defaultValue={data.campaigns.map((campaign) => `${campaign.title}：${campaign.detail}`).join('\n')}
              />
              <div className="flex justify-end gap-3 md:col-span-2">
                <button className="rounded border border-admin-border px-4 py-2 text-[13px] text-admin-text-secondary">
                  取消
                </button>
                <button className="rounded bg-black px-4 py-2 text-[13px] text-white">
                  保存规则
                </button>
              </div>
            </div>
          </AdminTableShell>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <AdminTableShell title="合规提示" description="保留右侧辅助说明区。">
            <div className="space-y-3 p-6 text-[13px] text-admin-text-secondary">
              <p>请确保自动化邮件策略符合地区性数字通讯合规要求。</p>
              <p>建议将新品推送频率限制在每日 1 封以内，以保护打开率。</p>
            </div>
          </AdminTableShell>
        </div>
      </div>
    </section>
  );
}
