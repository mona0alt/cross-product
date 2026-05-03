import React from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminTableShell } from './admin-table-shell';

type CrawlTaskData = {
  headline: string;
  summary: string;
  sourceSites: ReadonlyArray<{
    label: string;
    status: string;
    detail: string;
  }>;
};

export function CrawlTaskBoard({
  data
}: {
  data: CrawlTaskData;
}) {
  return (
    <section className="space-y-6">
      <AdminTableShell
        title="抓取系统配置"
        description="按系统设置页骨架展示抓取入口与任务策略。"
      >
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <input
            className="w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary"
            readOnly
            value="crawler.global.internal"
          />
          <input
            className="w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary"
            readOnly
            value="443"
          />
          <input
            className="w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary md:col-span-2"
            readOnly
            value={data.headline}
          />
          <textarea
            className="min-h-[120px] w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary md:col-span-2"
            defaultValue={data.summary}
          />
        </div>
      </AdminTableShell>

      <AdminTableShell
        title="源站任务配置"
        description="保留现有 source site 信息，改为配置状态块。"
      >
        <div className="grid gap-3 p-6">
          {data.sourceSites.map((site) => (
            <div key={site.label} className="rounded-md border border-admin-border bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-admin-text-primary">{site.label}</span>
                <StatusBadge
                  label={site.status}
                  tone={site.status === '正常' ? 'green' : 'amber'}
                />
              </div>
              <p className="mt-2 text-[13px] text-admin-text-secondary">{site.detail}</p>
            </div>
          ))}
        </div>
      </AdminTableShell>
    </section>
  );
}
