import React from 'react';

import { StatusBadge } from '@/components/admin/status-badge';

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
      <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Crawler
        </p>
        <h2 className="mt-3 text-3xl font-semibold">抓取任务看板</h2>
        <p className="mt-3 text-lg text-white">{data.headline}</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          {data.summary}
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Sources
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              来源站点
            </h3>
          </div>
          <StatusBadge label="入审核池" tone="blue" />
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {data.sourceSites.map((site) => (
            <div key={site.label} className="rounded-3xl bg-slate-100 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{site.label}</p>
                <StatusBadge
                  label={site.status}
                  tone={site.status === '正常' ? 'green' : 'amber'}
                />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {site.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
