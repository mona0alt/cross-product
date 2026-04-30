import React from 'react';

import { StatusBadge } from '@/components/admin/status-badge';

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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Subscribers
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">
          订阅与通知
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['订阅用户', data.total],
            ['邮件通知打开率', data.openRate],
            ['失败重发', data.failed]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-slate-100 px-5 py-4">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {data.campaigns.map((campaign) => (
          <div
            key={campaign.title}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-slate-950">
                {campaign.title}
              </h3>
              <StatusBadge
                label={campaign.status}
                tone={campaign.status === '待发送' ? 'amber' : 'slate'}
              />
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {campaign.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
